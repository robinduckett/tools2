const test = [
  [32, 11, 0xaabbcc, 0xaabbcc, 0xaabbcc, 0xaabbcc, 0xaabbcc, 0],
  [32, 11, 0xaabbcc, 0xaabbcc, 0xaabbcc, 0xaabbcc, 0xaabbcc, 0],
  [32, 11, 0xaabbcc, 0xaabbcc, 0xaabbcc, 0xaabbcc, 0xaabbcc, 0],
  [32, 11, 0xaabbcc, 0xaabbcc, 0xaabbcc, 0xaabbcc, 0xaabbcc, 0],
  [32, 11, 0xaabbcc, 0xaabbcc, 0xaabbcc, 0xaabbcc, 0xaabbcc, 0],
  [32, 11, 0xaabbcc, 0xaabbcc, 0xaabbcc, 0xaabbcc, 0xaabbcc, 0],
  [11, 0xff0000, 0xff0000, 0xff0000, 0xff0000, 0xff0000, 32, 0],
  [11, 0xff0000, 0xff0000, 0xff0000, 0xff0000, 0xff0000, 32, 0],
  [11, 0xff0000, 0xff0000, 0xff0000, 0xff0000, 0xff0000, 32, 0],
  [11, 0xff0000, 0xff0000, 0xff0000, 0xff0000, 0xff0000, 32, 0],
  [11, 0xff0000, 0xff0000, 0xff0000, 0xff0000, 0xff0000, 32, 0],
  [11, 0xff0000, 0xff0000, 0xff0000, 0xff0000, 0xff0000, 32, 0],
];

const test_pixels = [];

function line_to_pixels(line, dy = 0) {
  let currentTag = -1;
  let seek_position = 0;
  let pixel_position = 0;

  while (currentTag != 0) {
    currentTag = line[dy][seek_position++];
    
    const count = currentTag >> 1;
    const opaque = currentTag & 1;

    if (opaque) {
      for (var i = 0; i < count; i++) {
        test_pixels[dy][pixel_position + i] = line[dy][seek_position + i];
      }

      seek_position += count;
    } else {
      for (var i = 0; i < count; i++) {
        test_pixels[dy][pixel_position + i] = 0;
      }
    }

    pixel_position += count;
  }
}

for (y = 0; y < 12; y++) {
  test_pixels.push([]);

  for (x = 0; x < 19; x++) {
    test_pixels[y].push(0);
  }
}

const dy = 7;
line_to_pixels(test, 7);

console.log(test_pixels[dy]);

line_to_pixels(test, 3);

console.log(test_pixels[3]);
