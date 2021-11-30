import Gallery from "./Gallery";
import CompressedBitmap from "./CompressedBitmap";

// C16 Files
class CompressedGallery extends Gallery {
  constructor(jbinary) {
    super(jbinary);
  }

  InitBitmaps() {
    this.header = this.data.read("uint32");
    this.pixelFormat = this.header & 0x1;
    this.isCompressed = this.header & 0x2 === 1;
    this.count = this.data.read("uint16");

    console.assert(
      this.pixelFormat === 0 || this.pixelFormat === 1,
      "Pixel format is not correct"
    );

    this.bitmaps = [];

    for (let i = 0; i < this.count; i++) {
      this.bitmaps.push(new CompressedBitmap(this.pixelFormat));
      this.bitmaps[i].InitHeader(this.data, this.pixelFormat);
    }

    for (let i = 0; i < this.count; i++) {
      this.bitmaps[i].SetData(this.data);
    }
  }
}

export default CompressedGallery;
