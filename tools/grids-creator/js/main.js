/*jshint esversion: 11 */

(function (d) {
    "use strict";
    const reg = new RegExp('(?!0)[\d]+', "g");
    const checkForDefined = (element) => element !== undefined && element !== null;

    // Helper function to create an HTML element with attributes
    const element = (tagName, ...attributes) => {
      const newElement = document.createElement(tagName);
      for (let i = 0; i < attributes.length; i += 2) {
        newElement.setAttribute(attributes[i], attributes[i + 1]);
      }
      return newElement;
    };


    const delay = ms => new Promise(resolve => setTimeout(resolve, ms));
    const addLeadingZero = (time) => time.toString().length < 2 ? "0" + time : time;

    // Retrieve all counter elements
    const counters = d.querySelectorAll('.counter');
    // Function to get the input element from a counter element
    const getElem = e => e.querySelector('input');
    // Counter object definition
    const counter = {
      min: 1,
      max: 100,
      number: 0,
      numberMinus1() {
        return this.number - 1;
      },
      numberPlus1() {
        return this.number + 1;
      },

      set numbers(number) {
        // Use Math.abs to ensure the correct comparison
        if (number > Math.abs(this.max || number < this.min)) return;
        this.number = number;
      },
      get numbers() {
        return this.number;
      }
    };

    // Seal the counter object
    Object.seal(counter);

    // Function to save all input values to localStorage
    const saveAllInputs = () => {
      const values = Array.from(counters, counter => getElem(counter).value);
      localStorage.setItem('TableMaker-InputValues', values.join(','));
    };

    // Flag to prevent multiple saves during a short time
    let isSaving = false;

    // Function to set items and trigger saving
    async function setItems(element) {
      if (isSaving) return;
      isSaving = true;
      element.classList.add('saved');
      await delay(500);
      await saveAllInputs();
      element.classList.remove('saved');
      isSaving = false;
    }

    // Function to highlight an element temporarily
    const hightLight = async (element) => {
      element.classList.add('max');
      await delay(200);
      element.classList.remove('max');
    };

    // Function to handle button click and adjust counter
    const increase = e => {
      const {
        target
      } = e;
      if (target.tagName !== 'BUTTON') return;

      const {
        currentTarget
      } = e;
      const inputElement = getElem(currentTarget);
      counter.numbers = parseInt(inputElement.value);

      if (target.textContent === '—') {
        if ((inputElement.min || counter.min) < counter.numbers) {
          counter.numbers = inputElement.value = addLeadingZero(counter.numberMinus1());
        } else return hightLight(target);
      }

      if (target.textContent === '+') {
        if (parseInt(inputElement.max || counter.max) > counter.numbers) {
          counter.numbers = inputElement.value = addLeadingZero(counter.numberPlus1());
        } else return hightLight(target);
      }
      setItems(currentTarget.parentElement);
    };

    // Function to handle input value change
    const inputChange = e => {
      const {
        target
      } = e;
      if (isNaN(parseInt(target.value)) || (Math.max(parseInt(target.min)) || counter.min) > parseInt(target.value)) {
        target.value = target.min || counter.min;
      } else if ((Math.max(parseInt(target.max)) || counter.max) < parseInt(target.value)) {
        target.value = target.max || counter.max;
      } else {
        target.value = addLeadingZero(target.value);
      }
      setItems(target.parentElement);
    };

    // Retrieve input values from localStorage
    const values = localStorage.getItem('TableMaker-InputValues') && localStorage.getItem('TableMaker-InputValues').split(',').map((Number) => addLeadingZero(Number));
    // console.time()

    // Initialize counters with values and event listeners
    // counters.forEach((counter, i) => {
    const countersLength = counters.length;
    for (let i = 0; i < countersLength; i++) {
      const counter = counters[i];
      const inputElement = getElem(counter);
      inputElement.value = values && values[i] || inputElement.value || inputElement.min || 1;
      counter.addEventListener('click', (e) => {
              increase(e);
              createTable(e);
          });
      inputElement.addEventListener('change', (e) => {
              inputChange(e);
              createTable(e);
          });
    }



    const cssOutput = d.getElementById('css-output');
    const htmlOutput = d.getElementById('html-output');
    const tableOutput = d.getElementsByClassName('table')[0];
    const gap = d.getElementById('gap');
    const inputClear = d.getElementById('input-clear');
    const textCenter = d.getElementById('text-center');
    const autoCell = d.getElementById('fr-columns');
    const tableNumbersY = d.getElementById('table-numbers-y');
    const tableNumbersX = d.getElementById('table-numbers-x');
    const tableNumbers= d.getElementById('table-numbers');
    const numberingStart= d.getElementById('numbering-start');
    const c1 = d.getElementById('c1-class');
    const c2 = d.getElementById('c2-class');

    const isChecked = (e)=> typeof e !== 'undefined'&&e.checked === true;

    function createTable() {
      tableOutput.innerHTML = '';
      if(isChecked(textCenter)){tableOutput.style.textAlign = 'center';}
      const rows = parseInt(d.getElementById('rows').value.replace(reg));
      const columns = parseInt(d.getElementById('columns').value.replace(reg));

      const total = rows * columns;

      for (let i = 0; i < total; i++) {
        const elem = element('i');
        tableOutput.appendChild(elem);
      }

      tableOutput.style.gridTemplateColumns = 'repeat(' + columns + ', minmax(1em,auto))';
      tableOutput.style.gridTemplateRows = 'repeat(' + rows + ', minmax(1em,auto))';
      gaps();
      if(isChecked(tableNumbersY)){
        numberingY(1);
      }
      if(isChecked(tableNumbersX)){
        numberingX(1,0);
      }
      if(isChecked(tableNumbers)){
        numberingX(1,1);
      }
      if(isChecked(autoCell)){
          const rows = parseInt(d.getElementById('rows').value.replace(reg));
          const columns = parseInt(d.getElementById('columns').value.replace(reg));
          tableOutput.style.gridTemplateColumns = 'repeat(' + columns + ', 1fr)';
          tableOutput.style.gridTemplateRows = 'repeat('+rows+', 1fr)';
          tableOutput.style.maxWidth = 'initial';
      }
    }



    let lastText = '';
    const elementSelected = {element:null};

    //create main and elements inside
    const mainInput = element('div','class','center hidden');
    const mainInside = element('form','class','inside');
    const cellInputLabel = element('label','for','input-text');
    const cellInput = element('input','id','input-text','type','text');
    const cellInputTitle = element('label','for','input-title');
    const cellTitle = element('input','id','input-title','type','text');
    const cellInputClass = element('label','for','input-class');
    const cellClass = element('input','id','input-class','type','text');
    const cellButton = element('input','id','input-button','type','submit', 'value', 'OK', 'class', 'hidden');
    cellInputLabel.textContent = 'Text';
    cellInputTitle.textContent = 'Title';
    cellInputClass.textContent = 'Class Name';
    mainInside.appendChild(cellInputLabel);
    mainInside.appendChild(cellInput);
    mainInside.appendChild(cellInputClass);
    mainInside.appendChild(cellClass);
    mainInside.appendChild(cellInputTitle);
    mainInside.appendChild(cellTitle);
    mainInside.appendChild(cellButton);
    mainInput.appendChild(mainInside);
    document.body.appendChild(mainInput);

    mainInside.onsubmit = (e)=>{
      if(cellInput.value.trim()){
      elementSelected.element.textContent = cellInput.value.trim();
      }
      if(cellClass.value.trim()){
      elementSelected.element.className = cellClass.value.trim();
      }
      if(cellTitle.value.trim()){
      elementSelected.element.title = cellTitle.value.trim();
      }
      //hide parent element
      e.target.parentElement.classList.add('hidden');
      e.preventDefault();
      return false;
    };

    // click events for tableOutput
    const clickType = { double: false };

    tableOutput.onclick = async (e) => {
      await delay(300);
      if(clickType.double) return;
      // get the target element
      const target = e.target;
      if (target.tagName === 'I') {
        elementSelected.element = target;
        mainInput.classList.remove('hidden');

        // change values
        if(target.textContent.length)cellInput.value = target.textContent;
        if(target.className.length)cellClass.value = target.className;
        if(target.title.length) cellTitle.value = target.title;

        if(isChecked(inputClear)) {
          cellInput.value = '';
        }
        //focus the input
        cellInput.focus();
        cellInput.select();
        e.preventDefault();
        return;
        }
    };

    tableOutput.ondblclick = async (e) => {
      if (e.target.tagName === 'I') {
        e.preventDefault();
        e.stopPropagation();
        clickType.double = true;
        await delay(340);
        clickType.double = false;
        const classSelected = [c1,c2].map((e,i)=>isChecked(e)?'c'+i:'');
        e.target.className != classSelected.map(c => !!c.length&&e.target.classList.toggle(c)).join(' ');
      }
    };

    // controlling the table gaps
    function gaps() {
      const gaps = parseInt(gap.value.replace(reg)) + 'px';
      tableOutput.style.gap = gaps;
      tableOutput.style.padding = gaps;
    }

    function numberingY(e){
       const tableCells = tableOutput.childNodes;
       let countColum = parseInt(d.getElementById('columns').value.replace(reg));
       let countRow = parseInt(d.getElementById('rows').value.replace(reg));
       for(let i = tableCells.length-1; i>=0 ;i--){
            countColum--;

            if(countColum === 0) {
              countColum = parseInt(d.getElementById('columns').value.replace(reg));
              tableCells[i].textContent = e ? countRow : '';
              countRow--;
            }
       }
    }

    function numberingX(e, all){
       const tableCells = tableOutput.childNodes;
       const countColum = parseInt(d.getElementById('columns').value.replace(reg));
       const whatToFill = all ? tableCells.length : countColum;
       const startPoint = parseInt(numberingStart.value.replace(reg))||1;
       for(let i = whatToFill - 1; i>=0 ;i--){
          const z = startPoint + i;
          tableCells[i].textContent = e ? z : '';
       }
    }


    function merge(){
        const countColum = parseInt(d.getElementById('columns').value.replace(reg));
        let countColumIncrease = countColum;
        // get all children nodes
        const tableCells = tableOutput.childNodes;
        const duplicates = {duplicate:'', count: 1};


        for(let i = tableCells.length-1; i>=0 ;i--){
            if(countColumIncrease === 0) {
              countColumIncrease = countColum;
            }
            countColumIncrease--;
            duplicates.duplicate = tableCells[i].textContent;

            // we have content and table cell start counting duplicates
             if(tableCells[i].textContent.length > 0 && checkForDefined(tableCells[i+1]) && (duplicates.duplicate === tableCells[i+1].textContent && !tableCells[i].getAttribute('style'))){
               // increase duplicates
               duplicates.count++;
               tableCells[i].remove();
               tableCells[i].style.gridColumn = countColumIncrease + 1 + '/span ' + duplicates.count;
              }else{
            duplicates.count = 1;
              }
        }
    }




    document.addEventListener('click', (e) => {
      const target = e.target;
      if (target.parentNode && target.parentNode !== mainInside) {mainInput.classList.add('hidden');}
      if ((target.parentElement && target.parentElement.id) || target.id) {
        if (target.parentElement.id === 'gaps') {
          gaps();
          return;
        }

        if (target.id === "html-output-button") {
          // make deep clone so after removing style attribute appearance not change of table
          const element = tableOutput.cloneNode(true);
          const elements = Array.from(element.childNodes);
          let css = [];
          elements.forEach((e,i)=>{
            if(e.getAttribute('style')){
            css.push(`.table i:nth-child(${i+1}){${e.getAttribute('style')}}`);
            e.removeAttribute('style');
            }
          });
          const style = element.getAttribute('style');
          element.removeAttribute('style');
          htmlOutput.textContent = element.outerHTML;
          const defaultsStylingCell = `
          .table i{
          box-shadow: 1px 1px 0 0 currentColor, 1px 1px 0 0 currentColor inset;
          min-inline-size: 1.5em;
          min-block-size: 1.5em;
          position: relative;
          font-size: inherit;
          font-style: inherit;
          line-height: inherit;
          padding: 0 4px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          background: #fff;
          }
          .c0 {
            background: #cde;
          }

          .c1 {
            background: #fce;
          }
          `;
          const beautify = `.table{${style}}${defaultsStylingCell}${css.join('')}`.replaceAll(';', ';<br>');
          const beautify1 = beautify.replaceAll('{' , '{<br>');
          cssOutput.innerHTML = beautify1.replaceAll('}', '}<br>');
        }

        if(target.id === 'merge-cells'){
            merge();
        }

        if(target === textCenter && isChecked(textCenter)){
          tableOutput.style.textAlign = 'center';
        }else if(!isChecked(textCenter)){
          tableOutput.style.textAlign = 'initial';
        }

        if(target === tableNumbersY && isChecked(tableNumbersY)){
          numberingY(1);
        }else if(target === tableNumbersY && !isChecked(tableNumbersY)){
          numberingY(0);
        }

        if(target === tableNumbersX && isChecked(tableNumbersX)){
          numberingX(1, 0);
        }else if(target === tableNumbersX && !isChecked(tableNumbersX)){
          numberingX(0, 0);
        }

        if(target === tableNumbers && isChecked(tableNumbers)){
          numberingX(1, 1);
        }else if(target === tableNumbers && !isChecked(tableNumbers)){
          numberingX(0, 1);
        }

        const rows = parseInt(d.getElementById('rows').value.replace(reg));
        const columns = parseInt(d.getElementById('columns').value.replace(reg));
        if(target === autoCell && isChecked(autoCell)){
          tableOutput.style.gridTemplateColumns = 'repeat('+columns+', 1fr)';
          tableOutput.style.gridTemplateRows = 'repeat('+rows+', 1fr)';
          tableOutput.style.maxWidth = 'initial';
        } else if(target === autoCell && !isChecked(autoCell)){
          tableOutput.style.gridTemplateColumns = 'repeat('+columns+', minmax(1em, auto))';
          tableOutput.style.gridTemplateRows = 'repeat('+rows+', minmax(1em, auto))';
          tableOutput.style.maxWidth = 'max-content';
        }
        }

    });

    document.addEventListener('DOMContentLoaded', () => createTable());
  }(document));
