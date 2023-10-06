(function () {
  const textInput = document.getElementById('text-input')
  const textOutput = document.getElementById('text-output')
  const example = document.getElementsByClassName('code')[0]
  const convertButton = document.getElementById('convert')

  const getValue = function (element) {
    if (!element.value) return false
    return element.value.trim()
  }

  const wraper = function (text, tagName, className) {
    const elem = document.createElement(tagName)
    if (className) elem.className = className
    if (text) elem.innerText = text
    return elem
  }

  const mapObj = {
    text: function (e) {
      return `<i class="code__i--sc">${e}</i>`
    },
    simbols: function (e) {
      const symbol = e === '<' ? '&lt;' : e === '>' ? '&gt;' : e === '=' ? '&equals;' : e === ':' ? ':' : e === ')' ? e : e === '(' ? e : '&lt;&sol;'
      return `<i class="code__i--re">${symbol}</i>`
    },
    tags: function (e) {
      return `<i class="code__i--ta">${e}</i>`
    },
    comment: function (e) {
      return `<i class="code__i--co">${e}</i>`
    }
  }
  const matchSimbols = /(?:<\/|<|>|=|:|\(|\))/g
  const cooments = /\/\/(.*)/
  const matchTexts = /\b(?<=\s)^src|^href|^content|^defer|^rel|^src|^id|^async|^property|^name|^lang\b/
  const matchTag = /(?<=[</>])base|head|link|meta|style|title|address|article|aside|footer|header|h6|main|nav|section|blockquote|dd|div|dl|dt|figcaption|figure|hr|li|ol|p|pre|ul|a|abbr|body|b|bdi|bdo|br|img|cite|code|data|dfn|em|kbd|mark|q|rp|rt|ruby|samp|small|span|strong|sub|sup|time|u|var|wbr|area|audio|img|map|track|video|DOCTYPE|acronym|applet|basefont|bgsound|blink|body|button|canvas|caption|center|col|colgroup|command|comment|datalist|del|details|dir|embed|fieldset|big|tt|font|form|frame|frameset|hgroup|html|isindex|iframe|ilayer|input|ins|keygen|label|layer|legend|marquee|menu|meter|multicol|nobr|noframes|noscript|object|optgroup|option|output|param|plaintext|progress|script|select|spacer|strike|table|tbody|td|textarea|tfoot|th|thead|tr|xmp|h1|h2|h3|h4|h5/g

  function convertStrings () {
    example.innerHTML = ''
    const text = getValue(textInput).trim()
    if (text) {
      const splitedText = text.split('\n')
      const fragment = document.createDocumentFragment()

      splitedText.filter(function (e) {
        return e.length > 0
      }).forEach(e => {
        const pTag = wraper('', 'p', 'code__p')



        const str = e.replace(matchSimbols, matched => {
          return mapObj.simbols(matched)
        })


        pTag.innerHTML = str
        fragment.appendChild(pTag)
      })
      example.appendChild(fragment)
      textOutput.value = example.innerHTML
    } else {
      textOutput.value = 'no input'
    }
  }

  textInput.addEventListener('input', convertStrings)

  convertButton.addEventListener('click', convertStrings)
})()
