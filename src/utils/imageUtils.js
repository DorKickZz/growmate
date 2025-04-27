import pica from "pica";

export const createThumbnail = async (file, size = 300) => {
  const img = new Image();
  img.src = URL.createObjectURL(file);

  await new Promise((resolve) => {
    img.onload = resolve;
  });

  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  // Quadratisches Thumbnail
  const minSide = Math.min(img.width, img.height);
  const sx = (img.width - minSide) / 2;
  const sy = (img.height - minSide) / 2;

  canvas.width = size;
  canvas.height = size;

  const offscreenCanvas = document.createElement("canvas");
  offscreenCanvas.width = minSide;
  offscreenCanvas.height = minSide;
  const offCtx = offscreenCanvas.getContext("2d");
  offCtx.drawImage(img, sx, sy, minSide, minSide, 0, 0, minSide, minSide);

  const picaInstance = pica();
  await picaInstance.resize(offscreenCanvas, canvas);

  return new Promise((resolve) => {
    canvas.toBlob(resolve, "image/jpeg", 0.8); // 80% Qualität
  });
};
