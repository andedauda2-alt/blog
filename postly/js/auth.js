/* ========================================
   POSTLY - auth.js
   Auth guard, logout, shared auth helpers
   ======================================== */

/**
 * Call at the top of every protected page.
 * Redirects to login.html if no user is logged in.
 */
function requireAuth() {
  if (!isLoggedIn()) {
    window.location.replace('login.html');
  }
}

/**
 * Call on login.html and register.html.
 * Redirects to feed if user is already logged in.
 */
function redirectIfLoggedIn() {
  if (isLoggedIn()) {
    window.location.replace('index.html');
  }
}

/** Sign the user out and go to login page. */
function logout() {
  logoutUser();
  window.location.replace('login.html');
}

/**
 * Validate a handle string.
 * Allows letters, numbers, underscores, hyphens. 3–20 chars.
 */
function validateHandle(handle) {
  if (!handle || handle.trim().length < 3) return 'Username must be at least 3 characters.';
  if (handle.trim().length > 20)           return 'Username must be 20 characters or less.';
  if (!/^[a-zA-Z0-9_-]+$/.test(handle))   return 'Username can only contain letters, numbers, _ and -.';
  return null;
}

/** Check if a handle is already taken. */
function handleTaken(handle) {
  return getUsers().some(u => u.handle.toLowerCase() === handle.toLowerCase().trim());
}

/** Validate password — min 6 chars. */
function validatePassword(password) {
  if (!password || password.length < 6) return 'Password must be at least 6 characters.';
  return null;
}

/** Show an inline form error message. */
function showFormError(elementId, message) {
  const el = document.getElementById(elementId);
  if (el) { el.textContent = message; el.classList.add('visible'); }
}

/** Clear an inline form error. */
function clearFormError(elementId) {
  const el = document.getElementById(elementId);
  if (el) { el.textContent = ''; el.classList.remove('visible'); }
}

/** Show a field-level input error state. */
function setFieldError(inputId, hasError) {
  const el = document.getElementById(inputId);
  if (el) el.classList.toggle('input-error', hasError);
}
