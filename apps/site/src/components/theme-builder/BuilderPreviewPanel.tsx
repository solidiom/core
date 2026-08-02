import { createMemo, createRenderEffect, createSignal, type Accessor } from "solid-js"
import type { ThemeDefinition, ThemeMode } from "../../../../../tools/theme-contract-schema"
import { themeToCssVariables } from "../../lib/theme-builder/theme-to-css"
import type { Locale } from "../../lib/locale"
import * as Button from "@solidiom/button"
import * as Card from "@solidiom/card"
import * as Badge from "@solidiom/badge"
import * as Input from "@solidiom/input"
import * as Switch from "@solidiom/switch"
import * as Checkbox from "@solidiom/checkbox"
import * as Tabs from "@solidiom/tabs"
import * as Alert from "@solidiom/alert"
import * as Progress from "@solidiom/progress"
import * as Separator from "@solidiom/separator"
import * as Label from "@solidiom/label"

export interface BuilderPreviewPanelProps {
  locale: Locale
  theme: Accessor<ThemeDefinition>
  mode: Accessor<ThemeMode>
}

const COPY: Record<
  Locale,
  {
    title: string
    lightLabel: string
    darkLabel: string
    buttons: string
    formControls: string
    cardsAndBadges: string
    navigation: string
    feedback: string
    btnPrimary: string
    btnSecondary: string
    btnDestructive: string
    btnGhost: string
    cardTitle: string
    cardDescription: string
    cardContent: string
    cardAction: string
    inputLabel: string
    inputPlaceholder: string
    checkboxLabel: string
    switchLabel: string
    tab1: string
    tab2: string
    tab3: string
    tabContent1: string
    tabContent2: string
    tabContent3: string
    progressLabel: string
    alertSuccess: string
    alertWarning: string
    alertError: string
    badgeDefault: string
    badgeSuccess: string
    badgeWarning: string
    badgeError: string
  }
> = {
  en: {
    title: "Preview",
    lightLabel: "Light",
    darkLabel: "Dark",
    buttons: "Buttons",
    formControls: "Form Controls",
    cardsAndBadges: "Cards & Badges",
    navigation: "Navigation",
    feedback: "Feedback",
    btnPrimary: "Primary",
    btnSecondary: "Secondary",
    btnDestructive: "Destructive",
    btnGhost: "Ghost",
    cardTitle: "Card Preview",
    cardDescription: "This card uses theme variables.",
    cardContent:
      "Content that adapts to your theme tokens. Every color, border, and radius is driven by CSS custom properties.",
    cardAction: "Action",
    inputLabel: "Email",
    inputPlaceholder: "you@example.com",
    checkboxLabel: "Remember me",
    switchLabel: "Notifications",
    tab1: "Overview",
    tab2: "Settings",
    tab3: "History",
    tabContent1: "Main content panel for the active tab.",
    tabContent2: "Configuration options and preferences.",
    tabContent3: "Recent activity and change log.",
    progressLabel: "Upload progress",
    alertSuccess: "Your changes have been saved.",
    alertWarning: "Your session will expire soon.",
    alertError: "Failed to save your changes.",
    badgeDefault: "Default",
    badgeSuccess: "Success",
    badgeWarning: "Warning",
    badgeError: "Error",
  },
  es: {
    title: "Vista Previa",
    lightLabel: "Claro",
    darkLabel: "Oscuro",
    buttons: "Botones",
    formControls: "Controles de Formulario",
    cardsAndBadges: "Tarjetas e Insignias",
    navigation: "Navegación",
    feedback: "Retroalimentación",
    btnPrimary: "Principal",
    btnSecondary: "Secundario",
    btnDestructive: "Destructivo",
    btnGhost: "Fantasma",
    cardTitle: "Vista de Tarjeta",
    cardDescription: "Esta tarjeta usa variables del tema.",
    cardContent:
      "Contenido que se adapta a tus tokens. Cada color, borde y radio está impulsado por propiedades CSS.",
    cardAction: "Acción",
    inputLabel: "Correo",
    inputPlaceholder: "tu@ejemplo.com",
    checkboxLabel: "Recuérdame",
    switchLabel: "Notificaciones",
    tab1: "General",
    tab2: "Ajustes",
    tab3: "Historial",
    tabContent1: "Panel principal del contenido activo.",
    tabContent2: "Opciones de configuración y preferencias.",
    tabContent3: "Actividad reciente y registro de cambios.",
    progressLabel: "Progreso de subida",
    alertSuccess: "Tus cambios se han guardado.",
    alertWarning: "Tu sesión expirará pronto.",
    alertError: "Error al guardar tus cambios.",
    badgeDefault: "Por defecto",
    badgeSuccess: "Éxito",
    badgeWarning: "Advertencia",
    badgeError: "Error",
  },
}

