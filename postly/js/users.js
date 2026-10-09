/* ========================================
   POSTLY - users.js
   User data, sample data initialization
   ======================================== */

/* ---- Post cover images (inline SVG data URIs, one per sample post topic) ---- */
const POST_IMAGES = {
  javascript: `data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' width='600' height='300'><defs><linearGradient id='a' x1='0' y1='0' x2='1' y2='1'><stop offset='0' stop-color='%231a1a2e'/><stop offset='1' stop-color='%2316213e'/></linearGradient></defs><rect width='600' height='300' fill='url(%23a)'/><rect x='170' y='65' width='260' height='150' rx='14' fill='%23f7df1e'/><text x='300' y='168' font-family='monospace' font-size='88' font-weight='bold' fill='%231a1a2e' text-anchor='middle'>JS</text><text x='300' y='262' font-family='Arial' font-size='17' fill='%23f7df1e' text-anchor='middle' font-weight='600'>JavaScript Fundamentals</text></svg>`,

  ai: `data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' width='600' height='300'><defs><linearGradient id='b' x1='0' y1='0' x2='1' y2='1'><stop offset='0' stop-color='%230f0c29'/><stop offset='1' stop-color='%2324243e'/></linearGradient></defs><rect width='600' height='300' fill='url(%23b)'/><circle cx='300' cy='128' r='72' fill='none' stroke='%23a78bfa' stroke-width='3'/><circle cx='300' cy='128' r='48' fill='none' stroke='%236c63ff' stroke-width='2'/><circle cx='300' cy='128' r='22' fill='%236c63ff'/><circle cx='228' cy='96' r='9' fill='%23a78bfa'/><circle cx='372' cy='96' r='9' fill='%23a78bfa'/><circle cx='213' cy='160' r='7' fill='%23818cf8'/><circle cx='387' cy='160' r='7' fill='%23818cf8'/><line x1='237' y1='100' x2='278' y2='120' stroke='%23a78bfa' stroke-width='2'/><line x1='363' y1='100' x2='322' y2='120' stroke='%23a78bfa' stroke-width='2'/><line x1='220' y1='156' x2='278' y2='136' stroke='%23818cf8' stroke-width='2'/><line x1='380' y1='156' x2='322' y2='136' stroke='%23818cf8' stroke-width='2'/><text x='300' y='244' font-family='Arial' font-size='17' fill='%23a78bfa' text-anchor='middle' font-weight='600'>Generative AI &amp; The Future</text></svg>`,

  startup: `data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' width='600' height='300'><defs><linearGradient id='c' x1='0' y1='0' x2='1' y2='1'><stop offset='0' stop-color='%23134e4a'/><stop offset='1' stop-color='%23065f46'/></linearGradient></defs><rect width='600' height='300' fill='url(%23c)'/><polygon points='300,52 512,212 88,212' fill='none' stroke='%2334d399' stroke-width='3'/><polygon points='300,86 464,196 136,196' fill='none' stroke='%236ee7b7' stroke-width='1.5' opacity='0.5'/><circle cx='300' cy='52' r='10' fill='%2334d399'/><circle cx='512' cy='212' r='10' fill='%2334d399'/><circle cx='88' cy='212' r='10' fill='%2334d399'/><text x='300' y='262' font-family='Arial' font-size='17' fill='%2334d399' text-anchor='middle' font-weight='600'>Startup and Entrepreneurship</text></svg>`,

  cleancode: `data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' width='600' height='300'><defs><linearGradient id='d' x1='0' y1='0' x2='1' y2='1'><stop offset='0' stop-color='%231e1b4b'/><stop offset='1' stop-color='%23312e81'/></linearGradient></defs><rect width='600' height='300' fill='url(%23d)'/><rect x='80' y='60' width='440' height='168' rx='10' fill='%23111827'/><rect x='80' y='60' width='440' height='32' rx='10' fill='%231f2937'/><circle cx='110' cy='76' r='7' fill='%23ef4444'/><circle cx='134' cy='76' r='7' fill='%23f59e0b'/><circle cx='158' cy='76' r='7' fill='%2322c55e'/><text x='116' y='120' font-family='monospace' font-size='14' fill='%236c63ff'>function</text><text x='210' y='120' font-family='monospace' font-size='14' fill='%2334d399'> clean</text><text x='272' y='120' font-family='monospace' font-size='14' fill='%23f8fafc'>(code) {</text><text x='136' y='148' font-family='monospace' font-size='13' fill='%2394a3b8'>  // less is more</text><text x='116' y='176' font-family='monospace' font-size='14' fill='%23f8fafc'>}</text><text x='300' y='264' font-family='Arial' font-size='17' fill='%23818cf8' text-anchor='middle' font-weight='600'>Clean Code Philosophy</text></svg>`,

  css: `data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' width='600' height='300'><defs><linearGradient id='e' x1='0' y1='0' x2='1' y2='1'><stop offset='0' stop-color='%231e3a5f'/><stop offset='1' stop-color='%231a1a2e'/></linearGradient></defs><rect width='600' height='300' fill='url(%23e)'/><rect x='88' y='52' width='184' height='124' rx='8' fill='%233b82f6' opacity='0.9'/><rect x='150' y='72' width='58' height='84' rx='4' fill='%231e40af'/><rect x='328' y='52' width='184' height='56' rx='8' fill='%236c63ff' opacity='0.9'/><rect x='328' y='120' width='84' height='56' rx='8' fill='%238b5cf6' opacity='0.9'/><rect x='424' y='120' width='88' height='56' rx='8' fill='%237c3aed' opacity='0.9'/><text x='300' y='218' font-family='monospace' font-size='15' fill='%2393c5fd' text-anchor='middle'>display: grid</text><text x='300' y='264' font-family='Arial' font-size='17' fill='%2393c5fd' text-anchor='middle' font-weight='600'>CSS Grid and Modern Layout</text></svg>`,

  communication: `data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' width='600' height='300'><defs><linearGradient id='f' x1='0' y1='0' x2='1' y2='1'><stop offset='0' stop-color='%231c1917'/><stop offset='1' stop-color='%23292524'/></linearGradient></defs><rect width='600' height='300' fill='url(%23f)'/><rect x='68' y='62' width='220' height='52' rx='26' fill='%23f59e0b'/><rect x='312' y='62' width='220' height='52' rx='26' fill='%236c63ff'/><rect x='68' y='132' width='464' height='52' rx='10' fill='%23374151'/><text x='178' y='95' font-family='Arial' font-size='15' fill='%231c1917' text-anchor='middle' font-weight='700'>Clear Writing</text><text x='422' y='95' font-family='Arial' font-size='15' fill='white' text-anchor='middle' font-weight='700'>Technical Skill</text><text x='300' y='165' font-family='Arial' font-size='14' fill='%239ca3af' text-anchor='middle'>= Faster Career Growth</text><text x='300' y='264' font-family='Arial' font-size='17' fill='%23f59e0b' text-anchor='middle' font-weight='600'>Communication in Tech</text></svg>`,

  opensource: `data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' width='600' height='300'><defs><linearGradient id='g' x1='0' y1='0' x2='1' y2='1'><stop offset='0' stop-color='%230d1117'/><stop offset='1' stop-color='%23161b22'/></linearGradient></defs><rect width='600' height='300' fill='url(%23g)'/><circle cx='300' cy='116' r='60' fill='%23238636' opacity='0.9'/><path d='M300 76c-24 0-44 20-44 44 0 20 13 37 31 43 2 0 3-1 3-3v-10c-11 2-14-5-14-5-2-5-5-7-5-7-4-3 0-3 0-3 5 1 8 5 8 5 4 8 11 5 13 4 0-3 2-5 3-6-10-1-21-5-21-22 0-7 2-12 6-15-1-2-2-8 1-15 0 0 4-1 13 5 4-1 7-2 11-2s7 1 11 2c9-6 13-5 13-5 3 7 2 13 1 15 4 3 6 8 6 15 0 17-11 21-21 22 1 2 2 5 2 10v16c0 2 1 3 3 3 18-6 31-23 31-43 0-24-20-44-44-44z' fill='white'/><text x='300' y='216' font-family='Arial' font-size='17' fill='%233fb950' text-anchor='middle' font-weight='600'>Open Source Contribution</text><text x='300' y='248' font-family='Arial' font-size='13' fill='%238b949e' text-anchor='middle'>First PR Merged</text></svg>`,

  networking: `data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' width='600' height='300'><defs><linearGradient id='h' x1='0' y1='0' x2='1' y2='1'><stop offset='0' stop-color='%231e3a5f'/><stop offset='1' stop-color='%230f172a'/></linearGradient></defs><rect width='600' height='300' fill='url(%23h)'/><circle cx='300' cy='116' r='24' fill='%233b82f6'/><circle cx='176' cy='76' r='17' fill='%236c63ff'/><circle cx='424' cy='76' r='17' fill='%236c63ff'/><circle cx='136' cy='166' r='14' fill='%238b5cf6'/><circle cx='464' cy='166' r='14' fill='%238b5cf6'/><circle cx='216' cy='186' r='12' fill='%23a78bfa'/><circle cx='384' cy='186' r='12' fill='%23a78bfa'/><line x1='276' y1='106' x2='193' y2='86' stroke='%233b82f6' stroke-width='2' opacity='0.7'/><line x1='324' y1='106' x2='407' y2='86' stroke='%233b82f6' stroke-width='2' opacity='0.7'/><line x1='176' y1='93' x2='150' y2='153' stroke='%236c63ff' stroke-width='1.5' opacity='0.6'/><line x1='424' y1='93' x2='450' y2='153' stroke='%236c63ff' stroke-width='1.5' opacity='0.6'/><line x1='176' y1='93' x2='224' y2='174' stroke='%236c63ff' stroke-width='1.5' opacity='0.5'/><line x1='424' y1='93' x2='376' y2='174' stroke='%236c63ff' stroke-width='1.5' opacity='0.5'/><text x='300' y='252' font-family='Arial' font-size='17' fill='%2393c5fd' text-anchor='middle' font-weight='600'>Building Your Network</text></svg>`,
};

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
    image: POST_IMAGES.javascript,
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
    image: POST_IMAGES.ai,
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
    image: POST_IMAGES.startup,
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
    image: POST_IMAGES.cleancode,
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
    image: POST_IMAGES.css,
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
    image: POST_IMAGES.communication,
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
    image: POST_IMAGES.opensource,
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
    image: POST_IMAGES.networking,
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
  // Bump this version string any time sample data changes (images, content, etc.)
  const DATA_VERSION = 'v2';
  const storedVersion = localStorage.getItem('postly_data_version');

  if (storedVersion === DATA_VERSION) return; // Already current

  // Re-seed everything with the latest sample data
  saveUsers(SAMPLE_USERS);
  savePosts(SAMPLE_POSTS);
  saveComments(SAMPLE_COMMENTS);

  // Preserve likes/reposts/follows if upgrading (don't wipe user interactions)
  if (storedVersion === null) {
    // Fresh install
    saveLikes({});
    saveReposts({});
  }

  // Mark current version
  localStorage.setItem('postly_data_version', DATA_VERSION);
  localStorage.setItem('postly_initialized', 'true');
}

/* ---- Trending topics (static, based on sample posts) ---- */
const TRENDING_TOPICS = [
  { category: 'Technology', topic: '#JavaScript', count: '2.4K posts' },
  { category: 'Career', topic: '#CareerAdvice', count: '1.8K posts' },
  { category: 'Business', topic: '#Entrepreneurship', count: '1.2K posts' },
  { category: 'AI', topic: '#AI', count: '5.6K posts' },
  { category: 'Development', topic: '#OpenSource', count: '980 posts' },
];
