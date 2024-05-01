function ready (fn) {
  if (document.readyState !== 'loading') {
    fn()
  } else if (document.addEventListener) {
    document.addEventListener('DOMContentLoaded', fn)
  } else {
    document.attachEvent('onreadystatechange', function () {
      if (document.readyState !== 'loading') { fn() }
    })
  }
}

ready(init)

function init () {
  const e = document.getElementById('divcolorsi')
  const w = document.getElementById('datatable')
  const b = document.body
  const c = document.getElementById('bgset')

  const rgbMake = function (R = 0, G = 0, B = 0) {
    const colors = `rgb(${R <= 255 ? R : 0},${G <= 255 ? G : 0},${B <= 255 ? B : 0})`
    return colors
  }

  function createDivs () {
    e.innerHTML = ''

    for (let i = 0; i < 24; i++) {
      const r = randomNum(0, 200)
      const g = randomNum(0, 155)
      const b = randomNum(0, 155)
      const rgb = rgbMake(r, g, b)
      const hex = rgbToHex(r, g, b)
      e.innerHTML += '<div style="background:' + rgb + '"><span class="buttons"><span class="colors">' + hex +
            ' </span><span class="colors">' + rgb +
            '</span><span class="sent">⛃</span><span class="views">⌕</span></span></div>'
    }
  }

  const getMyColor = function () {
    const getColor = document.getElementById('inputColor').value
    const numbers = getColor.match(/\d+/g).map(Number)
    return numbers
  }

  const mixColor = function () {
    const inter = document.getElementById('inter').value
    e.innerHTML = ''
    const mx = getMyColor()
    let c = 0
    let r = mx[0]
    let g = mx[1]
    let b = mx[2]

    for (let i = 0; i < 24; i++) {
      c = 0
      if (r > 255 || g > 255 || b > 255) break
      const mixColor = rgbMake(Math.abs(r), Math.abs(g), Math.abs(b))
      const hex = rgbToHex(r, g, b)
      e.innerHTML += '<div style="background:' + mixColor + '"><span class="buttons"><span class="colors">' +
            hex + ' </span><span class="colors">' + mixColor + '</span><span class="sent">⛃</span></span></div>'
      c += Number(inter) || 10
      r += c
      g += c
      b += c
    }
  }

  function rgbToHex (r, g, b) {
    return '#' + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)
  }

  function randomNum (min = 0, max = 0) {
    return Math.floor(Math.random() * (max - min + 1)) + min
  }

  document.getElementById('buttonMagic').addEventListener('click', function () {
    createDivs()
    getMyColor()
    getButtos()
    w.scrollTop = 0
  })
  document.getElementById('buttonMycolors').addEventListener('click', function () {
    getMyColor()
    mixColor()
    getButtos()
    w.scrollTop = 0
  })
  createDivs()
  getButtos()

  function getButtos () {
    const elem = document.getElementsByClassName('buttons')
    for (let i = 0; i < elem.length; i++) {
      elem[i].addEventListener('click', function (e) {
        const color = this.getElementsByClassName('colors')[1].innerText.substr(this.innerText)
        if (e.target.classList.contains('sent')) {
          // e.target.style.pointerEvents = "none";
          setColorsTo(color)
        }
        document.getElementById('inputColor').value = color
        if (e.target.classList.contains('views')) {
          mixColor()
          getButtos()
          w.scrollTop = 0
        }
        getMyColor()
      })
    }
  }

  let index = 0

  function setColorsTo (colorfil) {
    const colo = w.getElementsByClassName('filc')
    for (let i = 0; i < colo.length; i++) {
      const checked = colo[i].children[2]
      if (checked.checked && !checked.disabled) {
        if (c.checked) b.style.background = colorfil
        else b.style.background = '#FAF7EE'
        colo[i].style.background = colorfil
        colo[i].firstElementChild.innerText = colorfil
        index = i
        toggleLock.call(colo[i].children[1])
      }
    }
    index = (index + 1) % colo.length
    colo[index].children[2].checked = true
  }

  const downloadInnerHtml = function (filename, elId, mimeType) {
    const lemget = document.getElementById(elId)
    const elemes = lemget.getElementsByClassName('filc')
    let elHtml = '<!DOCTYPE html>' + '<html lang="en">' + '<head>' + '<meta charset="UTF-8">' +
          '<meta name="viewport" content="width=device-width, initial-scale=1.0">' + '<title>Colors</title>' +
          '</head>' + '<body style="margin:0; height: 100vh">'

    for (let i = 0; i < elemes.length; ++i) {
      elHtml += '<p style="background:' + (elemes[i].style.backgroundColor || 'transparent') +
            ';height:25%;width:100%;margin:0 auto;line-height:80px;text-align:center;">' + elemes[i].style
        .backgroundColor + '</p>'
    }
    elHtml += '</body></html>'

    if (navigator.msSaveBlob) {
      navigator.msSaveBlob(new window.Blob([elHtml], {
        type: mimeType + ';charset=utf-8;'
      }), filename)
    } else {
      const link = document.createElement('a')
      mimeType = mimeType || 'text/plain'
      link.setAttribute('target', '_blank')
      link.setAttribute('download', filename)
      link.setAttribute('href', 'data:' + mimeType + ';charset=utf-8,' + encodeURIComponent(elHtml))

      if (document.createEvent) {
        const event = document.createEvent('MouseEvents')
        event.initEvent('click', !0, !0)
        link.dispatchEvent(event)
      } else {
        link.click()
      }
    }
  }

  function toggleLock () {
    if (this.innerHTML === '🔓') {
      this.innerHTML = '🔒'
      this.nextElementSibling.setAttribute('disabled', true)
    } else {
      this.innerHTML = '🔓'
      this.nextElementSibling.removeAttribute('disabled')
    }
  }

  const lock = document.getElementsByClassName('locker');
  [...lock].forEach(e => {
    e.addEventListener('click', toggleLock)
  })

  function colorToInput (e) {
    e.checked = true
    const col = e.target.parentElement.style.backgroundColor
    if (col) {
      document.getElementById('inputColor').value = col
      if (c.checked) b.style.background = col
      else b.style.background = '#FAF7EE'
    }
  }

  w.addEventListener('click', (e) => colorToInput(e), true)
  document.getElementById('saveHTML').addEventListener('click', () => downloadInnerHtml('colors' + Math.floor(Math
    .random() * 9999) + '.html', 'datatable',
  'text/html'))
};
