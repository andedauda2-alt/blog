/* ========================================
   POSTLY - posts.js
   Post rendering, feed management
   ======================================== */

/* ---- Build single post card ---- */
function buildPostCard(post, currentUser) {
  const author = getUserById(post.authorId);
  if (!author) return null;

  const liked    = currentUser ? hasLiked(post.id, currentUser.id) : false;
  const reposted = currentUser ? hasReposted(post.id, currentUser.id) : false;
  const isOwn    = currentUser && post.authorId === currentUser.id;
  const isOriginalRepost = post.isRepost && post.originalPostId;

  const allPosts = getPosts();
  const livePost = allPosts.find(p => p.id === post.id) || post;

  const article = document.createElement('article');
  article.className = `post-card${post.isRepost ? ' repost-card' : ''}`;
  article.dataset.postId = post.id;
  article.setAttribute('role', 'article');

  const avatarColor = author.avatarColor || getAvatarColor(author.id);
  const initials    = getInitials(author.displayName);

  // Repost label
  let repostLabelHTML = '';
  if (isOriginalRepost) {
    const reposter = getUserById(post.reposterUserId) || currentUser;
    repostLabelHTML = `
      <div class="repost-label">
        <span class="icon">${icon('repeat', {size: 13})}</span>
        <span>${escapeHtml(reposter ? reposter.displayName : 'Someone')} reposted</span>
      </div>`;
  }

  // Post image
  const postImageHTML = livePost.image
    ? `<div class="post-image"><img src="${livePost.image}" alt="Post image" loading="lazy" onerror="this.parentElement.style.display='none'"></div>`
    : '';

  // Tags
  const tagsHTML = livePost.tags && livePost.tags.length
    ? `<div class="post-tags">${livePost.tags.map(t => `<span class="post-tag">${escapeHtml(t)}</span>`).join('')}</div>`
    : '';

  // Embedded original post (quote repost)
  let embedHTML = '';
  if (isOriginalRepost && post.originalPostId) {
    const origPost   = getPostById(post.originalPostId);
    if (origPost) {
      const origAuthor = getUserById(origPost.authorId);
      if (origAuthor) {
        const origInitials = getInitials(origAuthor.displayName);
        const origColor    = origAuthor.avatarColor || getAvatarColor(origAuthor.id);
        embedHTML = `
          <div class="original-post-embed" data-post-id="${origPost.id}">
            <div style="display:flex;align-items:center;gap:8px;margin-bottom:8px">
              <div style="width:28px;height:28px;background:${origColor};font-size:11px;border-radius:50%;display:flex;align-items:center;justify-content:center;color:white;font-weight:700;flex-shrink:0">${origInitials}</div>
              <div>
                <span style="font-size:13px;font-weight:600;color:var(--color-text-primary)">${escapeHtml(origAuthor.displayName)}</span>
                <span style="margin-left:6px;color:var(--color-text-muted);font-size:12px">@${escapeHtml(origAuthor.handle)}</span>
              </div>
            </div>
            <p style="font-size:13px;color:var(--color-text-secondary);line-height:1.5;word-break:break-word">${escapeHtml(origPost.content)}</p>
          </div>`;
      }
    }
  }

  const commentCount = getCommentsByPost(post.id).length;
  const cuColor = currentUser ? (currentUser.avatarColor || getAvatarColor(currentUser.id)) : '#6c63ff';
  const cuInitials = currentUser ? getInitials(currentUser.displayName) : '?';

  article.innerHTML = `
    ${repostLabelHTML}
    <div class="post-header">
      <div class="post-author">
        <a href="profile.html?user=${author.id}" class="post-avatar"
          style="background:${avatarColor};width:44px;height:44px;border-radius:50%;display:flex;align-items:center;justify-content:center;color:white;font-weight:700;font-size:16px;flex-shrink:0;text-decoration:none"
          aria-label="${escapeHtml(author.displayName)}">${initials}</a>
        <div class="post-author-info">
          <a href="profile.html?user=${author.id}" class="display-name" style="text-decoration:none;color:inherit">${escapeHtml(author.displayName)}</a>
          <div class="username">@${escapeHtml(author.handle)}<span>&nbsp;&middot;&nbsp;</span>${formatTime(livePost.createdAt)}</div>
        </div>
      </div>
      <div style="position:relative">
        <button class="post-menu-btn" aria-label="Post options" title="More options">${icon('moreHorizontal')}</button>
      </div>
    </div>

    <div class="post-body">
      <p>${escapeHtml(livePost.content)}</p>
      ${tagsHTML}
      ${postImageHTML}
      ${embedHTML}
    </div>

    <div class="post-actions">
      <button class="action-btn like-btn ${liked ? 'liked' : ''}" aria-label="${liked ? 'Unlike' : 'Like'} post" aria-pressed="${liked}">
        <span class="action-icon">${liked ? icon('heartFilled') : icon('heart')}</span>
        <span class="like-count">${formatCount(livePost.likes)}</span>
      </button>
      <button class="action-btn comment-btn" aria-label="Comment on post">
        <span class="action-icon">${icon('messageCircle')}</span>
        <span class="comment-count">${formatCount(commentCount)}</span>
      </button>
      <button class="action-btn repost-btn ${reposted ? 'reposted' : ''}" aria-label="Repost" aria-pressed="${reposted}">
        <span class="action-icon">${icon('repeat')}</span>
        <span class="repost-count">${formatCount(livePost.reposts)}</span>
      </button>
      <button class="action-btn share-btn" aria-label="Share post">
        <span class="action-icon">${icon('share')}</span>
        <span>Share</span>
      </button>
    </div>

    <div class="comments-section" style="display:none">
      <div class="comments-list"></div>
      <div class="comment-input-wrap">
        <div class="comment-avatar"
          style="background:${cuColor};width:34px;height:34px;border-radius:50%;display:flex;align-items:center;justify-content:center;color:white;font-weight:700;font-size:12px;flex-shrink:0">
          ${cuInitials}
        </div>
        <textarea class="comment-input" placeholder="Add a comment..." rows="1"
          aria-label="Write a comment" maxlength="280"></textarea>
        <button class="comment-submit-btn" aria-label="Post comment">${icon('send')}</button>
      </div>
    </div>`;

  attachPostEvents(article, livePost, currentUser, isOwn);
  return article;
}

