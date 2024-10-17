;
(function () {
  'use strict'

  // incrise decrise methods
  const input = {
    value: 0,
    increase: function () {
      return ((this.value >= 0 && this.value < 99 && ++this.value) || 0)
    },
    decraise: function () {
      return ((this.value <= 99 && this.value > 0 && --this.value) || 0)
    }
  }

  // get sample text for changing text-shadow
  const sampleText = document.querySelector('#sample-text')
  const exportCode = document.querySelector('.export')
  const color1 = document.querySelector('#color1')
  const color2 = document.querySelector('#color2')
  const color3 = document.querySelector('#color3')
  const shadowOut = document.querySelector('#shadow-out')

  // set value for background
  sampleText.style.background = color1.value
  // set value for color
  sampleText.style.color = color2.value

  function getNumberOfShadows () {
    return Number(document.querySelector('#num').value)
  }

  function getNumberOfBlur () {
    return Number(document.querySelector('#blur').value)
  }

  // get all checked values from radio and checkbox type
  function getCheckedValues () {
    return [...document.querySelectorAll('input[type=radio]:checked,input[type=checkbox]')]
  }

  function copyText (element) {
    element.select()
    element.setSelectionRange(0, 99999)
    document.execCommand('copy')
  }

  function toggleHide (elem) {
    elem.classList.toggle('hidden')
  }

  function hexToRgbA (hex, alpha) {
    const r = parseInt(hex.slice(1, 3), 16)
    const g = parseInt(hex.slice(3, 5), 16)
    const b = parseInt(hex.slice(5, 7), 16)

    if (alpha) {
      return 'rgba(' + r + ', ' + g + ', ' + b + ', ' + alpha + ')'
    } else {
      return 'rgb(' + r + ', ' + g + ', ' + b + ')'
    }
  }

  function makeTextString (count, blur) {
    let color = color3.value || '#000'
    const elems = getCheckedValues()
    let tempH = Number(elems[0].value)
    let tempV = Number(elems[1].value)
    let string = ''
    let rgb = color
    const left = count - 10
    let tem = 10
    if (tempH === 0 && tempV === 0) return (string = '')
    if (count < 100) {
      for (let i = 0; i < count; i++) {
        if (i) string += ','
        if (elems[2].checked) {
          elems[4].checked ? (rgb = getRandomRgb()) : (color = getRandomRgb())
        }
        if (elems[3].checked) {
          tempH += Math.floor(Math.random() * 3)
          tempV += Math.floor(Math.random() * 3)
        }
        if (elems[4].checked) {
          color = hexToRgbA(rgb, tem / 10)
          if (left < i) tem--
        };
        string += stringMake(tempH, tempV, blur, color)
        if (tempH !== 0) tempH > 0 ? ++tempH : --tempH
        if (tempV !== 0) tempV > 0 ? ++tempV : --tempV
      }
    }
    return string
  }

  function getRandomRgb () {
    return '#' + (Math.random() * 0xFFFFFF << 0).toString(16).padStart(6, '0')
  }

  // make string of shadows
  function stringMake (f, s, t, c) {
    return `${f}px ${s}px ${t}px ${c}`
  }

  function exported () {
    let string = '.txt-shadow {\n'
    string += sampleText.style.textShadow ? 'text-shadow: ' + sampleText.style.textShadow + ';' : ''
    if (getCheckedValues()[5].checked) string += '\nbackground: ' + color1.value + ';'
    if (getCheckedValues()[6].checked) string += '\ncolor: ' + color2.value + ';'
    shadowOut.value = string + '\n}'
  }

  function checkValidation (a) {
    if (a.value.length < 3) {
      return true
    } else {
      return false
    }
  }

  document.addEventListener('input', (e) => {
    if (e.target.value.indexOf('#') === -1 && checkValidation(e.target) && e.target.type !== 'checkbox') {
      sampleText.style.textShadow = makeTextString(getNumberOfShadows(), getNumberOfBlur())
    } else {
      return false
    }
  })

  color1.addEventListener('input', (e) => (sampleText.style.background = e.target.value))
  color2.addEventListener('input', (e) => (sampleText.style.color = e.target.value))
  color3.addEventListener('input', (e) => { sampleText.style.textShadow = makeTextString(getNumberOfShadows(), getNumberOfBlur()) })

  document.querySelectorAll('.nudes').forEach((e) => e.addEventListener('click', () => {
    toggleHide(exportCode)
    exported()
  }))

  document.getElementById('copy-text').addEventListener('click', () => {
    copyText(shadowOut)
  })

  function load (e) {
    const targ = e.target
    if (targ.dataset.bind) {
      const svalue = targ.parentElement.getElementsByTagName('input')[0]
      input.value = svalue.value
      if (targ.dataset.bind === 'decrease') {
        svalue.value = input.decraise()
      }
      if (targ.dataset.bind === 'increase') {
        svalue.value = input.increase()
      }
      sampleText.style.textShadow = makeTextString(getNumberOfShadows(), getNumberOfBlur())
    }
  }

  document.addEventListener('click', load)
  sampleText.style.textShadow = makeTextString(getNumberOfShadows(), getNumberOfBlur())
})()
