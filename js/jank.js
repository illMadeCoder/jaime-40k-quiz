/* =====================================================================
   jank.js  —  PURE 1999 NONSENSE
   Sparkle cursor trail · fake visitor counter · WebAudio "hair-metal MIDI".
   Everything is wrapped so a failure here can never break the quiz.
   ===================================================================== */

/* ---------- BLOOD DRIP CURSOR TRAIL ---------------------------------- */
(function bloodDrips() {
  let last = 0;
  function drip(x, y) {
    const now = Date.now();
    if (now - last < 35) return;
    last = now;
    const d = document.createElement('div');
    d.className = 'blood-drip';
    const w = 2 + Math.random() * 4;
    const h = w * (1.5 + Math.random());
    const fall = 40 + Math.random() * 50;
    const dur = 0.45 + Math.random() * 0.5;
    const shade = Math.random() > 0.5 ? '#c0000a' : '#8a0000';
    d.style.cssText = `left:${x - w/2}px;top:${y}px;width:${w}px;height:${h}px;--fall:${fall}px;--dur:${dur}s;background:${shade};`;
    document.body.appendChild(d);
    setTimeout(() => d.remove(), dur * 1000 + 50);
  }
  window.addEventListener('mousemove', e => drip(e.clientX, e.clientY), { passive: true });
  window.addEventListener('touchmove', e => {
    const t = e.touches[0]; if (t) drip(t.clientX, t.clientY);
  }, { passive: true });
})();

/* ---------- FAKE VISITOR / HIT COUNTER ------------------------------- */
(function counter() {
  const el = document.getElementById('counter');
  if (!el) return;
  let n;
  try {
    n = parseInt(localStorage.getItem('grimdark_hits') || '0', 10) + 1;
    localStorage.setItem('grimdark_hits', String(n));
  } catch (e) { n = 1; }
  const soul = 1336 + n;                    // start the vanity number high
  el.innerHTML = `You are soul <b>#${String(soul).padStart(7, '0')}</b> claimed by the Warp`;
})();

/* ---------- WEBAUDIO "HAIR-METAL MIDI" ------------------------------- */
const MetalEngine = (function () {
  let ctx, master, noiseBuf, playing = false, barTimer = null;
  const TEMPO = 152;
  const SIX = 60 / TEMPO / 4;               // sixteenth-note length (s)
  // gritty E-minor gallop; 0 = rest
  const E2 = 82.41, G2 = 98.0, A2 = 110.0, B2 = 123.47, D3 = 146.83;
  const RIFF = [E2, E2, E2, 0, G2, 0, E2, 0, E2, E2, B2, 0, A2, 0, G2, D3];

  function distCurve(k) {
    const n = 256, c = new Float32Array(n);
    for (let i = 0; i < n; i++) { const x = (i / n) * 2 - 1; c[i] = ((1 + k) * x) / (1 + k * Math.abs(x)); }
    return c;
  }
  function makeNoise() {
    const b = ctx.createBuffer(1, ctx.sampleRate * 0.4, ctx.sampleRate);
    const d = b.getChannelData(0);
    for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
    return b;
  }
  function note(freq, t, dur, gain) {
    const o = ctx.createOscillator(), sh = ctx.createWaveShaper(), g = ctx.createGain();
    o.type = 'sawtooth'; o.frequency.value = freq;
    sh.curve = distCurve(18);
    g.gain.setValueAtTime(0, t);
    g.gain.linearRampToValueAtTime(gain, t + 0.006);
    g.gain.exponentialRampToValueAtTime(0.0008, t + dur);
    o.connect(sh); sh.connect(g); g.connect(master);
    o.start(t); o.stop(t + dur + 0.02);
  }
  function powerChord(root, t, dur) { note(root, t, dur, 0.16); note(root * 1.4983, t, dur, 0.12); }
  function kick(t) {
    const o = ctx.createOscillator(), g = ctx.createGain();
    o.frequency.setValueAtTime(140, t); o.frequency.exponentialRampToValueAtTime(45, t + 0.12);
    g.gain.setValueAtTime(0.5, t); g.gain.exponentialRampToValueAtTime(0.001, t + 0.16);
    o.connect(g); g.connect(master); o.start(t); o.stop(t + 0.18);
  }
  function hat(t) {
    const s = ctx.createBufferSource(), hp = ctx.createBiquadFilter(), g = ctx.createGain();
    s.buffer = noiseBuf; hp.type = 'highpass'; hp.frequency.value = 7000;
    g.gain.setValueAtTime(0.12, t); g.gain.exponentialRampToValueAtTime(0.001, t + 0.05);
    s.connect(hp); hp.connect(g); g.connect(master); s.start(t); s.stop(t + 0.06);
  }
  function scheduleBar(t0) {
    for (let i = 0; i < 16; i++) {
      const t = t0 + i * SIX;
      if (RIFF[i]) note(RIFF[i], t, SIX * 0.9, i % 8 === 0 ? 0.2 : 0.13);
      if (i % 4 === 0) kick(t);
      if (i % 2 === 1) hat(t);
    }
    powerChord(E2, t0, SIX * 4);            // big downbeat chord
  }
  function loop() {
    if (!playing) return;
    scheduleBar(ctx.currentTime + 0.05);
    barTimer = setTimeout(loop, SIX * 16 * 1000);
  }
  function start() {
    try {
      ctx = ctx || new (window.AudioContext || window.webkitAudioContext)();
      if (ctx.state === 'suspended') ctx.resume();
      if (!master) { master = ctx.createGain(); master.gain.value = 0.5; master.connect(ctx.destination); }
      if (!noiseBuf) noiseBuf = makeNoise();
      playing = true; loop();
    } catch (e) { playing = false; }
  }
  function stop() { playing = false; if (barTimer) clearTimeout(barTimer); }
  return { toggle() { playing ? stop() : start(); return playing; } };
})();

(function wireMusic() {
  const btn = document.getElementById('btn-music');
  if (!btn) return;
  btn.addEventListener('click', () => {
    const on = MetalEngine.toggle();
    btn.classList.toggle('on', on);
    btn.textContent = on ? '◼ STOP THE SHREDDING' : '▶ PLAY DOOM MIDI';
  });
})();