type CopyShape = typeof COPY.en

function applyVarsToEl(el: HTMLElement, vars: Record<string, string>): void {
  for (const [key, value] of Object.entries(vars)) {
    el.style.setProperty(key, value)
  }
}

function PreviewContent(props: { c: CopyShape }) {
  const c = () => props.c
  const [togglePressed, setTogglePressed] = createSignal(false)

  return (
    <>
      {/* Buttons */}
      <div class="theme-builder__preview-section">
        <h3 class="theme-builder__preview-section-title">{c().buttons}</h3>
        <div class="theme-builder__preview-buttons">
          <Button.Root class="theme-builder__preview-btn theme-builder__preview-btn--primary">
            {c().btnPrimary}
          </Button.Root>
          <Button.Root class="theme-builder__preview-btn theme-builder__preview-btn--secondary">
            {c().btnSecondary}
          </Button.Root>
          <Button.Root class="theme-builder__preview-btn theme-builder__preview-btn--destructive">
            {c().btnDestructive}
          </Button.Root>
          <Button.Root class="theme-builder__preview-btn theme-builder__preview-btn--ghost">
            {c().btnGhost}
          </Button.Root>
          <Button.ToggleButton
            class="theme-builder__preview-btn theme-builder__preview-btn--toggle"
            pressed={togglePressed()}
            onPressedChange={setTogglePressed}
          >
            Toggle
          </Button.ToggleButton>
        </div>
      </div>

      {/* Form Controls */}
      <div class="theme-builder__preview-section">
        <h3 class="theme-builder__preview-section-title">{c().formControls}</h3>
        <div class="theme-builder__preview-form-row">
          <div class="theme-builder__preview-field">
            <Label.Root class="theme-builder__preview-label">{c().inputLabel}</Label.Root>
            <Input.Root class="theme-builder__preview-input" placeholder={c().inputPlaceholder} />
          </div>

          <label class="theme-builder__preview-checkbox-label">
            <Checkbox.Root defaultChecked class="theme-builder__preview-checkbox">
              <Checkbox.Indicator>
                <span style={{ display: "none" }}>&#10003;</span>
              </Checkbox.Indicator>
            </Checkbox.Root>
            {c().checkboxLabel}
          </label>

          <label class="theme-builder__preview-switch-label">
            <Switch.Root defaultChecked class="theme-builder__preview-switch">
              <Switch.Thumb />
            </Switch.Root>
            {c().switchLabel}
          </label>
        </div>
      </div>

      {/* Cards & Badges */}
      <div class="theme-builder__preview-section">
        <h3 class="theme-builder__preview-section-title">{c().cardsAndBadges}</h3>
        <div class="theme-builder__preview-grid">
          <Card.Root class="theme-builder__preview-card">
            <Card.Header class="theme-builder__preview-card-header">
              <Card.Title class="theme-builder__preview-card-title">{c().cardTitle}</Card.Title>
              <Card.Description class="theme-builder__preview-card-description">
                {c().cardDescription}
              </Card.Description>
            </Card.Header>
            <Card.Content class="theme-builder__preview-card-content">
              {c().cardContent}
            </Card.Content>
            <Card.Footer class="theme-builder__preview-card-footer">
              <Button.Root class="theme-builder__preview-btn theme-builder__preview-btn--primary">
                {c().cardAction}
              </Button.Root>
              <Button.Root class="theme-builder__preview-btn theme-builder__preview-btn--secondary">
                Cancel
              </Button.Root>
            </Card.Footer>
          </Card.Root>

          <div class="theme-builder__preview-badges">
            <Badge.Root class="theme-builder__preview-badge theme-builder__preview-badge--default">
              {c().badgeDefault}
            </Badge.Root>
            <Badge.Root class="theme-builder__preview-badge theme-builder__preview-badge--success">
              {c().badgeSuccess}
            </Badge.Root>
            <Badge.Root class="theme-builder__preview-badge theme-builder__preview-badge--warning">
              {c().badgeWarning}
            </Badge.Root>
            <Badge.Root class="theme-builder__preview-badge theme-builder__preview-badge--destructive">
              {c().badgeError}
            </Badge.Root>
          </div>
        </div>
      </div>

      {/* Separator */}
      <Separator.Root class="theme-builder__preview-separator" />

      {/* Tabs */}
      <div class="theme-builder__preview-section">
        <h3 class="theme-builder__preview-section-title">{c().navigation}</h3>
        <div class="theme-builder__preview-tabs">
          <Tabs.Root defaultValue="overview">
            <Tabs.List class="theme-builder__preview-tablist">
              <Tabs.Trigger value="overview">{c().tab1}</Tabs.Trigger>
              <Tabs.Trigger value="settings">{c().tab2}</Tabs.Trigger>
              <Tabs.Trigger value="history">{c().tab3}</Tabs.Trigger>
            </Tabs.List>
            <Tabs.Content value="overview" class="theme-builder__preview-tabpanel">
              {c().tabContent1}
            </Tabs.Content>
            <Tabs.Content value="settings" class="theme-builder__preview-tabpanel">
              {c().tabContent2}
            </Tabs.Content>
            <Tabs.Content value="history" class="theme-builder__preview-tabpanel">
              {c().tabContent3}
            </Tabs.Content>
          </Tabs.Root>
        </div>
      </div>

      {/* Progress */}
      <div class="theme-builder__preview-section">
        <Progress.Root
          value={60}
          aria-label={c().progressLabel}
          class="theme-builder__preview-progress"
        >
          <div class="theme-builder__preview-progress-track">
            <Progress.Indicator
              class="theme-builder__preview-progress-fill"
              style={{ width: "60%" }}
            />
          </div>
          <span class="theme-builder__preview-progress-label">60%</span>
        </Progress.Root>
      </div>

      {/* Alerts */}
      <div class="theme-builder__preview-section">
        <h3 class="theme-builder__preview-section-title">{c().feedback}</h3>
        <div class="theme-builder__preview-alerts">
          <Alert.Root
            type="success"
            class="theme-builder__preview-alert theme-builder__preview-alert--success"
          >
            <span class="theme-builder__preview-alert-icon">&#10004;</span>
            <Alert.Description>{c().alertSuccess}</Alert.Description>
          </Alert.Root>
          <Alert.Root
            type="warning"
            class="theme-builder__preview-alert theme-builder__preview-alert--warning"
          >
            <span class="theme-builder__preview-alert-icon">&#9888;</span>
            <Alert.Description>{c().alertWarning}</Alert.Description>
          </Alert.Root>
          <Alert.Root
            type="error"
            class="theme-builder__preview-alert theme-builder__preview-alert--error"
          >
            <span class="theme-builder__preview-alert-icon">&#10006;</span>
            <Alert.Description>{c().alertError}</Alert.Description>
          </Alert.Root>
        </div>
      </div>
    </>
  )
}

