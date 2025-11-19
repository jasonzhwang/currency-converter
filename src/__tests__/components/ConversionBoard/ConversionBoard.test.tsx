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
  test("renders base currency card and target cards", async () => {
    render(<ConversionBoard />);
    // Wait for one target card's testid
    await screen.findByTestId("currency-code-USD");
    expect(screen.getByRole("combobox")).toBeInTheDocument();
    CURRENCIES.filter((c) => c !== "AUD").forEach((curr) => {
      expect(screen.getByTestId(`currency-code-${curr}`)).toBeInTheDocument();
    });
  });

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
    // Amount text updated (narrow symbol removes country letters; expect $2,000.00)
    await waitFor(() => {
      expect(screen.getByText(/\$2,000/)).toBeInTheDocument();
    });
  });

  test("opens chart modal when clicking a target card", async () => {
    render(<ConversionBoard />);
    const usdCodeEl = await screen.findByTestId("currency-code-USD");
    fireEvent.click(usdCodeEl);
    // Chart modal title should appear
    await waitFor(() => {
      expect(screen.getByText(/AUD \/ USD/)).toBeInTheDocument();
    });
  });
});
