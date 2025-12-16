/* app.js */
document.addEventListener('DOMContentLoaded', function () {
  // set years
  const y = new Date().getFullYear();
  document.querySelectorAll('#year, #year-2, #year-3, #year-4').forEach(el => {
    if (el) el.textContent = y;
  });

  // greeting dynamic (if hero exists)
  const greetingEl = document.getElementById('greeting');
  if (greetingEl) {
    const hour = new Date().getHours();
    let greeting = 'Hola — Bienvenido';
    if (hour >= 6 && hour < 12) greeting = 'Buenos días';
    else if (hour >= 12 && hour < 18) greeting = 'Buenas tardes';
    else greeting = 'Buenas noches';
    greetingEl.textContent = `${greeting} — Soy Yirmy Herrera`;
  }

  // mobile nav toggle
  const navToggle = document.querySelector('.nav-toggle');
  const nav = document.getElementById('primary-nav');
  if (navToggle && nav) {
    navToggle.addEventListener('click', () => {
      const expanded = navToggle.getAttribute('aria-expanded') === 'true';
      navToggle.setAttribute('aria-expanded', String(!expanded));
      if (!expanded) nav.setAttribute('aria-hidden', 'false');
      else nav.setAttribute('aria-hidden', 'true');
    });
  }

  /* --- Gallery filtering & lightbox --- */
  const filters = document.querySelectorAll('.filters button');
  const items = document.querySelectorAll('.gallery-item');

  filters.forEach(btn => {
    btn.addEventListener('click', () => {
      filters.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const filter = btn.getAttribute('data-filter');
      items.forEach(it => {
        if (filter === 'all' || it.dataset.category === filter) {
          it.style.display = '';
        } else {
          it.style.display = 'none';
        }
      });
    });
  });

  // lightbox
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxCaption = document.getElementById('lightbox-caption');
  const lbClose = document.querySelector('.lightbox-close');

  document.querySelectorAll('.gallery-item img').forEach(img => {
    img.addEventListener('click', (e) => {
      const parent = e.target.closest('.gallery-item');
      lightboxImg.src = e.target.src;
      lightboxImg.alt = e.target.alt;
      lightboxCaption.textContent = parent ? parent.querySelector('h3').textContent : '';
      lightbox.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
    });
  });

  if (lbClose) lbClose.addEventListener('click', closeLightbox);
  if (lightbox) lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) closeLightbox();
  });

  function closeLightbox() {
    if (!lightbox) return;
    lightbox.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    lightboxImg.src = '';
  }

  /* --- Contact form validation --- */
  const form = document.getElementById('contactForm');
  if (form) {
    const name = document.getElementById('name');
    const email = document.getElementById('email');
    const message = document.getElementById('message');

    const errName = document.getElementById('error-name');
    const errEmail = document.getElementById('error-email');
    const errMessage = document.getElementById('error-message');
    const feedback = document.getElementById('formFeedback');

    function validateName() {
      if (!name.value.trim()) {
        errName.textContent = 'El nombre es obligatorio.';
        return false;
      }
      errName.textContent = '';
      return true;
    }

    function validateEmail() {
      const val = email.value.trim();
      const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!val) { errEmail.textContent = 'El correo es obligatorio.'; return false; }
      if (!re.test(val)) { errEmail.textContent = 'Introduce un correo válido.'; return false; }
      errEmail.textContent = '';
      return true;
    }

    function validateMessage() {
      if (!message.value.trim()) {
        errMessage.textContent = 'El mensaje es obligatorio.';
        return false;
      }
      if (message.value.trim().length < 10) {
        errMessage.textContent = 'El mensaje debe tener al menos 10 caracteres.';
        return false;
      }
      errMessage.textContent = '';
      return true;
    }

    // live validation
    name.addEventListener('keyup', validateName);
    email.addEventListener('keyup', validateEmail);
    message.addEventListener('keyup', validateMessage);

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      const okName = validateName();
      const okEmail = validateEmail();
      const okMessage = validateMessage();

      if (okName && okEmail && okMessage) {
        // Simular envío exitoso
        feedback.textContent = 'Mensaje enviado correctamente. ¡Gracias!';
        feedback.style.color = 'green';
        form.reset();
        // opcional: limpiar borrador guardado
        localStorage.removeItem('contactDraft');
        // quitar errores visibles
        errName.textContent = errEmail.textContent = errMessage.textContent = '';
      } else {
        feedback.textContent = 'Por favor corrige los errores del formulario.';
        feedback.style.color = '#b00020';
      }
    });

    // optional: guardar borrador en localStorage (autosave)
    [name, email, message].forEach(el => {
      el.addEventListener('input', () => {
        const draft = { name: name.value, email: email.value, message: message.value };
        localStorage.setItem('contactDraft', JSON.stringify(draft));
      });
    });

    // cargar borrador si existe
    const draftRaw = localStorage.getItem('contactDraft');
    if (draftRaw) {
      try {
        const draft = JSON.parse(draftRaw);
        if (draft.name) name.value = draft.name;
        if (draft.email) email.value = draft.email;
        if (draft.message) message.value = draft.message;
      } catch (err) { /* ignore */ }
    }
  }

  /* --- Animate progress bars on about page --- */
  const progressEls = document.querySelectorAll('.progress span');
  if (progressEls.length) {
    progressEls.forEach(span => {
      const parent = span.parentElement;
      const value = parent ? parent.getAttribute('data-value') : null;
      if (value) {
        // small delay for nicer effect
        setTimeout(() => { span.style.width = value + '%'; }, 300);
      }
    });
  }
});
