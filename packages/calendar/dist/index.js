// src/calendar.tsx
import { createSignal, createMemo } from "solid-js";
import { createControllableValue, createChangeDetails, applySemanticAttrs } from "@solidiom/runtime";

// src/calendar-context.ts
import { createContext, useContext } from "solid-js";
var CalendarContext = createContext();
function useCalendarContext() {
  const ctx = useContext(CalendarContext);
  if (!ctx) {
    throw new Error("[solidiom/calendar] useCalendarContext must be used within a Calendar.Root");
  }
  return ctx;
}

// src/calendar.tsx
function daysInMonthCount(year, month) {
  return new Date(year, month, 0).getDate();
}
var gregorianDateMath = {
  getMonthGrid({ date, weekStartsOn = 0 }) {
    const totalDays = daysInMonthCount(date.year, date.month);
    const startDay = new Date(date.year, date.month - 1, 1).getDay();
    const offset = (startDay - weekStartsOn + 7) % 7;
    const weeks = [];
    let day = 1 - offset;
    for (let w = 0; w < 6; w++) {
      const row = [];
      for (let d = 0; d < 7; d++) {
        row.push(day < 1 || day > totalDays ? 0 : day);
        day++;
      }
      if (row.every((d) => d === 0) && w >= 4) break;
      weeks.push(row);
    }
    return { weeks, daysInMonth: totalDays };
  },
  addMonths(date, months) {
    let m = date.month + months;
    let y = date.year;
    while (m > 12) {
      m -= 12;
      y++;
    }
    while (m < 1) {
      m += 12;
      y--;
    }
    return { year: y, month: m, day: Math.min(date.day, daysInMonthCount(y, m)) };
  },
  isSameDay(a, b) {
    return a.year === b.year && a.month === b.month && a.day === b.day;
  },
  isInRange(date, start, end) {
    const v = date.year * 1e4 + date.month * 100 + date.day;
    return v >= start.year * 1e4 + start.month * 100 + start.day && v <= end.year * 1e4 + end.month * 100 + end.day;
  }
};
function adjustDay(date, days) {
  const d = new Date(date.year, date.month - 1, date.day + days);
  return { year: d.getFullYear(), month: d.getMonth() + 1, day: d.getDate() };
}
function Root(props) {
  const dateMath = props.dateMath ?? gregorianDateMath;
  const weekStartsOn = props.weekStartsOn ?? 0;
  const today = {
    year: (/* @__PURE__ */ new Date()).getFullYear(),
    month: (/* @__PURE__ */ new Date()).getMonth() + 1,
    day: (/* @__PURE__ */ new Date()).getDate()
  };
  const initial = props.defaultValue ?? today;
  const [focusedMonth, setFocusedMonth] = createSignal({
    year: initial.year,
    month: initial.month,
    day: 1
  });
  const [focusedDate, setFocusedDate] = createSignal(initial);
  const { value: selectedDate, requestChange } = createControllableValue({
    value: props.value,
    defaultValue: props.defaultValue,
    onChange: (next) => {
      if (next) props.onValueChange?.(next);
    },
    equals: (a, b) => {
      if (!a && !b) return true;
      if (!a || !b) return false;
      return dateMath.isSameDay(a, b);
    }
  });
  const navigateMonth = (delta) => {
    const next = dateMath.addMonths(focusedMonth(), delta);
    setFocusedMonth(next);
    setFocusedDate({ ...next, day: 1 });
  };
  const contextValue = {
    focusedMonth,
    focusedDate,
    selectedDate,
    prevMonth: () => navigateMonth(-1),
    nextMonth: () => navigateMonth(1),
    selectDate: (date) => {
      if (props.isDateDisabled?.(date)) return;
      requestChange(date, createChangeDetails("select"));
      setFocusedDate(date);
    },
    setFocusedDate: (date) => {
      setFocusedDate(date);
      if (date.month !== focusedMonth().month || date.year !== focusedMonth().year) {
        setFocusedMonth({ year: date.year, month: date.month, day: 1 });
      }
    },
    isDateDisabled: (date) => props.isDateDisabled?.(date) ?? false,
    isToday: (date) => dateMath.isSameDay(date, today),
    dateMath,
    weekStartsOn
  };
  return /* @__PURE__ */ React.createElement(CalendarContext, { value: contextValue }, /* @__PURE__ */ React.createElement(
    "div",
    {
      role: "application",
      "aria-label": "Calendar",
      class: props.class,
      ...applySemanticAttrs({ scope: "calendar", part: "root" })
    },
    props.children
  ));
}
function Header(props) {
  return /* @__PURE__ */ React.createElement("div", { ...applySemanticAttrs({ scope: "calendar", part: "header" }) }, props.children);
}
function PrevButton(props) {
  const ctx = useCalendarContext();
  return /* @__PURE__ */ React.createElement(
    "button",
    {
      type: "button",
      "aria-label": "Previous month",
      onClick: () => ctx.prevMonth(),
      ...applySemanticAttrs({ scope: "calendar", part: "prev-button" })
    },
    props.children ?? "\u2190"
  );
}
function Title(props) {
  const ctx = useCalendarContext();
  const MONTHS = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December"
  ];
  const label = createMemo(() => {
    const m = ctx.focusedMonth();
    return `${MONTHS[m.month - 1]} ${m.year}`;
  });
  return /* @__PURE__ */ React.createElement(
    "div",
    {
      "aria-live": "polite",
      role: "heading",
      "aria-level": 2,
      ...applySemanticAttrs({ scope: "calendar", part: "title" })
    },
    props.children ?? label()
  );
}
function NextButton(props) {
  const ctx = useCalendarContext();
  return /* @__PURE__ */ React.createElement(
    "button",
    {
      type: "button",
      "aria-label": "Next month",
      onClick: () => ctx.nextMonth(),
      ...applySemanticAttrs({ scope: "calendar", part: "next-button" })
    },
    props.children ?? "\u2192"
  );
}
function Grid(props) {
  const ctx = useCalendarContext();
  const grid = createMemo(
    () => ctx.dateMath.getMonthGrid({ date: ctx.focusedMonth(), weekStartsOn: ctx.weekStartsOn })
  );
  const handleKeyDown = (event) => {
    const focused = ctx.focusedDate();
    let next;
    switch (event.key) {
      case "ArrowLeft":
        next = adjustDay(focused, -1);
        break;
      case "ArrowRight":
        next = adjustDay(focused, 1);
        break;
      case "ArrowUp":
        next = adjustDay(focused, -7);
        break;
      case "ArrowDown":
        next = adjustDay(focused, 7);
        break;
      case "PageUp":
        next = ctx.dateMath.addMonths(focused, -1);
        break;
      case "PageDown":
        next = ctx.dateMath.addMonths(focused, 1);
        break;
      case "Home":
        next = { ...focused, day: 1 };
        break;
      case "End":
        next = { ...focused, day: grid().daysInMonth };
        break;
      case "Enter":
      case " ":
        event.preventDefault();
        ctx.selectDate(focused);
        return;
      default:
        return;
    }
    event.preventDefault();
    if (next) ctx.setFocusedDate(next);
  };
  return /* @__PURE__ */ React.createElement(
    "table",
    {
      role: "grid",
      "aria-label": "Calendar grid",
      onKeyDown: handleKeyDown,
      ...applySemanticAttrs({ scope: "calendar", part: "grid" })
    },
    /* @__PURE__ */ React.createElement("tbody", null, props.children ? props.children(grid().weeks) : null)
  );
}
function Cell(props) {
  const ctx = useCalendarContext();
  const date = () => ({ ...ctx.focusedMonth(), day: props.day });
  const isSelected = () => {
    const sel = ctx.selectedDate();
    return sel ? ctx.dateMath.isSameDay(sel, date()) : false;
  };
  const isFocused = () => ctx.dateMath.isSameDay(ctx.focusedDate(), date());
  const isDisabled = () => ctx.isDateDisabled(date());
  const isTodayCell = () => ctx.isToday(date());
  return /* @__PURE__ */ React.createElement(
    "td",
    {
      role: "gridcell",
      tabindex: isFocused() ? 0 : -1,
      "aria-selected": isSelected() ? "true" : void 0,
      "aria-disabled": isDisabled() ? "true" : void 0,
      "data-today": isTodayCell() ? "" : void 0,
      onClick: () => {
        if (!isDisabled()) ctx.selectDate(date());
      },
      ...applySemanticAttrs({
        scope: "calendar",
        part: "cell",
        disabled: isDisabled(),
        selected: isSelected(),
        highlighted: isTodayCell()
      })
    },
    props.children ?? props.day
  );
}
export {
  Cell,
  Grid,
  Header,
  NextButton,
  PrevButton,
  Root,
  Title,
  gregorianDateMath,
  useCalendarContext
};
//# sourceMappingURL=index.js.map