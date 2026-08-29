const STORAGE_KEY = 'store_reviews_v1';
const ADMIN_PASS_KEY = 'store_admin_pass_v1';
const DEFAULT_PASSCODE = 'admin123';

const SEED_REVIEWS = [
  {
    id: '1',
    name: 'أحمد خليل',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150',
    is_verified: true,
    stars: 5,
    title: 'جودة ممتازة وسرعة بالتوصيل',
    body: 'اشتريت السماعات وكانت الجودة فوق المتوقع. الصوت واضح جداً والبطارية تدوم طويلاً.',
    date: 'منذ يومين'
  },
  {
    id: '2',
    name: 'سارة عبدالله',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
    is_verified: true,
    stars: 5,
    title: 'تجربة تسوق رائعة',
    body: 'الموقع سهل الاستخدام والمنتج وصل بحالة ممتازة وأسرع مما توقعت. سأكرر التجربة بالتأكيد.',
    date: 'منذ 3 أيام'
  },
  {
    id: '3',
    name: 'محمد العتيبي',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150',
    is_verified: true,
    stars: 4,
    title: 'منتج جيد وخدمة عملاء متعاونة',
    body: 'كان هناك تأخير بسيط بالشحن لكن فريق خدمة العملاء تعامل معي باحترافية وحل المشكلة بسرعة.',
    date: 'منذ أسبوع'
  },
  {
    id: '4',
    name: 'نورة الشمري',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150',
    is_verified: true,
    stars: 5,
    title: 'أفضل من توقعاتي',
    body: 'الجودة عالية جداً والتغليف كان أنيقاً. أنصح الجميع بالشراء من هذا المتجر.',
    date: 'منذ أسبوعين'
  }
];

function getReviews() {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(SEED_REVIEWS));
    return [...SEED_REVIEWS];
  }
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : [...SEED_REVIEWS];
  } catch (e) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(SEED_REVIEWS));
    return [...SEED_REVIEWS];
  }
}

function saveReviews(reviews) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(reviews));
}

function addReview(review) {
  const reviews = getReviews();
  review.id = Date.now().toString();
  reviews.unshift(review);
  saveReviews(reviews);
  return reviews;
}

function deleteReview(id) {
  const reviews = getReviews().filter(r => r.id !== id);
  saveReviews(reviews);
  return reviews;
}

function getAdminPass() {
  return localStorage.getItem(ADMIN_PASS_KEY) || DEFAULT_PASSCODE;
}

function starsSVG(count, size = 18) {
  let html = '';
  for (let i = 0; i < 5; i++) {
    const filled = i < count;
    html += `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="${filled ? '#4E9FE5' : '#E2E8F0'}" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87L18.18 21 12 17.77 5.82 21 7 14.14l-5-4.87 6.91-1.01L12 2z"/>
    </svg>`;
  }
  return html;
}

function checkmarkBadge() {
  return `<span class="verified-badge">
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="12" cy="12" r="12" fill="#4E9FE5"/>
      <path d="M7 12.5l3 3 7-7" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>
    مشتري مؤكد
  </span>`;
}

function escapeHTML(str) {
  const div = document.createElement('div');
  div.textContent = str == null ? '' : str;
  return div.innerHTML;
}

function computeAverage(reviews) {
  if (!reviews.length) return '0.0';
  const sum = reviews.reduce((acc, r) => acc + Number(r.stars), 0);
  return (sum / reviews.length).toFixed(1);
}
