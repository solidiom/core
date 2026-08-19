/**
 * BLOCK-ONBOARD-03: Project Starter block.
 *
 * Guided project creation wizard with template selection.
 * Implements all four required states: loading, empty, error, restricted.
 *
 * Dependencies: Button, Input, Field, Card, Alert, Select, Pagination, Spinner
 */

import { createSignal, Show, For } from "solid-js"
import type { JSX } from "@solidjs/web"

export interface ProjectTemplate {
  id: string
  name: string
  description: string
}

export interface ProjectStarterProps {
  templates?: ProjectTemplate[]
  onCreateProject?: (data: { name: string; templateId: string }) => Promise<void>
  error?: string
  restricted?: boolean
  restrictedReason?: string
  class?: string
}

export type ProjectStarterState = "empty" | "loading" | "error" | "restricted"

export function ProjectStarter(props: ProjectStarterProps): JSX.Element {
  const [projectName, setProjectName] = createSignal("")
  const [selectedTemplate, setSelectedTemplate] = createSignal("")
  const [state, setState] = createSignal<ProjectStarterState>(
    props.restricted ? "restricted" : "empty",
  )
  const [localError, setLocalError] = createSignal("")

  const currentError = () => props.error || localError()

  async function handleSubmit(e: Event) {
    e.preventDefault()
    setLocalError("")
    if (!projectName() || !selectedTemplate()) {
      setLocalError("Project name and template are required.")
      setState("error")
      return
    }
    setState("loading")
    try {
      await props.onCreateProject?.({ name: projectName(), templateId: selectedTemplate() })
    } catch (err) {
      setLocalError(err instanceof Error ? err.message : "Project creation failed.")
      setState("error")
    }
  }

  return (
    <div
      class={["solidiom-block-project-starter", props.class].filter(Boolean).join(" ")}
      data-state={state()}
    >
      <Show when={state() === "restricted"}>
        <div class="solidiom-block-project-starter__restricted" role="alert">
          <p>{props.restrictedReason || "Project creation is restricted."}</p>
        </div>
      </Show>

      <Show when={state() === "error" && currentError()}>
        <div class="solidiom-block-project-starter__error" role="alert">
          <p>{currentError()}</p>
        </div>
      </Show>

      <Show when={state() !== "restricted"}>
        <form onSubmit={handleSubmit} class="solidiom-block-project-starter__form">
          <div class="solidiom-block-project-starter__field">
            <label for="project-name">Project Name</label>
            <input
              id="project-name"
              type="text"
              value={projectName()}
              onInput={(e) => setProjectName(e.currentTarget.value)}
              placeholder="my-project"
              required
              disabled={state() === "loading"}
            />
          </div>

          <div class="solidiom-block-project-starter__templates">
            <label>Template</label>
            <div class="solidiom-block-project-starter__template-grid">
              <For each={props.templates ?? []}>
                {(tpl) => (
                  <button
                    type="button"
                    class="solidiom-block-project-starter__template-card"
                    classList={{ "is-selected": selectedTemplate() === tpl.id }}
                    onClick={() => setSelectedTemplate(tpl.id)}
                    disabled={state() === "loading"}
                  >
                    <strong>{tpl.name}</strong>
                    <p>{tpl.description}</p>
                  </button>
                )}
              </For>
            </div>
          </div>

          <button
            type="submit"
            class="solidiom-block-project-starter__submit"
            disabled={state() === "loading"}
          >
            <Show when={state() === "loading"} fallback="Create Project">
              Creating...
            </Show>
          </button>
        </form>
      </Show>
    </div>
  )
}

export default ProjectStarter
