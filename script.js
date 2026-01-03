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
      b.classList.toggle('active', b.dataset.lang === idiomaSalvo);
    });
  }

  botoes.forEach(botao => {
    botao.addEventListener('click', () => {
      botoes.forEach(b => b.classList.remove('active'));
      botao.classList.add('active');
      localStorage.setItem('idioma', botao.dataset.lang);
      // troca de textos acontece pelo i18n abaixo
    });
  });
})();

// =========================
/* Reveal com IntersectionObserver */
// =========================
(() => {
  const revealEls = $all('.reveal');
  if (!revealEls.length) return;

  if (prefersReduced) {
    revealEls.forEach(el => el.classList.add('in'));
    return;
  }

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

  const hasScroll = () => document.documentElement.scrollHeight > innerHeight * 1.2;
  if (!hasScroll()) {
    const onMove = (e) => {
      const cx = innerWidth / 2, cy = innerHeight / 2;
      const dx = (e.clientX - cx) / cx;
      const dy = (e.clientY - cy) / cy;
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
// Banner do projeto
// =========================
(() => {
  if (prefersReduced) return;
  const banner = document.querySelector('.banner-bg');
  if (!banner) return;
  const onScroll = () => {
    const y = window.scrollY || window.pageYOffset;
    banner.style.transform = `translateY(${y * 0.25}px)`;
  };
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });
})();

// ===== MENU SANDUÍCHE =====
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
   i18n (PT/EN)
   ========================= */

// 1) DICIONÁRIO
const I18N = {
  pt: {
    "meta.title": "Portfólio Ingrid Lima",

    // HERO
    "hero.title": "PORTFÓLIO",
    "hero.subtitle": "Ingrid Lima",
    "nav.sections": "Seções",
    "hero.nav.skills": "Skills",
    "hero.nav.gallery": "Galeria",
    "hero.nav.contact": "Contato",

    // SOBRE
    "about.title": "SOBRE MIM",
    "about.hello": "oi,",
    "about.thisisme": "essa sou eu",
    "about.p1": 'Acredito que design, teatro e escrita são apenas <em>caminhos</em> diferentes pra contar histórias e que <em>toda boa história nasce de um olhar atento.</em>',
    "about.p2": 'Trabalho com criação visual e narrativa, buscando sempre traduzir <em>sensações em forma.</em>',
    "about.p3": "Sou formada em Design Gráfico e Teatro, com especialização em Branding e Marketing Digital.",
    "about.photoAlt": "Minha foto",

    // SKILLS
    "skills.title": "Skills",
    "skills.toolsAlt": "Ferramentas",
    "skills.favTitle": "Projetos favoritos",
    "skills.fav.criacao": "Criação",
    "skills.fav.escrita": "Escrita",
    "skills.fav.branding": "Branding",
    "skills.fav.eventos": "Eventos",
    "skills.fav.uiux": "UI/UX",
    "skills.n1": "Em resumo",
    "skills.n2": 'Trabalho com o que me move: estética, emoção e histórias. No design encontro presença, ritmo e intenção.',

    // GALERIA
    // GALERIA
"gallery.title": "Ingrid's Gallery",
"gallery.open.dmmb": "Abrir projeto Devaneios",
"gallery.open.worik": "Abrir projeto Worikg",
"gallery.open.pastas": "Abrir projeto Pastas saborizantes",
"gallery.card.dmmb": "Diagramação | Devaneios de Madrugada",
"gallery.card.worik": "Branding | Documentário Worikg",
"gallery.card.pastas": "Embalagens | Pastas saborizantes",
"gallery.card.life": "Branding em Aplicação | Life",

"gallery.filter.all": "Todos",
"gallery.filter.branding": "Branding",
"gallery.filter.print": "Impressos",
"gallery.filter.web": "Web",
"gallery.filtersLabel": "Filtrar projetos da galeria",


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
    "nav.backTop": "Voltar ao topo",

    // Rótulos de botões de idioma
    "lang.pt": "PT",
    "lang.en": "EN",
  },

  en: {
    "meta.title": "Ingrid Lima — Portfolio",

    // HERO
    "hero.title": "PORTFOLIO",
    "hero.subtitle": "Ingrid Lima",
    "nav.sections": "Sections",
    "hero.nav.skills": "Skills",
    "hero.nav.gallery": "Gallery",
    "hero.nav.contact": "Contact",

    // ABOUT
    "about.title": "ABOUT ME",
    "about.hello": "hi,",
    "about.thisisme": "this is me",
    "about.p1": 'I believe design, theatre and writing are just different <em>paths</em> to tell stories — and that <em>every good story is born from an attentive gaze.</em>',
    "about.p2": 'I work with visual and narrative creation, always seeking to translate <em>sensations into form.</em>',
    "about.p3": "Graduated in Graphic Design and Theatre, with specialization in Branding and Digital Marketing.",
    "about.photoAlt": "My photo",

    // SKILLS
    "skills.title": "Skills",
    "skills.toolsAlt": "Tools",
    "skills.favTitle": "Favorite projects",
    "skills.fav.criacao": "Creation",
    "skills.fav.escrita": "Writing",
    "skills.fav.branding": "Branding",
    "skills.fav.eventos": "Events",
    "skills.fav.uiux": "UI/UX",
    "skills.n1": "In short",
    "skills.n2": "I work with what moves me: aesthetics, emotion, and stories. In design I find presence, rhythm, and intention.",

    // GALLERY
"gallery.title": "Ingrid’s Gallery",
"gallery.open.dmmb": "Open project Devaneios",
"gallery.open.worik": "Open project Worikg",
"gallery.open.pastas": "Open project Flavoring Pastes",
"gallery.card.dmmb": "Typesetting | Devaneios de Madrugada",
"gallery.card.worik": "Branding | Worikg Documentary",
"gallery.card.pastas": "Packaging | Flavoring Pastes",
"gallery.card.life": "Social Media | Life",

"gallery.filter.all": "All",
"gallery.filter.branding": "Branding",
"gallery.filter.print": "Print",
"gallery.filter.web": "Web",
"gallery.filtersLabel": "Filter gallery projects",
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
    "nav.backTop": "Back to top",

    "lang.pt": "PT",
    "lang.en": "EN",
  }
};

// Dentro de I18N.pt  (adicione estas chaves)
Object.assign(I18N.pt, {
  // comuns para cases
  "case.common.about": "SOBRE",
  "case.common.briefing": "BRIEFING",
  "case.common.dev": "DESENVOLVIMENTO",
  "case.common.mood": "MOOD BOARD",
  "case.common.mock": "MOCKUP",
  "case.common.result": "RESULTADO",

  // DMMB
  "case.dmmb.meta": "Devaneios de Madrugada",
  "case.dmmb.h1": "Diagramação",
  "case.dmmb.about": "Devaneios de Madrugada de uma Mente Bitolada é uma coletânea de poesias que atravessa emoções sutis e intensas, explorando a delicadeza dos sentimentos humanos. O livro propõe uma leitura sensorial, onde palavra, silêncio e espaço visual se entrelaçam em uma experiência estética e introspectiva.",
  "case.dmmb.briefing": "O projeto nasceu do desejo de registrar pensamentos e sensações noturnas em formato poético, transformando experiências pessoais em linguagem visual e literária. O desafio foi criar uma identidade que equilibrasse emoção e racionalidade, traduzindo o tom íntimo das poesias em um design que respirasse delicadeza e silêncio.",
  "case.dmmb.dev": "O processo envolveu a escolha de uma tipografia fluida e contemporânea e um grid minimalista que privilegia o espaço em branco como elemento expressivo. A paleta monocromática reforça o caráter introspectivo, enquanto detalhes sutis criam um ritmo visual que acompanha o respiro poético de cada página.",
  "case.dmmb.mooddesc": "Durante o processo, percebi como o espaço negativo e o silêncio visual podem ser tão expressivos quanto a própria palavra. O design do livro respira com o texto — cria pausas, ritmo e intimidade.",
  "case.dmmb.moodAlt": "Moodboard — referências e atmosfera",
  "case.dmmb.mockAlt": "Mockup — exploração de capa",
  "case.dmmb.mockdesc": "O mockup evidencia o caráter sensorial do projeto, traduzindo visualmente o convite à pausa e à contemplação que o livro propõe.",
  "case.dmmb.resultAlt": "Resultado final — fotografia",

  // PASTAS (embalagens)
  "case.pastas.meta": "Linha de Embalagens",
  "case.pastas.h1": "Embalagens",
  "case.pastas.about": "A marca estava lançando um novo produto e precisava de embalagens que transmitissem a marca.",
  "case.pastas.briefing": "Pastas saborizantes para sorveteiros: embalagens que se destacassem e mostrassem qualidade ao mesmo tempo.",
  "case.pastas.dev": "Criação de uma estrutura modular de rótulos (logotipo fixo, faixa de sabor variável), paleta cromática baseada em matizes naturais e testes de legibilidade em impressão e redução.",
  "case.pastas.mockAlt": "Mockup — visual das embalagens",
  "case.pastas.mockdesc": "O mockup explora iluminação suave e foco no acabamento para comunicar qualidade e apetite visual.",
  "case.pastas.lineTitle": "Linha de pastas saborizantes",
  "case.pastas.linedesc": "Sistema de embalagens com unidade de marca e variação de sabores por cor, mantendo consistência tipográfica e destaque para a categoria.",
  "case.pastas.lineCta": "Confira a linha completa no site",
  "case.pastas.lineAlt": "Linha de pastas saborizantes VaBene",

  // WORIKG
  "case.worik.meta": "Branding | Worikg",
  "case.worik.h1": "Branding",
  "case.worik.about": "O Worikg: Museu que Anda é um projeto de identidade visual desenvolvido a partir da escuta e da ancestralidade dos povos Kaingang e Guarani Nhandewa… A marca nasce do território e retorna a ele.",
  "case.worik.briefing": "Criar uma identidade visual que comunicasse a força ancestral e a vitalidade do Museu Worikg Sol Nascente, equilibrando organicidade e clareza institucional.",
  "case.worik.dev": "Partimos da tipografia Frecle Face, redesenhada manualmente. Da letra “O” nasceu o símbolo do Sol Nascente, com formas abertas e assimétricas que representam raios, caminho e ligação com a terra.",
  "case.worik.mooddesc": "Moodboard nascido da vivência no território — escuta, gestos, objetos e cores do cotidiano do museu. Natureza, oralidade e resistência entrelaçadas.",
  "case.worik.moodAlt": "Moodboard — referências e atmosfera Worikg",
  "case.worik.apps": "APLICAÇÕES",
  "case.worik.mockAlt": "Mockup — aplicações da identidade",
  "case.worik.mockdesc": "O mockup como extensão da identidade: luz de amanhecer, fundo terroso, equilíbrio entre textura e vazio, colocando a memória em movimento.",
  "case.worik.manualTitle": "Manual de Marca",
  "case.worik.manualDesc": "Baixe o manual de marca do Museu Worikg Sol e conheça a identidade visual completa do projeto.",
  "case.worik.manualCta": "Baixar manual",
  "case.worik.docTitle": "Documentário",
  "case.worik.docDesc": "Assista ao mini-documentário sobre o Museu Worikg Sol e sua história viva no território indígena.",
  "case.worik.docCta": "Assistir no YouTube"
});

// Dentro de I18N.en  (adicione estas chaves)
Object.assign(I18N.en, {
  // common
  "case.common.about": "ABOUT",
  "case.common.briefing": "BRIEFING",
  "case.common.dev": "DEVELOPMENT",
  "case.common.mood": "MOOD BOARD",
  "case.common.mock": "MOCKUP",
  "case.common.result": "RESULT",

  // DMMB
  "case.dmmb.meta": "Dawn Ramblings",
  "case.dmmb.h1": "Typesetting",
  "case.dmmb.about": "“Devaneios de Madrugada de uma Mente Bitolada” is a poetry collection that traverses subtle and intense emotions… A sensorial reading where word, silence and white space intertwine.",
  "case.dmmb.briefing": "Born from the desire to record late-night thoughts and sensations in poetic form. The challenge was to balance emotion and clarity, translating intimacy into a design that breathes.",
  "case.dmmb.dev": "We chose a fluid, contemporary typeface and a minimalist grid that treats white space as an expressive element. A monochrome palette reinforces introspection while subtle details set the rhythm.",
  "case.dmmb.mooddesc": "Negative space and visual silence can be as expressive as words. The layout breathes with the text — creating pauses, rhythm and intimacy.",
  "case.dmmb.moodAlt": "Mood board — references and atmosphere",
  "case.dmmb.mockAlt": "Mockup — cover exploration",
  "case.dmmb.mockdesc": "The mockup highlights the project’s sensorial character, visually translating the invitation to pause and contemplate.",
  "case.dmmb.resultAlt": "Final result — photography",

  // PASTAS
  "case.pastas.meta": "Packaging Line",
  "case.pastas.h1": "Packaging",
  "case.pastas.about": "The brand was launching a new product and needed packaging that expressed its identity.",
  "case.pastas.briefing": "Flavoring pastes for ice-cream makers: packaging that stands out while communicating quality.",
  "case.pastas.dev": "Modular label system (fixed logotype, variable flavor band), natural-hue palette, and legibility tests for print and reduction.",
  "case.pastas.mockAlt": "Mockup — packaging visuals",
  "case.pastas.mockdesc": "The mockup uses gentle lighting and finish emphasis to communicate quality and appetite appeal.",
  "case.pastas.lineTitle": "Flavoring paste line",
  "case.pastas.linedesc": "A packaging system with brand unity and flavor variation by color, consistent typography and strong category cueing.",
  "case.pastas.lineCta": "See the full line on the website",
  "case.pastas.lineAlt": "VaBene flavoring paste line",

  // WORIKG
  "case.worik.meta": "Branding | Worikg",
  "case.worik.h1": "Branding",
  "case.worik.about": "Worikg: The Museum that Walks is a visual identity project born from listening and from Kaingang and Guarani Nhandewa ancestry… A brand that comes from the land and returns to it.",
  "case.worik.briefing": "Create a visual identity that communicates ancestral strength and vitality, balancing organic tradition with institutional clarity.",
  "case.worik.dev": "We started from the Frecle Face type, redrawn by hand. From the letter “O”, the Rising Sun symbol emerged — open, asymmetrical shapes for rays, pathway and bond with the land.",
  "case.worik.mooddesc": "A mood board born from field experience — listening, gestures, objects and colors of the museum’s everyday life. Nature, orality and resistance intertwined.",
  "case.worik.moodAlt": "Mood board — Worikg references and atmosphere",
  "case.worik.apps": "APPLICATIONS",
  "case.worik.mockAlt": "Mockup — identity applications",
  "case.worik.mockdesc": "The mockup extends the identity: dawn light, earthy background, balanced texture/void — placing memory in movement.",
  "case.worik.manualTitle": "Brand Guidelines",
  "case.worik.manualDesc": "Download the Worikg brand manual and explore the full visual identity.",
  "case.worik.manualCta": "Download manual",
  "case.worik.docTitle": "Documentary",
  "case.worik.docDesc": "Watch the mini-documentary about Worikg and its living history in the indigenous territory.",
  "case.worik.docCta": "Watch on YouTube"
});


// Se tiver CV em EN, coloque o caminho aqui
const CV_BY_LANG = {
  pt: "./assets/curriculo-Ingrid-Lima.pdf",
  en: "./assets/resume-Ingrid-Lima.pdf"  // ajuste o caminho se necessário
};

// 2) Aplicar traduções
function applyI18n(lang) {
  const dict = I18N[lang] || I18N.pt;

  document.querySelectorAll("[data-i18n]").forEach(el => {
    const key = el.getAttribute("data-i18n");
    if (dict[key] !== undefined) el.textContent = dict[key];
  });

  document.querySelectorAll("[data-i18n-html]").forEach(el => {
    const key = el.getAttribute("data-i18n-html");
    if (dict[key] !== undefined) el.innerHTML = dict[key];
  });

  document.querySelectorAll("[data-i18n-attr]").forEach(el => {
    const spec = el.getAttribute("data-i18n-attr");
    spec.split(";").forEach(pair => {
      const [attr, key] = pair.split(":").map(s => s && s.trim());
      if (!attr || !key) return;
      if (dict[key] !== undefined) el.setAttribute(attr, dict[key]);
    });
  });

  const cv = document.getElementById("cv-link");
  if (cv && CV_BY_LANG[lang]) cv.setAttribute("href", CV_BY_LANG[lang]);

  document.documentElement.setAttribute("lang", lang);
}

// 3) Inicialização + botões
(function initI18n(){
  const buttons = Array.from(document.querySelectorAll(".lang-btn"));
  if (!buttons.length) return;

  buttons.forEach(b => {
    if (!b.dataset.lang) b.dataset.lang = b.textContent.trim().toLowerCase();
  });

  let lang = localStorage.getItem("idioma");
  if (!lang) {
    lang = navigator.language && navigator.language.startsWith("en") ? "en" : "pt";
    localStorage.setItem("idioma", lang);
  }

  const markActive = (l) => buttons.forEach(b => b.classList.toggle("active", b.dataset.lang === l));

  markActive(lang);
  applyI18n(lang);

  buttons.forEach(btn => {
    btn.addEventListener("click", () => {
      const next = btn.dataset.lang;
      if (!next) return;
      localStorage.setItem("idioma", next);
      markActive(next);
      applyI18n(next);
    });
  });

  window.i18nDebug = () => ({ lang: localStorage.getItem("idioma") });
})();

// ===== Botão de progresso + voltar ao topo =====
(() => {
  const btn = document.getElementById('scrollTop');
  if (!btn) return;

  const bar = btn.querySelector('.bar');
  const radius = 18;
  const circumference = 2 * Math.PI * radius;
  bar.style.strokeDasharray = `${circumference}`;
  bar.style.strokeDashoffset = `${circumference}`;

  const thresholdShow = 80;
  const thresholdReady = 0.98;
  const update = () => {
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const maxScroll = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
    const progress = Math.min(Math.max(scrollTop / maxScroll, 0), 1);

    if (scrollTop > thresholdShow || maxScroll < 400) {
      btn.classList.add('show');
    } else {
      btn.classList.remove('show');
    }

    const offset = circumference * (1 - progress);
    bar.style.strokeDashoffset = `${offset}`;

    btn.classList.toggle('ready', progress >= thresholdReady);
  };

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  update();
  window.addEventListener('scroll', update, { passive: true });
  window.addEventListener('resize', update);
})();

// BOTÃO "VOLTAR AO TOPO" (fallback)
(() => {
  const btn = document.getElementById('backToTop');
  if (!btn) return;

  window.addEventListener('scroll', () => {
    const scrolled = window.scrollY || document.documentElement.scrollTop;
    btn.classList.toggle('visible', scrolled > 400);
  });

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
})();

// ANIMAÇÃO DO SKILLS
document.querySelectorAll('.circle').forEach(circle => {
  const percent = circle.dataset.percent;
  circle.style.setProperty('--percent', percent);
});

// =========================
// Filtro da galeria + animação
// =========================
(() => {
  const filterButtons = $all('.gallery-filter');
  const cards = $all('.gallery .card');
  if (!filterButtons.length || !cards.length) return;

  const ANIM_DURATION = 280;

  const setVisibleImmediate = (card, visible) => {
    card.dataset.visible = visible ? 'true' : 'false';
    card.style.display = visible ? '' : 'none';
    card.setAttribute('aria-hidden', visible ? 'false' : 'true');
    card.classList.remove('filter-hiding', 'filter-show', 'filter-show-active');
  };

  const showAnimated = (card) => {
    if (prefersReduced) {
      setVisibleImmediate(card, true);
      return;
    }

    if (card.dataset.visible === 'true') return;

    card.style.display = '';
    card.setAttribute('aria-hidden', 'false');
    card.dataset.visible = 'true';

    card.classList.remove('filter-hiding');
    card.classList.add('filter-show');

    // força reflow pro transition pegar
    void card.offsetWidth;
    card.classList.add('filter-show-active');

    setTimeout(() => {
      card.classList.remove('filter-show', 'filter-show-active');
    }, ANIM_DURATION + 50);
  };

  const hideAnimated = (card) => {
    if (prefersReduced) {
      setVisibleImmediate(card, false);
      return;
    }

    if (card.dataset.visible !== 'true' && card.style.display === 'none') return;

    card.dataset.visible = 'false';
    card.classList.remove('filter-show', 'filter-show-active');
    card.classList.add('filter-hiding');
    card.setAttribute('aria-hidden', 'true');

    setTimeout(() => {
      if (card.dataset.visible === 'false') {
        card.style.display = 'none';
      }
      card.classList.remove('filter-hiding');
    }, ANIM_DURATION);
  };

  const applyFilter = (value, animate) => {
    const isAll = value === 'all';

    cards.forEach(card => {
      const raw = card.dataset.category || "";
      const categories = raw.split(/\s+/).filter(Boolean);
      const shouldShow = isAll || categories.includes(value);

      if (!animate) {
        setVisibleImmediate(card, shouldShow);
      } else if (shouldShow) {
        showAnimated(card);
      } else {
        hideAnimated(card);
      }
    });
  };

  // inicial: tudo visível sem animação
  applyFilter('all', false);

  filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      if (btn.classList.contains('active')) return;

      filterButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const value = btn.dataset.filter || 'all';
      applyFilter(value, true);
    });
  });
})();

