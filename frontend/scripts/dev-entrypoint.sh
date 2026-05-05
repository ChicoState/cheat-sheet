#!/bin/sh
set -eu

LOCKFILE_HASH_FILE="node_modules/.package-lock.hash"

current_hash=""
stored_hash=""

if [ -f package-lock.json ]; then
  current_hash="$(sha256sum package-lock.json | awk '{print $1}')"
fi

if [ -f "$LOCKFILE_HASH_FILE" ]; then
  stored_hash="$(cat "$LOCKFILE_HASH_FILE")"
fi

if [ ! -d node_modules ] || [ ! -f node_modules/.vite/deps/_metadata.json ] || [ "$current_hash" != "$stored_hash" ]; then
  echo "Syncing frontend dependencies..."
  npm ci
  mkdir -p node_modules
  printf '%s' "$current_hash" > "$LOCKFILE_HASH_FILE"
fi

exec npm run dev -- --host
