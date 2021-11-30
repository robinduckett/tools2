const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');
const files_input_field = document.querySelector('#files_input_field');

console.assert(c3_splash_blk.length > 0);

clbTools.loadBackgroundGallery(c3_splash_blk)
.then(function (gallery) {
  const imgData = gallery.DrawBitmap();
  canvas.width = imgData.width;
  canvas.height = imgData.height;
  ctx.putImageData(imgData, 0, 0);
});

// clbTools.loadCompressedGallery(butterfly1_c16)
// .then(function (gallery) {
//   const imgData = gallery.DrawBitmap();
//   canvas.width = imgData.width;
//   canvas.height = imgData.height;
//   ctx.fillStyle = "red";
//   ctx.fillRect(0, 0, imgData.width, imgData.height);
//   // ctx.drawImage(imgData, 0, 0);
//   ctx.putImageData(imgData, 0, 0);
// });

canvas.onclick = function () {
  files_input_field.click();
};

function loadFile(evt) {
  clbTools.loadFromFileInput(evt.target.files[0])
  .then(function (gallery) {
    const imgData = gallery.DrawBitmap();
    canvas.width = imgData.width;
    canvas.height = imgData.height;
    ctx.putImageData(imgData, 0, 0);
  });
}

files_input_field.onchange = loadFile;
