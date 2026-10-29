import { PocketIc } from "@dfinity/pic";
import type { Actor, CanisterFixture } from "@dfinity/pic";
import { afterAll, beforeAll, expect, it } from "vitest";

import { idlFactory } from "../../src/frontend/src/declarations/backend.did.js";
import type { _SERVICE } from "../../src/frontend/src/declarations/backend.did";

const PIC_URL = process.env.POCKET_IC_URL ?? "";
const BACKEND_WASM = process.env.BACKEND_WASM ?? "";

let pic: PocketIc | undefined;
let actor: Actor<_SERVICE>;
let canisterId: CanisterFixture<_SERVICE>["canisterId"];

beforeAll(async () => {
  pic = await PocketIc.create(PIC_URL);
  ({ actor, canisterId } = await pic.setupCanister<_SERVICE>({
    idlFactory,
    wasm: BACKEND_WASM,
  }));
});

afterAll(async () => {
  await pic?.tearDown();
});

it("answers the public API-doc query instead of trapping", async () => {
  const doc = await actor.getApiDoc();
  expect(typeof doc).toBe("string");
  expect(doc).toContain("submitEnquiry");
});

it("rejects invalid input with a typed error rather than trapping", async () => {
  const result = await actor.submitEnquiry({
    name: "",
    email: "",
    projectType: "",
    description: "",
    budget: [],
  });

  expect(result).toHaveProperty("err");
  if ("err" in result) {
    expect(result.err).toHaveProperty("invalidInput");
  }
});

it("rejects a malformed email address", async () => {
  const result = await actor.submitEnquiry({
    name: "Ada",
    email: "not-an-email",
    projectType: "Website",
    description: "A new site.",
    budget: [],
  });

  expect(result).toHaveProperty("err");
  if ("err" in result) {
    expect(result.err).toHaveProperty("invalidInput");
  }
});

it("traps listEnquiries for an unregistered anonymous caller", async () => {
  // A freshly created actor calls as the anonymous principal until an identity
  // is set. listEnquiries is admin-only, so an anonymous caller must be denied.
  const guest = pic!.createActor<_SERVICE>(idlFactory, canisterId);
  await expect(guest.listEnquiries()).rejects.toThrow();
});
