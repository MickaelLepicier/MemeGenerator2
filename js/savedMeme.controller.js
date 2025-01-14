'use strict'

function renderSavedMeme() {
  const elSavedMemes = document.querySelector('.saved-memes')
  const elSavedMemesMsg = document.querySelector('.saved-page-msg')

  const memes = getSavedMeme()

  let strHtml = ''

  memes.forEach((meme, index) => {
    strHtml += `<img class="saved-meme-img" src="${meme.imgContent}" onclick="onMemeSelect(${index})"></img>`
  })

  elSavedMemes.classList.remove('hidden')
  elSavedMemesMsg.classList.add('hidden')

  elSavedMemes.innerHTML = strHtml
}
// test
function onMemeSelect(idx) {
  const imgId = gSaveMemes[idx].gMeme.selectedImgId

  setImg(imgId)
  memeController(true, idx)
}
