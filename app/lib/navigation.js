"use client";

export function resizeImage(file, maxWidth, maxHeight) {
  return new Promise((resolve) => {
    const img = new Image();
    const reader = new FileReader();
    reader.onload = (e) => {
      img.src = e.target.result;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;
        if (width > height) {
          if (width > maxWidth) {
            height *= maxWidth / width;
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width *= maxHeight / height;
            height = maxHeight;
          }
        }
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL('image/jpeg', 0.95));
      };
    };
    reader.readAsDataURL(file);
  });
}

export function toggleDarkMode() {
  document.body.classList.toggle('dark');
}

export function showTipOfTheDay() {
  const tips = [
    "Mantén la humedad entre 40-60% durante la fase vegetativa.",
    "Riega tus plantas cuando la capa superior del sustrato esté seca.",
    "Asegúrate de que tus plantas reciban al menos 18 horas de luz en la fase vegetativa.",
    "Revisa el pH del agua: debe estar entre 6.0 y 7.0 para un crecimiento óptimo.",
    "Poda las hojas inferiores para mejorar la ventilación y evitar hongos."
  ];
  const today = new Date();
  const dayOfYear = Math.floor((today - new Date(today.getFullYear(), 0, 0)) / 1000 / 60 / 60 / 24);
  const tipIndex = dayOfYear % tips.length;
  const tipText = document.getElementById('tipText');
  if (tipText) {
    tipText.textContent = tips[tipIndex];
  }
}