// ============================================================
// ai-server/server.js  — Node.js AI Trip Planner Server
// Run:     node server.js
// Install: npm install express cors node-fetch dotenv
// ============================================================

require('dotenv').config();
const express = require('express');
const cors    = require('cors');

let fetch;
(async () => { fetch = (await import('node-fetch')).default; })();

const app  = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// ── Health check ─────────────────────────────────────────────
app.get('/health', (_req, res) => res.json({ status: 'ok' }));

// ── Gemini caller ─────────────────────────────────────────────
async function callGemini(apiKey, model, prompt) {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

  const res = await fetch(url, {
    method:  'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: {
        temperature:     0.7,
        maxOutputTokens: 8192,
        responseMimeType: 'application/json'
      }
    }),
    timeout: 120000
  });

  const data = await res.json();

  if (data.error) throw new Error(data.error.message || 'Gemini API error');

  const finishReason = data?.candidates?.[0]?.finishReason || '';
  if (finishReason && finishReason !== 'STOP') {
    console.warn(`Gemini finishReason: ${finishReason}`);
  }

  const text = data?.candidates?.[0]?.content?.parts?.[0]?.text || '';
  if (!text) {
    if (finishReason === 'SAFETY') throw new Error('AI declined due to content policy.');
    throw new Error('AI returned empty response.');
  }

  return text;
}

