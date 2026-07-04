#!/bin/bash

# Script to serve Jekyll site locally
# Usage: ./serve.sh

set -e

echo "🚀 Starting local Jekyll server..."

# Check if Ruby is installed
if ! command -v ruby &> /dev/null; then
    echo "❌ Ruby is not installed. Please install Ruby first."
    echo "   Install with: brew install ruby"
    exit 1
fi

# Check if Bundler is installed
if ! command -v bundle &> /dev/null; then
    echo "📦 Bundler not found. Installing..."
    gem install bundler
fi
t

# Start Jekyll server
echo "✨ Starting Jekyll server at http://localhost:4000"
echo "   Press Ctrl+C to stop the server"
echo ""

bundle exec jekyll serve --livereload --drafts

# Alternative options (uncomment to use):
# bundle exec jekyll serve --livereload --drafts --incremental
# bundle exec jekyll serve --livereload --drafts --port 4001

