const STORAGE_KEY = 'habits';

const state = {
    habits: []
};

function getLast7Days() {
    const days = [];
    const today = new Date();

    for (let i = 6; i >= 0; i--) {
        const date = new Date(today);
        date.setDate(today.getDate() - i);
        days.push({
            date: date.toISOString().split('T')[0],
            label: date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })
        });
    }

    return days;
}

function saveToLocalStorage() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state.habits));
}

function loadFromLocalStorage() {
    const data = localStorage.getItem(STORAGE_KEY);
    if (data) {
        state.habits = JSON.parse(data);
    }
}

function addHabit(description) {
    if (!description.trim()) return;

    const habit = {
        id: Date.now(),
        description: description.trim(),
        completions: {}
    };

    state.habits.push(habit);
    saveToLocalStorage();
    render();
}

function deleteHabit(id) {
    state.habits = state.habits.filter(h => h.id !== id);
    saveToLocalStorage();
    render();
}

function toggleDay(habitId, date) {
    const habit = state.habits.find(h => h.id === habitId);
    if (!habit) return;

    if (habit.completions[date]) {
        delete habit.completions[date];
    } else {
        habit.completions[date] = true;
    }

    saveToLocalStorage();
}

function createHabitElement(habit) {
    const days = getLast7Days();

    const habitDiv = document.createElement('div');
    habitDiv.className = 'habit-item';

    const header = document.createElement('div');
    header.className = 'habit-header';

    const name = document.createElement('span');
    name.className = 'habit-name';
    name.textContent = habit.description;

    const deleteBtn = document.createElement('button');
    deleteBtn.className = 'delete-btn';
    deleteBtn.textContent = 'Delete';
    deleteBtn.onclick = () => deleteHabit(habit.id);

    header.appendChild(name);
    header.appendChild(deleteBtn);

    const daysGrid = document.createElement('div');
    daysGrid.className = 'days-grid';

    days.forEach(day => {
        const dayItem = document.createElement('div');
        dayItem.className = 'day-item';

        const label = document.createElement('span');
        label.className = 'day-label';
        label.textContent = day.label;

        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.className = 'day-checkbox';
        checkbox.checked = !!habit.completions[day.date];
        checkbox.onchange = () => toggleDay(habit.id, day.date);

        dayItem.appendChild(label);
        dayItem.appendChild(checkbox);
        daysGrid.appendChild(dayItem);
    });

    habitDiv.appendChild(header);
    habitDiv.appendChild(daysGrid);

    return habitDiv;
}

function render() {
    const habitList = document.getElementById('habitList');
    habitList.innerHTML = '';

    if (state.habits.length === 0) {
        const empty = document.createElement('div');
        empty.className = 'empty-state';
        empty.textContent = 'No habits yet. Add your first habit above!';
        habitList.appendChild(empty);
        return;
    }

    state.habits.forEach(habit => {
        habitList.appendChild(createHabitElement(habit));
    });
}

function init() {
    loadFromLocalStorage();
    render();

    const addBtn = document.getElementById('addHabitBtn');
    const input = document.getElementById('habitInput');

    addBtn.onclick = () => {
        addHabit(input.value);
        input.value = '';
    };

    input.onkeypress = (e) => {
        if (e.key === 'Enter') {
            addHabit(input.value);
            input.value = '';
        }
    };
}

document.addEventListener('DOMContentLoaded', init);
