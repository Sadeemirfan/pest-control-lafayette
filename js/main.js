/**
 * Acadiana Pest Solutions - Main JavaScript
 * Lafayette, LA | (337) 555-0199
 * Production-ready vanilla JS
 */

'use strict';

/* =========================================================
   CONFIG
   ========================================================= */
var CONFIG = {
  businessName: 'Acadiana Pest Solutions',
  phone: '(337) 555-0199',
  phoneRaw: '+13375550199',
  address: {
    street: '',
    city: 'Lafayette',
    state: 'LA',
    zip: '',
    country: 'US'
  },
  scrolledThreshold: 80,
  revealRootMargin: '-60px',
  counterDuration: 2000,
  testimonialInterval: 5000
};

/* =========================================================
   DOM READY HELPER
   ========================================================= */
function domReady(fn) {
  try {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', fn);
    } else {
      fn();
    }
  } catch (e) {
    console.error('[APS] domReady error:', e);
  }
}

/* =========================================================
   SCHEMA MARKUP - LocalBusiness JSON-LD
   ========================================================= */
function injectSchema() {
  try {
    if (document.querySelector('script[data-aps-schema]')) return;
    var schema = {
      '@context': 'https://schema.org',
      '@type': 'LocalBusiness',
      '@id': window.location.origin + '/#localbusiness',
      name: CONFIG.businessName,
      description: 'Professional pest control services in Lafayette, LA and the Acadiana region. Residential and commercial pest management.',
      url: window.location.origin,
      telephone: CONFIG.phone,
      address: {
        '@type': 'PostalAddress',
        addressLocality: CONFIG.address.city,
        addressRegion: CONFIG.address.state,
        addressCountry: CONFIG.address.country
      },
      geo: {
        '@type': 'GeoCoordinates',
        latitude: '30.2241',
        longitude: '-92.0198'
      },
      areaServed: {
        '@type': 'City',
        name: 'Lafayette'
      },
      priceRange: '$$',
      openingHoursSpecification: [
        {
          '@type': 'OpeningHoursSpecification',
          dayOfWeek: ['Monday','Tuesday','Wednesday','Thursday','Friday'],
          opens: '07:00',
          closes: '18:00'
        },
        {
          '@type': 'OpeningHoursSpecification',
          dayOfWeek: ['Saturday'],
          opens: '08:00',
          closes: '14:00'
        }
      ],
      sameAs: []
    };
    var script = document.createElement('script');
    script.type = 'application/ld+json';
    script.setAttribute('data-aps-schema', 'true');
    script.textContent = JSON.stringify(schema);
    document.head.appendChild(script);
  } catch (e) {
    console.error('[APS] Schema injection error:', e);
  }
}

/* =========================================================
   STICKY HEADER
   ========================================================= */
function initStickyHeader() {
  try {
    var header = document.querySelector('.site-header');
    if (!header) return;
    var ticking = false;
    var lastScrollY = window.scrollY || window.pageYOffset;

    function onScroll() {
      lastScrollY = window.scrollY || window.pageYOffset;
      if (!ticking) {
        window.requestAnimationFrame(function () {
          if (lastScrollY > CONFIG.scrolledThreshold) {
            header.classList.add('scrolled');
          } else {
            header.classList.remove('scrolled');
          }
          ticking = false;
        });
        ticking = true;
      }
    }

    // Set initial state
    if ((window.scrollY || window.pageYOffset) > CONFIG.scrolledThreshold) {
      header.classList.add('scrolled');
    }

    window.addEventListener('scroll', onScroll, { passive: true });
  } catch (e) {
    console.error('[APS] Sticky header error:', e);
  }
}

/* =========================================================
   MOBILE MENU
   ========================================================= */
