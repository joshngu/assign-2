import crypto from "node:crypto";
import bcrypt from "bcryptjs";

import { db } from "../../data/store.js";
import { ApiError } from "../../utils/ApiError.js";
import { validateRegistration, validateLogin } from "./auth.validation.js";

function toPublicUser(user) {
  return { id: user.id, email: user.email, role: user.role };
}

function createSession(user) {
  const token = crypto.randomUUID();
  db.sessions.set(token, { userId: user.id });
  return token;
}

export function register({ email, password, role }) {
  const errors = validateRegistration({ email, password, role });
  if (Object.keys(errors).length > 0) {
    throw new ApiError(400, "Validation failed", errors);
  }

  const normalizedEmail = email.trim().toLowerCase();
  const exists = db.users.some((u) => u.email.toLowerCase() === normalizedEmail);
  if (exists) {
    throw new ApiError(409, "Registration failed", {
      email: "This email is already registered. Try logging in instead.",
    });
  }

  const user = {
    id: db.nextUserId++,
    email: email.trim(),
    passwordHash: bcrypt.hashSync(password, 8),
    role: role || "user",
  };
  db.users.push(user);

  const token = createSession(user);
  return { user: toPublicUser(user), token };
}

export function login({ email, password }) {
  const errors = validateLogin({ email, password });
  if (Object.keys(errors).length > 0) {
    throw new ApiError(400, "Validation failed", errors);
  }

  const normalizedEmail = email.trim().toLowerCase();
  const user = db.users.find((u) => u.email.toLowerCase() === normalizedEmail);
  const passwordMatches = user && bcrypt.compareSync(password, user.passwordHash);

  if (!passwordMatches) {
    throw new ApiError(401, "Incorrect email or password.");
  }

  const token = createSession(user);
  return { user: toPublicUser(user), token };
}

export function getUserForToken(token) {
  const session = token ? db.sessions.get(token) : undefined;
  if (!session) return null;
  const user = db.users.find((u) => u.id === session.userId);
  return user ? toPublicUser(user) : null;
}
