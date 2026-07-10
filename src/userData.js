/* Mock data for the User screens (front-end only — no backend yet) */

export const SERVICES = [
  {
    id: 1,
    name: "General Checkup",
    description: "Routine physical exam and health assessment.",
    durationMinutes: 30,
    status: "open",
    timeSlots: [
      { time: "9:00 AM", available: false },
      { time: "9:30 AM", available: false },
      { time: "10:00 AM", available: true },
      { time: "10:30 AM", available: false },
      { time: "11:00 AM", available: true },
      { time: "11:30 AM", available: true },
    ],
  },
  {
    id: 2,
    name: "Vaccination",
    description: "Scheduled immunizations and booster shots.",
    durationMinutes: 15,
    status: "open",
    timeSlots: [
      { time: "9:15 AM", available: false },
      { time: "9:30 AM", available: true },
      { time: "9:45 AM", available: true },
      { time: "10:00 AM", available: false },
      { time: "10:15 AM", available: true },
    ],
  },
  {
    id: 3,
    name: "Lab Work",
    description: "Blood draw and diagnostic testing.",
    durationMinutes: 20,
    status: "closed",
    timeSlots: [
      { time: "9:00 AM", available: false },
      { time: "9:20 AM", available: false },
      { time: "9:40 AM", available: false },
    ],
  },
];

export const NOTIFICATIONS = [
  { id: 1, message: "Your General Checkup appointment is confirmed for 10:30 AM.", time: "5 min ago", unread: true },
  { id: 2, message: "Vaccination is open again for booking.", time: "1 hr ago", unread: true },
  { id: 3, message: "You were served for your Lab Work appointment.", time: "Yesterday", unread: false },
];

export const HISTORY = [
  { id: 1, date: "Jul 8, 2026", time: "10:15 AM", service: "Lab Work", outcome: "Served" },
  { id: 2, date: "Jul 3, 2026", time: "9:45 AM", service: "Vaccination", outcome: "Served" },
  { id: 3, date: "Jun 27, 2026", time: "11:00 AM", service: "General Checkup", outcome: "Left queue" },
  { id: 4, date: "Jun 20, 2026", time: "9:20 AM", service: "Lab Work", outcome: "No-show" },
];
