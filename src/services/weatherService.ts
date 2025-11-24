import type { WeatherData, WeatherCondition, KMAApiResponse } from '../types';

/**
 * 날씨 API 서비스
 * 공공데이터포털 기상청 단기예보 API를 사용하여 현재 날씨 정보를 조회합니다.
 */

// 기상청 API 엔드포인트
// 배포 환경에서는 프록시 사용, 개발 환경에서는 직접 호출
const KMA_API_BASE_URL = import.meta.env.PROD 
  ? '/api/weather'
  : 'https://apis.data.go.kr/1360000/VilageFcstInfoService_2.0/getUltraSrtNcst';

/**
 * 현재 시각을 기상청 API 형식으로 변환
 * @returns { date: 'YYYYMMDD', time: 'HHmm' }
 */
const getCurrentDateTime = (): { date: string; time: string } => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');

  // 기상청 API는 매 정시 40분에 생성되므로, 현재 시각 기준으로 가장 최근 정시로 조정
  let hour = now.getHours();
  const minute = now.getMinutes();

  // 현재가 정시 40분 이전이면 이전 시간의 데이터 요청
  if (minute < 40) {
    hour = hour - 1;
    if (hour < 0) {
      hour = 23;
      // 날짜도 하루 전으로 조정
      const yesterday = new Date(now);
      yesterday.setDate(yesterday.getDate() - 1);
      return {
        date: `${yesterday.getFullYear()}${String(yesterday.getMonth() + 1).padStart(2, '0')}${String(yesterday.getDate()).padStart(2, '0')}`,
        time: `${String(hour).padStart(2, '0')}00`,
      };
    }
  }

  return {
    date: `${year}${month}${day}`,
    time: `${String(hour).padStart(2, '0')}00`,
  };
};

/**
 * 위도/경도를 기상청 격자 좌표(nx, ny)로 변환
 * 서울 시청 기준 좌표를 기본값으로 사용
 * @param lat 위도 (기본값: 서울 시청)
 * @param lon 경도 (기본값: 서울 시청)
 * @returns { nx: number, ny: number }
 */
const convertToGrid = (_lat = 37.5665, _lon = 126.978): { nx: number; ny: number } => {
  // 간단한 변환 로직 (실제로는 더 복잡한 변환이 필요)
  // 서울 시청 기준: nx=60, ny=127
  // 프로젝트에서는 사용자 위치 기반으로 변환하거나, 주요 도시 좌표를 미리 매핑

  // 서울 중심 좌표
  return { nx: 60, ny: 127 };
};

/**
 * 강수형태 코드를 날씨 상태로 변환
 * @param pty 강수형태 코드 (0: 없음, 1: 비, 2: 비/눈, 3: 눈, 4: 소나기)
 * @param sky 하늘상태 코드 (1: 맑음, 3: 구름많음, 4: 흐림) - 초단기실황에는 없음
 * @returns WeatherCondition
 */
const getWeatherCondition = (pty: string): WeatherCondition => {
  switch (pty) {
    case '0': // 강수 없음
      return 'sunny'; // 기본적으로 맑음으로 설정
    case '1': // 비
    case '4': // 소나기
      return 'rainy';
    case '2': // 비/눈
    case '3': // 눈
      return 'snowy';
    default:
      return 'sunny';
  }
};

/**
 * 기상청 API를 호출하여 현재 날씨 정보를 가져옵니다.
 * @returns Promise<WeatherData>
 * @throws Error API 호출 실패 시
 */
export const fetchCurrentWeather = async (): Promise<WeatherData> => {
  try {
    const apiKey = import.meta.env.VITE_WEATHER_API_KEY;

    if (!apiKey) {
      throw new Error('날씨 API 키가 설정되지 않았습니다. .env 파일을 확인해주세요.');
    }

    const { date, time } = getCurrentDateTime();
    const { nx, ny } = convertToGrid(); // 서울 기준 좌표

    // API 요청 파라미터
    const params = new URLSearchParams({
      serviceKey: apiKey,
      numOfRows: '10',
      pageNo: '1',
      base_date: date,
      base_time: time,
      nx: nx.toString(),
      ny: ny.toString(),
      dataType: 'JSON',
    });

    // 배포 환경에서는 프록시로 요청
    const apiUrl = import.meta.env.PROD
      ? `${KMA_API_BASE_URL}?date=${date}&time=${time}&nx=${nx}&ny=${ny}`
      : `${KMA_API_BASE_URL}?${params.toString()}`;

    const response = await fetch(apiUrl);

    if (!response.ok) {
      throw new Error(`날씨 API 호출 실패: ${response.status} ${response.statusText}`);
    }

    const data: KMAApiResponse = await response.json();

    // API 응답 검증
    if (data.response.header.resultCode !== '00') {
      throw new Error(`날씨 API 오류: ${data.response.header.resultMsg}`);
    }

    const items = data.response.body.items.item;

    // 필요한 데이터 추출
    let temperature = 0;
    let pty = '0'; // 강수형태
    let reh = 0; // 습도

    items.forEach((item) => {
      switch (item.category) {
        case 'T1H': // 기온
          temperature = parseFloat(item.obsrValue);
          break;
        case 'PTY': // 강수형태
          pty = item.obsrValue;
          break;
        case 'REH': // 습도
          reh = parseFloat(item.obsrValue);
          break;
      }
    });

    const weatherData: WeatherData = {
      temperature,
      condition: getWeatherCondition(pty),
      location: '서울', // 기본 위치 (추후 위치 기반 서비스로 확장 가능)
      pty,
      reh,
      timestamp: new Date(),
    };

    return weatherData;
  } catch (error) {
    console.error('날씨 정보 조회 실패:', error);
    throw error;
  }
};

/**
 * 날씨 상태에 따른 아이콘 이모지 반환
 * @param condition 날씨 상태
 * @returns 이모지 문자열
 */
export const getWeatherEmoji = (condition: WeatherCondition): string => {
  const emojiMap: Record<WeatherCondition, string> = {
    sunny: '☀️',
    cloudy: '☁️',
    rainy: '🌧️',
    snowy: '❄️',
  };
  return emojiMap[condition];
};

/**
 * 날씨 상태의 한글 이름 반환
 * @param condition 날씨 상태
 * @returns 한글 날씨 이름
 */
export const getWeatherNameKo = (condition: WeatherCondition): string => {
  const nameMap: Record<WeatherCondition, string> = {
    sunny: '맑음',
    cloudy: '흐림',
    rainy: '비',
    snowy: '눈',
  };
  return nameMap[condition];
};

/**
 * 날씨 상태의 영어 이름 반환
 * @param condition 날씨 상태
 * @returns 영어 날씨 이름
 */
export const getWeatherNameEn = (condition: WeatherCondition): string => {
  const nameMap: Record<WeatherCondition, string> = {
    sunny: 'Sunny',
    cloudy: 'Cloudy',
    rainy: 'Rainy',
    snowy: 'Snowy',
  };
  return nameMap[condition];
};
