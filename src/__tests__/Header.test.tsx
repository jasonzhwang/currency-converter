import { render, screen, RenderResult } from "@testing-library/react";
import Header from "../layout/Header";

describe("Header Component", () => {
  let renderResult: RenderResult;

  beforeEach(() => {
    renderResult = render(<Header />);
  });

  it("renders header element", () => {
    const header = screen.getByRole("banner");
    expect(header).toBeInTheDocument();
  });

  it('renders the title "Convert"', () => {
    const title = screen.getByRole("heading", { level: 1 });
    expect(title).toBeInTheDocument();
    expect(title).toHaveTextContent("Convert");
  });

  it("has proper semantic HTML structure", () => {
    const header = screen.getByRole("banner");
    const title = screen.getByRole("heading", { level: 1 });
    expect(header).toContainElement(title);
  });

  it("matches snapshot", () => {
    expect(renderResult.container.firstChild).toMatchSnapshot();
  });
});
