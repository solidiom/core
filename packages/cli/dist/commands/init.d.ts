/**
 * solidiom init — initializes .solidiom/config.json in the current project.
 */
import { Command } from "clipanion";
import { type Config } from "../schemas";
export interface InitOptions {
    cwd: string;
    force?: boolean;
}
export interface InitResult {
    configPath: string;
    created: boolean;
    config: Config;
}
/**
 * Core init logic — usable from CLI and programmatic API.
 */
export declare function runInit(options: InitOptions): InitResult;
/**
 * Clipanion command wrapper.
 */
export declare class InitCommand extends Command {
    static paths: string[][];
    static usage: import("clipanion").Usage;
    force: boolean;
    json: boolean;
    execute(): Promise<number>;
}
//# sourceMappingURL=init.d.ts.map