function initMobileMenu() {
  try {
    var hamburger = document.querySelector('.hamburger') || document.getElementById('hamburgerBtn');
    var nav = document.querySelector('.main-nav') || document.getElementById('mainNav');
    if (!hamburger || !nav) return;

    // Create overlay if it doesn't exist
    var overlay = document.querySelector('.nav-overlay');
    if (!overlay) {
      overlay = document.createElement('div');
      overlay.className = 'nav-overlay';
      overlay.setAttribute('aria-hidden', 'true');
      // Basic overlay styles injected so it works without CSS dependency
      overlay.style.cssText = [
        'position:fixed',
        'top:0',
        'left:0',
        'width:100%',
        'height:100%',
        'background:rgba(0,0,0,0.5)',
        'z-index:998',
        'display:none',
        'opacity:0',
        'transition:opacity 0.3s ease'
      ].join(';');
      document.body.appendChild(overlay);
    }

    function openMenu() {
      hamburger.classList.add('active');
      hamburger.setAttribute('aria-expanded', 'true');
      nav.classList.add('open');
      document.body.classList.add('nav-open');
      overlay.style.display = 'block';
      // Force reflow before adding opacity
      void overlay.offsetHeight;
      overlay.style.opacity = '1';
    }

    function closeMenu() {
      hamburger.classList.remove('active');
      hamburger.setAttribute('aria-expanded', 'false');
      nav.classList.remove('open');
      document.body.classList.remove('nav-open');
      overlay.style.opacity = '0';
      setTimeout(function () {
        overlay.style.display = 'none';
      }, 300);
    }

    function toggleMenu() {
      if (nav.classList.contains('open')) {
        closeMenu();
      } else {
        openMenu();
      }
    }

    hamburger.addEventListener('click', function (e) {
      e.stopPropagation();
      toggleMenu();
    });

    overlay.addEventListener('click', closeMenu);

    // Close on nav link click (but not dropdown toggles)
    var navLinks = nav.querySelectorAll('a:not(.dropdown-toggle)');
    navLinks.forEach(function (link) {
      link.addEventListener('click', function () {
        if (nav.classList.contains('open')) {
          closeMenu();
        }
      });
    });

    // Close on Escape key
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && nav.classList.contains('open')) {
        closeMenu();
        hamburger.focus();
      }
    });

    // Ensure hamburger has aria attributes
    if (!hamburger.hasAttribute('aria-expanded')) {
      hamburger.setAttribute('aria-expanded', 'false');
    }
    if (!hamburger.hasAttribute('aria-label')) {
      hamburger.setAttribute('aria-label', 'Toggle navigation menu');
    }
    if (!hamburger.hasAttribute('aria-controls')) {
      var navId = nav.id || 'mainNav';
      nav.id = navId;
      hamburger.setAttribute('aria-controls', navId);
    }
  } catch (e) {
    console.error('[APS] Mobile menu error:', e);
  }
}

/* =========================================================
   DROPDOWN MENUS
   ========================================================= */
function initDropdowns() {
  try {
    var dropdownParents = document.querySelectorAll('.has-dropdown');
    if (!dropdownParents.length) return;

    function isMobile() {
      return window.innerWidth < 1024;
    }

    function closeAllDropdowns(except) {
      dropdownParents.forEach(function (parent) {
        if (parent !== except) {
          parent.classList.remove('dropdown-open');
          var toggle = parent.querySelector('.dropdown-toggle');
          if (toggle) toggle.setAttribute('aria-expanded', 'false');
        }
      });
    }

    dropdownParents.forEach(function (parent) {
      var toggle = parent.querySelector('.dropdown-toggle');
      var menu = parent.querySelector('.dropdown-menu');

      if (!toggle || !menu) return;

      // Ensure ARIA attributes
      toggle.setAttribute('aria-haspopup', 'true');
      toggle.setAttribute('aria-expanded', 'false');
      if (!menu.id) {
        menu.id = 'dropdown-' + Math.random().toString(36).substr(2, 9);
      }
      toggle.setAttribute('aria-controls', menu.id);

      toggle.addEventListener('click', function (e) {
        e.preventDefault();
        e.stopPropagation();
        var isOpen = parent.classList.contains('dropdown-open');

        if (isMobile()) {
          closeAllDropdowns(isOpen ? null : parent);
          parent.classList.toggle('dropdown-open', !isOpen);
          toggle.setAttribute('aria-expanded', String(!isOpen));
        } else {
          // Desktop: toggle for accessibility
          closeAllDropdowns(isOpen ? null : parent);
          parent.classList.toggle('dropdown-open', !isOpen);
          toggle.setAttribute('aria-expanded', String(!isOpen));
        }
      });

      // Keyboard navigation
      toggle.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          toggle.click();
        }
        if (e.key === 'Escape') {
          parent.classList.remove('dropdown-open');
          toggle.setAttribute('aria-expanded', 'false');
          toggle.focus();
        }
      });

      // Close dropdown when focus leaves
      parent.addEventListener('focusout', function (e) {
        if (!parent.contains(e.relatedTarget)) {
          parent.classList.remove('dropdown-open');
          toggle.setAttribute('aria-expanded', 'false');
        }
      });
    });

    // Close dropdowns when clicking outside
    document.addEventListener('click', function (e) {
      var insideDropdown = e.target.closest ? e.target.closest('.has-dropdown') : null;
      if (!insideDropdown) {
        closeAllDropdowns(null);
      }
    });

    // Close dropdowns on resize to desktop
    window.addEventListener('resize', function () {
      if (!isMobile()) {
        closeAllDropdowns(null);
      }
    }, { passive: true });
  } catch (e) {
    console.error('[APS] Dropdown error:', e);
  }
}
/* =========================================================
   SMOOTH SCROLL
   ========================================================= */
