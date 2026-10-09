/* ========================================
   POSTLY - articles.js
   Article storage, rendering, sample data
   ======================================== */

/* ---- Article Storage Keys ---- */
const ARTICLE_KEYS = {
  ARTICLES:         'postly_articles',
  ARTICLE_LIKES:    'postly_article_likes',
  ARTICLE_COMMENTS: 'postly_article_comments',
  ARTICLES_INIT:    'postly_articles_initialized',
};

/* ---- CRUD ---- */
function saveArticles(articles) {
  saveData(ARTICLE_KEYS.ARTICLES, articles);
}

function getArticles() {
  return getData(ARTICLE_KEYS.ARTICLES, []);
}

function getArticleById(id) {
  return getArticles().find(a => a.id === id) || null;
}

function saveArticle(article) {
  const articles = getArticles();
  const idx = articles.findIndex(a => a.id === article.id);
  if (idx >= 0) {
    articles[idx] = article;
  } else {
    articles.unshift(article);
  }
  saveArticles(articles);
}

function deleteArticle(id) {
  const articles = getArticles().filter(a => a.id !== id);
  saveArticles(articles);
  // Remove associated comments
  const comments = getArticleComments().filter(c => c.articleId !== id);
  saveArticleComments(comments);
}

/* ---- Article Likes ---- */
function saveArticleLikes(likes) {
  saveData(ARTICLE_KEYS.ARTICLE_LIKES, likes);
}

function getArticleLikes() {
  return getData(ARTICLE_KEYS.ARTICLE_LIKES, {});
}

function hasLikedArticle(articleId, userId) {
  const likes = getArticleLikes();
  return (likes[articleId] || []).includes(userId);
}

function toggleArticleLike(articleId, userId) {
  const likes = getArticleLikes();
  if (!likes[articleId]) likes[articleId] = [];
  if (likes[articleId].includes(userId)) {
    likes[articleId] = likes[articleId].filter(id => id !== userId);
    saveArticleLikes(likes);
    return false;
  } else {
    likes[articleId].push(userId);
    saveArticleLikes(likes);
    return true;
  }
}

/* ---- Article Comments ---- */
function saveArticleComments(comments) {
  saveData(ARTICLE_KEYS.ARTICLE_COMMENTS, comments);
}

function getArticleComments() {
  return getData(ARTICLE_KEYS.ARTICLE_COMMENTS, []);
}

function getArticleCommentsByArticle(articleId) {
  return getArticleComments().filter(c => c.articleId === articleId);
}

function addArticleComment(comment) {
  const comments = getArticleComments();
  comments.push(comment);
  saveArticleComments(comments);
}

function deleteArticleComment(commentId) {
  const comments = getArticleComments().filter(c => c.id !== commentId);
  saveArticleComments(comments);
}

/* ---- Reading time estimate ---- */
function estimateReadTime(content) {
  const words = content.trim().split(/\s+/).length;
  const minutes = Math.max(1, Math.round(words / 200));
  return `${minutes} min read`;
}

/* ---- Excerpt generator ---- */
function makeExcerpt(content, maxLen = 160) {
  // Strip any basic HTML tags
  const plain = content.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
  if (plain.length <= maxLen) return plain;
  return plain.slice(0, maxLen).replace(/\s\S*$/, '') + '...';
}

