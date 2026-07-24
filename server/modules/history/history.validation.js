export const VALID_OUTCOMES = ["served", "left_queue", "no_show"];

// Accepts standard ISO 8601 timestamps, e.g. 2026-01-01T10:00:00.000Z
const ISO_TIMESTAMP_RE = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d+)?(Z|[+-]\d{2}:\d{2})$/;

function isValidTimestamp(value) {
  return typeof value === "string" && ISO_TIMESTAMP_RE.test(value) && !Number.isNaN(Date.parse(value));
}

/** Validates the fields needed to record a queue-history entry (required fields, types, formats). */
export function validateHistoryEntry({ userId, serviceId, joinedAt, servedAt, outcome }) {
  const errors = {};

  if (userId === undefined || userId === null || userId === "" || Number.isNaN(Number(userId))) {
    errors.userId = "A valid userId is required.";
  }

  if (serviceId === undefined || serviceId === null || serviceId === "" || Number.isNaN(Number(serviceId))) {
    errors.serviceId = "A valid serviceId is required.";
  }

  if (!joinedAt) {
    errors.joinedAt = "joinedAt is required.";
  } else if (!isValidTimestamp(joinedAt)) {
    errors.joinedAt = "joinedAt must be a valid ISO 8601 timestamp.";
  }

  if (servedAt !== null && servedAt !== undefined && !isValidTimestamp(servedAt)) {
    errors.servedAt = "servedAt must be a valid ISO 8601 timestamp when provided.";
  }

  if (!outcome) {
    errors.outcome = "Outcome is required.";
  } else if (!VALID_OUTCOMES.includes(outcome)) {
    errors.outcome = `Outcome must be one of: ${VALID_OUTCOMES.join(", ")}.`;
  }

  return errors;
}
