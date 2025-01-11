'use strict'

let gImgs = [
  { id: 1, url: 'img/2.jpg', keywords: ['fun', 'woman'] },
  { id: 2, url: 'img/003.jpg', keywords: ['funny', 'man'] }
]

let gMeme = {
  selectedImgId: 2,
  selectedLineIdx: 0,
  lines: [
    {
      txt: 'Go Go America!',
      pos: { x: 0, y: 50 },
      framePos: { xStart: 0, yStart: 0, xEnd: 0, yEnd: 0 },
      size: 30,
      borderColor: '#000000',
      color: '#f20707',
      selected: true
      // isGrabing: false
      // clicked:false
    }
  ]
}

let gStartPos
let gIsDrag = false

// let linesMeasurements = {} // maybe?
// let currLine = {} // maybe?

let gKeywordSearchCountMap = { fun: 1, funny: 3, man: 1, woman: 2 }

function getMeme() {
  return gMeme
}

function getImgs() {
  return gImgs
}

function getLine() {
  return gMeme.lines[gMeme.selectedLineIdx]
}

function setTxt(val) {
  const meme = getMeme()
  const lineIdx = gMeme.selectedLineIdx

  meme.lines[lineIdx].txt = val
  renderMeme(meme)
}

function setImg(imgId) {
  gMeme.selectedImgId = imgId
}

function isTxtClicked(clickedPos) {
  const { x: clickX, y: clickY } = clickedPos

  return gMeme.lines.some((line, index) => {
    const { xStart, yStart, xEnd, yEnd } = line.framePos

    const xChecked = clickX >= xStart && clickX <= xEnd
    const yChecked = clickY >= yStart && clickY <= yEnd

    if (xChecked && yChecked) {
      gMeme.selectedLineIdx = index
      return true
    }
    return false
  })
}

function selectCurrentLine() {
  gMeme.lines.forEach((line) => (line.selected = false))

  const line = getLine()
  line.selected = true
}
