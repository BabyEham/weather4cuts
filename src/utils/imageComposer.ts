/**
 * 이미지 합성 유틸리티
 * 4장의 사진을 전체 프레임에 끼워넣습니다.
 */

import sunnyFrame from "../assets/frame/sunny/sunny.png";
import cloudyFrame from "../assets/frame/cloudy/cloudy.png";
import rainyFrame from "../assets/frame/rainy/rainy.png";
import snowyFrame from "../assets/frame/snowy/snowy.png";

type Weather = "sunny" | "cloudy" | "rainy" | "snowy";

const weatherFrames: Record<Weather, string> = {
  sunny: sunnyFrame,
  cloudy: cloudyFrame,
  rainy: rainyFrame,
  snowy: snowyFrame,
};

interface FrameLayout {
  marginTop: number;
  marginBottom: number;
  marginLeft: number;
  marginRight: number;
  photoGap: number;
}

const defaultLayout: FrameLayout = {
  marginTop: 0.008,
  marginBottom: 0.13,
  marginLeft: 0.075,
  marginRight: 0.075,
  photoGap: 0.008,
};

const weatherLayouts: Record<Weather, FrameLayout> = {
  sunny: defaultLayout,
  cloudy: defaultLayout,
  rainy: defaultLayout,
  snowy: defaultLayout,
};

const loadImage = (src: string): Promise<HTMLImageElement> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
};

/**
 * 4장의 사진을 전체 프레임에 합성
 * @param photos 4장의 사진 (base64 또는 URL)
 * @param weather 날씨 조건
 * @param caption 프레임 하단에 표시할 멘트 (선택사항)
 * @returns 합성된 이미지의 base64 데이터
 */
export const composePhotoStrip = async (
  photos: string[],
  weather: Weather,
  caption?: string
): Promise<string> => {
  if (photos.length !== 4) {
    throw new Error("4장의 사진이 필요합니다.");
  }

  // 전체 프레임 이미지 로드
  const frameImage = await loadImage(weatherFrames[weather]);

  // 사진 이미지들 로드
  const photoImages = await Promise.all(photos.map(loadImage));

  // 캔버스 생성 (프레임 크기에 맞춤)
  const canvas = document.createElement("canvas");
  canvas.width = frameImage.width;
  canvas.height = frameImage.height;

  const ctx = canvas.getContext("2d");
  if (!ctx) {
    throw new Error("Canvas context를 생성할 수 없습니다.");
  }

  // 프레임 크기 계산
  const frameWidth = frameImage.width;
  const frameHeight = frameImage.height;

  const layout = weatherLayouts[weather];

  const marginTop = frameHeight * layout.marginTop;
  const marginBottom = frameHeight * layout.marginBottom;
  const marginLeft = frameWidth * layout.marginLeft;
  const marginRight = frameWidth * layout.marginRight;

  const photoAreaWidth = frameWidth - marginLeft - marginRight;
  const photoAreaHeight = frameHeight - marginTop - marginBottom;
  const photoAreaX = marginLeft;
  const photoAreaY = marginTop;

  const photoGap = frameHeight * layout.photoGap;
  const totalGapHeight = photoGap * 3;

  const availableHeight = photoAreaHeight - totalGapHeight;
  const photoHeight = availableHeight / 4;
  const photoWidth = photoAreaWidth;

  photoImages.forEach((photo, index) => {
    const y = photoAreaY + (photoHeight + photoGap) * index;

    const targetRatio = photoWidth / photoHeight;
    const photoRatio = photo.width / photo.height;

    let sourceX = 0;
    let sourceY = 0;
    let sourceWidth = photo.width;
    let sourceHeight = photo.height;

    if (photoRatio > targetRatio) {
      sourceWidth = photo.height * targetRatio;
      sourceX = (photo.width - sourceWidth) / 2;
    } else if (photoRatio < targetRatio) {
      sourceHeight = photo.width / targetRatio;
      sourceY = (photo.height - sourceHeight) / 2;
    }

    ctx.drawImage(
      photo,
      sourceX,
      sourceY,
      sourceWidth,
      sourceHeight,
      photoAreaX,
      y,
      photoWidth,
      photoHeight
    );
  });

  ctx.drawImage(frameImage, 0, 0, frameWidth, frameHeight);

  // 멘트를 프레임 하단 공간에 그리기
  if (caption && caption.trim()) {
    const captionY = frameHeight - marginBottom / 2;

    ctx.save();
    ctx.fillStyle = "#2E3440";
    ctx.font = `${
      frameHeight * 0.03
    }px "Pretendard Variable", "Apple SD Gothic Neo", sans-serif`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    // 텍스트에 약간의 그림자 효과
    ctx.shadowColor = "rgba(0, 0, 0, 0.1)";
    ctx.shadowBlur = 4;
    ctx.shadowOffsetY = 2;

    ctx.fillText(caption, frameWidth / 2, captionY);
    ctx.restore();
  }

  return canvas.toDataURL("image/png");
};
