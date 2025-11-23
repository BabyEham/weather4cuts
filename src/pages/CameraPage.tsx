import { useLocation, useNavigate } from 'react-router';
import { useEffect } from 'react';
import type { WeatherCondition } from '../types';

/**
 * Camera 페이지
 *
 * MainPage에서 전달받은 날씨 데이터를 사용하여 프레임을 선택합니다.
 * 팀원들이 이 페이지에서 카메라 촬영 기능을 구현할 예정입니다.
 */

// MainPage에서 전달받는 state의 타입 정의
interface LocationState {
  weather: WeatherCondition;
  temperature: number;
  location: string;
}

export default function CameraPage() {
  const location = useLocation();
  const navigate = useNavigate();

  // MainPage에서 전달받은 날씨 데이터
  const state = location.state as LocationState | null;

  useEffect(() => {
    // 날씨 데이터가 없으면 메인 페이지로 리다이렉트
    if (!state || !state.weather) {
      console.warn('날씨 데이터가 없습니다. 메인 페이지로 이동합니다.');
      navigate('/');
    }
  }, [state, navigate]);

  // 날씨 데이터가 없으면 아무것도 렌더링하지 않음
  if (!state) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-blue-50 to-purple-100 p-6">
      <div className="max-w-4xl mx-auto">
        {/* 헤더 */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Camera</h1>
          <button
            onClick={() => navigate('/')}
            className="px-4 py-2 rounded-full bg-white/50 backdrop-blur-sm hover:bg-white/70 transition-all text-sm font-medium text-gray-700"
          >
            ← Back
          </button>
        </div>

        {/* 날씨 정보 요약 */}
        <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-xl p-6 mb-8">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 mb-1">Current Weather</p>
              <p className="text-2xl font-bold text-gray-800">
                {state.weather.charAt(0).toUpperCase() + state.weather.slice(1)}
              </p>
            </div>
            <div className="text-right">
              <p className="text-4xl font-bold text-gray-800">{Math.round(state.temperature)}°C</p>
              <p className="text-sm text-gray-500">{state.location}</p>
            </div>
          </div>
        </div>

        {/* 카메라 촬영 영역 (팀원 구현 예정) */}
        <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-xl p-12 text-center">
          <div className="aspect-[3/4] max-w-md mx-auto bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl flex items-center justify-center mb-6">
            <p className="text-gray-400 text-lg">Camera Preview</p>
          </div>

          <button className="px-12 py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white text-lg font-semibold rounded-full shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300">
            Capture Photo
          </button>
        </div>

        {/* 안내 메시지 */}
        <div className="mt-8 text-center">
          <p className="text-gray-400 text-sm">
            Frame will be selected based on weather: <strong>{state.weather}</strong>
          </p>
        </div>
      </div>
    </div>
  );
}