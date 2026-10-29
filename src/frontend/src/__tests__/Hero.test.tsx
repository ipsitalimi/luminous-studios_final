import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { Hero } from "@/components/site/Hero";

/**
 * Characterization baseline for the hero's *preserved* contract: the exact
 * headline text and its three deliberate lines, the label above it, the
 * supporting copy, and the two CTAs with their scroll targets. The redesign
 * intentionally changes alignment, weight, and adds a rule and metadata strip,
 * so none of that is asserted here.
 */
describe("Hero — preserved content contract", () => {
  beforeEach(() => {
    document.body.innerHTML = "";
    for (const id of ["work", "services", "studio", "contact"]) {
      const section = document.createElement("section");
      section.id = id;
      document.body.appendChild(section);
    }
  });

  it("renders the exact three-line headline with the accent on 'execution.'", () => {
    render(<Hero />);

    const heading = screen.getByRole("heading", { level: 1 });
    expect(heading).toHaveTextContent("Good ideas");
    expect(heading).toHaveTextContent("deserve good");
    expect(heading).toHaveTextContent("execution.");

    // The three lines are deliberate, distinct blocks — not one wrapped run.
    const lines = Array.from(heading.querySelectorAll("span")).map(
      (span) => span.textContent,
    );
    expect(lines).toEqual(["Good ideas", "deserve good", "execution."]);

    // 'execution.' carries the light-blue accent; the first two lines do not.
    const accentLine = heading.querySelector(".text-accent");
    expect(accentLine).not.toBeNull();
    expect(accentLine).toHaveTextContent("execution.");
  });

  it("keeps the monospace label above the headline", () => {
    render(<Hero />);

    expect(
      screen.getByText("Independent digital studio / Working worldwide"),
    ).toBeInTheDocument();
  });

  it("keeps the supporting copy", () => {
    render(<Hero />);

    expect(
      screen.getByText(
        /We design and build websites, applications and software around what your business actually needs\./,
      ),
    ).toBeInTheDocument();
  });

  it("keeps both CTAs with their exact labels", () => {
    render(<Hero />);

    expect(
      screen.getByRole("button", { name: /Tell us what you’re building/ }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /Explore our work/ }),
    ).toBeInTheDocument();
  });

  it("scrolls the primary CTA to contact and the secondary to work", async () => {
    const user = userEvent.setup();
    const scrollIntoView = vi.fn();
    Element.prototype.scrollIntoView = scrollIntoView;

    render(<Hero />);

    await user.click(
      screen.getByRole("button", { name: /Tell us what you’re building/ }),
    );
    expect(scrollIntoView).toHaveBeenCalledTimes(1);
    expect(
      (scrollIntoView.mock.instances[0] as unknown as HTMLElement).id,
    ).toBe("contact");

    scrollIntoView.mockClear();

    await user.click(screen.getByRole("button", { name: /Explore our work/ }));
    expect(scrollIntoView).toHaveBeenCalledTimes(1);
    expect(
      (scrollIntoView.mock.instances[0] as unknown as HTMLElement).id,
    ).toBe("work");
  });

  it("uses an instant jump when the visitor prefers reduced motion", async () => {
    const user = userEvent.setup();
    const scrollIntoView = vi.fn();
    Element.prototype.scrollIntoView = scrollIntoView;
    const matchMedia = vi
      .spyOn(window, "matchMedia")
      .mockReturnValue({ matches: true } as MediaQueryList);

    render(<Hero />);
    await user.click(screen.getByRole("button", { name: /Explore our work/ }));

    expect(scrollIntoView).toHaveBeenCalledWith({
      behavior: "auto",
      block: "start",
    });

    matchMedia.mockRestore();
  });
});

/**
 * Cover for the accepted hero redesign: a centred, monumental stacked
 * headline, a defining light-blue rule beneath it, and a slim static
 * metadata strip. These assert the observable composition contract, not
 * pixel values.
 */
describe("Hero — centred monumental composition", () => {
  it("centres the label, headline, supporting copy and CTAs", () => {
    render(<Hero />);

    const heading = screen.getByRole("heading", { level: 1 });
    expect(heading).toHaveClass("text-center");

    const label = screen.getByText(
      "Independent digital studio / Working worldwide",
    );
    expect(label).toHaveClass("text-center");

    const copy = screen.getByText(
      /We design and build websites, applications and software around what your business actually needs\./,
    );
    // The copy sits in a centred column wrapper.
    expect(copy.parentElement).toHaveClass("items-center");
    expect(copy.parentElement).toHaveClass("text-center");
  });

  it("renders the three headline lines as distinct stacked blocks", () => {
    render(<Hero />);

    const heading = screen.getByRole("heading", { level: 1 });
    const lines = Array.from(heading.querySelectorAll("span"));
    expect(lines).toHaveLength(3);
    for (const line of lines) {
      expect(line).toHaveClass("block");
    }
  });

  it("draws a light-blue rule immediately beneath the headline", () => {
    render(<Hero />);

    const heading = screen.getByRole("heading", { level: 1 });
    // The rule is the next graphic element after the headline.
    const rule = heading.nextElementSibling as HTMLElement;
    expect(rule).not.toBeNull();
    expect(rule).toHaveAttribute("aria-hidden", "true");
    expect(rule).toHaveClass("bg-accent");
    expect(rule).toHaveClass("w-full");
  });

  it("renders the static metadata strip with the four exact labels", () => {
    render(<Hero />);

    const strip = screen.getByRole("list");
    const items = within(strip).getAllByRole("listitem");
    expect(items.map((item) => item.textContent)).toEqual([
      "Web design",
      "Applications",
      "Custom software",
      "Working worldwide",
    ]);

    // Each marker is a light-blue square, and the strip is separated by rules.
    for (const item of items) {
      const marker = item.querySelector("span[aria-hidden='true']");
      expect(marker).toHaveClass("bg-accent");
    }
    expect(strip).toHaveClass("border-t");
  });

  it("adds no entrance, scroll-reveal or parallax animation to the hero", () => {
    render(<Hero />);

    const section = document.querySelector("[data-ocid='hero.section']");
    expect(section).not.toBeNull();
    const animated = section!.querySelectorAll(
      "[class*='animate-'], [class*='fade'], [class*='reveal'], [class*='parallax']",
    );
    expect(animated).toHaveLength(0);
  });
});
