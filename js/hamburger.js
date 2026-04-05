
  document.addEventListener("DOMContentLoaded", function () {
    const tabEdu = document.getElementById("tab-edu");
    const tabWork = document.getElementById("tab-work");
    const eduTimeline = document.getElementById("eduTimeline");
    const workTimeline = document.getElementById("workTimeline");
    const currentYear = document.getElementById("current-year");

    const mobileMenuButton = document.getElementById("mobile-menu-button");
    const mobileMenu = document.getElementById("mobile-menu");
    const menuIcon = document.getElementById("menu-icon");
    const closeIcon = document.getElementById("close-icon");
    const mobileNavLinks = document.querySelectorAll(".mobile-nav-link");

    if (currentYear) {
      currentYear.textContent = new Date().getFullYear();
    }

    function activateEdu() {
      eduTimeline.classList.remove("hidden");
      workTimeline.classList.add("hidden");

      tabEdu.classList.remove("bg-gray-900/60", "border-gray-700/50", "text-gray-200");
      tabEdu.classList.add("bg-purple-500/10", "border-purple-500/30", "text-purple-200");

      tabWork.classList.remove("bg-purple-500/10", "border-purple-500/30", "text-purple-200");
      tabWork.classList.add("bg-gray-900/60", "border-gray-700/50", "text-gray-200");

      tabEdu.setAttribute("aria-selected", "true");
      tabEdu.setAttribute("tabindex", "0");
      tabWork.setAttribute("aria-selected", "false");
      tabWork.setAttribute("tabindex", "-1");
    }

    function activateWork() {
      workTimeline.classList.remove("hidden");
      eduTimeline.classList.add("hidden");

      tabWork.classList.remove("bg-gray-900/60", "border-gray-700/50", "text-gray-200");
      tabWork.classList.add("bg-purple-500/10", "border-purple-500/30", "text-purple-200");

      tabEdu.classList.remove("bg-purple-500/10", "border-purple-500/30", "text-purple-200");
      tabEdu.classList.add("bg-gray-900/60", "border-gray-700/50", "text-gray-200");

      tabWork.setAttribute("aria-selected", "true");
      tabWork.setAttribute("tabindex", "0");
      tabEdu.setAttribute("aria-selected", "false");
      tabEdu.setAttribute("tabindex", "-1");
    }

    tabEdu.addEventListener("click", activateEdu);
    tabWork.addEventListener("click", activateWork);

    tabEdu.addEventListener("keydown", function (e) {
      if (e.key === "ArrowRight" || e.key === "ArrowLeft") {
        tabWork.focus();
        activateWork();
      }
    });

    tabWork.addEventListener("keydown", function (e) {
      if (e.key === "ArrowRight" || e.key === "ArrowLeft") {
        tabEdu.focus();
        activateEdu();
      }
    });

    function openMobileMenu() {
      mobileMenu.classList.remove("hidden");
      mobileMenuButton.setAttribute("aria-expanded", "true");
      menuIcon.classList.add("hidden");
      closeIcon.classList.remove("hidden");
      document.body.classList.add("overflow-hidden");
    }

    function closeMobileMenu() {
      mobileMenu.classList.add("hidden");
      mobileMenuButton.setAttribute("aria-expanded", "false");
      menuIcon.classList.remove("hidden");
      closeIcon.classList.add("hidden");
      document.body.classList.remove("overflow-hidden");
    }

    if (mobileMenuButton && mobileMenu) {
      mobileMenuButton.addEventListener("click", function () {
        const isOpen = mobileMenuButton.getAttribute("aria-expanded") === "true";
        isOpen ? closeMobileMenu() : openMobileMenu();
      });

      mobileNavLinks.forEach(link => {
        link.addEventListener("click", closeMobileMenu);
      });

      document.addEventListener("keydown", function (e) {
        if (e.key === "Escape") {
          closeMobileMenu();
        }
      });

      window.addEventListener("resize", function () {
        if (window.innerWidth >= 768) {
          closeMobileMenu();
        }
      });
    }
  });
