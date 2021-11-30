import jBinary from "jbinary";
import Bitmap from "./Bitmap";

import { P555_TO_RGB, P565_TO_RGB } from "./Common";

class CompressedBitmap extends Bitmap {
  InitHeader(/** @type {jBinary} **/ data, format) {
    this.pixelFormat = format;
    this.offset = data.read("uint32");
    this.width = data.read("uint16");
    this.height = data.read("uint16");
    this.offsets = [];
    this.offsets.push(this.offset);

    for (var heights = 0; heights < this.height - 1; heights++)
      this.offsets.push(data.read("uint32"));

    /** @type {jBinary} **/
    this.data = data;
  }

  SetPixel(x, y, pixels, { r, g, b }) {
    const i = y * this.width + x;
    pixels[i * 4] = r & 0xf8;
    pixels[i * 4 + 1] = g & 0xf8;
    pixels[i * 4 + 2] = b & 0xf8;
    pixels[i * 4 + 3] = 255;
  }

  Draw() {
    const sourceBytesPerPixel = 2;

    const arrayBuffer = new ArrayBuffer(this.width * this.height * 4);
    const pixels = new Uint8ClampedArray(arrayBuffer);

    for (let y = 0; y < this.height; y++) {
      let currentTag = -1;
      let seek_position = this.offsets[y];
      let pixel_position = 0;

      while (currentTag !== 0) {
        currentTag = this.data.read("uint16", seek_position);
        seek_position += sourceBytesPerPixel;

        const count = currentTag >> 1;
        const opaque = currentTag & 1;

        if (opaque) {
          for (let i = 0; i < count; i++) {
            const pixel = this.data.read(
              "uint16",
              seek_position + i * sourceBytesPerPixel
            );

            this.SetPixel(
              pixel_position + i,
              y,
              pixels,
              this.pixelFormat === 0 ? P555_TO_RGB(pixel) : P565_TO_RGB(pixel)
            );
          }

          seek_position += count * sourceBytesPerPixel;
        } else {
          for (let i = 0; i < count; i++) {
            this.SetPixel(pixel_position + i, y, pixels, { r: 0, g: 0, b: 0 });
          }
        }

        pixel_position += count;
      }
    }

    return pixels;
  }

  DrawBitmap() {
    return new ImageData(this.Draw(), this.width, this.height);
  }
}

export default CompressedBitmap;
