/* Symposium.education — Landing Page Scripts */

(function () {
  'use strict';

  /* ---- Sticky header ---- */
  var header = document.getElementById('site-header');
  function onScroll() {
    header.classList.toggle('scrolled', window.scrollY > 10);
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---- Mobile navigation ---- */
  var hamburger = document.getElementById('hamburger');
  var navLinks  = document.getElementById('nav-links');

  hamburger.addEventListener('click', function () {
    var isOpen = navLinks.classList.toggle('is-open');
    hamburger.setAttribute('aria-expanded', String(isOpen));
  });

  // Close menu when a link is clicked
  navLinks.querySelectorAll('a').forEach(function (link) {
    link.addEventListener('click', function () {
      navLinks.classList.remove('is-open');
      hamburger.setAttribute('aria-expanded', 'false');
    });
  });

  // Close menu on outside click
  document.addEventListener('click', function (e) {
    if (!header.contains(e.target)) {
      navLinks.classList.remove('is-open');
      hamburger.setAttribute('aria-expanded', 'false');
    }
  });

  /* ---- Footer year ---- */
  var yearEl = document.getElementById('year');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }

  /* ---- Pricing toggle ---- */
  var btnMonthly = document.getElementById('btn-monthly');
  var btnAnnual  = document.getElementById('btn-annual');
  var prices     = document.querySelectorAll('.pricing-card__amount[data-monthly]');

  function setAnnual(isAnnual) {
    prices.forEach(function (el) {
      el.textContent = isAnnual ? el.dataset.annual : el.dataset.monthly;
    });
    btnMonthly.classList.toggle('pricing__toggle-btn--active', !isAnnual);
    btnAnnual.classList.toggle('pricing__toggle-btn--active', isAnnual);
    btnMonthly.setAttribute('aria-pressed', String(!isAnnual));
    btnAnnual.setAttribute('aria-pressed', String(isAnnual));
  }

  btnMonthly.addEventListener('click', function () { setAnnual(false); });
  btnAnnual.addEventListener('click',  function () { setAnnual(true); });

  /* ---- CTA form ---- */
  var ctaForm = document.querySelector('.cta-banner__form');
  if (ctaForm) {
    ctaForm.addEventListener('submit', function (e) {
      e.preventDefault();
      var emailInput = ctaForm.querySelector('input[type="email"]');
      var email = emailInput ? emailInput.value.trim() : '';
      if (!email) return;

      var btn = ctaForm.querySelector('button[type="submit"]');
      btn.textContent = '🎉 You\'re on the list!';
      btn.disabled = true;
      emailInput.value = '';
      emailInput.disabled = true;
    });
  }

  /* ---- Intersection Observer: fade-in on scroll ---- */
  if ('IntersectionObserver' in window) {
    var observeTargets = document.querySelectorAll(
      '.feature-card, .testimonial, .step, .pricing-card, .stat'
    );

    // Mark elements with the fade class (only when JS is available)
    observeTargets.forEach(function (el) {
      el.classList.add('js-fade');
    });

    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 }
    );

    observeTargets.forEach(function (el) { observer.observe(el); });
  }

  /* ---- Smooth anchor scroll for all in-page links ---- */
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      var target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

})();
