/**
 * API-002: versioned, renderer-independent API schema emitted from TypeDoc.
 *
 * Keep this small and JSON-native. The website consumes these artifacts without
 * importing TypeDoc, so a renderer can evolve independently of TypeDoc's
 * serialized reflection format.
 */
export const API_SCHEMA_VERSION = 1 as const
export const API_SCHEMA_URL = "https://solidiom.org/schemas/api/v1.json"

export type ApiDeclarationKind =
  | "class"
  | "component"
  | "context"
  | "enum"
  | "function"
  | "interface"
  | "namespace"
  | "type"
  | "variable"
  | "unknown"

export interface ApiSourceLink {
  path: string
  line: number
  url: string
}

export interface ApiCommentTag {
  name: string
  text: string
}

export interface ApiComment {
  summary?: string
  remarks?: string
  tags: ApiCommentTag[]
}

export interface ApiTypeParameter {
  name: string
  constraint?: string
  default?: string
}

export interface ApiParameter {
  name: string
  type: string
  optional: boolean
  default?: string
  comment?: ApiComment
}

export interface ApiSignature {
  parameters: ApiParameter[]
  returns: string
  typeParameters: ApiTypeParameter[]
  comment?: ApiComment
  source?: ApiSourceLink
}

export interface ApiProperty {
  name: string
  type: string
  optional: boolean
  readonly: boolean
  default?: string
  comment?: ApiComment
  source?: ApiSourceLink
}

export interface ApiInheritance {
  extends: string[]
  implements: string[]
  inheritedFrom?: string
}

export interface NormalizedApiExport {
  name: string
  kind: ApiDeclarationKind
  type?: string
  comment?: ApiComment
  source?: ApiSourceLink
  signatures: ApiSignature[]
  props: ApiProperty[]
  children?: ApiProperty
  inheritance: ApiInheritance
}

export interface NormalizedApiDocument {
  $schema: typeof API_SCHEMA_URL
  schemaVersion: typeof API_SCHEMA_VERSION
  packageName: string
  generatedAt: string
  entryPoints: string[]
  exports: NormalizedApiExport[]
}
