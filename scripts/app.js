/**
 * MOTION-TRANSPLANT: Main Application Orchestrator
 * Lenis Smooth Scroll + GSAP ScrollTrigger Pinned Transitions
 */

(function () {
  'use strict';

  let lenis = null;
  let isSlow = false;

  function init() {
    initLenis();
    initHero();
    initPipelinePin();
    initWorkflowPin();
    initDocs();
    initCopyActions();
    initNavTracking();
    initSpeedToggle();
  }

  // --- 1. LENIS SMOOTH SCROLL ---
  function initLenis() {
    if (typeof Lenis === 'undefined' || typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
      return;
    }

    gsap.registerPlugin(ScrollTrigger);

    lenis = new Lenis({
      duration: 1.1,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1.1
    });

    lenis.on('scroll', ScrollTrigger.update);

    gsap.ticker.add((time) => {
      lenis.raf(time * 1000);
    });

    gsap.ticker.lagSmoothing(0);
  }

  // --- 2. HERO ENTRANCE & INTERACTIVE TILT ---
  function initHero() {
    if (!window.gsap) return;

    gsap.timeline({ defaults: { ease: 'power3.out' } })
      .from('.hero-badge', { opacity: 0, y: -16, duration: 0.6 })
      .from('.hero-title', { opacity: 0, y: 30, duration: 0.8 }, '-=0.3')
      .from('.hero-description', { opacity: 0, y: 20, duration: 0.7 }, '-=0.5')
      .from('.cli-box', { opacity: 0, scale: 0.96, duration: 0.6 }, '-=0.4')
      .from('.hero-actions', { opacity: 0, y: 16, duration: 0.5 }, '-=0.3')
      .from('.hero-stage', { opacity: 0, y: 40, duration: 0.9 }, '-=0.4');

    const stage = document.getElementById('hero-interactive-stage');
    if (!stage) return;

    stage.addEventListener('mousemove', (e) => {
      const rect = stage.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;

      gsap.to(stage, {
        rotateY: x * 18,
        rotateX: -y * 14,
        duration: 0.35,
        ease: 'power2.out'
      });
    });

    stage.addEventListener('mouseleave', () => {
      gsap.to(stage, { rotateY: 0, rotateX: 0, duration: 0.6, ease: 'power2.out' });
    });
  }

  // --- 3. SCROLL TRANSITION 1: PINNED PIPELINE ---
  function initPipelinePin() {
    if (!window.gsap || !window.ScrollTrigger) return;

    const pinEl = document.getElementById('pipeline-pin');
    const fill = document.getElementById('pipe-fill');
    const cards = document.querySelectorAll('.pipeline-card');

    if (!pinEl) return;

    gsap.timeline({
      scrollTrigger: {
        trigger: pinEl,
        start: 'top top',
        end: '+=1200',
        pin: true,
        scrub: 0.5,
        onUpdate: (self) => {
          if (fill) fill.style.width = `${Math.round(self.progress * 100)}%`;
        }
      }
    })
    .fromTo(cards[0], { y: 20, opacity: 0.8 }, { y: 0, opacity: 1, ease: 'none' })
    .fromTo(cards[1], { y: 40, opacity: 0.6 }, { y: 0, opacity: 1, ease: 'none' }, 0.2)
    .fromTo(cards[2], { y: 60, opacity: 0.4 }, { y: 0, opacity: 1, ease: 'none' }, 0.4);
  }

  // --- 4. SCROLL TRANSITION 2: HOW IT WORKS PINNED SEQUENCER ---
  function initWorkflowPin() {
    if (!window.gsap || !window.ScrollTrigger) return;

    const cards = document.querySelectorAll('.wf-card');
    const steps = document.querySelectorAll('.phase-step');
    const numEl = document.getElementById('wf-active-num');
    const titleEl = document.getElementById('wf-active-title');
    const descEl = document.getElementById('wf-active-desc');

    const DATA = {
      1: { title: 'Locate & Introspect', desc: 'Browse like a human visitor. Map active GSAP timelines, ScrollTrigger pin bounds, and DOM nesting.' },
      2: { title: 'DOMMatrix Sampling', desc: 'Slow time to 0.1x. Sample transform coordinates across 60 FPS frames and track inertia.' },
      3: { title: 'Synthesize Spec', desc: 'Classify parameters into measured, inferred, and guessed. Produce the complete markdown spec.' },
      4: { title: 'Clean-Room Rebuild', desc: 'Rebuild in an isolated sandbox with neutral placeholder boxes. Zero stolen code.' },
      5: { title: 'Verify Parity', desc: 'Overlay rebuild curves against reference ground truth. Strict RMS error threshold < 0.03.' },
      6: { title: 'Production Graft', desc: 'Inject verified code directly into your production codebase with custom tokens and reduced-motion support.' }
    };

    cards.forEach(card => {
      const stepIdx = parseInt(card.dataset.step, 10);

      ScrollTrigger.create({
        trigger: card,
        start: 'top 55%',
        end: 'bottom 45%',
        onEnter: () => setStep(stepIdx),
        onEnterBack: () => setStep(stepIdx)
      });
    });

    function setStep(idx) {
      cards.forEach(c => {
        const cIdx = parseInt(c.dataset.step, 10);
        c.classList.toggle('active-card', cIdx === idx);
      });

      steps.forEach(s => {
        const sIdx = parseInt(s.dataset.step, 10);
        s.classList.toggle('active', sIdx === idx);
      });

      if (numEl) numEl.textContent = idx < 10 ? `0${idx}` : `${idx}`;
      if (titleEl && DATA[idx]) titleEl.textContent = DATA[idx].title;
      if (descEl && DATA[idx]) descEl.textContent = DATA[idx].desc;
    }

    steps.forEach(s => {
      s.addEventListener('click', () => {
        const targetIdx = s.dataset.step;
        const targetCard = document.querySelector(`.wf-card[data-step="${targetIdx}"]`);
        if (targetCard) {
          if (lenis) lenis.scrollTo(targetCard, { offset: -80 });
          else targetCard.scrollIntoView({ behavior: 'smooth' });
        }
      });
    });
  }

  // --- 5. DOCS TABS ---
  function initDocs() {
    const tabBtns = document.querySelectorAll('.docs-tabs .tab-btn');
    const views = document.querySelectorAll('.doc-view');

    tabBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        tabBtns.forEach(b => b.classList.remove('active'));
        views.forEach(v => v.classList.remove('active'));

        btn.classList.add('active');
        const docId = btn.dataset.doc;
        const targetView = document.getElementById(`view-${docId}`);
        if (targetView) targetView.classList.add('active');
      });
    });
  }

  // --- 6. COPY ACTIONS ---
  function initCopyActions() {
    const heroBtn = document.getElementById('hero-copy-btn');
    const heroLabel = document.getElementById('hero-copy-label');
    const cliText = document.getElementById('cli-text');

    if (heroBtn && cliText) {
      heroBtn.addEventListener('click', () => {
        navigator.clipboard.writeText(cliText.textContent.trim()).then(() => {
          if (heroLabel) heroLabel.textContent = 'COPIED';
          setTimeout(() => { if (heroLabel) heroLabel.textContent = 'COPY'; }, 1800);
        });
      });
    }

    const footerBtn = document.getElementById('footer-copy-btn');
    if (footerBtn) {
      footerBtn.addEventListener('click', () => {
        navigator.clipboard.writeText('git clone https://github.com/lakshya1282/motion-transplant.git').then(() => {
          const orig = footerBtn.textContent;
          footerBtn.textContent = 'COPIED';
          setTimeout(() => { footerBtn.textContent = orig; }, 1800);
        });
      });
    }

    document.querySelectorAll('.copy-doc-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const codeId = btn.dataset.copy;
        const el = document.getElementById(codeId);
        if (el) {
          navigator.clipboard.writeText(el.textContent).then(() => {
            const orig = btn.textContent;
            btn.textContent = 'COPIED';
            setTimeout(() => { btn.textContent = orig; }, 1800);
          });
        }
      });
    });
  }

  // --- 7. NAV TRACKING ---
  function initNavTracking() {
    const links = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('section[data-nav]');

    links.forEach(l => {
      l.addEventListener('click', (e) => {
        e.preventDefault();
        const id = l.getAttribute('href');
        const target = document.querySelector(id);
        if (target) {
          if (lenis) lenis.scrollTo(target, { offset: -60 });
          else target.scrollIntoView({ behavior: 'smooth' });
        }
      });
    });

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const id = entry.target.id;
          links.forEach(l => {
            l.classList.toggle('active', l.dataset.target === id);
          });
        }
      });
    }, { threshold: 0.35 });

    sections.forEach(s => observer.observe(s));
  }

  // --- 8. SPEED TOGGLE ---
  function initSpeedToggle() {
    const btn = document.getElementById('global-speed-btn');
    const label = document.getElementById('speed-label');
    if (!btn || !window.gsap) return;

    btn.addEventListener('click', () => {
      isSlow = !isSlow;
      const rate = isSlow ? 0.2 : 1.0;
      gsap.globalTimeline.timeScale(rate);

      if (label) label.textContent = isSlow ? '0.2x SLOW' : '1.0x SPEED';
      btn.classList.toggle('active', isSlow);
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
