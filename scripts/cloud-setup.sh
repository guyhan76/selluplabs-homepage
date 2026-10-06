#!/usr/bin/env bash
set -euo pipefail

cd /workspace/selluplabs-homepage
if [[ ! -f package.json || ! -f package-lock.json ]]; then
  echo "Homepage source files are missing. Restore the saved workspace snapshot before setup." >&2
  exit 1
fi

node --version
npm --version
npm ci --cache /workspace/.npm-cache --no-audit --no-fund
npm run build -- --logLevel warn
