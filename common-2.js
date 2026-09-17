/* ============================================================
   إعداد Firebase - قاعدة بيانات مشتركة لكل التقييمات
   ============================================================ */
const firebaseConfig = {
  apiKey: "AIzaSyA82hkguGKl3uyoAGgVGftw-ipKsXRCS8M",
  authDomain: "akzoz-store.firebaseapp.com",
  projectId: "akzoz-store",
  storageBucket: "akzoz-store.firebasestorage.app",
  messagingSenderId: "22651043704",
  appId: "1:22651043704:web:ff020682b2910a32d1128d",
  measurementId: "G-MG8XWX7QG6"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
const reviewsCol = db.collection('reviews');

/* ============================================================
   رمز دخول لوحة الأدمن (بقى محلي بالمتصفح - نفس الطريقة القديمة)
   ============================================================ */
const ADMIN_PASS_KEY = 'akzoz_admin_pass';
const DEFAULT_PASSCODE = '7syn';

function getAdminPass() {
  return localStorage.getItem(ADMIN_PASS_KEY) || DEFAULT_PASSCODE;
}

const DEFAULT_AVATAR = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%2394A3B8'%3E%3Cpath d='M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 4c1.93 0 3.5 1.57 3.5 3.5S13.93 13 12 13s-3.5-1.57-3.5-3.5S10.07 6 12 6zm0 14c-2.03 0-3.8-1.04-4.84-2.61.03-1.6 3.22-2.48 4.84-2.48 1.61 0 4.81.88 4.84 2.48C15.8 18.96 14.03 20 12 20z'/%3E%3C/svg%3E";

/* ============================================================
   دوال مساعدة عامة (تنسيق، حماية، نجوم...)
   ============================================================ */
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

function computeAverage(reviews) {
  if (!reviews.length) return '0.0';
  const sum = reviews.reduce((acc, r) => acc + Number(r.stars || 0), 0);
  return (sum / reviews.length).toFixed(1);
}

function getBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });
}

/* ============================================================
   طبقة البيانات (Firestore) - كل التقييمات محفوظة بمجموعة "reviews"
   كل تقييم فيه حقل status: 'pending' (بانتظار الموافقة) أو 'approved' (منشور)
   ============================================================ */
function docToReview(doc) {
  const d = doc.data();
  return { id: doc.id, ...d, replies: d.replies || [] };
}

// استماع مباشر (real-time) للتقييمات المنشورة فقط - يستخدم بالصفحة الرئيسية
function listenApprovedReviews(callback) {
  return reviewsCol.where('status', '==', 'approved').onSnapshot(snap => {
    const reviews = snap.docs.map(docToReview);
    reviews.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
    callback(reviews);
  }, err => console.error('listenApprovedReviews error:', err));
}

// استماع مباشر للتقييمات بانتظار الموافقة - يستخدم بلوحة الأدمن فقط
function listenPendingReviews(callback) {
  return reviewsCol.where('status', '==', 'pending').onSnapshot(snap => {
    const reviews = snap.docs.map(docToReview);
    reviews.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
    callback(reviews);
  }, err => console.error('listenPendingReviews error:', err));
}

// زبون يرسل تقييم من الموقع العام -> يترسل كـ"طلب معلق" فقط
async function submitCustomerReview({ name, stars, title, body, image }) {
  return reviewsCol.add({
    name,
    stars,
    title,
    body,
    image: image || null,
    avatar: DEFAULT_AVATAR,
    is_verified: false,
    replies: [],
    status: 'pending',
    date: new Date().toISOString().split('T')[0],
    createdAt: Date.now()
  });
}

// الأدمن يضيف تقييم مباشرة من لوحة التحكم -> ينشر فوراً (موافقة تلقائية لأنه هو مصدره)
async function addAdminReview({ name, avatar, title, stars, body, image, is_verified }) {
  return reviewsCol.add({
    name,
    avatar: avatar || DEFAULT_AVATAR,
    title,
    stars,
    body,
    image: image || null,
    is_verified: !!is_verified,
    replies: [],
    status: 'approved',
    date: new Date().toISOString().split('T')[0],
    createdAt: Date.now()
  });
}

async function approveReview(id) {
  return reviewsCol.doc(id).update({ status: 'approved' });
}

async function rejectReview(id) {
  return reviewsCol.doc(id).delete();
}

async function deleteReviewDoc(id) {
  return reviewsCol.doc(id).delete();
}

async function addReplyToDoc(id, reply) {
  const ref = reviewsCol.doc(id);
  const snap = await ref.get();
  const replies = (snap.data() && snap.data().replies) || [];
  replies.push(reply);
  return ref.update({ replies });
}

async function deleteReplyFromDoc(id, index) {
  const ref = reviewsCol.doc(id);
  const snap = await ref.get();
  const replies = (snap.data() && snap.data().replies) || [];
  replies.splice(index, 1);
  return ref.update({ replies });
}
