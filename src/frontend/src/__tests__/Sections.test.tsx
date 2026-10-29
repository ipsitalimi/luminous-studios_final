import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { ApproachSection } from "@/components/site/ApproachSection";
import { Footer } from "@/components/site/Footer";
import { ServicesSection } from "@/components/site/ServicesSection";
import { StudioSection } from "@/components/site/StudioSection";
import { WorkSection } from "@/components/site/WorkSection";

describe("WorkSection", () => {
  it("renders the label, heading and the independent-concepts disclaimer", () => {
    render(<WorkSection />);

    expect(screen.getAllByText("01").length).toBeGreaterThan(0);
    expect(screen.getByText("Selected Work")).toBeInTheDocument();
    expect(
      screen.getByRole("heading", {
        name: "A few things we’ve been thinking through.",
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/These are independent studio concepts/),
    ).toBeInTheDocument();
  });

  it("renders four project concepts with exact titles and labels", () => {
    render(<WorkSection />);

    expect(
      screen.getByRole("heading", { name: "A better way to get enquiries" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "Less admin. More clarity." }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "From idea to interface" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "Know what's working" }),
    ).toBeInTheDocument();

    expect(
      screen.getByText("Website / Independent concept"),
    ).toBeInTheDocument();
    expect(
      screen.getByText("Web application / Independent concept"),
    ).toBeInTheDocument();
    expect(
      screen.getByText("Digital product / Independent concept"),
    ).toBeInTheDocument();
    expect(
      screen.getByText("Analytics dashboard / Independent concept"),
    ).toBeInTheDocument();

    // Four project figures, each a non-navigating article.
    expect(document.querySelectorAll("article")).toHaveLength(4);
    expect(screen.queryAllByRole("link")).toHaveLength(0);
  });

  it("renders a distinct composed preview inside each project", () => {
    render(<WorkSection />);

    // Each preview is a real interface, not a coloured rectangle: the
    // featured browser concept, the workspace table and the product page.
    expect(screen.getByText("northfield-joinery.co.uk")).toBeInTheDocument();
    expect(screen.getByText("Ledger")).toBeInTheDocument();
    expect(screen.getByText("Cadence")).toBeInTheDocument();
  });
});

describe("ServicesSection", () => {
  it("renders four numbered rows with exact names and descriptions", () => {
    render(<ServicesSection />);

    expect(screen.getAllByText("02").length).toBeGreaterThan(0);
    expect(screen.getByText("What we do")).toBeInTheDocument();
    expect(
      screen.getByRole("heading", {
        name: "What are you looking to build?",
      }),
    ).toBeInTheDocument();

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
});

describe("ApproachSection", () => {
  it("renders four steps with exact titles and descriptions", () => {
    render(<ApproachSection />);

    expect(screen.getAllByText("03").length).toBeGreaterThan(0);
    expect(screen.getByText("How we work")).toBeInTheDocument();
    expect(
      screen.getByRole("heading", {
        name: "A good process makes better work.",
      }),
    ).toBeInTheDocument();

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
});

describe("StudioSection", () => {
  it("renders the split statement and supporting copy without invented claims", () => {
    render(<StudioSection />);

    expect(screen.getAllByText("04").length).toBeGreaterThan(0);
    expect(screen.getByText("Studio")).toBeInTheDocument();

    const heading = screen.getByRole("heading", { level: 2 });
    expect(heading).toHaveTextContent("Small studio.");
    expect(heading).toHaveTextContent("Serious attention.");

    expect(
      screen.getByText(/works across websites, apps and custom software/),
    ).toBeInTheDocument();
  });
});

describe("Footer", () => {
  it("shows the wordmark, studio line, nav links and current year", () => {
    render(<Footer />);

    expect(screen.getByText("luminous studios.")).toBeInTheDocument();
    expect(
      screen.getByText("Independent digital studio · Working worldwide"),
    ).toBeInTheDocument();

    const nav = screen.getByRole("navigation", { name: "Footer" });
    const links = within(nav).getAllByRole("link");
    expect(links.map((link) => link.textContent)).toEqual([
      "Services",
      "Work",
      "Studio",
      "Contact",
    ]);

    const year = new Date().getFullYear();
    expect(screen.getByText(`© ${year} Luminous Studios`)).toBeInTheDocument();
  });

  it("has no fake social links", () => {
    render(<Footer />);

    const links = screen.getAllByRole("link");
    for (const link of links) {
      const href = link.getAttribute("href") ?? "";
      expect(href).not.toMatch(
        /twitter|x\.com|facebook|instagram|linkedin|github/i,
      );
    }
  });
});
