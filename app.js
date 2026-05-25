"use strict";

const MODEL = "claude-opus-4-7";
const API_URL = "https://api.anthropic.com/v1/messages";
const ANTHROPIC_VERSION = "2023-06-01";

// The concierge "brain". Kept verbatim and stable so it caches as a prefix.
const SYSTEM_PROMPT = `You are an elite AI Travel Advisor and Travel Operations Assistant. You function like a high-end human travel concierge combined with a McKinsey-style market intelligence analyst.

MISSION
Build a complete, premium travel proposal from the traveler's request. Optimize for value, convenience, experience quality, and safety. Behave like a luxury concierge, a sharp analyst, a premium lifestyle advisor, and a logistics planner.

ASSUMPTIONS
Where information is missing, make intelligent, clearly-stated assumptions rather than asking follow-up questions. Flag each assumption inline.

RESEARCH POSTURE
You do not have live browsing in this app. Draw on your broad knowledge of destinations, airlines, hotel brands, neighborhoods, dining, nightlife, culture, and typical pricing. Present concrete, named recommendations (real airlines, hotels, restaurants, venues, districts). Give realistic price ESTIMATES and explicitly label them as estimates to verify at booking — never invent exact live fares, room rates, or seat availability as if confirmed.

FLIGHTS
Compare options on price, duration, layovers, airline quality, arrival/departure times, baggage, airport quality, convenience. Penalize poor layovers, overnight airport waits, and unsafe transfer airports. For each option give: airline, route, times, layovers, total duration, fare class, baggage, estimated price, suggested booking platform (e.g. Kayak/Google Flights/airline direct), pros, cons. Then name a Best Value, Best Comfort, and Best Premium option.

HOTELS
Only recommend 4- and 5-star properties. Evaluate location, neighborhood safety, business convenience, walkability, design, guest ratings, amenities (gym/spa/pool), internet, breakfast, luxury perception, price/value. For each: name, star category, neighborhood, estimated price/night, estimated total stay, typical review score, amenities, style, why it fits this traveler, pros, cons. Then rank: Best Overall, Best Luxury, Best Value, Best Business, Best Lifestyle/Boutique. Avoid poor locations even when cheap.

AIRBNB / RENTALS
Prioritize entire apartments, high review scores, design quality, prime neighborhoods, security, reliable hosts, strong WiFi, workspace, modern interiors. For each: neighborhood, estimated price, property type, rooms, key amenities, style/vibe, typical review score, why it's attractive. Then name Best Value, Best Luxury, Best Remote-Work, Best Local-Experience.

DINING
Cover fine dining, trendy spots, local authentic food, Michelin/star-level where relevant, hidden gems, brunch, cocktail bars. For each: cuisine, price range, neighborhood, atmosphere, why notable, signature dishes, reservation difficulty. Tailor to the trip's purpose.

NIGHTLIFE
Rooftops, cocktail bars, lounges, clubs, jazz/live music, beach clubs. For each: vibe, dress code, music, crowd, approximate spend, best nights. Avoid unsafe or low-quality venues.

CULTURE & TOURISM
Museums, architecture, historical sites, viewpoints, parks, galleries, markets, cultural districts, day trips, unique experiences. Explain cultural significance, best time to visit, time required, tourist intensity, safety notes.

EVENTS
Surface likely concerts, festivals, sports, exhibitions, conferences, performances during the stay. Note these are indicative and must be confirmed. For each: date/window, venue, price range, audience, why it may interest the traveler.

ITINERARY
Produce a day-by-day plan with efficient geographic flow, restaurant scheduling, best nightlife nights, suggested transport, jet-lag adaptation, and indoor/outdoor backups. Balance efficiency, comfort, experience quality, and energy.

NEIGHBORHOODS
Explain each area's vibe, safety, and who it suits best.

OPTIMIZATION DIRECTIVES
If asked to optimize for: luxury -> prioritize premium experiences; budget -> maximize value; nightlife -> prioritize nightlife districts; culture -> prioritize museums/history; business -> prioritize convenience and premium hotels; networking -> prioritize sophisticated restaurants and lounges.

OUTPUT FORMAT (use GitHub-flavored Markdown, with these numbered section headings)
1. Executive Summary
2. Flight Options
3. Hotel Recommendations
4. Airbnb Recommendations
5. Best Neighborhoods
6. Restaurant Recommendations
7. Nightlife Recommendations
8. Cultural Attractions
9. Events During Stay
10. Suggested Itinerary
11. Estimated Budget Breakdown
12. Safety & Logistics Notes
13. Final Recommended Combination

Use Markdown tables for flight, hotel, and budget comparisons. Lead with a tight Executive Summary. Be sophisticated, concise, analytical, and executive-level. Avoid generic tourist-blog language and tourist traps. Prefer sophisticated, highly-rated experiences. Proactively suggest ideas the traveler may not have considered.`;

