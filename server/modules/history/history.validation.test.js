import { describe, it, expect } from "vitest";

import { validateHistoryEntry } from "./history.validation.js";

const valid = {
  userId: 1,
  serviceId: 1,
  joinedAt: "2026-01-01T10:00:00.000Z",
  servedAt: "2026-01-01T10:15:00.000Z",
  outcome: "served",
};

describe("validateHistoryEntry", () => {
  it("passes for a fully valid entry", () => {
    expect(validateHistoryEntry(valid)).toEqual({});
  });

  it("allows a null servedAt (still in progress / not yet served)", () => {
    const errors = validateHistoryEntry({ ...valid, servedAt: null });
    expect(errors.servedAt).toBeUndefined();
  });

  it("requires a userId", () => {
    const errors = validateHistoryEntry({ ...valid, userId: undefined });
    expect(errors.userId).toMatch(/required/i);
  });

  it("rejects a non-numeric userId", () => {
    const errors = validateHistoryEntry({ ...valid, userId: "abc" });
    expect(errors.userId).toMatch(/valid userId/i);
  });

  it("requires a serviceId", () => {
    const errors = validateHistoryEntry({ ...valid, serviceId: undefined });
    expect(errors.serviceId).toMatch(/required/i);
  });

  it("requires a joinedAt", () => {
    const errors = validateHistoryEntry({ ...valid, joinedAt: "" });
    expect(errors.joinedAt).toMatch(/required/i);
  });

  it("rejects a malformed joinedAt", () => {
    const errors = validateHistoryEntry({ ...valid, joinedAt: "not-a-date" });
    expect(errors.joinedAt).toMatch(/ISO 8601/i);
  });

  it("rejects a malformed servedAt when provided", () => {
    const errors = validateHistoryEntry({ ...valid, servedAt: "yesterday" });
    expect(errors.servedAt).toMatch(/ISO 8601/i);
  });

  it("requires an outcome", () => {
    const errors = validateHistoryEntry({ ...valid, outcome: "" });
    expect(errors.outcome).toMatch(/required/i);
  });

  it("rejects an unrecognized outcome", () => {
    const errors = validateHistoryEntry({ ...valid, outcome: "vanished" });
    expect(errors.outcome).toMatch(/must be one of/i);
  });
});
