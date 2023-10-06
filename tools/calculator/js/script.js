 /* jshint esversion: 8 */
 (function () {
   'use strict'
   const root = document.documentElement
   const setVariables = vars => Object.entries(vars).forEach(v => {
     if (typeof v[1] === 'function') return v[1]()
     root.style.setProperty(v[0], v[1])
   })
   const myVariables = [
     {
       '--color0': '#f5f5f5',
       '--color1': '#d1d1d1',
       '--color2': '#878787',
       '--color3': '#5c5c5c',
       '--color4': '#454545',
       '--color5': '#555'
     },
     {
       '--color0': '#eee',
       '--color1': '#C8E0DE',
       '--color2': '#9FB7B5',
       '--color3': '#78908E',
       '--color4': '#28403E',
       '--color5': '#222'
     },
     {
       '--color0': '#222',
       '--color1': '#14406D',
       '--color2': '#81A1C2',
       '--color3': '#3F6993',
       '--color4': '#81A1C2',
       '--color5': '#3F6993'
     },
     {
      '--color0': '#e7eed0',
      '--color1': '#cad1c3',
      '--color2': '#456586',
      '--color3': '#948e99',
      '--color4': '#51425f',
      '--color5': '#2e1437'
    },
    {
      '--color0': '#E8D6CB',
      '--color1': '#D0ADA7',
      '--color2': '#AD6A6C',
      '--color3': '#B58DB6',
      '--color4': '#5D2E46',
      '--color5': '#B58DB6'
    },
     {
       e: () => root.removeAttribute('style')
     }
   ]

   var arrayHelper = function () {
     var ob = {}
     ob.value = ob.full = this.length
     ob.increment = function () {
       this.value = this.value ? --this.value : this.full - 1
     }
     // ob.decrement = function () {
     //   this.value = this.value < this.full - 1 ? ++this.value : 0
     // }
     return ob
   }
   const INCRISE_OBJ = arrayHelper.call(myVariables)
   const BEEP_AUDIO = new window.Audio('data:audio/mp3;base64,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')
   const CALC = document.getElementById('calculator')
   const CALC_SCREEN = document.getElementById('src')
   CALC_SCREEN.value = 0
   let n1 = []
   let n2 = 0
   let op = null
   let lastop = null
   let result = 0

   const sound = () => {
     BEEP_AUDIO.play()
     window.navigator.vibrate(30)
   }

   const add = (n, o) => n + o
   const sub = (n, o) => n - o
   const div = (n, o) => n / o
   const mul = (n, o) => n * o
   const res = (n) => n

   const cals = {
     '/': div,
     '×': mul,
     '+': add,
     '-': sub,
     '=': res
   }

   const cal = (num1, num2, calback) => {
     if (typeof calback === 'function') {
       const n1 = num1.toString().split('.')[1]
       const n2 = num2.toString().split('.')[1]
       const len1 = (n1 && n1.length) || 0
       const len2 = (n2 && n2.length) || 0
       if (lastop !== '/') {
         return parseFloat(calback(Number(num1), Number(num2)).toFixed(len1 + len2))
       }
       return calback(Number(num1), Number(num2))
     }
   }

   const btn = e => {
     // e.preventDefault()
     // e.stopPropagation()
     // if don't mach input or screen or esaund return
     if (!e.target.matches('input') || e.target.id === 'esound') return
     CALC_SCREEN.classList.add('blink')

     if (e.target.id === 'src') {
       INCRISE_OBJ.increment() // eslint-disable-line
       setVariables(myVariables[INCRISE_OBJ.value || 0])
       localStorage.setItem('kktheme', INCRISE_OBJ.value || 0)
       // prevemts of currsor position showing (for typing)
       e.preventDefault()
       return
     }
     // if checked sound play that creapy sound
     if (document.getElementById('esound').checked) sound()

     // set operator when target is fun
     if (e.target.dataset.fun) op = e.target.value

     // when number pressed push to array number
     if (e.target.dataset.num) {
       op = null
       if (n1[0] === '0' && n1[1] !== '.') n1.length = 0
       n1.push(e.target.value)
     }

     // operator delete last number
     if (op === '⌫') {
       n1 = result.toString(10).substring(0, 15).replace(/[^0-9]/g, '.').split('')
       n1.pop()
       if (n1.join('').charAt(n1.join('').length - 1) === '.') n1.pop()
     }

     // if no number set 0
     if (!n1.length) n1 = ['0']
     if (op === ',' && !n1.includes('.')) n1.push('.')
     result = n1.join('')


     // operator is /*+-=
     if (op === '/' || op === '×' || op === '+' || op === '-' || op === '=') {
       if (n2 && lastop) result = cal(Number(n2), Number(result), cals[lastop])
       lastop = res(op)
       n2 = result
       n1.length = 0
     }

     // operator clear all
     if (op === 'C') {
       op = lastop = null
       result = n2 = n1.length = 0
     }
     CALC_SCREEN.value = !isFinite(result) ? 'ERROR' : result
     // e.stopImmediatePropagation()
     // e.stopPropagation()
     // e.preventDefault()
   }

   function init() {
     setTimeout(()=>{document.body.style.display = 'block'},160)
     const NUM = parseInt(localStorage.getItem('kktheme')) || 0
     INCRISE_OBJ.value = NUM
     setVariables(myVariables[INCRISE_OBJ.value])
   }
   CALC.addEventListener('mousedown', e => btn(e))
   CALC.addEventListener('mouseup', e => setTimeout(() => CALC_SCREEN.classList.remove('blink'), 99)) // blink screen number
   document.addEventListener('DOMContentLoaded', init)
 })()