/* ---- Attach post event listeners ---- */
function attachPostEvents(article, post, currentUser, isOwn) {
  // Navigate to post detail on card body click
  article.addEventListener('click', (e) => {
    if (e.target.closest('button') || e.target.closest('a') ||
        e.target.closest('.comments-section') || e.target.closest('.post-tag')) return;
    window.location.href = `post.html?id=${post.id}`;
  });

  // Post menu
  const menuBtn = article.querySelector('.post-menu-btn');
  menuBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    const menuItems = [];
    if (isOwn) {
      menuItems.push({ icon: icon('pencil'), label: 'Edit post', action: () => editPost(post.id) });
      menuItems.push({ icon: icon('trash'),  label: 'Delete post', danger: true, action: () => confirmDeletePost(post.id, article) });
    }
    menuItems.push({ icon: icon('link'),     label: 'Copy link',  action: () => sharePost(post, 'copy') });
    menuItems.push({ icon: icon('bookmark'), label: 'Bookmark',   action: () => showToast('Bookmarked!', 'success') });
    openDropdown(menuBtn, menuItems);
  });

  // Like
  article.querySelector('.like-btn').addEventListener('click', (e) => {
    e.stopPropagation();
    if (!currentUser) { showToast('Please log in to like posts', 'warning'); return; }
    handleLike(post.id, currentUser.id, article.querySelector('.like-btn'));
  });

  // Comment toggle
  const commentBtn     = article.querySelector('.comment-btn');
  const commentsSection = article.querySelector('.comments-section');
  commentBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    const isOpen = commentsSection.style.display !== 'none';
    commentsSection.style.display = isOpen ? 'none' : 'block';
    if (!isOpen) {
      renderComments(post.id, commentsSection.querySelector('.comments-list'), currentUser);
      commentsSection.querySelector('.comment-input').focus();
    }
  });

  // Submit comment
  const commentInput  = article.querySelector('.comment-input');
  const commentSubmit = article.querySelector('.comment-submit-btn');
  const submitComment = () => {
    const text = commentInput.value.trim();
    if (!text) return;
    if (!currentUser) { showToast('Please log in to comment', 'warning'); return; }
    handleAddComment(post.id, text, currentUser, article);
    commentInput.value = '';
  };
  commentSubmit.addEventListener('click', (e) => { e.stopPropagation(); submitComment(); });
  commentInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); submitComment(); }
  });

  // Repost
  article.querySelector('.repost-btn').addEventListener('click', (e) => {
    e.stopPropagation();
    if (!currentUser) { showToast('Please log in to repost', 'warning'); return; }
    openRepostModal(post, currentUser);
  });

  // Share
  article.querySelector('.share-btn').addEventListener('click', (e) => {
    e.stopPropagation();
    openShareModal(post);
  });

  // Tag search
  article.querySelectorAll('.post-tag').forEach(tag => {
    tag.addEventListener('click', (e) => {
      e.stopPropagation();
      window.location.href = `index.html?search=${encodeURIComponent(tag.textContent.replace('#', ''))}`;
    });
  });

  // Embedded original post click
  const embed = article.querySelector('.original-post-embed');
  if (embed) {
    embed.addEventListener('click', (e) => {
      e.stopPropagation();
      const pid = embed.dataset.postId;
      if (pid) window.location.href = `post.html?id=${pid}`;
    });
  }
}

