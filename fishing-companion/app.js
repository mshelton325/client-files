const $ = (id) => document.getElementById(id);

const tackleDefaults = {
  freshwater: [
    'Texas rig', 'Weightless stick worm', 'Spinnerbait', 'Chatterbait',
    'Topwater frog', 'Ned rig', 'Crankbait', 'Swimbait'
  ],
  saltwater: [
    'Paddle-tail jig', 'Shrimp under popping cork', 'Live shrimp', 'Suspending twitchbait',
    'Topwater plug', 'Gold spoon', 'Bucktail jig', 'Carolina rig'
  ]
};

const speciesByWater = {
  freshwater: ['Largemouth bass', 'Peacock bass', 'Crappie', 'Bluegill', 'Catfish'],
  saltwater: ['Snook', 'Redfish', 'Spotted seatrout', 'Tarpon', 'Grouper', 'Sheepshead', 'Flounder', 'Spanish mackerel', 'Jack crevalle']
};

const plannerCard = document.querySelector('#planner .card');
plannerCard.querySelector('h2').insertAdjacentHTML('afterend', `
  <div class="grid" style="margin-bottom:12px">
    <div><label>Freshwater or saltwater?</label><select id="waterClass"><option value="freshwater">Freshwater</option><option value="saltwater">Saltwater</option></select></div>
    <div><label>Target species</label><select id="species"></select></div>
  </div>
`);

function fillSpecies() {
  const type = $('waterClass').value;
  $('species').innerHTML = speciesByWater[type].map(s => `<option>${s}</option>`).join('');
  $('water').innerHTML = type === 'freshwater'
    ? '<option>River</option><option>Pond</option><option>Lake</option><option>Canal</option>'
    : '<option>Bay / flat</option><option>Pass / inlet</option><option>Canal</option><option>Beach / surf</option><option>Pier / bridge</option><option>Mangrove shoreline</option>';
}
$('waterClass').addEventListener('change', fillSpecies);
fillSpecies();