/* ---- Sample Article Data ---- */
const SAMPLE_ARTICLES = [
  {
    id: 'a1',
    authorId: '3',
    title: 'The Architecture of Scalable Web Applications',
    subtitle: 'How to design systems that grow with your users, not against them',
    coverImage: null,
    content: `Building software that scales is one of the most underestimated challenges in modern web development. Most applications start small — a few hundred users, a single server, one database. Everything works fine. Then growth happens, and suddenly the architecture you built for simplicity becomes a liability.

## Start With The Right Mental Model

The first mistake teams make is optimizing for scale before they need it. Premature optimization kills velocity. But ignoring scalability entirely means you'll eventually rewrite everything from scratch.

The goal is to build with scalability in mind, not to build for massive scale on day one. There's a difference.

## The Three Pillars of Scalable Architecture

### 1. Statelessness

Your application servers should be stateless. Every request should contain all the information needed to process it. When a server goes down, another takes its place without losing any work. This means:

- No in-memory sessions (use Redis or a database)
- No local file storage (use object storage like S3)
- No server-specific cache (use a shared cache layer)

### 2. Separation of Concerns

The monolith vs. microservices debate misses the real point. What matters is clean boundaries between the parts of your system. Whether that's modules in a monolith or separate services, each component should do one thing well.

**Database access** should live behind an abstraction layer. **Business logic** should not live in your route handlers. **Infrastructure concerns** (logging, auth, caching) should be cross-cutting concerns, not scattered throughout your codebase.

### 3. Async by Default

Synchronous, blocking operations are the silent killer of web application performance. Anything that doesn't need an immediate response — sending emails, processing uploads, generating reports — should happen asynchronously through a queue.

## Practical Steps You Can Take Today

Even if you're working on a small project, these habits pay off:

- **Use a connection pool** for database queries
- **Cache expensive reads** with a TTL, even in memory
- **Log with structure** so logs are searchable later
- **Keep your API contracts small** — fewer fields, cleaner boundaries
- **Write idempotent operations** wherever possible

## The Uncomfortable Truth

Most teams never need truly massive scale. What they need is code that's maintainable enough to change quickly as requirements evolve. A well-organized monolith that deploys in 30 seconds often outperforms a distributed system that requires three engineers to manage.

Scale is a good problem to have. Build something people want first.`,
    tags: ['#Architecture', '#WebDev', '#Engineering'],
    likes: 142,
    comments: 18,
    views: 1240,
    readTime: '6 min read',
    createdAt: new Date(Date.now() - 3 * 24 * 3600 * 1000).toISOString(),
    status: 'published',
  },
  {
    id: 'a2',
    authorId: '5',
    title: 'Understanding Large Language Models: What Every Developer Should Know',
    subtitle: 'A practical guide to LLMs without the academic jargon',
    coverImage: null,
    content: `Artificial Intelligence is having a moment. But beneath the hype is genuinely useful technology that developers can leverage today. The challenge is separating the signal from the noise.

## What Is a Large Language Model, Really?

A large language model is a statistical machine that predicts the next most likely token given a sequence of previous tokens. That's it. The emergent capabilities — reasoning, summarization, code generation — arise from training on an enormous amount of human-generated text.

Understanding this changes how you use them. You're not talking to something that understands. You're prompting a pattern-completion engine that has absorbed an enormous amount of human knowledge.

## What LLMs Are Good At

- **Drafting and summarization** — first drafts, summaries, reformatting
- **Code generation** — boilerplate, transformations, test generation
- **Classification** — sentiment, category labeling, extraction
- **Question answering over documents** — when you give them the source material

## What LLMs Are Terrible At

- **Math and precise counting** — they hallucinate numbers confidently
- **Recent events** — knowledge cutoffs are real
- **Self-awareness** — they don't know what they don't know
- **Consistency at scale** — outputs vary between runs

## The Prompt Engineering Fundamentals

You don't need a PhD to write effective prompts. A few principles cover 80% of cases:

**Be specific.** Vague prompts produce vague outputs. "Summarize this article in three bullet points for a non-technical audience" beats "summarize this."

**Give examples.** Few-shot prompting — including examples of the format you want — dramatically improves output quality.

**Set the context.** Tell the model who it is and what it's doing. "You are a code reviewer checking for security vulnerabilities" produces more focused output than an open-ended request.

**Iterate.** Your first prompt is never your best prompt. Treat prompt engineering like you treat code — refine it.

## Practical Integration Patterns

### Retrieval-Augmented Generation (RAG)

The knowledge cutoff problem is real but solvable. Store your domain knowledge in a vector database. At query time, retrieve the most relevant chunks and include them in the prompt. The model reasons over information you provide, not its training data.

### Structured Output

Most production uses of LLMs require structured data, not free text. Ask the model to respond in JSON, validate the output, and fall back gracefully when it doesn't comply.

### Human-in-the-Loop

For high-stakes outputs — medical, legal, financial — always route LLM output through human review. Use LLMs to draft and assist, not to decide.

## The Bottom Line

LLMs are the most powerful text manipulation tools ever built. Treat them as such — useful for drafting, pattern-matching, and first-pass processing. Build human review into high-stakes flows. And stay skeptical of confident-sounding outputs on topics you can't verify.`,
    tags: ['#AI', '#LLM', '#MachineLearning', '#Tech'],
    likes: 287,
    comments: 41,
    views: 3800,
    readTime: '7 min read',
    createdAt: new Date(Date.now() - 5 * 24 * 3600 * 1000).toISOString(),
    status: 'published',
  },
  {
    id: 'a3',
    authorId: '4',
    title: 'From Idea to Revenue: The Lean Startup Framework in Practice',
    subtitle: 'Stop building, start validating — a practical playbook for first-time founders',
    coverImage: null,
    content: `Most startups fail not because they run out of money, but because they run out of customers. They build products people don't want. The lean startup methodology exists to solve this problem — but it's often misunderstood.

## The Core Insight

The lean startup isn't about being cheap. It's about reducing the time between having an idea and learning whether that idea creates value for real customers.

Eric Ries called this the Build-Measure-Learn loop. The goal is to make that loop as short as possible, so you fail fast on bad ideas and double down on good ones.

## The Three Things You Must Validate First

Before writing a single line of production code, you need answers to three questions:

**1. Is there a real problem?**
Talk to at least 20 potential customers. Not friends or family — people who would actually pay for a solution. Your job in these conversations is to understand their problem, not to pitch your solution.

**2. Does your solution solve it better than alternatives?**
Alternatives include your product, competitors, spreadsheets, and doing nothing. If the status quo is good enough, you don't have a business.

**3. Will people pay enough to make economics work?**
"People love it" means nothing if the price point that makes them love it doesn't cover your costs.

## The MVP Trap

The Minimum Viable Product is the most misunderstood concept in startup thinking. Most founders build an MVP that's too big, too polished, and too expensive to iterate on.

A real MVP is the smallest experiment that gives you meaningful learning. It might be:

- A landing page with a "Buy Now" button that leads to a waitlist
- A manual process done by humans while you pretend it's software (the "Wizard of Oz" test)
- A concierge service where you do everything by hand for 10 customers

The goal is learning, not shipping.

## When to Pivot vs. When to Persist

This is the hardest judgment call. The signal to pivot is clear evidence that a core assumption is wrong — not just slow growth, but evidence that the problem, customer, or solution is fundamentally off.

The signal to persist is weak: you have customers who love the product, they refer others, they use it frequently, and they're upset when it breaks. Growth might be slow, but the core is working.

Most founders pivot too early and persist too long. Both are expensive mistakes.

## Building a Growth Engine

Once you have product-market fit — and you'll know it, it's rarely subtle — the work shifts from validation to growth. The three growth engines:

- **Viral**: each user brings in more than one new user
- **Sticky**: retention is high enough that compounding drives growth  
- **Paid**: LTV > CAC with a meaningful margin

You need one primary engine and it needs to be built into the product, not bolted on as marketing.

## The Uncomfortable Truth About Execution

Ideas are worth nothing. Execution is worth everything. The startup graveyard is full of people with brilliant ideas who couldn't recruit, couldn't sell, couldn't prioritize, and couldn't get back up after failure.

Build resilience before you need it. The path from idea to revenue is always longer and harder than it looks from the outside.`,
    tags: ['#Startup', '#Entrepreneurship', '#Business', '#ProductManagement'],
    likes: 198,
    comments: 29,
    views: 2100,
    readTime: '8 min read',
    createdAt: new Date(Date.now() - 7 * 24 * 3600 * 1000).toISOString(),
    status: 'published',
  },
  {
    id: 'a4',
    authorId: '1',
    title: 'CSS Architecture That Doesn\'t Make You Want to Quit',
    subtitle: 'Practical patterns for writing maintainable, scalable CSS in 2026',
    coverImage: null,
    content: `CSS has a reputation problem. It's simultaneously one of the most powerful tools on the web and one of the most frustrating to manage at scale. The problem isn't CSS itself — it's the lack of architectural discipline we bring to it.

## Why CSS Gets Messy

CSS is global by default. A selector you write in one file can affect elements in every part of your application. There's no compile-time error when you accidentally override a style. And the cascade — CSS's most powerful feature — becomes its most dangerous one when you don't understand it.

Most CSS problems come down to three root causes:
1. Specificity battles from over-qualified selectors
2. Lack of naming conventions leading to name collisions
3. No clear ownership of styles

## The Principles That Actually Help

### Custom Properties (Variables) First

Define your design tokens as CSS variables at the `:root` level. Colors, spacing, typography, border radii, shadows — all of it. This gives you:

- A single source of truth for your design system
- Easy theming (dark mode is just overriding variables)
- Readable code that explains intent, not just values

```css
:root {
  --color-primary: #6c63ff;
  --space-4: 1rem;
  --radius-md: 10px;
}
```

### Component-Scoped Classes

Group your CSS by component, not by property type. All styles for a `.card` component live together. This makes it easy to find, modify, and delete styles when components change.

### The BEM Naming Convention

Block Element Modifier gives you a predictable naming structure:

- `.card` — the block
- `.card__header` — an element inside the block
- `.card--featured` — a modifier variant

You don't have to follow BEM rigidly, but the discipline of naming things as `block__element--modifier` prevents namespace collisions.

### Utility Classes for Spacing and Layout

Utility classes — small, single-purpose classes like `.mt-4` or `.flex` — are excellent for spacing and layout adjustments. They let you tweak compositions without writing new CSS. Use them sparingly for structure, not as a replacement for component styles.

## The Cascade Is Your Friend

Most developers fight the cascade. Learn to use it instead.

- Use low-specificity selectors (classes, not IDs)
- Let element selectors set sensible defaults
- Reserve high-specificity (`!important`, inline styles) for genuine exceptions

## Performance Patterns

A few things that actually matter for CSS performance:

- **Avoid deeply nested selectors** — they're slower to match and harder to override
- **Use `will-change` sparingly** — it's not free, it allocates GPU memory
- **Don't animate properties that cause layout** — `width`, `height`, `padding` trigger reflow. Animate `transform` and `opacity` instead
- **Critical CSS** — inline the styles needed for above-the-fold content to eliminate render-blocking

## Practical Advice for Existing Projects

If you're inheriting a CSS codebase that's a mess:

1. Don't rewrite it all at once — you'll break things
2. Establish the design token system first
3. Add new components with the clean patterns
4. Refactor old components when you touch them

The goal is gradual improvement, not perfection.

## The Bottom Line

Good CSS architecture isn't about following the latest trend. It's about making decisions that are predictable, consistent, and easy to reason about for the next developer — who might be you in six months.`,
    tags: ['#CSS', '#Frontend', '#WebDev', '#Design'],
    likes: 89,
    comments: 15,
    views: 1050,
    readTime: '7 min read',
    createdAt: new Date(Date.now() - 10 * 24 * 3600 * 1000).toISOString(),
    status: 'published',
  },
  {
    id: 'a5',
    authorId: '2',
    title: 'Becoming a 10x Engineer Isn\'t What You Think It Is',
    subtitle: 'The multiplier effect isn\'t about writing more code — it\'s about eliminating blockers',
    coverImage: null,
    content: `The "10x engineer" trope gets a bad reputation because it's usually invoked to justify toxic behavior — the lone genius who works 80-hour weeks and treats everyone around them like an obstacle.

But the underlying idea isn't wrong. Some engineers genuinely have an outsized positive impact on their teams. The question is how.

## What the Research Actually Shows

Studies on software developer productivity consistently find enormous variance between individuals — sometimes 10x or more. But the highest performers aren't writing 10x as many lines of code. They're:

- Choosing the right problems to solve
- Unblocking other people
- Reducing complexity, not adding it
- Communicating decisions clearly
- Preventing bugs before they're written

The multiplier effect is social and systemic, not individual and technical.

## The Leverage Points That Actually Matter

### Code Review Quality

A thoughtful code review that catches a design flaw before it's merged into the codebase saves dozens of hours of future debugging. Engineers who write excellent reviews — specific, kind, educational — have an enormous positive impact on team quality.

### Documentation and Knowledge Sharing

The engineer who writes clear runbooks, documents system behavior, and creates internal guides has a leverage ratio of 1:N — every person who reads the docs benefits. Documentation is compounding.

### Removing Process Friction

If you spend one day improving your team's deployment pipeline so deployments take 5 minutes instead of 30, and your team deploys 10 times a week, you've saved ~4 hours per week indefinitely. That's a 200x return in the first year.

### Mentoring

A senior engineer who mentors a junior makes both of them more effective. The junior gets unstuck faster, writes better code sooner, and eventually multiplies their own effect. Refusing to mentor because it "slows you down" is a false economy.

## The Things That Undermine Your Impact

The engineers with the highest perceived individual output often have the lowest team impact:

- Writing clever code nobody else can maintain
- Making architectural decisions without consensus
- Hoarding context so they stay indispensable
- Treating code review as a gate rather than a collaboration
- Moving fast in ways that slow others down

## How to Actually Become a Force Multiplier

**Ask "what's blocking the team?" every week.** The answer is usually something unglamorous — a flaky test, a confusing error message, a deploy process that requires manual steps.

**Write code for the next maintainer.** Code is read far more than it's written. Optimize for clarity.

**Be the person who follows up.** Decisions left in ambiguity cost teams enormous amounts of time. Follow up on open questions, document what was decided and why.

**Teach when you have the chance.** Pair programming, tech talks, architecture reviews — these are investments in your team's collective capability.

## The Uncomfortable Reality

Being a force multiplier requires ego management. You have to be willing to credit others, to make others look good, and to do work that doesn't show up in your performance metrics.

The best engineers I've worked with have been almost invisible in their impact — things just worked better when they were around. That's the real 10x.`,
    tags: ['#Career', '#Engineering', '#SoftSkills', '#Leadership'],
    likes: 312,
    comments: 47,
    views: 4200,
    readTime: '6 min read',
    createdAt: new Date(Date.now() - 14 * 24 * 3600 * 1000).toISOString(),
    status: 'published',
  },
];

