import thumbnailQualities from "../predefined/ytThumbnailQualities";
import imgVs from "../img/img-vs.png";

export function YtLinkToValid(ytLink) {
  const curYTLink = ytLink;
  const YT_id_time = getYtId(curYTLink);
  const YTid = YT_id_time.videoId;
  if (YTid === "error") {
    return;
  }

  if (YT_id_time.timeVideo) ytLink = "//www.youtube.com/embed/" + YTid + "?t=" + YT_id_time.timeVideo;
  else ytLink = "//www.youtube.com/embed/" + YTid;
  return ytLink;
}

export function getYtThumbnail(url, quality) {
  const ytId = getYtId(url).videoId;
  return `https://img.youtube.com/vi/${ytId}/${!!quality ? quality : thumbnailQualities.mid}.jpg`;
}

export function getYtId(url) {
  try {
    let regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    let match = url.match(regExp);
    let timeVideo;

    if (match && match[2].length === 11 && match[0].indexOf("t=") !== -1) {
      timeVideo = match[0].split("t=")[1];
      return {
        videoId: match[2],
        timeVideo,
      };
    } else if (match && match[2].length === 11) {
      return {
        videoId: match[2],
        timeVideo: null,
      };
    } else {
      return "error";
    }
  } catch (err) {
    return "error";
  }
  // Get youtube video's id
}

// 3 functions below provide merging yt thumbnails into 1 in b64 format
const loadImage = (src) => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "Anonymous";
    img.onload = () => resolve(img);
    img.onerror = (err) => reject(err);
    img.src = src;
  });
};

const cropBlackBars = (ctx, img, topCrop, bottomCrop) => {
  const newHeight = img.height - topCrop - bottomCrop;
  ctx.drawImage(img, 0, topCrop, img.width, newHeight, 0, 0, img.width, newHeight);
};

export const createCover = async (url1, url2) => {
  const CORS_PROXY = "https://cors-anywhere.herokuapp.com/";

  const img1 = await loadImage(`${CORS_PROXY}${url1}`);
  const img2 = await loadImage(`${CORS_PROXY}${url2}`);
  const img3 = new Image();
  img3.src = imgVs; // Встановлення шляху до зображення

  const topCrop = 45; // Приблизно 45px зверху
  const bottomCrop = 45; // Приблизно 45px знизу
  const croppedHeight = img1.height - topCrop - bottomCrop;

  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  const width = img1.width + img2.width;
  const height = croppedHeight;

  canvas.width = width;
  canvas.height = height;

  // Обрізання і малювання першого зображення
  cropBlackBars(ctx, img1, topCrop, bottomCrop);

  // Обрізання і малювання другого зображення поруч з першим
  ctx.drawImage(img2, 0, topCrop, img2.width, croppedHeight, img1.width, 0, img2.width, croppedHeight);

  // Малювання третього зображення по центру
  return new Promise((resolve, reject) => {
    img3.onload = () => {
      const scaledHeight = 125; // висота картинки
      const scaledWidth = scaledHeight * 1.17; // ширина картинки (враховуючи її формат 1.17:1)
      const centerOffsetX = (width - scaledWidth) / 2; // Позиція по центру по ширині
      const centerOffsetY = (croppedHeight - scaledHeight) / 2; // Позиція по центру по висоті
      ctx.drawImage(img3, centerOffsetX, centerOffsetY, scaledWidth, scaledHeight); // Використовуємо масштабовану ширину та висоту
      resolve(canvas.toDataURL('image/png'));
    };
    img3.onerror = reject; // Обробка помилок завантаження зображення
  });
};
