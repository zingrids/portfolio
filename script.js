// =========================
// Utilidades
// =========================
const $all = (sel, root = document) => Array.from(root.querySelectorAll(sel));
const clamp = (n, min, max) => Math.min(Math.max(n, min), max);
const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// =========================
// Idioma (PT/EN/ES)
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
   i18n (PT/EN/ES)
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
    "lang.es": "ES"
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
    "lang.es": "ES"
  },

  es: {
    "meta.title": "Ingrid Lima — Portafolio",

    // HERO
    "hero.title": "PORTAFOLIO",
    "hero.subtitle": "Ingrid Lima",
    "nav.sections": "Secciones",
    "hero.nav.skills": "Skills",
    "hero.nav.gallery": "Galería",
    "hero.nav.contact": "Contacto",

    // ABOUT
    "about.title": "SOBRE MÍ",
    "about.hello": "hola,",
    "about.thisisme": "esta soy yo",
    "about.p1": 'Creo que el diseño, el teatro y la escritura son solo <em>caminos</em> diferentes para contar historias y que <em>toda buena historia nace de una mirada atenta.</em>',
    "about.p2": 'Trabajo con creación visual y narrativa, buscando siempre traducir <em>sensaciones en forma.</em>',
    "about.p3": "Graduada en Diseño Gráfico y Teatro, con especialización en Branding y Marketing Digital.",
    "about.photoAlt": "Mi foto",

    // SKILLS
    "skills.title": "Habilidades",
    "skills.toolsAlt": "Herramientas",
    "skills.favTitle": "Proyectos favoritos",
    "skills.fav.criacao": "Creación",
    "skills.fav.escrita": "Escritura",
    "skills.fav.branding": "Branding",
    "skills.fav.eventos": "Eventos",
    "skills.fav.uiux": "UI/UX",
    "skills.n1": "En resumen",
    "skills.n2": "Trabajo con lo que me mueve: estética, emoción e historias. En el diseño encuentro presencia, ritmo e intención.",

    // GALLERY
    "gallery.title": "Galería de Ingrid",
    "gallery.open.dmmb": "Abrir proyecto Devaneios",
    "gallery.open.worik": "Abrir proyecto Worikg",
    "gallery.open.pastas": "Abrir proyecto Pastas Saborizantes",
    "gallery.card.dmmb": "Diagramación | Devaneios de Madrugada",
    "gallery.card.worik": "Branding | Documental Worikg",
    "gallery.card.pastas": "Embalajes | Pastas Saborizantes",
    "gallery.card.life": "Branding Aplicado | Life",

    "gallery.filter.all": "Todos",
    "gallery.filter.branding": "Branding",
    "gallery.filter.print": "Impresos",
    "gallery.filter.web": "Web",
    "gallery.filtersLabel": "Filtrar proyectos",

    // CONTACT
    "contact.title": "¿Vamos a crear?",
    "contact.text": 'Abierta a colaboraciones en <em>diseño, teatro y escritura</em>. ¿Quieres intercambiar ideas, enviar un briefing o solo decir hola?',
    "contact.ctaEmail": "Mándame un hola ;)",
    "contact.ctaCv": "Descargar currículum",
    "contact.socialLabel": "Redes sociales",

    // FOOTER
    "footer.credit": "© 2025 Ingrid Lima — sitio diseñado y desarrollado por mí 🌘",

    "nav.home": "Inicio",
    "nav.gallery": "Galería",
    "nav.contact": "Contacto",
    "nav.open": "Abrir menú",
    "nav.backTop": "Volver arriba",

    "lang.pt": "PT",
    "lang.en": "EN",
    "lang.es": "ES",

    // CASES common parts
    "case.common.about": "SOBRE",
    "case.common.briefing": "BRIEFING",
    "case.common.dev": "DESARROLLO",
    "case.common.mood": "MOOD BOARD",
    "case.common.mock": "MOCKUP",
    "case.common.result": "RESULTADO",

    // DMMB
    "case.dmmb.meta": "Devaneios de Madrugada",
    "case.dmmb.h1": "Diagramación",
    "case.dmmb.about": "“Devaneios de Madrugada de uma Mente Bitolada” es una colección de poesías que atraviesa emociones sutiles e intensas... Una lectura sensorial donde palabra, silencio y espacio visual se entrelazan.",
    "case.dmmb.briefing": "Nació del deseo de registrar pensamientos y sensaciones nocturnas. El desafío fue equilibrar emoción y racionalidad, traduciendo la intimidad de las poesías en un diseño que respire.",
    "case.dmmb.dev": "Elegimos una tipografía fluida y contemporánea y una cuadrícula minimalista que privilegia el espacio en blanco. La paleta monocromática refuerza el carácter introspectivo, mientras detalles sutiles crean ritmo.",
    "case.dmmb.mooddesc": "El espacio negativo y el silencio visual pueden ser tan expresivos como la propia palabra. El diseño respira con el texto — crea pausas, ritmo e intimidad.",
    "case.dmmb.moodAlt": "Moodboard — referencias y atmósfera",
    "case.dmmb.mockAlt": "Mockup — exploración de portada",
    "case.dmmb.mockdesc": "El mockup evidencia el carácter sensorial del proyecto, traduciendo visualmente la invitación a la pausa y la contemplación.",
    "case.dmmb.resultAlt": "Resultado final — fotografía",

    // PASTAS
    "case.pastas.meta": "Línea de Embalajes",
    "case.pastas.h1": "Embalajes",
    "case.pastas.about": "La marca estaba lanzando un nuevo producto y necesitaba embalajes que transmitieran su identidad.",
    "case.pastas.briefing": "Pastas saborizantes para heladeros: embalajes que se destacaran y mostraran calidad al mismo tiempo.",
    "case.pastas.dev": "Creación de una estructura modular de etiquetas (logotipo fijo, franja de sabor variable), paleta cromática basada en matices naturales y pruebas de legibilidad.",
    "case.pastas.mockAlt": "Mockup — visual de los embalajes",
    "case.pastas.mockdesc": "El mockup explora iluminación suave y foco en el acabado para comunicar calidad y apetito visual.",
    "case.pastas.lineTitle": "Línea de pastas saborizantes",
    "case.pastas.linedesc": "Sistema de embalajes con unidad de marca y variación de sabores por color, manteniendo consistencia tipográfica y destaque para la categoría.",
    "case.pastas.lineCta": "Mira la línea completa en el sitio",
    "case.pastas.lineAlt": "Línea de pastas saborizantes VaBene",

    // WORIKG
    "case.worik.meta": "Branding | Worikg",
    "case.worik.h1": "Branding",
    "case.worik.about": "Worikg: Museo que Camina es un proyecto de identidad visual desarrollado a partir de la escucha de la ancestralidad Kaingang y Guarani Nhandewa... La marca nace del territorio y regresa a él.",
    "case.worik.briefing": "Crear una identidad visual que comunicara la fuerza ancestral y la vitalidad del Museo Worikg Sol Naciente, equilibrando organicidad y claridad institucional.",
    "case.worik.dev": "Partimos de la tipografía Frecle Face, rediseñada manualmente. De la letra “O” nació el símbolo del Sol Naciente, con formas abiertas y asimétricas que representan rayos, camino y vínculo con la tierra.",
    "case.worik.mooddesc": "Moodboard nacido de la vivencia en el territorio — escucha, gestos, objetos y colores de lo cotidiano. Naturaleza, oralidad y resistencia entrelazadas.",
    "case.worik.moodAlt": "Moodboard — referencias Worikg",
    "case.worik.apps": "APLICACIONES",
    "case.worik.mockAlt": "Mockup — aplicaciones de la identidad",
    "case.worik.mockdesc": "El mockup como extensión de la identidad: luz de amanecer, fondo terroso, equilibrio entre textura y vacío.",
    "case.worik.manualTitle": "Manual de Marca",
    "case.worik.manualDesc": "Descarga el manual de marca del Museo Worikg Sol y conoce la identidad visual completa.",
    "case.worik.manualCta": "Descargar manual",
    "case.worik.docTitle": "Documental",
    "case.worik.docDesc": "Mira el mini-documental sobre el Museo Worikg Sol y su historia viva en el territorio indígena.",
    "case.worik.docCta": "Ver en YouTube",

    // WEST
    "case.west.meta": "West | Key Visual",
    "case.west.h1": "Key Visual",
    "case.west.about": "Este proyecto consiste en el desarrollo de un Key Visual de campaña para West Fibra, explorando elementos gráficos fuertes, contraste cromático y un lenguaje contemporáneo de publicidad.",
    "case.west.about2": "El KV fue pensado para funcionar como pieza central de campaña, garantizando versatilidad en medios digitales y materiales gráficos.",
    "case.west.challenge": "DESAFÍO",
    "case.west.challengeDesc": "Crear una identidad visual que:",
    "case.west.challengeList.1": "Se destacara en entornos digitales saturados",
    "case.west.challengeList.2": "Comunicara tecnología y proximidad al mismo tiempo",
    "case.west.challengeList.3": "Funcionara como base para múltiples aplicaciones",
    "case.west.challengeEnd": "Todo eso manteniendo una estética actual y fácilmente reconocible.",
    "case.west.role": "ACTUACIÓN",
    "case.west.roleDesc": "Mi actuación involucró el desarrollo del branding en piezas digitales e impresas, materiales institucionales y planificación visual para redes sociales.",
    "case.west.kvTitle": "KEY VISUAL",
    "case.west.kvAlt": "Key Visual de la campaña West Fibra",
    "case.west.appTitle": "APLICACIÓN",
    "case.west.appDesc": "Adaptación del KV para formato vertical, con jerarquía tipográfica optimizada para lectura rápida e impacto en Stories.",
    "case.west.appAlt": "Aplicación en story de Instagram"
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
  "case.worik.briefing": "Criar uma identidade visual que comunicasse a força ancestral e a vitalidade do Museu Worikg Sol Nascente, equilibrando organicidad e clareza institucional.",
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
  "case.worik.docCta": "Assistir no YouTube",

  // WEST
  "case.west.meta": "West | Key Visual",
  "case.west.h1": "Key Visual",
  "case.west.about": "Este projeto consiste no desenvolvimento de um Key Visual de campanha para a West Fibra, explorando elementos gráficos fortes, contraste cromático e uma linguagem contemporânea voltada para comunicação publicitária.",
  "case.west.about2": "O KV foi pensado para funcionar como peça central de campanha, garantindo versatilidade de aplicação em mídia digital e materiais gráficos, mantendo consistência visual e leitura clara em diferentes formatos.",
  "case.west.challenge": "DESAFIO",
  "case.west.challengeDesc": "Criar uma identidade visual que:",
  "case.west.challengeList.1": "Se destacasse em ambientes digitais saturados",
  "case.west.challengeList.2": "Comunicasse tecnologia e proximidade ao mesmo tempo",
  "case.west.challengeList.3": "Funcionasse como base para múltiplas aplicações de campanha",
  "case.west.challengeEnd": "Tudo isso mantendo uma estética atual e facilmente reconhecível.",
  "case.west.role": "ATUAÇÃO",
  "case.west.roleDesc": "Minha atuação envolveu o desdobramento do branding existente em peças digitais e impressas, materiais institucionais e de apoio comercial, além do planejamento visual para redes sociais.",
  "case.west.kvTitle": "KEY VISUAL",
  "case.west.kvAlt": "Key Visual da campanha West Fibra",
  "case.west.appTitle": "APLICAÇÃO",
  "case.west.appDesc": "Adaptação do KV para o formato vertical, com hierarquia tipográfica otimizada para leitura rápida e impacto em Stories, mantendo contraste e consistência visual.",
  "case.west.appAlt": "Aplicação do Key Visual em story do Instagram"
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
  "case.worik.docCta": "Watch on YouTube",

  // WEST
  "case.west.meta": "West | Key Visual",
  "case.west.h1": "Key Visual",
  "case.west.about": "This project consists of developing a Key Visual for a West Fibra campaign, exploring strong graphic elements, chromatic contrast, and contemporary advertising language.",
  "case.west.about2": "The KV was designed as the campaign centerpiece, ensuring versatility across digital media and print materials while maintaining visual consistency and clarity.",
  "case.west.challenge": "CHALLENGE",
  "case.west.challengeDesc": "Create a visual identity that:",
  "case.west.challengeList.1": "Stands out in saturated digital environments",
  "case.west.challengeList.2": "Communicates technology and proximity simultaneously",
  "case.west.challengeList.3": "Works as a foundation for multiple camping applications",
  "case.west.challengeEnd": "All while maintaining a modern and easily recognizable aesthetic.",
  "case.west.role": "ROLE",
  "case.west.roleDesc": "My role involved deploying the existing branding into digital and print pieces, institutional materials, and visual planning for social media.",
  "case.west.kvTitle": "KEY VISUAL",
  "case.west.kvAlt": "West Fibra campaign Key Visual",
  "case.west.appTitle": "APPLICATION",
  "case.west.appDesc": "Adaptation of the KV for vertical format, with typography optimized for fast reading and impact on Stories.",
  "case.west.appAlt": "Key Visual application in Instagram story"

});


