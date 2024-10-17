(function () {
// Get references to DOM elements
const textInput = document.getElementById('text-input'); // Input field for user text
const textOutput = document.getElementById('text-output'); // Output field to display converted text
const example = document.getElementsByClassName('code')[0]; // Example code section
const convertButton = document.getElementById('convert'); // Button to trigger text conversion

// (HTML template)string example value on init will be loaded
textInput.value =
  `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Page Title</title>
  <style>
    /* Add your CSS styles here */
    body {
      font-family: Arial, sans-serif;
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }

    header, main, footer {
      background-color: #f0f0f0;
      border-bottom: 1px solid #ccc;
    }
  </style>
</head>
<body>
  <header>
    <!-- Add your header content here -->
    <h1>Welcome to Our Website</h1>
  </header>
  <main>
    <!-- Add your main content here -->
    <p>This is the main content area.</p>
  </main>
  <footer>
    <!-- Add your footer content here -->
    <p>&copy; 2024 Your Company Name. All rights reserved.</p>
  </footer>
</body>
</html>
`
  // check if there us value and return trimed
  const getValue = (element) => element.value && element.value.trim()
  // functio to wrap elem
  const wraper = function (text, tagName, className) {
    const elem = document.createElement(tagName)
    if (className) elem.className = className
    if (text) elem.innerText = text
    return elem
  }
  // obkect to return new strings wraped with HTML tags
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
    // comment: function (e) {
    //   return `<i class="code__i--co">${e}</i>`
    // }
  }

  //const comments = /\/\/(.*)/
  const matchSimbols = /(?<!<[^<>]*)(<\/?|>)(?![^<>]*>)/g;
  const matchTexts = /\b(src|href|content|defer|rel|id|class|async|property|name|lang|charset|utf-8)\b/g
  const matchTag = /(?<=[<(?!\s)\/?])\b(meta|base|link|meta|style|title|address|article|aside|footer|header|head|h6|main|nav|section|blockquote|dd|div|dl|dt|figcaption|figure|hr|li|ol|p|pre|ul|a|abbr|body|b|bdi|bdo|br|img|cite|code|data|dfn|em|kbd|mark|q|rp|rt|ruby|samp|small|span|strong|sub|sup|time|u|var|wbr|area|audio|map|track|video|acronym|applet|basefont|bgsound|blink|button|canvas|caption|center|col|colgroup|command|comment|datalist|del|details|dir|embed|fieldset|big|tt|font|form|frame|frameset|hgroup|html|isindex|iframe|ilayer|input|ins|keygen|label|layer|legend|marquee|menu|meter|multicol|nobr|noframes|noscript|object|optgroup|option|output|param|plaintext|progress|script|select|spacer|strike|table|tbody|td|textarea|tfoot|th|thead|tr|xmp|h1|h2|h3|h4|h5)\b/g;

  function convertStrings () {
    // code output define empty string
    example.innerHTML = ''
    // trimed text input value
    const text = getValue(textInput).trim()

    if (text) {
      const splitedText = text.split('\n')
      const fragment = document.createDocumentFragment()

      splitedText.filter((e) => e.length > 0).forEach((e) => {

        const pTag = wraper('', 'p', 'code__p')


        let str =

        e
        .replace(matchTexts, matched => mapObj.text(matched))

        .replace(matchTag, matched => mapObj.tags(matched))

        .replace(matchSimbols, matched => mapObj.simbols(matched))

        // .replace(matchAnySimbols, matched => mapObj.comment(matched))

        // str = example.innerHTML.split().map(e=>e.replace(matchAnySimbols, matched => mapObj.comment(matched))).join()

        pTag.innerHTML = str.trim()
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

  convertStrings()
})()
