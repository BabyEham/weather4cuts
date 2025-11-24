import { useRef, useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { useTranslation } from "react-i18next";
import { savePhotoData } from "../services/localStorageService";
import { showToast } from "../utils/toastUtil";
import type { WeatherCondition } from "../types";
import PhotoCameraIcon from "@mui/icons-material/PhotoCamera";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CameraIcon from "@mui/icons-material/Camera";

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

interface CameraProps {
  initialWeather?: Weather;
}

export default function Camera({ initialWeather = "sunny" }: CameraProps) {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const videoRef = useRef<HTMLVideoElement>(null);
  const frameRef = useRef<HTMLImageElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [images, setImages] = useState<string[]>([]);
  const [rawImages, setRawImages] = useState<string[]>([]);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const weather = initialWeather;
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

  useEffect(() => {
    startCamera();

    const videoElement = videoRef.current;
    return () => {
      if (videoElement?.srcObject) {
        const stream = videoElement.srcObject as MediaStream;
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  const takePhoto = () => {
    const video = videoRef.current;
    const frame = frameRef.current;
    if (!video || !frame || !frame.complete) return;

    if (images.length >= 4) {
      showToast(t("camera.maxPhotos"), "warning");
      return;
    }

    const canvas = document.createElement("canvas");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const context = canvas.getContext("2d");
    if (context) {
      context.save();
      context.scale(-1, 1);
      context.drawImage(video, -canvas.width, 0, canvas.width, canvas.height);
      context.restore();
      const rawDataUrl = canvas.toDataURL("image/png");

      setRawImages((prev) => [...prev, rawDataUrl]);
      setImages((prev) => [...prev, rawDataUrl]);

      console.log(`Photo captured: ${canvas.width}x${canvas.height}`);
    }
  };

  const resetPhotos = () => {
    setImages([]);
    setRawImages([]);
    isFrameSizeSet.current = false;
  };

  const handleSavePhotos = async () => {
    if (rawImages.length !== 4) {
      showToast(t("camera.allPhotosCaptured"), "error");
      return;
    }

    try {
      setIsSaving(true);

      await savePhotoData(rawImages, weather as WeatherCondition, 25, "");
      showToast(t("camera.saveSuccess"), "success");

      setTimeout(() => {
        navigate("/result");
      }, 1000);
    } catch (error) {
      console.error("Failed to save photos:", error);
      showToast(t("camera.saveError"), "error");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-base-100 to-base-200 p-6">
      <div className="container mx-auto max-w-4xl">
        {/* 헤더 */}
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-primary mb-2 flex items-center justify-center gap-2">
            <CameraIcon fontSize="large" />
            {t("camera.title")}
          </h1>
          <p className="text-base-content/70">{t("camera.subtitle")}</p>
        </div>

        {/* 카메라 화면 */}
        <div className="card bg-base-100 shadow-2xl mb-6 overflow-hidden">
          <div className="card-body p-4">
            <div
              ref={containerRef}
              className="relative mx-auto rounded-xl overflow-hidden shadow-lg"
              style={{
                width: frameDimensions.width || "auto",
                height: frameDimensions.height || "auto",
                maxWidth: "500px",
                maxHeight: "70vh",
              }}
            >
              <video
                ref={videoRef}
                className="absolute top-0 left-0 w-full h-full object-cover"
                autoPlay
                playsInline
                style={{ transform: "scaleX(-1)" }}
              />
              {isCameraActive && images.length < 4 && (
                <img
                  ref={frameRef}
                  src={weatherFrames[weather][images.length]}
                  alt={`frame-${images.length + 1}`}
                  className="absolute top-0 left-0 w-full h-full pointer-events-none"
                  onLoad={(e) => {
                    if (!isFrameSizeSet.current) {
                      const img = e.currentTarget;
                      const maxWidth = 500;
                      const aspectRatio = img.naturalHeight / img.naturalWidth;
                      const width = Math.min(img.naturalWidth, maxWidth);
                      const height = width * aspectRatio;
                      setFrameDimensions({ width, height });
                      isFrameSizeSet.current = true;
                    }
                  }}
                />
              )}

              {images.length < 4 && (
                <div className="absolute bottom-4 left-0 right-0 text-center">
                  <div className="badge badge-lg badge-neutral shadow-lg">
                    {t("camera.cutLabel", {
                      current: images.length + 1,
                      total: 4,
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* 버튼 영역 */}
        <div className="flex justify-center gap-3 mb-6">
          <button
            className="btn btn-primary btn-lg shadow-lg hover:shadow-xl transition-all gap-2"
            onClick={takePhoto}
            disabled={images.length >= 4}
          >
            <PhotoCameraIcon className="h-6 w-6" />
            {t("camera.captureCount", { current: images.length, total: 4 })}
          </button>

          {images.length > 0 && (
            <button
              className="btn btn-outline btn-warning btn-lg shadow-lg hover:shadow-xl transition-all gap-2"
              onClick={resetPhotos}
            >
              <RestartAltIcon className="h-6 w-6" />
              {t("camera.retake")}
            </button>
          )}
        </div>

        {/* 촬영된 사진 프레임 */}
        {images.length > 0 && (
          <div className="card bg-base-100 shadow-2xl">
            <div className="card-body">
              <h3 className="card-title text-2xl justify-center mb-6">
                <CameraIcon className="text-primary" />
                {t("camera.capturedPhotos")}
                <div className="badge badge-primary badge-lg">
                  {t("camera.photoCount", { current: images.length, total: 4 })}
                </div>
              </h3>

              <div className="grid grid-cols-2 gap-4">
                {images.map((img, index) => (
                  <div key={index} className="relative group">
                    <div className="overflow-hidden rounded-lg shadow-md hover:shadow-xl transition-shadow">
                      <img
                        src={img}
                        className="w-full h-auto transform group-hover:scale-105 transition-transform"
                        alt={`captured-${index + 1}`}
                      />
                    </div>
                    <div className="absolute top-3 left-3 badge badge-primary badge-lg shadow-lg">
                      {index + 1}
                    </div>
                  </div>
                ))}

                {Array.from({ length: 4 - images.length }).map((_, index) => (
                  <div
                    key={`empty-${index}`}
                    className="aspect-3/4 bg-base-200 rounded-lg border-2 border-dashed border-base-content/20 flex flex-col items-center justify-center gap-2 hover:bg-base-300 transition-colors"
                  >
                    <PhotoCameraIcon
                      className="h-12 w-12 text-base-content/30"
                      sx={{ fontSize: 48 }}
                    />
                    <span className="text-base-content/40 text-lg font-semibold">
                      {images.length + index + 1}
                    </span>
                  </div>
                ))}
              </div>

              {images.length === 4 && (
                <div className="card-actions justify-center mt-6">
                  <button
                    className="btn btn-success btn-lg btn-wide shadow-lg hover:shadow-xl transition-all gap-2"
                    onClick={handleSavePhotos}
                    disabled={isSaving}
                  >
                    {isSaving ? (
                      <>
                        <span className="loading loading-spinner loading-md"></span>
                        {t("camera.saving")}
                      </>
                    ) : (
                      <>
                        <CheckCircleIcon className="h-6 w-6" />
                        {t("camera.complete")}
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
