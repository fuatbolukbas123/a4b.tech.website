// ==== NAV TOGGLE (mobil menü) ====
const navToggle = document.querySelector('.nav-toggle');
const siteNav   = document.querySelector('.site-nav');

if (navToggle && siteNav) {
  navToggle.addEventListener('click', () => {
    const isOpen = siteNav.classList.toggle('open');
    navToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
  });

  // Menü linkine tıklanınca menüyü kapat (mobil UX)
  siteNav.addEventListener('click', (e) => {
    const a = e.target.closest('a');
    if (!a) return;
    siteNav.classList.remove('open');
    navToggle.setAttribute('aria-expanded', 'false');
  });

  // ESC ile kapat
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      siteNav.classList.remove('open');
      navToggle.setAttribute('aria-expanded', 'false');
    }
  });

  // Ekran genişleyince (>= 769px) açık durumu temizle
  window.addEventListener('resize', () => {
    if (window.innerWidth >= 769) {
      siteNav.classList.remove('open');
      navToggle.setAttribute('aria-expanded', 'false');
    }
  });
}

// ==== FORM (çok dilli, custom mesajlar) ====
(function () {
  const form = document.getElementById('contactForm');
  if (!form) return;

  // Tarayıcı/yerel depodan dili al
  function getLang() {
    return localStorage.getItem('lang') || document.documentElement.lang || 'tr';
  }

  // Mesaj sözlüğü
  const MESSAGES = {
    tr: {
      required: 'Bu alan zorunludur.',
      email: 'Geçerli bir e-posta adresi giriniz.',
      minlen: (n) => `En az ${n} karakter giriniz.`,
      fix: 'Lütfen formdaki hataları düzeltin.',
      ok: 'Teşekkürler! Mesajınız alındı (demo).'
    },
    en: {
      required: 'This field is required.',
      email: 'Please enter a valid email address.',
      minlen: (n) => `Please enter at least ${n} characters.`,
      fix: 'Please fix the errors in the form.',
      ok: 'Thanks! Your message was received (demo).'
    }
  };

  const fields = ['name', 'email', 'message'];
  const status = document.getElementById('formStatus');

  // Canlı doğrulama: yazdıkça hata temizlensin
  fields.forEach((id) => {
    const input = document.getElementById(id);
    if (!input) return;
    input.addEventListener('input', () => {
      input.setCustomValidity('');
      const err = input.parentElement.querySelector('.error');
      if (err && input.checkValidity()) err.textContent = '';
    });
  });

  // Gönderimde kontrol
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const lang = getLang();
    const T = MESSAGES[lang] || MESSAGES.tr;

    let valid = true;

    fields.forEach((id) => {
      const input = document.getElementById(id);
      if (!input) return;
      const err = input.parentElement.querySelector('.error');

      // Varsayılan tarayıcı balonunu sustur
      input.setCustomValidity('');

      if (!input.validity.valid) {
        let msg = T.required;

        if (input.validity.valueMissing) {
          msg = T.required;
        } else if (input.validity.typeMismatch && id === 'email') {
          msg = T.email;
        } else if (input.validity.tooShort) {
          msg = T.minlen(input.minLength);
        }

        if (err) err.textContent = msg;
        valid = false;
      } else {
        if (err) err.textContent = '';
      }
    });

    if (!valid) {
      if (status) status.textContent = T.fix;
      return;
    }

    // Buraya gerçek gönderim (fetch) ekleyebilirsin
    if (status) status.textContent = T.ok;
    form.reset();
  });
})();

// ==== MAP (offline/online) ====
function buildGMapsEmbedURL(lat, lng) {
  return `https://www.google.com/maps?q=${lat},${lng}&output=embed`;
}

function updateMapOnlineState() {
  const block = document.querySelector('.map-block');
  if (!block) return;

  const lat = block.dataset.lat || '41.0082';
  const lng = block.dataset.lng || '28.9784';

  const embed = block.querySelector('.map-embed');
  const iframe = embed ? embed.querySelector('iframe') : null;
  const fallback = block.querySelector('.map-static');

  if (navigator.onLine) {
    if (iframe && !iframe.src) {
      iframe.src = buildGMapsEmbedURL(lat, lng);
    }
    embed?.classList.remove('is-hidden');
    fallback?.classList.add('is-hidden');
  } else {
    embed?.classList.add('is-hidden');
    fallback?.classList.remove('is-hidden');
  }
}

window.addEventListener('load', updateMapOnlineState);
window.addEventListener('online', updateMapOnlineState);
window.addEventListener('offline', updateMapOnlineState);
