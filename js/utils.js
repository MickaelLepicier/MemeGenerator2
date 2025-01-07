'use strict'

// NabNar func

function onNav(page) {
  const allPages = ['gallery', 'meme-editor', 'saved', 'about']
  const pages = allPages.filter((p) => p !== page)

  const isClassChange = document.querySelector('.change')
  if (isClassChange) menuOnClick()

  hidePages(pages)
  showPage(page)
}

function hidePages(pages) {
  pages.forEach(hidePage)
}

function hidePage(page) {
  const sectionEl = document.querySelector(`.${page}-page`)
  sectionEl.classList.add('hidden')

  // sectionEl.style.display = 'none'
  // sectionEl.setAttribute('hidden', true)
}

function showPage(page) {
  const sectionEl = document.querySelector(`.${page}-page`)

  sectionEl.classList.remove('hidden')
  // sectionEl.hidden = false
}

// Menu func

function menuOnClick() {
  document.querySelector('.btn-bg').classList.toggle('change')
  document.querySelector('.navbar').classList.toggle('change')
  document.querySelector('.menu-bg').classList.toggle('change-bg')
}

// Utils Service

// func - random color

function makeId(length = 6) {
  const possible =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  var id = ''

  for (var i = 0; i < length; i++) {
    id += possible.charAt(Math.floor(Math.random() * possible.length))
  }
  return id
}

function getRandomInt(min, max) {
  min = Math.ceil(min)
  max = Math.floor(max)
  return Math.floor(Math.random() * (max - min + 1)) + min //The maximum is inclusive and the minimum is inclusive
}
