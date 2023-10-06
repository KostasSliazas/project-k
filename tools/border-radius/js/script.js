(function () {
  'use strict'

  function Arrows (number) {
    this.number = number
  }

  Arrows.prototype.up = function up (y) {
    this.number = y
    return (this.number += 1)
  }

  Arrows.prototype.dn = function dn (y) {
    this.number = y
    return (this.number -= 1)
  }
  const lg = new Arrows(0)

  document.addEventListener('click', updateArrows)
  document.addEventListener('change', updateArrows)

  function updateArrows (e) {
    if (e.target.parentElement.className === 'arows' || typeof e.target.parentElement.getElementsByTagName('input')[0] !== 'undefined') {
      const g = Number(e.target.parentElement.getElementsByTagName('input')[0].value)
      if (e.target.className === 'uarrow' && g < 100) {
        e.target.parentElement.getElementsByTagName('input')[0].value = lg.up(g)
      }
      if (e.target.className === 'darrow' && g > 0) {
        e.target.parentElement.getElementsByTagName('input')[0].value = lg.dn(g)
      }
      e.target.parentElement.getElementsByTagName('input')[0].value = e.target.parentElement.getElementsByTagName('input')[0].value.length > 0 && Number.isInteger(+e.target.parentElement.getElementsByTagName('input')[0].value) ? e.target.parentElement.getElementsByTagName('input')[0].value : 0
    }
    borders()
  }
  function borders () {
    const bo = document.getElementById('borders')
    const ge = document.getElementsByClassName('arows')
    const arr = []
    for (let i = 0; i < ge.length; i++) {
      arr.push(ge[i].getElementsByTagName('input')[0].value)
    }
    bo.style.borderTopLeftRadius = arr[0] + 'px'
    bo.style.borderTopRightRadius = arr[1] + 'px'
    bo.style.borderBottomRightRadius = arr[3] + 'px'
    bo.style.borderBottomLeftRadius = arr[2] + 'px'
    bo.innerText = '.border-radius {\nborder-radius:' + bo.style.borderRadius + ';\n}'
  }

  document.getElementById('borders').addEventListener('click', function (e) {
    document.execCommand('copy')
  })
}())
