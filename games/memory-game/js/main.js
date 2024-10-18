/**
 * MemoryGame class to encapsulate the game logic.
 */
class MemoryGame {
  /**
   * MemoryGame constructor initializes game properties and elements.
   */
  constructor() {
    // Use window.localStorage directly
    this.local = window.localStorage;
    this.arr = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'j', 'k', 'l'];
    this.shuffleCards = this.getShuffledArr(this.arr.concat(this.arr));
    this.documentFragment = document.createDocumentFragment();
    this.gridContainer = document.getElementById('grid-container');
    this.message = document.getElementById('message');
    this.notice = document.getElementById('notice');
    this.statistics = document.getElementById('statistics');
    this.timers = document.getElementById('timers');
    this.clicks = document.getElementById('clicks');
    this.minutes = document.getElementById('minutes');
    this.seconds = document.getElementById('seconds');
    this.spiner = document.getElementById('spn');
    this.gameId = 'peaceonearth';
    this.card = {
      timer: 0,
      data: null,
      clickedCard: null,
      clicks: 0,
      cards: 0,
    };
  }

  /**
   * Shuffles an array using the Fisher-Yates algorithm.
   * @param {Array} arr - The array to be shuffled.
   * @return {Array} - The shuffled array.
   */
  getShuffledArr(arr) {
    const newArr = arr.slice();
    for (let i = newArr.length - 1; i > 0; i--) {
      const rand = Math.floor(Math.random() * (i + 1));
      [newArr[i], newArr[rand]] = [newArr[rand], newArr[i]];
    }
    return newArr;
  }

  /**
   * Creates a new HTML element with specified properties.
   * @param {string} tagName - The tag name of the element.
   * @param {string} className - The class name of the element.
   * @param {string} text - The inner HTML text of the element.
   * @return {HTMLElement|null} - The created HTML element, or null.
   */
  createElements(tagName, className, text) {
    const element = document.createElement(tagName);
    element.className = className;
    element.innerHTML = text;
    return /** @type {HTMLElement} */ (element);
  }

  /**
   * Initializes the game timer.
   */
  timer() {
    let sec = 0;

    /**
     * Pads a value with leading zeros if necessary.
     * @param {number} val - The value to pad.
     * @return {string} - The padded value as a string.
     */
    function pad(val) {
      return val > 9 ? String(val) : '0' + val;
    }

    this.card.timer = setInterval(() => {
      this.seconds.innerHTML = pad(++sec % 60);
      this.minutes.innerHTML = pad(parseInt(sec / 60, 10));
    }, 1000);
  }

  /**
   * Retrieves data from local storage.
   * @return {Array} - An array of retrieved data.
   */
  getData() {
    const data = [];
    for (let i = 0; i < this.local.length; i++) {
      const key = this.local.key(i);
      if (key.includes('time-' + this.gameId)) data.push(this.local.getItem(key));
    }
    data.sort((a, b) => a.localeCompare(b));
    return data;
  }

  /**
   * Handles click events on game cards.
   * @param {Event} e - The click event.
   */
  handleClick(e) {
    const target = e.target;

    if (target.classList.contains('korta')) {
      if (!this.card.cards) this.card.clickedCard = e.target;
      if (this.card.cards === 2) return false;
      ++this.card.cards;

      const randomClass = Math.round(Math.random()) >= 0.5 ? 'pasukti' : 'pasukti1';
      target.className += ' ' + randomClass;

      if (this.card.cards === 2) {
        this.card.clicks += 1;
        this.clicks.innerHTML = this.card.clicks;
        this.gridContainer.style.pointerEvents = 'none';

        if (this.card.clickedCard.firstChild.className === target.firstChild.className) {
          setTimeout(() => {
            target.classList.add('blur');
            this.card.clickedCard.classList.add('blur');
            this.card.cards = 0;
            this.gridContainer.style.pointerEvents = 'auto';
            if (this.gridContainer.getElementsByClassName('blur').length === this.shuffleCards.length) {
              clearInterval(this.card.timer);
              this.message.innerHTML = `<h2>Your time: ${this.timers.textContent}</h2>`;
              this.local.setItem(`time-${this.gameId}${this.local.length}`, this.timers.textContent);
              this.card.data = this.getData();
              this.showData();
              this.gridContainer.innerHTML = '';
              this.button('Play again');
              this.message.style.display = 'block';
              this.card.clicks = 0;
            }
          }, 300);
        } else {
          let inter = setTimeout(() => {
            clearTimeout(inter);
            inter = 0;
            target.classList.remove(randomClass);
            this.card.clickedCard.className = 'korta';
            this.card.cards = 0;
            this.gridContainer.style.pointerEvents = 'auto';
          }, 900);
        }
      }
    }
  }

  /**
   * Creates a button element with a click event.
   * @param {string} text - The text content of the button.
   */
  button(text) {
    this.statistics.classList.add('hidden');
    const btn = this.createElements('button', 'btn', text);
    btn.onclick = () => {
      this.start();
      this.message.style.display = 'none';
      this.statistics.classList.remove('hidden');
    };
    this.message.appendChild(btn);
  }

  /**
   * Displays best and other scores in the message.
   */
  showData() {
    if (this.card.data.length) this.message.innerHTML += '<h3>Best score: ' + this.card.data.shift() + '</h3>';
    if (this.card.data.length > 0) this.message.innerHTML += '<h3>Other scores: ' + this.card.data.join(', ') + '</h3>';
  }

  /**
   * Starts the game by initializing elements and timer.
   */
  start() {
    this.local.setItem('visitor-' + this.gameId, '1'); // Convert to string explicitly
    this.shuffleCards = this.getShuffledArr(this.arr.concat(this.arr));

    this.shuffleCards.forEach(e => {
      const ele = this.createElements('DIV', 'wrpko', '');
      const kor = this.createElements('DIV', 'korta', '');
      const gal = this.createElements('DIV', 'galas ' + e, '');
      const pri = this.createElements('DIV', 'priekis', '');
      ele.appendChild(kor).appendChild(gal);
      kor.appendChild(pri);
      this.documentFragment.appendChild(ele);
    });

    this.gridContainer.appendChild(this.documentFragment);
    this.timer();
    this.minutes.innerHTML = this.seconds.innerHTML = '00';
    this.clicks.innerHTML = this.card.clicks;
  }

  /**
   * Initializes the game by setting data and creating the start button.
   */
  init() {
    this.card.data = this.getData();
    this.showData();
    this.button('Start');
  }
}

/**
 * Adds an event listener to initialize the game when the DOM is loaded.
 */
document.addEventListener('DOMContentLoaded', () => {

  const memoryGame = new MemoryGame();

  /**
   * Preloads images by creating new Image objects and setting their src attributes.
   * @param {...string} urls - Image URLs to be preloaded.
   */
  function preload(...urls) {
    const images = [];
    let loadedCount = 0;

    function loadImage(url) {
      let image = new Image();
      image.onload = function () {
        loadedCount++;
        if (loadedCount === urls.length) {
          memoryGame.spiner.className = 'hidden'
          // All images are loaded, now you can initialize the MemoryGame
          memoryGame.init();
        }
      };
      image.src = url;
      images.push(image);
    }

    for (let i = 0; i < urls.length; i++) {
      loadImage(urls[i]);
    }
  }

  preload(
    "img/01.svg",
    "img/02.svg",
    "img/03.svg",
    "img/04.svg",
    "img/05.svg",
    "img/06.svg",
    "img/07.svg",
    "img/08.svg",
    "img/09.svg",
    "img/10.svg"
  );

  document.addEventListener('click', (e) => {
    memoryGame.handleClick(e);
  });
});
