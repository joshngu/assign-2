import React, { useState, useEffect } from "react";
import {
  Ticket,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ShieldCheck,
  User as UserIcon,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";

import App from "./App";
import UserApp from "./UserApp";

/* ---------------------------------------------------------
   Design tokens
--------------------------------------------------------- */
export const COLORS = {
  ink: "#16213E",
  paper: "#F5F6F2",
  amber: "#FFB627",
  green: "#2FA84F",
  greenText: "#1E7A3C",
  coral: "#D14A3A",
  slate: "#5B6472",
  line: "#DEDCD3",
};
export const FONT_DISPLAY = "'IBM Plex Sans', sans-serif";
export const FONT_MONO = "'IBM Plex Mono', monospace";

/* ---------------------------------------------------------
   Mock data / helpers (no backend — persisted to localStorage
   so accounts created via Register survive page reloads)
--------------------------------------------------------- */
const SEED_USERS = [
  { email: "jane@example.com", password: "Passw0rd!", role: "user" },
  { email: "admin@queuesmart.com", password: "Passw0rd!", role: "admin" },
];
const USERS_STORAGE_KEY = "queuesmart_users";

function loadUsers() {
  try {
    const stored = JSON.parse(localStorage.getItem(USERS_STORAGE_KEY));
    if (!Array.isArray(stored)) return SEED_USERS;
    const seedEmails = new Set(SEED_USERS.map((u) => u.email.toLowerCase()));
    const registered = stored.filter((u) => !seedEmails.has(u.email?.toLowerCase()));
    return [...SEED_USERS, ...registered];
  } catch {
    return SEED_USERS;
  }
}

function saveRegisteredUsers(users) {
  try {
    const seedEmails = new Set(SEED_USERS.map((u) => u.email.toLowerCase()));
    const registered = users.filter((u) => !seedEmails.has(u.email.toLowerCase()));
    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(registered));
  } catch {
    // localStorage unavailable (e.g. private browsing) — accounts stay in-memory only
  }
}

function validEmail(v) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
}
function pwRules(pw) {
  return [
    { label: "8+ characters", pass: pw.length >= 8 },
    { label: "a letter", pass: /[A-Za-z]/.test(pw) },
    { label: "a number", pass: /[0-9]/.test(pw) },
  ];
}

