/**
 * Art-directed editorial previews for the four service areas.
 *
 * Each preview is a distinct typographic composition drawn directly on the
 * dark panel — an oversized numeral, a large service heading, hairline-
 * separated capability groups and a restrained technology footer. There is no
 * browser chrome, no device frame, no boxed interface and no decorative chart
 * beyond the audit trend in service 04. They are decorative companions to the
 * service copy, so every preview is hidden from assistive technology.
 *
 * Layout note: every preview fills its frame with `absolute inset-0` and sizes
 * its regions with explicit, content-driven heights. The same component renders
 * in the desktop frame (h-[26rem]) and the mobile accordion frame (h-40,
 * ~158px), so mobile stays compact while `lg:` variants scale the type and
 * spacing up for the laptop panel. A greedy `flex-1` region inside a fixed
 * frame previously swallowed the panel, so none is used; `justify-between`
 * distributes the free space across the taller desktop frame.
 */

import type { ReactElement } from "react";

interface PreviewProps {
  /** Rendered inside the preview frame; purely decorative. */
  className?: string;
}

interface Capability {
  id: string;
  label: string;
}

/**
 * A hairline-separated ledger of capabilities. Each row is a readable line of
 * text marked by a small blue accent square. On the compact mobile frame the
 * rows sit in two columns so five capabilities fit the short frame; on laptop
 * they return to a single, generously spaced column.
 */
function CapabilityList({
  items,
  className,
}: {
  items: Capability[];
  className?: string;
}) {
  return (
    <div
      className={`grid grid-cols-2 gap-x-3 lg:grid-cols-1 lg:gap-x-0 ${
        className ?? ""
      }`}
    >
      {items.map((item) => (
        <div
          key={item.id}
          className="flex items-center gap-1.5 border-t border-border py-0 lg:gap-3 lg:py-1.5"
        >
          <span className="h-1 w-1 shrink-0 bg-accent lg:h-2 lg:w-2" />
          <span className="truncate text-[0.5625rem] leading-none text-foreground/80 lg:text-sm">
            {item.label}
          </span>
        </div>
      ))}
    </div>
  );
}

/** 01 — Websites: an editorial masthead over a capability ledger. */
function WebsitePreview({ className }: PreviewProps) {
  const capabilities: Capability[] = [
    { id: "cap-custom", label: "Custom websites" },
    { id: "cap-commerce", label: "E-commerce" },
    { id: "cap-interactive", label: "Interactive experiences" },
    { id: "cap-responsive", label: "Responsive development" },
    { id: "cap-performance", label: "Performance & discoverability" },
  ];

  return (
    <div
      aria-hidden="true"
      className={`absolute inset-0 flex flex-col justify-between bg-card ${className ?? ""}`}
    >
      {/* Masthead — eyebrow, oversized numeral, large heading */}
      <div className="flex flex-col gap-0.5 px-4 py-0.5 lg:gap-3 lg:px-8 lg:py-4">
        <div className="flex items-baseline justify-between">
          <span className="label-mono leading-none text-accent">Websites</span>
          <span className="font-display text-lg font-semibold leading-none tracking-tight text-foreground/25 lg:text-5xl">
            01
          </span>
        </div>
        <span className="text-[0.6875rem] font-semibold leading-tight text-foreground lg:text-3xl lg:leading-[1.05]">
          Websites, built from the ground up.
        </span>
      </div>

      {/* Capability ledger */}
      <CapabilityList
        items={capabilities}
        className="border-b border-border px-4 lg:px-8"
      />

      {/* Technology footer */}
      <div className="px-4 py-0.5 lg:px-8 lg:py-2">
        <span className="label-mono !text-[0.5rem] leading-tight !tracking-normal text-muted-foreground lg:!text-[0.6875rem] lg:leading-none lg:!tracking-[0.22em]">
          HTML / CSS · JavaScript · React · TypeScript · Tailwind CSS
        </span>
      </div>
    </div>
  );
}

