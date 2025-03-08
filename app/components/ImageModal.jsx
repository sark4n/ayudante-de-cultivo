"use client";

import { useEffect, useState } from "react";

export default function ImageModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [imageSrc, setImageSrc] = useState(null);

  useEffect(() => {
    window.showImage = (src) => {
      setImageSrc(src);
      setIsOpen(true);
    };
    window.closeImageModal = () => setIsOpen(false);
  }, []);

  return (
    <div className={`modal ${isOpen ? "" : "hidden"}`}>
      <span className="close" onClick={() => setIsOpen(false)}>
        ×
      </span>
      <img src={imageSrc} alt="Imagen ampliada" />
    </div>
  );
}