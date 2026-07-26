/**
 * Vitest workspace configuration — aggregates all package test configs.
 * In vitest 4.x, workspace files export a plain array (defineWorkspace was removed).
 */
export default ["packages/*/vitest.config.ts", "tools/test/vitest.browser.config.ts"]
