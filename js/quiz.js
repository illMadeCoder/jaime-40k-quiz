/* =====================================================================
   quiz.js  —  THE ENGINE (you shouldn't need to edit this to personalize)
   Renders questions, tallies weighted scores, reveals the winning faction.
   Depends on globals from data.js: JAIME, FACTIONS, FACTION_BY_KEY, QUESTIONS, BLOTS
   ===================================================================== */

// Tie-break priority (earlier = wins ties).
const PRIORITY = ['orks', 'harlequins', 'sisters', 'drukhari'];

const state = { scores: {}, selections: [] };
const $ = id => document.getElementById(id);

function showScreen(name) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  $('screen-' + name).classList.add('active');
  window.scrollTo(0, 0);
}

/* ---------- QUESTION FLOW (one long scrolling form) ------------------ */
function startQuiz() {
  state.scores = {};
  state.selections = new Array(QUESTIONS.length);
  FACTIONS.forEach(f => state.scores[f.key] = 0);
  renderAllQuestions();
  updateHud();
  showScreen('quiz');
}

function optionHTML(qi, opt, oi) {
  const id = `opt-${qi}-${oi}`, name = `q${qi}`;
  if (opt.blot) {
    return `<label class="opt-row opt-blot">
        <input type="radio" name="${name}" id="${id}">
        <span class="ink">${BLOTS[opt.blot]}</span>
        <span class="blot-tag">${opt.tag || ''}</span>
      </label>`;
  }
  if (opt.img) {
    return `<label class="opt-row opt-portrait">
        <input type="radio" name="${name}" id="${id}">
        <img class="opt-portrait-img" src="${opt.img}" alt="" loading="lazy">
        <span class="ans-label">${opt.label}</span>
      </label>`;
  }
  return `<label class="opt-row">
      <input type="radio" name="${name}" id="${id}">
      <span class="opt-mark">►</span>
      <span class="ans-label">${opt.label}</span>
    </label>`;
}

function hueToWeights(h) {
  if (h < 18) return { sisters: 2 };   // blood-orange → Sisters (fire & faith)
  if (h < 27) return { orks: 2 };      // true orange  → Orks (war paint)
  if (h < 36) return { harlequins: 2 };  // amber      → Harlequins (warm, theatrical)
  return { drukhari: 2 };              // golden       → Drukhari (glamour)
}

