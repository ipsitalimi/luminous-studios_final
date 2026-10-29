import { act, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it } from "vitest";

import { ApproachSection } from "@/components/site/ApproachSection";
import { ServicesSection } from "@/components/site/ServicesSection";
import { WorkSection } from "@/components/site/WorkSection";

/**
 * Cover for the accepted redesign of the three middle sections. These assert
 * the observable composition contract — panel count and layering, the
 * asymmetrical editorial services spread, and the alternating connected
 * approach journey — not pixel values or animation timing.
 *
 * The scroll-driven behaviour (sticky stacking, progressive path, active-step
 * highlight) is driven by IntersectionObserver, which jsdom does not implement.
 * A controllable observer is installed so the tests can deliver the same
 * entries the browser would and assert the resulting state.
 */

type ObserverCallback = (entries: IntersectionObserverEntry[]) => void;

interface ControllableObserver {
  callback: ObserverCallback;
  targets: Element[];
  disconnect: () => void;
}

let observers: ControllableObserver[] = [];

function installControllableObserver() {
  observers = [];
  class TestIntersectionObserver {
    callback: ObserverCallback;
    targets: Element[] = [];
    constructor(callback: ObserverCallback) {
      this.callback = callback;
      observers.push(this as unknown as ControllableObserver);
    }
    observe(target: Element) {
      this.targets.push(target);
    }
    unobserve() {}
    disconnect() {}
    takeRecords() {
      return [];
    }
  }
  // The shared setup defines a non-configurable no-op observer, so assign
  // through the writable property rather than redefining it.
  (
    window as unknown as { IntersectionObserver: unknown }
  ).IntersectionObserver = TestIntersectionObserver;
}

/** Deliver an intersecting entry for one observed target to every observer. */
function intersect(target: Element) {
  const entry = {
    target,
    isIntersecting: true,
    intersectionRatio: 1,
  } as unknown as IntersectionObserverEntry;
  act(() => {
    for (const observer of observers) {
      if (observer.targets.includes(target)) {
        observer.callback([entry]);
      }
    }
  });
}

beforeEach(() => {
  installControllableObserver();
});

afterEach(() => {
  observers = [];
});

describe("WorkSection — stacking deck", () => {
  it("renders exactly four project panels in a stacking deck", () => {
    render(<WorkSection />);

    const deck = document.querySelector(".work-deck");
    expect(deck).not.toBeNull();

    const panels = deck!.querySelectorAll("article.work-panel");
    expect(panels).toHaveLength(4);
  });

  it("layers each panel over the previous one with an increasing z-index", () => {
    render(<WorkSection />);

    const panels = Array.from(
      document.querySelectorAll<HTMLElement>("article.work-panel"),
    );
    expect(panels.map((panel) => panel.style.zIndex)).toEqual([
      "1",
      "2",
      "3",
      "4",
    ]);
  });

  it("keeps each panel's heading, discipline label, note and preview", () => {
    render(<WorkSection />);

    const panels = Array.from(
      document.querySelectorAll<HTMLElement>("article.work-panel"),
    );

    const expected = [
      {
        title: "A better way to get enquiries",
        discipline: "Website / Independent concept",
        preview: "northfield-joinery.co.uk",
      },
      {
        title: "Less admin. More clarity.",
        discipline: "Web application / Independent concept",
        preview: "Ledger",
      },
      {
        title: "From idea to interface",
        discipline: "Digital product / Independent concept",
        preview: "Cadence",
      },
    ] as const;

    expected.forEach(({ title, discipline, preview }, index) => {
      const panel = panels[index];
      expect(
        within(panel).getByRole("heading", { name: title }),
      ).toBeInTheDocument();
      expect(within(panel).getByText(discipline)).toBeInTheDocument();
      expect(within(panel).getByText(preview)).toBeInTheDocument();
    });
  });

  it("marks the panel currently in view as active", () => {
    render(<WorkSection />);

    const panels = Array.from(
      document.querySelectorAll<HTMLElement>("article.work-panel"),
    );

    // The first panel's number starts active; the others are muted.
    const numberClass = (panel: HTMLElement) =>
      panel.querySelector("span[aria-hidden='true']")?.className ?? "";
    expect(numberClass(panels[0])).toContain("text-accent");
    expect(numberClass(panels[1])).not.toContain("text-accent");

    intersect(panels[2]);

    expect(numberClass(panels[2])).toContain("text-accent");
    expect(numberClass(panels[0])).not.toContain("text-accent");
  });
});

