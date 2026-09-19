import {
  BookOpen,
  Briefcase,
  Coffee,
  ExternalLink,
  Globe,
  MapPin,
  Monitor,
  Phone,
  Star,
  Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export function BuitenDeLessenSection() {
  return (
    <div className="space-y-4 pt-4">
      <Card className="overflow-hidden">
        <div
          className="h-28 relative flex items-center px-6"
          style={{ background: "linear-gradient(to right, #003082, #001E56)" }}
        >
          <div className="absolute inset-0 opacity-10 flex items-center justify-end pr-6">
            <Users size={96} className="text-white" />
          </div>
          <div>
            <span className="text-white/70 text-xs font-poppins font-semibold uppercase tracking-widest">
              Studievereniging
            </span>
            <h2 className="font-poppins font-bold text-white text-2xl mt-1">
              S.V. Xtend
            </h2>
          </div>
        </div>
        <CardContent className="p-5">
          <p className="text-sm text-slate-600 leading-relaxed mb-4">
            De studievereniging voor ICT- en CMD-studenten aan de Academie IT
            &amp; Mediadesign van de HAN. Opgericht in 2015 met als doel
            studenten laagdrempelig te verbinden — met elkaar, met de opleiding
            en met het bedrijfsleven. Lid worden kan via hun website.
          </p>
          <div className="grid grid-cols-4 gap-3 mb-4">
            {[
              { icon: <Monitor size={15} />, label: "LAN parties" },
              { icon: <BookOpen size={15} />, label: "Lunch lectures" },
              { icon: <Coffee size={15} />, label: "Kroegentochten" },
              { icon: <Star size={15} />, label: "Filmavonden" },
            ].map((item, i) => (
              <div
                key={i}
                className="bg-[#E6EEF8] rounded-xl p-3 text-center border border-[#C0D4ED]"
              >
                <div className="w-8 h-8 rounded-lg bg-[#C0D4ED] flex items-center justify-center text-[#003082] mx-auto mb-2">
                  {item.icon}
                </div>
                <p className="text-xs font-bold text-[#003082] font-poppins">
                  {item.label}
                </p>
              </div>
            ))}
          </div>
          <div className="flex items-center gap-3 mb-4 p-3 bg-slate-50 rounded-xl border border-slate-100 text-xs text-slate-500">
            <MapPin size={13} className="shrink-0 text-slate-400" />
            <span>
              Lokaal <strong className="text-slate-700">A0.22</strong> —
              Ruitenberglaan 26, 6826 CC Arnhem
            </span>
            <span className="ml-auto flex items-center gap-1">
              <Phone size={13} />
              +31 85 212 9220
            </span>
          </div>
          <div className="flex gap-3">
            <Button asChild className="bg-[#003082] hover:bg-[#001E56] font-poppins">
              <a href="https://svxtend.nl" target="_blank" rel="noopener noreferrer">
                svxtend.nl <ExternalLink size={12} />
              </a>
            </Button>
            <Button
              variant="outline"
              asChild
              className="border-[#C0D4ED] text-[#003082] hover:bg-[#E6EEF8] font-poppins"
            >
              <a
                href="https://instagram.com/svxtend"
                target="_blank"
                rel="noopener noreferrer"
              >
                Instagram
              </a>
            </Button>
            <Button
              variant="outline"
              asChild
              className="border-[#C0D4ED] text-[#003082] hover:bg-[#E6EEF8] font-poppins"
            >
              <a
                href="https://nl.linkedin.com/company/ica-xtend"
                target="_blank"
                rel="noopener noreferrer"
              >
                LinkedIn
              </a>
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card className="overflow-hidden">
        <div className="h-28 bg-gradient-to-r from-rose-400 to-orange-500 relative flex items-center px-6">
          <div className="absolute inset-0 opacity-20 flex items-center justify-end pr-6">
            <Briefcase size={96} className="text-white" />
          </div>
          <div>
            <span className="text-white/80 text-xs font-poppins font-semibold uppercase tracking-widest">
              Creatief mediabureau
            </span>
            <h2 className="font-poppins font-bold text-white text-2xl mt-1">
              Buro302
            </h2>
          </div>
        </div>
        <CardContent className="p-5">
          <p className="text-sm text-slate-600 leading-relaxed mb-4">
            B302 is een student-run creatief mediabureau binnen de han. wij
            realiseren creatieve projecten en digitale oplossingen op maat.
          </p>
          <div className="grid grid-cols-4 gap-3 mb-4">
            {[
              {
                icon: <Briefcase size={15} />,
                label: "Werken met echt projecten",
              },
              {
                icon: <Users size={15} />,
                label: "Werken met creatieve mensen",
              },
              {
                icon: <Globe size={15} />,
                label: "Werken met verschillende culturen",
              },
              {
                icon: <Star size={15} />,
                label: "Werken met verschillende projecten",
              },
            ].map((item, i) => (
              <div
                key={i}
                className="bg-orange-50 rounded-xl p-3 text-center border border-orange-100"
              >
                <div className="w-8 h-8 rounded-lg bg-orange-100 flex items-center justify-center text-orange-600 mx-auto mb-2">
                  {item.icon}
                </div>
                <p className="text-xs font-bold text-orange-700 font-poppins">
                  {item.label}
                </p>
              </div>
            ))}
          </div>
          <div className="flex gap-3">
            <Button asChild className="bg-orange-500 hover:bg-orange-600 font-poppins">
              <a href="https://b302.nl" target="_blank" rel="noopener noreferrer">
                b302.nl <ExternalLink size={12} />
              </a>
            </Button>
            <Button
              variant="outline"
              asChild
              className="border-[#C0D4ED] text-[#003082] hover:bg-[#E6EEF8] font-poppins"
            >
              <a
                href="https://linkedin.com/company/b302"
                target="_blank"
                rel="noopener noreferrer"
              >
                LinkedIn
              </a>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