const SAMPLE_ARTICLE_COMMENTS = [
  { id: 'ac1', articleId: 'a1', authorId: '1', text: 'The point about premature optimization vs scalability mindset is exactly the balance most teams struggle to find. Really well articulated.', createdAt: new Date(Date.now() - 2 * 24 * 3600 * 1000).toISOString() },
  { id: 'ac2', articleId: 'a1', authorId: '2', text: 'The statelessness section should be required reading for every backend developer joining a team. Great breakdown.', createdAt: new Date(Date.now() - 1.5 * 24 * 3600 * 1000).toISOString() },
  { id: 'ac3', articleId: 'a2', authorId: '4', text: 'Finally an AI article without the hype. The section on what LLMs are terrible at is more valuable than most AI content I have read this year.', createdAt: new Date(Date.now() - 4 * 24 * 3600 * 1000).toISOString() },
  { id: 'ac4', articleId: 'a2', authorId: '1', text: 'RAG is underused by most teams building on LLMs. Good practical recommendation.', createdAt: new Date(Date.now() - 3 * 24 * 3600 * 1000).toISOString() },
  { id: 'ac5', articleId: 'a3', authorId: '5', text: 'The MVP trap section is something I wish I had read before my first startup. We spent 8 months building something we should have validated in 2 weeks.', createdAt: new Date(Date.now() - 6 * 24 * 3600 * 1000).toISOString() },
  { id: 'ac6', articleId: 'a4', authorId: '3', text: 'Custom properties as the foundation is the right call every time. The cascade section is also something more CSS developers need to internalize.', createdAt: new Date(Date.now() - 9 * 24 * 3600 * 1000).toISOString() },
  { id: 'ac7', articleId: 'a5', authorId: '4', text: 'The part about hoarding context to stay indispensable hits close to home. Have worked with people like that and it genuinely damages team performance.', createdAt: new Date(Date.now() - 13 * 24 * 3600 * 1000).toISOString() },
  { id: 'ac8', articleId: 'a5', authorId: '3', text: 'Being almost invisible in your impact is a wonderful way to describe the best senior engineers. Bookmarking this one.', createdAt: new Date(Date.now() - 12 * 24 * 3600 * 1000).toISOString() },
];

