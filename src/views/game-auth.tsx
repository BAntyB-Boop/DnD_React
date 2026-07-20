"use client";

// Name/passcode form gating the game. Two explicit tabs — "Begin the Trial"
// (create) and "Resume with a passcode" (resume) — rather than one smart-guess
// flow, so the player always knows which server call they're about to make.
// Client-side validation mirrors the server's zod schema (name 2-24 chars,
// passcode 4-6 alnum) for instant feedback; the server stays the source of
// truth and its error codes (name_taken / not_found / invalid_passcode) are
// surfaced inline, never thrown.
import { useState, type FormEvent } from "react";
import { useGameStore } from "@/hooks/use-game-store";

export interface GameAuthProps {
  lang: "en" | "th";
}

type Mode = "create" | "resume";

const NAME_RE = /^.{2,24}$/;
const PASSCODE_RE = /^[A-Za-z0-9]{4,6}$/;

const COPY = {
  en: {
    begin: "Begin the Trial",
    resume: "Resume with a passcode",
    name: "Drifter name",
    passcode: "Passcode",
    nameHint: "2-24 characters.",
    passcodeHint: "4-6 letters or numbers.",
    submitCreate: "Begin",
    submitResume: "Resume",
    submitting: "Working…",
    invalidName: "Name must be 2-24 characters.",
    invalidPasscode: "Passcode must be 4-6 letters or numbers.",
  },
  th: {
    begin: "เริ่มการทดสอบ",
    resume: "กลับเข้าเกมด้วยรหัสผ่าน",
    name: "ชื่อผู้ล่องลอย",
    passcode: "รหัสผ่าน",
    nameHint: "2-24 ตัวอักษร",
    passcodeHint: "4-6 ตัวอักษรหรือตัวเลข",
    submitCreate: "เริ่ม",
    submitResume: "กลับเข้าเกม",
    submitting: "กำลังดำเนินการ…",
    invalidName: "ชื่อต้องมี 2-24 ตัวอักษร",
    invalidPasscode: "รหัสผ่านต้องเป็น 4-6 ตัวอักษรหรือตัวเลข",
  },
} as const;

export const GameAuth = ({ lang }: GameAuthProps) => {
  const [mode, setMode] = useState<Mode>("create");
  const [name, setName] = useState("");
  const [passcode, setPasscode] = useState("");
  const [localError, setLocalError] = useState<string | null>(null);

  const status = useGameStore((s) => s.status);
  const error = useGameStore((s) => s.error);
  const createPlayer = useGameStore((s) => s.createPlayer);
  const resumeSession = useGameStore((s) => s.resumeSession);

  const t = COPY[lang];
  const submitting = status === "loading";

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!NAME_RE.test(name)) {
      setLocalError(t.invalidName);
      return;
    }
    if (!PASSCODE_RE.test(passcode)) {
      setLocalError(t.invalidPasscode);
      return;
    }
    setLocalError(null);
    if (mode === "create") void createPlayer(name, passcode);
    else void resumeSession(name, passcode);
  };

  return (
    <div className="mx-auto flex w-full max-w-md flex-col gap-6">
      <div role="tablist" aria-label={lang === "en" ? "Auth mode" : "โหมดการยืนยันตัวตน"} className="inline-flex items-center gap-1 self-center rounded-full border border-gold/30 bg-bg-card p-1">
        <button
          type="button"
          role="tab"
          aria-selected={mode === "create"}
          onClick={() => setMode("create")}
          className={`rounded-full px-4 py-2 text-sm font-medium ${mode === "create" ? "bg-gold text-bg-deep" : "text-ink-mute hover:text-gold"}`}
        >
          {t.begin}
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={mode === "resume"}
          onClick={() => setMode("resume")}
          className={`rounded-full px-4 py-2 text-sm font-medium ${mode === "resume" ? "bg-gold text-bg-deep" : "text-ink-mute hover:text-gold"}`}
        >
          {t.resume}
        </button>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4 rounded-lg border border-gold/20 bg-bg-card p-6">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="game-name" className="text-xs font-semibold uppercase tracking-[0.2em] text-gold-dim">
            {t.name}
          </label>
          <input
            id="game-name"
            name="name"
            type="text"
            autoComplete="off"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="rounded-md border border-line bg-bg-deep px-4 py-2.5 text-ink outline-none focus:border-gold/60"
          />
          <span className="text-xs text-ink-mute">{t.nameHint}</span>
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="game-passcode" className="text-xs font-semibold uppercase tracking-[0.2em] text-gold-dim">
            {t.passcode}
          </label>
          <input
            id="game-passcode"
            name="passcode"
            type="text"
            autoComplete="off"
            value={passcode}
            onChange={(e) => setPasscode(e.target.value)}
            className="rounded-md border border-line bg-bg-deep px-4 py-2.5 text-ink outline-none focus:border-gold/60"
          />
          <span className="text-xs text-ink-mute">{t.passcodeHint}</span>
        </div>

        {(localError || error) && (
          <p role="alert" className="text-sm text-red-400">
            {localError ?? error}
          </p>
        )}

        <button
          type="submit"
          disabled={submitting}
          className="mt-2 inline-flex items-center justify-center rounded-full bg-gold px-6 py-3 text-sm font-medium text-bg-deep shadow-sm hover:bg-gold-bright disabled:cursor-not-allowed disabled:opacity-60"
        >
          {submitting ? t.submitting : mode === "create" ? t.submitCreate : t.submitResume}
        </button>
      </form>
    </div>
  );
};
