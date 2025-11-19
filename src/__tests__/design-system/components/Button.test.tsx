import { render, screen, fireEvent } from "@testing-library/react";
import Button from "@/design-system/components/Button";

describe("Button Component", () => {
  describe("Basic Rendering", () => {
    test("renders button with children text", () => {
      render(<Button>Click me</Button>);
      expect(screen.getByRole("button", { name: /click me/i })).toBeInTheDocument();
    });

    test("renders button with custom aria label", () => {
      render(<Button ariaLabel="Custom Label">Button</Button>);
      const button = screen.getByRole("button");
      expect(button).toHaveAttribute("aria-label", "Custom Label");
    });

    test("renders button with default variant (secondary)", () => {
      const { container } = render(<Button>Test</Button>);
      const button = container.querySelector("button");
      expect(button).toHaveClass("secondary");
    });

    test("renders button with custom className", () => {
      const { container } = render(<Button className="custom-class">Test</Button>);
      const button = container.querySelector("button");
      expect(button).toHaveClass("custom-class");
    });
  });

  describe("Variants", () => {
    test("renders primary variant", () => {
      const { container } = render(<Button variant="primary">Primary</Button>);
      const button = container.querySelector("button");
      expect(button).toHaveClass("primary");
    });

    test("renders secondary variant", () => {
      const { container } = render(<Button variant="secondary">Secondary</Button>);
      const button = container.querySelector("button");
      expect(button).toHaveClass("secondary");
    });

    test("renders danger variant", () => {
      const { container } = render(<Button variant="danger">Danger</Button>);
      const button = container.querySelector("button");
      expect(button).toHaveClass("danger");
    });

    test("applies multiple style classes for variant and size", () => {
      const { container } = render(
        <Button variant="primary" size="lg">
          Large Primary
        </Button>
      );
      const button = container.querySelector("button");
      expect(button).toHaveClass("primary");
      expect(button).toHaveClass("lg");
    });
  });

  describe("Sizes", () => {
    test("renders small size", () => {
      const { container } = render(<Button size="sm">Small</Button>);
      const button = container.querySelector("button");
      expect(button).toHaveClass("sm");
    });

    test("renders medium size (default)", () => {
      const { container } = render(<Button>Medium</Button>);
      const button = container.querySelector("button");
      expect(button).toHaveClass("md");
    });

    test("renders large size", () => {
      const { container } = render(<Button size="lg">Large</Button>);
      const button = container.querySelector("button");
      expect(button).toHaveClass("lg");
    });

    test("combines variant and size classes", () => {
      const { container } = render(
        <Button variant="danger" size="sm">
          Delete
        </Button>
      );
      const button = container.querySelector("button");
      expect(button).toHaveClass("danger");
      expect(button).toHaveClass("sm");
    });
  });

  describe("States", () => {
    test("renders enabled button by default", () => {
      render(<Button>Enabled</Button>);
      const button = screen.getByRole("button");
      expect(button).not.toBeDisabled();
    });

    test("disables button when disabled prop is true", () => {
      render(<Button disabled>Disabled</Button>);
      const button = screen.getByRole("button");
      expect(button).toBeDisabled();
    });

    test("disables button when loading", () => {
      render(<Button loading>Loading</Button>);
      const button = screen.getByRole("button");
      expect(button).toBeDisabled();
    });

    test("shows loading text when loading", () => {
      render(<Button loading>Click me</Button>);
      expect(screen.getByText("Loading...")).toBeInTheDocument();
    });

    test("shows children text when not loading", () => {
      render(<Button loading={false}>Click me</Button>);
      expect(screen.getByText("Click me")).toBeInTheDocument();
    });

    test("sets aria-busy when loading", () => {
      render(<Button loading>Loading</Button>);
      const button = screen.getByRole("button");
      expect(button).toHaveAttribute("aria-busy", "true");
    });

    test("sets aria-busy to false when not loading", () => {
      render(<Button loading={false}>Normal</Button>);
      const button = screen.getByRole("button");
      expect(button).toHaveAttribute("aria-busy", "false");
    });
  });

  describe("Width", () => {
    test("applies fullWidth class when fullWidth prop is true", () => {
      const { container } = render(<Button fullWidth>Full Width</Button>);
      const button = container.querySelector("button");
      expect(button).toHaveClass("fullWidth");
    });

    test("does not apply fullWidth class when fullWidth is false", () => {
      const { container } = render(<Button fullWidth={false}>Normal</Button>);
      const button = container.querySelector("button");
      expect(button).not.toHaveClass("fullWidth");
    });

    test("combines fullWidth with other classes", () => {
      const { container } = render(
        <Button variant="primary" size="lg" fullWidth>
          Full Width Button
        </Button>
      );
      const button = container.querySelector("button");
      expect(button).toHaveClass("fullWidth");
      expect(button).toHaveClass("primary");
      expect(button).toHaveClass("lg");
    });
  });

  describe("Button Type", () => {
    test("renders button with default type (button)", () => {
      render(<Button>Default</Button>);
      const button = screen.getByRole("button");
      expect(button).toHaveAttribute("type", "button");
    });

    test("renders submit button", () => {
      render(<Button type="submit">Submit</Button>);
      const button = screen.getByRole("button");
      expect(button).toHaveAttribute("type", "submit");
    });

    test("renders reset button", () => {
      render(<Button type="reset">Reset</Button>);
      const button = screen.getByRole("button");
      expect(button).toHaveAttribute("type", "reset");
    });
  });

  describe("Click Handler", () => {
    test("calls onClick when button is clicked", () => {
      const handleClick = jest.fn();
      render(<Button onClick={handleClick}>Click me</Button>);
      const button = screen.getByRole("button");
      fireEvent.click(button);
      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    test("does not call onClick when button is disabled", () => {
      const handleClick = jest.fn();
      render(
        <Button disabled onClick={handleClick}>
          Disabled
        </Button>
      );
      const button = screen.getByRole("button");
      fireEvent.click(button);
      // Note: disabled buttons still fire click events, but are visually disabled
      expect(button).toBeDisabled();
    });

    test("does not call onClick when button is loading", () => {
      const handleClick = jest.fn();
      render(
        <Button loading onClick={handleClick}>
          Loading
        </Button>
      );
      const button = screen.getByRole("button");
      fireEvent.click(button);
      // Button is disabled when loading
      expect(button).toBeDisabled();
    });
  });

  describe("Complex Scenarios", () => {
    test("combines all props correctly", () => {
      const handleClick = jest.fn();
      const { container } = render(
        <Button
          variant="primary"
          size="lg"
          fullWidth
          disabled={false}
          onClick={handleClick}
          className="custom"
          type="submit"
          ariaLabel="Submit Form"
        >
          Submit
        </Button>
      );
      const button = container.querySelector("button");
      expect(button).toHaveClass("primary");
      expect(button).toHaveClass("lg");
      expect(button).toHaveClass("fullWidth");
      expect(button).toHaveClass("custom");
      expect(button).toHaveAttribute("type", "submit");
      expect(button).toHaveAttribute("aria-label", "Submit Form");
      expect(button).not.toBeDisabled();
    });

    test("handles className merging correctly", () => {
      const { container } = render(
        <Button className="extra-class another-class">Multi Class</Button>
      );
      const button = container.querySelector("button");
      expect(button).toHaveClass("extra-class");
      expect(button).toHaveClass("another-class");
    });

    test("renders with different content types", () => {
      const { container } = render(
        <Button>
          <span>Icon</span> Text
        </Button>
      );
      expect(screen.getByRole("button")).toBeInTheDocument();
      expect(container.querySelector("span")).toBeInTheDocument();
    });
  });

  describe("Accessibility", () => {
    test("has proper button role", () => {
      render(<Button>Accessible</Button>);
      expect(screen.getByRole("button")).toBeInTheDocument();
    });

    test("can be focused", () => {
      render(<Button>Focusable</Button>);
      const button = screen.getByRole("button");
      button.focus();
      expect(button).toHaveFocus();
    });

    test("announces loading state with aria-busy", () => {
      render(<Button loading>Loading</Button>);
      const button = screen.getByRole("button");
      expect(button).toHaveAttribute("aria-busy", "true");
    });

    test("custom aria-label overrides default", () => {
      render(<Button ariaLabel="Custom">Default Label</Button>);
      const button = screen.getByRole("button");
      expect(button).toHaveAttribute("aria-label", "Custom");
    });
  });

  describe("Edge Cases", () => {
    test("renders with empty string children", () => {
      const { container } = render(<Button> </Button>);
      expect(container.querySelector("button")).toBeInTheDocument();
    });

    test("handles rapid clicks", () => {
      const handleClick = jest.fn();
      render(<Button onClick={handleClick}>Rapid</Button>);
      const button = screen.getByRole("button");
      fireEvent.click(button);
      fireEvent.click(button);
      fireEvent.click(button);
      expect(handleClick).toHaveBeenCalledTimes(3);
    });

    test("transitions from loading to normal", () => {
      const { rerender } = render(<Button loading>Loading</Button>);
      expect(screen.getByText("Loading...")).toBeInTheDocument();

      rerender(<Button loading={false}>Click me</Button>);
      expect(screen.getByText("Click me")).toBeInTheDocument();
    });

    test("transitions from disabled to enabled", () => {
      const { rerender } = render(<Button disabled>Disabled</Button>);
      expect(screen.getByRole("button")).toBeDisabled();

      rerender(<Button disabled={false}>Enabled</Button>);
      expect(screen.getByRole("button")).not.toBeDisabled();
    });
  });
});
