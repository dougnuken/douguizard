import CustomCursor from "@/components/CustomCursor";

export const metadata = {
  title: "CV — Senior Product Designer × AI",
  description:
    "Curriculum Vitae of Doug Vargas. 12+ years of product design experience across Mercadolibre, Aval Digital Labs, Globant, Qrvey, and Ideaware.",
};

export default function CvLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <CustomCursor />
      {children}
    </>
  );
}
