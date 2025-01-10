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

  const img = new Image()
  img.src = imgObj.url

  img.onload = () => {
    clearCanvas()
    // resizeCanvas()

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
  const { txt, pos, size, borderColor, color, selected } = line

  // Add Text on the Canvas
  gCtx.font = `${size}px Arial`
  gCtx.fillStyle = color
  gCtx.strokeStyle = borderColor
  gCtx.lineWidth = 2
  gCtx.textAlign = 'center'

  // TODO - set the pos x & y
  const x = pos.x ? pos.x : gElCanvas.width / 2
  const y = pos.y ? pos.y : 200 // position on the top
  gCtx.fillText(txt, x, y)
  gCtx.strokeText(txt, x, y)

  const padding = 2
  //   gCtx.strokeStyle = 'black'
  //   gCtx.lineWidth = 2

  if (selected) gCtx.strokeStyle = 'gold'

  // calculate the text measurements (x & y)
  const measurementsObj = calcMeasurements(line, padding, { x, y })
  const { xStart, yStart, xEnd, yEnd } = measurementsObj

  // draw a frame to the text
  gCtx.strokeRect(xStart, yStart, xEnd, yEnd)
}

function calcMeasurements(line, padding, pos) {
  const { txt, size } = line
  const { x, y } = pos

  const txtMetrics = gCtx.measureText(txt)
  const txtWidth = txtMetrics.width
  //   const txtHeight = size

  let xStart = x - txtWidth / 2 - padding
  let yStart = y - size + padding
  let xEnd = txtWidth + padding * 2
  let yEnd = size + padding * 2

  xStart = additionalOffset(xStart, 5, false)
  //    yStart = y - size + padding
  xEnd = additionalOffset(xEnd, 5, true)
  yEnd = additionalOffset(yEnd, 10, true)

  let xEndFrame = xStart + txtWidth + padding * 2
  let yEndFrame = yStart + size + padding * 2

  xEndFrame = additionalOffset(xEndFrame, 5, true)
  yEndFrame = additionalOffset(yEndFrame, 10, true)

  line.framePos = { xStart, yStart, xEnd: xEndFrame, yEnd: yEndFrame }

  return { xStart, yStart, xEnd, yEnd }
}

function additionalOffset(num, percent, isPlus) {
  let newNum = (num / 100) * percent
  newNum = isPlus ? num + newNum : num - newNum
  return newNum
}

function renderEditor(meme) {
  const { selectedLineIdx, lines } = meme
  if (!lines.length) return

  //   const {txt, color, size} = lines[selectedLineIdx]

  const txt = lines[selectedLineIdx].txt
  const borderColor = lines[selectedLineIdx].borderColor
  const color = lines[selectedLineIdx].color
  const size = lines[selectedLineIdx].size

  renderInputTxt(txt)
  renderInputColors(borderColor, color)
  renderInputSize(size)
}

function renderInputTxt(txt) {
  const elInputTxt = document.querySelector('.input-txt')
  elInputTxt.value = txt
}

function renderInputColors(borderColor, color) {
  const elInputBorderColor = document.querySelector('.input-border-color')
  const elInputColor = document.querySelector('.input-color')

  elInputBorderColor.value = borderColor
  elInputColor.value = color
}

function renderInputSize(size) {
  const elInputsTxtSize = document.querySelectorAll('.txt-size-container input')
  elInputsTxtSize.forEach((input) => (input.value = size))
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

let gIsDrag = false
let gStartPos

function onDown(ev) {
  const pos = getEvPos(ev)

  if (!isTxtClicked(pos)) return

  //   const line = getLine()

  gStartPos = pos

  selectCurrentLine()

  memeController(false)

  gIsDrag = true
  document.body.style.cursor = 'pointer'
}

// TODO watch this video and fix the bug:
// https://www.youtube.com/watch?v=ymDjvycjgUM

function onMove(ev) {
  if (!gMeme.lines.length || !gIsDrag) return

  const line = getLine()
  // change the position of the text
  if (!line.selected) return

  const pos = getEvPos(ev)
  line.pos = pos

  //   const x = pos.x - gStartPos.x
  //   const y = pos.y - gStartPos.y

  //   // move text
  //   line.pos.x += x
  //   line.pos.y += y

  //   gStartPos = pos

  memeController(false)

  document.body.style.cursor = 'grabbing'
}

function onUp(ev) {
  //something like that - isClicked? false => return

  inputTxtFocus()

  gIsDrag = false
  document.body.style.cursor = 'auto'

  //   console.log('gMeme.lines: ', gMeme.lines)
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

function onBorderColor(elColor) {
  const line = getLine()
  line.borderColor = elColor.value

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
    borderColor: document.querySelector('.input-border-color').value,
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
  inputTxtFocus()
  memeController(false)
}

function onSwitchLine() {
  gMeme.selectedLineIdx++

  if (gMeme.selectedLineIdx > gMeme.lines.length - 1) {
    gMeme.selectedLineIdx = 0
  }

  selectCurrentLine()
  inputTxtFocus()
  memeController(false)
}

function onDelete() {
  const idx = gMeme.selectedLineIdx
  gMeme.lines.splice(idx, 1)

  //TODO fix bug - mybe the problem is with the idx
  console.log('lines: ', gMeme.lines)

  memeController(false)
}

function inputTxtFocus() {
  const elInputTxt = document.querySelector('.input-txt')
  elInputTxt.focus()
}

function txtAlignment(direction) {
  const line = getLine()
  const txtMetrics = gCtx.measureText(line.txt)
  const txtWidth = txtMetrics.width

  switch (direction) {
    case 'left':
      line.pos.x = txtWidth / 2 + 10
      break

    case 'center':
      line.pos.x = gElCanvas.width / 2
      break

    case 'right':
      line.pos.x = gElCanvas.width - txtWidth / 2 - 10
      break

    default:
      break
  }

  memeController(false)
}
