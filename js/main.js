(function () {
  document.addEventListener("DOMContentLoaded", async () => {
    try {
      await window.Portfolio?.loadHero?.();
      window.ProjectManager?.init?.();
      await window.Portfolio?.loadSkills?.();
      window.Portfolio?.initQualificationTabs?.();
      await window.Portfolio?.loadQualification?.();
      await window.Portfolio?.loadTestimonialsIfExists?.();
    } catch (e) {
      console.error(e);
    }
  });
})();
