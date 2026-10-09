/* ========================================
   POSTLY - ui.js
   Toast notifications, modals, DOM helpers
   ======================================== */

/* ---- Toast Notifications ---- */
function showToast(message, type = 'info', duration = 3500) {
  let container = document.getElementById('toast-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toast-container';
    container.className = 'toast-container';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  toast.className = `toast ${type}`;

  // SVG icons for toast types
  const toastIcons = {
    success: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>`,
    error:   `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>`,
    info:    `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>`,
    warning: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>`,
  };

  toast.innerHTML = `<span class="toast-icon">${toastIcons[type] || toastIcons.info}</span><span>${message}</span>`;
  container.appendChild(toast);

  const removeToast = () => {
    toast.classList.add('removing');
    toast.addEventListener('animationend', () => toast.remove(), { once: true });
  };

  const timer = setTimeout(removeToast, duration);
  toast.addEventListener('click', () => { clearTimeout(timer); removeToast(); });
}

/* ---- Modal Management ---- */
function openModal(modalId) {
  const overlay = document.getElementById(modalId);
  if (overlay) {
    overlay.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
    const focusable = overlay.querySelector('button, input, textarea, [tabindex]');
    if (focusable) setTimeout(() => focusable.focus(), 100);
  }
}

function closeModal(modalId) {
  const overlay = document.getElementById(modalId);
  if (overlay) {
    overlay.classList.add('hidden');
    document.body.style.overflow = '';
  }
}

function closeAllModals() {
  document.querySelectorAll('.modal-overlay').forEach(m => m.classList.add('hidden'));
  document.body.style.overflow = '';
}

document.addEventListener('click', (e) => {
  if (e.target.classList.contains('modal-overlay')) closeAllModals();
});

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeAllModals();
});

/* ---- Dropdown menus ---- */
let activeDropdown = null;

function openDropdown(triggerEl, items) {
  closeDropdown();

  const dropdown = document.createElement('div');
  dropdown.className = 'dropdown';
  dropdown.setAttribute('role', 'menu');

  items.forEach(item => {
    const btn = document.createElement('button');
    btn.className = `dropdown-item ${item.danger ? 'danger' : ''}`;
    btn.setAttribute('role', 'menuitem');
    // item.icon is already an SVG string from icons.js
    btn.innerHTML = `<span class="dropdown-item-icon">${item.icon || ''}</span><span>${item.label}</span>`;
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      closeDropdown();
      item.action();
    });
    dropdown.appendChild(btn);
  });

  const parent = triggerEl.parentElement;
  parent.style.position = 'relative';
  parent.appendChild(dropdown);
  activeDropdown = dropdown;

  setTimeout(() => {
    document.addEventListener('click', closeDropdown, { once: true });
  }, 0);
}

function closeDropdown() {
  if (activeDropdown) {
    activeDropdown.remove();
    activeDropdown = null;
  }
}

/* ---- Time formatting ---- */
function formatTime(isoString) {
  const date = new Date(isoString);
  const now = new Date();
  const diff = Math.floor((now - date) / 1000);
  if (diff < 60) return 'Just now';
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  if (diff < 604800) return `${Math.floor(diff / 86400)}d ago`;
  return date.toLocaleDateString('en-US', {
    month: 'short', day: 'numeric',
    year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined,
  });
}

function formatFullDate(isoString) {
  return new Date(isoString).toLocaleDateString('en-US', {
    weekday: 'short', year: 'numeric', month: 'long',
    day: 'numeric', hour: '2-digit', minute: '2-digit',
  });
}

/* ---- Number formatting ---- */
function formatCount(n) {
  if (n >= 1000000) return (n / 1000000).toFixed(1).replace(/\.0$/, '') + 'M';
  if (n >= 1000) return (n / 1000).toFixed(1).replace(/\.0$/, '') + 'K';
  return String(n);
}

/* ---- Generate unique ID ---- */
function generateId(prefix = '') {
  return `${prefix}${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}

/* ---- Escape HTML ---- */
function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

/* ---- Set active nav item ---- */
function setActiveNav(page) {
  document.querySelectorAll('.nav-item, .bottom-nav-item').forEach(el => {
    el.classList.remove('active');
    if (el.dataset.page === page) el.classList.add('active');
  });
}

/* ---- Scroll to top ---- */
function scrollToTop() {
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

/* ---- Image read helper ---- */
function readImageFile(file) {
  return new Promise((resolve, reject) => {
    if (!file || !file.type.startsWith('image/')) {
      reject(new Error('Invalid file type'));
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      reject(new Error('Image too large (max 5MB)'));
      return;
    }
    const reader = new FileReader();
    reader.onload = e => resolve(e.target.result);
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsDataURL(file);
  });
}

/* ---- Copy to clipboard ---- */
async function copyToClipboard(text) {
  try {
    if (navigator.clipboard) {
      await navigator.clipboard.writeText(text);
    } else {
      const el = document.createElement('textarea');
      el.value = text;
      el.style.position = 'fixed';
      el.style.opacity = '0';
      document.body.appendChild(el);
      el.select();
      document.execCommand('copy');
      document.body.removeChild(el);
    }
    return true;
  } catch {
    return false;
  }
}

/* ---- Update notification badge ---- */
function updateNotificationBadge(count) {
  document.querySelectorAll('.notif-badge').forEach(b => {
    if (count > 0) {
      b.textContent = count > 9 ? '9+' : count;
      b.classList.remove('hidden');
    } else {
      b.classList.add('hidden');
    }
  });
}
