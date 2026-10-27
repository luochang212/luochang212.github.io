'use strict'

var sidebarTrigger = document.querySelector('.author-trigger')

function loadPanel(panel) {
  var frames = panel.querySelectorAll('iframe[data-src]')
  frames.forEach(function (frame) {
    if (!frame.closest('[hidden]')) {
      frame.src = frame.dataset.src
      frame.removeAttribute('data-src')
    }
  })
}

function openNav() {
  var activePanel = document.querySelector('.tabcontent:not([hidden])')
  document.getElementById('mySidenav').classList.add('is-open')
  document.getElementById('mySidenav').setAttribute('aria-hidden', 'false')
  document.getElementById('overlay').style.display = 'block'
  document.body.classList.add('drawer-open')
  sidebarTrigger.setAttribute('aria-expanded', 'true')
  loadPanel(activePanel)
  document.querySelector('.tablinks.active').focus()
}

function closeNav() {
  document.getElementById('mySidenav').classList.remove('is-open')
  document.getElementById('overlay').style.display = 'none'
  document.getElementById('mySidenav').setAttribute('aria-hidden', 'true')
  document.body.classList.remove('drawer-open')
  sidebarTrigger.setAttribute('aria-expanded', 'false')
  stopMediaPlayback()
  sidebarTrigger.focus()
}

// 关闭时必须停掉媒体，否则音视频会在后台继续播放。
// 音乐 iframe 把当前地址写回 data-src，下次打开由 loadPanel 续载；
// 视频 iframe 清空并恢复封面态，重新点封面才会再播。
// Resources/Gallery 是普通页面，保留状态不动。
function stopMediaPlayback() {
  var musicFrame = document.querySelector('#netease-player iframe')
  if (musicFrame && !musicFrame.hasAttribute('data-src') && musicFrame.src !== 'about:blank') {
    musicFrame.setAttribute('data-src', musicFrame.src)
    musicFrame.src = 'about:blank'
  }
  var cover = document.getElementById('video-cover')
  var frameEl = document.getElementById('video-frame')
  var videoIframe = frameEl ? frameEl.querySelector('iframe') : null
  if (videoIframe) {
    videoIframe.src = 'about:blank'
  }
  if (frameEl && cover) {
    frameEl.hidden = true
    cover.style.display = ''
  }
}

function openItem(evt, itemName) {
  var i, tabcontent, tablinks
  tabcontent = document.getElementsByClassName('tabcontent')
  for (i = 0; i < tabcontent.length; i++) {
    tabcontent[i].hidden = true
  }
  tablinks = document.getElementsByClassName('tablinks')
  for (i = 0; i < tablinks.length; i++) {
    tablinks[i].className = tablinks[i].className.replace(' active', '')
    tablinks[i].setAttribute('aria-pressed', 'false')
  }
  document.getElementById(itemName).hidden = false
  evt.currentTarget.className += ' active'
  evt.currentTarget.setAttribute('aria-pressed', 'true')
  loadPanel(document.getElementById(itemName))
}

// ── Video tab ──

var firstVideoItem = document.querySelector('.video-item')
var currentBvid = firstVideoItem ? firstVideoItem.dataset.bvid : ''

function selectVideo(itemEl) {
  document.querySelectorAll('.video-item').forEach(function (el) {
    el.classList.remove('active')
  })
  itemEl.classList.add('active')

  currentBvid = itemEl.dataset.bvid

  document.getElementById('video-cover-img').src = itemEl.dataset.cover
  document.getElementById('video-cover-title').textContent = itemEl.dataset.title

  var frameEl = document.getElementById('video-frame')
  frameEl.hidden = true
  var iframe = frameEl.querySelector('iframe')
  if (iframe) {
    iframe.src = 'about:blank'
    iframe.removeAttribute('data-src')
  }
  document.getElementById('video-cover').style.display = ''
}

function playCurrentVideo() {
  document.getElementById('video-cover').style.display = 'none'
  var frameEl = document.getElementById('video-frame')
  frameEl.hidden = false
  var iframe = frameEl.querySelector('iframe')
  var url = '//player.bilibili.com/player.html?bvid=' + currentBvid + '&p=1&high_quality=1&danmaku=0&autoplay=1'
  // iframe.src 返回解析后的绝对地址，必须先归一化再比较，否则守卫永远为真
  var resolved = new URL(url, location.href).href
  if (iframe.src !== resolved) {
    iframe.src = url
  }
}

document.querySelectorAll('.video-item').forEach(function (item) {
  item.addEventListener('click', function () {
    if (!this.classList.contains('active')) {
      selectVideo(this)
      playCurrentVideo()
    }
  })
})

document.getElementById('video-cover').addEventListener('click', playCurrentVideo)

document.addEventListener('keydown', function (event) {
  if (event.key === 'Escape' && sidebarTrigger.getAttribute('aria-expanded') === 'true') {
    closeNav()
  }
})

document.querySelectorAll('#categories .drawer-category-list a').forEach(function (a) {
  a.addEventListener('click', function () { a.blur() })
})
