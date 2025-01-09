'use strict'

// put on the init onMemeEditor()
// click an img - Run memeController()

let gElCanvas
let gCtx

function onMemeEditor() {
  gElCanvas = document.querySelector('canvas')
  gCtx = gElCanvas.getContext('2d')

  addEvListeners()
  resizeCanvas()

  // const meme = getMeme()

  // renderMeme(meme)
  // renderEditor(meme)

  // memeController()
}

function addEvListeners() {
  gElCanvas.addEventListener('mouseout', onUp)

  addListeners(['mousedown', 'touchstart'], onDown)
  addListeners(['mousemove', 'touchmove'], onMove)
  addListeners(['mouseup', 'touchend'], onUp)

  window.addEventListener('resize', () => {
    resizeCanvas()
  })
}

function addListeners(evTypes, func) {
  evTypes.forEach((evType) => {
    gElCanvas.addEventListener(evType, func)
  })
}

function onDown(ev) {
  // get position
  // is it in the text frame?
  // set select - true

  const pos = getEvPos(ev)

  // check all the lines framePos
  console.log('gMeme.lines: ', gMeme.lines)

  // if (!isTxtClicked(pos)) {
  //   console.log('Txt NOT click: ')
  //   return
  // }

  if (!isTxtClicked(pos)) return

  const line = getLine()

  selectCurrentLine()

  memeController(false)

  document.body.style.cursor = 'pointer'
}

function onMove(ev) {
  const line = getLine()
  // change the position of the text
  if (!line.selected) return

  // document.body.style.cursor = 'grabbing'
}

function onUp(ev) {
  //something like that - isClicked? false => return

  // TODOs - check the bugs and fix them
  // check how to move the text without flicker the img
  
  const elInputTxt = document.querySelector('.input-txt')
  elInputTxt.focus()

  document.body.style.cursor = 'auto'

  console.log('gMeme.lines: ', gMeme.lines)
}

function getEvPos(ev) {
  const touchEvs = ['touchstart', 'touchmove', 'touchend']

  let pos = { x: ev.offsetX, y: ev.offsetY }

  if (touchEvs.includes(ev.type)) {
    ev.preventDefault()

    ev = ev.changedTouches[0]
    pos = {
      x: ev.pageX - ev.target.offsetLeft - ev.target.clientLeft,
      y: ev.pageY - ev.target.offsetTop - ev.target.clientTop
    }
  }

  return pos
}

function resizeCanvas() {
  const elMeme = document.querySelector('.meme')
  gElCanvas.width = elMeme.offsetWidth
  gElCanvas.height = elMeme.offsetHeight
}

function memeController(isNav = true) {
  const meme = getMeme()

  renderMeme(meme)
  renderEditor(meme)

  if (isNav) onNav('meme-editor')
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
    renderTxts(lines)
  }
}

function drawImg(img) {
  gElCanvas.height = (img.naturalHeight / img.naturalWidth) * gElCanvas.width

  gCtx.drawImage(img, 0, 0, gElCanvas.width, gElCanvas.height)
}

function renderTxts(lines) {
  lines.forEach(renderTxt)
}

function renderTxt(line) {
  const { txt, pos, size, color, selected } = line
  // {
  // txt: 'Go Go America!', pos: { x: 0, y: 0 },
  // size: 30, color: 'red'
  // }

  //   clearTxt(line)

  // Add Text on the Canvas
  gCtx.font = `${size}px Arial`
  gCtx.fillStyle = color
  gCtx.strokeStyle = 'black'
  gCtx.lineWidth = 2
  gCtx.textAlign = 'center'

  // TODO - set the pos x & y
  const x = pos.x ? pos.x : gElCanvas.width / 2
  const y = pos.y ? pos.y : 200 // position on the top
  gCtx.fillText(txt, x, y)
  gCtx.strokeText(txt, x, y)

  const padding = 2
  gCtx.strokeStyle = 'black'
  gCtx.lineWidth = 2

  if (selected) gCtx.strokeStyle = 'gold'

  // calculate the text measurements (x & y)
  const measurementsObj = calcMeasurements(txt, size, padding, { x, y })
  const { xStart, yStart, xEnd, yEnd } = measurementsObj

  // draw a frame to the text
  gCtx.strokeRect(xStart, yStart, xEnd, yEnd)

  // Update the text size input Element
  //   const elTxtSize = document.querySelector('.txt-size')
  //   elTxtSize.value = size
}

