import { SectionLabel } from "@/components/site/SectionLabel";
import { type EnquiryInput, useSubmitEnquiry } from "@/hooks/useQueries";
import { PROJECT_TYPE_EVENT } from "@/lib/sections";
import { type FormEvent, useEffect, useId, useState } from "react";

/** Clearly marked placeholder the owner must replace with a real address. */
const BUSINESS_EMAIL_PLACEHOLDER = "REPLACE_WITH_YOUR_EMAIL@example.com";

const PROJECT_TYPES = [
  "Website",
  "App or product",
  "Custom software",
  "Digital growth",
  "Not sure yet",
] as const;

const BUDGETS = [
  "Not sure yet",
  "Under 5k",
  "5k – 15k",
  "15k – 40k",
  "40k+",
] as const;

interface FormValues {
  name: string;
  email: string;
  projectType: string;
  description: string;
  budget: string;
}

type FieldErrors = Partial<Record<keyof FormValues, string>>;

const EMPTY_FORM: FormValues = {
  name: "",
  email: "",
  projectType: "",
  description: "",
  budget: "",
};

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validate(values: FormValues): FieldErrors {
  const errors: FieldErrors = {};
  if (!values.name.trim()) errors.name = "Please add your name.";
  if (!values.email.trim()) {
    errors.email = "Please add an email address.";
  } else if (!EMAIL_PATTERN.test(values.email.trim())) {
    errors.email = "That email address doesn't look right.";
  }
  if (!values.projectType) errors.projectType = "Please choose a project type.";
  if (!values.description.trim()) {
    errors.description = "A sentence or two is enough to start.";
  }
  return errors;
}

type Status =
  | { kind: "idle" }
  | { kind: "success" }
  | { kind: "error"; message: string };

/**
 * Contact as a two-column editorial form: the headline and supporting copy
 * hold the left column while the form occupies the right, ruled off by a
 * vertical hairline. Success and error are distinct, honest states.
 */
