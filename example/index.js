const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');
const files_input_field = document.querySelector('#files_input_field');

console.assert(c3_splash_blk.length > 0);

clbTools.loadBackground(c3_splash_blk)
.then(function (imgData) {
  canvas.width = imgData.width;
  canvas.height = imgData.height;
  ctx.putImageData(imgData, 0, 0);
});

canvas.onclick = function () {
  files_input_field.click();
};

function loadFile(evt) {
  clbTools.loadFileFromFileInput(evt.target.files[0]).then(function (imgData) {
    canvas.width = imgData.width;
    canvas.height = imgData.height;
    ctx.putImageData(imgData, 0, 0);
  });
}

files_input_field.onchange = loadFile;
