#!/usr/bin/env bash
set -euo pipefail

ACCOUNT="default"
TIMEZONE="${TZ:-UTC}"
INTERVAL="5h"
UNIT_NAME="openclaw-telegram-usage-status"

while [ "$#" -gt 0 ]; do
  case "$1" in
    --account)
      ACCOUNT="${2:?missing value for --account}"
      shift 2
      ;;
    --account=*)
      ACCOUNT="${1#*=}"
      shift
      ;;
    --timezone)
      TIMEZONE="${2:?missing value for --timezone}"
      shift 2
      ;;
    --timezone=*)
      TIMEZONE="${1#*=}"
      shift
      ;;
    --interval)
      INTERVAL="${2:?missing value for --interval}"
      shift 2
      ;;
    --interval=*)
      INTERVAL="${1#*=}"
      shift
      ;;
    --unit-name)
      UNIT_NAME="${2:?missing value for --unit-name}"
      shift 2
      ;;
    --unit-name=*)
      UNIT_NAME="${1#*=}"
      shift
      ;;
    *)
      echo "unknown argument: $1" >&2
      exit 1
      ;;
  esac
done

SCRIPT_DIR="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)"
PLUGIN_ROOT="$(cd -- "$SCRIPT_DIR/.." && pwd)"
CLI="$PLUGIN_ROOT/dist/cli.js"

if [ ! -f "$CLI" ]; then
  echo "missing $CLI; run npm run build first" >&2
  exit 1
fi

SYSTEMD_USER_DIR="${XDG_CONFIG_HOME:-$HOME/.config}/systemd/user"
mkdir -p "$SYSTEMD_USER_DIR"

SERVICE_PATH="$SYSTEMD_USER_DIR/${UNIT_NAME}.service"
TIMER_PATH="$SYSTEMD_USER_DIR/${UNIT_NAME}.timer"

cat > "$SERVICE_PATH" <<SERVICE
[Unit]
Description=Update Telegram bot usage status

[Service]
Type=oneshot
Environment=PATH=$PATH
WorkingDirectory=$PLUGIN_ROOT
ExecStart=$(command -v node) $CLI --account $ACCOUNT --timezone $TIMEZONE
SERVICE

cat > "$TIMER_PATH" <<TIMER
[Unit]
Description=Refresh Telegram bot usage status every $INTERVAL

[Timer]
OnBootSec=5min
OnUnitActiveSec=$INTERVAL
Persistent=true
Unit=${UNIT_NAME}.service

[Install]
WantedBy=timers.target
TIMER

systemctl --user daemon-reload
systemctl --user enable --now "${UNIT_NAME}.timer"
systemctl --user start "${UNIT_NAME}.service"
systemctl --user list-timers "${UNIT_NAME}.timer" --no-pager --all
