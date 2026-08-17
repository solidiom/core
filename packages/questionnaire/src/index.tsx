/**
 * @solidiom/questionnaire — Multi-step form and survey flow with progress tracking.
 *
 * Parts: Root, Step, StepTitle, StepContent, Navigation, NextButton, PrevButton, Progress, Submit.
 * Uses createControllableValue for step management.
 */

import { createContext, useContext, Show, type Accessor } from "solid-js"
import { type JSX } from "@solidjs/web"
import {
  applySemanticAttrs,
  createControllableValue,
  createChangeDetails,
} from "@solidiom/runtime"

// ─── Types ──────────────────────────────────────────────────────────────────

export interface QuestionnaireRootProps {
  /** Total number of steps. */
  steps: number
  /** Controlled current step (0-indexed). */
  currentStep?: Accessor<number>
  /** Default starting step (0-indexed). */
  defaultStep?: number
  /** Called when step changes. */
  onStepChange?: (step: number) => void
  /** Called when the questionnaire is submitted on the last step. */
  onComplete?: (data: Record<string, unknown>) => void
  class?: string
  children: JSX.Element
}

export interface QuestionnaireStepProps {
  /** The step index this content belongs to (0-indexed). */
  index: number
  children: JSX.Element
}

export interface QuestionnaireStepTitleProps {
  class?: string
  children: JSX.Element
}

export interface QuestionnaireStepContentProps {
  class?: string
  children: JSX.Element
}

export interface QuestionnaireNavigationProps {
  class?: string
  children: JSX.Element
}

export interface QuestionnaireNextButtonProps {
  class?: string
  children?: JSX.Element
  /** Optional validation function. Return true to allow advance. */
  validate?: () => boolean
}

export interface QuestionnairePrevButtonProps {
  class?: string
  children?: JSX.Element
}

export interface QuestionnaireProgressProps {
  class?: string
  children?: JSX.Element
}

export interface QuestionnaireSubmitProps {
  class?: string
  children?: JSX.Element
}

// ─── Context ────────────────────────────────────────────────────────────────

interface QuestionnaireContextValue {
  currentStep: Accessor<number>
  totalSteps: number
  goNext: (validate?: () => boolean) => void
  goPrev: () => void
  isFirstStep: Accessor<boolean>
  isLastStep: Accessor<boolean>
  submit: () => void
}

const QuestionnaireContext = createContext<QuestionnaireContextValue>()

function useQuestionnaireContext(): QuestionnaireContextValue {
  const ctx = useContext(QuestionnaireContext)
  if (!ctx) throw new Error("Questionnaire parts must be used within Questionnaire.Root")
  return ctx
}

// ─── Components ─────────────────────────────────────────────────────────────

export function Root(props: QuestionnaireRootProps) {
  const controllable = createControllableValue<number, "step-change">({
    value: props.currentStep as Accessor<number | undefined> | undefined,
    defaultValue: props.defaultStep ?? 0,
    onChange: (next) => props.onStepChange?.(next),
  })

  const goNext = (validate?: () => boolean) => {
    if (validate && !validate()) return
    const current = controllable.value()
    if (current < props.steps - 1) {
      controllable.requestChange(current + 1, createChangeDetails("step-change" as "step-change"))
    }
  }

  const goPrev = () => {
    const current = controllable.value()
    if (current > 0) {
      controllable.requestChange(current - 1, createChangeDetails("step-change" as "step-change"))
    }
  }

  const submit = () => {
    props.onComplete?.({})
  }

  const ctx: QuestionnaireContextValue = {
    currentStep: controllable.value,
    totalSteps: props.steps,
    goNext,
    goPrev,
    isFirstStep: () => controllable.value() === 0,
    isLastStep: () => controllable.value() === props.steps - 1,
    submit,
  }

  return (
    <QuestionnaireContext value={ctx}>
      <div
        class={props.class}
        {...applySemanticAttrs({ scope: "questionnaire", part: "root" })}
      >
        {props.children}
      </div>
    </QuestionnaireContext>
  )
}

export function Step(props: QuestionnaireStepProps) {
  const ctx = useQuestionnaireContext()

  return (
    <Show when={ctx.currentStep() === props.index}>
      <div {...applySemanticAttrs({ scope: "questionnaire", part: "step" })}>
        {props.children}
      </div>
    </Show>
  )
}

export function StepTitle(props: QuestionnaireStepTitleProps) {
  useQuestionnaireContext()

  return (
    <h3
      class={props.class}
      {...applySemanticAttrs({ scope: "questionnaire", part: "step-title" })}
    >
      {props.children}
    </h3>
  )
}

export function StepContent(props: QuestionnaireStepContentProps) {
  useQuestionnaireContext()

  return (
    <div
      class={props.class}
      {...applySemanticAttrs({ scope: "questionnaire", part: "step-content" })}
    >
      {props.children}
    </div>
  )
}

export function Navigation(props: QuestionnaireNavigationProps) {
  useQuestionnaireContext()

  return (
    <nav
      aria-label="Questionnaire navigation"
      class={props.class}
      {...applySemanticAttrs({ scope: "questionnaire", part: "navigation" })}
    >
      {props.children}
    </nav>
  )
}

export function NextButton(props: QuestionnaireNextButtonProps) {
  const ctx = useQuestionnaireContext()

  const handleClick = () => {
    ctx.goNext(props.validate)
  }

  return (
    <button
      type="button"
      class={props.class}
      onClick={handleClick}
      disabled={ctx.isLastStep()}
      {...applySemanticAttrs({ scope: "questionnaire", part: "next-button" })}
    >
      {props.children ?? "Next"}
    </button>
  )
}

export function PrevButton(props: QuestionnairePrevButtonProps) {
  const ctx = useQuestionnaireContext()

  const handleClick = () => {
    ctx.goPrev()
  }

  return (
    <button
      type="button"
      class={props.class}
      onClick={handleClick}
      disabled={ctx.isFirstStep()}
      {...applySemanticAttrs({ scope: "questionnaire", part: "prev-button" })}
    >
      {props.children ?? "Previous"}
    </button>
  )
}

export function Progress(props: QuestionnaireProgressProps) {
  const ctx = useQuestionnaireContext()

  return (
    <div
      role="progressbar"
      aria-valuenow={ctx.currentStep() + 1}
      aria-valuemin={1}
      aria-valuemax={ctx.totalSteps}
      aria-label={`Step ${ctx.currentStep() + 1} of ${ctx.totalSteps}`}
      data-current={ctx.currentStep()}
      data-total={ctx.totalSteps}
      class={props.class}
      {...applySemanticAttrs({ scope: "questionnaire", part: "progress" })}
    >
      {props.children ?? `${ctx.currentStep() + 1} / ${ctx.totalSteps}`}
    </div>
  )
}

export function Submit(props: QuestionnaireSubmitProps) {
  const ctx = useQuestionnaireContext()

  return (
    <Show when={ctx.isLastStep()}>
      <button
        type="submit"
        class={props.class}
        onClick={() => ctx.submit()}
        {...applySemanticAttrs({ scope: "questionnaire", part: "submit" })}
      >
        {props.children ?? "Submit"}
      </button>
    </Show>
  )
}
