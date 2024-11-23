/*jshint esversion: 11 */
(function (document) {
  'use strict';

  class DraggableManager {
    constructor(containerSelector, draggableSelector) {
      this.container = document.querySelector(containerSelector);
      this.draggable = Array.from(this.container.querySelectorAll(draggableSelector));
      this.draggedElement = null;
    }

    initialize() {
      this.draggable.forEach(draggable => {
        // draggable.setAttribute('draggable', 'true');
        draggable.addEventListener('dragstart', this.handleDragStart.bind(this));
        draggable.addEventListener('dragover', this.handleDragOver.bind(this));
        draggable.addEventListener('drop', this.handleDrop.bind(this));
      });
    }

    handleDragStart(event) {
      this.draggedElement = event.target;
      event.dataTransfer.setData('text/plain', ''); // required for Firefox
    }

    handleDragOver(event) {
      event.preventDefault(); // allow drop
    }

    handleDrop(event) {
      const targetElement = event.currentTarget;
      if (this.draggedElement && this.draggedElement !== targetElement && this.draggedElement.tagName === 'DIV') {
        const targetIndex = this.draggable.indexOf(targetElement);
        const draggedIndex = this.draggable.indexOf(this.draggedElement);

        // Swap elements in the array
        [this.draggable[draggedIndex], this.draggable[targetIndex]] = [this.draggable[targetIndex], this.draggable[draggedIndex]];

        // Update the visual order of draggable in the container
        this.container.innerHTML = ''; // Clear container
        this.draggable.forEach(draggable => this.container.appendChild(draggable));
      }
    }
  }
  // Initialize DraggableManager
  const draggableManager = new DraggableManager('#cv', '.blokas');
  draggableManager.initialize();

  // helper to creat DOM element
  function createHTMLElement(tag, text, attributes) {
    const element = document.createElement(tag);
    element.textContent = text || '';

    if (attributes) {
      for (const key in attributes) {
        if (attributes.hasOwnProperty(key)) {
          element.setAttribute(key, attributes[key]);
        }
      }
    }
    return element;
  }

  const cssId = 'styl';
  if (!document.getElementById(cssId)) {
    const head = document.getElementsByTagName('head')[0];
    const link = document.createElement('link');

    link.id = cssId;
    link.rel = 'stylesheet';
    link.type = 'text/css';
    link.href = 'style.css?v=2';
    link.media = 'all';
    link.className = 'remove';
    head.appendChild(link);

    document.oncontextmenu = function () {
      return false;
    };
  }

  const body = document.body;
  const block = document.querySelectorAll('.blokas:first-child');
  const text = 'i';
  const button = {
    class: 'shd brdr w24 remove',
    href: '#',
    id: 'close'
  };

  block.forEach((e) => e.before(createHTMLElement('button', text, button)));

  const issaugoti = 'Save CV...';
  const buttonIsaugoti = {
    class: 'save brdr shd remove',
    href: '#',
    id: 'close'
  };

  const elems = createHTMLElement('button', issaugoti, buttonIsaugoti);
  body.before(elems);
  elems.onclick = htmls;

  // Create the info element and append to body
  const infoDiv = createHTMLElement('div', '', {
    id: 'info',
    class: 'remove',
    style: 'display:none'
  });
  const infocDiv = createHTMLElement('div', '', {
    id: 'infoc'
  });
  const spanElement = createHTMLElement('span', 'CLOSE', {
    class: 'btn brdr shd'
  });
  infocDiv.appendChild(spanElement);

  const infoTextContent = `Please do not close this window until your work is saved, as no information is stored in the database. To save your text, simply press 'Enter'. You can change language levels by double-clicking with the mouse. For the best experience, please ensure your photo is sized at 100x128 pixels. To optimize loading times, reduce the file size of your photo as much as possible. You can rearrange blocks by dragging them.`;
  const infoTextDiv = createHTMLElement('div', infoTextContent, {
    id: 'info-text'
  });

  infoDiv.appendChild(infocDiv);
  infoDiv.appendChild(infoTextDiv);

  document.body.insertBefore(infoDiv, document.body.firstChild);

  const elem = document.querySelectorAll('.blokas');
  const buttonPlus = {
    href: '#',
    id: 'dubl'
  };

  elem.forEach((e, i) => {
    if (i > 0) {
      buttonPlus.class = 'remove shd brdr wbg w24 rem';
      e.appendChild(createHTMLElement('button', '-', buttonPlus));

      buttonPlus.class += 'remove shd brdr wbg w24 add';
      e.appendChild(createHTMLElement('button', '+', buttonPlus));
    }
  });

  // Create the fakebtn element and its children using the createHTMLElement function
  const fakeButtonHtml = createHTMLElement('div', 'upload file', {
    id: 'fakebtn',
    class: 'remove brdr'
  });

  const fileInput = createHTMLElement('input', '', {
    id: 'image-file',
    name: 'image-file',
    type: 'file'
  });
  fileInput.onchange = fileSelected; // Assign fileSelected function to the 'change' event of the input element
  fakeButtonHtml.appendChild(fileInput);


  const uploadFormHtml = '<div id="dele" class="remove"><form action="" enctype="multipart/form-data" id="upload_form" method="post" name="upload_form"><div id="fileinfo"><div id="filename"></div><div id="filesize"></div><div id="filetype"></div><div id="filedim"></div></div><div id="error">Failas nepalaikomas! bmp, gif, jpeg, png, tiff</div><div id="error2">An error occurred while uploading the file</div><div id="abort">The upload has been canceled</div><div id="warnsize">The file is too large.</div><div id="progress_info"><div id="progress"></div><div id="progress_percent">&nbsp;</div><div class="clear_both"></div><div><div id="speed">&nbsp;</div><div id="remaining">&nbsp;</div><div id="b_transfered">&nbsp;</div><div class="clear_both"></div></div><div id="upload_response"></div></div></form></div>';

  document.getElementById('header').insertAdjacentHTML('afterbegin', uploadFormHtml);
  document.getElementById('photo').appendChild(fakeButtonHtml);
  document.querySelectorAll('#close, #infoc').forEach(function (element) {
    element.addEventListener('click', function (e) {
      e.preventDefault();
      // const info = document.querySelector('#info');
      infoDiv.style.display = infoDiv.style.display === 'none' ? '' : 'none';
    });
  });


  // Helper function to create the link element
  const createLink = (input) => {
    let href = '';

    // Check if the input is an email, number, or URL and set the appropriate link
    if (input.id === 'email') {
      href = `mailto:${input.value.replace(/\s+/g, '')}`;
    } else if (input.id === 'number') {
      href = `tel:${input.value.replace(/\s+/g, '')}`;
    } else if (input.id === 'url') {
      // For URL input, check if it starts with http:// or https://
      if (/^https?:\/\//.test(input.value)) {
        href = input.value; // If it already has http:// or https://, use it
      } else {
        href = `http://${input.value}`; // Otherwise, prepend http://
      }
    } else if (input.value && /https?:\/\//.test(input.value)) {
      // For simple URLs (http/https)
      href = input.value;
    }

    // Create a simple <a> tag with the appropriate href
    const link = document.createElement('a');
    link.href = href;
    link.textContent = input.value; // Set link text to input value
    link.target = "_blank"; // Open link in a new tab
    link.rel = "noopener noreferrer nofollow"; // Add safe and nofollow attributes
    return link; // Return the <a> tag without any class
  };

  // Function to replace input with h2 or h3 and preserve class and id
  function replaceElementWithHeading(input, tagName) {
    const heading = document.createElement(tagName);
    if (input.className) heading.setAttribute('class', input.className); // Preserve class on the heading
    if (input.id) heading.setAttribute('id', input.id); // Preserve id on the heading
    if (input.value) heading.textContent = input.value.trim(); // Set text content from input value
    input.parentNode.replaceChild(heading, input); // Replace the input with the heading
    return heading; // Return the newly created heading
  }

  function outf() {
    const cvInputs = document.querySelectorAll('select, input:not(#image-file)');

    cvInputs.forEach((input) => {
      let tagName = input.classList.contains('left') ? 'h2' : 'h3';

      // Replace text input with an h2 or h3 based on the class
      if (input.tagName === 'INPUT' && input.type === 'text') {
        const newElement = replaceElementWithHeading(input, tagName);

        // If it's an email or number input, replace it with a link
        if (input.id === 'email' || input.id === 'number') {
          newElement.innerHTML = ''; // Clear the text content of the new heading
          newElement.appendChild(createLink(input)); // Append the link inside the heading
        }
        // If it's a URL (http/https), create a regular link
        else if (input.id === 'url' || (input.value && /https?:\/\//.test(input.value))) {
          newElement.innerHTML = ''; // Clear the heading content
          newElement.appendChild(createLink(input)); // Append the URL link
        }
      }

      // Replace select element with the selected option's value
      else if (input.tagName === 'SELECT') {
        input.parentElement.innerText = input.options[input.selectedIndex].value;
      }
    });

    // Update the document title based on the 'name' element
    const nameElement = document.getElementById('name');
    const heading = document.getElementById('he');

    if (nameElement) {
      const name = nameElement.innerText;

      document.title = name;
      heading.children[0].textContent = name;
      // Convert the object to a string and save it to localStorage
      // localStorage.setItem(nameElement.innerText.replace(/\s+/g, ''), JSON.stringify(jsonData));
    }

  }




  // let oTimer = 0;
  //let iBytesUploaded = 0;
  //let iBytesTotal = 0;
  //let iPreviousBytesLoaded = 0;
  const iMaxFilesize = 1048576;
  let sResultFileSize = '';

  /*  function secondsToTime(secs) {
    let hr = Math.floor(secs / 3600);
    let min = Math.floor((secs - hr * 3600) / 60);
    let sec = Math.floor(secs - hr * 3600 - min * 60);
    if (hr < 10) {
      hr = '0' + hr;
    }
    if (min < 10) {
      min = '0' + min;
    }
    if (sec < 10) {
      sec = '0' + sec;
    }
    if (hr) {
      hr = '00';
    }
    return hr + ':' + min + ':' + sec;
  }*/

  const fileinfo = document.getElementById('fileinfo');
  const upload_response = document.getElementById('upload_response');
  const error = document.getElementById('error');
  const error2 = document.getElementById('error2');
  const abort = document.getElementById('abort');
  const warnsize = document.getElementById('warnsize');

  function bytesToSize(bytes) {
    const sizes = ['Bytes', 'KB', 'MB'];
    if (bytes === 0) return 'n/a';
    const i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
    return (bytes / Math.pow(1024, i)).toFixed(1) + ' ' + sizes[i];
  }

  function fileSelected() {
    fileinfo.style.display = 'none';
    upload_response.style.display = 'none';
    error.style.display = 'none';
    error2.style.display = 'none';
    abort.style.display = 'none';
    warnsize.style.display = 'none';
    const oFile = document.getElementById('image-file').files[0];
    const rFilter = /^(image\/bmp|image\/gif|image\/jpeg|image\/png|image\/tiff)$/i;
    if (!rFilter.test(oFile.type)) {
      error.style.display = 'block';
      return;
    }
    if (oFile.size > iMaxFilesize) {
      warnsize.style.display = 'block';
      return;
    }
    const oImage = document.getElementById('preview');
    const oReader = new FileReader();
    oReader.onload = function (e) {
      oImage.src = e.target.result;
      oImage.onload = function () {
        sResultFileSize = bytesToSize(oFile.size);
        fileinfo.style.display = 'block';
        document.getElementById('filename').innerHTML = 'Name: ' + oFile.name;
        document.getElementById('filesize').innerHTML = 'Size: ' + sResultFileSize;
        document.getElementById('filetype').innerHTML = 'Type: ' + oFile.type;
        document.getElementById('filedim').innerHTML = 'Dimension: ' + oImage.naturalWidth + ' x ' + oImage.naturalHeight;
      };
    };
    oReader.readAsDataURL(oFile);
  }

  /*  function startUploading() {
      iPreviousBytesLoaded = 0;
      document.getElementById('upload_response').style.display = 'none';
      document.getElementById('error').style.display = 'none';
      document.getElementById('error2').style.display = 'none';
      document.getElementById('abort').style.display = 'none';
      document.getElementById('warnsize').style.display = 'none';
      document.getElementById('progress_percent').innerHTML = '';
      const oProgress = document.getElementById('progress');
      oProgress.style.display = 'block';
      oProgress.style.width = '0px';
      const vFD = new FormData(document.getElementById('upload_form'));
      const oXHR = new XMLHttpRequest();
      oXHR.upload.addEventListener('progress', uploadProgress, !1);
      oXHR.addEventListener('load', uploadFinish, !1);
      oXHR.addEventListener('error', uploadError, !1);
      oXHR.addEventListener('abort', uploadAbort, !1);
      oXHR.open('POST', 'upload.php');
      oXHR.send(vFD);
      oTimer = setInterval(doInnerUpdates, 300);
    } */
  /*
  function doInnerUpdates() {
    const iCB = iBytesUploaded;
    let iDiff = iCB - iPreviousBytesLoaded;
    if (iDiff === 0) return;
    iPreviousBytesLoaded = iCB;
    iDiff = iDiff * 2;
    const iBytesRem = iBytesTotal - iPreviousBytesLoaded;
    const secondsRemaining = iBytesRem / iDiff;
    let iSpeed = iDiff.toString() + 'B/s';
    if (iDiff > 1024 * 1024) {
      iSpeed =
        (Math.round((iDiff * 100) / (1024 * 1024)) / 100).toString() + 'MB/s';
    } else if (iDiff > 1024) {
      iSpeed = (Math.round((iDiff * 100) / 1024) / 100).toString() + 'KB/s';
    }
    document.getElementById('speed').innerHTML = iSpeed;
    document.getElementById('remaining').innerHTML =
      '| ' + secondsToTime(secondsRemaining);
  }

function uploadProgress(e) {
    if (e.lengthComputable) {
      iBytesUploaded = e.loaded;
      iBytesTotal = e.total;
      const iPercentComplete = Math.round((e.loaded * 100) / e.total);
      const iBytesTransfered = bytesToSize(iBytesUploaded);
      document.getElementById('progress_percent').innerHTML =
        iPercentComplete.toString() + '%';
      document.getElementById('progress').style.width =
        (iPercentComplete * 4).toString() + 'px';
      document.getElementById('b_transfered').innerHTML = iBytesTransfered;
      if (iPercentComplete === 100) {
        const oUploadResponse = document.getElementById('upload_response');
        oUploadResponse.innerHTML = '<h1>Please wait...processing</h1>';
        oUploadResponse.style.display = 'block';
      }
    } else {
      document.getElementById('progress').innerHTML = 'unable to compute';
    }
  }

	function uploadFinish(e) {
    const oUploadResponse = document.getElementById('upload_response');
    oUploadResponse.innerHTML = e.target.responseText;
    oUploadResponse.style.display = 'block';
    document.getElementById('progress_percent').innerHTML = '100%';
    document.getElementById('progress').style.width = '400px';
    document.getElementById('filesize').innerHTML = sResultFileSize;
    document.getElementById('remaining').innerHTML = '| 00:00:00';
    clearInterval(oTimer);
  }

  function uploadError(e) {
    document.getElementById('error2').style.display = 'block';
    clearInterval(oTimer);
  }

  function uploadAbort(e) {
    document.getElementById('abort').style.display = 'block';
    clearInterval(oTimer);
  } */


  const jsonData = {
    "basics": {},
    "work": [],
    "volunteer": [],
    "education": [],
    "awards": [],
    "certificates": [],
    "publications": [],
    "skills": [],
    "languages": [],
    "interests": [],
    "references": [],
    "projects": []
  };

  // Function to extract basic information (personal info)  >>>>>>>>>>>>>>>>>>>>>>>basics<<<<<<<<<<<<<<<<<<<<<<<
  function extractBasics() {
    const label = document?.getElementById('label')?.textContent.trim() || null;
    const name = document?.getElementById('name')?.textContent.trim() || null;
    const email = document?.getElementById('email')?.getElementsByTagName('a')[0]?.textContent.replace(/\s+/g, '') || null;
    const phone = document?.getElementById('number')?.getElementsByTagName('a')[0]?.textContent.replace(/\s+/g, '') || null;
    const address = document?.getElementById('address')?.textContent.trim() || null;
    const image = document?.getElementById('preview')?.src || null;
    const url = document?.getElementById('url').getElementsByTagName('a')[0]?.href.trim() || null;
    const postalCode = document?.getElementById('postal-code')?.textContent.trim() || null;
    const city = document?.getElementById('city')?.textContent.trim() || null;
    const countryCode = document?.getElementById('country-code')?.textContent.trim() || null;
    const region = document?.getElementById('region')?.textContent.trim() || null;
    const summary = document?.getElementById('summary')?.textContent.trim() || null;
    // Only add the fields if they exist
    if (name) jsonData.basics.name = name;
    if (label) jsonData.basics.label = label;
    if (image) jsonData.basics.image = image;
    if (email) jsonData.basics.email = email;
    if (phone) jsonData.basics.phone = phone;
    if (url) jsonData.basics.url = url;
    if (summary) jsonData.basics.summary = summary;

    if (address || city) {
      jsonData.basics.location = {};
      if (address) jsonData.basics.location.address = address;
      if (postalCode) jsonData.basics.location.postalCode = postalCode;
      if (city) jsonData.basics.location.city = city;
      if (countryCode) jsonData.basics.location.countryCode = countryCode;
      if (region) jsonData.basics.location.region = region;
    }
  }
  // Function to extract WORK experience  >>>>>>>>>>>>>>>>>>>>>>>work<<<<<<<<<<<<<<<<<<<<<<<
  function extractWorkExperience() {

    const workElements = [...document.getElementsByClassName('darb')];

    workElements.forEach((work) => {
      let workExperience = {};

      const dateStart = work?.getElementsByTagName('h3')[0]?.textContent.trim() || null;
      const dateEnd = work?.getElementsByTagName('h3')[1]?.textContent.trim() || null;
      const position = work?.getElementsByTagName('h3')[2]?.textContent.trim() || null;
      const name = work?.getElementsByTagName('h3')[4]?.textContent.trim() || null;
      const highlights = work?.getElementsByTagName('h3')[5]?.textContent.trim() || null;
      const summary = work?.getElementsByTagName('h3')[3]?.textContent.trim() || null;
      const url = work?.getElementsByTagName('h3')[6]?.getElementsByTagName('a')[0]?.href || null;

      // Only add fields if they exist
      if (name) workExperience.name = name;
      if (position) workExperience.position = position;
      if (url) workExperience.url = url;
      if (dateStart) workExperience.startDate = dateStart;
      if (dateEnd) workExperience.endDate = dateEnd;
      if (summary) workExperience.summary = summary;
      if (highlights) workExperience.highlights = [highlights];

      if (Object.keys(workExperience).length > 0) {
        jsonData.work.push(workExperience);
      }
    });
  }

  // Function to extract education information >>>>>>>>>>>>>>>>>>>>>>>education<<<<<<<<<<<<<<<<<<<<<<<
  function extractEducation() {
    const educationSections = [...document.getElementsByClassName('prof')];

    educationSections.forEach((eduSection) => {
      let education = {};

      const dateStart = eduSection?.getElementsByTagName('h3')[0]?.textContent.trim() || null;
      const dateEnd = eduSection?.getElementsByTagName('h3')[1]?.textContent.trim() || null;
      const studyType = eduSection?.getElementsByTagName('h3')[2]?.textContent.trim() || null;
      const area = eduSection?.getElementsByTagName('h3')[3]?.textContent.trim() || null;
      const institution = eduSection?.getElementsByTagName('h3')[4]?.textContent.trim() || null;
      const score = eduSection?.getElementsByTagName('h3')[5]?.textContent.trim() || null;
      const url = eduSection?.getElementsByTagName('h3')[6]?.getElementsByTagName('a')[0]?.href || null;

      // Only add fields if they exist
      if (institution) education.institution = institution;
      if (url) education.url = url;
      if (area) education.area = area;
      if (studyType) education.studyType = studyType;
      if (dateStart) education.startDate = dateStart;
      if (dateEnd) education.endDate = dateEnd;
      if (score) education.score = score;

      if (Object.keys(education).length > 0) {
        jsonData.education.push(education);
      }
    });
  }

  // helper functions
  // function createLinkElement(className, href, textContent) {
  //   const link = document.createElement('a');
  //   link.setAttribute('class', className);
  //   link.setAttribute('href', href);
  //   link.textContent = textContent;
  //   return link;
  // }

  function generateDate() {
    const date = new Date(); // Get the current date
    const year = date.getFullYear(); // Get the full year (4 digits)
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Get the month (0-based, so add 1 and pad to 2 digits)
    const day = String(date.getDate()).padStart(2, '0'); // Get the day of the month and pad to 2 digits
    return `${year}-${month}-${day}`; // Return the formatted date
  }

  function containsOnlyLetters(str) {
    return /^[a-zA-Z\s]+$/.test(str);
  }

  function htmls() {
    // set default name of file
    let ceds = 'cv-europass';
    const vardasNode = document.getElementById('name').textContent;
    // if test pass only letters use safely make name of file as person name
    if (containsOnlyLetters(vardasNode) && vardasNode) {
      ceds = vardasNode?.replace(/\s/g, '-') + '-CV'; //(-) can be a good choice for file names words seperations + add (CV)
    }
    const date = generateDate();
    // Remove elements using pure JavaScript
    document.querySelectorAll('.remove').forEach(function (element) {
      element.parentNode.removeChild(element);
    });
    document.querySelectorAll('[draggable="true"]').forEach(e => e.removeAttribute("draggable"));

    // Clone the HTML content
    const htmlElement = document.querySelector('html');
    const clonedHtml = htmlElement.cloneNode(true);

    // Get the HTML string of the cloned document
    let htmlString = clonedHtml.outerHTML;

    // Generate the complete HTML document string
    htmlString = `<!DOCTYPE html>\n${htmlString}`;

    // Call all extraction functions
    // extractSkills();
    // extractLanguages();
    // extractPersonalSkills();
    extractBasics();
    extractWorkExperience();
    extractEducation();
    exportToJson(jsonData, ceds + '-' + date + '.json');
    // Trigger file download
    download(ceds + '-' + date, htmlString);
  }

  function download(fileName, html) {
    const pom = document.createElement('a');
    document.body.appendChild(pom);
    pom.setAttribute(
      'href',
      'data:text/plain;charset=utf-8,' + encodeURIComponent(html)
    );
    pom.setAttribute('download', fileName + '.html');
    pom.target = '_blank';
    if (document.createEvent) {
      // Create a new click event
      const event = new MouseEvent('click', {
        bubbles: true, // Indicates that the event can bubble up through the DOM tree
        cancelable: true // Indicates that the event can be canceled
      });
      pom.dispatchEvent(event);
    } else {
      pom.click();
    }
  }

  function exportToJson(data, fileName = 'data.json') {
    // Convert the data object to a JSON string
    const jsonString = JSON.stringify(data, null, 4);

    // Create a Blob with the JSON data
    const blob = new Blob([jsonString], {
      type: 'application/json'
    });

    // Create a download link
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = fileName;

    // Trigger the download
    link.click();

    // Clean up
    URL.revokeObjectURL(link.href);
  }

  // events

  document.addEventListener('mouseup', (e) => {
    const target = e.target;
    if (target.tagName === 'OPTION') {
      target.parentNode.parentNode.innerHTML = target.value;
    }
  });

  document.addEventListener('keyup', function (e) {
    if (e.key === 'Enter') {
      outf();
      // localStorage.setItem(document.getElementById('name').textContent.replace(/\s+/g, ""), JSON.stringify(jsonData));
    }
  });

  document.body.addEventListener('dblclick', function (e) {
    if (e.target.classList.contains('edit')) {
      e.preventDefault();

      const selectHtml =
        `<select>
        <option value="A1 – Breakthrough">A1 – Breakthrough</option>
        <option value="A2 – Waystage">A2 – Waystage</option>
        <option value="B1 – Threshold">B1 – Threshold</option>
        <option value="B2 – Vantage">B2 – Vantage</option>
        <option value="C1 – Effective Operational Proficiency">C1 – Effective Operational Proficiency</option>
        <option value="C2 – Mastery">C2 – Mastery</option>
      </select>`;

      e.target.insertAdjacentHTML('afterbegin', selectHtml);
    }
  });

  document.body.addEventListener('click', function (e) {
    const target = e.target;


    if (target.classList.contains('rem')) {
      if (target.parentNode.classList.contains('toka')) {
        const row = target.parentNode.getElementsByClassName('krow');
        const last = row[row.length - 1];
        return (row.length > 3) && last.remove();
      }

      target.parentNode.remove();

    } else if (target.classList.contains('add')) {

      if (target.parentNode.classList.contains('toka')) {
        const row = target.parentNode.getElementsByClassName('krow');
        const last = row[row.length - 1];
        return last.parentNode.appendChild(last.cloneNode(true));
      }
      const node = target.parentNode;
      const copy = node.cloneNode(true);

      // const num = increment();
      // copy.getElementsByTagName('h3')[5].textContent = num + ' ' + copy.getElementsByTagName('h3')[5].textContent.replace(/\d+/g, '').trim();
      node.before(copy);

    } else if (target.tagName === 'H3' || target.tagName === 'H2' || target.parentNode.id === "number" || target.parentNode.id === "email") {

      e.preventDefault();

      const input = document.createElement('input');
      if (target.id) input.setAttribute('id', target.id);
      if (target.className) input.setAttribute('class', target.className);
      input.setAttribute('type', 'text');
      input.value = target.textContent;
      target.replaceWith(input);
      input.select();
      input.focus();

    } else if (target.tagName !== 'SELECT' && target.tagName !== 'INPUT') {
      // run all to make text not inputs function
      outf();
    }
  }, true);

})(document);
