import { render, screen } from "@testing-library/react";
import Layout from "../layout";

describe("Layout Component", () => {
  it("renders header", () => {
    render(
      <Layout>
        <div>Test Content</div>
      </Layout>
    );

    const header = screen.getByRole("banner");
    expect(header).toBeInTheDocument();
  });

  it("renders children content", () => {
    render(
      <Layout>
        <div>Test Content</div>
      </Layout>
    );

    expect(screen.getByText("Test Content")).toBeInTheDocument();
  });

  it("wraps children in main element", () => {
    render(
      <Layout>
        <div data-testid="child">Test Content</div>
      </Layout>
    );

    const main = screen.getByRole("main");
    const child = screen.getByTestId("child");

    expect(main).toBeInTheDocument();
    expect(main).toContainElement(child);
  });

  it("matches snapshot", () => {
    const { container } = render(
      <Layout>
        <div>Test Content</div>
      </Layout>
    );
    expect(container).toMatchSnapshot();
  });
});
