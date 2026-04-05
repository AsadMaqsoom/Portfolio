const STATIC_PROJECTS = Array.isArray(window.Portfolio?.data?.projects) ? window.Portfolio.data.projects : [];

class ProjectManager {
  constructor() {
    this.projects = [];
    this.filteredProjects = [];
    this.currentPage = 1;
    this.projectsPerPage = 6;
    this.activeFilters = new Set(["all"]);
  }

  async init() {
    this.setupEventListeners();
    this.loadProjectsFromStaticData();
    this.renderProjects();
    this.renderPagination();
    this.updateActiveFiltersDisplay();
  }

  loadProjectsFromStaticData() {
    this.projects = [...STATIC_PROJECTS].sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0));
    this.filteredProjects = [...this.projects];
    this.currentPage = 1;
  }

  renderProjects() {
    const grid = document.getElementById("projects-grid");
    if (!grid) return;

    grid.innerHTML = "";
    const startIndex = (this.currentPage - 1) * this.projectsPerPage;
    const endIndex = startIndex + this.projectsPerPage;
    const paginatedProjects = this.filteredProjects.slice(startIndex, endIndex);

    if (paginatedProjects.length === 0) {
      grid.innerHTML = `
        <div class="col-span-full text-center py-16">
          <div class="w-24 h-24 mx-auto mb-6 rounded-full bg-gray-800/50 flex items-center justify-center">
            <i class="fas fa-search text-3xl text-gray-500"></i>
          </div>
          <h3 class="text-2xl font-bold mb-2">No projects found</h3>
          <p class="text-gray-400">Try adjusting your search or filters</p>
        </div>
      `;
      return;
    }

    paginatedProjects.forEach((project) => {
      grid.appendChild(this.createProjectCard(project));
    });
  }

  createProjectCard(project) {
    const card = document.createElement("div");
    card.className = "project-card group animate-fade-in";
    card.dataset.category = project.category || "all";

    let borderColor = "border-gray-700/50";
    let techColor = "bg-purple-500/20";

    if (project.category === ".net") {
      borderColor = "border-gray-700/50 group-hover:border-purple-500/50";
      techColor = "bg-purple-500/20";
    } else if (project.category === "javascript") {
      borderColor = "border-gray-700/50 group-hover:border-yellow-500/50";
      techColor = "bg-yellow-500/20";
    } else if (project.category === "php") {
      borderColor = "border-gray-700/50 group-hover:border-green-500/50";
      techColor = "bg-green-500/20";
    } else if (project.category === "wordpress") {
      borderColor = "border-gray-700/50 group-hover:border-blue-500/50";
      techColor = "bg-blue-500/20";
    }

    const primaryTech = Array.isArray(project.tech) && project.tech.length > 0 ? project.tech[0] : (project.category || "Tech");

    card.innerHTML = `
      <div class="h-full flex flex-col p-6 rounded-2xl bg-gray-800/30 border ${borderColor} transition-all duration-300 transform group-hover:-translate-y-1">
        <div class="flex justify-between items-start mb-4">
          <div>
            ${project.featured ? `
              <span class="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-gradient-to-r from-purple-500 to-pink-500 text-white mb-2">
                <i class="fas fa-star mr-1"></i> Featured
              </span>
            ` : ""}
            <h3 class="text-xl font-bold group-hover:text-white transition-colors">${project.title}</h3>
          </div>
          <span class="px-3 py-1 rounded-full text-xs font-semibold ${techColor} text-white">
            ${primaryTech}
          </span>
        </div>

        <p class="text-gray-400 mb-6 flex-grow">${project.description}</p>

        <div class="mt-auto">
          <div class="flex flex-wrap gap-2 mb-6">
            ${(project.tech || []).map((tech) => `
              <span class="px-3 py-1 rounded-full bg-gray-800 text-sm border border-gray-700/50">${tech}</span>
            `).join("")}
          </div>

          <div class="flex justify-between items-center pt-4 border-t border-gray-700/50">
            <div class="flex space-x-4">
              ${project.liveUrl ? `
                <a href="${project.liveUrl}" target="_blank" class="flex items-center text-sm font-medium text-gray-300 hover:text-white transition-colors">
                  <i class="fas fa-external-link-alt mr-2"></i>
                  Live Demo
                </a>
              ` : ""}
              ${project.githubUrl ? `
                <a href="${project.githubUrl}" target="_blank" class="flex items-center text-sm font-medium text-gray-300 hover:text-white transition-colors">
                  <i class="fab fa-github mr-2"></i>
                  Code
                </a>
              ` : ""}
            </div>

            <button class="view-details-btn p-2 rounded-lg bg-gray-800 hover:bg-gray-700 transition-colors" data-project-id="${project.id}" aria-label="View project details">
              <i class="fas fa-chevron-right"></i>
            </button>
          </div>
        </div>
      </div>
    `;
    return card;
  }

  setupEventListeners() {
    const searchInput = document.getElementById("project-search");
    if (searchInput) {
      searchInput.addEventListener("input", (e) => this.handleSearch(e.target.value));
    }

    document.querySelectorAll(".project-filter").forEach((button) => {
      button.addEventListener("click", (e) => {
        const targetBtn = e.target.closest("button");
        const filter = targetBtn?.dataset?.filter;
        if (!filter) return;
        this.handleFilterClick(filter);
      });
    });

    const clearBtn = document.getElementById("clear-filters");
    if (clearBtn) {
      clearBtn.addEventListener("click", () => {
        this.activeFilters = new Set(["all"]);
        const searchInput = document.getElementById("project-search");
        if (searchInput) searchInput.value = "";
        this.applyFiltersAndSearch();
      });
    }

    document.addEventListener("click", (e) => {
      const btn = e.target.closest(".view-details-btn");
      if (!btn) return;
      const projectId = Number(btn.dataset.projectId);
      const project = this.projects.find((p) => Number(p.id) === projectId);
      if (project) this.showProjectDetails(project);
    });
  }

  handleSearch(searchTerm) {
    this.searchTerm = String(searchTerm || "").toLowerCase().trim();
    this.applyFiltersAndSearch();
  }

  handleFilterClick(filter) {
    if (filter === "all") {
      this.activeFilters = new Set(["all"]);
    } else {
      this.activeFilters.delete("all");
      if (this.activeFilters.has(filter)) {
        this.activeFilters.delete(filter);
      } else {
        this.activeFilters.add(filter);
      }
      if (this.activeFilters.size === 0) this.activeFilters.add("all");
    }
    this.applyFiltersAndSearch();
  }

  applyFiltersAndSearch() {
    const active = this.activeFilters.has("all") ? null : this.activeFilters;
    this.filteredProjects = this.projects.filter((project) => {
      const matchesFilter = !active || active.has(project.category);
      const haystack = `${project.title} ${project.description} ${(project.tech || []).join(" ")}`.toLowerCase();
      const matchesSearch = !this.searchTerm || haystack.includes(this.searchTerm);
      return matchesFilter && matchesSearch;
    });

    this.currentPage = 1;
    this.renderProjects();
    this.renderPagination();
    this.updateActiveFiltersDisplay();
    this.updateFilterButtons();
  }

  updateFilterButtons() {
    document.querySelectorAll(".project-filter").forEach((button) => {
      const filter = button.dataset.filter;
      const isActive = this.activeFilters.has(filter);
      button.classList.toggle("border-purple-500/50", isActive);
      button.classList.toggle("bg-purple-500/10", isActive);
      button.classList.toggle("text-white", isActive);
    });
  }

  updateActiveFiltersDisplay() {
    const counter = document.getElementById("projects-count");
    if (counter) counter.textContent = String(this.filteredProjects.length);
  }

  renderPagination() {
    const pagination = document.getElementById("projects-pagination");
    if (!pagination) return;

    const totalPages = Math.ceil(this.filteredProjects.length / this.projectsPerPage);
    if (totalPages <= 1) {
      pagination.innerHTML = "";
      return;
    }

    pagination.innerHTML = `
      <div class="flex items-center justify-center gap-3">
        <button ${this.currentPage === 1 ? "disabled" : ""} data-page="prev" class="px-4 py-2 rounded-lg bg-gray-800 border border-gray-700 disabled:opacity-50">Previous</button>
        <span class="text-sm text-gray-300">Page ${this.currentPage} of ${totalPages}</span>
        <button ${this.currentPage === totalPages ? "disabled" : ""} data-page="next" class="px-4 py-2 rounded-lg bg-gray-800 border border-gray-700 disabled:opacity-50">Next</button>
      </div>
    `;

    pagination.querySelectorAll("button[data-page]").forEach((button) => {
      button.addEventListener("click", () => {
        const action = button.dataset.page;
        if (action === "prev" && this.currentPage > 1) this.currentPage -= 1;
        if (action === "next" && this.currentPage < totalPages) this.currentPage += 1;
        this.renderProjects();
        this.renderPagination();
      });
    });
  }

  showProjectDetails(project) {
    const links = [
      project.liveUrl ? `Live Demo: ${project.liveUrl}` : null,
      project.githubUrl ? `Code: ${project.githubUrl}` : null
    ].filter(Boolean).join("\n");

    alert(`${project.title}\n\n${project.description}\n\nTech: ${(project.tech || []).join(", ")}${links ? `\n\n${links}` : ""}`);
  }
}

window.ProjectManager = new ProjectManager();
