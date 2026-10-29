import { scrollToSection } from "@/lib/sections";

/** Static capability markers for the hero's closing metadata strip. */
const CAPABILITIES = [
  "Web design",
  "Applications",
  "Custom software",
  "Working worldwide",
];

/**
 * Typography-led first screen. A monumental, centred stacked headline is
 * framed by a light-blue rule and closed by a slim static metadata strip.
 * The only graphic detail is the hairline rule system and the faint grid.
 */
export function Hero() {
  return (
    <section
      id="top"
      data-ocid="hero.section"
      className="relative overflow-hidden border-b border-border"
    >
      {/* Graphic detail: fine grid field, faded toward the edges */}
      <div
        aria-hidden="true"
        className="bg-grid-lines pointer-events-none absolute inset-0 opacity-60 [mask-image:radial-gradient(120%_100%_at_50%_0%,black,transparent_78%)]"
      />

      <div className="relative mx-auto flex max-w-[1400px] flex-col px-5 pb-10 pt-16 sm:px-8 sm:pb-12 sm:pt-24 lg:px-12 lg:pb-14 lg:pt-32">
        <p className="label-mono text-center text-muted-foreground">
          Independent digital studio / Working worldwide
        </p>

        <h1 className="text-display-hero mt-10 text-center text-foreground sm:mt-14 lg:mt-20">
          <span className="block">Good ideas</span>
          <span className="block">deserve good</span>
          <span className="block text-accent">execution.</span>
        </h1>

        {/* Defining graphic element: a strong light-blue rule under the headline */}
        <div
          aria-hidden="true"
          className="mt-10 h-px w-full bg-accent sm:mt-14 lg:mt-16"
        />

        <div className="mt-10 flex flex-col items-center gap-8 text-center sm:mt-12 lg:mt-14">
          <p className="max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg">
            We design and build websites, applications and software around what
            your business actually needs.
          </p>

          <div className="flex flex-col items-center gap-5 sm:flex-row sm:gap-10">
            <button
              type="button"
              data-ocid="hero.primary_button"
              onClick={() => scrollToSection("contact")}
              className="group inline-flex items-center gap-2 border border-foreground px-6 py-3 text-sm font-medium uppercase tracking-[0.14em] text-foreground transition-quick hover:border-accent hover:text-accent"
            >
              <span>Tell us what you&rsquo;re building</span>
              <span className="arrow-nudge" aria-hidden="true">
                &#8599;
              </span>
            </button>

            <button
              type="button"
              data-ocid="hero.secondary_button"
              onClick={() => scrollToSection("work")}
              className="group inline-flex items-center gap-2 text-sm uppercase tracking-[0.14em] text-muted-foreground transition-quick hover:text-foreground"
            >
              <span className="link-underline">Explore our work</span>
              <span className="arrow-nudge" aria-hidden="true">
                &#8595;
              </span>
            </button>
          </div>
        </div>

        {/* Slim static metadata strip — fine rules, blue markers, no motion */}
        <ul className="mt-16 grid grid-cols-2 gap-x-6 gap-y-4 border-t border-border pt-5 sm:mt-20 lg:mt-24 lg:grid-cols-4">
          {CAPABILITIES.map((capability) => (
            <li
              key={capability}
              className="flex items-center gap-3 label-mono text-muted-foreground"
            >
              <span
                aria-hidden="true"
                className="h-1.5 w-1.5 shrink-0 bg-accent"
              />
              {capability}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
