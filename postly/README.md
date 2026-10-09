# Postly

**"Share ideas. Start conversations."**

A modern social blogging web application built entirely with vanilla HTML, CSS, and JavaScript. No frameworks, no backend, no build tools — just open `index.html` in a browser and it runs.

---

## Project Structure

```
postly/
│
├── index.html          → Home feed
├── create.html         → Create / edit a post
├── profile.html        → User profile page
├── post.html           → Post detail page
│
├── css/
│   ├── style.css       → Design system, layout, variables
│   ├── components.css  → Post cards, modals, toasts, forms
│   └── responsive.css  → Mobile-first breakpoints
│
├── js/
│   ├── storage.js      → All LocalStorage read/write functions
│   ├── icons.js        → Central SVG icon library
│   ├── users.js        → User data, sample data seeding
│   ├── ui.js           → Toasts, modals, dropdowns, helpers
│   ├── posts.js        → Post card rendering, feed, interactions
│   ├── comments.js     → Comment sections (feed + detail page)
│   └── app.js          → Home page bootstrap, search, trending
│
└── assets/
    └── images/         → (for any local image assets)
```

---

## How to Run

**Option 1 — Live Server (VS Code)**
1. Open the `postly` folder in VS Code
2. Right-click `index.html` → **Open with Live Server**

**Option 2 — Direct file open**
- Double-click `index.html` — it opens directly in your browser
- No server or installation required

---

## Features

| Feature | Description |
|---|---|
| Feed | Scrollable list of posts sorted newest first |
| Create Post | Text + optional image, 500 character limit, hashtag support |
| Like / Unlike | Toggle like with live count update |
| Comments | Inline comment section per post, add and delete your own |
| Repost | Direct repost or Quote Post with your own message |
| Share | Copy link, WhatsApp, Facebook, X (Twitter) |
| Search | Live search by content, username, or hashtag |
| Profile | Per-user profile with Posts, Reposts, and Likes tabs |
| Post Detail | Full post view with complete comment thread |
| Edit / Delete | Authors can edit or delete their own posts |
| Follow | Follow / unfollow other users |
| Responsive | Desktop 3-column, tablet 2-column, mobile full-width |
| Persistent | All data survives page refresh via LocalStorage |

---

## Sample Data

On first load the app seeds LocalStorage with:

- **5 users** — Ande Dauda, Sarah Chen, Michael Torres, Amara Osei, James Rivera
- **8 posts** — covering JavaScript, AI, startups, clean code, CSS, career, open source, networking
- **10 comments** — realistic replies spread across the posts

The seed only runs once. Clearing LocalStorage (`localStorage.clear()` in the browser console) resets everything to the defaults.

---

## How It Works

### 1. What the application does

Postly is a social blogging feed where users can create posts, react to other posts (like, comment, repost, share), search content, and view profiles — all running in the browser with no server.

### 2. Why LocalStorage is used

LocalStorage acts as a simple in-browser database. It persists data as key-value string pairs across page refreshes, without requiring a server or database. It is ideal for frontend-only demo projects.

### 3. How posts are created

The user types in the create-post textarea (on `index.html` or `create.html`), optionally uploads an image, then clicks Publish. JavaScript builds a post object and calls `savePost()`, which prepends it to the posts array in LocalStorage and immediately renders the new card at the top of the feed.

### 4. How posts are stored

Each post is a JavaScript object:

```js
{
  id: "p1735000000_abc123",
  authorId: "1",
  content: "Post text here",
  image: null,             // or a base64 data URL
  likes: 0,
  comments: 0,
  reposts: 0,
  createdAt: "2026-10-07T10:00:00.000Z",
  tags: ["#JavaScript"],
  isRepost: false
}
```

The full array of posts is serialized with `JSON.stringify()` and stored under the key `postly_posts`. It is retrieved with `JSON.parse()` on every page load.

### 5. How likes work

Likes are stored separately as a map:

```js
{ "postId": ["userId1", "userId2", ...] }
```

`toggleLike(postId, userId)` adds or removes the user ID from that post's array and saves the updated map back to LocalStorage. The post's `.likes` count is also updated in the posts array. This prevents the same user from liking a post more than once.

### 6. How comments work

Comments are stored as a flat array under `postly_comments`:

```js
{
  id: "c_abc123",
  postId: "p1",
  authorId: "1",
  text: "Great post!",
  createdAt: "2026-10-07T11:00:00.000Z"
}
```

`getCommentsByPost(postId)` filters the full array by `postId`. Adding a comment calls `addComment()` which pushes to the array and saves. Deleting calls `deleteComment()` which filters it out.

