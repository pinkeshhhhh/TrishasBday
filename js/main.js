document.addEventListener('DOMContentLoaded', () => {

  /* ---------- Betu / Vaani name toggle ---------- */
  const namePop = document.getElementById('namePop');
  let isVaani = false;
  namePop.addEventListener('click', () => {
    isVaani = !isVaani;
    namePop.textContent = isVaani ? 'Vaani' : 'Betu';
  });

  /* ---------- background stars ---------- */
  const starsEl = document.getElementById('stars');
  for (let i = 0; i < 60; i++) {
    const s = document.createElement('div');
    s.className = 'star';
    s.style.left = Math.random() * 100 + '%';
    s.style.top = Math.random() * 70 + '%';
    s.style.animationDelay = (Math.random() * 3) + 's';
    starsEl.appendChild(s);
  }

  /* ---------- floating hearts background ---------- */
  const heartsField = document.getElementById('heartsField');
  const heartEmojis = ['💗', '💕', '💖', '💓', '🩷'];
  function spawnHeart() {
    const h = document.createElement('div');
    h.className = 'floaty-heart';
    h.textContent = heartEmojis[Math.floor(Math.random() * heartEmojis.length)];
    h.style.left = Math.random() * 100 + '%';
    h.style.setProperty('--drift', (Math.random() * 80 - 40) + 'px');
    h.style.fontSize = (14 + Math.random() * 16) + 'px';
    const duration = 8 + Math.random() * 6;
    h.style.animationDuration = duration + 's';
    heartsField.appendChild(h);
    setTimeout(() => h.remove(), duration * 1000);
  }
  setInterval(spawnHeart, 900);
  for (let i = 0; i < 6; i++) setTimeout(spawnHeart, i * 300);

  /* ---------- screen navigation ---------- */
  const screens = document.querySelectorAll('.screen');
  const dockBtns = document.querySelectorAll('.dock-btn');
  const menuCards = document.querySelectorAll('.menu-card');
  const screenBg = document.getElementById('screenBg');

  const screenBackgrounds = {
    home: 'assets/backgrounds/bg1.jpg',
    letter: 'assets/backgrounds/bg3.jpg',
    stats: 'assets/backgrounds/bg2.jpg',
    wheel: 'assets/backgrounds/bg4.jpg',
    cake: 'assets/backgrounds/bg7.jpg',
    hearts: 'assets/backgrounds/bg5.jpg',
    mood: 'assets/backgrounds/bg6.jpg',
  };

  function showScreen(id) {
    screens.forEach(s => s.classList.toggle('active', s.id === 'screen-' + id));
    dockBtns.forEach(b => b.classList.toggle('active', b.dataset.screen === id));
    window.scrollTo({ top: 0, behavior: 'auto' });

    const bgUrl = screenBackgrounds[id];
    if (bgUrl) {
      screenBg.style.backgroundImage = `url(${bgUrl})`;
      screenBg.style.opacity = '1';
    } else {
      screenBg.style.opacity = '0';
    }

    if (id === 'stats') animateStats();
  }

  dockBtns.forEach(btn => btn.addEventListener('click', () => showScreen(btn.dataset.screen)));
  menuCards.forEach(card => card.addEventListener('click', () => showScreen(card.dataset.screen)));
  showScreen('home');

  /* ---------- stat count-up (runs once) ---------- */
  let statsAnimated = false;
  function animateStats() {
    if (statsAnimated) return;
    statsAnimated = true;
    document.querySelectorAll('.stat-number').forEach((el) => {
      const target = parseInt(el.dataset.count, 10);
      const start = performance.now();
      const dur = 1400;
      function tick(now) {
        const p = Math.min(1, (now - start) / dur);
        const eased = 1 - Math.pow(1 - p, 3);
        el.textContent = Math.floor(eased * target).toLocaleString();
        if (p < 1) requestAnimationFrame(tick);
        else el.textContent = target.toLocaleString();
      }
      requestAnimationFrame(tick);
    });
  }

  /* ---------- villain easter egg ---------- */
  const villainBtn = document.getElementById('villainBtn');
  const villainReveal = document.getElementById('villainReveal');
  villainBtn.addEventListener('click', () => {
    villainReveal.classList.toggle('open');
    villainBtn.textContent = villainReveal.classList.contains('open') ? '🤫 shh, close it' : '🤫 psst, don\'t click this';
  });

  /* ---------- secret clip in letter ---------- */
  const secretBtn = document.getElementById('secretClipBtn');
  const secretClip = document.getElementById('secretClip');
  secretBtn.addEventListener('click', () => {
    secretClip.classList.toggle('open');
    secretBtn.textContent = secretClip.classList.contains('open') ? 'ok fine, hide it 🙈' : 'okay one more thing 👀';
  });

  /* ---------- cake / candle game ---------- */
  const candles = document.querySelectorAll('.candle');
  const cakeMessage = document.getElementById('cakeMessage');
  const cakeInstruction = document.getElementById('cakeInstruction');
  candles.forEach(c => {
    c.addEventListener('click', () => {
      if (c.dataset.lit === '0') return;
      c.dataset.lit = '0';
      const allOut = [...candles].every(x => x.dataset.lit === '0');
      if (allOut) {
        cakeInstruction.textContent = 'wish made 🕯️';
        cakeMessage.classList.add('show');
        confetti({ particleCount: 100, spread: 80, origin: { y: 0.5 }, colors: ['#ff6f91', '#ffcf56', '#b98ee0'] });
      }
    });
  });

  /* ---------- heart pop game ---------- */
  const heartGame = document.getElementById('heartGame');
  const heartScoreEl = document.getElementById('heartScore');
  const heartWin = document.getElementById('heartWin');
  const TARGET = 25;
  let popped = 0;
  let heartGameStarted = false;

  function spawnGameHeart() {
    if (popped >= TARGET) return;
    const b = document.createElement('button');
    b.className = 'pop-heart';
    b.textContent = heartEmojis[Math.floor(Math.random() * heartEmojis.length)];
    const rect = heartGame.getBoundingClientRect();
    const x = Math.random() * (rect.width - 40);
    const y = Math.random() * (rect.height - 40);
    b.style.left = x + 'px';
    b.style.top = y + 'px';
    b.addEventListener('click', () => {
      popped++;
      heartScoreEl.textContent = popped;
      b.remove();
      confetti({ particleCount: 6, spread: 40, origin: { x: (x + rect.left) / window.innerWidth, y: (y + rect.top) / window.innerHeight }, colors: ['#ff6f91', '#ffb6d9'], scalar: 0.6 });
      if (popped >= TARGET) {
        heartWin.classList.add('show');
        confetti({ particleCount: 140, spread: 100, origin: { y: 0.5 } });
      } else {
        spawnGameHeart();
      }
    });
    heartGame.appendChild(b);
  }

  function startHeartGame() {
    if (heartGameStarted) return;
    heartGameStarted = true;
    for (let i = 0; i < 6; i++) spawnGameHeart();
  }
  document.querySelector('[data-screen="hearts"]').addEventListener('click', startHeartGame);
  document.querySelector('.dock-btn[data-screen="hearts"]').addEventListener('click', startHeartGame);

  /* ---------- flip cards ---------- */
  document.querySelectorAll('.flip-card').forEach(card => {
    card.addEventListener('click', () => card.classList.toggle('flipped'));
  });

  /* ---------- mood meter ---------- */
  const slider = document.getElementById('moodSlider');
  const face = document.getElementById('moodFace');
  const moods = [
    { max: 25, emoji: '🌩️' },
    { max: 50, emoji: '😤' },
    { max: 75, emoji: '🙂' },
    { max: 100, emoji: '🥰' },
  ];
  slider.addEventListener('input', () => {
    const v = parseInt(slider.value, 10);
    const mood = moods.find(m => v <= m.max) || moods[moods.length - 1];
    face.textContent = mood.emoji;
    face.style.transform = `scale(${1 + v / 300})`;
    if (v >= 98) {
      confetti({ particleCount: 60, spread: 70, origin: { y: 0.6 }, colors: ['#ff6f91', '#ffcf56', '#b98ee0'] });
    }
  });

  /* ---------- welcome burst ---------- */
  setTimeout(() => {
    confetti({ particleCount: 80, spread: 100, origin: { y: 0.3 }, colors: ['#ff6f91', '#ffcf56', '#b98ee0', '#7fe0c4'] });
  }, 400);
});
