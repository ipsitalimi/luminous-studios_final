import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

import type { EnquiryInput, SubmitResult } from "@/backend";

/**
 * A controllable stand-in for the backend submission hook. `mutate` records the
 * input it was handed and invokes the caller's `onSuccess`/`onError` callbacks
 * with whatever the current test configures.
 */
type MutateOptions = {
  onSuccess?: (result: SubmitResult) => void;
  onError?: (error: Error) => void;
};

const mutate = vi.fn<(input: EnquiryInput, options?: MutateOptions) => void>();

vi.mock("@/hooks/useQueries", () => ({
  useSubmitEnquiry: () => ({ mutate, isPending: false }),
}));

import { ContactSection } from "@/components/site/ContactSection";

function fillValidForm(user: ReturnType<typeof userEvent.setup>) {
  return (async () => {
    await user.type(screen.getByLabelText("Name"), "Ada Lovelace");
    await user.type(screen.getByLabelText("Email"), "ada@example.com");
    await user.selectOptions(screen.getByLabelText("Project type"), "Website");
    await user.type(
      screen.getByLabelText("Project description"),
      "A new marketing site.",
    );
  })();
}

describe("ContactSection", () => {
  beforeEach(() => {
    mutate.mockReset();
  });

  it("shows inline errors and does not submit when required fields are empty", async () => {
    const user = userEvent.setup();
    render(<ContactSection />);

    await user.click(screen.getByRole("button", { name: /Send enquiry/ }));

    expect(screen.getByText("Please add your name.")).toBeInTheDocument();
    expect(
      screen.getByText("Please add an email address."),
    ).toBeInTheDocument();
    expect(
      screen.getByText("Please choose a project type."),
    ).toBeInTheDocument();
    expect(
      screen.getByText("A sentence or two is enough to start."),
    ).toBeInTheDocument();
    expect(mutate).not.toHaveBeenCalled();
  });

  it("rejects a malformed email address", async () => {
    const user = userEvent.setup();
    render(<ContactSection />);

    await user.type(screen.getByLabelText("Name"), "Ada");
    await user.type(screen.getByLabelText("Email"), "not-an-email");
    await user.selectOptions(screen.getByLabelText("Project type"), "Website");
    await user.type(screen.getByLabelText("Project description"), "Hello");
    await user.click(screen.getByRole("button", { name: /Send enquiry/ }));

    expect(
      screen.getByText("That email address doesn't look right."),
    ).toBeInTheDocument();
    expect(mutate).not.toHaveBeenCalled();
  });

  it("submits trimmed values and shows the success state only on ok", async () => {
    const user = userEvent.setup();
    mutate.mockImplementation((_input, options) => {
      options?.onSuccess?.({ __kind__: "ok", ok: 1n });
    });
    render(<ContactSection />);

    await user.type(screen.getByLabelText("Name"), "  Ada Lovelace  ");
    await user.type(screen.getByLabelText("Email"), " ada@example.com ");
    await user.selectOptions(screen.getByLabelText("Project type"), "Website");
    await user.type(
      screen.getByLabelText("Project description"),
      "  A new marketing site.  ",
    );
    await user.click(screen.getByRole("button", { name: /Send enquiry/ }));

    expect(mutate).toHaveBeenCalledTimes(1);
    const [input] = mutate.mock.calls[0];
    expect(input).toEqual({
      name: "Ada Lovelace",
      email: "ada@example.com",
      projectType: "Website",
      description: "A new marketing site.",
    });
    // Budget was left unset, so it must not be sent as an empty string.
    expect(input).not.toHaveProperty("budget");

    expect(
      await screen.findByText(/your enquiry reached the studio/),
    ).toBeInTheDocument();
    expect(screen.queryByRole("alert")).not.toBeInTheDocument();
  });

  it("shows the backend invalidInput message as an error, never a success", async () => {
    const user = userEvent.setup();
    mutate.mockImplementation((_input, options) => {
      options?.onSuccess?.({
        __kind__: "err",
        err: {
          __kind__: "invalidInput",
          invalidInput: "Please enter your name.",
        },
      });
    });
    render(<ContactSection />);

    await fillValidForm(user);
    await user.click(screen.getByRole("button", { name: /Send enquiry/ }));

    const alert = await screen.findByRole("alert");
    expect(alert).toHaveTextContent("Please enter your name.");
    expect(
      screen.queryByText(/your enquiry reached the studio/),
    ).not.toBeInTheDocument();
  });

  it("shows a distinct error state when the submission rejects", async () => {
    const user = userEvent.setup();
    mutate.mockImplementation((_input, options) => {
      options?.onError?.(new Error("network down"));
    });
    render(<ContactSection />);

    await fillValidForm(user);
    await user.click(screen.getByRole("button", { name: /Send enquiry/ }));

    const alert = await screen.findByRole("alert");
    expect(alert).toHaveTextContent(/couldn't reach the studio/);
    expect(
      screen.queryByText(/your enquiry reached the studio/),
    ).not.toBeInTheDocument();
  });

  it("marks the business email as a placeholder and states the limitation", () => {
    render(<ContactSection />);

    expect(
      screen.getByText("REPLACE_WITH_YOUR_EMAIL@example.com"),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/owner must replace it with a real business address/),
    ).toBeInTheDocument();
  });

  it("clears a field error once the visitor corrects it", async () => {
    const user = userEvent.setup();
    render(<ContactSection />);

    await user.click(screen.getByRole("button", { name: /Send enquiry/ }));
    expect(screen.getByText("Please add your name.")).toBeInTheDocument();

    await user.type(screen.getByLabelText("Name"), "Ada");
    await waitFor(() => {
      expect(
        screen.queryByText("Please add your name."),
      ).not.toBeInTheDocument();
    });
  });
});