### 7. How reposting works

**Direct repost** — creates a new post object with `isRepost: true` and `originalPostId` pointing to the source. The original post's `.reposts` count increases. A `postly_reposts` map tracks which users have reposted which posts to prevent duplicates.

**Quote repost** — same as above but the new post contains the user's own text, and the original post is shown embedded inside the card.

### 8. How sharing works

The Share button opens a modal with four options — Copy Link, WhatsApp, Facebook, and X (Twitter). For "Copy Link", `navigator.clipboard.writeText()` is used with a fallback to `document.execCommand('copy')`. For the social platforms, the browser opens a new tab with the appropriate sharing URL. Since there is no real server, the URL format is `postly.local/post/<id>`.

### 9. How search works

Typing in the search bar fires a debounced `input` event listener (300ms delay). `handleSearch()` filters all posts from LocalStorage where the post content, tags, author display name, or author handle contains the query string (case-insensitive). Results re-render in the feed immediately. The query is also stored in the URL (`?search=query`) so it survives page navigation.

### 10. How JavaScript manipulates the DOM

JavaScript creates post card elements using `document.createElement('article')`, sets `innerHTML` with HTML template strings, then appends them to the `#posts-feed` container. When a user likes a post, the icon and count are updated directly on the existing DOM node without re-rendering the whole feed.

### 11. How JSON.stringify() works

`JSON.stringify(data)` converts a JavaScript object or array into a JSON string that can be stored in LocalStorage (which only accepts strings). Example:

```js
const post = { id: "p1", content: "Hello" };
localStorage.setItem("postly_posts", JSON.stringify([post]));
// Stored as: '[{"id":"p1","content":"Hello"}]'
```

### 12. How JSON.parse() works

`JSON.parse(string)` converts the stored JSON string back into a usable JavaScript object or array. Example:

```js
const raw = localStorage.getItem("postly_posts");
const posts = JSON.parse(raw);
// posts is now a real JavaScript array
```

Both calls are wrapped in `try/catch` inside `storage.js` to handle corrupt or missing data gracefully.

### 13. How the application survives page refresh

On every page load, the JS files call `getPosts()`, `getUsers()`, `getComments()` etc., which read from LocalStorage and return the current data. Because LocalStorage persists until manually cleared, all user-created posts, likes, and comments remain available after a refresh or browser restart.

### 14. Limitations of a frontend-only application

- **No real authentication** — the "current user" is just the first sample user stored in LocalStorage. Anyone with browser access can act as that user.
- **No security** — LocalStorage is readable by any JavaScript on the same origin. It should never hold real passwords or sensitive data.
- **Device-only** — data exists only in the user's browser. It cannot be shared between devices or users.
- **Storage limits** — LocalStorage has a ~5MB limit per origin. Large base64-encoded images will fill it quickly.
- **No real-time updates** — two browser tabs do not sync automatically.
- **No server-side search indexing** — search scans the full posts array in memory on every keystroke.

### 15. How a backend could be added in the future

To evolve Postly into a real application:

1. **Replace LocalStorage calls** in `storage.js` with `fetch()` calls to a REST API (e.g. `GET /api/posts`, `POST /api/posts`, `DELETE /api/posts/:id`).
2. **Add a database** (PostgreSQL, MongoDB, etc.) on the server to persist posts, users, comments, and likes.
3. **Add real authentication** using JWT tokens or session cookies — the `currentUser` would come from an auth endpoint instead of LocalStorage.
4. **Add real-time updates** using WebSockets or Server-Sent Events so the feed refreshes when others post.
5. **Add image hosting** (AWS S3, Cloudinary) instead of storing base64 in LocalStorage.
6. **Add server-side search** using a search index (Elasticsearch, PostgreSQL full-text search) for fast, scalable results.

The frontend code is already structured to make this migration straightforward — all data access is centralised in `storage.js`, so only that file needs to be updated.

---

## Technology Stack

| Layer | Technology |
|---|---|
| Markup | HTML5 (semantic elements) |
| Styling | CSS3 (custom properties, Grid, Flexbox) |
| Logic | Vanilla JavaScript (ES6+) |
| Persistence | Browser LocalStorage |
| Icons | Inline SVGs (custom icon library in `icons.js`) |
| Fonts | System font stack (no external fonts) |

---

## Browser Support

Works in all modern browsers — Chrome, Firefox, Edge, Safari. No polyfills required.

---

## License

Built as a school project. Free to use and modify for educational purposes.
