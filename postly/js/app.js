/* ========================================
   POSTLY - app.js
   Main application bootstrap & home feed
   ======================================== */

document.addEventListener('DOMContentLoaded', () => {
  initializeSampleData();

  const currentUser = getCurrentUser();
  setupUserUI(currentUser);

  renderTrendingTopics();
  renderSuggestedUsers(currentUser);
  setupCreatePost(currentUser);

  const feedEl     = document.getElementById('posts-feed');
  const urlParams  = new URLSearchParams(window.location.search);
  const searchQuery = urlParams.get('search');

  if (searchQuery) {
    document.getElementById('search-input').value = searchQuery;
    handleSearch(searchQuery, feedEl, currentUser);
    document.getElementById('search-results-label').classList.add('visible');
    document.getElementById('search-results-label').textContent = `Search results for "${searchQuery}"`;
    document.getElementById('search-clear-btn').classList.add('visible');
  } else {
    loadFeed(feedEl, currentUser);
  }

  setupSearch(feedEl, currentUser);
  setActiveNav('home');
  setupNavLinks();
});

/* ---- User UI ---- */
function setupUserUI(user) {
  if (!user) return;
  const initials = getInitials(user.displayName);
  const color    = user.avatarColor || getAvatarColor(user.id);

  const sidebarName   = document.getElementById('sidebar-user-name');
  const sidebarHandle = document.getElementById('sidebar-user-handle');
  const sidebarAvatar = document.getElementById('sidebar-user-avatar');
  if (sidebarName)   sidebarName.textContent = user.displayName;
  if (sidebarHandle) sidebarHandle.textContent = `@${user.handle}`;
  if (sidebarAvatar) { sidebarAvatar.textContent = initials; sidebarAvatar.style.background = color; }

  const headerAvatar = document.getElementById('header-avatar');
  if (headerAvatar) { headerAvatar.textContent = initials; headerAvatar.style.background = color; }

  const headerAvatarDesktop = document.getElementById('header-avatar-desktop');
  if (headerAvatarDesktop) { headerAvatarDesktop.textContent = initials; headerAvatarDesktop.style.background = color; }

  const createAvatar = document.getElementById('create-post-avatar');
  if (createAvatar) { createAvatar.textContent = initials; createAvatar.style.background = color; }
}

/* ---- Feed ---- */
function loadFeed(feedEl, currentUser) {
  const sorted = [...getPosts()].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  renderFeed(sorted, feedEl, currentUser);
}

/* ---- Create Post (inline card) ---- */
function setupCreatePost(currentUser) {
  const textarea       = document.getElementById('create-post-textarea');
  const charCounter    = document.getElementById('char-counter');
  const publishBtn     = document.getElementById('publish-btn');
  const imageInput     = document.getElementById('image-upload');
  const imagePreviewWrap = document.getElementById('image-preview-wrap');
  const imagePreviewImg  = document.getElementById('image-preview-img');
  const removeImageBtn   = document.getElementById('remove-image-btn');
  const errorMsg         = document.getElementById('create-post-error');
  const MAX_CHARS = 500;

  let pendingImage = null;
  if (!textarea) return;

  textarea.addEventListener('input', () => {
    textarea.style.height = 'auto';
    textarea.style.height = textarea.scrollHeight + 'px';
    const len       = textarea.value.length;
    const remaining = MAX_CHARS - len;
    charCounter.textContent = remaining;
    charCounter.className = 'char-counter';
    if (remaining <= 50) charCounter.classList.add('warning');
    if (remaining <= 20) charCounter.classList.add('danger');
    if (errorMsg) errorMsg.classList.remove('visible');
  });

  if (imageInput) {
    imageInput.addEventListener('change', async (e) => {
      const file = e.target.files[0];
      if (!file) return;
      try {
        pendingImage = await readImageFile(file);
        imagePreviewImg.src = pendingImage;
        imagePreviewWrap.classList.add('visible');
      } catch (err) { showToast(err.message, 'error'); }
      imageInput.value = '';
    });
  }

  if (removeImageBtn) {
    removeImageBtn.addEventListener('click', () => {
      pendingImage = null;
      imagePreviewWrap.classList.remove('visible');
      imagePreviewImg.src = '';
    });
  }

  if (publishBtn) {
    publishBtn.addEventListener('click', () => {
      const text = textarea.value.trim();
      if (!text && !pendingImage) {
        if (errorMsg) { errorMsg.textContent = 'Post cannot be empty!'; errorMsg.classList.add('visible'); }
        showToast('Post cannot be empty!', 'warning');
        textarea.focus();
        return;
      }
      if (text.length > MAX_CHARS) {
        if (errorMsg) { errorMsg.textContent = `Post too long! Max ${MAX_CHARS} characters.`; errorMsg.classList.add('visible'); }
        showToast('Post is too long!', 'error');
        return;
      }
      if (!currentUser) { showToast('Please log in to post', 'warning'); return; }

      const newPost = {
        id: generateId('p'), authorId: currentUser.id,
        content: text, image: pendingImage || null,
        likes: 0, comments: 0, reposts: 0,
        createdAt: new Date().toISOString(),
        tags: extractTags(text), isRepost: false,
      };
      savePost(newPost);

      const feedEl     = document.getElementById('posts-feed');
      const emptyState = feedEl.querySelector('.empty-state');
      if (emptyState) emptyState.remove();
      const card = buildPostCard(newPost, currentUser);
      if (card) feedEl.prepend(card);

      textarea.value = '';
      textarea.style.height = 'auto';
      charCounter.textContent = MAX_CHARS;
      charCounter.className = 'char-counter';
      pendingImage = null;
      imagePreviewWrap.classList.remove('visible');

      showToast('Post published!', 'success');
      scrollToTop();
    });
  }
}

