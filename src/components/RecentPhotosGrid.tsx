import { useNavigate } from "react-router";
import { useTranslation } from "react-i18next";
import type { PhotoData } from "../types";
import PhotoLibraryIcon from "@mui/icons-material/PhotoLibrary";
import ImageIcon from "@mui/icons-material/Image";

interface RecentPhotosGridProps {
  photos: PhotoData[];
  composedImages: Record<string, string>;
  isLoading: boolean;
  error: string | null;
}

export default function RecentPhotosGrid({
  photos,
  composedImages,
  isLoading,
  error,
}: RecentPhotosGridProps) {
  const navigate = useNavigate();
  const { t } = useTranslation();

  if (isLoading) {
    return (
      <div className="card bg-white">
        <div className="card-body">
          <h2 className="card-title flex items-center gap-2">
            <PhotoLibraryIcon />
            {t("home.recentPhotos")}
          </h2>
          <div className="flex items-center justify-center py-8">
            <span className="loading loading-spinner loading-lg text-primary"></span>
          </div>
        </div>
      </div>
    );
  }

  if (error || photos.length === 0) {
    return (
      <div className="card bg-white">
        <div className="card-body">
          <h2 className="card-title flex items-center gap-2">
            <PhotoLibraryIcon />
            {t("home.recentPhotos")}
          </h2>
          <div className="flex flex-col items-center justify-center py-8 text-base-content/60">
            <ImageIcon sx={{ fontSize: 48 }} className="mb-2" />
            <p>{t("home.noRecentPhotos")}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="card bg-white">
      <div className="card-body">
        <h2 className="card-title flex items-center gap-2">
          <PhotoLibraryIcon />
          {t("home.recentPhotos")}
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4">
          {photos.map((photo) => (
            <div
              key={photo.id}
              onClick={() => navigate("/result")}
              className="cursor-pointer group"
            >
              <div className="aspect-3/4 overflow-hidden rounded-lg">
                {composedImages[photo.id] ? (
                  <img
                    src={composedImages[photo.id]}
                    alt="Recent photo"
                    className="w-full h-full object-contain group-hover:scale-105 transition-transform"
                  />
                ) : (
                  <img
                    src={photo.images[0]}
                    alt="Recent photo"
                    className="w-full h-full object-contain group-hover:scale-105 transition-transform"
                  />
                )}
              </div>
              <p className="text-xs text-base-content/60 mt-1">
                {new Date(photo.createdAt).toLocaleDateString("ko-KR", {
                  month: "short",
                  day: "numeric",
                })}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
