// Initialisation du client Supabase
const supabase = window.supabase.createClient(
    SUPABASE_CONFIG.url,
    SUPABASE_CONFIG.anonKey
);

// ===== AUTHENTIFICATION =====

async function signIn(email, password) {
    try {
        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password
        });
        
        if (error) throw error;
        return { success: true, user: data.user };
    } catch (error) {
        console.error('Erreur de connexion:', error);
        return { success: false, error: error.message };
    }
}

async function signOut() {
    try {
        const { error } = await supabase.auth.signOut();
        if (error) throw error;
        return { success: true };
    } catch (error) {
        console.error('Erreur de déconnexion:', error);
        return { success: false, error: error.message };
    }
}

async function getCurrentUser() {
    const { data: { user } } = await supabase.auth.getUser();
    return user;
}

// ===== CATÉGORIES =====

async function getCategories() {
    try {
        const { data, error } = await supabase
            .from('categories')
            .select('*')
            .order('name');
        
        if (error) throw error;
        return data;
    } catch (error) {
        console.error('Erreur chargement catégories:', error);
        return [];
    }
}

// ===== PROJETS =====

async function getProjects() {
    try {
        const { data, error } = await supabase
            .from('projects')
            .select(`
                *,
                images:project_images(*)
            `)
            .order('created_at', { ascending: false });
        
        if (error) throw error;
        return data;
    } catch (error) {
        console.error('Erreur chargement projets:', error);
        return [];
    }
}

async function getProjectById(id) {
    try {
        const { data, error } = await supabase
            .from('projects')
            .select(`
                *,
                images:project_images(
                    *,
                    category:categories(*)
                )
            `)
            .eq('id', id)
            .single();
        
        if (error) throw error;
        return data;
    } catch (error) {
        console.error('Erreur chargement projet:', error);
        return null;
    }
}

async function createProject(projectData) {
    try {
        const { data, error } = await supabase
            .from('projects')
            .insert([projectData])
            .select()
            .single();
        
        if (error) throw error;
        return { success: true, project: data };
    } catch (error) {
        console.error('Erreur création projet:', error);
        return { success: false, error: error.message };
    }
}

async function deleteProject(id) {
    try {
        const { error } = await supabase
            .from('projects')
            .delete()
            .eq('id', id);
        
        if (error) throw error;
        return { success: true };
    } catch (error) {
        console.error('Erreur suppression projet:', error);
        return { success: false, error: error.message };
    }
}

// ===== IMAGES =====

async function uploadImage(file, projectId) {
    try {
        const fileExt = file.name.split('.').pop();
        const fileName = `${projectId}/${Date.now()}.${fileExt}`;
        
        const { data, error } = await supabase.storage
            .from('images')
            .upload(fileName, file);
        
        if (error) throw error;
        
        // Obtenir l'URL publique
        const { data: { publicUrl } } = supabase.storage
            .from('images')
            .getPublicUrl(fileName);
        
        return { success: true, url: publicUrl };
    } catch (error) {
        console.error('Erreur upload image:', error);
        return { success: false, error: error.message };
    }
}

async function addProjectImage(projectId, categoryId, imageUrl, orderIndex) {
    try {
        const { data, error } = await supabase
            .from('project_images')
            .insert([{
                project_id: projectId,
                category_id: categoryId,
                image_url: imageUrl,
                order_index: orderIndex
            }])
            .select()
            .single();
        
        if (error) throw error;
        return { success: true, image: data };
    } catch (error) {
        console.error('Erreur ajout image:', error);
        return { success: false, error: error.message };
    }
}

// ===== FILTRES =====

async function getProjectsByCategory(categoryId) {
    try {
        const { data, error } = await supabase
            .from('projects')
            .select(`
                *,
                images:project_images!inner(*)
            `)
            .eq('images.category_id', categoryId)
            .order('created_at', { ascending: false });
        
        if (error) throw error;
        return data;
    } catch (error) {
        console.error('Erreur filtrage projets:', error);
        return [];
    }
}

// Export des fonctions
window.SupabaseAPI = {
    signIn,
    signOut,
    getCurrentUser,
    getCategories,
    getProjects,
    getProjectById,
    createProject,
    deleteProject,
    uploadImage,
    addProjectImage,
    getProjectsByCategory
};