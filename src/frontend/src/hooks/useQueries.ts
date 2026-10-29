import { createActor } from "@/backend";
import type { EnquiryInput, SubmitResult } from "@/backend";
import { useActor } from "@caffeineai/core-infrastructure";
import { useMutation } from "@tanstack/react-query";

export type { EnquiryInput, SubmitResult };

/**
 * Submit a contact enquiry. Resolves with the backend result so the caller
 * can branch on `ok` / `err` and never report a false success.
 */
export function useSubmitEnquiry() {
  const { actor } = useActor(createActor);

  return useMutation<SubmitResult, Error, EnquiryInput>({
    mutationFn: async (input: EnquiryInput) => {
      if (!actor) throw new Error("Backend is not ready");
      return actor.submitEnquiry(input);
    },
  });
}
