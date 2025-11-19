import { render, screen } from "@testing-library/react";
import Home from "@/pages/index";

// Mock rates so Home renders a stable set of target cards; avoid brittle full DOM snapshot.
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

describe("Home Page", () => {
  it("renders ConversionBoard base select", async () => {
    render(<Home />);
    // Await a target currency to ensure initial async effect settled (avoids act warnings)
    await screen.findByText("USD");
    expect(screen.getByRole("combobox")).toBeInTheDocument();
  });

  it("renders target currency cards after rates load", async () => {
    render(<Home />);
    // Directly await the target currency
    expect(await screen.findByText("USD")).toBeInTheDocument();
  });

  it("displays formatted base amount", async () => {
    render(<Home />);
    // Wait for async updates then assert amount
    await screen.findByText("USD");
    expect(screen.getByText(/\$1,000\.00/)).toBeInTheDocument();
  });
});
