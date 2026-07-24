import { describe, it, expect, beforeEach } from "vitest";

import { db, resetStore } from "../../data/store.js";
import { recordHistory, listHistoryForUser } from "./history.service.js";

beforeEach(() => {
  resetStore();
  db.history = [];
  db.nextHistoryId = 1;
});

describe("recordHistory", () => {
  it("records a history entry with a valid outcome", () => {
    const entry = recordHistory({
      userId: 1,
      serviceId: 1,
      joinedAt: new Date().toISOString(),
      servedAt: new Date().toISOString(),
      outcome: "served",
    });
    expect(entry.id).toBeDefined();
    expect(entry.outcome).toBe("served");
  });

  it("rejects an invalid outcome", () => {
    expect(() =>
      recordHistory({
        userId: 1,
        serviceId: 1,
        joinedAt: new Date().toISOString(),
        outcome: "vanished",
      })
    ).toThrow();
  });

  it("rejects missing required fields", () => {
    expect(() => recordHistory({ serviceId: 1, joinedAt: new Date().toISOString(), outcome: "served" })).toThrow();
  });
});

describe("listHistoryForUser", () => {
  it("returns only the given user's history, most recent first", () => {
    recordHistory({
      userId: 1,
      serviceId: 1,
      joinedAt: "2026-01-01T10:00:00.000Z",
      servedAt: "2026-01-01T10:30:00.000Z",
      outcome: "served",
    });
    recordHistory({
      userId: 2,
      serviceId: 1,
      joinedAt: "2026-01-02T10:00:00.000Z",
      outcome: "no_show",
    });
    recordHistory({
      userId: 1,
      serviceId: 2,
      joinedAt: "2026-01-03T10:00:00.000Z",
      outcome: "left_queue",
    });

    const results = listHistoryForUser(1);
    expect(results).toHaveLength(2);
    expect(results[0].outcome).toBe("left_queue");
  });
});