function initSmoothScroll() {
  try {
    document.addEventListener('click', function (e) {
      var target = e.target.closest ? e.target.closest('a[href^="#"]') : null;
      if (!target) return;
      var href = target.getAttribute('href');
      if (!href || href === '#') return;
      var destination = document.querySelector(href);
      if (!destination) return;
      e.preventDefault();
      var headerHeight = 0;
      var header = document.querySelector('.site-header');
      if (header) headerHeight = header.offsetHeight;
      var top = destination.getBoundingClientRect().top + (window.scrollY || window.pageYOffset) - headerHeight - 20;
      window.scrollTo({ top: top, behavior: 'smooth' });
    });
  } catch (e) {
    console.error('[APS] Smooth scroll error:', e);
  }
}

/* =========================================================
   SCROLL REVEAL ANIMATIONS
   ========================================================= */
function initScrollReveal() {
  try {
    var revealElements = document.querySelectorAll('.reveal');
    if (!revealElements.length) return;

    if (!('IntersectionObserver' in window)) {
      // Fallback: show all elements immediately
      revealElements.forEach(function (el) {
        el.classList.add('revealed');
      });
      return;
    }

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          observer.unobserve(entry.target);
        }
      });
    }, {
      rootMargin: CONFIG.revealRootMargin,
      threshold: 0.01
    });

    revealElements.forEach(function (el) {
      observer.observe(el);
    });
  } catch (e) {
    console.error('[APS] Scroll reveal error:', e);
  }
}

/* =========================================================
   FAQ ACCORDION
   ========================================================= */
function initFAQ() {
  try {
    var faqItems = document.querySelectorAll('.faq-item');
    if (!faqItems.length) return;

    faqItems.forEach(function (item) {
      var question = item.querySelector('.faq-question');
      var answer = item.querySelector('.faq-answer');
      if (!question || !answer) return;

      // Accessibility
      question.setAttribute('role', 'button');
      if (!question.hasAttribute('tabindex')) question.setAttribute('tabindex', '0');
      answer.setAttribute('role', 'region');
      answer.style.overflow = 'hidden';
      answer.style.transition = 'max-height 0.35s ease, opacity 0.35s ease';

      if (!item.classList.contains('active')) {
        answer.style.maxHeight = '0';
        answer.style.opacity = '0';
        answer.setAttribute('aria-hidden', 'true');
        question.setAttribute('aria-expanded', 'false');
      } else {
        answer.style.maxHeight = answer.scrollHeight + 'px';
        answer.style.opacity = '1';
        answer.setAttribute('aria-hidden', 'false');
        question.setAttribute('aria-expanded', 'true');
      }

      function toggleItem() {
        var isActive = item.classList.contains('active');

        // Close all others
        faqItems.forEach(function (other) {
          if (other !== item && other.classList.contains('active')) {
            var otherAnswer = other.querySelector('.faq-answer');
            var otherQuestion = other.querySelector('.faq-question');
            other.classList.remove('active');
            if (otherAnswer) {
              otherAnswer.style.maxHeight = '0';
              otherAnswer.style.opacity = '0';
              otherAnswer.setAttribute('aria-hidden', 'true');
            }
            if (otherQuestion) otherQuestion.setAttribute('aria-expanded', 'false');
          }
        });

        if (isActive) {
          item.classList.remove('active');
          answer.style.maxHeight = '0';
          answer.style.opacity = '0';
          answer.setAttribute('aria-hidden', 'true');
          question.setAttribute('aria-expanded', 'false');
        } else {
          item.classList.add('active');
          answer.style.maxHeight = answer.scrollHeight + 'px';
          answer.style.opacity = '1';
          answer.setAttribute('aria-hidden', 'false');
          question.setAttribute('aria-expanded', 'true');
        }
      }

      question.addEventListener('click', toggleItem);
      question.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          toggleItem();
        }
      });
    });
  } catch (e) {
    console.error('[APS] FAQ error:', e);
  }
}

