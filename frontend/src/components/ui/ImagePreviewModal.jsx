import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "../../utils/cn";

export default function ImagePreviewModal({
  isOpen,
  onClose,
  images = [],
  initialIndex = 0,
}) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);

  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    if (isOpen) setCurrentIndex(initialIndex);
  }, [isOpen, initialIndex]);

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const currentImage = images[currentIndex];

  if (!currentImage) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/90 backdrop-blur-sm"
            onClick={onClose}
          />

          <button
            onClick={onClose}
            className="absolute right-4 top-4 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors"
          >
            <X strokeWidth={1.75} className="h-5 w-5" />
          </button>

          {images.length > 1 && (
            <>
              <button
                onClick={handlePrev}
                className="absolute left-4 z-10 flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors"
              >
                <ChevronLeft strokeWidth={1.75} className="h-6 w-6" />
              </button>
              <button
                onClick={handleNext}
                className="absolute right-4 z-10 flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors"
              >
                <ChevronRight strokeWidth={1.75} className="h-6 w-6" />
              </button>
            </>
          )}

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="relative z-10 max-h-[85vh] max-w-[85vw]"
          >
            <img
              src={currentImage.url}
              alt={`Preview ${currentIndex + 1}`}
              className="max-h-[85vh] max-w-[85vw] rounded-card object-contain"
            />
          </motion.div>

          {images.length > 1 && (
            <div className="absolute bottom-6 left-1/2 z-10 flex -translate-x-1/2 gap-2">
              {images.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentIndex(i)}
                  className={cn(
                    "h-2.5 w-2.5 rounded-full transition-all",
                    i === currentIndex
                      ? "bg-white scale-110"
                      : "bg-white/40 hover:bg-white/60"
                  )}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </AnimatePresence>
  );
}
