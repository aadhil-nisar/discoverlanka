/* ============================================================
   plan-trip.js — AI Trip Planner
   ============================================================ */

const aiTripPlannerForm = document.getElementById('aiTripPlannerForm');
const resetAiTripBtn = document.getElementById('resetAiTripBtn');
const aiPlannerStatus = document.getElementById('aiPlannerStatus');
const smartResultPlaceholder = document.getElementById('smartResultPlaceholder');
const smartResultWrap = document.getElementById('smartResultWrap');
const printAiPlanBtnTop = document.getElementById('printAiPlanBtnTop');

const AI_API_URL = 'http://localhost:3001/api/ai-plan-trip';

function getCheckedInterests() {
  return Array.from(
    document.querySelectorAll('.smart-trip-check-grid input[type="checkbox"]:checked')
  ).map((item) => item.value);
}

function getPlannerPayload() {
  return {
    start: document.getElementById('tripStart')?.value || '',
    destination: document.getElementById('tripDestination')?.value || '',
    days: document.getElementById('tripDays')?.value || '',
    travelers: document.getElementById('tripPeople')?.value || '',
    style: document.getElementById('tripStyle')?.value || '',
    transport: document.getElementById('tripTransport')?.value || '',
    budgetLevel: document.getElementById('tripBudgetLevel')?.value || '',
    accommodation: document.getElementById('tripStay')?.value || '',
    interests: getCheckedInterests(),
    foodPreference: document.getElementById('tripFood')?.value || '',
    pace: document.getElementById('tripPace')?.value || '',
    mustInclude: document.getElementById('tripMustInclude')?.value.trim() || '',
    avoid: document.getElementById('tripAvoid')?.value.trim() || ''
  };
}

function validatePlannerPayload(data) {
  if (!data.start) return 'Please select the starting point.';
  if (!data.destination) return 'Please select the main destination.';
  if (data.start === data.destination) return 'Starting point and destination cannot be the same.';
  if (!data.days) return 'Please select trip duration.';
  if (!data.travelers) return 'Please select number of travelers.';
  if (!data.style) return 'Please select travel style.';
  if (!data.transport) return 'Please select transport type.';
  if (!data.budgetLevel) return 'Please select budget level.';
  if (!data.accommodation) return 'Please select accommodation type.';
  return '';
}

