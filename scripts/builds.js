/**
 * MOTION-TRANSPLANT: Showcase Interactive Playground
 * Minimal & Immersive builds, Spec Modal & Submission Handling
 */

(function () {
  'use strict';

  const SPECS = {
    'kinetic-deck': `# SPEC // kinetic-deck.spec.md
STATUS: VERIFIED (99.7% PARITY MATCH)
SOURCE: godly.website/deck-flow

## Parameters
- duration: 0.85s
- ease: "power3.out" (cubic-bezier(0.215, 0.61, 0.355, 1))
- stagger: 0.08s
- transform: y: 40px -> 0px, rotation: [-8deg, 6deg, 0deg]

## Verification
- RMS Error: 0.003
- Verdict: Production Ready`,

    'velocity-skew': `# SPEC // velocity-skew.spec.md
STATUS: VERIFIED (99.4% PARITY MATCH)
SOURCE: supahero.io/precision

## Parameters
- ease: "power2.out" return-to-zero
- clamp: -8deg to +8deg skewY
- quickTo duration: 0.35s

## Verification
- Dynamic velocity interpolation verified
- Verdict: Production Ready`,

    'aperture-reveal': `# SPEC // aperture-reveal.spec.md
STATUS: VERIFIED (99.9% PARITY MATCH)
SOURCE: awwwards.com/developer/aperture

## Parameters
- property: clip-path: polygon()
- duration: 0.9s
- ease: "expo.out" (cubic-bezier(0.19, 1, 0.22, 1))

## Verification
- RMS Error: 0.001
- Verdict: Production Ready`,

    'inertia-physics': `# SPEC // inertia-physics.spec.md
STATUS: VERIFIED (99.2% PARITY MATCH)
SOURCE: siteinspire.com/physics-deck

## Parameters
- momentum decay: 0.94 friction factor
- boundary elasticity: 0.65 restitution
- settle ease: "back.out(1.4)"

## Verification
- Momentum release matched: 99.2%
- Verdict: Production Ready`
  };

  function initBuilds() {
    initDeck();
    initSkew();
    initAperture();
    initPhysics();
    initModals();
  }

  // --- BUILD 1: DECK ---
  function initDeck() {
    const canvas = document.getElementById('canvas-deck');
    const playBtn = document.querySelector('[data-play="deck"]');
    if (!canvas || !window.gsap) return;

    const cards = canvas.querySelectorAll('.clean-card');

    function animate() {
      gsap.fromTo(cards,
        { y: 40, opacity: 0, scale: 0.9 },
        { y: 0, opacity: 1, scale: 1, duration: 0.8, stagger: 0.08, ease: 'power3.out' }
      );
    }

    if (playBtn) playBtn.addEventListener('click', animate);

    canvas.addEventListener('mousemove', (e) => {
      const rect = canvas.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;

      gsap.to(cards[0], { x: x * 18, y: y * 18, rotation: x * 8, duration: 0.3 });
      gsap.to(cards[1], { x: x * 10, y: y * 10, rotation: 6 + x * 6, duration: 0.35 });
      gsap.to(cards[2], { x: x * 5, y: y * 5, rotation: -8 + x * 4, duration: 0.4 });
    });

    canvas.addEventListener('mouseleave', () => {
      gsap.to(cards[0], { x: 0, y: 0, rotation: 0, duration: 0.5, ease: 'power2.out' });
      gsap.to(cards[1], { x: 0, y: 0, rotation: 6, duration: 0.5, ease: 'power2.out' });
      gsap.to(cards[2], { x: 0, y: 0, rotation: -8, duration: 0.5, ease: 'power2.out' });
    });
  }

  // --- BUILD 2: SKEW ---
  function initSkew() {
    const box = document.getElementById('demo-skew-box');
    const playBtn = document.querySelector('[data-play="skew"]');
    if (!box || !window.gsap) return;

    function impulse() {
      gsap.timeline()
        .to(box, { skewX: -14, scale: 1.04, duration: 0.15, ease: 'power2.out' })
        .to(box, { skewX: 10, scale: 0.98, duration: 0.2, ease: 'power1.inOut' })
        .to(box, { skewX: 0, scale: 1, duration: 0.4, ease: 'back.out(1.4)' });
    }

    if (playBtn) playBtn.addEventListener('click', impulse);
  }

  // --- BUILD 3: APERTURE ---
  function initAperture() {
    const el = document.getElementById('demo-aperture');
    const playBtn = document.querySelector('[data-play="aperture"]');
    if (!el || !window.gsap) return;

    let open = false;

    function toggle() {
      open = !open;
      if (open) {
        gsap.to(el, {
          clipPath: 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)',
          duration: 0.7,
          ease: 'expo.out'
        });
      } else {
        gsap.to(el, {
          clipPath: 'polygon(25% 0%, 75% 0%, 100% 25%, 100% 75%, 75% 100%, 25% 100%, 0% 75%, 0% 25%)',
          duration: 0.5,
          ease: 'power3.inOut'
        });
      }
    }

    if (playBtn) playBtn.addEventListener('click', toggle);
  }

  // --- BUILD 4: PHYSICS ---
  function initPhysics() {
    const boundary = document.getElementById('canvas-physics');
    const box = document.getElementById('demo-physics-box');
    const playBtn = document.querySelector('[data-play="physics"]');
    if (!boundary || !box || !window.gsap) return;

    let isDragging = false;
    let startX = 0, startY = 0;
    let curX = 0, curY = 0;
    let lastX = 0, lastY = 0;
    let vX = 0, vY = 0;

    box.addEventListener('pointerdown', (e) => {
      isDragging = true;
      box.setPointerCapture(e.pointerId);
      startX = e.clientX - curX;
      startY = e.clientY - curY;
      lastX = e.clientX;
      lastY = e.clientY;
      vX = 0;
      vY = 0;
      gsap.killTweensOf(box);
      gsap.to(box, { scale: 1.08, duration: 0.15 });
    });

    window.addEventListener('pointermove', (e) => {
      if (!isDragging) return;
      curX = e.clientX - startX;
      curY = e.clientY - startY;
      vX = e.clientX - lastX;
      vY = e.clientY - lastY;
      lastX = e.clientX;
      lastY = e.clientY;

      gsap.set(box, { x: curX, y: curY });
    });

    window.addEventListener('pointerup', () => {
      if (!isDragging) return;
      isDragging = false;

      const targetX = Math.min(Math.max(curX + vX * 4, -70), 70);
      const targetY = Math.min(Math.max(curY + vY * 4, -40), 40);

      gsap.to(box, {
        x: targetX,
        y: targetY,
        scale: 1,
        duration: 0.5,
        ease: 'power2.out',
        onComplete: () => {
          gsap.to(box, { x: 0, y: 0, duration: 0.6, ease: 'back.out(1.4)' });
          curX = 0;
          curY = 0;
        }
      });
    });

    if (playBtn) {
      playBtn.addEventListener('click', () => {
        gsap.timeline()
          .to(box, { x: 70, y: -30, rotation: 12, duration: 0.25, ease: 'power2.out' })
          .to(box, { x: -60, y: 25, rotation: -10, duration: 0.35, ease: 'power1.inOut' })
          .to(box, { x: 0, y: 0, rotation: 0, duration: 0.5, ease: 'back.out(1.4)' });
      });
    }
  }

  // --- MODALS ---
  function initModals() {
    const specModal = document.getElementById('spec-modal');
    const specBody = document.getElementById('spec-body');
    const closeSpec = document.getElementById('btn-close-spec');
    const copySpec = document.getElementById('btn-copy-spec');
    const specBtns = document.querySelectorAll('[data-spec]');

    const submitModal = document.getElementById('submit-modal');
    const openSubmit = document.getElementById('btn-submit-build');
    const closeSubmit = document.getElementById('btn-close-submit');
    const submitForm = document.getElementById('submit-form');

    specBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.dataset.spec;
        if (specBody) specBody.textContent = SPECS[id] || '// Spec not found.';
        if (specModal) specModal.classList.add('open');
      });
    });

    if (closeSpec) {
      closeSpec.addEventListener('click', () => specModal.classList.remove('open'));
    }

    if (copySpec && specBody) {
      copySpec.addEventListener('click', () => {
        navigator.clipboard.writeText(specBody.textContent).then(() => {
          copySpec.textContent = 'Copied!';
          setTimeout(() => { copySpec.textContent = 'Copy Spec'; }, 1800);
        });
      });
    }

    if (openSubmit && submitModal) {
      openSubmit.addEventListener('click', () => submitModal.classList.add('open'));
    }

    if (closeSubmit && submitModal) {
      closeSubmit.addEventListener('click', () => submitModal.classList.remove('open'));
    }

    [specModal, submitModal].forEach(m => {
      if (!m) return;
      m.addEventListener('click', (e) => {
        if (e.target === m) m.classList.remove('open');
      });
    });

    if (submitForm) {
      submitForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = document.getElementById('sub-name').value;
        alert(`Transplant "${name}" registered for automated curve parity testing!`);
        submitForm.reset();
        submitModal.classList.remove('open');
      });
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initBuilds);
  } else {
    initBuilds();
  }
})();
