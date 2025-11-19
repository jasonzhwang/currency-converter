import { render, screen } from "@testing-library/react";
import Header from "@/layout/Header";

describe("Header", () => {
  it("renders title", () => {
    render(<Header />);
    expect(screen.getByText("Convert")).toBeInTheDocument();
  });

  it("has correct heading level", () => {
    const { container } = render(<Header />);
    const heading = container.querySelector("h1");
    expect(heading).toBeInTheDocument();
    expect(heading?.textContent).toBe("Convert");
  });
});
