/* ========= SCRIPT.JS — Robinhood Fintech Repository ========= */

// ── Navbar scroll effect ──
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  if (window.scrollY > 50) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
});

// ── Hamburger menu ──
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('navLinks');
hamburger.addEventListener('click', () => {
  navLinks.classList.toggle('open');
  const spans = hamburger.querySelectorAll('span');
  if (navLinks.classList.contains('open')) {
    spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
    spans[1].style.opacity = '0';
    spans[2].style.transform = 'rotate(-45deg) translate(5px, -5px)';
  } else {
    spans.forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
  }
});

// Close nav on link click
navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('open');
    hamburger.querySelectorAll('span').forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
  });
});

// ── Smooth active nav highlight ──
const sections = document.querySelectorAll('section[id]');
const navLinkEls = document.querySelectorAll('.nav-links a');
function updateActiveNav() {
  const scrollPos = window.scrollY + 120;
  sections.forEach(section => {
    const top = section.offsetTop;
    const bottom = top + section.offsetHeight;
    const id = section.getAttribute('id');
    const link = document.querySelector(`.nav-links a[href="#${id}"]`);
    if (link) {
      if (scrollPos >= top && scrollPos < bottom) {
        navLinkEls.forEach(l => l.style.color = '');
        link.style.color = 'var(--green-main)';
      }
    }
  });
}
window.addEventListener('scroll', updateActiveNav);

// ── Particle background ──
function createParticles() {
  const container = document.getElementById('particles');
  if (!container) return;
  for (let i = 0; i < 60; i++) {
    const p = document.createElement('div');
    p.style.cssText = `
      position: absolute;
      width: ${Math.random() * 3 + 1}px;
      height: ${Math.random() * 3 + 1}px;
      background: rgba(0, 200, 83, ${Math.random() * 0.4 + 0.1});
      border-radius: 50%;
      left: ${Math.random() * 100}%;
      top: ${Math.random() * 100}%;
      animation: particleFloat ${Math.random() * 15 + 10}s ease-in-out infinite;
      animation-delay: ${Math.random() * -15}s;
    `;
    container.appendChild(p);
  }
}

const particleStyle = document.createElement('style');
particleStyle.textContent = `
  @keyframes particleFloat {
    0%, 100% { transform: translateY(0) translateX(0) scale(1); opacity: 0.5; }
    25% { transform: translateY(-${Math.random() * 40 + 20}px) translateX(${Math.random() * 30}px) scale(1.2); opacity: 0.8; }
    50% { transform: translateY(-${Math.random() * 80 + 40}px) translateX(-${Math.random() * 30}px) scale(0.8); opacity: 0.3; }
    75% { transform: translateY(-${Math.random() * 40 + 10}px) translateX(${Math.random() * 20}px) scale(1.1); opacity: 0.6; }
  }
`;
document.head.appendChild(particleStyle);
createParticles();

// ── Intersection Observer for animations ──
const observerOptions = {
  root: null,
  rootMargin: '0px',
  threshold: 0.1
};

const animObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      // Animate bar fills
      const bars = entry.target.querySelectorAll('.bar-fill, .um-bar');
      bars.forEach(bar => {
        const targetWidth = bar.style.width;
        bar.style.width = '0';
        setTimeout(() => { bar.style.width = targetWidth; }, 100);
      });
    }
  });
}, observerOptions);

document.querySelectorAll('.glass-card, .timeline-content, .metric-big, .impact-card, .future-card, .controversy-card').forEach(el => {
  el.style.opacity = '0';
  el.style.transform = 'translateY(24px)';
  el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
  animObserver.observe(el);
});

// Add visible styles
const visibleStyle = document.createElement('style');
visibleStyle.textContent = `.visible { opacity: 1 !important; transform: translateY(0) !important; }`;
document.head.appendChild(visibleStyle);