function escapeHtml(text = '') {
  return String(text)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function showLoadingState() {
  smartResultPlaceholder?.classList.add('hidden');
  smartResultWrap?.classList.remove('hidden');

  if (smartResultWrap) {
    smartResultWrap.innerHTML = `
      <div class="smart-block">
        <div class="smart-loading">
          <i class="fas fa-wand-magic-sparkles"></i>
          Generating your smart itinerary
          <div class="smart-loading-dots">
            <span></span><span></span><span></span>
          </div>
        </div>
        <p style="margin-top:12px;color:var(--muted)">
          Creating route flow, stop suggestions, local experiences, transport guidance, and budget estimate...
        </p>
      </div>
    `;
  }
}

function showError(message) {
  smartResultPlaceholder?.classList.add('hidden');
  smartResultWrap?.classList.remove('hidden');

  if (smartResultWrap) {
    smartResultWrap.innerHTML = `
      <div class="smart-error-box">
        <strong>Unable to generate itinerary.</strong>
        <p style="margin-top:8px">${escapeHtml(message)}</p>
      </div>
    `;
  }
}

function renderSummaryCards(plan) {
  const s = plan.summary || {};

  return `
    <div class="smart-summary-grid">
      ${[
        { label: 'Route', value: `${s.start || '-'} → ${s.destination || '-'}` },
        { label: 'Duration', value: s.days ? `${s.days} Day(s)` : '-' },
        { label: 'Transport', value: s.transport || '-' },
        { label: 'Est. Budget', value: s.totalEstimatedBudgetLKR || '-' }
      ]
        .map(
          (card) => `
            <div class="smart-summary-card">
              <span>${escapeHtml(card.label)}</span>
              <strong>${escapeHtml(card.value)}</strong>
            </div>
          `
        )
        .join('')}
    </div>
  `;
}

function renderSimpleList(items, cls = 'smart-note-list') {
  if (!items || !items.length) {
    return '<p>No details generated.</p>';
  }

  return `
    <div class="${cls}">
      ${items.map((item) => `<div class="smart-note-item">${escapeHtml(item)}</div>`).join('')}
    </div>
  `;
}

function renderRouteFlow(plan) {
  const route = plan.routeFlow || [];

  if (!route.length) {
    return '<p>No route flow generated.</p>';
  }

  return `
    <div class="smart-route-line">
      ${route
        .map(
          (stop, i) => `
            <span class="smart-route-stop">${escapeHtml(stop)}</span>
            ${i < route.length - 1 ? '<span class="smart-route-arrow"><i class="fas fa-arrow-right"></i></span>' : ''}
          `
        )
        .join('')}
    </div>
  `;
}

function renderStops(plan) {
  const stops = plan.pathStops || [];

  if (!stops.length) {
    return '<p>No stop suggestions generated.</p>';
  }

  return `
    <div class="smart-stop-list">
      ${stops
        .map(
          (stop) => `
            <div class="smart-stop-card">
              <h4>${escapeHtml(stop.name || 'Stop')}</h4>
              <div class="smart-stop-meta">${escapeHtml(stop.positionOnRoute || '')}</div>
              <p>${escapeHtml(stop.reason || '')}</p>
              <div class="smart-pill-row">
                ${(stop.highlights || [])
                  .map((tag) => `<span class="smart-pill">${escapeHtml(tag)}</span>`)
                  .join('')}
              </div>
            </div>
          `
        )
        .join('')}
    </div>
  `;
}

function renderExperiences(plan) {
  const list = plan.localExperiences || [];

  if (!list.length) {
    return '<p>No local experiences generated.</p>';
  }

  return `
    <div class="smart-exp-list">
      ${list
        .map(
          (item) => `
            <div class="smart-exp-card">
              <h4>${escapeHtml(item.name || 'Experience')}</h4>
              <div class="smart-exp-meta">${escapeHtml(item.type || '')}</div>
              <p>${escapeHtml(item.description || '')}</p>
              <div class="smart-pill-row">
                ${(item.bestFor || [])
                  .map((tag) => `<span class="smart-pill">${escapeHtml(tag)}</span>`)
                  .join('')}
              </div>
            </div>
          `
        )
        .join('')}
    </div>
  `;
}

function renderBudget(plan) {
  const budget = plan.budgetBreakdown || [];

  if (!budget.length) {
    return '<p>No budget estimate generated.</p>';
  }

  return `
    <div class="smart-budget-list">
      ${budget
        .map(
          (item) => `
            <div class="smart-budget-card">
              <h4>${escapeHtml(item.category || 'Budget Item')}</h4>
              <p>${escapeHtml(item.estimate || '')}</p>
              <p>${escapeHtml(item.note || '')}</p>
            </div>
          `
        )
        .join('')}
    </div>
  `;
}

function renderTransport(plan) {
  const transport = plan.transportGuidance || [];

  if (!transport.length) {
    return '<p>No transport guidance generated.</p>';
  }

  return `
    <div class="smart-transport-list">
      ${transport
        .map(
          (item) => `
            <div class="smart-transport-card">
              <h4>${escapeHtml(item.mode || 'Transport')}</h4>
              <p>${escapeHtml(item.detail || '')}</p>
              <p>${escapeHtml(item.priceGuide || '')}</p>
            </div>
          `
        )
        .join('')}
    </div>
  `;
}

function renderDayPlan(plan) {
  const days = plan.dayPlan || [];

  if (!days.length) {
    return '<p>No day-by-day plan generated.</p>';
  }

  return `
    <div class="smart-day-list">
      ${days
        .map(
          (day) => `
            <div class="smart-day-card">
              <h4>Day ${escapeHtml(String(day.day || ''))} — ${escapeHtml(day.title || '')}</h4>
              <div class="smart-day-meta">${escapeHtml(day.base || '')}</div>
              <p>${escapeHtml(day.plan || '')}</p>
              <div class="smart-pill-row">
                ${(day.keyPlaces || [])
                  .map((place) => `<span class="smart-pill">${escapeHtml(place)}</span>`)
                  .join('')}
              </div>
            </div>
          `
        )
        .join('')}
    </div>
  `;
}

function injectSaveButton(plan, payload) {
  if (typeof window.currentAuthUser !== 'function') return;
  const user = window.currentAuthUser();
  if (!user) return;

  const existing = document.getElementById('saveAiItinBtn');
  if (existing) return;

  const actions = document.querySelector('.smart-result-top-actions');
  if (!actions) return;

  const btn = document.createElement('button');
  btn.id = 'saveAiItinBtn';
  btn.type = 'button';
  btn.className = 'btn smart-mini-btn';
  btn.innerHTML = '<i class="fas fa-floppy-disk"></i>&nbsp; Save to Profile';

  btn.addEventListener('click', async () => {
    if (typeof window.saveItinerary !== 'function') return;

    const title = `${payload?.start || ''} → ${payload?.destination || ''} (${payload?.days || '?'} days)`;
    const saved = await window.saveItinerary(title, 'ai', { plan, payload });

    if (saved) {
      btn.innerHTML = '<i class="fas fa-check"></i>&nbsp; Saved!';
      btn.disabled = true;
    }
  });

  actions.appendChild(btn);
}

function attachResultButtons(payload, plan) {
  const copyBtn = document.getElementById('copyAiPlanBtn');
  const printBtn = document.getElementById('printAiPlanBtn');

  printBtn?.addEventListener('click', () => window.print());

  copyBtn?.addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText(smartResultWrap?.innerText.trim() || '');
      copyBtn.innerHTML = '<i class="fas fa-check"></i>&nbsp; Copied';
      setTimeout(() => {
        copyBtn.innerHTML = '<i class="fas fa-copy"></i>&nbsp; Copy';
      }, 1800);
    } catch (error) {
      alert('Unable to copy the itinerary.');
    }
  });

  injectSaveButton(plan, payload);
}