// Se tiver CV em EN, coloque o caminho aqui
const CV_BY_LANG = {
  pt: "./assets/curriculo-Ingrid-Lima.pdf",
  en: "./assets/resume-Ingrid-Lima.pdf",
  es: "./assets/curriculo-Ingrid-Lima.pdf" // Fallback para PT
};

// 2) Aplicar traduções
function applyI18n(lang) {
  const dict = I18N[lang] || I18N.pt;
  if (!dict) return;

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
      const parts = pair.split(":");
      if (parts.length < 2) return;
      const attr = parts[0].trim();
      const key = parts[1].trim();
      if (!attr || !key) return;
      if (dict[key] !== undefined) el.setAttribute(attr, dict[key]);
    });
  });

  const cv = document.getElementById("cv-link");
  if (cv && CV_BY_LANG[lang]) cv.setAttribute("href", CV_BY_LANG[lang]);

  document.documentElement.setAttribute("lang", lang);
}

// 3) Inicialização + botões
(function initI18n() {
  const buttons = Array.from(document.querySelectorAll(".lang-btn"));
  if (!buttons.length) return;

  buttons.forEach(b => {
    if (!b.dataset.lang) b.dataset.lang = b.textContent.trim().toLowerCase();
  });

  let lang = 'pt';
  try {
    lang = localStorage.getItem("idioma");
  } catch (e) {
    console.warn("LocalStorage access denied", e);
  }

  if (!lang) {
    lang = navigator.language && navigator.language.startsWith("en") ? "en" : "pt";
    // se espanhol
    if (navigator.language && navigator.language.startsWith("es")) lang = "es";
    try {
      localStorage.setItem("idioma", lang);
    } catch (e) { }
  }

  const markActive = (l) => buttons.forEach(b => b.classList.toggle("active", b.dataset.lang === l));

  // garanta que idioma existe
  if (!I18N[lang]) lang = 'pt';

  markActive(lang);
  applyI18n(lang);

  buttons.forEach(btn => {
    btn.addEventListener("click", () => {
      const next = btn.dataset.lang;
      if (!next) return;
      try {
        localStorage.setItem("idioma", next);
      } catch (e) { }
      markActive(next);
      applyI18n(next);
    });
  });

  window.i18nDebug = () => ({ lang: localStorage.getItem("idioma") });
})();