// ── Animated counter for hero stats ──
function animateCounter(el, target, suffix = '') {
  const duration = 2000;
  const step = target / (duration / 16);
  let current = 0;
  const timer = setInterval(() => {
    current += step;
    if (current >= target) {
      current = target;
      clearInterval(timer);
    }
    el.textContent = Math.floor(current).toLocaleString() + suffix;
  }, 16);
}

// ── Ticker animation for chart price ──
function animateChartPrice() {
  const priceEl = document.querySelector('.chart-price');
  if (!priceEl) return;
  let base = 47.23;
  setInterval(() => {
    const delta = (Math.random() - 0.48) * 0.3;
    base = Math.max(40, Math.min(60, base + delta));
    priceEl.textContent = '$' + base.toFixed(2);
    const changeEl = document.querySelector('.chart-change');
    if (changeEl) {
      const pct = ((base - 46.12) / 46.12 * 100).toFixed(2);
      changeEl.textContent = (pct >= 0 ? '+' : '') + pct + '%';
      changeEl.className = 'chart-change ' + (pct >= 0 ? 'positive' : 'negative');
    }
  }, 2000);
}
animateChartPrice();

// ── Timeline stagger animation ──
const timelineItems = document.querySelectorAll('.timeline-item');
const timelineObs = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      setTimeout(() => {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateX(0)';
      }, 100);
    }
  });
}, { threshold: 0.2 });

timelineItems.forEach((item, i) => {
  const isLeft = item.classList.contains('left');
  item.style.opacity = '0';
  item.style.transform = `translateX(${isLeft ? '-30px' : '30px'})`;
  item.style.transition = `opacity 0.6s ease ${i * 0.1}s, transform 0.6s ease ${i * 0.1}s`;
  timelineObs.observe(item);
});

// ── Scroll to top button ──
const scrollBtn = document.createElement('button');
scrollBtn.innerHTML = '↑';
scrollBtn.style.cssText = `
  position: fixed;
  bottom: 30px; right: 30px;
  width: 44px; height: 44px;
  background: var(--green-main);
  color: #000;
  border: none;
  border-radius: 50%;
  font-size: 1.2rem;
  font-weight: 700;
  cursor: pointer;
  opacity: 0;
  transition: opacity 0.3s, transform 0.3s;
  z-index: 999;
  box-shadow: 0 4px 20px rgba(0,200,83,0.4);
`;
document.body.appendChild(scrollBtn);
scrollBtn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
window.addEventListener('scroll', () => {
  scrollBtn.style.opacity = window.scrollY > 400 ? '1' : '0';
  scrollBtn.style.transform = window.scrollY > 400 ? 'scale(1)' : 'scale(0.8)';
});

// ── Reading progress bar ──
const progressBar = document.createElement('div');
progressBar.style.cssText = `
  position: fixed;
  top: 0; left: 0;
  height: 3px;
  background: linear-gradient(90deg, var(--green-main), var(--green-light));
  z-index: 9999;
  width: 0%;
  transition: width 0.1s;
`;
document.body.appendChild(progressBar);
window.addEventListener('scroll', () => {
  const scrollTop = window.scrollY;
  const docHeight = document.body.scrollHeight - window.innerHeight;
  const progress = (scrollTop / docHeight) * 100;
  progressBar.style.width = progress + '%';
});

// ── Tooltip on stat pills ──
document.querySelectorAll('.stat-pill').forEach(pill => {
  pill.style.cursor = 'default';
  pill.addEventListener('mouseenter', () => {
    pill.style.background = 'rgba(0,200,83,0.1)';
    pill.style.borderColor = 'rgba(0,200,83,0.4)';
    pill.style.transform = 'translateY(-3px)';
  });
  pill.addEventListener('mouseleave', () => {
    pill.style.background = '';
    pill.style.borderColor = '';
    pill.style.transform = '';
  });
});

console.log('%c🏹 RobinhoodHQ — Fintech Repository Loaded', 'color: #00c853; font-size: 16px; font-weight: bold;');
console.log('%cBuilt for academic excellence in FinTech', 'color: #69f0ae; font-size: 12px;');