function renderPlan(plan, payload) {
  smartResultPlaceholder?.classList.add('hidden');
  smartResultWrap?.classList.remove('hidden');

  if (!smartResultWrap) return;

  smartResultWrap.innerHTML = `
    <div class="smart-result-top">
      <div>
        <span class="smart-result-label">AI Trip Result</span>
        <h2 id="aiResultTitle">${escapeHtml(plan.title || 'Smart Sri Lanka Itinerary')}</h2>
        <p id="aiResultSubtitle">${escapeHtml(plan.subtitle || 'Route-based personalized travel plan')}</p>
      </div>

      <div class="smart-result-top-actions">
        <button type="button" class="btn smart-mini-btn" id="copyAiPlanBtn">
          <i class="fas fa-copy"></i>&nbsp; Copy
        </button>
        <button type="button" class="btn smart-mini-btn" id="printAiPlanBtn">
          <i class="fas fa-print"></i>&nbsp; Print
        </button>
      </div>
    </div>

    ${renderSummaryCards(plan)}

    <div class="smart-block">
      <div class="smart-block-head">
        <h3><i class="fas fa-circle-info"></i> Overview</h3>
      </div>
      <div id="aiOverview">${renderSimpleList(plan.overview || [])}</div>
    </div>

    <div class="smart-block">
      <div class="smart-block-head">
        <h3><i class="fas fa-route"></i> Route Flow</h3>
      </div>
      <div id="aiRouteFlow">${renderRouteFlow(plan)}</div>
    </div>

    <div class="smart-block">
      <div class="smart-block-head">
        <h3><i class="fas fa-location-dot"></i> Stops on the Way</h3>
      </div>
      <div id="aiPathStops">${renderStops(plan)}</div>
    </div>

    <div class="smart-block">
      <div class="smart-block-head">
        <h3><i class="fas fa-store"></i> Local Shops & Food Experiences</h3>
      </div>
      <div id="aiLocalExperiences">${renderExperiences(plan)}</div>
    </div>

    <div class="smart-block">
      <div class="smart-block-head">
        <h3><i class="fas fa-wallet"></i> Budget Breakdown</h3>
      </div>
      <div id="aiBudget">${renderBudget(plan)}</div>
    </div>

    <div class="smart-block">
      <div class="smart-block-head">
        <h3><i class="fas fa-bus"></i> Transport Guidance</h3>
      </div>
      <div id="aiTransport">${renderTransport(plan)}</div>
    </div>

    <div class="smart-block">
      <div class="smart-block-head">
        <h3><i class="fas fa-calendar-days"></i> Day-by-Day Plan</h3>
      </div>
      <div id="aiDayPlan">${renderDayPlan(plan)}</div>
    </div>

    <div class="smart-block">
      <div class="smart-block-head">
        <h3><i class="fas fa-lightbulb"></i> Smart Tips</h3>
      </div>
      <div id="aiTips">${renderSimpleList(plan.smartTips || [])}</div>
    </div>

    <div class="smart-block">
      <div class="smart-block-head">
        <h3><i class="fas fa-triangle-exclamation"></i> Important Notes</h3>
      </div>
      <div id="aiNotes">${renderSimpleList(plan.importantNotes || [])}</div>
    </div>
  `;

  attachResultButtons(payload, plan);
  smartResultWrap.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

async function generateAiTripPlan(payload) {
  const response = await fetch(AI_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Auth-Token': localStorage.getItem('dl_token') || ''
    },
    body: JSON.stringify(payload)
  });

  let data;

  try {
    data = await response.json();
  } catch (error) {
    throw new Error('Server returned invalid JSON.');
  }

  if (!response.ok || !data.success) {
    throw new Error(data.message || `Server error (${response.status})`);
  }

  return data.plan;
}

