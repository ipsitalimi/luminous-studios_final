/**
 * Project 004 preview — an analytics dashboard concept.
 * A believable reporting screen: a metric strip, a bar chart with a
 * highlighted series, a channel breakdown and a conversion funnel,
 * built from DOM/CSS with hairline rules and a restrained accent.
 */
export function PreviewAnalytics() {
  const metrics = [
    { label: "Sessions", value: "48.2k", delta: "+12.4%" },
    { label: "Conversion", value: "3.8%", delta: "+0.6pt" },
    { label: "Revenue", value: "£61.4k", delta: "+9.1%" },
  ];

  // Weekly sessions — relative heights, one week highlighted.
  const bars = [38, 52, 44, 61, 49, 72, 58, 66, 54, 78, 63, 88];
  const peak = 11;
  const barIds = bars.map((_, index) => `analytics-bar-${index}`);

  const channels = [
    { name: "Organic search", share: "42%", width: "42%" },
    { name: "Direct", share: "27%", width: "27%" },
    { name: "Referral", share: "18%", width: "18%" },
    { name: "Paid social", share: "13%", width: "13%" },
  ];

  const funnel = [
    { stage: "Visit", value: "48,210" },
    { stage: "Engage", value: "19,640" },
    { stage: "Enquire", value: "4,120" },
    { stage: "Convert", value: "1,833" },
  ];

  return (
    <div className="preview-inner flex h-full w-full flex-col bg-[oklch(0.97_0.004_250)] text-[oklch(0.16_0.008_250)]">
      {/* Top bar */}
      <div className="flex items-center justify-between border-b border-[oklch(0.88_0.005_250)] px-3 py-2">
        <div className="flex items-center gap-2">
          <span className="font-display text-[10px] font-semibold tracking-tight">
            Signal
          </span>
          <span className="hidden font-mono text-[7px] uppercase tracking-[0.16em] text-[oklch(0.55_0.008_250)] sm:inline">
            Overview
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="border border-[oklch(0.88_0.005_250)] px-1.5 py-0.5 font-mono text-[7px] uppercase tracking-[0.14em] text-[oklch(0.5_0.008_250)]">
            Last 30 days
          </span>
          <span className="h-1.5 w-1.5 rounded-full bg-[oklch(0.72_0.11_240)]" />
        </div>
      </div>

      <div className="flex min-h-0 flex-1 flex-col gap-2.5 p-3">
        {/* Metric strip */}
        <div className="grid grid-cols-3 border border-[oklch(0.88_0.005_250)]">
          {metrics.map((metric, index) => (
            <div
              key={metric.label}
              className={`px-2.5 py-2 ${index > 0 ? "border-l border-[oklch(0.88_0.005_250)]" : ""}`}
            >
              <p className="font-mono text-[7px] uppercase tracking-[0.16em] text-[oklch(0.55_0.008_250)]">
                {metric.label}
              </p>
              <p className="mt-1 font-display text-[15px] font-semibold leading-none tracking-tight">
                {metric.value}
              </p>
              <p className="mt-1 font-mono text-[7px] tracking-[0.1em] text-[oklch(0.5_0.12_240)]">
                {metric.delta}
              </p>
            </div>
          ))}
        </div>

        {/* Chart + channels */}
        <div className="grid min-h-0 flex-1 grid-cols-1 gap-2.5 sm:grid-cols-[1.6fr_1fr]">
          {/* Bar chart */}
          <div className="flex min-h-0 flex-col border border-[oklch(0.88_0.005_250)] p-2.5">
            <div className="flex items-center justify-between">
              <span className="font-mono text-[7px] uppercase tracking-[0.16em] text-[oklch(0.55_0.008_250)]">
                Sessions by week
              </span>
              <span className="font-mono text-[7px] tracking-[0.1em] text-[oklch(0.5_0.12_240)]">
                +12.4%
              </span>
            </div>
            <div className="mt-2 flex min-h-0 flex-1 items-end gap-[3px]">
              {bars.map((height, index) => (
                <span
                  key={barIds[index]}
                  className={`flex-1 ${
                    index === peak
                      ? "bg-[oklch(0.72_0.11_240)]"
                      : "bg-[oklch(0.82_0.005_250)]"
                  }`}
                  style={{ height: `${height}%` }}
                />
              ))}
            </div>
            <div className="mt-1.5 flex justify-between border-t border-[oklch(0.92_0.004_250)] pt-1 font-mono text-[6px] uppercase tracking-[0.14em] text-[oklch(0.6_0.008_250)]">
              <span>W1</span>
              <span>W6</span>
              <span>W12</span>
            </div>
          </div>

          {/* Channel breakdown */}
          <div className="flex min-h-0 flex-col border border-[oklch(0.88_0.005_250)] p-2.5">
            <span className="font-mono text-[7px] uppercase tracking-[0.16em] text-[oklch(0.55_0.008_250)]">
              Channels
            </span>
            <div className="mt-2 flex flex-col gap-1.5">
              {channels.map((channel) => (
                <div key={channel.name}>
                  <div className="flex items-center justify-between">
                    <span className="truncate text-[8px] font-medium">
                      {channel.name}
                    </span>
                    <span className="font-mono text-[7px] tracking-[0.1em] text-[oklch(0.5_0.008_250)]">
                      {channel.share}
                    </span>
                  </div>
                  <div className="mt-1 h-[3px] w-full bg-[oklch(0.92_0.004_250)]">
                    <span
                      className="block h-full bg-[oklch(0.16_0.008_250)]"
                      style={{ width: channel.width }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Conversion funnel */}
        <div className="grid grid-cols-4 border-t border-[oklch(0.88_0.005_250)]">
          {funnel.map((step, index) => (
            <div
              key={step.stage}
              className={`py-2 ${index > 0 ? "border-l border-[oklch(0.88_0.005_250)] pl-2.5" : "pr-2.5"}`}
            >
              <span className="font-mono text-[7px] uppercase tracking-[0.14em] text-[oklch(0.55_0.008_250)]">
                {step.stage}
              </span>
              <p className="mt-0.5 text-[10px] font-medium tabular-nums">
                {step.value}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
