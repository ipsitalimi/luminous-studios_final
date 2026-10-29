/**
 * Project 001 preview — a service-business website concept.
 * Composed entirely from DOM/CSS: browser chrome, a hero with a
 * quote-request call to action, service rows and a mobile cue.
 */
export function PreviewEnquiries() {
  const services = [
    { name: "Bathroom refit", meta: "From £2,400" },
    { name: "Kitchen fitting", meta: "From £5,100" },
    { name: "Full renovation", meta: "Quoted" },
  ];

  return (
    <div className="preview-inner flex h-full w-full flex-col bg-[oklch(0.97_0.004_250)] text-[oklch(0.16_0.008_250)]">
      {/* Browser chrome */}
      <div className="flex items-center gap-2 border-b border-[oklch(0.86_0.005_250)] px-3 py-2">
        <span className="h-2 w-2 rounded-full bg-[oklch(0.82_0.005_250)]" />
        <span className="h-2 w-2 rounded-full bg-[oklch(0.82_0.005_250)]" />
        <span className="h-2 w-2 rounded-full bg-[oklch(0.82_0.005_250)]" />
        <span className="ml-2 truncate rounded-sm bg-[oklch(0.92_0.004_250)] px-2 py-0.5 font-mono text-[9px] tracking-wide text-[oklch(0.45_0.008_250)]">
          northfield-joinery.co.uk
        </span>
      </div>

      <div className="flex min-h-0 flex-1">
        {/* Page body */}
        <div className="flex min-w-0 flex-1 flex-col">
          <div className="flex items-center justify-between px-4 py-2.5">
            <span className="font-display text-[11px] font-semibold tracking-tight">
              Northfield Joinery
            </span>
            <span className="hidden gap-3 font-mono text-[8px] uppercase tracking-[0.18em] text-[oklch(0.5_0.008_250)] sm:flex">
              <span>Work</span>
              <span>Services</span>
              <span>Contact</span>
            </span>
          </div>

          <div className="border-t border-[oklch(0.9_0.004_250)] px-4 py-4">
            <p className="font-mono text-[8px] uppercase tracking-[0.2em] text-[oklch(0.5_0.008_250)]">
              Bespoke joinery · Est. 2009
            </p>
            <p className="mt-2 font-display text-[19px] font-semibold leading-[1.05] tracking-tight">
              Fitted furniture,
              <br />
              made to measure.
            </p>
            <div className="mt-3 flex items-center gap-2">
              <span className="bg-[oklch(0.16_0.008_250)] px-2.5 py-1 font-mono text-[8px] uppercase tracking-[0.16em] text-[oklch(0.97_0.004_250)]">
                Request a quote
              </span>
              <span className="font-mono text-[8px] uppercase tracking-[0.16em] text-[oklch(0.45_0.008_250)]">
                View work
              </span>
            </div>
          </div>

          {/* Service rows */}
          <div className="mt-auto border-t border-[oklch(0.9_0.004_250)]">
            {services.map((service) => (
              <div
                key={service.name}
                className="flex items-center justify-between border-b border-[oklch(0.9_0.004_250)] px-4 py-2 last:border-b-0"
              >
                <span className="text-[10px] font-medium">{service.name}</span>
                <span className="font-mono text-[8px] uppercase tracking-[0.14em] text-[oklch(0.5_0.008_250)]">
                  {service.meta}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Mobile-usability cue */}
        <div className="hidden w-[74px] shrink-0 flex-col items-center border-l border-[oklch(0.9_0.004_250)] bg-[oklch(0.94_0.004_250)] px-2 py-3 sm:flex">
          <span className="font-mono text-[7px] uppercase tracking-[0.16em] text-[oklch(0.5_0.008_250)]">
            Mobile
          </span>
          <div className="mt-2 w-full rounded-sm border border-[oklch(0.86_0.005_250)] bg-[oklch(0.97_0.004_250)] p-1.5">
            <div className="h-1 w-6 rounded-full bg-[oklch(0.82_0.005_250)]" />
            <div className="mt-1.5 h-1.5 w-full bg-[oklch(0.16_0.008_250)]" />
            <div className="mt-1 h-1 w-4/5 bg-[oklch(0.86_0.005_250)]" />
            <div className="mt-1 h-1 w-3/5 bg-[oklch(0.86_0.005_250)]" />
            <div className="mt-2 h-2.5 w-full bg-[oklch(0.16_0.008_250)]" />
          </div>
        </div>
      </div>
    </div>
  );
}
