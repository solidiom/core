// src/index.tsx
import { applySemanticAttrs } from "@solidiom/runtime";

// src/derive-status.ts
function deriveMeterStatus(value, low, high, optimum) {
  if (low === void 0 && high === void 0) return "safe";
  const effectiveLow = low;
  const effectiveHigh = high;
  if (optimum !== void 0) {
    if (effectiveHigh !== void 0 && optimum >= effectiveHigh) {
      if (value >= effectiveHigh) return "safe";
      if (effectiveLow !== void 0 && value < effectiveLow) return "danger";
      return "caution";
    }
    if (effectiveLow !== void 0 && optimum <= effectiveLow) {
      if (value <= effectiveLow) return "safe";
      if (effectiveHigh !== void 0 && value > effectiveHigh) return "danger";
      return "caution";
    }
  }
  if (effectiveLow !== void 0 && effectiveHigh !== void 0) {
    if (value >= effectiveLow && value <= effectiveHigh) return "safe";
    return "caution";
  }
  if (effectiveLow !== void 0) {
    return value >= effectiveLow ? "safe" : "caution";
  }
  if (effectiveHigh !== void 0) {
    return value <= effectiveHigh ? "safe" : "caution";
  }
  return "safe";
}

// src/index.tsx
function Root(props) {
  const min = () => props.min ?? 0;
  const max = () => props.max ?? 1;
  const normalized = () => {
    const range = max() - min();
    if (range <= 0) return 0;
    return (props.value - min()) / range;
  };
  const status = () => deriveMeterStatus(props.value, props.low, props.high, props.optimum);
  return /* @__PURE__ */ React.createElement(
    "meter",
    {
      value: props.value,
      min: min(),
      max: max(),
      low: props.low,
      high: props.high,
      optimum: props.optimum,
      class: props.class,
      "data-value": normalized().toFixed(2),
      "data-status": status(),
      ...applySemanticAttrs({ scope: "meter", part: "root", state: status() })
    },
    props.children
  );
}
export {
  Root,
  deriveMeterStatus
};
//# sourceMappingURL=index.js.map