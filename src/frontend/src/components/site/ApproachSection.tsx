import { useEffect, useRef, useState } from "react";

import { SectionLabel } from "@/components/site/SectionLabel";

interface Step {
  index: string;
  title: string;
  description: string;
}

const STEPS: Step[] = [
  {
    index: "01",
    title: "Understand",
    description: "We start with the problem, the people and the outcome.",
  },
  {
    index: "02",
    title: "Plan",
    description:
      "We agree on the scope and choose an approach that makes sense.",
  },
  {
    index: "03",
    title: "Build",
    description: "We design, develop, test and refine the work.",
  },
  {
    index: "04",
    title: "Launch",
    description:
      "We hand over a finished product and make the next steps clear.",
  },
];

/**
 * Approach as a connected journey: four cards alternate left and right
 * along a continuous directional path. Each card enters with a controlled
 * horizontal shift from its own side, the light-blue path draws in as the
 * visitor advances, and the active step's number is highlighted. Completed
 * steps stay put — the entrance never replays.
 */
export function ApproachSection() {
  const [active, setActive] = useState(0);
  const [revealed, setRevealed] = useState<number[]>([]);
  const itemRefs = useRef<(HTMLLIElement | null)[]>([]);

  useEffect(() => {
    const nodes = itemRefs.current.filter(
      (node): node is HTMLLIElement => node !== null,
    );
    if (nodes.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          const index = Number(
            (entry.target as HTMLElement).dataset.stepIndex ?? "0",
          );
          setActive((current) => Math.max(current, index));
          setRevealed((current) =>
            current.includes(index) ? current : [...current, index],
          );
        }
      },
      { rootMargin: "-35% 0px -45% 0px", threshold: 0 },
    );

    for (const node of nodes) observer.observe(node);
    return () => observer.disconnect();
  }, []);

  const progress = revealed.length === 0 ? 0 : (active + 1) / STEPS.length;

  return (
    <section
      id="approach"
      data-ocid="approach.section"
      className="overflow-hidden border-b border-border"
    >
      <div className="mx-auto max-w-[1400px] px-5 py-20 sm:px-8 sm:py-28 lg:px-12 lg:py-36">
        <SectionLabel index="03" note="Process">
          How we work
        </SectionLabel>

        <div className="mt-12 grid grid-cols-1 gap-8 lg:mt-16 lg:grid-cols-12">
          <h2 className="text-display-lg col-span-1 text-foreground lg:col-span-7">
            A good process makes better work.
          </h2>
          <p className="max-w-sm self-end text-base leading-relaxed text-muted-foreground lg:col-span-5 lg:justify-self-end">
            Four stages, one continuous line of work — each step set up by the
            one before it.
          </p>
        </div>

        <div className="relative mt-16 lg:mt-24">
          {/* Continuous directional path. On mobile it runs down the left
              edge; on desktop it sits on the centre line. The accent layer
              draws in as the visitor advances. */}
          <span
            aria-hidden="true"
            className="approach-path absolute bottom-0 left-[0.4375rem] top-0 w-px bg-border lg:left-1/2 lg:-translate-x-1/2"
          />
          <span
            aria-hidden="true"
            style={{ transform: `scaleY(${progress})` }}
            className="approach-path-fill absolute bottom-0 left-[0.4375rem] top-0 w-px origin-top bg-accent lg:left-1/2 lg:-translate-x-1/2"
          />

          <ol className="grid grid-cols-1 gap-14 lg:grid-cols-2 lg:gap-x-20 lg:gap-y-0">
            {STEPS.map((step, i) => {
              const isRight = i % 2 === 1;
              const isRevealed = revealed.includes(i);
              const isActive = active === i;
              return (
                <li
                  key={step.index}
                  ref={(node) => {
                    itemRefs.current[i] = node;
                  }}
                  data-step-index={i}
                  data-ocid={`approach.item.${Number(step.index)}`}
                  className={`approach-step group relative pl-8 lg:py-12 lg:pl-0 ${
                    isRight ? "lg:col-start-2 lg:mt-28" : "lg:col-start-1"
                  } ${isRevealed ? "is-revealed" : ""} ${
                    isRight ? "from-right" : "from-left"
                  }`}
                >
                  {/* Node marker sitting on the path */}
                  <span
                    aria-hidden="true"
                    className={`absolute left-0 top-2 h-3.5 w-3.5 -translate-x-[0.3125rem] rounded-full border transition-smooth lg:left-1/2 lg:top-1/2 lg:-translate-x-1/2 lg:-translate-y-1/2 ${
                      isActive
                        ? "border-accent bg-accent"
                        : "border-border bg-background"
                    }`}
                  />

                  {/* Directional connector from the path to the card, with a
                      small arrow at the turn. */}
                  <span
                    aria-hidden="true"
                    className={`absolute top-1/2 hidden h-px w-10 bg-border lg:block ${
                      isRight ? "right-full" : "left-full"
                    }`}
                  />
                  <span
                    aria-hidden="true"
                    className={`absolute top-1/2 hidden -translate-y-1/2 text-accent lg:block ${
                      isRight ? "right-full mr-10" : "left-full ml-10"
                    }`}
                  >
                    <svg
                      aria-hidden="true"
                      width="10"
                      height="10"
                      viewBox="0 0 10 10"
                      fill="none"
                      className={isRight ? "rotate-180" : ""}
                    >
                      <path
                        d="M1 5h7M5 1.5 8.5 5 5 8.5"
                        stroke="currentColor"
                        strokeWidth="1.25"
                        strokeLinecap="square"
                      />
                    </svg>
                  </span>

                  <div className="flex items-baseline gap-5">
                    <span
                      className={`approach-number text-display-md leading-none transition-smooth ${
                        isActive ? "text-accent" : "text-muted-foreground"
                      }`}
                    >
                      {step.index}
                    </span>
                    <span
                      aria-hidden="true"
                      className={`h-px flex-1 transition-smooth ${
                        isActive ? "bg-accent" : "bg-border"
                      }`}
                    />
                  </div>

                  <h3 className="text-display-md mt-5 text-foreground">
                    {step.title}
                  </h3>
                  <p className="mt-3 max-w-md text-base leading-relaxed text-muted-foreground">
                    {step.description}
                  </p>
                </li>
              );
            })}
          </ol>
        </div>
      </div>
    </section>
  );
}
