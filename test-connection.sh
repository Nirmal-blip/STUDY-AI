#!/bin/bash

echo "🔍 Testing Backend Connection..."
echo ""

# Test 1: Backend Health
echo "1. Testing backend health endpoint..."
HEALTH=$(curl -s http://localhost:3000/api/health)
if [ $? -eq 0 ]; then
    echo "✅ Backend is running"
    echo "   Response: $HEALTH"
else
    echo "❌ Backend is NOT running or not accessible"
    exit 1
fi
echo ""

# Test 2: CORS
echo "2. Testing CORS configuration..."
CORS=$(curl -s -X OPTIONS http://localhost:3000/api/auth/me \
    -H "Origin: http://localhost:5173" \
    -H "Access-Control-Request-Method: GET" \
    -v 2>&1 | grep -i "access-control")
if [ ! -z "$CORS" ]; then
    echo "✅ CORS is configured"
else
    echo "⚠️  CORS headers not found"
fi
echo ""

# Test 3: Registration Endpoint
echo "3. Testing registration endpoint..."
REG_RESPONSE=$(curl -s -X POST http://localhost:3000/api/auth/register \
    -H "Content-Type: application/json" \
    -H "Origin: http://localhost:5173" \
    -d '{"name":"Test User","email":"test'$(date +%s)'@test.com","password":"test123","userType":"student"}')
if echo "$REG_RESPONSE" | grep -q "success"; then
    echo "✅ Registration endpoint works"
else
    echo "❌ Registration endpoint failed"
    echo "   Response: $REG_RESPONSE"
fi
echo ""

# Test 4: Frontend Environment
echo "4. Checking frontend environment..."
if [ -f "frontend/.env" ]; then
    BACKEND_URL=$(grep VITE_BACKEND_URL frontend/.env | cut -d '=' -f2)
    echo "✅ Frontend .env found"
    echo "   VITE_BACKEND_URL: $BACKEND_URL"
    if [ "$BACKEND_URL" = "http://localhost:3000" ]; then
        echo "✅ Backend URL is correct"
    else
        echo "⚠️  Backend URL mismatch. Expected: http://localhost:3000"
    fi
else
    echo "❌ Frontend .env not found"
fi
echo ""

# Test 5: Backend Environment
echo "5. Checking backend environment..."
if [ -f "backend/.env" ]; then
    BACKEND_PORT=$(grep "^PORT=" backend/.env | cut -d '=' -f2)
    FRONTEND_URL=$(grep "^FRONTEND_URL=" backend/.env | cut -d '=' -f2)
    echo "✅ Backend .env found"
    echo "   PORT: $BACKEND_PORT"
    echo "   FRONTEND_URL: $FRONTEND_URL"
    if [ "$FRONTEND_URL" = "http://localhost:5173" ]; then
        echo "✅ Frontend URL is correct"
    else
        echo "⚠️  Frontend URL mismatch. Expected: http://localhost:5173"
    fi
else
    echo "❌ Backend .env not found"
fi
echo ""

echo "✅ All tests completed!"
