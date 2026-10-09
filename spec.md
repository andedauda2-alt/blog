
# PROJECT: Modern Blog & Social Post App

Build a modern, responsive **Blog Post / Social Feed Web Application** using ONLY:

* HTML5
* CSS3
* Vanilla JavaScript
* Browser LocalStorage for data persistence

## IMPORTANT TECHNOLOGY RULES

* Do NOT use React.
* Do NOT use Vue.
* Do NOT use Angular.
* Do NOT use Bootstrap.
* Do NOT use Tailwind CSS.
* Do NOT use Node.js.
* Do NOT use a backend.
* Do NOT use a database.
* Do NOT use external JavaScript frameworks.
* Use clean, well-structured vanilla HTML, CSS, and JavaScript.
* The application must run directly in a browser using Live Server or by opening the HTML file.
* Use LocalStorage to simulate persistent application data.

The project should look like a **real modern social blogging platform**, not a basic classroom CRUD project.

---

# 1. PRODUCT CONCEPT

Create a platform where users can:

* Create blog posts
* Read posts
* Like posts
* Comment on posts
* Repost posts
* Share posts
* Search posts
* View their profile
* Edit/delete their own posts
* Interact with other users' posts

The experience should combine the simplicity of a blog with the interaction of a social-media feed.

The application should feel inspired by modern platforms such as X, Facebook, LinkedIn and Medium, but DO NOT directly copy their UI.

Create an original product identity.

Suggested application name:

**Postly**

Tagline:

**"Share ideas. Start conversations."**

---

# 2. DESIGN REQUIREMENTS

Create a professional modern interface.

Design goals:

* Clean
* Minimal
* Modern
* Responsive
* User-friendly
* Mobile-first
* Professional enough for a portfolio project

Use:

* Card-based posts
* Rounded corners
* Subtle shadows
* Good spacing
* Modern typography
* Clear buttons
* Smooth hover effects
* Like/comment/share interaction animations
* Responsive navigation

Create both:

### Desktop layout

Left:

* Logo
* Navigation

Center:

* Create Post
* Feed

Right:

* Trending topics
* Suggested users
* Popular posts

### Mobile layout

Use:

* Top navigation
* Full-width feed
* Bottom navigation
* Responsive post cards

---

# 3. APPLICATION STRUCTURE

Create the following files:

/postly
│
├── index.html
├── create.html
├── profile.html
├── post.html
│
├── css/
│   ├── style.css
│   ├── responsive.css
│   └── components.css
│
├── js/
│   ├── app.js
│   ├── posts.js
│   ├── comments.js
│   ├── users.js
│   ├── storage.js
│   └── ui.js
│
└── assets/
└── images/

Keep the JavaScript modular and easy to understand.

---

# 4. HOME FEED

The homepage should contain:

### Header

* Application logo
* Search icon/input
* Notification icon
* User profile avatar

### Create Post Area

Display:

"What's on your mind?"

Include:

* Text input
* Image upload interface
* Create Post button

### Feed

Display multiple sample posts.

Each post should contain:

* User avatar
* Username
* Display name
* Date/time
* Post content
* Optional image
* Like count
* Comment count
* Repost count
* Share button

Example:

John David
2h ago

"Learning JavaScript completely changed how I think about web development."

❤️ 24 Likes
💬 8 Comments
🔁 4 Reposts

---

# 5. CREATE POST

Users should be able to create a post.

Post creation should support:

* Text
* Optional image
* Character counter
* Publish button
* Cancel button

Validation:

* Do not allow empty posts.
* Display an error if the post is empty.
* Limit post length to a reasonable amount such as 500 characters.

After publishing:

* Add the new post to the feed.
* Save it to LocalStorage.
* Display the newest post at the top.
* Show a success notification.

---

# 6. LIKE SYSTEM

Each post should have a Like button.

When the user clicks Like:

* Change the button appearance.
* Increase like count by 1.
* Save the state in LocalStorage.

When clicked again:

* Unlike the post.
* Decrease the count by 1.

Example:

♡ Like → ♥ Liked

Do not allow the same user to repeatedly increase likes by clicking multiple times.

---

# 7. COMMENT SYSTEM

Users should be able to comment on posts.

When the user clicks:

"Comment"

Open a comment section/modal.

Display:

* Existing comments
* Comment author
* Comment text
* Comment time
* Comment input
* Post Comment button

Example:

Sarah:
"Great explanation!"

Michael:
"This is exactly what I needed."

Users should be able to:

* Add comments
* Delete their own comments
* See updated comment counts

Save comments in LocalStorage.

---

# 8. REPOST SYSTEM

Add a Repost button.

When clicked:

Show options:

* Repost
* Quote Post

### Repost

Create a new feed item indicating:

"Ande reposted this"

Display the original post inside the repost card.

Increase repost count.

### Quote Post

Allow the user to add their own message before reposting.

Example:

"Ande:
This is an important point about learning programming.

[Original Post]"

Save repost information in LocalStorage.

---

# 9. SHARE SYSTEM

Add a Share button.

When clicked, open a share menu.

Options:

* Copy Link
* Share to WhatsApp
* Share to Facebook
* Share to X
* Native Share if supported by the browser

For the frontend-only version, generate a fake/local post URL such as:

postly.local/post/123

If the browser supports:

navigator.share()

use it.

Otherwise provide:

"Copy Link"

After copying:

Show:

"Link copied!"

---

# 10. SEARCH

Create a working search system.

