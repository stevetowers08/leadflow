#!/bin/bash

# Gmail Reply Detection - Google Cloud Pub/Sub Setup Script
# This script sets up the minimal required infrastructure for Gmail reply detection

set -e

# Configuration
PROJECT_ID="${GOOGLE_CLOUD_PROJECT_ID:-your-project-id}"
TOPIC_NAME="gmail-replies"
SUBSCRIPTION_NAME="gmail-replies-subscription"
WEBHOOK_ENDPOINT="${GMAIL_WEBHOOK_URL:-https://jedfundfhzytpnbjkspn.supabase.co/functions/v1/gmail-webhook}"

echo "🚀 Setting up Gmail Reply Detection Infrastructure"
echo "Project ID: $PROJECT_ID"
echo "Webhook Endpoint: $WEBHOOK_ENDPOINT"

# Check if gcloud is installed and authenticated
if ! command -v gcloud &> /dev/null; then
    echo "❌ gcloud CLI not found. Please install Google Cloud SDK first."
    exit 1
fi

# Set the project
gcloud config set project $PROJECT_ID

echo "📋 Step 1: Creating Pub/Sub topic..."
gcloud pubsub topics create $TOPIC_NAME --project=$PROJECT_ID || echo "Topic may already exist"

echo "📋 Step 2: Granting Gmail API permission to publish..."
gcloud pubsub topics add-iam-policy-binding $TOPIC_NAME \
    --member=serviceAccount:gmail-api-push@system.gserviceaccount.com \
    --role=roles/pubsub.publisher \
    --project=$PROJECT_ID || echo "Permission may already exist"

echo "📋 Step 3: Creating push subscription..."
gcloud pubsub subscriptions create $SUBSCRIPTION_NAME \
    --topic=$TOPIC_NAME \
    --push-endpoint=$WEBHOOK_ENDPOINT \
    --project=$PROJECT_ID || echo "Subscription may already exist"

echo "✅ Gmail Pub/Sub setup complete!"
echo ""
echo "📝 Next steps:"
echo "1. Configure Gmail API OAuth scopes:"
echo "   - https://www.googleapis.com/auth/gmail.readonly"
echo "   - https://www.googleapis.com/auth/gmail.modify"
echo ""
echo "2. Set up Gmail watches for each user account"
echo "3. Test webhook endpoint accessibility"
echo ""
echo "🔗 Resources:"
echo "- Topic: projects/$PROJECT_ID/topics/$TOPIC_NAME"
echo "- Subscription: projects/$PROJECT_ID/subscriptions/$SUBSCRIPTION_NAME"
echo "- Webhook: $WEBHOOK_ENDPOINT"
