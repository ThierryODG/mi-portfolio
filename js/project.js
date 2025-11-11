// Gestion de la page projet

let currentProject = null;
let currentImageIndex = 0;

// Afficher la vue projet
function showProjectView(project) {
    currentProject = project;
    currentImageIndex = 0;
    
    // Changer de vue
    changeView('project');
    
    // Afficher le projet
    renderProjectDetail();
    
    // Initialiser les icônes
    lucide.createIcons();
}

// Afficher les détails du projet
function renderProjectDetail() {
    const container = document.getElementById('project-detail');
    if (!container || !currentProject) return;
    
    const iconType = currentProject.client_type === 'Entreprise' ? 'briefcase' : 'user';
    const images = currentProject.images || [];
    const currentImage = images[currentImageIndex];
    
    let html = `
        <div class="project-header">
            <div class="project-meta">
                <i data-lucide="${iconType}"></i>
                <span>${currentProject.client_type}</span>
            </div>
            <h1>${currentProject.title}</h1>
            <p>${currentProject.description}</p>
        </div>
        
        <div class="gallery-main">
            <div class="gallery-image">
                <img src="${currentImage.image_url}" alt="Image ${currentImageIndex + 1}">
            </div>
    `;
    
    // Contrôles de navigation si plusieurs images
    if (images.length > 1) {
        html += `
            <div class="gallery-controls">
                <button class="gallery-btn" id="prev-image">
                    <i data-lucide="chevron-left"></i>
                </button>
                <button class="gallery-btn" id="next-image">
                    <i data-lucide="chevron-right"></i>
                </button>
            </div>
        `;
        
        // Indicateurs
        html += '<div class="gallery-indicators">';
        images.forEach((_, index) => {
            const activeClass = index === currentImageIndex ? 'active' : '';
            html += `<button class="indicator ${activeClass}" data-index="${index}"></button>`;
        });
        html += '</div>';
    }
    
    html += '</div>';
    
    // Miniatures
    if (images.length > 1) {
        html += '<div class="gallery-thumbnails">';
        images.forEach((img, index) => {
            const activeClass = index === currentImageIndex ? 'active' : '';
            html += `
                <button class="thumbnail ${activeClass}" data-index="${index}">
                    <img src="${img.image_url}" alt="Miniature ${index + 1}">
                </button>
            `;
        });
        html += '</div>';
    }
    
    container.innerHTML = html;
    
    // Event listeners
    if (images.length > 1) {
        document.getElementById('prev-image')?.addEventListener('click', prevImage);
        document.getElementById('next-image')?.addEventListener('click', nextImage);
        
        document.querySelectorAll('.indicator').forEach(ind => {
            ind.addEventListener('click', (e) => {
                currentImageIndex = parseInt(e.target.dataset.index);
                renderProjectDetail();
            });
        });
        
        document.querySelectorAll('.thumbnail').forEach(thumb => {
            thumb.addEventListener('click', (e) => {
                const btn = e.target.closest('.thumbnail');
                currentImageIndex = parseInt(btn.dataset.index);
                renderProjectDetail();
            });
        });
    }
    
    // Initialiser les icônes
    lucide.createIcons();
}

// Image précédente
function prevImage() {
    if (!currentProject) return;
    const images = currentProject.images || [];
    currentImageIndex = currentImageIndex === 0 ? images.length - 1 : currentImageIndex - 1;
    renderProjectDetail();
}

// Image suivante
function nextImage() {
    if (!currentProject) return;
    const images = currentProject.images || [];
    currentImageIndex = currentImageIndex === images.length - 1 ? 0 : currentImageIndex + 1;
    renderProjectDetail();
}

// Navigation clavier
document.addEventListener('keydown', (e) => {
    if (currentView !== 'project') return;
    
    if (e.key === 'ArrowLeft') {
        prevImage();
    } else if (e.key === 'ArrowRight') {
        nextImage();
    } else if (e.key === 'Escape') {
        changeView('home');
    }
});

// Export des fonctions
window.ProjectView = {
    show: showProjectView
};