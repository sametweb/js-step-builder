import { StepBuilder } from "../index";

describe("StepBuilder", () => {
  let container: HTMLElement;
  let stepBuilder: StepBuilder;
  let onStepChangeMock: jest.Mock;

  beforeEach(() => {
    container = document.createElement("div");
    container.id = "step-container";

    // Create three steps
    for (let i = 0; i < 3; i++) {
      const step = document.createElement("div");
      step.className = "step";
      container.appendChild(step);
    }

    document.body.appendChild(container);

    // Create navigation buttons
    const prevButton = document.createElement("button");
    prevButton.id = "prev-btn";
    document.body.appendChild(prevButton);

    const nextButton = document.createElement("button");
    nextButton.id = "next-btn";
    document.body.appendChild(nextButton);

    // Create progress bar
    const progressBar = document.createElement("div");
    progressBar.id = "progress";
    document.body.appendChild(progressBar);

    onStepChangeMock = jest.fn();
    stepBuilder = new StepBuilder({
      onStepChange: onStepChangeMock,
    });
    stepBuilder.init("#step-container");
  });

  afterEach(() => {
    document.body.innerHTML = "";
    jest.clearAllMocks();
  });

  test("initializes with correct default values", () => {
    const state = stepBuilder.getState();
    expect(state.current).toBe(1);
    expect(state.size).toBe(3);
    expect(state.isFirst).toBe(true);
    expect(state.isLast).toBe(false);
    expect(state.hasPrev).toBe(false);
    expect(state.hasNext).toBe(true);
    expect(state.progress).toBe(0);
  });

  test("initializes with custom start step", () => {
    const customStepBuilder = new StepBuilder({ startsFrom: 2 });
    customStepBuilder.init("#step-container");
    const state = customStepBuilder.getState();
    expect(state.current).toBe(2);
    expect(state.isFirst).toBe(false);
    expect(state.hasPrev).toBe(true);
  });

  test("moves to next step correctly", () => {
    stepBuilder.next();
    const state = stepBuilder.getState();
    expect(state.current).toBe(2);
    expect(state.isFirst).toBe(false);
    expect(state.hasPrev).toBe(true);
    expect(state.hasNext).toBe(true);
  });

  test("does not move past last step", () => {
    stepBuilder.jump(3);
    stepBuilder.next();
    const state = stepBuilder.getState();
    expect(state.current).toBe(3);
    expect(state.isLast).toBe(true);
  });

  test("moves to previous step correctly", () => {
    stepBuilder.next();
    stepBuilder.prev();
    const state = stepBuilder.getState();
    expect(state.current).toBe(1);
    expect(state.isFirst).toBe(true);
    expect(state.hasPrev).toBe(false);
    expect(state.hasNext).toBe(true);
  });

  test("does not move before first step", () => {
    stepBuilder.prev();
    const state = stepBuilder.getState();
    expect(state.current).toBe(1);
    expect(state.isFirst).toBe(true);
  });

  test("jumps to specific step correctly", () => {
    stepBuilder.jump(3);
    const state = stepBuilder.getState();
    expect(state.current).toBe(3);
    expect(state.isLast).toBe(true);
    expect(state.hasPrev).toBe(true);
    expect(state.hasNext).toBe(false);
  });

  test("calls onStepChange callback", () => {
    stepBuilder.next();
    expect(onStepChangeMock).toHaveBeenCalled();

    stepBuilder.prev();
    expect(onStepChangeMock).toHaveBeenCalledTimes(2);

    stepBuilder.jump(3);
    expect(onStepChangeMock).toHaveBeenCalledTimes(3);
  });

  test("handles invalid step numbers", () => {
    // Try to jump to an invalid step (too high)
    stepBuilder.jump(4);
    expect(stepBuilder.getState().current).toBe(1);

    // Try to jump to an invalid step (too low)
    stepBuilder.jump(0);
    expect(stepBuilder.getState().current).toBe(1);

    // Try to jump to a negative step
    stepBuilder.jump(-1);
    expect(stepBuilder.getState().current).toBe(1);
  });

  test("throws error when container not found", () => {
    expect(() => {
      new StepBuilder().init("#non-existent");
    }).toThrow("Container element not found: #non-existent");
  });

  test("updates progress bar correctly", () => {
    const progressBar = document.querySelector("#progress") as HTMLElement;

    stepBuilder.next();
    expect(progressBar.style.width).toBe("50%");

    stepBuilder.next();
    expect(progressBar.style.width).toBe("100%");

    stepBuilder.prev();
    expect(progressBar.style.width).toBe("50%");
  });

  test("handles missing optional elements", () => {
    document.body.innerHTML = "";
    container = document.createElement("div");
    container.id = "step-container";
    for (let i = 0; i < 3; i++) {
      const step = document.createElement("div");
      container.appendChild(step);
    }
    document.body.appendChild(container);

    const builder = new StepBuilder();
    expect(() => {
      builder.init("#step-container");
    }).not.toThrow();
  });
});
