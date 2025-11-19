import { useState, useCallback } from "react";

export function useModal(initialValue: string = "") {
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState(initialValue);

  const open = useCallback((value?: string) => {
    if (value !== undefined) setInputValue(value);
    setIsOpen(true);
  }, []);

  const close = useCallback(() => {
    setIsOpen(false);
  }, []);

  const reset = useCallback((value?: string) => {
    setInputValue(value || "");
    setIsOpen(false);
  }, []);

  return { isOpen, inputValue, setInputValue, open, close, reset };
}
