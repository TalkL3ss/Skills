#!/usr/bin/env bash
set -euo pipefail

UNIT_NAME="openclaw-telegram-usage-status"

while [ "$#" -gt 0 ]; do
  case "$1" in
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

SYSTEMD_USER_DIR="${XDG_CONFIG_HOME:-$HOME/.config}/systemd/user"

systemctl --user disable --now "${UNIT_NAME}.timer" >/dev/null 2>&1 || true
rm -f "$SYSTEMD_USER_DIR/${UNIT_NAME}.service" "$SYSTEMD_USER_DIR/${UNIT_NAME}.timer"
systemctl --user daemon-reload
echo "removed ${UNIT_NAME}.timer"
