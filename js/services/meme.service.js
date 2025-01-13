'use strict'

let gImgs = [
  { id: 1, url: 'img/ai/01.jpg', keywords: ['ai', 'dragon ball z'] },
  { id: 2, url: 'img/ai/02.jpg', keywords: ['ai', 'dragon ball z'] },
  { id: 3, url: 'img/ai/03.jpg', keywords: ['ai', 'naruto'] },
  { id: 4, url: 'img/ai/04.jpg', keywords: ['ai', 'dragon ball z', 'naruto'] },
  { id: 5, url: 'img/ai/05.jpg', keywords: ['ai', 'dragon ball z', 'naruto'] },
  { id: 6, url: 'img/ai/06.jpg', keywords: ['ai', 'dragon ball z'] },
  { id: 7, url: 'img/ai/07.jpg', keywords: ['ai', 'dragon ball z'] },
  { id: 8, url: 'img/ai/08.jpg', keywords: ['ai', 'dragon ball z'] },
  { id: 9, url: 'img/ai/09.jpg', keywords: ['ai', 'dragon ball z', 'yugioh'] },
  {
    id: 10,
    url: 'img/ai/010.jpg',
    keywords: ['ai', 'dragon ball z', 'yugioh']
  },
  {
    id: 11,
    url: 'img/ai/011.jpg',
    keywords: ['ai', 'dragon ball z', 'yugioh']
  },
  {
    id: 12,
    url: 'img/ai/012.jpg',
    keywords: ['ai', 'dragon ball z', 'yugioh']
  },
  {
    id: 13,
    url: 'img/ai/013.jpg',
    keywords: ['ai', 'dragon ball z', 'yugioh']
  },
  { id: 14, url: 'img/ai/014.jpg', keywords: ['ai', 'yugioh'] },
  {
    id: 15,
    url: 'img/ai/015.jpg',
    keywords: ['ai', 'dragon ball z', 'yugioh']
  },
  {
    id: 16,
    url: 'img/ai/016.jpg',
    keywords: ['ai', 'dragon ball z', 'yugioh']
  },
  { id: 17, url: 'img/ai/017.jpg', keywords: ['ai', 'dragon ball z'] },
  {
    id: 18,
    url: 'img/ai/018.jpg',
    keywords: ['ai', 'dragon ball z', 'yugioh']
  },
  { id: 19, url: 'img/ai/019.jpg', keywords: ['ai', 'dragon ball z'] },
  { id: 20, url: 'img/ai/020.jpg', keywords: ['ai', 'dragon ball z'] },

  { id: 21, url: 'img/funny/021.jpg', keywords: ['funny', 'dragon ball z'] },
  { id: 22, url: 'img/funny/022.jpg', keywords: ['funny', 'yugioh'] },
  { id: 23, url: 'img/funny/023.jpg', keywords: ['funny', 'dragon ball z'] },
  { id: 24, url: 'img/funny/024.jpg', keywords: ['funny', 'naruto'] },
  { id: 25, url: 'img/funny/025.jpg', keywords: ['funny', 'naruto'] },
  { id: 26, url: 'img/funny/026.jpg', keywords: ['funny', 'dragon ball z'] },

  { id: 27, url: 'img/cool/027.jpg', keywords: ['cool', 'dragon ball z'] },
  { id: 28, url: 'img/cool/028.jpg', keywords: ['cool', 'yugioh'] },
  { id: 29, url: 'img/cool/029.jpg', keywords: ['cool', 'naruto'] },
  { id: 30, url: 'img/cool/030.jpg', keywords: ['cool', 'dragon ball z'] },
  { id: 31, url: 'img/cool/031.jpg', keywords: ['cool', 'dragon ball z'] },
  { id: 32, url: 'img/cool/032.jpg', keywords: ['cool', 'naruto'] },
  { id: 33, url: 'img/cool/033.jpg', keywords: ['cool', 'naruto'] },
  { id: 34, url: 'img/cool/034.jpg', keywords: ['cool', 'yugioh'] },
  { id: 35, url: 'img/cool/035.jpg', keywords: ['cool', 'yugioh'] },
  { id: 36, url: 'img/cool/036.jpg', keywords: ['cool', 'yugioh'] },
  { id: 37, url: 'img/cool/037.jpg', keywords: ['cool', 'dragon ball z'] }
]

let gImgsFiltered = []

let gMeme = {
  selectedImgId: 1,
  selectedLineIdx: 0,
  lines: [
    {
      txt: 'Text here ',
      pos: { x: 0, y: 50 },
      framePos: { xStart: 0, yStart: 0, xEnd: 0, yEnd: 0 },
      size: 40,
      borderColor: '#000000',
      color: '#ffffff',
      selected: true
    }
  ]
}

let gStartPos
let gIsDrag = false

// let gKeywordSearchCountMap = { fun: 1, funny: 3, man: 1, woman: 2 }

function getMeme() {
  return gMeme
}

function getImgs() {
  return gImgsFiltered.length === 0 ? gImgs : gImgsFiltered
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

function doUploadImg(elForm, onSuccess) {
  let formData = new FormData(elForm)

  fetch('//ca-upload.com/here/upload.php', {
    method: 'POST',
    body: formData
  })
    .then(function (res) {
      return res.text()
    })
    .then(onSuccess)
    .catch(function (err) {
      console.error(err)
    })
}

function resetMeme() {
  gMeme.selectedLineIdx = 0
  gMeme.lines = [
    {
      txt: 'Text here ',
      pos: { x: 0, y: 50 },
      framePos: { xStart: 0, yStart: 0, xEnd: 0, yEnd: 0 },
      size: 40,
      borderColor: '#000000',
      color: '#ffffff',
      selected: true
    }
  ]

  memeController(false)
}
