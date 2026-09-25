import { lazy, Suspense } from "react";
import {
  ArrowRight,
  BookOpen,
  Calendar,
  CheckCircle2,
  ExternalLink,
  FileText,
  GraduationCap,
  LifeBuoy,
  MapPin,
  Star,
  Video,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Urls } from "../data/urls";
import type { Page } from "../types";

const FloorMap3D = lazy(() => import("@/components/FloorMap3D"));

const primarySystems = [
  {
    id: "brightspace",
    name: "BrightSpace",
    icon: <BookOpen size={18} />,
    color: "#E8470C",
    bg: "#FFF3EF",
    url: Urls.brightspace,
  },
  {
    id: "osiris",
    name: "Osiris",
    icon: <GraduationCap size={18} />,
    color: "#1565C0",
    bg: "#E3F0FF",
    url: Urls.osiris,
  },
  {
    id: "myx",
    name: "MyX",
    icon: <Calendar size={18} />,
    color: "#C62828",
    bg: "#FEECEC",
    url: Urls.myx,
  },
  {
    id: "teams-outlook",
    name: "Teams & Outlook",
    icon: <Video size={18} />,
    color: "#5264B2",
    bg: "#EEF0FB",
    url: Urls.teams,
  },
  {
    id: "isas",
    name: "iSAS",
    icon: <FileText size={18} />,
    color: "#2E7D32",
    bg: "#E8F5E9",
    url: Urls.isas,
  },
  {
    id: "ans",
    name: "ANS",
    icon: <CheckCircle2 size={18} />,
    color: "#6A1B9A",
    bg: "#F3E5F5",
    url: Urls.ans,
  },
];

const wikiTopics = [
  {
    title: "Studiepunten & BSA-norm",
    description: "Hoe EC's werken en wat je moet halen",
    icon: <GraduationCap size={15} />,
  },
  {
    title: "Hulplijnen, decaan & bijzondere omstandigheden",
    description: "Waar je terecht kunt bij studieproblemen",
    icon: <LifeBuoy size={15} />,
  },
  {
    title: "Studentenverenigingen & Buro302",
    description: "Activiteiten buiten de lessen om",
    icon: <Star size={15} />,
  },
];

export function Home({ onNavigate }: { onNavigate: (page: Page) => void }) {
  return (
    <div className="mx-auto flex min-h-full max-w-[1100px] flex-col gap-8 p-4 md:gap-10 md:p-8">
      <section className="space-y-3 pt-2 text-center md:pt-4">
        <h1 className="font-poppins text-3xl font-extrabold tracking-tight text-slate-900 md:text-4xl">
          Welkom bij <span className="text-indigo-600">HANS</span>
        </h1>
        <p className="mx-auto max-w-2xl text-sm leading-relaxed text-slate-500 md:text-base">
          Jouw centrale startpunt voor systemen, interactieve plattegronden en
          praktische studenteninformatie.
        </p>
      </section>

      <section className="space-y-4">
        <div className="flex flex-wrap items-end justify-between gap-2">
          <div>
            <h2 className="font-poppins text-lg font-bold text-slate-900">
              HAN-systemen
            </h2>
            <p className="mt-0.5 text-sm text-slate-500">
              Direct toegang tot alle officiële digitale tools.
            </p>
          </div>
          <button
            type="button"
            onClick={() => onNavigate("systems")}
            className="font-poppins text-xs font-semibold text-indigo-600 hover:text-indigo-700"
          >
            Alle systemen →
          </button>
        </div>

        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-6">
          {primarySystems.map((sys) => (
            <a
              key={sys.id}
              href={sys.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center gap-2.5 rounded-xl border border-slate-200 bg-white px-3 py-3 transition-all hover:border-indigo-200 hover:shadow-md"
            >
              <span
                className="flex size-8 shrink-0 items-center justify-center rounded-lg"
                style={{ background: sys.bg, color: sys.color }}
              >
                {sys.icon}
              </span>
              <span className="min-w-0 flex-1 font-poppins text-xs font-semibold text-slate-800 group-hover:text-indigo-600">
                {sys.name}
              </span>
              <ExternalLink
                size={11}
                className="shrink-0 text-slate-300 group-hover:text-indigo-400"
              />
            </a>
          ))}
        </div>
      </section>

      <section className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Card asChild className="group overflow-hidden">
          <button
            type="button"
            onClick={() => onNavigate("locations")}
            className="relative flex h-full min-h-[280px] w-full flex-col text-left"
          >
            <div className="absolute inset-0">
              <Suspense
                fallback={
                  <div className="flex h-full w-full items-center justify-center bg-slate-100">
                    <div className="size-8 animate-pulse rounded-full bg-slate-200" />
                  </div>
                }
              >
                <FloorMap3D
                  floor={0}
                  selectedRoom={null}
                  onSelectRoom={() => {}}
                  preview
                />
              </Suspense>
            </div>
            <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 bg-gradient-to-t from-slate-900/55 via-slate-900/20 to-transparent px-5 pb-4 pt-16">
              <span className="inline-flex items-center gap-1.5 font-poppins text-sm font-semibold text-white">
                Bekijk 3D plattegrond
                <ArrowRight
                  size={14}
                  className="transition-transform group-hover:translate-x-0.5"
                />
              </span>
            </div>
          </button>
        </Card>

        <Card className="overflow-hidden">
          <CardContent className="flex h-full flex-col gap-4 p-5">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h3 className="font-poppins text-base font-bold text-slate-900">
                  Kennisbank & Wiki
                </h3>
                <p className="mt-0.5 text-sm text-slate-500">
                  Antwoorden op studievragen en praktische tips.
                </p>
              </div>
              <button
                type="button"
                onClick={() => onNavigate("wiki")}
                className="shrink-0 font-poppins text-xs font-semibold text-slate-500 hover:text-indigo-600"
              >
                FAQ & Regelgeving
              </button>
            </div>

            <ul className="space-y-2">
              {wikiTopics.map((topic) => (
                <li key={topic.title}>
                  <button
                    type="button"
                    onClick={() => onNavigate("wiki")}
                    className="group flex w-full items-center gap-3 rounded-xl border border-slate-200 bg-white px-3 py-3 text-left transition-all hover:border-indigo-200 hover:shadow-md"
                  >
                    <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">
                      {topic.icon}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block font-poppins text-sm font-semibold text-slate-800">
                        {topic.title}
                      </span>
                      <span className="block text-xs text-slate-500">
                        {topic.description}
                      </span>
                    </span>
                    <ArrowRight
                      size={14}
                      className="shrink-0 text-slate-300 transition-transform group-hover:translate-x-0.5 group-hover:text-indigo-500"
                    />
                  </button>
                </li>
              ))}
            </ul>

            <div className="mt-auto flex flex-wrap items-center justify-between gap-2 border-t border-slate-100 pt-4">
              <p className="flex items-center gap-1.5 text-xs text-slate-500">
                <MapPin size={12} className="text-slate-400" />
                Meer over huisvesting en OV-kaart?
              </p>
              <Button
                variant="link"
                onClick={() => onNavigate("wiki")}
                className="h-auto p-0 font-poppins text-indigo-600"
              >
                Naar volledige Wiki <ArrowRight size={14} />
              </Button>
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
