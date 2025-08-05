#!/bin/bash
# Build script for Render deployment

echo "Installing dependencies..."
npm ci

echo "Building frontend with Vite..."
npx vite build

echo "Building backend with TypeScript and esbuild..."
npx esbuild server/index.ts --platform=node --packages=external --bundle --format=esm --outdir=dist

echo "Build completed successfully!"