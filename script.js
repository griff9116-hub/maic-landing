// Scroll-reveal with IntersectionObserver
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(el => {
    if (el.isIntersecting) {
      el.target.classList.add('visible');
      revealObserver.unobserve(el.target);
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

// Nav background on scroll
const nav = document.querySelector('.nav');
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 40);
}, { passive: true });

// Animated stat counters
function animateCounter(el) {
  const target = parseFloat(el.dataset.target);
  const prefix = el.dataset.prefix || '';
  const suffix = el.dataset.suffix || '';
  const isFloat = el.dataset.float === 'true';
  const duration = 1600;
  const startTime = performance.now();

  function step(now) {
    const progress = Math.min((now - startTime) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    const current = target * eased;
    el.textContent = prefix + (isFloat ? current.toFixed(1) : Math.floor(current)) + suffix;
    if (progress < 1) requestAnimationFrame(step);
  }
  requestAnimationFrame(step);
}

const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      animateCounter(entry.target);
      counterObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });

document.querySelectorAll('.metric-value[data-target]').forEach(el => {
  counterObserver.observe(el);
});

// Smooth scroll for nav links
document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', e => {
    const target = document.querySelector(link.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
});

// Apply modal
const applyModal = document.getElementById('apply-modal');
const applyForm  = document.getElementById('apply-form');
const formError  = document.getElementById('form-error');
const applySuccess = document.getElementById('apply-success');
const applyFormWrap = document.getElementById('apply-form-wrap');

function openModal() {
  applyModal.removeAttribute('hidden');
  document.body.style.overflow = 'hidden';
  setTimeout(() => document.getElementById('f-name').focus(), 50);
}
function closeModal() {
  applyModal.setAttribute('hidden', '');
  document.body.style.overflow = '';
}

document.querySelectorAll('[data-apply]').forEach(btn => {
  btn.addEventListener('click', e => { e.preventDefault(); openModal(); });
});
document.querySelector('.modal-close').addEventListener('click', closeModal);
document.querySelector('.modal-close-success').addEventListener('click', closeModal);
applyModal.addEventListener('click', e => { if (e.target === applyModal) closeModal(); });
document.addEventListener('keydown', e => {
  if (e.key === 'Escape' && !applyModal.hasAttribute('hidden')) closeModal();
});

applyForm.addEventListener('submit', async e => {
  e.preventDefault();
  const btn = applyForm.querySelector('.modal-submit');
  formError.setAttribute('hidden', '');
  btn.textContent = 'Sending…';
  btn.disabled = true;
  try {
    const res = await fetch(applyForm.action, {
      method: 'POST',
      body: new FormData(applyForm),
      headers: { 'Accept': 'application/json' }
    });
    if (!res.ok) throw new Error();
    applyFormWrap.setAttribute('hidden', '');
    applySuccess.removeAttribute('hidden');
  } catch {
    formError.removeAttribute('hidden');
    btn.textContent = 'Submit Application →';
    btn.disabled = false;
  }
});

// Mobile hamburger menu
const hamburger = document.querySelector('.nav-hamburger');
const navLinks = document.querySelector('.nav-links');
if (hamburger && navLinks) {
  hamburger.addEventListener('click', () => {
    const isOpen = hamburger.getAttribute('aria-expanded') === 'true';
    hamburger.setAttribute('aria-expanded', String(!isOpen));
    navLinks.classList.toggle('open', !isOpen);
    hamburger.setAttribute('aria-label', isOpen ? 'Open navigation menu' : 'Close navigation menu');
  });
  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      hamburger.setAttribute('aria-expanded', 'false');
      navLinks.classList.remove('open');
      hamburger.setAttribute('aria-label', 'Open navigation menu');
    });
  });
}