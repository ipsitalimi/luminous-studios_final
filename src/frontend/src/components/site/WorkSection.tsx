import { SectionLabel } from "@/components/site/SectionLabel";
import { PreviewAnalytics } from "@/components/site/previews/PreviewAnalytics";
import { PreviewEnquiries } from "@/components/site/previews/PreviewEnquiries";
import { PreviewProduct } from "@/components/site/previews/PreviewProduct";
import { PreviewWorkspace } from "@/components/site/previews/PreviewWorkspace";
import { useEffect, useRef, useState } from "react";
import type { ReactElement } from "react";

interface Project {
  number: string;
  title: string;
  discipline: string;
  note: string;
  preview: () => ReactElement;
}

const PROJECTS: Project[] = [
  {
    number: "001",
    title: "A better way to get enquiries",
    discipline: "Website",
    note: "A service business that was losing enquiries to a slow, unclear site. The concept leads with one obvious action and keeps the detail close at hand.",
    preview: PreviewEnquiries,
  },
  {
    number: "002",
    title: "Less admin. More clarity.",
    discipline: "Web application",
    note: "A workspace concept for small teams who track work across too many tools.",
    preview: PreviewWorkspace,
  },
  {
    number: "003",
    title: "From idea to interface",
    discipline: "Digital product",
    note: "A product site concept that explains a workflow tool in one screen.",
    preview: PreviewProduct,
  },
  {
    number: "004",
    title: "Know what's working",
    discipline: "Analytics dashboard",
    note: "An analytics dashboard concept that brings website performance, traffic and conversion insights into one clear view.",
    preview: PreviewAnalytics,
  },
];

/**
 * Selected Work — a scroll-driven stacking deck. Each project is a sticky
 * panel that rises from below and layers over the one before it, leaving a
 * sliver of the previous panel visible. A small IntersectionObserver marks
 * the panel currently in view so its number and rule pick up the accent.
 *
 * The stacking is pure CSS (position: sticky + z-index). Reduced-motion
 * users get a plain, fully readable stack with no motion.
 */
export function WorkSection() {
  const [active, setActive] = useState(0);
  const panelRefs = useRef<Array<HTMLElement | null>>([]);

  useEffect(() => {
    const nodes = panelRefs.current.filter(
      (node): node is HTMLElement => node !== null,
    );
    if (nodes.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          const index = nodes.indexOf(entry.target as HTMLElement);
          if (index !== -1) setActive(index);
        }
      },
      { rootMargin: "-45% 0px -45% 0px", threshold: 0 },
    );

    for (const node of nodes) observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      id="work"
      data-ocid="work.section"
      className="border-b border-border"
    >
      <div className="mx-auto max-w-[1400px] px-5 pt-20 sm:px-8 sm:pt-28 lg:px-12 lg:pt-36">
        <SectionLabel index="01" note="Independent concepts">
          Selected Work
        </SectionLabel>

        <div className="mt-10 grid grid-cols-1 gap-8 lg:mt-16 lg:grid-cols-12">
          <h2 className="text-display-lg col-span-1 text-foreground lg:col-span-8">
            A few things we&rsquo;ve been thinking through.
          </h2>
          <p className="col-span-1 max-w-sm self-end text-base leading-relaxed text-muted-foreground lg:col-span-4">
            Self-initiated studies in interface, structure and clarity. Each one
            is an independent studio concept &mdash; not commissioned client
            work.
          </p>
        </div>
      </div>

      {/* Stacking deck — each panel sticks, then the next rises over it. */}
      <div className="work-deck mx-auto max-w-[1400px] px-5 pb-20 sm:px-8 sm:pb-28 lg:px-12 lg:pb-36">
        {PROJECTS.map((project, index) => {
          const isActive = active === index;
          return (
            <article
              key={project.number}
              ref={(node) => {
                panelRefs.current[index] = node;
              }}
              data-ocid={`work.item.${index + 1}`}
              className="work-panel group"
              style={{ zIndex: index + 1 }}
            >
              <div className="work-panel__surface border border-border bg-card">
                <div className="grid grid-cols-1 gap-6 p-5 sm:p-8 lg:grid-cols-12 lg:gap-10 lg:p-10">
                  <div className="flex items-baseline gap-4 lg:col-span-3 lg:flex-col lg:gap-6">
                    <span
                      aria-hidden="true"
                      className={`font-display text-[clamp(3rem,7vw,6rem)] font-semibold leading-none tracking-tight transition-quick ${
                        isActive ? "text-accent" : "text-muted-foreground/40"
                      }`}
                    >
                      {project.number}
                    </span>
                    <span className="label-mono text-muted-foreground lg:mt-auto">
                      {project.discipline} / Independent concept
                    </span>
                  </div>

                  <figure className="min-w-0 lg:col-span-9">
                    <div className="preview-crop aspect-[16/10] w-full border border-border bg-background">
                      <project.preview />
                    </div>
                    <figcaption className="mt-6">
                      <h3 className="text-display-md text-foreground">
                        {project.title}
                      </h3>
                      <p className="mt-3 max-w-xl text-sm leading-relaxed text-muted-foreground">
                        {project.note}
                      </p>
                    </figcaption>
                  </figure>
                </div>
              </div>
            </article>
          );
        })}
      </div>

      <div className="mx-auto max-w-[1400px] px-5 pb-20 sm:px-8 sm:pb-28 lg:px-12 lg:pb-36">
        <p className="rule-hairline pt-6 text-sm text-muted-foreground">
          These are independent studio concepts, made to explore ideas in
          interface and structure. They are not commissioned client work, and
          nothing here is a live product.
        </p>
      </div>
    </section>
  );
}
