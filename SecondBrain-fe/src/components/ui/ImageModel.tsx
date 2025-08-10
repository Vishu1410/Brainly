// components/ImageModal.tsx
import { useEffect } from "react";

type Props = {
  src: string;
  alt?: string;
  onClose: () => void;
};

export default function ImageModal({ src, alt = "", onClose }: Props) {
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", handleEsc);
    return () => document.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70"
      onClick={onClose}
    >
      <img
        src={src}
        alt={alt}
        className="max-h-[90vh] max-w-[90vw] rounded-lg shadow-lg"
        onClick={(e) => e.stopPropagation()}
      />
    </div>
  );
}
