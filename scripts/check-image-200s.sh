#!/usr/bin/env bash
# check-image-200s.sh: post-deploy image-200 verifier for QA-04
set -eo pipefail
BASE="${1:?BASE_URL required (e.g. https://handtomouse.org)}"
SLUGS="swich fishbowl sbts mdb maplemoon ferrari bankwest refundid \
       troodpratt pureairo allianz endoca hills stealth softlite \
       mullet aura salesforce verde"
FAILED=0
for slug in $SLUGS; do
  URL="$BASE/work/$slug"
  HTML=$(curl -fsSL "$URL" 2>/dev/null) || { echo "FAIL: $URL"; FAILED=1; continue; }
  IMGS=$(echo "$HTML" | grep -oE 'src="[^"]+\.(jpg|jpeg|png|webp|svg)"' | sed 's/^src="//;s/"$//' | sort -u)
  for img in $IMGS; do
    case "$img" in /*) FULL="$BASE$img" ;; http*) FULL="$img" ;; *) FULL="$BASE/$img" ;; esac
    CODE=$(curl -s -o /dev/null -w '%{http_code}' "$FULL")
    if [ "$CODE" != "200" ]; then
      echo "FAIL: $FULL -> HTTP $CODE"
      FAILED=1
    fi
  done
done
[ $FAILED -eq 0 ] && echo "OK: all images on all 19 cases returned 200" || exit 1
