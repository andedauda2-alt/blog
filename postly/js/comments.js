/* ========================================
   POSTLY - comments.js
   Comment section for post detail page
   ======================================== */

/* Render a standalone comments section (used on post.html) */
function renderCommentsSection(postId, containerEl, currentUser) {
  containerEl.innerHTML = '';

  const comments = getCommentsByPost(postId);

  if (comments.length === 0) {
    containerEl.innerHTML = `
      <div class="empty-state" style="padding:30px 0">
        <div class="empty-state-icon">${icon('messageCircle', {size: 40})}</div>
        <h3>No comments yet</h3>
        <p>Start the conversation — be the first to comment!</p>
      </div>`;
  } else {
    comments.forEach(comment => {
      const el = buildDetailCommentEl(comment, currentUser, postId, containerEl);
      containerEl.appendChild(el);
    });
  }
}

function buildDetailCommentEl(comment, currentUser, postId, containerEl) {
  const author = getUserById(comment.authorId);
  if (!author) return document.createElement('div');

  const isOwn = currentUser && comment.authorId === currentUser.id;
  const avatarColor = author.avatarColor || getAvatarColor(author.id);

  const div = document.createElement('div');
  div.className = 'comment-item';
  div.dataset.commentId = comment.id;

  div.innerHTML = `
    <div class="comment-avatar" style="background:${avatarColor};width:38px;height:38px;border-radius:50%;display:flex;align-items:center;justify-content:center;color:white;font-weight:700;font-size:13px;flex-shrink:0">
      ${getInitials(author.displayName)}
    </div>
    <div class="comment-content">
      <div class="comment-header">
        <span class="comment-author">${escapeHtml(author.displayName)}</span>
        <span class="comment-time">${formatTime(comment.createdAt)}</span>
      </div>
      <p class="comment-text">${escapeHtml(comment.text)}</p>
      ${isOwn ? `<button class="comment-delete-btn" aria-label="Delete comment">Delete</button>` : ''}
    </div>`;

  if (isOwn) {
    div.querySelector('.comment-delete-btn').addEventListener('click', () => {
      if (!confirm('Delete this comment?')) return;
      deleteComment(comment.id);

      // Update post comment count
      const posts = getPosts();
      const post = posts.find(p => p.id === postId);
      if (post) {
        post.comments = Math.max(0, (post.comments || 1) - 1);
        savePosts(posts);
      }

      div.remove();

      // Update count on page
      const countEl = document.getElementById('comment-count-display');
      if (countEl && post) countEl.textContent = post.comments;

      showToast('Comment deleted', 'info', 2000);

      // Show empty state if no more comments
      if (containerEl.querySelectorAll('.comment-item').length === 0) {
        containerEl.innerHTML = `
          <div class="empty-state" style="padding:30px 0">
            <div class="empty-state-icon">${icon('messageCircle', {size: 40})}</div>
            <h3>No comments yet</h3>
            <p>Be the first to comment!</p>
          </div>`;
      }
    });
  }

  return div;
}

/* Add a comment from the detail page input */
function setupDetailCommentInput(postId, inputEl, submitBtn, containerEl, currentUser) {
  const doSubmit = () => {
    const text = inputEl.value.trim();
    if (!text) {
      showToast('Comment cannot be empty', 'warning');
      return;
    }
    if (!currentUser) {
      showToast('You must be logged in to comment', 'warning');
      return;
    }

    const comment = {
      id: generateId('c'),
      postId,
      authorId: currentUser.id,
      text,
      createdAt: new Date().toISOString(),
    };
    addComment(comment);

    // Update post comment count
    const posts = getPosts();
    const post = posts.find(p => p.id === postId);
    if (post) {
      post.comments = (post.comments || 0) + 1;
      savePosts(posts);
    }

    inputEl.value = '';

    // Remove empty state if present
    const emptyState = containerEl.querySelector('.empty-state');
    if (emptyState) emptyState.remove();

    // Append new comment
    const el = buildDetailCommentEl(comment, currentUser, postId, containerEl);
    containerEl.appendChild(el);

    // Update count
    const countEl = document.getElementById('comment-count-display');
    if (countEl && post) countEl.textContent = post.comments;

    showToast('Comment added', 'success');
  };

  submitBtn.addEventListener('click', doSubmit);
  inputEl.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); doSubmit(); }
  });
}