/* =========================================================
   CONTACT FORM
   ========================================================= */
function initContactForm() {
  try {
    var form = document.querySelector('.contact-form');
    if (!form) return;

    var successMsg = document.querySelector('.form-success');

    function showFieldError(field, message) {
      var existing = field.parentElement.querySelector('.field-error');
      if (existing) existing.remove();
      field.classList.add('input-error');
      var err = document.createElement('span');
      err.className = 'field-error';
      err.setAttribute('role', 'alert');
      err.style.cssText = 'color:#c0392b;font-size:0.8rem;display:block;margin-top:4px;';
      err.textContent = message;
      field.parentElement.appendChild(err);
    }

    function clearFieldError(field) {
      field.classList.remove('input-error');
      var existing = field.parentElement.querySelector('.field-error');
      if (existing) existing.remove();
    }

    function validateEmail(email) {
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }

    function validatePhone(phone) {
      return /^[\d\s\(\)\-\+]{7,}$/.test(phone);
    }

    // Live validation on blur
    var inputs = form.querySelectorAll('input, textarea, select');
    inputs.forEach(function (input) {
      input.addEventListener('blur', function () {
        if (input.hasAttribute('required') && !input.value.trim()) {
          showFieldError(input, 'This field is required.');
        } else if (input.type === 'email' && input.value && !validateEmail(input.value)) {
          showFieldError(input, 'Please enter a valid email address.');
        } else if ((input.type === 'tel' || input.name === 'phone') && input.value && !validatePhone(input.value)) {
          showFieldError(input, 'Please enter a valid phone number.');
        } else {
          clearFieldError(input);
        }
      });
      input.addEventListener('input', function () {
        if (input.classList.contains('input-error') && input.value.trim()) {
          clearFieldError(input);
        }
      });
    });

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var isValid = true;
      var firstError = null;

      inputs.forEach(function (input) {
        clearFieldError(input);
        if (input.hasAttribute('required') && !input.value.trim()) {
          showFieldError(input, 'This field is required.');
          isValid = false;
          if (!firstError) firstError = input;
        } else if (input.type === 'email' && input.value && !validateEmail(input.value)) {
          showFieldError(input, 'Please enter a valid email address.');
          isValid = false;
          if (!firstError) firstError = input;
        } else if ((input.type === 'tel' || input.name === 'phone') && input.value && !validatePhone(input.value)) {
          showFieldError(input, 'Please enter a valid phone number.');
          isValid = false;
          if (!firstError) firstError = input;
        }
      });

      if (!isValid) {
        if (firstError) firstError.focus();
        return;
      }

      // Collect form data
      var formData = {};
      inputs.forEach(function (input) {
        if (input.name) formData[input.name] = input.value.trim();
      });
      console.log('[APS] Form submitted:', formData);

      // Show success
      if (successMsg) {
        successMsg.style.display = 'block';
        successMsg.setAttribute('role', 'alert');
        successMsg.focus();
      } else {
        var msg = document.createElement('div');
        msg.className = 'form-success';
        msg.setAttribute('role', 'alert');
        msg.style.cssText = 'background:#27ae60;color:#fff;padding:1rem;border-radius:4px;margin-top:1rem;';
        msg.textContent = 'Thank you! We\'ll be in touch within 24 hours.';
        form.parentElement.insertBefore(msg, form.nextSibling);
        msg.focus();
      }

      form.reset();
      form.style.display = 'none';
    });
  } catch (e) {
    console.error('[APS] Contact form error:', e);
  }
}

/* =========================================================
   COUNTER ANIMATION
   ========================================================= */