/* ---- Like handler ---- */
function handleLike(postId, userId, likeBtn) {
  const liked = toggleLike(postId, userId);

  const posts = getPosts();
  const post  = posts.find(p => p.id === postId);
  if (post) {
    post.likes = liked ? post.likes + 1 : Math.max(0, post.likes - 1);
    savePosts(posts);
  }

  const likeIcon  = likeBtn.querySelector('.action-icon');
  const likeCount = likeBtn.querySelector('.like-count');
  likeIcon.innerHTML = liked ? icon('heartFilled') : icon('heart');
  likeBtn.classList.toggle('liked', liked);
  likeBtn.setAttribute('aria-pressed', liked);
  likeBtn.setAttribute('aria-label', liked ? 'Unlike post' : 'Like post');
  if (post) likeCount.textContent = formatCount(post.likes);

  showToast(liked ? 'Post liked' : 'Post unliked', liked ? 'success' : 'info', 2000);
}

/* ---- Comment rendering ---- */
function renderComments(postId, listEl, currentUser) {
  const comments = getCommentsByPost(postId);
  listEl.innerHTML = '';

  if (comments.length === 0) {
    listEl.innerHTML = `
      <div class="empty-state" style="padding:20px 10px">
        <div class="empty-state-icon" style="font-size:32px">${icon('messageCircle', {size:32})}</div>
        <p>No comments yet. Be the first!</p>
      </div>`;
    return;
  }

  comments.forEach(comment => {
    const el = buildCommentEl(comment, currentUser);
    listEl.appendChild(el);
  });
}

function buildCommentEl(comment, currentUser) {
  const author = getUserById(comment.authorId);
  if (!author) return document.createElement('div');

  const isOwn       = currentUser && comment.authorId === currentUser.id;
  const avatarColor = author.avatarColor || getAvatarColor(author.id);

  const div = document.createElement('div');
  div.className = 'comment-item';
  div.dataset.commentId = comment.id;

  div.innerHTML = `
    <div class="comment-avatar" style="background:${avatarColor}">${getInitials(author.displayName)}</div>
    <div class="comment-content">
      <div class="comment-header">
        <span class="comment-author">${escapeHtml(author.displayName)}</span>
        <span class="comment-time">${formatTime(comment.createdAt)}</span>
      </div>
      <p class="comment-text">${escapeHtml(comment.text)}</p>
      ${isOwn ? `<button class="comment-delete-btn" aria-label="Delete comment">Delete</button>` : ''}
    </div>`;

  if (isOwn) {
    div.querySelector('.comment-delete-btn').addEventListener('click', (e) => {
      e.stopPropagation();
      handleDeleteComment(comment.id, comment.postId, div);
    });
  }
  return div;
}

