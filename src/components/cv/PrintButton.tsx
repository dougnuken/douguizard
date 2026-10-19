"use client";

import { useId, useRef, useState } from "react";
import { getSite } from "@/data/site";
import { locales, localeName, type Locale } from "@/i18n/config";
import { getDict } from "@/i18n/dictionaries";
import { useDict, useLocale } from "@/i18n/LocaleProvider";

/**
 * The CV download on `/cv`. Four static sheets exist (two languages, with and
 * without the photo), so the button opens a small native `<dialog>` to pick
 * one: the page's language and the photo come preselected, and the link at the
 * bottom is a plain download of the chosen file. `<dialog>` brings focus
 * trapping, Escape and the backdrop for free; a click on the backdrop closes it.
 */
export default function PrintButton() {
  const locale = useLocale();
  const t = useDict().cv;
  const site = getSite(locale);
  const ref = useRef<HTMLDialogElement>(null);
  const id = useId();
  const [lang, setLang] = useState<Locale>(locale);
  const [photo, setPhoto] = useState(true);

  if (!site.cv.pdf) {
    return (
      <button
        type="button"
        onClick={() => window.print()}
        className="btn-pill h-11 min-h-11 px-5 text-[14px] print:hidden"
      >
        {t.download}
      </button>
    );
  }

  const d = t.downloadDialog;
  const chosen = getSite(lang).cv;
  const href = (photo ? chosen.pdf : chosen.pdfNoPhoto) ?? chosen.pdf!;
  const close = () => ref.current?.close();

  const option = "flex min-h-11 flex-1 cursor-pointer items-center gap-2 rounded-full border px-4 text-[14px]";
  const on = "border-[var(--ink)] text-[var(--ink)]";
  const off = "border-[var(--line-strong)] text-[var(--ink-muted)] hover:text-[var(--ink)]";

  return (
    <>
      <button
        type="button"
        aria-haspopup="dialog"
        onClick={() => {
          setLang(locale);
          setPhoto(true);
          ref.current?.showModal();
        }}
        className="btn-pill h-11 min-h-11 px-5 text-[14px] print:hidden"
      >
        {t.download}
      </button>

      <dialog
        ref={ref}
        aria-labelledby={`${id}-title`}
        onClick={(e) => e.target === e.currentTarget && close()}
        className="m-auto w-[calc(100%-32px)] max-w-[380px] rounded-2xl border border-[var(--line)] bg-[var(--paper)] p-0 text-[var(--ink)] shadow-2xl backdrop:bg-black/50 print:hidden"
      >
        <div className="flex flex-col gap-5 p-6">
          <h2 id={`${id}-title`} className="text-[18px] font-semibold leading-tight">
            {d.title}
          </h2>

          <fieldset className="flex flex-col gap-2">
            <legend className="mb-2 font-mono text-[11px] uppercase tracking-[0.15em] text-[var(--ink-dim)]">
              {d.language}
            </legend>
            <div className="flex gap-2">
              {locales.map((l) => (
                <label key={l} className={`${option} ${lang === l ? on : off}`}>
                  <input
                    type="radio"
                    name={`${id}-lang`}
                    value={l}
                    checked={lang === l}
                    onChange={() => setLang(l)}
                    className="accent-[var(--ink)]"
                  />
                  <span lang={l}>{localeName[l]}</span>
                </label>
              ))}
            </div>
          </fieldset>

          <fieldset className="flex flex-col gap-2">
            <legend className="mb-2 font-mono text-[11px] uppercase tracking-[0.15em] text-[var(--ink-dim)]">
              {d.photo}
            </legend>
            <div className="flex gap-2">
              {[true, false].map((p) => (
                <label key={String(p)} className={`${option} ${photo === p ? on : off}`}>
                  <input
                    type="radio"
                    name={`${id}-photo`}
                    checked={photo === p}
                    onChange={() => setPhoto(p)}
                    className="accent-[var(--ink)]"
                  />
                  {p ? d.withPhoto : d.noPhoto}
                </label>
              ))}
            </div>
            <p className="text-[13px] leading-snug text-[var(--ink-muted)]">{d.noPhotoHint}</p>
          </fieldset>

          <div className="flex items-center justify-end gap-2 pt-1">
            <button
              type="button"
              onClick={close}
              className="inline-flex h-11 min-h-11 items-center px-4 text-[14px] text-[var(--ink-muted)] hover:text-[var(--ink)]"
            >
              {d.cancel}
            </button>
            <a
              href={href}
              // Named, not left to the URL, and in the sheet's own language: a
              // recruiter's downloads folder should say whose CV this is.
              download={getDict(lang).cv.downloadName(site.name, photo)}
              onClick={close}
              className="btn-pill btn-pill--solid h-11 min-h-11 px-5 text-[14px]"
            >
              {d.submit}
            </a>
          </div>
        </div>
      </dialog>
    </>
  );
}
