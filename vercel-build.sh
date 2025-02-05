#!/bin/bash

# Exit on error
set -e

echo "Starting Vercel build process..."

# Verify environment
if [ -z "$DATABASE_URL" ]; then
  echo "Error: DATABASE_URL environment variable is required"
  exit 1
fi

# Build frontend and backend
echo "Building application..."
npm run build

# Run database migrations
echo "Running database migrations..."
npx drizzle-kit push

echo "Build process completed successfully"