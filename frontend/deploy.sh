!/usr/bin/env bash
#
# deploy.sh — build and deploy badgertype-frontend to Cloud Run
#
# Usage:
#   ./deploy.sh
#
# Requires: gcloud CLI authenticated, cloudbuild.yaml in this directory.
 
set -euo pipefail
 
PROJECT="badgertype"
SERVICE="badgertype-frontend"
REGION="us-west2"
IMAGE="gcr.io/${PROJECT}/${SERVICE}"
 
echo "==> Building and pushing image via Cloud Build..."
gcloud builds submit --config cloudbuild.yaml \
  --substitutions=_IMAGE="${IMAGE}"
 
echo "==> Deploying to Cloud Run..."
gcloud run deploy "${SERVICE}" \
  --image "${IMAGE}" \
  --region "${REGION}" \
  --allow-unauthenticated
 
echo "==> Done. Service URL:"
gcloud run services describe "${SERVICE}" \
  --region "${REGION}" \
  --format='value(status.url)'
 