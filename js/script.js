(function () {
  'use strict'
  const BEEP_AUDIO = new window.Audio('data:audio/mp3;base64,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')
  const calc = document.getElementById('calculator')
  const calcScreen = document.getElementById('src')
  calcScreen.value = 0
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
      if (lastop !== '/') { return parseFloat(calback(Number(num1), Number(num2)).toFixed(len1 + len2)) }
      return calback(Number(num1), Number(num2))
    }
  }

  const btn = (e) => {
    // if don't mach input or screen or esaund return
    if (!e.target.matches('input') || e.target.id === 'src' || e.target.id === 'esound') return

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
      n1.join('').charAt(n1.join('').length - 1) === '.' && n1.pop()
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
    calcScreen.value = !isFinite(result) ? 'ERROR' : result
  }

  // calc.addEventListener('click', btn, true)

  calc.addEventListener('mousedown', e=>{
    calcScreen.classList.add('blink')
    // if(!isNaN(e.target.value))
    // calcScreen.value = e.target.value
    btn(e)
  }, true)

    calc.addEventListener('mouseup', ()=>{
      setTimeout(()=>calcScreen.classList.remove('blink'), 99)
      }) // blink screen number)
})()
