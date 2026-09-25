/* =========================================================================
   Miniaturas de impresión 3D · Amaia García Martín
   Interacciones: menú móvil, filtros de portfolio, visor ampliado,
   animaciones de entrada, navegación activa y validación del formulario.
   Sin dependencias externas.
   ========================================================================= */
(function () {
  'use strict';

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------------------------------------------------------------------
     1. Tipografías decorativas (se aplican solo si se pueden descargar).
        La web funciona igual sin conexión: usa la pila de respaldo.
     --------------------------------------------------------------------- */
  function loadDisplayFonts() {
    var families = [
      'family=Cinzel:wght@400;600;700',
      'family=Cormorant+Garamond:ital,wght@0,500;0,600;1,500',
      'family=Inter:wght@300;400;500;600;700'
    ].join('&');

    var link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://fonts.googleapis.com/css2?' + families + '&display=swap';
    link.crossOrigin = 'anonymous';
    document.head.appendChild(link);
  }

  function applyDisplayFont(weights) {
    document.documentElement.style.setProperty(
      '--font-display',
      '"Cinzel", "Trajan Pro", "Iowan Old Style", "Palatino Linotype", Georgia, serif'
    );
    document.documentElement.classList.add('fonts-ready');
    document.documentElement.style.setProperty(
      '--font-body',
      '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif'
    );
    void weights;
  }

  try {
    if (document.fonts && document.fonts.load && navigator.onLine !== false) {
      loadDisplayFonts();
      // Cinzel no incluye minúsculas reales, así que se usa solo en titulares.
      document.fonts.load('600 1rem "Cinzel"').then(function (loaded) {
        if (loaded && loaded.length) {
          document.fonts.load('400 1rem "Inter"').catch(function () {});
          applyDisplayFont(loaded.length);
        }
      }).catch(function () { /* sin conexión: se mantiene la pila local */ });
    }
  } catch (err) { /* la web sigue siendo plenamente funcional */ }

  /* ---------------------------------------------------------------------
     2. Cabecera pegajosa y menú móvil
     --------------------------------------------------------------------- */
  var header = document.querySelector('.site-header');
  var navToggle = document.querySelector('.nav-toggle');
  var nav = document.getElementById('menu');

  function onScroll() {
    if (!header) return;
    header.classList.toggle('is-stuck', window.scrollY > 12);
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  function closeMenu() {
    if (!nav || !navToggle) return;
    nav.classList.remove('is-open');
    navToggle.setAttribute('aria-expanded', 'false');
    navToggle.setAttribute('aria-label', 'Abrir menú de navegación');
  }

  function openMenu() {
    if (!nav || !navToggle) return;
    nav.classList.add('is-open');
    navToggle.setAttribute('aria-expanded', 'true');
    navToggle.setAttribute('aria-label', 'Cerrar menú de navegación');
  }

  if (navToggle && nav) {
    navToggle.addEventListener('click', function () {
      if (nav.classList.contains('is-open')) { closeMenu(); } else { openMenu(); }
    });

    nav.addEventListener('click', function (event) {
      if (event.target.closest('a')) { closeMenu(); }
    });

    document.addEventListener('click', function (event) {
      if (!nav.classList.contains('is-open')) return;
      if (nav.contains(event.target) || navToggle.contains(event.target)) return;
      closeMenu();
    });

    document.addEventListener('keydown', function (event) {
      if (event.key === 'Escape' && nav.classList.contains('is-open')) {
        closeMenu();
        navToggle.focus();
      }
    });

    window.addEventListener('resize', function () {
      if (window.innerWidth > 900) { closeMenu(); }
    });
  }

  /* ---------------------------------------------------------------------
     3. Categorías y años
     --------------------------------------------------------------------- */
  var yearEl = document.getElementById('year');
  if (yearEl) { yearEl.textContent = String(new Date().getFullYear()); }

  /* ---------------------------------------------------------------------
     4. Filtros del portfolio
     --------------------------------------------------------------------- */
  var filterButtons = Array.prototype.slice.call(document.querySelectorAll('.filter'));
  var works = Array.prototype.slice.call(document.querySelectorAll('.work'));

  filterButtons.forEach(function (button) {
    button.addEventListener('click', function () {
      var filter = button.getAttribute('data-filter');

      filterButtons.forEach(function (other) {
        var active = other === button;
        other.classList.toggle('is-active', active);
        other.setAttribute('aria-pressed', active ? 'true' : 'false');
      });

      works.forEach(function (work) {
        var match = filter === 'all' || work.getAttribute('data-cat') === filter;
        work.classList.toggle('is-hidden', !match);
        if (match && !reduceMotion) {
          work.classList.remove('is-visible');
          // Fuerza el reinicio de la animación antes de volver a mostrarla.
          void work.offsetWidth;
          work.classList.add('is-visible');
        }
      });
    });
  });

  /* ---------------------------------------------------------------------
     5. Visor ampliado (lightbox)
     --------------------------------------------------------------------- */
  var lightbox = document.getElementById('lightbox');
  var lbImg = document.getElementById('lbImg');
  var lbCap = document.getElementById('lbCap');
  var lbClose = document.getElementById('lbClose');
  var lbPrev = document.getElementById('lbPrev');
  var lbNext = document.getElementById('lbNext');

  var triggers = Array.prototype.slice.call(
    document.querySelectorAll('[data-lightbox-src], [data-lightbox]')
  );

  var items = triggers.map(function (trigger) {
    var img = trigger.querySelector('img');
    var src = trigger.getAttribute('data-lightbox-src') || trigger.getAttribute('data-lightbox');
    var alt = trigger.getAttribute('data-lightbox-alt') ||
              (img ? img.getAttribute('alt') : '') || '';
    var caption = '';
    var figure = trigger.closest('figure');
    if (figure) {
      var heading = figure.querySelector('figcaption h3');
      if (heading) { caption = heading.textContent.trim(); }
    }
    if (!caption) {
      var tag = trigger.querySelector('.hero-card-tag');
      if (tag) { caption = tag.textContent.trim(); }
    }
    return { src: src, alt: alt, caption: caption };
  });

  var current = -1;
  var lastFocused = null;

  function renderSlide(index) {
    if (!items.length || !lbImg) return;
    current = (index + items.length) % items.length;
    var item = items[current];

    lbImg.src = item.src;
    lbImg.alt = item.alt;
    if (lbCap) {
      lbCap.textContent = item.caption + (item.caption ? ' — ' : '') +
        'Pulsa Esc para cerrar, o usa las flechas para ver más trabajos.';
    }
  }

  function openLightbox(index) {
    if (!lightbox) return;
    lastFocused = document.activeElement;
    renderSlide(index);
    lightbox.hidden = false;
    document.body.style.overflow = 'hidden';
    if (lbClose) { lbClose.focus(); }
  }

  function closeLightbox() {
    if (!lightbox || lightbox.hidden) return;
    lightbox.hidden = true;
    document.body.style.overflow = '';
    if (lbImg) { lbImg.src = ''; }
    if (lastFocused && typeof lastFocused.focus === 'function') { lastFocused.focus(); }
  }

  function step(delta) {
    if (lightbox && !lightbox.hidden) { renderSlide(current + delta); }
  }

  triggers.forEach(function (trigger, index) {
    trigger.addEventListener('click', function (event) {
      event.preventDefault();
      openLightbox(index);
    });
  });

  if (lbClose) { lbClose.addEventListener('click', closeLightbox); }
  if (lbPrev) { lbPrev.addEventListener('click', function () { step(-1); }); }
  if (lbNext) { lbNext.addEventListener('click', function () { step(1); }); }

  if (lightbox) {
    lightbox.addEventListener('click', function (event) {
      if (event.target === lightbox) { closeLightbox(); }
    });
  }

  document.addEventListener('keydown', function (event) {
    if (!lightbox || lightbox.hidden) return;
    if (event.key === 'Escape') { closeLightbox(); }
    else if (event.key === 'ArrowLeft') { step(-1); }
    else if (event.key === 'ArrowRight') { step(1); }
  });

  /* ---------------------------------------------------------------------
     6. Animaciones de entrada
     --------------------------------------------------------------------- */
  var revealItems = Array.prototype.slice.call(document.querySelectorAll('.reveal'));

  revealItems.forEach(function (el) {
    var delay = el.getAttribute('data-delay');
    if (delay) { el.style.setProperty('--reveal-delay', delay + 'ms'); }
  });

  if (reduceMotion || !('IntersectionObserver' in window)) {
    revealItems.forEach(function (el) { el.classList.add('is-visible'); });
  } else {
    var revealObserver = new IntersectionObserver(function (entries, observer) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });

    revealItems.forEach(function (el) { revealObserver.observe(el); });
  }

  /* ---------------------------------------------------------------------
     7. Enlace activo según la sección visible
     --------------------------------------------------------------------- */
  var sections = Array.prototype.slice.call(document.querySelectorAll('main section[id]'));
  var navLinks = Array.prototype.slice.call(document.querySelectorAll('.site-nav a[href^="#"]'));

  function setCurrent(id) {
    navLinks.forEach(function (link) {
      var isCurrent = link.getAttribute('href') === '#' + id;
      link.classList.toggle('is-current', isCurrent);
      if (isCurrent) { link.setAttribute('aria-current', 'true'); }
      else { link.removeAttribute('aria-current'); }
    });
  }

  if ('IntersectionObserver' in window && sections.length) {
    var sectionObserver = new IntersectionObserver(function (entries) {
      var visible = entries
        .filter(function (entry) { return entry.isIntersecting; })
        .sort(function (a, b) { return b.intersectionRatio - a.intersectionRatio; });
      if (visible.length) { setCurrent(visible[0].target.id); }
    }, { threshold: [0.25, 0.5], rootMargin: '-20% 0px -45% 0px' });

    sections.forEach(function (section) { sectionObserver.observe(section); });
  }

  /* ---------------------------------------------------------------------
     8. Validación y envío del formulario de contacto
     --------------------------------------------------------------------- */
  var form = document.getElementById('contactForm');
  var status = document.getElementById('formStatus');

  if (form) {
    var submitBtn = document.getElementById('submitBtn');
    var EMAIL_RE = /^[^\s@]+@[^\s@]+\.[a-z]{2,}$/i;

    function fieldOf(input) { return input.closest('.field'); }

    function showError(input, message) {
      var wrapper = fieldOf(input);
      if (!wrapper) return;
      wrapper.classList.add('has-error');
      var error = wrapper.querySelector('.error');
      if (error) {
        if (message) { error.textContent = message; }
        error.hidden = false;
      }
      input.setAttribute('aria-invalid', 'true');
    }

    function clearError(input) {
      var wrapper = fieldOf(input);
      if (!wrapper) return;
      wrapper.classList.remove('has-error');
      var error = wrapper.querySelector('.error');
      if (error) { error.hidden = true; }
      input.removeAttribute('aria-invalid');
    }

    function validateField(input) {
      var value = (input.value || '').trim();

      if (input.id === 'nombre') {
        if (!value || value.length < 2) {
          showError(input, 'Escribe tu nombre para poder responderte.');
          return false;
        }
      }

      if (input.id === 'email') {
        if (!EMAIL_RE.test(value)) {
          showError(input, 'Necesito un correo válido para contestarte.');
          return false;
        }
      }

      if (input.id === 'mensaje') {
        if (value.length < 15) {
          showError(input, 'Cuéntame un poco más (al menos unas líneas) para poder presupuestar.');
          return false;
        }
      }

      if (input.type === 'checkbox' && input.required && !input.checked) {
        showError(input, 'Marca esta casilla para poder enviar la consulta.');
        return false;
      }

      if (input.required && input.type !== 'checkbox' && !value) {
        showError(input, 'Este campo es obligatorio.');
        return false;
      }

      clearError(input);
      return true;
    }

    function getInputs() {
      return Array.prototype.slice.call(form.querySelectorAll('input, select, textarea'));
    }

    getInputs().forEach(function (input) {
      var eventName = (input.tagName === 'SELECT' || input.type === 'checkbox') ? 'change' : 'blur';
      input.addEventListener(eventName, function () {
        if (input.required) { validateField(input); }
      });
      input.addEventListener('input', function () {
        if (fieldOf(input) && fieldOf(input).classList.contains('has-error')) {
          validateField(input);
        }
      });
    });

    function setStatus(message, kind) {
      if (!status) return;
      status.textContent = message;
      status.className = 'form-status ' + (kind === 'ok' ? 'is-ok' : 'is-error');
      status.hidden = false;
    }

    /* Resumen del encargo listo para copiar y enviar por LinkedIn. */
    function buildSummary() {
      var data = new FormData(form);
      var labels = {
        nombre: 'Nombre', email: 'Correo de contacto', tipo: 'Tipo de encargo',
        cantidad: 'Cantidad', escala: 'Escala', acabado: 'Acabado',
        mensaje: 'Descripción'
      };
      var lines = [];
      Object.keys(labels).forEach(function (key) {
        var value = (data.get(key) || '').toString().trim();
        if (value) { lines.push(labels[key] + ': ' + value); }
      });
      return 'Nuevo encargo de miniatura\n' + lines.join('\n');
    }

    function copyToClipboard(text) {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        return navigator.clipboard.writeText(text).then(function () { return true; })
          .catch(function () { return false; });
      }
      try {
        var area = document.createElement('textarea');
        area.value = text;
        area.setAttribute('readonly', '');
        area.style.position = 'fixed';
        area.style.top = '-1000px';
        document.body.appendChild(area);
        area.select();
        var ok = document.execCommand('copy');
        document.body.removeChild(area);
        return Promise.resolve(ok);
      } catch (err) {
        return Promise.resolve(false);
      }
    }

    form.addEventListener('submit', function (event) {
      event.preventDefault();

      var inputs = getInputs();
      var firstInvalid = null;

      inputs.forEach(function (input) {
        if (!input.required) return;
        var valid = validateField(input);
        if (!valid && !firstInvalid) { firstInvalid = input; }
      });

      if (firstInvalid) {
        setStatus('Revisa los campos marcados en rojo para poder enviar la consulta.', 'error');
        firstInvalid.focus();
        if (typeof firstInvalid.scrollIntoView === 'function') {
          firstInvalid.scrollIntoView({ block: 'center', behavior: reduceMotion ? 'auto' : 'smooth' });
        }
        return;
      }

      var summary = buildSummary();

      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.style.opacity = '.7';
      }

      copyToClipboard(summary).then(function (copied) {
        var LINKEDIN = 'https://www.linkedin.com/in/amaia-garcia-martin-8909aa61/';
        setStatus(
          '¡Gracias, ' + ((form.querySelector('#nombre').value || '').trim().split(' ')[0] || 'gracias') + '! ' +
          'Tu consulta está completa y validada.\n\n' +
          (copied
            ? 'He copiado el resumen del encargo a tu portapapeles: solo tienes que pegarlo en un mensaje.'
            : 'Abajo tienes el resumen del encargo: cópialo y envíamelo tal cual.') +
          '\nEnvíamelo por LinkedIn y te respondo con presupuesto:\n' + LINKEDIN +
          '\n\n--- Resumen del encargo ---\n' + summary,
          'ok'
        );

        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.style.opacity = '';
          submitBtn.textContent = 'Consulta preparada ✓';
          setTimeout(function () {
            submitBtn.innerHTML = 'Enviar consulta' +
              '<svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" focusable="false">' +
              '<path d="M4 12l16-8-6 16-3-6z" fill="none" stroke="currentColor" stroke-width="1.9" ' +
              'stroke-linejoin="round"/></svg>';
          }, 3200);
        }
      });
    });
  }

  /* ---------------------------------------------------------------------
     9. Año del pie y pequeños ajustes de accesibilidad
     --------------------------------------------------------------------- */
  document.querySelectorAll('a[href^="#"]').forEach(function (link) {
    link.addEventListener('click', function () {
      var id = link.getAttribute('href');
      if (id === '#' || id.length < 2) return;
      var target = document.querySelector(id);
      if (target && !reduceMotion) { target.setAttribute('tabindex', '-1'); }
    });
  });
})();
