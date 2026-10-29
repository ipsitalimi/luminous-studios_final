import { SectionLabel } from "@/components/site/SectionLabel";

/**
 * Studio as an asymmetric editorial spread: an oversized two-line
 * statement occupies the wide left column while a narrower block of
 * supporting copy sits low in the right column, separated by a vertical
 * hairline. Composition deliberately differs from the catalogue rows of
 * Services and the grid of Work.
 */
export function StudioSection() {
  return (
    <section
      id="studio"
      data-ocid="studio.section"
      className="border-b border-border"
    >
      <div className="mx-auto max-w-[1400px] px-5 py-20 sm:px-8 sm:py-28 lg:px-12 lg:py-36">
        <SectionLabel index="04" note="The studio">
          Studio
        </SectionLabel>

        <div className="mt-12 grid grid-cols-1 gap-x-8 gap-y-12 lg:mt-20 lg:grid-cols-12">
          {/* Wide column — the statement, set oversized and tight */}
          <h2 className="text-display-xl col-span-1 text-foreground lg:col-span-7">
            <span className="block">Small studio.</span>
            <span className="block text-accent">Serious attention.</span>
          </h2>

          {/* Narrow column — supporting copy, pushed low and ruled off */}
          <div className="col-span-1 lg:col-span-4 lg:col-start-9 lg:self-end">
            <div className="rule-hairline pt-6">
              <p className="max-w-md text-lg leading-relaxed text-muted-foreground">
                Luminous Studios works across websites, apps and custom
                software. We bring design and development together to make
                digital products that are thoughtful, useful and built for real
                business needs.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
