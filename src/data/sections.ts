export interface Section {
  /** Anchor + skip-link target. */
  id: string;
  /** "00".."04" */
  num: string;
  /** SectionIndex + header nav. */
  label: string;
  /** Panel heading. */
  title: string;
}

/**
 * The home panels, in document order. Shared by `app/page.tsx` (which renders
 * them) and `SectionIndex` (which indexes them), so the rail can never drift
 * from the panels again.
 */
export const sections: Section[] = [
  { id: "home", num: "00", label: "Home", title: "Doug Vargas" },
  { id: "work", num: "01", label: "Work", title: "Selected work" },
  { id: "craft", num: "02", label: "Craft", title: "How I work" },
  { id: "about", num: "03", label: "About", title: "About" },
  { id: "contact", num: "04", label: "Contact", title: "Let's talk" },
];
