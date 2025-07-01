document.addEventListener("DOMContentLoaded", function () {
  const calendarEl = document.getElementById("calendar");

  // Тук ще запишем всички дати с постове
  const posts = [
    {% for post in site.posts %}
    {
    date: "{{ post.date | date: '%Y-%m-%d' }}",
    url: "{{ post.url }}",
    title: "{{ post.title }}"
  },
  {% endfor %}
  ];

// Преобразуваме в Map за бърз достъп
const postMap = new Map();
posts.forEach(p => postMap.set(p.date, p));

// Взимаме днешна дата
const today = new Date();
const month = today.getMonth();
const year = today.getFullYear();

renderCalendar(month, year);

function renderCalendar(month, year) {
  const date = new Date(year, month);
  const monthName = date.toLocaleString("bg-BG", { month: "long" });

  let html = `<h3>${monthName} ${year}</h3>`;
  html += "<table class='calendar'><tr>";
  const days = ["П", "В", "С", "Ч", "П", "С", "Н"];
  for (let d of days) html += `<th>${d}</th>`;
  html += "</tr><tr>";

  const firstDay = new Date(year, month, 1).getDay();
  let dayCounter = 0;
  for (let i = 1; i < (firstDay === 0 ? 7 : firstDay); i++) {
    html += "<td></td>";
    dayCounter++;
  }

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  for (let day = 1; day <= daysInMonth; day++) {
    const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    if (postMap.has(dateStr)) {
      const post = postMap.get(dateStr);
      html += `<td><a href="${post.url}" title="${post.title}">${day}</a></td>`;
    } else {
      html += `<td>${day}</td>`;
    }
    dayCounter++;
    if (dayCounter % 7 === 0) html += "</tr><tr>";
  }

  html += "</tr></table>";
  calendarEl.innerHTML = html;
}
});