const techniques = {
  freshwater: [
    {
      name:'Texas rig', hook:'3/0 EWG', weight:'1/8–1/4 oz bullet', line:'12–17 lb fluoro or 30 lb braid + leader',
      knot:'Palomar or improved clinch', retrieve:'Pitch tight to cover. Let it fall on semi-slack line, then lift, pause and crawl.',
      bite:'A tap, mushy weight, line jump, or the bait simply moving sideways.',
      casts:'Wood, root edges, shade lines, dock posts, isolated grass clumps.',
      mistakes:'Using too much weight, moving too fast, or waiting too long after the fish clearly has it.',
      score:88, tags:['wood','dock','grass','tannic','stained','inactive','big','bite']
    },
    {
      name:'Weightless stick worm', hook:'3/0 EWG', weight:'None', line:'10–15 lb fluoro or braid + leader',
      knot:'Palomar', retrieve:'Cast beyond the target. Let it sink naturally, twitch twice, then pause.',
      bite:'Line ticks, jumps, stops early, or begins swimming away.',
      casts:'Calm pockets, dock shade, sparse grass, laydowns and pressured water.',
      mistakes:'Overworking it or failing to watch the line.',
      score:86, tags:['calm','clear','tannic','inactive','dock','wood','bite','simple']
    },
    {
      name:'Spinnerbait', hook:'Built-in single hook', weight:'3/8 oz', line:'15–20 lb mono/fluoro or 30–40 lb braid',
      knot:'Improved clinch to closed eye', retrieve:'Steady retrieve just fast enough to feel the blades. Bump cover when possible.',
      bite:'Usually a solid load-up or violent strike.',
      casts:'Windblown banks, points, wood, grass edges and stained water.',
      mistakes:'Fishing it too fast, avoiding cover, or using it in dead-calm clear water.',
      score:82, tags:['wind','stained','muddy','wood','grass','active','cover','explore']
    },
    {
      name:'Chatterbait', hook:'Built-in jig hook', weight:'3/8 oz', line:'15–20 lb fluoro or 30–40 lb braid',
      knot:'Palomar', retrieve:'Slow roll so the blade just vibrates. Add brief pauses or snaps when it contacts grass.',
      bite:'A thump, sudden heaviness, or the vibration disappearing.',
      casts:'Submerged grass, stained water, shallow flats and windy banks.',
      mistakes:'Reeling too fast or not clearing grass with a snap.',
      score:80, tags:['grass','wind','stained','active','cover','big']
    },
    {
      name:'Ned rig', hook:'1/16–1/8 oz mushroom jig', weight:'Built into jighead', line:'10–15 lb braid + 6–10 lb leader',
      knot:'Improved clinch', retrieve:'Drag, shake lightly, pause. Keep bottom contact without constantly hopping.',
      bite:'Extra weight, a faint tick, or sideways movement.',
      casts:'Rock, open bottom, pressured banks and deeper edges.',
      mistakes:'Using too heavy a head or overworking it.',
      score:78, tags:['rock','open','clear','inactive','deep','bite']
    },
    {
      name:'Topwater frog', hook:'Built-in double hook', weight:'None', line:'40–65 lb braid',
      knot:'Palomar', retrieve:'Walk across pads and mats. Pause in holes and at outer edges.',
      bite:'Visual explosion. Wait until you feel the fish before setting hard.',
      casts:'Pads, mats, emergent grass and overhanging cover.',
      mistakes:'Setting on the splash instead of waiting for weight.',
      score:76, tags:['grass','shallow','big','active']
    }
  ],
  saltwater: [
    {
      name:'Paddle-tail jig', hook:'1/8–1/4 oz jighead, 2/0–4/0', weight:'1/8 oz shallow; 1/4 oz current/depth', line:'10–20 lb braid + 20–30 lb leader',
      knot:'Loop knot to lure; double-uni or FG to leader', retrieve:'Cast up-current or across wind. Slow roll near bottom with occasional hops.',
      bite:'A tap, sudden stop, or solid weight. Keep reeling and sweep-set.',
      casts:'Mangrove edges, potholes, current seams, dock shade, grass edges.',
      mistakes:'Using too heavy a jighead, retrieving too fast, or ignoring current direction.',
      score:90, tags:['clear','stained','grass','dock','moderate','active','cover','bite','simple']
    },
    {
      name:'Live shrimp', hook:'1/0–2/0 circle or kahle hook', weight:'Free-line or small split shot', line:'10–20 lb braid + 20–30 lb leader',
      knot:'Loop knot or improved clinch', retrieve:'Let the shrimp drift naturally with current. Keep light contact without dragging it unnaturally.',
      bite:'Steady pull or line moving off. Reel tight before lifting the rod.',
      casts:'Bridge pilings, docks, mangroves, seawalls, passes and deeper holes.',
      mistakes:'Oversized hooks, too much weight, or striking hard with a circle hook.',
      score:89, tags:['inactive','bite','dock','wood','rock','deep','simple']
    },
    {
      name:'Shrimp under popping cork', hook:'1/0–2/0 circle or kahle hook', weight:'Weighted cork; 18–36 in leader', line:'10–20 lb braid + 20–30 lb leader',
      knot:'Improved clinch or loop knot', retrieve:'Pop once or twice, then let it sit. Adjust leader so shrimp rides above grass.',
      bite:'Cork disappears, tips sideways, or moves against current.',
      casts:'Grass flats, channel edges, windblown shorelines and open water.',
      mistakes:'Popping constantly or setting the bait below the grass.',
      score:86, tags:['grass','open','wind','stained','bite','simple']
    },
    {
      name:'Suspending twitchbait', hook:'Factory trebles', weight:'None', line:'10–20 lb braid + 20–30 lb leader',
      knot:'Loop knot', retrieve:'Twitch-twitch-pause. Lengthen pauses when fish are inactive.',
      bite:'Often comes during the pause; line jumps or lure feels heavy.',
      casts:'Points, potholes, seawalls, passes and baitfish zones.',
      mistakes:'Working it nonstop or using heavy leader that kills action.',
      score:82, tags:['clear','stained','active','big','open','explore']
    },
    {
      name:'Gold spoon', hook:'Factory single hook', weight:'1/4–1/2 oz', line:'15–20 lb braid + 20–30 lb leader',
      knot:'Small swivel or loop knot', retrieve:'Steady retrieve above grass. Speed up to cover water; slow down near potholes.',
      bite:'Hard thump or sudden heaviness. Keep pressure and sweep-set.',
      casts:'Grass flats, shallow bays, windy banks and redfish water.',
      mistakes:'Letting it bury in grass or reeling too fast in cold/inactive conditions.',
      score:80, tags:['grass','wind','shallow','active','cover']
    },
    {
      name:'Carolina rig', hook:'1/0–3/0 circle hook', weight:'1/2–2 oz egg sinker depending on current', line:'15–30 lb braid + 20–40 lb leader',
      knot:'Swivel connections + loop/clinched hook', retrieve:'Cast, keep line controlled, and let bait sit or drift naturally.',
      bite:'Rod loads or line steadily moves. Reel tight—do not jerk a circle hook.',
      casts:'Beach troughs, channels, bridge edges and deeper passes.',
      mistakes:'Too much slack, too little weight for current, or jerking circle hooks.',
      score:78, tags:['deep','rock','open','strong','bite']
    }
  ]
};