/* ---- Initialize articles on first load ---- */
function initializeArticles() {
  if (localStorage.getItem(ARTICLE_KEYS.ARTICLES_INIT) === 'true') return;
  saveArticles(SAMPLE_ARTICLES);
  saveArticleLikes({});
  saveArticleComments(SAMPLE_ARTICLE_COMMENTS);
  localStorage.setItem(ARTICLE_KEYS.ARTICLES_INIT, 'true');
}

/* ---- Article Categories ---- */
const ARTICLE_CATEGORIES = [
  { id: 'all',         label: 'All' },
  { id: 'tech',        label: 'Technology' },
  { id: 'career',      label: 'Career' },
  { id: 'business',    label: 'Business' },
  { id: 'ai',          label: 'AI & ML' },
  { id: 'programming', label: 'Programming' },
  { id: 'design',      label: 'Design' },
];

/* ---- Render article card (for feed) ---- */
function buildArticleCard(article, currentUser) {
  const author  = getUserById(article.authorId);
  if (!author) return null;

  const liked   = currentUser ? hasLikedArticle(article.id, currentUser.id) : false;
  const isOwn   = currentUser && article.authorId === currentUser.id;
  const color   = author.avatarColor || getAvatarColor(author.id);
  const initials = getInitials(author.displayName);
  const excerpt  = makeExcerpt(article.content);
  const commentCount = getArticleCommentsByArticle(article.id).length;

  const card = document.createElement('article');
  card.className = 'article-card';
  card.dataset.articleId = article.id;

  const tagsHTML = (article.tags || []).slice(0, 3).map(t =>
    `<span class="article-tag">${escapeHtml(t)}</span>`
  ).join('');

  card.innerHTML = `
    <div class="article-card-inner">

      <div class="article-card-header">
        <a href="profile.html?user=${author.id}" class="article-author-link" aria-label="View ${escapeHtml(author.displayName)}'s profile">
          <div class="article-author-avatar" style="background:${color}">${initials}</div>
          <div class="article-author-info">
            <span class="article-author-name">${escapeHtml(author.displayName)}</span>
            <span class="article-author-meta">${formatTime(article.createdAt)} &middot; ${escapeHtml(article.readTime)}</span>
          </div>
        </a>
        ${isOwn ? `
        <div style="position:relative">
          <button class="article-menu-btn" aria-label="Article options">${icon('moreHorizontal')}</button>
        </div>` : ''}
      </div>

      <a href="article.html?id=${article.id}" class="article-card-body" aria-label="Read: ${escapeHtml(article.title)}">
        <div class="article-card-text">
          <h2 class="article-title">${escapeHtml(article.title)}</h2>
          ${article.subtitle ? `<p class="article-subtitle">${escapeHtml(article.subtitle)}</p>` : ''}
          <p class="article-excerpt">${escapeHtml(excerpt)}</p>
        </div>
        ${article.coverImage ? `
        <div class="article-card-cover">
          <img src="${article.coverImage}" alt="${escapeHtml(article.title)}" loading="lazy" onerror="this.parentElement.style.display='none'" />
        </div>` : ''}
      </a>

      <div class="article-card-footer">
        <div class="article-tags">${tagsHTML}</div>
        <div class="article-card-actions">
          <button class="article-action-btn article-like-btn ${liked ? 'liked' : ''}" aria-label="${liked ? 'Unlike' : 'Like'} article" aria-pressed="${liked}">
            <span class="article-action-icon">${liked ? icon('heartFilled') : icon('heart')}</span>
            <span class="article-like-count">${formatCount(article.likes)}</span>
          </button>
          <button class="article-action-btn article-comment-btn" aria-label="Comments">
            <span class="article-action-icon">${icon('messageCircle')}</span>
            <span>${formatCount(commentCount)}</span>
          </button>
          <a href="article.html?id=${article.id}" class="article-action-btn" aria-label="Read full article">
            <span class="article-action-icon">${icon('arrowLeft', {size: 14})}</span>
            <span>Read</span>
          </a>
        </div>
      </div>

    </div>`;

  // Like button
  card.querySelector('.article-like-btn').addEventListener('click', (e) => {
    e.stopPropagation();
    if (!currentUser) { showToast('Please log in to like articles', 'warning'); return; }
    handleArticleLike(article.id, currentUser.id, card.querySelector('.article-like-btn'));
  });

  // Menu (own articles)
  const menuBtn = card.querySelector('.article-menu-btn');
  if (menuBtn) {
    menuBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      openDropdown(menuBtn, [
        { icon: icon('pencil'), label: 'Edit article', action: () => window.location.href = `write-article.html?edit=${article.id}` },
        { icon: icon('trash'), label: 'Delete article', danger: true, action: () => confirmDeleteArticle(article.id, card) },
      ]);
    });
  }

  // Comment btn → navigate
  card.querySelector('.article-comment-btn').addEventListener('click', () => {
    window.location.href = `article.html?id=${article.id}#comments`;
  });

  return card;
}

