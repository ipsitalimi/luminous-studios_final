import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { Header } from "@/components/site/Header";

/** Mount the section anchors the header scrolls to. */
function mountSections() {
  for (const id of ["work", "services", "studio", "contact"]) {
    const section = document.createElement("section");
    section.id = id;
    document.body.appendChild(section);
  }
}

describe("Header", () => {
  beforeEach(() => {
    document.body.innerHTML = "";
    mountSections();
  });

  it("shows the wordmark and the four section links", () => {
    render(<Header />);

    expect(
      screen.getByRole("button", { name: "luminous studios." }),
    ).toBeInTheDocument();

    const nav = screen.getByRole("navigation", { name: "Primary" });
    const links = within(nav).getAllByRole("link");
    expect(links.map((link) => link.textContent)).toEqual([
      "Services",
      "Work",
      "Studio",
      "Contact",
    ]);
  });

  it("scrolls to the matching section when a nav link is activated", async () => {
    const user = userEvent.setup();
    const scrollIntoView = vi.fn();
    Element.prototype.scrollIntoView = scrollIntoView;

    render(<Header />);
    const nav = screen.getByRole("navigation", { name: "Primary" });

    await user.click(within(nav).getByRole("link", { name: "Services" }));

    expect(scrollIntoView).toHaveBeenCalledTimes(1);
    const target = scrollIntoView.mock.instances[0] as unknown as HTMLElement;
    expect(target.id).toBe("services");
  });

  it("opens and closes the mobile menu accessibly", async () => {
    const user = userEvent.setup();
    render(<Header />);

    const toggle = screen.getByRole("button", { name: "Open menu" });
    expect(toggle).toHaveAttribute("aria-expanded", "false");

    const panel = document.getElementById("mobile-nav");
    expect(panel).not.toBeNull();
    expect(panel).toHaveAttribute("hidden");

    await user.click(toggle);

    expect(screen.getByRole("button", { name: "Close menu" })).toHaveAttribute(
      "aria-expanded",
      "true",
    );
    expect(panel).not.toHaveAttribute("hidden");

    await user.click(screen.getByRole("button", { name: "Close menu" }));
    expect(screen.getByRole("button", { name: "Open menu" })).toHaveAttribute(
      "aria-expanded",
      "false",
    );
    expect(panel).toHaveAttribute("hidden");
  });

  it("closes the mobile menu on Escape and returns focus to the toggle", async () => {
    const user = userEvent.setup();
    render(<Header />);

    const toggle = screen.getByRole("button", { name: "Open menu" });
    await user.click(toggle);
    expect(screen.getByRole("button", { name: "Close menu" })).toHaveAttribute(
      "aria-expanded",
      "true",
    );

    await user.keyboard("{Escape}");

    const reopened = screen.getByRole("button", { name: "Open menu" });
    expect(reopened).toHaveAttribute("aria-expanded", "false");
    expect(reopened).toHaveFocus();
  });

  it("closes the mobile menu after navigating from it", async () => {
    const user = userEvent.setup();
    Element.prototype.scrollIntoView = vi.fn();
    render(<Header />);

    await user.click(screen.getByRole("button", { name: "Open menu" }));

    const mobileNav = screen.getByRole("navigation", { name: "Mobile" });
    await user.click(within(mobileNav).getByRole("link", { name: /Work/ }));

    expect(screen.getByRole("button", { name: "Open menu" })).toHaveAttribute(
      "aria-expanded",
      "false",
    );
  });
});
