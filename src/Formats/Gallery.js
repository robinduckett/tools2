import jBinary from "jbinary";
import jDataView from "jdataview";
import Bitmap from "./Bitmap";

// S16 Files
class Gallery {
  constructor(jbinary) {
    /** @type {jBinary} */
    this.data = new jBinary(jbinary, {
      "jBinary.littleEndian": true,
    });

    this.InitBitmaps();
  }

  InitBitmaps() {
    this.pixelFormat = this.data.read("uint32");
    this.count = this.data.read("uint16");

    console.assert(
      this.pixelFormat === 0 || this.pixelFormat === 1,
      "Pixel format is not correct"
    );

    this.bitmaps = [];

    for (let i = 0; i < this.count; i++) {
      this.bitmaps.push(new Bitmap(this.pixelFormat));
      this.bitmaps[i].InitHeader(this.data, this.pixelFormat, "S16");
    }

    for (let i = 0; i < this.count; i++) {
      this.bitmaps[i].SetData(this.data);
    }
  }

  DrawBitmap() {
    const maxHeight = Math.max.apply(null, this.bitmaps.map((item) => item.height));
    const sumWidth = this.bitmaps.reduce((p, c) => 
      p += c.width
    , 0);

    const arrayBuffer = new ArrayBuffer(sumWidth * maxHeight * 4);
    const dst = new Uint8ClampedArray(arrayBuffer);

    const bitsPerPixel = 4;

    let currentX = 0;

    for (let i = 0; i < this.count; i++) {
      const src = this.bitmaps[i].Draw();

      const screen_y_pos = 0;
      const screen_x_pos = currentX;

      const screenIndex = screen_x_pos + screen_y_pos;

      let offset = screenIndex;
      let len = maxHeight;

      while (len--) {
        if (
          (len * (this.bitmaps[i].width * bitsPerPixel) < src.length) &&
          (len * this.bitmaps[i].width * bitsPerPixel +
            this.bitmaps[i].width * bitsPerPixel <=
            src.length)
        ) {
          const srcData = src.slice(
            len * (this.bitmaps[i].width * bitsPerPixel),
            len * this.bitmaps[i].width * bitsPerPixel +
              this.bitmaps[i].width * bitsPerPixel
          );

          if (
            offset + len * sumWidth * bitsPerPixel <
            dst.length + srcData.length
          )
            dst.set(srcData, offset + len * sumWidth * bitsPerPixel);
        }
      }
      
      currentX += this.bitmaps[i].width * bitsPerPixel;
    }

    return new ImageData(dst, sumWidth, maxHeight);
  }
}

export default Gallery;
