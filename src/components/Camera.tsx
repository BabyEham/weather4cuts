import { useRef, useState } from "react";
import { useNavigate } from "react-router";
import { savePhotoData } from "../services/firestoreService";
import { showToast } from "../utils/toastUtil";
import type { WeatherCondition } from "../types";

// 프레임 이미지 import
import sunnyFrame1 from "../assets/frame/sunny/sunny-1.png";
import sunnyFrame2 from "../assets/frame/sunny/sunny-2.png";
import sunnyFrame3 from "../assets/frame/sunny/sunny-3.png";
import sunnyFrame4 from "../assets/frame/sunny/sunny-4.png";

import cloudyFrame1 from "../assets/frame/cloudy/cloudy-1.png";
import cloudyFrame2 from "../assets/frame/cloudy/cloudy-2.png";
import cloudyFrame3 from "../assets/frame/cloudy/cloudy-3.png";
import cloudyFrame4 from "../assets/frame/cloudy/cloudy-4.png";

import rainyFrame1 from "../assets/frame/rainy/rainy-1.png";
import rainyFrame2 from "../assets/frame/rainy/rainy-2.png";
import rainyFrame3 from "../assets/frame/rainy/rainy-3.png";
import rainyFrame4 from "../assets/frame/rainy/rainy-4.png";

import snowyFrame1 from "../assets/frame/snowy/snowy-1.png";
import snowyFrame2 from "../assets/frame/snowy/snowy-2.png";
import snowyFrame3 from "../assets/frame/snowy/snowy-3.png";
import snowyFrame4 from "../assets/frame/snowy/snowy-4.png";

type Weather = "sunny" | "cloudy" | "rainy" | "snowy";

const weatherFrames: Record<Weather, string[]> = {
  sunny: [sunnyFrame1, sunnyFrame2, sunnyFrame3, sunnyFrame4],
  cloudy: [cloudyFrame1, cloudyFrame2, cloudyFrame3, cloudyFrame4],
  rainy: [rainyFrame1, rainyFrame2, rainyFrame3, rainyFrame4],
  snowy: [snowyFrame1, snowyFrame2, snowyFrame3, snowyFrame4],
};

