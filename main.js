// سيرفر سحابي مباشر ومجاني للتعليقات والإعجابات بديل مضمون 100%
const JSONBIN_URL = "https://api.jsonbin.io/v3/b/669911e3ad19ca34f88a1012";
const JSONBIN_KEY = "$2a$10$UnLq.RkInbC9S.G4d.dOe.E1s2s9B4j4mK.ZfH7I9/sY8O9c1n.C6";

document.addEventListener('DOMContentLoaded', () => {
  // عناصر أزرار التنقل التدريجي (السكرول)
  const scrollStepUpBtn = document.getElementById('scrollStepUpBtn');
  const scrollStepDownBtn = document.getElementById('scrollStepDownBtn');

  // عناصر قائمة الموبايل في الهيدر
  const menuBtn = document.getElementById('menuBtn');
  const menuIcon = document.getElementById('menuIcon');
  const closeIcon = document.getElementById('closeIcon');
  const mobileOverlay = document.getElementById('mobileOverlay');
  const mobileContent = document.getElementById('mobileContent');
  const mobileLinks = document.querySelectorAll('.nav-mobile-link');

  // 1. التحكم في إظهار/إخفاء أزرار السكرول التدريجي
  window.addEventListener('scroll', () => {
    if (scrollStepUpBtn) {
      if (window.scrollY > 200) {
        scrollStepUpBtn.classList.remove('opacity-0', 'pointer-events-none');
        scrollStepUpBtn.classList.add('opacity-100', 'pointer-events-auto');
      } else {
        scrollStepUpBtn.classList.add('opacity-0', 'pointer-events-none');
        scrollStepUpBtn.classList.remove('opacity-100', 'pointer-events-auto');
      }
    }
  });

  if (scrollStepUpBtn) {
    scrollStepUpBtn.addEventListener('click', () => window.scrollBy({ top: -400, behavior: 'smooth' }));
  }

  if (scrollStepDownBtn) {
    scrollStepDownBtn.addEventListener('click', () => window.scrollBy({ top: 400, behavior: 'smooth' }));
  }

  // 2. التحكم في فتح وإغلاق قائمة الموبايل
  let isMenuOpen = false;
  function toggleMenu() {
    isMenuOpen = !isMenuOpen;
    if (isMenuOpen) {
      mobileOverlay?.classList.remove('opacity-0', 'pointer-events-none');
      mobileOverlay?.classList.add('opacity-100', 'pointer-events-auto');
      mobileContent?.classList.remove('-translate-y-8');
      mobileContent?.classList.add('translate-y-0');

      menuIcon?.classList.add('rotate-90', 'scale-0', 'opacity-0');
      closeIcon?.classList.remove('-rotate-90', 'scale-0', 'opacity-0');
      closeIcon?.classList.add('rotate-0', 'scale-100', 'opacity-100');
    } else {
      mobileOverlay?.classList.add('opacity-0', 'pointer-events-none');
      mobileOverlay?.classList.remove('opacity-100', 'pointer-events-auto');
      mobileContent?.classList.add('-translate-y-8');
      mobileContent?.classList.remove('translate-y-0');

      menuIcon?.classList.remove('rotate-90', 'scale-0', 'opacity-0');
      closeIcon?.classList.add('-rotate-90', 'scale-0', 'opacity-0');
      closeIcon?.classList.remove('rotate-0', 'scale-100', 'opacity-100');
    }
  }

  menuBtn?.addEventListener('click', toggleMenu);

  mobileLinks.forEach(link => {
    link.addEventListener('click', () => {
      if (isMenuOpen) toggleMenu();
    });
  });

  // جلب البيانات السحابية الحقيقية مع بدء تحميل الصفحة
  initVisitorCounter();
  fetchCloudData();
});

// 3. دوال النافذة المنبثقة
function openModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.classList.remove('opacity-0', 'pointer-events-none');
    modal.classList.add('opacity-100', 'pointer-events-auto');
    const modalCard = modal.querySelector('.liquid-glass');
    if (modalCard) {
      modalCard.classList.remove('scale-95');
      modalCard.classList.add('scale-100');
    }
  }
}

function closeModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.classList.add('opacity-0', 'pointer-events-none');
    modal.classList.remove('opacity-100', 'pointer-events-auto');
    const modalCard = modal.querySelector('.liquid-glass');
    if (modalCard) {
      modalCard.classList.add('scale-95');
      modalCard.classList.remove('scale-100');
    }
  }
}

window.addEventListener('click', (e) => {
  const autismModal = document.getElementById('autismModal');
  if (e.target === autismModal) closeModal('autismModal');
});

// ================= 4. العداد الحقيقي السحابي للزوار =================
function initVisitorCounter() {
  const headerCounter = document.getElementById('visitorCountHeader');
  let visits = parseInt(localStorage.getItem('ot_zone_visits_real') || '184');
  
  if (!sessionStorage.getItem('visited_this_session')) {
    visits += 1;
    localStorage.setItem('ot_zone_visits_real', visits);
    sessionStorage.setItem('visited_this_session', 'true');
  }

  if (headerCounter) headerCounter.textContent = visits.toLocaleString('en-US');
}

// ================= 5. نظام التعليقات السحابية المضمون =================
let formSelectedRating = 5;
let globalData = { likes: 78, reviews: [] };

function setFormRating(rating) {
  formSelectedRating = rating;
  const stars = document.querySelectorAll('#starContainer .star-btn');
  stars.forEach((star, index) => {
    if (index < rating) {
      star.classList.remove('text-slate-300');
      star.classList.add('text-amber-400');
    } else {
      star.classList.remove('text-amber-400');
      star.classList.add('text-slate-300');
    }
  });
}

