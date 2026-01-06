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

### Local Development

Open `index.html` in any modern browser. No build process or server required.

### Production

The application is deployed to AWS and available at: **https://habits.jamiekelly.com**

## Deployment

### Infrastructure

The application is hosted as a static site on AWS with the following architecture:

- **S3 Bucket** (eu-west-2): Static file storage
- **CloudFront**: Global CDN with HTTPS
- **ACM Certificate**: SSL/TLS encryption
- **Route53**: DNS management

See [infrastructure/README.md](infrastructure/README.md) for detailed setup instructions.

### Automatic Deployment

Changes pushed to the `main` branch automatically deploy to production via GitHub Actions:

1. Files sync to S3 bucket
2. CloudFront cache invalidated
3. Changes live in ~2-3 minutes

### Manual Deployment

Trigger deployment manually from GitHub Actions → "Deploy to AWS" workflow.

## Testing

Run unit tests with Vitest:

```bash
npm install
npm test
```

## Future Enhancements

- Multi-device synchronization
- Habit streaks and statistics
- Data export functionality
- Mobile app version
