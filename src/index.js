import jBinary from "jbinary";

import Gallery from "./Formats/Gallery";
import BackgroundGallery from "./Formats/BackgroundGallery";
import CompressedGallery from "./Formats/CompressedGallery";

export const loadFromFileInput = async (file) => {
  if (typeof file["name"] !== "undefined") {
    return loadFromData(file, file.name.substr(-3).toUpperCase())
  } else {
    throw "Needs to be a File/Blob object";
  }
};

export const loadFromData = async (data, type = "S16") => {
  switch (type) {
    case "S16":
      return loadGallery(data);
    case "C16":
      return loadCompressedGallery(data);
    case "BLK":
      return loadBackgroundGallery(data);
    default:
      throw "Needs to specify a gallery type";
  }
};

export const loadBackgroundGallery = async (file) => {
  const blk = await jBinary.loadData(file);
  return new BackgroundGallery(blk);
};

export const loadGallery = async (file) => {
  const s16 = await jBinary.loadData(file);
  return new Gallery(s16);
};

export const loadCompressedGallery = async (file) => {
  const c16 = await jBinary.loadData(file);
  return new CompressedGallery(c16);
};
