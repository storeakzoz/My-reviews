const STORAGE_KEY = 'akzoz_store_reviews';

const initialReviews = [
  {
    id: 1,
    name: "أحمد السالم",
    stars: 5,
    title: "تجربة ممتازة جداً",
    body: "الخدمة كانت سريعة والمنتج بجودة عالية، ننصح بالتعامل معهم.",
    date: "2026-08-15",
    is_verified: true,
    avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150",
    replies: [
      {
        id: 101,
        name: "AKZOZ STORE",
        avatar: "",
        text: "شكراً لثقتك بنا أحمد! يسعدنا تقديم الأفضل دائماً.",
        isAdmin: true
      }
    ]
  },
  {
    id: 2,
    name: "سارة علي",
    stars: 5,
    title: "سرعة في التوصيل",
    body: "وصل الطلب في وقت قياسي والتعامل كان راقي.",
    date: "2026-08-20",
    is_verified: true,
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150",
    replies: []
  }
];

function getReviews() {
  const data = localStorage.getItem(STORAGE_KEY);
  if (!data) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(initialReviews));
    return initialReviews;
  }
  return JSON.parse(data);
}

function saveReviews(reviews) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(reviews));
}

function computeAverage(reviews) {
  if (!reviews.length) return 0;
  const sum = reviews.reduce((acc, r) => acc + r.stars, 0);
  return (sum / reviews.length).toFixed(1);
}

function escapeHTML(str) {
  return String(str || '').replace(/[&<>'"]/g, 
    tag => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[tag] || tag)
  );
}

function starsSVG(count, size = 16) {
  let html = '';
  for (let i = 1; i <= 5; i++) {
    const fill = i <= count ? '#4E9FE5' : '#CBD5E1';
    html += `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="${fill}" xmlns="http://www.w3.org/2000/svg"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87L18.18 21 12 17.77 5.82 21 7 14.14l-5-4.87 6.91-1.01L12 2z"/></svg>`;
  }
  return html;
}

function checkmarkBadge() {
  return `<span class="verified-badge"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20 6 9 17 4 12"></polyline></svg>مشتري موثوق</span>`;
}