function savedTackle(type) {
  const raw = localStorage.getItem(`tackle-${type}`);
  return raw ? JSON.parse(raw) : tackleDefaults[type];
}

function scoreTechnique(t, c) {
  let score = t.score;
  const signals = [c.cover,c.clarity,c.activity,c.goal,c.focus,c.depth];
  signals.forEach(s => { if (t.tags.includes(s)) score += 7; });
  if (['moderate','strong'].includes(c.wind) && t.tags.includes('wind')) score += 8;
  if (c.snag === 'high' && ['Texas rig','Weightless stick worm','Topwater frog','Gold spoon'].includes(t.name)) score += 5;
  if (c.platform === 'paddle' && ['Topwater frog','Carolina rig'].includes(t.name)) score -= 4;
  if (c.goal === 'bite' && ['Texas rig','Weightless stick worm','Live shrimp','Paddle-tail jig','Shrimp under popping cork'].includes(t.name)) score += 6;
  return score;
}

function conditions() {
  return {
    type:$('waterClass').value, species:$('species').value, platform:$('platform').value,
    water:$('water').value, clarity:$('clarity').value, depth:$('depth').value,
    cover:$('cover').value, wind:$('wind').value, activity:$('activity').value,
    goal:$('goal').value, snag:$('snag').value, focus:$('focus').value
  };
}

function planCard(t, rank, score, c) {
  const platformTip = c.platform === 'paddle'
    ? 'Keep only one working rod out, leash the rod and pliers, and position the board before casting so wind does not push you into cover.'
    : c.platform === 'bank'
      ? 'Start with casts parallel to the shoreline before casting straight out. Move quietly and fish the nearest cover first.'
      : 'Use the boat to control your casting angle. Approach upwind or up-current and avoid running over the target.';
  return `<div class="card result"><span class="score">Confidence ${Math.min(99,score)}%</span><div class="rank">Plan ${rank}</div><h2>${t.name}</h2>
    <div><span class="pill">${c.species}</span><span class="pill">${c.platform}</span><span class="pill">${c.clarity}</span><span class="pill">${c.cover}</span></div>
    <div class="setup"><div><b>Hook</b>${t.hook}</div><div><b>Weight</b>${t.weight}</div><div><b>Line</b>${t.line}</div><div><b>Knot</b>${t.knot}</div></div>
    <h3>Where to cast</h3><div class="callout">${t.casts}</div>
    <h3>Exactly how to fish it</h3><p>${t.retrieve}</p>
    <h3>What the bite feels like</h3><p>${t.bite}</p>
    <h3>Biggest mistake to avoid</h3><div class="callout warning">${t.mistakes}</div>
    <h3>${c.platform === 'paddle' ? 'Paddleboard / kayak note' : c.platform === 'bank' ? 'Bank-fishing note' : 'Boat-positioning note'}</h3><div class="callout blue">${platformTip}</div>
    <button class="guideBtn" data-name="${t.name}">Guide Me Step by Step</button>
  </div>`;
}

function buildPlan() {
  const c = conditions();
  const owned = savedTackle(c.type);
  let pool = techniques[c.type].filter(t => owned.includes(t.name));
  if (!pool.length) pool = techniques[c.type];
  const ranked = pool.map(t => ({t,score:scoreTechnique(t,c)})).sort((a,b)=>b.score-a.score);
  const first = ranked[0], second = ranked[1] || ranked[0];
  $('output').innerHTML = `<div class="card"><h2>Today’s simple game plan</h2><ol><li>Commit to Plan A for <b>15 quality casts</b> at the best available cover.</li><li>No bite? Change casting angle and make 10 more.</li><li>Still nothing? Move 30–50 yards or switch to Plan B.</li></ol><p class="small">Recommendations are filtered to tackle marked as owned whenever possible.</p></div>${planCard(first.t,'A',first.score,c)}${planCard(second.t,'B',second.score,c)}`;
  document.querySelectorAll('.guideBtn').forEach(btn => btn.addEventListener('click',()=>startGuide(btn.dataset.name,c)));
  $('output').scrollIntoView({behavior:'smooth'});
}
$('build').addEventListener('click', buildPlan);

