/**
 * Main off "moving blocks" script created by K.S.
 * @date 11/7/2023 - 12:57:36 AM
 */
/*jshint esversion: 11 */
(function () {
    "use strict";
  // movable blocks default string
  const blockDefaults = "width:140px;height:60px;left:290px;top:10px;,width:180px;height:60px;left:10px;top:10px;,width:100px;height:60px;left:190px;top:10px;,width:80px;height:60px;left:470px;top:50px;,width:80px;height:60px;left:470px;top:110px;,width:140px;height:40px;left:220px;top:450px;,width:190px;height:140px;left:360px;top:430px;,width:220px;height:40px;left:200px;top:170px;,width:210px;height:100px;left:10px;top:70px;,width:130px;height:40px;left:420px;top:170px;,width:190px;height:160px;left:360px;top:270px;,width:190px;height:60px;left:360px;top:210px;,width:250px;height:50px;left:220px;top:70px;,width:250px;height:50px;left:220px;top:120px;,width:20px;height:120px;left:200px;top:450px;,width:160px;height:240px;left:200px;top:210px;,width:140px;height:80px;left:220px;top:490px;,width:190px;height:350px;left:10px;top:220px;,width:160px;height:260px;left:590px;top:70px;,width:190px;height:50px;left:10px;top:170px;,width:120px;height:60px;left:430px;top:10px;"
  // movable blocks defaults string
  const textAreaDefaults = "Good day. How may I assist you? You have the ability to reposition these blocks by selecting and holding the left corner at your desired location, or double-click to minimize them. Additionally, you can customize the theme, colors, and background image to your liking. You are free to tailor this interface to your preferences. Alternatively, you may opt to close this window and continue with your activities. The decision is entirely yours. Wishing you a splendid day, and a fulfilling life."
// https://stackoverflow.com/questions/45071353/copy-text-string-on-click/53977796#53977796
const copyToClipboard = str => {
  const el = document.createElement('textarea');  // Create a <textarea> element
  el.value = str;                                 // Set its value to the string that you want copied
  el.setAttribute('readonly', '');                // Make it readonly to be tamper-proof
  el.style.position = 'absolute';
  el.style.left = '-9999px';                      // Move outside the screen to make it invisible
  document.body.appendChild(el);                  // Append the <textarea> element to the HTML document
  const selected =
    document.getSelection().rangeCount > 0        // Check if there is any content selected previously
      ? document.getSelection().getRangeAt(0)     // Store selection if found
      : false;                                    // Mark as false to know no selection existed before
  el.select();                                    // Select the <textarea> content
  document.execCommand('copy');                   // Copy - only works as a result of a user action (e.g. click events)
  document.body.removeChild(el);                  // Remove the <textarea> element
  if (selected) {                                 // If a selection existed before copying
    document.getSelection().removeAllRanges();    // Unselect everything on the HTML document
    document.getSelection().addRange(selected);   // Restore the original selection
  }
};

  // prevent from fast accidental clicks
  const getElms = [...document.getElementsByTagName("button"), ...document.getElementsByTagName("a")];


  // let clicked = false;
  // async function buttonClicker(e) {
  //   if (clicked === true) {
  //     e.preventDefault();
  //     e.stopImmediatePropagation();
  //     return;
  //   }
  //   clicked = true;
  //   // await loader.call(e)
  //   await delay(500);
  //   clicked = false;
  // }
  // getElms.forEach((e) => e.addEventListener("click", (e) => buttonClicker.call(null, e)));
  // prevent from fast accidental clicks ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^


// for stoping acidental clicks
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
    await this.delay(500);
    this.clicked = false;
  }
  delay(ms) { return new Promise(resolve => setTimeout(resolve, ms));}
}

