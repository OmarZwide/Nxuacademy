#!/bin/bash

# Deployment verification script
echo "Verifying deployment..."

# Check required files
echo "Checking required files..."
REQUIRED_FILES=(
    "dist/public/index.html"
    "server/index.ts"
    "db/schema.ts"
    "migrations"
)

for file in "${REQUIRED_FILES[@]}"; do
    if [ -e "$file" ]; then
        echo "✓ Found $file"
    else
        echo "✗ Missing $file"
        exit 1
    fi
done

# Verify server configuration
if [ -f "server/index.ts" ]; then
    echo "✓ Server entry point exists"
else
    echo "✗ Missing server entry point"
    exit 1
fi

echo "Verification complete. All required files present."
echo "Ready for deployment to Vercel"