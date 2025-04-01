# js-step-builder

A lightweight, framework-agnostic step builder for JavaScript.

## Features

- Simple and intuitive API
- Progress tracking
- Customizable styling
- Framework agnostic
- TypeScript support
- Event handling
- Responsive design

## Installation

```bash
npm install js-step-builder
```

## Usage

```javascript
import { StepBuilder } from "js-step-builder";

const stepBuilder = new StepBuilder({
  startsFrom: 1,
  onStepChange: () => {
    console.log("Step changed!");
  },
}).init("#steps");
```

## Demo

Check out the live demo at: [https://sametweb.github.io/js-step-builder/](https://sametweb.github.io/js-step-builder/)

The demo showcases:

- Multi-step form with validation
- Progress tracking
- Form data collection
- Summary view
- Responsive design
- Modern styling

## API

### Constructor Options

```typescript
interface StepBuilderConfig {
  startsFrom?: number; // Starting step number (default: 1)
  onStepChange?: () => void; // Callback when step changes
  progressBar?: string; // Progress bar selector (default: "#progress")
  prevButton?: string; // Previous button selector (default: "#prev-btn")
  nextButton?: string; // Next button selector (default: "#next-btn")
  stepClass?: string; // Step element class (default: "step")
  activeClass?: string; // Active step class (default: "active")
}
```

### Methods

- `init(selector: string): StepBuilder` - Initialize the step builder
- `next(): void` - Move to next step
- `prev(): void` - Move to previous step
- `jump(step: number): void` - Jump to specific step
- `getState(): StepState` - Get current state

### State Object

```typescript
interface StepState {
  current: number; // Current step number
  size: number; // Total number of steps
  isLast: boolean; // Is current step the last step
  isFirst: boolean; // Is current step the first step
  hasPrev: boolean; // Can move to previous step
  hasNext: boolean; // Can move to next step
  progress: number; // Progress percentage (0-1)
}
```

## License

MIT
