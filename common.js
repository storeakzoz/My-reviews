const STORAGE_KEY = 'akzoz_store_reviews';

const DEFAULT_AVATAR = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%2394A3B8'%3E%3Cpath d='M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 4c1.93 0 3.5 1.57 3.5 3.5S13.93 13 12 13s-3.5-1.57-3.5-3.5S10.07 6 12 6zm0 14c-2.03 0-3.8-1.04-4.84-2.61.03-1.6 3.22-2.48 4.84-2.48 1.61 0 4.81.88 4.84 2.48C15.8 18.96 14.03 20 12 20z'/%3E%3C/svg%3E";

const initialReviews = [
  {
    id: 1,
    name: "أحمد السالم",
    stars: 5,
    title: "تجربة ممتازة جداً",
    body: "الخدمة كانت سريعة والمنتج بجودة عالية، ننصح بالتعامل معهم.",
    image: null,
    date: "2026-08-15",
    is_verified: true,
    avatar: DEFAULT_AVATAR,
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
    image: null,
    date: "2026-08-20",
    is_verified: true,
    avatar: DEFAULT_AVATAR,
    replies: []
  }
];

function getReviews() {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(initialReviews));
      return initialReviews;
    }
    return JSON.parse(data);
  } catch (e) {
    return initialReviews;
  }
}

function saveReviews(reviews) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(reviews));
  } catch (e) {
    alert("مساحة التخزين التلقائي ممتلئة.");
  }
}

function computeAverage(reviews) {
  if (!reviews || !reviews.length) return "0.0";
  const sum = reviews.reduce((acc, r) => acc + Number(r.stars || 0), 0);
  return (sum / reviews.length).toFixed(1);
}

function escapeHTML(str) {
  return String(str || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
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

function compressAndGetBase64(file, maxWidth = 600) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target.result;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;

        if (width > maxWidth) {
          height = Math.round((height * maxWidth) / width);
          width = maxWidth;
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL('image/jpeg', 0.7));
      };
      img.onerror = error => reject(error);
    };
    reader.onerror = error => reject(error);
  });
}
