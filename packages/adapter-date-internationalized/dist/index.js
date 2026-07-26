// src/adapter.ts
function createInternationalizedDateAdapter() {
  const daysInMonth = (year, month) => new Date(year, month, 0).getDate();
  const dayOfWeek = (year, month, day) => new Date(year, month - 1, day).getDay();
  const getMonthGrid = (input) => {
    const { date, weekStartsOn = 0 } = input;
    const { year, month } = date;
    const total = daysInMonth(year, month);
    const firstDay = dayOfWeek(year, month, 1);
    const offset = (firstDay - weekStartsOn + 7) % 7;
    const weeks = [];
    let week = new Array(offset).fill(0);
    for (let d = 1; d <= total; d++) {
      week.push(d);
      if (week.length === 7) {
        weeks.push(week);
        week = [];
      }
    }
    if (week.length > 0) {
      while (week.length < 7) week.push(0);
      weeks.push(week);
    }
    return { year, month, weeks, daysInMonth: total };
  };
  const addMonths = (date, months) => {
    let { year, month, day } = date;
    month += months;
    while (month > 12) {
      month -= 12;
      year++;
    }
    while (month < 1) {
      month += 12;
      year--;
    }
    day = Math.min(day, daysInMonth(year, month));
    return { year, month, day };
  };
  const isSameDay = (a, b) => a.year === b.year && a.month === b.month && a.day === b.day;
  const isInRange = (date, start, end) => {
    const n = (d) => d.year * 1e4 + d.month * 100 + d.day;
    return n(date) >= n(start) && n(date) <= n(end);
  };
  return { getMonthGrid, addMonths, isSameDay, isInRange, destroy: () => {
  } };
}
export {
  createInternationalizedDateAdapter
};
//# sourceMappingURL=index.js.map