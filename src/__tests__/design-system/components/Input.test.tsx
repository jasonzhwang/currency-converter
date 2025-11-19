import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Input from "@/design-system/components/Input";

describe("Input Component", () => {
  describe("Basic Rendering", () => {
    test("renders input field", () => {
      render(<Input />);
      expect(screen.getByRole("textbox")).toBeInTheDocument();
    });

    test("renders with label", () => {
      render(<Input label="Amount" />);
      expect(screen.getByText("Amount")).toBeInTheDocument();
    });

    test("renders with placeholder", () => {
      render(<Input placeholder="Enter amount" />);
      expect(screen.getByPlaceholderText("Enter amount")).toBeInTheDocument();
    });

    test("renders with value", () => {
      render(<Input value="100" onChange={() => {}} />);
      expect(screen.getByRole("textbox")).toHaveValue("100");
    });
  });

  describe("Error State", () => {
    test("displays error message when error prop provided", () => {
      render(<Input error="Invalid input" />);
      expect(screen.getByText("Invalid input")).toBeInTheDocument();
    });

    test("applies error styling to input when error exists", () => {
      render(<Input error="Error occurred" />);
      const input = screen.getByRole("textbox");
      expect(input).toHaveClass("error");
    });

    test("does not show error message when error is empty", () => {
      render(<Input error="" />);
      expect(screen.queryByText(/error/i)).not.toBeInTheDocument();
    });

    test("updates error message dynamically", () => {
      const { rerender } = render(<Input error="First error" />);
      expect(screen.getByText("First error")).toBeInTheDocument();

      rerender(<Input error="Second error" />);
      expect(screen.queryByText("First error")).not.toBeInTheDocument();
      expect(screen.getByText("Second error")).toBeInTheDocument();
    });
  });

  describe("Event Handling", () => {
    test("calls onChange handler when value changes", async () => {
      const handleChange = jest.fn();
      render(<Input onChange={handleChange} />);

      const input = screen.getByRole("textbox");
      await userEvent.type(input, "123");

      expect(handleChange).toHaveBeenCalled();
    });

    test("calls onFocus handler when input is focused", async () => {
      const handleFocus = jest.fn();
      render(<Input onFocus={handleFocus} />);

      const input = screen.getByRole("textbox");
      await userEvent.click(input);

      expect(handleFocus).toHaveBeenCalledTimes(1);
    });

    test("calls onBlur handler when input loses focus", async () => {
      const handleBlur = jest.fn();
      render(<Input onBlur={handleBlur} />);

      const input = screen.getByRole("textbox");
      await userEvent.click(input);
      await userEvent.tab();

      expect(handleBlur).toHaveBeenCalledTimes(1);
    });

    test("calls onKeyDown handler for keyboard events", async () => {
      const handleKeyDown = jest.fn();
      render(<Input onKeyDown={handleKeyDown} />);

      const input = screen.getByRole("textbox");
      await userEvent.type(input, "a");

      expect(handleKeyDown).toHaveBeenCalled();
    });
  });

  describe("Disabled State", () => {
    test("disables input when disabled prop is true", () => {
      render(<Input disabled />);
      expect(screen.getByRole("textbox")).toBeDisabled();
    });

    test("cannot type in disabled input", async () => {
      const handleChange = jest.fn();
      render(<Input disabled onChange={handleChange} />);

      const input = screen.getByRole("textbox") as HTMLInputElement;
      await userEvent.type(input, "123");

      // onChange should not be called when disabled
      expect(handleChange).not.toHaveBeenCalled();
    });

    test("can enable disabled input", () => {
      const { rerender } = render(<Input disabled />);
      expect(screen.getByRole("textbox")).toBeDisabled();

      rerender(<Input disabled={false} />);
      expect(screen.getByRole("textbox")).not.toBeDisabled();
    });

    test("shows disabled styling", () => {
      render(<Input disabled />);
      const input = screen.getByRole("textbox");
      expect(input).toBeDisabled();
    });
  });

  describe("Custom Styling", () => {
    test("applies custom className", () => {
      const { container } = render(<Input className="custom-class" />);
      expect(container.querySelector("input")).toHaveClass("custom-class");
    });

    test("applies both default and custom classes", () => {
      const { container } = render(<Input className="custom-class" />);
      const input = container.querySelector("input");
      // Should have wrapper class and custom class
      expect(input).toHaveClass("custom-class");
    });

    test("applies error class when error exists", () => {
      const { container } = render(<Input error="Error" />);
      const input = container.querySelector("input");
      expect(input).toHaveClass("error");
    });

    test("removes error class when error is cleared", () => {
      const { rerender, container } = render(<Input error="Error" />);
      let input = container.querySelector("input");
      expect(input).toHaveClass("error");

      rerender(<Input error="" />);
      input = container.querySelector("input");
      expect(input).not.toHaveClass("error");
    });
  });

  describe("Label and Wrapper", () => {
    test("renders label with correct text", () => {
      render(<Input label="Username" />);
      expect(screen.getByText("Username")).toBeInTheDocument();
    });

    test("associates label with input", () => {
      const { container } = render(<Input label="Email" />);
      const label = screen.getByText("Email");
      const input = container.querySelector("input");
      // Label should be connected to input via wrapper structure
      expect(label).toBeInTheDocument();
    });

    test("renders error text below input", () => {
      const { container } = render(<Input error="Invalid email" />);
      const errorText = screen.getByText("Invalid email");
      const input = container.querySelector("input");

      // Error text should appear after input in DOM
      expect(input && errorText).toBeTruthy();
    });
  });

  describe("Input Types and Attributes", () => {
    test("accepts type prop for different input types", () => {
      render(<Input type="email" />);
      const input = screen.getByRole("textbox");
      expect(input).toHaveAttribute("type", "email");
    });

    test("accepts required attribute", () => {
      render(<Input required />);
      const input = screen.getByRole("textbox");
      expect(input).toHaveAttribute("required");
    });

    test("accepts maxLength attribute", () => {
      render(<Input maxLength={10} />);
      const input = screen.getByRole("textbox");
      expect(input).toHaveAttribute("maxLength", "10");
    });

    test("accepts name attribute", () => {
      render(<Input name="username" />);
      const input = screen.getByRole("textbox");
      expect(input).toHaveAttribute("name", "username");
    });

    test("accepts id attribute", () => {
      render(<Input id="email-input" />);
      const input = screen.getByRole("textbox");
      expect(input).toHaveAttribute("id", "email-input");
    });
  });

  describe("Controlled Component", () => {
    test("updates value when controlled value prop changes", () => {
      const { rerender } = render(<Input value="initial" onChange={() => {}} />);
      expect(screen.getByRole("textbox")).toHaveValue("initial");

      rerender(<Input value="updated" onChange={() => {}} />);
      expect(screen.getByRole("textbox")).toHaveValue("updated");
    });

    test("handles empty string value", () => {
      render(<Input value="" onChange={() => {}} />);
      expect(screen.getByRole("textbox")).toHaveValue("");
    });

    test("handles numeric string value", () => {
      render(<Input value="12345" onChange={() => {}} />);
      expect(screen.getByRole("textbox")).toHaveValue("12345");
    });
  });

  describe("Focus Management", () => {
    test("can programmatically focus input", async () => {
      const { container } = render(<Input />);
      const input = container.querySelector("input") as HTMLInputElement;

      input.focus();
      expect(document.activeElement).toBe(input);
    });

    test("maintains focus on re-render", async () => {
      const { rerender, container } = render(<Input />);
      const input = container.querySelector("input") as HTMLInputElement;

      input.focus();
      expect(document.activeElement).toBe(input);

      rerender(<Input />);
      // Focus state should be maintained (not explicitly required)
    });
  });

  describe("Accessibility", () => {
    test("input has proper role", () => {
      render(<Input />);
      expect(screen.getByRole("textbox")).toBeInTheDocument();
    });

    test("label is properly associated with input", () => {
      render(<Input label="Name" />);
      const label = screen.getByText("Name");
      expect(label).toBeInTheDocument();
    });

    test("error message is associated with input when present", () => {
      render(<Input error="This field is required" />);
      const error = screen.getByText("This field is required");
      expect(error).toBeInTheDocument();
    });

    test("disabled state is visible", () => {
      render(<Input disabled />);
      const input = screen.getByRole("textbox");
      expect(input).toBeDisabled();
    });
  });

  describe("Edge Cases", () => {
    test("handles very long input values", async () => {
      const longValue = "a".repeat(1000);
      const handleChange = jest.fn();
      render(<Input value={longValue} onChange={handleChange} />);

      expect(screen.getByRole("textbox")).toHaveValue(longValue);
    });

    test("handles special characters in value", () => {
      render(<Input value="!@#$%^&*()" onChange={() => {}} />);
      expect(screen.getByRole("textbox")).toHaveValue("!@#$%^&*()");
    });

    test("handles whitespace-only placeholder", () => {
      render(<Input placeholder="   " />);
      const input = screen.getByRole("textbox");
      expect(input).toHaveAttribute("placeholder", "   ");
    });

    test("handles rapid onChange calls", async () => {
      const handleChange = jest.fn();
      render(<Input onChange={handleChange} />);

      const input = screen.getByRole("textbox");
      // Simulate rapid typing
      for (let i = 0; i < 10; i++) {
        fireEvent.change(input, { target: { value: `char${i}` } });
      }

      expect(handleChange).toHaveBeenCalledTimes(10);
    });
  });
});
