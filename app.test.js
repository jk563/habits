import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
  STORAGE_KEY,
  state,
  getLast7Days,
  saveToLocalStorage,
  loadFromLocalStorage,
  addHabit,
  deleteHabit,
  toggleDay,
  createHabitElement,
  render
} from './app.js';

describe('getLast7Days', () => {
  it('should return an array of 7 days', () => {
    // Arrange & Act
    const days = getLast7Days();

    // Assert
    expect(days).toHaveLength(7);
  });

  it('should return days in ascending chronological order', () => {
    // Arrange & Act
    const days = getLast7Days();

    // Assert
    for (let i = 0; i < days.length - 1; i++) {
      const currentDate = new Date(days[i].date);
      const nextDate = new Date(days[i + 1].date);
      expect(currentDate.getTime()).toBeLessThan(nextDate.getTime());
    }
  });

  it('should include today as the last day', () => {
    // Arrange
    const today = new Date().toISOString().split('T')[0];

    // Act
    const days = getLast7Days();

    // Assert
    expect(days[6].date).toBe(today);
  });

  it('should return days with date and label properties', () => {
    // Arrange & Act
    const days = getLast7Days();

    // Assert
    days.forEach(day => {
      expect(day).toHaveProperty('date');
      expect(day).toHaveProperty('label');
      expect(typeof day.date).toBe('string');
      expect(typeof day.label).toBe('string');
    });
  });
});

describe('saveToLocalStorage', () => {
  beforeEach(() => {
    // Arrange - Clear localStorage before each test
    localStorage.clear();
    state.habits = [];
  });

  it('should save habits to localStorage', () => {
    // Arrange
    const testHabits = [
      { id: 1, description: 'Exercise', completions: {} }
    ];
    state.habits = testHabits;

    // Act
    saveToLocalStorage();

    // Assert
    const saved = localStorage.getItem(STORAGE_KEY);
    expect(saved).toBe(JSON.stringify(testHabits));
  });

  it('should save empty array when no habits exist', () => {
    // Arrange
    state.habits = [];

    // Act
    saveToLocalStorage();

    // Assert
    const saved = localStorage.getItem(STORAGE_KEY);
    expect(saved).toBe('[]');
  });

  it('should save multiple habits correctly', () => {
    // Arrange
    const testHabits = [
      { id: 1, description: 'Exercise', completions: { '2026-01-01': true } },
      { id: 2, description: 'Read', completions: {} },
      { id: 3, description: 'Meditate', completions: { '2026-01-02': true } }
    ];
    state.habits = testHabits;

    // Act
    saveToLocalStorage();

    // Assert
    const saved = localStorage.getItem(STORAGE_KEY);
    expect(JSON.parse(saved)).toEqual(testHabits);
  });
});

describe('loadFromLocalStorage', () => {
  beforeEach(() => {
    // Arrange - Clear state and localStorage before each test
    localStorage.clear();
    state.habits = [];
  });

  it('should load habits from localStorage', () => {
    // Arrange
    const testHabits = [
      { id: 1, description: 'Exercise', completions: {} }
    ];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(testHabits));

    // Act
    loadFromLocalStorage();

    // Assert
    expect(state.habits).toEqual(testHabits);
  });

  it('should handle empty localStorage gracefully', () => {
    // Arrange - localStorage is already empty from beforeEach

    // Act
    loadFromLocalStorage();

    // Assert
    expect(state.habits).toEqual([]);
  });

  it('should load multiple habits correctly', () => {
    // Arrange
    const testHabits = [
      { id: 1, description: 'Exercise', completions: { '2026-01-01': true } },
      { id: 2, description: 'Read', completions: {} }
    ];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(testHabits));

    // Act
    loadFromLocalStorage();

    // Assert
    expect(state.habits).toHaveLength(2);
    expect(state.habits).toEqual(testHabits);
  });
});

