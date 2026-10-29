import { NAV_SECTIONS, type SectionId, scrollToSection } from "@/lib/sections";
import { useCallback, useEffect, useRef, useState } from "react";

/**
 * Fixed-height editorial header: wordmark left, section links right,
 * separated from the page by a single hairline rule.
 */
export function Header() {
  const [active, setActive] = useState<SectionId | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);

  // Reflect the section currently in view, subtly.
  useEffect(() => {
    const ids = NAV_SECTIONS.map((section) => section.id);
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible) setActive(visible.target.id as SectionId);
      },
      { rootMargin: "-45% 0px -45% 0px", threshold: [0, 0.25, 0.5, 1] },
    );
    for (const id of ids) {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    }
    return () => observer.disconnect();
  }, []);

  // Close the mobile menu on Escape and return focus to the toggle.
  useEffect(() => {
    if (!menuOpen) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMenuOpen(false);
        toggleRef.current?.focus();
      }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [menuOpen]);

  const handleNavigate = useCallback((id: SectionId) => {
    setMenuOpen(false);
    scrollToSection(id);
  }, []);

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur-[2px]">
      <div className="mx-auto flex h-16 max-w-[1400px] items-center justify-between px-5 sm:px-8 lg:px-12">
        <button
          type="button"
          data-ocid="header.link"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="font-display text-[0.95rem] font-semibold tracking-[-0.02em] text-foreground transition-quick hover:text-accent"
        >
          luminous studios.
        </button>

        {/* Desktop navigation */}
        <nav aria-label="Primary" className="hidden md:block">
          <ul className="flex items-center gap-8">
            {NAV_SECTIONS.map((section) => {
              const isActive = active === section.id;
              return (
                <li key={section.id}>
                  <a
                    href={`#${section.id}`}
                    data-ocid={`header.link.${section.id}`}
                    aria-current={isActive ? "true" : undefined}
                    onClick={(event) => {
                      event.preventDefault();
                      handleNavigate(section.id);
                    }}
                    className={`link-underline text-sm transition-quick ${
                      isActive
                        ? "text-foreground"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {section.label}
                  </a>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Mobile menu toggle */}
        <button
          ref={toggleRef}
          type="button"
          data-ocid="header.open_modal_button"
          aria-expanded={menuOpen}
          aria-controls="mobile-nav"
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          onClick={() => setMenuOpen((open) => !open)}
          className="flex h-11 w-11 items-center justify-center md:hidden"
        >
          <span className="relative block h-3 w-6">
            <span
              className={`absolute left-0 block h-px w-6 bg-foreground transition-quick ${
                menuOpen ? "top-1.5 rotate-45" : "top-0"
              }`}
            />
            <span
              className={`absolute left-0 block h-px w-6 bg-foreground transition-quick ${
                menuOpen ? "top-1.5 -rotate-45" : "top-3"
              }`}
            />
          </span>
        </button>
      </div>

      {/* Mobile navigation panel */}
      <div
        id="mobile-nav"
        ref={menuRef}
        hidden={!menuOpen}
        className="border-t border-border bg-background md:hidden"
      >
        <nav aria-label="Mobile" className="px-5 py-4 sm:px-8">
          <ul className="flex flex-col">
            {NAV_SECTIONS.map((section) => (
              <li
                key={section.id}
                className="border-b border-border last:border-b-0"
              >
                <a
                  href={`#${section.id}`}
                  data-ocid={`header.link.mobile.${section.id}`}
                  onClick={(event) => {
                    event.preventDefault();
                    handleNavigate(section.id);
                  }}
                  className="flex items-center justify-between py-4 text-lg text-foreground transition-quick hover:text-accent"
                >
                  <span>{section.label}</span>
                  <span className="label-mono text-muted-foreground">
                    {String(NAV_SECTIONS.indexOf(section) + 1).padStart(2, "0")}
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  );
}
