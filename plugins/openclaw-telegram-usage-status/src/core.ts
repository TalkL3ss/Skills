import { execFile } from "node:child_process";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { homedir } from "node:os";
import path from "node:path";
import { promisify } from "node:util";

const execFileAsync = promisify(execFile);

export interface UpdateOptions {
  account?: string;
  configPath?: string;
  statePath?: string;
  timezone?: string;
  descriptionTemplate?: string;
  shortDescriptionTemplate?: string;
  dryRun?: boolean;
}

export interface UsageWindow {
  leftPercent: number;
  usedPercent: number;
  resetAt: string;
}

export interface UpdateResult {
  ok: boolean;
  dryRun: boolean;
  account: string;
  updatedAt: string;
  description: string;
  shortDescription: string;
  fiveHour: UsageWindow;
  week: UsageWindow;
  statePath?: string;
}

interface TelegramConfig {
  botToken?: string;
}

interface OpenClawStatusWindow {
  label?: string;
  usedPercent?: number;
  resetAt?: number;
}

function expandHome(value: string): string {
  if (value === "~") return homedir();
  if (value.startsWith("~/")) return path.join(homedir(), value.slice(2));
  return value;
}

function defaultConfigPath(): string {
  return process.env.OPENCLAW_CONFIG ?? path.join(homedir(), ".openclaw", "openclaw.json");
}

function defaultStatePath(): string {
  return path.join(homedir(), ".openclaw", "telegram-usage-status.json");
}

function formatDate(ms: number | undefined, timezone: string): string {
  if (!ms) return "unknown";
  return new Intl.DateTimeFormat("en-US", {
    timeZone: timezone,
    weekday: "short",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(new Date(ms));
}

function formatUpdatedAt(timezone: string): string {
  const parts = new Intl.DateTimeFormat("sv-SE", {
    timeZone: timezone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(new Date());
  return `${parts} ${timezone}`;
}

function renderTemplate(template: string, values: Record<string, string | number>): string {
  return template.replace(/\{([a-zA-Z0-9_]+)\}/g, (match, key) => {
    const value = values[key];
    return value === undefined ? match : String(value);
  });
}

async function readTelegramConfig(configPath: string, account: string): Promise<TelegramConfig> {
  const raw = await readFile(expandHome(configPath), "utf8");
  const config = JSON.parse(raw);
  return config?.channels?.telegram?.accounts?.[account] ?? {};
}

async function readUsage(timezone: string): Promise<{
  fiveHour: UsageWindow;
  week: UsageWindow;
}> {
  const { stdout } = await execFileAsync("openclaw", ["status", "--usage", "--json"], {
    maxBuffer: 10 * 1024 * 1024,
  });
  const jsonStart = stdout.indexOf("{");
  if (jsonStart < 0) throw new Error("openclaw status did not return JSON");
  const status = JSON.parse(stdout.slice(jsonStart));
  const windows = status?.usage?.providers
    ?.find((provider: { provider?: string }) => provider.provider === "openai")
    ?.windows as OpenClawStatusWindow[] | undefined;
  if (!windows) throw new Error("OpenAI usage windows were not found");

  const findWindow = (label: string): UsageWindow => {
    const window = windows.find((item) => item.label === label);
    if (!window || typeof window.usedPercent !== "number") {
      throw new Error(`usage window not found: ${label}`);
    }
    return {
      leftPercent: Math.max(0, 100 - window.usedPercent),
      usedPercent: window.usedPercent,
      resetAt: formatDate(window.resetAt, timezone),
    };
  };

  return {
    fiveHour: findWindow("5h"),
    week: findWindow("Week"),
  };
}

async function telegramApi(botToken: string, method: string, payload: unknown): Promise<void> {
  const response = await fetch(`https://api.telegram.org/bot${botToken}/${method}`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(payload),
  });
  const body = (await response.json()) as { ok?: boolean; description?: string };
  if (!response.ok || body.ok !== true) {
    throw new Error(`Telegram ${method} failed: ${body.description ?? response.statusText}`);
  }
}

export async function updateTelegramUsageStatus(options: UpdateOptions = {}): Promise<UpdateResult> {
  const account = options.account ?? process.env.TELEGRAM_USAGE_ACCOUNT ?? "default";
  const timezone = options.timezone ?? process.env.TZ ?? "UTC";
  const configPath = options.configPath ?? defaultConfigPath();
  const statePath = options.statePath ?? defaultStatePath();
  const dryRun = options.dryRun ?? false;
  const descriptionTemplate =
    options.descriptionTemplate ??
    "Token usage: 5h {fiveLeft}% left (reset {fiveReset}); Week {weekLeft}% left (reset {weekReset}). Updated {updatedAt}.";
  const shortDescriptionTemplate =
    options.shortDescriptionTemplate ?? "Tokens: 5h {fiveLeft}% left | Week {weekLeft}% left";

  const telegram = await readTelegramConfig(configPath, account);
  if (!telegram.botToken && !dryRun) {
    throw new Error(`Telegram account "${account}" has no botToken in ${configPath}`);
  }

  const { fiveHour, week } = await readUsage(timezone);
  const updatedAt = formatUpdatedAt(timezone);
  const values = {
    fiveLeft: fiveHour.leftPercent,
    fiveReset: fiveHour.resetAt,
    weekLeft: week.leftPercent,
    weekReset: week.resetAt,
    updatedAt,
    account,
  };
  const description = renderTemplate(descriptionTemplate, values);
  const shortDescription = renderTemplate(shortDescriptionTemplate, values);

  if (!dryRun) {
    await telegramApi(telegram.botToken as string, "setMyDescription", { description });
    await telegramApi(telegram.botToken as string, "setMyShortDescription", {
      short_description: shortDescription,
    });
  }

  const result: UpdateResult = {
    ok: true,
    dryRun,
    account,
    updatedAt,
    description,
    shortDescription,
    fiveHour,
    week,
    statePath: expandHome(statePath),
  };

  await mkdir(path.dirname(expandHome(statePath)), { recursive: true });
  await writeFile(expandHome(statePath), `${JSON.stringify(result, null, 2)}\n`, "utf8");
  return result;
}