// ---------- chip option sets ----------
const INTEREST_OPTS = ["Food", "Art", "Architecture", "History", "Jazz", "Fashion",
  "Tech", "Nature", "Beaches", "Luxury shopping", "Local culture", "Live music", "Sports"];
const TRANSPORT_OPTS = ["Uber", "Public transit", "Chauffeur", "Rental car", "Walking"];
const OPTIMIZE_OPTS = ["Luxury", "Budget", "Nightlife", "Culture", "Business", "Networking"];

function buildChips(containerId, opts, name) {
  const box = document.getElementById(containerId);
  opts.forEach((opt) => {
    const label = document.createElement("label");
    label.className = "chip";
    label.innerHTML =
      `<input type="checkbox" name="${name}" value="${opt}" />${opt}`;
    const input = label.querySelector("input");
    input.addEventListener("change", () => label.classList.toggle("on", input.checked));
    box.appendChild(label);
  });
}
buildChips("interests", INTEREST_OPTS, "interest");
buildChips("transport", TRANSPORT_OPTS, "transport");
buildChips("optimize", OPTIMIZE_OPTS, "optimize");

function checkedValues(name) {
  return [...document.querySelectorAll(`input[name="${name}"]:checked`)].map((i) => i.value);
}

// ---------- API key persistence ----------
const keyInput = document.getElementById("apiKey");
keyInput.value = localStorage.getItem("atlas_api_key") || "";
keyInput.addEventListener("change", () =>
  localStorage.setItem("atlas_api_key", keyInput.value.trim()));

// ---------- build the user message from the form ----------
function val(id) { return document.getElementById(id).value.trim(); }

function buildProfile() {
  const lines = [];
  const add = (k, v) => { if (v) lines.push(`- ${k}: ${v}`); };

  add("Departure", val("origin"));
  add("Destination", val("dest"));
  add("Depart date", val("depart"));
  add("Return date", val("ret"));
  add("Travelers", val("travelers"));
  add("Budget level", val("budget"));
  add("Cabin", val("cabin"));
  add("Purpose", val("purpose"));
  add("Hotel style", val("hotelStyle"));
  add("Nightlife intensity", val("nightlife"));
  add("Safety sensitivity", val("safety"));
  add("Preferred vibe/neighborhood", val("neighborhood"));
  add("Interests", checkedValues("interest").join(", "));
  add("Transport preferences", checkedValues("transport").join(", "));
  add("Loyalty programs", val("loyalty"));
  add("Dietary needs", val("dietary"));
  add("Additional notes", val("notes"));

  const optimize = checkedValues("optimize");
  let msg = "Please build a complete premium travel brief for the following request. " +
    "Make and clearly flag intelligent assumptions for anything not specified.\n\n" +
    "TRAVELER PROFILE\n" + lines.join("\n");
  if (optimize.length) {
    msg += `\n\nOPTIMIZE FOR: ${optimize.join(", ")}.`;
  }
  return msg;
}

// ---------- streaming call to the Messages API ----------
const stage = document.getElementById("stage");
const goBtn = document.getElementById("goBtn");

document.getElementById("briefForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const apiKey = keyInput.value.trim();
  if (!apiKey) { alert("Please enter your Anthropic API key."); keyInput.focus(); return; }
  if (!val("dest")) { alert("Where would you like to go? Please add a destination."); return; }

  localStorage.setItem("atlas_api_key", apiKey);

  const showThinking = val("showThinking") === "yes";
  const effort = val("effort") || "high";

  const body = {
    model: MODEL,
    max_tokens: 32000,
    // Large, stable system prompt cached as a prefix to cut cost/latency on repeat runs.
    system: [{ type: "text", text: SYSTEM_PROMPT, cache_control: { type: "ephemeral" } }],
    output_config: { effort },
    messages: [{ role: "user", content: buildProfile() }],
    stream: true,
  };
  // Opus 4.7: adaptive thinking is off unless requested; "summarized" surfaces progress.
  if (showThinking) body.thinking = { type: "adaptive", display: "summarized" };

  renderShell(showThinking);
  setStatus("working", "Researching and composing…");
  goBtn.disabled = true;

  try {
    const resp = await fetch(API_URL, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": ANTHROPIC_VERSION,
        // Required for direct browser (CORS) access to the Messages API.
        "anthropic-dangerous-direct-browser-access": "true",
      },
      body: JSON.stringify(body),
    });

    if (!resp.ok || !resp.body) {
      const errText = await resp.text().catch(() => "");
      throw new Error(`HTTP ${resp.status} ${resp.statusText}${errText ? " — " + errText : ""}`);
    }

    await consumeStream(resp.body);
    setStatus("done", "Brief complete");
  } catch (err) {
    setStatus("error", explainError(err));
  } finally {
    goBtn.disabled = false;
  }
});

