/*
  =============================================================
  script.js — Habit Tracker Logic
  Student: Kabelo | Melsoft Academy — AI Software Engineering
  =============================================================

  This file contains ALL the JavaScript that makes the
  Habit Tracker interactive.

  HOW IT WORKS (big picture):
    1. We keep one array called "habits" — this is our data.
    2. After EVERY change, we re-draw the page from that array.
    3. Functions are small, clearly named, and do one job each.
*/


// ===========================================================
// STEP 1: THE DATA — our "array of habit objects"
//
// An ARRAY is like a list:  habits = [ habit1, habit2, ... ]
// Each habit is an OBJECT with named properties.
//
// This array is the "single source of truth" —
// always update the array first, then re-draw the page.
// ===========================================================

let habits = []; // starts empty — no habits yet

// This counter gives each habit a unique ID number.
// We increase it by 1 every time we add a new habit.
let nextId = 1;


// ===========================================================
// STEP 2: GRAB THE HTML ELEMENTS WE NEED
//
// document.getElementById() finds an element by its id="..."
// We save them in variables so we don't repeat this every time.
// ===========================================================

const form          = document.getElementById('habit-form');
const nameInput     = document.getElementById('habit-name');
const targetInput   = document.getElementById('habit-target');
const categoryInput = document.getElementById('habit-category');
const errorBox      = document.getElementById('error-message');
const habitList     = document.getElementById('habit-list');


// ===========================================================
// FUNCTION 1: showError(message)
// FUNCTION 2: hideError()
//
// These small helpers show or hide the red error box.
// ===========================================================

function showError(message) {
  errorBox.textContent  = message;    // put the message text inside
  errorBox.style.display = 'block';   // make the box visible
}

function hideError() {
  errorBox.textContent  = '';
  errorBox.style.display = 'none';    // hide the box again
}


// ===========================================================
// FUNCTION 3: validateForm()
//
// Checks if the user filled in the form correctly.
//
// Returns true  → everything is fine, we can add the habit
// Returns false → something is wrong, we show an error message
//
// RULES:
//   - Name must be at least 3 characters long
//   - Target must be a whole number between 1 and 7
//   - A category must be selected (not the blank option)
// ===========================================================

function validateForm() {

  // Read the current values from the form
  // .trim() removes accidental spaces at the start and end
  const name     = nameInput.value.trim();
  const target   = Number(targetInput.value); // convert the text to a number
  const category = categoryInput.value;

  // --- Rule 1: name must be at least 3 characters ---
  if (name.length < 3) {
    showError('Habit name must be at least 3 characters long.');
    return false; // stop here — form is NOT valid
  }

  // --- Rule 2: target must be a whole number between 1 and 7 ---
  // Number.isInteger() returns true only for whole numbers (1, 2, 3...)
  if (!Number.isInteger(target) || target < 1 || target > 7) {
    showError('Target must be a whole number between 1 and 7.');
    return false;
  }

  // --- Rule 3: a category must be chosen ---
  if (category === '') {
    showError('Please select a category.');
    return false;
  }

  // If we reach here, all checks passed!
  hideError(); // clear any old error message
  return true; // form IS valid
}


// ===========================================================
// FUNCTION 4: addHabit()
//
// Creates a new habit OBJECT and adds it to the habits ARRAY.
// Then re-draws the page so the new habit appears on screen.
// ===========================================================

function addHabit() {

  // Read the values from the form inputs
  const name     = nameInput.value.trim();
  const target   = Number(targetInput.value);
  const category = categoryInput.value;

  // Build the new habit OBJECT.
  // An object uses { key: value } pairs to store data.
  const newHabit = {
    id:        nextId,    // unique ID so we can find this habit later
    name:      name,      // the habit name the user typed
    category:  category,  // the chosen category
    target:    target,    // how many days per week they want to do it
    streak:    0,         // starts at 0 — not done any days yet
    doneToday: false      // not done today yet
  };

  // .push() adds the new habit to the END of the array
  habits.push(newHabit);

  // Increase the ID counter so the next habit gets a new unique ID
  nextId = nextId + 1;

  // Clear the form so it's ready for a new entry
  nameInput.value     = '';
  targetInput.value   = '';
  categoryInput.value = '';

  // Re-draw the page to show the new habit
  renderHabits();
  updateSummary();
}


// ===========================================================
// FUNCTION 5: deleteHabit(id)
//
// Removes a habit from the array using its unique ID.
//
// .filter() creates a NEW array that only keeps items
// that pass the test inside. Here: keep every habit EXCEPT
// the one whose id matches the one we want to delete.
// ===========================================================

function deleteHabit(id) {

  habits = habits.filter(function(habit) {
    return habit.id !== id; // keep this habit only if its ID is different
  });

  // Re-draw the page
  renderHabits();
  updateSummary();
}


// ===========================================================
// FUNCTION 6: toggleDone(id)
//
// Flips a habit's doneToday between true and false.
// Also adjusts the streak count up or down.
//
// The ! operator means NOT:  !true = false,  !false = true
// ===========================================================

function toggleDone(id) {

  // .forEach() runs this function once for EACH habit in the array
  habits.forEach(function(habit) {

    if (habit.id === id) {

      // Flip the doneToday flag (true → false, or false → true)
      habit.doneToday = !habit.doneToday;

      // Adjust the streak based on the new state
      if (habit.doneToday === true) {
        // Just ticked → add 1 to streak
        habit.streak = habit.streak + 1;
      } else {
        // Just un-ticked → subtract 1 from streak
        habit.streak = habit.streak - 1;
        // Don't let streak go below zero
        if (habit.streak < 0) {
          habit.streak = 0;
        }
      }
    }

  });

  // Re-draw the page
  renderHabits();
  updateSummary();
}


