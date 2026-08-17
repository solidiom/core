/**
 * @solidiom/table — Simple static data table primitive.
 *
 * Parts: Root, Header, HeaderRow, HeaderCell, Body, Row, Cell, Caption.
 */

import { type JSX } from "@solidjs/web"
import { applySemanticAttrs } from "@solidiom/runtime"

// ─── Types ──────────────────────────────────────────────────────────────────

export interface RootProps {
  children?: JSX.Element
  class?: string
  style?: JSX.CSSProperties | string
  striped?: boolean
}

export interface HeaderProps {
  children?: JSX.Element
  class?: string
  style?: JSX.CSSProperties | string
}

export interface HeaderRowProps {
  children?: JSX.Element
  class?: string
  style?: JSX.CSSProperties | string
}

export interface HeaderCellProps {
  children?: JSX.Element
  class?: string
  style?: JSX.CSSProperties | string
}

export interface BodyProps {
  children?: JSX.Element
  class?: string
  style?: JSX.CSSProperties | string
}

export interface RowProps {
  children?: JSX.Element
  class?: string
  style?: JSX.CSSProperties | string
  selected?: boolean
}

export interface CellProps {
  children?: JSX.Element
  class?: string
  style?: JSX.CSSProperties | string
}

export interface CaptionProps {
  children?: JSX.Element
  class?: string
  style?: JSX.CSSProperties | string
}

// ─── Components ─────────────────────────────────────────────────────────────

export function Root(props: RootProps) {
  return (
    <table
      class={props.class}
      style={props.style}
      data-striped={props.striped ? "" : undefined}
      {...applySemanticAttrs({ scope: "table", part: "root" })}
    >
      {props.children}
    </table>
  )
}

export function Header(props: HeaderProps) {
  return (
    <thead
      class={props.class}
      style={props.style}
      {...applySemanticAttrs({ scope: "table", part: "header" })}
    >
      {props.children}
    </thead>
  )
}

export function HeaderRow(props: HeaderRowProps) {
  return (
    <tr
      class={props.class}
      style={props.style}
      {...applySemanticAttrs({ scope: "table", part: "header-row" })}
    >
      {props.children}
    </tr>
  )
}

export function HeaderCell(props: HeaderCellProps) {
  return (
    <th
      scope="col"
      class={props.class}
      style={props.style}
      {...applySemanticAttrs({ scope: "table", part: "header-cell" })}
    >
      {props.children}
    </th>
  )
}

export function Body(props: BodyProps) {
  return (
    <tbody
      class={props.class}
      style={props.style}
      {...applySemanticAttrs({ scope: "table", part: "body" })}
    >
      {props.children}
    </tbody>
  )
}

export function Row(props: RowProps) {
  return (
    <tr
      class={props.class}
      style={props.style}
      data-selected={props.selected ? "" : undefined}
      {...applySemanticAttrs({ scope: "table", part: "row" })}
    >
      {props.children}
    </tr>
  )
}

export function Cell(props: CellProps) {
  return (
    <td
      class={props.class}
      style={props.style}
      {...applySemanticAttrs({ scope: "table", part: "cell" })}
    >
      {props.children}
    </td>
  )
}

export function Caption(props: CaptionProps) {
  return (
    <caption
      class={props.class}
      style={props.style}
      {...applySemanticAttrs({ scope: "table", part: "caption" })}
    >
      {props.children}
    </caption>
  )
}
