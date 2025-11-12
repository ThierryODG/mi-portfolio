(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const i of document.querySelectorAll('link[rel="modulepreload"]'))n(i);new MutationObserver(i=>{for(const o of i)if(o.type==="childList")for(const c of o.addedNodes)c.tagName==="LINK"&&c.rel==="modulepreload"&&n(c)}).observe(document,{childList:!0,subtree:!0});function r(i){const o={};return i.integrity&&(o.integrity=i.integrity),i.referrerPolicy&&(o.referrerPolicy=i.referrerPolicy),i.crossOrigin==="use-credentials"?o.credentials="include":i.crossOrigin==="anonymous"?o.credentials="omit":o.credentials="same-origin",o}function n(i){if(i.ep)return;i.ep=!0;const o=r(i);fetch(i.href,o)}})();const $={url:"https://kpdckfosawsbcgcgfbko.supabase.co",anonKey:"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtwZGNrZm9zYXdzYmNnY2dmYmtvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI4MjUzNTQsImV4cCI6MjA3ODQwMTM1NH0.4vt_tJczPGvLs5QqXPvS4lsdoiAncaSKGcON-n8wUck"};window.SUPABASE_CONFIG=$;const s=window.supabase.createClient(SUPABASE_CONFIG.url,SUPABASE_CONFIG.anonKey);async function S(e,t){try{const{data:r,error:n}=await s.auth.signInWithPassword({email:e,password:t});if(n)throw n;return{success:!0,user:r.user}}catch(r){return console.error("Erreur de connexion:",r),{success:!1,error:r.message}}}async function C(){try{const{error:e}=await s.auth.signOut();if(e)throw e;return{success:!0}}catch(e){return console.error("Erreur de déconnexion:",e),{success:!1,error:e.message}}}async function _(){const{data:{user:e}}=await s.auth.getUser();return e}async function k(){try{const{data:e,error:t}=await s.from("categories").select("*").order("name");if(t)throw t;return e}catch(e){return console.error("Erreur chargement catégories:",e),[]}}async function V(){try{const{data:e,error:t}=await s.from("projects").select(`
                *,
                images:project_images(*)
            `).order("created_at",{ascending:!1});if(t)throw t;return e}catch(e){return console.error("Erreur chargement projets:",e),[]}}async function x(e){try{const{data:t,error:r}=await s.from("projects").select(`
                *,
                images:project_images(
                    *,
                    category:categories(*)
                )
            `).eq("id",e).single();if(r)throw r;return t}catch(t){return console.error("Erreur chargement projet:",t),null}}async function O(e){try{const{data:t,error:r}=await s.from("projects").insert([e]).select().single();if(r)throw r;return{success:!0,project:t}}catch(t){return console.error("Erreur création projet:",t),{success:!1,error:t.message}}}async function T(e){try{const{error:t}=await s.from("projects").delete().eq("id",e);if(t)throw t;return{success:!0}}catch(t){return console.error("Erreur suppression projet:",t),{success:!1,error:t.message}}}async function M(e,t){try{const r=e.name.split(".").pop(),n=`${t}/${Date.now()}.${r}`,{data:i,error:o}=await s.storage.from("images").upload(n,e);if(o)throw o;const{data:{publicUrl:c}}=s.storage.from("images").getPublicUrl(n);return{success:!0,url:c}}catch(r){return console.error("Erreur upload image:",r),{success:!1,error:r.message}}}async function N(e,t,r,n){try{const{data:i,error:o}=await s.from("project_images").insert([{project_id:e,category_id:t,image_url:r,order_index:n}]).select().single();if(o)throw o;return{success:!0,image:i}}catch(i){return console.error("Erreur ajout image:",i),{success:!1,error:i.message}}}async function H(e){try{const{data:t,error:r}=await s.from("projects").select(`
                *,
                images:project_images!inner(*)
            `).eq("images.category_id",e).order("created_at",{ascending:!1});if(r)throw r;return t}catch(t){return console.error("Erreur filtrage projets:",t),[]}}window.SupabaseAPI={signIn:S,signOut:C,getCurrentUser:_,getCategories:k,getProjects:V,getProjectById:x,createProject:O,deleteProject:T,uploadImage:M,addProjectImage:N,getProjectsByCategory:H};let f=[],b=[];async function E(){try{b=await SupabaseAPI.getCategories(),U(),f=await SupabaseAPI.getProjects(),w(f),lucide.createIcons()}catch(e){console.error("Erreur initialisation home:",e)}}function U(){const e=document.getElementById("category-filters");if(!e)return;let t=`
        <button class="filter-btn active" data-category="all">
            Tous les projets
        </button>
    `;b.forEach(r=>{t+=`
            <button class="filter-btn" data-category="${r.id}">
                ${r.name}
            </button>
        `}),e.innerHTML=t,e.querySelectorAll(".filter-btn").forEach(r=>{r.addEventListener("click",q)})}function q(e){const t=e.target.dataset.category;document.querySelectorAll(".filter-btn").forEach(r=>{r.classList.remove("active")}),e.target.classList.add("active"),z(t)}async function z(e){if(e==="all")w(f);else{const t=f.filter(r=>r.images&&r.images.some(n=>n.category_id===parseInt(e)));w(t)}}function w(e){const t=document.getElementById("projects-grid");if(!t)return;if(e.length===0){t.innerHTML=`
            <div style="grid-column: 1/-1; text-align: center; padding: 3rem; color: var(--color-gray);">
                <p style="font-size: 1.25rem;">Aucun projet trouvé dans cette catégorie</p>
            </div>
        `;return}let r="";e.forEach((n,i)=>{let o="",c=!1;n.images&&n.images[0]&&n.images[0].image_url?o=n.images[0].image_url:(o="placeholder.png",c=!0);const d=n.images?n.images.length:0,u=n.client_type==="Entreprise"?"briefcase":"user";r+=`
            <div class="project-card" data-project-id="${n.id}" style="animation-delay: ${i*.1}s">
                <div class="project-image">
                    <img src="${o}" alt="${n.title}" loading="lazy" ${c?'class="placeholder-img"':""} onerror="this.onerror=null;this.src='placeholder.png';this.classList.add('placeholder-img');">
                </div>
                <div class="project-info">
                    <div class="project-meta">
                        <i data-lucide="${u}" style="width: 16px; height: 16px;"></i>
                        <span>${n.client_type}</span>
                    </div>
                    <h3 class="project-title">${n.title}</h3>
                    <p class="project-description">${n.description}</p>
                    <div class="project-images-count">
                        <i data-lucide="images" style="width: 16px; height: 16px;"></i>
                        <span>${d} image${d>1?"s":""}</span>
                    </div>
                </div>
            </div>
        `}),t.innerHTML=r,t.querySelectorAll(".project-card").forEach(n=>{n.addEventListener("click",F)}),lucide.createIcons()}async function F(e){const t=e.currentTarget,r=parseInt(t.dataset.projectId),n=await SupabaseAPI.getProjectById(r);n&&showProjectView(n)}window.HomeView={init:E,refresh:E};let l=null,a=0;function G(e){l=e,a=0,changeView("project"),p(),lucide.createIcons()}function p(){const e=document.getElementById("project-detail");if(!e||!l)return;const t=l.client_type==="Entreprise"?"briefcase":"user",r=l.images||[],n=r[a];let i=`
        <div class="project-header">
            <div class="project-meta">
                <i data-lucide="${t}"></i>
                <span>${l.client_type}</span>
            </div>
            <h1>${l.title}</h1>
            <p>${l.description}</p>
        </div>
        
        <div class="gallery-main">
            <div class="gallery-image">
                <img src="${n.image_url}" alt="Image ${a+1}">
            </div>
    `;r.length>1&&(i+=`
            <div class="gallery-controls">
                <button class="gallery-btn" id="prev-image">
                    <i data-lucide="chevron-left"></i>
                </button>
                <button class="gallery-btn" id="next-image">
                    <i data-lucide="chevron-right"></i>
                </button>
            </div>
        `,i+='<div class="gallery-indicators">',r.forEach((o,c)=>{i+=`<button class="indicator ${c===a?"active":""}" data-index="${c}"></button>`}),i+="</div>"),i+="</div>",r.length>1&&(i+='<div class="gallery-thumbnails">',r.forEach((o,c)=>{i+=`
                <button class="thumbnail ${c===a?"active":""}" data-index="${c}">
                    <img src="${o.image_url}" alt="Miniature ${c+1}">
                </button>
            `}),i+="</div>"),e.innerHTML=i,r.length>1&&(document.getElementById("prev-image")?.addEventListener("click",P),document.getElementById("next-image")?.addEventListener("click",L),document.querySelectorAll(".indicator").forEach(o=>{o.addEventListener("click",c=>{a=parseInt(c.target.dataset.index),p()})}),document.querySelectorAll(".thumbnail").forEach(o=>{o.addEventListener("click",c=>{const d=c.target.closest(".thumbnail");a=parseInt(d.dataset.index),p()})})),lucide.createIcons()}function P(){if(!l)return;const e=l.images||[];a=a===0?e.length-1:a-1,p()}function L(){if(!l)return;const e=l.images||[];a=a===e.length-1?0:a+1,p()}document.addEventListener("keydown",e=>{currentView==="project"&&(e.key==="ArrowLeft"?P():e.key==="ArrowRight"?L():e.key==="Escape"&&changeView("home"))});window.ProjectView={show:G};let g=[],y=null;async function J(){try{const e=await SupabaseAPI.getCategories();R(e),await h(),D(),lucide.createIcons()}catch(e){console.error("Erreur initialisation admin:",e)}}function R(e){const t=document.getElementById("project-category");if(!t)return;let r="";e.forEach(n=>{r+=`<option value="${n.id}">${n.name}</option>`}),t.innerHTML=r}function D(){const e=document.getElementById("project-images");e&&e.addEventListener("change",Y);const t=document.getElementById("project-logo");t&&t.addEventListener("change",X);const r=document.getElementById("publish-project");r&&r.addEventListener("click",K)}function Y(e){g=Array.from(e.target.files),Z()}function X(e){const t=e.target.files[0];t&&(y=t)}function Z(){const e=document.getElementById("images-preview");e&&(e.innerHTML="",g.forEach((t,r)=>{const n=new FileReader;n.onload=i=>{const o=document.createElement("div");o.className="preview-item",o.innerHTML=`<img src="${i.target.result}" alt="Aperçu ${r+1}">`,e.appendChild(o)},n.readAsDataURL(t)}))}async function K(){const e=document.getElementById("publish-project");if(!e)return;const t=document.getElementById("project-title").value.trim(),r=document.getElementById("project-client-type").value,n=document.getElementById("project-description").value.trim(),i=parseInt(document.getElementById("project-category").value);if(!t||!n){alert("Veuillez remplir tous les champs obligatoires");return}if(g.length===0){alert("Veuillez sélectionner au moins une image");return}e.disabled=!0,e.textContent="Publication en cours...";try{let o="";if(y){const u=await SupabaseAPI.uploadImage(y,"logos");u.success&&(o=u.url)}const c=await SupabaseAPI.createProject({title:t,client_type:r,description:n,logo_url:o});if(!c.success)throw new Error(c.error);const d=c.project.id;for(let u=0;u<g.length;u++){const B=g[u],v=await SupabaseAPI.uploadImage(B,d);v.success&&await SupabaseAPI.addProjectImage(d,i,v.url,u)}Q(),await h(),alert("Projet publié avec succès !")}catch(o){console.error("Erreur publication projet:",o),alert("Erreur lors de la publication du projet: "+o.message)}finally{e.disabled=!1,e.textContent="Publier le projet"}}function Q(){document.getElementById("project-title").value="",document.getElementById("project-client-type").value="Particulier",document.getElementById("project-description").value="",document.getElementById("project-logo").value="",document.getElementById("project-images").value="",document.getElementById("images-preview").innerHTML="",g=[],y=null}async function h(){try{const e=await SupabaseAPI.getProjects();W(e)}catch(e){console.error("Erreur chargement projets admin:",e)}}function W(e){const t=document.getElementById("admin-projects-list");if(!t)return;if(e.length===0){t.innerHTML='<p style="color: var(--color-gray); text-align: center;">Aucun projet pour le moment</p>';return}let r="";e.forEach(n=>{const i=n.images?n.images.length:0;r+=`
            <div class="admin-project-item">
                <div class="admin-project-info">
                    <h3>${n.title}</h3>
                    <p>${n.client_type} • ${i} image${i>1?"s":""}</p>
                </div>
                <button class="btn-delete" data-project-id="${n.id}">
                    <i data-lucide="trash-2"></i>
                </button>
            </div>
        `}),t.innerHTML=r,t.querySelectorAll(".btn-delete").forEach(n=>{n.addEventListener("click",ee)}),lucide.createIcons()}async function ee(e){const t=parseInt(e.currentTarget.dataset.projectId);if(confirm("Êtes-vous sûr de vouloir supprimer ce projet ?"))try{const r=await SupabaseAPI.deleteProject(t);if(r.success)alert("Projet supprimé avec succès"),await h();else throw new Error(r.error)}catch(r){console.error("Erreur suppression projet:",r),alert("Erreur lors de la suppression: "+r.message)}}window.AdminView={init:J,refresh:h};let A="home",I=!1;document.addEventListener("DOMContentLoaded",async()=>{I=!!await SupabaseAPI.getCurrentUser(),await HomeView.init(),te(),lucide.createIcons()});function te(){const e=document.getElementById("admin-btn");e&&e.addEventListener("click",()=>{I?(m("admin"),AdminView.init()):m("login")});const t=document.getElementById("back-btn");t&&t.addEventListener("click",()=>{m("home")});const r=document.getElementById("login-submit");r&&r.addEventListener("click",j);const n=document.getElementById("login-cancel");n&&n.addEventListener("click",()=>{m("home")});const i=document.getElementById("logout-btn");i&&i.addEventListener("click",re);const o=document.getElementById("login-password");o&&o.addEventListener("keypress",c=>{c.key==="Enter"&&j()})}function m(e){document.querySelectorAll(".view").forEach(r=>{r.classList.remove("active")});const t=document.getElementById(`${e}-view`);t&&(t.classList.add("active"),A=e,window.scrollTo(0,0))}async function j(){const e=document.getElementById("login-email").value.trim(),t=document.getElementById("login-password").value;if(!e||!t){alert("Veuillez remplir tous les champs");return}const r=await SupabaseAPI.signIn(e,t);r.success?(I=!0,m("admin"),await AdminView.init(),document.getElementById("login-email").value="",document.getElementById("login-password").value=""):alert("Erreur de connexion: "+r.error)}async function re(){const e=await SupabaseAPI.signOut();e.success?(I=!1,m("home")):alert("Erreur de déconnexion: "+e.error)}window.changeView=m;window.currentView=A;
