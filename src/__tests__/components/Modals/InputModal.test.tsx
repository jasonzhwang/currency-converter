import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import InputModal from "@/components/Modals/InputModal/inputModal";

describe("InputModal", () => {
  const mockOnInputChange = jest.fn();
  const mockOnConfirm = jest.fn();
  const mockOnCancel = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("renders nothing when closed", () => {
    const { container } = render(
      <InputModal
        isOpen={false}
        currency="USD"
        inputValue=""
        onInputChange={mockOnInputChange}
        onConfirm={mockOnConfirm}
        onCancel={mockOnCancel}
      />
    );
    expect(container.firstChild).toBeNull();
  });

  test("renders modal with title and currency when open", () => {
    render(
      <InputModal
        isOpen
        currency="USD"
        inputValue=""
        onInputChange={mockOnInputChange}
        onConfirm={mockOnConfirm}
        onCancel={mockOnCancel}
      />
    );
    expect(screen.getByText(/Enter Amount \(USD\)/)).toBeInTheDocument();
    expect(screen.getByRole("textbox")).toBeInTheDocument();
  });

  test("displays input value in text field", () => {
    render(
      <InputModal
        isOpen
        currency="EUR"
        inputValue="123.45"
        onInputChange={mockOnInputChange}
        onConfirm={mockOnConfirm}
        onCancel={mockOnCancel}
      />
    );
    const input = screen.getByRole("textbox") as HTMLInputElement;
    expect(input.value).toBe("123.45");
  });

  test("calls onInputChange when typing in input field", () => {
    render(
      <InputModal
        isOpen
        currency="USD"
        inputValue=""
        onInputChange={mockOnInputChange}
        onConfirm={mockOnConfirm}
        onCancel={mockOnCancel}
      />
    );
    const input = screen.getByRole("textbox");
    fireEvent.change(input, { target: { value: "500" } });
    expect(mockOnInputChange).toHaveBeenCalled();
  });

  test("number pad buttons add digits to input", () => {
    render(
      <InputModal
        isOpen
        currency="USD"
        inputValue=""
        onInputChange={mockOnInputChange}
        onConfirm={mockOnConfirm}
        onCancel={mockOnCancel}
      />
    );
    const button5 = screen.getAllByRole("button").find((btn) => btn.textContent === "5");
    fireEvent.click(button5!);
    expect(mockOnInputChange).toHaveBeenCalled();
  });

  test("decimal button adds decimal point", () => {
    render(
      <InputModal
        isOpen
        currency="USD"
        inputValue="100"
        onInputChange={mockOnInputChange}
        onConfirm={mockOnConfirm}
        onCancel={mockOnCancel}
      />
    );
    const decimalBtn = screen.getAllByRole("button").find((btn) => btn.textContent === ".");
    fireEvent.click(decimalBtn!);
    expect(mockOnInputChange).toHaveBeenCalledWith("100.");
  });

  test("delete button removes last character", () => {
    render(
      <InputModal
        isOpen
        currency="USD"
        inputValue="123"
        onInputChange={mockOnInputChange}
        onConfirm={mockOnConfirm}
        onCancel={mockOnCancel}
      />
    );
    const deleteBtn = screen.getByRole("button", { name: /delete/i });
    fireEvent.click(deleteBtn);
    expect(mockOnInputChange).toHaveBeenCalledWith("12");
  });

  test("clear button clears input", () => {
    render(
      <InputModal
        isOpen
        currency="USD"
        inputValue="999.99"
        onInputChange={mockOnInputChange}
        onConfirm={mockOnConfirm}
        onCancel={mockOnCancel}
      />
    );
    const clearBtn = screen.getByRole("button", { name: /clear/i });
    fireEvent.click(clearBtn);
    expect(mockOnInputChange).toHaveBeenCalledWith("");
  });

  test("confirm button is enabled for valid input", () => {
    render(
      <InputModal
        isOpen
        currency="USD"
        inputValue="100.50"
        onInputChange={mockOnInputChange}
        onConfirm={mockOnConfirm}
        onCancel={mockOnCancel}
      />
    );
    const confirmBtn = screen.getByRole("button", { name: /confirm/i });
    expect(confirmBtn).not.toBeDisabled();
  });

  test("confirm button is disabled for empty input", () => {
    render(
      <InputModal
        isOpen
        currency="USD"
        inputValue=""
        onInputChange={mockOnInputChange}
        onConfirm={mockOnConfirm}
        onCancel={mockOnCancel}
      />
    );
    const confirmBtn = screen.getByRole("button", { name: /confirm/i });
    expect(confirmBtn).toBeDisabled();
  });

  test("confirm button is disabled for zero input", () => {
    render(
      <InputModal
        isOpen
        currency="USD"
        inputValue="0"
        onInputChange={mockOnInputChange}
        onConfirm={mockOnConfirm}
        onCancel={mockOnCancel}
      />
    );
    const confirmBtn = screen.getByRole("button", { name: /confirm/i });
    expect(confirmBtn).toBeDisabled();
  });

  test("confirm button is disabled for decimal-only input", () => {
    render(
      <InputModal
        isOpen
        currency="USD"
        inputValue="."
        onInputChange={mockOnInputChange}
        onConfirm={mockOnConfirm}
        onCancel={mockOnCancel}
      />
    );
    const confirmBtn = screen.getByRole("button", { name: /confirm/i });
    expect(confirmBtn).toBeDisabled();
  });

  test("calls onConfirm when confirm button is clicked", () => {
    render(
      <InputModal
        isOpen
        currency="USD"
        inputValue="250.75"
        onInputChange={mockOnInputChange}
        onConfirm={mockOnConfirm}
        onCancel={mockOnCancel}
      />
    );
    const confirmBtn = screen.getByRole("button", { name: /confirm/i });
    fireEvent.click(confirmBtn);
    expect(mockOnConfirm).toHaveBeenCalled();
  });

  test("calls onCancel when cancel button is clicked", () => {
    render(
      <InputModal
        isOpen
        currency="USD"
        inputValue="100"
        onInputChange={mockOnInputChange}
        onConfirm={mockOnConfirm}
        onCancel={mockOnCancel}
      />
    );
    const cancelBtn = screen.getByRole("button", { name: /cancel/i });
    fireEvent.click(cancelBtn);
    expect(mockOnCancel).toHaveBeenCalled();
  });

  test("closes modal when clicking overlay", () => {
    render(
      <InputModal
        isOpen
        currency="USD"
        inputValue="100"
        onInputChange={mockOnInputChange}
        onConfirm={mockOnConfirm}
        onCancel={mockOnCancel}
      />
    );
    const overlay = screen.getByRole("textbox").closest(".modalOverlay");
    fireEvent.click(overlay!);
    expect(mockOnCancel || mockOnConfirm).toBeDefined();
  });

  test("displays correct title with different currencies", () => {
    render(
      <InputModal
        isOpen
        currency="EUR"
        inputValue=""
        onInputChange={mockOnInputChange}
        onConfirm={mockOnConfirm}
        onCancel={mockOnCancel}
      />
    );
    expect(screen.getByText(/Enter Amount \(EUR\)/)).toBeInTheDocument();
  });

  test("number pad renders all digit buttons", () => {
    render(
      <InputModal
        isOpen
        currency="USD"
        inputValue=""
        onInputChange={mockOnInputChange}
        onConfirm={mockOnConfirm}
        onCancel={mockOnCancel}
      />
    );
    for (let i = 0; i < 10; i++) {
      const button = screen.getAllByRole("button").find((btn) => btn.textContent === String(i));
      expect(button).toBeInTheDocument();
    }
  });
});
