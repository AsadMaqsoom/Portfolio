/* global APP_CONFIG */
(function () {
  const state = { work: [], edu: [] };

  function escapeHtml(str) {
    return String(str ?? "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  // Date label from backend ko prefer karo
  function rangeText(item) {
    const label = String(item?.durationLabel || "").trim();
    if (label) return escapeHtml(label);

    const s = escapeHtml(item?.startYear || "");
    const e = escapeHtml(item?.isCurrent ? "Present" : (item?.endYear || ""));

    if (!s && !e) return "";
    if (s && e) return `${s} - ${e}`;
    return s || e;
  }

  // "2021 - Present", "2019-2021", "2024"
  function deriveYearsFromLabel(label) {
    const t = (label || "").trim();
    if (!t) return { startYear: "", endYear: "" };

    const norm = t.replace(/[–—]/g, "-").replace(/\s+/g, " ").trim();

    const mRange = norm.match(/(\d{4})\s*-\s*(\d{4}|present)/i);
    if (mRange) {
      return {
        startYear: mRange[1],
        endYear: /present/i.test(mRange[2]) ? "" : mRange[2]
      };
    }

    const mYear = norm.match(/(\d{4})/);
    if (mYear) {
      return { startYear: mYear[1], endYear: "" };
    }

    return { startYear: "", endYear: "" };
  }

  function normalizeItem(raw) {
    const r = raw || {};

    const title = r.title ?? r.role ?? r.degree ?? r.Title ?? "";
    const organization = r.organization ?? r.company ?? r.institute ?? r.Institute ?? "";

    const durationLabel = String(r.durationLabel ?? r.DurationLabel ?? "").trim();
    const derived = deriveYearsFromLabel(durationLabel);

    const isCurrent = Boolean(r.isCurrent ?? r.IsCurrent);

    let highlightsArr = [];
    const h = r.highlights ?? r.Highlights ?? r.highlightsText ?? "";

    if (Array.isArray(h)) {
      highlightsArr = h;
    } else if (typeof h === "string") {
      highlightsArr = h.split(/\r?\n|;/g);
    }

    highlightsArr = highlightsArr.map(x => String(x).trim()).filter(Boolean);

    return {
      title,
      organization,
      isCurrent,
      startYear: String(r.startYear ?? r.StartYear ?? derived.startYear ?? ""),
      endYear: String(r.endYear ?? r.EndYear ?? derived.endYear ?? ""),
      durationLabel,
      locationMode: String(r.locationMode ?? r.mode ?? r.LocationMode ?? ""),
      location: String(r.location ?? r.Location ?? ""),
      highlights: highlightsArr,
      sortOrder: Number(r.sortOrder ?? r.SortOrder ?? 0)
    };
  }

  // Updated:
  // Date hamesha show hogi agar available ho
  // Aur current item me Current chip bhi alag show hogi
  function badgeHtml(item) {
    const range = rangeText(item);

    const dateBadge = range
      ? `
        <span class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 text-blue-300 text-sm font-semibold border border-blue-500/20 whitespace-nowrap">
          <i class="fas fa-calendar text-blue-300"></i>
          ${range}
        </span>`
      : "";

    const currentBadge = item?.isCurrent
      ? `
        <span class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-300 text-sm font-semibold border border-emerald-500/20 whitespace-nowrap">
          <span class="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          Current
        </span>`
      : "";

    if (!dateBadge && !currentBadge) return "";

    return `
      <div class="flex flex-wrap items-center justify-end gap-2">
        ${dateBadge}
        ${currentBadge}
      </div>
    `;
  }

  function metaRowHtml(item) {
    const locationMode = escapeHtml(item.locationMode || "");
    const locationLabel = escapeHtml(item.location || "");

    const modeChip = locationMode
      ? `<span class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gray-900/60 border border-gray-700/50">
          <i class="fas ${locationMode.toLowerCase().includes("remote") ? "fa-globe" : "fa-location-dot"} text-gray-400"></i>
          ${locationMode}
        </span>`
      : "";

    const locChip = locationLabel
      ? `<span class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gray-900/60 border border-gray-700/50">
          <i class="fas fa-location-dot text-gray-400"></i>
          ${locationLabel}
        </span>`
      : "";

    const chips = [modeChip, locChip].filter(Boolean).join("");
    if (!chips) return "";

    return `<div class="flex flex-wrap items-center gap-3 mb-5 text-sm text-gray-300">${chips}</div>`;
  }

  function highlightsHtml(highlights) {
    const items = Array.isArray(highlights) ? highlights : [];
    if (!items.length) return "";

    const dots = ["bg-purple-400", "bg-blue-400", "bg-cyan-400", "bg-emerald-400"];

    return `
      <ul class="space-y-3 text-gray-200/90">
        ${items.map((h, idx) => `
          <li class="flex gap-3">
            <span class="mt-1.5 w-2 h-2 rounded-full ${dots[idx % dots.length]}"></span>
            <span>${escapeHtml(h)}</span>
          </li>
        `).join("")}
      </ul>
    `;
  }

  function timelineItemHtml(rawItem, index, isWork) {
    const item = normalizeItem(rawItem);
    const rightOnDesktop = index % 2 === 0;

    const title = escapeHtml(item.title || "");
    const org = escapeHtml(item.organization || "");

    const accentLine = isWork
      ? `<div class="h-px bg-gradient-to-r from-purple-500/0 via-purple-500/35 to-blue-500/0"></div>`
      : `<div class="h-px bg-gradient-to-r from-blue-500/0 via-blue-500/35 to-cyan-500/0"></div>`;

    const hoverBorder = rightOnDesktop ? "hover:border-purple-500/50" : "hover:border-blue-500/50";

    const card = `
      <div class="relative">
        <div class="group rounded-2xl bg-gray-800/30 border border-gray-700/50 ${hoverBorder} transition-all duration-300 shadow-[0_10px_30px_-20px_rgba(0,0,0,0.6)]">
          <div class="p-6">
            <div class="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-4">
              <div class="min-w-0">
                <h3 class="text-xl font-bold leading-snug">${title}</h3>
                ${org ? `<p class="text-gray-400 mt-1">${org}</p>` : ""}
              </div>
              ${badgeHtml(item)}
            </div>

            ${metaRowHtml(item)}
            ${highlightsHtml(item.highlights)}
          </div>
          ${accentLine}
        </div>
      </div>
    `;

    if (rightOnDesktop) {
      return `
        <div class="relative pl-14 md:pl-0 md:grid md:grid-cols-2 md:gap-12 mb-10">
          <div class="hidden md:block"></div>
          ${card}
        </div>`;
    }

    return `
      <div class="relative pl-14 md:pl-0 md:grid md:grid-cols-2 md:gap-12 mb-10">
        ${card}
        <div class="hidden md:block"></div>
      </div>`;
  }

  function renderTimeline(items, containerId, isWork) {
    const el = document.getElementById(containerId);
    if (!el) return;

    if (!Array.isArray(items) || !items.length) {
      el.innerHTML = `
        <div class="pl-14 md:pl-0">
          <div class="rounded-2xl bg-gray-800/20 border border-gray-700/40 p-6 text-gray-300">
            No data found.
          </div>
        </div>`;
      return;
    }

    const normalized = items.map(normalizeItem);

    const ordered = [...normalized].sort((a, b) => {
      if (isWork) {
        const cur = Number(!!b.isCurrent) - Number(!!a.isCurrent);
        if (cur !== 0) return cur;
      }
      return Number(a.sortOrder ?? 0) - Number(b.sortOrder ?? 0);
    });

    el.innerHTML = ordered.map((it, idx) => timelineItemHtml(it, idx, isWork)).join("");
  }

  async function loadQualification() {
  try {
    const work = Array.isArray(window.Portfolio?.data?.experience) ? window.Portfolio.data.experience : [];
    const edu = Array.isArray(window.Portfolio?.data?.education) ? window.Portfolio.data.education : [];

    state.work = work;
    state.edu = edu;

    renderTimeline(state.work, "workTimelineItems", true);
    renderTimeline(state.edu, "eduTimelineItems", false);
  } catch (e) {
    renderTimeline([], "workTimelineItems", true);
    renderTimeline([], "eduTimelineItems", false);
    console.error("Qualification load failed:", e);
  }
}

  function initTabs() {
    const tabEdu = document.getElementById("tab-edu");
    const tabWork = document.getElementById("tab-work");
    const eduTimeline = document.getElementById("eduTimeline");
    const workTimeline = document.getElementById("workTimeline");

    if (!tabEdu || !tabWork || !eduTimeline || !workTimeline) return;

    function setActive(isEdu) {
      eduTimeline.classList.toggle("hidden", !isEdu);
      workTimeline.classList.toggle("hidden", isEdu);

      if (isEdu) {
        tabEdu.className =
          "inline-flex items-center gap-2 px-5 py-2 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-200 hover:border-purple-500/50 transition";
        tabWork.className =
          "inline-flex items-center gap-2 px-5 py-2 rounded-full bg-gray-900/60 border border-gray-700/50 text-gray-200 hover:border-purple-500/50 transition";
      } else {
        tabWork.className =
          "inline-flex items-center gap-2 px-5 py-2 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-200 hover:border-purple-500/50 transition";
        tabEdu.className =
          "inline-flex items-center gap-2 px-5 py-2 rounded-full bg-gray-900/60 border border-gray-700/50 text-gray-200 hover:border-purple-500/50 transition";
      }
    }

    tabEdu.addEventListener("click", () => setActive(true));
    tabWork.addEventListener("click", () => setActive(false));

    setActive(false); // default Work
  }

  window.Portfolio = window.Portfolio || {};
  window.Portfolio.loadQualification = loadQualification;
  window.Portfolio.initQualificationTabs = initTabs;
})();