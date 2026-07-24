import { describe, it, expect } from "vitest";

import { validateNotification, validateNotificationId } from "./notifications.validation.js";

const valid = { userId: 1, type: "queue_joined", message: "You joined the queue." };

describe("validateNotification", () => {
  it("passes for a fully valid notification", () => {
    expect(validateNotification(valid)).toEqual({});
  });

  it("requires a userId", () => {
    const errors = validateNotification({ ...valid, userId: undefined });
    expect(errors.userId).toMatch(/required/i);
  });

  it("rejects a non-numeric userId", () => {
    const errors = validateNotification({ ...valid, userId: "not-a-number" });
    expect(errors.userId).toMatch(/valid userId/i);
  });

  it("requires a type", () => {
    const errors = validateNotification({ ...valid, type: "" });
    expect(errors.type).toMatch(/required/i);
  });

  it("rejects an unrecognized type", () => {
    const errors = validateNotification({ ...valid, type: "some_other_type" });
    expect(errors.type).toMatch(/must be one of/i);
  });

  it("requires a message", () => {
    const errors = validateNotification({ ...valid, message: "   " });
    expect(errors.message).toMatch(/required/i);
  });

  it("rejects a message over the max length", () => {
    const errors = validateNotification({ ...valid, message: "a".repeat(301) });
    expect(errors.message).toMatch(/exceed 300/i);
  });
});

describe("validateNotificationId", () => {
  it("passes for a valid numeric id", () => {
    expect(validateNotificationId(5)).toEqual({});
    expect(validateNotificationId("5")).toEqual({});
  });

  it("rejects a missing id", () => {
    expect(validateNotificationId(undefined).id).toMatch(/required/i);
  });

  it("rejects a non-numeric id", () => {
    expect(validateNotificationId("abc").id).toMatch(/required/i);
  });
});

