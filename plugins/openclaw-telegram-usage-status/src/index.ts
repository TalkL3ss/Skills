import { Type } from "typebox";
import { defineToolPlugin } from "openclaw/plugin-sdk/tool-plugin";
import { updateTelegramUsageStatus } from "./core.js";

export default defineToolPlugin({
  id: "openclaw-telegram-usage-status",
  name: "Telegram Usage Status",
  description: "Update a Telegram bot profile description with OpenClaw usage remaining.",
  tools: (tool) => [
    tool({
      name: "telegram_usage_status_update",
      description: "Refresh Telegram bot description and short description with 5h and weekly OpenClaw usage remaining.",
      parameters: Type.Object({
        account: Type.Optional(Type.String({ description: "Telegram account key from openclaw.json. Defaults to default." })),
        timezone: Type.Optional(Type.String({ description: "IANA timezone for reset/update display. Defaults to TZ or UTC." })),
        configPath: Type.Optional(Type.String({ description: "Path to openclaw.json. Defaults to ~/.openclaw/openclaw.json." })),
        statePath: Type.Optional(Type.String({ description: "Where to write the last update JSON state." })),
        descriptionTemplate: Type.Optional(Type.String({ description: "Template for Bot API setMyDescription." })),
        shortDescriptionTemplate: Type.Optional(Type.String({ description: "Template for Bot API setMyShortDescription." })),
        dryRun: Type.Optional(Type.Boolean({ description: "Compute status and write state without calling Telegram." })),
      }),
      execute: async (options) => updateTelegramUsageStatus(options),
    }),
  ],
});
