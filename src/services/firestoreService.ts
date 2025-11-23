import {
  collection,
  query,
  orderBy,
  limit,
  getDocs,
  addDoc,
  doc,
  updateDoc,
  deleteDoc,
  Timestamp,
} from "firebase/firestore";
import {
  ref,
  uploadString,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";
import { db, storage } from "../config/firebase";
import type { PhotoData, WeatherCondition } from "../types";

/**
 * Firestore 데이터 조회 서비스
 * 최근 촬영한 인생네컷 데이터를 조회합니다.
 */

// Firestore 컬렉션 이름
const PHOTOS_COLLECTION = "photos";

/**
 * 최근 촬영한 인생네컷 1~3개 조회
 * @param limitCount 조회할 사진 개수 (기본값: 3)
 * @returns Promise<PhotoData[]>
 */
export const fetchRecentPhotos = async (
  limitCount = 3
): Promise<PhotoData[]> => {
  try {
    // Firestore 쿼리: photos 컬렉션에서 createdAt 기준 내림차순 정렬, 최대 limitCount개 조회
    const photosRef = collection(db, PHOTOS_COLLECTION);
    const q = query(photosRef, orderBy("createdAt", "desc"), limit(limitCount));

    const querySnapshot = await getDocs(q);

    // 쿼리 결과를 PhotoData 배열로 변환
    const photos: PhotoData[] = querySnapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        imageUrl: data.imageUrl,
        images: data.images || [],
        weather: data.weather,
        temperature: data.temperature,
        createdAt: (data.createdAt as Timestamp).toDate(),
        frameType: data.frameType || "default",
        caption: data.caption || "",
      } as PhotoData;
    });

    return photos;
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
 * @returns Promise<string> 생성된 문서 ID
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

    // 1. Storage에 각 이미지 업로드
    const timestamp = Date.now();
    const imageUrls: string[] = [];

    for (let i = 0; i < images.length; i++) {
      const imageRef = ref(storage, `photos/${timestamp}_${i + 1}.png`);
      await uploadString(imageRef, images[i], "data_url");
      const downloadUrl = await getDownloadURL(imageRef);
      imageUrls.push(downloadUrl);
    }

    // 2. Firestore에 메타데이터 저장
    const photoData = {
      imageUrl: imageUrls[0], // 대표 이미지 (첫 번째 이미지)
      images: imageUrls,
      weather,
      temperature,
      frameType: weather,
      caption,
      createdAt: Timestamp.now(),
    };

    const docRef = await addDoc(collection(db, PHOTOS_COLLECTION), photoData);

    return docRef.id;
  } catch (error) {
    console.error("인생네컷 저장 실패:", error);
    throw error;
  }
};

/**
 * 멘트 수정하기
 * @param photoId 수정할 사진 문서 ID
 * @param caption 새로운 멘트
 * @returns Promise<void>
 */
export const updateCaption = async (
  photoId: string,
  caption: string
): Promise<void> => {
  try {
    const photoRef = doc(db, PHOTOS_COLLECTION, photoId);
    await updateDoc(photoRef, {
      caption,
    });
  } catch (error) {
    console.error("멘트 수정 실패:", error);
    throw error;
  }
};

/**
 * 인생네컷 삭제하기
 * @param photoId 삭제할 사진 문서 ID
 * @param imageUrls 삭제할 이미지 URL 배열
 * @returns Promise<void>
 */
export const deletePhotoData = async (
  photoId: string,
  imageUrls: string[]
): Promise<void> => {
  try {
    // 1. Storage에서 이미지 삭제
    for (const url of imageUrls) {
      try {
        // URL에서 Storage 참조 생성
        const imageRef = ref(storage, url);
        await deleteObject(imageRef);
      } catch (error) {
        console.warn("이미지 삭제 실패 (이미 삭제되었을 수 있음):", url);
      }
    }

    // 2. Firestore에서 문서 삭제
    const photoRef = doc(db, PHOTOS_COLLECTION, photoId);
    await deleteDoc(photoRef);
  } catch (error) {
    console.error("인생네컷 삭제 실패:", error);
    throw error;
  }
};

/**
 * Firestore 연결 상태 확인
 * @returns Promise<boolean>
 */
export const checkFirestoreConnection = async (): Promise<boolean> => {
  try {
    const photosRef = collection(db, PHOTOS_COLLECTION);
    await getDocs(query(photosRef, limit(1)));
    return true;
  } catch (error) {
    console.error("Firestore 연결 실패:", error);
    return false;
  }
};
