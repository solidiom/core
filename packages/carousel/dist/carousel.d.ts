/**
 * @solidiom/carousel — Headless carousel primitive with scroll-snap and pointer drag.
 *
 * Parts: Root, Viewport, Slide, PrevButton, NextButton.
 * Supports loop mode, auto-play, pointer drag-to-swipe, keyboard navigation.
 */
import { type Accessor } from "solid-js";
import { type JSX } from "@solidjs/web";
import { type CarouselGeometry, type CarouselPhysicsPort } from "./carousel-context";
/**
 * Default snap physics — no spring/momentum, just index * (slideWidth + gap).
 */
export declare const simpleSnapPhysics: CarouselPhysicsPort;
/** Props for the Carousel Root component. */
export interface CarouselRootProps {
    /** Physics port. Defaults to simpleSnapPhysics. */
    physics?: CarouselPhysicsPort;
    /** Geometry of the carousel layout. */
    geometry: CarouselGeometry;
    /** Controlled selected index. */
    selectedIndex?: Accessor<number | undefined>;
    /** Default index for uncontrolled mode. */
    defaultIndex?: number;
    /** Callback when selected index changes. */
    onIndexChange?: (index: number) => void;
    /** Enable looping. Defaults to false. */
    loop?: boolean;
    /** Auto-play interval in ms. 0 or undefined disables. */
    autoPlay?: number;
    /** CSS class. */
    class?: string;
    /** Child elements. */
    children: JSX.Element;
}
/** Carousel Root — provides context and manages selected index state. */
export declare function Root(props: CarouselRootProps): JSX.Element;
/** Props for the Carousel Viewport (scroll container). */
export interface CarouselViewportProps {
    children: JSX.Element;
}
/**
 * Carousel Viewport — scroll container with pointer drag-to-swipe and keyboard nav.
 *
 * Pointer: pointerdown starts drag, pointermove tracks delta, pointerup snaps to nearest.
 * Keyboard: ArrowLeft/Right navigates slides.
 */
export declare function Viewport(props: CarouselViewportProps): JSX.Element;
/** Props for the Carousel Slide component. */
export interface CarouselSlideProps {
    /** Index of this slide. */
    index: number;
    /** Child content. */
    children: JSX.Element;
}
/** Carousel Slide — a single slide within the viewport. */
export declare function Slide(props: CarouselSlideProps): JSX.Element;
/** Props for the Carousel PrevButton. */
export interface CarouselPrevButtonProps {
    children?: JSX.Element;
}
/** Carousel PrevButton — navigates to previous slide. Disabled when at start (non-loop). */
export declare function PrevButton(props: CarouselPrevButtonProps): JSX.Element;
/** Props for the Carousel NextButton. */
export interface CarouselNextButtonProps {
    children?: JSX.Element;
}
/** Carousel NextButton — navigates to next slide. Disabled when at end (non-loop). */
export declare function NextButton(props: CarouselNextButtonProps): JSX.Element;
//# sourceMappingURL=carousel.d.ts.map