function renderAllQuestions() {
  const list = $('q-list');
  list.innerHTML = '';
  $('q-total').textContent = QUESTIONS.length;
  QUESTIONS.forEach((Q, qi) => {
    const block = document.createElement('div');
    block.className = 'q-block';
    block.id = 'q-block-' + qi;
    if (Q.type === 'colorpick') {
      block.innerHTML =
        `<div class="q-kicker">${Q.kicker || ''}</div>
         <h3 class="q-text"><span class="q-num">${qi + 1}.</span> ${Q.q}</h3>
         <div class="colorpick-wrap">
           <div class="colorpick-preview">
             <div class="colorpick-swatch" id="swatch-${qi}"></div>
             <span class="colorpick-label" id="cpick-label-${qi}">hsl(27°)</span>
           </div>
           <input class="colorpick-slider" type="range" min="10" max="45" value="27" step="0.5" id="cpick-${qi}">
           <div class="colorpick-zones"><span>BLOOD ORANGE</span><span>ORANGE</span><span>AMBER</span><span>GOLD</span></div>
         </div>`;
    } else if (Q.type === 'reaction') {
      block.innerHTML =
        `<div class="q-kicker">${Q.kicker || ''}</div>
         <h3 class="q-text"><span class="q-num">${qi + 1}.</span> ${Q.q}</h3>
         <div class="reaction-wrap">
           <div class="reaction-pips" id="react-pips-${qi}">
             ${'<div class="bolter-pip"></div>'.repeat(5)}
           </div>
           <div class="reaction-body">
             <div class="reaction-area" id="react-area-${qi}">
               <button type="button" class="reaction-ready" id="react-ready-${qi}">▶ READY</button>
             </div>
             <div class="reaction-scoreboard">
               <div class="rsb-title">TARGETS</div>
               <div class="rsb-row rsb-harlequins"><span class="rsb-range">&lt; 400ms</span><span class="rsb-name">◆ HARLEQUINS</span></div>
               <div class="rsb-row rsb-drukhari"><span class="rsb-range">400–499</span><span class="rsb-name">✦ DRUKHARI</span></div>
               <div class="rsb-row rsb-orks"><span class="rsb-range">500–599</span><span class="rsb-name">⚡ ORKS</span></div>
               <div class="rsb-row rsb-sisters"><span class="rsb-range">600+</span><span class="rsb-name">✟ SISTERS</span></div>
             </div>
           </div>
           <div class="reaction-hint">5 rounds — click when the signal fires</div>
         </div>`;
    } else if (Q.type === 'door') {
      const doors = Q.options.map((opt, oi) =>
        `<button type="button" class="door door-${opt.faction}" id="door-${qi}-${oi}">
           <div class="door-face"></div>
           <div class="door-label">${opt.label}</div>
           <div class="door-sub">${opt.sub}</div>
         </button>`
      ).join('');
      block.innerHTML =
        `<div class="q-kicker">${Q.kicker || ''}</div>
         <h3 class="q-text"><span class="q-num">${qi + 1}.</span> ${Q.q}</h3>
         <div class="door-grid">${doors}</div>`;
    } else if (Q.type === 'tactical') {
      const zones = Q.options.map((opt, oi) =>
        `<button type="button" class="tac-zone" id="tac-${qi}-${oi}">
           <span class="tac-icon">${opt.icon}</span>
           <span class="tac-label">${opt.label}</span>
           <span class="tac-sub">${opt.sub}</span>
         </button>`
      ).join('');
      block.innerHTML =
        `<div class="q-kicker">${Q.kicker || ''}</div>
         <h3 class="q-text"><span class="q-num">${qi + 1}.</span> ${Q.q}</h3>
         <div class="tactical-grid">${zones}</div>`;
    } else {
      const opts = Q.options.map((opt, oi) => optionHTML(qi, opt, oi)).join('');
      const hasPortraits = Q.options.some(o => o.img);
      const gridClass = Q.type === 'inkblot' ? 'inkblot-grid' : hasPortraits ? 'portrait-grid' : 'text-grid';
      const heroHtml = Q.heroImg ? `<img class="q-hero-img" src="${Q.heroImg}" alt="" loading="lazy">` : '';
      block.innerHTML =
        `<div class="q-kicker">${Q.kicker || ''}</div>
         ${heroHtml}
         <h3 class="q-text"><span class="q-num">${qi + 1}.</span> ${Q.q}</h3>
         <div class="opt-list ${gridClass}">${opts}</div>`;
    }
    list.appendChild(block);
  });
  // wire selection handlers
  QUESTIONS.forEach((Q, qi) => {
    if (Q.type === 'colorpick') {
      const slider = $(`cpick-${qi}`);
      const swatch = $(`swatch-${qi}`);
      const lbl    = $(`cpick-label-${qi}`);
      const applyHue = () => {
        const h = parseFloat(slider.value);
        swatch.style.background = `hsl(${h},100%,50%)`;
        lbl.textContent = `hsl(${Math.round(h)}°)`;
        state.selections[qi] = { w: hueToWeights(h) };
        $('q-block-' + qi).classList.remove('unanswered');
        updateHud();
      }
      applyHue();
      slider.addEventListener('input', applyHue);
      slider.addEventListener('change', () => {
        if ($('q-block-' + qi).classList.contains('locked')) return;
        const fKey = primaryFaction(hueToWeights(parseFloat(slider.value)));
        showFactionFlash(fKey, () => lockBlock(qi));
      });
    } else if (Q.type === 'reaction') {
      const block   = $('q-block-' + qi);
      const area    = $(`react-area-${qi}`);
      const pipsEl  = $(`react-pips-${qi}`);
      const readyBtn = $(`react-ready-${qi}`);
      if (!readyBtn) return;
      let phase = 'ready', timer = null, t0 = 0, attempt = 0;
      const TOTAL = 5;
      const results = [];

      function showStandby() {
        phase = 'waiting';
        area.innerHTML = `<div class="reaction-standby">⊕</div>`;
        setTimeout(() => area.addEventListener('click', onEarlyClick), 0);
        timer = setTimeout(showGo, 1400 + Math.random() * 2400);
      }
      function onEarlyClick() {
        if (phase !== 'waiting') return;
        clearTimeout(timer);
        area.removeEventListener('click', onEarlyClick);
        area.innerHTML = `<div class="reaction-tooearly">TOO EARLY<br><small>stand by…</small></div>`;
        setTimeout(showStandby, 900);
      }
      function showGo() {
        phase = 'go';
        area.removeEventListener('click', onEarlyClick);
        t0 = Date.now();
        const goId = `react-go-${qi}-${attempt}`;
        area.innerHTML = `<button type="button" class="reaction-go" id="${goId}">NOW!</button>`;
        const go = $(goId);
        if (!go) return;
        go.addEventListener('click', () => {
          if (block.classList.contains('locked')) return;
          const ms = Date.now() - t0;
          const faction = ms < 400 ? 'harlequins' : ms < 500 ? 'drukhari' : ms < 600 ? 'orks' : 'sisters';
          results.push(faction);
          const pips = pipsEl.querySelectorAll('.bolter-pip');
          if (pips[attempt]) pips[attempt].classList.add('spent');
          attempt++;
          const isLast = attempt >= TOTAL;
          const nextId = `react-next-${qi}-${attempt}`;
          area.innerHTML =
            `<div class="reaction-round-result">
               <span class="reaction-ms">${ms}ms</span>
               <button type="button" class="reaction-next" id="${nextId}">${isLast ? '▶ GET RESULT' : `▶ ROUND ${attempt + 1}`}</button>
             </div>`;
          $(nextId).addEventListener('click', isLast ? finalize : showStandby);
        });
      }
      function finalize() {
        const counts = {};
        results.forEach(f => counts[f] = (counts[f] || 0) + 1);
        const winner = Object.entries(counts).sort((a, b) => b[1] - a[1])[0][0];
        const tally  = results.filter(f => f === winner).length;
        area.innerHTML = `<div class="reaction-result">${winner.toUpperCase()}<span class="reaction-tag">${tally} of ${TOTAL}</span></div>`;
        const w = {}; w[winner] = 2;
        state.selections[qi] = { w };
        updateHud();
        showFactionFlash(winner, () => lockBlock(qi));
      }
      readyBtn.addEventListener('click', showStandby);
    } else if (Q.type === 'door') {
      const block = $('q-block-' + qi);
      Q.options.forEach((opt, oi) => {
        const btn = $(`door-${qi}-${oi}`);
        if (!btn) return;
        btn.addEventListener('click', () => {
          if (block.classList.contains('locked')) return;
          block.querySelectorAll('.door').forEach(d => d.classList.remove('selected'));
          btn.classList.add('selected');
          const w = {}; w[opt.faction] = 2;
          state.selections[qi] = { w };
          updateHud();
          showFactionFlash(opt.faction, () => lockBlock(qi));
        });
      });
    } else if (Q.type === 'tactical') {
      const block = $('q-block-' + qi);
      Q.options.forEach((opt, oi) => {
        const btn = $(`tac-${qi}-${oi}`);
        if (btn) btn.addEventListener('click', () => {
          if (block.classList.contains('locked')) return;
          block.querySelectorAll('.tac-zone').forEach(z => z.classList.remove('selected'));
          btn.classList.add('selected');
          select(qi, oi);
        });
      });
    } else {
      Q.options.forEach((opt, oi) => {
        const input = $(`opt-${qi}-${oi}`);
        if (input) input.addEventListener('change', () => select(qi, oi));
      });
    }
  });
}

