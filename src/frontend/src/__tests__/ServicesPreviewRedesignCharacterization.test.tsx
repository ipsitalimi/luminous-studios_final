import { fireEvent, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";

import { ServicesSection } from "@/components/site/ServicesSection";

/**
 * Characterization baseline for the What We Do section, taken before the
 * internal composition of the right-hand preview panel is redesigned into a
 * larger editorial typographic composition.
 *
 * The accepted request changes only the *internal composition* of the four
 * previews (and the structural counts inside previews 03 and 04). It explicitly
 * keeps the left panel layout, spacing, typography, descriptions, "Best for"
 * lines, links and all four service titles, the two-column layout and the
 * section dimensions, and it keeps the desktop hover-driven preview and the
 * mobile tap-driven preview separate, each showing the full legible content for
 * all four services.
 *
 * These tests pin those preserved invariants so the redesign cannot silently
 * regress them. Deliberately NOT asserted here: the previews' internal markup,
 * their capability rows, their headings, their tech footers, and the workflow
 * node / chart bar / metric tile counts — all of that is the behaviour the
 * request intentionally changes, so freezing it would be wrong.
 *
 * jsdom does not apply media queries, so the laptop panel is always in the DOM
 * and can be exercised directly; the mobile accordion is asserted separately.
 */

const SERVICE_NAMES = [
  "Websites & landing pages",
  "Apps & digital products",
  "Custom software & automation",
  "Digital growth & optimisation",
] as const;

const SERVICE_DESCRIPTIONS = [
  "Business websites, landing pages and redesigns built to explain what you offer and make the next step clear.",
  "Web apps, mobile apps and MVPs—from the first product concept to a working application.",
  "Internal tools, dashboards, integrations and automated workflows that reduce manual work.",
  "Landing-page improvements, analytics setup and technical SEO to help you understand and improve your website.",
] as const;

const SERVICE_BEST_FOR = [
  "Businesses that need a website or a better one.",
  "Founders and businesses building a digital product.",
  "Teams dealing with repetitive tasks or disconnected systems.",
  "Businesses looking to get more from an existing website.",
] as const;

/** The laptop preview frame. */
function previewPanel(): HTMLElement {
  const panel = document.querySelector<HTMLElement>(
    '[data-ocid="services.preview"]',
  );
  if (!panel) throw new Error("services.preview panel not found");
  return panel;
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

/** The four service toggles, in order. */
function toggles(): HTMLElement[] {
  return screen.getAllByRole("button", {
    name: /Websites|Apps|Custom|Digital/,
  });
}

describe("ServicesSection — preserved left panel", () => {
  it("keeps the heading, intro and all four service titles with exact copy", () => {
    render(<ServicesSection />);

    expect(
      screen.getByRole("heading", { name: "What are you looking to build?" }),
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        /From business websites to custom applications, we design and develop/,
      ),
    ).toBeInTheDocument();

    const rows = screen.getAllByRole("listitem");
    expect(rows).toHaveLength(4);

    SERVICE_NAMES.forEach((name, index) => {
      const row = rows[index];
      expect(within(row).getByRole("heading", { name })).toBeInTheDocument();
      // The oversized editorial numeral is preserved.
      expect(row.querySelector(".service-number")?.textContent).toBe(
        `0${index + 1}`,
      );
    });
  });

  it("keeps every service description and BEST FOR line", () => {
    render(<ServicesSection />);

    const rows = screen.getAllByRole("listitem");
    SERVICE_DESCRIPTIONS.forEach((description, index) => {
      expect(
        within(rows[index]).getAllByText(description).length,
      ).toBeGreaterThan(0);
    });
    SERVICE_BEST_FOR.forEach((bestFor, index) => {
      expect(within(rows[index]).getAllByText(bestFor).length).toBeGreaterThan(
        0,
      );
    });
  });

  it("keeps a 'Discuss this project' control for every service", () => {
    render(<ServicesSection />);

    for (let index = 1; index <= 4; index += 1) {
      expect(
        document.querySelector(`[data-ocid="services.link.${index}"]`),
      ).not.toBeNull();
      expect(
        document.querySelector(`[data-ocid="services.link.desktop.${index}"]`),
      ).not.toBeNull();
    }
  });
});

describe("ServicesSection — preserved two-column composition and dimensions", () => {
  it("keeps the left service list and the right live preview panel as siblings", () => {
    render(<ServicesSection />);

    const list = document.querySelector('[data-ocid="services.list"]');
    expect(list).not.toBeNull();
    expect(list!.tagName).toBe("OL");

    // The preview panel is a sibling column, not nested inside the list.
    expect(list!.contains(previewPanel())).toBe(false);
    expect(previewPanel()).toBeInTheDocument();
  });

  it("keeps the fixed, clipping preview frame with one wrapper per service", () => {
    render(<ServicesSection />);

    const panel = previewPanel();
    expect(panel.className).toContain("h-[26rem]");
    expect(panel.className).toContain("overflow-hidden");
    expect(panel.className).toContain("relative");
    expect(previewChildren()).toHaveLength(4);
  });

  it("keeps the sticky wrapper as the frame's direct parent with its caption", () => {
    render(<ServicesSection />);

    const wrapper = previewPanel().parentElement;
    expect(wrapper).not.toBeNull();
    expect(wrapper!.className).toContain("sticky");
    expect(wrapper!.className).toContain("top-28");
    expect(previewPanel().className).not.toContain("sticky");
    expect(previewCaption()).toContain("Live preview");
  });
});

describe("ServicesSection — preserved desktop hover-driven preview", () => {
  it("starts with the first service previewed and shows exactly one non-blank preview", () => {
    render(<ServicesSection />);

    expect(previewCaption()).toContain(SERVICE_NAMES[0]);

    const active = activePreviews();
    expect(active).toHaveLength(1);
    expect(active[0]).toBe(previewChildren()[0]);
    // The active preview renders real content, not an empty frame.
    expect(active[0].querySelectorAll("*").length).toBeGreaterThan(5);
  });

  it("follows hover for every service and restores the selection on leave", async () => {
    const user = userEvent.setup();
    render(<ServicesSection />);

    for (let index = 0; index < SERVICE_NAMES.length; index += 1) {
      await user.hover(toggles()[index]);

      const active = activePreviews();
      expect(active).toHaveLength(1);
      expect(active[0]).toBe(previewChildren()[index]);
      expect(previewCaption()).toContain(SERVICE_NAMES[index]);
    }

    await user.unhover(toggles()[3]);
    expect(activePreviews()[0]).toBe(previewChildren()[0]);
  });

  it("follows keyboard focus", () => {
    render(<ServicesSection />);

    const buttons = toggles();
    buttons[3].focus();
    fireEvent.focusIn(buttons[3]);

    expect(activePreviews()).toHaveLength(1);
    expect(activePreviews()[0]).toBe(previewChildren()[3]);
    expect(previewCaption()).toContain(SERVICE_NAMES[3]);
  });

  it("keeps the clicked service selected after the pointer leaves", async () => {
    const user = userEvent.setup();
    render(<ServicesSection />);

    await user.click(toggles()[1]);
    expect(previewCaption()).toContain(SERVICE_NAMES[1]);

    await user.unhover(toggles()[1]);
    expect(previewCaption()).toContain(SERVICE_NAMES[1]);
  });
});

describe("ServicesSection — preserved mobile tap-driven preview", () => {
  it("expands exactly one service at a time from its toggle", async () => {
    const user = userEvent.setup();
    render(<ServicesSection />);

    const buttons = toggles();
    expect(buttons[0]).toHaveAttribute("aria-expanded", "true");
    expect(buttons[1]).toHaveAttribute("aria-expanded", "false");

    await user.click(buttons[2]);
    expect(buttons[2]).toHaveAttribute("aria-expanded", "true");
    expect(buttons[0]).toHaveAttribute("aria-expanded", "false");
  });

  it("keeps a separate mobile preview frame distinct from the desktop panel", () => {
    render(<ServicesSection />);

    const panel = document.getElementById("service-panel-0");
    expect(panel).not.toBeNull();
    const mobileFrame = panel!.querySelector(".h-40");
    expect(mobileFrame).not.toBeNull();
    expect(mobileFrame).not.toBe(previewPanel());
  });

  it("shows the full legible content for all four services in the mobile previews", async () => {
    const user = userEvent.setup();
    render(<ServicesSection />);

    const buttons = toggles();
    for (let index = 0; index < SERVICE_NAMES.length; index += 1) {
      await user.click(buttons[index]);

      const panel = document.getElementById(`service-panel-${index}`);
      expect(panel).not.toBeNull();
      // The mobile panel owns its own description and a preview frame with
      // real content, not an empty box.
      expect(
        within(panel!).getAllByText(SERVICE_DESCRIPTIONS[index]).length,
      ).toBe(1);
      const frame = panel!.querySelector(".h-40");
      expect(frame).not.toBeNull();
      expect(frame!.querySelectorAll("*").length).toBeGreaterThan(5);
    }
  });

  it("keeps the desktop preview panel hidden on mobile and shown on laptop", () => {
    render(<ServicesSection />);

    // The right column is the panel's ancestor and carries the responsive
    // visibility classes; jsdom cannot apply them, so assert them structurally.
    const column = previewPanel().closest(".hidden");
    expect(column).not.toBeNull();
    expect(column!.className).toContain("lg:block");
  });
});
