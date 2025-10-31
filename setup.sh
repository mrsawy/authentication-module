#!/bin/bash


echo "🚀 Setting up project..."

# Check if pnpm is installed
if ! command -v pnpm &> /dev/null; then
    echo "📦 Installing pnpm globally..."
    npm install -g pnpm
fi

# Generate lock files for server
echo "📝 Generating server lock files..."
cd apps/server
if [ ! -f "pnpm-lock.yaml" ]; then
    echo "  Creating pnpm-lock.yaml for server..."
    pnpm install
else
    echo "  ✓ pnpm-lock.yaml already exists for server"
fi
cd ../..

# Generate lock files for client
echo "📝 Generating client lock files..."
cd apps/client
if [ ! -f "pnpm-lock.yaml" ]; then
    echo "  Creating pnpm-lock.yaml for client..."
    pnpm install
else
    echo "  ✓ pnpm-lock.yaml already exists for client"
fi
cd ../..

echo "✅ Setup complete! You can now run: docker-compose up"