// Civic League of Gulfport — site interactions

// Mobile nav toggle
(function () {
  const toggle = document.querySelector('.nav__toggle');
  const links = document.querySelector('.nav__links');
  if (!toggle || !links) return;
  toggle.addEventListener('click', () => {
    const open = links.classList.toggle('is-open');
    toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
  });
  links.querySelectorAll('a').forEach((a) =>
    a.addEventListener('click', () => links.classList.remove('is-open'))
  );
})();

// Mark active nav link
(function () {
  const here = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav__links a').forEach((a) => {
    const target = a.getAttribute('href');
    if (target === here || (here === '' && target === 'index.html')) {
      a.classList.add('is-active');
    }
  });
})();

// Reveal on scroll
(function () {
  const els = document.querySelectorAll('.reveal');
  if (!('IntersectionObserver' in window) || !els.length) {
    els.forEach((el) => el.classList.add('is-visible'));
    return;
  }
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add('is-visible');
          io.unobserve(e.target);
        }
      });
    },
    { threshold: 0.12 }
  );
  els.forEach((el) => io.observe(el));
})();

// Animated count-up for stats
(function () {
  const nums = document.querySelectorAll('[data-count]');
  if (!nums.length) return;
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        const target = parseFloat(el.dataset.count);
        const suffix = el.dataset.suffix || '';
        const duration = 1500;
        const start = performance.now();
        function tick(now) {
          const t = Math.min((now - start) / duration, 1);
          const eased = 1 - Math.pow(1 - t, 3);
          const value = Math.round(target * eased);
          el.textContent = value.toLocaleString() + suffix;
          if (t < 1) requestAnimationFrame(tick);
        }
        requestAnimationFrame(tick);
        io.unobserve(el);
      });
    },
    { threshold: 0.4 }
  );
  nums.forEach((n) => io.observe(n));
})();

// Snowfall on Christmas page
(function () {
  const canvas = document.querySelector('.snow-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let w = (canvas.width = window.innerWidth);
  let h = (canvas.height = window.innerHeight);
  const flakes = [];
  const count = Math.min(140, Math.floor(window.innerWidth / 10));
  for (let i = 0; i < count; i++) {
    flakes.push({
      x: Math.random() * w,
      y: Math.random() * h,
      r: 0.8 + Math.random() * 2.4,
      d: 0.4 + Math.random() * 1.2,
      drift: -0.3 + Math.random() * 0.6,
    });
  }
  function draw() {
    ctx.clearRect(0, 0, w, h);
    ctx.fillStyle = 'rgba(255,255,255,0.85)';
    for (const f of flakes) {
      ctx.beginPath();
      ctx.arc(f.x, f.y, f.r, 0, Math.PI * 2);
      ctx.fill();
      f.y += f.d;
      f.x += f.drift;
      if (f.y > h) { f.y = -4; f.x = Math.random() * w; }
      if (f.x < -8) f.x = w + 8;
      if (f.x > w + 8) f.x = -8;
    }
    requestAnimationFrame(draw);
  }
  window.addEventListener('resize', () => { w = canvas.width = window.innerWidth; h = canvas.height = window.innerHeight; });
  if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) draw();
})();

// Countdown to Tour of Homes (December 7)
(function () {
  const node = document.querySelector('[data-countdown]');
  if (!node) return;
  const target = new Date(node.dataset.countdown);
  function pad(n) { return String(n).padStart(2, '0'); }
  function tick() {
    const now = new Date();
    let diff = Math.max(0, target - now);
    const days = Math.floor(diff / 86400000); diff -= days * 86400000;
    const hours = Math.floor(diff / 3600000); diff -= hours * 3600000;
    const mins = Math.floor(diff / 60000); diff -= mins * 60000;
    const secs = Math.floor(diff / 1000);
    node.querySelector('[data-d]').textContent = days;
    node.querySelector('[data-h]').textContent = pad(hours);
    node.querySelector('[data-m]').textContent = pad(mins);
    node.querySelector('[data-s]').textContent = pad(secs);
  }
  tick();
  setInterval(tick, 1000);
})();
