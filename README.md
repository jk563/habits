# Habit Tracker

A minimal vanilla JavaScript habit tracking application with local storage persistence.

## Architecture

**Single-Page Application (SPA)** with no external dependencies. All code runs client-side in the browser.

### File Structure
```
├── index.html      # Application shell and structure
├── styles.css      # Minimal, performance-focused styling
└── app.js          # Core application logic
```

## Design Patterns

### State Management
- **Single Source of Truth**: Global `state` object holds all habits
- **Unidirectional Data Flow**: State changes trigger re-renders
- **Immutability on Delete**: Uses `filter()` to create new arrays

### Persistence
- **LocalStorage API**: Synchronous persistence with automatic serialization
- **Lazy Loading**: Data loaded once on initialization
- **Eager Saving**: State persisted immediately on every change

### Rendering
- **Functional Rendering**: Pure functions create DOM elements from state
- **Full Re-render Strategy**: Entire habit list re-rendered on state changes (acceptable for small datasets)
- **Event Delegation Alternative**: Direct event handlers on elements for simplicity

## Key Features

### Habit Management
- Add habits with text descriptions
- Delete habits with confirmation-free removal
- Persistent storage across browser sessions

### Daily Tracking
- Last 7 days displayed with labels (e.g., "Mon Jan 1")
- Checkbox per day for completion tracking
- Date-keyed completion data using ISO format (YYYY-MM-DD)

### Data Model
```javascript
{
  id: timestamp,              // Unique identifier
  description: string,        // Habit name
  completions: {              // Sparse object for checked days
    "2026-01-05": true,
    "2026-01-03": true
  }
}
```

## Performance Considerations

- No framework overhead (~150 lines of code)
- Direct DOM manipulation (no virtual DOM diffing)
- Event handlers bound only to necessary elements
- LocalStorage operations synchronous but minimal
- CSS Grid for efficient layout with minimal calculations

## Usage

Open `index.html` in any modern browser. No build process or server required.

## Future Enhancements

- Backend persistence (currently local-only)
- Cloud hosting
- Multi-device synchronization
- Habit streaks and statistics