describe("ServicesSection — interactive service selector", () => {
  it("keeps all four services with their exact names and descriptions", () => {
    render(<ServicesSection />);

    const rows = screen.getAllByRole("listitem");
    expect(rows).toHaveLength(4);

    const expected = [
      [
        "Websites & landing pages",
        "Business websites, landing pages and redesigns built to explain what you offer and make the next step clear.",
      ],
      [
        "Apps & digital products",
        "Web apps, mobile apps and MVPs—from the first product concept to a working application.",
      ],
      [
        "Custom software & automation",
        "Internal tools, dashboards, integrations and automated workflows that reduce manual work.",
      ],
      [
        "Digital growth & optimisation",
        "Landing-page improvements, analytics setup and technical SEO to help you understand and improve your website.",
      ],
    ] as const;

    expected.forEach(([name, description], index) => {
      const row = rows[index];
      expect(within(row).getByRole("heading", { name })).toBeInTheDocument();
      expect(within(row).getAllByText(description).length).toBeGreaterThan(0);
    });
  });

  it("uses an open editorial list rather than generic rounded cards", () => {
    render(<ServicesSection />);

    const rows = screen.getAllByRole("listitem");
    for (const row of rows) {
      // The row and its toggle carry no rounded-card treatment.
      expect(row.className).not.toContain("rounded");
      const toggle = within(row).getByRole("button", {
        name: /Websites|Apps|Custom|Digital/,
      });
      expect(toggle.className).not.toContain("rounded");
      // Each area is anchored by an oversized number and a fine rule.
      expect(row.querySelector(".service-number")).not.toBeNull();
      expect(row.className).toContain("rule-hairline");
    }
  });

  it("expands exactly one service at a time from its toggle", async () => {
    const user = userEvent.setup();
    render(<ServicesSection />);

    const toggles = screen.getAllByRole("button", {
      name: /Websites|Apps|Custom|Digital/,
    });
    // The first service starts open; the rest are collapsed.
    expect(toggles[0]).toHaveAttribute("aria-expanded", "true");
    expect(toggles[1]).toHaveAttribute("aria-expanded", "false");

    await user.click(toggles[2]);
    expect(toggles[2]).toHaveAttribute("aria-expanded", "true");
    expect(toggles[0]).toHaveAttribute("aria-expanded", "false");
  });

  it("offers a working contact link for every service", () => {
    render(<ServicesSection />);

    for (let index = 1; index <= 4; index += 1) {
      expect(
        document.querySelector(`[data-ocid="services.link.${index}"]`),
      ).not.toBeNull();
    }
  });

  it("renders a live preview panel on laptop", () => {
    render(<ServicesSection />);

    expect(
      document.querySelector('[data-ocid="services.preview"]'),
    ).not.toBeNull();
  });
});

describe("ApproachSection — connected alternating journey", () => {
  it("keeps all four steps with their exact titles and descriptions", () => {
    render(<ApproachSection />);

    const steps = screen.getAllByRole("listitem");
    expect(steps).toHaveLength(4);

    const expected = [
      ["Understand", "We start with the problem, the people and the outcome."],
      [
        "Plan",
        "We agree on the scope and choose an approach that makes sense.",
      ],
      ["Build", "We design, develop, test and refine the work."],
      [
        "Launch",
        "We hand over a finished product and make the next steps clear.",
      ],
    ] as const;

    expected.forEach(([title, description], index) => {
      const step = steps[index];
      expect(
        within(step).getByRole("heading", { name: title }),
      ).toBeInTheDocument();
      expect(within(step).getByText(description)).toBeInTheDocument();
    });
  });

  it("alternates the four steps left and right along a continuous path", () => {
    render(<ApproachSection />);

    const steps = Array.from(
      document.querySelectorAll<HTMLElement>("li.approach-step"),
    );
    expect(steps).toHaveLength(4);

    // Odd steps sit in the right column, even steps in the left.
    expect(steps[0].className).toContain("lg:col-start-1");
    expect(steps[1].className).toContain("lg:col-start-2");
    expect(steps[2].className).toContain("lg:col-start-1");
    expect(steps[3].className).toContain("lg:col-start-2");

    // Each card enters from its own side.
    expect(steps[0].className).toContain("from-left");
    expect(steps[1].className).toContain("from-right");
    expect(steps[2].className).toContain("from-left");
    expect(steps[3].className).toContain("from-right");

    // A continuous directional path runs behind the cards.
    expect(document.querySelector(".approach-path")).not.toBeNull();
    expect(document.querySelector(".approach-path-fill")).not.toBeNull();
  });

  it("reveals each step as it enters and highlights the active step", () => {
    render(<ApproachSection />);

    const steps = Array.from(
      document.querySelectorAll<HTMLElement>("li.approach-step"),
    );

    // Nothing is revealed before the visitor scrolls.
    for (const step of steps) {
      expect(step.className).not.toContain("is-revealed");
    }

    intersect(steps[0]);
    expect(steps[0].className).toContain("is-revealed");
    expect(steps[1].className).not.toContain("is-revealed");

    // The active step's number picks up the accent.
    const numberClass = (step: HTMLElement) =>
      step.querySelector(".approach-number")?.className ?? "";
    expect(numberClass(steps[0])).toContain("text-accent");
    expect(numberClass(steps[1])).not.toContain("text-accent");

    intersect(steps[1]);
    expect(steps[1].className).toContain("is-revealed");
    expect(numberClass(steps[1])).toContain("text-accent");
  });

  it("keeps completed steps revealed without replaying their entrance", () => {
    render(<ApproachSection />);

    const steps = Array.from(
      document.querySelectorAll<HTMLElement>("li.approach-step"),
    );

    intersect(steps[0]);
    intersect(steps[1]);
    intersect(steps[2]);

    // Every step reached so far stays revealed.
    expect(steps[0].className).toContain("is-revealed");
    expect(steps[1].className).toContain("is-revealed");
    expect(steps[2].className).toContain("is-revealed");
    expect(steps[3].className).not.toContain("is-revealed");

    // The active step never moves backwards.
    const numberClass = (step: HTMLElement) =>
      step.querySelector(".approach-number")?.className ?? "";
    expect(numberClass(steps[2])).toContain("text-accent");
    expect(numberClass(steps[0])).not.toContain("text-accent");
  });

  it("draws the connecting line progressively as steps are revealed", () => {
    render(<ApproachSection />);

    const fill = document.querySelector<HTMLElement>(".approach-path-fill");
    expect(fill).not.toBeNull();

    // No progress before any step is in view.
    expect(fill!.style.transform).toBe("scaleY(0)");

    const steps = Array.from(
      document.querySelectorAll<HTMLElement>("li.approach-step"),
    );
    intersect(steps[0]);
    expect(fill!.style.transform).toBe("scaleY(0.25)");

    intersect(steps[3]);
    expect(fill!.style.transform).toBe("scaleY(1)");
  });
});
