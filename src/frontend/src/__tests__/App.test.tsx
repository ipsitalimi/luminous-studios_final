import { render, screen, within } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

// The contact form is the only consumer of the backend hook. Mock the hook
// module so the page renders without an actor, an agent or a network call.
vi.mock("@/hooks/useQueries", () => ({
  useSubmitEnquiry: () => ({
    mutate: vi.fn(),
    isPending: false,
  }),
}));

import App from "@/App";

describe("App — default route", () => {
  it("renders the full page without a blank screen", () => {
    render(<App />);

    // Header wordmark and primary navigation.
    expect(
      screen.getByRole("button", { name: "luminous studios." }),
    ).toBeInTheDocument();
    const primaryNav = screen.getByRole("navigation", { name: "Primary" });
    expect(
      within(primaryNav).getByRole("link", { name: "Work" }),
    ).toBeInTheDocument();
    expect(
      within(primaryNav).getByRole("link", { name: "Services" }),
    ).toBeInTheDocument();
    expect(
      within(primaryNav).getByRole("link", { name: "Studio" }),
    ).toBeInTheDocument();
    expect(
      within(primaryNav).getByRole("link", { name: "Contact" }),
    ).toBeInTheDocument();

    // Every top-level section is present.
    expect(document.getElementById("work")).not.toBeNull();
    expect(document.getElementById("services")).not.toBeNull();
    expect(document.getElementById("studio")).not.toBeNull();
    expect(document.getElementById("contact")).not.toBeNull();

    // Footer closes the page.
    expect(screen.getByRole("contentinfo")).toBeInTheDocument();
  });

  it("exposes the hero headline with the accent line and both links", () => {
    render(<App />);

    const heading = screen.getByRole("heading", { level: 1 });
    expect(heading).toHaveTextContent("Good ideas");
    expect(heading).toHaveTextContent("deserve good");
    expect(heading).toHaveTextContent("execution.");

    expect(
      screen.getByText("Independent digital studio / Working worldwide"),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /Tell us what you’re building/ }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /Explore our work/ }),
    ).toBeInTheDocument();
  });
});