/** 02 — Apps: an asymmetric split with a product flow and capability ledger. */
function AppPreview({ className }: PreviewProps) {
  const capabilities: Capability[] = [
    { id: "cap-web", label: "Web applications" },
    { id: "cap-mobile", label: "Mobile applications" },
    { id: "cap-mvp", label: "MVPs & prototypes" },
    { id: "cap-ux", label: "User experiences" },
    { id: "cap-data", label: "Data & integrations" },
  ];

  const flow = [
    { id: "flow-1", label: "Sign in" },
    { id: "flow-2", label: "Dashboard" },
    { id: "flow-3", label: "Action" },
  ];

  return (
    <div
      aria-hidden="true"
      className={`absolute inset-0 flex flex-col justify-between bg-card ${className ?? ""}`}
    >
      {/* Split masthead — numeral left, heading right */}
      <div className="flex items-start gap-3 px-4 py-0.5 lg:gap-6 lg:px-8 lg:py-4">
        <span className="font-display text-lg font-semibold leading-none tracking-tight text-foreground/25 lg:text-5xl">
          02
        </span>
        <div className="flex min-w-0 flex-col gap-0.5 lg:gap-2">
          <span className="label-mono leading-none text-accent">
            Applications
          </span>
          <span className="text-[0.6875rem] font-semibold leading-tight text-foreground lg:text-3xl lg:leading-[1.05]">
            From product idea to working application.
          </span>
        </div>
      </div>

      {/* Product flow */}
      <div className="flex items-center gap-1.5 border-y border-border px-4 py-0.5 lg:gap-3 lg:px-8 lg:py-2">
        {flow.map((step, index) => (
          <span key={step.id} className="flex items-center gap-1.5 lg:gap-3">
            <span className="text-[0.5625rem] font-medium uppercase leading-none tracking-wide text-foreground/70 lg:text-sm">
              {step.label}
            </span>
            {index < flow.length - 1 ? (
              <span className="h-px w-3 bg-border lg:w-6" />
            ) : null}
          </span>
        ))}
      </div>

      {/* Capability ledger */}
      <CapabilityList
        items={capabilities}
        className="border-b border-border px-4 lg:px-8"
      />

      {/* Technology footer */}
      <div className="px-4 py-0.5 lg:px-8 lg:py-2">
        <span className="label-mono !text-[0.5rem] leading-tight !tracking-normal text-muted-foreground lg:!text-[0.6875rem] lg:leading-none lg:!tracking-[0.22em]">
          React · TypeScript · React Native · Expo · APIs
        </span>
      </div>
    </div>
  );
}

/** 03 — Custom software: a numbered workflow ledger over a capability ledger. */
function SoftwarePreview({ className }: PreviewProps) {
  const capabilities: Capability[] = [
    { id: "cap-tools", label: "Internal tools" },
    { id: "cap-automation", label: "Workflow automation" },
    { id: "cap-apis", label: "APIs & webhooks" },
    { id: "cap-data", label: "Data workflows" },
    { id: "cap-ai", label: "AI-enabled tools" },
  ];

  const workflow = [
    { id: "wf-enquiry", label: "ENQUIRY RECEIVED" },
    { id: "wf-details", label: "DETAILS PROCESSED" },
    { id: "wf-crm", label: "CRM UPDATED" },
    { id: "wf-email", label: "EMAIL SENT" },
  ];

  return (
    <div
      aria-hidden="true"
      className={`absolute inset-0 flex flex-col justify-between bg-card ${className ?? ""}`}
    >
      {/* Masthead */}
      <div className="flex flex-col gap-0.5 px-4 py-0.5 lg:gap-2 lg:px-8 lg:py-4">
        <div className="flex items-baseline justify-between">
          <span className="label-mono leading-none text-accent">Software</span>
          <span className="font-display text-lg font-semibold leading-none tracking-tight text-foreground/25 lg:text-5xl">
            03
          </span>
        </div>
        <span className="text-[0.6875rem] font-semibold leading-tight text-foreground lg:text-3xl lg:leading-[1.05]">
          Make your systems work together.
        </span>
      </div>

      {/* Workflow — four numbered stages, illustrative example only */}
      <div className="grid grid-cols-2 divide-y divide-border border-y border-border px-4 lg:px-8">
        {workflow.map((step, index) => (
          <div
            key={step.id}
            className="flex flex-col items-center gap-0.5 py-0 lg:py-1.5"
          >
            <span className="flex items-center gap-1 lg:flex-col lg:gap-1">
              <span className="label-mono leading-none text-accent/70">
                {`0${index + 1}`}
              </span>
              <span className="text-[0.5625rem] font-medium uppercase leading-none tracking-wide text-foreground/80 lg:text-xs">
                {step.label}
              </span>
            </span>
          </div>
        ))}
      </div>

      {/* Capability ledger */}
      <CapabilityList
        items={capabilities}
        className="border-b border-border px-4 lg:px-8"
      />

      {/* Technology footer */}
      <div className="px-4 py-0.5 lg:px-8 lg:py-2">
        <span className="label-mono !text-[0.5rem] leading-tight !tracking-normal text-muted-foreground lg:!text-[0.6875rem] lg:leading-none lg:!tracking-[0.22em]">
          JavaScript / TypeScript · APIs · Webhooks · Databases · AI
          integrations
        </span>
      </div>
    </div>
  );
}

