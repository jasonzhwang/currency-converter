import "@testing-library/jest-dom";

// Suppress specific noisy React act() deprecation & unwrapped update warnings while keeping other errors visible.
const originalError = console.error;
console.error = (...args) => {
  const first = args[0];
  if (typeof first === "string") {
    const suppressPatterns = [
      "ReactDOMTestUtils.act", // deprecation warning variants
      "not wrapped in act", // state update act hint
    ];
    if (suppressPatterns.some((p) => first.includes(p))) {
      return; // ignore known innocuous testing warnings
    }
  }
  originalError(...args);
};

// Mark environment as act-aware (React checks this flag); may reduce some warnings.
globalThis.IS_REACT_ACT_ENVIRONMENT = true;
