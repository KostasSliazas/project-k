/*jshint esversion: 11 */

(function () {
    'use strict';

    const getElementById = (id) => document.getElementById(id);
    const main = getElementById('main');
    const output = getElementById('output');
    const statistics = getElementById('statistics');
    const popup = getElementById('popup');
    const lettersCells = getElementById('letters-cells');
    const buttonSearch = getElementById('search-button');

    const cleanInput = (textInput) => textInput.value.trim().replace(/[, ]/g, '').toUpperCase().split('');
    const isCheckboxChecked = (checkboxElement) => checkboxElement.checked;

    const delay = ms => new Promise(resolve => setTimeout(resolve, ms));
    const hide = (element) => element.classList.add('hides');
    const show = (element) => element.classList.remove('hides');

    const convertToNumber = (value) => {
        const number = Number(value);
        return isNaN(number) ? 0 : number; // Return 0 for non-numeric input
    };

    function createHTMLElement(tagName, textContent, attributes) {
        const element = document.createElement(tagName);
        if (textContent) element.textContent = textContent;

        if (attributes) {
            for (const key in attributes) element.setAttribute(key, attributes[key]);
        }
        return element;
    }

    function addRandomCharacters(inputString, numCharacters) {
        var characters = '\!\"\#\$\%\&\'\(\)\*\+\,\-\.\:\/\;\<\=\>\?\@\[\\\]\^\_\`\{\|\}\~áéñü©®™°abcdefghijklmnopqrstuvwxyz0123456789';
        var result = inputString;

        for (var i = 0; i < numCharacters; i++) {
            var randomIndex = Math.floor(Math.random() * result.length);
            var randomChar = characters.charAt(Math.floor(Math.random() * characters.length));
            result = result.slice(0, randomIndex) + randomChar + result.slice(randomIndex);
        }

        return result;
    }

    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];

            // Check for consecutive duplicates
            if (array[i] === array[i - 1]) {
                let k = i - 1;
                while (k > 0 && array[k] === array[i]) {
                    k--;
                }
                [array[i], array[k]] = [array[k], array[i]];
            }
        }

        return array;
    }

    function generateRandomWord(letters, length) {
        const availableLetters = letters.slice(); // Make a copy of the letters array to track available letters
        const randomLetters = [];

        // Shuffle the available letters
        shuffleArray(availableLetters);

        // Pick letters from the shuffled array without consecutive duplicates
        while (randomLetters.length < length && availableLetters.length > 0) {
            const randomLetter = availableLetters.pop(); // Take the last letter from the shuffled array
            // Check if the last letter in the generated word is the same as the current random letter
            if (randomLetters.length === 0 || randomLetters[randomLetters.length - 1] !== randomLetter) {
                randomLetters.push(randomLetter);
            }
        }

        // If the word generated is shorter than the specified length, repeat random letters until it reaches the length
        while (randomLetters.length < length) {
            const randomIndex = Math.floor(Math.random() * letters.length);
            const randomLetter = letters[randomIndex];
            randomLetters.push(randomLetter);
        }

        return randomLetters.join(''); // Ensure the word has the specified length
    }




    async function generateUniqueWords(letters, length, max, duration) {
        const generatedWords = new Set();
        let uniqueWordsCount = 0;

        const startTime = Date.now();

        while (generatedWords.size < max && Date.now() - startTime < duration) {
            const word = generateRandomWord(letters, length);
            generatedWords.add(word);
            uniqueWordsCount++;
            await delay(0); // Yield to event loop
        }

        return Array.from(generatedWords);
    }
    // function countAllPossibilities(letters, length) {
    //     // Helper function to generate all unique words recursively
    //     function generateUniqueWords(word, remainingLetters) {
    //         // Base case: if the word length is equal to the desired length, return the word
    //         if (word.length === length) {
    //             return [word];
    //         }

    //         let uniqueWords = [];

    //         // Iterate through remaining letters to generate unique words
    //         for (let i = 0; i < remainingLetters.length; i++) {
    //             const nextLetter = remainingLetters[i];
    //             // Ensure consecutive letters are not the same
    //             if (nextLetter !== word[word.length - 1]) {
    //                 const newWord = word + nextLetter;
    //                 const newRemainingLetters = remainingLetters.slice(0, i).concat(remainingLetters.slice(i + 1));
    //                 // Recursively generate unique words by appending next letter
    //                 uniqueWords = uniqueWords.concat(generateUniqueWords(newWord, newRemainingLetters));
    //             }
    //         }

    //         return uniqueWords;
    //     }

    //     // Generate all unique words recursively
    //     const allUniqueWords = generateUniqueWords('', letters);

    //     // Filter out words with length not equal to the specified length
    //     const uniqueWordsWithLength = allUniqueWords.filter(word => word.length === length);

    //     // Return the count of unique words with the specified length
    //     return uniqueWordsWithLength.length;
    // }

    main.onclick = async (event) => {

        if (event.target.id === 'submit') {
            const textInput = getElementById('textInput');
            const wordLengthInput = getElementById('word-length');
            const maximumWordsInput = getElementById('maximum-words');
            const randomCharacters = isCheckboxChecked(getElementById('random-characters'));
            const maxTimeToWait = getElementById('max-time');

            const letters = cleanInput(textInput);
            const length = convertToNumber(wordLengthInput.value);
            const max = convertToNumber(maximumWordsInput.value);
            const duration = convertToNumber(maxTimeToWait.value) * 1000; // 5 seconds

            popup.innerHTML = 'Please wait...';
            await showPopupWithDelay(0);

            // If input is empty, display appropriate message
            // if (letters.length === 0) {
            //     // Display message indicating no unique words
            //     statistics.appendChild(createHTMLElement('p', `Total unique words: 0`));
            //     statistics.appendChild(createHTMLElement('p', `Generated unique words: 0`));
            //     return;
            // }

            // const totalPossibilities = countAllPossibilities(letters, length);
            const lengthTotal = convertToNumber(wordLengthInput.value);
                // Clear content
                statistics.innerHTML = '';
                // Clear main content
                output.innerHTML = '';
            try {
                const generatedWords = await generateUniqueWords(letters, length, max, duration);
                const uniqueWordsCount = generatedWords.length;
                // Display total unique words
                // statistics.appendChild(createHTMLElement('p', `Total unique words: ${totalPossibilities}`));
                // Display total unique words generated
                statistics.appendChild(createHTMLElement('p', `Generated unique words: ${uniqueWordsCount}`));

                // Append generated words to the output
                generatedWords.forEach((element, index) => {
                    const text = randomCharacters ? addRandomCharacters(element, lengthTotal) : element;
                    const newParagraph = createHTMLElement('p', text, {
                        class: "ok",
                        id: 'item' + index
                    });
                    output.appendChild(newParagraph);
                });
                lettersCells.innerHTML = '';
                for (let i = 0; i < lengthTotal; i++) {
                    lettersCells.appendChild(
                        createHTMLElement('input', '', {
                            maxlength: 1,
                            size: 2,
                        })
                    );
                }
                show(buttonSearch);
                await hidePopupWithDelay(0);
                buttonSearch.onclick = () => {
                    statistics.innerHTML = output.innerHTML = '';
                    const matched = matchWordsWithPattern(generatedWords, getInputs());
                    // Append generated words to the output
                    matched.forEach((element, index) => {
                        const text = randomCharacters ? addRandomCharacters(element, lengthTotal) : element;
                        const newParagraph = createHTMLElement('p', text, {
                            class: "ok",
                            id: 'item' + index
                        });
                        output.appendChild(newParagraph);
                    });
                    statistics.appendChild(createHTMLElement('p', `Found words: ${matched.length}`));
                };
            } catch (error) {
                console.error('Error generating unique words:', error);
            }
        }
    };

    function getInputs() {
        return (Array.from(lettersCells.getElementsByTagName('INPUT')).map(e => e.value.toUpperCase() || '.')).join('');
    }

    function matchWordsWithPattern(wordList, pattern) {
        const matchedWords = wordList.filter(word => {
            if (word.length !== pattern.length) return false; // If lengths don't match, skip
            for (let i = 0; i < word.length; i++) {
                if (pattern[i] !== '.' && pattern[i] !== word[i]) return false; // If characters don't match, skip
            }
            return true; // All characters match
        });
        return matchedWords;
    }



    output.addEventListener("click", function (e) {
        // Check if the clicked element is a <p> element
        if (e.target.tagName === 'P') {
            var textToCopy = e.target.innerText || e.target.textContent;

            // Create a temporary textarea element
            var textarea = document.createElement("textarea");
            textarea.value = textToCopy;
            document.body.appendChild(textarea);

            // Select the text within the textarea
            textarea.select();

            // Copy the selected text
            document.execCommand('copy');

            // Remove the temporary textarea
            document.body.removeChild(textarea);

            // Optionally, provide some feedback to the user
            popup.innerHTML = "Copied to clipboard: " + textToCopy;
            showPopupWithDelay(0);
            hidePopupWithDelay(2000);
        }
    });

    // Function to get the input element from a counter element
    const getElem = e => e.querySelector('input');
    // Counter object definition
    const counter = {
        min: 1,
        max: 100,
        number: 0,
        numberMinus1() {
            return this.number - 1;
        },
        numberPlus1() {
            return this.number + 1;
        },

        set numbers(number) {
            // Use Math.abs to ensure the correct comparison
            if (number > Math.abs(this.max || number < this.min)) return;
            this.number = number;
        },
        get numbers() {
            return this.number;
        }
    };

    // Seal the counter object
    Object.seal(counter);

    // Function to save all input values to localStorage
    const saveAllInputs = () => {
        const values = Array.from(counters, counter => getElem(counter).value);
        localStorage.setItem('CInputValues', values.join(','));
    };

    // Flag to prevent multiple saves during a short time
    let isSaving = false;

    // Function to set items and trigger saving
    async function setItems(element) {
        if (isSaving) return;
        isSaving = true;
        element.classList.add('saved');
        await delay(500);
        await saveAllInputs();
        element.classList.remove('saved');
        isSaving = false;
    }

    // Function to highlight an element temporarily
    const hightLight = async (element) => {
        element.classList.add('max');
        await delay(200);
        element.classList.remove('max');
    };

    // Function to handle button click and adjust counter
    const increase = e => {
        const {
            target
        } = e;
        if (target.tagName !== 'BUTTON') return;

        const {
            currentTarget
        } = e;
        const inputElement = getElem(currentTarget);
        counter.numbers = parseInt(inputElement.value);

        if (target.textContent === '—') {
            if ((inputElement.min || counter.min) < counter.numbers) {
                counter.numbers = inputElement.value = counter.numberMinus1();
            } else return hightLight(target);
        }

        if (target.textContent === '+') {
            if (parseInt(inputElement.max || counter.max) > counter.numbers) {
                counter.numbers = inputElement.value = counter.numberPlus1();
            } else return hightLight(target);
        }
        setItems(currentTarget.parentElement);
    };

    // Function to handle input value change
    const inputChange = e => {
        const {
            target
        } = e;
        if (isNaN(parseInt(target.value)) || (Math.max(parseInt(target.min)) || counter.min) > parseInt(target.value)) {
            target.value = target.min || counter.min;
        } else if ((Math.max(parseInt(target.max)) || counter.max) < parseInt(target.value)) {
            target.value = target.max || counter.max;
        }
        setItems(target.parentElement);
    };

    // Retrieve input values from localStorage
    const values = localStorage.getItem('CInputValues') && localStorage.getItem('CInputValues').split(',').map(Number);

    // Retrieve all counter elements
    const counters = document.querySelectorAll('.counter');

    // Initialize counters with values and event listeners
    counters.forEach((counter, index) => {
        const inputElement = getElem(counter);
        inputElement.value = values && values[index] || inputElement.value || inputElement.min || 1;
        counter.addEventListener('click', increase);
        inputElement.addEventListener('change', inputChange);
    });

    // Function to show popup after delay
    async function showPopupWithDelay(delayMs) {
        await delay(delayMs);
        show(popup);
    }

    // Function to hide popup after duration
    async function hidePopupWithDelay(durationMs) {
        await delay(durationMs);
        hide(popup);
    }
    // Listen for click event on document to hide popup if clicked outside
    document.addEventListener('click', clickHandler);

    function clickHandler(event) {
        // Check if the clicked element is popup
        if (event.target === popup) {
            hidePopupWithDelay(0);
            // Remove the event listener after hiding the popup
            // document.removeEventListener('click', clickHandler);
        }
    }

})();
