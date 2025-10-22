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

// ===== MENU SANDUÍCHE (abrir/fechar) =====
(() => {
  const btn = document.querySelector('.hamburger');
  const drawer = document.querySelector('#menu-drawer');
  const backdrop = document.querySelector('.menu-backdrop');
  if (!btn || !drawer || !backdrop) return;

  const open = () => {
    btn.setAttribute('aria-expanded', 'true');
    drawer.classList.add('open');
    drawer.setAttribute('aria-hidden', 'false');
    backdrop.hidden = false;
    document.body.style.overflow = 'hidden';
  };
  const close = () => {
    btn.setAttribute('aria-expanded', 'false');
    drawer.classList.remove('open');
    drawer.setAttribute('aria-hidden', 'true');
    backdrop.hidden = true;
    document.body.style.overflow = '';
  };

  btn.addEventListener('click', () => {
    const expanded = btn.getAttribute('aria-expanded') === 'true';
    expanded ? close() : open();
  });
  backdrop.addEventListener('click', close);
  drawer.querySelectorAll('a').forEach(a => a.addEventListener('click', close));
  window.addEventListener('keydown', (e) => { if (e.key === 'Escape') close(); });
})();

/* =========================
   i18n (PT/EN) — simples e robusto
   ========================= */

// 1) DICIONÁRIO
const I18N = {
  pt: {
    "meta.title": "Portfólio Ingrid Lima",

    // HERO
    "hero.title": "PORTFÓLIO",
    "hero.subtitle": "Ingrid Lima",

    // SOBRE
    "about.title": "SOBRE MIM",
    "about.hello": "oi,",
    "about.thisisme": "essa sou eu",
    "about.p1": 'Acredito que design, teatro e escrita são apenas <em>caminhos</em> diferentes pra contar histórias e que <em>toda boa história nasce de um olhar atento.</em>',
    "about.p2": 'Trabalho com criação visual e narrativa, buscando sempre traduzir <em>sensações em forma.</em>',
    "about.p3": "Sou formada em Design Gráfico e Teatro, com especialização em Branding e Marketing Digital.",
    "about.photoAlt": "Minha foto",

    // GALERIA
    "gallery.title": "Ingrid’s Gallery",
    "gallery.open.cartas": "Abrir projeto Cartas",
    "gallery.open.born": "Abrir projeto Born",
    "gallery.open.ordem": "Abrir projeto Ordem",
    "gallery.open.dmmb": "Abrir projeto Devaneios",
    "gallery.open.farma": "Abrir projeto Farmacêutico",
    "gallery.card.cartas": "Cartas para o Amanhã",
    "gallery.card.born": "Documentário Worikg",
    "gallery.card.ordem": "A Ordem e o Abismo",
    "gallery.card.dmmb": "Devaneios de Madrugada de uma Mente Bitolada",
    "gallery.card.farma": "Farmacêutico de Primeira Viagem",

    // CONTATO
    "contact.title": "Vamos criar?",
    "contact.text": 'Aberta a colaborações em <em>design, teatro e escrita</em>. Quer trocar uma ideia, enviar um briefing ou só dizer oi?',
    "contact.ctaEmail": "Me manda um oi ;)",
    "contact.ctaCv": "Baixar currículo",
    "contact.socialLabel": "Redes sociais",

    // FOOTER
    "footer.credit": "© 2025 Ingrid Lima — site projetado e desenvolvido por mim 🌘",

    // Navegação/A11y
    "nav.home": "Home",
    "nav.gallery": "Galeria",
    "nav.contact": "Contato",
    "nav.open": "Abrir menu",

    // Rótulos de botões de idioma
    "lang.pt": "PT",
    "lang.en": "EN",
  },

  en: {
    "meta.title": "Ingrid Lima — Portfolio",

    // HERO
    "hero.title": "PORTFOLIO",
    "hero.subtitle": "Ingrid Lima",

    // ABOUT
    "about.title": "ABOUT ME",
    "about.hello": "hi,",
    "about.thisisme": "this is me",
    "about.p1": 'I believe design, theatre and writing are just different <em>paths</em> to tell stories — and that <em>every good story is born from an attentive gaze.</em>',
    "about.p2": 'I work with visual and narrative creation, always seeking to translate <em>sensations into form.</em>',
    "about.p3": "Graduated in Graphic Design and Theatre, with specialization in Branding and Digital Marketing.",
    "about.photoAlt": "My photo",

    // GALLERY
    "gallery.title": "Ingrid’s Gallery",
    "gallery.open.cartas": "Open project Cartas",
    "gallery.open.born": "Open project Born",
    "gallery.open.ordem": "Open project Ordem",
    "gallery.open.dmmb": "Open project Devaneios",
    "gallery.open.farma": "Open project Farmacêutico",
    "gallery.card.cartas": "Letters for Tomorrow",
    "gallery.card.born": "Worikg Documentary",
    "gallery.card.ordem": "The Order and the Abyss",
    "gallery.card.dmmb": "Dawn Ramblings of a Narrow Mind",
    "gallery.card.farma": "First-Time Pharmacist",

    // CONTACT
    "contact.title": "Shall we create?",
    "contact.text": 'Open to collaborations in <em>design, theatre and writing</em>. Want to chat, send a brief or just say hi?',
    "contact.ctaEmail": "Say hello :)",
    "contact.ctaCv": "Download resume",
    "contact.socialLabel": "Social networks",

    // FOOTER
    "footer.credit": "© 2025 Ingrid Lima — site designed & developed by me 🌘",

    "nav.home": "Home",
    "nav.gallery": "Gallery",
    "nav.contact": "Contact",
    "nav.open": "Open menu",

    "lang.pt": "PT",
    "lang.en": "EN",
  }
};

