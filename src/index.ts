interface StepBuilderConfig {
  startsFrom?: number;
  onStepChange?: () => void;
  progressBar?: string;
  prevButton?: string;
  nextButton?: string;
  stepClass?: string;
  activeClass?: string;
}

interface StepState {
  current: number;
  size: number;
  isLast: boolean;
  isFirst: boolean;
  hasPrev: boolean;
  hasNext: boolean;
  progress: number;
}

export class StepBuilder {
  private container!: HTMLElement;
  private steps: HTMLElement[] = [];
  private currentStep: number = 1;
  private config: Required<StepBuilderConfig>;
  private progressBar: HTMLElement | null = null;
  private prevButton: HTMLButtonElement | null = null;
  private nextButton: HTMLButtonElement | null = null;

  constructor(config: StepBuilderConfig = {}) {
    this.config = {
      startsFrom: config.startsFrom ?? 1,
      onStepChange: config.onStepChange ?? (() => {}),
      progressBar: config.progressBar ?? "#progress",
      prevButton: config.prevButton ?? "#prev-btn",
      nextButton: config.nextButton ?? "#next-btn",
      stepClass: config.stepClass ?? "step",
      activeClass: config.activeClass ?? "active",
    };
  }

  init(selector: string): StepBuilder {
    const container = document.querySelector(selector);
    if (!container) {
      throw new Error(`Container element not found: ${selector}`);
    }
    this.container = container as HTMLElement;

    this.steps = Array.from(this.container.children) as HTMLElement[];
    this.currentStep = this.config.startsFrom;
    this.progressBar = document.querySelector(this.config.progressBar);
    this.prevButton = document.querySelector<HTMLButtonElement>(
      this.config.prevButton
    );
    this.nextButton = document.querySelector<HTMLButtonElement>(
      this.config.nextButton
    );

    this.setupEventListeners();
    this.render();
    return this;
  }

  private setupEventListeners(): void {
    if (this.prevButton) {
      this.prevButton.addEventListener("click", () => this.prev());
    }
    if (this.nextButton) {
      this.nextButton.addEventListener("click", () => this.next());
    }
  }

  next(): void {
    if (this.currentStep < this.steps.length) {
      this.currentStep++;
      this.render();
      this.config.onStepChange();
    }
  }

  prev(): void {
    if (this.currentStep > 1) {
      this.currentStep--;
      this.render();
      this.config.onStepChange();
    }
  }

  jump(step: number): void {
    if (step >= 1 && step <= this.steps.length) {
      this.currentStep = step;
      this.render();
      this.config.onStepChange();
    }
  }

  getState(): StepState {
    return {
      current: this.currentStep,
      size: this.steps.length,
      isLast: this.currentStep === this.steps.length,
      isFirst: this.currentStep === 1,
      hasPrev: this.currentStep > 1,
      hasNext: this.currentStep < this.steps.length,
      progress: (this.currentStep - 1) / (this.steps.length - 1),
    };
  }

  private render(): void {
    const state = this.getState();

    // Update step visibility
    this.steps.forEach((step, index) => {
      if (index + 1 === this.currentStep) {
        step.classList.add(this.config.activeClass);
      } else {
        step.classList.remove(this.config.activeClass);
      }
    });

    // Update progress bar
    if (this.progressBar) {
      this.progressBar.style.width = `${state.progress * 100}%`;
    }

    // Update button states
    if (this.prevButton) {
      this.prevButton.disabled = !state.hasPrev;
    }
    if (this.nextButton) {
      this.nextButton.disabled = !state.hasNext;
    }
  }
}
