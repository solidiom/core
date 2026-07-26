declare module "*.css" {
  const content: string
  export default content
}

declare module "@solidiom/registry" {
  interface RegistryPrimitive {
    name: string
    version: string
    package: string
    label?: string
    description?: string
    category?: string
  }
  interface RegistryAdapter {
    name: string
    package: string
    capability: string
  }
  interface RegistryIndex {
    version: number
    generatedAt: string
    primitives: RegistryPrimitive[]
    adapters: RegistryAdapter[]
  }
  const data: RegistryIndex
  export default data
}
