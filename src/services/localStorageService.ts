import type { PhotoData, WeatherCondition } from "../types";

/**
 * 로컬 저장소 서비스
 * IndexedDB를 사용하여 사진 데이터를 브라우저에 저장합니다.
 */

const DB_NAME = "Weather4CutsDB";
const DB_VERSION = 1;
const STORE_NAME = "photos";

/**
 * IndexedDB 초기화
 */
const initDB = (): Promise<IDBDatabase> => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = () => {
      reject(new Error("IndexedDB를 열 수 없습니다."));
    };

    request.onsuccess = () => {
      resolve(request.result);
    };

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;

      // photos 스토어 생성
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        const objectStore = db.createObjectStore(STORE_NAME, {
          keyPath: "id",
          autoIncrement: true,
        });

        // 인덱스 생성 (createdAt 기준 정렬용)
        objectStore.createIndex("createdAt", "createdAt", { unique: false });
      }
    };
  });
};

/**
 * 최근 촬영한 인생네컷 조회
 * @param limitCount 조회할 사진 개수 (기본값: 3)
 * @returns Promise<PhotoData[]>
 */
export const fetchRecentPhotos = async (
  limitCount = 3
): Promise<PhotoData[]> => {
  try {
    const db = await initDB();
    const transaction = db.transaction([STORE_NAME], "readonly");
    const objectStore = transaction.objectStore(STORE_NAME);
    const index = objectStore.index("createdAt");

    return new Promise((resolve, reject) => {
      const photos: PhotoData[] = [];
      const request = index.openCursor(null, "prev"); // 내림차순

      request.onsuccess = (event) => {
        const cursor = (event.target as IDBRequest<IDBCursorWithValue>).result;

        if (cursor && photos.length < limitCount) {
          const data = cursor.value;
          photos.push({
            id: data.id.toString(),
            imageUrl: data.images[0], // 첫 번째 이미지를 대표 이미지로
            images: data.images,
            weather: data.weather,
            temperature: data.temperature,
            createdAt: new Date(data.createdAt),
            frameType: data.frameType || data.weather,
            caption: data.caption || "",
          });
          cursor.continue();
        } else {
          resolve(photos);
        }
      };

      request.onerror = () => {
        reject(new Error("사진 조회 실패"));
      };
    });
  } catch (error) {
    console.error("최근 인생네컷 조회 실패:", error);
    throw error;
  }
};

/**
 * 인생네컷 저장하기
 * @param images 촬영한 4장의 이미지 (base64 데이터)
 * @param weather 날씨 정보
 * @param temperature 기온
 * @param caption 멘트 (선택사항)
 * @returns Promise<string> 생성된 ID
 */
export const savePhotoData = async (
  images: string[],
  weather: WeatherCondition,
  temperature: number,
  caption: string = ""
): Promise<string> => {
  try {
    if (images.length !== 4) {
      throw new Error("4장의 이미지가 필요합니다.");
    }

    const db = await initDB();
    const transaction = db.transaction([STORE_NAME], "readwrite");
    const objectStore = transaction.objectStore(STORE_NAME);

    const photoData = {
      images, // base64 이미지 배열을 그대로 저장
      weather,
      temperature,
      frameType: weather,
      caption,
      createdAt: Date.now(),
    };

    return new Promise((resolve, reject) => {
      const request = objectStore.add(photoData);

      request.onsuccess = () => {
        resolve(request.result.toString());
      };

      request.onerror = () => {
        reject(new Error("사진 저장 실패"));
      };
    });
  } catch (error) {
    console.error("인생네컷 저장 실패:", error);
    throw error;
  }
};

/**
 * 멘트 수정하기
 * @param photoId 수정할 사진 ID
 * @param caption 새로운 멘트
 * @returns Promise<void>
 */
export const updateCaption = async (
  photoId: string,
  caption: string
): Promise<void> => {
  try {
    const db = await initDB();
    const transaction = db.transaction([STORE_NAME], "readwrite");
    const objectStore = transaction.objectStore(STORE_NAME);

    return new Promise((resolve, reject) => {
      const getRequest = objectStore.get(Number(photoId));

      getRequest.onsuccess = () => {
        const data = getRequest.result;
        if (data) {
          data.caption = caption;
          const updateRequest = objectStore.put(data);

          updateRequest.onsuccess = () => {
            resolve();
          };

          updateRequest.onerror = () => {
            reject(new Error("멘트 수정 실패"));
          };
        } else {
          reject(new Error("사진을 찾을 수 없습니다."));
        }
      };

      getRequest.onerror = () => {
        reject(new Error("사진 조회 실패"));
      };
    });
  } catch (error) {
    console.error("멘트 수정 실패:", error);
    throw error;
  }
};

/**
 * 인생네컷 삭제하기
 * @param photoId 삭제할 사진 ID
 * @returns Promise<void>
 */
export const deletePhotoData = async (photoId: string): Promise<void> => {
  try {
    const db = await initDB();
    const transaction = db.transaction([STORE_NAME], "readwrite");
    const objectStore = transaction.objectStore(STORE_NAME);

    return new Promise((resolve, reject) => {
      const request = objectStore.delete(Number(photoId));

      request.onsuccess = () => {
        resolve();
      };

      request.onerror = () => {
        reject(new Error("사진 삭제 실패"));
      };
    });
  } catch (error) {
    console.error("인생네컷 삭제 실패:", error);
    throw error;
  }
};

/**
 * 로컬 저장소 연결 상태 확인
 * @returns Promise<boolean>
 */
export const checkLocalStorageConnection = async (): Promise<boolean> => {
  try {
    await initDB();
    return true;
  } catch (error) {
    console.error("로컬 저장소 연결 실패:", error);
    return false;
  }
};
