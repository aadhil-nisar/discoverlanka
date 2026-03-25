/* ============================================================
   auth.js — DiscoverLanka Frontend Auth System v2
   Handles: Login, Signup modals, Session persistence, Navbar
   The dedicated Sign In page is signin.html
   ============================================================ */

const AUTH_API = 'backend/api';

// ── STATE ─────────────────────────────────────────────────────
let currentUser = null;

// ── TOKEN HELPERS ─────────────────────────────────────────────
function saveSession(user, token) {
  localStorage.setItem('dl_user',  JSON.stringify(user));
  localStorage.setItem('dl_token', token);
  currentUser = user;
}

function clearSession() {
  localStorage.removeItem('dl_user');
  localStorage.removeItem('dl_token');
  currentUser = null;
}

function getToken() { return localStorage.getItem('dl_token') || ''; }

function getSavedUser() {
  try { return JSON.parse(localStorage.getItem('dl_user')); }
  catch { return null; }
}

// ── API HELPER ────────────────────────────────────────────────
async function apiCall(endpoint, method = 'GET', body = null) {
  const opts = {
    method,
    headers: { 'Content-Type': 'application/json', 'X-Auth-Token': getToken() },
  };
  if (body) opts.body = JSON.stringify(body);
  const res = await fetch(`${AUTH_API}/${endpoint}`, opts);
  return res.json();
}

// ── INITIALS HELPER ───────────────────────────────────────────
function getInitials(user) {
  if (!user) return '?';
  return ((user.first_name?.[0] || '') + (user.last_name?.[0] || '')).toUpperCase();
}

// ── NAVBAR AUTH UI ────────────────────────────────────────────
function buildNavAuthHTML() {
  return `
    <div class="nav-auth" id="navAuth">
      <a href="signin.html" class="nav-auth-btn nav-signin-page-btn">
        <i class="fas fa-user"></i> Sign In
      </a>
    </div>
  `;
}

function buildNavUserHTML(user) {
  const initials  = getInitials(user);
  const fullName  = `${user.first_name} ${user.last_name}`;
  const avatarHTML = user.avatar_url
    ? `<img src="${user.avatar_url}" alt="${fullName}" />`
    : initials;

  return `
    <div class="nav-auth" id="navAuth">
      <div class="nav-user-wrap" id="navUserWrap">
        <button class="nav-user-btn" id="navUserBtn">
          <div class="nav-user-avatar">${avatarHTML}</div>
          <span>${user.first_name}</span>
          <i class="fas fa-angle-down" style="font-size:0.8rem;opacity:0.75"></i>
        </button>
        <div class="nav-user-dropdown" id="navUserDropdown">
          <div class="nav-user-dropdown-head">
            <strong>${fullName}</strong>
            <span>${user.email}</span>
          </div>
          <a href="profile.html" class="nav-dropdown-link">
            <i class="fas fa-user-circle"></i> My Profile
          </a>
          <a href="profile.html#itineraries" class="nav-dropdown-link">
            <i class="fas fa-map-location-dot"></i> Saved Itineraries
          </a>
          <a href="profile.html#reviews" class="nav-dropdown-link">
            <i class="fas fa-star"></i> My Reviews
          </a>
          <div class="nav-dropdown-divider"></div>
          <button class="nav-dropdown-link logout-link" id="navLogoutBtn">
            <i class="fas fa-right-from-bracket"></i> Log Out
          </button>
        </div>
      </div>
    </div>
  `;
}

function injectNavAuth(user) {
  const navContainer = document.querySelector('.nav-container');
  if (!navContainer) return;

  // Hide the static "Sign In" nav link when user is logged in
  document.querySelectorAll('.nav-signin-link').forEach(el => {
    el.style.display = user ? 'none' : '';
  });

  const existing = document.getElementById('navAuth');
  if (existing) existing.remove();

  const html = user ? buildNavUserHTML(user) : buildNavAuthHTML();
  navContainer.insertAdjacentHTML('beforeend', html);

  if (user) {
    const userWrap  = document.getElementById('navUserWrap');
    const userBtn   = document.getElementById('navUserBtn');
    const logoutBtn = document.getElementById('navLogoutBtn');

    userBtn?.addEventListener('click', (e) => {
      e.stopPropagation();
      userWrap.classList.toggle('open');
    });
    document.addEventListener('click', () => userWrap?.classList.remove('open'));
    logoutBtn?.addEventListener('click', handleLogout);
  }
}

