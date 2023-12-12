;
(function (w,d) {
  'use strict'
  const arr = ['a','b','c','d','e','f','g','j','k','l']
  let shufleCards = getShuffledArr(arr.concat(arr))
  const documentFragment = d.createDocumentFragment()
  const gridContainer = d.getElementsByClassName('grid-container')[0]
  const message = d.getElementsByClassName('message')[0]
  const timers = d.getElementsByClassName('time')[0]
  const card = {
    card: null,
    cards: 0
  }

  function getShuffledArr (arr) {
    const newArr = arr.slice()
    for (let i = newArr.length - 1; i > 0; i--) {
      const rand = Math.floor(Math.random() * (i + 1));
      [newArr[i], newArr[rand]] = [newArr[rand], newArr[i]]
    }
    return newArr
  };
  /**
 * @constructor Elements
 */
  function Elements (tagName, className, text) {
    let that = this
    that = d.createElement(tagName)
    that.className = className
    that.innerHTML = text
    return that
  }
  let on = 0

  function timer () {
    let sec = 0

    function pad (val) {
      return val > 9 ? val : '0' + val
    }
    on = setInterval(function () {
      d.getElementById('seconds').innerHTML = pad(++sec % 60)
      d.getElementById('minutes').innerHTML = pad(parseInt(sec / 60, 10))
    }, 1000)
  }
  /**
 * @suppress {missingProperties|checkTypes}
 */
  function start () {
    shufleCards = getShuffledArr(arr.concat(arr))
    shufleCards.forEach(e => {
      const ele = new Elements('DIV', 'wrpko', '')
      const kor = new Elements('DIV', 'korta', '')
      const gal = new Elements('DIV', 'galas ' + e, '')
      const pri = new Elements('DIV', 'priekis', '')
      ele.appendChild(kor).appendChild(gal)
      kor.appendChild(pri)
      documentFragment.appendChild(ele)
    })
    gridContainer.appendChild(documentFragment)
    timer()
  }

  d.addEventListener('click', (e) => {
    const target = e.target
    if (target.classList.contains('korta')) {
      if (!card.cards) card.card = e.target
      if (card.cards === 2) return false
      ++card.cards
      const randomClass = Math.round(Math.random()) >= 0.5 ? 'pasukti' : 'pasukti1'
      target.className += ' ' + randomClass
      if (card.cards === 2) {
        gridContainer.style.pointerEvents = 'none'
        if (card.card.firstChild.className === target.firstChild.className) {
          let inter0 = setTimeout(() => {
            clearTimeout(inter0)
            inter0 = 0
            target.classList.add('blur')
            card.card.classList.add('blur')
            card.cards = 0
            gridContainer.style.pointerEvents = 'auto'
            if (gridContainer.getElementsByClassName('blur').length === shufleCards.length) {
              clearInterval(on)
              message.innerHTML = `<p>YOU WON!</p><p>your time: ${timers.textContent}</p>`
              for(let i = 0; i<w.localStorage.length; i++){
                message.innerHTML += `<p class="time">${w.localStorage.getItem(w.localStorage.key(i))}</p>`
              }
              gridContainer.innerHTML = ''
              button('Play again')
              w.localStorage.setItem(`time${w.localStorage.length + 1}`, timers.textContent)
              message.style.display = 'block'
            }
          }, 300)
        } else {
          let inter = setTimeout(() => {
            clearTimeout(inter)
            inter = 0
            target.classList.remove(randomClass)
            card.card.className = 'korta'
            card.cards = 0
            gridContainer.style.pointerEvents = 'auto'
          }, 900)
        }
      }
    }
  })
  /**
 * ...
 * Good; suppresses within the entire function.
 * Also, this suppresses multiple warnings.
 * @suppress {missingProperties|checkTypes}
 */
  function button (text) {
    timers.classList.add('hidden')
    const btn = new Elements('button', 'btn', text)
    btn.onclick = () => {
      start()
      message.style.display = 'none'
      timers.classList.remove('hidden')
    }
    message.prepend(btn)
  }

  function init () {
    button('Start')
  }

  init()
})(window, document)