if (aiTripPlannerForm) {
  aiTripPlannerForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const payload = getPlannerPayload();
    const err = validatePlannerPayload(payload);

    if (err) {
      if (aiPlannerStatus) {
        aiPlannerStatus.textContent = err;
        aiPlannerStatus.style.color = '#b4232f';
      }
      return;
    }

    if (aiPlannerStatus) {
      aiPlannerStatus.textContent = 'Generating your route-aware itinerary...';
      aiPlannerStatus.style.color = '#2d6a4f';
    }

    showLoadingState();

    try {
      const plan = await generateAiTripPlan(payload);
      renderPlan(plan, payload);

      if (aiPlannerStatus) {
        aiPlannerStatus.textContent = 'Your smart itinerary is ready.';
        aiPlannerStatus.style.color = '#2d6a4f';
      }
    } catch (error) {
      showError(error.message || 'Something went wrong.');

      if (aiPlannerStatus) {
        aiPlannerStatus.textContent = 'Could not generate itinerary.';
        aiPlannerStatus.style.color = '#b4232f';
      }
    }
  });
}

resetAiTripBtn?.addEventListener('click', () => {
  aiTripPlannerForm?.reset();

  if (aiPlannerStatus) {
    aiPlannerStatus.textContent =
      'Your itinerary will include route flow, stops, local experiences, and budget guidance.';
    aiPlannerStatus.style.color = '';
  }

  smartResultWrap?.classList.add('hidden');
  smartResultPlaceholder?.classList.remove('hidden');
});

printAiPlanBtnTop?.addEventListener('click', () => window.print());