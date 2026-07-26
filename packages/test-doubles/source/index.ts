/**
 * @solidiom/test-doubles — Deterministic capability test doubles for Solidiom primitives.
 *
 * Each double satisfies its capability port shape and produces identical
 * output for identical input. Zero engine dependencies.
 */

export {
  createPositioningDouble,
  type PositioningCapability,
  type PositioningInput,
  type PositioningResult,
  type Placement,
} from "./positioning"

export {
  createVirtualizationDouble,
  type VirtualizationCapability,
  type VirtualizationInput,
  type VirtualizationResult,
  type VirtualItem,
} from "./virtualization"

export {
  createDateMathDouble,
  type DateMathCapability,
  type DateMathInput,
  type DateValue,
  type MonthGrid,
} from "./date-math"

export {
  createCarouselPhysicsDouble,
  type CarouselPhysicsCapability,
  type CarouselGeometry,
  type CarouselPhysicsResult,
} from "./carousel-physics"

export {
  createTableModelDouble,
  type TableModelCapability,
  type TableModelResult,
  type ComputeOptions,
  type ColumnDef,
  type Row,
  type SortState,
  type FilterState,
  type PaginationState,
} from "./table-model"
