/**
 * Custom hook for validating currency amount input.
 * Ensures input is a non-empty positive number with only digits and optional decimal point.
 */

export function useInputValidation(inputValue: string) {
  const validate = (): boolean => {
    // Input must not be empty or just a decimal point
    if (!inputValue || inputValue === ".") {
      return false;
    }

    // Strict validation: only digits and at most one decimal point allowed
    // Allows: 123, 123.45, .5, 100.
    const validPattern = /^[0-9]*\.?[0-9]*$|^[0-9]+\.$|^\.[0-9]+$/;
    if (!validPattern.test(inputValue)) {
      return false;
    }

    // Parse and validate as positive number
    const num = parseFloat(inputValue);
    return !isNaN(num) && num > 0;
  };

  const isValid = validate();

  // Determine if error message should be shown
  // Show error only if input is non-empty but invalid
  const shouldShowError = !isValid && inputValue !== "" && inputValue !== ".";

  return {
    isValid,
    shouldShowError,
    validate,
  };
}