function initCounters() {
  try {
    var counters = document.querySelectorAll('.stat-number');
    if (!counters.length) return;

    if (!('IntersectionObserver' in window)) {
      counters.forEach(function (counter) {
        counter.textContent = counter.getAttribute('data-target') || counter.textContent;
      });
      return;
    }

    function animateCounter(el) {
      var rawTarget = el.getAttribute('data-target') || el.textContent.replace(/[^0-9.]/g, '');
      var target = parseFloat(rawTarget);
      if (isNaN(target)) return;
      var suffix = el.getAttribute('data-suffix') || '';
      var prefix = el.getAttribute('data-prefix') || '';
      var isDecimal = rawTarget.indexOf('.') !== -1;
      var decimalPlaces = isDecimal ? (rawTarget.split('.')[1] || '').length : 0;
      var startTime = null;
      var duration = CONFIG.counterDuration;

      function easeOutQuad(t) { return t * (2 - t); }

      function step(timestamp) {
        if (!startTime) startTime = timestamp;
        var elapsed = timestamp - startTime;
        var progress = Math.min(elapsed / duration, 1);
        var easedProgress = easeOutQuad(progress);
        var current = easedProgress * target;
        var displayValue = isDecimal ? current.toFixed(decimalPlaces) : Math.floor(current);
        el.textContent = prefix + displayValue + suffix;
        if (progress < 1) {
          window.requestAnimationFrame(step);
        } else {
          el.textContent = prefix + (isDecimal ? target.toFixed(decimalPlaces) : target) + suffix;
        }
      }

      window.requestAnimationFrame(step);
    }

    var counterObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          counterObserver.unobserve(entry.target);
        }
      });
    }, { rootMargin: '0px', threshold: 0.3 });

    counters.forEach(function (counter) {
      // Store original text as data-target if not set
      if (!counter.hasAttribute('data-target')) {
        counter.setAttribute('data-target', counter.textContent.replace(/[^0-9.]/g, ''));
      }
      counter.textContent = counter.getAttribute('data-prefix') || '' + '0' + (counter.getAttribute('data-suffix') || '');
      counterObserver.observe(counter);
    });
  } catch (e) {
    console.error('[APS] Counter animation error:', e);
  }
}

/* =========================================================
   TESTIMONIAL CAROUSEL
   ========================================================= */
function initTestimonialCarousel() {
  try {
    var carousel = document.querySelector('.testimonial-carousel');
    if (!carousel) return;
    var slides = carousel.querySelectorAll('.testimonial-slide, .testimonial-item');
    if (slides.length <= 1) return;

    var prevBtn = carousel.querySelector('.carousel-prev, .testimonial-prev');
    var nextBtn = carousel.querySelector('.carousel-next, .testimonial-next');
    var dotsContainer = carousel.querySelector('.carousel-dots');
    var current = 0;
    var total = slides.length;
    var autoTimer = null;

    // Create dots if container exists but no dots
    var dots = [];
    if (dotsContainer) {
      slides.forEach(function (_, i) {
        var dot = document.createElement('button');
        dot.className = 'carousel-dot';
        dot.setAttribute('aria-label', 'Go to testimonial ' + (i + 1));
        dot.style.cssText = 'width:10px;height:10px;border-radius:50%;border:none;margin:0 4px;cursor:pointer;background:#ccc;transition:background 0.3s;';
        dot.addEventListener('click', function () { goTo(i); resetTimer(); });
        dotsContainer.appendChild(dot);
        dots.push(dot);
      });
    }

    function showSlide(index) {
      slides.forEach(function (slide, i) {
        slide.style.display = i === index ? 'block' : 'none';
        slide.setAttribute('aria-hidden', String(i !== index));
      });
      dots.forEach(function (dot, i) {
        dot.style.background = i === index ? '#2c7a2c' : '#ccc';
        dot.setAttribute('aria-current', String(i === index));
      });
    }

    function goTo(index) {
      current = (index + total) % total;
      showSlide(current);
    }

    function next() { goTo(current + 1); }
    function prev() { goTo(current - 1); }

    function startTimer() {
      autoTimer = setInterval(next, CONFIG.testimonialInterval);
    }

    function resetTimer() {
      clearInterval(autoTimer);
      startTimer();
    }

    if (nextBtn) {
      nextBtn.addEventListener('click', function () { next(); resetTimer(); });
    }
    if (prevBtn) {
      prevBtn.addEventListener('click', function () { prev(); resetTimer(); });
    }

    // Keyboard support
    carousel.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowRight') { next(); resetTimer(); }
      if (e.key === 'ArrowLeft') { prev(); resetTimer(); }
    });

    // Pause on hover
    carousel.addEventListener('mouseenter', function () { clearInterval(autoTimer); });
    carousel.addEventListener('mouseleave', startTimer);

    // Touch support
    var touchStartX = 0;
    var touchEndX = 0;
    carousel.addEventListener('touchstart', function (e) {
      touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });
    carousel.addEventListener('touchend', function (e) {
      touchEndX = e.changedTouches[0].screenX;
      var diff = touchStartX - touchEndX;
      if (Math.abs(diff) > 50) {
        if (diff > 0) { next(); } else { prev(); }
        resetTimer();
      }
    }, { passive: true });

    showSlide(0);
    startTimer();
  } catch (e) {
    console.error('[APS] Testimonial carousel error:', e);
  }
}

