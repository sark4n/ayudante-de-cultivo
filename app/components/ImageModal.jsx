"use client";

import { useEffect, useState } from 'react';

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
    <div id="imageModal" className={`modal fixed inset-0 bg-black bg-opacity-80 z-50 ${isOpen ? '' : 'hidden'}`}>
      <span className="close absolute top-15 right-35 text-white text-40 font-bold cursor-pointer" onClick={() => setIsOpen(false)}>
        ×
      </span>
      <img src={imageSrc} alt="Imagen ampliada" className="block mx-auto mt-50 max-w-90 max-h-80vh" />
    </div>
  );
}