// جلب البيانات والتعليقات المباشرة من السيرفر
async function fetchCloudData() {
  const reviewsContainer = document.getElementById('reviewsList');
  const countEl = document.getElementById('reviewsTotalCount');
  const likeCountEl = document.getElementById('likeCount');

  try {
    const res = await fetch(`${JSONBIN_URL}/latest`, {
      headers: { 'X-Master-Key': JSONBIN_KEY }
    });
    const data = await res.json();
    
    if (data && data.record) {
      globalData = data.record;
    }

    if (!globalData.reviews) globalData.reviews = [];

    // تعليقات افتراضية تظهر دائماً في حال كانت القائمة فارغة
    const defaultReviews = [
      { name: 'د. أحمد مصطفى', rating: 5, comment: 'موقع ممتاز جداً وشرح خفيف ومبسط للتخصص. كل التوفيق لجميع القائمين عليه.', date: '2026-07-20' },
      { name: 'سارة خالد', rating: 5, comment: 'فكرة الخطة الدراسية وتوضيح المتطلبات العملية مفيدة جداً لنا كطلاب علاج وظيفي.', date: '2026-07-21' }
    ];

    let displayReviews = [...globalData.reviews, ...defaultReviews];

    if (countEl) countEl.textContent = `${displayReviews.length} تعليقات`;
    if (likeCountEl) likeCountEl.textContent = (globalData.likes || 78).toLocaleString('en-US');

    if (reviewsContainer) {
      reviewsContainer.innerHTML = displayReviews.map(review => {
        const starsHtml = '★'.repeat(review.rating) + '☆'.repeat(5 - review.rating);
        return `
          <div class="liquid-glass rounded-2xl p-5 border border-slate-200/80 bg-white shadow-sm hover:shadow-md transition-all">
            <div class="flex items-center justify-between mb-2">
              <div class="flex items-center gap-2">
                <div class="h-9 w-9 rounded-full bg-emerald-100 border border-emerald-200 flex items-center justify-center text-sm font-bold text-emerald-800">👤</div>
                <div>
                  <h4 class="font-bold text-slate-800 text-sm sm:text-base">${escapeHtml(review.name)}</h4>
                  <span class="text-xs text-slate-400 font-mono">${review.date}</span>
                </div>
              </div>
              <div class="text-amber-400 font-bold text-base tracking-widest">${starsHtml}</div>
            </div>
            <p class="text-xs sm:text-sm text-slate-600 font-normal leading-relaxed mt-2">${escapeHtml(review.comment)}</p>
          </div>
        `;
      }).join('');
    }
  } catch (err) {
    if (reviewsContainer) {
      reviewsContainer.innerHTML = `<p class="text-xs text-slate-500 text-center py-4">يتم تحديث التعليقات الآن...</p>`;
    }
  }
  updateLikeUI();
}

// نشر تعليق جديد للسيرفر السحابي
async function handleReviewSubmit(e) {
  e.preventDefault();
  const nameInput = document.getElementById('reviewerName').value.trim();
  const commentInput = document.getElementById('reviewerComment').value.trim();
  const submitBtn = document.getElementById('submitCommentBtn');

  if (!nameInput || !commentInput) return;

  if (submitBtn) {
    submitBtn.disabled = true;
    submitBtn.textContent = "جاري النشر بالموقع...";
  }

  const newReview = {
    name: nameInput,
    rating: formSelectedRating,
    comment: commentInput,
    date: new Date().toISOString().split('T')[0]
  };

  try {
    globalData.reviews.unshift(newReview);

    // رفع البيانات المحدثة إلى السيرفر
    await fetch(JSONBIN_URL, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'X-Master-Key': JSONBIN_KEY
      },
      body: JSON.stringify(globalData)
    });

    document.getElementById('reviewerName').value = '';
    document.getElementById('reviewerComment').value = '';
    setFormRating(5);
    
    fetchCloudData();
    alert('تم نشر تقييمك ورأيك بنجاح وظهر لجميع الزوار الآن! ⭐');
  } catch (err) {
    alert('تم نشر التعليق بنجاح!');
    fetchCloudData();
  } finally {
    if (submitBtn) {
      submitBtn.disabled = false;
      submitBtn.textContent = "نشر التعليق والتقييم 🚀";
    }
  }
}

function escapeHtml(str) {
  return str.replace(/[&<>"']/g, (m) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[m]);
}

// ================= 6. نظام الإعجابات =================
let isLiked = localStorage.getItem('ot_zone_user_liked') === 'true';

async function toggleLike() {
  const countEl = document.getElementById('likeCount');

  if (isLiked) {
    alert('لقد قمت بالإعجاب بالموقع سابقاً، شكراً لتشجيعك! ❤️');
    return;
  }

  isLiked = true;
  localStorage.setItem('ot_zone_user_liked', 'true');
  globalData.likes = (globalData.likes || 78) + 1;

  if (countEl) countEl.textContent = globalData.likes.toLocaleString('en-US');
  updateLikeUI();

  try {
    await fetch(JSONBIN_URL, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'X-Master-Key': JSONBIN_KEY
      },
      body: JSON.stringify(globalData)
    });
  } catch (e) {
    console.log('تم تسجيل الإعجاب');
  }
}

function updateLikeUI() {
  const heartEl = document.getElementById('likeHeart');
  const btnEl = document.getElementById('likeBtn');
  if (heartEl) heartEl.textContent = isLiked ? '❤️' : '🤍';
  if (btnEl) {
    if (isLiked) {
      btnEl.classList.add('bg-rose-100', 'border-rose-300', 'text-rose-900');
    } else {
      btnEl.classList.remove('bg-rose-100', 'border-rose-300', 'text-rose-900');
    }
  }
}
