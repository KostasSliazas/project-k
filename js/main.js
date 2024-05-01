/**
 * Main off "moving blocks" script created by K.S.
 * @date 11/7/2023 - 12:57:36 AM
 */

/*jshint esversion: 11 */

(function (w, d) {
  "use strict";
  const pindiscard = d.getElementById('pindiscard');
  const pinsave = d.getElementById('pinsave');
  const random = (min, max) => Math.floor(Math.random() * (max - min)) + min;
  const position = d.getElementById('position');
  const clicked = d.getElementById('clicked');
  const movable = Array.from(d.getElementsByClassName("movable"));
  const roundToTen = num => Math.ceil(num / 10) * 10;
  const setLocalStorageItems = (item, value) => localStorage.setItem(item, JSON.stringify(value));
  const getLocalStorageItems = (item) => {
    try {
      return JSON.parse(localStorage.getItem(item));
    } catch (error) {
      console.error("Error parsing JSON:", error.message);
      return null; // or any other default value
    }
  };
  const delay = ms => new Promise(resolve => setTimeout(resolve, ms));
  const hide = elem => elem.classList.add('hide');
  const show = (elem, type) => elem.classList.remove('hide');
  const main = d.getElementById('main');
  const online = navigator.onLine;
  const getPE = elem => elem.parentElement;
  const root = d.documentElement;
  const typed = [];
  const codeDiv = d.querySelector(".wrp-container");
  const defaultPin = d.querySelector("#code");
  const codeDivElms = Array.from(codeDiv.children[0].children);
  const textArea = d.getElementsByTagName("TEXTAREA")[0];
  const bg = d.querySelector("#bg-file");
  const styles = ["width", "height", "left", "top"];
  const blockDefaults = "width:90px;height:20px;left:260px;top:0px;,width:110px;height:40px;left:150px;top:0px;,width:110px;height:60px;left:150px;top:40px;,width:90px;height:60px;left:260px;top:40px;,width:160px;height:540px;left:350px;top:80px;,width:190px;height:190px;left:0px;top:100px;,width:160px;height:360px;left:190px;top:340px;,width:20px;height:120px;left:-20px;top:0px;,width:160px;height:240px;left:190px;top:100px;,width:160px;height:80px;left:350px;top:620px;,width:190px;height:410px;left:0px;top:290px;,width:150px;height:40px;left:0px;top:40px;,width:150px;height:40px;left:0px;top:0px;,width:90px;height:20px;left:260px;top:20px;,width:150px;height:20px;left:0px;top:80px;,width:160px;height:80px;left:350px;top:0px;";
  const textAreaDefaults = "Good day. You have the ability to reposition these blocks by selecting and holding the left corner at your desired location or by pressing the ` key on your keyboard. Alternatively, double-click to minimize them. Additionally, you can customize the theme, colors, and background image to your liking. Feel free to tailor this interface to your preferences. If locked, to unlock, simply triple-click on the background and then click 7AB (default PIN) or clear localStorage.";
  let isLocked = getLocalStorageItems('isLocked');
  let saved = getLocalStorageItems('mustashed') || [6, 3, 4];
  let minimized = [0,16,13,14,7];
  let count = 0;
  let allMouseClicks = 0;
  let mousedown = false;
  let scalingTarget = null;
  let isEnterPass = false;
  // boolean value for test is moving or not
  let moving = false;
  // target global element variable
  let target = null;
  // add all movable class eventlistener mousedown
  textArea.addEventListener("input", async (e) => {
    await delay(3000);
    setLocalStorageItems("textArea", e.target.value.trim());
  });

  // https://stackoverflow.com/questions/45071353/copy-text-string-on-click/53977796#53977796
  const copy = d.getElementById('clipboard');
  const copyToClipboard = str => {
    if (str === '0') return (copy.textContent = '');
    const el = d.createElement('textarea'); // Create a <textarea> element
    el.value = str; // Set its value to the string that you want copied
    el.setAttribute('readonly', ''); // Make it readonly to be tamper-proof
    el.style.position = 'absolute';
    el.style.left = '-9999px'; // Move outside the screen to make it invisible
    d.body.appendChild(el); // Append the <textarea> element to the HTML document
    const selected =
      d.getSelection().rangeCount > 0 ? d.getSelection().getRangeAt(0) : false; // Check if there is any content selected previously
    // Store selection if found
    // Mark as false to know no selection existed before
    el.select(); // Select the <textarea> content
    d.execCommand('copy'); // Copy - only works as a result of a user action (e.g. click events)
    copy.textContent = str;
    d.body.removeChild(el); // Remove the <textarea> element
    if (selected) { // If a selection existed before copying
      d.getSelection().removeAllRanges(); // Unselect everything on the HTML document
      d.getSelection().addRange(selected); // Restore the original selection
    }
  };

  class ClickHandler {
    constructor() {
      this.clicked = false;
    }

    async buttonClicker(e) {
      if (this.clicked === true) {
        e.preventDefault();
        e.stopImmediatePropagation();
        return;
      }

      this.clicked = true;
      await this.delay(200);
      this.clicked = false;
    }
    delay(ms) {
      return new Promise(resolve => setTimeout(resolve, ms));
    }
  }
  const clickHandler = new ClickHandler();
  const getElms = Array.from(d.getElementsByTagName("input")).concat(Array.from(d.getElementsByTagName("a")));
  getElms.forEach(element => element.addEventListener("click", e => clickHandler.buttonClicker(e)));


  function getStyles() {
    let styleValues = [];
    movable.forEach((e) => {
      styles.forEach((value) => styleValues.push(`${value}:${e.style[value]};`));
      styleValues.push(',');
    });
    return styleValues.join('');
  }


  function getOffset(el) {
    const rect = el.getBoundingClientRect();
    return {
      left: rect.left + w.scrollX,
      top: rect.top + w.scrollY,
    };
  }


  const loopElem = async () => {

    movable.forEach(async (e) => {
      await delay(30);
      e.style.left = roundToTen(getOffset(e).left) + "px";
      e.style.top = roundToTen(getOffset(e).top) + "px";
      e.style.position = "fixed";
      await delay(30);
      e.style.width = roundToTen(e.offsetWidth) + "px";
      e.style.height = roundToTen(e.offsetHeight) + "px";
      e.firstElementChild.title += ' (block index' + movable.indexOf(e) + ')';
      e.addEventListener("dblclick", async e => {
        if (e.target.classList.contains("movable")) {
          const index = movable.indexOf(e.target);
          let arrayOfMinimized = getLocalStorageItems("elementClass") || minimized;
          if (e.target.classList.contains("minimized")) {
            arrayOfMinimized = arrayOfMinimized.filter(c => c !== index);
            await e.target.classList.remove("minimized");
            await delay(30);
            e.target.style.width = "auto";
            await delay(30);
            e.target.style.height = "auto";
            await delay(30);
            e.target.style.height = roundToTen(e.target.offsetHeight) + "px";
            e.target.style.width = roundToTen(e.target.offsetWidth) + "px";
          } else if (e.target.classList.contains("movable")) {
            e.target.classList.add("minimized");
            arrayOfMinimized.push(index);
          }

          setLocalStorageItems('elementStyles', getStyles());
          setLocalStorageItems("elementClass", arrayOfMinimized);
        }
      });

      e.addEventListener("mousedown", async function (e) {
        if (e.target === this) {
          moving = true;
        }

        if (target !== null) target.style.zIndex = 'auto';
        target = this;
        target.style.zIndex = 1;

        await delay(200);
        if (moving)
          this.classList.add("mousedown");
      });
    });
  };


  class Clock {
    constructor(clockElementId) {
      this.clockElement = d.getElementById(clockElementId);
    }
    formatTimeUnit(unit) {
      return unit < 10 ? `0${unit}` : unit;
    }
    getCurrentTime() {
      const day = new Date();
      return {
        m: this.formatTimeUnit(day.getMinutes()),
        s: this.formatTimeUnit(day.getSeconds()),
        h: this.formatTimeUnit(day.getHours()),
      };
    }
    updateClock() {
      const {
        h,
        m,
        s
      } = this.getCurrentTime();
      this.clockElement.textContent = [h, m, s].join(':');
    }
    startTime() {
      this.updateClock();
      setInterval(() => this.updateClock(), 1000);
    }
  }

  function showWeekDay() {
    const weekday = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    const d = new Date();
    return weekday[d.getDay()];
  }

  function showDate() {
    let d = new Date();
    let formatter = Intl.DateTimeFormat("lt-LT", // a locale name; "default" chooses automatically
      {
        weekday: "short",
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "numeric",
        minute: "numeric",
      }
    );

    return formatter.format(d).slice(0, 10);
  }
  // api current list temperatures
  //const api_url_current = "https://api.open-meteo.com/v1/forecast?latitude=55.7068&longitude=21.1391&current=temperature_2m";
  // api url list temperatures
  const api_url = "https://api.open-meteo.com/v1/forecast?latitude=55.7068&longitude=21.1391&hourly=temperature_2m";
  // Defining async function
  async function getAll(url) {
    // Storing response
    const response = await fetch(url);
    // Storing data in form of JSON
    var data = await response.json();
    // no data? return
    if (!response || !data) return false;
    // set data to storage
    setLocalStorageItems("statsData", data.hourly.temperature_2m);
  }


  // round values replace for better showing stats
  function reduceValuesDynamically(arr, max) {
    if (arr.length === 0) return arr; // Return an empty array if input array is empty
    const maxInArray = Math.max(...arr.map(value => Math.abs(value)));
    const percentage = maxInArray > max ? ((maxInArray - max) / maxInArray) * 100 : 0;
    const factor = 1 - percentage / 100;
    const resultArray = arr.map(value => Math.min(value * factor, max));
    return resultArray;
  }

  function addLeadingZero(time) {
    // Check if the length of the time string is less than 2
    return time.toString().length < 2 ? "0" + time : time;
  }

  //stats for TEMPERATURE api
  function stats(data) {
    // no data? return
    if (!data) return;
    const stats = d.querySelector("#stats");

    // Create a new Date object
    var now = new Date();
    // Get the current hour between 0 and 23, representing the hours in a day
    var currentHour = now.getHours();

    const main = d.querySelector(".svg-holder");
    // make length shorter
    data.length = 34;
    const arrayConverted = reduceValuesDynamically(data.map(e => e.toFixed(2) * 10), 16);
    const svg = d.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("version", "1.1");
    svg.setAttribute("viewBox", "0 0 100 32");
    svg.setAttribute("xmlns", "http://www.w3.org/2000/svg");
    svg.setAttribute("id", "sunshine");
    let space = 2;
    for (let i = 0; i < arrayConverted.length; i++) {
      const result = arrayConverted[i] > 0 ? 16 - arrayConverted[i] : 16 - arrayConverted[i];
      const fixed = result.toFixed(2);
      const path = d.createElementNS("http://www.w3.org/2000/svg", "path");
      path.setAttribute("d", "M" + space + ',' + fixed + " V 16");
      path.setAttribute("stroke-width", "2");
      path.setAttribute("data-value", data[i]);
      // add hour numbers
      if(i<24) path.setAttribute("data-hour", i);
      // set other color of selected hour
      if(currentHour === i) path.setAttribute("style", "stroke:var(--color4)");
      //show 24hrs only solid color other transparent
      if(i>23) path.setAttribute("class", 'tr');
      svg.appendChild(path);
      space += 3;
    }
    main.appendChild(svg);


    const output = data[currentHour] + "°C";

    main.addEventListener("mouseover", function (e) {
     // Extracting the target element from the event object
    const targetElement = e.target;

    // Checking if the target element is a 'path'
    if (targetElement.tagName === "path") {
        // Retrieving temperature and hour data attributes from the target element
        const temperature = targetElement.getAttribute("data-value") + "°C";
        const hour = targetElement.getAttribute("data-hour");

        // Setting the text content of the 'stats' element with temperature
        let statsText = temperature;

        // If hour data is available, formatting it with leading zero and appending it to statsText
        if (hour !== null) {
            const hourText = '|' + addLeadingZero(parseInt(hour)) + 'h';
            statsText += hourText;
        }

        // Setting the text content of the 'stats' element
        stats.innerText = statsText;
    }
    });
    main.addEventListener("mouseout", () => (stats.innerText = output));
    stats.innerText = output;
  }


  function applyStyles() {
    const styles = getLocalStorageItems("elementStyles") || blockDefaults;
    const mini = getLocalStorageItems("elementClass") || minimized;
    const getStyle = styles.split(",");
    for (let i = 0; i < movable.length; i++) {
      movable[i].style = getStyle[i];
      movable[i].style.position = "fixed";
      if (mini.includes(movable.indexOf(movable[i]))) {
        movable[i].classList.add("minimized");
      } else {
        movable[i].classList.remove("minimized");
      }
    }
  }


  function setTimeStamp(interval) {
      // Check if localStorage is available
      if (typeof localStorage === 'undefined') {
          console.error("localStorage is not available.");
          return false;
      }

      // Get current date in seconds
      const currentDate = Math.floor(new Date().getTime() / 1000);

      // Retrieve previous timestamp from localStorage
      const previousTimeStamp = parseInt(localStorage.getItem("timeStamp"));

      // If timestamp exists and interval has not passed, return false
      if (!isNaN(previousTimeStamp) && (currentDate - previousTimeStamp) < interval) {
          return false;
      }

      // Set new timestamp in localStorage
      localStorage.setItem("timeStamp", currentDate.toString());

      // Return true to indicate that interval has passed
      return true;
  }


  // for theme changing
  var arrayHelper = function () {
    var ob = {};
    ob.value = ob.full = this.length;
    ob.increment = function () {
      this.value = this.value ? --this.value : this.full - 1;
    };
    ob.decrement = function () {
      this.value = this.value < this.full - 1 ? ++this.value : 0;
    };
    return ob;
  };

  const themeName = d.getElementById('theme-name');
  const longNames = ['inner peace', 'peace on earth', 'cool dudes', 'sunshine', 'someday', 'everything fine', 'night?'];
  const classNameVariables = [0, "a", "b", "c", "d", "e", "f"];
  const THEME_CHANGE = arrayHelper.call(classNameVariables);

  // change main theme
  const changerClass = index => {
    themeName.textContent = longNames[index];
    if (index) root.className = classNameVariables[index];
    else root.removeAttribute("class");
    if (d.getElementById('enabled-bg').checked === true) {
      root.classList.add('bg-image');
    } else {
      root.classList.remove('bg-image');
    }
  };

  // move all blocks at once
  const loops = async (pos, val) => {
    const selected = Array.from(d.getElementsByName("move")).filter(e => e.checked)[0].value;
    movable.forEach(e => e.id !== "moves" && (e.style[pos] = parseInt(e.style[pos]) + val * selected + "px"));
    await delay(300);
    setLocalStorageItems('elementStyles', getStyles());
  };


  const moves = d.getElementById("moves");
  // toggle classList hide
  function classToggle(e) {
    if (e.isComposing || e.key === 'Unidentified') return;

    // event key or target id
    const keyCode = e.key || String.fromCharCode(e.keyCode);

    // check if it's [`] symbol and inputs not focused then toggle class
    if (keyCode === '`' && !d.querySelector("input:focus")) {
      moves.classList.toggle("hide");
      e.preventDefault();
      e.stopImmediatePropagation();
    }
  }
  let handleMousemove = (event) => {
    position.textContent = (`${event.x}:${event.y}`);
  };
  const lockerMouseMovments = debounce(handleMousemove, 200);

  const isDisplayed = (elem) => {
    const style = window.getComputedStyle(elem);
    const isDisplay = style.getPropertyValue("display") !== 'none'? true : false;
    return isDisplay;
  };

  async function init() {
    defaultPin.title = saved;
    d.getElementById('is-online').textContent = online ? 'connected' : 'disconnected';
    d.getElementById('day-of-week').textContent = showWeekDay();
    const documentTitle = d.title;
    textArea.value = getLocalStorageItems("textArea") || textAreaDefaults;
    if (setTimeStamp(43) && online) {
      const ok = await getAll(api_url);
    }

    await hide(codeDiv);
    await stats(getLocalStorageItems("statsData"));
    await applyStyles();
    await loopElem();

    codeDivElms.forEach(e => {
      e.onclick = function (e) {
        e.stopPropagation(); //prevent from parent clicks
        typed.push(codeDivElms.indexOf(e.target));
        if (isEnterPass === false && typed.length === saved.length && typed.every((v, i) => v === saved[i])) {
          setLocalStorageItems('isLocked', (isLocked = false));

          d.title = documentTitle;
          hide(codeDiv);
          show(main);
          d.removeEventListener('mousemove', lockerMouseMovments);
        }
      };
    });

    const NUM = parseInt(getLocalStorageItems("theme")) || 0;
    THEME_CHANGE.value = NUM;
    changerClass(NUM);
    styleRoot();
    setColors();

    d.getElementById("today").innerHTML = showDate();

    // renew clock if only displayed
    if(isDisplayed(d.getElementById("clock").parentElement)){
    const clock = new Clock("clock");
    clock.startTime();
    }

    d.body.style.display = 'block';


    // remove lines if set to false in local storage by default show them
    const isCheckedLines = getLocalStorageItems("theme-lines");
    if (isCheckedLines === false) {
      d.getElementById('bg-toggle').checked = false;
      main.classList.remove('lines');
    }
    // remove default bg by default true
    const isCheckedBg = getLocalStorageItems("theme-bg");
    if (isCheckedBg === false) {
      d.getElementById('enabled-bg').checked = false;
      root.classList.remove('bg-image');
    }
    // remove default repeating
    const isRepeatingBg = getLocalStorageItems("bg-repeat");
    if (isRepeatingBg === true) {
      d.getElementById('repeat-toggle').checked = true;
      main.classList.add('bg-repeat');
    }

    if (isLocked) {
      d.title = 'New Tab';
      hide(main);
    } else {
      show(main);
    }
  }

  async function setColors() {
    const compStyles = w.getComputedStyle(root);
    const colors = d.querySelectorAll("#colors input[type=color]");
    const arrayColors = [];

    colors.forEach(async (e, i) => {
      const compValue = await compStyles.getPropertyValue("--color" + i);
      e.value = e.title = compValue;
      const label = getPE(e).getElementsByTagName('label')[0];
      label.innerText = compValue.toUpperCase();
      label.onclick = (e) => {
        e.preventDefault();
        copyToClipboard(compValue.toUpperCase());
      };

      e.addEventListener("input", async (e) => {
        const label = getPE(e.target).getElementsByTagName('label')[0];
        label.innerText = e.target.value.toUpperCase();
        const index = Array.from(colors).indexOf(e.target);
        arrayColors[index] = `--color${index}:${e.target.value}`;
        setLocalStorageItems("custom-theme", arrayColors.filter(Boolean));
        styleRoot();
      });
    });
  }


  function styleRoot() {
    const styleItems = ["bg-theme", "custom-theme"];
    const arrayOfItems = styleItems.map((item) => getLocalStorageItems(item)).filter(Boolean).flat();
    d.documentElement.style.cssText = arrayOfItems.join(';');
  }


  function contextMenuFun(e) {
    if (e.target.tagName === "MAIN") {
      e.preventDefault();
      THEME_CHANGE.decrement(); // eslint-disable-line
      changerClass(THEME_CHANGE.value);
      //set local storage only when user click
      setLocalStorageItems("theme", THEME_CHANGE.value);
      setColors();
    }

    if (e.target.textContent || e.target.value) {
      e.preventDefault();
      if (e.target.getAttribute('type') == null || e.target.getAttribute('type').toUpperCase() === 'BUTTON' || e.target.getAttribute('type').toUpperCase() === 'RESET') return;
      copyToClipboard(e.target.textContent || e.target.value);
    }

  }


  function rootClick(e) {
    const target = e.target.id;
    if (target === "gt") THEME_CHANGE.decrement();
    if (target === "lt") THEME_CHANGE.increment();

    if (target === "left") loops("left", -1);
    if (target === "right") loops("left", 1);
    if (target === "top") loops("top", -1);
    if (target === "bottom") loops("top", 1);

    if (target === "lt" || target === "gt") {
      changerClass(THEME_CHANGE.value);
      setLocalStorageItems("theme", THEME_CHANGE.value);
      setColors();
    }

    if (target === 'rotate90') main.classList.toggle('lazy');
    if (target === 'controls-hide') moves.classList.add('hide');

    if (target === "custom-theme" || target === "bg-toggle" || target === "reset-all" || target === "bg-theme") {
      e.target.removeAttribute("style");
      localStorage.removeItem(target);
      styleRoot();
    }

    if (target === "reset-all") {
      localStorage.clear();
      root.removeAttribute("class");
      setColors();
      changerClass(0);
      applyStyles();
    }
    // set att once theme lines class and item of localStorage
    if (target === "bg-toggle") {
      if (!main.classList.contains('lines') && e.target.checked) {
        setLocalStorageItems('theme-lines', true);
        main.classList.add('lines');
      } else {
        setLocalStorageItems('theme-lines', false);
        main.classList.remove('lines');
      }
    }

    if (target === 'enabled-bg') {
    const repeatBg = document.getElementById('repeat-toggle');
      if (!root.classList.contains('bg-image') && e.target.checked) {
        setLocalStorageItems('theme-bg', true);
        root.classList.add('bg-image');
      } else {
        repeatBg.checked = false;
        main.classList.remove('bg-repeat');
        setLocalStorageItems('bg-repeat', false);

        root.classList.remove('bg-image');
        setLocalStorageItems('theme-bg', false);
      }
    }
    if (target === 'repeat-toggle') {
      const bg = document.getElementById('enabled-bg');
      if (!main.classList.contains('bg-repeat') && e.target.checked) {
        bg.checked = true;
        setLocalStorageItems('bg-repeat', true);
        main.classList.add('bg-repeat');
        setLocalStorageItems('theme-bg', true);
        root.classList.add('bg-image');
      } else {
        // bg.checked = false
        main.classList.remove('bg-repeat');
        setLocalStorageItems('bg-repeat', false);
        // root.classList.remove('bg-image');
        // setLocalStorageItems('theme-bg', false);
      }
    }
    if (target === "custom-theme") setColors();
    if (target === "bg-theme") bg.value = "";

    // only for locking system
    if (target === "lock") {
      count = 0;
      setLocalStorageItems('isLocked', (isLocked = true));
      hide(main);
      d.title = 'New Tab';
    }

    if (target === "code") {
      typed.length = 0;
      show(codeDiv);
      isEnterPass = true;
    }

    if (target === "pinsave" && typed.length) {
      setLocalStorageItems('mustashed', typed);
      isEnterPass = false;
      saved = getLocalStorageItems('mustashed');
      defaultPin.title = saved;
      hide(codeDiv);
    }
    if (target === "pindiscard") {
      hide(codeDiv);
    }

    if (e.target.className !== "container" && count === 2 && getLocalStorageItems('isLocked')) {
      d.addEventListener('mousemove', lockerMouseMovments);
      show(codeDiv);
      count = typed.length = 0; // RESET array length and count when not container clicked
    }
    // count only if body is clicked
    if (e.target.tagName === 'BODY') count++;

    // show statistics about mouse
    allMouseClicks++;
    clicked.textContent = allMouseClicks;

    if (isEnterPass) {
      show(pindiscard);
      show(pinsave);
    } else {
      hide(pinsave);
      hide(pindiscard);
    }
  }


  function dblclickFun(e) {
    if (e.target === copy) e.target.textContent = "";
    //if (e.target.tagName === "TEXTAREA") e.target.value = "";
  }


  function bgChange(e) {
    const inputValue = e.target.files[0];
    const reader = new FileReader();

    reader.addEventListener("load", async () => {
      const fileString = `--bg:url(${reader.result})`;
      await delay(200);
      setLocalStorageItems("bg-theme", fileString);
      styleRoot();
    }, false);

    if (inputValue) reader.readAsDataURL(inputValue);
  }


  const mouseMoves = (z, e) => {
    e.style.left = roundToTen(z.clientX) - 10 + "px";
    e.style.top = roundToTen(z.clientY) - 10 + "px";
  };


  function mouseMoveEvents(z) {
    if (!moving || target === null || !target.classList.contains("movable")) return;
    mouseMoves(z, target);
  }


  function mouseUpEvents(e) {
    moving = false;

    const {
      target
    } = e;
    if (!target) return;

    const peTarget = getPE(target);
    const targetClass = peTarget ? peTarget.className : null;

    // Make opacity (highlight).5 for links with class "movable" till next refresh(like visited)
    if (targetClass === "movable" && target.tagName === "A") target.style.opacity = ".5";


    if (targetClass) {
      setLocalStorageItems('elementStyles', getStyles());
      target.classList.remove("mousedown");
    }

    try {
      if (scalingTarget && peTarget && scalingTarget.tagName === "TEXTAREA" && scalingTarget !== null) {
        const peScalingTarget = getPE(scalingTarget);
        scalingTarget.style.height = peScalingTarget.style.height = roundToTen(peScalingTarget.offsetHeight) + "px";
        peScalingTarget.style.width = roundToTen(peScalingTarget.offsetWidth) + "px";
        setLocalStorageItems('elementStyles', getStyles());
      }
    } catch (error) {
      console.log({
        error
      });
    }
  }

  async function mouseDownEvents(e) {
    scalingTarget = e.target;

    if (scalingTarget.tagName === "TEXTAREA") {
      mousedown = true;
      const computedStyles = w.getComputedStyle(scalingTarget);
      const height = await computedStyles.getPropertyValue('height');
      const width = await computedStyles.getPropertyValue('width');

      scalingTarget.style.width = width;
      scalingTarget.style.height = height;

      const parentElement = getPE(scalingTarget);
      parentElement.style.width = "auto";
      parentElement.style.height = "auto";
    }
  }

  function debounce(func, delay) {
    let timeoutId;

    return function () {
      const context = this;
      const args = arguments;

      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        func.apply(context, args);
      }, delay);
    };
  }

  function throttle(func, delay) {
    let lastCallTime = 0;

    return function () {
      const now = new Date().getTime();

      if (now - lastCallTime >= delay) {
        func.apply(null, arguments);
        lastCallTime = now;
      }
    };
  }

  // events listeners
  bg.addEventListener("change", bgChange);
  w.addEventListener("keyup", classToggle);
  d.addEventListener("dblclick", dblclickFun);
  d.addEventListener("mousemove", throttle(mouseMoveEvents, 60));
  d.addEventListener("mousedown", mouseDownEvents);
  d.addEventListener("mouseup", mouseUpEvents);
  d.addEventListener("DOMContentLoaded", init /*, { once: true }*/ );
  root.addEventListener("click", rootClick);
  root.addEventListener("contextmenu", contextMenuFun);
})(window, document);

