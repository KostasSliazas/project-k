/*jshint esversion: 11 */
(function () {
  "use strict";
  var online = navigator.onLine;
  const styles = ["width", "height", "left", "top"];

  function getStyles() {
    let styleValues = "";
    movable.forEach((e) => {
      styles.forEach((value) => (styleValues += `${value}:${e.style[value]};`));
      styleValues += ",";
    });
    return styleValues;
  }
  //get all movable elements with class name move
  const movable = Array.from(document.getElementsByClassName("movable"));
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

      e.addEventListener("mousedown", (e) => {
        //set global target element
        if (e.target.className === "movable") {
          if (target !== null) target.style.zIndex = 1;
          target = e.target;
          target.style.zIndex = 2;
          moving = true;
          e.target.classList.add("mousedown");
        }
      });
    });
  };

  document.addEventListener("mouseup", () => {
    if (target !== null && target.classList.contains("movable")) {
      moving = false;
      setStyles();
      target.classList.remove("mousedown");
    }
  });
  document.addEventListener("mousemove", (z) => {
    if (target !== null && target.classList.contains("movable") && moving) mouseMoves(z, target);
  });

  const CL = {
    ":": "cols",
  };

  function startTime() {
    var today = new Date();
    var h = today.getHours();
    var m = today.getMinutes();
    var s = today.getSeconds();
    m = checkTime(m);
    // s = checkTime(s);
    h = checkTime(h);
    let string = h + ":" + m; // + ":" + s;
    let dk = [...string].map((e) => `<div class="digit ${CL[e]}"> ${e} </div>`).join("");
    document.getElementById("clock").innerHTML = dk;
    var t = setTimeout(startTime, 1000);
  }

  function checkTime(i) {
    if (i < 10) i = "0" + i;
    return i;
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

  //stats
  function stats(data) {
    const stats = document.querySelector("#stats");

    if (!data) return (stats.innerText = "???");

    const randomData = data;
    // randomData.reverse()
    const main = document.querySelector(".svg-holder");
    //show last 33
    if (randomData.length > 32) randomData.length = 32;

    let total = 0;
    for (let i = 0; i < randomData.length; i++) total += randomData[i];
    let avg = total / randomData.length;

    const maxValue = Math.max(...randomData);
    const arrayConverted = [];
    for (let index = 0; index < randomData.length; ++index) arrayConverted.push(((randomData[index] + avg) * 100) / (maxValue + avg));
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("version", "1.1");
    svg.setAttribute("viewBox", "0 0 100 40");
    svg.setAttribute("xmlns", "http://www.w3.org/2000/svg");
    let space = 3;
    for (let i = arrayConverted.length - 1; i >= 0; i--) {
      const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
      path.setAttribute("d", "M" + space + " 100 v-" + Math.round(arrayConverted[i]));
      // path.setAttribute("fill", "none")
      path.setAttribute("stroke", "#000000");
      path.setAttribute("stroke-width", "2");
      path.setAttribute("data-value", randomData[i]);
      svg.appendChild(path);
      space += 3;
    }

    main.appendChild(svg);

    const output = randomData[0] + " C";

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
        movable[i].className = "movable minimized";
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
  const setVariables = (vars) =>
    Object.entries(vars).forEach((v) => {
      if (typeof v[1] === "function") return v[1]();
      root.style.setProperty(v[0], v[1]);
    });

  const myVariables = [
    { e: () => root.removeAttribute("style") },
    {
      "--color0": "#fff",
      "--color1": "#aaa",
      "--color2": "#bbb",
      "--color3": "#777",
      "--color4": "#888",
    },
    {
      "--color0": "#bdddfe",
      "--color1": "#81a1c2",
      "--color2": "#456586",
      "--color3": "#09294a",
      "--color4": "#111",
    },
    {
      "--color0": "#aaa",
      "--color1": "#bbb",
      "--color2": "#777",
      "--color3": "#222",
      "--color4": "#000",
    },
  ];

  var arrayHelper = function () {
    var ob = {};
    ob.full = ob.value = this.length;
    ob.increment = function () {
      this.value = this.value ? --this.value : this.full - 1;
    };
    ob.decrement = function () {
      this.value = this.value < this.full - 1 ? ++this.value : 0;
    };
    return ob;
  };
  const ok = arrayHelper.call(myVariables);
  // Object.seal(ok)

  // random theme on load
  if (random(0, 4) !== 3) setVariables(myVariables[random(0, 3)]);

  root.addEventListener("click", (e) => {
    if (e.target.tagName === "HTML") ok.decrement();
    setVariables(myVariables[ok.value]);
    localStorage.setItem("theme", ok.value);
  });

  async function init() {
    // defaults by injecting to storage then loading string can be changed from localStorage (HTML should be not touched)
    if (!localStorage.getItem("elementStyles")) localStorage.setItem("elementStyles", "width:100px;height:60px;left:900px;top:0px;,width:180px;height:60px;left:620px;top:0px;,width:100px;height:60px;left:800px;top:0px;,width:90px;height:60px;left:910px;top:200px;,width:90px;height:40px;left:910px;top:260px;,width:90px;height:40px;left:910px;top:160px;,width:90px;height:40px;left:910px;top:300px;,width:190px;height:40px;left:810px;top:360px;,width:220px;height:40px;left:690px;top:160px;,width:170px;height:40px;left:690px;top:740px;,width:140px;height:40px;left:690px;top:360px;,width:130px;height:40px;left:870px;top:680px;,width:220px;height:140px;left:690px;top:200px;,width:190px;height:60px;left:690px;top:680px;,width:310px;height:50px;left:690px;top:110px;,width:310px;height:50px;left:690px;top:60px;,width:310px;height:280px;left:690px;top:400px;");
    // check if there is no data in local storage or check if there time passed 43minutes and load api
    if (setTimeStamp(43) && online) await getAll(api_url);
    await stats(JSON.parse(localStorage.getItem("statsData")));
    await startTime();
    await applyStyles();
    await loopElem();
    document.getElementById("today").innerHTML = showDate();
    document.body.style.display = "block";
    const NUM = parseInt(localStorage.getItem("theme")) || 0;
    ok.value = NUM;
    setVariables(myVariables[ok.value]);
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
      await delay(700);
      if (mousedown) {
        scalingTarget.style.width = scalingTarget.parentElement.style.width = "auto";
        scalingTarget.style.height = scalingTarget.parentElement.style.height = "auto";
      }
    }
  });

  document.addEventListener("mouseup", (e) => {
    // to make opacity .3 like link is visited while not refreshed page
    const { target } = e;
    if (target.parentElement?.className === "movable" && target.tagName === "A") target.style.opacity = ".3";

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
  });
})();
