import { ArrowUpRight } from "lucide-react";
import { useState } from "react";

import { SectionLabel } from "@/components/site/SectionLabel";
import {
  ServicePreview,
  type ServicePreviewKind,
} from "@/components/site/previews/ServicePreviews";
import { requestProjectType, scrollToSection } from "@/lib/sections";

interface Service {
  index: string;
  name: string;
  description: string;
  bestFor: string;
  preview: ServicePreviewKind;
  /** Project-type option to preselect in the contact form. */
  projectType: string;
}

const SERVICES: Service[] = [
  {
    index: "01",
    name: "Websites & landing pages",
    description:
      "Business websites, landing pages and redesigns built to explain what you offer and make the next step clear.",
    bestFor: "Businesses that need a website or a better one.",
    preview: "website",
    projectType: "Website",
  },
  {
    index: "02",
    name: "Apps & digital products",
    description:
      "Web apps, mobile apps and MVPs—from the first product concept to a working application.",
    bestFor: "Founders and businesses building a digital product.",
    preview: "app",
    projectType: "App or product",
  },
  {
    index: "03",
    name: "Custom software & automation",
    description:
      "Internal tools, dashboards, integrations and automated workflows that reduce manual work.",
    bestFor: "Teams dealing with repetitive tasks or disconnected systems.",
    preview: "software",
    projectType: "Custom software",
  },
  {
    index: "04",
    name: "Digital growth & optimisation",
    description:
      "Landing-page improvements, analytics setup and technical SEO to help you understand and improve your website.",
    bestFor: "Businesses looking to get more from an existing website.",
    preview: "growth",
    projectType: "Digital growth",
  },
];

/**
 * What We Do — an interactive service selector.
 *
 * On phones the heading and introduction lead, followed by a vertical
 * accordion: tapping a service expands it in place to reveal its description,
 * "Best for" line and a small custom preview. Only one stays open.
 *
 * On laptop the same list sits left while a larger live preview holds the
 * right column. Hovering or focusing a service updates the preview; clicking
 * keeps it selected until another is chosen.
 */
