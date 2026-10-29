export type SectionId = "work" | "services" | "studio" | "contact";

export interface NavSection {
  id: SectionId;
  label: string;
}

/** Primary navigation — order defines both header and footer link order. */
export const NAV_SECTIONS: NavSection[] = [
  { id: "services", label: "Services" },
  { id: "work", label: "Work" },
  { id: "studio", label: "Studio" },
  { id: "contact", label: "Contact" },
];

/** Event name used to hand a project type to the contact form. */
export const PROJECT_TYPE_EVENT = "luminous:project-type";

/**
 * Ask the contact form to preselect a project type, then let the caller
 * scroll to it. The value is delivered as a custom event so the form keeps
 * owning its own draft state; if the form is not mounted yet the event is
 * simply missed and the form stays untouched.
 */
export function requestProjectType(projectType: string): void {
  window.dispatchEvent(
    new CustomEvent<string>(PROJECT_TYPE_EVENT, { detail: projectType }),
  );
}

/**
 * Smooth-scroll to a section by id, honouring reduced-motion preferences.
 * Falls back to a plain jump when the target is not yet mounted.
 */
export function scrollToSection(id: SectionId): void {
  const target = document.getElementById(id);
  if (!target) return;
  const prefersReduced = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;
  target.scrollIntoView({
    behavior: prefersReduced ? "auto" : "smooth",
    block: "start",
  });
}