/* ---- Like an article ---- */
function handleArticleLike(articleId, userId, btn) {
  const liked = toggleArticleLike(articleId, userId);
  const articles = getArticles();
  const article  = articles.find(a => a.id === articleId);
  if (article) {
    article.likes = liked ? article.likes + 1 : Math.max(0, article.likes - 1);
    saveArticles(articles);
  }
  const likeIcon  = btn.querySelector('.article-action-icon');
  const likeCount = btn.querySelector('.article-like-count');
  likeIcon.innerHTML = liked ? icon('heartFilled') : icon('heart');
  btn.classList.toggle('liked', liked);
  btn.setAttribute('aria-pressed', liked);
  if (article) likeCount.textContent = formatCount(article.likes);
  showToast(liked ? 'Article liked' : 'Like removed', liked ? 'success' : 'info', 2000);
}

/* ---- Delete article ---- */
function confirmDeleteArticle(articleId, cardEl) {
  if (!confirm('Delete this article? This cannot be undone.')) return;
  deleteArticle(articleId);
  cardEl.style.transition = 'opacity 0.3s ease, max-height 0.4s ease, margin 0.3s ease';
  cardEl.style.overflow = 'hidden';
  cardEl.style.maxHeight = cardEl.offsetHeight + 'px';
  requestAnimationFrame(() => {
    cardEl.style.opacity = '0';
    cardEl.style.maxHeight = '0';
    cardEl.style.marginBottom = '0';
  });
  setTimeout(() => cardEl.remove(), 420);
  showToast('Article deleted', 'info', 2000);
}