export function ServicesSection() {
  const [selected, setSelected] = useState(0);
  const [hovered, setHovered] = useState<number | null>(null);

  // Desktop preview follows the hovered service, falling back to the
  // clicked selection so the panel always shows something.
  const previewIndex = hovered ?? selected;

  const discuss = (service: Service) => {
    requestProjectType(service.projectType);
    scrollToSection("contact");
  };

  // The section root must not clip on desktop: `overflow-hidden` here becomes
  // the scroll container for the sticky live preview in the right column and
  // stops it sticking. Mobile keeps `overflow-hidden` unchanged.
  return (
    <section
      id="services"
      data-ocid="services.section"
      className="overflow-hidden border-b border-border lg:overflow-visible"
    >
      <div className="mx-auto max-w-[1400px] px-5 py-20 sm:px-8 sm:py-28 lg:px-12 lg:py-36">
        <SectionLabel index="02" note="Capabilities">
          What we do
        </SectionLabel>

        {/* Heading and introduction lead on every breakpoint. */}
        <div className="mt-12 max-w-3xl lg:mt-20">
          <h2 className="text-display-lg text-foreground">
            What are you looking to build?
          </h2>
          <p className="mt-8 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg">
            From business websites to custom applications, we design and develop
            digital solutions around what you need.
          </p>
        </div>

        <div className="mt-14 grid grid-cols-1 gap-x-12 gap-y-10 lg:mt-20 lg:grid-cols-12">
          {/* Service list — accordion on mobile, selector on laptop */}
          <ol
            data-ocid="services.list"
            className="lg:col-span-6 xl:col-span-5"
            onMouseLeave={() => setHovered(null)}
          >
            {SERVICES.map((service, index) => {
              const isOpen = selected === index;
              const isPreviewed = previewIndex === index;
              return (
                <li
                  key={service.index}
                  data-ocid={`services.item.${index + 1}`}
                  className="rule-hairline"
                >
                  <h3 className="m-0">
                    <button
                      type="button"
                      aria-expanded={isOpen}
                      aria-controls={`service-panel-${index}`}
                      data-ocid={`services.toggle.${index + 1}`}
                      onClick={() => setSelected(index)}
                      onMouseEnter={() => setHovered(index)}
                      onFocus={() => setHovered(index)}
                      onBlur={() => setHovered(null)}
                      className="group flex w-full items-start gap-4 py-6 text-left transition-quick sm:gap-6"
                    >
                      <span
                        aria-hidden="true"
                        className={`service-number shrink-0 transition-quick ${
                          isPreviewed
                            ? "text-accent"
                            : "text-muted-foreground/60"
                        }`}
                      >
                        {service.index}
                      </span>

                      <span className="min-w-0 flex-1 pt-1">
                        <span
                          className={`text-display-md block text-foreground transition-quick ${
                            isPreviewed ? "lg:translate-x-1" : ""
                          }`}
                        >
                          {service.name}
                        </span>
                      </span>

                      <ArrowUpRight
                        aria-hidden="true"
                        className={`arrow-nudge mt-2 h-5 w-5 shrink-0 transition-quick ${
                          isPreviewed ? "text-accent" : "text-muted-foreground"
                        }`}
                      />
                    </button>
                  </h3>

                  {/* Expanded content — mobile accordion, always shown on laptop */}
                  <div
                    id={`service-panel-${index}`}
                    className={`grid transition-smooth ${
                      isOpen
                        ? "grid-rows-[1fr] opacity-100"
                        : "grid-rows-[0fr] opacity-0"
                    } lg:hidden`}
                  >
                    <div className="overflow-hidden">
                      <div className="pb-8 pl-0 sm:pl-[4.5rem]">
                        <p className="max-w-md text-base leading-relaxed text-muted-foreground">
                          {service.description}
                        </p>
                        <p className="mt-4 text-sm leading-relaxed text-foreground">
                          <span className="label-mono mr-2 text-accent">
                            Best for
                          </span>
                          {service.bestFor}
                        </p>
                        <div className="relative mt-6 h-40 w-full max-w-sm overflow-hidden border border-border">
                          <ServicePreview kind={service.preview} />
                        </div>
                        <button
                          type="button"
                          data-ocid={`services.link.${index + 1}`}
                          onClick={() => discuss(service)}
                          className="group mt-6 inline-flex items-center gap-2 text-sm font-medium text-foreground transition-quick hover:text-accent"
                        >
                          <span className="link-underline">
                            Discuss this project
                          </span>
                          <span className="arrow-nudge" aria-hidden="true">
                            &#8599;
                          </span>
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Laptop: description and link sit under the title, no preview */}
                  <div className="hidden pb-8 pl-[4.5rem] lg:block">
                    <p className="max-w-md text-base leading-relaxed text-muted-foreground">
                      {service.description}
                    </p>
                    <p className="mt-3 text-sm leading-relaxed text-foreground">
                      <span className="label-mono mr-2 text-accent">
                        Best for
                      </span>
                      {service.bestFor}
                    </p>
                    <button
                      type="button"
                      data-ocid={`services.link.desktop.${index + 1}`}
                      onClick={() => discuss(service)}
                      className="group mt-4 inline-flex items-center gap-2 text-sm font-medium text-foreground transition-quick hover:text-accent"
                    >
                      <span className="link-underline">
                        Discuss this project
                      </span>
                      <span className="arrow-nudge" aria-hidden="true">
                        &#8599;
                      </span>
                    </button>
                  </div>
                </li>
              );
            })}
          </ol>

          {/* Laptop live preview — larger, updates on hover/focus/click */}
          <div className="hidden lg:col-span-6 lg:block xl:col-span-7">
            <div className="sticky top-28">
              <div
                data-ocid="services.preview"
                className="relative h-[26rem] overflow-hidden border border-border bg-card"
              >
                {SERVICES.map((service, index) => {
                  const isActive = previewIndex === index;
                  return (
                    <div
                      key={service.index}
                      aria-hidden="true"
                      className={`absolute inset-0 transition-smooth ${
                        isActive
                          ? "z-10 translate-y-0 opacity-100"
                          : "pointer-events-none translate-y-3 opacity-0"
                      }`}
                    >
                      <ServicePreview kind={service.preview} />
                    </div>
                  );
                })}
              </div>
              <div className="mt-4 flex items-baseline justify-between">
                <span className="label-mono text-muted-foreground">
                  {SERVICES[previewIndex].index} · {SERVICES[previewIndex].name}
                </span>
                <span className="label-mono text-accent">Live preview</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
