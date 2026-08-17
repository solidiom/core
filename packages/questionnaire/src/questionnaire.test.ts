import { describe, it, expect } from "vitest"
import * as Questionnaire from "./index"

describe("questionnaire", () => {
  it("exports Root as a function", () => {
    expect(Questionnaire.Root).toBeDefined()
    expect(typeof Questionnaire.Root).toBe("function")
  })

  it("exports Step as a function", () => {
    expect(Questionnaire.Step).toBeDefined()
    expect(typeof Questionnaire.Step).toBe("function")
  })

  it("exports StepTitle as a function", () => {
    expect(Questionnaire.StepTitle).toBeDefined()
    expect(typeof Questionnaire.StepTitle).toBe("function")
  })

  it("exports StepContent as a function", () => {
    expect(Questionnaire.StepContent).toBeDefined()
    expect(typeof Questionnaire.StepContent).toBe("function")
  })

  it("exports Navigation as a function", () => {
    expect(Questionnaire.Navigation).toBeDefined()
    expect(typeof Questionnaire.Navigation).toBe("function")
  })

  it("exports NextButton as a function", () => {
    expect(Questionnaire.NextButton).toBeDefined()
    expect(typeof Questionnaire.NextButton).toBe("function")
  })

  it("exports PrevButton as a function", () => {
    expect(Questionnaire.PrevButton).toBeDefined()
    expect(typeof Questionnaire.PrevButton).toBe("function")
  })

  it("exports Progress as a function", () => {
    expect(Questionnaire.Progress).toBeDefined()
    expect(typeof Questionnaire.Progress).toBe("function")
  })

  it("exports Submit as a function", () => {
    expect(Questionnaire.Submit).toBeDefined()
    expect(typeof Questionnaire.Submit).toBe("function")
  })
})
