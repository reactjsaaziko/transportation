#!/bin/bash

echo "🧪 Testing Vehicle API..."
echo ""

# Your JWT token
TOKEN="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY5NTYzMGVjODQ4MmQ1YTgwZjdkZDEyNCIsImVtYWlsIjoidHJhbnNwb3J0LnRlc3RAYWF6aWtvLmNvbSIsInVzZXJuYW1lIjoidHJhbnNwb3J0dGVzdCIsInJvbGUiOiJzZXJ2aWNlLXByb3ZpZGVyIiwiaWF0IjoxNzY3MjU4MjY0LCJleHAiOjE3NjcyNjE4NjR9.e9Ubb8VPeznQFx4ckxYS3mkhVJ7Vnu9yotpelvE1_l0"

# Generate random vehicle number
RANDOM_NUM=$((RANDOM % 10000))
VEHICLE_NUM="TEST-VEH-${RANDOM_NUM}"

echo "📝 Creating vehicle: $VEHICLE_NUM"
echo ""

# Make API call
RESPONSE=$(curl -s -X POST http://localhost:3030/service-provider/vehicles \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d "{
    \"serviceProviderId\": \"695630ec8482d5a80f7dd124\",
    \"transportationMode\": \"Road\",
    \"vehicleType\": \"TATA ACE\",
    \"vehicleModel\": \"TATA 22 FEET\",
    \"specifications\": {
      \"length\": {\"value\": 13600, \"unit\": \"Ft\"},
      \"width\": {\"value\": 2500, \"unit\": \"Ft\"},
      \"height\": {\"value\": 2650, \"unit\": \"Ft\"},
      \"maxWeight\": {\"value\": 2650, \"unit\": \"Ft\"}
    },
    \"vehicleImage\": \"/svg/t11.svg\",
    \"vehicleNumber\": \"$VEHICLE_NUM\",
    \"pricing\": {
      \"loadingUnloadingFreeTime\": {\"time\": 2, \"unit\": \"Hour\"},
      \"afterFreeTime\": {\"price\": 50, \"unit\": \"Hour\"},
      \"minimumDistance\": {\"value\": 10, \"unit\": \"Km\"},
      \"rateType\": \"Per Km\",
      \"baseRate\": 50
    },
    \"availability\": \"Available\",
    \"status\": \"pending\"
  }")

# Check response
echo "📊 Response:"
echo "$RESPONSE" | jq '.'

# Check if successful
if echo "$RESPONSE" | jq -e '.success == true' > /dev/null 2>&1; then
  echo ""
  echo "✅ SUCCESS! Vehicle created successfully!"
  echo "🎉 Vehicle ID: $(echo "$RESPONSE" | jq -r '.data._id')"
  echo "🚗 Vehicle Number: $(echo "$RESPONSE" | jq -r '.data.vehicleNumber')"
else
  echo ""
  echo "❌ FAILED! Error:"
  echo "$RESPONSE" | jq -r '.error // .message'
fi
