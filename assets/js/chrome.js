/* =========================================================
   Bioprotech v2: Shared Chrome (header, footer, lang, nav)
   ========================================================= */
(function () {
  const BASE = document.body.dataset.base || '.';
  // 261102: 기본 언어를 영어로 변경 (예전 저장값은 무시하도록 키 이름 변경)
  const LANG_KEY = 'bp-lang-v2';
  // 261102: 스페인어 페이지 삭제 → 한국어·영어만 사용 (예전에 ES를 고른 방문자는 한국어로)
  // 261106: 한국어 심의 완료 전까지 영어로 고정 (KO 버튼을 눌러도 영어 유지)
  //         심의 완료 후 KO_ENABLED 를 true 로 바꾸면 원래대로 동작
  const KO_ENABLED = false;
  let savedLang = null;
  try { savedLang = localStorage.getItem(LANG_KEY); } catch (e) {}
  const currentLang = (KO_ENABLED && ['ko','en'].includes(savedLang)) ? savedLang : 'en';
  document.documentElement.lang = currentLang;
  document.body.dataset.lang = currentLang;

  // --------- i18n dictionary (loaded async) ----------
  let DICT = null;
  const dictReady = fetch(BASE + '/assets/data/i18n.json')
    .then(r => r.json())
    .then(d => { DICT = d; applyI18n(); })
    .catch(() => { DICT = { ko: {}, en: {} }; });

  function t(key, fallback) {
    if (!DICT) return fallback || key;
    return (DICT[currentLang] && DICT[currentLang][key]) || fallback || key;
  }
  function applyI18n() {
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const k = el.dataset.i18n;
      el.textContent = t(k, el.textContent);
    });
    document.querySelectorAll('[data-i18n-html]').forEach(el => {
      const k = el.dataset.i18nHtml;
      const v = t(k, null);
      if (v) el.innerHTML = v;
    });
  }

  // --------- Mega-menu data ----------
  const MEGA_CATS = [
    {id:'esu',    name:{ko:'전기수술', en:'Electrosurgery',  es:'Electrocirugía'},       code:'ESU'},
    {id:'cardio', name:{ko:'심전도',   en:'Cardiology',      es:'Cardiología'},           code:'ECG'},
    {id:'neuro',  name:{ko:'신경진단', en:'Neurology',       es:'Neurología'},            code:'EEG · EMG'},
    {id:'pain',   name:{ko:'통증관리', en:'Pain Management', es:'Tratamiento del dolor'}, code:'TENS'},
  ];
  const MEGA_PRODS = [
    {id:'smoke-evacuator',        cat:'esu',    name:{ko:'Smoke Evacuator',             en:'Smoke Evacuator',             es:'Smoke Evacuator'}},
    {id:'telescopic-smoke-pencil',cat:'esu',    name:{ko:'Telescopic Smoke Pencil',     en:'Telescopic Smoke Pencil',     es:'Telescopic Smoke Pencil'}},
    {id:'economy-smoke-pencil',   cat:'esu',    name:{ko:'Economy Smoke Pencil',        en:'Economy Smoke Pencil',        es:'Economy Smoke Pencil'}},
    {id:'dual-extension-pencil',  cat:'esu',    name:{ko:'Dual Extension Smoke Pencil', en:'Dual Extension Smoke Pencil', es:'Dual Extension Smoke Pencil'}},
    {id:'surgical-pencil',        cat:'esu',    name:{ko:'Surgical Pencil',             en:'Surgical Pencil',             es:'Surgical Pencil'}},
    {id:'smoke-adapter',          cat:'esu',    name:{ko:'Smoke Adapter',               en:'Smoke Adapter',               es:'Smoke Adapter'}},
    {id:'laparoscopic',           cat:'esu',    name:{ko:'Laparoscopic',                en:'Laparoscopic',                es:'Laparoscopic'}},
    {id:'esu-plate',              cat:'esu',    name:{ko:'ESU Plate',                   en:'ESU Plate',                   es:'ESU Plate'}},
    {id:'ecg-monitoring', cat:'cardio', name:{ko:'Monitoring ECG Electrode', en:'Monitoring ECG Electrode', es:'Monitoring ECG Electrode'}},
    {id:'ecg-diaphoretic', cat:'cardio', name:{ko:'Diaphoretic ECG Electrode', en:'Diaphoretic ECG Electrode', es:'Diaphoretic ECG Electrode'}},
    {id:'ecg-radiolucent', cat:'cardio', name:{ko:'Radiolucent ECG Electrode', en:'Radiolucent ECG Electrode', es:'Radiolucent ECG Electrode'}},
    {id:'ecg-stress-holter', cat:'cardio', name:{ko:'Stress Test · Holter ECG Electrode', en:'Stress Test · Holter ECG Electrode', es:'Stress Test · Holter ECG Electrode'}},
    {id:'tab-electrode',          cat:'cardio', name:{ko:'TAB Electrode',               en:'TAB Electrode',               es:'TAB Electrode'}},
    {id:'neonatal-electrode',     cat:'cardio', name:{ko:'Neonatal Electrode',          en:'Neonatal Electrode',          es:'Neonatal Electrode'}},
    {id:'spo2-sensor',            cat:'cardio', name:{ko:'SpO₂ Sensor',                en:'SpO₂ Sensor',                 es:'SpO₂ Sensor'}},
    {id:'emg-needle',             cat:'neuro',  name:{ko:'EMG Needle & Electrode',     en:'EMG Needle & Electrode',      es:'EMG Needle & Electrode'}},
    {id:'eeg-cup',                cat:'neuro',  name:{ko:'EEG Cup Electrode',          en:'EEG Cup Electrode',           es:'EEG Cup Electrode'}},
    {id:'surface-electrode',      cat:'neuro',  name:{ko:'Surface Electrode',          en:'Surface Electrode',           es:'Surface Electrode'}},
    {id:'ionm-needle',            cat:'neuro',  name:{ko:'IONM Needle',                en:'IONM Needle',                 es:'IONM Needle'}},
    {id:'neuro-cable',            cat:'neuro',  name:{ko:'Neurology Cable',            en:'Neurology Cable',             es:'Neurology Cable'}},
    {id:'tens-electrode',         cat:'pain',   name:{ko:'TENS Electrode',             en:'TENS Electrode',              es:'TENS Electrode'}},
    {id:'tens-unit',              cat:'pain',   name:{ko:'TENS Unit',                  en:'TENS Unit',                   es:'TENS Unit'}},
    {id:'ems-unit',               cat:'pain',   name:{ko:'EMS Unit',                   en:'EMS Unit',                    es:'EMS Unit'}},
    {id:'if-unit',                cat:'pain',   name:{ko:'IF Unit',                    en:'IF Unit',                     es:'IF Unit'}},
  ];

  // --------- 모바일 메뉴 하단: 견적 문의·연락처·SNS (261012) ----------
  function mobileFoot() {
    const T = {
      ko: { q:'견적 문의하기', h:'고객 상담', hrs:'평일 09:00 ~ 18:00' },
      en: { q:'Request a Quote', h:'Customer Service', hrs:'Weekdays 09:00 ~ 18:00 (KST)' },
      es: { q:'Solicitar presupuesto', h:'Atención al cliente', hrs:'Días laborables 09:00 ~ 18:00 (KST)' },
    }[currentLang] || {};
    return `<div class="nav-m-foot">
      <a class="nav-m-cta" href="${BASE}/support/contact.html">${T.q}<span aria-hidden="true">→</span></a>
      <div class="nav-m-info">
        <small>${T.h}</small>
        <a href="tel:+82337357720">033-735-7720</a>
        <a href="mailto:info@protechsite.com">info@protechsite.com</a>
        <small>${T.hrs}</small>
      </div>
      <div class="nav-m-sns">${snsHTML()}</div>
    </div>`;
  }

  // --------- Header HTML ----------
  function headerHTML() {
    const active = document.body.dataset.nav || '';
    const isHome = document.body.dataset.page === 'home';
    const brandHref = BASE + '/index.html';
    const NAV_BY_LANG = {
      ko: { home:'홈', products:'제품',       about:'회사소개', news:'뉴스',     downloads:'자료실',  support:'고객지원', contact:'문의' },
      en: { home:'Home', products:'Products',   about:'About',    news:'News',     downloads:'Download', support:'Support',  contact:'Contact' },
      es: { home:'Inicio', products:'Productos',  about:'Empresa',  news:'Noticias', downloads:'Recursos',  support:'Soporte',  contact:'Contacto' },
    };
    const NAV_LABELS = NAV_BY_LANG[currentLang] || NAV_BY_LANG.en;
    // 261008 TF 반영: 홈·회사소개·뉴스를 앞으로, 제품을 메뉴 중앙(7개 중 4번째)에 배치
    const items = [
      ['home',     BASE + '/index.html',          NAV_LABELS.home],
      ['about',    BASE + '/company/about.html',  NAV_LABELS.about],
      ['news',     BASE + '/news/index.html',     NAV_LABELS.news],
      ['products', BASE + '/products/index.html', NAV_LABELS.products],
      ['downloads',BASE + '/downloads/index.html',NAV_LABELS.downloads],
      ['support',  BASE + '/support/faq.html',    NAV_LABELS.support],
      ['contact',  BASE + '/support/contact.html',NAV_LABELS.contact],
    ];
    const VAL = {ko:'전체 제품 보기', en:'View All Products', es:'Ver todos los productos'};
    const megaCols = MEGA_CATS.map(cat => {
      const prods = MEGA_PRODS.filter(p => p.cat === cat.id);
      return `<div class="mega-col">
        <a class="mega-cat" href="${BASE}/products/category.html?cat=${cat.id}">
          <span class="mega-cat-ko">${cat.name[currentLang]}</span>
          <span class="mega-cat-code">${cat.code}</span>
        </a>
        <div class="mega-items">${prods.map(p =>
          `<a class="mega-item" href="${BASE}/products/detail.html?id=${p.id}">${p.name[currentLang]}</a>`
        ).join('')}</div>
      </div>`;
    }).join('');

    const SUB = {home:'HOME',about:'ABOUT',news:'NEWS',products:'PRODUCTS',downloads:'DOWNLOAD',support:'SUPPORT',contact:'CONTACT'};
    const nav = items.map(([id, href, label]) => {
      if (id === 'products') {
        return `<div class="nav-has-mega${active === id ? ' active' : ''}" id="nav-prod-wrap">
          <a href="${href}" class="nav-mega-btn${active === id ? ' active' : ''}" id="nav-prod-btn" data-sub="${SUB[id]}" aria-expanded="false" aria-haspopup="true">${label}</a>
          <div class="nav-m-cats">${MEGA_CATS.map(c => `<a href="${BASE}/products/category.html?cat=${c.id}"><b>${c.code}</b><span>${c.name[currentLang]}</span></a>`).join('')}</div>
          <div class="nav-mega" id="nav-mega" aria-hidden="true">
            <div class="mega-wrap">
              <div class="mega-inner">${megaCols}</div>
              <div class="mega-foot"><a href="${BASE}/products/index.html">${VAL[currentLang] || VAL.en} →</a></div>
            </div>
          </div>
        </div>`;
      }
      return `<a href="${href}" class="${active === id ? 'active' : ''}" data-sub="${SUB[id]}">${label}</a>`;
    }).join('') + mobileFoot();

    return `
    <header class="bp-header ${isHome ? '' : 'solid'}" id="bp-header">
      <a href="${brandHref}" class="brand">
        <img class="brand-logo" src="${BASE}/assets/img/bioprotech-logo.png" alt="Bioprotech" />
        <span class="wordmark">Bioprotech</span>
      </a>
      <nav class="bp-nav" id="bp-nav">${nav}</nav>
      <div class="bp-header-cta">
        <button type="button" class="bp-search-btn" id="bp-search-btn" aria-label="${({ko:'검색',en:'Search',es:'Buscar'})[currentLang]}" title="${({ko:'검색',en:'Search',es:'Buscar'})[currentLang]}">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="11" cy="11" r="7"/><path d="M20 20l-3.6-3.6"/></svg>
        </button>
        <div class="bp-lang-toggle" role="group" aria-label="Language">
          <button type="button" data-lang="en" class="${currentLang==='en'?'active':''}">EN</button>
          <button type="button" data-lang="ko" class="${currentLang==='ko'?'active':''}">KO</button>
        </div>
        <a href="${BASE}/support/contact.html" class="pill">${({ko:'견적 문의',en:'Get a Quote',es:'Solicitar presupuesto'})[currentLang]||'견적 문의'}</a>
        <button type="button" class="bp-burger" id="bp-burger" aria-label="Menu">
          <span></span><span></span><span></span>
        </button>
      </div>
    </header>
    <div class="bp-search" id="bp-search" role="dialog" aria-modal="true" aria-label="Search" hidden>
      <div class="bp-search-inner">
        <form class="bp-search-form" id="bp-search-form" action="${BASE}/search.html" method="get" role="search">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="11" cy="11" r="7"/><path d="M20 20l-3.6-3.6"/></svg>
          <input type="search" name="q" id="bp-search-input" autocomplete="off" aria-label="${({ko:'검색',en:'Search',es:'Buscar'})[currentLang]}" />
          <button type="button" class="bp-search-close" id="bp-search-close" aria-label="Close">×</button>
        </form>
        <div class="bp-search-results" id="bp-search-results"></div>
      </div>
    </div>
    <div class="bp-search-dim" id="bp-search-dim" hidden></div>`;
  }

  // --------- SNS 링크 (261008 TF 반영) ----------
  // ※ 공식 계정 주소가 확정되면 아래 url 값만 교체하면 전 페이지에 반영됩니다.
  //   (현재는 각 플랫폼 기본 주소로 연결: 공식 계정 URL 확정 필요)
  const SNS_LINKS = [
    { id:'instagram', name:'Instagram', url:'https://www.instagram.com/',
      icon:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1.2" fill="currentColor" stroke="none"/></svg>' },
    { id:'wechat', name:'WeChat', url:'http://weixin.qq.com/r/mp/TBHs9NfE5IqbrZOX90Re', qr:'/assets/img/wechat-qr.svg', search:'烟台博奥医疗器械有限公司',
      icon:'<svg viewBox="0 0 24 24" fill="currentColor"><path d="M9.2 4C5.2 4 2 6.7 2 10c0 1.9 1 3.6 2.7 4.7L4 17l2.6-1.3c.8.2 1.7.4 2.6.4h.5a5.6 5.6 0 0 1-.2-1.5c0-3.4 3.2-6.1 7.2-6.1h.4C16.4 6.2 13.1 4 9.2 4zM6.8 8.9a1 1 0 1 1 0-2 1 1 0 0 1 0 2zm4.8 0a1 1 0 1 1 0-2 1 1 0 0 1 0 2z"/><path d="M22 14.5c0-2.8-2.7-5-6.1-5s-6.1 2.2-6.1 5 2.7 5 6.1 5c.7 0 1.4-.1 2-.3l2.1 1.1-.6-1.9c1.6-.9 2.6-2.3 2.6-3.9zm-8.1-.8a.8.8 0 1 1 0-1.6.8.8 0 0 1 0 1.6zm4 0a.8.8 0 1 1 0-1.6.8.8 0 0 1 0 1.6z"/></svg>' },
    { id:'tiktok', name:'TikTok', url:'https://v.douyin.com/0tQFvECZk8M/',
      icon:'<svg viewBox="0 0 24 24" fill="currentColor"><path d="M16.6 3c.3 2.3 1.7 3.8 4 4v3.1c-1.5 0-2.9-.4-4-1.2v6.3A6 6 0 1 1 10.7 9v3.2a2.9 2.9 0 1 0 2.8 2.9V3h3.1z"/></svg>' },
    { id:'linkedin', name:'LinkedIn', url:'https://www.linkedin.com/company/bioprotech-official/',
      icon:'<svg viewBox="0 0 24 24" fill="currentColor"><rect x="3" y="9" width="4" height="12"/><circle cx="5" cy="5" r="2.2"/><path d="M10 9h3.8v1.8c.6-1.1 2-2.1 4-2.1 3.3 0 4.2 2 4.2 5V21h-4v-6.4c0-1.6-.4-2.7-1.9-2.7-1.6 0-2.1 1.1-2.1 2.7V21h-4V9z"/></svg>' },
    { id:'youtube', name:'YouTube', url:'https://www.youtube.com/@bioprotech_official',
      icon:'<svg viewBox="0 0 24 24" fill="currentColor"><path d="M22.5 7.2a2.8 2.8 0 0 0-2-2C18.8 4.7 12 4.7 12 4.7s-6.8 0-8.5.5a2.8 2.8 0 0 0-2 2C1 8.9 1 12 1 12s0 3.1.5 4.8a2.8 2.8 0 0 0 2 2c1.7.5 8.5.5 8.5.5s6.8 0 8.5-.5a2.8 2.8 0 0 0 2-2c.5-1.7.5-4.8.5-4.8s0-3.1-.5-4.8zM9.8 15.1V8.9l5.6 3.1-5.6 3.1z"/></svg>' },
  ];
  function snsHTML() {
    return SNS_LINKS.map(s =>
      `<a class="sns-btn sns-${s.id}" href="${s.url}" target="_blank" rel="noopener noreferrer" aria-label="${s.name}" title="${s.name}"${s.qr ? ` data-qr="${s.id}"` : ''}>${s.icon}<span>${s.name}</span></a>`
    ).join('');
  }
  // QR만 있는 채널(WeChat): 버튼 클릭 시 QR 팝업
  function wireQR() {
    document.querySelectorAll('.sns-btn[data-qr]').forEach(btn => btn.addEventListener('click', e => {
      const s = SNS_LINKS.find(x => x.id === btn.dataset.qr); if (!s) return;
      e.preventDefault();
      const T = { ko:{ scan:'위챗 앱에서 QR 코드를 스캔해 주세요.', search:'또는 위챗 검색', close:'닫기' }, en:{ scan:'Scan the QR code with the WeChat app.', search:'Or search in WeChat', close:'Close' }, es:{ scan:'Escanee el código QR con la app WeChat.', search:'O busque en WeChat', close:'Cerrar' } }[currentLang] || {};
      const wrap = document.createElement('div');
      wrap.className = 'qr-pop';
      wrap.innerHTML = `<div class="qr-box" role="dialog" aria-modal="true" aria-label="${s.name} QR">
          <button type="button" class="qr-x" aria-label="${T.close}">×</button>
          <b>${s.name}</b>
          <img src="${BASE}${s.qr}" alt="${s.name} QR code" width="200" height="200">
          <p>${T.scan}</p>
          <p class="qr-s">${T.search}<br><strong>${s.search}</strong></p>
        </div>`;
      const close = () => { wrap.remove(); document.removeEventListener('keydown', esc); btn.focus(); };
      const esc = ev => { if (ev.key === 'Escape') close(); };
      wrap.addEventListener('click', ev => { if (ev.target === wrap || ev.target.closest('.qr-x')) close(); });
      document.addEventListener('keydown', esc);
      document.body.appendChild(wrap);
      wrap.querySelector('.qr-x').focus();
    }));
  }
  window.bpSnsLinks = SNS_LINKS;

  // --------- Footer HTML ----------
  function footerHTML() {
    const FOOT_BY_LANG = {
      en: {
        prod: 'Products', comp: 'Company', sup: 'Support',
        a1: 'Electrosurgery', a2: 'ECG Electrodes', a3: 'Neurology', a4: 'TENS / Pain',
        b1: 'About', b2: 'History', b3: 'Global', b4: 'R&D', b5: 'Quality Policy', b6: 'Certifications', sns: 'Follow Bioprotech',
        c1: 'Inquiry', c2: 'FAQ', c3: 'Downloads', c4: 'Certifications',
        terms: 'Terms', privacy: 'Privacy Policy',
        company: 'Bioprotech | CEO',
        reg: 'Business Reg. No.: 108-81-22350',
        addr: '(26365) 151-3 Donghwagongdan-ro, Munmak-eup, Wonju-si, Gangwon-do',
        tel: 'Tel 033-735-7720 · Fax 033-735-7736',
        copy: '© 2026 Bioprotech Co., Ltd. All rights reserved.'
      },
      es: {
        prod: 'Productos', comp: 'Empresa', sup: 'Soporte',
        a1: 'Electrocirugía', a2: 'Electrodos ECG', a3: 'Neurología', a4: 'TENS / Dolor',
        b1: 'Empresa', b2: 'Historia', b3: 'Global', b4: 'I+D', b5: 'Política de calidad', b6: 'Certificaciones', sns: 'Síguenos',
        c1: 'Consultas', c2: 'Preguntas frecuentes', c3: 'Descargas', c4: 'Certificaciones',
        terms: 'Términos', privacy: 'Política de privacidad',
        company: 'Bioprotech | Director General',
        reg: 'Núm. de registro mercantil: 108-81-22350',
        addr: '(26365) 151-3 Donghwagongdan-ro, Munmak-eup, Wonju-si, Gangwon-do, Corea',
        tel: 'Tel 033-735-7720 · Fax 033-735-7736',
        copy: '© 2026 Bioprotech Co., Ltd. Todos los derechos reservados.'
      },
      ko: {
        prod: 'Products', comp: 'Company', sup: 'Support',
        a1: '전기수술', a2: '심전도 전극', a3: '신경진단', a4: '통증관리',
        b1: '회사소개', b2: '연혁', b3: '글로벌', b4: '연구개발', b5: '품질방침', b6: '인증현황', sns: '바이오프로테크 SNS',
        c1: '문의하기', c2: 'FAQ', c3: '자료실', c4: '인증현황',
        terms: '이용약관', privacy: '개인정보처리방침',
        company: '㈜바이오프로테크 | 대표이사',
        reg: '사업자등록번호 : 108-81-22350',
        addr: '(26365) 강원도 원주시 문막읍 동화공단로 151-3',
        tel: '전화 033-735-7720 · 팩스 033-735-7736',
        copy: 'Copyright © 2026 ㈜바이오프로테크 All rights reserved.'
      }
    };
    const L = FOOT_BY_LANG[currentLang] || FOOT_BY_LANG.ko;
    return `
    <footer>
      <div class="foot-grid">
        <div class="foot-brand">
          <a class="mark" href="${BASE}/index.html"><img class="foot-logo" src="${BASE}/assets/img/bioprotech-logo.png" alt="Bioprotech" />Bioprotech</a>
          <p class="foot-info">
            ${L.company}<br/>
            ${L.reg}<br/>
            ${L.addr}<br/>
            ${L.tel}<br/>
            info@protechsite.com
          </p>
        </div>
        <div class="foot-col">
          <h5>${L.prod}</h5>
          <a href="${BASE}/products/category.html?cat=esu">${L.a1}</a>
          <a href="${BASE}/products/category.html?cat=cardio">${L.a2}</a>
          <a href="${BASE}/products/category.html?cat=neuro">${L.a3}</a>
          <a href="${BASE}/products/category.html?cat=pain">${L.a4}</a>
        </div>
        <div class="foot-col">
          <h5>${L.comp}</h5>
          <a href="${BASE}/company/about.html">${L.b1}</a>
          <a href="${BASE}/company/quality.html">${L.b5}</a>
          <a href="${BASE}/company/certification.html">${L.b6}</a>
          <a href="${BASE}/company/history.html">${L.b2}</a>
          <a href="${BASE}/company/global.html">${L.b3}</a>
          <a href="${BASE}/company/rnd.html">${L.b4}</a>
        </div>
        <div class="foot-col">
          <h5>${L.sup}</h5>
          <a href="${BASE}/support/contact.html">${L.c1}</a>
          <a href="${BASE}/support/faq.html">${L.c2}</a>
          <a href="${BASE}/downloads/index.html">${L.c3}</a>
          <a href="${BASE}/company/certification.html">${L.c4}</a>
        </div>
      </div>
      <div class="foot-sns">
        <span class="foot-sns-label">${L.sns}</span>
        <div class="foot-sns-list">${snsHTML()}</div>
      </div>
      <div class="foot-bottom">
        <div>${L.copy}</div>
        <div class="policy">
          <a href="${BASE}/legal/terms.html">${L.terms}</a>
          <a href="${BASE}/legal/privacy.html"><strong>${L.privacy}</strong></a>
        </div>
      </div>
    </footer>

    <div class="floating">
      <a class="fl-contact" href="${BASE}/support/contact.html" aria-label="${({ko:'문의하기',en:'Contact us',es:'Contacto'})[currentLang]}" title="${({ko:'문의하기',en:'Contact us',es:'Contacto'})[currentLang]}">
        <svg viewBox="0 0 24 24"><path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zM6 9h12v2H6V9zm8 5H6v-2h8v2zm4-6H6V6h12v2z"/></svg>
      </a>
      <a href="#top" aria-label="맨 위로" title="맨 위로">
        <svg viewBox="0 0 24 24"><path d="M7.41 15.41L12 10.83l4.59 4.58L18 14l-6-6-6 6z"/></svg>
      </a>
    </div>`;
  }

  // --------- 사이트 검색 (261008) ----------
  // 제품(모델번호·사양 포함) · 뉴스 · FAQ · 주요 페이지를 한 번에 검색. 한글 일반어 → 제품 용어 동의어 확장.
  const SR_SYN = {
    '심전도':'ecg cardiology', '심전':'ecg', '뇌파':'eeg', '근전도':'emg', '신경':'neurology emg eeg', '피하':'subdermal',
    '접지':'grounding plate', '접지판':'grounding plate', '패드':'pad plate', '전기수술':'esu electrosurgery electrosurgical',
    '연기':'smoke', '배연':'smoke evacuation', '흡인':'smoke evacuation suction', '펜슬':'pencil', '전기메스':'pencil esu',
    '복강경':'laparoscopic', '통증':'tens pain', '저주파':'tens', '신생아':'neonatal', '소아':'pediatric', '산소포화도':'spo2 sensor',
    '바늘':'needle', '니들':'needle', '케이블':'cable', '전극':'electrode', '젤':'gel hydrogel', '겔':'gel hydrogel',
    '인증':'certification 인증현황 인증서', '허가':'certification 인증현황 허가증', '스모크':'smoke', '에스유':'esu', '품질':'quality 품질방침',
    '카탈로그':'catalog download', '자료':'download', '사용설명서':'ifu', '전시회':'exhibition 전시회', '학회':'exhibition',
    '수출':'export global', '견적':'quote contact', '문의':'contact inquiry'
  };
  const SR_PAGES = [
    { url:'/company/about.html', t:{ko:'회사소개',en:'About',es:'Empresa'}, k:'회사 소개 about company 설립 연혁 history 조직도 organization 법인' },
    { url:'/company/ceo.html', t:{ko:'CEO 메시지',en:'CEO Message',es:'Mensaje del CEO'}, k:'ceo 대표 인사말 메시지 message' },
    { url:'/company/quality.html', t:{ko:'품질방침',en:'Quality Policy',es:'Política de calidad'}, k:'quality 품질 품질방침 qms iso 13485 kgmp' },
    { url:'/company/certification.html', t:{ko:'인증현황',en:'Certifications',es:'Certificaciones'}, k:'certification 인증 인증현황 인증서 허가증 iso 13485 ce mdr fda 510k kgmp mfds 식약처' },
    { url:'/company/history.html', t:{ko:'연혁',en:'History',es:'Historia'}, k:'history 연혁' },
    { url:'/company/global.html', t:{ko:'글로벌 네트워크',en:'Global Network',es:'Red global'}, k:'global 글로벌 법인 export 수출 usa china yantai guangzhou' },
    { url:'/company/rnd.html', t:{ko:'연구개발',en:'R&D',es:'I+D'}, k:'r&d 연구개발 연구 개발 hydrogel' },
    { url:'/news/index.html', t:{ko:'뉴스 · IR',en:'News',es:'Noticias'}, k:'news 뉴스 ir 공시 공지 보도' },
    { url:'/news/exhibition.html', t:{ko:'전시회 · 학회',en:'Exhibitions',es:'Ferias'}, k:'exhibition 전시회 학회 medica gmes kimes' },
    { url:'/downloads/index.html', t:{ko:'자료실 (Download)',en:'Download',es:'Descargas'}, k:'download 자료실 카탈로그 catalog ifu 사용설명서 pdf' },
    { url:'/support/faq.html', t:{ko:'FAQ',en:'FAQ',es:'FAQ'}, k:'faq 자주 묻는 질문 support 고객지원' },
    { url:'/support/contact.html', t:{ko:'문의하기',en:'Contact',es:'Contacto'}, k:'contact 문의 견적 quote sample 샘플 inquiry' },
    { url:'/products/index.html', t:{ko:'전체 제품',en:'All Products',es:'Todos los productos'}, k:'products 제품 전체 라인업' },
  ];
  let SR_IDX = null;
  function srLoad() {
    if (SR_IDX) return SR_IDX;
    const j = f => fetch(BASE + '/assets/data/' + f).then(r => r.json()).catch(() => null);
    SR_IDX = Promise.all([j('products.json'), j('news.json'), j('faq.json')]).then(([P, N, F]) => {
      const L = o => o ? (o[currentLang] || o.en || o.ko || '') : '';
      const all = o => o ? Object.values(o).join(' ') : '';
      const docs = [];
      if (P) {
        P.categories.forEach(c => docs.push({ type:'cat', title:L(c.name), sub:L(c.sub), url:'/products/category.html?cat=' + c.id, text:[all(c.name), all(c.sub), all(c.desc)].join(' ') }));
        P.products.forEach(p => {
          const models = (p.spec && p.spec.rows || []).map(r => r.join(' '));
          const cells = [].concat(...(p.spec && p.spec.rows || []).map(r => r.flatMap(v => String(v).split(/\s*\/\s*|,\s*/)))).filter(v => /[0-9]/.test(v) && /[A-Za-z]/.test(v) && v.length <= 20);
          docs.push({ type:'prod', title:L(p.name), sub:L(p.tagline), url:'/products/detail.html?id=' + p.id, img: p.images ? p.images[0] : null,
            models, cells, text:[all(p.name), all(p.tagline), p.summary ? all(p.summary) : '', p.features ? Object.values(p.features).flat().join(' ') : '',
              p.catalog ? p.catalog.name : '', (p.applications || []).join(' '), models.join(' ')].join(' ') });
        });
      }
      if (N) N.items.forEach(i => docs.push({ type:'news', title:L(i.title), sub:i.date + ' · ' + L(i.tag), url:'/news/detail.html?id=' + i.id, text:[all(i.title), all(i.summary), all(i.tag)].join(' ') }));
      if (F) F.items.forEach(i => docs.push({ type:'faq', title:L(i.q), sub:L(i.a).slice(0, 80), url:'/support/faq.html', text:[all(i.q), all(i.a)].join(' ') }));
      SR_PAGES.forEach(pg => docs.push({ type:'page', title:L(pg.t), sub:'', url:pg.url, text:all(pg.t) + ' ' + pg.k }));
      docs.forEach(d => { d.lt = d.text.toLowerCase(); d.ltitle = (d.title || '').toLowerCase(); });
      return docs;
    });
    return SR_IDX;
  }
  async function bpSearch(q) {
    const docs = await srLoad();
    const raw = q.toLowerCase().trim().split(/\s+/).filter(Boolean);
    if (!raw.length) return [];
    const groups = raw.map(t => {
      const g = new Set([t]);
      Object.keys(SR_SYN).forEach(k => { if (t.includes(k)) SR_SYN[k].split(' ').forEach(x => g.add(x)); });
      return [...g];
    });
    const out = [];
    docs.forEach(d => {
      let score = 0, hitAll = true, model = '';
      groups.forEach(g => {
        let best = 0;
        g.forEach((t, n) => {
          const w = n === 0 ? 1 : 0.7;
          // 짧은 영문 동의어는 단어 단위로만 일치 (예: 'ce'가 'surface'에 걸리지 않도록)
          const has = (n > 0 && /^[a-z0-9]{1,4}$/.test(t)) ? (x => new RegExp('\\b' + t + '\\b').test(x)) : (x => x.includes(t));
          if (has(d.ltitle)) best = Math.max(best, 6 * w);
          else if (has(d.lt)) best = Math.max(best, 2 * w);
          if (d.cells && t.length >= 3 && n === 0) {
            const c = d.cells.find(v => v.toLowerCase().includes(t));
            if (c) { best = Math.max(best, 8); model = c; }
          }
        });
        if (!best) hitAll = false; score += best;
      });
      if (score > 0 && (hitAll || groups.length === 1)) out.push({ ...d, score: score + ({ prod:1.5, cat:1, page:0.5 }[d.type] || 0), model, url: BASE + d.url });
    });
    return out.sort((a, b) => b.score - a.score);
  }
  window.bpSearch = bpSearch;
  const SR_KIND = { prod:{ko:'제품',en:'Product',es:'Producto'}, cat:{ko:'카테고리',en:'Category',es:'Categoría'}, news:{ko:'뉴스',en:'News',es:'Noticia'}, faq:{ko:'FAQ',en:'FAQ',es:'FAQ'}, page:{ko:'페이지',en:'Page',es:'Página'} };
  window.bpSearchKind = t => (SR_KIND[t] || {})[currentLang] || t;
  function srEsc(v) { return String(v || '').replace(/[&<>"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c])); }
  window.bpSearchItemHTML = (r) => `<a class="sr-item" href="${r.url}">
      <span class="sr-kind sr-${r.type}">${window.bpSearchKind(r.type)}</span>
      <span class="sr-main"><b>${srEsc(r.title)}</b>${r.model ? `<em>${({ko:'모델',en:'Model',es:'Modelo'})[currentLang]} ${srEsc(r.model)}</em>` : ''}<small>${srEsc(r.sub)}</small></span>
      ${r.img ? `<img src="${BASE}/assets/img/products/${r.img}" alt="" loading="lazy">` : ''}
    </a>`;

  function wireSearch() {
    const btn = document.getElementById('bp-search-btn'), box = document.getElementById('bp-search'),
          dim = document.getElementById('bp-search-dim'), input = document.getElementById('bp-search-input'),
          res = document.getElementById('bp-search-results'), close = document.getElementById('bp-search-close');
    if (!btn || !box) return;
    const T = { hint:{ko:'자주 찾는 검색어',en:'Popular searches',es:'Búsquedas frecuentes'}, none:{ko:'검색 결과가 없습니다.',en:'No results.',es:'Sin resultados.'}, all:{ko:'전체 결과 보기',en:'View all results',es:'Ver todos los resultados'} };
    const POP = { ko:['심전도 전극','접지판','스모크 펜슬','EMG','인증서','카탈로그'], en:['ECG electrode','Grounding pad','Smoke pencil','EMG','Certificates','Catalog'], es:['ECG','ESU plate','Smoke pencil','EMG','Certificados','Catálogo'] }[currentLang] || [];
    const hint = () => { res.innerHTML = `<div class="sr-hint"><span>${T.hint[currentLang]}</span>${POP.map(p => `<button type="button" data-q="${p}">${p}</button>`).join('')}</div>`; };
    const open = () => { box.hidden = false; dim.hidden = false; document.body.classList.add('sr-open'); hint(); setTimeout(() => input.focus(), 30); srLoad(); };
    const shut = () => { box.hidden = true; dim.hidden = true; document.body.classList.remove('sr-open'); input.value = ''; btn.focus(); };
    let timer;
    async function run() {
      const q = input.value.trim();
      if (!q) { hint(); return; }
      const r = await bpSearch(q);
      res.innerHTML = r.length
        ? r.slice(0, 8).map(window.bpSearchItemHTML).join('') + `<a class="sr-all" href="${BASE}/search.html?q=${encodeURIComponent(q)}">${T.all[currentLang]} (${r.length}) →</a>`
        : `<div class="sr-none">${T.none[currentLang]}</div>`;
    }
    res.addEventListener('click', e => { const b = e.target.closest('[data-q]'); if (b) { input.value = b.dataset.q; run(); input.focus(); } });
    btn.addEventListener('click', open);
    close.addEventListener('click', shut);
    dim.addEventListener('click', shut);
    input.addEventListener('input', () => { clearTimeout(timer); timer = setTimeout(run, 120); });
        document.addEventListener('keydown', e => {
      if (e.key === 'Escape' && !box.hidden) shut();
      if (e.key === '/' && box.hidden && !/input|textarea|select/i.test(document.activeElement.tagName)) { e.preventDefault(); open(); }
    });
  }

  // --------- Inject ----------
  function inject() {
    const headerSlot = document.getElementById('bp-header-slot');
    const footerSlot = document.getElementById('bp-footer-slot');
    if (headerSlot) headerSlot.outerHTML = headerHTML();
    wireSearch();
    if (footerSlot) footerSlot.outerHTML = footerHTML();
    wireQR();

    const header = document.getElementById('bp-header');
    const burger = document.getElementById('bp-burger');
    const nav = document.getElementById('bp-nav');

    if (header && document.body.dataset.page === 'home') {
      const onScroll = () => {
        if (window.scrollY > 60) header.classList.add('scrolled');
        else header.classList.remove('scrolled');
      };
      window.addEventListener('scroll', onScroll, { passive: true });
      onScroll();
    }

    if (burger && nav) {
      burger.addEventListener('click', () => {
        burger.classList.toggle('open');
        nav.classList.toggle('open');
        const op = nav.classList.contains('open');
        if (header) header.classList.toggle('menu-open', op);
        document.body.classList.toggle('nav-locked', op);
      });
    }

    // ----- 제품 메가메뉴 토글 -----
    const prodBtn  = document.getElementById('nav-prod-btn');
    const prodWrap = document.getElementById('nav-prod-wrap');
    const megaEl   = document.getElementById('nav-mega');
    if (prodBtn && prodWrap) {
      const setMega = (opening) => {
        prodWrap.classList.toggle('open', opening);
        prodBtn.setAttribute('aria-expanded', String(opening));
        if (megaEl) megaEl.setAttribute('aria-hidden', String(!opening));
      };

      // 데스크톱: 마우스 호버만으로 열림/닫힘 (모바일·터치는 기존 클릭 방식 유지)
      const hoverMq = window.matchMedia('(min-width: 901px) and (hover: hover)');
      let hoverCloseTimer = null;
      prodWrap.addEventListener('mouseenter', () => {
        if (!hoverMq.matches) return;
        clearTimeout(hoverCloseTimer);
        setMega(true);
      });
      prodWrap.addEventListener('mouseleave', () => {
        if (!hoverMq.matches) return;
        clearTimeout(hoverCloseTimer);
        hoverCloseTimer = setTimeout(() => setMega(false), 200);
      });

      // 261008: 「제품」 클릭 시 전체 제품 페이지로 이동 (메가메뉴는 데스크톱 호버·키보드 포커스로 열림)
      prodWrap.addEventListener('focusin', () => setMega(true));
      prodWrap.addEventListener('focusout', (e) => { if (!prodWrap.contains(e.relatedTarget)) setMega(false); });
      document.addEventListener('click', (e) => {
        if (prodWrap.classList.contains('open') && !prodWrap.contains(e.target)) {
          prodWrap.classList.remove('open');
          prodBtn.setAttribute('aria-expanded', 'false');
          if (megaEl) megaEl.setAttribute('aria-hidden', 'true');
        }
      });
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
          prodWrap.classList.remove('open');
          prodBtn.setAttribute('aria-expanded', 'false');
        }
      });
    }

    document.querySelectorAll('.bp-lang-toggle button').forEach(b => {
      b.addEventListener('click', () => {
        const newLang = b.dataset.lang;
        if (!KO_ENABLED) return; // 261106: 한국어 잠금 중에는 언어 전환 안 함
        if (newLang !== currentLang) {
          try { localStorage.setItem(LANG_KEY, newLang); } catch (e) {}
          location.reload();
        }
      });
    });
  }

  // --------- Helper: query params ----------
  window.bpQuery = function (key) {
    const params = new URLSearchParams(location.search);
    return params.get(key);
  };
  window.bpLang = function () { return currentLang; };
  window.bpBase = function () { return BASE; };
  window.bpT = t;
  window.bpDictReady = dictReady;

  // --------- DOM ready ----------
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', inject);
  } else {
    inject();
  }
})();
