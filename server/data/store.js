import bcrypt from "bcryptjs";

/* In-memory data store — no real database (per assignment scope). */

function seedUsers() {
  return [
    {
      id: 1,
      email: "jane@example.com",
      passwordHash: bcrypt.hashSync("Passw0rd!", 8),
      role: "user",
    },
    {
      id: 2,
      email: "admin@queuesmart.com",
      passwordHash: bcrypt.hashSync("Passw0rd!", 8),
      role: "admin",
    },
  ];
}

function seedServices() {
  return [
    {
      id: 1,
      name: "General Checkup",
      description: "Routine physical exam and health assessment.",
      duration: 30,
      priority: "medium",
    },
    {
      id: 2,
      name: "Vaccination",
      description: "Scheduled immunizations and booster shots.",
      duration: 15,
      priority: "high",
    },
    {
      id: 3,
      name: "Lab Work",
      description: "Blood draw and diagnostic testing.",
      duration: 20,
      priority: "low",
    },
  ];
}

export const db = {
  users: seedUsers(),
  services: seedServices(),
  sessions: new Map(), // token -> { userId }
  nextUserId: 3,
  nextServiceId: 4,
};

/** Resets the in-memory store to its seeded state — used between test runs. */
export function resetStore() {
  db.users = seedUsers();
  db.services = seedServices();
  db.sessions = new Map();
  db.nextUserId = 3;
  db.nextServiceId = 4;
}
