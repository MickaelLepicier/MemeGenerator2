'use strict'

let gImgs = [
  { id: 1, url: 'img/2.jpg', keywords: ['fun', 'woman'] },
  { id: 2, url: 'img/003.jpg', keywords: ['funny', 'man'] }
]

let gMeme = {
  selectedImgId: 2,
  selectedLineIdx: 0,
  lines: [
    { txt: 'Go Go America!', pos: { x: 0, y: 0 }, size: 30, color: 'red' }
  ]
}

let gKeywordSearchCountMap = { fun: 1, funny: 3, man: 1, woman: 2 }

function getMeme() {
  return gMeme
}

function getImgs() {
  return gImgs
}

function setTxt(val) {
  const meme = getMeme()
  const lineIdx = gMeme.selectedLineIdx

  meme.lines[lineIdx].txt = val
  renderMeme(meme)
}

function setImg(imgId){
  gMeme.selectedImgId = imgId
}
