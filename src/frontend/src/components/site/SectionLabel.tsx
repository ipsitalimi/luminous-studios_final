interface SectionLabelProps {
  /** Numeric catalogue index, e.g. "01". */
  index: string;
  /** Short uppercase label, e.g. "WORK". */
  children: string;
  /** Optional trailing note rendered after a hairline gap. */
  note?: string;
  className?: string;
}

/**
 * Numbered monospace section marker used to open each section.
 * Renders as a hairline-ruled row: index · label · note.
 */
export function SectionLabel({
  index,
  children,
  note,
  className,
}: SectionLabelProps) {
  return (
    <div
      className={`flex items-baseline gap-4 rule-hairline pt-4 ${className ?? ""}`}
    >
      <span className="label-mono text-accent">{index}</span>
      <span className="label-mono text-foreground">{children}</span>
      {note ? (
        <span className="label-mono ml-auto hidden text-muted-foreground sm:inline">
          {note}
        </span>
      ) : null}
    </div>
  );
}