/* ---- Add comment ---- */
function handleAddComment(postId, text, currentUser, postArticle) {
  const comment = {
    id: generateId('c'), postId,
    authorId: currentUser.id, text,
    createdAt: new Date().toISOString(),
  };
  addComment(comment);

  const posts = getPosts();
  const post  = posts.find(p => p.id === postId);
  if (post) { post.comments = (post.comments || 0) + 1; savePosts(posts); }

  const countEl = postArticle.querySelector('.comment-count');
  if (countEl && post) countEl.textContent = formatCount(post.comments);

  const listEl = postArticle.querySelector('.comments-list');
  if (listEl) renderComments(postId, listEl, currentUser);

  showToast('Comment added', 'success');
}

/* ---- Delete comment ---- */
function handleDeleteComment(commentId, postId, commentEl) {
  if (!confirm('Delete this comment?')) return;
  deleteComment(commentId);

  const posts = getPosts();
  const post  = posts.find(p => p.id === postId);
  if (post) { post.comments = Math.max(0, (post.comments || 1) - 1); savePosts(posts); }

  commentEl.remove();
  showToast('Comment deleted', 'info', 2000);
}

/* ---- Edit / Delete post ---- */
function editPost(postId) {
  window.location.href = `create.html?edit=${postId}`;
}

function confirmDeletePost(postId, articleEl) {
  if (!confirm('Are you sure you want to delete this post?')) return;
  deletePost(postId);
  articleEl.style.transition = 'opacity 0.3s ease, transform 0.3s ease, max-height 0.4s ease, margin 0.3s ease, padding 0.3s ease';
  articleEl.style.overflow = 'hidden';
  articleEl.style.maxHeight = articleEl.offsetHeight + 'px';
  requestAnimationFrame(() => {
    articleEl.style.opacity = '0';
    articleEl.style.transform = 'scale(0.97)';
    articleEl.style.maxHeight = '0';
    articleEl.style.marginBottom = '0';
    articleEl.style.padding = '0';
  });
  setTimeout(() => articleEl.remove(), 420);
  showToast('Post deleted', 'info', 2000);
}

