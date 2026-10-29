import { fireEvent, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

// The contact form is the only consumer of the backend hook. Mock the hook
// module so the composed page renders without an actor, an agent or a network
// call.
vi.mock("@/hooks/useQueries", () => ({
  useSubmitEnquiry: () => ({
    mutate: vi.fn(),
    isPending: false,
  }),
}));

import App from "@/App";
import { ServicesSection } from "@/components/site/ServicesSection";

/**
 * Cover for the accepted reorder and the redesigned What We Do section.
 *
 * The request moves the top-level sections into Hero, What We Do, Selected
 * Work, How We Work, Studio, Contact, Footer while preserving every section id
 * and navigation anchor, and rebuilds What We Do as an interactive list with a
 * live preview. These assert the observable composition contract — DOM order,
 * scroll targets and preview selection — not pixel values or animation timing.
 */

/** The accepted top-level order, keyed by the section's own marker. */
const SECTION_ORDER = [
  "hero.section",
  "services.section",
  "work.section",
  "approach.section",
  "studio.section",
  "contact.section",
  "footer.section",
] as const;

describe("App — accepted section order", () => {
  it("renders the sections in the accepted order", () => {
    render(<App />);

    const markers = Array.from(
      document.querySelectorAll<HTMLElement>("[data-ocid]"),
    )
      .map((node) => node.dataset.ocid ?? "")
      .filter((ocid) => (SECTION_ORDER as readonly string[]).includes(ocid));

    expect(markers).toEqual([...SECTION_ORDER]);
  });

  it("keeps every navigable section id on the reordered page", () => {
    render(<App />);

    for (const id of ["work", "services", "studio", "contact"]) {
      expect(document.getElementById(id)).not.toBeNull();
    }
  });
});

describe("App — navigation after the reorder", () => {
  it("scrolls each header link to the section it names", async () => {
    const user = userEvent.setup();
    const scrollIntoView = vi.fn();
    Element.prototype.scrollIntoView = scrollIntoView;

    render(<App />);
    const headerNav = screen.getByRole("navigation", { name: "Primary" });

    for (const [label, id] of [
      ["Services", "services"],
      ["Work", "work"],
      ["Studio", "studio"],
      ["Contact", "contact"],
    ] as const) {
      scrollIntoView.mockClear();
      await user.click(within(headerNav).getByRole("link", { name: label }));

      expect(scrollIntoView).toHaveBeenCalledTimes(1);
      const target = scrollIntoView.mock.instances[0] as unknown as HTMLElement;
      expect(target.id).toBe(id);
    }
  });

  it("scrolls each footer link to the section it names", async () => {
    const user = userEvent.setup();
    const scrollIntoView = vi.fn();
    Element.prototype.scrollIntoView = scrollIntoView;

    render(<App />);
    const footerNav = screen.getByRole("navigation", { name: "Footer" });

    for (const [label, id] of [
      ["Services", "services"],
      ["Work", "work"],
      ["Studio", "studio"],
      ["Contact", "contact"],
    ] as const) {
      scrollIntoView.mockClear();
      await user.click(within(footerNav).getByRole("link", { name: label }));

      expect(scrollIntoView).toHaveBeenCalledTimes(1);
      const target = scrollIntoView.mock.instances[0] as unknown as HTMLElement;
      expect(target.id).toBe(id);
    }
  });
});

describe("ServicesSection — live preview selection", () => {
  /**
   * The caption under the laptop preview names the service being previewed.
   * It is the sibling that follows the preview frame inside the sticky column.
   */
  const previewCaption = () => {
    const preview = document.querySelector<HTMLElement>(
      '[data-ocid="services.preview"]',
    );
    return preview?.nextElementSibling?.textContent ?? "";
  };

  it("starts with the first service previewed", () => {
    render(<ServicesSection />);

    expect(previewCaption()).toContain("Websites & landing pages");
  });

  it("updates the live preview on hover and restores the selection on leave", async () => {
    const user = userEvent.setup();
    render(<ServicesSection />);

    const toggles = screen.getAllByRole("button", {
      name: /Websites|Apps|Custom|Digital/,
    });

    await user.hover(toggles[2]);
    expect(previewCaption()).toContain("Custom software & automation");

    // Leaving the list falls back to the clicked selection (still the first).
    await user.unhover(toggles[2]);
    expect(previewCaption()).toContain("Websites & landing pages");
  });

  it("updates the live preview on focus", async () => {
    const user = userEvent.setup();
    render(<ServicesSection />);

    const toggles = screen.getAllByRole("button", {
      name: /Websites|Apps|Custom|Digital/,
    });

    // Tabbing into the list focuses the first service toggle.
    await user.tab();
    expect(toggles[0]).toHaveFocus();
    expect(previewCaption()).toContain("Websites & landing pages");

    // Focusing the fourth service moves the preview to it.
    toggles[3].focus();
    fireEvent.focusIn(toggles[3]);
    expect(toggles[3]).toHaveFocus();
    expect(previewCaption()).toContain("Digital growth & optimisation");
  });

  it("keeps the clicked service selected after the pointer leaves", async () => {
    const user = userEvent.setup();
    render(<ServicesSection />);

    const toggles = screen.getAllByRole("button", {
      name: /Websites|Apps|Custom|Digital/,
    });

    await user.click(toggles[1]);
    expect(previewCaption()).toContain("Apps & digital products");

    await user.unhover(toggles[1]);
    expect(previewCaption()).toContain("Apps & digital products");
  });

  it("expands exactly one service at a time in the mobile list", async () => {
    const user = userEvent.setup();
    render(<ServicesSection />);

    const toggles = screen.getAllByRole("button", {
      name: /Websites|Apps|Custom|Digital/,
    });

    expect(toggles[0]).toHaveAttribute("aria-expanded", "true");
    expect(toggles[1]).toHaveAttribute("aria-expanded", "false");

    await user.click(toggles[3]);
    expect(toggles[3]).toHaveAttribute("aria-expanded", "true");
    expect(toggles[0]).toHaveAttribute("aria-expanded", "false");
  });
});