function primaryFaction(w) {
  return Object.entries(w).sort((a, b) => b[1] - a[1])[0][0];
}

function lockBlock(qi) {
  const block = $('q-block-' + qi);
  if (!block) return;
  block.querySelectorAll('input').forEach(inp => inp.disabled = true);
  block.classList.add('locked');
}

function showFactionFlash(fKey, onClose) {
  const f = FACTION_BY_KEY[fKey];
  const overlay = $('faction-flash');
  overlay.style.setProperty('--accent', f.accent);
  const img = $('ff-img');
  img.src = f.boxImg;
  img.alt = f.name;
  img.style.display = 'block';
  img.onerror = () => { img.style.display = 'none'; };
  $('ff-emblem').textContent = f.emblem;
  $('ff-name').textContent = f.name;
  $('ff-text').textContent = f.flash;
  overlay.classList.add('show');
  const close = $('ff-close');
  const handler = () => {
    overlay.classList.remove('show');
    close.removeEventListener('click', handler);
    if (onClose) onClose();
  };
  close.addEventListener('click', handler);
}

function select(qi, oi) {
  state.selections[qi] = QUESTIONS[qi].options[oi];
  const block = $('q-block-' + qi);
  if (block) {
    block.classList.remove('unanswered');
    const rows = block.querySelectorAll('.opt-row');
    rows.forEach((row, idx) => row.classList.toggle('selected', idx === oi));
  }
  updateHud();
  const fKey = primaryFaction(QUESTIONS[qi].options[oi].w);
  showFactionFlash(fKey, () => lockBlock(qi));
}

