---
layout: default
---

<div class="home">
  <h1 class="page-heading">Posts</h1>
  
  {% if site.posts.size > 0 %}
    <ul class="post-list">
      {% for post in site.posts %}
      <li>
        <span class="post-meta">{{ post.date | date: "%b %-d, %Y" }}</span>
        <h3>
          <a class="post-link" href="{{ post.url | relative_url }}">
            {{ post.title | escape }}
          </a>
        </h3>
        {% if post.categories %}
          <small class="post-categories">
            {% for category in post.categories %}
              {{ category }}{% unless forloop.last %}, {% endunless %}
            {% endfor %}
          </small>
        {% endif %}
      </li>
      {% endfor %}
    </ul>

    <p class="rss-subscribe">subscribe <a href="{{ "/feed.xml" | relative_url }}">via RSS</a></p>
  {% else %}
    <p>No posts yet. Check back soon!</p>
  {% endif %}
</div>