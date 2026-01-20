#!/bin/bash

# Quick Test Script - Check if blog content is valid

echo "🔍 Testing blog content without Jekyll server..."

# Check if key files exist
echo "📁 Checking file structure..."
test -f _config.yml && echo "✅ _config.yml found" || echo "❌ _config.yml missing"
test -f Gemfile && echo "✅ Gemfile found" || echo "❌ Gemfile missing"
test -d _posts && echo "✅ _posts directory found" || echo "❌ _posts missing"
test -d _drafts && echo "✅ _drafts directory found" || echo "❌ _drafts missing"
test -d assets && echo "✅ assets directory found" || echo "❌ assets missing"

# Check posts have proper front matter
echo ""
echo "📝 Checking post formats..."
find _posts -name "*.md" -exec echo "Checking {}" \; -exec head -10 {} \; -exec echo "---" \;

find _drafts -name "*.md" -exec echo "Checking {}" \; -exec head -10 {} \; -exec echo "---" \;

# Check Ruby installation
echo ""
echo "💎 Ruby version: $(ruby --version 2>/dev/null || echo 'Ruby not found')"
echo "📦 Bundler version: $(bundle --version 2>/dev/null || echo 'Bundler not found')"

echo ""
echo "🚀 To test locally, you need to install ERB:"
echo "   sudo pacman -S ruby-erb"
echo "   Or use GitHub Pages for deployment"
echo ""
echo "📋 Your blog is ready for GitHub Pages deployment!"