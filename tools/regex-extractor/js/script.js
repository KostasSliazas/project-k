/*jshint esversion: 11*/
(function () {
  "use strict";
  const area = document.getElementById("area");
  const extract = document.getElementById("extract");
  const output = document.getElementById("output");
  const checkbox = document.querySelectorAll("input[name=regex]");
  const len = document.getElementById("length");
  const sum = document.getElementById("sum");
  const average = document.getElementById("average");
  const lenum = document.getElementById("lenum");
  const radios = document.getElementById("radios");
  const copyText = document.getElementById("copy");
  const customSimbol = document.getElementById("custom");
  const getChecked = (elem) => Array.from(elem).find((e) => e.checked);

  const calculators = (e) => {
    const { target } = e;
    const elem = getChecked(checkbox);

    if (elem.id === "lenum") {
      getChecked(radios.getElementsByTagName("INPUT")) || (radios.getElementsByTagName("INPUT")[0].checked = true);
    }

    if (target.id.match("num")) {
      Array.from(radios.getElementsByTagName("INPUT")).forEach((e) => (e.checked = false));
    } else if (target.id.match("don") || target.id.match("cus")) {
      lenum.checked = true;
      const terribleLine = `(?<!\\S)${parseInt(target.value) > 0 ? "\\d".repeat(target.value) : "[" + customSimbol.value + "\\d]+"}(?!\\S)`;
      lenum.value = terribleLine;
      lenum.nextElementSibling.textContent = `${terribleLine} select ${parseInt(target.value) || ""} number${target.value == "1" ? "" : "s"}(INT)`;
      if (target === customSimbol) radios.getElementsByTagName("INPUT")[6].checked = true;
    }

    const reg = new RegExp(`${elem.value}`, "g");
    let array = area.value.match(reg) || [0];
    const sumOfArray = array.reduce((a, b) => {
      const n1 = a.toString().split(".")[1];
      const n2 = b.toString().split(".")[1];
      const len1 = (n1 && n1.length) || 0;
      const len2 = (n2 && n2.length) || 0;
      return parseFloat((parseFloat(a) + parseFloat(b)).toFixed(len1 + len2));
    }, 0);
    output.textContent = array[0] === 0 && array.length === 1 ? (array = "") : array;
    len.textContent = array.length;
    sum.textContent = sumOfArray;
    average.textContent = sumOfArray / array.length;
    e.stopPropagation();
  };

  const copyTextToClipboard = async (c) => {
    try {
      await navigator.clipboard.writeText(c);
      console.log("copied to clipboard");
    } catch (error) {
      console.log("failed to copy to clipboard. error=" + error);
    }
  };
  //document.body.addEventListener("click", (e) => calculators(e));

  [extract, radios].forEach((e) => {
    addEventListener("click", (e) => calculators(e));
  });

  copyText.addEventListener("mouseup", () => copyTextToClipboard(output.innerText));

  [area, customSimbol].forEach((e) => {
    e.addEventListener("change", (e) => calculators(e));
    e.addEventListener("input", (e) => calculators(e));
  });
})();
