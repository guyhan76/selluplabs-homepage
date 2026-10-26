'use strict';
(() => {
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  const fine = window.matchMedia('(hover: hover) and (pointer: fine)');
  const hero = document.querySelector('.hero');
  const visual = document.querySelector('.visual');
  const scene = document.querySelector('.scene');
  const reel = document.querySelector('.reel');
  const showcase = document.querySelector('.showcase');
  const toggle = document.querySelector('#motion-toggle');
  const slides = [
    { src: '/images/examples/previews/box-6-20261008.webp', alt: '리본 선물박스 광고 예시', category: 'PACKAGING & GIFT', title: '포장하는 순간,\n선물이 됩니다.', description: '재질과 디테일이 드러나는\n선물 패키지 광고 예시.', wash: '#b7976438' },
    { src: '/images/examples/previews/other-12.webp', alt: '스네일 크림 광고 예시', category: 'BEAUTY & DAILY RITUAL', title: '매일 만나는 제품에,\n새로운 시선을.', description: '제품의 특징과 사용 경험을 전하는\n뷰티 광고 예시.', wash: '#a8bcb540' },
    { src: '/images/examples/previews/other-3.webp', alt: '데스크톱 컴퓨터 광고 예시', category: 'TECH & LIFESTYLE', title: '기술의 차이를,\n한눈에 보이게.', description: '제품 구조와 핵심 정보를 함께 담은\n테크 광고 예시.', wash: '#7999b138' },
  ];
  let current = 0, paused = reduced.matches, reelVisible = false, hovering = false, focused = false, timer = null, pointerFrame = 0;
  function schedule() {
    clearTimeout(timer);
    if (!paused && !reduced.matches && reelVisible && !hovering && !focused && !document.hidden) timer = setTimeout(() => { show(current + 1); }, 5000);
  }
  function setLines(element, value) {
    element.replaceChildren(...value.split('\n').flatMap((line, index) => index ? [document.createElement('br'), document.createTextNode(line)] : [document.createTextNode(line)]));
  }
  function show(index) {
    current = (index + slides.length) % slides.length;
    const slide = slides[current], img = document.querySelector('#reel-image');
    img.classList.remove('changing');
    img.src = slide.src; img.alt = slide.alt;
    document.querySelector('#reel-category').textContent = slide.category;
    setLines(document.querySelector('#reel-headline'), slide.title);
    setLines(document.querySelector('#reel-description'), slide.description);
    document.querySelector('#reel-count').textContent = `0${current + 1} / 03`;
    document.querySelector('.reel-wash').style.background = `radial-gradient(ellipse at 75% 40%,${slide.wash},transparent 65%),linear-gradient(130deg,#171b16,#292a22)`;
    document.querySelectorAll('[data-slide]').forEach(button => button.setAttribute('aria-pressed', String(Number(button.dataset.slide) === current)));
    if (!paused && !reduced.matches) { void img.offsetWidth; img.classList.add('changing'); }
    schedule();
  }
  function syncPause() {
    document.body.classList.toggle('paused', paused);
    toggle.setAttribute('aria-pressed', String(paused));
    toggle.disabled = reduced.matches;
    toggle.querySelector('[data-motion-label]').textContent = reduced.matches ? '동작 줄이기 적용' : paused ? '움직임 재생' : '움직임 정지';
    toggle.querySelector('[data-motion-icon]').textContent = paused ? '▷' : 'Ⅱ';
    if (paused) { scene.style.removeProperty('--rx'); scene.style.removeProperty('--ry'); }
    schedule();
  }
  toggle.addEventListener('click', () => { paused = !paused; syncPause(); });
  reduced.addEventListener('change', () => { paused = reduced.matches; syncPause(); });
  document.addEventListener('visibilitychange', () => { document.body.classList.toggle('hidden-page', document.hidden); schedule(); });
  document.querySelector('#next').addEventListener('click', () => show(current + 1));
  document.querySelector('#previous').addEventListener('click', () => show(current - 1));
  document.querySelectorAll('[data-slide]').forEach(button => button.addEventListener('click', () => show(Number(button.dataset.slide))));
  reel.addEventListener('pointerenter', () => { hovering = true; schedule(); });
  reel.addEventListener('pointerleave', () => { hovering = false; schedule(); });
  showcase.addEventListener('focusin', () => { focused = true; schedule(); });
  showcase.addEventListener('focusout', event => { focused = showcase.contains(event.relatedTarget); schedule(); });
  visual.addEventListener('pointermove', event => {
    if (paused || reduced.matches || !fine.matches) return;
    const bounds = visual.getBoundingClientRect();
    const x = (event.clientX - bounds.left) / bounds.width - .5;
    const y = (event.clientY - bounds.top) / bounds.height - .5;
    cancelAnimationFrame(pointerFrame);
    pointerFrame = requestAnimationFrame(() => { scene.style.setProperty('--ry', `${x * 9}deg`); scene.style.setProperty('--rx', `${-y * 6}deg`); });
  });
  visual.addEventListener('pointerleave', () => { cancelAnimationFrame(pointerFrame); scene.style.setProperty('--rx', '0deg'); scene.style.setProperty('--ry', '0deg'); });
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(entries => { entries.forEach(entry => {
      if (entry.target === reel) { reelVisible = entry.isIntersecting; schedule(); }
    }); }, { threshold: .12 }).observe(reel);
    const heroObserver = new IntersectionObserver(([entry]) => document.body.classList.toggle('out-of-view', !entry.isIntersecting));
    heroObserver.observe(hero);
    const reveals = new IntersectionObserver(entries => entries.forEach(entry => { if (entry.isIntersecting) { entry.target.classList.add('visible'); reveals.unobserve(entry.target); } }), { threshold: .08 });
    document.querySelectorAll('.section-heading, .step, .closing').forEach(element => { element.classList.add('reveal-ready'); reveals.observe(element); });
  } else { reelVisible = true; }
  syncPause();
  document.body.classList.add('motion-enabled');
})();