function startGuide(name,c) {
  const t = techniques[c.type].find(x=>x.name===name);
  const steps = [
    `Rig ${t.name}: ${t.hook}; ${t.weight}; ${t.knot}.`,
    c.platform === 'bank' ? 'Stop several feet back from the water. Look for the closest shade, cover, current break, point or depth change.' : c.platform === 'paddle' ? 'Secure loose gear, leash the working rod and pliers, and set your drift before the first cast.' : 'Approach quietly from upwind or up-current and stop outside casting distance.',
    `Make your first five casts to: ${t.casts}`,
    `Retrieve: ${t.retrieve}`,
    `Watch for: ${t.bite}`,
    'Complete 15 focused casts. Change angle once before abandoning the spot.',
    'No bite? Move to the next distinct piece of cover or activate Plan B.'
  ];
  let i=0;
  const modal=document.createElement('div');
  modal.style.cssText='position:fixed;inset:0;background:#0009;z-index:20;display:grid;place-items:end center;padding:12px';
  modal.innerHTML=`<div class="card" style="max-width:600px;width:100%;margin:0"><p class="small">GUIDE MODE • STEP <span id="stepNum">1</span> OF ${steps.length}</p><h2 id="guideText">${steps[0]}</h2><button id="nextStep">Done — Next Step</button><button class="secondary" id="closeGuide">Close Guide</button></div>`;
  document.body.appendChild(modal);
  modal.querySelector('#nextStep').onclick=()=>{i++;if(i>=steps.length){modal.querySelector('#guideText').textContent='You completed the plan. Fish confidently, record what happened, and adjust only after giving the presentation a fair chance.';modal.querySelector('#nextStep').textContent='Finish';modal.querySelector('#nextStep').onclick=()=>modal.remove();return;}modal.querySelector('#stepNum').textContent=i+1;modal.querySelector('#guideText').textContent=steps[i];};
  modal.querySelector('#closeGuide').onclick=()=>modal.remove();
}

function renderLibrary() {
  const all=[...techniques.freshwater,...techniques.saltwater];
  $('library').innerHTML=`<div class="card"><h2>Technique Library</h2><p>Tap any technique to see the practical essentials.</p></div>`+all.map(t=>`<details class="card"><summary><b>${t.name}</b></summary><div class="setup" style="margin-top:12px"><div><b>Hook</b>${t.hook}</div><div><b>Weight</b>${t.weight}</div><div><b>Line</b>${t.line}</div><div><b>Knot</b>${t.knot}</div></div><h3>Retrieve</h3><p>${t.retrieve}</p><h3>Bite feel</h3><p>${t.bite}</p><h3>Avoid</h3><p>${t.mistakes}</p></details>`).join('');
}

function renderRigging() {
  $('rigging').innerHTML=`<div class="card"><h2>My Tackle Locker</h2><p>Check the techniques you currently have. The planner will favor only checked items.</p><h3>Freshwater</h3><div id="freshChecks"></div><h3>Saltwater</h3><div id="saltChecks"></div><button id="saveTackle">Save My Tackle</button><p id="savedMsg" class="small"></p></div>`;
  ['freshwater','saltwater'].forEach(type=>{
    const selected=savedTackle(type); const target=$(type==='freshwater'?'freshChecks':'saltChecks');
    target.innerHTML=tackleDefaults[type].map(x=>`<label class="check"><input type="checkbox" data-type="${type}" value="${x}" ${selected.includes(x)?'checked':''}><span>${x}</span></label>`).join('');
  });
  $('saveTackle').onclick=()=>{
    ['freshwater','saltwater'].forEach(type=>{
      const vals=[...document.querySelectorAll(`input[data-type="${type}"]:checked`)].map(x=>x.value);
      localStorage.setItem(`tackle-${type}`,JSON.stringify(vals));
    });
    $('savedMsg').textContent='Saved on this device. Future plans will use your checked tackle first.';
  };
}

function renderConfidence() {
  $('confidence').innerHTML=`<div class="card"><h2>Confidence Rules</h2><ol><li><b>Fish what is in front of you.</b> The best-looking cover gets the first casts.</li><li><b>Commit before changing.</b> Give Plan A 15 deliberate casts and one angle change.</li><li><b>Move before overthinking.</b> If the area feels lifeless, relocate instead of cycling through ten lures.</li><li><b>Watch the line.</b> Many bites are seen before they are felt.</li><li><b>Record one lesson.</b> A simple note after every trip builds your personal pattern library.</li></ol></div><div class="card"><h2>Paddleboard Safety Baseline</h2><ul><li>Wear the PFD; do not merely carry it.</li><li>Use rod and tool leashes.</li><li>Keep the deck uncluttered and one rod active.</li><li>Avoid strong current, thunderstorms, heavy boat traffic and winds beyond your control.</li><li>Tell someone your launch, route and return time.</li></ul></div>`;
}

renderLibrary(); renderRigging(); renderConfidence();

document.querySelectorAll('.tab').forEach(btn=>btn.addEventListener('click',()=>{
  document.querySelectorAll('.tab').forEach(x=>x.classList.remove('active'));btn.classList.add('active');
  ['planner','library','rigging','confidence'].forEach(id=>$(id).classList.toggle('hidden',id!==btn.dataset.tab));
  window.scrollTo({top:0,behavior:'smooth'});
}));
