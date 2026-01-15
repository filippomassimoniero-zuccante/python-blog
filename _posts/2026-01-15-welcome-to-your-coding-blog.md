---
layout: post
title: "Welcome to Your Coding Blog"
date: 2026-01-15 12:00:00 +0100
author: "Your Name"
categories: coding
tags: [welcome, jekyll, markdown]
---

Welcome to your new coding blog! This is a sample post to demonstrate how your blog will look with code blocks and images.

## Code Examples

Here's how code blocks will look:

```python
def hello_world():
    """A simple function to greet the world."""
    print("Hello, World!")
    return True

# Call the function
if __name__ == "__main__":
    hello_world()
```

```javascript
// JavaScript example with modern syntax
const fibonacci = (n) => {
  if (n <= 1) return n;
  return fibonacci(n - 1) + fibonacci(n - 2);
};

// Test the function
console.log(fibonacci(10)); // Output: 55
```

```bash
# Shell commands example
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/username/repo.git
git push -u origin main
```

## Features of This Blog

1. **Clean Design**: Minimal, typography-focused layout
2. **Code Highlighting**: Syntax highlighting for multiple languages
3. **Draft System**: Work on posts locally before publishing
4. **GitHub Pages**: Free hosting with automatic deployment

## How to Create Posts

### Draft Posts (WIP)
Create files in `_drafts/` folder:
```bash
_drafts/my-new-post.md
```

Preview locally with:
```bash
bundle exec jekyll serve --drafts
```

### Published Posts
Move to `_posts/` with date prefix:
```bash
_posts/2026-01-15-my-new-post.md
```

## Front Matter Example

```yaml
---
layout: post
title: "Your Post Title"
date: 2026-01-15 12:00:00 +0100
author: "Your Name"
categories: coding
tags: [python, tutorial, example]
---
```

Happy blogging! 🎉