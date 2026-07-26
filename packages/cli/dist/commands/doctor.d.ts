/**
 * solidiom doctor — checks project configuration health.
 */
import { Command } from "clipanion";
export interface DoctorCheck {
    name: string;
    status: "pass" | "warn" | "fail";
    detail?: string;
}
export interface DoctorResult {
    checks: DoctorCheck[];
    healthy: boolean;
}
/**
 * Core doctor logic.
 */
export declare function runDoctor(cwd: string): DoctorResult;
export declare class DoctorCommand extends Command {
    static paths: string[][];
    static usage: import("clipanion").Usage;
    json: boolean;
    execute(): Promise<number>;
}
//# sourceMappingURL=doctor.d.ts.map