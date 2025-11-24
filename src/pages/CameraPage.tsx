import { useLocation, useNavigate } from 'react-router';
import { useEffect } from 'react';
import Camera from '../components/Camera';

type Weather = 'sunny' | 'cloudy' | 'rainy' | 'snowy';

export default function CameraPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const weatherFromState = location.state?.weather as Weather | undefined;

  useEffect(() => {
    // 날씨 정보가 없으면 메인 페이지로 리다이렉트
    if (!weatherFromState) {
      navigate('/', { replace: true });
    }
  }, [weatherFromState, navigate]);

  if (!weatherFromState) {
    return null;
  }

  return (  
    <Camera initialWeather={weatherFromState} />
  );
}