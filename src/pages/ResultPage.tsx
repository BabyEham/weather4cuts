import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { useTranslation } from 'react-i18next';
import { fetchRecentPhotos, updateCaption, deletePhotoData } from '../services/firestoreService';
import type { PhotoData } from '../types';
import { showToast } from '../utils/toastUtil';

/**
 * ResultPage - 촬영한 인생네컷 갤러리
 * 
 * 주요 기능:
 * 1. Firebase Storage와 Firestore에서 촬영한 인생네컷 조회
 * 2. 갤러리 형태로 표시
 * 3. 멘트 수정 기능
 * 4. 사진 삭제 기능
 */
export default function ResultPage() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [photos, setPhotos] = useState<PhotoData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editCaption, setEditCaption] = useState('');

  useEffect(() => {
    loadPhotos();
  }, []);

  /**
   * 사진 목록 조회
   */
  const loadPhotos = async () => {
    try {
      setIsLoading(true);
      const photoList = await fetchRecentPhotos(20); // 최근 20개 조회
      setPhotos(photoList);
    } catch (error) {
      console.error('사진 조회 실패:', error);
      showToast(t('result.loadError'), 'error');
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * 멘트 수정 시작
   */
  const handleEditStart = (photo: PhotoData) => {
    setEditingId(photo.id);
    setEditCaption(photo.caption || '');
  };

  /**
   * 멘트 수정 취소
   */
  const handleEditCancel = () => {
    setEditingId(null);
    setEditCaption('');
  };

  /**
   * 멘트 저장
   */
  const handleSaveCaption = async (photoId: string) => {
    try {
      await updateCaption(photoId, editCaption);
      
      // 로컬 상태 업데이트
      setPhotos(photos.map(photo => 
        photo.id === photoId 
          ? { ...photo, caption: editCaption }
          : photo
      ));
      
      setEditingId(null);
      setEditCaption('');
      showToast(t('result.captionUpdated'), 'success');
    } catch (error) {
      console.error('멘트 수정 실패:', error);
      showToast(t('result.captionUpdateError'), 'error');
    }
  };

  /**
   * 사진 삭제
   */
  const handleDelete = async (photo: PhotoData) => {
    if (!confirm(t('result.deleteConfirm'))) {
      return;
    }

    try {
      await deletePhotoData(photo.id, photo.images);
      
      // 로컬 상태에서 제거
      setPhotos(photos.filter(p => p.id !== photo.id));
      
      showToast(t('result.photoDeleted'), 'success');
    } catch (error) {
      console.error('사진 삭제 실패:', error);
      showToast(t('result.photoDeleteError'), 'error');
    }
  };

  /**
   * 날씨 이모지 반환
   */
  const getWeatherEmoji = (weather: string) => {
    switch (weather) {
      case 'sunny':
        return '☀️';
      case 'cloudy':
        return '☁️';
      case 'rainy':
        return '🌧️';
      case 'snowy':
        return '❄️';
      default:
        return '🌤️';
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-blue-50 to-purple-100 flex items-center justify-center">
        <div className="text-center">
          <div className="loading loading-spinner loading-lg text-primary"></div>
          <p className="mt-4 text-gray-600">{t('result.loading')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-blue-50 to-purple-100 p-6">
      <div className="max-w-6xl mx-auto">
        {/* 헤더 */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">{t('result.title')}</h1>
          <button
            onClick={() => navigate('/')}
            className="px-4 py-2 rounded-full bg-white/50 backdrop-blur-sm hover:bg-white/70 transition-all text-sm font-medium text-gray-700"
          >
            {t('result.home')}
          </button>
        </div>

        {/* 갤러리 */}
        {photos.length === 0 ? (
          <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-xl p-12 text-center">
            <p className="text-gray-400 text-lg mb-4">{t('result.noPhotos')}</p>
            <button
              onClick={() => navigate('/camera')}
              className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-full shadow-lg hover:shadow-xl hover:scale-105 transition-all"
            >
              {t('result.firstPhoto')}
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {photos.map((photo) => (
              <div
                key={photo.id}
                className="bg-white/80 backdrop-blur-md rounded-2xl shadow-xl p-4 hover:shadow-2xl transition-all"
              >
                {/* 4컷 이미지 표시 */}
                <div className="grid grid-cols-2 gap-2 mb-4">
                  {photo.images.map((imageUrl, index) => (
                    <div key={index} className="relative aspect-square">
                      <img
                        src={imageUrl}
                        alt={`photo-${index + 1}`}
                        className="w-full h-full object-cover rounded-lg"
                      />
                    </div>
                  ))}
                </div>

                {/* 정보 */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm text-gray-600">
                    <span>
                      {getWeatherEmoji(photo.weather)} {Math.round(photo.temperature)}°C
                    </span>
                    <span>
                      {new Date(photo.createdAt).toLocaleDateString('ko-KR', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </span>
                  </div>

                  {/* 멘트 편집 */}
                  {editingId === photo.id ? (
                    <div className="space-y-2">
                      <textarea
                        value={editCaption}
                        onChange={(e) => setEditCaption(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                        rows={2}
                        placeholder={t('result.captionPlaceholder')}
                      />
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleSaveCaption(photo.id)}
                          className="flex-1 px-3 py-1.5 bg-blue-500 text-white text-sm rounded-lg hover:bg-blue-600 transition-colors"
                        >
                          {t('result.save')}
                        </button>
                        <button
                          onClick={handleEditCancel}
                          className="flex-1 px-3 py-1.5 bg-gray-300 text-gray-700 text-sm rounded-lg hover:bg-gray-400 transition-colors"
                        >
                          {t('result.cancel')}
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <p className="text-gray-800 text-sm min-h-[40px]">
                        {photo.caption || t('result.captionDefault')}
                      </p>
                    </div>
                  )}

                  {/* 액션 버튼 */}
                  {editingId !== photo.id && (
                    <div className="flex gap-2 pt-2">
                      <button
                        onClick={() => handleEditStart(photo)}
                        className="flex-1 px-3 py-1.5 bg-gradient-to-r from-blue-500 to-purple-600 text-white text-sm rounded-lg hover:shadow-lg transition-all"
                      >
                        {t('result.edit')}
                      </button>
                      <button
                        onClick={() => handleDelete(photo)}
                        className="px-3 py-1.5 bg-red-500 text-white text-sm rounded-lg hover:bg-red-600 transition-colors"
                      >
                        {t('result.delete')}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
