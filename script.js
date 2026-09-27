/* ============================================================
   Ashutosh Pundir — Developer Portfolio
   JavaScript: Theme Toggle, Lenis Scroll, Clock, Interactions
   ============================================================ */

// ================ 1. DARK/LIGHT MODE SWITCHER ================
const themeToggleBtn = document.getElementById('theme-toggle');

function applyTheme(theme) {
  if (theme === 'light') {
    document.documentElement.classList.remove('dark');
    document.documentElement.classList.add('light');
  } else {
    document.documentElement.classList.remove('light');
    document.documentElement.classList.add('dark');
  }
  localStorage.setItem('portfolio-theme', theme);
}

// Detect saved preference or system preference
const savedTheme = localStorage.getItem('portfolio-theme');
if (savedTheme) {
  applyTheme(savedTheme);
} else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches) {
  applyTheme('light');
} else {
  applyTheme('dark');
}

if (themeToggleBtn) {
  themeToggleBtn.addEventListener('click', () => {
    const isDark = document.documentElement.classList.contains('dark');
    applyTheme(isDark ? 'light' : 'dark');
  });
}

// ================ 2. MOBILE DRAWER NAVIGATION ================
const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
const mobileNavDrawer = document.getElementById('mobile-nav-drawer');
const mobileMenuIcon = document.getElementById('mobile-menu-icon');

if (mobileMenuToggle && mobileNavDrawer) {
  mobileMenuToggle.addEventListener('click', () => {
    const isOpen = mobileNavDrawer.classList.toggle('open');
    mobileMenuToggle.setAttribute('aria-expanded', isOpen);
    if (mobileMenuIcon) {
      mobileMenuIcon.textContent = isOpen ? 'close' : 'menu';
    }
  });

  // Close drawer when clicking any link
  document.querySelectorAll('.mobile-nav-link').forEach(link => {
    link.addEventListener('click', () => {
      mobileNavDrawer.classList.remove('open');
      mobileMenuToggle.setAttribute('aria-expanded', 'false');
      if (mobileMenuIcon) {
        mobileMenuIcon.textContent = 'menu';
      }
    });
  });
}

// ================ 3. LIVE IST TIME DISPLAY ================
function updateUtcClock() {
  const timeEl = document.getElementById('live-utc-time');
  if (!timeEl) return;
  const now = new Date();
  const istOffset = 5.5 * 60 * 60 * 1000;
  const istDate = new Date(now.getTime() + (now.getTimezoneOffset() * 60 * 1000) + istOffset);
  const hours = String(istDate.getHours()).padStart(2, '0');
  const minutes = String(istDate.getMinutes()).padStart(2, '0');
  const seconds = String(istDate.getSeconds()).padStart(2, '0');
  timeEl.textContent = `${hours}:${minutes}:${seconds} IST`;
}
setInterval(updateUtcClock, 1000);
updateUtcClock();

// ================ 4. COPY EMAIL TO CLIPBOARD ================
function copyEmailToClipboard() {
  const email = 'ashutoshpundir.dev@gmail.com';
  navigator.clipboard.writeText(email).then(() => {
    const copyTextEl = document.getElementById('copy-email-text');
    const boxIconEl = document.getElementById('email-box-copy-icon');
    if (copyTextEl) {
      copyTextEl.textContent = 'Copied!';
      setTimeout(() => { copyTextEl.textContent = 'Copy Email'; }, 2000);
    }
    if (boxIconEl) {
      boxIconEl.textContent = 'done';
      setTimeout(() => { boxIconEl.textContent = 'content_copy'; }, 2000);
    }
  }).catch(err => {
    console.warn('Clipboard write failed', err);
  });
}
// Make it available globally for inline onclick
window.copyEmailToClipboard = copyEmailToClipboard;

// ================ 5. LENIS SMOOTH SCROLL ================
let lenis = null;
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (!prefersReducedMotion && typeof Lenis !== 'undefined') {
  lenis = new Lenis({
    duration: 1.1,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smoothWheel: true,
    wheelMultiplier: 1,
    touchMultiplier: 1.5,
    infinite: false
  });

  function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
  }
  requestAnimationFrame(raf);

  // Connect anchor links to Lenis
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const targetId = this.getAttribute('href');
      if (targetId && targetId !== '#') {
        const targetEl = document.querySelector(targetId);
        if (targetEl) {
          e.preventDefault();
          lenis.scrollTo(targetEl, { offset: -70 });
        }
      }
    });
  });
}

// ================ 6. SCROLL PROGRESS TRACKER ================
window.addEventListener('scroll', () => {
  const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
  const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
  const scrolled = height > 0 ? (winScroll / height) * 100 : 0;
  const tracker = document.getElementById('scroll-tracker');
  if (tracker) {
    tracker.style.width = scrolled + '%';
  }
}, { passive: true });

