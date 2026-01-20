# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Jekyll-based blog focused on Python Arcade game development tutorials. It uses GitHub Pages for hosting with automatic deployment via GitHub Actions.

## Common Commands

```bash
# Install dependencies
bundle install

# Development server with drafts and live reload
bundle exec jekyll serve --drafts --livereload

# Production build
bundle exec jekyll build

# Clean build artifacts
bundle exec jekyll clean

# Diagnose configuration issues
bundle exec jekyll doctor
```

The site runs at http://localhost:4000 during development.

## Architecture

### Layout Hierarchy
- `_layouts/default.html` - Base HTML structure, includes CSS and navigation
- `_layouts/post.html` - Extends default, adds post metadata (date, author, categories)
- `_layouts/home.html` - Homepage layout for post listings

### Content Organization
- `_posts/` - Published posts with `YYYY-MM-DD-title.md` naming convention
- `_drafts/` - Unpublished work-in-progress posts (no date prefix needed)
- `assets/css/custom-style.css` - Main site styles
- `assets/css/syntax.css` - Code syntax highlighting

### Configuration
- `_config.yml` - Site metadata, plugins (jekyll-feed, jekyll-sitemap, jekyll-seo-tag), kramdown/rouge settings
- `Gemfile` - Uses `github-pages` gem for GitHub Pages compatibility

### Deployment
- `.github/workflows/jekyll.yml` - Builds on push to main, deploys to GitHub Pages
- Deployment only triggers on `main` branch; PRs run build verification only

## Post Front Matter

```yaml
---
layout: post
title: "Post Title"
date: YYYY-MM-DD HH:MM:SS +ZZZZ
author: "Author Name"
categories: coding
tags: [tag1, tag2]
---
```

Default values for posts are set in `_config.yml` under `defaults`.
