#!/usr/bin/env node
import { updateTelegramUsageStatus } from "./core.js";

function readArg(name: string): string | undefined {
  const prefix = `--${name}=`;
  const inline = process.argv.find((arg) => arg.startsWith(prefix));
  if (inline) return inline.slice(prefix.length);
  const index = process.argv.indexOf(`--${name}`);
  if (index >= 0) return process.argv[index + 1];
  return undefined;
}

const dryRun = process.argv.includes("--dry-run");

try {
  const result = await updateTelegramUsageStatus({
    account: readArg("account"),
    timezone: readArg("timezone"),
    configPath: readArg("config"),
    statePath: readArg("state"),
    descriptionTemplate: readArg("description-template"),
    shortDescriptionTemplate: readArg("short-description-template"),
    dryRun,
  });
  console.log(JSON.stringify(result, null, 2));
} catch (error) {
  console.error(error instanceof Error ? error.message : String(error));
  process.exit(1);
}
