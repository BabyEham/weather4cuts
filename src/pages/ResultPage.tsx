import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { useTranslation } from "react-i18next";
import {
  fetchRecentPhotos,
  updateCaption,
  deletePhotoData,
} from "../services/localStorageService";
import type { PhotoData } from "../types";
import { showToast } from "../utils/toastUtil";
import { composePhotoStrip } from "../utils/imageComposer";
import HomeIcon from "@mui/icons-material/Home";
import CameraAltIcon from "@mui/icons-material/CameraAlt";
import ImageIcon from "@mui/icons-material/Image";
import PhotoCard from "../components/PhotoCard";
import PhotoThumbnail from "../components/PhotoThumbnail";

export default function ResultPage() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [photos, setPhotos] = useState<PhotoData[]>([]);
  const [composedImages, setComposedImages] = useState<Record<string, string>>(
    {}
  );
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadPhotos();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadPhotos = async () => {
    try {
      setIsLoading(true);
      const photoList = await fetchRecentPhotos(20);
      setPhotos(photoList);

      const composed: Record<string, string> = {};
      for (const photo of photoList) {
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
      console.error("Failed to load photos:", error);
      showToast(t("result.loadError"), "error");
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateCaption = async (photoId: string, caption: string) => {
    try {
      await updateCaption(photoId, caption);

      const updatedPhotos = photos.map((photo) =>
        photo.id === photoId ? { ...photo, caption } : photo
      );
      setPhotos(updatedPhotos);

      const updatedPhoto = updatedPhotos.find((p) => p.id === photoId);
      if (updatedPhoto) {
        const composedImage = await composePhotoStrip(
          updatedPhoto.images,
          updatedPhoto.weather as "sunny" | "cloudy" | "rainy" | "snowy",
          caption
        );
        setComposedImages((prev) => ({ ...prev, [photoId]: composedImage }));
      }

      showToast(t("result.captionUpdated"), "success");
    } catch (error) {
      console.error("Failed to update caption:", error);
      showToast(t("result.captionUpdateError"), "error");
    }
  };

  const handleDelete = async (photo: PhotoData) => {
    if (!confirm(t("result.deleteConfirm"))) return;

    try {
      await deletePhotoData(photo.id);
      setPhotos(photos.filter((p) => p.id !== photo.id));
      showToast(t("result.photoDeleted"), "success");
    } catch (error) {
      console.error("Failed to delete photo:", error);
      showToast(t("result.photoDeleteError"), "error");
    }
  };

  const handleDownload = (photo: PhotoData) => {
    const imageUrl = composedImages[photo.id];
    if (!imageUrl) {
      showToast(t("result.downloadError"), "error");
      return;
    }

    try {
      const link = document.createElement("a");
      link.href = imageUrl;
      link.download = `weather4cuts_${photo.weather}_${
        new Date(photo.createdAt).toISOString().split("T")[0]
      }.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      showToast(t("result.downloadSuccess"), "success");
    } catch (error) {
      console.error("Download failed:", error);
      showToast(t("result.downloadError"), "error");
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-base-300 flex items-center justify-center">
        <div className="card bg-white">
          <div className="card-body items-center text-center">
            <span className="loading loading-spinner loading-lg text-primary"></span>
            <p className="mt-4 text-base-content/70">{t("result.loading")}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-base-300">
      <div className="max-w-6xl mx-auto">
        <div className="absolute top-6 left-6">
          <button
            onClick={() => navigate("/")}
            className="btn btn-circle btn-ghost bg-white hover:bg-white/80"
            aria-label="홈으로 가기"
          >
            <HomeIcon />
          </button>
        </div>

        <div className="px-6 pt-6 pb-6">
          {photos.length === 0 ? (
            <div className="card bg-white">
              <div className="card-body items-center text-center py-16">
                <ImageIcon
                  className="h-24 w-24 text-base-content/30 mb-6"
                  sx={{ fontSize: 96 }}
                />
                <p className="text-base-content/70 text-lg mb-6">
                  {t("result.noPhotos")}
                </p>
                <button
                  onClick={() => navigate("/camera")}
                  className="btn btn-primary btn-lg gap-2"
                >
                  <CameraAltIcon className="h-6 w-6" />
                  {t("result.firstPhoto")}
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-8">
              {photos.length > 0 && (
                <PhotoCard
                  photo={photos[0]}
                  composedImage={composedImages[photos[0].id]}
                  onUpdate={handleUpdateCaption}
                  onDownload={handleDownload}
                  onDelete={handleDelete}
                />
              )}

              {photos.length > 1 && (
                <div>
                  <h2 className="text-2xl font-bold text-base-content mb-4">
                    {t("result.previousPhotos")}
                  </h2>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {photos.slice(1).map((photo) => (
                      <PhotoThumbnail
                        key={photo.id}
                        photo={photo}
                        composedImage={composedImages[photo.id]}
                        onClick={() => {
                          const reorderedPhotos = [
                            photo,
                            ...photos.filter((p) => p.id !== photo.id),
                          ];
                          setPhotos(reorderedPhotos);
                        }}
                        onDownload={(e, p) => {
                          e.stopPropagation();
                          handleDownload(p);
                        }}
                        onDelete={(e, p) => {
                          e.stopPropagation();
                          handleDelete(p);
                        }}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
