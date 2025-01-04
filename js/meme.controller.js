'use strict'

// put on the init onMemeEditor()
// click an img - Run memeController()

let gCanvas
let gCtx

onMemeEditor()

function onMemeEditor() {
  gCanvas = document.querySelector('.meme-editor')
  gCtx = gCanvas.getContext('2d')

  //   clearCanvas()
  memeController()
}

function memeController() {
  const imageTest = document.querySelector('.image-test')

  clearCanvas()
  renderMeme(imageTest, 'text here')
}

function renderMeme(img, txt) {
  // Add image on the Canvas
  gCtx.drawImage(img, 0, 0, gCanvas.width, gCanvas.height)

  // Add Text on the Canvas
  gCtx.font = '30px Arial'
  gCtx.fillStyle = 'white'
  gCtx.strokeStyle = 'black'
  gCtx.lineWidth = 2
  gCtx.textAlign = 'center'
  const x = gCanvas.width / 2
  const y = 50 // position on the top
  gCtx.fillText(txt, x, y)
  gCtx.strokeText(txt, x, y)
}

function clearCanvas() {
  gCtx.clearRect(0, 0, gCanvas.width, gCanvas.height)
}
