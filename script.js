
/* =========================================================
   GENERATION OF FREEMASON — shared interactions
   ========================================================= */

/* ---------- THEME TOGGLE (with localStorage) ---------- */
(function initTheme() {
  const saved = localStorage.getItem('gf-theme');
  const prefersLight = window.matchMedia('(prefers-color-scheme: light)').matches;
  const theme = saved || (prefersLight ? 'light' : 'dark');
  document.documentElement.setAttribute('data-theme', theme);
})();

const themeToggle = document.getElementById('themeToggle');
themeToggle?.addEventListener('click', () => {
  const current = document.documentElement.getAttribute('data-theme');
  const next = current === 'dark' ? 'light' : 'dark';
  document.documentElement.setAttribute('data-theme', next);
  localStorage.setItem('gf-theme', next);
});

/* ---------- PRELOADER ---------- */
window.addEventListener('load', () => {
  const pre = document.getElementById('preloader');
  if (pre) setTimeout(() => pre.classList.add('hide'), 500);
});

/* ---------- NAVBAR SCROLL + BACK-TO-TOP ---------- */
const navbar = document.getElementById('navbar');
const toTop  = document.getElementById('toTop');

const onScroll = () => {
  const y = window.scrollY;
  navbar?.classList.toggle('scrolled', y > 40);
  toTop?.classList.toggle('show', y > 600);
};
window.addEventListener('scroll', onScroll, { passive:true });
onScroll();

toTop?.addEventListener('click', () => window.scrollTo({ top:0, behavior:'smooth' }));

/* ---------- MOBILE MENU ---------- */
const burger  = document.getElementById('burger');
const navMenu = document.getElementById('navMenu');
burger?.addEventListener('click', () => {
  burger.classList.toggle('open');
  navMenu.classList.toggle('open');
});
document.querySelectorAll('.nav-link, .nav-cta').forEach(link => {
  link.addEventListener('click', () => {
    burger?.classList.remove('open');
    navMenu?.classList.remove('open');
  });
});

/* ---------- SMOOTH SCROLL FOR HASH LINKS ---------- */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const id = a.getAttribute('href');
    if (id && id.length > 1) {
      const target = document.querySelector(id);
      if (target) {
        e.preventDefault();
        window.scrollTo({ top: target.offsetTop - 70, behavior:'smooth' });
      }
    }
  });
});

/* ---------- REVEAL ON SCROLL ---------- */
const revealTargets = document.querySelectorAll(
  '.section-head, .pillar-card, .pillar-lg, .service, .timeline-step, .contact-card, .contact-form, .about-text, .about-cards, .commitments, .preview-card, .testimonial-slider, .agent-profile, .stat'
);
revealTargets.forEach(el => el.classList.add('reveal'));

const io = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      setTimeout(() => entry.target.classList.add('in'), Math.min(i * 60, 400));
      io.unobserve(entry.target);
    }
  });
}, { threshold:0.12, rootMargin:'0px 0px -60px 0px' });
revealTargets.forEach(el => io.observe(el));

/* ---------- COUNTERS ---------- */
const counters = document.querySelectorAll('.stat-num');
const counterIO = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    const el = entry.target;
    const target = +el.dataset.count;
    const dur = 1600;
    const start = performance.now();
    const tick = now => {
      const p = Math.min((now - start) / dur, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.floor(eased * target);
      if (p < 1) requestAnimationFrame(tick);
      else el.textContent = target;
    };
    requestAnimationFrame(tick);
    counterIO.unobserve(el);
  });
}, { threshold:0.4 });
counters.forEach(c => counterIO.observe(c));

/* ---------- TESTIMONIAL SLIDER ---------- */
const slider = document.getElementById('slider');
if (slider) {
  const slides = slider.querySelectorAll('.testimonial');
  const dotsWrap = document.getElementById('dots');
  const prevBtn = document.getElementById('prevT');
  const nextBtn = document.getElementById('nextT');
  let current = 0;
  let autoTimer;

  // build dots
  slides.forEach((_, i) => {
    const d = document.createElement('button');
    d.className = 'dot' + (i === 0 ? ' active' : '');
    d.setAttribute('aria-label', `Go to testimonial ${i + 1}`);
    d.addEventListener('click', () => goTo(i));
    dotsWrap.appendChild(d);
  });

  const dots = dotsWrap.querySelectorAll('.dot');

  function goTo(i) {
    slides[current].classList.remove('active');
    dots[current].classList.remove('active');
    current = (i + slides.length) % slides.length;
    slides[current].classList.add('active');
    dots[current].classList.add('active');
    restartAuto();
  }

  function next() { goTo(current + 1); }
  function prev() { goTo(current - 1); }

  function restartAuto() {
    clearInterval(autoTimer);
    autoTimer = setInterval(next, 6500);
  }

  nextBtn?.addEventListener('click', next);
  prevBtn?.addEventListener('click', prev);

  // swipe support
  let startX = 0;
  slider.addEventListener('touchstart', e => { startX = e.touches[0].clientX; }, { passive:true });
  slider.addEventListener('touchend', e => {
    const dx = e.changedTouches[0].clientX - startX;
    if (Math.abs(dx) > 50) dx < 0 ? next() : prev();
  });

  // keyboard
  document.addEventListener('keydown', e => {
    if (e.key === 'ArrowRight') next();
    if (e.key === 'ArrowLeft')  prev();
  });

  restartAuto();
}

/* ---------- CONTACT FORM → WhatsApp ---------- */
const form = document.getElementById('contactForm');
const note = document.getElementById('formNote');

form?.addEventListener('submit', e => {
  e.preventDefault();
  const data = {
    name:    form.name.value.trim(),
    email:   form.email.value.trim(),
    phone:   form.phone.value.trim(),
    service: form.service.value.trim(),
    message: form.message.value.trim()
  };

  if (!data.name || !data.email || !data.message) {
    note.textContent = 'Please complete name, email and message.';
    return;
  }

  const text =
    `*New Inquiry — Generation of Freemason*%0A%0A` +
    `*Name:* ${encodeURIComponent(data.name)}%0A` +
    `*Email:* ${encodeURIComponent(data.email)}%0A` +
    `*Phone:* ${encodeURIComponent(data.phone || '—')}%0A` +
    `*Service:* ${encodeURIComponent(data.service || '—')}%0A%0A` +
    `*Message:*%0A${encodeURIComponent(data.message)}`;

  note.textContent = 'Opening WhatsApp…';
  setTimeout(() => {
    window.open(`https://wa.me/256782529295?text=${text}`, '_blank', 'noopener');
    form.reset();
    note.textContent = '';
  }, 400);
});

/* ---------- PARALLAX SIGIL (home only) ---------- */
const sigil = document.querySelector('.sigil');
if (sigil && window.matchMedia('(min-width: 900px)').matches) {
  window.addEventListener('mousemove', e => {
    const x = (e.clientX / window.innerWidth  - 0.5) * 20;
    const y = (e.clientY / window.innerHeight - 0.5) * 20;
    sigil.style.transform = `translate3d(${x}px, ${y}px, 0)`;
  });
}
