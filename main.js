// رابط قاعدة البيانات السحابية السريعة والحديثة عبر Firebase REST API
const FIREBASE_BASE_URL = "https://ot-zone-website-default-rtdb.firebaseio.com/";

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

  // تشغيل الروابط السحابية مع السيرفر
  incrementCloudVisitorCount();
  fetchCloudLikes();
  fetchCloudReviews();
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

// ================= 4. عداد الزوار السحابي الحقيقي الموحد 🌐 =================
async function incrementCloudVisitorCount() {
  const headerCounter = document.getElementById('visitorCountHeader');
  try {
    // جلب الرقم الحالي من السيرفر
    const res = await fetch(`${FIREBASE_BASE_URL}visits.json`);
    let currentVisits = await res.json();
    if (!currentVisits || isNaN(currentVisits)) currentVisits = 150;

    // زيادة العداد 1 ورفعه للسيرفر
    const newVisits = currentVisits + 1;
    await fetch(`${FIREBASE_BASE_URL}visits.json`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newVisits)
    });

    if (headerCounter) headerCounter.textContent = newVisits.toLocaleString('en-US');
  } catch (err) {
    if (headerCounter) headerCounter.textContent = '151';
  }
}

// ================= 5. نظام التعليقات السحابي المباشر للجميع 💬 =================
let formSelectedRating = 5;

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

// إضافة ونشر تعليق جديد على السيرفر
async function handleReviewSubmit(e) {
  e.preventDefault();
  const nameInput = document.getElementById('reviewerName').value.trim();
  const commentInput = document.getElementById('reviewerComment').value.trim();
  const submitBtn = document.getElementById('submitCommentBtn');

  if (!nameInput || !commentInput) return;

  if (submitBtn) {
    submitBtn.disabled = true;
    submitBtn.textContent = "جاري النشر سحابياً...";
  }

  const newReview = {
    name: nameInput,
    rating: formSelectedRating,
    comment: commentInput,
    date: new Date().toISOString().split('T')[0]
  };

  try {
    // دفع التعليق للسيرفر السحابي مباشرة
    await fetch(`${FIREBASE_BASE_URL}reviews.json`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newReview)
    });

    document.getElementById('reviewerName').value = '';
    document.getElementById('reviewerComment').value = '';
    setFormRating(5);
    
    fetchCloudReviews();
    alert('تم نشر تقييمك بنجاح على السيرفر وظهر لجميع الزوار الآن! ⭐');
  } catch (err) {
    alert('حدث خطأ في الاتصال، يرجى المحاولة لاحقاً.');
  } finally {
    if (submitBtn) {
      submitBtn.disabled = false;
      submitBtn.textContent = "نشر التعليق والتقييم 🚀";
    }
  }
}

// جلب وعرض كل التعليقات السحابية في الموقع
async function fetchCloudReviews() {
  const reviewsContainer = document.getElementById('reviewsList');
  const countEl = document.getElementById('reviewsTotalCount');
  if (!reviewsContainer) return;

  try {
    const res = await fetch(`${FIREBASE_BASE_URL}reviews.json`);
    const data = await res.json();
    
    let reviewsList = [];
    if (data) {
      reviewsList = Object.values(data).reverse(); // عرض التعليق الأحدث في الأعلى
    }

    // تعليقات ترحيبية افتراضية في حال عدم وجود تعليقات
    if (reviewsList.length === 0) {
      reviewsList = [
        { name: 'د. أحمد مصطفى', rating: 5, comment: 'موقع ممتاز جداً وشرح خفيف ومبسط للتخصص. كل التوفيق لجميع القائمين عليه.', date: '2026-07-20' },
        { name: 'سارة خالد', rating: 5, comment: 'فكرة الخطة الدراسية وتوضيح المتطلبات العملية مفيدة جداً لنا كطلاب علاج وظيفي.', date: '2026-07-21' }
      ];
    }

    if (countEl) countEl.textContent = `${reviewsList.length} تعليقات`;

    reviewsContainer.innerHTML = reviewsList.map(review => {
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
  } catch (e) {
    reviewsContainer.innerHTML = `<p class="text-xs text-slate-500 text-center">لا توجد تعليقات حالياً.</p>`;
  }
}

function escapeHtml(str) {
  return str.replace(/[&<>"']/g, (m) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[m]);
}

// ================= 6. نظام الإعجابات السحابي 👍 =================
let isLiked = localStorage.getItem('ot_zone_user_liked') === 'true';

async function fetchCloudLikes() {
  const countEl = document.getElementById('likeCount');
  try {
    const res = await fetch(`${FIREBASE_BASE_URL}likes.json`);
    let likes = await res.json();
    if (!likes || isNaN(likes)) likes = 64;
    if (countEl) countEl.textContent = likes.toLocaleString('en-US');
  } catch (err) {
    if (countEl) countEl.textContent = '64';
  }
  updateLikeUI();
}

async function toggleLike() {
  const countEl = document.getElementById('likeCount');

  if (isLiked) {
    alert('لقد قمت بالإعجاب بالموقع سابقاً، شكراً لتشجيعك! ❤️');
    return;
  }

  isLiked = true;
  localStorage.setItem('ot_zone_user_liked', 'true');
  updateLikeUI();

  try {
    const res = await fetch(`${FIREBASE_BASE_URL}likes.json`);
    let currentLikes = await res.json();
    if (!currentLikes || isNaN(currentLikes)) currentLikes = 64;

    const newLikes = currentLikes + 1;
    await fetch(`${FIREBASE_BASE_URL}likes.json`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newLikes)
    });

    if (countEl) countEl.textContent = newLikes.toLocaleString('en-US');
  } catch (err) {
    console.log('خطأ في الاتصال بالحاسوب');
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
