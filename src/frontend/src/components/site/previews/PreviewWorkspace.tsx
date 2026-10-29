/**
 * Project 002 preview — a web-application workspace concept.
 * Sidebar, a table of items with status chips and fine detail,
 * rendered as a believable product screen.
 */
export function PreviewWorkspace() {
  const rows = [
    {
      ref: "ENQ-1042",
      name: "Hillside Cottage",
      status: "New",
      tone: "accent",
    },
    {
      ref: "ENQ-1041",
      name: "Marlow Terrace",
      status: "Quoted",
      tone: "muted",
    },
    { ref: "ENQ-1039", name: "Old Mill Barn", status: "Won", tone: "solid" },
    { ref: "ENQ-1036", name: "Fern Row", status: "Quoted", tone: "muted" },
  ];

  const toneClass: Record<string, string> = {
    accent: "border-[oklch(0.72_0.11_240)] text-[oklch(0.5_0.12_240)]",
    muted: "border-[oklch(0.82_0.005_250)] text-[oklch(0.5_0.008_250)]",
    solid:
      "border-transparent bg-[oklch(0.16_0.008_250)] text-[oklch(0.97_0.004_250)]",
  };

  return (
    <div className="preview-inner flex h-full w-full bg-[oklch(0.97_0.004_250)] text-[oklch(0.16_0.008_250)]">
      {/* Sidebar */}
      <div className="hidden w-[86px] shrink-0 flex-col border-r border-[oklch(0.88_0.005_250)] bg-[oklch(0.94_0.004_250)] p-2.5 sm:flex">
        <span className="font-display text-[10px] font-semibold tracking-tight">
          Ledger
        </span>
        <div className="mt-3 flex flex-col gap-1.5">
          <span className="bg-[oklch(0.16_0.008_250)] px-1.5 py-1 font-mono text-[7px] uppercase tracking-[0.14em] text-[oklch(0.97_0.004_250)]">
            Enquiries
          </span>
          <span className="px-1.5 py-1 font-mono text-[7px] uppercase tracking-[0.14em] text-[oklch(0.5_0.008_250)]">
            Quotes
          </span>
          <span className="px-1.5 py-1 font-mono text-[7px] uppercase tracking-[0.14em] text-[oklch(0.5_0.008_250)]">
            Jobs
          </span>
          <span className="px-1.5 py-1 font-mono text-[7px] uppercase tracking-[0.14em] text-[oklch(0.5_0.008_250)]">
            Invoices
          </span>
        </div>
      </div>

      {/* Main panel */}
      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex items-center justify-between border-b border-[oklch(0.88_0.005_250)] px-3 py-2">
          <span className="font-mono text-[8px] uppercase tracking-[0.18em] text-[oklch(0.5_0.008_250)]">
            Enquiries / Open
          </span>
          <span className="border border-[oklch(0.16_0.008_250)] px-1.5 py-0.5 font-mono text-[7px] uppercase tracking-[0.14em]">
            New
          </span>
        </div>

        {/* Table header */}
        <div className="grid grid-cols-[1fr_auto] gap-2 border-b border-[oklch(0.88_0.005_250)] px-3 py-1.5 font-mono text-[7px] uppercase tracking-[0.16em] text-[oklch(0.55_0.008_250)]">
          <span>Reference</span>
          <span>Status</span>
        </div>

        <div className="min-h-0 flex-1">
          {rows.map((row) => (
            <div
              key={row.ref}
              className="grid grid-cols-[1fr_auto] items-center gap-2 border-b border-[oklch(0.92_0.004_250)] px-3 py-2"
            >
              <div className="min-w-0">
                <p className="truncate text-[10px] font-medium">{row.name}</p>
                <p className="font-mono text-[7px] uppercase tracking-[0.14em] text-[oklch(0.55_0.008_250)]">
                  {row.ref}
                </p>
              </div>
              <span
                className={`border px-1.5 py-0.5 font-mono text-[7px] uppercase tracking-[0.14em] ${toneClass[row.tone]}`}
              >
                {row.status}
              </span>
            </div>
          ))}
        </div>

        {/* Fine detail footer */}
        <div className="flex items-center justify-between border-t border-[oklch(0.88_0.005_250)] px-3 py-1.5">
          <span className="font-mono text-[7px] uppercase tracking-[0.14em] text-[oklch(0.55_0.008_250)]">
            4 open · updated 2m ago
          </span>
          <span className="h-1.5 w-1.5 rounded-full bg-[oklch(0.72_0.11_240)]" />
        </div>
      </div>
    </div>
  );
}
