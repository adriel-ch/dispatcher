import { render, screen } from "@testing-library/react";
import Home from "@/app/page";
import "@testing-library/jest-dom";

describe("Home", () => {
  it("Renders the page", () => {
    render(<Home />);
    const heading = screen.getByRole("heading", {
      name: "DISPATCHER",
    });
    expect(heading).toBeInTheDocument();
  });
});
