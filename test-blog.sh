#!/bin/bash

# Blog Testing Script
# Run this after installing Ruby & Jekyll

echo "🚀 Starting Blog Testing Setup..."

# Check if Ruby is installed
if ! command -v ruby &> /dev/null; then
    echo "❌ Ruby not found. Please install Ruby first:"
    echo "   Ubuntu: sudo apt-get install ruby-full build-essential zlib1g-dev"
    echo "   macOS: brew install ruby"
    echo "   Windows: https://rubyinstaller.org/"
    exit 1
fi

echo "✅ Ruby found: $(ruby --version)"

# Check if Jekyll is installed
if ! command -v jekyll &> /dev/null; then
    echo "📦 Installing Jekyll..."
    gem install jekyll bundler
fi

echo "✅ Jekyll found: $(jekyll --version)"

# Install dependencies
echo "📦 Installing Ruby dependencies..."
bundle install

echo "🔧 Starting local development server..."
echo "🌐 Your blog will be available at: http://localhost:4000"
echo "📝 Draft posts will be visible locally"
echo "🔄 Live reload enabled - changes update automatically"
echo ""
echo "Press Ctrl+C to stop the server"
echo ""

# Start Jekyll with drafts and live reload
bundle exec jekyll serve --drafts --livereload --host 0.0.0.0 --port 4000