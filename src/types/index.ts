// 날씨 상태 타입
export type WeatherCondition = 'sunny' | 'cloudy' | 'rainy' | 'snowy';

// 날씨 API 응답 데이터 타입
export interface WeatherData {
  temperature: number; // 기온 (°C)
  condition: WeatherCondition; // 날씨 상태
  location: string; // 위치
  pty: string; // 강수형태 (0: 없음, 1: 비, 2: 비/눈, 3: 눈, 4: 소나기)
  reh: number; // 습도 (%)
  timestamp: Date; // 조회 시각
}

// 인생네컷 데이터 타입
export interface PhotoData {
  id: string;
  imageUrl: string; // 사진 URL
  weather: WeatherCondition; // 촬영 당시 날씨
  temperature: number; // 촬영 당시 기온
  createdAt: Date; // 촬영 일시
  frameType: string; // 프레임 타입
}

// 기상청 API 응답 타입
export interface KMAApiResponse {
  response: {
    header: {
      resultCode: string;
      resultMsg: string;
    };
    body: {
      dataType: string;
      items: {
        item: KMAWeatherItem[];
      };
      pageNo: number;
      numOfRows: number;
      totalCount: number;
    };
  };
}

// 기상청 API 날씨 항목 타입
export interface KMAWeatherItem {
  baseDate: string; // 발표일자
  baseTime: string; // 발표시각
  category: string; // 자료구분코드
  nx: number; // 예보지점 X 좌표
  ny: number; // 예보지점 Y 좌표
  obsrValue: string; // 실황값
}
