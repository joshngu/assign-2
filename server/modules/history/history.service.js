import { db } from "../../data/store.js";
import { ApiError } from "../../utils/ApiError.js";

/*
 * History Module.
 * Tracks queue participation history for users. Stored in-memory per
 * assignment scope (no real database yet).
 */

const VALID_OUTCOMES = ["served", "left_queue", "no_show"];

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
  if (!userId || !serviceId || !joinedAt) {
    throw new ApiError(400, "userId, serviceId, and joinedAt are required.");
  }
  if (!VALID_OUTCOMES.includes(outcome)) {
    throw new ApiError(400, `Unknown outcome: ${outcome}`);
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
