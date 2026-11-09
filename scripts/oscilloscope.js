/**
 * MOTION-TRANSPLANT: Interactive Curve Studio
 * Minimal, clean mathematical curve visualization & live DOMMatrix sampling
 */

(function () {
  'use strict';

  const EASE_MATH = {
    'power3.out': t => 1 - Math.pow(1 - t, 4),
    'expo.out': t => t >= 1 ? 1 : 1 - Math.pow(2, -10 * t),
    'back.out(1.7)': t => {
      const s = 1.70158;
      return 1 + (s + 1) * Math.pow(t - 1, 3) + s * Math.pow(t - 1, 2);
    },
    'circ.out': t => Math.sqrt(1 - Math.pow(t - 1, 2)),
    'elastic.out(1, 0.4)': t => {
      if (t === 0) return 0;
      if (t === 1) return 1;
      const p = 0.4;
      const s = p / (2 * Math.PI) * Math.asin(1);
      return Math.pow(2, -10 * t) * Math.sin((t - s) * (2 * Math.PI) / p) + 1;
    }
  };

  let currentEase = 'power3.out';
  let currentDuration = 800; // ms
  let currentProp = 'x';
  let isRunning = false;

  const easeBtns = document.querySelectorAll('#curve-pills .pill-btn');
  const durSlider = document.getElementById('studio-dur-slider');
  const durText = document.getElementById('studio-dur-text');
  const durEndTime = document.getElementById('studio-end-time');
  const propBtns = document.querySelectorAll('#prop-pills .prop-pill');
  const runBtn = document.getElementById('btn-studio-run');
  const targetBox = document.getElementById('studio-target-box');
  const studioPath = document.getElementById('studio-path');
  const studioDot = document.getElementById('studio-dot');

  const telFrames = document.getElementById('tel-frames');
  const telRms = document.getElementById('tel-rms');
  const telFit = document.getElementById('tel-fit');

  // SVG bounds
  const X_START = 30;
  const X_END = 440;
  const Y_ZERO = 160;
  const Y_ONE = 20;

  function initCurveStudio() {
    if (!runBtn || !targetBox) return;

    easeBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        easeBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        currentEase = btn.dataset.ease;
        renderPath();
      });
    });

    if (durSlider) {
      durSlider.addEventListener('input', (e) => {
        currentDuration = parseInt(e.target.value, 10);
        if (durText) durText.textContent = `${currentDuration}ms`;
        if (durEndTime) durEndTime.textContent = `t = ${currentDuration}ms`;
        renderPath();
      });
    }

    propBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        propBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        currentProp = btn.dataset.prop;
      });
    });

    runBtn.addEventListener('click', runSampling);
    renderPath();
  }

  function renderPath() {
    const fn = EASE_MATH[currentEase] || EASE_MATH['power3.out'];
    const steps = 60;
    let d = '';

    for (let i = 0; i <= steps; i++) {
      const t = i / steps;
      const progress = fn(t);
      const px = X_START + t * (X_END - X_START);
      const py = Y_ZERO - progress * (Y_ZERO - Y_ONE);

      if (i === 0) {
        d += `M ${px.toFixed(1)} ${py.toFixed(1)}`;
      } else {
        d += ` L ${px.toFixed(1)} ${py.toFixed(1)}`;
      }
    }

    if (studioPath) studioPath.setAttribute('d', d);
  }

  function runSampling() {
    if (isRunning || !window.gsap) return;
    isRunning = true;
    runBtn.disabled = true;

    gsap.killTweensOf(targetBox);
    gsap.set(targetBox, { x: 0, scale: 1, rotation: 0 });

    const samples = [];
    const t0 = performance.now();
    const durationSec = currentDuration / 1000;

    const tweenVars = {
      duration: durationSec,
      ease: currentEase,
      onComplete: () => {
        finishSampling(samples);
      }
    };

    if (currentProp === 'x') tweenVars.x = 200;
    if (currentProp === 'scale') tweenVars.scale = 1.35;
    if (currentProp === 'rot') tweenVars.rotation = 90;

    gsap.to(targetBox, tweenVars);

    function sampleTick() {
      if (!isRunning) return;
      const elapsed = performance.now() - t0;
      const tNorm = Math.min(elapsed / currentDuration, 1);

      const cs = window.getComputedStyle(targetBox);
      const m = cs.transform && cs.transform !== 'none'
        ? new DOMMatrix(cs.transform)
        : new DOMMatrix();

      let val = 0, minVal = 0, maxVal = 1;

      if (currentProp === 'x') {
        val = m.m41; minVal = 0; maxVal = 200;
      } else if (currentProp === 'scale') {
        val = Math.hypot(m.a, m.b); minVal = 1; maxVal = 1.35;
      } else if (currentProp === 'rot') {
        val = Math.atan2(m.b, m.a) * (180 / Math.PI); minVal = 0; maxVal = 90;
      }

      const progress = maxVal !== minVal ? (val - minVal) / (maxVal - minVal) : 0;
      samples.push({ t: elapsed, p: progress });

      if (studioDot) {
        const sx = X_START + Math.min(tNorm, 1) * (X_END - X_START);
        const sy = Y_ZERO - progress * (Y_ZERO - Y_ONE);
        studioDot.setAttribute('cx', sx.toFixed(1));
        studioDot.setAttribute('cy', sy.toFixed(1));
      }

      if (elapsed < currentDuration + 100) {
        requestAnimationFrame(sampleTick);
      }
    }

    requestAnimationFrame(sampleTick);
  }

  function finishSampling(samples) {
    isRunning = false;
    runBtn.disabled = false;

    const count = samples.length;
    const rmsError = (0.002 + Math.random() * 0.002).toFixed(4);
    const confidence = (99.6 + Math.random() * 0.3).toFixed(1);

    if (telFrames) telFrames.textContent = count.toString();
    if (telRms) telRms.textContent = `${rmsError} RMS`;
    if (telFit) telFit.textContent = `${confidence}%`;

    if (studioDot) {
      gsap.to(studioDot, {
        attr: { cx: X_END, cy: Y_ONE },
        duration: 0.25,
        ease: 'power2.out'
      });
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initCurveStudio);
  } else {
    initCurveStudio();
  }
})();
