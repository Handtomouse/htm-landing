#!/usr/bin/env bash
# em-dash-audit.sh: fail if user-facing em or en dashes appear in non-comment code
set -eo pipefail
TARGETS="${@:-app/work lib public/work}"
PATTERN=$'[—–]'  # em dash, en dash
HITS=$(grep -rnE "$PATTERN" $TARGETS \
  --include='*.ts' --include='*.tsx' --include='*.json' \
  --include='*.css' --include='*.md' --include='*.txt' 2>/dev/null \
  | grep -vE '^[^:]+:[0-9]+:[[:space:]]*(//|/\*|\*)' || true)
if [ -n "$HITS" ]; then
  echo "FAIL: em-dash or en-dash in user-facing code:" >&2
  echo "$HITS" >&2
  exit 1
fi
echo "OK: no user-facing em/en dashes in $TARGETS"
