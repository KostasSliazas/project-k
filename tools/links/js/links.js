// jshint esversion:11

/**
 * Local Storage Manager
 * @version 1.5.1
 */

/**
 * Main function to manage local storage.
 * @param {Window} w - The global window object.
 * @param {Document} d - The document object.
 */
(function (w, d) {
  /**
   * Utility for managing localStorage with namespacing.
   */
  const StorageNamespace = {
    /**
     * The current namespace for all storage operations.
     * @type {string}
     */
    namespace: 'localStorageManager',

    /**
     * Sets the namespace for localStorage keys.
     * @param {string} ns - The namespace to use.
     */
    setNamespace(ns) {
      this.namespace = ns;
    },

    /**
     * Constructs the full key by prefixing it with the namespace.
     * @private
     * @param {string} key - The key to namespace.
     * @returns {string} - The namespaced key.
     */
    _getKey(key) {
      return `${this.namespace}:${key}`;
    },

    /**
     * Saves a value to localStorage under the namespaced key.
     * @param {string} key - The key to store the value under.
     * @param {*} value - The value to store. It will be serialized to JSON.
     */
    setItem(key, value) {
      w.localStorage.setItem(this._getKey(key), JSON.stringify(value));
    },
    // removeItem(key) {
    //   w.localStorage.removeItem(this._getKey(key));
    // },
    /**
     * Retrieves a value from localStorage.
     * @param {string} key - The key to retrieve the value for.
     * @return {Object|null} - The deserialized value (an object or array) if successful, or `null` if the key doesn't exist or deserialization fails.
     */
    getItem(key) {
      const item = w.localStorage.getItem(this._getKey(key));
      if (item === null) {
        return []; // No item found, return null
      }

      try {
        // Safely parse the item (it is now guaranteed to be a string)
        const parsedItem = /** @type {Object|null} */ (JSON.parse(item));
        return parsedItem;
      } catch (e) {
        console.error(`Error parsing JSON for key "${key}":`, e);
        return null;
      }
    },

    /**
     * Clears all values under the current namespace from w.localStorage.
     */
    clear() {
      Object.keys(w.localStorage).forEach(key => {
        if (key.startsWith(`${this.namespace}:`)) {
          w.localStorage.removeItem(key);
        }
      });
    },

    /**
     * Retrieves all keys under the current namespace.
     * @returns {Array<string>} - An array of keys within the namespace, with the namespace prefix removed.
     */
    keys() {
      return Object.keys(w.localStorage) // Object.keys should return an array of strings
        .filter(key => key.startsWith(`${this.namespace}:url`))
        .map(key => key.replace(`${this.namespace}:url`, ''));
    },

    /**
     * Appends a value to an array or updates an object stored under the given key.
     * @param {string} key - The key of the stored value.
     * @param {*} value - The value to append or merge.
     */
    appendItem(key, value) {
      const existingValue = this.getItem(key);

      if (Array.isArray(existingValue)) {
        // Append to array
        existingValue.push(value);
        this.setItem(key, existingValue);
      } else if (existingValue && typeof existingValue === 'object') {
        // Merge into object
        this.setItem(key, { ...existingValue, ...value });
      } else {
        // Create a new array or object
        const newValue = Array.isArray(value) ? value : [value];
        this.setItem(key, newValue);
      }
    },
    /**
     * Removes an item from an array stored under the given key by index.
     * @param {string} key - The key of the stored array.
     * @param {number} index - The index of the item to remove.
     */
    removeItem(key, index) {
      const array = this.getItem(key);
      if (Array.isArray(array) && array.length > index) {
        array.splice(index, 1); // Remove the item at the specified index
        this.setItem(key, array); // Save the updated array back to localStorage
      }
    },
  };
  const body = d.body;
  const fileInput = d.getElementById('file-input');
  const checkboxes = d.getElementById('check-boxes');
  const selection = d.getElementById('select');
  const choice = d.getElementById('choices');
  const createLink = d.getElementById('create-link');
  const outputs = d.getElementById('output');
  const closeEx = d.getElementById('exit');
  const closeBtn = d.getElementById('exit1');
  const opensBtn = d.getElementById('open');
  const addition = d.getElementById('additions');
  const search = d.getElementById('site-search');
  const copyAll = d.getElementById('copy-links');
  const exportJson = d.getElementById('export-json');
  const showExport = d.getElementById('export-div');
  const links = d.getElementById('links');
  const found = d.getElementById('founded');
  const checkedBoxElement = d.getElementsByName('check')[0];
  const filteredExport = d.getElementById('filter');

  /**
   * Checks if the checkbox is checked.
   * @param {HTMLInputElement} elem - The checkbox element to check.
   * @returns {boolean} - Returns `true` if the checkbox is checked, otherwise `false`.
   */
  const isChecked = elem => elem.checked;

  /**
   * Retrieves the stored state from the storage.
   * @type {boolean} - The stored state, could be boolean or null if not set.
   */
  const state = !!StorageNamespace.getItem('admin-mode');
  checkedBoxElement.checked = state;
  body.classList.toggle('checks', state);

  /**
   * Class switching function to update the checkbox state, toggle the UI class, and store the state.
   * @function
   * @returns {void} This function does not return anything.
   */
  const classSwitch = () => {
    // Ensure `isChecked` returns a boolean value, convert to boolean if necessary
    const state = Boolean(isChecked(checkedBoxElement)); // Ensure state is a boolean value

    // Toggle the class based on the state of the checkbox
    body.classList.toggle('checks', state); // state should be a boolean

    // Save the updated state back to local storage
    StorageNamespace.setItem('admin-mode', state); // state is a boolean
  };

  filteredExport.checked = false;

  /** @type {HTMLElement|null} */
  let lastElem = null;
  /** @type {boolean} */
  let active = false;

  const hide = element => {
    if (lastElem && lastElem !== element) {
      lastElem.style.display = 'none';
      active = false;
    }

    element.style.display = active ? 'none' : 'block';
    active = !active;
    lastElem = element;
  };

  /** @type {{counter: number, array: Array}} */
  const counterObject = {
    counter: StorageNamespace.getItem('url').length,
    array: [],
  };

  /**
   * Show statistics of stored items.
   * @function
   */
  const showStats = () => {
    found.innerHTML = counterObject.array.filter(elem => elem.className !== 'hidden').length + '/' + StorageNamespace.getItem('url').length;
  };

  /**
   * Add text of checked items.
   * @function
   * @param {string} m - The message to display.
   */
  const addTextOfChecked = m => {
    choice.innerHTML = m || loopOverInputs().join(', ');
  };
  /**
   * Loop over checkbox inputs.
   * @function
   * @returns {Array} - Array of checked values.
   */
  const loopOverInputs = () =>
    [...checkboxes.getElementsByTagName('INPUT')]
      .map(e => {
        if (e.checked) return e.value;
      })
      .filter(Boolean);

  /**
   * Loop through storage items.
   * @function
   * @returns {Array} - Array of storage items.
   */
  function loopStorageItems() {
    const data = [];
    const urls = StorageNamespace.getItem('url');
    if (urls && typeof urls === 'object') {
      Object.values(urls).forEach(value => {
        data.push(value); // Push values into the data array
      });
    }
    return data;
  }
  /**
   * Export data to JSON.
   * @function
   */
  const exporter = () => {
    const fileName = `localStorage${dateGet()}.json`;

    if (filteredExport.checked) {
      const allFilteredElms = Array.from(outputs.querySelectorAll('a:not(.hidden)'));
      const filteredLinks = allFilteredElms.map(element => element.links);
      saveData(filteredLinks, `${search.value || 'fil'}-${fileName}`);
    } else {
      const allLinks = loopStorageItems();
      saveData(allLinks, `all-${fileName}`);
    }

    hide(showExport);
  };
  /**
   * Extract hostname from URL.
   * @function
   * @param {string} url - The URL to extract hostname from.
   * @returns {string|null} - The extracted hostname.
   */
  function extractHostname(url) {
    try {
      const parsedUrl = new URL(url);
      return parsedUrl.hostname.split(':')[0];
    } catch (error) {
      console.error('Invalid URL:', error.message);
      return null;
    }
  }

  /**
   * Get formatted date.
   * @function
   * @returns {string} - The formatted date.
   */
  function dateGet() {
    const dateObj = new Date();
    const month = (dateObj.getUTCMonth() + 1).toString().length > 1 ? dateObj.getUTCMonth() + 1 : '0' + (dateObj.getUTCMonth() + 1); // months from 1-12
    const day = dateObj.getUTCDate().toString().length > 1 ? dateObj.getUTCDate() : '0' + dateObj.getUTCDate();
    const year = dateObj.getUTCFullYear();
    const sec = dateObj.getSeconds().toString().length > 1 ? dateObj.getSeconds() : '0' + dateObj.getSeconds();
    const minutes = dateObj.getMinutes().toString().length > 1 ? dateObj.getMinutes() : '0' + dateObj.getMinutes();
    const hours = dateObj.getHours().toString().length > 1 ? dateObj.getHours() : '0' + dateObj.getHours();
    return `${year}-${month}-${day}(${hours}-${minutes}-${sec})`;
  }
  /**
   * Remove an element.
   * @function
   * @param {Event} e - The event object.
   */
  const remover = function (e) {
    e.preventDefault();
    const elem = this.element;
    const index = counterObject.array.indexOf(elem);

    if (e.target.parentElement) {
      elem.remove();
    }

    if (index >= 0) {
      counterObject.array.splice(index, 1);
      StorageNamespace.removeItem('url', index);
    }

    showStats();
  };

  /**
   * Show or hide checkboxes based on user interaction.
   * @param {Event} e - The event object.
   */
  function showCheckboxes(e) {
    const isCreateLinkClicked = e.target.id === 'create-link';
    const isSelectClicked = e.target.id === 'select';

    if (isCreateLinkClicked) {
      return;
    }

    if (isSelectClicked && !selection.classList.contains('open')) {
      selection.classList.add('open');
      checkboxes.style.display = 'block';
    } else {
      const isLabelOrInputClicked = e.target.tagName === 'LABEL' || e.target.tagName === 'INPUT';

      if (isLabelOrInputClicked) {
        return;
      }

      selection.classList.remove('open');
      checkboxes.style.display = 'none';
      addTextOfChecked('');
    }
  }

  /**
   * Set links based on user input.
   * @function
   * @returns {boolean} - False if URL is not defined.
   */
  function setLinks() {
    const urlInput = d.getElementById('urls');
    const url = urlInput.value.trim();

    if (url.length === 0) {
      addTextOfChecked('No URL defined');
      return false;
    }

    if (StorageNamespace.getItem(url)) {
      addTextOfChecked('Value already exists');
      return false;
    }

    const fav = extractHostname(url);
    const createLinkObject = {
      text: addition.value,
      url: fav,
      full: url,
      type: loopOverInputs(),
    };

    const element = createElem(createLinkObject);
    outputs.appendChild(element);
    StorageNamespace.appendItem('url', createLinkObject);
    counterObject.array.push(element);
    // counterObject.counter = StorageNamespace.keys().length;
    showStats();

    // Clear the input field
    urlInput.value = '';

    return false;
  }

  class DOMElements {
    /**
     * @param {string} elementTag - The HTML tag of the element.
     * @param {string|null} className - The class name for the element.
     * @param {Object|string|null} item - The item to associate with the element.
     * @param {Object|null} functions - The functions to bind to the element's onclick event.
     */
    constructor(/* @export @type {string} */ elementTag, className, item, functions) {
      this.element = d.createElement(elementTag);
      this.element.links = item;
      // Calling switcher if an item is provided
      if (typeof elementTag === 'string') {
        this.switcher(elementTag);
      }

      // Applying attributes only if they are defined
      if (typeof className === 'string') {
        this.element.className = className;
      }
      // Binding functions to the element's onclick event if provided
      if (functions && typeof functions === 'object' && className === 'close') {
        this.element.onclick = remover.bind(functions);
      }
    }

    switcher(element) {
      // if (element == 'span')return this.span();
      // if (element == 'a') return this.a();
      // if (element == 'img')return  this.img();
      return this[element]();
    }
    span() {
      this.element.textContent = this.element.links;
    }

    a() {
      const links = this.element.links;
      if (links && links.full) {
        this.element.setAttribute('target', '_blank');
        this.element.setAttribute('href', links.full);
      }
    }

    img() {
      const links = this.element.links;
      const image = new Image();
      if (links && links.url) {
        image.setAttribute('alt', `${links.url}-${adder.counter++}`);
        image.setAttribute('loading', 'lazy');
        image.src = `https://${links.url}/favicon.ico`;
        image.width = 16;
        image.height = 16;
        image.onerror = function (e) {
          e.target.onerror = null;
          e.target.src = './favicon.ico';
        };
      }
      this.element = image;
    }
  }

  // DOMElements.prototype.switcherTag = {
  //   span: function () {
  //     this.element.textContent = this.element.links;
  //   },
  //   a: function () {
  //     const links = this.element.links;
  //     if (links && links.full) {
  //       this.element.setAttribute('target', '_blank');
  //       this.element.setAttribute('href', links.full);
  //     }
  //   },
  //   img: function () {
  //     const links = this.element.links;
  //     if (links && links.url) {
  //       this.element.setAttribute('alt', `${links.url}-${adder.counter++}`);
  //       this.element.src = `https://${links.url}/favicon.ico`;
  //       this.element.onerror = function (e) {
  //         e.target.onerror = null;
  //         e.target.src = './favicon.ico';
  //       };
  //     }
  //   },
  // };

  /** @type {Object} */
  const adder = {
    counter: 0,
  };

  /**
   * Create a new DOM element and append child elements.
   * @param {Object} elms - An object containing properties for the element.
   * @returns {HTMLElement|null} - The created DOM element.
   */
  function createElem(elms) {
    if (!elms) return;
    /** @type {DOMElements} */
    const aElement = new DOMElements('a', 'link', elms, null); // Create the main 'a' element

    // Create an array of child elements, filtering out any null or undefined values
    const elements = [
      elms && new DOMElements('img', 'img', elms, null), // img element (optional)
      elms?.url && new DOMElements('span', 'urls', elms.url, null), // span element for URL (optional)
      elms?.text && new DOMElements('span', 'texts', elms.text, null), // span element for text (optional)
      elms?.type && new DOMElements('span', 'types', elms.type, null), // span element for type (optional)
      aElement && new DOMElements('span', 'close', '×', aElement), // close button span (always present)
    ].filter(Boolean); // Filters out any null or undefined values from the array

    // Append child elements to the 'a' element (use `this.element` to access the real DOM element)
    elements.forEach(childElement => aElement.element.appendChild(childElement.element));

    // Append the 'a' element (which is now a real DOM element) to the outputs container
    outputs.appendChild(aElement.element);

    // Explicitly cast aElement.element to HTMLElement
    return /** @type {HTMLElement} */ aElement.element; // Return the actual DOM node (HTMLElement)
  }

  /**
   * Loop through local storage.
   * @function
   */
  function loopLocalStorage() {
    search.focus();
    search.value = '';
    counterObject.array = loopStorageItems().map(e => createElem(e)); //Object.entries(w.localStorage).map(e => createElem(JSON.parse(e[1])))
    showStats();
  }

  /**
   * Check if a value is a non-empty string.
   * @function
   * @param {*} value - The value to check.
   * @returns {boolean} - True if the value is a non-empty string, false otherwise.
   */
  function isStringAndNotEmpty(value) {
    return typeof value === 'string' && value.trim() !== '';
  }

  /**
   * Loop through local storage items and perform a search.
   * @function
   */
  function loopLocalStorageSearch() {
    const searchValue = search.value.toLowerCase().trim();
    counterObject.counter = 0;

    counterObject.array.forEach(entry => {
      const { type, url, full, text } = entry.links;

      if (isStringAndNotEmpty(full)) {
        const values = [...type, ...(isStringAndNotEmpty(text) ? [text] : []), ...(isStringAndNotEmpty(url) ? [url] : []), full];

        const isInArray = values.some(value => value.toLowerCase().includes(searchValue));

        entry.className = isInArray ? 'link' : 'hidden';

        if (isInArray) counterObject.counter++;
      }
    });
    showStats();
  }

  /**
   * Save data to a file.
   * @function
   * @param {Array} data - The data to save.
   * @param {string} fileName - The name of the file.
   */
  const saveData = (() => {
    const a = d.createElement('a');

    return (data, fileName) => {
      const json = JSON.stringify(data, null, 2);
      const blob = new Blob([json], {
        type: 'application/json',
      });
      const url = URL.createObjectURL(blob);

      a.href = url;
      a.download = fileName;
      a.click();

      URL.revokeObjectURL(url);
    };
  })();

  function readSingleFile(event) {
    const file = event.target.files[0];

    if (!file) {
      return;
    }

    const reader = new FileReader();

    reader.onload = event => {
      const contents = event.target.result;
      displayContents(contents);
    };

    reader.readAsText(file);
  }

  /**
   * Displays contents by parsing the provided JSON data and updating the local storage and UI.
   * @param {string} data - The JSON string containing data to be parsed and stored.
   * @returns {void} - This function does not return a value.
   */
  function displayContents(data) {
    try {
      const json = JSON.parse(data);

      // Ensure that json is an array before using the spread operator
      if (Array.isArray(json)) {
        const currentItems = StorageNamespace.getItem('url') || []; // Get existing items or initialize an empty array
        currentItems.push(...json); // Append the new items to the existing ones
        StorageNamespace.setItem('url', currentItems); // Store each item with a unique key
      } else {
        console.warn('Parsed JSON is not an array:', json);
        // Handle the case when json is not an array, if needed.
      }

      hide(showExport);

      // Remove all nodes
      while (outputs.firstChild) {
        outputs.firstChild.remove();
      }

      loopLocalStorage();
      // counterObject.counter = StorageNamespace.keys().length;
      showStats();
    } catch (error) {
      console.error('Error parsing JSON:', error);
      // Handle the error as needed, such as displaying a user-friendly message.
    }
  }

  // function keyDownEvents(event) {
  //   const { key, target } = event;
  //   const inputValue = target.value.trim();
  //
  //   // Trigger actions when Backspace is pressed and input is empty
  //   if (key === 'Backspace' && inputValue.length === 0) {
  //     loopLocalStorageSearch();
  //   }
  //
  //   // Trigger actions when Enter is pressed and input has a value
  //   if (key === 'Enter' && inputValue.length > 0) {
  //     event.preventDefault();
  //     loopLocalStorageSearch();
  //     // Ensure outputs exists and focus on the first child
  //     if (counterObject.counter === 1) {
  //       outputs.querySelector('a:not(.hidden)').focus();
  //     }
  //   }
  // }

  function keyDownEventsDoc(event) {
    if (!event) return;
    const { key } = event;

    if (key !== 'Enter' && !active) {
      search.focus();
    }

    if (event?.target.value.trim().length > 1 && counterObject.counter === 1) {
      outputs.querySelector('a:not(.hidden)').focus();
    }

    return false;
  }

  let debounceTimeout;

  const debounce = (callback, delay) => {
    return (...args) => {
      clearTimeout(debounceTimeout);
      debounceTimeout = setTimeout(() => {
        callback(...args); // Forward all arguments (e.g., event) to the callback
      }, delay);
    };
  };

  exportJson.addEventListener('click', () => exporter());
  checkedBoxElement.addEventListener('input', () => classSwitch());
  closeEx.addEventListener('click', () => hide(showExport));
  closeBtn.addEventListener('click', () => hide(links));
  opensBtn.addEventListener('click', () => hide(links));
  createLink.addEventListener('click', () => setLinks());
  copyAll.addEventListener('click', e => hide(showExport));
  fileInput.addEventListener('change', e => readSingleFile(e), false);

  d.addEventListener('keydown', e => keyDownEventsDoc(e), true);
  d.addEventListener('click', e => showCheckboxes(e));

  // search.addEventListener('change', e => keyDownEvents(e));
  search.addEventListener(
    'keyup',
    debounce(() => loopLocalStorageSearch(), 200)
  );
  search.addEventListener('dblclick', function () {
    if (this.value.length === 0) return;
    this.value = '';
    loopLocalStorageSearch();
  });

  loopLocalStorage();
})(window, document);
