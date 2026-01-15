# Blog Development Workflow Guide

## Quick Start

### Local Development
```bash
# Install dependencies
bundle install

# Start local server with drafts
bundle exec jekyll serve --drafts --livereload

# Open http://localhost:4000 in your browser
```

### Publishing Workflow
1. **Create Draft**: Write posts in `_drafts/` folder
2. **Preview Locally**: `bundle exec jekyll serve --drafts`
3. **Publish**: Move to `_posts/` with date prefix
4. **Deploy**: Push to GitHub - automatic deployment!

## File Structure

```
BlogProject/
├── _config.yml          # Jekyll configuration
├── Gemfile              # Ruby dependencies
├── _layouts/            # Page templates
│   ├── default.html     # Base layout
│   └── post.html        # Post layout
├── _posts/              # Published posts (date-prefixed)
├── _drafts/             # Work in progress posts
├── assets/              # Static files
│   ├── css/            # Stylesheets
│   ├── js/             # JavaScript
│   ├── images/         # Images organized by type
│   └── README.md       # Asset organization guide
├── about.md             # About page
├── index.md             # Homepage
└── .github/workflows/   # GitHub Pages deployment
```

## Creating Content

### New Post Structure
```yaml
---
layout: post
title: "Your Post Title"
date: YYYY-MM-DD HH:MM:SS +ZZZZ
author: "Your Name"
categories: coding
tags: [tag1, tag2, tag3]
---

Your post content in Markdown...
```

### Code Blocks
```javascript
// Code blocks get automatic syntax highlighting
function hello() {
  console.log("Hello, World!");
}
```

### Images
```markdown
![Alt text]({{ '/assets/images/posts/2026/2026-01-15-image-name.png' | relative_url }})
```

## GitHub Pages Setup

1. **Create Repository**: `yourusername.github.io`
2. **Enable Pages**: Settings → Pages → Source: GitHub Actions
3. **Push Code**: Automatic deployment on main branch push
4. **Visit Site**: `https://yourusername.github.io`

## Commands

```bash
# Development with drafts
bundle exec jekyll serve --drafts --livereload

# Production build
bundle exec jekyll build

# Clean build files
bundle exec jekyll clean

# Check for issues
bundle exec jekyll doctor
```

## Customization

### Site Settings (_config.yml)
- Update `title`, `description`, `url`
- Set `author` and social links
- Adjust `paginate` settings

### Styling
- Edit `assets/css/style.css` for main styles
- Modify `assets/css/syntax.css` for code highlighting
- Responsive design included

## Best Practices

1. **Use Drafts**: Always write in `_drafts/` first
2. **Local Testing**: Preview before publishing
3. **Image Optimization**: Keep images under 500KB
4. **Front Matter**: Complete metadata for SEO
5. **Commit Often**: Version control your content

## Troubleshooting

### Common Issues
- **Build Failures**: Check Markdown syntax and front matter
- **Missing Styles**: Verify CSS files in `_site/assets/`
- **404 Errors**: Check permalink settings and file names
- **Slow Loading**: Optimize images and enable compression

### Getting Help
- Jekyll Docs: https://jekyllrb.com/docs/
- GitHub Pages: https://pages.github.com/
- Markdown Guide: https://www.markdownguide.org/

Happy blogging! 🚀