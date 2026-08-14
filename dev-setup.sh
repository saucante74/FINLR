#!/usr/bin/env bash
set -euo pipefail

./vendor/bin/sail up -d

echo "Redirection des webhooks Stripe vers http://localhost:8000/api/stripe/webhook ..."
stripe listen --forward-to localhost:8000/api/stripe/webhook
