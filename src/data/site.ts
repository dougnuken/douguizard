export interface SocialLink {
  label: string;
  href: string;
}

const social: SocialLink[] = [
  { label: "LinkedIn", href: "https://linkedin.com/in/dougvargasco" },
  { label: "Behance", href: "https://behance.net/dougvargas" },
  { label: "Dribbble", href: "https://dribbble.com/douguizard" },
];

export const site = {
  name: "Doug Vargas",
  brand: "Douguizard",
  role: "Product Designer → Design Engineer",
  email: "hello@douguizard.com",
  /** Display form. Use `phoneHref` for the `tel:` link. */
  phone: "+57 300.351.8299",
  phoneHref: "tel:+573003518299",
  location: "Barranquilla, Colombia",
  timezone: "UTC-5",
  availability: {
    status: "available",
    label: "Available 2026",
  },
  social,
  cvPath: "/cv",
} as const;
