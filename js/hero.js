(function () {
  function esc(s) {
    return String(s ?? "")
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }

  function accentToHoverBorder(accentKey) {
    const a = String(accentKey || "").toLowerCase();
    if (a.includes("purple") || a.includes("primary")) return "hover:border-purple-500/50";
    if (a.includes("cyan")) return "hover:border-cyan-500/50";
    if (a.includes("green") || a.includes("success")) return "hover:border-green-500/50";
    if (a.includes("pink")) return "hover:border-pink-500/50";
    if (a.includes("blue")) return "hover:border-blue-500/50";
    if (a.includes("yellow")) return "hover:border-yellow-500/50";
    return "hover:border-purple-500/50";
  }

  async function loadHero() {
    const data = window.Portfolio?.data;
    if (!data) return;

    const hero = document.getElementById("hero");
    if (!hero) return;

    const h = data.hero || {};
    const heroHighlights = Array.isArray(data.heroHighlights) ? data.heroHighlights : [];

    const badgeSpan = hero.querySelector(".inline-flex span.text-sm");
    if (badgeSpan && h.BadgeText) badgeSpan.textContent = h.BadgeText;

    const h1 = hero.querySelector("h1");
    const gradientSpan = hero.querySelector("h1 span.bg-gradient-to-r");
    if (h1 && gradientSpan) {
      h1.innerHTML = `
        ${esc(h.TitleBeforeHighlight || "Full-Stack .NET Developer Building")}
        <span class="${gradientSpan.className}">${esc(h.TitleHighlight || "Scalable Web Applications")}</span>
        ${esc(h.TitleAfterHighlight || "With Clean & Maintainable Code")}
      `;
    }

    const subtitle = hero.querySelector("p.text-xl");
    if (subtitle && h.Subtitle) subtitle.textContent = h.Subtitle;

    const primaryBtn = hero.querySelector('a[href="#projects"]');
    if (primaryBtn) {
      primaryBtn.querySelector("span")?.replaceWith(document.createTextNode(h.PrimaryCtaText || "View Projects"));
      primaryBtn.setAttribute("href", h.PrimaryCtaHref || "#projects");
    }

    const cvBtn = document.getElementById("download-cv");
    if (cvBtn) {
      const span = cvBtn.querySelector("span");
      if (span) span.textContent = h.SecondaryCtaText || "Download CV";
      if (h.CvUrl) cvBtn.setAttribute("href", h.CvUrl);
    }

    const cardsWrap = hero.querySelector(".grid.grid-cols-2.md\\:grid-cols-4");
    if (!cardsWrap) return;

    const cards = Array.from(cardsWrap.children).filter((x) => x && x.tagName === "DIV");
    const highlights = [...heroHighlights].sort((a,b)=> (a.SortOrder??0)-(b.SortOrder??0));

    for (let i = 0; i < Math.min(cards.length, highlights.length); i++) {
      const card = cards[i];
      const item = highlights[i];

      card.className = card.className.replaceAll(/hover:border-[^\s]+/g, "").trim() + " " + accentToHoverBorder(item.AccentKey);

      const icon = card.querySelector("i");
      if (icon) {
        const textClass = icon.className.split(" ").filter(c => c.startsWith("text-")).join(" ");
        icon.className = `${esc(item.IconClass || "")} ${textClass}`.trim();
      }

      const titleEl = card.querySelector(".font-medium");
      const subEl = card.querySelector(".text-sm.text-gray-400");
      if (titleEl) titleEl.textContent = item.Title || titleEl.textContent;
      if (subEl) subEl.textContent = item.Subtitle || subEl.textContent;
    }
  }

  window.Portfolio = window.Portfolio || {};
  window.Portfolio.loadHero = loadHero;
})();
