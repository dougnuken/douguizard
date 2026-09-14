"use client";

import { useEffect, useRef, useState } from "react";
import { coverLetterText } from "@/data/coverLetter";

type State = "idle" | "copied" | "failed";

const LABEL: Record<State, string> = {
  idle: "Copy letter",
  copied: "Copied",
  failed: "Couldn't copy",
};

/**
 * Puts the letter on the clipboard as plain text.
 *
 * The realistic use for a cover letter is not reading it here — it is pasting
 * it into an application form or an email body, which is why this exists and
 * why `coverLetterText()` renders it without a single tag.
 */
export default function CopyLetterButton() {
  const [state, setState] = useState<State>("idle");
  const timer = useRef<number | undefined>(undefined);

  useEffect(() => () => window.clearTimeout(timer.current), []);

  const copy = async () => {
    window.clearTimeout(timer.current);
    try {
      await navigator.clipboard.writeText(coverLetterText());
      setState("copied");
    } catch {
      // No clipboard permission, or an insecure origin. Say so rather than
      // flashing "Copied" over an empty clipboard.
      setState("failed");
    }
    timer.current = window.setTimeout(() => setState("idle"), 2600);
  };

  return (
    <button
      type="button"
      onClick={copy}
      className="btn-pill h-11 min-h-11 px-5 text-[14px] print:hidden"
    >
      {/* One live region, not a label swap: a reader should hear the outcome
          without the button renaming itself underneath the focus. */}
      <span aria-hidden>{LABEL[state]}</span>
      <span className="sr-only" role="status">
        {state === "idle" ? LABEL.idle : LABEL[state]}
      </span>
    </button>
  );
}
