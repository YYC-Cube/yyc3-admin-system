#!/usr/bin/env bash
LOG="$(pwd)/performance/run.log"
OUT="$(pwd)/performance/run-monitor-summary.txt"
LAST_SIZE_FILE="/tmp/yyc3_perf_last_size"
TMP_RECENT="/tmp/yyc3_perf_recent.log"

mkdir -p "$(pwd)/performance"

while true; do
  if [ ! -f "$LOG" ]; then
    sleep 5
    continue
  fi

  NEW=$(stat -f%z "$LOG" 2>/dev/null || stat -c%s "$LOG" 2>/dev/null)
  if [ -f "$LAST_SIZE_FILE" ]; then
    LAST=$(cat "$LAST_SIZE_FILE" 2>/dev/null || echo 0)
  else
    LAST=0
  fi

  if [ "$NEW" -gt "$LAST" ]; then
    tail -c +$((LAST+1)) "$LOG" | tail -n 500 > "$TMP_RECENT" 2>/dev/null || true

    ERRORS=$(grep -c "Request Failed" "$TMP_RECENT" || true)
    THRESH=$(grep -c "thresholds on metrics" "$TMP_RECENT" || true)
    LAST_LINE=$(tail -n1 "$TMP_RECENT" | tr -d '\r' | sed -n '1p')

    echo "$(date +"%Y-%m-%d %H:%M:%S") | new_bytes=$((NEW-LAST)) | errors=$ERRORS | thresholds=$THRESH" >> "$OUT"
    if [ -n "$LAST_LINE" ]; then
      echo "LATEST: $LAST_LINE" >> "$OUT"
    fi
    echo "----RECENT----" >> "$OUT"
    cat "$TMP_RECENT" >> "$OUT"
    echo "----END----" >> "$OUT"
    echo "$NEW" > "$LAST_SIZE_FILE"
  fi

  sleep 15
done
