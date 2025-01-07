'use strict'

// put on the init onMemeEditor()
// click an img - Run memeController()

let gElCanvas
let gCtx

function onMemeEditor() {
  gElCanvas = document.querySelector('canvas')
  gCtx = gElCanvas.getContext('2d')

  // const meme = getMeme()

  // renderMeme(meme)
  // renderEditor(meme)

  // memeController()
}

function memeController() {
  const meme = getMeme()

  renderMeme(meme)
  renderEditor(meme)

  onNav('meme-editor')
}

function clearCanvas() {
  gCtx.clearRect(0, 0, gElCanvas.width, gElCanvas.height)
}

function renderMeme(meme) {
  const { selectedImgId, selectedLineIdx, lines } = meme

  const imgObj = gImgs.find((img) => img.id === selectedImgId)

  if (!imgObj) {
    console.error('Image not found')
    return
  }

  clearCanvas()

  const img = new Image()
  img.src = imgObj.url

  img.onload = () => {
    // Add image & texts on the Canvas
    drawImg(img)
    drawTxts(lines)
  }
}

function drawImg(img) {
  gElCanvas.height = (img.naturalHeight / img.naturalWidth) * gElCanvas.width

  gCtx.drawImage(img, 0, 0, gElCanvas.width, gElCanvas.height)
}

function drawTxts(lines) {
  lines.forEach(renderTxt)
}

function renderTxt(line) {
  const { txt, pos, size, color } = line

  // Add Text on the Canvas
  gCtx.font = `${size}px Arial`
  gCtx.fillStyle = color
  gCtx.strokeStyle = 'black'
  gCtx.lineWidth = 2
  gCtx.textAlign = 'center'

  // TODO - set the pos x & y
  const x = gElCanvas.width / 2
  const y = 50 // position on the top
  gCtx.fillText(txt, x, y)
  gCtx.strokeText(txt, x, y)
}

function renderEditor(meme) {
  const { lines } = meme
  const txt = lines[0].txt
  renderInputTxt(txt)
}

function renderInputTxt(txt) {
  const inputTxt = document.querySelector('.input-txt')
  inputTxt.value = txt
}

function onDownload(elLink) {
  const imgContent = gElCanvas.toDataURL('image/jpeg')
  elLink.href = imgContent
}

function onColor(ElColor){

}