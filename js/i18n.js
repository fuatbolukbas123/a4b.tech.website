const I18N = (() => {
    let dict = {};
    let current = 'tr';
  
    function setText(el, key){
      if (!dict[key]) return;
      const isHTML = el.hasAttribute('data-i18n-html');
      if (isHTML) el.innerHTML = dict[key];
      else el.textContent = dict[key];
    }
    function setPlaceholder(el, key){
      if (!dict[key]) return;
      el.setAttribute('placeholder', dict[key]);
    }
    function render() {
      const elements = document.querySelectorAll("[data-i18n], [data-i18n-html]");
      
      elements.forEach(el => {
        const htmlKey = el.getAttribute("data-i18n");
        const key = el.getAttribute("data-i18n-nonhtml");
    
        // Eğer data-i18n-nonhtml varsa innerHTML kullanma
        if (htmlKey && dict[htmlKey]) {
          el.innerHTML = dict[htmlKey];
        }
        // Normal metinler için data-i18n
        else if (key && dict[key]) {
          el.textContent = dict[key];
        }
      });

      document.querySelectorAll("[data-i18n-placeholder]").forEach(el => {
        const key = el.getAttribute("data-i18n-placeholder");
        if (dict[key]) el.setAttribute("placeholder", dict[key]);
      });
    }
  
    async function load(lang){
      // YÜKLENİRKEN flick'ı engelle
      document.documentElement.classList.add('i18n-loading');
  
      const res = await fetch(`i18n/${lang}.json`).catch(() => null);
      if (!res || !res.ok) { document.documentElement.classList.remove('i18n-loading'); return; }
  
      dict = await res.json();
      current = lang;
      localStorage.setItem('lang', lang);
  
      // DOM'u tek seferde güncelle
      render();
  
      // Göster
      document.documentElement.classList.remove('i18n-loading');
    }
  
    function init(){
      const saved = localStorage.getItem('lang');
      load(saved || 'tr');
  
      document.addEventListener('click', (e) => {
        const a = e.target.closest('.lang-switch');
        if (!a) return;
        e.preventDefault();
        const next = a.dataset.lang;
        if (next) load(next);
      });
    }
  
    return { init, load };
  })();
  window.addEventListener('DOMContentLoaded', I18N.init);