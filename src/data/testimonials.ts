export interface Testimonial {
    id: string;
    quote: string;
    author: {
      name: string;
      role: string;
      company: string;
      initials: string;
    };
    /** Project context (optional) — what work the testimonial relates to */
    context?: string;
    /** Year the testimonial was given */
    year: string;
  }
  
  export const testimonials: Testimonial[] = [
    {
      id: "francesca",
      quote:
        "Extremely professional and fast service. Doug is a master of detail and very creative. We've done 8 projects with him and every single one delivered above expectations. He doesn't just design — he architects how products should feel.",
      author: {
        name: "Francesca Steri",
        role: "Design Director",
        company: "Aval Digital Labs",
        initials: "FS",
      },
      context: "Banco de Occidente · Velocity Design System",
      year: "2024",
    },
    {
      id: "arman",
      quote:
        "Working with Doug was an absolute pleasure. He consistently delivered designs that were not only beautiful but highly functional. His ability to translate complex data into clear interfaces transformed our entire dashboard experience.",
      author: {
        name: "Arman Eshraghi",
        role: "Founder & CEO",
        company: "Qrvey",
        initials: "AE",
      },
      context: "Qrvey Analytics Platform",
      year: "2018",
    },
    {
      id: "nicolas",
      quote:
        "We were fortunate to work with Doug on our latest product launch. His creativity, expertise, and passion for design shone through in every detail. He elevated the entire team's standard of craft.",
      author: {
        name: "Nicolas Polverino",
        role: "Technical Director",
        company: "Globant",
        initials: "NP",
      },
      context: "Royal Caribbean Cruises Project",
      year: "2018",
    },
  ];