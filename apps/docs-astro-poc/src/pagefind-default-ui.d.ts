declare module "@pagefind/default-ui" {
  interface PagefindUIOptions {
    element: string | HTMLElement
    showSubResults?: boolean
  }

  export class PagefindUI {
    constructor(options: PagefindUIOptions)
  }
}
