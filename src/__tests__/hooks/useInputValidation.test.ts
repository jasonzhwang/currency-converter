import { renderHook } from "@testing-library/react";
import { useInputValidation } from "@/hooks/useInputValidation";

describe("useInputValidation", () => {
  test("returns isValid true for valid positive number", () => {
    const { result } = renderHook(() => useInputValidation("123.45"));
    expect(result.current.isValid).toBe(true);
    expect(result.current.shouldShowError).toBe(false);
  });

  test("returns isValid true for whole number", () => {
    const { result } = renderHook(() => useInputValidation("500"));
    expect(result.current.isValid).toBe(true);
    expect(result.current.shouldShowError).toBe(false);
  });

  test("returns isValid true for decimal number", () => {
    const { result } = renderHook(() => useInputValidation("99.99"));
    expect(result.current.isValid).toBe(true);
    expect(result.current.shouldShowError).toBe(false);
  });

  test("returns isValid false for empty input and shouldShowError false", () => {
    const { result } = renderHook(() => useInputValidation(""));
    expect(result.current.isValid).toBe(false);
    expect(result.current.shouldShowError).toBe(false);
  });

  test("returns isValid false for zero", () => {
    const { result } = renderHook(() => useInputValidation("0"));
    expect(result.current.isValid).toBe(false);
    expect(result.current.shouldShowError).toBe(true);
  });

  test("returns isValid false for decimal point only", () => {
    const { result } = renderHook(() => useInputValidation("."));
    expect(result.current.isValid).toBe(false);
    expect(result.current.shouldShowError).toBe(false);
  });

  test("returns isValid false for negative numbers", () => {
    const { result } = renderHook(() => useInputValidation("-50"));
    expect(result.current.isValid).toBe(false);
    expect(result.current.shouldShowError).toBe(true);
  });

  test("returns isValid false for numbers with letters", () => {
    const { result } = renderHook(() => useInputValidation("123abc"));
    expect(result.current.isValid).toBe(false);
    expect(result.current.shouldShowError).toBe(true);
  });

  test("returns isValid false for special characters", () => {
    const { result } = renderHook(() => useInputValidation("100@50"));
    expect(result.current.isValid).toBe(false);
    expect(result.current.shouldShowError).toBe(true);
  });

  test("returns isValid false for multiple decimal points", () => {
    const { result } = renderHook(() => useInputValidation("99.99.99"));
    expect(result.current.isValid).toBe(false);
    expect(result.current.shouldShowError).toBe(true);
  });

  test("returns isValid true for leading decimal", () => {
    const { result } = renderHook(() => useInputValidation(".5"));
    expect(result.current.isValid).toBe(true);
    expect(result.current.shouldShowError).toBe(false);
  });

  test("returns isValid true for trailing decimal", () => {
    const { result } = renderHook(() => useInputValidation("100."));
    expect(result.current.isValid).toBe(true);
    expect(result.current.shouldShowError).toBe(false);
  });

  test("returns isValid false for spaces", () => {
    const { result } = renderHook(() => useInputValidation("100 50"));
    expect(result.current.isValid).toBe(false);
    expect(result.current.shouldShowError).toBe(true);
  });

  test("returns isValid true for very small decimal", () => {
    const { result } = renderHook(() => useInputValidation("0.0001"));
    expect(result.current.isValid).toBe(true);
    expect(result.current.shouldShowError).toBe(false);
  });

  test("returns isValid true for large number", () => {
    const { result } = renderHook(() => useInputValidation("999999999.9999"));
    expect(result.current.isValid).toBe(true);
    expect(result.current.shouldShowError).toBe(false);
  });

  test("validates method works correctly", () => {
    const { result } = renderHook(() => useInputValidation("123.45"));
    expect(typeof result.current.validate).toBe("function");
    expect(result.current.validate()).toBe(true);
  });

  test("shouldShowError is false when input is invalid but empty", () => {
    const { result } = renderHook(() => useInputValidation(""));
    expect(result.current.isValid).toBe(false);
    expect(result.current.shouldShowError).toBe(false);
  });

  test("shouldShowError is true when input is invalid and non-empty", () => {
    const { result } = renderHook(() => useInputValidation("abc"));
    expect(result.current.isValid).toBe(false);
    expect(result.current.shouldShowError).toBe(true);
  });
});
