---
title: "Архив по дати"
layout: default
permalink: /archive/
author_profile: true
---
<div class="text-center">
<h2>Архив по дати</h2>
<hr/>

{% for post in site.posts %}
  <li>
    <strong>{{ post.date | date: "%d.%m.%Y" }}</strong> — 
    <a href="{{ post.url | absolute_url }}">{{ post.title }}</a> 
  </li><br/>
{% endfor %}
</div>