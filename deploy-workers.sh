#!/bin/bash

# Cloudflare Workers Deployment Script for Zenow Learn Admin
# This script builds and deploys the Next.js app to Cloudflare Workers

echo "🚀 Starting Cloudflare Workers deployment..."

# Check if wrangler is installed
if ! command -v wrangler &> /dev/null; then
    echo "❌ Wrangler CLI not found. Installing..."
    npm install -g wrangler
fi

# Build the application for Workers
echo "📦 Building application for Cloudflare Workers..."
npm run build:workers

# Check if build was successful
if [ $? -ne 0 ]; then
    echo "❌ Build failed. Exiting..."
    exit 1
fi

echo "✅ Build completed successfully!"

# Deploy to Cloudflare Workers
echo "🚀 Deploying to Cloudflare Workers..."
wrangler deploy

if [ $? -eq 0 ]; then
    echo "🎉 Deployment successful!"
    echo "Your app is now live on Cloudflare Workers!"
else
    echo "❌ Deployment failed!"
    exit 1
fi
