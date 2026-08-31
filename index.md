---
layout: default
title: Home
---

# Home

Engineering, robotics, embedded systems and research.

## Recent Posts

{% for post in site.posts limit:5 %}

### [{{ post.title }}]({{ post.url | relative_url }})

{{ post.date | date: "%Y-%m-%d" }}

{{ post.excerpt }}

{% endfor %}