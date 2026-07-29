// src/date-picker.tsx
import { createSignal, createEffect, createMemo, Show, untrack } from "solid-js";
import {
  createDisclosureState,
  createStableId,
  createPresence,
  applySemanticAttrs,
  getLayerStack,
  setupDismissableLayer,
  activateFocusScope,
  createChangeDetails
} from "@solidiom/runtime";

// src/date-picker-context.ts
import { createContext, useContext } from "solid-js";
function getDaysInMonth(year, month) {
  return new Date(year, month, 0).getDate();
}
function createDefaultDateMath() {
  return {
    getMonthGrid(input) {
      const { date, weekStartsOn = 0 } = input;
      const daysInMonth = getDaysInMonth(date.year, date.month);
      const firstDayOfWeek = new Date(date.year, date.month - 1, 1).getDay();
      const offset = (firstDayOfWeek - weekStartsOn + 7) % 7;
      const weeks = [];
      let currentWeek = new Array(offset).fill(0);
      for (let day = 1; day <= daysInMonth; day++) {
        currentWeek.push(day);
        if (currentWeek.length === 7) {
          weeks.push(currentWeek);
          currentWeek = [];
        }
      }
      if (currentWeek.length > 0) {
        while (currentWeek.length < 7) currentWeek.push(0);
        weeks.push(currentWeek);
      }
      return { weeks, daysInMonth };
    },
    addMonths(date, months) {
      const d = new Date(date.year, date.month - 1 + months, 1);
      return { year: d.getFullYear(), month: d.getMonth() + 1, day: 1 };
    },
    isSameDay(a, b) {
      return a.year === b.year && a.month === b.month && a.day === b.day;
    },
    isInRange(date, start, end) {
      const d = new Date(date.year, date.month - 1, date.day).getTime();
      const s = new Date(start.year, start.month - 1, start.day).getTime();
      const e = new Date(end.year, end.month - 1, end.day).getTime();
      return d >= s && d <= e;
    }
  };
}
function defaultFormatDate(date) {
  const y = String(date.year);
  const m = String(date.month).padStart(2, "0");
  const d = String(date.day).padStart(2, "0");
  return `${y}-${m}-${d}`;
}
function today() {
  const now = /* @__PURE__ */ new Date();
  return { year: now.getFullYear(), month: now.getMonth() + 1, day: now.getDate() };
}
var DatePickerContext = createContext();
function useDatePickerContext() {
  const ctx = useContext(DatePickerContext);
  if (!ctx) {
    throw new Error("[solidiom] DatePicker parts must be used within DatePicker.Root");
  }
  return ctx;
}

