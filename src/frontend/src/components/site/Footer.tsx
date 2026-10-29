import { NAV_SECTIONS, scrollToSection } from "@/lib/sections";

/**
 * Minimal closing footer: wordmark, studio line, section links, year.
 * No social links, no invented claims.
 */
export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer data-ocid="footer.section" className="border-t border-border">
      <div className="mx-auto max-w-[1400px] px-5 py-12 sm:px-8 sm:py-16 lg:px-12">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-6">
            <p className="font-display text-2xl font-semibold tracking-[-0.02em] text-foreground">
              luminous studios.
            </p>
            <p className="mt-3 text-sm text-muted-foreground">
              Independent digital studio &middot; Working worldwide
            </p>
          </div>

          <nav
            aria-label="Footer"
            className="lg:col-span-6 lg:justify-self-end"
          >
            <ul className="flex flex-wrap gap-x-8 gap-y-3">
              {NAV_SECTIONS.map((section) => (
                <li key={section.id}>
                  <a
                    href={`#${section.id}`}
                    data-ocid={`footer.link.${section.id}`}
                    onClick={(event) => {
                      event.preventDefault();
                      scrollToSection(section.id);
                    }}
                    className="link-underline text-sm text-muted-foreground transition-quick hover:text-foreground"
                  >
                    {section.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <div className="mt-12 flex flex-col gap-3 rule-hairline pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="label-mono text-muted-foreground">
            &copy; {year} Luminous Studios
          </p>
          <p className="label-mono text-muted-foreground">
            Built with love using{" "}
            <a
              href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(
                typeof window !== "undefined" ? window.location.hostname : "",
              )}`}
              target="_blank"
              rel="noreferrer"
              className="link-underline text-foreground transition-quick hover:text-accent"
            >
              caffeine.ai
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
