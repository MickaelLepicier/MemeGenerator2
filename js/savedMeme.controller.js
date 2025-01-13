'use strict'

function renderSavedMeme() {
  // TODOs
  // add to the html container
  // add one img

  const elSavedMemes = document.querySelector('.saved-memes')

  const memes = getSavedMeme()

  let strHtml = ''

  memes.forEach((meme, index) => {
    // console.log('meme: ', meme)
    strHtml += `<img class="saved-meme-img" src="${meme.imgContent}" onclick="onMemeSelect(${index})"></img>`
    // strHtml += `<img data-id="${index}" class="saved-meme-img" src="${meme.imgContent}" onclick="onMemeSelect(${index})"></img>`
  })

  elSavedMemes.innerHTML = strHtml
}

function onMemeSelect(idx) {
  const imgId = gSaveMemes[idx].gMeme.selectedImgId

  setImg(imgId)
  memeController(true,idx)

  // send to meme-editor-page to keep edit
}