// src/date-picker.tsx
function Root(props) {
  const baseId = createStableId("date-picker");
  const dateMath = props.dateMath ?? createDefaultDateMath();
  const { open, requestOpenChange } = createDisclosureState({
    open: props.open,
    defaultOpen: props.defaultOpen,
    onOpenChange: props.onOpenChange
  });
  const presence = createPresence({ open });
  const [internalValue, setInternalValue] = createSignal(props.defaultValue);
  const value = () => props.value?.() ?? internalValue();
  const setValue = (date) => {
    if (props.onValueChange) {
      props.onValueChange(date);
    } else {
      setInternalValue(date);
    }
  };
  const [viewingMonth, setViewingMonth] = createSignal(untrack(value) ?? today());
  const [focusedDate, setFocusedDate] = createSignal(untrack(value) ?? today());
  const ctx = {
    open,
    requestOpenChange,
    value,
    setValue,
    focusedDate,
    setFocusedDate,
    viewingMonth,
    setViewingMonth,
    dateMath,
    isDateDisabled: props.isDateDisabled ?? (() => false),
    formatDate: props.formatDate ?? defaultFormatDate,
    contentId: `${baseId}-content`,
    triggerId: `${baseId}-trigger`,
    inputId: `${baseId}-input`,
    phase: presence.phase,
    present: presence.present
  };
  return /* @__PURE__ */ React.createElement(DatePickerContext, { value: ctx }, /* @__PURE__ */ React.createElement(
    "div",
    {
      ...applySemanticAttrs({
        scope: "date-picker",
        part: "root",
        state: open() ? "open" : "closed"
      })
    },
    props.children
  ));
}
function Input(props) {
  const ctx = useDatePickerContext();
  const displayValue = createMemo(() => {
    const v = ctx.value();
    return v ? ctx.formatDate(v) : "";
  });
  return /* @__PURE__ */ React.createElement(
    "input",
    {
      id: ctx.inputId,
      type: "text",
      readonly: true,
      value: displayValue(),
      placeholder: props.placeholder,
      class: props.class,
      ref: props.ref,
      ...applySemanticAttrs({ scope: "date-picker", part: "input" })
    }
  );
}
function Trigger(props) {
  const ctx = useDatePickerContext();
  const handleClick = () => {
    ctx.requestOpenChange(!ctx.open(), createChangeDetails("trigger"));
  };
  return /* @__PURE__ */ React.createElement(
    "button",
    {
      id: ctx.triggerId,
      "aria-haspopup": "dialog",
      "aria-expanded": ctx.open() ? "true" : void 0,
      "aria-controls": ctx.open() ? ctx.contentId : void 0,
      onClick: handleClick,
      ref: props.ref,
      ...applySemanticAttrs({
        scope: "date-picker",
        part: "trigger",
        state: ctx.open() ? "open" : "closed"
      })
    },
    props.children
  );
}
function Content(props) {
  const ctx = useDatePickerContext();
  const [contentEl, setContentEl] = createSignal(void 0);
  createEffect(
    () => ctx.present() ? contentEl() : void 0,
    (el) => {
      if (!el) return;
      const doc = el.ownerDocument;
      const stack = getLayerStack(doc);
      const removeLayer = stack.push({ id: ctx.contentId, element: el, modal: false });
      const removeDismissable = setupDismissableLayer({
        document: doc,
        layerId: ctx.contentId,
        element: () => el,
        onDismiss: (reason) => ctx.requestOpenChange(false, createChangeDetails(reason))
      });
      const deactivateFocus = activateFocusScope({
        element: () => el,
        restoreTarget: () => doc.getElementById(ctx.triggerId)
      });
      return () => {
        deactivateFocus();
        removeDismissable();
        removeLayer();
      };
    }
  );
  return /* @__PURE__ */ React.createElement(Show, { when: ctx.present() }, /* @__PURE__ */ React.createElement(
    "div",
    {
      id: ctx.contentId,
      role: "dialog",
      "aria-modal": "true",
      ref: (el) => {
        setContentEl(el);
        props.ref?.(el);
      },
      class: props.class,
      style: props.style,
      ...applySemanticAttrs({
        scope: "date-picker",
        part: "content",
        state: ctx.open() ? "open" : "closed"
      })
    },
    props.children
  ));
}
function Calendar(props) {
  return /* @__PURE__ */ React.createElement(
    "div",
    {
      role: "group",
      "aria-label": "Calendar",
      class: props.class,
      ...applySemanticAttrs({ scope: "date-picker", part: "calendar" })
    },
    props.children
  );
}
function Header(props) {
  const ctx = useDatePickerContext();
  const handlePrev = () => ctx.setViewingMonth(ctx.dateMath.addMonths(ctx.viewingMonth(), -1));
  const handleNext = () => ctx.setViewingMonth(ctx.dateMath.addMonths(ctx.viewingMonth(), 1));
  return /* @__PURE__ */ React.createElement("div", { class: props.class, ...applySemanticAttrs({ scope: "date-picker", part: "header" }) }, /* @__PURE__ */ React.createElement("button", { "aria-label": "Previous month", onClick: handlePrev, type: "button" }, "\u2190"), /* @__PURE__ */ React.createElement("span", { "aria-live": "polite" }, ctx.viewingMonth().year, "-", String(ctx.viewingMonth().month).padStart(2, "0")), /* @__PURE__ */ React.createElement("button", { "aria-label": "Next month", onClick: handleNext, type: "button" }, "\u2192"), props.children);
}
function Grid(props) {
  const ctx = useDatePickerContext();
  const grid = createMemo(
    () => ctx.dateMath.getMonthGrid({ date: ctx.viewingMonth(), weekStartsOn: props.weekStartsOn ?? 0 })
  );
  const weeks = createMemo(() => grid().weeks);
  return /* @__PURE__ */ React.createElement(
    "table",
    {
      role: "grid",
      class: props.class,
      ...applySemanticAttrs({ scope: "date-picker", part: "grid" })
    },
    /* @__PURE__ */ React.createElement("tbody", null, props.children(weeks))
  );
}
function Cell(props) {
  const ctx = useDatePickerContext();
  const dateValue = () => ({
    year: ctx.viewingMonth().year,
    month: ctx.viewingMonth().month,
    day: props.day
  });
  const isSelected = createMemo(
    () => props.day !== 0 && ctx.value() ? ctx.dateMath.isSameDay(ctx.value(), dateValue()) : false
  );
  const isDisabled = createMemo(() => props.day === 0 || ctx.isDateDisabled(dateValue()));
  const isFocused = createMemo(
    () => props.day !== 0 && ctx.dateMath.isSameDay(ctx.focusedDate(), dateValue())
  );
  const handleClick = () => {
    if (isDisabled()) return;
    ctx.setValue(dateValue());
    ctx.requestOpenChange(false, createChangeDetails("close"));
  };
  const handleKeyDown = (e) => {
    if (props.day === 0) return;
    const current = ctx.focusedDate();
    let next;
    switch (e.key) {
      case "ArrowLeft":
        next = { ...current, day: current.day - 1 };
        break;
      case "ArrowRight":
        next = { ...current, day: current.day + 1 };
        break;
      case "ArrowUp":
        next = { ...current, day: current.day - 7 };
        break;
      case "ArrowDown":
        next = { ...current, day: current.day + 7 };
        break;
      case "Enter":
      case " ":
        e.preventDefault();
        handleClick();
        return;
      default:
        return;
    }
    if (next) {
      e.preventDefault();
      const daysInCurrent = getDaysInMonth(current.year, current.month);
      if (next.day < 1) {
        const prev = ctx.dateMath.addMonths(current, -1);
        const prevDays = getDaysInMonth(prev.year, prev.month);
        next = { year: prev.year, month: prev.month, day: prevDays + next.day };
        ctx.setViewingMonth(prev);
      } else if (next.day > daysInCurrent) {
        const nextMonth = ctx.dateMath.addMonths(current, 1);
        next = { year: nextMonth.year, month: nextMonth.month, day: next.day - daysInCurrent };
        ctx.setViewingMonth(nextMonth);
      }
      ctx.setFocusedDate(next);
    }
  };
  if (props.day === 0) {
    return /* @__PURE__ */ React.createElement("td", { class: props.class, ...applySemanticAttrs({ scope: "date-picker", part: "cell" }) });
  }
  return /* @__PURE__ */ React.createElement(
    "td",
    {
      role: "gridcell",
      tabindex: isFocused() ? 0 : -1,
      "aria-selected": isSelected() ? "true" : void 0,
      "aria-disabled": isDisabled() ? "true" : void 0,
      onClick: handleClick,
      onKeyDown: handleKeyDown,
      class: props.class,
      ...applySemanticAttrs({
        scope: "date-picker",
        part: "cell",
        state: isSelected() ? "selected" : isDisabled() ? "disabled" : void 0
      })
    },
    String(props.day)
  );
}
export {
  Calendar,
  Cell,
  Content,
  Grid,
  Header,
  Input,
  Root,
  Trigger
};
//# sourceMappingURL=index.js.map