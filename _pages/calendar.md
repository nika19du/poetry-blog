---
title: "Календар"
layout: default
permalink: /calendar/
---

<div class="calendar-wrapper">
  <div id="calendar-nav">
    <button id="prevMonth">‹</button>
    <span id="calendar-title"></span>
    <button id="nextMonth">›</button>
  </div>
  <div id="calendar-grid"></div>
  <div id="post-preview">
    <h3>Детайли за деня</h3>
    <ul id="preview-list"></ul>
  </div>
</div>

<link rel="stylesheet" href="{{ site.baseurl }}/assets/css/calendar.css">

<script>
document.addEventListener("DOMContentLoaded", function () {
  const siteBaseUrl = "{{ site.baseurl }}";
  const posts = [
    {% for post in site.posts %}
    {
      date: "{{ post.date | date: '%Y-%m-%d' }}",
      url: "{{ post.url }}",
      title: {{ post.title | jsonify }},
      excerpt: {{ post.excerpt | strip_html | truncate: 100 | jsonify }},
      tags: {{ post.tags | jsonify }}
    },
    {% endfor %}
  ];

  const postMap = {};
  posts.forEach(p => {
    if (!postMap[p.date]) postMap[p.date] = [];
    postMap[p.date].push(p);
  });

  let currentMonth = new Date().getMonth();
  let currentYear = new Date().getFullYear();

  const calendarTitle = document.getElementById("calendar-title");
  const grid = document.getElementById("calendar-grid");
  const previewList = document.getElementById("preview-list");

  function renderCalendar(month, year) {
    const first = new Date(year, month, 1);
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const startDay = first.getDay() || 7;

    calendarTitle.textContent = first.toLocaleString("bg-BG", { month: "long", year: "numeric" });

    let html = "<table class='calendar'><tr>";
    const days = ["П", "В", "С", "Ч", "П", "С", "Н"];
    for (let d of days) html += `<th>${d}</th>`;
    html += "</tr><tr>";

    let dayCounter = 0;
    for (let i = 1; i < startDay; i++) {
      html += "<td></td>";
      dayCounter++;
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
      const postsToday = postMap[dateStr] || [];
      let cell = `<td data-date="${dateStr}"><strong>${day}</strong>`;
      postsToday.forEach(p => {
        cell += `<br><span class="post-title">${p.title}</span>`;
      });
      cell += `</td>`;
      html += cell;
      dayCounter++;
      if (dayCounter % 7 === 0) html += "</tr><tr>";
    }
    html += "</tr></table>";
    grid.innerHTML = html;

    document.querySelectorAll("td[data-date]").forEach(td => {
      td.addEventListener("click", e => {
        const date = td.dataset.date;
        const posts = postMap[date] || [];
        previewList.innerHTML = "";
        posts.forEach(p => {
          const li = document.createElement("li");
          const a = document.createElement("a");
          a.href = `${siteBaseUrl}${p.url}`;
          a.textContent = p.title;
          li.appendChild(a);

          const tags = document.createElement("span");
          tags.className = "tags";
          tags.textContent = p.tags && p.tags.length ? `#${p.tags.join(" #")}` : "Без тагове";
          li.appendChild(tags);

          previewList.appendChild(li);
        });
      });
    });
  }

  renderCalendar(currentMonth, currentYear);

  document.getElementById("prevMonth").addEventListener("click", () => {
    currentMonth--;
    if (currentMonth < 0) {
      currentMonth = 11;
      currentYear--;
    }
    renderCalendar(currentMonth, currentYear);
  });

  document.getElementById("nextMonth").addEventListener("click", () => {
    currentMonth++;
    if (currentMonth > 11) {
      currentMonth = 0;
      currentYear++;
    }
    renderCalendar(currentMonth, currentYear);
  });
});
</script>