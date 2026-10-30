---
layout: default
title: 文章
description: Iris Howard 的工程、研究与生活笔记。
---
<div class="home-content">
  <section class="recent-posts" aria-labelledby="recent-posts">
    <div class="posts-section-heading"><h1 id="recent-posts">Latest</h1></div>
    <div class="article-cards">
      {% for post in site.posts %}
      <article class="article-card" data-domain="{{ post.domain | escape }}" data-activity="{{ post.activity | join: ' ' | escape }}">
        <h2><a href="{{ post.url | relative_url }}">{{ post.title | escape }}</a></h2>
        <p>{{ post.description | default: post.excerpt | strip_html | truncate: 110 | escape }}</p>
        <time class="card-date" datetime="{{ post.date | date_to_xmlschema }}">{{ post.date | date: '%Y.%m.%d' }}</time>
      </article>
      {% else %}<p class="empty-state posts-empty">第一篇笔记正在路上，欢迎再来看看。</p>{% endfor %}
    </div>
    <p class="empty-state filter-empty" hidden>这个分类下暂无文章。</p>
    <nav class="posts-pagination" id="posts-pagination" aria-label="文章翻页" hidden></nav>
  </section>
</div>
