let habits = []; 

let nextId = 1;


const form          = document.getElementById('habit-form');
const nameInput     = document.getElementById('habit-name');
const targetInput   = document.getElementById('habit-target');
const categoryInput = document.getElementById('habit-category');
const errorBox      = document.getElementById('error-message');
const habitList     = document.getElementById('habit-list');


function showError(message) {
  errorBox.textContent  = message;   
  errorBox.style.display = 'block';   
}

function hideError() {
  errorBox.textContent  = '';
  errorBox.style.display = 'none';    
}


function validateForm() {


  const name     = nameInput.value.trim();
  const target   = Number(targetInput.value); 
  const category = categoryInput.value;


  if (name.length < 3) {
    showError('Habit name must be at least 3 characters long.');
    return false; 
  }

  if (!Number.isInteger(target) || target < 1 || target > 7) {
    showError('Target must be a whole number between 1 and 7.');
    return false;
  }


  if (category === '') {
    showError('Please select a category.');
    return false;
  }

 
  hideError();
  return true; 
}


function addHabit() {

  const name     = nameInput.value.trim();
  const target   = Number(targetInput.value);
  const category = categoryInput.value;

  const newHabit = {
    id:        nextId,   
    name:      name,      
    category:  category, 
    target:    target,   
    streak:    0,         
    doneToday: false      
  };

  habits.push(newHabit);

  nextId = nextId + 1;

  nameInput.value     = '';
  targetInput.value   = '';
  categoryInput.value = '';


  renderHabits();
  updateSummary();
}

function deleteHabit(id) {

  habits = habits.filter(function(habit) {
    return habit.id !== id; 
  });

  renderHabits();
  updateSummary();
}


function toggleDone(id) {

  habits.forEach(function(habit) {

    if (habit.id === id) {

      habit.doneToday = !habit.doneToday;

    
      if (habit.doneToday === true) {

        habit.streak = habit.streak + 1;
      } else {

        habit.streak = habit.streak - 1;

        if (habit.streak < 0) {
          habit.streak = 0;
        }
      }
    }

  });


  renderHabits();
  updateSummary();
}

function getCategoryBadgeClass(category) {

  const classes = {
    health:   'badge-health',
    fitness:  'badge-fitness',
    learning: 'badge-learning',
    mindset:  'badge-mindset',
    other:    'badge-other'
  };


  return classes[category] || 'badge-other';
}


function renderHabits() {

  habitList.innerHTML = '';

  if (habits.length === 0) {
    habitList.innerHTML = '<p id="empty-message">No habits yet. Add one above! 🌱</p>';
    return; 
  }


  habits.forEach(function(habit) {

   
    const card = document.createElement('div');
    card.classList.add('habit-card');

    if (habit.doneToday) {
      card.classList.add('done');
    }

    const checkbox = document.createElement('input');
    checkbox.type    = 'checkbox';
    checkbox.checked = habit.doneToday;
    checkbox.classList.add('habit-checkbox');

    checkbox.addEventListener('change', function() {
      toggleDone(habit.id);
    });

    const info = document.createElement('div');
    info.classList.add('habit-info');

  
    const badgeClass = getCategoryBadgeClass(habit.category);

 
    info.innerHTML =
      '<div class="habit-name">' +
        habit.name +
        '<span class="category-badge ' + badgeClass + '">' +
          habit.category +
        '</span>' +
      '</div>' +
      '<div class="habit-meta">Target: ' + habit.target + ' days/week</div>';

    const streak = document.createElement('div');
    streak.classList.add('habit-streak');
    streak.textContent = '🔥 ' + habit.streak + ' day streak';

    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = 'Delete';
    deleteBtn.classList.add('delete-btn');

    deleteBtn.addEventListener('click', function() {
      deleteHabit(habit.id);
    });

    card.appendChild(checkbox);
    card.appendChild(info);
    card.appendChild(streak);
    card.appendChild(deleteBtn);

    habitList.appendChild(card);

  }); 

} 

function updateSummary() {

  const total = habits.length;

  const doneHabits = habits.filter(function(habit) {
    return habit.doneToday === true;
  });
  const done = doneHabits.length;

  let percent = 0;
  if (total > 0) {
    percent = Math.round((done / total) * 100);
  }

  document.getElementById('total-count').textContent  = total;
  document.getElementById('done-count').textContent   = done;
  document.getElementById('percent-done').textContent = percent + '%';
}


form.addEventListener('submit', function(event) {
  event.preventDefault(); 

  if (validateForm()) {
    addHabit();
  }
});

renderHabits();
updateSummary();
