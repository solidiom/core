/**
 * @solidiom/avatar — Headless avatar primitive with image and fallback support.
 *
 * Parts: Root, Image, Fallback.
 */

import { createSignal, createContext, useContext, Show } from "solid-js"
import { type JSX } from "@solidjs/web"
import { applySemanticAttrs } from "@solidiom/runtime"

type ImageStatus = "loading" | "loaded" | "error"

interface AvatarContextValue {
  imageStatus: () => ImageStatus
  setImageStatus: (status: ImageStatus) => void
}

const AvatarContext = createContext<AvatarContextValue>()

export interface AvatarRootProps {
  class?: string
  children: JSX.Element
}

export function Root(props: AvatarRootProps) {
  const [imageStatus, setImageStatus] = createSignal<ImageStatus>("loading")

  return (
    <AvatarContext value={{ imageStatus, setImageStatus }}>
      <span class={props.class} {...applySemanticAttrs({ scope: "avatar", part: "root" })}>
        {props.children}
      </span>
    </AvatarContext>
  )
}

export interface AvatarImageProps {
  src: string
  alt?: string
  class?: string
}

export function Image(props: AvatarImageProps) {
  const ctx = useContext(AvatarContext)
  const [localStatus, setLocalStatus] = createSignal<ImageStatus>("loading")

  const handleLoad = () => {
    setLocalStatus("loaded")
    ctx?.setImageStatus("loaded")
  }

  const handleError = () => {
    setLocalStatus("error")
    ctx?.setImageStatus("error")
  }

  return (
    <>
      <img
        src={props.src}
        alt={props.alt}
        class={props.class}
        style={localStatus() === "loaded" ? undefined : { display: "none" }}
        onLoad={handleLoad}
        onError={handleError}
        {...applySemanticAttrs({ scope: "avatar", part: "image" })}
      />
    </>
  )
}

export interface AvatarFallbackProps {
  class?: string
  children: JSX.Element
}

export function Fallback(props: AvatarFallbackProps) {
  const ctx = useContext(AvatarContext)
  const showFallback = () => {
    if (!ctx) return true
    return ctx.imageStatus() !== "loaded"
  }

  return (
    <Show when={showFallback()}>
      <span class={props.class} {...applySemanticAttrs({ scope: "avatar", part: "fallback" })}>
        {props.children}
      </span>
    </Show>
  )
}