export default function Camera() {
  const navigate = useNavigate();
  const videoRef = useRef<HTMLVideoElement>(null);
  const frameRef = useRef<HTMLImageElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [images, setImages] = useState<string[]>([]); // 프레임 포함 이미지 (미리보기용)
  const [rawImages, setRawImages] = useState<string[]>([]); // 프레임 없는 원본 이미지 (저장용)
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [weather, setWeather] = useState<Weather>("sunny");
  const [frameDimensions, setFrameDimensions] = useState({
    width: 0,
    height: 0,
  });
  const [isSaving, setIsSaving] = useState(false);
  const isFrameSizeSet = useRef(false);

  const startCamera = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: { facingMode: "environment" },
    });
    if (videoRef.current) {
      videoRef.current.srcObject = stream;
      setIsCameraActive(true);
    }
  };

  const takePhoto = () => {
    const video = videoRef.current;
    const frame = frameRef.current;
    if (!video || !frame || !frame.complete) return;

    // 최대 4장까지만 촬영 가능
    if (images.length >= 4) {
      alert("최대 4장까지 촬영할 수 있습니다.");
      return;
    }

    const canvas = document.createElement("canvas");
    // 화면에 표시되는 크기 사용 (frameDimensions)
    canvas.width = frameDimensions.width;
    canvas.height = frameDimensions.height;

    const context = canvas.getContext("2d");
    if (context) {
      // 1. 프레임 없는 원본 이미지 저장 (Storage 저장용)
      context.save();
      context.scale(-1, 1);
      context.drawImage(video, -canvas.width, 0, canvas.width, canvas.height);
      context.restore();
      const rawDataUrl = canvas.toDataURL("image/png");
      setRawImages((prev) => [...prev, rawDataUrl]);

      // 2. 프레임 포함 이미지 저장 (미리보기용)
      context.save();
      context.scale(-1, 1);
      context.drawImage(frame, -canvas.width, 0, canvas.width, canvas.height);
      context.restore();

      const dataUrl = canvas.toDataURL("image/png");
      setImages((prev) => [...prev, dataUrl]);
    }
  };

  const resetPhotos = () => {
    setImages([]);
    setRawImages([]);
    isFrameSizeSet.current = false;
  };

  const stopCamera = () => {
    if (videoRef.current?.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach((track) => track.stop());
      videoRef.current.srcObject = null;
      setIsCameraActive(false);
    }
  };

  /**
   * 촬영 완료 후 Firestore와 Storage에 저장
   */
  const handleSavePhotos = async () => {
    if (rawImages.length !== 4) {
      showToast("4장의 사진을 모두 촬영해주세요.", "error");
      return;
    }

    try {
      setIsSaving(true);
      
      // Firestore와 Storage에 저장
      // 임시로 온도는 25도로 설정 (실제로는 API에서 가져와야 함)
      await savePhotoData(
        rawImages, // 프레임 없는 원본 이미지 저장
        weather as WeatherCondition,
        25,
        ""
      );

      showToast("인생네컷이 저장되었습니다! 🎉", "success");
      
      // 결과 페이지로 이동
      setTimeout(() => {
        navigate("/result");
      }, 1000);
    } catch (error) {
      console.error("사진 저장 실패:", error);
      showToast("사진 저장에 실패했습니다. 다시 시도해주세요.", "error");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-base-100 p-4">
      <div className="container mx-auto max-w-4xl">
        {/* 날씨 선택 */}
        <div className="flex justify-center gap-2 mb-4">
          <button
            className={`btn btn-sm ${
              weather === "sunny" ? "btn-primary" : "btn-outline"
            }`}
            onClick={() => setWeather("sunny")}
          >
            ☀️ 맑음
          </button>
          <button
            className={`btn btn-sm ${
              weather === "cloudy" ? "btn-primary" : "btn-outline"
            }`}
            onClick={() => setWeather("cloudy")}
          >
            ☁️ 흐림
          </button>
          <button
            className={`btn btn-sm ${
              weather === "rainy" ? "btn-primary" : "btn-outline"
            }`}
            onClick={() => setWeather("rainy")}
          >
            🌧️ 비
          </button>
          <button
            className={`btn btn-sm ${
              weather === "snowy" ? "btn-primary" : "btn-outline"
            }`}
            onClick={() => setWeather("snowy")}
          >
            ❄️ 눈
          </button>
        </div>

        {/* 카메라 화면 */}
        <div
          ref={containerRef}
          className="relative mb-4 mx-auto"
          style={{
            width: frameDimensions.width || "auto",
            height: frameDimensions.height || "auto",
            maxWidth: "500px",
            maxHeight: "80vh",
          }}
        >
          <video
            ref={videoRef}
            className="absolute top-0 left-0 w-full h-full object-cover transform rotate-y-180"
            autoPlay
            playsInline
            style={{ transform: "scaleX(-1)" }}
          />
          {/* 촬영 프레임 오버레이 */}
          {isCameraActive && images.length < 4 && (
            <img
              ref={frameRef}
              src={weatherFrames[weather][images.length]}
              alt={`frame-${images.length + 1}`}
              className="absolute top-0 left-0 w-full h-full pointer-events-none"
              onLoad={(e) => {
                // 첫 프레임 로드 시에만 크기 설정
                if (!isFrameSizeSet.current) {
                  const img = e.currentTarget;
                  const maxWidth = 500;
                  const aspectRatio = img.naturalHeight / img.naturalWidth;
                  const width = Math.min(img.naturalWidth, maxWidth);
                  const height = width * aspectRatio;

                  setFrameDimensions({
                    width: width,
                    height: height,
                  });
                  isFrameSizeSet.current = true;
                }
              }}
            />
          )}
        </div>

        {/* 버튼 영역 */}
        <div className="flex justify-center gap-4 mb-6">
          {!isCameraActive ? (
            <button
              className="btn btn-primary text-white"
              onClick={startCamera}
            >
              카메라 시작
            </button>
          ) : (
            <>
              <button
                className="btn btn-secondary text-white"
                onClick={takePhoto}
                disabled={images.length >= 4}
              >
                촬영 ({images.length}/4)
              </button>
              <button className="btn btn-ghost" onClick={stopCamera}>
                카메라 종료
              </button>
              {images.length > 0 && (
                <button
                  className="btn btn-warning text-white"
                  onClick={resetPhotos}
                >
                  다시 촬영
                </button>
              )}
            </>
          )}
        </div>

        {/* 촬영된 사진 프레임 */}
        {images.length > 0 && (
          <div className="card bg-base-200 shadow-xl p-4">
            <h3 className="text-xl font-bold mb-4 text-center">
              촬영된 사진 ({images.length}/4)
            </h3>
            <div className="grid grid-cols-2 gap-4">
              {images.map((img, index) => (
                <div key={index} className="relative">
                  <img
                    src={img}
                    className="w-full h-auto rounded-lg shadow-md"
                    alt={`captured-${index + 1}`}
                  />
                  <div className="absolute top-2 left-2 badge badge-primary">
                    {index + 1}
                  </div>
                </div>
              ))}
              {/* 빈 프레임 표시 */}
              {Array.from({ length: 4 - images.length }).map((_, index) => (
                <div
                  key={`empty-${index}`}
                  className="aspect-3/4 bg-base-300 rounded-lg flex items-center justify-center"
                >
                  <span className="text-base-content/50 text-lg">
                    {images.length + index + 1}
                  </span>
                </div>
              ))}
            </div>
            {images.length === 4 && (
              <div className="mt-4 text-center">
                <button 
                  className="btn btn-success text-white btn-lg"
                  onClick={handleSavePhotos}
                  disabled={isSaving}
                >
                  {isSaving ? (
                    <>
                      <span className="loading loading-spinner"></span>
                      저장 중...
                    </>
                  ) : (
                    "완성! 결과 보기"
                  )}
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