/* =========================================================
   ACTIVE NAV LINK
   ========================================================= */
function initActiveNav() {
  try {
    var currentPath = window.location.pathname.replace(/\/+$/, '') || '/';
    var currentPage = currentPath.split('/').pop() || 'index.html';
    var navLinks = document.querySelectorAll('.main-nav a, #mainNav a');

    navLinks.forEach(function (link) {
      var href = link.getAttribute('href');
      if (!href) return;
      var linkPage = href.split('/').pop().split('?')[0].split('#')[0] || 'index.html';

      var isActive = false;
      if (href === currentPath ||
          linkPage === currentPage ||
          (currentPage === '' && (href === '/' || href === 'index.html')) ||
          (currentPage === 'index.html' && href === '/')) {
        isActive = true;
      }

      if (isActive) {
        link.classList.add('active');
        link.setAttribute('aria-current', 'page');
        // If inside a dropdown, also activate the parent
        var parentDropdown = link.closest('.has-dropdown');
        if (parentDropdown) {
          parentDropdown.classList.add('active');
          var parentToggle = parentDropdown.querySelector('.dropdown-toggle');
          if (parentToggle) parentToggle.classList.add('active');
        }
      }
    });
  } catch (e) {
    console.error('[APS] Active nav error:', e);
  }
}

/* =========================================================
   PHONE LINK TRACKING
   ========================================================= */
function initPhoneTracking() {
  try {
    var phoneLinks = document.querySelectorAll('a[href^="tel:"]');
    phoneLinks.forEach(function (link) {
      link.addEventListener('click', function (e) {
        var number = link.getAttribute('href').replace('tel:', '');
        console.log('[APS] Phone click tracked:', number, '| Page:', window.location.pathname, '| Time:', new Date().toISOString());
        // Google Analytics / gtag event (if available)
        if (typeof gtag === 'function') {
          try {
            gtag('event', 'phone_click', {
              event_category: 'Contact',
              event_label: number,
              value: 1
            });
          } catch (gtagErr) {
            console.warn('[APS] gtag error:', gtagErr);
          }
        }
        // Google Analytics (if ga is available)
        if (typeof ga === 'function') {
          try {
            ga('send', 'event', 'Contact', 'Phone Click', number);
          } catch (gaErr) {
            console.warn('[APS] ga error:', gaErr);
          }
        }
      });
    });
  } catch (e) {
    console.error('[APS] Phone tracking error:', e);
  }
}

/* =========================================================
   UTILITY: Debounce
   ========================================================= */
function debounce(fn, wait) {
  var timeout;
  return function () {
    var args = arguments;
    var ctx = this;
    clearTimeout(timeout);
    timeout = setTimeout(function () { fn.apply(ctx, args); }, wait);
  };
}

/* =========================================================
   UTILITY: Lazy load images
   ========================================================= */
function initLazyImages() {
  try {
    var lazyImages = document.querySelectorAll('img[data-src]');
    if (!lazyImages.length) return;
    if (!('IntersectionObserver' in window)) {
      lazyImages.forEach(function (img) {
        img.src = img.getAttribute('data-src');
      });
      return;
    }
    var imgObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          var img = entry.target;
          img.src = img.getAttribute('data-src');
          if (img.hasAttribute('data-srcset')) {
            img.srcset = img.getAttribute('data-srcset');
          }
          img.removeAttribute('data-src');
          imgObserver.unobserve(img);
        }
      });
    }, { rootMargin: '200px' });
    lazyImages.forEach(function (img) { imgObserver.observe(img); });
  } catch (e) {
    console.error('[APS] Lazy images error:', e);
  }
}

/* =========================================================
   INIT - Entry Point
   ========================================================= */
domReady(function () {
  'use strict';
  try {
    injectSchema();
    initStickyHeader();
    initMobileMenu();
    initDropdowns();
    initSmoothScroll();
    initScrollReveal();
    initFAQ();
    initContactForm();
    initCounters();
    initTestimonialCarousel();
    initActiveNav();
    initPhoneTracking();
    initLazyImages();
    console.log('[APS] Acadiana Pest Solutions JS initialized successfully.');
  } catch (e) {
    console.error('[APS] Initialization error:', e);
  }
});