/* ---- Render articles feed ---- */
function renderArticlesFeed(articles, containerEl, currentUser, emptyMsg = 'No articles yet.') {
  containerEl.innerHTML = '';
  if (!articles || articles.length === 0) {
    containerEl.innerHTML = `
      <div class="empty-state">
        <div class="empty-state-icon">${icon('fileText', {size: 48})}</div>
        <h3>${emptyMsg}</h3>
        <p>Check back soon or be the first to write one.</p>
      </div>`;
    return;
  }
  articles.forEach(a => {
    const card = buildArticleCard(a, currentUser);
    if (card) containerEl.appendChild(card);
  });
}

/* ---- Render article content for reader page ---- */
function renderArticleContent(content) {
  // Convert basic markdown-like syntax to HTML for the reader
  let html = escapeHtml(content);
  // ## Headings
  html = html.replace(/^## (.+)$/gm, '<h2>$1</h2>');
  html = html.replace(/^### (.+)$/gm, '<h3>$1</h3>');
  // **bold**
  html = html.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
  // *italic*
  html = html.replace(/\*(.+?)\*/g, '<em>$1</em>');
  // `code`
  html = html.replace(/`([^`]+)`/g, '<code>$1</code>');
  // code blocks (```...```)
  html = html.replace(/```[\w]*\n([\s\S]*?)```/g, '<pre><code>$1</code></pre>');
  // - list items
  html = html.replace(/^- (.+)$/gm, '<li>$1</li>');
  html = html.replace(/(<li>.*<\/li>\n?)+/g, '<ul>$&</ul>');
  // Paragraphs — double newline = paragraph break
  html = html.split('\n\n').map(block => {
    block = block.trim();
    if (!block) return '';
    if (block.startsWith('<h2>') || block.startsWith('<h3>') ||
        block.startsWith('<ul>') || block.startsWith('<pre>')) return block;
    return `<p>${block.replace(/\n/g, '<br>')}</p>`;
  }).join('\n');
  return html;
}
