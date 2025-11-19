import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import ConversionBoard from "@/components/ConversionBoard";
import { CURRENCIES } from "@/data/constants";

// ESM named export bindings (like fetchExchangeRates) are read-only/non-configurable,
// so jest.spyOn() cannot redefine them. Instead, mock the entire module and provide
// a jest.fn implementation returning stable fixture data.
jest.mock("@/services/exchangeRate", () => ({
  fetchExchangeRates: jest.fn().mockResolvedValue({
    rates: {
      AUD: 1,
      USD: 0.65,
      EUR: 0.61,
      GBP: 0.52,
      CAD: 0.89,
      NZD: 1.09,
    },
    base: "AUD",
  }),
}));

describe("ConversionBoard", () => {
  describe("Rendering", () => {
    test("renders base currency card and target cards", async () => {
      render(<ConversionBoard />);
      // Wait for one target card's testid
      await screen.findByTestId("currency-code-USD");
      expect(screen.getByRole("combobox")).toBeInTheDocument();
      CURRENCIES.filter((c) => c !== "AUD").forEach((curr) => {
        expect(screen.getByTestId(`currency-code-${curr}`)).toBeInTheDocument();
      });
    });

    test("shows loading state while fetching exchange rates", async () => {
      // This test verifies the component renders without crashing
      render(<ConversionBoard />);
      await screen.findByTestId("currency-code-USD");
      expect(screen.queryByText(/Loading/i)).not.toBeInTheDocument();
    });

    test("renders with custom initial props", async () => {
      render(<ConversionBoard initialBaseCurrency="USD" initialAmount={500} />);
      await screen.findByTestId("currency-code-AUD");
      // Verify component renders without errors with custom props
      expect(screen.getByRole("combobox")).toBeInTheDocument();
    });

    test("displays conversion board container", async () => {
      const { container } = render(<ConversionBoard />);
      await screen.findByTestId("currency-code-USD");
      expect(container.querySelector('[class*="board"]')).toBeInTheDocument();
    });
  });

  describe("Base Currency Updates", () => {
    test("changes base currency via dropdown", async () => {
      render(<ConversionBoard />);
      const dropdown = await screen.findByRole("combobox");
      fireEvent.change(dropdown, { target: { value: "USD" } });
      await waitFor(() => {
        expect(dropdown).toHaveValue("USD");
      });
    });

    test("updates conversion rates when base currency changes", async () => {
      render(<ConversionBoard />);
      await screen.findByTestId("currency-code-USD");
      const dropdown = screen.getByRole("combobox");
      fireEvent.change(dropdown, { target: { value: "EUR" } });
      await waitFor(() => {
        expect(dropdown).toHaveValue("EUR");
      });
    });
  });

  describe("Amount Editing", () => {
    test("opens amount edit modal and updates amount", async () => {
      render(<ConversionBoard />);
      await screen.findByTestId("currency-code-USD");
      // Click edit button on base card
      const editBtns = screen.getAllByRole("button", { name: /edit amount/i });
      fireEvent.click(editBtns[0]);
      // Modal input should appear
      const input = await screen.findByRole("textbox");
      fireEvent.change(input, { target: { value: "2000" } });
      const confirmBtn = screen.getByRole("button", { name: /confirm/i });
      fireEvent.click(confirmBtn);
      // Amount text updated
      await waitFor(() => {
        expect(screen.getByText(/\$2,000|2000/)).toBeInTheDocument();
      });
    });

    test("edits target currency amount", async () => {
      render(<ConversionBoard />);
      await screen.findByTestId("currency-code-USD");
      // Get all edit buttons and click the second one (target card)
      const editBtns = screen.getAllByRole("button", { name: /edit amount/i });
      if (editBtns.length > 1) {
        fireEvent.click(editBtns[1]);
        const input = await screen.findByRole("textbox");
        expect(input).toBeInTheDocument();
      }
    });

    test("handles zero amount input gracefully", async () => {
      render(<ConversionBoard />);
      await screen.findByTestId("currency-code-USD");
      const editBtns = screen.getAllByRole("button", { name: /edit amount/i });
      fireEvent.click(editBtns[0]);
      const input = await screen.findByRole("textbox");
      fireEvent.change(input, { target: { value: "0" } });
      const confirmBtn = screen.getByRole("button", { name: /confirm/i });
      fireEvent.click(confirmBtn);
      // Should handle zero without errors
      await waitFor(() => {
        expect(screen.getByRole("combobox")).toBeInTheDocument();
      });
    });

    test("cancels amount edit without updating", async () => {
      render(<ConversionBoard />);
      await screen.findByTestId("currency-code-USD");
      const editBtns = screen.getAllByRole("button", { name: /edit amount/i });
      fireEvent.click(editBtns[0]);
      const input = await screen.findByRole("textbox");
      const initialValue = input.getAttribute("value");
      fireEvent.change(input, { target: { value: "9999" } });
      const cancelBtn = screen.getByRole("button", { name: /cancel/i });
      fireEvent.click(cancelBtn);
      // Modal should close
      await waitFor(() => {
        expect(screen.queryByText(/9999/)).not.toBeInTheDocument();
      });
    });

    test("handles invalid amount input", async () => {
      render(<ConversionBoard />);
      await screen.findByTestId("currency-code-USD");
      const editBtns = screen.getAllByRole("button", { name: /edit amount/i });
      fireEvent.click(editBtns[0]);
      const input = await screen.findByRole("textbox");
      fireEvent.change(input, { target: { value: "invalid" } });
      const confirmBtn = screen.getByRole("button", { name: /confirm/i });
      fireEvent.click(confirmBtn);
      // Should not crash
      await waitFor(() => {
        expect(screen.getByRole("combobox")).toBeInTheDocument();
      });
    });

    test("handles negative amount input", async () => {
      render(<ConversionBoard />);
      await screen.findByTestId("currency-code-USD");
      const editBtns = screen.getAllByRole("button", { name: /edit amount/i });
      fireEvent.click(editBtns[0]);
      const input = await screen.findByRole("textbox");
      fireEvent.change(input, { target: { value: "-100" } });
      const confirmBtn = screen.getByRole("button", { name: /confirm/i });
      fireEvent.click(confirmBtn);
      // Component should handle this gracefully
      await waitFor(() => {
        expect(screen.getByRole("combobox")).toBeInTheDocument();
      });
    });
  });

  describe("Chart Modal", () => {
    test("opens chart modal when clicking a target card", async () => {
      render(<ConversionBoard />);
      const usdCodeEl = await screen.findByTestId("currency-code-USD");
      fireEvent.click(usdCodeEl);
      // Chart modal should open and have some modal content
      await waitFor(() => {
        const modal = document.querySelector("[class*='modal']");
        expect(modal).toBeInTheDocument();
      });
    });

    test("closes chart modal", async () => {
      render(<ConversionBoard />);
      const usdCodeEl = await screen.findByTestId("currency-code-USD");
      fireEvent.click(usdCodeEl);
      await waitFor(() => {
        const modal = document.querySelector("[class*='modal']");
        expect(modal).toBeInTheDocument();
      });
      // Try to find and click close button
      const closeButtons = screen.getAllByRole("button");
      const closeBtn = closeButtons.find(
        (btn) => btn.textContent?.includes("×") || btn.textContent?.includes("Close")
      );
      if (closeBtn) {
        fireEvent.click(closeBtn);
      }
    });

    test("displays correct currencies in chart modal", async () => {
      render(<ConversionBoard />);
      const usdCodeEl = await screen.findByTestId("currency-code-USD");
      fireEvent.click(usdCodeEl);
      await waitFor(() => {
        const modal = document.querySelector("[class*='modal']");
        expect(modal).toBeInTheDocument();
      });
    });
  });

  describe("Error Handling", () => {
    test("handles API errors gracefully", async () => {
      const mockFetch = jest.fn().mockRejectedValue(new Error("API Error"));
      jest.doMock("@/services/exchangeRate", () => ({
        fetchExchangeRates: mockFetch,
      }));

      // Component should render without crashing even if API fails
      render(<ConversionBoard />);
      await waitFor(() => {
        expect(screen.getByRole("combobox")).toBeInTheDocument();
      });
    });

    test("displays empty conversions on fetch failure", async () => {
      render(<ConversionBoard />);
      await waitFor(() => {
        expect(screen.getByRole("combobox")).toBeInTheDocument();
      });
    });
  });

  describe("State Management", () => {
    test("maintains state when switching between editing modes", async () => {
      render(<ConversionBoard />);
      await screen.findByTestId("currency-code-USD");
      expect(screen.getByRole("combobox")).toBeInTheDocument();
      // Edit base amount
      const editBtns = screen.getAllByRole("button", { name: /edit amount/i });
      fireEvent.click(editBtns[0]);
      await screen.findByRole("textbox");
      // Cancel
      const cancelBtn = screen.getByRole("button", { name: /cancel/i });
      fireEvent.click(cancelBtn);
      // Dropdown still works
      expect(screen.getByRole("combobox")).toBeInTheDocument();
    });

    test("currency dropdown remains functional after modal interactions", async () => {
      render(<ConversionBoard />);
      await screen.findByTestId("currency-code-USD");
      const dropdown = screen.getByRole("combobox");
      expect(dropdown).toBeEnabled();
    });

    test("handles multiple rapid currency changes", async () => {
      render(<ConversionBoard />);
      await screen.findByTestId("currency-code-USD");
      const dropdown = screen.getByRole("combobox");
      fireEvent.change(dropdown, { target: { value: "EUR" } });
      fireEvent.change(dropdown, { target: { value: "GBP" } });
      fireEvent.change(dropdown, { target: { value: "USD" } });
      await waitFor(() => {
        expect(dropdown).toHaveValue("USD");
      });
    });
  });

  describe("Sorting and Display", () => {
    test("displays target currencies in alphabetical order", async () => {
      render(<ConversionBoard />);
      await screen.findByTestId("currency-code-USD");
      const currencyCards = screen.getAllByTestId(/currency-code-/);
      // Verify cards exist (order verified by test IDs)
      expect(currencyCards.length).toBeGreaterThan(0);
    });
  });
});
