/* ========================================
   POSTLY - users.js
   User data, sample data initialization
   ======================================== */

// Avatar background colours for initials-based avatars
const AVATAR_COLORS = [
  '#6c63ff', '#ff6584', '#22c55e', '#f59e0b',
  '#3b82f6', '#ec4899', '#14b8a6', '#f97316'
];

function getAvatarColor(id) {
  if (!id) return AVATAR_COLORS[0];
  // Convert any ID (numeric or string) to a stable index
  const str = String(id);
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash * 31 + str.charCodeAt(i)) & 0xffffffff;
  }
  return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length];
}

function getInitials(name) {
  if (!name || typeof name !== 'string') return '?';
  return name
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .map(n => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase() || '?';
}

/* Build the HTML snippet for an avatar (initials fallback) */
function buildAvatarHTML(user, size = 'md') {
  const initials = getInitials(user.displayName || user.handle || '?');
  const color = getAvatarColor(user.id);
  return `<span style="background:${color}" aria-label="${user.displayName || user.handle}">${initials}</span>`;
}

/* ---- Sample Data ---- */
const SAMPLE_USERS = [
  {
    id: '1',
    displayName: 'Ande Dauda',
    handle: 'andedauda',
    bio: 'Frontend Developer & UI/UX Enthusiast. Building the web one component at a time.',
    followers: 180,
    following: 95,
    joinedDate: '2023-01-15',
    avatarColor: '#6c63ff',
  },
  {
    id: '2',
    displayName: 'Sarah Chen',
    handle: 'sarahcodes',
    bio: 'Full-Stack Engineer | Open Source Contributor | Coffee addict',
    followers: 542,
    following: 210,
    joinedDate: '2022-08-20',
    avatarColor: '#ec4899',
  },
  {
    id: '3',
    displayName: 'Michael Torres',
    handle: 'mikeTech',
    bio: 'Software Architect. Passionate about scalable systems and clean code.',
    followers: 1200,
    following: 340,
    joinedDate: '2021-05-10',
    avatarColor: '#3b82f6',
  },
  {
    id: '4',
    displayName: 'Amara Osei',
    handle: 'amarabuilds',
    bio: 'Product Manager | Tech Entrepreneur | Mentor',
    followers: 870,
    following: 430,
    joinedDate: '2022-03-01',
    avatarColor: '#22c55e',
  },
  {
    id: '5',
    displayName: 'James Rivera',
    handle: 'jrivera_ai',
    bio: 'AI/ML Researcher. Working on making machines smarter so humans can be more productive.',
    followers: 2300,
    following: 180,
    joinedDate: '2020-11-22',
    avatarColor: '#f97316',
  },
];

const SAMPLE_POSTS = [
  {
    id: 'p1',
    authorId: '2',
    content: "Learning JavaScript completely changed how I think about web development. It's not just a language — it's a new way of seeing the web. If you're starting out, don't skip the fundamentals. Closures, callbacks, and the event loop will make everything click.",
    image: null,
    likes: 24,
    comments: 2,
    reposts: 4,
    createdAt: new Date(Date.now() - 2 * 3600 * 1000).toISOString(),
    tags: ['#JavaScript', '#WebDev', '#Learning'],
    isRepost: false,
  },
  {
    id: 'p2',
    authorId: '5',
    content: "The rise of generative AI is reshaping every industry. But here's the thing nobody talks about — the real competitive advantage won't be AI itself, it'll be the people who know how to work WITH AI effectively. Start learning prompt engineering. Today.",
    image: null,
    likes: 89,
    comments: 2,
    reposts: 31,
    createdAt: new Date(Date.now() - 5 * 3600 * 1000).toISOString(),
    tags: ['#AI', '#FutureOfWork', '#Tech'],
    isRepost: false,
  },
  {
    id: 'p3',
    authorId: '4',
    content: "3 things I wish I knew before starting my first tech company:\n\n1. Product-market fit beats everything else\n2. Hire for attitude, train for skill\n3. Cash flow is king — revenue solves most problems\n\nSave this. You'll thank me later.",
    image: null,
    likes: 156,
    comments: 1,
    reposts: 67,
    createdAt: new Date(Date.now() - 8 * 3600 * 1000).toISOString(),
    tags: ['#Startup', '#Entrepreneurship', '#Business'],
    isRepost: false,
  },
  {
    id: 'p4',
    authorId: '3',
    content: "Hot take: The best code is code you delete. Every time I refactor a legacy system I'm amazed at how much complexity was added 'just in case.' Build what you need. Delete what you don't. Keep it simple.",
    image: null,
    likes: 203,
    comments: 1,
    reposts: 58,
    createdAt: new Date(Date.now() - 24 * 3600 * 1000).toISOString(),
    tags: ['#CleanCode', '#SoftwareEngineering', '#Programming'],
    isRepost: false,
  },
  {
    id: 'p5',
    authorId: '1',
    content: "CSS Grid just clicked for me today after struggling for weeks. All it took was building something real with it. Theory is important, but there's no substitute for actually shipping something.\n\nWhat concept took you the longest to understand?",
    image: null,
    likes: 41,
    comments: 1,
    reposts: 9,
    createdAt: new Date(Date.now() - 36 * 3600 * 1000).toISOString(),
    tags: ['#CSS', '#WebDesign', '#Frontend'],
    isRepost: false,
  },
  {
    id: 'p6',
    authorId: '5',
    content: "The most underrated skill in tech? Writing clearly. Engineers who write well — documentation, emails, RFCs — consistently get promoted faster. Communication IS a technical skill.",
    image: null,
    likes: 312,
    comments: 1,
    reposts: 114,
    createdAt: new Date(Date.now() - 48 * 3600 * 1000).toISOString(),
    tags: ['#CareerAdvice', '#SoftSkills', '#Tech'],
    isRepost: false,
  },
  {
    id: 'p7',
    authorId: '2',
    content: "Open source just accepted my first PR! Three months ago I was too scared to even look at the codebase. Today, my code ships to thousands of users. Start small. Read the docs. Ask questions. The community is welcoming.",
    image: null,
    likes: 78,
    comments: 1,
    reposts: 15,
    createdAt: new Date(Date.now() - 72 * 3600 * 1000).toISOString(),
    tags: ['#OpenSource', '#GitHub', '#Developer'],
    isRepost: false,
  },
  {
    id: 'p8',
    authorId: '4',
    content: "Reminder: Your network is your net worth — but only if you actually help people in it. Stop treating LinkedIn as a job board. Start treating it as a community. Share knowledge. Make introductions. Add value before you ask for anything.",
    image: null,
    likes: 445,
    comments: 1,
    reposts: 201,
    createdAt: new Date(Date.now() - 96 * 3600 * 1000).toISOString(),
    tags: ['#Networking', '#PersonalDevelopment', '#Career'],
    isRepost: false,
  },
];

const SAMPLE_COMMENTS = [
  { id: 'c1', postId: 'p1', authorId: '1', text: 'Great explanation! The event loop concept blew my mind when I finally understood it.', createdAt: new Date(Date.now() - 1.5 * 3600 * 1000).toISOString() },
  { id: 'c2', postId: 'p1', authorId: '3', text: 'This is exactly what I needed to hear. Been grinding through closures all week!', createdAt: new Date(Date.now() - 1 * 3600 * 1000).toISOString() },
  { id: 'c3', postId: 'p2', authorId: '1', text: 'Prompt engineering is such an undervalued skill right now. Getting on it!', createdAt: new Date(Date.now() - 4 * 3600 * 1000).toISOString() },
  { id: 'c4', postId: 'p2', authorId: '4', text: 'Absolutely agree. The people who thrive will be the ones who leverage AI, not compete with it.', createdAt: new Date(Date.now() - 3.5 * 3600 * 1000).toISOString() },
  { id: 'c5', postId: 'p3', authorId: '2', text: 'Point #1 is everything. We spent 6 months building features nobody wanted. Hard lesson learned.', createdAt: new Date(Date.now() - 7 * 3600 * 1000).toISOString() },
  { id: 'c6', postId: 'p4', authorId: '5', text: 'YAGNI (You Ain\'t Gonna Need It) is one of the most important principles and one of the hardest to follow.', createdAt: new Date(Date.now() - 22 * 3600 * 1000).toISOString() },
  { id: 'c7', postId: 'p5', authorId: '3', text: 'CSS Grid took me literally 2 years to feel comfortable with. Grid areas were my breakthrough moment!', createdAt: new Date(Date.now() - 34 * 3600 * 1000).toISOString() },
  { id: 'c8', postId: 'p6', authorId: '4', text: 'Writing documentation is my north star. If you can\'t explain it clearly, you don\'t fully understand it yet.', createdAt: new Date(Date.now() - 46 * 3600 * 1000).toISOString() },
  { id: 'c9', postId: 'p7', authorId: '5', text: 'Congrats! The first PR is always the hardest. It only gets easier from here.', createdAt: new Date(Date.now() - 70 * 3600 * 1000).toISOString() },
  { id: 'c10', postId: 'p8', authorId: '2', text: 'The reciprocity principle. Give first, always. This changed my whole approach to networking.', createdAt: new Date(Date.now() - 94 * 3600 * 1000).toISOString() },
];

/* ---- Initialize app data on first load ---- */
function initializeSampleData() {
  if (isInitialized()) return;

  saveUsers(SAMPLE_USERS);
  savePosts(SAMPLE_POSTS);
  saveComments(SAMPLE_COMMENTS);
  saveLikes({});
  saveReposts({});

  // Do NOT set a default current user — auth pages handle login now.
  // (Old sessions that still have a currentUser in storage will continue to work.)

  markInitialized();
}

/* ---- Trending topics (static, based on sample posts) ---- */
const TRENDING_TOPICS = [
  { category: 'Technology', topic: '#JavaScript', count: '2.4K posts' },
  { category: 'Career', topic: '#CareerAdvice', count: '1.8K posts' },
  { category: 'Business', topic: '#Entrepreneurship', count: '1.2K posts' },
  { category: 'AI', topic: '#AI', count: '5.6K posts' },
  { category: 'Development', topic: '#OpenSource', count: '980 posts' },
];
