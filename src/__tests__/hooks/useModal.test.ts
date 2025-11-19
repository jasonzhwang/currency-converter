import { renderHook, act } from "@testing-library/react";
import { useModal } from "@/hooks/useModal";

describe("useModal", () => {
  test("initializes with default empty value", () => {
    const { result } = renderHook(() => useModal());

    expect(result.current.isOpen).toBe(false);
    expect(result.current.inputValue).toBe("");
  });

  test("initializes with custom initial value", () => {
    const { result } = renderHook(() => useModal("100"));

    expect(result.current.isOpen).toBe(false);
    expect(result.current.inputValue).toBe("100");
  });

  test("opens modal without changing value", () => {
    const { result } = renderHook(() => useModal("initial"));

    act(() => {
      result.current.open();
    });

    expect(result.current.isOpen).toBe(true);
    expect(result.current.inputValue).toBe("initial");
  });

  test("opens modal and sets new value", () => {
    const { result } = renderHook(() => useModal("100"));

    act(() => {
      result.current.open("200");
    });

    expect(result.current.isOpen).toBe(true);
    expect(result.current.inputValue).toBe("200");
  });

  test("opens modal with undefined value keeps previous value", () => {
    const { result } = renderHook(() => useModal("50"));

    act(() => {
      result.current.open(undefined);
    });

    expect(result.current.isOpen).toBe(true);
    expect(result.current.inputValue).toBe("50");
  });

  test("closes modal", () => {
    const { result } = renderHook(() => useModal());

    act(() => {
      result.current.open();
    });

    expect(result.current.isOpen).toBe(true);

    act(() => {
      result.current.close();
    });

    expect(result.current.isOpen).toBe(false);
  });

  test("closes modal without changing value", () => {
    const { result } = renderHook(() => useModal("100"));

    act(() => {
      result.current.open("500");
    });

    expect(result.current.inputValue).toBe("500");

    act(() => {
      result.current.close();
    });

    expect(result.current.isOpen).toBe(false);
    expect(result.current.inputValue).toBe("500");
  });

  test("resets modal to closed and clears value", () => {
    const { result } = renderHook(() => useModal("100"));

    act(() => {
      result.current.open("999");
    });

    expect(result.current.isOpen).toBe(true);
    expect(result.current.inputValue).toBe("999");

    act(() => {
      result.current.reset();
    });

    expect(result.current.isOpen).toBe(false);
    expect(result.current.inputValue).toBe("");
  });

  test("resets modal and sets new value", () => {
    const { result } = renderHook(() => useModal("100"));

    act(() => {
      result.current.open("500");
    });

    act(() => {
      result.current.reset("300");
    });

    expect(result.current.isOpen).toBe(false);
    expect(result.current.inputValue).toBe("300");
  });

  test("updates input value directly with setInputValue", () => {
    const { result } = renderHook(() => useModal("100"));

    act(() => {
      result.current.setInputValue("555");
    });

    expect(result.current.inputValue).toBe("555");
    expect(result.current.isOpen).toBe(false);
  });

  test("setInputValue clears input when passed empty string", () => {
    const { result } = renderHook(() => useModal("100"));

    act(() => {
      result.current.setInputValue("");
    });

    expect(result.current.inputValue).toBe("");
  });

  test("setInputValue can be called while modal is open", () => {
    const { result } = renderHook(() => useModal("100"));

    act(() => {
      result.current.open();
    });

    act(() => {
      result.current.setInputValue("200");
    });

    expect(result.current.inputValue).toBe("200");
    expect(result.current.isOpen).toBe(true);
  });

  test("multiple open/close cycles work correctly", () => {
    const { result } = renderHook(() => useModal("initial"));

    // First cycle
    act(() => {
      result.current.open("first");
    });
    expect(result.current.inputValue).toBe("first");

    act(() => {
      result.current.close();
    });
    expect(result.current.isOpen).toBe(false);

    // Second cycle
    act(() => {
      result.current.open("second");
    });
    expect(result.current.inputValue).toBe("second");

    act(() => {
      result.current.reset("third");
    });
    expect(result.current.inputValue).toBe("third");
    expect(result.current.isOpen).toBe(false);
  });

  test("handles rapid state changes", () => {
    const { result } = renderHook(() => useModal());

    act(() => {
      result.current.open("1");
      result.current.setInputValue("2");
      result.current.setInputValue("3");
    });

    expect(result.current.inputValue).toBe("3");
    expect(result.current.isOpen).toBe(true);
  });

  test("reset with empty string explicitly", () => {
    const { result } = renderHook(() => useModal("100"));

    act(() => {
      result.current.reset("");
    });

    expect(result.current.inputValue).toBe("");
    expect(result.current.isOpen).toBe(false);
  });

  test("handles numeric-like string values", () => {
    const { result } = renderHook(() => useModal("123.45"));

    expect(result.current.inputValue).toBe("123.45");

    act(() => {
      result.current.open("999.99");
    });

    expect(result.current.inputValue).toBe("999.99");
  });

  test("handles special characters in input value", () => {
    const { result } = renderHook(() => useModal("$1,000.00"));

    expect(result.current.inputValue).toBe("$1,000.00");

    act(() => {
      result.current.setInputValue("€500");
    });

    expect(result.current.inputValue).toBe("€500");
  });
});
