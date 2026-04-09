declare module 'd3' {
  export interface D3DragEvent<GElement extends Element, Datum, Subject> {
    x: number
    y: number
    sourceEvent?: Event
    subject?: Subject
  }

  export interface Selection<
    GElement extends Element,
    Datum = unknown,
    PElement extends Element | null = null,
    PDatum = unknown
  > {
    call(fn: (selection: Selection<GElement, Datum, PElement, PDatum>) => void): this
    on(typenames: string, listener: null): this
  }

  export interface DragBehavior<GElement extends Element, Datum = unknown, Subject = unknown> {
    (selection: Selection<GElement, Datum>): void
    on(
      typenames: string,
      listener: ((event: D3DragEvent<GElement, Datum, Subject>, datum: Datum) => void) | null
    ): DragBehavior<GElement, Datum, Subject>
  }

  export function select<GElement extends Element>(element: GElement): Selection<GElement, unknown>
  export function drag<GElement extends Element, Datum = unknown, Subject = unknown>(): DragBehavior<
    GElement,
    Datum,
    Subject
  >
}

declare module 'd3-selection' {
  export function select(element: Element | null): any
}

declare module 'd3-drag' {
  export function drag<GElement extends Element, Datum = unknown, Subject = unknown>(): any
}

declare module 'd3-scale' {
  export function scaleLinear(): any
}

declare module 'd3-axis' {
  export function axisBottom(scale: any): any
  export function axisLeft(scale: any): any
}