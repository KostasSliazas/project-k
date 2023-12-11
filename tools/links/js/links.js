// all stuf for chekbox
// jshint esversion:6
;
(w => {
  const checkboxes = document.getElementById('check-boxes')
  const selection = document.getElementById('select')
  const choise = document.getElementById('choises')
  const createLink = document.getElementById('create-link')
  const outpus = document.getElementById('outpus')
  const closeEx = document.getElementById('exit')
  const closeBtn = document.getElementById('exit1')
  const opensBtn = document.getElementById('open')
  const adition = document.getElementById('aditions')
  const search = document.getElementById('site-search')
  const copyAll = document.getElementById('copy-links')
  const exportJson = document.getElementById('export-json')
  const showExport = document.getElementById('export-div')
  const links = document.getElementById('links')
  const found = document.getElementById('founded')
  const docfrag = document.createDocumentFragment()
  const checkeds = document.getElementsByName('check')[0]
  const filteredExport = document.getElementById('filter')
  const classSwich = () => checkeds.checked ? outpus.classList.add('checks') : outpus.classList.remove('checks')
  let active = false

  checkeds.checked = false
  filteredExport.checked = false
  checkeds.addEventListener('input', classSwich)
  function showCheckboxes (e) {
    if (e.target.id === 'create-link') return
    if (e.target.id === 'select' && !(selection.classList.contains('open'))) {
      selection.classList.add('open')
      checkboxes.style.display = 'block'
    } else {
      if (e.target.tagName === 'LABEL' || e.target.tagName === 'INPUT') return
      selection.classList.remove('open')
      checkboxes.style.display = 'none'
      addTextOfChecked('')
    }
  }

  function loopOverInputs () {
    const checked = [];
    [...checkboxes.getElementsByTagName('INPUT')].forEach(e => {
      if (e.checked) checked.push(e.value)
    })
    return checked
  }

  function addTextOfChecked (m) {
    choise.innerHTML = m || loopOverInputs().join(', ')
  }

  function hide (e) {
    e.style.display = e.style.display === 'none' ? ((active = true), 'block') : ((active = false), 'none')
  }

  function setLinks () {
    const url = document.getElementById('urls').value
    if (url.length > 0) {
      const fav = extractHostname(url)
      const createLinkObject = {
        text: adition.value,
        url: fav,
        full: url,
        type: loopOverInputs()
      }
      return createLinkObject
    } else {
      addTextOfChecked('No URL defined')
    }
    return false
  }

  function addStorage () {
    if ('localStorage' in w) {
      if (setLinks()) {
        const key = JSON.stringify(setLinks().full).slice(1, -1)
        const data = JSON.stringify(setLinks())
        w.localStorage.setItem(key, data)
      }
    } else {
      w.alert('no localStorage in window')
    }
  }

  function extractHostname (url) {
    let hostname
    if (url.indexOf('//') > -1) {
      hostname = url.split('/')[2]
    } else {
      hostname = url.split('/')[0]
    }
    hostname = hostname.split(':')[0]
    hostname = hostname.split('?')[0]
    return hostname
  }

  function loopLocalStorage () {
    search.focus()
    search.value = ''
    outpus.innerHTML = ''
    let count = 0
    for (let i = 0; i < w.localStorage.length; i++) {
      const {
        url,
        type,
        full,
        text
      } = JSON.parse(/** @type {!null} */ w.localStorage.getItem(/** @type {!null} */ w.localStorage.key(i)))
      if (typeof full !== 'undefined' && full.indexOf('http') > -1) {
        count++
        createElem(url, type, text, full)
      }
    }
    if (count === 0) outpus.innerHTML = 'No links added...'
    outpus.appendChild(docfrag)
    const total = w.localStorage.length
    found.innerHTML = `${count}/${count < total ? count : total}`
  }

  function loopLocalStorageSearch () {
    outpus.innerHTML = ''
    let count = 0
    for (let i = 0, len = w.localStorage.length; i < len; i++) {
      const {
        full,
        text,
        type,
        url
      } = JSON.parse(/** @type {!null} */ w.localStorage.getItem(/** @type {!null} */ w.localStorage.key(i)))
      if (typeof full !== 'undefined' && full.indexOf('http') > -1) {
        const values = type.concat(text.split(), url.split(), full.split())
        const isInarray = values.map(e => {
          return !!e.toLowerCase().includes(search.value.toLowerCase())
        })
        if (isInarray.includes(true)) {
          count++
          createElem(url, type, text, full)
        }
      }
    }
    outpus.appendChild(docfrag)
    const total = w.localStorage.length
    found.innerHTML = `${count}/${total}`
    if (count === 0)outpus.innerHTML = 'No results...'
    // if (count === 1)outpus.firstElementChild.click()
  }

  function removeThis (e) {
    w.localStorage.removeItem(e.href)
    loopLocalStorage()
    return false
  }

  function createElem (url, type, text, full) {
    const elems = document.createElement('a')
    const types = document.createElement('span')
    const texts = document.createElement('span')
    const urls = document.createElement('span')
    const close = document.createElement('span')
    close.className = 'close'
    close.innerHTML = '×'
    close.onclick = () => removeThis(elems)
    elems.setAttribute('href', full)
    elems.setAttribute('target', '_blank')
    types.textContent = type
    urls.textContent = url
    texts.textContent = text
    urls.className = 'urls'
    elems.appendChild(urls)
    elems.appendChild(texts)
    elems.appendChild(types)
    elems.appendChild(close)
    docfrag.appendChild(elems)
  }

  search.addEventListener('keydown', (event) => {
    if (event.key === 'Enter' && event.target.value.length > 0) {
      event.preventDefault()
      loopLocalStorageSearch()
      outpus.firstElementChild.focus()
    } else if (event.key === 'Backspace' && event.target.value.length === 0) {
      found.innerHTML = ''
      loopLocalStorage()
    } else return false
  }, true)

  document.addEventListener('keydown', (e) => {
    if (e.key !== 'Enter' && !active) search.focus()
    return false
  }, true)

  search.addEventListener('input', (event) => {
    if (event.target.value.length >= 0) {
      loopLocalStorageSearch()
    }
  })

  copyAll.addEventListener('click', (e) => {
    hide(showExport)
  })

  const saveData = ((() => {
    const a = document.createElement('a')
    return (data, fileName) => {
      const json = JSON.stringify(data, null, 2)
      const blob = new w.Blob([json], {
        type: 'octet/stream'
      })
      const url = w.URL.createObjectURL(blob)
      a.href = url
      a.download = fileName
      a.click()
      w.URL.revokeObjectURL(url)
    }
  })())

  function dateGet () {
    const dateObj = new Date()
    const month = (dateObj.getUTCMonth() + 1).toString().length > 1 ? dateObj.getUTCMonth() + 1 : '0' + (dateObj.getUTCMonth() + 1)// months from 1-12
    const day = dateObj.getUTCDate().toString().length > 1 ? dateObj.getUTCDate() : '0' + dateObj.getUTCDate()
    const year = dateObj.getUTCFullYear()
    const sec = dateObj.getSeconds().toString().length > 1 ? dateObj.getSeconds() : '0' + dateObj.getSeconds()
    const minutes = dateObj.getMinutes().toString().length > 1 ? dateObj.getMinutes() : '0' + dateObj.getMinutes()
    const hours = dateObj.getHours().toString().length > 1 ? dateObj.getHours() : '0' + dateObj.getHours()
    return `${year}-${month}-${day}(${hours}-${minutes}-${sec})`
  }

  createLink.addEventListener('click', () => {
    addStorage()
    loopLocalStorage()
  })

  function loopStorageItems () {
    const data = []
    for (let i = 0; i < w.localStorage.length; i++) {
      data.push(JSON.parse(/** @type {!null} */ w.localStorage.getItem(/** @type {!null} */w.localStorage.key(i))))
      data.join('\r\n')
    }
    return data
  }
  const exportWithSearchFilter = () => {
    const [...allFilteredElems] = outpus.getElementsByTagName('a')
    const elements = allFilteredElems.map(e => {
      return {
        text: e.children[1].innerText,
        url: e.children[0].innerText,
        full: e.href,
        type: [e.children[2].innerText]
      }
    })
    return elements
  }

  exportJson.addEventListener('click', () => {
    const fileName = `localStorage${dateGet()}.json`
    if (filteredExport.checked) {
      saveData(exportWithSearchFilter(), `fil-${fileName}`)
    } else {
      saveData(loopStorageItems(), `all-${fileName}`)
    }
    hide(showExport)
  })
  search.addEventListener('dblclick', loopLocalStorage)
  document.addEventListener('click', showCheckboxes)
  closeEx.addEventListener('click', () => hide(showExport))
  closeBtn.addEventListener('click', () => hide(links))
  opensBtn.addEventListener('click', () => hide(links))
  addTextOfChecked('')
  loopLocalStorage()

  function readSingleFile (e) {
    const file = e.target.files[0]
    if (!file) {
      return
    }
    const reader = new w.FileReader()
    reader.onload = e => {
      const contents = e.target.result
      displayContents(contents)
    }
    reader.readAsText(file)
  }

  function displayContents (data) {
    const json = JSON.parse(data)
    for (let i = 0; i < json.length; i++) {
      w.localStorage.setItem(json[i].full, JSON.stringify(json[i]))
    }
    hide(showExport)
    loopLocalStorage()
  }

  document.getElementById('file-input')
    .addEventListener('change', readSingleFile, false)
})(window)
