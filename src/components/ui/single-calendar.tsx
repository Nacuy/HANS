"use client";

import * as React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { DayPicker, getDefaultClassNames } from "react-day-picker";

import { buttonVariants } from "@/components/ui/button";

import { cn } from "@/lib/utils";

import type { DayPickerProps } from "react-day-picker";

type SingleCalendarProps = Extract<DayPickerProps, { mode: "single" }>;

function SingleCalendar({ className, classNames, showOutsideDays = true, selected, month, onMonthChange, ...props }: SingleCalendarProps) {
  const defaultClassNames = getDefaultClassNames();
  const [currentMonth, setCurrentMonth] = React.useState<Date>(month ?? (selected instanceof Date ? selected : new Date()));

  React.useEffect(() => {
    if (selected instanceof Date) {
      setCurrentMonth(selected);
    }
  }, [selected]);

  const handleMonthChange = (nextMonth: Date) => {
    setCurrentMonth(nextMonth);
    onMonthChange?.(nextMonth);
  };

  return (
    <DayPicker
      mode="single"
      navLayout="around"
      selected={selected}
      showOutsideDays={showOutsideDays}
      month={currentMonth}
      onMonthChange={handleMonthChange}
      className={cn("p-3", className)}
      classNames={{
        root: cn("w-full", defaultClassNames.root),
        months: cn("relative flex w-full flex-col", defaultClassNames.months),
        month: cn("relative flex w-full flex-col gap-3", defaultClassNames.month),
        month_caption: cn("flex h-8 items-center justify-center", defaultClassNames.month_caption),
        caption_label: cn("text-sm font-semibold text-foreground", defaultClassNames.caption_label),
        button_previous: cn(
          buttonVariants({ variant: "ghost" }),
          "size-8 p-0 opacity-70 hover:bg-accent hover:opacity-100",
          defaultClassNames.button_previous,
        ),
        button_next: cn(
          buttonVariants({ variant: "ghost" }),
          "size-8 p-0 opacity-70 hover:bg-accent hover:opacity-100",
          defaultClassNames.button_next,
        ),
        chevron: cn("size-4 fill-muted-foreground", defaultClassNames.chevron),
        month_grid: cn("mx-auto w-full border-collapse", defaultClassNames.month_grid),
        weekday: cn(
          "h-9 w-9 p-0 text-center text-[0.8rem] font-normal text-muted-foreground",
          defaultClassNames.weekday,
        ),
        day: cn("h-9 w-9 p-0 text-center align-middle", defaultClassNames.day),
        day_button: cn(
          buttonVariants({ variant: "ghost" }),
          "mx-auto size-9 p-0 font-normal",
          defaultClassNames.day_button,
        ),
        selected: cn(
          "[&>button]:bg-primary [&>button]:text-primary-foreground [&>button]:hover:bg-primary [&>button]:hover:text-primary-foreground",
          defaultClassNames.selected,
        ),
        today: cn(
          "[&>button]:font-semibold [&>button]:text-primary [&:not(.rdp-selected)>button]:bg-accent/60",
          defaultClassNames.today,
        ),
        outside: cn("[&>button]:text-muted-foreground/50", defaultClassNames.outside),
        disabled: cn("[&>button]:text-muted-foreground/40", defaultClassNames.disabled),
        hidden: cn("invisible", defaultClassNames.hidden),
        ...classNames,
      }}
      components={{
        Chevron: ({ className, orientation, ...chevronProps }) => {
          const Icon = orientation === "left" ? ChevronLeft : ChevronRight;
          return <Icon className={cn("size-4", className)} {...chevronProps} />;
        },
      }}
      {...props}
    />
  );
}

SingleCalendar.displayName = "Calendar";

export { SingleCalendar };
