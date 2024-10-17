/*jshint esversion: 11 */

(function () {
    "use strict";
    const transparency = document.getElementById('transparency');
    const positions = document.getElementById('random');
    const size = document.getElementById('size');

    const clear = document.getElementById('clear');
    const delay = ms => new Promise(resolve => setTimeout(resolve, ms));
    const c = document.getElementById("myCanvas");
    const magicButton = document.getElementById('magic');
    const ctx = c.getContext("2d");
    const random = () => Math.floor(Math.random() * +positions.value || 1) + 1;
    const randomColor = () => {
        // Generate random red, green, and blue components
        var r = Math.floor(Math.random() * 256);
        var g = Math.floor(Math.random() * 256);
        var b = Math.floor(Math.random() * 256);

        // Convert decimal to hexadecimal
        var hexR = r.toString(16).padStart(2, '0');
        var hexG = g.toString(16).padStart(2, '0');
        var hexB = b.toString(16).padStart(2, '0');

        // Concatenate components to form the color code
        var hexColor = '#' + hexR + hexG + hexB;

        return hexColor;
    };


    function MakeObjects(position1, position2, size, color, transparency) {
        this.position1 = position1;
        this.position2 = position2;
        this.size = +size;
        this.color = color;
        this.transparency = +transparency;
        ctx.beginPath();
        ctx.strokeStyle = this.color + convertAlphaToHex(this.transparency);
        ctx.arc(this.position2, this.position1, this.size, 0, this.size * Math.PI);
        ctx.stroke();
        ctx.closePath();
    }

    function convertAlphaToHex(alpha) {
        // Convert alpha from range [0, 1] to range [0, 255]
        const alpha255 = Math.round(alpha * 255);
        // Convert alpha to hexadecimal format
        const alphaHex = alpha255.toString(16).padStart(2, '0');
        // Return the hexadecimal alpha value
        return alphaHex;
    }

    function magicLoad() {
        const number = document.getElementById('number').value;

        for (let i = 0; i < number; i++) {
            new MakeObjects(random(), random(), size.value, randomColor(), transparency.value || 1);
        }
    }

    function clearCanvas() {
        ctx.clearRect(0, 0, c.width, c.height);
    }

    // add event listeners
    magicButton.addEventListener('click', magicLoad);
    clear.addEventListener('click', clearCanvas);
    // load on first init some example
    document.addEventListener('DOMContentLoaded', magicLoad);


    // input CONTROLS
    const counters = document.getElementsByClassName('counter');
    const getElem = e => e.getElementsByTagName('input')[0];
    // Convert number to string and remove trailing zeros
    const removeTrailingZeros = (number) => number.toString().replace(/(\.[0-9]*[1-9])0+$/, '$1');

    const counter = {
        number: 0,
        min: 0, //default min value
        max: 1000000, //default max value

        set numbers(number) {
            if (number > Math.abs(this.max || number < this.min)) return;
            this.number = number;
        },

        get numbers() {
            return this.number;
        }
    };

    const check = (target) => {
        const targetVal = +target.value;
        const targetMin = +target.min;
        const targetMax = +target.max;
        // console.log(`${targetVal},${targetMin},${targetMax}`)
        //if input value is more or less than counter min
        if (isNaN(targetVal) || (Math.max(targetMin || counter.min) > targetVal)) {
            target.value = +targetMin || counter.min;
        } else if ((Math.max(targetMax) || counter.max) < targetVal) {
            target.value = +targetMax || counter.max;
        }
        // set items in localStorage
        setItems(target.parentElement);
    };

    const saveAllInputs = () => {
        const array = [];
        const length = counters.length;
        for (let i = 0; i < length; i++) {
            array.push(getElem(counters[i]).value);
        }
        localStorage.setItem('CInputValues', array.join(','));
    };


    let bo = false;
    const setItems = async (e) => {
        if (bo) return;
        bo = true;
        e.classList.add('saved');
        await delay(1000);
        await saveAllInputs();
        e.classList.remove('saved');
        bo = false;
    };

    const hightLight = async e => {
        e.classList.add('max');
        await delay(200);
        e.classList.remove('max');
    };

    const increase = e => {
        // get the target
        const target = e.target;

        // target not button return and forget
        if (target.tagName !== 'BUTTON') return;

        // get currentTarget for later work (we could use parentElement, but maybe this is faster ..hope..)
        const currentTarget = e.currentTarget;

        // Get the input associated with the clicked button
        const input = getElem(currentTarget);

        // Get the step value from the input
        const step = parseFloat(input.step) || 1;

        // set the number
        counter.numbers = parseFloat(input.value);
        // lines to not make 0.30000000000000004
        const n1 = counter.numbers.toString().split(".")[1];
        const n2 = step.toString().split(".")[1];
        const len1 = (n1 && n1.length) || 0;
        const len2 = (n2 && n2.length) || 0;

        // change mdash from minus to make look maybe better for buttons
        if (target.textContent === '-') {
            if ((+input.min || counter.min) < counter.numbers) {
                input.value = counter.numbers = +removeTrailingZeros((+input.value - step).toFixed(len1 + len2));
            } else hightLight(target);
        }

        if (target.textContent === '+') {
            if ((+input.max || counter.max) > counter.numbers) {
                input.value = counter.numbers = +removeTrailingZeros((+input.value + step).toFixed(len1 + len2));
            } else hightLight(target);
        }
        check(getElem(target.parentElement));
    };

    const inputChange = e => check(e.target);
    const values = localStorage.getItem('CInputValues') && localStorage.getItem('CInputValues').split(',').map(Number);

    const length = counters.length;
    for (let i = 0; i < length; i++) {
        const inputs = getElem(counters[i]);
        inputs.value = values && values[i] || inputs.value || inputs.min || 0;
        counters[i].addEventListener('click', increase);
        inputs.addEventListener('change', inputChange);
    }
    // input CONTROLS end

})();