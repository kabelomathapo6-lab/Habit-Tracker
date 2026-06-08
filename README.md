# Habit Tracker

# What This Project Does

A single-page web app where a user can:
- Add daily habits with a name, target days per week, and a category
- Mark habits as done today using a checkbox
- Track a streak count for each habit
- Delete habits they no longer need
- See a live summary of total habits, how many are done today, and the overall completion percentage

---

# File Structure

```
habit-tracker/
 index.html   
 styles.css  
 script.js    
```

---

# How the Code Works

# 1. index.html- The Structure
The HTML is split into three sections:
- *Summary bar* displays total habits, done count, and completion %
- *Form*  three inputs (name, target, category) and a submit button
- *Habit list*  starts empty; JavaScript fills it in dynamically

The `<link>` tag connects the CSS file and the `<script>` tag at the bottom connects the JavaScript file.

---

# 2. styles.css — The Styling
Key styling decisions:
- *Cards*: each habit displays as a white rounded card with a shadow
- *Done state*: ticked habits fade to 55% opacity and the name gets a strikethrough
- *Error messages*: shown in red with a light red background so they stand out clearly
- *Category badges*: each category has its own colour (green, orange, blue, purple, grey)
- *Buttons*: green Add button, red Delete button, with hover effects

---

# 3. script.js — The JavaScript Logic

# The Data
All habits are stored in one array of objects the single source of truth:
```js
let habits = [];
```
Each habit object looks like this:
```js
{
  id:        1,
  name:      "Drink water",
  category:  "health",
  target:    7,
  streak:    0,
  doneToday: false
}
```

# The Functions

 Function  What it does 

| `validateForm()` | Checks name ≥ 3 chars, target is 1–7, category is selected |
| `addHabit()` | Creates a new habit object and pushes it into the array |
| `deleteHabit(id)` | Uses `.filter()` to remove a habit by its ID |
| `toggleDone(id)` | Flips `doneToday` true/false and adjusts the streak |
| `renderHabits()` | Clears the list and rebuilds every card from the array |
| `updateSummary()` | Recounts totals and updates the summary bar |

# The Flow
Every time something changes, the same two steps happen:
```
Update the array → renderHabits() + updateSummary()
```
This keeps the page always in sync with the data.

# JavaScript Concepts Used

| Concept  Where it appears 

| Variables & data types | Habit objects, counts, the `doneToday` flag |
| Operators | Streak counting, percentage calculation |
| Functions | `addHabit`, `renderHabits`, `updateSummary`, `deleteHabit`, `validateForm` |
| Arrays | `habits` array; `.push()`, `.filter()`, `.forEach()` |
| Conditions | Validation checks, streak logic |
| Loops | `.forEach()` to build the list and total the summary |
| DOM manipulation | `createElement`, `appendChild`, `innerHTML`, `textContent` |
| Event handling | Form submit, checkbox toggle, delete button clicks |
| Form validation | Name length, number range, category selection |