/** 04 — Digital growth: a structured audit over a capability ledger. */
function GrowthPreview({ className }: PreviewProps) {
  const capabilities: Capability[] = [
    { id: "cap-seo", label: "Technical SEO" },
    { id: "cap-performance", label: "Performance optimisation" },
    { id: "cap-analytics", label: "Analytics & tracking" },
    { id: "cap-ux", label: "UX & conversion audits" },
    { id: "cap-testing", label: "Testing & improvement" },
  ];

  const audit = [
    { id: "audit-performance", label: "Performance", status: "Reviewed" },
    {
      id: "audit-discoverability",
      label: "Discoverability",
      status: "Reviewed",
    },
    { id: "audit-experience", label: "User experience", status: "In review" },
  ];

  const bars = [
    { id: "bar-a", height: 34 },
    { id: "bar-b", height: 52 },
    { id: "bar-c", height: 44 },
    { id: "bar-d", height: 68 },
    { id: "bar-e", height: 58 },
    { id: "bar-f", height: 82 },
    { id: "bar-g", height: 96 },
  ];

  const metrics = [
    { id: "metric-performance" },
    { id: "metric-seo" },
    { id: "metric-ux" },
  ];

  return (
    <div
      aria-hidden="true"
      className={`absolute inset-0 flex flex-col justify-between bg-card ${className ?? ""}`}
    >
      {/* Masthead */}
      <div className="flex flex-col gap-0.5 px-4 py-0.5 lg:gap-2 lg:px-8 lg:py-4">
        <div className="flex items-baseline justify-between">
          <span className="label-mono leading-none text-accent">Growth</span>
          <span className="font-display text-lg font-semibold leading-none tracking-tight text-foreground/25 lg:text-5xl">
            04
          </span>
        </div>
        <span className="text-[0.6875rem] font-semibold leading-tight text-foreground lg:text-3xl lg:leading-[1.05]">
          Make your website work harder.
        </span>
      </div>

      {/* Audit categories and trend chart — illustrative labels only */}
      <div className="flex items-stretch gap-3 border-y border-border px-4 py-0 lg:gap-6 lg:px-8 lg:py-2">
        <div className="flex flex-1 flex-col">
          {audit.map((category) => (
            <div
              key={category.id}
              className="flex items-center justify-between gap-2 border-t border-border py-0 first:border-t-0 lg:py-1"
            >
              <span className="truncate text-[0.5625rem] leading-none text-foreground/80 lg:text-sm">
                {category.label}
              </span>
              <span
                className={`shrink-0 text-[0.5rem] uppercase leading-none tracking-wide lg:text-xs ${
                  category.status === "Reviewed"
                    ? "text-accent"
                    : "text-muted-foreground"
                }`}
              >
                {category.status}
              </span>
            </div>
          ))}
        </div>
        <div className="flex w-20 flex-col gap-1 lg:w-28 lg:gap-2">
          {/* Trend chart — seven bars on a baseline */}
          <div className="flex h-3 items-end gap-0.5 lg:h-6 lg:gap-1">
            {bars.map((bar, index) => (
              <span
                key={bar.id}
                className={`flex-1 ${
                  index === bars.length - 1 ? "bg-accent" : "bg-foreground/30"
                }`}
                style={{ height: `${bar.height}%` }}
              />
            ))}
          </div>
          {/* Metric tiles */}
          <div className="grid grid-cols-3 gap-1 lg:gap-2">
            {metrics.map((metric) => (
              <div key={metric.id} className="flex flex-col gap-0.5 lg:gap-1">
                <span className="h-0.5 w-4 bg-foreground/30 lg:h-1 lg:w-6" />
                <span className="h-1 w-5 bg-foreground/60 lg:h-1.5 lg:w-8" />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Capability ledger */}
      <CapabilityList
        items={capabilities}
        className="border-b border-border px-4 lg:px-8"
      />

      {/* Technology footer */}
      <div className="px-4 py-0.5 lg:px-8 lg:py-2">
        <span className="label-mono !text-[0.5rem] leading-tight !tracking-normal text-muted-foreground lg:!text-[0.6875rem] lg:leading-none lg:!tracking-[0.22em]">
          Analytics · Technical SEO · Performance audits · Conversion tracking
        </span>
      </div>
    </div>
  );
}

export type ServicePreviewKind = "website" | "app" | "software" | "growth";

const PREVIEWS: Record<
  ServicePreviewKind,
  (props: PreviewProps) => ReactElement
> = {
  website: WebsitePreview,
  app: AppPreview,
  software: SoftwarePreview,
  growth: GrowthPreview,
};

/** Render the preview matching a service kind. */
export function ServicePreview({
  kind,
  className,
}: PreviewProps & { kind: ServicePreviewKind }) {
  const Component = PREVIEWS[kind];
  return <Component className={className} />;
}