// ── LOGOUT ────────────────────────────────────────────────────
async function handleLogout() {
  try { await apiCall('auth.php?action=logout', 'POST'); } catch {}
  clearSession();
  injectNavAuth(null);
  showAuthToast('You have been logged out. See you soon!');
  onLogoutSuccess();
}

// ── TOAST ─────────────────────────────────────────────────────
function showAuthToast(message, isError = false) {
  const existing = document.getElementById('authToast');
  if (existing) existing.remove();
  const toast = document.createElement('div');
  toast.id = 'authToast';
  toast.style.cssText = `
    position:fixed;bottom:28px;right:28px;z-index:99999;
    background:${isError ? 'linear-gradient(135deg,#b4232f,#e63946)' : 'linear-gradient(135deg,#2d6a4f,#52b788)'};
    color:#fff;padding:14px 22px;border-radius:16px;
    font-family:inherit;font-size:0.95rem;font-weight:600;
    box-shadow:0 14px 30px rgba(0,0,0,0.2);
    display:flex;align-items:center;gap:10px;
    animation:slideUpToast 0.35s ease;max-width:340px;line-height:1.4;
  `;
  toast.innerHTML = `<i class="fas fa-${isError ? 'circle-xmark' : 'circle-check'}"></i> ${message}`;
  document.body.appendChild(toast);
  setTimeout(() => {
    toast.style.opacity = '0'; toast.style.transition = 'opacity 0.4s';
    setTimeout(() => toast.remove(), 400);
  }, 3500);
}

if (!document.getElementById('authToastStyle')) {
  const style = document.createElement('style');
  style.id = 'authToastStyle';
  style.textContent = `@keyframes slideUpToast{from{transform:translateY(20px);opacity:0}to{transform:translateY(0);opacity:1}}
  .nav-auth-btn.nav-signin-page-btn{display:inline-flex;align-items:center;gap:6px;padding:7px 18px;border-radius:50px;background:linear-gradient(135deg,#2d6a4f,#52b788);color:#fff!important;font-weight:600;font-size:0.9rem;text-decoration:none;border:none;cursor:pointer;transition:opacity 0.2s;}
  .nav-auth-btn.nav-signin-page-btn:hover{opacity:0.85;}`;
  document.head.appendChild(style);
}

// ── CALLBACKS ─────────────────────────────────────────────────
function onLoginSuccess(user) {}
function onLogoutSuccess() {
  const protectedPages = ['profile.html'];
  const page = window.location.pathname.split('/').pop();
  if (protectedPages.includes(page)) window.location.href = 'index.html';
}

// ── INIT ──────────────────────────────────────────────────────
async function initAuth() {
  const saved = getSavedUser();
  if (saved) {
    currentUser = saved;
    injectNavAuth(saved);
    try {
      const data = await apiCall('auth.php?action=me', 'GET');
      if (data.success) {
        saveSession(data.user, getToken());
        currentUser = data.user;
        injectNavAuth(data.user);
      } else {
        clearSession();
        injectNavAuth(null);
      }
    } catch {}
  } else {
    injectNavAuth(null);
  }
}

// ── SAVE ITINERARY ────────────────────────────────────────────
async function saveItineraryToAccount(title, type, data) {
  if (!currentUser) {
    window.location.href = 'signin.html';
    return false;
  }
  const res = await apiCall('itineraries.php', 'POST', { title, type, data });
  if (res.success) {
    showAuthToast('Itinerary saved to your profile! 🗺️');
    return true;
  } else {
    showAuthToast(res.message || 'Could not save itinerary.', true);
    return false;
  }
}

// ── GLOBAL EXPORTS ────────────────────────────────────────────
window.openAuthModal   = () => { window.location.href = 'signin.html'; };
window.closeAuthModal  = () => {};
window.saveItinerary   = saveItineraryToAccount;
window.currentAuthUser = () => currentUser;
window.showAuthToast   = showAuthToast;
window.handleLogout    = handleLogout;

document.addEventListener('DOMContentLoaded', initAuth);
