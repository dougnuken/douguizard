import CustomCursor from "@/components/CustomCursor";
import { site } from "@/data/site";
import { experiences } from "@/data/cv";
import { yearsOfExperience } from "@/lib/career";

const companies = experiences
  .filter((e) => e.era !== "earlier")
  .map((e) => e.company.name)
  .join(", ");

export const metadata = {
  title: `CV — ${site.headline}`,
  description: `Curriculum vitae of ${site.name}. ${yearsOfExperience()} years of product design and design engineering across ${companies}.`,
};

export default function CvLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="theme-dark min-h-svh">
      <CustomCursor />
      {children}
    </div>
  );
}
