import type { PhotoData } from "../types";
import DownloadIcon from "@mui/icons-material/Download";
import DeleteIcon from "@mui/icons-material/Delete";
import { useTranslation } from "react-i18next";

interface PhotoThumbnailProps {
  photo: PhotoData;
  composedImage?: string;
  onClick: () => void;
  onDownload: (e: React.MouseEvent, photo: PhotoData) => void;
  onDelete: (e: React.MouseEvent, photo: PhotoData) => void;
}

export default function PhotoThumbnail({
  photo,
  composedImage,
  onClick,
  onDownload,
  onDelete,
}: PhotoThumbnailProps) {
  const { t } = useTranslation();

  return (
    <div
      className="card bg-white transition-all cursor-pointer group"
      onClick={onClick}
    >
      <div className="card-body p-3">
        <figure className="aspect-3/4 overflow-hidden rounded-lg">
          {composedImage ? (
            <img
              src={composedImage}
              alt="Photo thumbnail"
              className="w-full h-full object-contain group-hover:scale-105 transition-transform"
            />
          ) : (
            <div className="grid grid-cols-2 gap-1">
              {photo.images.slice(0, 4).map((img, idx) => (
                <img
                  key={idx}
                  src={img}
                  alt={`thumbnail-${idx}`}
                  className="w-full aspect-square object-cover"
                />
              ))}
            </div>
          )}
        </figure>

        <div className="mt-2 space-y-1">
          <p className="text-xs text-base-content/60">
            {new Date(photo.createdAt).toLocaleDateString("ko-KR", {
              month: "short",
              day: "numeric",
            })}
          </p>
        </div>

        <div className="card-actions justify-end mt-2">
          <button
            onClick={(e) => onDownload(e, photo)}
            className="btn btn-ghost btn-xs gap-1"
            title={t("result.download")}
          >
            <DownloadIcon sx={{ fontSize: 14 }} />
          </button>
          <button
            onClick={(e) => onDelete(e, photo)}
            className="btn btn-ghost btn-xs gap-1 text-error"
            title={t("result.delete")}
          >
            <DeleteIcon sx={{ fontSize: 14 }} />
          </button>
        </div>
      </div>
    </div>
  );
}
