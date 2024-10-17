;
(function () {
  'use strict'
  const ul = document.getElementsByTagName('ul')[0]
  const inputs = Array.from(document.getElementsByTagName('input'))
  const textInput = document.getElementById('text-input')

  let begin = 0
  computeRadius()

  function reset(e) {
    // Get reference to the text-wrap element
    const textWrap = document.getElementById('text-wrap');

    // Handle 'ok' button click
    if (e.target.id === 'ok') {
      textWrap.classList.add('hide'); // Hide the text-wrap element
      ul.innerHTML = ''; // Clear the content of the ul element
      getInputs(); // Fetch and set inputs
      computeRadius(); // Compute and set radius for the circular arrangement
    }

    // Handle 'close' button click
    if (e.target.id === 'close') {
      textWrap.classList.add('hide'); // Hide the text-wrap element
    }

    // Handle 'toggle' button click
    if (e.target.id === 'toggle') {
      setTimeout(() => textInput.select(), 50); // Delayed focus on text input
      textWrap.classList.remove('hide'); // Remove the 'hide' class to display the text-wrap element
    }

    // Check if the clicked element has an id other than 'labels' and return if not
    if (e.target.id !== 'labels') return;

    // Generate a random time value between 3000 and 7777
    const randomTime = rand(3000, 7777);

    // Check if the button is not disabled
    if (!e.target.previousElementSibling.disabled) {
      e.target.previousElementSibling.disabled = true; // Disable the button
      e.target.innerText = 'Please wait...'; // Set button text to 'Please wait...'

      // Generate a random rotation angle
      const rotationAngle = begin + rand(720, 9999);
      begin = rotationAngle;

      // Apply rotation to the 'ul' element with a transition
      ul.style.transform = `rotate3d(0,0,1,${rotationAngle}deg)`;
      ul.style.transitionDuration = `${randomTime / 1000}s`;

      // Set a timeout to simulate a delay
      const timeoutId = setTimeout(() => {
        // Enable inputs and reset button text
        inputs.forEach((input) => {
          input.checked = false;
          input.disabled = false;
        });

        // Clear the timeout
        clearTimeout(timeoutId);

        // Update button text with winners or 'No winners' message
        e.target.innerText = typeof computeElementPositions() !== 'undefined' ?
          computeElementPositions().innerText :
          'No winners';
      }, randomTime);
    }
  }


  function computeRadius() {
    // Get all <li> elements within the <ul>
    const listItems = Array.from(ul.getElementsByTagName('li'));

    // Calculate the rotation angle for each <li> based on the number of items
    const rotationAngle = 360 / listItems.length;

    // Initialize the rotation angle
    let currentRotation = 0;

    // Iterate through each <li> and set the rotation using template literals
    listItems.forEach(listItem => {
      listItem.style.transform = `rotate3d(0, 0, 1, ${currentRotation}deg)`;
      // Update the rotation angle for the next <li>
      currentRotation += rotationAngle;
    });
  }

  function computeElementPositions() {
    // Convert the HTMLCollection of <span> elements to an array
    const allList = Array.from(ul.getElementsByTagName('span'));

    // Find the element with the maximum top position using reduce
    const max = allList.reduce((acc, shot) =>
      (acc = acc.getBoundingClientRect().top > shot.getBoundingClientRect().top ? acc : shot), allList[0]);

    // Return the element with the maximum top position
    return max;
  }


  function rand(min, max) {
    // Use Math.ceil to round up the minimum value
    min = Math.ceil(min);

    // Use Math.floor to round down the maximum value
    max = Math.floor(max);

    // Generate a random number between the adjusted min and max (exclusive),
    // and then add the adjusted min to ensure the result is within the specified range
    return Math.floor(Math.random() * (max - min)) + min;
  }

  function getInputs() {
    // Get the value from the text input
    const text = textInput.value;

    // Trim and split the input into an array of filtered words
    const filters = text.trim().replace(/\s/g, ' ').split(' ').filter(e => (e.length > 1) && e.replace(/\s+/, ''));

    // Create a list item for each filtered word and append it to the ul element
    filters.forEach(n => {
      const li = document.createElement('li');
      const span = document.createElement('span');
      span.innerText = n;
      li.appendChild(span);
      ul.appendChild(li);
    });
  }

  document.addEventListener('click', reset)
})()