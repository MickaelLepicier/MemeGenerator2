'use strict'

function onInit() {
  onMemeEditor()
  renderGallery()
}

function renderGallery() {
  const imgs = getImgs()

  if (!imgs) {
    console.error('Images not found')
    return
  }

  onNav('gallery')

  renderImgs(imgs)
}

function renderImgs(imgs) {
  const elImgs = document.querySelector('.gallery-images')
  let strHtml = ''

  imgs.forEach((img) => {
    strHtml += renderImg(img)
  })

  elImgs.innerHTML = strHtml
}

function renderImg(img) {
  const { id, url, keywords } = img
  const kw = keywords.join(' ')

  return `<img class="gallery-image" data-id="${id}" data-keywords="${kw}" src="${url}" alt="img" onclick="onImgSelect(${id})" />`
}

function onImgSelect(imgId) {
  setImg(imgId)
  memeController()
}

function onSearchKeyword(val) {
  gImgsFiltered = gImgs.filter((img) => img.keywords.includes(val))
  renderGallery()
}
