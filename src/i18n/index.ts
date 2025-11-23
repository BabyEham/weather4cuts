import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import ko from './locales/ko.json';
import en from './locales/en.json';

/**
 * i18n 다국어 설정
 * 한국어(ko)와 영어(en)를 지원합니다.
 */

i18n
  .use(initReactI18next) // React와 i18next 연결
  .init({
    resources: {
      ko: { translation: ko },
      en: { translation: en },
    },
    lng: 'ko', // 기본 언어: 한국어
    fallbackLng: 'ko', // 번역이 없을 경우 사용할 언어
    interpolation: {
      escapeValue: false, // React는 XSS 방지를 자동으로 처리
    },
  });

export default i18n;