/* ---------------------------------------------------------
   Root
--------------------------------------------------------- */
export default function QueueSmartAuth() {
  const [screen, setScreen] = useState("login"); // login | register | dashboard
  const [users, setUsers] = useState(loadUsers);
  const [currentUser, setCurrentUser] = useState(null);
  const [ticket, setTicket] = useState(41);

  useEffect(() => {
    const id = setInterval(() => setTicket((t) => t + 1), 2600);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    saveRegisteredUsers(users);
  }, [users]);

  function handleLogout() {
    setCurrentUser(null);
    setScreen("login");
  }

  return (
    <div style={{ fontFamily: FONT_DISPLAY, background: COLORS.paper }} className="min-h-screen w-full">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:wght@400;500;600;700&family=IBM+Plex+Mono:wght@400;500;600&display=swap');
        .qs-input:focus { outline: 2px solid ${COLORS.ink}; outline-offset: 2px; border-radius: 2px; }
        .qs-btn:focus-visible { outline: 2px solid ${COLORS.ink}; outline-offset: 2px; }
        .qs-tick { animation: qsTickPulse 0.4s ease; display: inline-block; }
        @keyframes qsTickPulse { from { opacity: 0; transform: translateY(4px);} to { opacity: 1; transform: translateY(0);} }
        @media (prefers-reduced-motion: reduce) {
          .qs-tick { animation: none !important; }
        }
      `}</style>

      {screen === "dashboard" && currentUser ? (
        <Dashboard user={currentUser} onLogout={handleLogout} />
      ) : (
        <AuthShell ticket={ticket}>
          {screen === "login" ? (
            <LoginPanel
              users={users}
              onSuccess={(u) => {
                setCurrentUser(u);
                setScreen("dashboard");
              }}
              goRegister={() => setScreen("register")}
            />
          ) : (
            <RegisterPanel
              users={users}
              onRegister={(u) => {
                setUsers((prev) => [...prev, u]);
                setCurrentUser(u);
                setScreen("dashboard");
              }}
              goLogin={() => setScreen("login")}
            />
          )}
        </AuthShell>
      )}
    </div>
  );
}

/* ---------------------------------------------------------
   Shell: brand / ticket panel + perforated seam + form panel
--------------------------------------------------------- */
function AuthShell({ ticket, children }) {
  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      <div
        className="relative w-full md:w-2/5 flex flex-col justify-between px-8 py-10 md:px-12 md:py-14"
        style={{ background: COLORS.ink, color: COLORS.paper }}
      >
        <div>
          <div className="flex items-center gap-2">
            <Ticket size={22} strokeWidth={2} />
            <span className="text-lg font-semibold tracking-tight">QueueSmart</span>
          </div>
          <p
            className="mt-1 text-xs uppercase tracking-widest"
            style={{ fontFamily: FONT_MONO, color: COLORS.amber }}
          >
            Virtual queue access
          </p>
        </div>

        <div>
          <p className="text-2xl md:text-3xl font-semibold leading-snug max-w-xs">
            Take your place in line — from anywhere.
          </p>
          <p className="mt-3 text-sm max-w-xs" style={{ color: "#B9C0D4" }}>
            Join a queue, track your position, and get called when it's your turn. No standing required.
          </p>
        </div>

        <div className="mt-10 md:mt-0">
          <p
            className="text-xs uppercase tracking-widest mb-2"
            style={{ fontFamily: FONT_MONO, color: "#8892AC" }}
          >
            Now serving — Front Desk
          </p>
          <div className="flex items-baseline gap-3">
            <span
              key={ticket}
              className="qs-tick text-4xl md:text-5xl font-semibold"
              style={{ fontFamily: FONT_MONO, color: COLORS.amber }}
            >
              A-{String(ticket).padStart(3, "0")}
            </span>
            <span className="flex items-center gap-1 text-xs" style={{ color: COLORS.green }}>
              <span className="h-2 w-2 rounded-full inline-block" style={{ background: COLORS.green }} />
              live
            </span>
          </div>
        </div>
      </div>

      <Perforation />

      <div className="w-full md:w-3/5 flex items-center justify-center px-6 py-12 md:px-16">
        <div className="w-full max-w-sm">{children}</div>
      </div>
    </div>
  );
}

function Perforation() {
  const dots = Array.from({ length: 16 });
  return (
    <div className="hidden md:block relative" style={{ width: "1px" }}>
      <div className="absolute top-0 bottom-0" style={{ left: 0, borderLeft: `2px dashed ${COLORS.line}` }} />
      <div className="h-full flex flex-col items-center justify-around py-6">
        {dots.map((_, i) => (
          <span
            key={i}
            className="h-3 w-3 rounded-full block"
            style={{ marginLeft: "-7px", background: COLORS.paper, border: `2px solid ${COLORS.line}` }}
          />
        ))}
      </div>
    </div>
  );
}

/* ---------------------------------------------------------
   Shared form pieces
--------------------------------------------------------- */
function Eyebrow({ children }) {
  return (
    <p className="text-xs uppercase tracking-widest mb-2" style={{ fontFamily: FONT_MONO, color: COLORS.slate }}>
      {children}
    </p>
  );
}

function Field({ id, label, icon: Icon, error, children, rightSlot }) {
  return (
    <div>
      <label htmlFor={id} className="block text-xs font-medium mb-1" style={{ color: COLORS.slate }}>
        {label}
      </label>
      <div
        className="flex items-center gap-2 border-b py-1"
        style={{ borderColor: error ? COLORS.coral : COLORS.line }}
      >
        <Icon size={16} style={{ color: COLORS.slate }} />
        {children}
        {rightSlot}
      </div>
      {error && (
        <p className="mt-1 text-xs flex items-center gap-1" style={{ color: COLORS.coral }}>
          <AlertCircle size={12} /> {error}
        </p>
      )}
    </div>
  );
}

function RoleButton({ active, onClick, icon: Icon, label }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex-1 flex items-center justify-center gap-1.5 py-2 text-xs font-medium"
      style={{ background: active ? COLORS.ink : "transparent", color: active ? COLORS.paper : COLORS.slate }}
    >
      <Icon size={14} /> {label}
    </button>
  );
}

/* ---------------------------------------------------------
   Login
--------------------------------------------------------- */
function LoginPanel({ users, onSuccess, goRegister }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  function validate() {
    const e = {};
    if (!email.trim()) e.email = "Email is required.";
    else if (!validEmail(email)) e.email = "Enter a valid email address.";
    if (!password) e.password = "Password is required.";
    return e;
  }

  function handleSubmit(ev) {
    ev.preventDefault();
    const e = validate();
    if (Object.keys(e).length) {
      setErrors(e);
      return;
    }
    setSubmitting(true);
    setTimeout(() => {
      const match = users.find(
        (u) => u.email.toLowerCase() === email.trim().toLowerCase() && u.password === password
      );
      setSubmitting(false);
      if (!match) {
        setErrors({ form: "Incorrect email or password." });
        return;
      }
      setErrors({});
      onSuccess(match);
    }, 400);
  }

  return (
    <form onSubmit={handleSubmit} noValidate>
      <Eyebrow>Account access</Eyebrow>
      <h1 className="text-2xl font-semibold" style={{ color: COLORS.ink }}>
        Log in
      </h1>
      <p className="mt-1 text-sm" style={{ color: COLORS.slate }}>
        New to QueueSmart?{" "}
        <button type="button" onClick={goRegister} className="underline font-medium" style={{ color: COLORS.ink }}>
          Create an account
        </button>
      </p>

      <div className="mt-6 space-y-4">
        <Field id="login-email" label="Email" icon={Mail} error={errors.email}>
          <input
            id="login-email"
            type="email"
            aria-invalid={!!errors.email}
            className="qs-input w-full bg-transparent text-sm py-2"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setErrors((p) => ({ ...p, email: undefined, form: undefined }));
            }}
          />
        </Field>

        <Field
          id="login-password"
          label="Password"
          icon={Lock}
          error={errors.password}
          rightSlot={
            <button
              type="button"
              onClick={() => setShowPw((s) => !s)}
              style={{ color: COLORS.slate }}
              aria-label={showPw ? "Hide password" : "Show password"}
            >
              {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          }
        >
          <input
            id="login-password"
            type={showPw ? "text" : "password"}
            aria-invalid={!!errors.password}
            className="qs-input w-full bg-transparent text-sm py-2"
            placeholder="••••••••"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              setErrors((p) => ({ ...p, password: undefined, form: undefined }));
            }}
          />
        </Field>

        {errors.form && (
          <div className="flex items-center gap-2 text-sm" style={{ color: COLORS.coral }}>
            <AlertCircle size={16} /> {errors.form}
          </div>
        )}

        <button
          type="submit"
          disabled={submitting}
          className="qs-btn w-full flex items-center justify-center gap-2 py-3 rounded-lg text-sm font-semibold mt-2"
          style={{ background: COLORS.ink, color: COLORS.paper, opacity: submitting ? 0.7 : 1 }}
        >
          {submitting ? "Checking…" : "Get in line"} <ArrowRight size={16} />
        </button>
      </div>

      <div
        className="mt-6 p-3 rounded-lg text-xs leading-relaxed"
        style={{ background: "#FFF7E8", color: "#8A6416", fontFamily: FONT_MONO }}
      >
        Demo access — User: jane@example.com / Passw0rd!
        <br />
        Admin: admin@queuesmart.com / Passw0rd!
      </div>
    </form>
  );
}

/* ---------------------------------------------------------
   Register
--------------------------------------------------------- */
function RegisterPanel({ users, onRegister, goLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [role, setRole] = useState("user");
  const [showPw, setShowPw] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [touchedPw, setTouchedPw] = useState(false);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const rules = pwRules(password);

  function validate() {
    const e = {};
    if (!email.trim()) e.email = "Email is required.";
    else if (!validEmail(email)) e.email = "Enter a valid email address.";
    else if (users.some((u) => u.email.toLowerCase() === email.trim().toLowerCase()))
      e.email = "This email is already registered. Try logging in instead.";

    if (!password) e.password = "Password is required.";
    else if (rules.some((r) => !r.pass)) e.password = "Password doesn't meet the requirements below.";

    if (!confirm) e.confirm = "Confirm your password.";
    else if (confirm !== password) e.confirm = "Passwords don't match.";

    return e;
  }

  function handleSubmit(ev) {
    ev.preventDefault();
    const e = validate();
    if (Object.keys(e).length) {
      setErrors(e);
      return;
    }
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      onRegister({ email: email.trim(), password, role });
    }, 400);
  }

  return (
    <form onSubmit={handleSubmit} noValidate>
      <Eyebrow>New account</Eyebrow>
      <h1 className="text-2xl font-semibold" style={{ color: COLORS.ink }}>
        Create your account
      </h1>
      <p className="mt-1 text-sm" style={{ color: COLORS.slate }}>
        Already have one?{" "}
        <button type="button" onClick={goLogin} className="underline font-medium" style={{ color: COLORS.ink }}>
          Log in
        </button>
      </p>

      <div className="mt-6 space-y-4">
        <div>
          <label className="block text-xs font-medium mb-2" style={{ color: COLORS.slate }}>
            I'm registering as
          </label>
          <div className="flex rounded-lg overflow-hidden border" style={{ borderColor: COLORS.line }}>
            <RoleButton active={role === "user"} onClick={() => setRole("user")} icon={UserIcon} label="Customer" />
            <RoleButton
              active={role === "admin"}
              onClick={() => setRole("admin")}
              icon={ShieldCheck}
              label="Administrator"
            />
          </div>
        </div>

        <Field id="reg-email" label="Email" icon={Mail} error={errors.email}>
          <input
            id="reg-email"
            type="email"
            aria-invalid={!!errors.email}
            className="qs-input w-full bg-transparent text-sm py-2"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setErrors((p) => ({ ...p, email: undefined }));
            }}
          />
        </Field>

        <Field
          id="reg-password"
          label="Password"
          icon={Lock}
          error={errors.password}
          rightSlot={
            <button
              type="button"
              onClick={() => setShowPw((s) => !s)}
              style={{ color: COLORS.slate }}
              aria-label={showPw ? "Hide password" : "Show password"}
            >
              {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          }
        >
          <input
            id="reg-password"
            type={showPw ? "text" : "password"}
            aria-invalid={!!errors.password}
            className="qs-input w-full bg-transparent text-sm py-2"
            placeholder="••••••••"
            value={password}
            onFocus={() => setTouchedPw(true)}
            onChange={(e) => {
              setPassword(e.target.value);
              setErrors((p) => ({ ...p, password: undefined }));
            }}
          />
        </Field>

        {touchedPw && (
          <ul className="flex flex-wrap gap-x-4 gap-y-1 -mt-2">
            {rules.map((r) => (
              <li
                key={r.label}
                className="flex items-center gap-1 text-xs"
                style={{ color: r.pass ? COLORS.greenText : COLORS.slate }}
              >
                <CheckCircle2 size={12} /> {r.label}
              </li>
            ))}
          </ul>
        )}

        <Field
          id="reg-confirm"
          label="Confirm password"
          icon={Lock}
          error={errors.confirm}
          rightSlot={
            <button
              type="button"
              onClick={() => setShowConfirm((s) => !s)}
              style={{ color: COLORS.slate }}
              aria-label={showConfirm ? "Hide password" : "Show password"}
            >
              {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          }
        >
          <input
            id="reg-confirm"
            type={showConfirm ? "text" : "password"}
            aria-invalid={!!errors.confirm}
            className="qs-input w-full bg-transparent text-sm py-2"
            placeholder="••••••••"
            value={confirm}
            onChange={(e) => {
              setConfirm(e.target.value);
              setErrors((p) => ({ ...p, confirm: undefined }));
            }}
          />
        </Field>

        <button
          type="submit"
          disabled={submitting}
          className="qs-btn w-full flex items-center justify-center gap-2 py-3 rounded-lg text-sm font-semibold mt-2"
          style={{ background: COLORS.ink, color: COLORS.paper, opacity: submitting ? 0.7 : 1 }}
        >
          {submitting ? "Creating account…" : "Create account"} <ArrowRight size={16} />
        </button>
      </div>
    </form>
  );
}

/* ---------------------------------------------------------
   Post-auth routing: admins get the admin panel, customers
   get the QueueSmart user screens
--------------------------------------------------------- */
function Dashboard({ user, onLogout }) {
  const isAdmin = user.role === "admin";

  if (isAdmin) {
    return <App userEmail={user.email} onLogout={onLogout} />;
  }

  return <UserApp user={user} onLogout={onLogout} />;
}
