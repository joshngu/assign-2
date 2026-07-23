import { describe, it, expect } from "vitest";

import { validateRegistration, validateLogin } from "./auth.validation.js";

describe("validateRegistration", () => {
  it("passes for a valid user registration", () => {
    expect(validateRegistration({ email: "a@b.com", password: "Passw0rd!", role: "user" })).toEqual({});
  });

  it("requires an email", () => {
    const errors = validateRegistration({ email: "", password: "Passw0rd!" });
    expect(errors.email).toMatch(/required/i);
  });

  it("rejects a malformed email", () => {
    const errors = validateRegistration({ email: "not-an-email", password: "Passw0rd!" });
    expect(errors.email).toMatch(/valid email/i);
  });

  it("rejects an email over the max length", () => {
    const longEmail = `${"a".repeat(250)}@b.com`;
    const errors = validateRegistration({ email: longEmail, password: "Passw0rd!" });
    expect(errors.email).toMatch(/exceed/i);
  });

  it("requires a password", () => {
    const errors = validateRegistration({ email: "a@b.com", password: "" });
    expect(errors.password).toMatch(/required/i);
  });

  it("rejects a password shorter than 8 characters", () => {
    const errors = validateRegistration({ email: "a@b.com", password: "ab1" });
    expect(errors.password).toMatch(/at least 8/i);
  });

  it("rejects a password without a number", () => {
    const errors = validateRegistration({ email: "a@b.com", password: "abcdefgh" });
    expect(errors.password).toMatch(/letter and one number/i);
  });

  it("rejects a password without a letter", () => {
    const errors = validateRegistration({ email: "a@b.com", password: "12345678" });
    expect(errors.password).toMatch(/letter and one number/i);
  });

  it("rejects an invalid role", () => {
    const errors = validateRegistration({ email: "a@b.com", password: "Passw0rd!", role: "superuser" });
    expect(errors.role).toMatch(/user' or 'admin'/i);
  });

  it("allows an omitted role", () => {
    const errors = validateRegistration({ email: "a@b.com", password: "Passw0rd!" });
    expect(errors.role).toBeUndefined();
  });
});

describe("validateLogin", () => {
  it("passes when both fields are present", () => {
    expect(validateLogin({ email: "a@b.com", password: "x" })).toEqual({});
  });

  it("requires an email", () => {
    const errors = validateLogin({ email: "", password: "x" });
    expect(errors.email).toMatch(/required/i);
  });

  it("requires a password", () => {
    const errors = validateLogin({ email: "a@b.com", password: "" });
    expect(errors.password).toMatch(/required/i);
  });
});
