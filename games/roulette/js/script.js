(function () {
  'use strict';

  // Cached DOM references
  const ul = document.querySelector('ul'); // Reference to the first <ul> element
  const inputs = Array.from(document.querySelectorAll('input')); // Convert all <input> elements to an array
  const textInput = document.getElementById('text-input'); // Reference to the text input element

  let begin = 0; // Tracks the starting rotation angle for the spinner

  // Initialize the circular arrangement of list items
  computeRadius();

  // Add a single event listener for the entire document to handle clicks
  document.addEventListener('click', handleDocumentClick);

  /**
   * Handles all click events on the document.
   * Delegates actions based on the clicked element's ID.
   */
  function handleDocumentClick(event) {
    const { target } = event; // Extract the event's target element

    if (target.id === 'ok') handleOkClick();
    else if (target.id === 'close') toggleVisibility('text-wrap', false);
    else if (target.id === 'toggle') handleToggleClick();
    else if (target.id === 'labels') handleLabelClick(target);
  }

  /**
   * Handles the click event for the "OK" button.
   * Hides the text-wrap container, resets the list, and recomputes radius.
   */
  function handleOkClick() {
    const textWrap = document.getElementById('text-wrap'); // Reference to the text-wrap element
    toggleVisibility(textWrap, false); // Hide the text-wrap container
    ul.innerHTML = ''; // Clear all <li> elements in the <ul>
    updateInputs(); // Generate new <li> elements based on input
    computeRadius(); // Recalculate circular positions
  }

  /**
   * Handles the click event for the "Toggle" button.
   * Displays the text-wrap container and sets focus on the input field.
   */
  function handleToggleClick() {
    const textWrap = document.getElementById('text-wrap'); // Reference to the text-wrap element
    toggleVisibility(textWrap, true); // Show the text-wrap container
    setTimeout(() => textInput.focus(), 50); // Focus on the input field with a slight delay
  }

  /**
   * Handles the click event for the "Labels" button.
   * Spins the <ul> element and selects a random winner.
   */
  function handleLabelClick(label) {
    // Check if the previous element (input) is already disabled
    if (label.previousElementSibling.disabled) return;

    // Disable the input and update the button text
    label.previousElementSibling.disabled = true;
    label.innerText = 'Please wait...';

    const randomTime = rand(3000, 7777); // Random spin duration in milliseconds
    const rotationAngle = begin + rand(720, 9999); // Calculate new rotation angle
    begin = rotationAngle; // Update the start angle for the next spin

    // Apply the rotation to the <ul> element
    ul.style.transform = `rotate3d(0, 0, 1, ${rotationAngle}deg)`;
    ul.style.transitionDuration = `${randomTime / 1000}s`; // Set the transition duration in seconds

    // Wait for the spin to complete before enabling inputs and updating the label
    setTimeout(() => {
      // Re-enable all inputs and reset their state
      inputs.forEach(input => {
        input.checked = false;
        input.disabled = false;
      });

      // Find and display the winner
      const winner = computeElementPositions();
      label.innerText = winner ? winner.innerText : 'No winners';
    }, randomTime);
  }

  /**
   * Toggles the visibility of an element by adding or removing the "hide" class.
   * @param {string|Element} elementIdOrElement - The ID or DOM element to show/hide.
   * @param {boolean} isVisible - Whether to show or hide the element.
   */
  function toggleVisibility(elementIdOrElement, isVisible) {
    const element = typeof elementIdOrElement === 'string'
      ? document.getElementById(elementIdOrElement)
      : elementIdOrElement;

    if (element) {
      element.classList.toggle('hide', !isVisible); // Add/remove "hide" class
    }
  }

  /**
   * Arranges the <li> elements in a circular pattern.
   */
  function computeRadius() {
    const listItems = Array.from(ul.querySelectorAll('li')); // Get all <li> elements in the <ul>
    const rotationAngle = 360 / listItems.length; // Calculate rotation angle for each item

    listItems.forEach((item, index) => {
      item.style.transform = `rotate3d(0, 0, 1, ${rotationAngle * index}deg)`; // Apply rotation
    });
  }

  /**
   * Finds the <span> element with the highest vertical position.
   * @returns {Element|null} - The winning <span> element or null if none.
   */
  function computeElementPositions() {
    const spans = Array.from(ul.querySelectorAll('span')); // Get all <span> elements in the <ul>
    return spans.reduce((maxSpan, currentSpan) =>
      maxSpan.getBoundingClientRect().top > currentSpan.getBoundingClientRect().top
        ? maxSpan
        : currentSpan
    , spans[0]);
  }

  /**
   * Generates a random integer between min (inclusive) and max (exclusive).
   * @param {number} min - Minimum value (inclusive).
   * @param {number} max - Maximum value (exclusive).
   * @returns {number} - Random integer in the range.
   */
  function rand(min, max) {
    return Math.floor(Math.random() * (max - min)) + Math.ceil(min);
  }

  /**
   * Creates <li> elements based on the input text and appends them to the <ul>.
   */
  function updateInputs() {
    const text = textInput.value.trim(); // Get trimmed input value
    const filters = text.split(/\s+/).filter(word => word.length > 1); // Split into words and filter valid ones

    filters.forEach(word => {
      const li = document.createElement('li'); // Create new <li> element
      const span = document.createElement('span'); // Create new <span> element
      span.innerText = word; // Set the word as span's text
      li.appendChild(span); // Append <span> to <li>
      ul.appendChild(li); // Append <li> to <ul>
    });
  }
})();