function extractTags(text) {
  const matches = text.match(/#\w+/g);
  return matches ? [...new Set(matches)] : [];
}

/* ---- Search ---- */
function setupSearch(feedEl, currentUser) {
  const input       = document.getElementById('search-input');
  const clearBtn    = document.getElementById('search-clear-btn');
  const resultsLabel = document.getElementById('search-results-label');
  if (!input) return;

  let debounceTimer;

  input.addEventListener('input', () => {
    const query = input.value.trim();
    clearBtn.classList.toggle('visible', query.length > 0);
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {
      if (query) {
        handleSearch(query, feedEl, currentUser);
        if (resultsLabel) {
          resultsLabel.classList.add('visible');
          resultsLabel.textContent = `Results for "${query}"`;
        }
        history.replaceState(null, '', `?search=${encodeURIComponent(query)}`);
      } else {
        if (resultsLabel) resultsLabel.classList.remove('visible');
        loadFeed(feedEl, currentUser);
        history.replaceState(null, '', window.location.pathname);
      }
    }, 300);
  });

  if (clearBtn) {
    clearBtn.addEventListener('click', () => {
      input.value = '';
      clearBtn.classList.remove('visible');
      if (resultsLabel) resultsLabel.classList.remove('visible');
      loadFeed(feedEl, currentUser);
      history.replaceState(null, '', window.location.pathname);
      input.focus();
    });
  }
}

function handleSearch(query, feedEl, currentUser) {
  const q     = query.toLowerCase();
  const users = getUsers();
  const results = getPosts().filter(post => {
    if (post.content.toLowerCase().includes(q)) return true;
    if (post.tags && post.tags.some(t => t.toLowerCase().includes(q))) return true;
    const author = users.find(u => u.id === post.authorId);
    if (author) {
      if (author.displayName.toLowerCase().includes(q)) return true;
      if (author.handle.toLowerCase().includes(q)) return true;
    }
    return false;
  }).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  renderFeed(results, feedEl, currentUser, `No results for "${query}"`);
}

/* ---- Trending Topics ---- */
function renderTrendingTopics() {
  const container = document.getElementById('trending-topics');
  if (!container) return;

  container.innerHTML = TRENDING_TOPICS.map(t => `
    <div class="trending-item" tabindex="0" role="button" aria-label="Search ${t.topic}"
      onclick="searchTopic('${t.topic.replace('#', '')}')">
      <span class="trending-category">${escapeHtml(t.category)}</span>
      <span class="trending-topic">${escapeHtml(t.topic)}</span>
      <span class="trending-count">${escapeHtml(t.count)}</span>
    </div>
  `).join('');
}

function searchTopic(tag) {
  const searchInput = document.getElementById('search-input');
  if (searchInput) {
    searchInput.value = tag;
    searchInput.dispatchEvent(new Event('input'));
  }
}

/* ---- Suggested Users ---- */
function renderSuggestedUsers(currentUser) {
  const container = document.getElementById('suggested-users');
  if (!container) return;

  const users = getUsers().filter(u => !currentUser || u.id !== currentUser.id).slice(0, 4);

  container.innerHTML = users.map(user => {
    const color     = user.avatarColor || getAvatarColor(user.id);
    const initials  = getInitials(user.displayName);
    const following = currentUser ? isFollowing(currentUser.id, user.id) : false;
    return `
      <div class="suggested-user">
        <a href="profile.html?user=${user.id}" class="suggested-user-avatar"
          style="background:${color};text-decoration:none;border-radius:50%;display:flex;align-items:center;justify-content:center;color:white;font-weight:700;font-size:14px"
          aria-label="${escapeHtml(user.displayName)}">${initials}</a>
        <div class="suggested-user-info">
          <a href="profile.html?user=${user.id}" class="suggested-user-name"
            style="text-decoration:none;color:inherit">${escapeHtml(user.displayName)}</a>
          <div class="suggested-user-bio">${escapeHtml(user.bio.substring(0, 50))}...</div>
        </div>
        <button class="follow-btn ${following ? 'following' : ''}"
          data-user-id="${user.id}"
          aria-label="${following ? 'Unfollow' : 'Follow'} ${escapeHtml(user.displayName)}">
          ${following ? 'Following' : 'Follow'}
        </button>
      </div>`;
  }).join('');

  container.querySelectorAll('.follow-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      if (!currentUser) { showToast('Log in to follow users', 'warning'); return; }
      const targetId     = btn.dataset.userId;
      const nowFollowing = toggleFollow(currentUser.id, targetId);
      btn.textContent = nowFollowing ? 'Following' : 'Follow';
      btn.classList.toggle('following', nowFollowing);
      btn.setAttribute('aria-label', `${nowFollowing ? 'Unfollow' : 'Follow'} user`);
      showToast(nowFollowing ? 'Now following!' : 'Unfollowed', nowFollowing ? 'success' : 'info', 2000);
    });
  });
}

/* ---- Nav link setup ---- */
function setupNavLinks() {
  document.querySelectorAll('button[data-page]').forEach(el => {
    el.addEventListener('click', () => {
      const page   = el.dataset.page;
      const routes = { home: 'index.html', create: 'create.html', profile: 'profile.html' };
      if (routes[page]) {
        window.location.href = routes[page];
      } else if (page === 'notifications') {
        showToast('Notifications coming soon!', 'info');
      } else if (page === 'explore') {
        const searchInput     = document.getElementById('search-input');
        const searchContainer = document.querySelector('.search-bar-container');
        if (searchInput) {
          searchInput.focus();
          if (searchContainer) searchContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }
    });
  });
}
