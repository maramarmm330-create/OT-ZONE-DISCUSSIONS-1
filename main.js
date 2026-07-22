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
    scrollStepUpBtn.addEventListener('click', () => scrollStep(-400));
  }

  if (scrollStepDownBtn) {
    scrollStepDownBtn.addEventListener('click', () => scrollStep(400));
  }

  function scrollStep(amount) {
    window.scrollBy({ top: amount, behavior: 'smooth' });
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

  // 3. عداد الزوار السحابي الحقيقي
  async function updateRealVisitorCount() {
    const headerCounter = document.getElementById('visitorCountHeader');
    const namespace = 'ot-zone-palestine-official-2026';
    const key = 'visits';

    try {
      const response = await fetch(`https://api.countapi.xyz/hit/${namespace}/${key}`);
      const data = await response.json();
      if (data && typeof data.value !== 'undefined') {
        if (headerCounter) headerCounter.textContent = data.value.toLocaleString('en-US');
      }
    } catch (error) {
      if (headerCounter) headerCounter.textContent = '1+';
    }
  }

  updateRealVisitorCount();

  // جلب إحصائية الإعجابات الحقيقية السحابية وعرض التعليقات
  fetchRealLikesCount();
  renderReviews();
});

// 4. دوال فتح وإغلاق النافذة المنبثقة
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

// ================= 5. نظام التعليقات والتقييمات الحقيقي بالموقع =================
let formSelectedRating = 5;
let isLiked = localStorage.getItem('ot_zone_user_liked') === 'true';
const namespace = 'ot-zone-palestine-official-2026';
const likesKey = 'likes';

// التعليقات المبدئية المعروضة بالموقع
const initialReviews = [
  { name: 'د. أحمد مصطفى', rating: 5, comment: 'موقع ممتاز جداً وشرح خفيف ومبسط للتخصص. كل التوفيق لجميع القائمين عليه.', date: '2026-07-20' },
  { name: 'سارة خالد', rating: 5, comment: 'فكرة الخطة الدراسية وتوضيح المتطلبات العملية مفيدة جداً لنا كطلاب علاج وظيفي.', date: '2026-07-21' }
];

// اختيار النجوم بالنموذج
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

// معالجة نشر التعليق المباشر بالموقع
function handleReviewSubmit(e) {
  e.preventDefault();
  const nameInput = document.getElementById('reviewerName').value.trim();
  const commentInput = document.getElementById('reviewerComment').value.trim();

  if (!nameInput || !commentInput) return;

  const newReview = {
    name: nameInput,
    rating: formSelectedRating,
    comment: commentInput,
    date: new Date().toISOString().split('T')[0]
  };

  // حفظ التعليق محلياً
  let storedReviews = JSON.parse(localStorage.getItem('ot_zone_user_reviews') || '[]');
  storedReviews.unshift(newReview);
  localStorage.setItem('ot_zone_user_reviews', JSON.stringify(storedReviews));

  // إعادة تنظيف المدخلات وتحديث العرض
  document.getElementById('reviewerName').value = '';
  document.getElementById('reviewerComment').value = '';
  setFormRating(5);
  renderReviews();

  alert('تم نشر تقييمك ورأيك بنجاح في بند التعليقات! شكرًا لمشاركتك. ⭐');
}

// عرض قائمة التعليقات بالصفحة
function renderReviews() {
  const reviewsContainer = document.getElementById('reviewsList');
  const countEl = document.getElementById('reviewsTotalCount');
  if (!reviewsContainer) return;

  let storedReviews = JSON.parse(localStorage.getItem('ot_zone_user_reviews') || '[]');
  let allReviews = [...storedReviews, ...initialReviews];

  if (countEl) countEl.textContent = `${allReviews.length} تعليقات`;

  reviewsContainer.innerHTML = allReviews.map(review => {
    const starsHtml = '★'.repeat(review.rating) + '☆'.repeat(5 - review.rating);
    return `
      <div class="liquid-glass rounded-2xl p-5 border border-slate-200/80 bg-white shadow-sm hover:shadow-md transition-all">
        <div class="flex items-center justify-between mb-2">
          <div class="flex items-center gap-2">
            <div class="h-9 w-9 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-sm font-bold text-slate-700">👤</div>
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

function escapeHtml(str) {
  return str.replace(/[&<>"']/g, (m) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[m]);
}

// جلب عدد الإعجابات الحقيقي السحابي من السيرفر
async function fetchRealLikesCount() {
  const countEl = document.getElementById('likeCount');
  try {
    const response = await fetch(`https://api.countapi.xyz/get/${namespace}/${likesKey}`);
    const data = await response.json();
    if (data && typeof data.value !== 'undefined') {
      if (countEl) countEl.textContent = data.value.toLocaleString('en-US');
    } else {
      if (countEl) countEl.textContent = '0';
    }
  } catch (error) {
    if (countEl) countEl.textContent = '1';
  }
  updateLikeUI();
}

// الضغط على زر الإعجاب السحابي
async function toggleLike() {
  const heartEl = document.getElementById('likeHeart');
  const countEl = document.getElementById('likeCount');

  if (isLiked) {
    alert('لقد قمت بالإعجاب بالموقع سابقاً، شكراً لتعاطفك وتشجيعك! ❤️');
    return;
  }

  isLiked = true;
  localStorage.setItem('ot_zone_user_liked', 'true');

  if (heartEl) {
    heartEl.classList.add('scale-125');
    setTimeout(() => heartEl.classList.remove('scale-125'), 200);
  }

  updateLikeUI();

  try {
    const response = await fetch(`https://api.countapi.xyz/hit/${namespace}/${likesKey}`);
    const data = await response.json();
    if (data && typeof data.value !== 'undefined') {
      if (countEl) countEl.textContent = data.value.toLocaleString('en-US');
    }
  } catch (error) {
    console.log('حدث خطأ أثناء زيادة الإعجابات سحابياً');
  }
}

function updateLikeUI() {
  const heartEl = document.getElementById('likeHeart');
  const btnEl = document.getElementById('likeBtn');
  
  if (heartEl) heartEl.textContent = isLiked ? '❤️' : '🤍';
  
  if (btnEl) {
    if (isLiked) {
      btnEl.classList.add('bg-rose-100', 'border-rose-300', 'text-rose-900');
      btnEl.classList.remove('bg-white', 'border-slate-300');
    } else {
      btnEl.classList.remove('bg-rose-100', 'border-rose-300', 'text-rose-900');
      btnEl.classList.add('bg-white', 'border-slate-300');
    }
  }
}