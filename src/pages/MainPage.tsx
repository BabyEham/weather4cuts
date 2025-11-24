import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { useTranslation } from "react-i18next";
import { fetchCurrentWeather } from "../services/weatherService";
import { fetchRecentPhotos } from "../services/localStorageService";
import type { WeatherData, PhotoData } from "../types";
import { showToast } from "../utils/toastUtil";
import { composePhotoStrip } from "../utils/imageComposer";
import LanguageIcon from "@mui/icons-material/Language";
import CameraAltIcon from "@mui/icons-material/CameraAlt";
import WarningIcon from "@mui/icons-material/Warning";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import PhotoLibraryIcon from "@mui/icons-material/PhotoLibrary";
import ImageIcon from "@mui/icons-material/Image";
import WeatherSelector from "../components/WeatherSelector";
import type { WeatherCondition } from "../types";

export default function MainPage() {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [selectedWeather, setSelectedWeather] =
    useState<WeatherCondition | null>(null);
  const [recentPhotos, setRecentPhotos] = useState<PhotoData[]>([]);
  const [composedImages, setComposedImages] = useState<Record<string, string>>(
    {}
  );
  const [isWeatherLoading, setIsWeatherLoading] = useState(true);
  const [isPhotosLoading, setIsPhotosLoading] = useState(true);
  const [weatherError, setWeatherError] = useState<string | null>(null);
  const [photosError, setPhotosError] = useState<string | null>(null);

  useEffect(() => {
    loadWeatherData();
    loadRecentPhotos();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadWeatherData = async () => {
    try {
      setIsWeatherLoading(true);
      setWeatherError(null);
      const weatherData = await fetchCurrentWeather();
      setWeather(weatherData);
      setSelectedWeather(weatherData.condition);
    } catch (error) {
      console.error("Failed to fetch weather:", error);
      setWeatherError(t("home.error.weatherFetch"));
      setSelectedWeather("sunny");
    } finally {
      setIsWeatherLoading(false);
    }
  };

  const loadRecentPhotos = async () => {
    try {
      setIsPhotosLoading(true);
      setPhotosError(null);
      const photos = await fetchRecentPhotos(6);
      setRecentPhotos(photos);

      const composed: Record<string, string> = {};
      for (const photo of photos) {
        try {
          const composedImage = await composePhotoStrip(
            photo.images,
            photo.weather as "sunny" | "cloudy" | "rainy" | "snowy",
            photo.caption || ""
          );
          composed[photo.id] = composedImage;
        } catch (error) {
          console.error(`Photo ${photo.id} composition failed:`, error);
        }
      }
      setComposedImages(composed);
    } catch (error) {
      console.error("Failed to fetch photos:", error);
      setPhotosError(t("home.error.photosFetch"));
    } finally {
      setIsPhotosLoading(false);
    }
  };

  const handleStartClick = () => {
    if (!selectedWeather) {
      showToast(t("home.selectWeatherFirst"), "warning");
      return;
    }
    navigate("/camera", {
      state: {
        weather: selectedWeather,
        temperature: weather?.temperature || 25,
        location: weather?.location || "Seoul",
      },
    });
  };

  const toggleLanguage = () => {
    const newLang = i18n.language === "ko" ? "en" : "ko";
    i18n.changeLanguage(newLang);
  };

  const getWeatherIcon = (condition: string) => {
    switch (condition) {
      case "sunny":
        return (
          <svg
            className="w-10 h-10 text-gray-700"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <circle cx="12" cy="12" r="4" strokeWidth="2" />
            <path
              strokeLinecap="round"
              strokeWidth="2"
              d="M12 2v2m0 16v2M20 12h2M2 12h2m15.07-7.07l-1.41 1.41M7.34 16.66l-1.41 1.41m12.14 0l-1.41-1.41M7.34 7.34L5.93 5.93"
            />
          </svg>
        );
      case "cloudy":
        return (
          <svg
            className="w-10 h-10 text-gray-700"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-10 7 7 0 00-13.8 2.2A4 4 0 003 15z"
            />
          </svg>
        );
      case "rainy":
        return (
          <svg
            className="w-10 h-10 text-gray-700"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-10 7 7 0 00-13.8 2.2A4 4 0 003 15z"
            />
            <path
              strokeLinecap="round"
              strokeWidth="2"
              d="M8 19v3m4-3v3m4-3v3"
            />
          </svg>
        );
      case "snowy":
        return (
          <svg
            className="w-10 h-10 text-gray-700"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M12 2v20m10-10H2m16.5-6.5L5.5 18.5m13-13L5.5 5.5"
            />
          </svg>
        );
      default:
        return (
          <svg
            className="w-10 h-10 text-gray-700"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <circle cx="12" cy="12" r="5" strokeWidth="2" />
          </svg>
        );
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-base-100 to-base-200 flex flex-col relative overflow-hidden">
      {/* 헤더 */}
      <header className="relative z-10 navbar bg-base-100">
        <div className="navbar-start">
          <div className="flex items-center gap-2 ml-4">
            <svg
              className="w-8 h-8 text-primary"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
              <path d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <h1 className="text-2xl font-bold text-primary">
              {i18n.language === "ko" ? "날씨네컷" : "Weatherbooth"}
            </h1>
          </div>
        </div>
        <div className="navbar-end mr-4">
          <button
            onClick={toggleLanguage}
            className="btn btn-ghost btn-sm gap-2"
            aria-label="언어 전환"
          >
            <LanguageIcon fontSize="small" />
            {i18n.language === "ko" ? "KO" : "EN"}
          </button>
        </div>
      </header>

      {/* 메인 컨텐츠 */}
      <main className="relative z-10 flex-1 flex flex-col items-center justify-center px-6 pb-20 pt-8">
        {isWeatherLoading ? (
          // 로딩 상태
          <div className="card bg-base-100 w-full max-w-lg">
            <div className="card-body items-center text-center">
              <span className="loading loading-spinner loading-lg text-primary"></span>
              <p className="text-base-content/70 mt-4">
                {t("home.weatherLoading")}
              </p>
            </div>
          </div>
        ) : weatherError ? (
          // 오류 상태
          <div className="card bg-base-100 w-full max-w-lg">
            <div className="card-body items-center text-center">
              <div className="alert alert-error mb-4">
                <WarningIcon className="h-6 w-6" />
                <span>{weatherError}</span>
              </div>
              <button onClick={loadWeatherData} className="btn btn-primary">
                <RestartAltIcon fontSize="small" />
                {t("home.error.retry")}
              </button>
            </div>
          </div>
        ) : (
          <>
            {/* 메인 카드 */}
            <div className="card bg-base-100 w-full max-w-3xl mb-8">
              <div className="card-body p-8 md:p-10">
                {/* 현재 날씨 정보 (있을 경우) */}
                {weather && (
                  <div className="flex items-center justify-center gap-4 mb-8 pb-6 border-b border-base-300">
                    <div className="text-primary">
                      {getWeatherIcon(weather.condition)}
                    </div>
                    <div className="text-left">
                      <div className="text-4xl font-bold text-primary">
                        {Math.round(weather.temperature)}°C
                      </div>
                      <div className="text-sm text-base-content/60 mt-1">
                        {weather.location}, KR
                      </div>
                    </div>
                  </div>
                )}

                {/* 날씨 선택 */}
                {selectedWeather && (
                  <WeatherSelector
                    selectedWeather={selectedWeather}
                    onSelect={setSelectedWeather}
                  />
                )}

                {/* 타이틀 */}
                <div className="text-center mt-6">
                  <h2 className="text-2xl md:text-3xl font-bold mb-3">
                    {i18n.language === "ko"
                      ? "원하는 날씨를 선택하세요"
                      : "Choose Your Weather"}
                  </h2>
                  <p className="text-base-content/70 text-sm md:text-base">
                    {i18n.language === "ko"
                      ? "선택한 날씨에 맞는 프레임으로 4컷 사진을 만들어보세요."
                      : "Create a four-cut photo strip with frames matching your chosen weather."}
                  </p>
                </div>
              </div>
            </div>

            {/* 시작하기 버튼 */}
            <button
              onClick={handleStartClick}
              disabled={!selectedWeather}
              className="btn btn-primary btn-lg btn-wide transition-all gap-2"
            >
              <CameraAltIcon className="h-6 w-6" />
              {t("home.startButton")}
            </button>
          </>
        )}
      </main>

      {/* 최근 촬영한 인생네컷 */}
      <section className="relative z-10 w-full bg-base-200 py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-center gap-3 mb-10">
            <PhotoLibraryIcon className="h-8 w-8 text-primary" />
            <h3 className="text-3xl font-bold text-base-content">
              {t("home.recentPhotos")}
            </h3>
          </div>

          {isPhotosLoading ? (
            // 로딩 상태
            <div className="flex justify-center py-12">
              <span className="loading loading-spinner loading-lg text-primary"></span>
            </div>
          ) : photosError ? (
            // 오류 상태
            <div className="text-center py-12">
              <div className="alert alert-warning max-w-md mx-auto">
                <WarningIcon className="h-6 w-6" />
                <span>{photosError}</span>
              </div>
              <button
                onClick={loadRecentPhotos}
                className="btn btn-primary btn-sm mt-4"
              >
                <RestartAltIcon fontSize="small" />
                {t("home.error.retry")}
              </button>
            </div>
          ) : recentPhotos.length > 0 ? (
            // 최근 사진 그리드
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {recentPhotos.map((photo) => (
                <div
                  key={photo.id}
                  onClick={() => navigate("/result")}
                  className="card bg-base-100 transition-all cursor-pointer group"
                >
                  <figure className="aspect-3/4 overflow-hidden">
                    <img
                      src={composedImages[photo.id] || photo.imageUrl}
                      alt={`Photo taken on ${photo.createdAt.toLocaleDateString()}`}
                      className="w-full h-full object-contain group-hover:scale-105 transition-transform"
                      loading="lazy"
                    />
                  </figure>
                  <div className="card-body p-3">
                    <div className="flex items-center justify-center text-xs">
                      <span className="text-base-content/60 text-[10px]">
                        {photo.createdAt.toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            // 사진이 없을 때
            <div className="card bg-base-100 max-w-md mx-auto">
              <div className="card-body items-center text-center py-16">
                <ImageIcon
                  className="w-16 h-16 text-base-content/30 mb-4"
                  sx={{ fontSize: 64 }}
                />
                <p className="text-lg font-medium text-base-content/70">
                  {t("home.noPhotos")}
                </p>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* 푸터 */}
      <footer className="footer footer-center p-10 bg-base-100 text-base-content">
        <aside>
          <CameraAltIcon
            className="h-10 w-10 text-primary"
            sx={{ fontSize: 40 }}
          />
          <p className="font-bold text-lg">Weather 4 Cuts</p>
          <p className="text-base-content/70">
            {i18n.language === "ko"
              ? "현대적인 포토부스 경험"
              : "A modern photobooth experience"}
          </p>
        </aside>
      </footer>
    </div>
  );
}
