import { act, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

// The contact form is the only consumer of the backend hook. Mock the hook
// module so the page renders without an actor, an agent or a network call.
vi.mock("@/hooks/useQueries", () => ({
  useSubmitEnquiry: () => ({
    mutate: vi.fn(),
    isPending: false,
  }),
}));

import App from "@/App";

/**
 * Characterization baseline for the page's *preserved* navigation contract.
 *
 * The accepted request reorders the top-level sections and redesigns two of
 * them, but it explicitly keeps every section id, every navigation anchor and
 * the working scroll behaviour. These tests pin that invariant against the
 * real composed page rather than a hand-mounted fixture, so a reorder that
 * drops or renames an anchor fails here.
 *
 * The section *order* is intentionally not asserted: it is the behaviour the
 * request changes.
 */

const SECTION_IDS = ["work", "services", "studio", "contact"] as const;

describe("App — preserved navigation anchors", () => {
  it("keeps every navigable section id on the composed page", () => {
    render(<App />);

    for (const id of SECTION_IDS) {
      expect(document.getElementById(id)).not.toBeNull();
    }
  });

  it("points every header and footer link at a real section anchor", () => {
    render(<App />);

    const headerNav = screen.getByRole("navigation", { name: "Primary" });
    const footerNav = screen.getByRole("navigation", { name: "Footer" });

    for (const nav of [headerNav, footerNav]) {
      for (const link of within(nav).getAllByRole("link")) {
        const href = link.getAttribute("href") ?? "";
        expect(href).toMatch(/^#/);
        const id = href.slice(1);
        expect(SECTION_IDS).toContain(id);
        // The anchor the link names must actually exist on the page.
        expect(document.getElementById(id)).not.toBeNull();
      }
    }
  });

  it("scrolls the header link to the section it names", async () => {
    const user = userEvent.setup();
    const scrollIntoView = vi.fn();
    Element.prototype.scrollIntoView = scrollIntoView;

    render(<App />);
    const headerNav = screen.getByRole("navigation", { name: "Primary" });

    await user.click(within(headerNav).getByRole("link", { name: "Services" }));

    expect(scrollIntoView).toHaveBeenCalledTimes(1);
    const target = scrollIntoView.mock.instances[0] as unknown as HTMLElement;
    expect(target.id).toBe("services");
  });

  it("scrolls the footer link to the section it names", async () => {
    const user = userEvent.setup();
    const scrollIntoView = vi.fn();
    Element.prototype.scrollIntoView = scrollIntoView;

    render(<App />);
    const footerNav = screen.getByRole("navigation", { name: "Footer" });

    await user.click(within(footerNav).getByRole("link", { name: "Contact" }));

    expect(scrollIntoView).toHaveBeenCalledTimes(1);
    const target = scrollIntoView.mock.instances[0] as unknown as HTMLElement;
    expect(target.id).toBe("contact");
  });
});

/**
 * Characterization baseline for the Selected Work stacking *mechanism*.
 *
 * The request grows the deck from three cards to four while preserving the
 * sticky stacking animation, markup, styling, z-index logic and scroll
 * behaviour. These tests assert the mechanism — a `.work-deck` of
 * `article.work-panel` surfaces whose inline z-index ascends from 1 and whose
 * active panel is driven by IntersectionObserver — without pinning the card
 * count, which is the behaviour the request changes.
 */

type ObserverCallback = (entries: IntersectionObserverEntry[]) => void;

interface ControllableObserver {
  callback: ObserverCallback;
  targets: Element[];
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

describe("WorkSection — preserved stacking mechanism", () => {
  beforeEach(() => {
    installControllableObserver();
  });

  afterEach(() => {
    observers = [];
  });

  it("renders the deck as article.work-panel surfaces", () => {
    render(<App />);

    const deck = document.querySelector(".work-deck");
    expect(deck).not.toBeNull();

    const panels = deck!.querySelectorAll("article.work-panel");
    expect(panels.length).toBeGreaterThanOrEqual(3);
    for (const panel of panels) {
      expect(panel.querySelector(".work-panel__surface")).not.toBeNull();
    }
  });

  it("layers each panel over the previous one with an ascending z-index", () => {
    render(<App />);

    const panels = Array.from(
      document.querySelectorAll<HTMLElement>("article.work-panel"),
    );
    const zIndexes = panels.map((panel) => Number(panel.style.zIndex));

    // Ascending from 1, one step per panel — the stacking contract.
    expect(zIndexes).toEqual(panels.map((_, index) => index + 1));
  });

  it("moves the active accent to whichever panel is in view", () => {
    render(<App />);

    const panels = Array.from(
      document.querySelectorAll<HTMLElement>("article.work-panel"),
    );
    const numberClass = (panel: HTMLElement) =>
      panel.querySelector("span[aria-hidden='true']")?.className ?? "";

    // The first panel starts active; the second is muted.
    expect(numberClass(panels[0])).toContain("text-accent");
    expect(numberClass(panels[1])).not.toContain("text-accent");

    intersect(panels[1]);

    expect(numberClass(panels[1])).toContain("text-accent");
    expect(numberClass(panels[0])).not.toContain("text-accent");
  });
});
