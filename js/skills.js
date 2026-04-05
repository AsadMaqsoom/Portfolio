(function () {
  function escapeHtml(str) {
    return String(str ?? "")
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }

  function splitComma(str) {
    return String(str ?? "")
      .split(",")
      .map(s => s.trim())
      .filter(Boolean);
  }

  const THEMES = [
    { hoverBorder: "hover:border-blue-500/50", iconWrap: "bg-blue-500/10", iconText: "text-blue-400", badgeBg: "bg-blue-500/20", badgeText: "text-blue-400" },
    { hoverBorder: "hover:border-purple-500/50", iconWrap: "bg-purple-500/10", iconText: "text-purple-400", badgeBg: "bg-purple-500/20", badgeText: "text-purple-400" },
    { hoverBorder: "hover:border-green-500/50", iconWrap: "bg-green-500/10", iconText: "text-green-400", badgeBg: "bg-green-500/20", badgeText: "text-green-400" },
    { hoverBorder: "hover:border-cyan-500/50", iconWrap: "bg-cyan-500/10", iconText: "text-cyan-400", badgeBg: "bg-cyan-500/20", badgeText: "text-cyan-400" },
  ];

  async function loadSkills() {
    const section = document.getElementById("skills");
    if (!section) return;

    const grid = section.querySelector(".grid.grid-cols-1.md\\:grid-cols-2.lg\\:grid-cols-4.gap-6");
    if (!grid) return;

    const all = Array.isArray(window.Portfolio?.data?.skills) ? window.Portfolio.data.skills : [];
    const skills = [...all].sort((a, b) => (a.SortOrder ?? 0) - (b.SortOrder ?? 0)).slice(0, 4);

    grid.innerHTML = skills.map((s, idx) => {
      const theme = THEMES[idx] || THEMES[0];
      const tags = splitComma(s.Tags);
      return `
        <div class="group p-6 rounded-2xl bg-gray-800/30 border border-gray-700/50 ${theme.hoverBorder} transition-all duration-300 hover:transform hover:-translate-y-1">
          <div class="flex items-center justify-between mb-4">
            <div class="p-3 rounded-lg ${theme.iconWrap}">
              <i class="${escapeHtml(s.IconClass)} ${theme.iconText} text-xl"></i>
            </div>
            <span class="text-xs font-semibold px-3 py-1 rounded-full ${theme.badgeBg} ${theme.badgeText}">
              ${escapeHtml(s.LevelLabel)}
            </span>
          </div>

          <h3 class="text-xl font-bold mb-3">${escapeHtml(s.Title)}</h3>
          <p class="text-gray-400 mb-4">${escapeHtml(s.Summary)}</p>

          <div class="flex flex-wrap gap-2">
            ${tags.map(t => `<span class="px-3 py-1 rounded-full bg-gray-800 text-sm">${escapeHtml(t)}</span>`).join("")}
          </div>
        </div>
      `;
    }).join("");
  }

  window.Portfolio = window.Portfolio || {};
  window.Portfolio.loadSkills = loadSkills;
})();
