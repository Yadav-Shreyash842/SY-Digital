import { useState, useRef, useCallback } from "react";
import { Upload, X, Film, Image } from "lucide-react";
import { cn } from "../../utils/cn";
import ProgressBar from "./ProgressBar";

export default function FileDropZone({
  accept = "image/*",
  label = "Upload File",
  preview,
  uploading = false,
  uploadProgress = 0,
  onFile,
  onRemove,
  error,
  hint,
}) {
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef(null);

  const isImage = accept.includes("image");
  const isVideo = accept.includes("video");

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback(
    (e) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);

      const file = e.dataTransfer.files?.[0];
      if (file) {
        onFile?.(file);
      }
    },
    [onFile]
  );

  const handleClick = () => {
    inputRef.current?.click();
  };

  const handleInputChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      onFile?.(file);
    }
    e.target.value = "";
  };

  if (preview) {
    return (
        <div className="space-y-3">
          <label className="text-sm font-medium text-text-secondary">{label}</label>
        <div className="relative group">
          {isVideo ? (
            <video
              controls
              className="w-full rounded-2xl border border-gray-200"
            >
              <source src={preview} />
            </video>
          ) : (
            <img
              src={preview}
              alt="Preview"
              className="h-48 w-full rounded-2xl object-cover border border-gray-200"
            />
          )}

          {uploading && (
            <div className="absolute inset-0 flex flex-col items-center justify-center rounded-2xl bg-black/50">
              <ProgressBar value={uploadProgress} className="w-3/4" />
              <p className="mt-2 text-sm font-medium text-white">
                Uploading... {uploadProgress}%
              </p>
            </div>
          )}

          {!uploading && (
            <button
              type="button"
              onClick={onRemove}
              className="absolute top-3 right-3 flex h-8 w-8 items-center justify-center rounded-full bg-danger text-white opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
            >
              <X strokeWidth={2} className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {label && (
        <label className="text-sm font-medium text-text-secondary">{label}</label>
      )}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={handleClick}
        className={cn(
          "flex cursor-pointer flex-col items-center justify-center rounded-card border-2 border-dashed px-6 py-10 transition-all",
          isDragging
            ? "border-primary bg-primary/5"
            : "border-border hover:border-white/20 hover:bg-white/[0.02]",
          error && "border-danger"
        )}
      >
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          onChange={handleInputChange}
          className="hidden"
        />

        <div
          className={cn(
            "mb-4 flex h-14 w-14 items-center justify-center rounded-btn",
            isDragging ? "bg-primary/10" : "bg-white/5"
          )}
        >
          {isImage && (
            <Image
              strokeWidth={1.75}
              className={cn(
                "h-7 w-7",
                isDragging ? "text-primary" : "text-text-muted"
              )}
            />
          )}
          {isVideo && (
            <Film
              strokeWidth={1.75}
              className={cn(
                "h-7 w-7",
                isDragging ? "text-primary" : "text-text-muted"
              )}
            />
          )}
          {!isImage && !isVideo && (
            <Upload
              strokeWidth={1.75}
              className={cn(
                "h-7 w-7",
                isDragging ? "text-primary" : "text-text-muted"
              )}
            />
          )}
        </div>

        <p className="text-sm font-medium text-text-secondary">
          {isDragging ? "Drop file here" : "Drag & drop or click to browse"}
        </p>
        <p className="mt-1 text-xs text-text-muted">
          {isImage && "PNG, JPG, GIF, WebP (max 5MB)"}
          {isVideo && "MP4, WebM, MOV (max 100MB)"}
          {!isImage && !isVideo && "Select a file to upload"}
        </p>
      </div>

      {uploading && (
        <div className="space-y-2">
          <ProgressBar value={uploadProgress} />
          <p className="text-xs text-text-muted">
            Uploading... {uploadProgress}%
          </p>
        </div>
      )}

      {error && <p className="text-sm text-danger">{error}</p>}
      {hint && !error && <p className="text-sm text-text-muted">{hint}</p>}
    </div>
  );
}
