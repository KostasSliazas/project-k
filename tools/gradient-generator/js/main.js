(function () {
  class Gradients {
    constructor () {
      if (!(this instanceof Gradients)) return new Gradients();
      this._colorInterval = [0, 0, 0];
      this._gardiInterval = 0;
    }
    setColorIntervalValue(r, g, b) {
      this._colorInterval = [r, g, b] || [0, 0, 0];
    }

    setGradienIntervalVal(first) {
      this._gardiInterval = first || 0;
    }

    getColorIntervalValue() {
      return this._colorInterval;
    }

    getGradienIntervalVal() {
      return this._gardiInterval;
    }
  }

  function mainFunc() {
    const makeButton = document.getElementById('makeGrad');
    const cop = document.getElementById('text');
    makeButton.addEventListener('click', generateGradient);
    cop.addEventListener('click', copyText);

    // Store DOM elements for reuse
    const cBody = document.getElementsByTagName('body')[0];
    const grad = new Gradients();

    function generateGradient() {
      const fixed = document.getElementById('fixed').checked;
      const radial = document.getElementById('radial').checked;
      const random = document.getElementById('random').checked;
      let revers = document.getElementById('revers').checked;
      const repatng = document.getElementById('repea').checked;
      const softness = +document.getElementById('softness').value || 0;
      const cDegree = +document.getElementById('degree').value || 0;
      const cInterv = +document.getElementById('rgbinterv').value || 10;
      const gInterv = +document.getElementById('grainterv').value || 10;
      let baseline = +document.getElementById('baseline').value || 0;
      const opaci = document.getElementById('opaci').value || 0;
      let safe = +document.getElementById('safe').value || 100;
      let r = +document.getElementById('r').value || 0;
      let g = +document.getElementById('g').value || 0;
      let b = +document.getElementById('b').value || 0;
      let string = '';
      let temp = 0;
      let x = 0;
      let tempColor = [];
      let tempGradi = [];
      colorIntervals();

      function colorIntervals() {
        while (safe--) {
          x++;

          const randr = randoms(0, cInterv);
          const randg = randoms(0, cInterv);
          const randb = randoms(0, cInterv);
          r += random ? randr : cInterv;
          g += random ? randg : cInterv;
          b += random ? randb : cInterv;
          if (randr >= 255 || randg >= 255 || randb >= 255 || r >= 255 || g >= 255 || b >= 255) break;
          grad.setColorIntervalValue(r, g, b);
          if (x > 2) { tempColor[tempColor.length] = grad.getColorIntervalValue(); }
        }
      }

      function gradiIntervals() {
        if (revers) {
          baseline = false;
          x *= 2;
          tempColor = tempColor.concat(tempColor.slice(1, -1).reverse());
        }
        for (let i = 0; i < tempColor.length; i++) {
          temp += gInterv;
          if (baseline > 0 && i % 3 === 0) temp += baseline - 2;
          grad.setGradienIntervalVal(temp);
          tempGradi[tempGradi.length] = grad.getGradienIntervalVal();
        }
        temp = 0;

        tempGradi = tempGradi.map((f, i) => {
          const es = [];
          [es[es.length], es[es.length]] = [f, temp];
          temp = es[[es.length - 1] - 1] + softness;
          return es.reverse();
        });
      }

      function mkeString() {
        let op = false;
        string = tempColor.map((o, i, arr) => {
          if (baseline > 0 && i % 3 === 0) {
            o = '0, 0, 0';
            revers = false;
            op = true;
          } else {
            op = false;
          }
          return ` ${opaci > 0 ? 'rgba' : 'rgb'}(${o}${opaci > 0 || op ? ',0.' + opaci : ''}) ${tempGradi[i].join('px ')}px`;
        });

        const type = repatng ? ' repeating-' : '';
        cBody.style.background =
          (radial
            ? `${type}radial-gradient(circle at 50%,`
            : `${type}linear-gradient(` + cDegree + 'deg,') +
          string +
          ')' +
          (fixed ? ' fixed' : '');
        stats(x);
        cop.innerText = 'background:' + cBody.style.background;
      }

      gradiIntervals();
      mkeString();
    }

    function copyText(e) {
      if (e.detail === 3) {
        try {
          const successful = document.execCommand('copy');
          const msg = successful ? 'successful' : 'unsuccessful';
          console.log('Copying text command was ' + msg);
        } catch (err) {
          console.log('Oops, unable to copy');
        }
      }
    }

    function stats(x) {
      document.getElementById('info').innerText = x;
    }

    function randoms(min, max) {
      min = Math.ceil(min);
      max = Math.floor(max);
      return Math.floor(Math.random() * (max - min + 1)) + min;
    }
    generateGradient()
}
    document.addEventListener('DOMContentLoaded', mainFunc);
})();