document.querySelectorAll(".ig-preview").forEach((block) => {
  const modal = block.querySelector(".ig-modal");
  const full = block.querySelector(".ig-full");
  const close = block.querySelector(".ig-close");

  block.querySelectorAll(".ig-item").forEach((btn) => {
    btn.addEventListener("click", () => {
      const src = btn.getAttribute("data-full");
      full.src = src;
      full.alt = btn.querySelector("img")?.alt || "";
      modal.classList.add("is-open");
      modal.setAttribute("aria-hidden", "false");
    });
  });

  const hide = () => {
    modal.classList.remove("is-open");
    modal.setAttribute("aria-hidden", "true");
    full.src = "";
  };

  close.addEventListener("click", hide);
  modal.addEventListener("click", (e) => { if (e.target === modal) hide(); });
  document.addEventListener("keydown", (e) => { if (e.key === "Escape") hide(); });
});

(function () {
  const carousels = document.querySelectorAll('[data-carousel="life-inst"]');

  carousels.forEach((viewport) => {
    const root = viewport.closest(".inst-carousel");
    const slides = Array.from(viewport.querySelectorAll(".inst-slide"));
    const prevBtn = viewport.querySelector(".inst-arrow.prev");
    const nextBtn = viewport.querySelector(".inst-arrow.next");
    const dotsWrap = root.querySelector(".inst-dots");
    const dots = dotsWrap ? Array.from(dotsWrap.querySelectorAll(".dot")) : [];
    const labelEl = root.querySelector(".inst-caption-label");
    const textEl = root.querySelector(".inst-caption-text");

    const captions = [
      { label: "Brindes", text: "Aplicação da identidade em itens de relacionamento e presença de marca no cotidiano." },
      { label: "Ambiente", text: "Aplicação da marca em suportes físicos, reforçando consistência em espaços e atendimento." },
      { label: "Promocional", text: "Materiais sazonais e promocionais mantendo linguagem orgânica e reconhecimento imediato." },
      { label: "Institucional", text: "Peças institucionais e apoio comercial com clareza e unidade visual." },
    ];

    let index = slides.findIndex(s => s.classList.contains("is-active"));
    if (index < 0) index = 0;

    const setActive = (i) => {
      slides.forEach((s, idx) => s.classList.toggle("is-active", idx === i));
      dots.forEach((d, idx) => d.classList.toggle("is-active", idx === i));

      const cap = captions[i] || captions[0];
      if (labelEl) labelEl.textContent = cap.label;
      if (textEl) textEl.textContent = cap.text;

      index = i;
    };

    const next = () => setActive((index + 1) % slides.length);
    const prev = () => setActive((index - 1 + slides.length) % slides.length);

    prevBtn?.addEventListener("click", prev);
    nextBtn?.addEventListener("click", next);

    dots.forEach((dot, i) => dot.addEventListener("click", () => setActive(i)));

    // Autoplay suave
    let timer = null;
    const start = () => {
      stop();
      timer = setInterval(next, 4500);
    };
    const stop = () => {
      if (timer) clearInterval(timer);
      timer = null;
    };

    root.addEventListener("mouseenter", stop);
    root.addEventListener("mouseleave", start);

    // inicializa
    setActive(index);
    start();
  });
})();

