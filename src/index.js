import jBinary from "jbinary";

import BackgroundGallery from "./Formats/BackgroundGallery";
import Bitmap from "./Formats/Bitmap";

export const loadFileFromFileInput = async (file) => {
  if (typeof file["name"] !== "undefined") {
    if (file.name.substr(-3) === "blk") {
      const blk = await jBinary.loadData(file);
      const backgroundGallery = new BackgroundGallery(blk);
      return backgroundGallery.DrawBitmap();
    }

    if (file.name.substr(-3) === "s16") {
      const s16 = await jBinary.loadData(file);
      const bitmap = new Bitmap(s16);
      return bitmap.DrawBitmap();
    }
  }
};

export const loadBackground = async (file) => {
  const blk = await jBinary.loadData(file);
  const backgroundGallery = new BackgroundGallery(blk);
  return backgroundGallery.DrawBitmap();
};

export const loadSprite = async (file) => {
  const s16 = await jBinary.loadData(file);
  const bitmap = new Bitmap(s16);
  return bitmap.DrawBitmap();
};