Users should be able to search:

* Post content
* Usernames
* Topics

Example:

Searching:

"JavaScript"

should display posts containing JavaScript.

Include:

* Search input
* Search icon
* Clear search button
* "No results found" state

Search should work instantly as the user types.

---

# 11. USER PROFILE

Create a profile page.

Display:

* Profile picture
* Username
* Bio
* Followers
* Following
* Total posts

Example:

Ande Dauda

Frontend Developer

Posts: 24
Followers: 180
Following: 95

Tabs:

* Posts
* Reposts
* Likes

Display the user's posts underneath.

---

# 12. POST DETAILS PAGE

When a user clicks on a post:

Open a dedicated post details page.

Display:

* Full post
* Author
* Date
* Image
* Like button
* Comment button
* Repost button
* Share button
* Full comment section

The post ID should be passed through the URL.

Example:

post.html?id=123

Use JavaScript to retrieve the correct post from LocalStorage.

---

# 13. LOCAL STORAGE DATA SYSTEM

Use LocalStorage as the application's temporary database.

Create separate storage keys such as:

posts
users
comments
likes
reposts
currentUser

Create reusable functions:

savePosts()
getPosts()

saveComments()
getComments()

saveUsers()
getUsers()

saveReposts()
getReposts()

Use JSON.stringify() when saving data.

Use JSON.parse() when retrieving data.

The application should continue showing user-created posts after refreshing the browser.

---

# 14. SAMPLE DATA

When the application is opened for the first time, automatically create sample users and posts.

Create at least:

* 5 users
* 8 posts
* 10 comments

Make the sample content realistic.

Topics can include:

* Technology
* Programming
* Education
* Business
* Entrepreneurship
* AI
* Career
* Personal development

---

# 15. NOTIFICATIONS

Create a small notification system.

When the user:

* Likes a post
* Comments
* Reposts

Show a notification/toast.

Examples:

"Post liked ❤️"

"Comment added successfully"

"Post reposted 🔁"

"Link copied successfully"

Notifications should disappear automatically after a few seconds.

---

# 16. EMPTY STATES

Create professional empty states.

Examples:

"No posts yet."

"No comments yet."

"No search results."

"You haven't created any posts yet."

Do not leave blank screens.

---

# 17. ERROR HANDLING

Handle:

* Empty posts
* Empty comments
* Invalid post IDs
* Missing LocalStorage data
* Failed image loading
* Invalid URL parameters

Show user-friendly messages.

Do not expose JavaScript errors directly to users.

---

# 18. RESPONSIVENESS

The application must work properly on:

* Desktop
* Laptop
* Tablet
* Mobile phone

Test approximately:

320px
375px
768px
1024px
1440px

Make sure:

* Text does not overflow.
* Images remain responsive.
* Buttons remain accessible.
* Navigation adapts to smaller screens.
* Posts remain readable.

---

# 19. ACCESSIBILITY

Use semantic HTML.

Examples:

<header>
<nav>
<main>
<section>
<article>
<footer>

Buttons should have meaningful labels.

Images should have alt text.

Inputs should have labels or accessible placeholders.

Ensure reasonable keyboard navigation.

---

# 20. UI INTERACTIONS

Add subtle animations:

* Like animation
* Button hover
* Modal opening
* Toast notification
* Dropdown menu
* Comment expansion
* Mobile navigation

Do not overuse animations.

Keep the application professional.

---

# 21. SECURITY AWARENESS

Because this is a frontend-only educational project:

* Do not pretend that LocalStorage is secure.
* Do not store real passwords.
* Do not implement real authentication.
* Do not expose sensitive information.

If login is implemented, use a simple demo user/session system only.

---

# 22. CODE QUALITY

Write clean beginner-to-intermediate JavaScript.

Avoid unnecessarily complicated code.

Use meaningful variable names.

Add comments explaining important logic.

Separate:

* Data handling
* UI rendering
* Event handling
* LocalStorage operations

Avoid putting the entire application inside one JavaScript file.

---

# 23. PRESENTATION REQUIREMENT

This project will be presented as a school project.

Therefore, after building the application, provide a simple explanation of:

1. What the application does
2. Why LocalStorage is used
3. How posts are created
4. How posts are stored
5. How likes work
6. How comments work
7. How reposting works
8. How sharing works
9. How search works
10. How JavaScript manipulates the DOM
11. How JSON.stringify() works
12. How JSON.parse() works
13. How the application survives page refresh
14. Limitations of a frontend-only application
15. How a backend could be added in the future

---

# 24. IMPORTANT DEVELOPMENT RULE

Do NOT generate the entire project blindly in one huge file.

Build the application systematically.

First create:

1. Project structure
2. HTML layout
3. CSS design system
4. Sample data
5. LocalStorage system
6. Post rendering
7. Create-post functionality
8. Like functionality
9. Comment functionality
10. Repost functionality
11. Share functionality
12. Search
13. Profile
14. Post details
15. Responsive design
16. Testing and bug fixing

After each major feature, make sure the existing functionality still works.

---

# FINAL QUALITY STANDARD

The final result should look like a **real social blogging application**, not a simple "student CRUD project."

The application should be:

* Functional
* Responsive
* Visually impressive
* Easy to navigate
* Easy to demonstrate
* Easy to explain
* Built entirely with vanilla HTML, CSS and JavaScript
* Persistent using LocalStorage

Most importantly, every major feature must actually work in the browser rather than being a static UI mockup.
