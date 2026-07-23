const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const VALID_ROLES = ["user", "admin"];
const MAX_EMAIL_LENGTH = 254;
const MIN_PASSWORD_LENGTH = 8;
const MAX_PASSWORD_LENGTH = 72;

export function validateRegistration({ email, password, role }) {
  const errors = {};

  if (typeof email !== "string" || !email.trim()) {
    errors.email = "Email is required.";
  } else if (email.trim().length > MAX_EMAIL_LENGTH) {
    errors.email = `Email must not exceed ${MAX_EMAIL_LENGTH} characters.`;
  } else if (!EMAIL_RE.test(email.trim())) {
    errors.email = "Enter a valid email address.";
  }

  if (typeof password !== "string" || !password) {
    errors.password = "Password is required.";
  } else if (password.length < MIN_PASSWORD_LENGTH) {
    errors.password = `Password must be at least ${MIN_PASSWORD_LENGTH} characters.`;
  } else if (password.length > MAX_PASSWORD_LENGTH) {
    errors.password = `Password must not exceed ${MAX_PASSWORD_LENGTH} characters.`;
  } else if (!/[A-Za-z]/.test(password) || !/[0-9]/.test(password)) {
    errors.password = "Password must contain at least one letter and one number.";
  }

  if (role !== undefined && role !== null && !VALID_ROLES.includes(role)) {
    errors.role = "Role must be either 'user' or 'admin'.";
  }

  return errors;
}

export function validateLogin({ email, password }) {
  const errors = {};

  if (typeof email !== "string" || !email.trim()) {
    errors.email = "Email is required.";
  }

  if (typeof password !== "string" || !password) {
    errors.password = "Password is required.";
  }

  return errors;
}
