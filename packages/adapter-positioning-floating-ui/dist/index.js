// src/floating-ui-adapter.ts
function createFloatingUIPositioning(options = {}) {
  void options.flip;
  void options.shift;
  let lastResult = { x: 0, y: 0, placement: "bottom" };
  const compute = (input) => {
    const { referenceRect: ref, floatingRect: floating, placement, offset: off = 8 } = input;
    const side = placement.split("-")[0];
    let x = 0;
    let y = 0;
    switch (side) {
      case "top":
        x = ref.x + ref.width / 2 - floating.width / 2;
        y = ref.y - floating.height - off;
        break;
      case "bottom":
        x = ref.x + ref.width / 2 - floating.width / 2;
        y = ref.y + ref.height + off;
        break;
      case "left":
        x = ref.x - floating.width - off;
        y = ref.y + ref.height / 2 - floating.height / 2;
        break;
      case "right":
        x = ref.x + ref.width + off;
        y = ref.y + ref.height / 2 - floating.height / 2;
        break;
    }
    lastResult = { x, y, placement };
    return lastResult;
  };
  const destroy = () => {
  };
  return { compute, destroy };
}
export {
  createFloatingUIPositioning
};
//# sourceMappingURL=index.js.map