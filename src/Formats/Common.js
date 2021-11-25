export const P565_TO_RGB = (pixel) => ({
  r: ((pixel) >> 8),
  g: ((pixel) >> 3),
  b: ((pixel) << 3)
});

export const P555_TO_RGB = (pixel) => ({
  r: ((pixel) >> 7),
  g: ((pixel) >> 2),
  b: ((pixel) << 3)
});
