/** Vite's `?raw` import suffix resolves a file's contents to a plain string module. */
declare module "*?raw" {
  const content: string
  export default content
}