function calcMeasurements(txt, txtHeight, padding, pos) {
  const { x, y } = pos
  const line = getLine()

  const txtMetrics = gCtx.measureText(txt)
  const txtWidth = txtMetrics.width
  //   const txtHeight = size

  // console.log('txtWidth: ', txtWidth)

  const xStart = x - txtWidth / 2 - padding
  const yStart = y - txtHeight + padding
  const xEnd = txtWidth + padding * 2
  const yEnd = txtHeight + padding * 2

  // console.log('xStart: ', xStart)
  // console.log('xEnd: ', xStart + txtWidth + padding + padding)

  const xEndFrame = xStart + txtWidth + padding * 2
  const yEndFrame = yStart + txtHeight + padding * 2

  line.framePos = { xStart, yStart, xEnd: xEndFrame, yEnd: yEndFrame }

  // console.log('xEndFrame: ',xEndFrame);
  // console.log('yEndFrame: ',yEndFrame);

  return { xStart, yStart, xEnd, yEnd }
}

// function clearTxt(line) {
//   const { pos, size } = line

//   // TODO - set the pos x & y
//   const x = gElCanvas.width / 2
//   const y = 50

//   const padding = 10
//   const txtWidth = gCtx.measureText(line.txt).width

//   const xStart = x - txtWidth / 2 - padding
//   const yStart = y - size - padding
//   const xEnd = txtWidth + padding * 2
//   const yEnd = size + padding * 2

//   gCtx.clearRect(xStart, yStart, xEnd, yEnd)
// }

function renderEditor(meme) {
  const { selectedLineIdx, lines } = meme

  //   const {txt, color, size} = lines[selectedLineIdx]

  const txt = lines[selectedLineIdx].txt
  const color = lines[selectedLineIdx].color
  const size = lines[selectedLineIdx].size

  renderInputTxt(txt)
  renderInputColor(color)
  renderInputSize(size)
}

function renderInputTxt(txt) {
  const elInputTxt = document.querySelector('.input-txt')
  elInputTxt.value = txt
}

function renderInputColor(color) {
  const elInputColor = document.querySelector('.input-color')
  elInputColor.value = color
}

function renderInputSize(size) {
  const elInputsTxtSize = document.querySelectorAll('.txt-size-container input')
  elInputsTxtSize.forEach((input) => (input.value = size))
}

function onDownload(elLink) {
  const imgContent = gElCanvas.toDataURL('image/jpeg')
  elLink.href = imgContent
}

function onColor(elColor) {
  const line = getLine()
  line.color = elColor.value

  //   renderTxt(line)

  memeController(false)
}

function onSize(val) {
  const line = getLine()
  line.size = val

  //   renderTxt(line)

  memeController(false)
}

function onAddLine() {
  // { txt: 'Go Go America!', pos: { x: 0, y: 125 }, size: 30, color: 'gold' }

  const newLine = {
    txt: 'Go Go America!',
    pos: { x: 0, y: 150 },
    framePos: { xStart: 0, yStart: 0, xEnd: 0, yEnd: 0 },
    size: +document.querySelector('.txt-size').value,
    color: document.querySelector('.input-color').value,
    selected: false
  }

  if (gMeme.lines.length === 1) {
    newLine.pos.y = gElCanvas.height - 50
  } else if (gMeme.lines.length === 2) {
    newLine.pos.y = gElCanvas.height / 2
  }

  gMeme.lines.push(newLine)

  gMeme.selectedLineIdx = gMeme.lines.length - 1

  selectCurrentLine()
  memeController(false)
}

function switchLine() {
  gMeme.selectedLineIdx++

  if (gMeme.selectedLineIdx > gMeme.lines.length - 1) {
    gMeme.selectedLineIdx = 0
  }

  selectCurrentLine()

  memeController(false)
}
