// src/positioning.ts
function createPositioningDouble() {
  const compute = (input) => {
    const { referenceRect: ref, floatingRect: floating, placement, offset = 8 } = input;
    let x = 0;
    let y = 0;
    const side = placement.split("-")[0];
    const alignment = placement.split("-")[1];
    switch (side) {
      case "top":
        x = ref.x + ref.width / 2 - floating.width / 2;
        y = ref.y - floating.height - offset;
        break;
      case "bottom":
        x = ref.x + ref.width / 2 - floating.width / 2;
        y = ref.y + ref.height + offset;
        break;
      case "left":
        x = ref.x - floating.width - offset;
        y = ref.y + ref.height / 2 - floating.height / 2;
        break;
      case "right":
        x = ref.x + ref.width + offset;
        y = ref.y + ref.height / 2 - floating.height / 2;
        break;
    }
    if (alignment === "start") {
      if (side === "top" || side === "bottom") x = ref.x;
      else y = ref.y;
    } else if (alignment === "end") {
      if (side === "top" || side === "bottom") x = ref.x + ref.width - floating.width;
      else y = ref.y + ref.height - floating.height;
    }
    return { x, y, placement };
  };
  const destroy = () => {
  };
  return { compute, destroy };
}

// src/virtualization.ts
function createVirtualizationDouble() {
  const compute = (input) => {
    const { totalCount, itemSize, viewportHeight, scrollOffset, overscan = 3 } = input;
    const totalSize = totalCount * itemSize;
    const rawStart = Math.floor(scrollOffset / itemSize);
    const rawEnd = Math.ceil((scrollOffset + viewportHeight) / itemSize) - 1;
    const startIndex = Math.max(0, rawStart - overscan);
    const endIndex = Math.min(totalCount - 1, rawEnd + overscan);
    const items = [];
    for (let i = startIndex; i <= endIndex; i++) {
      items.push({
        index: i,
        start: i * itemSize,
        end: (i + 1) * itemSize,
        size: itemSize
      });
    }
    return { items, totalSize, startIndex, endIndex };
  };
  const destroy = () => {
  };
  return { compute, destroy };
}

// src/date-math.ts
function createDateMathDouble() {
  const daysInMonth = (year, month) => {
    return new Date(year, month, 0).getDate();
  };
  const dayOfWeek = (year, month, day) => {
    return new Date(year, month - 1, day).getDay();
  };
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
    const maxDay = daysInMonth(year, month);
    day = Math.min(day, maxDay);
    return { year, month, day };
  };
  const isSameDay = (a, b) => {
    return a.year === b.year && a.month === b.month && a.day === b.day;
  };
  const isInRange = (date, start, end) => {
    const toNum = (d) => d.year * 1e4 + d.month * 100 + d.day;
    const n = toNum(date);
    return n >= toNum(start) && n <= toNum(end);
  };
  const destroy = () => {
  };
  return { getMonthGrid, addMonths, isSameDay, isInRange, destroy };
}

// src/carousel-physics.ts
function createCarouselPhysicsDouble() {
  const getSnapPoints = (geometry) => {
    const { slideCount, slideWidth, gap } = geometry;
    const points = [];
    for (let i = 0; i < slideCount; i++) {
      points.push(i * (slideWidth + gap));
    }
    return points;
  };
  const compute = (geometry, selectedIndex) => {
    const { slideCount } = geometry;
    const snapPoints = getSnapPoints(geometry);
    const clamped = Math.max(0, Math.min(selectedIndex, slideCount - 1));
    return {
      selectedIndex: clamped,
      canScrollPrev: clamped > 0,
      canScrollNext: clamped < slideCount - 1,
      scrollPosition: snapPoints[clamped] ?? 0,
      snapPoints
    };
  };
  const nearestSnap = (geometry, scrollPosition) => {
    const snapPoints = getSnapPoints(geometry);
    let nearest = 0;
    let minDist = Infinity;
    for (let i = 0; i < snapPoints.length; i++) {
      const dist = Math.abs(snapPoints[i] - scrollPosition);
      if (dist < minDist) {
        minDist = dist;
        nearest = i;
      }
    }
    return nearest;
  };
  const destroy = () => {
  };
  return { compute, nearestSnap, destroy };
}

// src/table-model.ts
function matchesFilter(cellValue, filter) {
  const normalized = cellValue.toLowerCase();
  const target = filter.value.toLowerCase();
  switch (filter.operator) {
    case "contains":
      return normalized.includes(target);
    case "equals":
      return normalized === target;
    case "startsWith":
      return normalized.startsWith(target);
    case "endsWith":
      return normalized.endsWith(target);
  }
}
function multiColumnCompare(a, b, sortStates, columns) {
  for (const sort of sortStates) {
    const col = columns.find((c) => c.id === sort.columnId);
    if (!col) continue;
    const av = String(a.values[col.accessorKey] ?? "");
    const bv = String(b.values[col.accessorKey] ?? "");
    const cmp = av.localeCompare(bv);
    if (cmp !== 0) {
      return sort.direction === "asc" ? cmp : -cmp;
    }
  }
  return 0;
}
function normalizeOptions(options) {
  if (!options) return { resolved: void 0, shorthand: void 0 };
  if ("columnId" in options && "direction" in options && !("sort" in options)) {
    const sort = options;
    return { resolved: { sort: [sort] }, shorthand: sort };
  }
  return { resolved: options, shorthand: void 0 };
}
function createTableModelDouble() {
  const compute = (data, columns, rawOptions) => {
    const { resolved: options, shorthand } = normalizeOptions(rawOptions);
    let rows = data.map((item, i) => ({
      id: String(i),
      values: item
    }));
    if (options?.filters && options.filters.length > 0) {
      rows = rows.filter(
        (row) => options.filters.every((filter) => {
          const col = columns.find((c) => c.id === filter.columnId);
          if (!col) return true;
          const cellValue = String(row.values[col.accessorKey] ?? "");
          return matchesFilter(cellValue, filter);
        })
      );
    }
    const totalRows = rows.length;
    if (options?.sort && options.sort.length > 0) {
      rows = [...rows].sort((a, b) => multiColumnCompare(a, b, options.sort, columns));
    }
    let pageCount;
    if (options?.pagination) {
      const { page, pageSize } = options.pagination;
      const effectivePageSize = Math.max(1, pageSize);
      pageCount = Math.ceil(totalRows / effectivePageSize);
      const start = page * effectivePageSize;
      rows = rows.slice(start, start + effectivePageSize);
    }
    return {
      rows,
      columns,
      // When shorthand was used, return the single SortState; otherwise the array
      sortState: shorthand ?? options?.sort,
      totalRows,
      pageCount
    };
  };
  const destroy = () => {
  };
  return { compute, destroy };
}
export {
  createCarouselPhysicsDouble,
  createDateMathDouble,
  createPositioningDouble,
  createTableModelDouble,
  createVirtualizationDouble
};
//# sourceMappingURL=index.js.map