describe('addHabit', () => {
  beforeEach(() => {
    // Arrange - Reset state and mock DOM
    localStorage.clear();
    state.habits = [];
    document.body.innerHTML = '<div id="habitList"></div>';
  });

  it('should add a new habit to state', () => {
    // Arrange
    const description = 'Exercise daily';

    // Act
    addHabit(description);

    // Assert
    expect(state.habits).toHaveLength(1);
    expect(state.habits[0].description).toBe(description);
  });

  it('should not add habit with empty description', () => {
    // Arrange
    const emptyDescriptions = ['', '   ', '\t', '\n'];

    // Act & Assert
    emptyDescriptions.forEach(desc => {
      const initialLength = state.habits.length;
      addHabit(desc);
      expect(state.habits).toHaveLength(initialLength);
    });
  });

  it('should trim whitespace from description', () => {
    // Arrange
    const description = '  Exercise daily  ';

    // Act
    addHabit(description);

    // Assert
    expect(state.habits[0].description).toBe('Exercise daily');
  });

  it('should create habit with unique id', () => {
    // Arrange & Act
    addHabit('Habit 1');
    addHabit('Habit 2');

    // Assert
    expect(state.habits[0].id).not.toBe(state.habits[1].id);
  });

  it('should create habit with empty completions object', () => {
    // Arrange & Act
    addHabit('Exercise');

    // Assert
    expect(state.habits[0].completions).toEqual({});
  });

  it('should save to localStorage after adding', () => {
    // Arrange
    const description = 'Exercise';

    // Act
    addHabit(description);

    // Assert
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
    expect(saved).toHaveLength(1);
    expect(saved[0].description).toBe(description);
  });
});

describe('deleteHabit', () => {
  beforeEach(() => {
    // Arrange - Reset state and mock DOM
    localStorage.clear();
    state.habits = [];
    document.body.innerHTML = '<div id="habitList"></div>';
  });

  it('should remove habit from state', () => {
    // Arrange
    state.habits = [
      { id: 1, description: 'Exercise', completions: {} },
      { id: 2, description: 'Read', completions: {} }
    ];

    // Act
    deleteHabit(1);

    // Assert
    expect(state.habits).toHaveLength(1);
    expect(state.habits[0].id).toBe(2);
  });

  it('should not modify state when habit id does not exist', () => {
    // Arrange
    state.habits = [
      { id: 1, description: 'Exercise', completions: {} }
    ];

    // Act
    deleteHabit(999);

    // Assert
    expect(state.habits).toHaveLength(1);
  });

  it('should save to localStorage after deleting', () => {
    // Arrange
    state.habits = [
      { id: 1, description: 'Exercise', completions: {} },
      { id: 2, description: 'Read', completions: {} }
    ];

    // Act
    deleteHabit(1);

    // Assert
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
    expect(saved).toHaveLength(1);
    expect(saved[0].id).toBe(2);
  });
});

describe('toggleDay', () => {
  beforeEach(() => {
    // Arrange - Reset state
    localStorage.clear();
    state.habits = [];
  });

  it('should mark day as completed when not already completed', () => {
    // Arrange
    state.habits = [
      { id: 1, description: 'Exercise', completions: {} }
    ];
    const date = '2026-01-01';

    // Act
    toggleDay(1, date);

    // Assert
    expect(state.habits[0].completions[date]).toBe(true);
  });

  it('should mark day as incomplete when already completed', () => {
    // Arrange
    state.habits = [
      { id: 1, description: 'Exercise', completions: { '2026-01-01': true } }
    ];
    const date = '2026-01-01';

    // Act
    toggleDay(1, date);

    // Assert
    expect(state.habits[0].completions[date]).toBeUndefined();
  });

  it('should toggle day multiple times correctly', () => {
    // Arrange
    state.habits = [
      { id: 1, description: 'Exercise', completions: {} }
    ];
    const date = '2026-01-01';

    // Act & Assert
    toggleDay(1, date);
    expect(state.habits[0].completions[date]).toBe(true);

    toggleDay(1, date);
    expect(state.habits[0].completions[date]).toBeUndefined();

    toggleDay(1, date);
    expect(state.habits[0].completions[date]).toBe(true);
  });

  it('should not modify state when habit does not exist', () => {
    // Arrange
    state.habits = [
      { id: 1, description: 'Exercise', completions: {} }
    ];
    const initialCompletions = { ...state.habits[0].completions };

    // Act
    toggleDay(999, '2026-01-01');

    // Assert
    expect(state.habits[0].completions).toEqual(initialCompletions);
  });

  it('should save to localStorage after toggling', () => {
    // Arrange
    state.habits = [
      { id: 1, description: 'Exercise', completions: {} }
    ];
    const date = '2026-01-01';

    // Act
    toggleDay(1, date);

    // Assert
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
    expect(saved[0].completions[date]).toBe(true);
  });
});