/* ---- Repost Modal ---- */
function openRepostModal(post, currentUser) {
  let existing = document.getElementById('repost-modal-overlay');
  if (existing) existing.remove();

  const author     = getUserById(post.authorId);
  const authorName = author ? escapeHtml(author.displayName) : 'Unknown';

  const overlay = document.createElement('div');
  overlay.id = 'repost-modal-overlay';
  overlay.className = 'modal-overlay';
  overlay.setAttribute('role', 'dialog');
  overlay.setAttribute('aria-modal', 'true');
  overlay.setAttribute('aria-labelledby', 'repost-modal-title');

  overlay.innerHTML = `
    <div class="modal">
      <div class="modal-header">
        <h2 id="repost-modal-title">Repost</h2>
        <button class="modal-close-btn" aria-label="Close">${icon('xLarge')}</button>
      </div>
      <div class="modal-body">
        <div class="repost-options">
          <button class="repost-option-btn" id="repost-direct-btn">
            <span class="repost-option-icon">${icon('repeat', {size: 22})}</span>
            <div class="repost-option-info">
              <div class="repost-option-title">Repost</div>
              <div class="repost-option-desc">Share this post to your feed instantly</div>
            </div>
          </button>
          <button class="repost-option-btn" id="repost-quote-btn">
            <span class="repost-option-icon">${icon('quoteRepost', {size: 22})}</span>
            <div class="repost-option-info">
              <div class="repost-option-title">Quote Post</div>
              <div class="repost-option-desc">Add your own thoughts before sharing</div>
            </div>
          </button>
        </div>
        <div class="quote-post-compose" id="quote-compose">
          <textarea placeholder="Add your thoughts..." maxlength="400" rows="3" aria-label="Quote post text"></textarea>
          <div class="quoted-original-preview">
            <strong>${authorName}</strong> &middot; @${author ? escapeHtml(author.handle) : ''}<br>
            <span style="font-size:13px">${escapeHtml(post.content.substring(0, 120))}${post.content.length > 120 ? '...' : ''}</span>
          </div>
          <div style="display:flex;justify-content:flex-end">
            <button class="btn btn-primary" id="quote-submit-btn">
              ${icon('send', {size: 14})} Quote &amp; Post
            </button>
          </div>
        </div>
      </div>
    </div>`;

  document.body.appendChild(overlay);

  overlay.querySelector('.modal-close-btn').addEventListener('click', () => overlay.remove());
  overlay.addEventListener('click', (e) => { if (e.target === overlay) overlay.remove(); });

  overlay.querySelector('#repost-direct-btn').addEventListener('click', () => {
    handleDirectRepost(post, currentUser);
    overlay.remove();
  });

  overlay.querySelector('#repost-quote-btn').addEventListener('click', () => {
    overlay.querySelector('#quote-compose').classList.add('visible');
    overlay.querySelector('#repost-quote-btn').style.display = 'none';
    overlay.querySelector('#repost-direct-btn').style.display = 'none';
    overlay.querySelector('textarea').focus();
  });

  overlay.querySelector('#quote-submit-btn').addEventListener('click', () => {
    const quoteText = overlay.querySelector('textarea').value.trim();
    if (!quoteText) { showToast('Please add your thoughts', 'warning'); return; }
    handleQuoteRepost(post, currentUser, quoteText);
    overlay.remove();
  });
}

function handleDirectRepost(post, currentUser) {
  if (hasReposted(post.id, currentUser.id)) { showToast('Already reposted', 'info', 2000); return; }
  addRepost(post.id, currentUser.id);

  const repostPost = {
    id: generateId('rp'), authorId: currentUser.id,
    reposterUserId: currentUser.id, content: post.content,
    image: post.image, likes: 0, comments: 0, reposts: 0,
    createdAt: new Date().toISOString(), tags: post.tags || [],
    isRepost: true, originalPostId: post.id,
  };
  savePost(repostPost);

  const posts = getPosts();
  const orig  = posts.find(p => p.id === post.id);
  if (orig) { orig.reposts = (orig.reposts || 0) + 1; savePosts(posts); }

  document.querySelectorAll(`[data-post-id="${post.id}"] .repost-btn`).forEach(btn => {
    btn.classList.add('reposted');
    btn.setAttribute('aria-pressed', 'true');
    const countEl = btn.querySelector('.repost-count');
    if (countEl && orig) countEl.textContent = formatCount(orig.reposts);
  });

  showToast('Post reposted', 'success');

  const feed = document.getElementById('posts-feed');
  if (feed) {
    const cu   = getCurrentUser();
    const card = buildPostCard(repostPost, cu);
    if (card) feed.prepend(card);
  }
}

function handleQuoteRepost(post, currentUser, quoteText) {
  addRepost(post.id, currentUser.id);

  const repostPost = {
    id: generateId('qp'), authorId: currentUser.id,
    reposterUserId: currentUser.id, content: quoteText,
    image: null, likes: 0, comments: 0, reposts: 0,
    createdAt: new Date().toISOString(), tags: [],
    isRepost: true, isQuote: true, originalPostId: post.id,
  };
  savePost(repostPost);

  const posts = getPosts();
  const orig  = posts.find(p => p.id === post.id);
  if (orig) { orig.reposts = (orig.reposts || 0) + 1; savePosts(posts); }

  showToast('Quote posted', 'success');

  const feed = document.getElementById('posts-feed');
  if (feed) {
    const cu   = getCurrentUser();
    const card = buildPostCard(repostPost, cu);
    if (card) feed.prepend(card);
  }
}

