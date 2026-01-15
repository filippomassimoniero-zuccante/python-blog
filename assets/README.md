# Blog Asset Organization Guide

## Directory Structure

```
assets/
├── css/                 # Stylesheets
│   ├── style.css       # Main styles
│   └── syntax.css      # Code highlighting
├── js/                  # JavaScript files
│   └── scale.fix.js    # Utility scripts
├── images/             # All images
│   ├── posts/          # Images for published posts
│   │   └── 2026/       # Organized by year
│   ├── drafts/         # Images for draft posts
│   └── thumbnails/     # Small preview images
└── media/              # Other media (videos, etc.)
    └── gifs/           # Animated GIFs
```

## Image Naming Conventions

### For Published Posts:
- Format: `YYYY-MM-DD-post-name-descriptor.ext`
- Example: `2026-01-15-python-decorators-flowchart.png`
- Location: `assets/images/posts/YYYY/`

### For Draft Posts:
- Format: `draft-name-descriptor.ext`
- Example: `react-hooks-diagram.png`
- Location: `assets/images/drafts/`

### Thumbnails:
- Format: `thumb-post-name.ext`
- Size: 300x200px recommended
- Location: `assets/images/thumbnails/`

## How to Reference Images in Markdown

### In Published Posts:
```markdown
![Alt text]({{ '/assets/images/posts/2026/2026-01-15-python-decorators-flowchart.png' | relative_url }})
```

### In Draft Posts (local preview):
```markdown
![Alt text]({{ '/assets/images/drafts/react-hooks-diagram.png' | relative_url }})
```

### When Moving Draft to Published:
1. Move images from `assets/images/drafts/` to `assets/images/posts/YYYY/`
2. Rename images with date prefix
3. Update image paths in markdown
4. Move post to `_posts/` with date prefix

## Image Optimization Tips

- Use WebP format for better compression
- Keep images under 500KB for faster loading
- Use responsive images with srcset when possible
- Add alt text for accessibility

## Automated Asset Management

Consider adding this script to your workflow:

```bash
#!/bin/bash
# publish-draft.sh
POST_NAME=$1
DATE=$(date +%Y-%m-%d)

# Move images
mkdir -p assets/images/posts/$(date +%Y)
mv assets/images/drafts/${POST_NAME}* assets/images/posts/$(date +%Y)/

# Rename images with date
for file in assets/images/posts/$(date +%Y)/${POST_NAME}*; do
    mv "$file" "${file/${POST_NAME}/${DATE}-${POST_NAME}}"
done

# Move post
mv _drafts/${POST_NAME}.md _posts/${DATE}-${POST_NAME}.md
```

This organization makes it easy to:
- Keep drafts separate from published content
- Maintain clean asset structure
- Move from draft to published seamlessly
- Scale your blog as it grows