function countAnswered() {
  let a = 0;
  for (let i = 0; i < QUESTIONS.length; i++) if (state.selections[i]) a++;
  return a;
}

function updateHud() {
  const n = QUESTIONS.length, answered = countAnswered();
  $('q-progress').textContent = `${answered} / ${n} answered`;
  const left = Math.max(0, Math.round(10 - (answered / n) * 10));   // sanity drains as she answers
  $('sanity').innerHTML = 'SAN ' + '▓'.repeat(left) + '░'.repeat(10 - left);
}

function submitQuiz() {
  const n = QUESTIONS.length;
  let blank = -1;
  for (let i = 0; i < n; i++) { if (!state.selections[i]) { blank = i; break; } }
  if (blank !== -1) {                          // nudge to the first unanswered question
    const block = $('q-block-' + blank);
    if (block) {
      block.classList.add('unanswered');
      if (block.scrollIntoView) block.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
    alert(`the warp demands an answer to question #${blank + 1}!  (${n - countAnswered()} still blank)`);
    return;
  }
  state.scores = {};
  FACTIONS.forEach(f => state.scores[f.key] = 0);
  state.selections.forEach(opt => { for (const k in opt.w) state.scores[k] = (state.scores[k] || 0) + opt.w[k]; });
  reveal();
}

/* ---------- THE REVEAL ----------------------------------------------- */
const LOADER_LINES = [
  'CONSULTING THE EMPEROR’S TAROT...',
  'ROLLING FOR SANITY...',
  'CROSS-REFERENCING YOUR VIBE...',
  'BURNING A FORBIDDEN TEXT FOR ANSWERS...',
  'ALIGNING THE WARP TO UR SOUL...'
];
function reveal() {
  const loader = $('warp-loader');
  loader.classList.add('show');
  let step = 0;
  $('loader-text').textContent = LOADER_LINES[0];
  const bar = $('loader-bar');
  bar.style.width = '0%';
  const timer = setInterval(() => {
    step++;
    bar.style.width = Math.min(100, step * 22) + '%';
    $('loader-text').textContent = LOADER_LINES[step % LOADER_LINES.length];
    if (step >= 5) {
      clearInterval(timer);
      loader.classList.remove('show');
      renderResult(winningFaction());
    }
  }, 320);
}

function winningFaction() {
  let best = null, bestScore = -1;
  // iterate in PRIORITY order so ties resolve deterministically
  PRIORITY.forEach(key => {
    const s = state.scores[key] || 0;
    if (s > bestScore) { bestScore = s; best = key; }
  });
  return FACTION_BY_KEY[best] || FACTIONS[0];
}

function topThree() {
  const total = Object.values(state.scores).reduce((a, b) => a + b, 0) || 1;
  return Object.entries(state.scores)
    .sort((a, b) => b[1] - a[1])
    .map(([key, val]) => ({ f: FACTION_BY_KEY[key], pct: Math.round((val / total) * 100) }));
}

function scoreboard() {
  const rows = topThree().map(({ f, pct }) =>
    `<div class="sb-row"><span class="sb-name">${f.emblem} ${f.name}</span>
       <span class="sb-bar"><span style="width:${pct}%"></span></span><span class="sb-pct">${pct}%</span></div>`
  ).join('');
  return `<div class="scoreboard"><div class="sb-title">the dice of fate read:</div>${rows}</div>`;
}

function renderResult(f) {
  const r = $('screen-result');
  r.style.setProperty('--accent', f.accent);
  r.style.setProperty('--accent2', f.accent2);

  $('result-card').innerHTML = `
    <div class="result-emblem blink">${f.emblem}</div>
    <div class="result-verdict">the Emperor (and some 2am introspection) have spoken.<br>YOUR ARMY IS…</div>
    <h2 class="result-name">${f.name}</h2>
    <div class="result-tagline">★ ${f.tagline} ★</div>
    <a href="${f.productUrl}" target="_blank" rel="noopener" class="box-link">
      <img class="result-box-img" src="${f.boxImg}" alt="${f.boxName}"
           onerror="this.closest('.box-link').classList.add('noimg');this.remove();"></a>
    <marquee class="result-marq" scrollamount="6">${(f.tagline + ' ❖ ').repeat(4)}</marquee>
    <section class="rsec"><h3>WHO ARE THEY?</h3><p>${f.who}</p></section>
    <section class="rsec"><h3>WHY YOU??</h3><p>${f.why}</p></section>
    <section class="rsec grimbox"><h3>☠ the grimdark bit ☠</h3><p>${f.grimdark}</p></section>
    <p class="roast">…also: <i>${f.roast}</i></p>
    <section class="rsec"><h3>WHAT THEY LOOK LIKE</h3><p>${f.look}</p>
      <a class="btn88 see" href="${f.seeUrl}" target="_blank" rel="noopener">★ MORE PHOTOS ★</a></section>
    <section class="rsec"><h3>YOUR FIRST BOX</h3>
      <p>${f.firstBox}</p>
      <a class="btn88 buy" href="${f.productUrl}" target="_blank" rel="noopener">⚬ FIND THE BOX ▸ IN STOCK ⚬</a></section>
    ${scoreboard()}
    <div class="result-actions">
      <button id="btn-retake" class="bigbtn">↺ TAKE IT AGAIN</button>
    </div>
    <div class="webring">[ <a href="#" onclick="return false">« prev</a> | THE GRIMDARK WEBRING | <a href="#" onclick="return false">next »</a> ]<br>
      <span class="ucfx">🚧 this site is eternally under construction 🚧</span></div>
  `;
  $('btn-retake').addEventListener('click', () => showScreen('intro'));
  showScreen('result');
}

/* ---------- SAMPLE GALLERY (intro: the 4 possible outcomes) ---------- */
function renderSampleGallery() {
  const g = $('sample-gallery');
  if (!g) return;
  g.innerHTML = FACTIONS.map(f => `
    <a class="sample" style="--c:${f.accent}" href="${f.productUrl}" target="_blank" rel="noopener">
      <div class="sample-imgwrap">
        <img class="sample-img" src="${f.boxImg}" alt="${f.name} box"
             onerror="this.style.display='none';this.nextElementSibling.style.display='block';">
        <div class="sample-emblem" style="display:none">${f.emblem}</div>
      </div>
      <div class="sample-info">
        <div class="sample-name">${f.name}</div>
        <div class="sample-tag">${f.tagline}</div>
        <div class="sample-box">▸ ${f.boxName.replace(/^Kill Team /, 'KT: ')}</div>
      </div>
    </a>`).join('');
}

/* ---------- BOOT ----------------------------------------------------- */
document.addEventListener('DOMContentLoaded', () => {
  renderSampleGallery();
  $('btn-start').addEventListener('click', startQuiz);
  $('btn-submit').addEventListener('click', submitQuiz);
  showScreen('intro');
});
