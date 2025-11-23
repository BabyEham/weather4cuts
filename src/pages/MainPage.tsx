import { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router';
import { useTranslation } from 'react-i18next';
import { fetchCurrentWeather, getWeatherEmoji } from '../services/weatherService';
import { fetchRecentPhotos } from '../services/firestoreService';
import type { WeatherData, PhotoData } from '../types';
import { showToast } from '../utils/toastUtil';

/**
 * 메인(Home) 페이지
 *
 * 주요 기능:
 * 1. 현재 날씨 정보 표시 (공공데이터 API)
 * 2. "시작하기" 버튼 → Camera 페이지로 날씨 데이터 전달
 * 3. 최근 촬영한 인생네컷 1~3개 조회 (Firestore Read)
 * 4. 다국어 지원 (한국어 + 영어)
 * 5. 로딩/오류 처리
 */
export default function MainPage() {
  // const navigate = useNavigate();
  const { t, i18n } = useTranslation();

  // 상태 관리
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [recentPhotos, setRecentPhotos] = useState<PhotoData[]>([]);
  const [isWeatherLoading, setIsWeatherLoading] = useState(true);
  const [isPhotosLoading, setIsPhotosLoading] = useState(true);
  const [weatherError, setWeatherError] = useState<string | null>(null);
  const [photosError, setPhotosError] = useState<string | null>(null);

  /**
   * 컴포넌트 마운트 시 날씨 정보와 최근 사진 조회
   */
  useEffect(() => {
    loadWeatherData();
    loadRecentPhotos();
  }, []);

  /**
   * 날씨 정보 조회
   */
  const loadWeatherData = async () => {
    try {
      setIsWeatherLoading(true);
      setWeatherError(null);
      const weatherData = await fetchCurrentWeather();
      setWeather(weatherData);
    } catch (error) {
      console.error('날씨 정보 조회 실패:', error);
      setWeatherError(t('home.error.weatherFetch'));
      showToast(t('home.error.weatherFetch'), 'error');
    } finally {
      setIsWeatherLoading(false);
    }
  };

  /**
   * 최근 사진 조회
   */
  const loadRecentPhotos = async () => {
    try {
      setIsPhotosLoading(true);
      setPhotosError(null);
      const photos = await fetchRecentPhotos(6); // 6개 조회
      setRecentPhotos(photos);
    } catch (error) {
      console.error('최근 사진 조회 실패:', error);
      setPhotosError(t('home.error.photosFetch'));
      // 사진 조회 실패는 치명적이지 않으므로 toast는 표시하지 않음
    } finally {
      setIsPhotosLoading(false);
    }
  };

  /**
   * "시작하기" 버튼 클릭 핸들러 (현재 비활성화 - 팀원 구현 전)
   */
  // const handleStartClick = () => {
  //   if (!weather) {
  //     showToast(t('home.error.weatherFetch'), 'error');
  //     return;
  //   }
  //   navigate('/camera', {
  //     state: {
  //       weather: weather.condition,
  //       temperature: weather.temperature,
  //       location: weather.location,
  //     },
  //   });
  // };

  /**
   * 언어 토글 핸들러
   */
  const toggleLanguage = () => {
    const newLang = i18n.language === 'ko' ? 'en' : 'ko';
    i18n.changeLanguage(newLang);
  };

  // 날씨 상태에 따른 SVG 아이콘 반환
  const getWeatherIcon = (condition: string) => {
    switch (condition) {
      case 'sunny':
        return (
          <svg className="w-10 h-10 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="4" strokeWidth="2"/>
            <path strokeLinecap="round" strokeWidth="2" d="M12 2v2m0 16v2M20 12h2M2 12h2m15.07-7.07l-1.41 1.41M7.34 16.66l-1.41 1.41m12.14 0l-1.41-1.41M7.34 7.34L5.93 5.93"/>
          </svg>
        );
      case 'cloudy':
        return (
          <svg className="w-10 h-10 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-10 7 7 0 00-13.8 2.2A4 4 0 003 15z"/>
          </svg>
        );
      case 'rainy':
        return (
          <svg className="w-10 h-10 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-10 7 7 0 00-13.8 2.2A4 4 0 003 15z"/>
            <path strokeLinecap="round" strokeWidth="2" d="M8 19v3m4-3v3m4-3v3"/>
          </svg>
        );
      case 'snowy':
        return (
          <svg className="w-10 h-10 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 2v20m10-10H2m16.5-6.5L5.5 18.5m13-13L5.5 5.5"/>
          </svg>
        );
      default:
        return (
          <svg className="w-10 h-10 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="5" strokeWidth="2"/>
          </svg>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-blue-50 to-purple-50 flex flex-col relative overflow-hidden">
      {/* 배경 장식 */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute top-40 right-10 w-72 h-72 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-1/2 w-72 h-72 bg-pink-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      {/* 헤더 - 양쪽 1/3 지점 배치 */}
      <header className="relative z-10 p-8 px-[12%] flex justify-between items-center">
        <div className="flex items-center gap-2">
          <svg className="w-6 h-6 text-gray-700" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0014.5 4c-1.255 0-2.443.29-3.5.804V12a1 1 0 11-2 0V4.804z" />
          </svg>
          <h1 className="text-xl font-semibold text-gray-700">{i18n.language === 'ko' ? '날씨네컷' : 'Weatherbooth'}</h1>
        </div>
        <button
          onClick={toggleLanguage}
          className="text-sm text-gray-500 hover:text-gray-700 transition-colors"
          aria-label="언어 전환"
        >
          {i18n.language === 'ko' ? 'KO' : 'EN'}
        </button>
      </header>

      {/* 메인 컨텐츠 */}
      <main className="relative z-10 flex-1 flex flex-col items-center justify-center px-6 pb-20">
        {isWeatherLoading ? (
          // 로딩 상태
          <div className="bg-white/95 backdrop-blur-sm rounded-[2rem] shadow-2xl p-12 text-center w-full max-w-lg">
            <div className="flex flex-col items-center gap-4">
              <span className="loading loading-spinner loading-lg text-primary"></span>
              <p className="text-gray-500">{t('home.weatherLoading')}</p>
            </div>
          </div>
        ) : weatherError ? (
          // 오류 상태
          <div className="bg-white/95 backdrop-blur-sm rounded-[2rem] shadow-2xl p-12 text-center w-full max-w-lg">
            <p className="text-error mb-4">{weatherError}</p>
            <button onClick={loadWeatherData} className="btn btn-primary btn-sm">
              {t('home.error.retry')}
            </button>
          </div>
        ) : weather ? (
          <>
            {/* 메인 카드 - 비율 조정 */}
            <div className="bg-white/95 backdrop-blur-sm rounded-[2rem] shadow-2xl p-10 md:p-12 text-center w-full max-w-lg mb-8">
              {/* 상단 날씨 정보 - 기온 크게 */}
              <div className="flex items-center justify-center gap-3 mb-10">
                {getWeatherIcon(weather.condition)}
                <span className="text-5xl font-bold text-gray-800">{Math.round(weather.temperature)}°C</span>
                <span className="text-gray-400 text-sm ml-1">{weather.location}, KR</span>
              </div>

              {/* 메인 타이틀 - 크기 줄임 */}
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-5 leading-tight">
                {i18n.language === 'ko' ? '오늘의 순간을 담아보세요' : "Capture Today's Mood"}
              </h2>

              {/* 설명 텍스트 - 크기 줄임 */}
              <p className="text-gray-500 text-sm md:text-base leading-relaxed">
                {i18n.language === 'ko'
                  ? '현재 날씨를 기반으로 4컷 사진을 만들어보세요.'
                  : 'Experience a photobooth that creates unique four-cut photo strips based on the current weather, capturing the essence of this very moment.'}
              </p>
            </div>

            {/* 시작하기 버튼 - 비활성화 (팀원 구현 전) */}
            <button
              disabled
              className="px-14 py-3.5 bg-gradient-to-r from-blue-200 to-blue-300 text-gray-900 text-base font-semibold rounded-full shadow-lg cursor-not-allowed opacity-70"
            >
              {t('home.startButton')}
            </button>
          </>
        ) : null}
      </main>

      {/* 최근 촬영한 인생네컷 - 스크롤 영역 */}
      <section className="relative z-10 w-full bg-white/50 backdrop-blur-sm py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <h3 className="text-3xl font-bold text-gray-800 mb-10 text-center">
            {t('home.recentPhotos')}
          </h3>

          {isPhotosLoading ? (
            // 로딩 상태
            <div className="flex justify-center py-12">
              <span className="loading loading-spinner loading-lg text-primary"></span>
            </div>
          ) : photosError ? (
            // 오류 상태
            <div className="text-center py-12">
              <p className="text-error mb-4">{photosError}</p>
              <button onClick={loadRecentPhotos} className="btn btn-primary btn-sm">
                {t('home.error.retry')}
              </button>
            </div>
          ) : recentPhotos.length > 0 ? (
            // 최근 사진 그리드
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {recentPhotos.map((photo) => (
                <div
                  key={photo.id}
                  className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden group cursor-pointer"
                >
                  <div className="aspect-[3/4] bg-gray-200 overflow-hidden">
                    <img
                      src={photo.imageUrl}
                      alt={`Photo taken on ${photo.createdAt.toLocaleDateString()}`}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      loading="lazy"
                    />
                  </div>
                  <div className="p-3">
                    <div className="flex items-center justify-between text-xs text-gray-600">
                      <span className="flex items-center gap-1">
                        <span className="text-sm">{getWeatherEmoji(photo.weather)}</span>
                        <span className="font-medium">{Math.round(photo.temperature)}°C</span>
                      </span>
                      <span className="text-[10px]">{photo.createdAt.toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            // 사진이 없을 때
            <div className="text-center py-16 text-gray-400">
              <svg className="w-16 h-16 mx-auto mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <p className="text-lg font-medium">{t('home.noPhotos')}</p>
            </div>
          )}
        </div>
      </section>

      {/* 푸터 */}
      <footer className="relative z-10 pb-8 pt-8 text-center bg-white/50 backdrop-blur-sm">
        <p className="text-gray-400 text-sm">{i18n.language === 'ko' ? '현대적인 포토부스 경험' : 'A modern photobooth experience'}</p>
      </footer>

      <style>{`
        @keyframes blob {
          0%, 100% { transform: translate(0, 0) scale(1); }
          25% { transform: translate(20px, -50px) scale(1.1); }
          50% { transform: translate(-20px, 20px) scale(0.9); }
          75% { transform: translate(50px, 50px) scale(1.05); }
        }
        .animate-blob {
          animation: blob 15s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  );
}
