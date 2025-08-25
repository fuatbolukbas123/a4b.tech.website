
// Mobil menü toggle
const toggle = document.querySelector('.nav-toggle');
const nav = document.querySelector('.site-nav');
if (toggle && nav) {
  toggle.addEventListener('click', () => {
    const isOpen = nav.classList.toggle('open');
    toggle.setAttribute('aria-expanded', String(isOpen));
  });
}

// Basit form doğrulama + demo submit (arka uç olmadan)
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
    // Demo: gerçek bir arka uç yok; burada fetch ile Formspree/Netlify/own API çağrılabilir.
    status.textContent = 'Teşekkürler! Mesajınız alındı (demo).';
    form.reset();
  });
}
