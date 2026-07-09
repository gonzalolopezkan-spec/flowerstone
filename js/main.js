/* =========================================================================
   FlowerStone Real Estate — JS compartido (home + alquiler)
   Todo defensivo: cada feature comprueba que sus nodos existen antes de
   actuar, porque alquiler.html no tiene preloader ni contadores.
   ========================================================================= */
(function () {
  'use strict';

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var pointerFine = window.matchMedia('(pointer: fine)').matches;

  /* -----------------------------------------------------------------
     1. Preloader (solo si existe #preloader)
     ----------------------------------------------------------------- */
  function initPreloader() {
    var el = document.getElementById('preloader');
    if (!el) return { done: Promise.resolve() };

    if (reduceMotion) {
      el.remove();
      document.body.classList.remove('is-loading');
      return { done: Promise.resolve() };
    }

    document.body.classList.add('is-loading');

    var resolveDone;
    var done = new Promise(function (resolve) { resolveDone = resolve; });

    /* setTimeout en vez de requestAnimationFrame: rAF se pausa por completo
       en pestañas en segundo plano (p. ej. si el usuario cambia de pestaña
       durante la carga), lo que dejaría el preloader bloqueado para siempre. */
    function lift() {
      el.classList.add('preloader--lift');
      window.setTimeout(function () {
        if (el && el.parentNode) el.parentNode.removeChild(el);
        document.body.classList.remove('is-loading');
        resolveDone();
      }, 1000);
    }

    if (document.readyState === 'complete') {
      window.setTimeout(lift, 500);
    } else {
      window.addEventListener('load', function () {
        window.setTimeout(lift, 500);
      });
    }

    return { done: done };
  }

  /* -----------------------------------------------------------------
     2. Nav: scroll-solid + menú móvil
     ----------------------------------------------------------------- */
  function initNav() {
    var nav = document.getElementById('nav');
    if (!nav) return;

    var solidThreshold = 40;
    function onScroll() {
      if (window.scrollY > solidThreshold) {
        nav.classList.add('nav--solid');
      } else {
        nav.classList.remove('nav--solid');
      }
    }
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });

    var toggle = nav.querySelector('.nav__toggle');
    var links = nav.querySelector('.nav__links');
    if (toggle && links) {
      function closeMenu() {
        nav.classList.remove('nav--menu-open');
        toggle.setAttribute('aria-expanded', 'false');
        document.body.classList.remove('nav-open');
      }
      function openMenu() {
        nav.classList.add('nav--menu-open');
        toggle.setAttribute('aria-expanded', 'true');
        document.body.classList.add('nav-open');
      }
      toggle.addEventListener('click', function () {
        var isOpen = nav.classList.contains('nav--menu-open');
        if (isOpen) closeMenu(); else openMenu();
      });
      links.querySelectorAll('a').forEach(function (a) {
        a.addEventListener('click', closeMenu);
      });
      document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape') closeMenu();
      });
    }
  }

  /* -----------------------------------------------------------------
     3. Reveal on scroll (.reveal, .rule) vía IntersectionObserver
     ----------------------------------------------------------------- */
  function initReveals() {
    var targets = document.querySelectorAll('.reveal, .rule');
    if (!targets.length) return;

    if (!('IntersectionObserver' in window)) {
      targets.forEach(function (t) { t.classList.add('in-view'); });
      return;
    }

    var observer = new IntersectionObserver(function (entries, obs) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });

    targets.forEach(function (t) { observer.observe(t); });
  }

  /* -----------------------------------------------------------------
     4. Contadores [data-count]
     ----------------------------------------------------------------- */
  function initCounters() {
    var counters = document.querySelectorAll('[data-count]');
    if (!counters.length) return;

    function animateCount(el) {
      var target = parseInt(el.getAttribute('data-target'), 10) || 0;
      if (reduceMotion) {
        el.textContent = String(target);
        return;
      }
      var duration = 1200;
      var start = null;

      function easeOutCubic(t) { return 1 - Math.pow(1 - t, 3); }

      function step(timestamp) {
        if (start === null) start = timestamp;
        var progress = Math.min((timestamp - start) / duration, 1);
        var value = Math.round(target * easeOutCubic(progress));
        el.textContent = String(value);
        if (progress < 1) {
          requestAnimationFrame(step);
        } else {
          el.textContent = String(target);
        }
      }
      requestAnimationFrame(step);
    }

    if (!('IntersectionObserver' in window)) {
      counters.forEach(animateCount);
      return;
    }

    var observer = new IntersectionObserver(function (entries, obs) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          animateCount(entry.target);
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.4 });

    counters.forEach(function (c) { observer.observe(c); });
  }

  /* -----------------------------------------------------------------
     5. Botones magnéticos [data-magnetic] — solo pointer:fine, sin reduced motion
     ----------------------------------------------------------------- */
  function initMagnetic() {
    if (reduceMotion || !pointerFine) return;
    var items = document.querySelectorAll('[data-magnetic]');
    if (!items.length) return;

    var maxOffset = 6;
    var strength = 0.4;
    var smoothing = 0.22;

    items.forEach(function (btn) {
      var target = { x: 0, y: 0 };
      var current = { x: 0, y: 0 };
      var raf = null;

      function loop() {
        current.x += (target.x - current.x) * smoothing;
        current.y += (target.y - current.y) * smoothing;
        btn.style.transform = 'translate(' + current.x.toFixed(2) + 'px, ' + current.y.toFixed(2) + 'px)';
        if (Math.abs(target.x - current.x) > 0.05 || Math.abs(target.y - current.y) > 0.05) {
          raf = requestAnimationFrame(loop);
        } else {
          raf = null;
        }
      }

      btn.addEventListener('mousemove', function (e) {
        var rect = btn.getBoundingClientRect();
        var relX = e.clientX - (rect.left + rect.width / 2);
        var relY = e.clientY - (rect.top + rect.height / 2);
        target.x = Math.max(-maxOffset, Math.min(maxOffset, relX * strength));
        target.y = Math.max(-maxOffset, Math.min(maxOffset, relY * strength));
        if (!raf) raf = requestAnimationFrame(loop);
      });

      btn.addEventListener('mouseleave', function () {
        target.x = 0;
        target.y = 0;
        if (!raf) raf = requestAnimationFrame(loop);
      });
    });
  }

  /* -----------------------------------------------------------------
     6. Hero: Ken Burns + intro de titular (solo si existe .hero)
     ----------------------------------------------------------------- */
  function initHeroIntro(preloaderDone) {
    var hero = document.querySelector('.hero');
    if (!hero) return;

    function start() { hero.classList.add('hero--in'); }

    if (preloaderDone && typeof preloaderDone.then === 'function') {
      preloaderDone.then(start);
    } else {
      window.setTimeout(start, 0);
    }
  }

  /* -----------------------------------------------------------------
     7. Miniatura flotante de servicios (desktop only)
     ----------------------------------------------------------------- */
  function initServiceFloatingThumb() {
    if (!pointerFine) return;
    var floating = document.querySelector('.service-row__floating');
    var rows = document.querySelectorAll('.service-row[data-thumb]');
    if (!floating || !rows.length) return;

    var img = floating.querySelector('img');

    rows.forEach(function (row) {
      row.addEventListener('mouseenter', function () {
        var src = row.getAttribute('data-thumb');
        if (img && src) img.src = src;
        floating.classList.add('is-visible');
      });
      row.addEventListener('mousemove', function (e) {
        floating.style.left = e.clientX + 'px';
        floating.style.top = e.clientY + 'px';
      });
      row.addEventListener('mouseleave', function () {
        floating.classList.remove('is-visible');
      });
    });
  }

  /* -----------------------------------------------------------------
     8. Parallax sutil para banda de experiencia y fotos del manifiesto
     ----------------------------------------------------------------- */
  function initParallax() {
    if (reduceMotion) return;

    var experienceMedia = document.querySelector('.experience__media img');
    var manifestoOffset = document.querySelector('.manifiesto__media-offset');
    if (!experienceMedia && !manifestoOffset) return;

    var ticking = false;

    function update() {
      ticking = false;
      var vh = window.innerHeight;

      if (experienceMedia) {
        var band = experienceMedia.closest('.experience');
        if (band) {
          var rect = band.getBoundingClientRect();
          var progress = (rect.top) / vh; /* -ish range */
          var translate = progress * 40; /* px */
          experienceMedia.style.transform = 'translateY(' + translate.toFixed(1) + 'px)';
        }
      }

      if (manifestoOffset) {
        var rect2 = manifestoOffset.getBoundingClientRect();
        var center = rect2.top + rect2.height / 2 - vh / 2;
        var translate2 = center * -0.06;
        manifestoOffset.style.transform = 'translateY(' + translate2.toFixed(1) + 'px)';
      }
    }

    function onScroll() {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(update);
      }
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
    update();
  }

  /* -----------------------------------------------------------------
     Init
     ----------------------------------------------------------------- */
  document.addEventListener('DOMContentLoaded', function () {
    var preloader = initPreloader();
    initNav();
    initReveals();
    initCounters();
    initMagnetic();
    initHeroIntro(preloader.done);
    initServiceFloatingThumb();
    initParallax();
  });
})();
