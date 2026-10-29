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
import { PROJECT_TYPE_EVENT } from "@/lib/sections";

/**
 * Characterization baseline for the *preserved* contract of the What We Do
 * section, taken before the four right-hand previews are reworked from abstract
 * decorative graphics into information-rich previews.
 *
 * The accepted request changes the preview *content* only. It explicitly keeps
 * the section copy, the two-column composition, the fixed laptop preview frame,
 * the one-active-preview-at-a-time rule, the hover/focus/click synchronisation,
 * the mobile accordion, the "Discuss this project" project-type handoff and the
 * ban on invented claims. These tests pin those invariants so the rework cannot
 * silently regress them.
 *
 * Deliberately NOT asserted here: the old abstract preview markup (stage
 * counts, bar heights, metric tiles) and the new preview copy. Both are the
 * behaviour the request intentionally changes, so freezing either would be
 * wrong. The previews are asserted only for structural invariants that must
 * survive the rework.
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

describe("ServicesSection — preserved section copy", () => {
  it("keeps the heading, intro and four numbered services with exact copy", () => {
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
      expect(
        within(row).getAllByText(SERVICE_DESCRIPTIONS[index]).length,
      ).toBeGreaterThan(0);
      expect(
        within(row).getAllByText(SERVICE_BEST_FOR[index]).length,
      ).toBeGreaterThan(0);
      // The oversized editorial numeral is preserved.
      expect(row.querySelector(".service-number")?.textContent).toBe(
        `0${index + 1}`,
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

describe("ServicesSection — preserved laptop preview frame", () => {
  it("keeps the fixed, clipping frame with one wrapper per service", () => {
    render(<ServicesSection />);

    const panel = previewPanel();
    expect(panel.className).toContain("h-[26rem]");
    expect(panel.className).toContain("overflow-hidden");
    expect(panel.className).toContain("relative");
    expect(previewChildren()).toHaveLength(4);
  });

  it("keeps the sticky wrapper as the frame's direct parent", () => {
    render(<ServicesSection />);

    const wrapper = previewPanel().parentElement;
    expect(wrapper).not.toBeNull();
    expect(wrapper!.className).toContain("sticky");
    expect(wrapper!.className).toContain("top-28");
    expect(previewPanel().className).not.toContain("sticky");
  });

  it("shows exactly one non-blank preview at a time for every service", () => {
    render(<ServicesSection />);

    for (let index = 0; index < SERVICE_NAMES.length; index += 1) {
      fireEvent.click(toggles()[index]);

      const active = activePreviews();
      expect(active).toHaveLength(1);
      expect(active[0]).toBe(previewChildren()[index]);
      // The active preview renders real content, not an empty frame.
      expect(active[0].querySelectorAll("*").length).toBeGreaterThan(5);
    }
  });
});

describe("ServicesSection — preserved hover/focus/click synchronisation", () => {
  it("starts with the first service previewed", () => {
    render(<ServicesSection />);

    expect(previewCaption()).toContain(SERVICE_NAMES[0]);
  });

  it("follows hover and restores the clicked selection on leave", async () => {
    const user = userEvent.setup();
    render(<ServicesSection />);

    await user.hover(toggles()[2]);
    expect(previewCaption()).toContain(SERVICE_NAMES[2]);

    await user.unhover(toggles()[2]);
    expect(previewCaption()).toContain(SERVICE_NAMES[0]);
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

describe("ServicesSection — preserved mobile accordion", () => {
  it("expands exactly one service at a time and renders its own preview", async () => {
    const user = userEvent.setup();
    render(<ServicesSection />);

    const buttons = toggles();
    expect(buttons[0]).toHaveAttribute("aria-expanded", "true");
    expect(buttons[1]).toHaveAttribute("aria-expanded", "false");

    await user.click(buttons[2]);
    expect(buttons[2]).toHaveAttribute("aria-expanded", "true");
    expect(buttons[0]).toHaveAttribute("aria-expanded", "false");

    // Each mobile panel owns a preview frame and its own service copy.
    const panel = document.getElementById("service-panel-2");
    expect(panel).not.toBeNull();
    expect(within(panel!).getAllByText(SERVICE_DESCRIPTIONS[2]).length).toBe(1);
    expect(panel!.querySelector(".overflow-hidden")).not.toBeNull();
  });
});

describe("ServicesSection — preserved project-type handoff", () => {
  it("dispatches the service's project type and scrolls to contact", async () => {
    const user = userEvent.setup();
    const scrollIntoView = vi.fn();
    Element.prototype.scrollIntoView = scrollIntoView;

    const received: string[] = [];
    const listener = (event: Event) => {
      received.push((event as CustomEvent<string>).detail);
    };
    window.addEventListener(PROJECT_TYPE_EVENT, listener);

    try {
      // Render the composed page: `scrollToSection("contact")` only scrolls
      // when the contact section is actually mounted.
      render(<App />);

      await user.click(
        document.querySelector<HTMLElement>(
          '[data-ocid="services.link.desktop.3"]',
        )!,
      );

      expect(received).toEqual(["Custom software"]);
      expect(scrollIntoView).toHaveBeenCalledTimes(1);
      const target = scrollIntoView.mock.instances[0] as unknown as HTMLElement;
      expect(target.id).toBe("contact");
    } finally {
      window.removeEventListener(PROJECT_TYPE_EVENT, listener);
    }
  });
});

describe("ServicesSection — preserved no-invented-claims rule", () => {
  it("shows no performance scores, rankings or percentage improvements", () => {
    render(<ServicesSection />);

    const text = document.body.textContent ?? "";
    // No percentage figures and no invented metric claims in any preview.
    expect(text).not.toMatch(/\d+\s?%/);
    expect(text).not.toMatch(/\b(rank(ed)?\s*#?\d|#1|top\s*\d)\b/i);
  });
});
