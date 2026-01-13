#!/bin/bash

# Test script for People Data Labs enrichment integration
# Usage: ./scripts/test-enrichment.sh [lead_id]

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Default test data
LEAD_ID="${1:-test-lead-$(date +%s)}"
API_URL="${API_URL:-http://localhost:8086}"

echo -e "${BLUE}════════════════════════════════════════════════════${NC}"
echo -e "${BLUE}  Testing People Data Labs Enrichment Integration${NC}"
echo -e "${BLUE}════════════════════════════════════════════════════${NC}"
echo ""
echo -e "Lead ID: ${GREEN}${LEAD_ID}${NC}"
echo -e "API URL: ${GREEN}${API_URL}${NC}"
echo ""

# Test 1: Direct n8n webhook call
echo -e "${BLUE}[Test 1]${NC} Testing n8n webhook directly..."
RESPONSE=$(curl -s -X POST https://aligreenwood.app.n8n.cloud/webhook/leaflow-enrichment \
  -H "Content-Type: application/json" \
  -H "X-API-Key: cAag2haO8d++8Ya5h+ECz/5U9e7/a8cx+F8pBlUdWjY=" \
  -d '{
    "lead_id": "'"${LEAD_ID}"'",
    "company": "Darling Crackles",
    "email": "craig@darlingcrackles.com.au",
    "first_name": "Craig",
    "last_name": "MacIndoe"
  }')

# Check if response contains enrichment data
if echo "$RESPONSE" | grep -q '"status":200'; then
  LIKELIHOOD=$(echo "$RESPONSE" | grep -o '"likelihood":[0-9]*' | head -1 | cut -d':' -f2)
  echo -e "${GREEN}✓ Success!${NC} PDL returned enrichment data"
  echo -e "  Likelihood: ${GREEN}${LIKELIHOOD}${NC}/10"

  # Extract key fields
  LINKEDIN=$(echo "$RESPONSE" | grep -o '"linkedin_url":"[^"]*"' | head -1 | cut -d'"' -f4)
  JOB_TITLE=$(echo "$RESPONSE" | grep -o '"job_title":"[^"]*"' | head -1 | cut -d'"' -f4)
  COMPANY=$(echo "$RESPONSE" | grep -o '"job_company_name":"[^"]*"' | head -1 | cut -d'"' -f4)

  echo -e "  LinkedIn: ${GREEN}${LINKEDIN}${NC}"
  echo -e "  Job: ${GREEN}${JOB_TITLE}${NC} at ${GREEN}${COMPANY}${NC}"
else
  echo -e "${RED}✗ Failed${NC} - No enrichment data returned"
  echo "Response: $RESPONSE"
  exit 1
fi
echo ""

# Test 2: App API call
echo -e "${BLUE}[Test 2]${NC} Testing app API enrichment endpoint..."
RESPONSE=$(curl -s -X POST "${API_URL}/api/enrich-lead" \
  -H "Content-Type: application/json" \
  -d '{
    "lead_id": "'"${LEAD_ID}"'",
    "company": "Darling Crackles",
    "email": "craig@darlingcrackles.com.au",
    "first_name": "Craig",
    "last_name": "MacIndoe"
  }')

# Check if enrichment succeeded
if echo "$RESPONSE" | grep -q '"success":true'; then
  echo -e "${GREEN}✓ Success!${NC} Lead enriched via app API"
  echo "Response: $RESPONSE" | jq '.' 2>/dev/null || echo "$RESPONSE"
else
  echo -e "${RED}✗ Failed${NC}"
  echo "Response: $RESPONSE"
  echo ""
  echo -e "${BLUE}Note:${NC} App API test requires the dev server to be running:"
  echo "  npm run dev"
  exit 1
fi
echo ""

echo -e "${BLUE}════════════════════════════════════════════════════${NC}"
echo -e "${GREEN}✓ All tests passed!${NC}"
echo -e "${BLUE}════════════════════════════════════════════════════${NC}"
echo ""
echo "Next steps:"
echo "  1. Check database for enrichment data:"
echo "     SELECT enrichment_status, enrichment_data FROM leads WHERE id = '${LEAD_ID}';"
echo ""
echo "  2. View enrichment in the app at:"
echo "     ${API_URL}/leads/${LEAD_ID}"