// ── Safe JSON parse (strips fences, never throws) ─────────────
function safeParseJSON(raw) {
  let text = raw
    .replace(/^```json\s*/i, '')
    .replace(/^```\s*/i, '')
    .replace(/\s*```$/, '')
    .trim();

  // Direct parse
  try { return JSON.parse(text); } catch (_) {}

  // Find outermost { }
  const si = text.indexOf('{');
  if (si === -1) return null;
  text = text.slice(si);

  // Walk brackets to repair truncation
  const stack = [];
  let inStr = false, esc = false, lastGood = 0;

  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (esc)       { esc = false; continue; }
    if (c === '\\') { esc = true;  continue; }
    if (c === '"')  { inStr = !inStr; continue; }
    if (inStr)      continue;
    if (c === '{' || c === '[') stack.push(c);
    if (c === '}' || c === ']') { if (stack.length) stack.pop(); lastGood = i; }
    if (stack.length === 0 && i > 0) { lastGood = i; break; }
  }

  if (stack.length > 0) {
    let t = text.slice(0, lastGood + 1).trimEnd().replace(/,\s*$/, '');
    t += stack.reverse().map(c => c === '{' ? '}' : ']').join('');
    text = t;
  } else {
    text = text.slice(0, lastGood + 1);
  }

  try { return JSON.parse(text); } catch (_) { return null; }
}

// ── Build trip context string (shared by both prompts) ────────
function tripContext(t) {
  return `Start: ${t.start} | Destination: ${t.destination} | Days: ${t.daysNum}
Travelers: ${t.travelers} | Style: ${t.style} | Transport: ${t.transport}
Budget: ${t.budgetLevel} | Stay: ${t.accommodation}
Interests: ${t.interestsStr} | Food: ${t.foodPreference || 'any'} | Pace: ${t.pace || 'moderate'}
Must include: ${t.mustInclude || 'none'} | Avoid: ${t.avoid || 'none'}`;
}

// ── PROMPT 1: overview / meta (small, fast) ───────────────────
function promptMeta(t) {
  return `You are a Sri Lanka travel planner.
Return ONLY raw JSON. No markdown. No text outside JSON.
Keep every string under 120 chars. Arrays max 5 items.

TRIP:
${tripContext(t)}

Return this exact structure:
{
  "title": "",
  "subtitle": "",
  "summary": { "start": "", "destination": "", "days": "${t.daysNum}", "transport": "", "totalEstimatedBudgetLKR": "" },
  "overview": ["","",""],
  "routeFlow": ["","",""],
  "pathStops": [{ "name": "", "positionOnRoute": "", "reason": "", "highlights": ["",""] }],
  "localExperiences": [{ "name": "", "type": "", "description": "", "bestFor": [""] }],
  "budgetBreakdown": [{ "category": "", "estimate": "", "note": "" }],
  "transportGuidance": [{ "mode": "", "detail": "", "priceGuide": "" }],
  "smartTips": ["","",""],
  "importantNotes": ["",""]
}`;
}

// ── PROMPT 2: day plan only (one call per chunk of days) ──────
function promptDays(t, fromDay, toDay) {
  const count = toDay - fromDay + 1;
  return `You are a Sri Lanka travel planner.
Return ONLY raw JSON. No markdown. No text outside JSON.
Keep every string under 150 chars. keyPlaces max 4 items.

TRIP:
${tripContext(t)}

Return ONLY this structure with exactly ${count} day objects (days ${fromDay} to ${toDay}):
{
  "dayPlan": [
    { "day": ${fromDay}, "title": "", "base": "", "plan": "", "keyPlaces": ["",""] }
  ]
}`;
}

// ── Main endpoint ─────────────────────────────────────────────
app.post('/api/ai-plan-trip', async (req, res) => {
  const {
    start, destination, days, travelers,
    style, transport, budgetLevel, accommodation,
    interests = [], foodPreference, pace,
    mustInclude, avoid
  } = req.body;

  if (!start || !destination || !days || !travelers ||
      !style || !transport || !budgetLevel || !accommodation) {
    return res.status(400).json({ success: false, message: 'Missing required fields.' });
  }
  if (start === destination) {
    return res.status(400).json({ success: false, message: 'Start and destination cannot be the same.' });
  }

  const apiKey = process.env.GEMINI_API_KEY || '';
  const model  = process.env.GEMINI_MODEL   || 'gemini-2.5-flash';

  if (!apiKey) {
    return res.status(500).json({ success: false, message: 'Set GEMINI_API_KEY in ai-server/.env' });
  }

  const daysNum      = Math.min(parseInt(days) || 3, 14); // cap at 14 days
  const interestsStr = Array.isArray(interests) ? interests.join(', ') : interests;

  const tripData = {
    start, destination, daysNum, travelers,
    style, transport, budgetLevel, accommodation,
    interestsStr, foodPreference, pace, mustInclude, avoid
  };

  try {
    // ── Call 1: meta / overview ──────────────────────────────
    console.log('Calling Gemini [meta]...');
    const metaRaw  = await callGemini(apiKey, model, promptMeta(tripData));
    const metaPlan = safeParseJSON(metaRaw);

    if (!metaPlan) {
      console.error('Meta parse failed. Raw (500):', metaRaw.slice(0, 500));
      return res.status(500).json({ success: false, message: 'AI returned invalid overview data. Please try again.' });
    }

    // ── Call 2+: day plan in chunks of 3 days ───────────────
    const CHUNK = 3;
    let allDays = [];

    for (let from = 1; from <= daysNum; from += CHUNK) {
      const to = Math.min(from + CHUNK - 1, daysNum);
      console.log(`Calling Gemini [days ${from}-${to}]...`);

      const dayRaw  = await callGemini(apiKey, model, promptDays(tripData, from, to));
      const dayData = safeParseJSON(dayRaw);

      if (dayData && Array.isArray(dayData.dayPlan)) {
        allDays = allDays.concat(dayData.dayPlan);
      } else {
        console.warn(`Day chunk ${from}-${to} parse failed, skipping.`);
      }
    }

    // ── Merge and return ─────────────────────────────────────
    const plan = { ...metaPlan, dayPlan: allDays };

    return res.json({ success: true, plan });

  } catch (err) {
    console.error('AI server error:', err.message);
    return res.status(500).json({ success: false, message: 'AI service error: ' + err.message });
  }
});

// ── Start ─────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`AI Trip Planner running on http://localhost:${PORT}`);
});
