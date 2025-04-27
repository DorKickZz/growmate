// src/utils/imageUtils.js
import exifr from 'exifr'; // 📸 Neu: EXIF-Daten auslesen

export async function createThumbnail(file, maxSize = 400) {
  return new Promise(async (resolve, reject) => {
    try {
      const img = new Image();
      const reader = new FileReader();

      reader.onload = async (e) => {
        img.src = e.target.result;

        img.onload = async () => {
          const orientation = await exifr.orientation(file) || 1; // EXIF-Orientation auslesen
          const canvas = document.createElement("canvas");
          const ctx = canvas.getContext("2d");

          let width = img.width;
          let height = img.height;

          // Seitenverhältnis beibehalten
          if (width > height) {
            if (width > maxSize) {
              height *= maxSize / width;
              width = maxSize;
            }
          } else {
            if (height > maxSize) {
              width *= maxSize / height;
              height = maxSize;
            }
          }

          // Je nach Orientation drehen
          if (orientation > 4) {
            canvas.width = height;
            canvas.height = width;
          } else {
            canvas.width = width;
            canvas.height = height;
          }

          switch (orientation) {
            case 2:
              ctx.transform(-1, 0, 0, 1, width, 0); break;              // horizontal flip
            case 3:
              ctx.transform(-1, 0, 0, -1, width, height); break;        // 180°
            case 4:
              ctx.transform(1, 0, 0, -1, 0, height); break;             // vertical flip
            case 5:
              ctx.transform(0, 1, 1, 0, 0, 0); break;                   // transpose
            case 6:
              ctx.transform(0, 1, -1, 0, height, 0); break;             // 90° CW
            case 7:
              ctx.transform(0, -1, -1, 0, height, width); break;        // transverse
            case 8:
              ctx.transform(0, -1, 1, 0, 0, width); break;              // 90° CCW
            default:
              ctx.transform(1, 0, 0, 1, 0, 0); break;                   // keine Drehung
          }

          ctx.drawImage(img, 0, 0, width, height);

          canvas.toBlob((blob) => {
            resolve(blob);
          }, 'image/jpeg', 0.8);
        };
      };

      reader.onerror = (error) => reject(error);
      reader.readAsDataURL(file);
    } catch (err) {
      reject(err);
    }
  });
}
