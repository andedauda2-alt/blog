/* ========================================
   POSTLY - storage.js
   All LocalStorage read/write operations
   ======================================== */

const KEYS = {
  POSTS: 'postly_posts',
  USERS: 'postly_users',
  COMMENTS: 'postly_comments',
  LIKES: 'postly_likes',
  REPOSTS: 'postly_reposts',
  CURRENT_USER: 'postly_current_user',
  NOTIFICATIONS: 'postly_notifications',
  FOLLOWING: 'postly_following',
  INITIALIZED: 'postly_initialized',
};

/* ---- Generic helpers ---- */
function saveData(key, data) {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (e) {
    console.error('Storage write failed:', e);
  }
}

function getData(key, fallback = null) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch (e) {
    console.error('Storage read failed:', e);
    return fallback;
  }
}

/* ---- Posts ---- */
function savePosts(posts) {
  saveData(KEYS.POSTS, posts);
}

function getPosts() {
  return getData(KEYS.POSTS, []);
}

function getPostById(id) {
  return getPosts().find(p => p.id === id) || null;
}

function savePost(post) {
  const posts = getPosts();
  const idx = posts.findIndex(p => p.id === post.id);
  if (idx >= 0) {
    posts[idx] = post;
  } else {
    posts.unshift(post); // Newest first
  }
  savePosts(posts);
}

function deletePost(id) {
  const posts = getPosts().filter(p => p.id !== id);
  savePosts(posts);
  // Also remove associated comments
  const comments = getComments();
  const filtered = comments.filter(c => c.postId !== id);
  saveComments(filtered);
}

/* ---- Users ---- */
function saveUsers(users) {
  saveData(KEYS.USERS, users);
}

function getUsers() {
  return getData(KEYS.USERS, []);
}

function getUserById(id) {
  return getUsers().find(u => u.id === id) || null;
}

function getUserByHandle(handle) {
  return getUsers().find(u => u.handle === handle) || null;
}

/* ---- Comments ---- */
function saveComments(comments) {
  saveData(KEYS.COMMENTS, comments);
}

function getComments() {
  return getData(KEYS.COMMENTS, []);
}

function getCommentsByPost(postId) {
  return getComments().filter(c => c.postId === postId);
}

function addComment(comment) {
  const comments = getComments();
  comments.push(comment);
  saveComments(comments);
}

function deleteComment(commentId) {
  const comments = getComments().filter(c => c.id !== commentId);
  saveComments(comments);
}

/* ---- Likes ---- */
function saveLikes(likes) {
  saveData(KEYS.LIKES, likes);
}

function getLikes() {
  return getData(KEYS.LIKES, {});
}

// likes = { postId: [userId, userId, ...] }
function hasLiked(postId, userId) {
  const likes = getLikes();
  return (likes[postId] || []).includes(userId);
}

function toggleLike(postId, userId) {
  const likes = getLikes();
  if (!likes[postId]) likes[postId] = [];
  if (likes[postId].includes(userId)) {
    likes[postId] = likes[postId].filter(id => id !== userId);
    saveLikes(likes);
    return false; // Unliked
  } else {
    likes[postId].push(userId);
    saveLikes(likes);
    return true; // Liked
  }
}

/* ---- Reposts ---- */
function saveReposts(reposts) {
  saveData(KEYS.REPOSTS, reposts);
}

function getReposts() {
  return getData(KEYS.REPOSTS, {});
}

// reposts = { postId: [userId, ...] }
function hasReposted(postId, userId) {
  const reposts = getReposts();
  return (reposts[postId] || []).includes(userId);
}

function addRepost(postId, userId) {
  const reposts = getReposts();
  if (!reposts[postId]) reposts[postId] = [];
  if (!reposts[postId].includes(userId)) {
    reposts[postId].push(userId);
    saveReposts(reposts);
    return true;
  }
  return false;
}

/* ---- Current User ---- */
function saveCurrentUser(user) {
  saveData(KEYS.CURRENT_USER, user);
}

function getCurrentUser() {
  return getData(KEYS.CURRENT_USER, null);
}

/* ---- Following ---- */
function saveFollowing(following) {
  saveData(KEYS.FOLLOWING, following);
}

function getFollowing() {
  return getData(KEYS.FOLLOWING, {});
}

function isFollowing(currentUserId, targetUserId) {
  const following = getFollowing();
  return (following[currentUserId] || []).includes(targetUserId);
}

function toggleFollow(currentUserId, targetUserId) {
  const following = getFollowing();
  if (!following[currentUserId]) following[currentUserId] = [];
  if (following[currentUserId].includes(targetUserId)) {
    following[currentUserId] = following[currentUserId].filter(id => id !== targetUserId);
    saveFollowing(following);
    return false;
  } else {
    following[currentUserId].push(targetUserId);
    saveFollowing(following);
    return true;
  }
}

/* ---- Initialization flag ---- */
function isInitialized() {
  return localStorage.getItem(KEYS.INITIALIZED) === 'true';
}

function markInitialized() {
  localStorage.setItem(KEYS.INITIALIZED, 'true');
}

/* ---- Notifications ---- */
function saveNotifications(notifs) {
  saveData(KEYS.NOTIFICATIONS, notifs);
}

function getNotifications() {
  return getData(KEYS.NOTIFICATIONS, []);
}

function addNotification(notif) {
  const notifs = getNotifications();
  notifs.unshift(notif);
  if (notifs.length > 50) notifs.length = 50; // cap at 50
  saveNotifications(notifs);
}

/* ---- Auth helpers ---- */

/**
 * Save a hashed-ish password for a user.
 * NOTE: This is a frontend demo only — not real security.
 * We store a simple checksum, never the plain password.
 */
function saveCredentials(credentials) {
  saveData('postly_credentials', credentials);
}

function getCredentials() {
  return getData('postly_credentials', {});
}

/**
 * Naive hash — turns a string into a number string.
 * Good enough to avoid storing plain text in LocalStorage for demo purposes.
 */
function hashPassword(password) {
  let hash = 5381;
  for (let i = 0; i < password.length; i++) {
    hash = ((hash << 5) + hash) + password.charCodeAt(i);
    hash = hash & hash; // Convert to 32-bit int
  }
  return String(Math.abs(hash));
}

function registerUser(user, password) {
  // Save user profile
  const users = getUsers();
  users.push(user);
  saveUsers(users);

  // Save hashed password keyed by handle
  const creds = getCredentials();
  creds[user.handle] = hashPassword(password);
  saveCredentials(creds);
}

function loginUser(handle, password) {
  const creds = getCredentials();
  const users = getUsers();
  const user  = users.find(u => u.handle.toLowerCase() === handle.toLowerCase().trim());
  if (!user) return { success: false, error: 'No account found with that username.' };
  if (creds[user.handle] !== hashPassword(password)) {
    return { success: false, error: 'Incorrect password.' };
  }
  saveCurrentUser(user);
  return { success: true, user };
}

function logoutUser() {
  localStorage.removeItem('postly_current_user');
}

function isLoggedIn() {
  return getCurrentUser() !== null;
}
