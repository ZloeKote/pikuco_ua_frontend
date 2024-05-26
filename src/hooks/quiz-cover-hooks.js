import imgVs from "../img/img-vs.png";
import placeholder1 from "../img/placeholder1.jpg";
import placeholder2 from "../img/placeholder2.jpg";

export const getPlaceholderCover = async () => {
  const img1 = new Image();
  const img2 = new Image();
  const img3 = new Image();
  img1.src = placeholder1;
  img2.src = placeholder2;
  img3.src = imgVs;

  const topCrop = 45; // Приблизно 45px зверху
  const bottomCrop = 45; // Приблизно 45px знизу
  const croppedHeight = img1.height - topCrop - bottomCrop;

  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  const width = img1.width + img2.width;
  const height = croppedHeight;

  canvas.width = width;
  canvas.height = height;

  ctx.drawImage(img1, 0, topCrop, img1.width, height, 0, 0, img1.width, height);
  ctx.drawImage(img2, 0, topCrop, img2.width, croppedHeight, img1.width, 0, img2.width, croppedHeight);

  // Малювання третього зображення по центру
  return new Promise((resolve, reject) => {
    img3.onload = () => {
      const scaledHeight = 125; // висота картинки
      const scaledWidth = scaledHeight * 1.17; // ширина картинки (враховуючи її формат 1.17:1)
      const centerOffsetX = (width - scaledWidth) / 2; // Позиція по центру по ширині
      const centerOffsetY = (croppedHeight - scaledHeight) / 2; // Позиція по центру по висоті
      ctx.drawImage(img3, centerOffsetX, centerOffsetY, scaledWidth, scaledHeight); // Використовуємо масштабовану ширину та висоту
      resolve(canvas.toDataURL("image/png"));
    };
    img3.onerror = reject; // Обробка помилок завантаження зображення
  });
};
