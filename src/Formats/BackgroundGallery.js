import Bitmap from "./Bitmap";
import Gallery from "./Gallery";

// BLK Files
class BackgroundGallery extends Gallery {
  constructor(jbinary) {
    super(jbinary);
  }

  InitBitmaps() {
    this.pixelFormat = this.data.read('uint32');
    this.tileWidth = this.data.read('uint16');
    this.tileHeight = this.data.read('uint16');
    this.count = this.data.read('uint16');

    console.assert(this.pixelFormat === 0 || this.pixelFormat === 1, 'Pixel format is not correct');

    this.bitmaps = [];

    for (let i = 0; i < this.count; i++) {
      this.bitmaps.push(new Bitmap(this.pixelFormat));
      this.bitmaps[i].InitHeader(this.data, this.pixelFormat, "BLK");
    }

    for (let i = 0; i < this.count; i++) {
      this.bitmaps[i].SetData(this.data);
    }
  }

  DrawBitmap() {
    const bitmapWidth = this.bitmaps[0].width;
    const bitmapHeight = this.bitmaps[0].height;
    const width = this.tileWidth * bitmapWidth;
    const height = this.tileHeight * bitmapHeight;

    const arrayBuffer = new ArrayBuffer(width * height * 4);
    const dst = new Uint8ClampedArray(arrayBuffer);

    const bitsPerPixel = 4;

    let nextSet = 0;
    let i = 0;

    for (let tileY = 0; tileY < this.tileHeight; tileY++) {
      i = nextSet;

      for (let tileX = 0; tileX < this.tileWidth; tileX++) {

        /** @type {Uint8ClampedArray} */
        const src = this.bitmaps[i].Draw();

        const screen_y_pos = tileY * bitmapHeight * width * bitsPerPixel;
        const screen_x_pos = tileX * bitmapWidth * bitsPerPixel;

        const screenIndex = screen_x_pos + screen_y_pos;
        dst[screenIndex] = 255;
        dst[screenIndex + 1] = 0;
        dst[screenIndex + 2] = 0;
        dst[screenIndex + 3] = 255;

        let offset = screenIndex;
        let len = bitmapHeight;

        while (len--) {
          const srcData = src.slice(
            len * (bitmapWidth * bitsPerPixel),
            len * bitmapWidth * bitsPerPixel + bitmapWidth * bitsPerPixel
          );
          
          if (offset + len * width * bitsPerPixel < dst.length + srcData.length)
            dst.set(srcData, offset + len * width * bitsPerPixel);
        }

        i += this.tileHeight;
      }

      nextSet++;
    }

    return new ImageData(dst, width, height);
  }
}

export default BackgroundGallery;
