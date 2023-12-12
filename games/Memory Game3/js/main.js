;
(function (w, d) {
  'use strict'
  // make array of letters for image classNames (backgrounds)
  const arr = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'j', 'k', 'l']
  // shuffle letters array
  let shuffleCards = getShuffledArr(arr.concat(arr))
  // create document structure (fragment)
  const documentFragment = d.createDocumentFragment()
  // get game cards main container
  const gridContainer = d.getElementById('grid-container')
  // get container for messages showing
  const message = d.getElementById('message')
  // get notice element for messages showing (This game is using localStorage), later hide it
  const notice = d.getElementById('notice')
  // get game time element
  const statistics = d.getElementById('statistics')
  //get element of game time
  const timers = d.getElementById('timers')
  // get clicks element
  const clicks = d.getElementById('clicks')
  //get timer elements
  const minutes = d.getElementById('minutes')
  const seconds = d.getElementById('seconds')
  // set random string for game saving values for local storage
  const gameId = 'z7z'
  // card object
  const card = {
    timer: 0,
    data: null,
    card: null,
    clicks: 0,
    cards: 0
  }

  function getShuffledArr(arr) {
    const newArr = arr.slice()
    for (let i = newArr.length - 1; i > 0; i--) {
      const rand = Math.floor(Math.random() * (i + 1));
      [newArr[i], newArr[rand]] = [newArr[rand], newArr[i]]
    }
    return newArr
  }

  /**
   * @constructor Elements to create a new elements
   */
  function Elements(tagName, className, text) {
    let that = this
    that = d.createElement(tagName)
    that.className = className
    that.innerHTML = text
    return that
  }

  function timer() {
    let sec = 0

    function pad(val) {
      return val > 9 ? val : '0' + val
    }
    card.timer = setInterval(function () {
      seconds.innerHTML = pad(++sec % 60)
      minutes.innerHTML = pad(parseInt(sec / 60, 10))
    }, 1000)
  }


  /**
   * @suppress {missingProperties|checkTypes}
   */
  function getData() {
    const data = []
    for (let i = 0; i < w.localStorage.length; i++) {
      const key = w.localStorage.key(i)
      if (key.includes('time-'+ gameId)) data.push(w.localStorage.getItem(key))
    }
    data.sort((a, b) => a.localeCompare(b))
    return data
  }


  d.addEventListener('click', e => {
    // set event target
    const target = e.target

    if (target.classList.contains('korta')) {

      if (!card.cards) card.card = e.target
      if (card.cards === 2) return false
        ++card.cards
      // add random class name to rotate direction
      const randomClass = Math.round(Math.random()) >= 0.5 ? 'pasukti' : 'pasukti1'
      target.className += ' ' + randomClass

      // check if the 2 cards clicked
      if (card.cards === 2) {
        // count click events not every, but when 2cards are clicked (opened)
        card.clicks += 1
        // set the clicks element text
        clicks.innerHTML = card.clicks
        // disable click events with css styling and default cursor will be displayed
        gridContainer.style.pointerEvents = 'none'

        if (card.card.firstChild.className === target.firstChild.className) {
          setTimeout(() => {

            target.classList.add('blur')
            card.card.classList.add('blur')
            card.cards = 0
            gridContainer.style.pointerEvents = 'auto'
            if (gridContainer.getElementsByClassName('blur').length === shuffleCards.length) {
              clearInterval(card.timer)
              message.innerHTML = `<h2>Your time: ${timers.textContent}</h2>`

              // first set data only then get to show it
              w.localStorage.setItem(`time-${gameId}${w.localStorage.length}`, timers.textContent)

              // set data array on constant variable, for later use
              card.data = getData()
              // show data if data length is more than 0
              showData()

              gridContainer.innerHTML = ''
              button('Play again')
              message.style.display = 'block'
              // reset moves (clicks)
              card.clicks = 0
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
  function button(text) {
    statistics.classList.add('hidden')
    const btn = new Elements('button', 'btn', text)
    btn.onclick = () => {
      start()
      message.style.display = 'none'
      statistics.classList.remove('hidden')
    }
    message.appendChild(btn)
  }

  function showData() {
    // these lines should never be swapped,
    // because shift changes length and first element should be shown first
    if (card.data.length)
      message.innerHTML += '<h3>Best score: ' + card.data.shift() + '</h3>'
      // length is changed need to check is greater than zero or in other words not 0
    if (card.data.length>0)
      message.innerHTML += '<h3>Other scores: ' + card.data.join(', ') + '</h3>'

  }

  /**
   * @suppress {missingProperties|checkTypes}
   */
  function start() {
    // set localStorage item for visitor if not already game finished,
    // because we can check time value length, but in case game unfinished we set visitor
    w.localStorage.setItem('visitor-'+gameId, 1)

    shuffleCards = getShuffledArr(arr.concat(arr))
    shuffleCards.forEach(e => {
      const ele = new Elements('DIV', 'wrpko', '')
      const kor = new Elements('DIV', 'korta', '')
      const gal = new Elements('DIV', 'galas ' + e, '')
      const pri = new Elements('DIV', 'priekis', '')
      ele.appendChild(kor).appendChild(gal)
      kor.appendChild(pri)
      documentFragment.appendChild(ele)
    })
    gridContainer.appendChild(documentFragment)
    // show the timer
    timer()
    //just to show zero seconds and minutes
    minutes.innerHTML = seconds.innerHTML = '00'
    // show clicks (moves)
    clicks.innerHTML = card.clicks
  }

  function init() {
    // set data for later use
    card.data = getData()
    // show data if data length is more than 1
    showData()
    // create the start button with text 'Start'
    button('Start')
  }

  // initialize game on event DOM creation
  d.addEventListener('DOMContentLoaded', init)

  // hide notice message (By playing you accepting to write scores to your localStorage)
  // first set the hidden on HTML to not show (then show and hide again and never show again if visitor is set)
  notice.className = w.localStorage.getItem('visitor-'+gameId) === null ? '' : 'hidden'
})(window, document)
