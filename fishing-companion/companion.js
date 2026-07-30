const storage = {
  get(key, fallback = []) {
    try { return JSON.parse(localStorage.getItem(key)) ?? fallback; }
    catch { return fallback; }
  },
  set(key, value) { localStorage.setItem(key, JSON.stringify(value)); }
};

const escapeHtml = (value = '') => String(value).replace(/[&<>'"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]));
const uid = () => `${Date.now()}-${Math.random().toString(16).slice(2)}`;
const today = () => new Date().toISOString().slice(0, 10);

function renderSpots() {
  const root = document.getElementById('spots');
  const spots = storage.get('matt-outdoors-spots');
  root.innerHTML = `
    <div class="card">
      <h2>Save a Fishing Spot</h2>
      <div class="grid">
        <div><label>Spot name</label><input id="spotName" placeholder="Weedon Island Preserve"></div>
        <div><label>Area</label><input id="spotArea" placeholder="St. Petersburg, FL"></div>
        <div><label>Water</label><select id="spotWater"><option>Saltwater</option><option>Freshwater</option><option>Brackish</option></select></div>
        <div><label>Best platform</label><select id="spotPlatform"><option>Bank / pier</option><option>Paddleboard / kayak</option><option>Boat</option><option>Surf</option></select></div>
        <div><label>Species</label><input id="spotSpecies" placeholder="Snook, redfish, trout"></div>
        <div><label>Confidence</label><select id="spotConfidence"><option>Scout</option><option>Promising</option><option>Reliable</option><option>Favorite</option></select></div>
      </div>
      <label style="margin-top:10px">Notes</label><textarea id="spotNotes" placeholder="Parking, launch, wind to avoid, productive structure, access notes..."></textarea>
      <button id="saveSpot">Save Spot</button>
    </div>
    <div id="spotList"></div>`;
  document.getElementById('saveSpot').onclick = () => {
    const name = document.getElementById('spotName').value.trim();
    if (!name) return alert('Add a spot name first.');
    spots.unshift({
      id: uid(), name,
      area: document.getElementById('spotArea').value.trim(),
      water: document.getElementById('spotWater').value,
      platform: document.getElementById('spotPlatform').value,
      species: document.getElementById('spotSpecies').value.trim(),
      confidence: document.getElementById('spotConfidence').value,
      notes: document.getElementById('spotNotes').value.trim(),
      createdAt: new Date().toISOString()
    });
    storage.set('matt-outdoors-spots', spots);
    renderSpots();
  };
  renderSpotList(spots);
}

function renderSpotList(spots) {
  const list = document.getElementById('spotList');
  if (!spots.length) {
    list.innerHTML = '<div class="card empty"><h2>No saved spots yet</h2><p>Save launches, piers, bank access, productive shorelines, and places worth scouting.</p></div>';
    return;
  }
  list.innerHTML = spots.map(s => `
    <article class="card">
      <div class="spot-title"><div><h3>${escapeHtml(s.name)}</h3><p class="tagline">${escapeHtml(s.area || 'Area not added')}</p></div><span class="pill">${escapeHtml(s.confidence)}</span></div>
      <p><span class="pill">${escapeHtml(s.water)}</span><span class="pill">${escapeHtml(s.platform)}</span>${s.species ? `<span class="pill">${escapeHtml(s.species)}</span>` : ''}</p>
      ${s.notes ? `<div class="callout">${escapeHtml(s.notes)}</div>` : ''}
      <div class="row-actions">
        <button class="secondary useSpot" data-id="${s.id}">Use in Plan</button>
        <button class="danger deleteSpot" data-id="${s.id}">Delete</button>
      </div>
    </article>`).join('');
  document.querySelectorAll('.deleteSpot').forEach(btn => btn.onclick = () => {
    const next = spots.filter(s => s.id !== btn.dataset.id);
    storage.set('matt-outdoors-spots', next);
    renderSpots();
  });
  document.querySelectorAll('.useSpot').forEach(btn => btn.onclick = () => {
    const spot = spots.find(s => s.id === btn.dataset.id);
    if (!spot) return;
    const isSalt = spot.water !== 'Freshwater';
    document.getElementById('waterClass').value = isSalt ? 'saltwater' : 'freshwater';
    document.getElementById('waterClass').dispatchEvent(new Event('change'));
    document.querySelector('.tab[data-tab="planner"]').click();
    document.getElementById('output').innerHTML = `<div class="card blue"><h2>Planning for ${escapeHtml(spot.name)}</h2><p>${escapeHtml(spot.notes || 'Review the visible conditions, then build your plan.')}</p></div>`;
  });
}

function renderJournal() {
  const root = document.getElementById('journal');
  const entries = storage.get('matt-outdoors-journal');
  root.innerHTML = `
    <div class="card">
      <h2>Log a Fishing Trip</h2>
      <div class="grid">
        <div><label>Date</label><input id="journalDate" type="date" value="${today()}"></div>
        <div><label>Spot</label><input id="journalSpot" placeholder="Pass-a-Grille"></div>
        <div><label>Species caught</label><input id="journalSpecies" placeholder="Gag grouper"></div>
        <div><label>Number caught</label><input id="journalCount" type="number" min="0" value="0"></div>
        <div><label>Best lure / bait</label><input id="journalLure" placeholder="Paddle-tail jig"></div>
        <div><label>Platform</label><select id="journalPlatform"><option>Bank / pier</option><option>Paddleboard / kayak</option><option>Boat</option><option>Surf</option></select></div>
        <div><label>Water clarity</label><select id="journalClarity"><option>Clear</option><option>Stained</option><option>Tannic</option><option>Muddy</option></select></div>
        <div><label>Wind</label><select id="journalWind"><option>Calm</option><option>Light</option><option>Moderate</option><option>Strong</option></select></div>
      </div>
      <label style="margin-top:10px">What worked and what did you learn?</label><textarea id="journalLesson" placeholder="Where the bites came from, retrieve speed, tide/current, structure, mistakes, and what to try next time..."></textarea>
      <button id="saveJournal">Save Trip</button>
    </div>
    <div id="journalSummary"></div>
    <div id="journalList"></div>`;
  document.getElementById('saveJournal').onclick = () => {
    const spot = document.getElementById('journalSpot').value.trim();
    if (!spot) return alert('Add the fishing spot first.');
    entries.unshift({
      id: uid(), date: document.getElementById('journalDate').value,
      spot, species: document.getElementById('journalSpecies').value.trim(),
      count: Number(document.getElementById('journalCount').value || 0),
      lure: document.getElementById('journalLure').value.trim(),
      platform: document.getElementById('journalPlatform').value,
      clarity: document.getElementById('journalClarity').value,
      wind: document.getElementById('journalWind').value,
      lesson: document.getElementById('journalLesson').value.trim()
    });
    storage.set('matt-outdoors-journal', entries);
    renderJournal();
  };
  renderJournalSummary(entries);
  renderJournalList(entries);
}

function renderJournalSummary(entries) {
  const box = document.getElementById('journalSummary');
  if (!entries.length) { box.innerHTML = ''; return; }
  const fish = entries.reduce((n,e) => n + (e.count || 0), 0);
  const lureCounts = {};
  entries.forEach(e => { if (e.lure) lureCounts[e.lure] = (lureCounts[e.lure] || 0) + e.count; });
  const best = Object.entries(lureCounts).sort((a,b) => b[1]-a[1])[0];
  box.innerHTML = `<div class="card"><h2>Your early patterns</h2><div class="setup"><div><b>Trips logged</b>${entries.length}</div><div><b>Fish recorded</b>${fish}</div><div><b>Most productive lure</b>${best ? escapeHtml(best[0]) : 'Not enough data yet'}</div><div><b>Current goal</b>Keep logging one useful lesson per trip</div></div></div>`;
}

function renderJournalList(entries) {
  const list = document.getElementById('journalList');
  if (!entries.length) {
    list.innerHTML = '<div class="card empty"><h2>No trips logged yet</h2><p>Your first few entries will begin building a personal fishing pattern library.</p></div>';
    return;
  }
  list.innerHTML = entries.map(e => `
    <article class="card">
      <div class="journal-title"><div><h3>${escapeHtml(e.spot)}</h3><p class="tagline">${escapeHtml(e.date)}</p></div><span class="pill">${e.count} caught</span></div>
      <p>${e.species ? `<span class="pill">${escapeHtml(e.species)}</span>` : ''}${e.lure ? `<span class="pill">${escapeHtml(e.lure)}</span>` : ''}<span class="pill">${escapeHtml(e.platform)}</span></p>
      <p class="small">${escapeHtml(e.clarity)} water • ${escapeHtml(e.wind)} wind</p>
      ${e.lesson ? `<div class="callout blue"><b>Lesson:</b> ${escapeHtml(e.lesson)}</div>` : ''}
      <button class="danger deleteJournal" data-id="${e.id}">Delete Entry</button>
    </article>`).join('');
  document.querySelectorAll('.deleteJournal').forEach(btn => btn.onclick = () => {
    const next = entries.filter(e => e.id !== btn.dataset.id);
    storage.set('matt-outdoors-journal', next);
    renderJournal();
  });
}

function showInstallHelp() {
  const box = document.getElementById('installHelp');
  const standalone = window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone;
  if (standalone || localStorage.getItem('hide-install-help')) return;
  box.classList.remove('hidden');
  const ios = /iphone|ipad|ipod/i.test(navigator.userAgent);
  box.innerHTML = ios
    ? '<h2>Install Matt Outdoors on your iPhone</h2><p>In Safari, tap the <b>Share</b> button, choose <b>Add to Home Screen</b>, then tap <b>Add</b>. It will open like an app and core screens will remain available offline after the first load.</p><button class="secondary" id="hideInstall">Got It</button>'
    : '<h2>Install Matt Outdoors</h2><p>Use your browser menu and choose <b>Install app</b> or <b>Add to Home Screen</b>.</p><button class="secondary" id="hideInstall">Got It</button>';
  document.getElementById('hideInstall').onclick = () => { localStorage.setItem('hide-install-help','1'); box.remove(); };
}

renderSpots();
renderJournal();
showInstallHelp();

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => navigator.serviceWorker.register('./sw.js').catch(() => {}));
}
