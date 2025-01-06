'use strict'

function hidePages(pages) {
  pages.forEach(hidePage)
}

function hidePage(page) {
  const sectionEl = document.querySelector(`.${page}-page`)

  // sectionEl.style.display = 'none'
  sectionEl.setAttribute('hidden', true)
}

function showPage(page) {
  const sectionEl = document.querySelector(`.${page}-page`)

  sectionEl.hidden = false
}

// NabNar func

function onNav(page) {
  const allPages = ['gallery', 'editor', 'saved', 'about']
  const pages = allPages.filter((p) => p !== page)

  hidePages(pages)
  showPage(page)
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