/* ---- Share Modal ---- */
function openShareModal(post) {
  let existing = document.getElementById('share-modal-overlay');
  if (existing) existing.remove();

  const fakeUrl = `postly.local/post/${post.id}`;
  const overlay = document.createElement('div');
  overlay.id = 'share-modal-overlay';
  overlay.className = 'modal-overlay';
  overlay.setAttribute('role', 'dialog');
  overlay.setAttribute('aria-modal', 'true');
  overlay.setAttribute('aria-labelledby', 'share-modal-title');

  overlay.innerHTML = `
    <div class="modal">
      <div class="modal-header">
        <h2 id="share-modal-title">Share Post</h2>
        <button class="modal-close-btn" aria-label="Close">${icon('xLarge')}</button>
      </div>
      <div class="modal-body">
        <div class="share-options">
          <button class="share-option-btn" data-action="copy">
            <span class="share-icon">${icon('link', {size: 24})}</span>
            <span>Copy Link</span>
          </button>
          <button class="share-option-btn" data-action="whatsapp">
            <span class="share-icon">${icon('whatsapp', {size: 24})}</span>
            <span>WhatsApp</span>
          </button>
          <button class="share-option-btn" data-action="facebook">
            <span class="share-icon">${icon('facebook', {size: 24})}</span>
            <span>Facebook</span>
          </button>
          <button class="share-option-btn" data-action="x">
            <span class="share-icon">${icon('xSocial', {size: 24})}</span>
            <span>X (Twitter)</span>
          </button>
        </div>
        <div style="margin-top:14px;padding:12px;background:var(--color-surface-2);border-radius:var(--radius-md);font-size:13px;color:var(--color-text-muted);display:flex;align-items:center;gap:8px;">
          ${icon('link', {size: 14})}
          <span style="flex:1;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${fakeUrl}</span>
        </div>
      </div>
    </div>`;

  document.body.appendChild(overlay);
  overlay.querySelector('.modal-close-btn').addEventListener('click', () => overlay.remove());
  overlay.addEventListener('click', (e) => { if (e.target === overlay) overlay.remove(); });

  overlay.querySelectorAll('.share-option-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      sharePost(post, btn.dataset.action);
      overlay.remove();
    });
  });
}

async function sharePost(post, action) {
  const url  = `postly.local/post/${post.id}`;
  const text = post.content.substring(0, 100);

  if (action === 'copy') {
    const ok = await copyToClipboard(url);
    showToast(ok ? 'Link copied!' : 'Could not copy link', ok ? 'success' : 'error');
  } else if (action === 'native') {
    if (navigator.share) {
      navigator.share({ title: 'Postly', text, url: 'https://' + url }).catch(() => {});
    } else {
      const ok = await copyToClipboard(url);
      showToast(ok ? 'Link copied!' : 'Share not supported', ok ? 'success' : 'warning');
    }
  } else if (action === 'whatsapp') {
    window.open(`https://wa.me/?text=${encodeURIComponent(text + ' — ' + url)}`, '_blank', 'noopener');
  } else if (action === 'facebook') {
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent('https://' + url)}`, '_blank', 'noopener');
  } else if (action === 'x') {
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent('https://' + url)}`, '_blank', 'noopener');
  }
}

/* ---- Render feed ---- */
function renderFeed(posts, feedEl, currentUser, emptyMessage = 'No posts yet.') {
  feedEl.innerHTML = '';

  if (!posts || posts.length === 0) {
    feedEl.innerHTML = `
      <div class="empty-state">
        <div class="empty-state-icon">${icon('inbox')}</div>
        <h3>${emptyMessage}</h3>
        <p>Check back later or create the first post!</p>
      </div>`;
    return;
  }

  posts.forEach(post => {
    const card = buildPostCard(post, currentUser);
    if (card) feedEl.appendChild(card);
  });
}