function PreviewPane(props: {
  mode: "light" | "dark"
  label: string
  cssVars: Accessor<Record<string, string>>
  copy: CopyShape
}) {
  let scrollRef: HTMLDivElement | undefined

  createRenderEffect(
    () => props.cssVars(),
    (vars) => {
      if (!scrollRef) return
      applyVarsToEl(scrollRef, vars)
    },
  )

  const modeClass =
    props.mode === "light"
      ? "theme-builder__preview-pane--light"
      : "theme-builder__preview-pane--dark"

  const dotClass =
    props.mode === "light"
      ? "theme-builder__preview-dot--light"
      : "theme-builder__preview-dot--dark"

  return (
    <div class={`theme-builder__preview-pane ${modeClass}`}>
      <div class="theme-builder__preview-pane-header">
        <span class={`theme-builder__preview-dot ${dotClass}`} />
        {props.label}
      </div>
      <div ref={scrollRef!} class="theme-builder__preview-scroll">
        <PreviewContent c={props.copy} />
      </div>
    </div>
  )
}

export function BuilderPreviewPanel(props: BuilderPreviewPanelProps) {
  const copy = () => COPY[props.locale]

  const lightVars = createMemo(() => themeToCssVariables(props.theme(), "light"))
  const darkVars = createMemo(() => themeToCssVariables(props.theme(), "dark"))

  return (
    <section class="theme-builder__panel-preview" aria-label={copy().title}>
      <div class="theme-builder__preview-toolbar">
        <span>{copy().title}</span>
      </div>
      <div class="theme-builder__preview-dual">
        <PreviewPane mode="light" label={copy().lightLabel} cssVars={lightVars} copy={copy()} />
        <PreviewPane mode="dark" label={copy().darkLabel} cssVars={darkVars} copy={copy()} />
      </div>
    </section>
  )
}