export function ContactSection() {
  const formId = useId();
  const [values, setValues] = useState<FormValues>(EMPTY_FORM);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [status, setStatus] = useState<Status>({ kind: "idle" });
  const submitEnquiry = useSubmitEnquiry();

  const fieldId = (field: keyof FormValues) => `${formId}-${field}`;
  const errorId = (field: keyof FormValues) => `${formId}-${field}-error`;

  // Preselect a project type requested from the services list. Only fills an
  // empty field so it never overwrites a choice the visitor already made.
  useEffect(() => {
    const onRequest = (event: Event) => {
      const detail = (event as CustomEvent<string>).detail;
      if (!detail) return;
      setValues((current) =>
        current.projectType ? current : { ...current, projectType: detail },
      );
      setErrors((current) => {
        if (!current.projectType) return current;
        const { projectType: _cleared, ...rest } = current;
        return rest;
      });
    };
    window.addEventListener(PROJECT_TYPE_EVENT, onRequest);
    return () => window.removeEventListener(PROJECT_TYPE_EVENT, onRequest);
  }, []);

  const update = (field: keyof FormValues, value: string) => {
    setValues((current) => ({ ...current, [field]: value }));
    setErrors((current) => {
      if (!current[field]) return current;
      const next = { ...current };
      delete next[field];
      return next;
    });
    if (status.kind !== "idle") setStatus({ kind: "idle" });
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const nextErrors = validate(values);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) {
      setStatus({ kind: "idle" });
      return;
    }

    const input: EnquiryInput = {
      name: values.name.trim(),
      email: values.email.trim(),
      projectType: values.projectType,
      description: values.description.trim(),
      ...(values.budget ? { budget: values.budget } : {}),
    };

    submitEnquiry.mutate(input, {
      onSuccess: (result) => {
        if (result.__kind__ === "ok") {
          setValues(EMPTY_FORM);
          setErrors({});
          setStatus({ kind: "success" });
        } else {
          setStatus({
            kind: "error",
            message:
              result.err.__kind__ === "invalidInput"
                ? result.err.invalidInput
                : "We couldn't send your message just now. Please try again.",
          });
        }
      },
      onError: () => {
        setStatus({
          kind: "error",
          message:
            "We couldn't reach the studio just now. Please try again in a moment.",
        });
      },
    });
  };

  const isPending = submitEnquiry.isPending;

  return (
    <section
      id="contact"
      data-ocid="contact.section"
      className="border-b border-border"
    >
      <div className="mx-auto max-w-[1400px] px-5 py-20 sm:px-8 sm:py-28 lg:px-12 lg:py-36">
        <SectionLabel index="05" note="Start a project">
          Contact
        </SectionLabel>

        <div className="mt-12 grid grid-cols-1 gap-x-8 gap-y-14 lg:mt-20 lg:grid-cols-12">
          {/* Left column — headline and supporting copy */}
          <div className="col-span-1 lg:col-span-5">
            <h2 className="text-display-lg text-foreground">
              <span className="block">Let&rsquo;s build</span>
              <span className="block text-accent">something useful.</span>
            </h2>
            <p className="mt-8 max-w-md text-lg leading-relaxed text-muted-foreground">
              Tell us what you have in mind. A clear brief helps, but a starting
              point is enough.
            </p>
          </div>

          {/* Right column — the form, ruled off by a vertical hairline */}
          <div className="col-span-1 lg:col-span-6 lg:col-start-7 lg:border-l lg:border-border lg:pl-10">
            <form
              noValidate
              onSubmit={handleSubmit}
              data-ocid="contact.form"
              className="flex flex-col gap-8"
            >
              <div className="grid grid-cols-1 gap-8 sm:grid-cols-2">
                <Field
                  id={fieldId("name")}
                  errorId={errorId("name")}
                  label="Name"
                  error={errors.name}
                >
                  <input
                    id={fieldId("name")}
                    name="name"
                    type="text"
                    autoComplete="name"
                    value={values.name}
                    onChange={(event) => update("name", event.target.value)}
                    aria-invalid={errors.name ? true : undefined}
                    aria-describedby={errors.name ? errorId("name") : undefined}
                    data-ocid="contact.input.name"
                    className="w-full border-b border-input bg-transparent py-3 text-base text-foreground outline-none transition-quick placeholder:text-muted-foreground/60 focus:border-accent"
                    placeholder="Your name"
                  />
                </Field>

                <Field
                  id={fieldId("email")}
                  errorId={errorId("email")}
                  label="Email"
                  error={errors.email}
                >
                  <input
                    id={fieldId("email")}
                    name="email"
                    type="email"
                    autoComplete="email"
                    value={values.email}
                    onChange={(event) => update("email", event.target.value)}
                    aria-invalid={errors.email ? true : undefined}
                    aria-describedby={
                      errors.email ? errorId("email") : undefined
                    }
                    data-ocid="contact.input.email"
                    className="w-full border-b border-input bg-transparent py-3 text-base text-foreground outline-none transition-quick placeholder:text-muted-foreground/60 focus:border-accent"
                    placeholder="you@company.com"
                  />
                </Field>
              </div>

              <div className="grid grid-cols-1 gap-8 sm:grid-cols-2">
                <Field
                  id={fieldId("projectType")}
                  errorId={errorId("projectType")}
                  label="Project type"
                  error={errors.projectType}
                >
                  <select
                    id={fieldId("projectType")}
                    name="projectType"
                    value={values.projectType}
                    onChange={(event) =>
                      update("projectType", event.target.value)
                    }
                    aria-invalid={errors.projectType ? true : undefined}
                    aria-describedby={
                      errors.projectType ? errorId("projectType") : undefined
                    }
                    data-ocid="contact.select.project_type"
                    className="w-full border-b border-input bg-transparent py-3 text-base text-foreground outline-none transition-quick focus:border-accent"
                  >
                    <option value="">Choose one</option>
                    {PROJECT_TYPES.map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                </Field>

                <Field
                  id={fieldId("budget")}
                  errorId={errorId("budget")}
                  label="Budget (optional)"
                >
                  <select
                    id={fieldId("budget")}
                    name="budget"
                    value={values.budget}
                    onChange={(event) => update("budget", event.target.value)}
                    data-ocid="contact.select.budget"
                    className="w-full border-b border-input bg-transparent py-3 text-base text-foreground outline-none transition-quick focus:border-accent"
                  >
                    <option value="">Prefer not to say</option>
                    {BUDGETS.map((range) => (
                      <option key={range} value={range}>
                        {range}
                      </option>
                    ))}
                  </select>
                </Field>
              </div>

              <Field
                id={fieldId("description")}
                errorId={errorId("description")}
                label="Project description"
                error={errors.description}
              >
                <textarea
                  id={fieldId("description")}
                  name="description"
                  rows={4}
                  value={values.description}
                  onChange={(event) =>
                    update("description", event.target.value)
                  }
                  aria-invalid={errors.description ? true : undefined}
                  aria-describedby={
                    errors.description ? errorId("description") : undefined
                  }
                  data-ocid="contact.textarea.description"
                  className="w-full resize-y border-b border-input bg-transparent py-3 text-base leading-relaxed text-foreground outline-none transition-quick placeholder:text-muted-foreground/60 focus:border-accent"
                  placeholder="What are you trying to build, and what does success look like?"
                />
              </Field>

              <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
                <button
                  type="submit"
                  disabled={isPending}
                  data-ocid="contact.submit_button"
                  className="group inline-flex items-center gap-2 self-start border border-foreground px-6 py-3 text-sm font-medium text-foreground transition-quick hover:border-accent hover:text-accent disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <span>{isPending ? "Sending…" : "Send enquiry"}</span>
                  <span className="arrow-nudge" aria-hidden="true">
                    &#8594;
                  </span>
                </button>

                <p className="label-mono text-muted-foreground">
                  {isPending ? "In flight" : "No account needed"}
                </p>
              </div>

              {status.kind === "success" ? (
                <output
                  data-ocid="contact.success_state"
                  className="block border-l-2 border-accent pl-4 text-sm leading-relaxed text-foreground"
                >
                  Thanks — your enquiry reached the studio. We&rsquo;ll reply to
                  the email you gave us.
                </output>
              ) : null}

              {status.kind === "error" ? (
                <div
                  role="alert"
                  data-ocid="contact.error_state"
                  className="border-l-2 border-destructive pl-4 text-sm leading-relaxed text-destructive"
                >
                  {status.message}
                </div>
              ) : null}
            </form>

            <div className="mt-10 rule-hairline pt-6">
              <p className="label-mono text-muted-foreground">
                Notification address
              </p>
              <p className="mt-3 max-w-md text-sm leading-relaxed text-muted-foreground">
                Enquiries are sent to{" "}
                <span className="font-mono text-foreground">
                  {BUSINESS_EMAIL_PLACEHOLDER}
                </span>
                . This is a placeholder — the owner must replace it with a real
                business address before enquiries can be delivered.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

interface FieldProps {
  id: string;
  errorId: string;
  label: string;
  error?: string;
  children: React.ReactNode;
}

/** Labelled field wrapper with a reachable inline error. */
function Field({ id, errorId, label, error, children }: FieldProps) {
  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={id} className="label-mono text-muted-foreground">
        {label}
      </label>
      {children}
      {error ? (
        <p id={errorId} className="text-xs text-destructive">
          {error}
        </p>
      ) : null}
    </div>
  );
}
