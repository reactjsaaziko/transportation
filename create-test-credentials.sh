#!/bin/bash

# Create Test Service Provider Credentials
# This script creates a test account directly through the auth service

echo "🔄 Creating test service provider account..."
echo ""

# Test credentials
EMAIL="transport.test@aaziko.com"
USERNAME="test_transport"
PASSWORD="Test123!@#"

echo "📧 Email: $EMAIL"
echo "👤 Username: $USERNAME"
echo "🔐 Password: $PASSWORD"
echo ""

# Create account through auth service
RESPONSE=$(curl -s -X POST http://localhost:3030/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d "{
    \"username\": \"$USERNAME\",
    \"email\": \"$EMAIL\",
    \"password\": \"$PASSWORD\",
    \"role\": \"service-provider\",
    \"companyName\": \"Test Transport Company\",
    \"contactNumber\": \"+1234567890\"
  }")

echo "📡 API Response:"
echo "$RESPONSE" | jq '.' 2>/dev/null || echo "$RESPONSE"
echo ""

# Check if successful
if echo "$RESPONSE" | grep -q '"success":true'; then
  echo "✅ SUCCESS! Account created successfully!"
  echo ""
  echo "═══════════════════════════════════════════════════════"
  echo "🔑 LOGIN CREDENTIALS"
  echo "═══════════════════════════════════════════════════════"
  echo ""
  echo "📧 Email:    $EMAIL"
  echo "🔐 Password: $PASSWORD"
  echo ""
  echo "═══════════════════════════════════════════════════════"
  echo ""
  echo "🌐 Login URL: http://localhost:3070/login"
  echo ""
  echo "💡 TIP: Copy the email and password above to login!"
  echo ""
  
  # Save to file
  cat > test-credentials.txt << EOF
═══════════════════════════════════════════════════════
TEST SERVICE PROVIDER LOGIN CREDENTIALS
═══════════════════════════════════════════════════════

Email:    $EMAIL
Password: $PASSWORD

Login URL: http://localhost:3070/login

Created: $(date)
═══════════════════════════════════════════════════════
EOF
  
  echo "💾 Credentials saved to: test-credentials.txt"
  echo ""
  
elif echo "$RESPONSE" | grep -q 'already exists\|EMAIL_EXISTS\|USERNAME_EXISTS'; then
  echo "⚠️  Account already exists!"
  echo ""
  echo "You can try logging in with these credentials:"
  echo ""
  echo "📧 Email:    $EMAIL"
  echo "🔐 Password: $PASSWORD"
  echo ""
  echo "🌐 Login URL: http://localhost:3070/login"
  echo ""
  echo "💡 If you forgot the password, you may need to reset it or create a new account with a different email."
  echo ""
else
  echo "❌ Failed to create account"
  echo ""
  echo "Possible reasons:"
  echo "1. API Gateway is not running"
  echo "2. Auth service is not available"
  echo "3. Database connection issue"
  echo ""
  echo "🔧 Try starting the backend services:"
  echo "   cd /home/aaziko/Documents/1tb-hd/aaziko/common-backend"
  echo "   docker compose up api-gateway -d"
  echo ""
fi
