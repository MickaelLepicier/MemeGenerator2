'use strict'

let gElCanvas
let gCtx

function onMemeEditor() {
  gElCanvas = document.querySelector('canvas')
  gCtx = gElCanvas.getContext('2d')

  addEvListeners()
  resizeCanvas()
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

  memeController()
}

function memeController(isNav = false, gSaveMemeIdx = false) {
  const meme = checkMeme(gSaveMemeIdx)

  console.log('on: ')

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
  const padding = 2

  // Add Text on the Canvas
  gCtx.font = `${size}px Arial`
  gCtx.fillStyle = color
  gCtx.strokeStyle = borderColor
  gCtx.lineWidth = 2
  gCtx.textAlign = 'center'

  const x = pos.x ? pos.x : gElCanvas.width / 2
  const y = pos.y ? pos.y : 200 // position on the top
  gCtx.fillText(txt, x, y)
  gCtx.strokeText(txt, x, y)

  // set the x & y on the line position
  line.pos = { x, y }

  if (!selected) return

  gCtx.strokeStyle = 'gold'

  // calculate the text measurements (x & y)
  const measurementsObj = calcMeasurements(line, padding, { x, y })
  const { xStart, yStart, xEnd, yEnd } = measurementsObj

  // draw a border to the text
  gCtx.strokeRect(xStart, yStart, xEnd, yEnd)
}

function calcMeasurements(line, padding, pos) {
  const { txt, size } = line
  const { x, y } = pos

  const txtMetrics = gCtx.measureText(txt)
  const txtWidth = txtMetrics.width

  let xStart = x - txtWidth / 2 - padding
  let yStart = y - size + padding
  let xEnd = txtWidth + padding * 2
  let yEnd = size + padding * 2

  xStart = additionalOffset(xStart, 5, false)
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
  const elTxtSizeRange = document.querySelector('.txt-size-range')
  const elTxtSizeNum = document.querySelector('.txt-size-num')

  elTxtSizeRange.value = size
  elTxtSizeNum.value = size
}

function onDown(ev) {
  const pos = getEvPos(ev)

  if (!isTxtClicked(pos)) {
    // remove the border of all the texts
    gMeme.lines.forEach((line) => (line.selected = false))
    memeController()
    return
  }
  gStartPos = pos

  selectCurrentLine()

  memeController()

  gIsDrag = true
  document.body.style.cursor = 'pointer'
}

function onMove(ev) {
  const line = getLine()
  if (!gMeme.lines.length || !gIsDrag || !line.selected) return

  const pos = getEvPos(ev)

  const dx = pos.x - gStartPos.x
  const dy = pos.y - gStartPos.y

  line.pos.x += dx
  line.pos.y += dy

  gStartPos = pos

  memeController()

  document.body.style.cursor = 'grabbing'
}

function onUp(ev) {
  const allLinesUnselected = gMeme.lines.every((line) => !line.selected)
  inputTxtFocus(allLinesUnselected)

  gIsDrag = false
  document.body.style.cursor = 'auto'
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

  memeController()
}

function onBorderColor(elColor) {
  const line = getLine()
  line.borderColor = elColor.value

  memeController()
}

function onSize(val) {
  const line = getLine()
  line.size = val

  memeController()
}

function onAddLine() {
  const newLine = {
    txt: 'Text here ',
    pos: { x: 0, y: 150 },
    framePos: { xStart: 0, yStart: 0, xEnd: 0, yEnd: 0 },
    size: +document.querySelector('.txt-size-range').value,
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
  inputTxtFocus(false)
  memeController()
}

function onSwitchLine() {
  gMeme.selectedLineIdx++

  if (gMeme.selectedLineIdx > gMeme.lines.length - 1) {
    gMeme.selectedLineIdx = 0
  }

  selectCurrentLine()
  inputTxtFocus(false)
  memeController()
}

function onDelete() {
  const line = getLine()
  if (!line.selected) return

  const idx = gMeme.selectedLineIdx
  gMeme.lines.splice(idx, 1)

  memeController()
}

function inputTxtFocus(allLinesUnselected) {
  const elInputTxt = document.querySelector('.input-txt')

  if (allLinesUnselected) {
    elInputTxt.blur()
  } else {
    elInputTxt.focus()
  }
}

function onTxtAlignment(direction) {
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

  memeController()
}

// ~ Upload Image ~ //

function uploadImg(ev) {
  let reader = new FileReader()

  reader.onload = function (event) {
    let img = new Image()
    img.onload = () => renderImageOnCanvas(img)
    img.src = event.target.result
  }
  reader.readAsDataURL(ev.target.files[0])
}

function renderImageOnCanvas(img) {
  gCtx.drawImage(img, 0, 0, gElCanvas.width, gElCanvas.height)
}

// ~ Share Image to Facebook ~ //

function shareMeme(elForm, ev) {
  ev.preventDefault()
  document.querySelector('.img-data').value = gElCanvas.toDataURL('image/jpeg')

  function onSuccess(uploadedImgUrl) {
    uploadedImgUrl = encodeURIComponent(uploadedImgUrl)
    document.querySelector('.share-container').innerHTML = `
    <a class="display-none invisible-btn" hidden href="https://www.facebook.com/sharer/sharer.php?u=${uploadedImgUrl}&t=${uploadedImgUrl}" title="Share on Facebook" target="_blank" onclick="window.open('https://www.facebook.com/sharer/sharer.php?u=${uploadedImgUrl}&t=${uploadedImgUrl}'); return false;">
            Can't touch this   
        </a>`
    document.querySelector('.invisible-btn').click()
  }

  doUploadImg(elForm, onSuccess)
}

function onSave() {
  const imgContent = gElCanvas.toDataURL('image/jpeg')

  let savedMeme = {
    imgContent,
    gMeme: {
      selectedImgId: gMeme.selectedImgId,
      selectedLineIdx: gMeme.selectedLineIdx,
      lines: gMeme.lines
    }
  }
  gSaveMemes.push(savedMeme)

  showModal()

  renderSavedMeme()
}

function showModal() {
  const elModal = document.querySelector('.save-modal')
  elModal.style.opacity = 0.8

  setTimeout(() => (elModal.style.opacity = 0), 1000)
}
