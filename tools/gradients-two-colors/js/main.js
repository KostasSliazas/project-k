;(function () {
  const body = document.body
  const colorDirection = document.getElementsByName('direction')
  const color1 = document.getElementById('color1')
  const color2 = document.getElementById('color2')
  const colorOut = document.getElementById('color-out')
  const copyTxt = document.getElementById('copy-text')
  const ranges = document.getElementById('ranges')
  const wrp = document.getElementById('wraoer')
  const toggleHideClass = document.getElementById('toggle')
  let range
  // get checked value
  function getCheckedRadio () {
    let checked
    colorDirection.forEach(element => {
      if (element.checked) checked = element.value
    })
    return checked
  }
  // copy input text to cliboard
  function copyText (element) {
    element.select()
    element.setSelectionRange(0, 99999)
    document.execCommand('copy')
  }

  // update all stuff
  function updateValues (e) {
    getCheckedRadio()
    setLabel()
    range = (e && e.target.parentElement.className === 'radios') ? getCheckedRadio() : ranges.value + 'deg'
    setBodyBackground()
    colorOut.value = 'background:' + setGradient() + ';'
  }

  // set gradient string
  function setGradient () {
    return `linear-gradient(${range}, ${color1.value}, ${color2.value})`
  }

  // set body background
  function setBodyBackground () {
    body.style.backgroundImage = setGradient()
  }

  // set label of ranges
  function setLabel () {
    ranges.nextElementSibling.innerText = ranges.value + 'deg'
  }

  // toggle classList hide
  function classToggle (e) {
    if (e.isComposing || e.key === 229) return
    // event key or target id
    console.log('ddddd')
    // if(e.key === 'k') 
    wrp.classList.toggle('hide')
    e.preventDefault()
    e.stopImmediatePropagation()
  }

  window.addEventListener('keyup', classToggle)
  toggleHideClass.addEventListener('click', classToggle)

  wrp.addEventListener('input', updateValues)
  copyTxt.addEventListener('click', () => copyText(colorOut))
  updateValues()
})()
