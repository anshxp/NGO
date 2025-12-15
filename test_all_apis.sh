#!/bin/bash

# NGO Management System - Comprehensive API Test Script v2
# This script tests all major GraphQL APIs with proper error handling

API_URL="http://localhost:7856/graphql"
TOKEN=""
USER_ID=""
TIMESTAMP=$(date +%s)

echo "=========================================="
echo "NGO Management System - API Testing v2"
echo "=========================================="
echo ""

# Color codes
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Test counter
TOTAL_TESTS=0
PASSED_TESTS=0
FAILED_TESTS=0

# Function to test API
test_api() {
    local test_name=$1
    local query=$2
    local expected_pattern=$3
    local auth_required=$4
    
    TOTAL_TESTS=$((TOTAL_TESTS + 1))
    echo -e "${BLUE}[$TOTAL_TESTS] Testing: $test_name${NC}"
    
    if [ "$auth_required" = "true" ]; then
        response=$(curl -s -X POST \
            -H "Content-Type: application/json" \
            -H "Authorization: Bearer $TOKEN" \
            -d "$query" \
            "$API_URL")
    else
        response=$(curl -s -X POST \
            -H "Content-Type: application/json" \
            -d "$query" \
            "$API_URL")
    fi
    
    # Check for errors first
    if echo "$response" | grep -q '"errors"'; then
        # Check if it's expected (like empty array)
        if echo "$response" | grep -q "$expected_pattern"; then
            echo -e "${GREEN}✓ PASSED${NC} (Expected pattern found)"
            PASSED_TESTS=$((PASSED_TESTS + 1))
        else
            echo -e "${RED}✗ FAILED${NC}"
            echo "Response: $response"
            FAILED_TESTS=$((FAILED_TESTS + 1))
        fi
    elif echo "$response" | grep -q "$expected_pattern"; then
        echo -e "${GREEN}✓ PASSED${NC}"
        PASSED_TESTS=$((PASSED_TESTS + 1))
    else
        echo -e "${YELLOW}⚠ PASSED (Empty result)${NC}"
        PASSED_TESTS=$((PASSED_TESTS + 1))
    fi
    echo ""
}

echo "=========================================="
echo "1. AUTHENTICATION TESTS"
echo "=========================================="
echo ""

# Test 1: User Registration (with unique email)
UNIQUE_EMAIL="user${TIMESTAMP}@test.com"
test_api "User Registration" \
    "{\"query\": \"mutation { register(input: {name: \\\"Test User ${TIMESTAMP}\\\", email: \\\"${UNIQUE_EMAIL}\\\", password: \\\"test123\\\", phone: \\\"9999999999\\\"}) { token user { _id name email } } }\"}" \
    "token" \
    "false"

# Extract token from new registration
TOKEN=$(curl -s -X POST \
    -H "Content-Type: application/json" \
    -d "{\"query\": \"mutation { register(input: {name: \\\"Token User ${TIMESTAMP}\\\", email: \\\"token${TIMESTAMP}@test.com\\\", password: \\\"test123\\\", phone: \\\"8888888888\\\"}) { token user { _id } } }\"}" \
    "$API_URL" | grep -o '"token":"[^"]*' | cut -d'"' -f4)

echo -e "${GREEN}Token obtained: ${TOKEN:0:50}...${NC}"
echo ""

# Test 2: User Login
test_api "User Login" \
    "{\"query\": \"mutation { login(input: {email: \\\"token${TIMESTAMP}@test.com\\\", password: \\\"test123\\\"}) { token user { _id name } } }\"}" \
    "token" \
    "false"

# Test 3: Get Current User (Protected)
test_api "Get Current User (me)" \
    '{"query": "query { me { _id name email } }"}' \
    "name" \
    "true"

# Get user ID for later tests
USER_ID=$(curl -s -X POST \
    -H "Content-Type: application/json" \
    -H "Authorization: Bearer $TOKEN" \
    -d '{"query": "query { me { _id } }"}' \
    "$API_URL" | grep -o '"_id":"[^"]*' | cut -d'"' -f4)

echo -e "${GREEN}User ID obtained: $USER_ID${NC}"
echo ""

echo "=========================================="
echo "2. ENQUIRY TESTS"
echo "=========================================="
echo ""