// ===========================================================
// HELPER: getCategoryBadgeClass(category)
//
// Returns the correct CSS class name for the category badge.
// This keeps the renderHabits() function cleaner.
// ===========================================================

function getCategoryBadgeClass(category) {

  // An object used as a lookup table
  const classes = {
    health:   'badge-health',
    fitness:  'badge-fitness',
    learning: 'badge-learning',
    mindset:  'badge-mindset',
    other:    'badge-other'
  };

  // Return the matching class, or 'badge-other' if not found
  return classes[category] || 'badge-other';
}


// ===========================================================
// FUNCTION 7: renderHabits()
//
// Clears the habit list on screen and re-builds it
// entirely from the habits array.
//
// This is called after EVERY change (add, delete, tick).
//
// Key DOM methods used:
//   innerHTML       → set or clear the HTML inside an element
//   createElement   → create a new HTML element in JavaScript
//   appendChild     → add a child element inside a parent
//   classList.add   → add a CSS class to an element
//   addEventListener → listen for user actions (clicks, etc.)
// ===========================================================

function renderHabits() {

  // Clear the list first — we rebuild it from scratch each time
  habitList.innerHTML = '';

  // If there are no habits yet, show a friendly message
  if (habits.length === 0) {
    habitList.innerHTML = '<p id="empty-message">No habits yet. Add one above! 🌱</p>';
    return; // stop the function here — nothing else to do
  }

  // Loop through every habit in the array and build a card for it
  habits.forEach(function(habit) {

    // --- Create the outer card div ---
    const card = document.createElement('div');
    card.classList.add('habit-card');

    // If this habit is done today, add the "done" CSS class
    // (this fades the card and adds strikethrough text)
    if (habit.doneToday) {
      card.classList.add('done');
    }

    // --- Create the checkbox ---
    const checkbox = document.createElement('input');
    checkbox.type    = 'checkbox';
    checkbox.checked = habit.doneToday; // already ticked if done
    checkbox.classList.add('habit-checkbox');

    // When the checkbox changes, call toggleDone with this habit's id
    checkbox.addEventListener('change', function() {
      toggleDone(habit.id);
    });

    // --- Create the info section (name, category, target) ---
    const info = document.createElement('div');
    info.classList.add('habit-info');

    // Get the right colour class for this category
    const badgeClass = getCategoryBadgeClass(habit.category);

    // Build the inner HTML for the info section
    info.innerHTML =
      '<div class="habit-name">' +
        habit.name +
        '<span class="category-badge ' + badgeClass + '">' +
          habit.category +
        '</span>' +
      '</div>' +
      '<div class="habit-meta">Target: ' + habit.target + ' days/week</div>';

    // --- Create the streak badge ---
    const streak = document.createElement('div');
    streak.classList.add('habit-streak');
    streak.textContent = '🔥 ' + habit.streak + ' day streak';

    // --- Create the delete button ---
    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = 'Delete';
    deleteBtn.classList.add('delete-btn');

    // When the delete button is clicked, call deleteHabit with this id
    deleteBtn.addEventListener('click', function() {
      deleteHabit(habit.id);
    });

    // --- Put the card together ---
    // Add each part INTO the card div
    card.appendChild(checkbox);
    card.appendChild(info);
    card.appendChild(streak);
    card.appendChild(deleteBtn);

    // Add the finished card INTO the habit list on the page
    habitList.appendChild(card);

  }); // end forEach loop

} // end renderHabits


// ===========================================================
// FUNCTION 8: updateSummary()
//
// Counts the totals and updates the summary bar at the top.
//
// .filter() is used to count only the "done" habits.
// Math.round() rounds a decimal to the nearest whole number.
// ===========================================================

function updateSummary() {

  // Total habits = how many items are in the array
  const total = habits.length;

  // Count how many habits have doneToday === true
  const doneHabits = habits.filter(function(habit) {
    return habit.doneToday === true;
  });
  const done = doneHabits.length;

  // Calculate the completion percentage
  // Guard against dividing by zero when there are no habits
  let percent = 0;
  if (total > 0) {
    percent = Math.round((done / total) * 100);
  }

  // Update the three numbers shown in the summary bar
  document.getElementById('total-count').textContent  = total;
  document.getElementById('done-count').textContent   = done;
  document.getElementById('percent-done').textContent = percent + '%';
}


// ===========================================================
// EVENT LISTENER: Form Submit
//
// An event listener waits for something to happen (an "event")
// and then runs a function in response.
//
// 'submit' fires when the user clicks "Add Habit" or presses Enter.
//
// event.preventDefault() stops the browser from refreshing the page
// (which is its default behaviour when a form is submitted).
// ===========================================================

form.addEventListener('submit', function(event) {
  event.preventDefault(); // stop the page from refreshing

  // Only add the habit if the form passes all validation checks
  if (validateForm()) {
    addHabit();
  }
});


// ===========================================================
// INITIAL RENDER
//
// When the page first loads, run these two functions so that
// the summary shows "0" and the empty-state message appears.
// ===========================================================

renderHabits();
updateSummary();
