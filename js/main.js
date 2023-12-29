/**
 * Main off "moving blocks" script created by K.S.
 * @date 11/7/2023 - 12:57:36 AM
 */
/*jshint esversion: 11 */
(function (w, d) {
  "use strict";
  const random = (min, max) => Math.floor(Math.random() * (max - min)) + min;
  const movable = Array.from(d.getElementsByClassName("movable"));
  const roundToTen = num => Math.ceil(num / 10) * 10;
  const getElms = [...d.getElementsByTagName("input"), ...d.getElementsByTagName("a")];
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
  const root = d.documentElement;
  const typed = [];
  const codeDiv = d.querySelector(".wrp-container");
  const codeDivElems = Array.from(codeDiv.children[0].children);
  const bg = d.querySelector("#bg-file");
  const styles = ["width", "height", "left", "top"];
  const blockDefaults = "width:140px;height:60px;left:290px;top:50px;,width:180px;height:60px;left:10px;top:50px;,width:100px;height:60px;left:190px;top:50px;,width:80px;height:60px;left:470px;top:90px;,width:80px;height:60px;left:470px;top:150px;,width:140px;height:40px;left:220px;top:490px;,width:190px;height:140px;left:360px;top:470px;,width:220px;height:40px;left:200px;top:210px;,width:210px;height:100px;left:260px;top:110px;,width:130px;height:40px;left:420px;top:210px;,width:190px;height:160px;left:360px;top:310px;,width:190px;height:60px;left:360px;top:250px;,width:250px;height:50px;left:10px;top:110px;,width:250px;height:50px;left:10px;top:160px;,width:20px;height:120px;left:200px;top:490px;,width:160px;height:240px;left:200px;top:250px;,width:140px;height:80px;left:220px;top:530px;,width:190px;height:350px;left:10px;top:260px;,width:190px;height:50px;left:10px;top:210px;,width:120px;height:60px;left:430px;top:50px;,width:140px;height:40px;left:270px;top:10px;,width:140px;height:40px;left:410px;top:10px;,width:140px;height:20px;left:130px;top:30px;";
  const textAreaDefaults = "Good day. How may I assist you? You have the ability to reposition these blocks by selecting and holding the left corner at your desired location or by pressing ` on keyboard, or double-click to minimize them. Additionally, you can customize the theme, colors, and background image to your liking. You are free to tailor this interface to your preferences.If locked, to unlock, triple click and pin AB.";

  const textArea = d.getElementsByTagName("TEXTAREA")[0];
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
  const main = d.getElementById('main');
  const online = navigator.onLine;
  d.getElementById('is-online').textContent = online ? 'connected' : 'disconnected';
  const getPE = elem => elem.parentElement;
  const saved = getLocalStorageItems('pase') || setLocalStorageItems('pase', [3, 4]);
  const isLocked = getLocalStorageItems('isLocked');
  let count = 0;
  let mousedown = false;
  let scalingTarget = null;

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
      await this.delay(100);
      this.clicked = false;
    }
    delay(ms) {
      return new Promise(resolve => setTimeout(resolve, ms));
    }
  }
  const clickHandler = new ClickHandler();
  getElms.forEach(element => element.addEventListener("click", e => clickHandler.buttonClicker(e)));

  function getStyles() {
    let styleValues = [];
    movable.forEach((e) => {
      styles.forEach((value) => styleValues.push(`${value}:${e.style[value]};`));
      styleValues.push(',');
    });
    return styleValues.join('');
  }

  const mouseMoves = async (z, e) => {
    delay(500);
    e.style.left = roundToTen(z.clientX) - 10 + "px";
    e.style.top = roundToTen(z.clientY) - 10 + "px";
  };

  function getOffset(el) {
    const rect = el.getBoundingClientRect();
    return {
      left: rect.left + w.scrollX,
      top: rect.top + w.scrollY,
    };
  }

  // boolean value for test is moving or not
  let moving = false;
  // target global element variable
  let target = null;
  // add all movable class eventlistener mousedown
  const loopElem = () => {
    movable.forEach(async (e) => {
      await setTimeout(
        function () {
          this.style.left = roundToTen(getOffset(this).left) + "px";
          this.style.top = roundToTen(getOffset(this).top) + "px";
        }.bind(e),
        0
      );
      await setTimeout(
        function () {
          e.style.position = "fixed";
        }.bind(e),
        0
      );
      await setTimeout(
        function () {
          this.style.width = roundToTen(this.offsetWidth) + "px";
        }.bind(e),
        0
      );
      await setTimeout(
        function () {
          this.style.height = roundToTen(this.offsetHeight) + "px";
        }.bind(e),
        0
      );

      e.addEventListener("dblclick", (e) => {
        if (e.target.classList.contains("movable")) {
          const index = movable.indexOf(e.target);

          let array = getLocalStorageItems("elementClass");

          if (e.target.classList.contains("minimized")) {
            e.target.classList.remove("minimized");
            array = array.filter((item) => item !== index);
            setTimeout(() => {
              e.target.style.width = "auto";
              e.target.style.height = "auto";
            }, 0);
            setTimeout(() => {
              e.target.style.width = roundToTen(e.target.offsetWidth) + "px";
            }, 5);

            setTimeout(() => {
              e.target.style.height = roundToTen(e.target.offsetHeight) + "px";
            }, 7);
          } else if (e.target.classList.contains("movable")) {
            e.target.classList.add("minimized");
            array.push(index);
          }
          return setLocalStorageItems("elementClass", array);
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

  function showDate() {
    let d = new Date();
    let formatter = Intl.DateTimeFormat(
      "lt-LT", // a locale name; "default" chooses automatically
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
  // api url
  const api_url = "https://api.open-meteo.com/v1/forecast?latitude=55.7068&longitude=21.1391&hourly=temperature_2m";

  // Defining async function
  async function getAll(url) {
    // Storing response
    const response = await fetch(url);

    // Storing data in form of JSON
    var data = await response.json();
    // no data? return
    if (!response || !data) return false;
    setLocalStorageItems("statsData", data.hourly.temperature_2m);
  }


  function reduceValuesDynamically(arr, max) {
    if (arr.length === 0) return arr; // Return an empty array if input array is empty
    const maxInArray = Math.max(...arr.map(value => Math.abs(value)));
    const percentage = maxInArray > max ? ((maxInArray - max) / maxInArray) * 100 : 0;
    const factor = 1 - percentage / 100;
    const resultArray = arr.map(value => Math.min(value * factor, max));
    return resultArray;
  }

  //stats
  function stats(data) {
    const stats = d.querySelector("#stats");
    // no data? return with text '???'
    if (!data) return (stats.innerText = "???");
    const main = d.querySelector(".svg-holder");
    // make lenth shorter
    data.length = 25;
    const arrayConverted = reduceValuesDynamically(data.map(e => e.toFixed(2) * 10), 20);
    const svg = d.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("version", "1.1");
    svg.setAttribute("viewBox", "0 0 100 40");
    svg.setAttribute("xmlns", "http://www.w3.org/2000/svg");
    let space = 0;
    for (let i = 0; i < arrayConverted.length; i++) {
      const result = arrayConverted[i] > 0 ? 20 - arrayConverted[i] : 20 - arrayConverted[i];
      const fixed = result.toFixed(2);
      const path = d.createElementNS("http://www.w3.org/2000/svg", "path");
      path.setAttribute("d", "M" + space + ',' + fixed + " V 20");
      // path.setAttribute("fill", "none")
      // path.setAttribute("stroke", "var(--color4)");
      path.setAttribute("stroke-width", "3");
      path.setAttribute("width", "4");
      path.setAttribute("data-value", data[i]);
      svg.appendChild(path);
      space += 4;
    }
    main.appendChild(svg);
    const output = data[0] + " C";
    main.addEventListener("mouseover", function (e) {
      if (e.target.tagName === "path") {
        stats.style.display = "block";
        stats.innerText = e.target.getAttribute("data-value") + " C";
      }
    });
    main.addEventListener("mouseout", () => (stats.innerText = output));
    stats.innerText = output;
  }

  function applyStyles() {
    let classes = [];
    if (getLocalStorageItems("elementClass") !== null) {
      classes = getLocalStorageItems("elementClass");
    }

    if (getLocalStorageItems("elementStyles") === null) return;

    const getStyle = getLocalStorageItems("elementStyles").split(",");
    for (let i = 0; i < movable.length; i++) {
      movable[i].style = getStyle[i];
      movable[i].style.position = "fixed";
      if (classes.includes(movable.indexOf(movable[i]))) {
        movable[i].classList.add("movable", "minimized");
      }
    }
  }

  function setTimeStamp(interval) {
    //get current date
    const currentDate = Math.abs((new Date().getTime() / 1000).toFixed(0));
    // if does not exist create
    if (localStorage.getItem("timeStamp") !== null) {
      const futureDate = localStorage.getItem("timeStamp");
      const difference = currentDate - futureDate;
      const minutes = Math.floor(difference / 60) % 60;
      if (minutes <= interval) return false;
    }
    setLocalStorageItems("timeStamp", currentDate);
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

  const changerClass = index => {
    themeName.textContent = longNames[index];
    if (index) root.className = classNameVariables[index];
    else root.removeAttribute("class");
  };

  const loops = async (pos, val) => {
    const selected = Array.from(d.getElementsByName("move")).filter(e => e.checked)[0].value;
    movable.forEach(e => e.id !== "moves" && (e.style[pos] = parseInt(e.style[pos]) + val * selected + "px"));
    await delay(300);
    await setLocalStorageItems('elementStyles', getStyles());
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


  async function init() {
    const documentTitle = d.title;
    const areaText = d.querySelector("TEXTAREA");
    areaText.value = getLocalStorageItems("textArea") || textAreaDefaults;

    if (!getLocalStorageItems("elementClass")) {
      setLocalStorageItems("elementClass", [14]);
    }

    if (!getLocalStorageItems("elementStyles")) {
      setLocalStorageItems("elementStyles", blockDefaults);
    }

    if (setTimeStamp(43) && online) {
      await getAll(api_url);
    }

    if (getLocalStorageItems("theme-lines") === false) {
      main.classList.remove('bglines');
    }

    if (isLocked) {
      d.title = 'New Tab';
      hide(main);
    } else {
      show(main);
    }

    await hide(codeDiv);
    await stats(getLocalStorageItems("statsData"));
    await applyStyles();
    await loopElem();

    codeDivElems.forEach(e => {
      e.onclick = function (e) {
        typed.push(codeDivElems.indexOf(e.target));
        if (typed.length === saved.length && typed.every((v, i) => v === saved[i])) {
          setLocalStorageItems('isLocked', false);
          d.title = documentTitle;
          hide(codeDiv);
          show(main);
        }
      };
    });

    const NUM = parseInt(getLocalStorageItems("theme")) || 0;
    THEME_CHANGE.value = NUM;
    changerClass(NUM);
    styleRoot();
    setColors();

    d.getElementById("today").innerHTML = showDate();
    const clock = new Clock("clock");
    clock.startTime();
    d.body.style.display = 'block';
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
    const arrayOfItems = styleItems
      .map((item) => getLocalStorageItems(item))
      .filter(Boolean)
      .flat();

    d.documentElement.style.cssText = arrayOfItems.join(';');
  }

  async function mouseDownFun(e) {
    scalingTarget = e.target;

    if (scalingTarget.tagName === "TEXTAREA" && (mousedown = true)) {
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

  function mouseEvents(e) {
    const {
      target
    } = e;

    if (!target) {
      return;
    }

    const peTarget = getPE(target);
    const targetClass = peTarget ? peTarget.className : null;

    // Make opacity .5 for links with class "movable"
    if (targetClass === "movable" && target.tagName === "A") {
      target.style.opacity = ".5";
    }

    moving = false;

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
        mousedown = false;
      }
    } catch (error) {
      console.log({
        error
      });
    }
  }

  function dblclickFun(e) {
    if (e.target === copy) {
      e.target.textContent = "";
    }

    if (e.target.tagName === "TEXTAREA") {
      e.target.value = "";
    }
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

    if (target === "gt") {
      THEME_CHANGE.decrement();
    }

    if (target === "lt") {
      THEME_CHANGE.increment();
    }

    if (target === "lt" || target === "gt") {
      e.preventDefault();
      changerClass(THEME_CHANGE.value);
      // Set local storage only when the user clicks
      setLocalStorageItems("theme", THEME_CHANGE.value);
      setColors();
    }

    if (target === "left") {
      loops("left", -1);
    }

    if (target === "right") {
      loops("left", 1);
    }

    if (target === "top") {
      loops("top", -1);
    }

    if (target === "bottom") {
      loops("top", 1);
    }

    if (target === "lock") {
      count = 0;
      setLocalStorageItems('isLocked', true);
      hide(main);
      d.title = 'New Tab';
    }
    if (target === 'rotate90') {
      main.classList.toggle('lazy');
    }
    
    if (target === 'controls-hide') {
      moves.classList.add('hide');
    }

    if (target === "custom-theme" || target === "bg-toggle" || target === "reset-all" || target === "bg-theme") {
      e.target.removeAttribute("style");
      localStorage.removeItem(target);
      styleRoot();
    }

    if (target === "reset-all") {
      localStorage.clear();
      e.target.removeAttribute("class");
      setLocalStorageItems("elementStyles", blockDefaults);
      applyStyles();
      setColors();
      changerClass(0);
    }

    if (target === "bg-toggle") {
      setLocalStorageItems('theme-lines', main.classList.toggle('bglines'));
    }

    if (target === "custom-theme") {
      setColors();
    }

    if (target === "bg-theme") {
      bg.value = "";
    }
    count++;
    if (e.target.tagName === "BODY" && count === 3 && getLocalStorageItems('isLocked')) {
      show(codeDiv);
      typed.length = 0;
    }
  }

  function mouseMoveFun(z) {
    if (!moving || target === null || !target.classList.contains("movable")) {
      return;
    }
    mouseMoves(z, target);
  }

  bg.addEventListener("change", (e) => {
    const inputValue = e.target.files[0];
    const reader = new FileReader();

    reader.addEventListener("load",
      async () => {
          const fileString = `--bg:url(${reader.result})`;
          await delay(2000);
          setLocalStorageItems("bg-theme", fileString);
          styleRoot();
        },
        false
    );

    if (inputValue) {
      reader.readAsDataURL(inputValue);
    }
  });

  d.addEventListener("mousemove", mouseMoveFun);
  w.addEventListener("keyup", classToggle);
  root.addEventListener("click", rootClick);
  root.addEventListener("contextmenu", contextMenuFun);
  d.addEventListener("dblclick", dblclickFun);
  d.addEventListener("mousedown", mouseDownFun);
  d.addEventListener("mouseup", mouseEvents);
  d.addEventListener("DOMContentLoaded", init /*, { once: true }*/ );
})(window, document);