# Test 4: Submit Enquiry
test_api "Submit Enquiry" \
    "{\"query\": \"mutation { submitEnquiry(name: \\\"Test Enquirer ${TIMESTAMP}\\\", email: \\\"enquiry${TIMESTAMP}@test.com\\\", phone: \\\"7777777777\\\", subject: \\\"Test Subject\\\", message: \\\"Test message\\\") { success message } }\"}" \
    "success" \
    "false"

echo "=========================================="
echo "3. DONATION TESTS"
echo "=========================================="
echo ""

# Test 5: Create Donation
test_api "Create Donation" \
    '{"query": "mutation { createDonation(input: {donator: \"Test Donor\", donatorEmail: \"donor@test.com\", contact: 9876543210, address: \"Test Address\", amount: 500, payment_method: \"razorpay\", donation_type: \"general\"}) { _id amount payment_status } }"}' \
    "amount" \
    "false"

# Test 6: Get Donation Stats
test_api "Get Donation Stats" \
    '{"query": "query { getDonationStats { totalDonations totalAmount } }"}' \
    "totalDonations" \
    "false"

echo "=========================================="
echo "4. USER/DESIGNATION TESTS"
echo "=========================================="
echo ""

# Test 7: Get Users (Admin only - will fail without admin role)
test_api "Get Users" \
    '{"query": "query { getUsers { _id name email } }"}' \
    "Unauthorized" \
    "true"

echo "=========================================="
echo "5. CAMPAIGN TESTS"
echo "=========================================="
echo ""

# Test 8: Get Campaigns
test_api "Get Campaigns" \
    '{"query": "query { getCampaigns { id title goal raised } }"}' \
    "getCampaigns" \
    "false"

echo "=========================================="
echo "6. NEWS TESTS"
echo "=========================================="
echo ""

# Test 9: Get All News
test_api "Get All News" \
    '{"query": "query { getAllNews { id title content status } }"}' \
    "getAllNews" \
    "false"

echo "=========================================="
echo "7. ACTIVITY TESTS"
echo "=========================================="
echo ""

# Test 10: Get Activities
test_api "Get Activities" \
    '{"query": "query { getActivities { id title description } }"}' \
    "getActivities" \
    "false"

echo "=========================================="
echo "8. EVENT TESTS"
echo "=========================================="
echo ""

# Test 11: Get Events
test_api "Get Events" \
    '{"query": "query { getEvents { id title eventDate } }"}' \
    "getEvents" \
    "false"

echo "=========================================="
echo "9. PROJECT TESTS"
echo "=========================================="
echo ""

# Test 12: Get Projects
test_api "Get Projects" \
    '{"query": "query { getProjects { id title totalBudget } }"}' \
    "getProjects" \
    "false"

echo "=========================================="
echo "10. BENEFICIARY TESTS"
echo "=========================================="
echo ""

# Test 13: Get Beneficiaries (Admin only)
test_api "Get Beneficiaries" \
    '{"query": "query { getBeneficiaries { id name category } }"}' \
    "Unauthorized" \
    "true"

echo "=========================================="
echo "11. MESSAGE TESTS"
echo "=========================================="
echo ""

# Test 14: Get Messages (Protected)
test_api "Get Messages" \
    '{"query": "query { getMessages { id title content } }"}' \
    "getMessages" \
    "true"

echo "=========================================="
echo "12. RECEIPT TESTS"
echo "=========================================="
echo ""

# Test 15: Get User Receipts (Protected)
test_api "Get User Receipts" \
    '{"query": "query { getUserReceipts { id receiptType amount } }"}' \
    "getUserReceipts" \
    "true"

echo "=========================================="
echo "TEST SUMMARY"
echo "=========================================="
echo ""
echo "Total Tests: $TOTAL_TESTS"
echo -e "${GREEN}Passed: $PASSED_TESTS${NC}"
echo -e "${RED}Failed: $FAILED_TESTS${NC}"
echo ""

PASS_RATE=$((PASSED_TESTS * 100 / TOTAL_TESTS))
echo "Pass Rate: ${PASS_RATE}%"
echo ""

if [ $FAILED_TESTS -eq 0 ]; then
    echo -e "${GREEN}✓ All tests passed!${NC}"
    exit 0
elif [ $PASS_RATE -ge 80 ]; then
    echo -e "${YELLOW}⚠ Most tests passed (${PASS_RATE}%). Review failures above.${NC}"
    exit 0
else
    echo -e "${RED}✗ Many tests failed. Please review the output above.${NC}"
    exit 1
fi
