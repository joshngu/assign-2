import { db } from "../../data/store.js";
import { ApiError } from "../../utils/ApiError.js";
import { validateHistoryEntry } from "./history.validation.js";

/*
 * History Module.
 * Tracks queue participation history for users. Stored in-memory per
 * assignment scope (no real database yet).
 */

function toPublicHistoryEntry(entry) {
  return {
    id: entry.id,
    userId: entry.userId,
    serviceId: entry.serviceId,
    joinedAt: entry.joinedAt,
    servedAt: entry.servedAt,
    outcome: entry.outcome,
  };
}

export function recordHistory({ userId, serviceId, joinedAt, servedAt = null, outcome }) {
  const errors = validateHistoryEntry({ userId, serviceId, joinedAt, servedAt, outcome });
  if (Object.keys(errors).length > 0) {
    throw new ApiError(400, "Validation failed", errors);
  }

  const entry = {
    id: db.nextHistoryId++,
    userId,
    serviceId,
    joinedAt,
    servedAt,
    outcome,
  };
  db.history.push(entry);
  return toPublicHistoryEntry(entry);
}

export function listHistoryForUser(userId) {
  return db.history
    .filter((h) => h.userId === userId)
    .sort((a, b) => new Date(b.joinedAt) - new Date(a.joinedAt))
    .map(toPublicHistoryEntry);
}
