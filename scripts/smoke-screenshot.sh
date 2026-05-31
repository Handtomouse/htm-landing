#!/usr/bin/env bash
# smoke-screenshot.sh: capture PNG of URL at viewport
set -eo pipefail
URL="${1:?URL required}"
OUT="${2:?OUTPUT_PATH required}"
W="${3:-1280}"
H="${4:-800}"
CHROME=""
for cand in "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" \
            "/Applications/Chromium.app/Contents/MacOS/Chromium" \
            "$(command -v google-chrome 2>/dev/null)" \
            "$(command -v chromium 2>/dev/null)"; do
  if [ -x "$cand" ]; then CHROME="$cand"; break; fi
done
if [ -n "$CHROME" ]; then
  "$CHROME" --headless --disable-gpu --no-sandbox \
    --virtual-time-budget=5000 \
    --window-size=${W},${H} \
    --screenshot="$OUT" "$URL"
else
  echo "Chrome not found, trying playwright..." >&2
  npx --yes playwright screenshot --viewport-size=${W},${H} \
    --wait-for-timeout 5000 "$URL" "$OUT"
fi
test -f "$OUT" || { echo "FAIL: $OUT not created" >&2; exit 1; }
echo "OK: captured $OUT"
