#!/usr/bin/env bash
set -euo pipefail

SITE="${SITE:?SITE is required}"
ROLE="${AWS_LAMBDA_ROLE_ARN:?AWS_LAMBDA_ROLE_ARN is required}"
FUNCTION_NAME="bastrich-tech-cdn-cache-warmer"
REGIONS="us-east-1 us-east-2 us-west-1 us-west-2 af-south-1 ap-east-1 ap-south-2 ap-southeast-3 ap-southeast-5 ap-southeast-4 ap-south-1 ap-southeast-6 ap-northeast-3 ap-northeast-2 ap-southeast-1 ap-southeast-2 ap-east-2 ap-southeast-7 ap-northeast-1 ca-central-1 ca-west-1 eu-central-1 eu-west-1 eu-west-2 eu-south-1 eu-west-3 eu-south-2 eu-north-1 eu-central-2 il-central-1 mx-central-1 sa-east-1"

export AWS_MAX_ATTEMPTS=2
aws_call() { timeout "$1" aws --cli-connect-timeout 10 --cli-read-timeout 30 "${@:2}"; }

zip -qj /tmp/warmer.zip infra/warm_lambda.py

(cd dist && find . -type f) | sed 's|^\.||; s|index\.html$||' | sort \
  | python3 -c 'import json,sys; print(json.dumps({"site": sys.argv[1], "paths": [l.strip() for l in sys.stdin if l.strip()]}))' "$SITE" \
  > /tmp/warmer-payload.json

for region in $REGIONS; do
  if aws_call 60 lambda get-function --function-name "$FUNCTION_NAME" --region "$region" >/dev/null 2>&1; then
    aws_call 120 lambda update-function-code --function-name "$FUNCTION_NAME" --region "$region" \
      --zip-file fileb:///tmp/warmer.zip >/dev/null
    aws_call 180 lambda wait function-updated-v2 --function-name "$FUNCTION_NAME" --region "$region"
  else
    aws_call 120 lambda create-function --function-name "$FUNCTION_NAME" --region "$region" \
      --runtime python3.12 --role "$ROLE" --handler warm_lambda.handler \
      --timeout 120 --memory-size 256 --zip-file fileb:///tmp/warmer.zip >/dev/null
    # A new function is Pending for a moment and cannot be invoked yet.
    aws_call 180 lambda wait function-active-v2 --function-name "$FUNCTION_NAME" --region "$region"
  fi
  aws_call 180 lambda invoke --function-name "$FUNCTION_NAME" --region "$region" \
    --payload fileb:///tmp/warmer-payload.json /tmp/warmer-out.json >/dev/null
  echo "  $region $(cat /tmp/warmer-out.json)"

  python3 -c 'import json,sys; r=json.load(open("/tmp/warmer-out.json")); sys.exit(r["warmed"] != r["requested"])'
done
