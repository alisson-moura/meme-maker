/* eslint-disable curly */
/* eslint-disable arrow-parens */
/* eslint-disable prefer-template */
/* eslint-disable no-unused-vars */
/* eslint-disable one-var */
/* eslint-disable linebreak-style */
const canvasTxt = window.canvasTxt.default;
const $imgActive = document.getElementById('active');
const $inputText = document.getElementById('text');
const $saveBtn = document.getElementById('saveBtn');
const $canvasPreview = document.getElementById('canvasPreview');
const $selectionTool = document.getElementById('selectionTool');
let texts = [];

let startX,
  startY,
  relativeStartX,
  relativeStartY,
  endX,
  endY,
  relativeEndX,
  relativeEndY,
  startSelection = false;

$canvasPreview.width = $imgActive.width;
$canvasPreview.height = $imgActive.height;
const ctxText = $canvasPreview.getContext('2d');

const events = {
  mousedown(e) {
    const {
      clientX,
      clientY,
      offsetX,
      offsetY,
    } = e;
    relativeStartX = offsetX;
    relativeStartY = offsetY;
    startX = clientX;
    startY = clientY;
    startSelection = true;
    $inputText.value = '';
  },
  mousemove(e) {
    endX = e.clientX;
    endY = e.clientY;

    if (startSelection) {
      $selectionTool.style.display = 'initial';
      $selectionTool.style.top = startY + 'px';
      $selectionTool.style.left = startX + 'px';

      $selectionTool.style.width = (endX - startX) + 'px';
      $selectionTool.style.height = (endY - startY) + 'px';
    }
  },
  mouseup(e) {
    startSelection = false;
    relativeEndX = e.layerX;
    relativeEndY = e.layerY;
    $inputText.focus();
  },
};

Object.keys(events)
  .forEach(eventName => $canvasPreview.addEventListener(eventName, events[eventName]));

const drawText = (text, ctx, actualX, actualY, selectionWidth, selectionHeight) => {
  ctx.fillStyle = 'black';
  canvasTxt.font = 'Prompt';
  canvasTxt.fontWeight = 'bold';
  canvasTxt.fontSize = 30;
  canvasTxt.justify = false;
  canvasTxt.drawText(ctx, text, actualX, actualY, selectionWidth, selectionHeight);
};

const insertText = e => {
  const selectionWidth = Number($selectionTool.style.width.replace('px', ''));
  const selectionHeight = Number($selectionTool.style.height.replace('px', ''));
  const index = texts.findIndex(i => i.relativeStartX == relativeStartX);

  if (index == -1) texts.push({
    relativeStartX,
    relativeStartY,
    selectionWidth,
    selectionHeight,
    text: e.target.value,
  });
  else texts[index].text = e.target.value;

  ctxText.clearRect(relativeStartX, relativeStartY, selectionWidth, selectionHeight);
  drawText(e.target.value, ctxText, relativeStartX, relativeStartY, selectionWidth, selectionHeight);
};
$inputText.addEventListener('keyup', insertText);

const clearAll = () => {
  $inputText.value = '';
  $selectionTool.style.display = 'none';
  texts = [];
  ctxText.clearRect(0, 0, $canvasPreview.width, $canvasPreview.height);
};
$imgActive.addEventListener('load', clearAll);

const saveMeme = (e) => {
  const imageWidth = $imgActive.naturalWidth;
  const imageHeight = $imgActive.naturalHeight;
  const { width: previewWidth, height: previewHeight } = $imgActive;
  const widthFactor = imageWidth / previewWidth;
  const heigthFactor = imageHeight / previewHeight;
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');

  canvas.width = imageWidth;
  canvas.height = imageHeight;
  ctx.clearRect(0, 0, imageWidth, imageHeight);
  ctx.drawImage($imgActive, 0, 0);

  texts.forEach(text => {
    const [croppedWidth, croppedHeight] = [
      (widthFactor * text.selectionWidth),
      (heigthFactor * text.selectionHeight),
    ];
    const [actualX, actualY] = [
      (text.relativeStartX * widthFactor),
      (text.relativeStartY * heigthFactor),
    ];
    drawText(text.text, ctx, actualX, actualY, croppedWidth, croppedHeight);
  });
  const img = canvas.toDataURL();
  const link = document.createElement('a');
  link.href = img;
  link.download = 'meme.png';
  link.click();
  clearAll();
};
$saveBtn.addEventListener('click', saveMeme);
