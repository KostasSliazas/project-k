;(function(){
"use strict";
      let arrays = [];
      let toggleBolean = true; //for sorting toggle value
      const inputs = document.getElementById("input");
      const outputs = document.getElementById("outputs");
      const shuffle = document.getElementById("shuffle");
      const seper = document.getElementById("seper");
      const linebreak = document.getElementById("linebreak");
      const doubles = document.getElementById("doubles");
      const sorts = document.getElementById("sorts");
      const tolowercase = document.getElementById("lower-case");
      const toupercase = document.getElementById("upper-case");
      const capitalize = document.getElementById("case");
      const statisticsW = document.getElementById("statsw");
      const statisticsL = document.getElementById("statsl");
      const sortsLength = document.getElementById("sorts-length");
      const meta = document.getElementById("meta");
      const copyText = document.getElementById("copy");
      const statisticsN = document.getElementById("statsn");

      const changed = (e) => {
        if (e.target) toggleBolean = !toggleBolean;
        e = e.target || e;
        e.innerHTML =
          (toggleBolean ? "(a-b)" : "(b-a)") +
          " " +
          e.innerHTML.split(" ").pop();
      };
      // set array output filter with regex and trim
      const inputArray = () => {
      let regex = new RegExp(/[^\n[a-zA-Z0-9]+| ,]+/)
      if ((inputs.value.match(/\n/g)||[]).length) {regex = new RegExp((/\n/g)||[])}
        const values = inputs.value
          .toLowerCase()
          .split(regex)
          .filter(Boolean)
          .map((item) => item.trim());
        if (doubles.checked) arrays = [...new Set(values)];
        else arrays = values;
      };

      // output statistic array letter length
      const showStatsLetters = () =>{
      statisticsN.innerHTML = (inputs.value.match(/\n/g)||[]).length
      statisticsL.innerHTML = arrays.join("").length
      // output statistic array length
      statisticsW.innerHTML = arrays.length
      }
      // clear inputs on dblclick event
      const clear = (e) => {
        e.target.value = "";
        outputs.innerHTML = "";
      };
      //outputs whole string
      const output = () =>
        (outputs.innerHTML = arrays.join(spLineBreak(seper)));
      //add linebreak? AND seperations simbols
      const spLineBreak = () => seper.value + (linebreak.checked ? "<br>" : "");
      //sort array randomly (rewrite arrays)
      const shuffled = () => (arrays = arrays.sort(() => Math.random() - 0.5));
      //sort array normal (rewrite arrays)
      const sorted = () =>
        (arrays = arrays.sort((a, b) =>
          toggleBolean ? a.localeCompare(b) : b.localeCompare(a)
        ));
      //sort array by length (rewrite arrays)
      const sortLenght = () =>
        (arrays = arrays.sort((a, b) =>
          toggleBolean ? a.length - b.length : b.length - a.length
        ));
      //(array)words to lower case (rewrite arrays)
      const lowerCase = () => (arrays = arrays.map((e) => e.toLowerCase()));
      //(array)words to upper case (rewrite arrays)
      const uperCase = () => (arrays = arrays.map((e) => e.toUpperCase()));
      //(array)words capitalize (rewrite arrays)
      const capitalizeCases = () =>
        (arrays = arrays.map((e) => {
          let z = e.toLowerCase();
          z = z[0].charAt(0).toUpperCase() + z.slice(1);
          return z;
        }));
      seper.addEventListener("input", () => output());
      inputs.addEventListener("input", () =>
        output(inputArray(), showStatsLetters())
      );
      shuffle.addEventListener("click", () => output(shuffled()));
      sorts.addEventListener("click", (e) => output(sorted(changed(e))));
      sortsLength.addEventListener("click", (e) =>
        output(sortLenght(changed(e)))
      );
      tolowercase.addEventListener("click", () => output(lowerCase()));
      toupercase.addEventListener("click", () => output(uperCase()));
      capitalize.addEventListener("click", () => output(capitalizeCases()));
      meta.addEventListener("click", () => {
        seper.value = ",";
        doubles.checked = "checked";
        linebreak.checked = false;
        output(lowerCase());
        outputs.textContent =
          '<meta name="keywords" content="' + outputs.innerHTML + '">';
      });
      copyText.addEventListener("mouseup", () =>
        copyTextToClipboard(outputs.innerText)
      );
      output(lowerCase(inputArray()), showStatsLetters());
      // multiple dblclick event bind to input elements for clearing them
      Array.from([seper, inputs]).forEach((elem) =>
        elem.addEventListener("dblclick", clear)
      );
      Array.from([doubles, linebreak]).forEach((elem) =>
        elem.addEventListener("click", () =>
          output(inputArray(), showStatsLetters())
        )
      );

      //https://stackoverflow.com/questions/400212/how-do-i-copy-to-the-clipboard-in-javascript
      async function copyTextToClipboard(textToCopy) {
        try {
          await navigator.clipboard.writeText(textToCopy);
          console.log("copied to clipboard");
        } catch (error) {
          console.log("failed to copy to clipboard. error=" + error);
        }
      }
})()