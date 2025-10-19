// =========================
// Utilidades
// =========================
const $all = (sel, root = document) => Array.from(root.querySelectorAll(sel));
const clamp = (n, min, max) => Math.min(Math.max(n, min), max);
const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// =========================
// Idioma (PT/EN)
// =========================
(() => {
  const botoes = $all('.lang-btn');
  if (!botoes.length) return;

  const idiomaSalvo = localStorage.getItem('idioma');
  if (idiomaSalvo) {
    botoes.forEach(b => {
      b.classList.toggle('active', b.textContent.trim() === idiomaSalvo);
    });
  }

  botoes.forEach(botao => {
    botao.addEventListener('click', () => {
      botoes.forEach(b => b.classList.remove('active'));
      botao.classList.add('active');
      localStorage.setItem('idioma', botao.textContent.trim());
      // aqui você pode disparar troca de texto futuramente
    });
  });
})();

// =========================
/* Reveal com IntersectionObserver
   - Adiciona .in quando entra na viewport
   - Stagger automático por grupo (.hero-wrap, .about-content, .masonry, .case-hero, .case-grid, .case-sections)
*/
// =========================
(() => {
  const revealEls = $all('.reveal');
  if (!revealEls.length) return;

  if (prefersReduced) {
    revealEls.forEach(el => el.classList.add('in'));
    return;
  }

  // Stagger automático por contêiner (cada grupo entra em sequência)
  const groups = [
    '.hero-wrap',
    '.about-content',
    '.masonry',
    '.case-hero',
    '.case-grid',
    '.case-sections'
  ];
  groups.forEach(sel => {
    const group = document.querySelector(sel);
    if (!group) return;
    const itens = $all('.reveal', group);
    itens.forEach((el, i) => {
      // 60ms de diferença por item (pode ajustar)
      el.style.transitionDelay = `${i * 60}ms`;
    });
  });

  const io = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('in');
      obs.unobserve(entry.target);
    });
  }, {
    root: null,
    threshold: 0.2,
    rootMargin: '0px 0px -10% 0px'
  });

  revealEls.forEach(el => io.observe(el));
})();

// =========================
// Parallax shapes (HERO)
// =========================
(() => {
  if (prefersReduced) return;
  const shapes = $all('[data-speed]');
  if (!shapes.length) return;

  shapes.forEach(el => { el.style.willChange = 'transform'; });

  const onScroll = () => {
    const y = window.scrollY || window.pageYOffset;
    shapes.forEach(el => {
      const s = parseFloat(el.dataset.speed || 0.2);
      const t = clamp(y * s, -400, 400);
      el.style.transform = `translate3d(0, ${t}px, 0)`;
    });
  };

  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  // Fallback: se a hero não tiver rolagem suficiente, adiciona leve parallax no mouse
  const hasScroll = () => document.documentElement.scrollHeight > innerHeight * 1.2;
  if (!hasScroll()) {
    const onMove = (e) => {
      const cx = innerWidth / 2, cy = innerHeight / 2;
      const dx = (e.clientX - cx) / cx;  // -1..1
      const dy = (e.clientY - cy) / cy;  // -1..1
      shapes.forEach(el => {
        const s = parseFloat(el.dataset.speed || 0.2);
        const x = clamp(dx * 30 * s, -50, 50);
        const y = clamp(dy * 30 * s, -50, 50);
        el.style.transform = `translate3d(${x}px, ${y}px, 0)`;
      });
    };
    window.addEventListener('mousemove', onMove, { passive: true });
  }
})();

// =========================
// Banner do projeto: parallax "janela viva"
// =========================
(() => {
  if (prefersReduced) return;
  const banner = document.querySelector('.banner-bg');
  if (!banner) return;

  // movimento suave proporcional ao scroll
  const onScroll = () => {
    const y = window.scrollY || window.pageYOffset;
    // ajuste fino da velocidade (0.25 é bom ponto de partida)
    banner.style.transform = `translateY(${y * 0.25}px)`;
  };
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });
})();
