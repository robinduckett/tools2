import jBinary from "jbinary";

import {
  P555_TO_RGB,
  P565_TO_RGB
} from './Common';

class Bitmap {
  InitHeader(/** @type {jBinary} **/ data, format, type = 'S16') {
    this.pixelFormat = format;
    this.offset = data.read("uint32");
    this.width = data.read("uint16");
    this.height = data.read("uint16");

    // Hack because it seems like BLK files don't draw properly ? All other filetypes work fine.
    if (type === 'BLK') {
      this.offset += 4;
    }

    /** @type {jBinary} **/
    this.data = data;

    console.assert(this.offset < this.data.view.byteLength, 'offset is greater than data view bytelength');
  }

  SetData(data) {
    /** @type {jBinary} **/ this.data = data;
  }

  Draw() {
    const arrayBuffer = new ArrayBuffer(this.width * this.height * 4);
    const pixels = new Uint8ClampedArray(arrayBuffer);

    for (let x = 0; x < this.width; x++) {
      for (let y = 0; y < this.height; y++) {
        let i = this.width * y + x;

        let rgb;
        /** @type {jBinary} **/ const pixel = this.data.read(
          "uint16",
          this.offset + (i * 2)
        );

        if (this.pixelFormat === 0) {
          rgb = P555_TO_RGB(pixel);
        } else {
          rgb = P565_TO_RGB(pixel);
        }

        const { r, g, b } = rgb;

        pixels[i * 4] = r & 0xf8;
        pixels[i * 4 + 1] = g & 0xf8;
        pixels[i * 4 + 2] = b & 0xf8;
        pixels[i * 4 + 3] = 255;
      }
    }

    return pixels;
  }

  DrawBitmap() {
    return new ImageData(this.Draw(), this.width, this.height);
  }
}

export default Bitmap;
