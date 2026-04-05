// js/experience.js
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

  function badgeHtml(isCurrent) {
    if (isCurrent) {
      return `
        <span class="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wide
                     text-emerald-100 bg-emerald-500/15 border border-emerald-500/30 shadow-[0_0_10px_rgba(16,185,129,0.25)]">
          <i class="fas fa-bolt text-emerald-300"></i> Current
        </span>
      `;
    }
    return `
      <span class="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wide
                   text-gray-200 bg-white/5 border border-white/10 shadow-sm">
        <i class="fas fa-clock text-gray-400"></i> Past
      </span>
    `;
  }

  function buildExperienceItem(e, index) {
    const highlights = splitComma(String(e.Highlights ?? e.highlights ?? "").replaceAll("
", ","));
    const isRight = index % 2 === 0;
    const wrapperClass = isRight
      ? "md:w-1/2 ml-0 md:ml-auto md:pl-12"
      : "md:w-1/2 ml-0 md:mr-auto md:pr-12";

    return `
      <div class="group mb-12 relative">
        <div
          class="absolute top-6 left-0 md:left-1/2 md:-translate-x-1/2
                 w-4 h-4 md:w-5 md:h-5 rounded-full
                 bg-gradient-to-br from-purple-500 to-sky-400
                 border-4 border-gray-900
                 shadow-[0_0_0_4px_rgba(139,92,246,0.15),0_0_0_8px_rgba(139,92,246,0.08),0_0_40px_rgba(139,92,246,0.4)]
                 transition-transform duration-300 group-hover:scale-125">
        </div>

        <div class="${wrapperClass}">
          <div
            class="relative p-7 rounded-2xl
                   bg-gradient-to-br from-white/5 to-white/0
                   border border-white/10
                   backdrop-blur-xl
                   shadow-[0_12px_32px_rgba(0,0,0,0.4)]
                   transition-all duration-300
                   group-hover:-translate-y-2 group-hover:border-purple-500/40
                   group-hover:shadow-[0_12px_32px_rgba(0,0,0,0.4),0_20px_40px_rgba(0,0,0,0.5),0_0_40px_rgba(139,92,246,0.15)]
                   overflow-hidden">
            <div class="pointer-events-none absolute inset-0 opacity-50 group-hover:opacity-80 transition-opacity duration-500
                        bg-[radial-gradient(600px_250px_at_20%_10%,rgba(139,92,246,0.12),transparent_70%)]">
            </div>
            <div class="pointer-events-none absolute top-0 left-0 right-0 h-px
                        bg-gradient-to-r from-transparent via-purple-500/30 to-transparent">
            </div>
            <div class="relative">
              <div class="flex flex-col lg:flex-row justify-between items-start gap-3 mb-4 pb-4 border-b border-white/10">
                <div>
                  <div class="text-xl font-bold leading-snug text-gray-100">${escapeHtml(e.Role ?? e.role)}</div>
                  <div class="mt-1 font-semibold text-sky-300/95">${escapeHtml(e.Company ?? e.company)}</div>
                </div>
                ${badgeHtml(Boolean(e.IsCurrent ?? e.isCurrent))}
              </div>
              <div class="mb-4">
                <span class="inline-flex items-center gap-2 px-4 py-1.5 rounded-full
                         bg-white/5 border border-white/10 text-gray-200 text-sm font-medium
                         shadow-[0_8px_20px_rgba(0,0,0,0.25)]">
                  <i class="fas fa-calendar-alt text-gray-300"></i>
                  ${escapeHtml(e.DurationLabel ?? e.durationLabel)}
                </span>
              </div>
              <div class="grid gap-3">
                ${highlights.map(h => `
                  <div class="flex gap-3 items-start text-gray-300 leading-relaxed text-[0.95rem] transition
                              group-hover:text-gray-100 group-hover:translate-x-1">
                    <span class="mt-0.5 w-5 h-5 rounded-md inline-flex items-center justify-center
                             bg-emerald-500/15 border border-emerald-500/25 text-emerald-200
                             shadow-[0_4px_10px_rgba(16,185,129,0.15)]
                             transition group-hover:scale-110">
                      <i class="fas fa-check text-xs"></i>
                    </span>
                    <span>${escapeHtml(h)}</span>
                  </div>
                `).join("")}
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  async function loadExperience() {
    const expSection = document.getElementById("experience");
    if (!expSection) return;
    const timeline = expSection.querySelector(".relative");
    if (!timeline) return;
    const line = timeline.querySelector(".absolute");

    try {
      const items = Array.isArray(window.Portfolio?.data?.experience) ? window.Portfolio.data.experience : [];
      timeline.innerHTML = "";
      if (line) timeline.appendChild(line);
      const html = items
        .sort((a, b) => {
          const cur = Number(!!(b.IsCurrent ?? b.isCurrent)) - Number(!!(a.IsCurrent ?? a.isCurrent));
          if (cur !== 0) return cur;
          return Number(a.SortOrder ?? a.sortOrder ?? 0) - Number(b.SortOrder ?? b.sortOrder ?? 0);
        })
        .map(buildExperienceItem)
        .join("");
      timeline.insertAdjacentHTML("beforeend", html);
    } catch (e) {
      console.error(e);
      timeline.innerHTML = `<div class="p-8 rounded-2xl bg-gray-800/30 border border-red-500/25 text-center"><div class="text-gray-300">Failed to load experience.</div></div>`;
    }
  }

  window.Portfolio = window.Portfolio || {};
  window.Portfolio.loadExperience = loadExperience;
})();
