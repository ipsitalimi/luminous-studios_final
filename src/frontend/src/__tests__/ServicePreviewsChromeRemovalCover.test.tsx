import { fireEvent, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";

import { ServicesSection } from "@/components/site/ServicesSection";

/**
 * Cover for the accepted change to the right-hand preview panel of the What We
 * Do section: the fake browser/computer window frame is removed.
 *
 * The request removes the browser chrome (the three window dots and the
 * address bar) and the bordered screen-like mockup boxes, so the panel reads as
 * a clean, open capabilities showcase, while keeping the panel's position,
 * dimensions, alignment, the two-column layout, the four service-specific
 * content sets, the desktop hover switching, the mobile tap switching and the
 * separate desktop/mobile previews.
 *
 * These tests assert the observable contract of the removal and the preserved
 * composition — the absence of chrome markup, the presence of the capability
 * showcase, the fixed frame, the numbering and the two preview surfaces — not
 * pixel values or animation timing.
 *
 * jsdom does not apply media queries, so the laptop panel is always in the DOM
 * and can be exercised directly; the mobile accordion is asserted separately.
 */

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

/** The four service toggles, in order. */
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

describe("ServicePreviews — browser chrome removed", () => {
  it("renders no browser window dots or address bar in the preview panel", () => {
    render(<ServicesSection />);

    const panel = previewPanel();
    // The old chrome was three small rounded window dots plus a wide
    // address-bar strip. Neither survives in the clean showcase.
    expect(
      panel.querySelectorAll(".h-1\\.5.w-1\\.5.rounded-full"),
    ).toHaveLength(0);
    expect(
      panel.querySelector(".h-3.flex-1.rounded-sm.bg-background"),
    ).toBeNull();
  });

  it("renders no device/screen mockup frame in the preview panel", () => {
    render(<ServicesSection />);

    const panel = previewPanel();
    // The old previews drew a bordered device frame (rounded-[0.75rem] border
    // bg-background) around a screen. The clean showcase has no such frame.
    expect(panel.querySelector(".rounded-\\[0\\.75rem\\]")).toBeNull();
  });

  it("keeps the panel as a clean open capabilities showcase", () => {
    render(<ServicesSection />);

    const panel = previewPanel();
    // The panel keeps its fixed, clipping frame and its four content sets.
    expect(panel.className).toContain("h-[26rem]");
    expect(panel.className).toContain("overflow-hidden");
    expect(previewChildren()).toHaveLength(4);

    // Each preview is an open column of capability groups, not a framed
    // screen: every preview root is a full-bleed flex column.
    for (const child of previewChildren()) {
      const root = child.firstElementChild as HTMLElement | null;
      expect(root).not.toBeNull();
      expect(root!.className).toContain("absolute");
      expect(root!.className).toContain("inset-0");
      expect(root!.className).toContain("flex-col");
    }
  });
});

describe("ServicePreviews — preserved panel composition", () => {
  it("keeps the panel in its sticky right column with the live preview caption", () => {
    render(<ServicesSection />);

    const wrapper = previewPanel().parentElement;
    expect(wrapper).not.toBeNull();
    expect(wrapper!.className).toContain("sticky");
    expect(wrapper!.className).toContain("top-28");
    expect(previewPanel().nextElementSibling?.textContent).toContain(
      "Live preview",
    );
  });

  it("keeps the four services numbered 01, 02, 03 and 04", () => {
    render(<ServicesSection />);

    const rows = screen.getAllByRole("listitem");
    expect(rows).toHaveLength(4);
    rows.forEach((row, index) => {
      expect(row.querySelector(".service-number")?.textContent).toBe(
        `0${index + 1}`,
      );
    });
  });

  it("keeps a distinct, non-blank content set for each of the four services", () => {
    render(<ServicesSection />);

    const signatures = previewChildren().map(
      (child) => child.textContent?.trim() ?? "",
    );
    for (const signature of signatures) {
      expect(signature.length).toBeGreaterThan(0);
    }
    expect(new Set(signatures).size).toBe(4);
  });
});

describe("ServicePreviews — preserved desktop and mobile switching", () => {
  it("switches the desktop preview on hover and restores the selection on leave", async () => {
    const user = userEvent.setup();
    render(<ServicesSection />);

    await user.hover(toggles()[2]);
    expect(activePreviews()).toHaveLength(1);
    expect(activePreviews()[0]).toBe(previewChildren()[2]);
    expect(previewPanel().nextElementSibling?.textContent).toContain(
      SERVICE_NAMES[2],
    );

    await user.unhover(toggles()[2]);
    expect(activePreviews()[0]).toBe(previewChildren()[0]);
  });

  it("switches the mobile preview on tap, one service at a time", async () => {
    const user = userEvent.setup();
    render(<ServicesSection />);

    const buttons = toggles();
    expect(buttons[0]).toHaveAttribute("aria-expanded", "true");
    expect(buttons[1]).toHaveAttribute("aria-expanded", "false");

    await user.click(buttons[3]);
    expect(buttons[3]).toHaveAttribute("aria-expanded", "true");
    expect(buttons[0]).toHaveAttribute("aria-expanded", "false");

    const panel = document.getElementById("service-panel-3");
    expect(panel).not.toBeNull();
    expect(panel!.querySelector(".h-40")).not.toBeNull();
  });

  it("keeps a separate mobile preview frame distinct from the desktop panel", () => {
    render(<ServicesSection />);

    const panel = document.getElementById("service-panel-0");
    expect(panel).not.toBeNull();
    const mobileFrame = panel!.querySelector(".h-40");
    expect(mobileFrame).not.toBeNull();
    expect(mobileFrame).not.toBe(previewPanel());
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