// Se tiver CV em EN, coloque o caminho aqui
const CV_BY_LANG = {
  pt: "./assets/curriculo-Ingrid-Lima.pdf",
  en: "./assets/resume-Ingrid-Lima.pdf"  // troque se não existir
};

// 2) Função que aplica as traduções
function applyI18n(lang) {
  const dict = I18N[lang] || I18N.pt;

  // textos simples
  document.querySelectorAll("[data-i18n]").forEach(el => {
    const key = el.getAttribute("data-i18n");
    if (dict[key] !== undefined) el.textContent = dict[key];
  });

  // textos com HTML
  document.querySelectorAll("[data-i18n-html]").forEach(el => {
    const key = el.getAttribute("data-i18n-html");
    if (dict[key] !== undefined) el.innerHTML = dict[key];
  });

  // atributos (aria-label, title, placeholder…)
  document.querySelectorAll("[data-i18n-attr]").forEach(el => {
    const spec = el.getAttribute("data-i18n-attr"); // ex: aria-label:nav.open;title:nav.open
    spec.split(";").forEach(pair => {
      const [attr, key] = pair.split(":").map(s => s && s.trim());
      if (!attr || !key) return;
      if (dict[key] !== undefined) el.setAttribute(attr, dict[key]);
    });
  });

  // currículo por idioma
  const cv = document.getElementById("cv-link");
  if (cv && CV_BY_LANG[lang]) cv.setAttribute("href", CV_BY_LANG[lang]);

  // <html lang="">
  document.documentElement.setAttribute("lang", lang);
}

// 3) Inicialização + botões
(function initI18n(){
  const buttons = Array.from(document.querySelectorAll(".lang-btn"));
  if (!buttons.length) return;

  // garante data-lang
  buttons.forEach(b => {
    if (!b.dataset.lang) b.dataset.lang = b.textContent.trim().toLowerCase();
  });

  // idioma salvo/detectado
  let lang = localStorage.getItem("idioma");
  if (!lang) {
    lang = navigator.language && navigator.language.startsWith("en") ? "en" : "pt";
    localStorage.setItem("idioma", lang);
  }

  const markActive = (l) => buttons.forEach(b => b.classList.toggle("active", b.dataset.lang === l));

  // aplica na carga
  markActive(lang);
  applyI18n(lang);

  // clique
  buttons.forEach(btn => {
    btn.addEventListener("click", () => {
      const next = btn.dataset.lang;
      if (!next) return;
      localStorage.setItem("idioma", next);
      markActive(next);
      applyI18n(next);
    });
  });

  // util opcional p/ debugar no console
  window.i18nDebug = () => ({ lang: localStorage.getItem("idioma") });
})();
