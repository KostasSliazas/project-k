;
(function () {
  'use strict'
  const ul = document.getElementsByTagName('ul')[0]
  const inputs = [...document.getElementsByTagName('input')]
  const textInput = document.getElementById('text-input')

  let begin = 0
  computeRadius()

  function reset (e) {
    const tetxtWrap = document.getElementById('text-wrap')

    if (e.target.id === 'ok') {
      tetxtWrap.classList.add('hide')
      ul.innerHTML = ''
      getInputs()
      computeRadius()
    }
    if (e.target.id === 'close') {
      tetxtWrap.classList.add('hide')
    }
    if (e.target.id === 'toggle') {
      setTimeout(() => textInput.select(), 50)
      tetxtWrap.classList.remove('hide')
    }
    if (e.target.id !== 'laberls') return

    const randomTime = rand(3000, 7777)
    if (!e.target.previousElementSibling.disabled) {
      e.target.previousElementSibling.disabled = true
      e.target.innerText = 'Please wait...'
      const ro = begin + rand(720, 9999)
      begin = ro
      ul.style.transform = `rotate3d(0,0,1,${ro}deg)`
      ul.style.transitionDuration = randomTime / 1000 + 's'
      const tim = setTimeout(() => {
        inputs.forEach((e) => {
          e.checked = false
          e.disabled = false
        })
        clearTimeout(tim)
        e.target.innerText = typeof computeElementPositions() !== 'undefined' ? computeElementPositions().innerText : 'No winners'
      }, randomTime)
    }
  }

  function computeRadius () {
    const li = [...ul.getElementsByTagName('li')]
    const eachRotate = 360 / li.length
    let rotate = 0
    li.forEach(e => {
      e.style.transform = `rotate3d(0,0,1,${rotate}deg)`
      rotate += eachRotate
    })
  }

  function computeElementPositions () {
    const allList = Array.from(ul.getElementsByTagName('span'))
    const max = allList.reduce((acc, shot) =>
      (acc = acc.getBoundingClientRect().top > shot.getBoundingClientRect().top ? acc : shot), allList[0])
    return max
  }

  function rand (min, max) {
    min = Math.ceil(min)
    max = Math.floor(max)
    return Math.floor(Math.random() * (max - min)) + min
  }

  function getInputs () {
    const text = textInput.value
    const filters = text.trim().replace(/\s/g, ' ').split(' ').filter(e => (e.length > 1) && e.replace(/\s+/, ''))
    filters.forEach(n => {
      const li = document.createElement('li')
      const a = document.createElement('span')
      a.innerText = n
      li.appendChild(a)
      ul.appendChild(li)
    })
  }

  document.addEventListener('click', reset)
})()
