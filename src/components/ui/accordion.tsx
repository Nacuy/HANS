import * as React from "react";
import { ChevronDown } from "lucide-react";

import { cn } from "@/lib/utils";

interface AccordionContextValue {
  isOpen: (value: string) => boolean;
  toggle: (value: string) => void;
}

const AccordionContext = React.createContext<AccordionContextValue | null>(null);

function useAccordion() {
  const context = React.useContext(AccordionContext);
  if (!context) {
    throw new Error("AccordionItem must be used within an Accordion");
  }
  return context;
}

interface AccordionProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Items opened on first render. Multiple items can stay open at the same time. */
  defaultOpen?: string[];
}

function Accordion({ className, defaultOpen = [], children, ...props }: AccordionProps) {
  const [open, setOpen] = React.useState<string[]>(defaultOpen);

  const value = React.useMemo<AccordionContextValue>(
    () => ({
      isOpen: (item) => open.includes(item),
      toggle: (item) =>
        setOpen((current) =>
          current.includes(item)
            ? current.filter((entry) => entry !== item)
            : [...current, item]
        ),
    }),
    [open]
  );

  return (
    <AccordionContext.Provider value={value}>
      <div className={cn("space-y-3", className)} {...props}>
        {children}
      </div>
    </AccordionContext.Provider>
  );
}

interface AccordionItemProps {
  value: string;
  title: string;
  subtitle?: string;
  icon?: React.ReactNode;
  className?: string;
  children: React.ReactNode;
}

function AccordionItem({
  value,
  title,
  subtitle,
  icon,
  className,
  children,
}: AccordionItemProps) {
  const { isOpen, toggle } = useAccordion();
  const open = isOpen(value);
  const contentId = `accordion-content-${value}`;

  return (
    <div
      className={cn(
        "overflow-hidden rounded-xl border border-slate-200 bg-white text-slate-900 shadow-sm transition-all hover:border-indigo-200 hover:shadow-md",
        className
      )}
    >
      <button
        type="button"
        onClick={() => toggle(value)}
        aria-expanded={open}
        aria-controls={contentId}
        className="flex w-full items-center gap-3 p-4 text-left transition-colors hover:bg-slate-50 sm:gap-4 sm:p-5"
      >
        {icon && (
          <span className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-500 shrink-0">
            {icon}
          </span>
        )}
        <span className="flex-1 min-w-0">
          <span className="block font-poppins font-bold text-slate-900 text-base">
            {title}
          </span>
          {subtitle && (
            <span className="block text-xs text-slate-500 mt-0.5">{subtitle}</span>
          )}
        </span>
        <ChevronDown
          size={18}
          className={cn(
            "text-slate-400 shrink-0 transition-transform duration-200",
            open && "rotate-180"
          )}
        />
      </button>
      {open && (
        <div id={contentId} className="border-t border-slate-100 px-4 pb-4 pt-1 sm:px-5 sm:pb-5">
          {children}
        </div>
      )}
    </div>
  );
}

export { Accordion, AccordionItem };
