#!/usr/bin/env node
/**
 * solidiom CLI entry point — powered by clipanion.
 */

import { Cli } from "clipanion"
import { InitCommand } from "./commands/init"
import { PlanCommand } from "./commands/plan"
import { AddCommand } from "./commands/add"
import { InspectCommand } from "./commands/inspect"
import { DiffCommand } from "./commands/diff"
import { DetachCommand } from "./commands/detach"
import { UpdateCommand } from "./commands/update"
import { DoctorCommand } from "./commands/doctor"
import { VerifyCommand } from "./commands/verify"
import { AuditCommand } from "./commands/audit"

const cli = new Cli({
  binaryLabel: "solidiom",
  binaryName: "solidiom",
  binaryVersion: "0.0.1-next.0",
})

cli.register(InitCommand)
cli.register(PlanCommand)
cli.register(AddCommand)
cli.register(InspectCommand)
cli.register(DiffCommand)
cli.register(DetachCommand)
cli.register(UpdateCommand)
cli.register(DoctorCommand)
cli.register(VerifyCommand)
cli.register(AuditCommand)

cli.runExit(process.argv.slice(2))