describe('createHabitElement', () => {
  beforeEach(() => {
    // Arrange - Mock DOM environment
    document.body.innerHTML = '';
  });

  it('should create a habit element with correct structure', () => {
    // Arrange
    const habit = {
      id: 1,
      description: 'Exercise',
      completions: {}
    };

    // Act
    const element = createHabitElement(habit);

    // Assert
    expect(element.className).toBe('habit-item');
    expect(element.querySelector('.habit-header')).not.toBeNull();
    expect(element.querySelector('.habit-name')).not.toBeNull();
    expect(element.querySelector('.delete-btn')).not.toBeNull();
    expect(element.querySelector('.days-grid')).not.toBeNull();
  });

  it('should display habit description correctly', () => {
    // Arrange
    const habit = {
      id: 1,
      description: 'Exercise daily',
      completions: {}
    };

    // Act
    const element = createHabitElement(habit);

    // Assert
    const nameElement = element.querySelector('.habit-name');
    expect(nameElement.textContent).toBe('Exercise daily');
  });

  it('should create 7 day checkboxes', () => {
    // Arrange
    const habit = {
      id: 1,
      description: 'Exercise',
      completions: {}
    };

    // Act
    const element = createHabitElement(habit);

    // Assert
    const checkboxes = element.querySelectorAll('.day-checkbox');
    expect(checkboxes).toHaveLength(7);
  });

  it('should check completed days', () => {
    // Arrange
    const today = new Date().toISOString().split('T')[0];
    const habit = {
      id: 1,
      description: 'Exercise',
      completions: { [today]: true }
    };

    // Act
    const element = createHabitElement(habit);

    // Assert
    const checkboxes = element.querySelectorAll('.day-checkbox');
    const checkedCount = Array.from(checkboxes).filter(cb => cb.checked).length;
    expect(checkedCount).toBeGreaterThan(0);
  });

  it('should leave uncompleted days unchecked', () => {
    // Arrange
    const habit = {
      id: 1,
      description: 'Exercise',
      completions: {}
    };

    // Act
    const element = createHabitElement(habit);

    // Assert
    const checkboxes = element.querySelectorAll('.day-checkbox');
    const checkedCount = Array.from(checkboxes).filter(cb => cb.checked).length;
    expect(checkedCount).toBe(0);
  });
});

describe('render', () => {
  beforeEach(() => {
    // Arrange - Reset state and DOM
    state.habits = [];
    document.body.innerHTML = '<div id="habitList"></div>';
  });

  it('should display empty state when no habits exist', () => {
    // Arrange
    state.habits = [];

    // Act
    render();

    // Assert
    const habitList = document.getElementById('habitList');
    expect(habitList.querySelector('.empty-state')).not.toBeNull();
    expect(habitList.textContent).toContain('No habits yet');
  });

  it('should render all habits', () => {
    // Arrange
    state.habits = [
      { id: 1, description: 'Exercise', completions: {} },
      { id: 2, description: 'Read', completions: {} },
      { id: 3, description: 'Meditate', completions: {} }
    ];

    // Act
    render();

    // Assert
    const habitList = document.getElementById('habitList');
    const habitItems = habitList.querySelectorAll('.habit-item');
    expect(habitItems).toHaveLength(3);
  });

  it('should clear previous content before rendering', () => {
    // Arrange
    const habitList = document.getElementById('habitList');
    habitList.innerHTML = '<div>Old content</div>';
    state.habits = [
      { id: 1, description: 'Exercise', completions: {} }
    ];

    // Act
    render();

    // Assert
    expect(habitList.textContent).not.toContain('Old content');
    expect(habitList.querySelectorAll('.habit-item')).toHaveLength(1);
  });

  it('should not show empty state when habits exist', () => {
    // Arrange
    state.habits = [
      { id: 1, description: 'Exercise', completions: {} }
    ];

    // Act
    render();

    // Assert
    const habitList = document.getElementById('habitList');
    expect(habitList.querySelector('.empty-state')).toBeNull();
  });
});
