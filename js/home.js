// Gestion de la page d'accueil

let allProjects = [];
let categories = [];
let currentFilter = 'all';

// Initialiser la page d'accueil
async function initHome() {
    try {
        // Charger les catégories
        categories = await SupabaseAPI.getCategories();
        renderCategoryFilters();
        
        // Charger les projets
        allProjects = await SupabaseAPI.getProjects();
        renderProjects(allProjects);
        
        // Initialiser les icônes Lucide
        lucide.createIcons();
    } catch (error) {
        console.error('Erreur initialisation home:', error);
    }
}

// Afficher les filtres de catégories
function renderCategoryFilters() {
    const container = document.getElementById('category-filters');
    if (!container) return;
    
    let html = `
        <button class="filter-btn active" data-category="all">
            Tous les projets
        </button>
    `;
    
    categories.forEach(cat => {
        html += `
            <button class="filter-btn" data-category="${cat.id}">
                ${cat.name}
            </button>
        `;
    });
    
    container.innerHTML = html;
    
    // Ajouter les event listeners
    container.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', handleFilterClick);
    });
}

// Gérer le clic sur un filtre
function handleFilterClick(e) {
    const categoryId = e.target.dataset.category;
    currentFilter = categoryId;
    
    // Mettre à jour l'apparence des boutons
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    e.target.classList.add('active');
    
    // Filtrer les projets
    filterProjects(categoryId);
}

// Filtrer les projets
async function filterProjects(categoryId) {
    if (categoryId === 'all') {
        renderProjects(allProjects);
    } else {
        const filtered = allProjects.filter(project => 
            project.images && project.images.some(img => img.category_id === parseInt(categoryId))
        );
        renderProjects(filtered);
    }
}

// Afficher les projets
function renderProjects(projects) {
    const grid = document.getElementById('projects-grid');
    if (!grid) return;
    
    if (projects.length === 0) {
        grid.innerHTML = `
            <div style="grid-column: 1/-1; text-align: center; padding: 3rem; color: var(--color-gray);">
                <p style="font-size: 1.25rem;">Aucun projet trouvé dans cette catégorie</p>
            </div>
        `;
        return;
    }
    
    let html = '';
    
    projects.forEach((project, index) => {
        const firstImage = project.images && project.images[0] ? project.images[0].image_url : '';
        const imageCount = project.images ? project.images.length : 0;
        const iconType = project.client_type === 'Entreprise' ? 'briefcase' : 'user';
        
        html += `
            <div class="project-card" data-project-id="${project.id}" style="animation-delay: ${index * 0.1}s">
                <div class="project-image">
                    <img src="${firstImage}" alt="${project.title}" loading="lazy">
                </div>
                <div class="project-info">
                    <div class="project-meta">
                        <i data-lucide="${iconType}" style="width: 16px; height: 16px;"></i>
                        <span>${project.client_type}</span>
                    </div>
                    <h3 class="project-title">${project.title}</h3>
                    <p class="project-description">${project.description}</p>
                    <div class="project-images-count">
                        <i data-lucide="images" style="width: 16px; height: 16px;"></i>
                        <span>${imageCount} image${imageCount > 1 ? 's' : ''}</span>
                    </div>
                </div>
            </div>
        `;
    });
    
    grid.innerHTML = html;
    
    // Ajouter les event listeners
    grid.querySelectorAll('.project-card').forEach(card => {
        card.addEventListener('click', handleProjectClick);
    });
    
    // Initialiser les icônes Lucide
    lucide.createIcons();
}

// Gérer le clic sur un projet
async function handleProjectClick(e) {
    const card = e.currentTarget;
    const projectId = parseInt(card.dataset.projectId);
    
    // Charger les détails du projet
    const project = await SupabaseAPI.getProjectById(projectId);
    
    if (project) {
        // Afficher la vue projet
        showProjectView(project);
    }
}

// Export des fonctions
window.HomeView = {
    init: initHome,
    refresh: initHome
};