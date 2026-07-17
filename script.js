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
  for (let i = 0; i < 140; i++) {
    const p = document.createElement('div');
    const size = Math.random() * 3 + 1;
    const isBig = Math.random() > 0.85;
    const finalSize = isBig ? size * 2.2 : size;
    const opacity = Math.random() * 0.5 + 0.15;
    p.style.cssText = `
      position: absolute;
      width: ${finalSize}px;
      height: ${finalSize}px;
      background: rgba(${isBig ? '105, 240, 174' : '0, 200, 83'}, ${opacity});
      border-radius: 50%;
      left: ${Math.random() * 100}%;
      top: ${Math.random() * 100}%;
      box-shadow: 0 0 ${finalSize * 3}px ${finalSize}px rgba(0, 200, 83, ${opacity * 0.5});
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

// ── Live HOOD stock price (real NASDAQ data) ──
//
// This pulls the real, current HOOD quote from Finnhub's free stock API.
// To activate it:
//   1. Get a free API key at https://finnhub.io/register (no credit card, 60 requests/min)
//   2. Paste it below as FINNHUB_API_KEY
// Without a key, the ticker shows a fixed last-known closing price instead of
// a fake animation, so nothing here is ever misleading.
const FINNHUB_API_KEY = 'd9d0vapr01qvnjr0phv0d9d0vapr01qvnjr0phvg'; // <-- paste your free Finnhub API key here
const HOOD_LAST_KNOWN_PRICE = 113.55; // fallback close price, used only if no live key/connection
const HOOD_LAST_KNOWN_DATE = 'Jul 16, 2026';

function setStaticFallbackPrice(reason) {
  const priceEl = document.getElementById('heroPrice');
  const changeEl = document.getElementById('heroChange');
  const statusEl = document.getElementById('heroPriceStatus');
  const updatedEl = document.getElementById('heroPriceUpdated');
  if (!priceEl) return;
  priceEl.textContent = '$' + HOOD_LAST_KNOWN_PRICE.toFixed(2);
  if (changeEl) { changeEl.textContent = 'Prev. Close'; changeEl.className = 'chart-change'; }
  if (statusEl) statusEl.textContent = 'NASDAQ: HOOD';
  if (updatedEl) updatedEl.textContent = reason || ('Last close: ' + HOOD_LAST_KNOWN_DATE);
}

async function fetchLiveHoodPrice() {
  const priceEl = document.getElementById('heroPrice');
  const changeEl = document.getElementById('heroChange');
  const statusEl = document.getElementById('heroPriceStatus');
  const updatedEl = document.getElementById('heroPriceUpdated');
  if (!priceEl) return;

  if (!FINNHUB_API_KEY) {
    setStaticFallbackPrice('Add a free Finnhub API key for live data');
    return;
  }

  try {
    const res = await fetch(`https://finnhub.io/api/v1/quote?symbol=HOOD&token=${FINNHUB_API_KEY}`);
    if (!res.ok) throw new Error('Request failed');
    const data = await res.json();
    // data.c = current price, data.dp = percent change on the day
    if (typeof data.c !== 'number' || data.c === 0) throw new Error('No data returned');

    priceEl.textContent = '$' + data.c.toFixed(2);
    const pct = data.dp;
    if (changeEl) {
      changeEl.textContent = (pct >= 0 ? '+' : '') + pct.toFixed(2) + '%';
      changeEl.className = 'chart-change ' + (pct >= 0 ? 'positive' : 'negative');
    }
    if (statusEl) statusEl.textContent = '🟢 LIVE — NASDAQ: HOOD';
    if (updatedEl) {
      const now = new Date();
      updatedEl.textContent = 'Updated ' + now.toLocaleTimeString();
    }
  } catch (err) {
    console.warn('Live price fetch failed, showing last known price instead:', err);
    setStaticFallbackPrice('Live data unavailable — showing last close');
  }
}

fetchLiveHoodPrice();
setInterval(fetchLiveHoodPrice, 60000); // refresh every 60s, within Finnhub's free rate limit

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

