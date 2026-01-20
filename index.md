---
layout: home
title: "Python Arcade Tutorial"
---

<h1>Tutorial su Python Arcade 🐍🎮</h1>

<ul class="post-list">
  {% for post in site.posts %}
  <a href="{{ post.url | relative_url }}" class="post-link">
    <li class="post-item">
      <h2>{{ post.title | escape }}</h2>
    </li>
  </a>
  {% endfor %}
</ul>

<footer class="site-footer">
  <p>In questo sito ho raccolto un po' di guide su Python e per la libreria Python Arcade</p>
  <p>Se trovate un bug o un refuso mandatemi una mail</p>
</footer>