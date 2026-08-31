---
layout: default
title: Home
---

# Home

Engineering, robotics, embedded systems and research.

## Recent Posts

{% for post in site.posts limit:5 %}

### [{{ post.title }}]({{ post.url | relative_url }})1

{% endfor %}