// ---------- SSE parsing ----------
async function consumeStream(stream) {
  const reader = stream.getReader();
  const decoder = new TextDecoder();
  let buffer = "";
  let answer = "";
  let thinking = "";

  while (true) {
    const { value, done } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });

    // SSE frames are separated by a blank line.
    const frames = buffer.split("\n\n");
    buffer = frames.pop(); // keep the trailing partial frame

    for (const frame of frames) {
      const dataLine = frame.split("\n").find((l) => l.startsWith("data:"));
      if (!dataLine) continue;
      const json = dataLine.slice(5).trim();
      if (!json || json === "[DONE]") continue;

      let evt;
      try { evt = JSON.parse(json); } catch { continue; }

      if (evt.type === "content_block_delta") {
        const d = evt.delta;
        if (d.type === "text_delta") { answer += d.text; paintAnswer(answer); }
        else if (d.type === "thinking_delta") { thinking += d.thinking; paintThinking(thinking); }
      } else if (evt.type === "error") {
        throw new Error(evt.error?.message || "stream error");
      }
    }
  }

  if (!answer.trim()) throw new Error("The model returned no text. Try increasing depth or check your key's access.");
  attachActions(answer);
}

// ---------- rendering ----------
function renderShell(showThinking) {
  stage.innerHTML = `
    <div class="statusbar" id="statusbar"></div>
    ${showThinking ? `<div class="thinking" id="thinking"><div class="thinking-head">Reasoning</div><span id="thinkingBody"></span></div>` : ""}
    <div class="brief" id="brief"></div>
  `;
}
function setStatus(kind, text) {
  const bar = document.getElementById("statusbar");
  if (!bar) return;
  const map = { working: "", done: "ok", error: "err" };
  const dot = kind === "working" ? `<span class="dot"></span>` : "";
  bar.innerHTML = `${dot}<span class="badge ${map[kind] || ""}">${escapeHtml(text)}</span>`;
}
function paintAnswer(md) {
  const el = document.getElementById("brief");
  if (el) el.innerHTML = renderMarkdown(md);
}
function paintThinking(text) {
  const el = document.getElementById("thinkingBody");
  if (el) { el.textContent = text; el.parentElement.scrollTop = el.parentElement.scrollHeight; }
}
function renderMarkdown(md) {
  if (window.marked) return marked.parse(md, { gfm: true, breaks: false });
  return "<pre>" + escapeHtml(md) + "</pre>"; // graceful fallback if CDN blocked
}
function escapeHtml(s) {
  return s.replace(/[&<>"']/g, (c) =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
}

function attachActions(markdown) {
  const wrap = document.createElement("div");
  wrap.className = "actions";
  wrap.innerHTML = `<button id="copyBtn">Copy</button><button id="dlBtn">Download .md</button>`;
  stage.appendChild(wrap);
  document.getElementById("copyBtn").onclick = () => navigator.clipboard.writeText(markdown);
  document.getElementById("dlBtn").onclick = () => {
    const blob = new Blob([markdown], { type: "text/markdown" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `${(val("dest") || "trip").replace(/\s+/g, "-").toLowerCase()}-brief.md`;
    a.click();
    URL.revokeObjectURL(a.href);
  };
}

function explainError(err) {
  const m = String(err.message || err);
  if (m.includes("401")) return "Invalid API key (401). Check the key and try again.";
  if (m.includes("403")) return "Permission denied (403). This key may lack access to the model.";
  if (m.includes("429")) return "Rate limited (429). Wait a moment and retry.";
  if (m.includes("Failed to fetch")) return "Network/CORS error. If opened from a file, try a local server (e.g. python -m http.server).";
  return m;
}
