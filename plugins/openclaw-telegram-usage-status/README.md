# Telegram Usage Status

OpenClaw tool plugin that writes current OpenAI/OpenClaw usage remaining into a Telegram bot profile.

It reads `openclaw status --usage --json`, computes the remaining percentages for the `5h` and `Week` windows, then updates:

- Telegram Bot API `setMyDescription`
- Telegram Bot API `setMyShortDescription`

No Telegram token is packaged. The plugin reads the configured bot token from the local `openclaw.json` Telegram account.

## Tool

The plugin exposes one tool:

- `telegram_usage_status_update`

Useful arguments:

- `account`: Telegram account key from `openclaw.json`; default is `default`
- `timezone`: IANA timezone for reset/update display; default is `TZ` or `UTC`
- `statePath`: optional JSON file path for the last update result
- `descriptionTemplate`: optional full description template
- `shortDescriptionTemplate`: optional short description template
- `dryRun`: compute and write state without calling Telegram

Template variables:

- `{fiveLeft}`
- `{fiveReset}`
- `{weekLeft}`
- `{weekReset}`
- `{updatedAt}`
- `{account}`

## CLI

After installation/build:

```bash
telegram-usage-status --account default --timezone Asia/Jerusalem
```

Dry run:

```bash
telegram-usage-status --dry-run --timezone Asia/Jerusalem
```

## Optional systemd timer

The plugin includes helper scripts for hosts that want automatic refreshes without spending model tokens.

From the plugin directory:

```bash
bash scripts/install-systemd-timer.sh --account default --timezone Asia/Jerusalem --interval 5h
```

Remove the timer:

```bash
bash scripts/uninstall-systemd-timer.sh
```

## Safety

Do not publish local state files, bot tokens, logs, or generated `.tgz` archives. This package only includes source/build output, docs, license, plugin metadata, and helper scripts.
