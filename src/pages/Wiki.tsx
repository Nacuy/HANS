import { BookOpen, LifeBuoy, Star, TrendingUp } from "lucide-react";
import { Accordion, AccordionItem } from "@/components/ui/accordion";
import { StudiepuntenSection } from "./wiki/StudiepuntenSection";
import { HulplijnenSection } from "./wiki/HulplijnenSection";
import { BuitenDeLessenSection } from "./wiki/BuitenDeLessenSection";
import { PraktischSection } from "./wiki/PraktischSection";

export function Wiki() {
  return (
    <div className="p-6 max-w-[1000px] space-y-5">
      <div>
        <h1 className="font-poppins font-bold text-2xl text-slate-900">Wiki</h1>
        <p className="text-slate-500 text-sm mt-0.5">
          Alles wat je als student in Arnhem moet weten — studiepunten,
          hulplijnen, verenigingen en praktische informatie.
        </p>
      </div>

      <Accordion defaultOpen={["studiepunten"]}>
        <AccordionItem
          value="studiepunten"
          icon={<TrendingUp size={18} />}
          title="Studiepunten & Normen"
          subtitle="Hoe EC's werken, de BSA-norm en de indeling van het studiejaar"
        >
          <StudiepuntenSection />
        </AccordionItem>

        <AccordionItem
          value="hulplijnen"
          icon={<LifeBuoy size={18} />}
          title="Hulplijnen & Ondersteuning"
          subtitle="Studentbegeleiding, decaan en bijzondere omstandigheden"
        >
          <HulplijnenSection />
        </AccordionItem>

        <AccordionItem
          value="buiten-de-lessen"
          icon={<Star size={18} />}
          title="Buiten de lessen om"
          subtitle="Studievereniging S.V. Xtend en mediabureau Buro302"
        >
          <BuitenDeLessenSection />
        </AccordionItem>

        <AccordionItem
          value="praktisch"
          icon={<BookOpen size={18} />}
          title="Praktisch"
          subtitle="Huisvesting, kosten, OV-studentenkaart en financiële ondersteuning"
        >
          <PraktischSection />
        </AccordionItem>
      </Accordion>
    </div>
  );
}
