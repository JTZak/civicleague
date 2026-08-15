// Mobile nav toggle
(function () {
  const toggle = document.querySelector(".nav-toggle");
  const nav = document.querySelector(".main-nav");
  if (toggle && nav) {
    toggle.addEventListener("click", function () {
      const open = nav.classList.toggle("open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
    });
  }
})();

// Footer year
(function () {
  const el = document.getElementById("year");
  if (el) el.textContent = new Date().getFullYear();
})();

// Countdown to the Christmas Tour of Homes
// Tour date: Sunday, December 6, 2026 (Central Time)
(function () {
  const clock = document.getElementById("countdown");
  if (!clock) return;
  const target = new Date("2026-12-06T13:00:00-06:00").getTime();
  const dayEnd = new Date("2026-12-06T23:59:59-06:00").getTime();
  const cells = {
    d: document.getElementById("cd-days"),
    h: document.getElementById("cd-hours"),
    m: document.getElementById("cd-mins"),
    s: document.getElementById("cd-secs"),
  };

  function pad(n) { return String(n).padStart(2, "0"); }

  function tick() {
    const now = Date.now();
    if (now >= target && now <= dayEnd) {
      clock.innerHTML = '<div class="cd-cell" style="min-width:auto;padding:14px 22px;"><div class="num" style="font-size:24px;">Today is tour day! &#127876;</div></div>';
      clearInterval(timer);
      return;
    }
    if (now > dayEnd) {
      clock.innerHTML = '<div class="cd-cell" style="min-width:auto;padding:14px 22px;"><div class="num" style="font-size:22px;">Thank you for a wonderful tour!</div></div>';
      clearInterval(timer);
      return;
    }
    let diff = Math.floor((target - now) / 1000);
    const days = Math.floor(diff / 86400); diff -= days * 86400;
    const hours = Math.floor(diff / 3600); diff -= hours * 3600;
    const mins = Math.floor(diff / 60);
    const secs = diff - mins * 60;
    cells.d.textContent = days;
    cells.h.textContent = pad(hours);
    cells.m.textContent = pad(mins);
    cells.s.textContent = pad(secs);
  }

  tick();
  const timer = setInterval(tick, 1000);
})();

// Animated stat counters (home page)
(function () {
  const nums = document.querySelectorAll(".stat .num[data-count]");
  if (!nums.length) return;
  const seen = new WeakSet();
  const io = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (!entry.isIntersecting || seen.has(entry.target)) return;
      seen.add(entry.target);
      const el = entry.target;
      const end = parseInt(el.dataset.count, 10);
      const dur = 1200;
      const start = performance.now();
      function step(t) {
        const p = Math.min((t - start) / dur, 1);
        const eased = 1 - Math.pow(1 - p, 3);
        el.textContent = Math.round(end * eased);
        if (p < 1) requestAnimationFrame(step);
      }
      requestAnimationFrame(step);
    });
  }, { threshold: 0.4 });
  nums.forEach(function (el) { io.observe(el); });
})();
