// js/testimonials.js
(function () {
  function escapeHtml(str) {
    return String(str ?? "")
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }

  async function loadTestimonialsIfExists() {
    const section = document.getElementById("testimonials");
    if (!section) return;
    const grid = section.querySelector(".grid") || section;
    const items = Array.isArray(window.Portfolio?.data?.testimonials) ? window.Portfolio.data.testimonials : [];
    if (!items.length) {
      grid.innerHTML = "";
      return;
    }
    grid.innerHTML = items.map(t => `
      <div class="p-6 rounded-2xl bg-gray-800/30 border border-gray-700/50">
        <div class="flex items-center gap-3 mb-4">
          <img src="${escapeHtml(t.avatarUrl || "")}" alt="${escapeHtml(t.name)}" class="w-12 h-12 rounded-full object-cover border border-gray-700/50" onerror="this.style.display='none'">
          <div>
            <div class="font-bold">${escapeHtml(t.name)}</div>
            <div class="text-gray-400 text-sm">${escapeHtml(t.position || "")}</div>
          </div>
        </div>
        <p class="text-gray-300 mb-3">${escapeHtml(t.text)}</p>
        <div class="text-yellow-300 text-sm">Rating: ${escapeHtml(t.rating)}</div>
      </div>
    `).join("");
  }

  window.Portfolio = window.Portfolio || {};
  window.Portfolio.loadTestimonialsIfExists = loadTestimonialsIfExists;
})();
