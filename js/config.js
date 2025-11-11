// Configuration Supabase
// ⚠️ REMPLACEZ CES VALEURS PAR VOS VRAIES CLÉS SUPABASE

const SUPABASE_CONFIG = {
    // Allez sur supabase.com > Votre projet > Settings > API
    url: 'https://kpdckfosawsbcgcgfbko.supabase.co', // Ex: https://xxxxxxxxxxxxx.supabase.co
    anonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtwZGNrZm9zYXdzYmNnY2dmYmtvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI4MjUzNTQsImV4cCI6MjA3ODQwMTM1NH0.4vt_tJczPGvLs5QqXPvS4lsdoiAncaSKGcON-n8wUck' // Votre clé publique anon
};

// Pour Netlify, utilisez plutôt les variables d'environnement :
// const SUPABASE_CONFIG = {
//     url: import.meta.env.VITE_SUPABASE_URL,
//     anonKey: import.meta.env.VITE_SUPABASE_ANON_KEY
// };

// Export de la configuration
window.SUPABASE_CONFIG = SUPABASE_CONFIG;