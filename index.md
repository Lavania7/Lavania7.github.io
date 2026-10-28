---
layout: default
title: 文章
description: Iris 的工程、学习与生活笔记。在记录中整理思考，在实践中积累知识。
---
<div class="home-content" data-toc-source>
  <header class="home-header">
    <div class="eyebrow"><span class="status-dot" aria-hidden="true"></span> A PERSONAL NOTEBOOK</div>
    <h1>记录、探索，<br><span>让想法生长。</span></h1>
    <p>你好，我是 Iris。这里存放我的工程实践、学习笔记，<br class="desktop-break">以及一些值得留下的思考。</p>
    <a class="text-link" href="{{ '/about/' | relative_url }}">了解更多 {% include icon.html name='arrow-up-right' %}</a>
  </header>
  <section class="recent-posts" aria-labelledby="recent-posts">
    <div class="posts-section-heading"><h2 id="recent-posts">最新文章</h2><span>{{ site.posts.size }} 篇笔记</span></div>
    <div class="article-cards">
      {% for post in site.posts %}
      <article class="article-card">
        <div class="card-meta"><span>{{ post.categories | first | default: '笔记' | escape }}</span><time datetime="{{ post.date | date_to_xmlschema }}">{{ post.date | date: '%Y.%m.%d' }}</time></div>
        <h3><a href="{{ post.url | relative_url }}">{{ post.title | escape }}</a></h3>
        <p>{{ post.description | default: post.excerpt | strip_html | truncate: 110 | escape }}</p>
        <div class="card-footer"><div class="card-tags">{% for tag in post.tags limit: 3 %}<span># {{ tag | escape }}</span>{% endfor %}</div><a class="card-read" href="{{ post.url | relative_url }}" aria-label="阅读 {{ post.title | escape }}">{% include icon.html name='arrow-right' %}</a></div>
      </article>
      {% else %}<p class="empty-state">第一篇笔记正在路上，欢迎再来看看。</p>{% endfor %}
    </div>
  </section>
  <div class="notebook-note">{% include icon.html name='book' %}<p>不必一次想明白，先把它记录下来。</p></div>
</div>
