import { fireEvent, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";

import { ServicesSection } from "@/components/site/ServicesSection";

/**
 * Cover for the accepted rework of the four right-hand service previews from
 * abstract decorative graphics into information-rich previews.
 *
 * The request replaces the preview *content* only: each preview now carries a
 * heading, an intro, five capability groups and a technology/tool label row,
 * while the section copy, the two-column composition, the fixed laptop frame,
 * the one-active-preview rule, the hover/focus/click synchronisation and the
 * mobile accordion are all preserved. These tests pin the new accepted copy
 * per service and the preserved interaction contract, not pixel values or
 * animation timing.
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

/**
 * The five capability labels rendered inside a preview wrapper. Capability
 * rows are the `flex items-center gap-1.5` children of the capability group,
 * which distinguishes them from the audit category rows in preview 04.
 */
function capabilityLabels(preview: HTMLElement): string[] {
  return Array.from(
    preview.querySelectorAll("div.flex.items-center.gap-1\\.5 > span.truncate"),
  ).map((node) => node.textContent?.trim() ?? "");
}

interface PreviewExpectation {
  index: number;
  heading: string;
  capabilities: readonly string[];
  tech: string;
}

const PREVIEWS: readonly PreviewExpectation[] = [
  {
    index: 0,
    heading: "Websites, built from the ground up.",
    capabilities: [
      "Custom websites",
      "E-commerce",
      "Interactive experiences",
      "Responsive development",
      "Performance & discoverability",
    ],
    tech: "HTML / CSS · JavaScript · React · TypeScript · Tailwind CSS",
  },
  {
    index: 1,
    heading: "From product idea to working application.",
    capabilities: [
      "Web applications",
      "Mobile applications",
      "MVPs & prototypes",
      "User experiences",
      "Data & integrations",
    ],
    tech: "React · TypeScript · React Native · Expo · APIs",
  },
  {
    index: 2,
    heading: "Make your systems work together.",
    capabilities: [
      "Internal tools",
      "Workflow automation",
      "APIs & webhooks",
      "Data workflows",
      "AI-enabled tools",
    ],
    tech: "JavaScript / TypeScript · APIs · Webhooks · Databases · AI integrations",
  },
  {
    index: 3,
    heading: "Make your website work harder.",
    capabilities: [
      "Technical SEO",
      "Performance optimisation",
      "Analytics & tracking",
      "UX & conversion audits",
      "Testing & improvement",
    ],
    tech: "Analytics · Technical SEO · Performance audits · Conversion tracking",
  },
];

describe("ServicePreviews — reworked preview content", () => {
  it("renders each service's heading, five capability groups and tech labels", () => {
    render(<ServicesSection />);

    const children = previewChildren();
    expect(children).toHaveLength(4);

    for (const expectation of PREVIEWS) {
      const preview = children[expectation.index];
      expect(
        within(preview).getByText(expectation.heading),
      ).toBeInTheDocument();

      const labels = capabilityLabels(preview);
      expect(labels).toEqual([...expectation.capabilities]);

      expect(within(preview).getByText(expectation.tech)).toBeInTheDocument();
    }
  });

  it("shows the matching preview when each service is hovered on desktop", async () => {
    const user = userEvent.setup();
    render(<ServicesSection />);

    for (const expectation of PREVIEWS) {
      await user.hover(toggles()[expectation.index]);

      const active = activePreviews();
      expect(active).toHaveLength(1);
      expect(active[0]).toBe(previewChildren()[expectation.index]);
      expect(
        within(active[0]).getByText(expectation.heading),
      ).toBeInTheDocument();
    }
  });

  it("renders the four-stage workflow diagram for Custom software (03)", () => {
    render(<ServicesSection />);

    const preview = previewChildren()[2];
    for (const stage of [
      "ENQUIRY RECEIVED",
      "DETAILS PROCESSED",
      "CRM UPDATED",
      "EMAIL SENT",
    ]) {
      expect(within(preview).getByText(stage)).toBeInTheDocument();
    }
  });

  it("renders the structured audit categories for Digital growth (04)", () => {
    render(<ServicesSection />);

    const preview = previewChildren()[3];
    for (const category of [
      "Performance",
      "Discoverability",
      "User experience",
    ]) {
      expect(within(preview).getByText(category)).toBeInTheDocument();
    }
    expect(within(preview).getAllByText("Reviewed")).toHaveLength(2);
    expect(within(preview).getByText("In review")).toBeInTheDocument();
  });
});

describe("ServicePreviews — preserved interaction contract", () => {
  it("keeps exactly one active preview and synchronises it with the caption", async () => {
    const user = userEvent.setup();
    render(<ServicesSection />);

    const names = [
      "Websites & landing pages",
      "Apps & digital products",
      "Custom software & automation",
      "Digital growth & optimisation",
    ];

    for (const index of [0, 1, 2, 3, 2, 1, 0]) {
      await user.click(toggles()[index]);

      const active = activePreviews();
      expect(active).toHaveLength(1);
      expect(active[0]).toBe(previewChildren()[index]);
      expect(previewPanel().nextElementSibling?.textContent).toContain(
        names[index],
      );
    }
  });

  it("keeps the fixed, clipping laptop frame with one wrapper per service", () => {
    render(<ServicesSection />);

    const panel = previewPanel();
    expect(panel.className).toContain("h-[26rem]");
    expect(panel.className).toContain("overflow-hidden");
    expect(previewChildren()).toHaveLength(4);
  });

  it("expands one mobile service at a time and shows its own updated preview", async () => {
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
    expect(
      within(panel!).getByText("Make your website work harder."),
    ).toBeInTheDocument();
    expect(
      within(panel!).getByText(
        "Analytics · Technical SEO · Performance audits · Conversion tracking",
      ),
    ).toBeInTheDocument();
  });

  it("keeps the section heading, intro and four numbered services", () => {
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
    rows.forEach((row, index) => {
      expect(row.querySelector(".service-number")?.textContent).toBe(
        `0${index + 1}`,
      );
    });
  });

  it("shows no invented performance scores, rankings or percentage improvements", () => {
    render(<ServicesSection />);

    const text = document.body.textContent ?? "";
    expect(text).not.toMatch(/\d+\s?%/);
    expect(text).not.toMatch(/\b(rank(ed)?\s*#?\d|#1|top\s*\d)\b/i);
  });
});
