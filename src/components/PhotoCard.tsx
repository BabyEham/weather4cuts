import { useState } from "react";
import { useTranslation } from "react-i18next";
import type { PhotoData } from "../types";
import EditIcon from "@mui/icons-material/Edit";
import DownloadIcon from "@mui/icons-material/Download";
import DeleteIcon from "@mui/icons-material/Delete";
import CheckIcon from "@mui/icons-material/Check";
import CreateIcon from "@mui/icons-material/Create";

interface PhotoCardProps {
  photo: PhotoData;
  composedImage: string;
  onUpdate: (photoId: string, caption: string) => Promise<void>;
  onDownload: (photo: PhotoData) => void;
  onDelete: (photo: PhotoData) => void;
}

export default function PhotoCard({
  photo,
  composedImage,
  onUpdate,
  onDownload,
  onDelete,
}: PhotoCardProps) {
  const { t } = useTranslation();
  const [isEditing, setIsEditing] = useState(false);
  const [caption, setCaption] = useState(photo.caption || "");

  const handleSave = async () => {
    await onUpdate(photo.id, caption);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setCaption(photo.caption || "");
    setIsEditing(false);
  };

  return (
    <div className="card bg-white mx-auto" style={{ maxWidth: "500px" }}>
      <div className="card-body p-4">
        <div className="mb-4">
          {composedImage ? (
            <div className="relative overflow-hidden rounded-lg">
              <img
                src={composedImage}
                alt="Latest 4-cut photo strip"
                className="w-full h-auto object-contain"
                style={{ maxHeight: "80vh" }}
              />
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-2">
              {photo.images.map((imageUrl, index) => (
                <div
                  key={index}
                  className="relative aspect-square overflow-hidden rounded-lg"
                >
                  <img
                    src={imageUrl}
                    alt={`photo-${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-2 right-2 badge badge-primary badge-sm">
                    {index + 1}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-base-content/60">
              {new Date(photo.createdAt).toLocaleDateString("ko-KR", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </span>
          </div>

          {isEditing ? (
            <div className="space-y-2">
              <label className="label">
                <span className="label-text flex items-center gap-2">
                  <CreateIcon fontSize="small" />
                  프레임 하단에 표시될 멘트
                </span>
              </label>
              <textarea
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                className="textarea textarea-bordered w-full resize-none"
                rows={2}
                placeholder={t("result.captionPlaceholder")}
                maxLength={50}
              />
              <div className="flex gap-2">
                <button
                  onClick={handleSave}
                  className="btn btn-success btn-sm flex-1 gap-2"
                >
                  <CheckIcon fontSize="small" />
                  {t("result.save")}
                </button>
                <button
                  onClick={handleCancel}
                  className="btn btn-ghost btn-sm flex-1"
                >
                  {t("result.cancel")}
                </button>
              </div>
            </div>
          ) : (
            <div className="card-actions justify-between pt-2">
              <div className="flex gap-2">
                <button
                  onClick={() => setIsEditing(true)}
                  className="btn btn-primary btn-sm gap-2"
                >
                  <EditIcon fontSize="small" />
                  {t("result.edit")}
                </button>
                <button
                  onClick={() => onDownload(photo)}
                  className="btn btn-success btn-sm gap-2"
                >
                  <DownloadIcon fontSize="small" />
                  {t("result.download")}
                </button>
              </div>
              <button
                onClick={() => onDelete(photo)}
                className="btn btn-error btn-sm gap-2"
              >
                <DeleteIcon fontSize="small" />
                {t("result.delete")}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
