/* ============================================================
   script.js — DiscoverLanka (Backend-Connected Version)
   ============================================================ */

const API_BASE = 'backend/api';

async function apiPost(endpoint, body) {
  const res = await fetch(`${API_BASE}/${endpoint}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Auth-Token': localStorage.getItem('dl_token') || ''
    },
    body: JSON.stringify(body)
  });
  return res.json();
}

async function apiGet(endpoint) {
  const res = await fetch(`${API_BASE}/${endpoint}`, {
    headers: { 'X-Auth-Token': localStorage.getItem('dl_token') || '' }
  });
  return res.json();
}

/* ── HEADER SCROLL ───────────────────────────────────────── */
const header = document.querySelector('.header');
const menuToggle = document.getElementById('menuToggle');
const navbar = document.getElementById('navbar');
const dropdown = document.querySelector('.dropdown');
const heroContent = document.querySelector('.hero-content');

function handleHeaderScroll() {
  if (window.scrollY > 60) header?.classList.add('scrolled');
  else header?.classList.remove('scrolled');
}
window.addEventListener('scroll', handleHeaderScroll);
window.addEventListener('load', handleHeaderScroll);

/* ── MOBILE MENU ─────────────────────────────────────────── */
if (menuToggle && navbar) {
  menuToggle.addEventListener('click', () => {
    navbar.classList.toggle('active');
    document.body.classList.toggle('menu-open');
    const icon = menuToggle.querySelector('i');
    icon.classList.toggle('fa-bars');
    icon.classList.toggle('fa-xmark');
  });
}

document.querySelectorAll('.nav-links a').forEach(link => {
  link.addEventListener('click', () => {
    if (window.innerWidth <= 768 && navbar?.classList.contains('active')) {
      navbar.classList.remove('active');
      document.body.classList.remove('menu-open');
      const icon = menuToggle?.querySelector('i');
      if (icon) { icon.classList.add('fa-bars'); icon.classList.remove('fa-xmark'); }
    }
  });
});

if (dropdown) {
  dropdown.querySelector('a')?.addEventListener('click', e => {
    if (window.innerWidth <= 768) { e.preventDefault(); dropdown.classList.toggle('open'); }
  });
}

/* ── SCROLL REVEAL ───────────────────────────────────────── */
const revealTargets = document.querySelectorAll(
  '.section-title,.explore-card,.step-card,.destination-card,.testimonial-card,.cta-content,.footer-col'
);
revealTargets.forEach(el => el.classList.add('reveal'));

function revealOnScroll() {
  const trigger = window.innerHeight * 0.88;
  revealTargets.forEach(el => {
    if (el.getBoundingClientRect().top < trigger) el.classList.add('active');
  });
}
window.addEventListener('scroll', revealOnScroll);
window.addEventListener('load', revealOnScroll);

/* ── HERO PARALLAX ───────────────────────────────────────── */
window.addEventListener('scroll', () => {
  const y = window.scrollY;
  if (heroContent && y < 700) {
    heroContent.style.transform = `translateY(${y * 0.12}px)`;
    heroContent.style.opacity   = `${1 - y / 950}`;
  }
});

/* ── DESTINATION CARD TILT ───────────────────────────────── */
document.querySelectorAll('.destination-card').forEach(card => {
  card.addEventListener('mousemove', e => {
    if (window.innerWidth <= 768) return;
    const r = card.getBoundingClientRect();
    const rx = ((e.clientY - r.top  - r.height/2) / (r.height/2)) * -4.5;
    const ry = ((e.clientX - r.left - r.width/2)  / (r.width/2))  * 4.5;
    card.style.transform = `perspective(1000px) rotateX(${rx}deg) rotateY(${ry}deg) translateY(-6px)`;
  });
  card.addEventListener('mouseleave', () => {
    card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0)';
  });
});

/* ── BUTTON RIPPLE ───────────────────────────────────────── */
document.querySelectorAll('.btn').forEach(btn => {
  btn.addEventListener('click', function(e) {
    this.querySelector('.ripple-effect')?.remove();
    const ripple = document.createElement('span');
    ripple.classList.add('ripple-effect');
    const r = this.getBoundingClientRect(), s = Math.max(r.width, r.height);
    Object.assign(ripple.style, {
      width: `${s}px`, height: `${s}px`,
      left: `${e.clientX - r.left - s/2}px`,
      top:  `${e.clientY - r.top  - s/2}px`
    });
    this.appendChild(ripple);
  });
});

/* ── SMOOTH SCROLL ───────────────────────────────────────── */
document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', function(e) {
    const id = this.getAttribute('href');
    if (id.length > 1) {
      const target = document.querySelector(id);
      if (target) {
        e.preventDefault();
        const offset = document.querySelector('.header')?.offsetHeight || 80;
        window.scrollTo({ top: target.getBoundingClientRect().top + window.pageYOffset - offset - 20, behavior: 'smooth' });
      }
    }
  });
});

/* ── FLOATING LEAVES ─────────────────────────────────────── */
function createLeafScene() {
  const scene = document.createElement('div');
  scene.className = 'leaf-scene';
  document.body.appendChild(scene);
  for (let i = 0; i < 18; i++) {
    const leaf = document.createElement('span');
    leaf.className = 'leaf';
    const s = Math.random() * 14 + 10;
    Object.assign(leaf.style, {
      width: `${s}px`, height: `${s}px`,
      left: `${Math.random() * 100}%`,
      animationDuration: `${Math.random() * 8 + 10}s`,
      animationDelay: `${Math.random() * 8}s`,
      opacity: `${Math.random() * 0.14 + 0.06}`
    });
    scene.appendChild(leaf);
  }
}
createLeafScene();

/* ── STEP NUMBER HOVER ───────────────────────────────────── */
document.querySelectorAll('.step-number').forEach(step => {
  step.addEventListener('mouseenter', () => step.style.transform = 'scale(1.08) rotate(8deg)');
  step.addEventListener('mouseleave', () => step.style.transform = '');
});

/* ── DESTINATION IMAGE TITLE FIX ─────────────────────────── */
document.querySelectorAll('.destination-image').forEach(img => {
  img.setAttribute('data-title', img.textContent.trim());
  img.textContent = '';
});

/* ── EMAIL VALIDATION ────────────────────────────────────── */
function validateEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

/* ── NEWSLETTER (Backend Connected) ─────────────────────── */
document.querySelectorAll('.newsletter-form').forEach(form => {
  form.addEventListener('submit', async function(e) {
    e.preventDefault();
    const input = this.querySelector('input');
    const email = input.value.trim();
    if (!email)              { alert('Please enter your email address.'); return; }
    if (!validateEmail(email)) { alert('Please enter a valid email address.'); return; }

    const btn = this.querySelector('button[type="submit"]');
    const origHTML = btn.innerHTML;
    btn.innerHTML = '<i class="fas fa-circle-notch fa-spin"></i>';
    btn.disabled = true;

    try {
      const data = await apiPost('newsletter.php', { email });
      alert(data.message || 'Thank you for subscribing!');
      if (data.success) input.value = '';
    } catch {
      alert('Could not subscribe. Please try again.');
    } finally {
      btn.innerHTML = origHTML;
      btn.disabled = false;
    }
  });
});

/* =====================================================
   PLAN TRIP DEVELOPER PAGE FORM
===================================================== */
const plannerDevForm    = document.getElementById('plannerDevForm');
const plannerDevEmail   = document.getElementById('plannerDevEmail');
const plannerDevMessage = document.getElementById('plannerDevMessage');

if (plannerDevForm) {
  plannerDevForm.addEventListener('submit', function(e) {
    e.preventDefault();
    const email = plannerDevEmail.value.trim();
    if (!email)              { plannerDevMessage.textContent = 'Please enter your email.'; plannerDevMessage.style.color = '#ffd6a5'; return; }
    if (!validateEmail(email)) { plannerDevMessage.textContent = 'Invalid email.'; plannerDevMessage.style.color = '#ffb4a2'; return; }
    plannerDevMessage.textContent = 'Thank you! We will update you when this page is ready.';
    plannerDevMessage.style.color = '#d8f3dc';
    plannerDevEmail.value = '';
  });
}

/* =====================================================
   MANUAL ITINERARY PLANNER
===================================================== */
const manualPlannerForm      = document.getElementById('manualPlannerForm');
const addDestinationBtn      = document.getElementById('addDestinationBtn');
const addStopBtn             = document.getElementById('addStopBtn');
const addDayBtn              = document.getElementById('addDayBtn');
const destinationList        = document.getElementById('destinationList');
const stopList               = document.getElementById('stopList');
const dayPlanListBuilder     = document.getElementById('dayPlanListBuilder');
const resetManualPlanner     = document.getElementById('resetManualPlanner');
const manualPrintBtn         = document.getElementById('manualPrintBtn');
const manualPreviewPlaceholder = document.getElementById('manualPreviewPlaceholder');
const manualItineraryResult  = document.getElementById('manualItineraryResult');

let destinationCount = 0, stopCount = 0, dayCount = 0;

if (addDestinationBtn && destinationList) addDestinationBtn.addEventListener('click', addDestinationItem);
if (addStopBtn && stopList)              addStopBtn.addEventListener('click', addStopItem);
if (addDayBtn && dayPlanListBuilder)     addDayBtn.addEventListener('click', addDayPlanItem);
if (manualPrintBtn)                      manualPrintBtn.addEventListener('click', () => window.print());
if (resetManualPlanner)                  resetManualPlanner.addEventListener('click', resetManualPlannerForm);

if (manualPlannerForm) {
  manualPlannerForm.addEventListener('submit', function(e) {
    e.preventDefault();
    generateManualItinerary();
  });
  if (!destinationList.children.length) addDestinationItem();
  if (!stopList.children.length)        addStopItem();
  if (!dayPlanListBuilder.children.length) addDayPlanItem();
}

function addDestinationItem() {
  destinationCount++;
  const card = document.createElement('div');
  card.className = 'manual-item-card';
  card.innerHTML = `
    <div class="manual-item-row">
      <h4>Destination ${destinationCount}</h4>
      <button type="button" class="manual-remove-btn">Remove</button>
    </div>
    <div class="manual-inline-grid">
      <input type="text" class="destination-name" placeholder="Destination name (e.g. Kandy)" />
      <input type="text" class="destination-stay" placeholder="Stay / hotel note" />
    </div>
    <textarea class="destination-note" placeholder="Things to do, important travel notes..."></textarea>
  `;
  destinationList.appendChild(card);
  card.querySelector('.manual-remove-btn').addEventListener('click', () => {
    card.remove();
    updateManualItemTitles(destinationList, 'Destination');
  });
}

function addStopItem() {
  stopCount++;
  const card = document.createElement('div');
  card.className = 'manual-item-card';
  card.innerHTML = `
    <div class="manual-item-row">
      <h4>Stop ${stopCount}</h4>
      <button type="button" class="manual-remove-btn">Remove</button>
    </div>
    <div class="manual-inline-grid">
      <input type="text" class="stop-name" placeholder="Stop name (e.g. Ramboda Falls)" />
      <input type="text" class="stop-between" placeholder="Between which places?" />
    </div>
    <textarea class="stop-note" placeholder="Why visit this stop?"></textarea>
  `;
  stopList.appendChild(card);
  card.querySelector('.manual-remove-btn').addEventListener('click', () => {
    card.remove();
    updateManualItemTitles(stopList, 'Stop');
  });
}

function addDayPlanItem() {
  dayCount++;
  const card = document.createElement('div');
  card.className = 'manual-day-card';
  card.innerHTML = `
    <div class="manual-day-top">
      <h4>Day ${dayCount}</h4>
      <button type="button" class="manual-remove-btn">Remove</button>
    </div>
    <input type="text" class="day-title" placeholder="Day title / route (e.g. Colombo to Kandy)" />
    <textarea class="day-activities" placeholder="Add activities for this day..."></textarea>
  `;
  dayPlanListBuilder.appendChild(card);
  card.querySelector('.manual-remove-btn').addEventListener('click', () => {
    card.remove();
    updateManualDayTitles();
  });
}

function updateManualItemTitles(wrapper, label) {
  wrapper.querySelectorAll('.manual-item-card').forEach((c, i) => {
    c.querySelector('h4').textContent = `${label} ${i + 1}`;
  });
}

function updateManualDayTitles() {
  dayPlanListBuilder.querySelectorAll('.manual-day-card').forEach((c, i) => {
    c.querySelector('h4').textContent = `Day ${i + 1}`;
  });
}

function generateManualItinerary() {
  const tripTitle     = document.getElementById('tripTitle')?.value.trim();
  const tripDays      = document.getElementById('tripDays')?.value.trim();
  const startLocation = document.getElementById('startLocation')?.value.trim();
  const endLocation   = document.getElementById('endLocation')?.value.trim();
  const budget        = document.getElementById('budget')?.value.trim();
  const travelMode    = document.getElementById('travelMode')?.value.trim();
  const accommodation = document.getElementById('accommodation')?.value.trim();
  const interests     = document.getElementById('interests')?.value.trim();
  const foodStyle     = document.getElementById('foodStyle')?.value.trim();
  const specialNotes  = document.getElementById('specialNotes')?.value.trim();

  const destinations = [...destinationList.querySelectorAll('.manual-item-card')].map(c => ({
    name: c.querySelector('.destination-name').value.trim(),
    stay: c.querySelector('.destination-stay').value.trim(),
    note: c.querySelector('.destination-note').value.trim()
  })).filter(d => d.name);

  const stops = [...stopList.querySelectorAll('.manual-item-card')].map(c => ({
    name: c.querySelector('.stop-name').value.trim(),
    between: c.querySelector('.stop-between').value.trim(),
    note: c.querySelector('.stop-note').value.trim()
  })).filter(s => s.name);

  const dayPlans = [...dayPlanListBuilder.querySelectorAll('.manual-day-card')].map((c, i) => ({
    day: i + 1,
    title: c.querySelector('.day-title').value.trim(),
    activities: c.querySelector('.day-activities').value.trim()
  })).filter(d => d.title || d.activities);

  if (!tripTitle)        { alert('Please enter a trip title.'); return; }
  if (!tripDays)         { alert('Please enter trip duration.'); return; }
  if (!startLocation)    { alert('Please enter starting location.'); return; }
  if (!destinations.length) { alert('Please add at least one destination.'); return; }

  renderManualItinerary({ tripTitle, tripDays, startLocation, endLocation, budget, travelMode, accommodation, interests, foodStyle, specialNotes, destinations, stops, dayPlans });
}

function renderManualItinerary(data) {
  manualPreviewPlaceholder?.classList.add('hidden');
  manualItineraryResult?.classList.remove('hidden');

  document.getElementById('resultTripTitle').textContent = data.tripTitle;
  document.getElementById('resultDays').textContent = `${data.tripDays} Days`;
  document.getElementById('resultStart').textContent = data.startLocation;
  document.getElementById('resultEnd').textContent   = data.endLocation || 'Not specified';
  document.getElementById('resultBudget').textContent = data.budget ? `Rs. ${Number(data.budget).toLocaleString('en-LK')}` : 'Not specified';

  // Overview list
  const ol = document.getElementById('manualOverviewList');
  const ov = [
    `Trip duration: ${data.tripDays} day(s)`,
    `Starting: ${data.startLocation}`,
    `Ending: ${data.endLocation || 'Not specified'}`,
    `Travel mode: ${data.travelMode || 'Not specified'}`,
    `Accommodation: ${data.accommodation || 'Not specified'}`,
    `Interests: ${data.interests || 'Not specified'}`,
    `Food: ${data.foodStyle || 'Not specified'}`,
    `Destinations: ${data.destinations.length}`, `Stops: ${data.stops.length}`
  ];
  ol.innerHTML = ov.map(t => `<li>${t}</li>`).join('');

  // Route
  const rw = document.getElementById('manualRouteWrap');
  const route = [data.startLocation, ...data.destinations.map(d => d.name)];
  if (data.endLocation && route[route.length-1] !== data.endLocation) route.push(data.endLocation);
  rw.innerHTML = route.map((r, i) =>
    `<div class="manual-route-tag">${r}</div>${i < route.length-1 ? '<span class="manual-route-arrow"><i class="fas fa-arrow-right"></i></span>' : ''}`
  ).join('');

  // Stops
  const sw = document.getElementById('manualStopWrap');
  sw.innerHTML = data.stops.length
    ? data.stops.map(s => `<div class="manual-stop-tag">${s.name}${s.between ? ` — ${s.between}` : ''}${s.note ? ` — ${s.note}` : ''}</div>`).join('')
    : '<div class="manual-stop-tag">No stops added</div>';

  // Day plans
  const dp = document.getElementById('manualDayPlanOutput');
  dp.innerHTML = data.dayPlans.length
    ? data.dayPlans.map(p => `
        <div class="manual-day-output-card">
          <h4>Day ${p.day}${p.title ? ` — ${p.title}` : ''}</h4>
          <p>${p.activities ? p.activities.replace(/\n/g, '<br>') : 'No activities added.'}</p>
        </div>`).join('')
    : '<div class="manual-day-output-card"><h4>No day plan added</h4></div>';

  // Notes
  document.getElementById('manualNotesBox').textContent = data.specialNotes || 'No notes added.';

  // Save to account button (inject if logged in)
  const user = window.currentAuthUser?.();
  if (user && manualItineraryResult) {
    const existing = document.getElementById('saveManualItinBtn');
    if (!existing) {
      const saveBtn = document.createElement('button');
      saveBtn.id = 'saveManualItinBtn';
      saveBtn.className = 'btn btn-dark';
      saveBtn.style.marginTop = '18px';
      saveBtn.innerHTML = '<i class="fas fa-floppy-disk"></i>&nbsp; Save to My Profile';
      saveBtn.addEventListener('click', () => {
        window.saveItinerary(data.tripTitle, 'manual', data);
      });
      manualItineraryResult.appendChild(saveBtn);
    }
  }

  document.getElementById('manualPreviewPanel')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function resetManualPlannerForm() {
  if (!manualPlannerForm) return;
  manualPlannerForm.reset();
  destinationList.innerHTML = '';
  stopList.innerHTML = '';
  dayPlanListBuilder.innerHTML = '';
  destinationCount = stopCount = dayCount = 0;
  addDestinationItem(); addStopItem(); addDayPlanItem();
  manualPreviewPlaceholder?.classList.remove('hidden');
  manualItineraryResult?.classList.add('hidden');
}

/* =====================================================
   REVIEWS PAGE (Backend Connected)
===================================================== */
const enhancedReviewForm   = document.getElementById('reviewForm');
const enhancedReviewList   = document.getElementById('reviewList');
const enhancedStarRating   = document.getElementById('enhancedStarRating');
const enhancedFilterRating = document.getElementById('filterRating');
const reviewFormMessage    = document.getElementById('reviewFormMessage');
const ratingHelperText     = document.getElementById('ratingHelperText');
const averageRatingValue   = document.getElementById('averageRatingValue');
const totalReviewCount     = document.getElementById('totalReviewCount');

let selectedEnhancedRating = 0;
let enhancedReviews = [];

// ── Load reviews from backend ──
async function loadReviews() {
  if (!enhancedReviewList) return;
  const minRating = enhancedFilterRating?.value !== 'all' ? enhancedFilterRating.value : 1;
  try {
    const data = await apiGet(`reviews.php?min_rating=${minRating}`);
    if (data.success) {
      enhancedReviews = data.reviews.map(r => ({
        name: r.name,
        destination: r.destination,
        travelType: r.travel_type || 'Traveler',
        visitTime: r.visit_time || 'Recent trip',
        title: r.title,
        text: r.review_text,
        rating: parseInt(r.rating)
      }));
      renderEnhancedReviews();
      updateReviewStats();
    }
  } catch {
    // fallback to empty
    enhancedReviewList.innerHTML = '<div class="review-empty-state">Could not load reviews.</div>';
  }
}

// ── Stars ──
if (enhancedStarRating) {
  const stars = enhancedStarRating.querySelectorAll('i');
  stars.forEach(star => {
    star.addEventListener('click', () => {
      selectedEnhancedRating = Number(star.dataset.value);
      updateEnhancedStarUI(selectedEnhancedRating);
      if (ratingHelperText) ratingHelperText.textContent = getRatingText(selectedEnhancedRating);
    });
    star.addEventListener('mouseenter', () => updateEnhancedStarUI(Number(star.dataset.value)));
  });
  enhancedStarRating.addEventListener('mouseleave', () => updateEnhancedStarUI(selectedEnhancedRating));
}

// ── Submit review (Backend) ──
if (enhancedReviewForm) {
  enhancedReviewForm.addEventListener('submit', async function(e) {
    e.preventDefault();

    const name        = document.getElementById('reviewName')?.value.trim();
    const destination = document.getElementById('reviewDestination')?.value.trim();
    const travelType  = document.getElementById('reviewTravelType')?.value;
    const visitTime   = document.getElementById('reviewVisitTime')?.value.trim();
    const title       = document.getElementById('reviewTitle')?.value.trim();
    const text        = document.getElementById('reviewText')?.value.trim();

    if (!name)                     { showReviewFormMessage('Please enter your name.', '#b4232f'); return; }
    if (!destination)              { showReviewFormMessage('Please enter destination.', '#b4232f'); return; }
    if (!selectedEnhancedRating)   { showReviewFormMessage('Please select your rating.', '#b4232f'); return; }
    if (!title)                    { showReviewFormMessage('Please enter a review title.', '#b4232f'); return; }
    if (!text)                     { showReviewFormMessage('Please write your review.', '#b4232f'); return; }

    const submitBtn = this.querySelector('[type="submit"]');
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="fas fa-circle-notch fa-spin"></i>&nbsp; Submitting...';

    try {
      const data = await apiPost('reviews.php', {
        name, destination, travel_type: travelType,
        visit_time: visitTime, title, review_text: text,
        rating: selectedEnhancedRating
      });

      if (data.success) {
        showReviewFormMessage('Thank you! Your review was submitted.', '#2d6a4f');
        enhancedReviewForm.reset();
        selectedEnhancedRating = 0;
        updateEnhancedStarUI(0);
        if (ratingHelperText) ratingHelperText.textContent = 'Click stars to rate your experience';
        await loadReviews();
      } else {
        showReviewFormMessage(data.message || 'Could not submit review.', '#b4232f');
      }
    } catch {
      showReviewFormMessage('Server error. Please try again.', '#b4232f');
    } finally {
      submitBtn.disabled = false;
      submitBtn.innerHTML = '<i class="fas fa-paper-plane"></i>&nbsp; Submit Review';
    }
  });
}

if (enhancedFilterRating) enhancedFilterRating.addEventListener('change', loadReviews);

function updateEnhancedStarUI(rating) {
  enhancedStarRating?.querySelectorAll('i').forEach(star => {
    const v = Number(star.dataset.value);
    star.classList.toggle('active', v <= rating);
    star.classList.toggle('fa-solid', v <= rating);
    star.classList.toggle('fa-regular', v > rating);
  });
}

function getRatingText(r) {
  return ['','Poor experience','Fair experience','Good experience','Very good experience','Excellent experience'][r] || 'Click stars to rate';
}

function showReviewFormMessage(msg, color) {
  if (!reviewFormMessage) return;
  reviewFormMessage.textContent = msg;
  reviewFormMessage.style.color = color;
}

function renderEnhancedReviews() {
  if (!enhancedReviewList) return;
  if (!enhancedReviews.length) {
    enhancedReviewList.innerHTML = '<div class="review-empty-state">No reviews yet. Be the first!</div>';
    return;
  }
  enhancedReviewList.innerHTML = enhancedReviews.map(r => {
    const initials = r.name.split(' ').filter(Boolean).slice(0,2).map(p => p[0].toUpperCase()).join('');
    const stars = '★'.repeat(r.rating) + '☆'.repeat(5 - r.rating);
    return `
      <div class="enhanced-review-card">
        <div class="enhanced-review-head">
          <div class="enhanced-review-user">
            <div class="enhanced-review-avatar">${initials}</div>
            <div>
              <h4>${escapeHtml(r.name)}</h4>
              <div class="enhanced-review-meta">
                ${escapeHtml(r.destination)} • ${escapeHtml(r.travelType)} • ${escapeHtml(r.visitTime)}
              </div>
            </div>
          </div>
          <div class="enhanced-review-stars">${stars}</div>
        </div>
        <h3 class="enhanced-review-title">${escapeHtml(r.title)}</h3>
        <p class="enhanced-review-text">${escapeHtml(r.text)}</p>
        <div class="enhanced-review-tags">
          <span class="enhanced-review-tag">${escapeHtml(r.destination)}</span>
          <span class="enhanced-review-tag">${escapeHtml(r.travelType)}</span>
        </div>
      </div>`;
  }).join('');
}

function updateReviewStats() {
  if (!enhancedReviews.length) return;
  const avg = enhancedReviews.reduce((s, r) => s + r.rating, 0) / enhancedReviews.length;
  if (averageRatingValue)  averageRatingValue.textContent  = avg.toFixed(1);
  if (totalReviewCount)    totalReviewCount.textContent    = enhancedReviews.length;
}

// Load reviews on page load
if (enhancedReviewList) loadReviews();

/* =====================================================
   CONTACT FORM (Backend Connected)
===================================================== */
const contactForm        = document.getElementById('contactForm');
const contactFormMessage = document.getElementById('contactFormMessage');

if (contactForm) {
  contactForm.addEventListener('submit', async function(e) {
    e.preventDefault();

    const name    = document.getElementById('contactName')?.value.trim();
    const email   = document.getElementById('contactEmail')?.value.trim();
    const phone   = document.getElementById('contactPhone')?.value.trim();
    const subject = document.getElementById('contactSubject')?.value.trim();
    const reason  = document.getElementById('contactReason')?.value;
    const message = document.getElementById('contactMessage')?.value.trim();

    if (!name)              { showContactFormMessage('Please enter your full name.', '#b4232f'); return; }
    if (!email || !validateEmail(email)) { showContactFormMessage('Please enter a valid email.', '#b4232f'); return; }
    if (!subject)           { showContactFormMessage('Please enter a subject.', '#b4232f'); return; }
    if (!message)           { showContactFormMessage('Please enter your message.', '#b4232f'); return; }

    const submitBtn = this.querySelector('[type="submit"]');
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="fas fa-circle-notch fa-spin"></i>&nbsp; Sending...';

    try {
      const data = await apiPost('contact.php', { name, email, phone, subject, reason, message });
      showContactFormMessage(data.message || 'Message sent!', data.success ? '#2d6a4f' : '#b4232f');
      if (data.success) contactForm.reset();
    } catch {
      showContactFormMessage('Server error. Please try again.', '#b4232f');
    } finally {
      submitBtn.disabled = false;
      submitBtn.innerHTML = '<i class="fas fa-paper-plane"></i>&nbsp; Send Message';
    }
  });
}

function showContactFormMessage(msg, color) {
  if (!contactFormMessage) return;
  contactFormMessage.textContent = msg;
  contactFormMessage.style.color = color;
}

/* ── HELP CENTER FAQ ─────────────────────────────────────── */
document.querySelectorAll('.faq-question').forEach(q => {
  q.addEventListener('click', () => q.parentElement.classList.toggle('active'));
});

/* ── ESCAPE HTML ─────────────────────────────────────────── */
function escapeHtml(text) {
  const d = document.createElement('div');
  d.textContent = text || '';
  return d.innerHTML;
}