// ── Animated "Video" Explainer: How Robinhood Makes Money ──
// Uses the browser's built-in speech synthesis for real spoken narration
// (no external audio file needed) synced with on-screen subtitles and an
// animated flow diagram. If the browser doesn't support speech synthesis,
// it gracefully falls back to timed subtitles with no voice.
(function () {
  const playBtn = document.getElementById('explainerPlayBtn');
  const muteBtn = document.getElementById('explainerMuteBtn');
  if (!playBtn) return; // section not present

  const subtitleEl = document.getElementById('explainerSubtitle');
  const stageEl = document.getElementById('explainerStage');
  const progressFill = document.getElementById('explainerProgressFill');
  const stepCountEl = document.getElementById('explainerStepCount');
  const counterEl = document.getElementById('explainerCounter');
  const counterpartyIcon = document.getElementById('counterpartyIcon');
  const counterpartyLabel = document.getElementById('counterpartyLabel');
  const nodeUser = document.getElementById('nodeUser');
  const nodeRH = document.getElementById('nodeRH');
  const nodeCounterparty = document.getElementById('nodeCounterparty');
  const dotOut1 = document.getElementById('flowDotOut');
  const dotIn1 = document.getElementById('flowDotIn');
  const dotOut2 = document.getElementById('flowDotOut2');
  const dotIn2 = document.getElementById('flowDotIn2');

  const steps = [
    {
      text: "Robinhood charges zero commission on every trade. So how does it make four point five billion dollars a year? Let's break it down, one revenue stream at a time.",
      icon: '🏹', label: 'Robinhood', flow: null, add: 0
    },
    {
      text: "First: Payment for Order Flow. When you place a trade, Robinhood routes it to a market maker instead of straight to the stock exchange. That market maker pays Robinhood a tiny rebate for the right to fill your order.",
      icon: '🏦', label: 'Market Maker', flow: 'out', add: 40
    },
    {
      text: "It's a fraction of a cent per share. But across millions of trades every single day, those fractions add up to hundreds of millions of dollars a year.",
      icon: '🏦', label: 'Market Maker', flow: 'in', add: 60
    },
    {
      text: "Second: Robinhood Gold. Four point two million users pay five dollars a month for perks like higher interest on cash and bigger IRA matches.",
      icon: '⭐', label: 'Gold Subscribers', flow: 'out', add: 50
    },
    {
      text: "Third: Interest income. When you borrow to trade on margin, you pay interest. And your uninvested cash gets swept to partner banks, who pay Robinhood a cut too.",
      icon: '🏛️', label: 'Banks & Borrowers', flow: 'in', add: 70
    },
    {
      text: "Fourth: crypto trades carry a small spread, the gap between the buy and sell price, which Robinhood quietly pockets on every transaction.",
      icon: '₿', label: 'Crypto Traders', flow: 'in', add: 45
    },
    {
      text: "Fifth: every swipe of the Gold Card earns Robinhood a merchant interchange fee, a slice of which funds your three percent cash back.",
      icon: '💳', label: 'Card Merchants', flow: 'in', add: 35
    },
    {
      text: "None of these fees are visible to you as a user. That's the whole point. Robinhood makes money quietly in the background, while keeping trading free up front.",
      icon: '🏹', label: 'Robinhood', flow: null, add: 20
    }
  ];

  let isPlaying = false;
  let isMuted = false;
  let currentStep = 0;
  let runningTotal = 0;
  const synthAvailable = 'speechSynthesis' in window;

  function setActiveNodes(flow) {
    nodeUser.classList.remove('active');
    nodeRH.classList.remove('active');
    nodeCounterparty.classList.remove('active');
    [dotOut1, dotIn1, dotOut2, dotIn2].forEach(d => d.classList.remove('run-right', 'run-left'));
    if (flow === 'out') {
      nodeUser.classList.add('active');
      nodeRH.classList.add('active');
      dotOut1.classList.add('run-right');
      setTimeout(() => { dotOut2.classList.add('run-right'); nodeCounterparty.classList.add('active'); }, 300);
    } else if (flow === 'in') {
      nodeCounterparty.classList.add('active');
      nodeRH.classList.add('active');
      dotIn2.classList.add('run-left');
      setTimeout(() => { dotIn1.classList.add('run-left'); nodeUser.classList.add('active'); }, 300);
    } else {
      nodeRH.classList.add('active');
    }
  }

  function playStep(index) {
    if (index >= steps.length) {
      finishPlayback();
      return;
    }
    currentStep = index;
    const step = steps[index];
    subtitleEl.textContent = step.text;
    counterpartyIcon.textContent = step.icon;
    counterpartyLabel.textContent = step.label;
    setActiveNodes(step.flow);
    runningTotal += step.add;
    counterEl.textContent = '$' + runningTotal + 'M';
    progressFill.style.width = ((index + 1) / steps.length * 100) + '%';
    stepCountEl.textContent = `Step ${index + 1} / ${steps.length}`;

    if (synthAvailable && !isMuted) {
      window.speechSynthesis.cancel();
      const utter = new SpeechSynthesisUtterance(step.text);
      utter.rate = 1.0;
      utter.pitch = 1.0;
      utter.onend = () => { if (isPlaying) playStep(index + 1); };
      utter.onerror = () => { if (isPlaying) setTimeout(() => playStep(index + 1), 4000); };
      window.speechSynthesis.speak(utter);
    } else {
      // No voice: advance on a timer sized to the text length
      const duration = Math.max(3500, step.text.length * 55);
      setTimeout(() => { if (isPlaying) playStep(index + 1); }, duration);
    }
  }

  function finishPlayback() {
    isPlaying = false;
    playBtn.textContent = '↻ Replay';
    subtitleEl.textContent = "That's the full picture — five quiet revenue streams behind one free trading app.";
    nodeUser.classList.remove('active');
    nodeRH.classList.add('active');
    nodeCounterparty.classList.remove('active');
  }

  function cumulativeTotalBefore(index) {
    let sum = 0;
    for (let i = 0; i < index; i++) sum += steps[i].add;
    return sum;
  }

  function jumpToStep(index) {
    index = Math.max(0, Math.min(steps.length - 1, index));
    if (synthAvailable) window.speechSynthesis.cancel();
    runningTotal = cumulativeTotalBefore(index);
    isPlaying = true;
    playBtn.textContent = '⏸ Pause';
    playStep(index);
  }

  const progressBar = document.getElementById('explainerProgressBar') || playBtn.closest('.explainer-controls').querySelector('.explainer-progress');
  if (progressBar) {
    progressBar.addEventListener('click', (e) => {
      const rect = progressBar.getBoundingClientRect();
      const ratio = Math.min(1, Math.max(0, (e.clientX - rect.left) / rect.width));
      const targetIndex = Math.min(steps.length - 1, Math.floor(ratio * steps.length));
      jumpToStep(targetIndex);
    });
  }

  playBtn.addEventListener('click', () => {
    if (isPlaying) {
      // Pause
      isPlaying = false;
      playBtn.textContent = '▶ Resume';
      if (synthAvailable) window.speechSynthesis.pause();
      return;
    }
    if (playBtn.textContent.includes('Resume') && synthAvailable && window.speechSynthesis.paused) {
      isPlaying = true;
      playBtn.textContent = '⏸ Pause';
      window.speechSynthesis.resume();
      return;
    }
    // Start fresh or replay
    isPlaying = true;
    playBtn.textContent = '⏸ Pause';
    runningTotal = 0;
    if (synthAvailable) window.speechSynthesis.cancel();
    playStep(0);
  });

  muteBtn.addEventListener('click', () => {
    isMuted = !isMuted;
    muteBtn.textContent = isMuted ? '🔇' : '🔊';
    if (isMuted && synthAvailable) window.speechSynthesis.cancel();
  });
})();
