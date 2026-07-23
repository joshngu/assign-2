import { describe, it, expect } from "vitest";

import { validateService } from "./services.validation.js";

const validService = {
  name: "General Checkup",
  description: "Routine physical exam.",
  duration: 30,
  priority: "medium",
};

describe("validateService", () => {
  it("passes for a fully valid service", () => {
    expect(validateService(validService)).toEqual({});
  });

  it("requires a name", () => {
    const errors = validateService({ ...validService, name: "  " });
    expect(errors.name).toMatch(/required/i);
  });

  it("rejects a name over 100 characters", () => {
    const errors = validateService({ ...validService, name: "a".repeat(101) });
    expect(errors.name).toMatch(/exceed 100/i);
  });

  it("requires a description", () => {
    const errors = validateService({ ...validService, description: "" });
    expect(errors.description).toMatch(/required/i);
  });

  it("rejects a description over 500 characters", () => {
    const errors = validateService({ ...validService, description: "a".repeat(501) });
    expect(errors.description).toMatch(/exceed 500/i);
  });

  it("requires a duration", () => {
    const errors = validateService({ ...validService, duration: "" });
    expect(errors.duration).toMatch(/required/i);
  });

  it("rejects a non-numeric duration", () => {
    const errors = validateService({ ...validService, duration: "abc" });
    expect(errors.duration).toMatch(/whole number/i);
  });

  it("rejects a zero or negative duration", () => {
    expect(validateService({ ...validService, duration: 0 }).duration).toMatch(/greater than 0/i);
    expect(validateService({ ...validService, duration: -5 }).duration).toMatch(/greater than 0/i);
  });

  it("rejects a non-integer duration", () => {
    const errors = validateService({ ...validService, duration: 12.5 });
    expect(errors.duration).toMatch(/whole number/i);
  });

  it("accepts a numeric string duration", () => {
    const errors = validateService({ ...validService, duration: "45" });
    expect(errors.duration).toBeUndefined();
  });

  it("requires a priority", () => {
    const errors = validateService({ ...validService, priority: "" });
    expect(errors.priority).toMatch(/select/i);
  });

  it("rejects an unrecognized priority", () => {
    const errors = validateService({ ...validService, priority: "urgent" });
    expect(errors.priority).toMatch(/low, medium, or high/i);
  });
});
