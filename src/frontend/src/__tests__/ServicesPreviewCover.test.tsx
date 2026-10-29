import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";

import { ServicesSection } from "@/components/site/ServicesSection";

/**
 * Cover for the accepted fix to the laptop live-preview panel of the What We
 * Do section.
 *
 * The regression was that the right-hand preview could collapse, be clipped or
 * be hidden by an incorrect active-state condition, so the panel read as blank
 * for some services. These tests assert the observable contract of the panel
 * itself — that it keeps its fixed frame, that exactly one preview is ever
 * active, that the active preview is non-blank and matches the selected
 * service, and that the two richest previews (03 dashboard, 04 analytics) are
 * actually rendered — rather than pixel values or animation timing.
 *
 * jsdom does not apply media queries, so the laptop panel is always in the DOM
 * and can be exercised directly. The mobile accordion is asserted separately to
 * confirm it is untouched.
 */

/** The laptop preview frame. */
function previewPanel(): HTMLElement {
  const panel = document.querySelector<HTMLElement>(
    '[data-ocid="services.preview"]',
  );
  if (!panel) throw new Error("services.preview panel not found");
  return panel;
}

/** The section root that owns the desktop overflow behaviour. */
function sectionRoot(): HTMLElement {
  const section = document.querySelector<HTMLElement>(
    '[data-ocid="services.section"]',
  );
  if (!section) throw new Error("services.section root not found");
  return section;
}

/** The wrapper that makes the preview stick on laptop. */
function stickyWrapper(): HTMLElement {
  const wrapper = previewPanel().parentElement;
  if (!wrapper) throw new Error("services.preview has no sticky wrapper");
  return wrapper;
}

/** The four stacked preview wrappers, in service order. */
function previewChildren(): HTMLElement[] {
  return Array.from(previewPanel().children) as HTMLElement[];
}

/** The single preview wrapper currently shown (opacity-100). */
function activePreviews(): HTMLElement[] {
  return previewChildren().filter((child) =>
    child.className.includes("opacity-100"),
  );
}

/** The caption under the frame names the service being previewed. */
function previewCaption(): string {
  return previewPanel().nextElementSibling?.textContent ?? "";
}

/** The service toggles, in order. */
function toggles(): HTMLElement[] {
  return screen.getAllByRole("button", {
    name: /Websites|Apps|Custom|Digital/,
  });
}

const SERVICE_NAMES = [
  "Websites & landing pages",
  "Apps & digital products",
  "Custom software & automation",
  "Digital growth & optimisation",
] as const;

describe("ServicesSection — laptop preview panel frame", () => {
  it("keeps a fixed, non-collapsing frame that clips its own content", () => {
    render(<ServicesSection />);

    const panel = previewPanel();
    // A fixed height plus overflow-hidden is what keeps the panel from
    // collapsing or spilling outside its container as the active service
    // changes.
    expect(panel.className).toContain("h-[26rem]");
    expect(panel.className).toContain("overflow-hidden");
    expect(panel.className).toContain("relative");
  });

  it("stacks exactly one preview wrapper per service inside the frame", () => {
    render(<ServicesSection />);

    expect(previewChildren()).toHaveLength(4);
  });
});

describe("ServicesSection — desktop sticky preview", () => {
  it("lets the section stop clipping on laptop while keeping mobile overflow-hidden", () => {
    render(<ServicesSection />);

    // The base class keeps the mobile layout clipping as before; the lg:
    // variant releases it so the descendant sticky preview can stick.
    const className = sectionRoot().className;
    expect(className).toContain("overflow-hidden");
    expect(className).toContain("lg:overflow-visible");
  });

  it("sticks the preview wrapper below the header on laptop", () => {
    render(<ServicesSection />);

    const wrapper = stickyWrapper();
    expect(wrapper.className).toContain("sticky");
    expect(wrapper.className).toContain("top-28");
  });

  it("keeps the sticky wrapper as the preview frame's direct parent in the right column", () => {
    render(<ServicesSection />);

    // The frame must sit inside the sticky wrapper, not be the sticky element
    // itself, so the caption below it travels with the panel.
    expect(stickyWrapper().contains(previewPanel())).toBe(true);
    expect(previewPanel().className).not.toContain("sticky");
  });
});

describe("ServicesSection — active preview switching", () => {
  it("shows exactly one non-blank preview at a time for every service", () => {
    render(<ServicesSection />);

    for (let index = 0; index < SERVICE_NAMES.length; index += 1) {
      // Select the service, then assert the panel state it produced.
      fireEvent.click(toggles()[index]);

      const active = activePreviews();
      // Never zero (blank/hidden) and never more than one (incorrect
      // active-state condition).
      expect(active).toHaveLength(1);
      // The active wrapper is the one matching the service, and it renders
      // real content rather than an empty frame.
      expect(active[0]).toBe(previewChildren()[index]);
      expect(active[0].querySelectorAll("*").length).toBeGreaterThan(5);
    }
  });

  it("keeps the panel visible and correct while cycling 01 -> 02 -> 03 -> 04 and back", async () => {
    const user = userEvent.setup();
    render(<ServicesSection />);

    const order = [0, 1, 2, 3, 2, 1, 0];
    for (const index of order) {
      await user.click(toggles()[index]);

      const active = activePreviews();
      expect(active).toHaveLength(1);
      expect(active[0]).toBe(previewChildren()[index]);
      expect(previewCaption()).toContain(SERVICE_NAMES[index]);
      expect(active[0].querySelectorAll("*").length).toBeGreaterThan(5);
    }
  });

  it("updates the active preview on keyboard focus", () => {
    render(<ServicesSection />);

    const buttons = toggles();
    buttons[3].focus();
    fireEvent.focusIn(buttons[3]);

    const active = activePreviews();
    expect(active).toHaveLength(1);
    expect(active[0]).toBe(previewChildren()[3]);
    expect(previewCaption()).toContain(SERVICE_NAMES[3]);
  });
});

describe("ServicesSection — preview content per service", () => {
  it("renders a detailed workflow dashboard for Custom software & automation (03)", async () => {
    const user = userEvent.setup();
    render(<ServicesSection />);

    await user.click(toggles()[2]);

    const active = activePreviews()[0];
    // The automation run draws four connected stages.
    expect(
      active.querySelectorAll(".flex-col.items-center.gap-1"),
    ).toHaveLength(4);
    // And a records table with four rows.
    expect(active.querySelectorAll(".divide-y > div")).toHaveLength(4);
  });

  it("renders its own analytics preview for Digital growth & optimisation (04)", async () => {
    const user = userEvent.setup();
    render(<ServicesSection />);

    await user.click(toggles()[3]);

    const active = activePreviews()[0];
    // The trend chart draws seven bars, each with an explicit height.
    expect(active.querySelectorAll('[style*="height"]')).toHaveLength(7);
    // The report opens with three metric tiles.
    expect(active.querySelectorAll(".grid-cols-3 > div")).toHaveLength(3);
  });
});

describe("ServicesSection — mobile accordion unchanged", () => {
  it("still expands exactly one service at a time from its toggle", async () => {
    const user = userEvent.setup();
    render(<ServicesSection />);

    const buttons = toggles();
    expect(buttons[0]).toHaveAttribute("aria-expanded", "true");
    expect(buttons[1]).toHaveAttribute("aria-expanded", "false");

    await user.click(buttons[2]);
    expect(buttons[2]).toHaveAttribute("aria-expanded", "true");
    expect(buttons[0]).toHaveAttribute("aria-expanded", "false");
  });
});
