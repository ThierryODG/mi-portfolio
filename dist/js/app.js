// Gestion globale de l'application

let currentView = 'home';
let isAuthenticated = false;

// Initialisation au chargement de la page
document.addEventListener('DOMContentLoaded', async () => {
    // Vérifier l'authentification
    const user = await SupabaseAPI.getCurrentUser();
    isAuthenticated = !!user;
    
    // Initialiser la vue d'accueil
    await HomeView.init();
    
    // Configurer les event listeners globaux
    setupGlobalEventListeners();
    
    // Initialiser les icônes Lucide
    lucide.createIcons();
});

// Configurer les event listeners globaux
function setupGlobalEventListeners() {
    // Bouton admin
    const adminBtn = document.getElementById('admin-btn');
    if (adminBtn) {
        adminBtn.addEventListener('click', () => {
            if (isAuthenticated) {
                changeView('admin');
                AdminView.init();
            } else {
                changeView('login');
            }
        });
    }
    
    // Bouton retour
    const backBtn = document.getElementById('back-btn');
    if (backBtn) {
        backBtn.addEventListener('click', () => {
            changeView('home');
        });
    }
    
    // Login
    const loginSubmit = document.getElementById('login-submit');
    if (loginSubmit) {
        loginSubmit.addEventListener('click', handleLogin);
    }
    
    const loginCancel = document.getElementById('login-cancel');
    if (loginCancel) {
        loginCancel.addEventListener('click', () => {
            changeView('home');
        });
    }
    
    // Logout
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', handleLogout);
    }
    
    // Entrée dans le champ password
    const loginPassword = document.getElementById('login-password');
    if (loginPassword) {
        loginPassword.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                handleLogin();
            }
        });
    }
}

// Changer de vue
function changeView(viewName) {
    // Cacher toutes les vues
    document.querySelectorAll('.view').forEach(view => {
        view.classList.remove('active');
    });
    
    // Afficher la vue demandée
    const targetView = document.getElementById(`${viewName}-view`);
    if (targetView) {
        targetView.classList.add('active');
        currentView = viewName;
        
        // Scroll en haut
        window.scrollTo(0, 0);
    }
}

// Gérer la connexion
async function handleLogin() {
    const email = document.getElementById('login-email').value.trim();
    const password = document.getElementById('login-password').value;
    
    if (!email || !password) {
        alert('Veuillez remplir tous les champs');
        return;
    }
    
    const result = await SupabaseAPI.signIn(email, password);
    
    if (result.success) {
        isAuthenticated = true;
        changeView('admin');
        await AdminView.init();
        
        // Réinitialiser le formulaire
        document.getElementById('login-email').value = '';
        document.getElementById('login-password').value = '';
    } else {
        alert('Erreur de connexion: ' + result.error);
    }
}

// Gérer la déconnexion
async function handleLogout() {
    const result = await SupabaseAPI.signOut();
    
    if (result.success) {
        isAuthenticated = false;
        changeView('home');
    } else {
        alert('Erreur de déconnexion: ' + result.error);
    }
}

// Export des fonctions globales
window.changeView = changeView;
window.currentView = currentView;