import {
  collection,
  query,
  orderBy,
  limit,
  getDocs,
  Timestamp,
} from 'firebase/firestore';
import { db } from '../config/firebase';
import type { PhotoData } from '../types';

/**
 * Firestore 데이터 조회 서비스
 * 최근 촬영한 인생네컷 데이터를 조회합니다.
 */

// Firestore 컬렉션 이름
const PHOTOS_COLLECTION = 'photos';

/**
 * 최근 촬영한 인생네컷 1~3개 조회
 * @param limitCount 조회할 사진 개수 (기본값: 3)
 * @returns Promise<PhotoData[]>
 */
export const fetchRecentPhotos = async (limitCount = 3): Promise<PhotoData[]> => {
  try {
    // Firestore 쿼리: photos 컬렉션에서 createdAt 기준 내림차순 정렬, 최대 limitCount개 조회
    const photosRef = collection(db, PHOTOS_COLLECTION);
    const q = query(photosRef, orderBy('createdAt', 'desc'), limit(limitCount));

    const querySnapshot = await getDocs(q);

    // 쿼리 결과를 PhotoData 배열로 변환
    const photos: PhotoData[] = querySnapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        imageUrl: data.imageUrl,
        weather: data.weather,
        temperature: data.temperature,
        createdAt: (data.createdAt as Timestamp).toDate(),
        frameType: data.frameType || 'default',
      } as PhotoData;
    });

    return photos;
  } catch (error) {
    console.error('최근 인생네컷 조회 실패:', error);
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
    console.error('Firestore 연결 실패:', error);
    return false;
  }
};