(function () {
  "use strict";
  const BEEP_AUDIO = new window.Audio("data:audio/mp3;base64,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");
  const CALC = document.getElementById("calculator");
  const CALC_SCREEN = document.getElementById("src");
  CALC_SCREEN.value = 0;
  let n1 = [];
  let n2 = 0;
  let op = null;
  let lastop = null;
  let result = 0;

  const sound = () => {
    BEEP_AUDIO.play();
    window.navigator.vibrate(30);
  };

  const add = (n, o) => n + o;
  const sub = (n, o) => n - o;
  const div = (n, o) => n / o;
  const mul = (n, o) => n * o;
  const res = (n) => n;

  const cals = {
    "/": div,
    "×": mul,
    "+": add,
    "-": sub,
    "=": res,
  };

  const cal = (num1, num2, calback) => {
    if (typeof calback === "function") {
      const n1 = num1.toString().split(".")[1];
      const n2 = num2.toString().split(".")[1];
      const len1 = (n1 && n1.length) || 0;
      const len2 = (n2 && n2.length) || 0;
      if (lastop !== "/") {
        return parseFloat(calback(Number(num1), Number(num2)).toFixed(len1 + len2));
      }
      return calback(Number(num1), Number(num2));
    }
  };

  const btn = (e) => {
    // e.preventDefault()
    // e.stopPropagation()
    // if don't mach input or screen or esaund return
    if (!e.target.matches("input") || e.target.id === "esound" || e.target.id === "src") {
      e.preventDefault();
      e.stopPropagation();
      return;
    }
    CALC_SCREEN.classList.add("blink");

    // if checked sound play that creapy sound
    if (document.getElementById("esound").checked) sound();

    // set operator when target is fun
    if (e.target.dataset.fun) op = e.target.value;

    // when number pressed push to array number
    if (e.target.dataset.num) {
      op = null;
      if (n1[0] === "0" && n1[1] !== ".") n1.length = 0;
      n1.push(e.target.value);
    }

    // operator delete last number
    if (op === "⌫") {
      n1 = result
        .toString(10)
        .substring(0, 15)
        .replace(/[^0-9]/g, ".")
        .split("");
      n1.pop();
      if (n1.join("").charAt(n1.join("").length - 1) === ".") n1.pop();
    }

    // if no number set 0
    if (!n1.length) n1 = ["0"];
    if (op === "," && !n1.includes(".")) n1.push(".");
    result = n1.join("");

    // operator is /*+-=
    if (op === "/" || op === "×" || op === "+" || op === "-" || op === "=") {
      if (n2 && lastop) {
        result = cal(Number(n2), Number(result), cals[lastop]);
      }
      lastop = res(op);
      n2 = result;
      n1.length = 0;
    }

    // operator clear all
    if (op === "C") {
      op = lastop = null;
      result = n2 = n1.length = 0;
    }
    CALC_SCREEN.value = !isFinite(result) ? "ERROR" : result;
    // e.stopImmediatePropagation()
  };

  CALC.addEventListener("mousedown", (e) => btn(e));
  CALC.addEventListener("mouseup", (e) => setTimeout(() => CALC_SCREEN.classList.remove("blink"), 9)); // blink screen number
})();
