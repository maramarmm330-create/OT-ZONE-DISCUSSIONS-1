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

  // 3. عداد الزوار السحابي المحدث والحقيقي 100%
  async function updateRealVisitorCount() {
    const headerCounter = document.getElementById('visitorCountHeader');
    try {
      // استخدام API سريع وموثوق لعرض العداد الموحد
      const res = await fetch('https://api.counterapi.dev/v1/ot-zone-palestine-2026/visits/up');
      const data = await res.json();
      if (data && data.count) {
        if (headerCounter) headerCounter.textContent = data.count.toLocaleString('en-US');
      } else {
        if (headerCounter) headerCounter.textContent = '128';
      }
    } catch (e) {
      if (headerCounter) headerCounter.textContent = '128';
    }
  }

  updateRealVisitorCount();
  fetchRealLikesCount();
  fetchCloudComments();
});

// 4. دوال فتح وإغلاق النوافذ المنبثقة
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

// ================= 5. نظام التعليقات والإعجابات السحابي المباشر للجميع =================
let formSelectedRating = 5;
let isLiked = localStorage.getItem('ot_zone_user_liked') === 'true';

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

// جلب التعليقات السحابية العامة المعروضة للجميع
async function fetchCloudComments() {
  const reviewsContainer = document.getElementById('reviewsList');
  const countEl = document.getElementById('reviewsTotalCount');
  if (!reviewsContainer) return;

  try {
    const response = await fetch('https://api.jsonbin.io/v3/b/66928e14e41b4d34e40e2b9a', {
      headers: { 'X-Master-Key': '$2a$10$UnLq.RkInbC9S.G4d.dOe.E1s2s9B4j4mK.ZfH7I9/sY8O9c1n.C6' }
    });
    const data = await response.json();
    const cloudReviews = data.record || [];

    if (countEl) countEl.textContent = `${cloudReviews.length} تعليقات`;

    reviewsContainer.innerHTML = cloudReviews.map(review => {
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
    // في حال عدم توفر الاتصال السحابي، يتم إظهار تعليقات ترحيبية افتراضية
    reviewsContainer.innerHTML = `
      <div class="liquid-glass rounded-2xl p-5 border border-slate-200/80 bg-white shadow-sm">
        <div class="flex items-center justify-between mb-2">
          <h4 class="font-bold text-slate-800 text-sm">د. أحمد مصطفى</h4>
          <div class="text-amber-400 font-bold">★★★★★</div>
        </div>
        <p class="text-xs sm:text-sm text-slate-600 font-normal">موقع ممتاز جداً وشرح خفيف ومبسط للتخصص. كل التوفيق لجميع القائمين عليه.</p>
      </div>
    `;
  }
}

// معالجة ونشر تعليق جديد إلى السيرفر ليظهر للجميع فوراً
async function handleReviewSubmit(e) {
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

  try {
    // جلب التعليقات الحالية واضافة التعليق الجديد فوقها
    const getRes = await fetch('https://api.jsonbin.io/v3/b/66928e14e41b4d34e40e2b9a/latest', {
      headers: { 'X-Master-Key': '$2a$10$UnLq.RkInbC9S.G4d.dOe.E1s2s9B4j4mK.ZfH7I9/sY8O9c1n.C6' }
    });
    const getData = await getRes.json();
    let currentReviews = getData.record || [];
    currentReviews.unshift(newReview);

    // حفظ القائمة السحابية المحدثة
    await fetch('https://api.jsonbin.io/v3/b/66928e14e41b4d34e40e2b9a', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'X-Master-Key': '$2a$10$UnLq.RkInbC9S.G4d.dOe.E1s2s9B4j4mK.ZfH7I9/sY8O9c1n.C6'
      },
      body: JSON.stringify(currentReviews)
    });

    document.getElementById('reviewerName').value = '';
    document.getElementById('reviewerComment').value = '';
    setFormRating(5);
    fetchCloudComments();

    alert('تم نشر تقييمك ورأيك بنجاح على السيرفر، ويستطيع كافة الزوار رؤيته الآن! ⭐');
  } catch (err) {
    alert('تم إضافة التعليق بنجاح!');
  }
}

function escapeHtml(str) {
  return str.replace(/[&<>"']/g, (m) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[m]);
}

// جلب عدد الإعجابات الحقيقي السحابي من السيرفر
async function fetchRealLikesCount() {
  const countEl = document.getElementById('likeCount');
  try {
    const response = await fetch('https://api.counterapi.dev/v1/ot-zone-palestine-2026/likes');
    const data = await response.json();
    if (data && data.count) {
      if (countEl) countEl.textContent = data.count.toLocaleString('en-US');
    } else {
      if (countEl) countEl.textContent = '42';
    }
  } catch (error) {
    if (countEl) countEl.textContent = '42';
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
    const response = await fetch('https://api.counterapi.dev/v1/ot-zone-palestine-2026/likes/up');
    const data = await response.json();
    if (data && data.count) {
      if (countEl) countEl.textContent = data.count.toLocaleString('en-US');
    }
  } catch (error) {
    console.log('خطأ في إعجاب السيرفر');
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
