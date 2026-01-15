---
layout: post
title: "Building RESTful APIs with Node.js and Express"
date: 2026-01-17 14:00:00 +0100
author: "Your Name"
categories: coding
tags: [nodejs, express, api, backend]
---

In this tutorial, we'll build a complete RESTful API using Node.js and Express.js. This API will handle CRUD operations for a simple blog post management system.

## What We'll Build

- Express server with proper middleware setup
- RESTful endpoints for blog posts
- Error handling and validation
- Basic authentication
- API documentation

## Project Setup

First, let's create our project structure:

```bash
mkdir node-blog-api
cd node-blog-api
npm init -y
npm install express cors helmet morgan dotenv
npm install -D nodemon
```

## Server Configuration

Create `server.js`:

```javascript
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(helmet()); // Security headers
app.use(cors()); // Enable CORS
app.use(morgan('combined')); // Logging
app.use(express.json()); // Parse JSON
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/posts', postRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    error: 'Something went wrong!',
    message: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
```

## Data Model

Let's create a simple data structure for our posts:

```javascript
// data/posts.js
let posts = [
  {
    id: 1,
    title: 'First Post',
    content: 'This is my first blog post',
    author: 'John Doe',
    createdAt: new Date('2026-01-15'),
    updatedAt: new Date('2026-01-15'),
    published: true
  },
  {
    id: 2,
    title: 'Node.js Tutorial',
    content: 'Learn Node.js from scratch',
    author: 'Jane Smith',
    createdAt: new Date('2026-01-16'),
    updatedAt: new Date('2026-01-16'),
    published: false
  }
];

let nextId = 3;

module.exports = { posts, nextId };
```

## Post Routes

Create `routes/posts.js`:

```javascript
const express = require('express');
const router = express.Router();
const { posts, nextId } = require('../data/posts');

// GET /api/posts - Get all posts
router.get('/', (req, res) => {
  const { published, author } = req.query;
  let filteredPosts = [...posts];
  
  if (published !== undefined) {
    filteredPosts = filteredPosts.filter(post => 
      post.published === (published === 'true')
    );
  }
  
  if (author) {
    filteredPosts = filteredPosts.filter(post => 
      post.author.toLowerCase().includes(author.toLowerCase())
    );
  }
  
  res.json({
    posts: filteredPosts,
    total: filteredPosts.length
  });
});

// GET /api/posts/:id - Get single post
router.get('/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const post = posts.find(p => p.id === id);
  
  if (!post) {
    return res.status(404).json({ error: 'Post not found' });
  }
  
  res.json(post);
});

// POST /api/posts - Create new post
router.post('/', (req, res) => {
  const { title, content, author, published = false } = req.body;
  
  // Validation
  if (!title || !content || !author) {
    return res.status(400).json({ 
      error: 'Missing required fields: title, content, author' 
    });
  }
  
  const newPost = {
    id: nextId++,
    title: title.trim(),
    content: content.trim(),
    author: author.trim(),
    published: Boolean(published),
    createdAt: new Date(),
    updatedAt: new Date()
  };
  
  posts.push(newPost);
  
  res.status(201).json({
    message: 'Post created successfully',
    post: newPost
  });
});

// PUT /api/posts/:id - Update post
router.put('/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const postIndex = posts.findIndex(p => p.id === id);
  
  if (postIndex === -1) {
    return res.status(404).json({ error: 'Post not found' });
  }
  
  const { title, content, author, published } = req.body;
  
  // Update only provided fields
  if (title) posts[postIndex].title = title.trim();
  if (content) posts[postIndex].content = content.trim();
  if (author) posts[postIndex].author = author.trim();
  if (published !== undefined) posts[postIndex].published = Boolean(published);
  
  posts[postIndex].updatedAt = new Date();
  
  res.json({
    message: 'Post updated successfully',
    post: posts[postIndex]
  });
});

// DELETE /api/posts/:id - Delete post
router.delete('/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const postIndex = posts.findIndex(p => p.id === id);
  
  if (postIndex === -1) {
    return res.status(404).json({ error: 'Post not found' });
  }
  
  const deletedPost = posts.splice(postIndex, 1)[0];
  
  res.json({
    message: 'Post deleted successfully',
    post: deletedPost
  });
});

module.exports = router;
```

## Testing the API

Let's test our endpoints using curl:

### Get all posts
```bash
curl http://localhost:3000/api/posts
```

### Create a new post
```bash
curl -X POST http://localhost:3000/api/posts \
  -H "Content-Type: application/json" \
  -d '{
    "title": "My New Post",
    "content": "This is amazing content",
    "author": "API Tester",
    "published": true
  }'
```

### Update a post
```bash
curl -X PUT http://localhost:3000/api/posts/1 \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Updated First Post",
    "published": true
  }'
```

### Delete a post
```bash
curl -X DELETE http://localhost:3000/api/posts/1
```

## API Documentation

Here's our complete API specification:

| Method | Endpoint | Description | Query Parameters |
|--------|----------|-------------|------------------|
| GET | `/api/posts` | Get all posts | `published`, `author` |
| GET | `/api/posts/:id` | Get single post | - |
| POST | `/api/posts` | Create new post | - |
| PUT | `/api/posts/:id` | Update post | - |
| DELETE | `/api/posts/:id` | Delete post | - |

## Next Steps

To make this production-ready, consider adding:

- Database integration (MongoDB/PostgreSQL)
- JWT authentication
- Rate limiting
- Input validation with Joi or express-validator
- API documentation with Swagger
- Unit and integration tests
- Docker containerization

This RESTful API provides a solid foundation for any Node.js application. The patterns used here can be extended to build more complex APIs while maintaining clean, maintainable code.