const clickHandler = new ClickHandler();
getElms.forEach(element => element.addEventListener("click", e => clickHandler.buttonClicker(e)));















  const getValueOfStorage = function () {
    return JSON.parse(localStorage.getItem(this));
  };

  /**
   * is online
   * @date 11/7/2023 - 1:15:34 AM
   *
   * @type {*}
   */
  var online = navigator.onLine;

  /**
   * styles array
   * @date 11/7/2023 - 1:16:10 AM
   *
   * @type {{}}
   */
  const styles = ["width", "height", "left", "top"];

  /**
   * Get style
   * @date 11/7/2023 - 1:17:22 AM
   *
   * @returns {string}
   */
  function getStyles() {
    let styleValues = "";
    movable.forEach((e) => {
      styles.forEach((value) => (styleValues += `${value}:${e.style[value]};`));
      styleValues += ",";
    });
    return styleValues;
  }

  /**
   * Movable elements
   * @date 11/7/2023 - 1:17:58 AM
   *
   * @type {array}
   */
  const movable = Array.from(document.getElementsByClassName("movable"));
  /**
   * Delay
   * @date 11/7/2023 - 1:18:34 AM
   */
  const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
  const roundToTenWidth = (num) => Math.ceil(num / 10) * 10;

  const mouseMoves = async (z, e) => {
    delay(500);
    e.style.left = roundToTenWidth(z.clientX) - 10 + "px";
    e.style.top = roundToTenWidth(z.clientY) - 10 + "px";
  };

  function getOffset(el) {
    const rect = el.getBoundingClientRect();
    return {
      left: rect.left + window.scrollX,
      top: rect.top + window.scrollY,
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
          this.style.left = roundToTenWidth(getOffset(this).left) + "px";
          this.style.top = roundToTenWidth(getOffset(this).top) + "px";
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
          this.style.width = roundToTenWidth(this.offsetWidth) + "px";
        }.bind(e),
        0
      );
      await setTimeout(
        function () {
          this.style.height = roundToTenWidth(this.offsetHeight) + "px";
        }.bind(e),
        0
      );

      e.addEventListener("dblclick", (e) => {
        if (e.target.classList.contains("movable")) {
          const index = movable.indexOf(e.target);

          let array = JSON.parse(localStorage.getItem("elementClass")) || [];

          if (e.target.classList.contains("minimized")) {
            e.target.classList.remove("minimized");
            array = array.filter((item) => item !== index);
            setTimeout(() => {
              e.target.style.width = "auto";
              e.target.style.height = "auto";
            }, 0);
            setTimeout(() => {
              e.target.style.width = roundToTenWidth(e.target.offsetWidth) + "px";
            }, 5);

            setTimeout(() => {
              e.target.style.height = roundToTenWidth(e.target.offsetHeight) + "px";
            }, 7);
          } else if (e.target.classList.contains("movable")) {
            e.target.classList.add("minimized");
            array.push(index);
          }
          return localStorage.setItem("elementClass", JSON.stringify(array));
        }
      });

     function findParent(element, className) {
      let currentElement = element;

    // Continue traversing up the DOM hierarchy until the body element
    while (currentElement && !currentElement.classList.contains(className)) {
        currentElement = currentElement.parentNode;

        // Break the loop if the body element is reached (or no parent is found)
        if (currentElement.tagName.toLowerCase() === 'body') {
            return null;
        }
    }

    // Return the found parent element (or null if not found)
    return currentElement;
      }

      e.addEventListener("mousedown", async function(e){
          if(e.target === this){ moving = true; }

          if (target !== null) target.style.zIndex = 'auto';
          target = this;
          target.style.zIndex = 1;

          await delay(200)
          if(moving)
          this.classList.add("mousedown");
      });
    });
  };

  document.addEventListener("mouseup", () => {
    moving = false;
    if (target) {
      setStyles();
      target.classList.remove("mousedown");
    }
  });
  document.addEventListener("mousemove", (z) => {
    if (target !== null && target.classList.contains("movable") && moving) mouseMoves(z, target);
  });





  class Clock {
  constructor(clockElementId) {
    this.clockElement = document.getElementById(clockElementId);
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
    const { h, m, s } = this.getCurrentTime();
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

    localStorage.setItem("statsData", JSON.stringify(data.hourly.temperature_2m));
  }

function reduceValuesDynamically(arr, max) {
  if (arr.length === 0) {
    return arr; // Return an empty array if input array is empty
  }

  const maxInArray = Math.max(...arr.map(value => Math.abs(value)));
  const percentage = maxInArray > max ? ((maxInArray - max) / maxInArray) * 100 : 0;

  const factor = 1 - percentage / 100;
  const resultArray = arr.map(value => Math.min(value * factor, max));

  return resultArray;
}

  //stats
  function stats(data) {
    const stats = document.querySelector("#stats");

    if (!data) return (stats.innerText = "???");
    const main = document.querySelector(".svg-holder");
    // data = data.splice(-25, 25);
    data.length = 25;
    // data.reverse()
    const arrayConverted = reduceValuesDynamically(data.map(e=>e.toFixed(2) * 10), 20);

    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("version", "1.1");
    svg.setAttribute("viewBox", "0 0 100 40");
    svg.setAttribute("xmlns", "http://www.w3.org/2000/svg");
    let space = 0;
    for (let i = 0; i < arrayConverted.length; i++) {
      const result = arrayConverted[i]>0?20 - arrayConverted[i]:20 - arrayConverted[i]
      const fixed = result.toFixed(2)
      const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
      path.setAttribute("d", "M" + space + ',' + fixed +" V 20");
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
      // else
      //show last elem
      // stats.style.display = "none"
    });

    main.addEventListener("mouseout", () => (stats.innerText = output));
    stats.innerText = output;
  }

  function applyStyles() {
    // for classes
    let classes = [];
    if (localStorage.getItem("elementClass") !== null) {
      classes = JSON.parse(localStorage.getItem("elementClass"));
    }

    if (localStorage.getItem("elementStyles") === null) return;
    const getStyle = localStorage.getItem("elementStyles").split(",");
    for (let i = 0; i < movable.length; i++) {
      movable[i].style = getStyle[i];
      // movable[i].style.height = 'auto'
      movable[i].style.position = "fixed";

      if (classes.includes(movable.indexOf(movable[i]))) {
        movable[i].classList.add("movable", "minimized");
      }
    }
  }

  function setStyles() {
    localStorage.setItem("elementStyles", getStyles());
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
    localStorage.setItem("timeStamp", currentDate);
    return true;
  }

  const root = document.documentElement;

  const random = (min, max) => Math.floor(Math.random() * (max - min)) + min;
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
  const classNameVariables = [0, "a", "b", "c", "d", "e", "f"];
  const THEME_CHANGE = arrayHelper.call(classNameVariables);

  const changerClass = e => {
    if (e) root.className = classNameVariables[e];
    else root.removeAttribute("class");
  };

  const loops = async (pos, val) => {
    const selected = Array.from(document.getElementsByName("move")).filter((e) => e.checked)[0].value;
    movable.forEach((e) => {
      if (e.id !== "moves") e.style[pos] = parseInt(e.style[pos]) + val * selected + "px";
    });
    await delay(300);
    await setStyles();
  };

  // document click events
  root.addEventListener("click", (e) => {
    const target = e.target.id
    if (target === "gt") THEME_CHANGE.decrement(); // eslint-disable-line
    if (target === "lt") THEME_CHANGE.increment(); // eslint-disable-line
    if (target === "lt" || target === "gt") {
      e.preventDefault();
      changerClass(THEME_CHANGE.value);
      //set local storage only when user click
      localStorage.setItem("theme", THEME_CHANGE.value);
      setColors();
    }

    if (target === "left") loops("left", -1);
    if (target === "right") loops("left", 1);
    if (target === "top") loops("top", -1);
    if (target === "bottom") loops("top", 1);
  });

  const moves = document.getElementById("moves");
  // toggle classList hide
  function classToggle(e) {
    if (e.isComposing || e.key === 229) return;

    // event key or target id
    var keyCode = e.which;
    // check if it's [`] symbol and inputs not focused then toggle class
    if (keyCode == 192 && !document.querySelector("input:focus")) {
      moves.classList.toggle("hide");
      e.preventDefault();
      e.stopImmediatePropagation();
    }
  }

  window.addEventListener("keyup", classToggle);

  root.addEventListener("contextmenu", (e) => {
    if (e.target.tagName === "HTML") {
      e.preventDefault();
      THEME_CHANGE.decrement(); // eslint-disable-line
      changerClass(THEME_CHANGE.value);
      //set local storage only when user click
      localStorage.setItem("theme", THEME_CHANGE.value);
      setColors();
    }
  });

  function setColors() {
    const compStyles = window.getComputedStyle(root);
    const colors = document.querySelectorAll("#colors input");
    const arrayColors = [];
    colors.forEach(async (e, i) => {

      e.parentElement.getElementsByTagName('label')[0].onclick = function(e) {
        if(e.target.tagName === 'LABEL'){
        // e.target.textContent = this.value
        copyToClipboard(this.title);
        e.preventDefault()
        }
      }.bind(e)

      const compValue = await compStyles.getPropertyValue("--color" + i);
      e.value = e.title = compValue;

      e.addEventListener("input", async (e) => {
        arrayColors[Array.from(colors).indexOf(e.target)] = e.target.value;
        const styleArray = arrayColors
          .map((e, index) => {
            if (e.length) return "--color" + index + ":" + e;
          })
          .filter(Boolean);
        const styles = styleArray.join(";");
        await localStorage.setItem("custom-theme", styles);
        styleRoot();
      });
    });
  }

  function styleRoot() {
    document.documentElement.style = localStorage.getItem("custom-theme") + ";" + localStorage.getItem("bg-theme");
  }

  async function init() {
    const areaText = document.getElementsByTagName("TEXTAREA")[0];
    if (!localStorage.getItem("elementClass")) localStorage.setItem("elementClass", JSON.stringify([14]));
    areaText.value = localStorage.getItem("textArea") || textAreaDefaults;
    // defaults by injecting to storage then loading string can be changed from localStorage (HTML should be not touched)
    if (!localStorage.getItem("elementStyles")) localStorage.setItem("elementStyles", blockDefaults);
    // check if there is no data in local storage or check if there time passed 43minutes and load api
    if (setTimeStamp(43) && online) await getAll(api_url);
    await stats(getValueOfStorage.call("statsData"));
    await applyStyles();
    await loopElem();
    document.getElementById("today").innerHTML = showDate();
    document.body.style.display = "block";
    const NUM = parseInt(getValueOfStorage.call("theme")) || 0; //random(0, classNameVariables.length);
    THEME_CHANGE.value = NUM;
    changerClass(NUM);
    styleRoot();
    if (JSON.parse(localStorage.getItem("theme-lines")) === false) document.body.classList.remove('bglines')
    const clock = new Clock("clock");
    clock.startTime();
    const bgToggle = document.querySelector("#bg-toggle");
    const themeReset = document.querySelector("#custom-theme");
    const bgReset = document.querySelector("#bg-theme");
    const resetAll = document.querySelector("#reset-all");
    const bg = document.querySelector("#bg-file");

    bg.addEventListener("change", (e) => {
      const inputValue = e.target.files[0];
      const reader = new FileReader();

      reader.addEventListener(
        "load",
        async () => {
          const fileSting = `--bg:url(${reader.result})`;
          root.style = root.style ? `${root.styler} + ;${fileSting}` : fileSting;
          await delay(2000);
          localStorage.setItem("bg-theme", fileSting);
        },
        false
      );

      if (inputValue) reader.readAsDataURL(inputValue);
    });

    [resetAll, bgReset, themeReset, bgToggle].forEach((e) =>
      e.addEventListener("click", (e) => {
        root.removeAttribute("style");
        localStorage.removeItem(e.target.id);
        styleRoot();
        if (e.target === resetAll) {
          root.removeAttribute("class");
          localStorage.clear();
          setColors();
        }
        if (e.target === bgToggle) {
          localStorage.setItem('theme-lines',document.body.classList.toggle('bglines'))
        }
        if (e.target === themeReset) {
          setColors();
        } else bg.value = "";
      })
    );

    setColors();
  }
  // add event listener to document
  document.addEventListener("DOMContentLoaded", init, { once: true });

  document.addEventListener("dblclick", (e) => {
    if (e.target.tagName === "TEXTAREA") e.target.value = "";
  });

  let mousedown = false;
  let scalingTarget = null;
  document.addEventListener("mousedown", async (e) => {
    scalingTarget = e.target;

    if (scalingTarget.tagName === "TEXTAREA") {
      mousedown = true;
      await delay(300);
      if (mousedown) {
        scalingTarget.style.width = scalingTarget.parentElement.style.width = "auto";
        scalingTarget.style.height = scalingTarget.parentElement.style.height = "auto";
      }
    }
  });

  const textArea = document.getElementsByTagName("TEXTAREA")[0];
  textArea.addEventListener("input", async (e) => {
    await delay(3000);
    localStorage.setItem("textArea", e.target.value.trim());
  });

  function mouseEvents(e) {
    const { target } = e;
    // to make opacity .3 like link is visited while not refreshed page
    if (target.parentElement?.className === "movable" && target.tagName === "A") {
      target.style.opacity = ".5";
    }

    try {
      if (scalingTarget.tagName === "TEXTAREA" && scalingTarget != null) {
        scalingTarget.parentElement.style.height = roundToTenWidth(scalingTarget.parentElement?.offsetHeight) + "px";
        scalingTarget.parentElement.style.width = roundToTenWidth(scalingTarget.parentElement?.offsetWidth) + "px";
        setStyles();
        mousedown = false;
      }
    } catch (error) {
      console.log({ error });
    }
  }

  document.addEventListener("mouseup", mouseEvents);
})();