// ================ 7. SCROLL REVEAL ANIMATIONS ================
function initScrollReveal() {
  // Add .reveal to animatable elements
  const selectors = [
    '.hero-left',
    '.hero-right',
    '.section-header',
    '.about-narrative',
    '.about-sidebar .info-card',
    '.skill-card',
    '.project-card',
    '.project-card-compact',
    '.timeline-item',
    '.contact-channels',
    '.contact-form-wrap',
    '.footer-top',
    '.footer-bottom',
    '.metrics-grid',
    '.other-builds-section',
    '.other-build-card'
  ];

  selectors.forEach(selector => {
    document.querySelectorAll(selector).forEach(el => {
      el.classList.add('reveal');
    });
  });

  // Add stagger to grids
  document.querySelectorAll('.skills-grid, .about-sidebar, .timeline').forEach(el => {
    el.classList.add('reveal-stagger');
  });

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.08,
    rootMargin: '0px 0px -40px 0px'
  });

  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
}

// Run after DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initScrollReveal);
} else {
  initScrollReveal();
}

// ================ 8. ACTIVE NAV LINK HIGHLIGHTING ================
function updateActiveNavLink() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');
  let currentId = '';

  sections.forEach(section => {
    const sectionTop = section.offsetTop - 100;
    if (window.scrollY >= sectionTop) {
      currentId = section.getAttribute('id');
    }
  });

  navLinks.forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('href') === `#${currentId}`) {
      link.classList.add('active');
    }
  });
}

window.addEventListener('scroll', updateActiveNavLink, { passive: true });
updateActiveNavLink();

// ================ 9. FORM SUBMISSION FEEDBACK ================
async function handleFormSubmit() {
  const status = document.getElementById('form-status');
  const btn = document.getElementById('submit-btn');
  const form = document.getElementById('contact-form');
  
  if (!status || !btn || !form) return;

  // Validate form fields
  const name = document.getElementById('contact-name').value.trim();
  const email = document.getElementById('contact-email').value.trim();
  const subject = document.getElementById('contact-subject').value.trim();
  const message = document.getElementById('contact-message').value.trim();

  if (!name || !email || !message) {
    status.textContent = 'Error: Please fill all required fields.';
    status.classList.add('active');
    status.style.color = '#ef4444'; // Error color (red)
    return;
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    status.textContent = 'Error: Please enter a valid email address.';
    status.classList.add('active');
    status.style.color = '#ef4444'; // Error color
    return;
  }

  // Prevent duplicate submissions
  if (btn.disabled) return;

  btn.disabled = true;
  btn.innerHTML = '<span>Transmitting...</span>';
  status.style.color = ''; // Reset color
  status.textContent = 'Initiating payload transmission...';
  status.classList.add('active');

  try {
    const PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;
    const SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID;
    const TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;

    if (!PUBLIC_KEY || !SERVICE_ID || !TEMPLATE_ID) {
      throw new Error('EmailJS configuration is missing. Check your environment variables.');
    }

    // Initialize EmailJS
    emailjs.init({
      publicKey: PUBLIC_KEY,
    });

    const templateParams = {
      name: name,
      email: email,
      topic: subject || 'No Subject',
      message: message,
    };

    await emailjs.send(SERVICE_ID, TEMPLATE_ID, templateParams);

    btn.innerHTML = '<span>Dispatched</span><span class="material-symbols-outlined" style="font-size:16px">check</span>';
    btn.style.opacity = '0.75';
    status.textContent = 'HTTP 200: Payload received. Expect a response in < 24h.';
    status.style.color = '#10b981'; // Success color
    form.reset();
  } catch (error) {
    console.error('EmailJS Error:', error);
    btn.disabled = false;
    btn.innerHTML = '<span>Dispatch Message</span><span class="material-symbols-outlined" style="font-size:16px">send</span>';
    status.textContent = 'Error: Payload transmission failed. Please try again.';
    status.style.color = '#ef4444'; // Error color
  }
}

window.handleFormSubmit = handleFormSubmit;

// ================ 10. NAVBAR SCROLL BEHAVIOR ================
let lastScrollY = 0;
const header = document.getElementById('main-header');

window.addEventListener('scroll', () => {
  if (!header) return;
  const currentScrollY = window.scrollY;
  
  if (currentScrollY > 100) {
    header.style.borderBottomColor = 'var(--border-subtle)';
  } else {
    header.style.borderBottomColor = 'transparent';
  }
  
  lastScrollY = currentScrollY;
}, { passive: true });

