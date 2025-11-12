// Gestion de l'interface d'administration

let selectedFiles = [];
let selectedLogo = null;

// Initialiser l'interface admin
async function initAdmin() {
    try {
        // Charger les catégories pour le select
        const categories = await SupabaseAPI.getCategories();
        renderCategorySelect(categories);
        
        // Charger la liste des projets
        await loadAdminProjects();
        
        // Event listeners
        setupAdminEventListeners();
        
        // Initialiser les icônes
        lucide.createIcons();
    } catch (error) {
        console.error('Erreur initialisation admin:', error);
    }
}

// Afficher le select des catégories
function renderCategorySelect(categories) {
    const select = document.getElementById('project-category');
    if (!select) return;
    
    let html = '';
    categories.forEach(cat => {
        html += `<option value="${cat.id}">${cat.name}</option>`;
    });
    
    select.innerHTML = html;
}

// Configurer les event listeners
function setupAdminEventListeners() {
    // Upload d'images
    const imagesInput = document.getElementById('project-images');
    if (imagesInput) {
        imagesInput.addEventListener('change', handleImagesSelect);
    }
    
    // Upload de logo
    const logoInput = document.getElementById('project-logo');
    if (logoInput) {
        logoInput.addEventListener('change', handleLogoSelect);
    }
    
    // Publier le projet
    const publishBtn = document.getElementById('publish-project');
    if (publishBtn) {
        publishBtn.addEventListener('click', handlePublishProject);
    }
}

// Gérer la sélection d'images
function handleImagesSelect(e) {
    selectedFiles = Array.from(e.target.files);
    renderImagePreviews();
}

// Gérer la sélection du logo
function handleLogoSelect(e) {
    const file = e.target.files[0];
    if (file) {
        selectedLogo = file;
    }
}

// Afficher les aperçus des images
function renderImagePreviews() {
    const container = document.getElementById('images-preview');
    if (!container) return;
    
    container.innerHTML = '';
    
    selectedFiles.forEach((file, index) => {
        const reader = new FileReader();
        reader.onload = (e) => {
            const div = document.createElement('div');
            div.className = 'preview-item';
            div.innerHTML = `<img src="${e.target.result}" alt="Aperçu ${index + 1}">`;
            container.appendChild(div);
        };
        reader.readAsDataURL(file);
    });
}

// Publier un nouveau projet
async function handlePublishProject() {
    const btn = document.getElementById('publish-project');
    if (!btn) return;
    
    // Récupérer les données du formulaire
    const title = document.getElementById('project-title').value.trim();
    const clientType = document.getElementById('project-client-type').value;
    const description = document.getElementById('project-description').value.trim();
    const categoryId = parseInt(document.getElementById('project-category').value);
    
    // Validation
    if (!title || !description) {
        alert('Veuillez remplir tous les champs obligatoires');
        return;
    }
    
    if (selectedFiles.length === 0) {
        alert('Veuillez sélectionner au moins une image');
        return;
    }
    
    // Désactiver le bouton
    btn.disabled = true;
    btn.textContent = 'Publication en cours...';
    
    try {
        // 1. Upload du logo (si présent)
        let logoUrl = '';
        if (selectedLogo) {
            const logoResult = await SupabaseAPI.uploadImage(selectedLogo, 'logos');
            if (logoResult.success) {
                logoUrl = logoResult.url;
            }
        }
        
        // 2. Créer le projet
        const projectResult = await SupabaseAPI.createProject({
            title,
            client_type: clientType,
            description,
            logo_url: logoUrl
        });
        
        if (!projectResult.success) {
            throw new Error(projectResult.error);
        }
        
        const projectId = projectResult.project.id;
        
        // 3. Upload des images
        for (let i = 0; i < selectedFiles.length; i++) {
            const file = selectedFiles[i];
            
            // Upload de l'image
            const uploadResult = await SupabaseAPI.uploadImage(file, projectId);
            
            if (uploadResult.success) {
                // Ajouter l'image à la base de données
                await SupabaseAPI.addProjectImage(
                    projectId,
                    categoryId,
                    uploadResult.url,
                    i
                );
            }
        }
        
        // 4. Réinitialiser le formulaire
        resetAdminForm();
        
        // 5. Recharger la liste des projets
        await loadAdminProjects();
        
        alert('Projet publié avec succès !');
        
    } catch (error) {
        console.error('Erreur publication projet:', error);
        alert('Erreur lors de la publication du projet: ' + error.message);
    } finally {
        btn.disabled = false;
        btn.textContent = 'Publier le projet';
    }
}

// Réinitialiser le formulaire
function resetAdminForm() {
    document.getElementById('project-title').value = '';
    document.getElementById('project-client-type').value = 'Particulier';
    document.getElementById('project-description').value = '';
    document.getElementById('project-logo').value = '';
    document.getElementById('project-images').value = '';
    document.getElementById('images-preview').innerHTML = '';
    
    selectedFiles = [];
    selectedLogo = null;
}

// Charger la liste des projets pour l'admin
async function loadAdminProjects() {
    try {
        const projects = await SupabaseAPI.getProjects();
        renderAdminProjects(projects);
    } catch (error) {
        console.error('Erreur chargement projets admin:', error);
    }
}

// Afficher la liste des projets dans l'admin
function renderAdminProjects(projects) {
    const container = document.getElementById('admin-projects-list');
    if (!container) return;
    
    if (projects.length === 0) {
        container.innerHTML = '<p style="color: var(--color-gray); text-align: center;">Aucun projet pour le moment</p>';
        return;
    }
    
    let html = '';
    
    projects.forEach(project => {
        const imageCount = project.images ? project.images.length : 0;
        
        html += `
            <div class="admin-project-item">
                <div class="admin-project-info">
                    <h3>${project.title}</h3>
                    <p>${project.client_type} • ${imageCount} image${imageCount > 1 ? 's' : ''}</p>
                </div>
                <button class="btn-delete" data-project-id="${project.id}">
                    <i data-lucide="trash-2"></i>
                </button>
            </div>
        `;
    });
    
    container.innerHTML = html;
    
    // Event listeners pour la suppression
    container.querySelectorAll('.btn-delete').forEach(btn => {
        btn.addEventListener('click', handleDeleteProject);
    });
    
    // Initialiser les icônes
    lucide.createIcons();
}

// Supprimer un projet
async function handleDeleteProject(e) {
    const projectId = parseInt(e.currentTarget.dataset.projectId);
    
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce projet ?')) {
        return;
    }
    
    try {
        const result = await SupabaseAPI.deleteProject(projectId);
        
        if (result.success) {
            alert('Projet supprimé avec succès');
            await loadAdminProjects();
        } else {
            throw new Error(result.error);
        }
    } catch (error) {
        console.error('Erreur suppression projet:', error);
        alert('Erreur lors de la suppression: ' + error.message);
    }
}

// Export des fonctions
window.AdminView = {
    init: initAdmin,
    refresh: loadAdminProjects
};