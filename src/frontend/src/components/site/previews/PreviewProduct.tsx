/**
 * Project 003 preview — a product marketing page concept.
 * Explains a software product with a clear next step, built from
 * type, hairline rules and a restrained accent.
 */
export function PreviewProduct() {
  const steps = [
    { n: "01", label: "Capture" },
    { n: "02", label: "Organise" },
    { n: "03", label: "Deliver" },
  ];

  return (
    <div className="preview-inner flex h-full w-full flex-col bg-[oklch(0.16_0.008_250)] text-[oklch(0.97_0.004_250)]">
      <div className="flex items-center justify-between border-b border-[oklch(0.3_0.01_250)] px-4 py-2.5">
        <span className="font-display text-[11px] font-semibold tracking-tight">
          Cadence
        </span>
        <span className="font-mono text-[8px] uppercase tracking-[0.18em] text-[oklch(0.62_0.008_250)]">
          Product
        </span>
      </div>

      <div className="flex min-h-0 flex-1 flex-col px-4 py-4">
        <p className="font-mono text-[8px] uppercase tracking-[0.2em] text-[oklch(0.72_0.11_240)]">
          Workflow software
        </p>
        <p className="mt-2 font-display text-[20px] font-semibold leading-[1.02] tracking-tight">
          One place for every
          <br />
          moving part.
        </p>
        <p className="mt-2 max-w-[34ch] text-[10px] leading-relaxed text-[oklch(0.68_0.008_250)]">
          Plan, track and hand off work without the spreadsheet sprawl.
        </p>

        <div className="mt-3 flex items-center gap-2">
          <span className="bg-[oklch(0.97_0.004_250)] px-2.5 py-1 font-mono text-[8px] uppercase tracking-[0.16em] text-[oklch(0.16_0.008_250)]">
            Start free
          </span>
          <span className="font-mono text-[8px] uppercase tracking-[0.16em] text-[oklch(0.62_0.008_250)]">
            See how it works
          </span>
        </div>

        {/* Three-step strip */}
        <div className="mt-auto grid grid-cols-3 border-t border-[oklch(0.3_0.01_250)]">
          {steps.map((step, index) => (
            <div
              key={step.n}
              className={`py-2.5 ${index > 0 ? "border-l border-[oklch(0.3_0.01_250)] pl-3" : "pr-3"}`}
            >
              <span className="font-mono text-[8px] tracking-[0.14em] text-[oklch(0.72_0.11_240)]">
                {step.n}
              </span>
              <p className="mt-1 text-[10px] font-medium">{step.label}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
