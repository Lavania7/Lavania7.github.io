---
layout: default
title: Home
---

# Iris

Engineering, robotics, embedded systems and research.
This is my local test version.test

## Recent Posts

{% for post in site.posts limit:5 %}

### [{{ post.title }}]({{ post.url | relative_url }})

{{ post.date | date: "%Y-%m-%d" }}

{{ post.excerpt }}

{% endfor %}