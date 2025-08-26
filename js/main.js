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

// ==== FORM (basit doğrulama + demo submit) ====
const form = document.getElementById('contactForm');
if (form) {
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const status = document.getElementById('formStatus');
    const fields = ['name','email','message'];
    let valid = true;

    fields.forEach(id => {
      const input = document.getElementById(id);
      const error = input.parentElement.querySelector('.error');
      if (!input.checkValidity()) {
        error.textContent = input.validationMessage;
        valid = false;
      } else {
        error.textContent = '';
      }
    });

    if (!valid) {
      status.textContent = 'Lütfen formdaki hataları düzeltin.';
      return;
    }

    // Demo: gerçek backend yok
    status.textContent = 'Teşekkürler! Mesajınız alındı (demo).';
    form.reset();
  });
}

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
