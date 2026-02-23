/**
 * Acadiana Pest Solutions - Main JavaScript
 * Production-ready JS for pest control lead generation site
 */

'use strict';

// ============================================================
// CONSTANTS & CONFIGURATION
// ============================================================

const CONFIG = {
  businessName: 'Acadiana Pest Solutions',
  phone: '(337) 555-0199',
  phoneLink: 'tel:+13375550199',
  address: {
    street: '100 Kaliste Saloom Rd',
    city: 'Lafayette',
    state: 'LA',
    zip: '70508',
    region: 'Acadiana'
  },
  geo: {
    latitude: '30.2241',
    longitude: '-92.0198'
  },
  services: [
    'Termite Control',
    'Bed Bug Treatment',
    'Rodent Control',
    'Ant Extermination',
    'Cockroach Control',
    'Mosquito Control'
  ],
  serviceAreas: [
    'Lafayette', 'Scott', 'Broussard', 'Youngsville',
    'Carencro', 'Duson', 'Breaux Bridge'
  ],
  scrollThreshold: 80,
  animationThreshold: 0.15,
  animationRootMargin: '0px 0px -60px 0px'
};

// ============================================================
// DOM READY HELPER
// ============================================================

function domReady(fn) {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', fn);
  } else {
    fn();
  }
}

// ============================================================
// SCHEMA MARKUP - LocalBusiness JSON-LD
// ============================================================

function injectSchemaMarkup() {
  const existingSchema = document.querySelector('script[data-schema="local-business"]');
  if (existingSchema) return;

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'PestControlService',
    '@id': 'https://acadianapestsolutions.com/#business',
    name: CONFIG.businessName,
    description: 'Professional pest control services in Lafayette, LA and the Acadiana region. Specializing in termite control, bed bug treatment, rodent control, ant extermination, cockroach control, and mosquito control.',
    url: 'https://acadianapestsolutions.com',
    telephone: CONFIG.phoneLink.replace('tel:', ''),
    priceRange: '$$',
    image: 'https://acadianapestsolutions.com/images/logo.png',
    address: {
      '@type': 'PostalAddress',
      streetAddress: CONFIG.address.street,
      addressLocality: CONFIG.address.city,
      addressRegion: CONFIG.address.state,
      postalCode: CONFIG.address.zip,
      addressCountry: 'US'
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: CONFIG.geo.latitude,
      longitude: CONFIG.geo.longitude
    },
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
        opens: '07:00',
        closes: '18:00'
      },
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: 'Saturday',
        opens: '08:00',
        closes: '14:00'
      }
    ],
    areaServed: CONFIG.serviceAreas.map(area => ({
      '@type': 'City',
      name: area,
      containedInPlace: {
        '@type': 'State',
        name: 'Louisiana'
      }
    })),
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'Pest Control Services',
      itemListElement: CONFIG.services.map((service, index) => ({
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: service,
          provider: {
            '@type': 'LocalBusiness',
            name: CONFIG.businessName
          }
        },
        position: index + 1
      }))
    },
    sameAs: [
      'https://www.facebook.com/acadianapestsolutions',
      'https://www.google.com/maps?cid=acadianapestsolutions'
    ]
  };

  // Inject page-specific schema enhancements
  const pageSchema = getPageSpecificSchema();
  const finalSchema = pageSchema ? [schema, pageSchema] : schema;

  const scriptEl = document.createElement('script');
  scriptEl.type = 'application/ld+json';
  scriptEl.setAttribute('data-schema', 'local-business');
  scriptEl.textContent = JSON.stringify(finalSchema, null, 2);
  document.head.appendChild(scriptEl);
}

function getPageSpecificSchema() {
  const path = window.location.pathname;
  const filename = path.split('/').pop() || 'index.html';

  const servicePageMap = {
    'termite-control.html': {
      name: 'Termite Control',
      description: 'Professional termite inspection and treatment services in Lafayette, LA and Acadiana.'
    },
    'bed-bug-treatment.html': {
      name: 'Bed Bug Treatment',
      description: 'Effective bed bug extermination and prevention services in the Acadiana region.'
    },
    'rodent-control.html': {
      name: 'Rodent Control',
      description: 'Expert rodent removal and exclusion services for homes and businesses in Lafayette, LA.'
    },
    'ant-extermination.html': {
      name: 'Ant Extermination',
      description: 'Comprehensive ant control and extermination services in Lafayette and surrounding areas.'
    },
    'cockroach-control.html': {
      name: 'Cockroach Control',
      description: 'Professional cockroach elimination and prevention services in the Acadiana region.'
    },
    'mosquito-control.html': {
      name: 'Mosquito Control',
      description: 'Effective mosquito reduction and prevention services for Acadiana homes and yards.'
    }
  };

  const areaPageMap = {
    'scott.html': 'Scott',
    'broussard.html': 'Broussard',
    'youngsville.html': 'Youngsville',
    'carencro.html': 'Carencro',
    'duson.html': 'Duson',
    'breaux-bridge.html': 'Breaux Bridge'
  };

  if (servicePageMap[filename]) {
    const service = servicePageMap[filename];
    return {
      '@context': 'https://schema.org',
      '@type': 'Service',
      name: service.name,
      description: service.description,
      provider: {
        '@type': 'LocalBusiness',
        name: CONFIG.businessName,
        telephone: CONFIG.phoneLink.replace('tel:', ''),
        address: {
          '@type': 'PostalAddress',
          addressLocality: CONFIG.address.city,
          addressRegion: CONFIG.address.state,
          addressCountry: 'US'
        }
      },
      areaServed: {
        '@type': 'State',
        name: 'Louisiana'
      }
    };
  }

  if (areaPageMap[filename]) {
    const city = areaPageMap[filename];
    return {
      '@context': 'https://schema.org',
      '@type': 'LocalBusiness',
      name: `${CONFIG.businessName} - ${city}, LA`,
      description: `Professional pest control services in ${city}, Louisiana. Serving the entire Acadiana region.`,
      telephone: CONFIG.phoneLink.replace('tel:', ''),
      areaServed: {
        '@type': 'City',
        name: city,
        containedInPlace: {
          '@type': 'State',
          name: 'Louisiana'
        }
      }
    };
  }

  return null;
}

// ============================================================
// HEADER & NAVIGATION
// ============================================================

function initStickyHeader() {
  const header = document.querySelector('.site-header');
  if (!header) return;

  let lastScrollY = window.scrollY;
  let ticking = false;

  function updateHeader() {
    const currentScrollY = window.scrollY;

    if (currentScrollY > CONFIG.scrollThreshold) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }

    lastScrollY = currentScrollY;
    ticking = false;
  }

  window.addEventListener('scroll', function () {
    if (!ticking) {
      window.requestAnimationFrame(updateHeader);
      ticking = true;
    }
  }, { passive: true });
}

function initMobileMenu() {
  const hamburger = document.querySelector('.hamburger-btn');
  const navMenu = document.querySelector('.nav-menu');
  const navOverlay = document.querySelector('.nav-overlay');
  const body = document.body;

  if (!hamburger || !navMenu) return;

  function openMenu() {
    hamburger.setAttribute('aria-expanded', 'true');
    hamburger.classList.add('is-active');
    navMenu.classList.add('is-open');
    if (navOverlay) navOverlay.classList.add('is-visible');
    body.classList.add('menu-open');
    // Trap focus within menu
    navMenu.setAttribute('aria-hidden', 'false');
  }

  function closeMenu() {
    hamburger.setAttribute('aria-expanded', 'false');
    hamburger.classList.remove('is-active');
    navMenu.classList.remove('is-open');
    if (navOverlay) navOverlay.classList.remove('is-visible');
    body.classList.remove('menu-open');
    navMenu.setAttribute('aria-hidden', 'true');
    // Close all open dropdowns
    closeAllDropdowns();
  }

  hamburger.addEventListener('click', function () {
    const isOpen = hamburger.classList.contains('is-active');
    if (isOpen) {
      closeMenu();
    } else {
      openMenu();
    }
  });

  // Close menu when clicking overlay
  if (navOverlay) {
    navOverlay.addEventListener('click', closeMenu);
  }

  // Close menu on Escape key
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && navMenu.classList.contains('is-open')) {
      closeMenu();
      hamburger.focus();
    }
  });

  // Close menu when clicking a non-dropdown nav link
  const navLinks = navMenu.querySelectorAll('a:not(.dropdown-toggle)');
  navLinks.forEach(function (link) {
    link.addEventListener('click', function () {
      if (window.innerWidth < 992) {
        closeMenu();
      }
    });
  });
}

// ============================================================
// DROPDOWN MENUS
// ============================================================

function initDropdowns() {
  const dropdownItems = document.querySelectorAll('.nav-item.has-dropdown');

  dropdownItems.forEach(function (item) {
    const toggle = item.querySelector('.dropdown-toggle');
    const dropdown = item.querySelector('.dropdown-menu');

    if (!toggle || !dropdown) return;

    // Desktop: hover behavior
    if (window.innerWidth >= 992) {
      item.addEventListener('mouseenter', function () {
        openDropdown(item, dropdown, toggle);
      });

      item.addEventListener('mouseleave', function () {
        closeDropdown(item, dropdown, toggle);
      });
    }

    // Click/touch behavior (works for both mobile and desktop keyboard nav)
    toggle.addEventListener('click', function (e) {
      e.preventDefault();
      e.stopPropagation();

      const isOpen = item.classList.contains('dropdown-open');

      // Close all other dropdowns first
      closeAllDropdowns();

      if (!isOpen) {
        openDropdown(item, dropdown, toggle);
      }
    });

    // Keyboard navigation
    toggle.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        toggle.click();
      }
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        const firstLink = dropdown.querySelector('a');
        if (firstLink) firstLink.focus();
      }
    });

    // Allow tabbing through dropdown items
    const dropdownLinks = dropdown.querySelectorAll('a');
    dropdownLinks.forEach(function (link, index) {
      link.addEventListener('keydown', function (e) {
        if (e.key === 'ArrowDown') {
          e.preventDefault();
          const next = dropdownLinks[index + 1];
          if (next) next.focus();
        }
        if (e.key === 'ArrowUp') {
          e.preventDefault();
          if (index === 0) {
            toggle.focus();
          } else {
            const prev = dropdownLinks[index - 1];
            if (prev) prev.focus();
          }
        }
        if (e.key === 'Escape') {
          closeDropdown(item, dropdown, toggle);
          toggle.focus();
        }
        if (e.key === 'Tab' && index === dropdownLinks.length - 1 && !e.shiftKey) {
          closeDropdown(item, dropdown, toggle);
        }
      });
    });
  });

  // Close dropdowns when clicking outside
  document.addEventListener('click', function (e) {
    if (!e.target.closest('.nav-item.has-dropdown')) {
      closeAllDropdowns();
    }
  });

  // Re-initialize on resize
  let resizeTimer;
  window.addEventListener('resize', function () {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(function () {
      closeAllDropdowns();
    }, 250);
  });
}

function openDropdown(item, dropdown, toggle) {
  item.classList.add('dropdown-open');
  dropdown.setAttribute('aria-hidden', 'false');
  toggle.setAttribute('aria-expanded', 'true');
}

function closeDropdown(item, dropdown, toggle) {
  item.classList.remove('dropdown-open');
  dropdown.setAttribute('aria-hidden', 'true');
  toggle.setAttribute('aria-expanded', 'false');
}

function closeAllDropdowns() {
  const openDropdowns = document.querySelectorAll('.nav-item.has-dropdown.dropdown-open');
  openDropdowns.forEach(function (item) {
    const toggle = item.querySelector('.dropdown-toggle');
    const dropdown = item.querySelector('.dropdown-menu');
    if (toggle && dropdown) {
      closeDropdown(item, dropdown, toggle);
    }
  });
}

// ============================================================
// ACTIVE NAV LINK
// ============================================================

function setActiveNavLink() {
  const currentPath = window.location.pathname;
  const currentFile = currentPath.split('/').pop() || 'index.html';

  const navLinks = document.querySelectorAll('.nav-menu a');

  navLinks.forEach(function (link) {
    const href = link.getAttribute('href');
    if (!href) return;

    const linkFile = href.split('/').pop();

    // Remove existing active state
    link.classList.remove('active');
    link.removeAttribute('aria-current');

    // Check for exact match
    if (linkFile === currentFile) {
      link.classList.add('active');
      link.setAttribute('aria-current', 'page');

      // Also mark parent dropdown as active if applicable
      const parentDropdown = link.closest('.has-dropdown');
      if (parentDropdown) {
        const parentToggle = parentDropdown.querySelector('.dropdown-toggle');
        if (parentToggle) {
          parentToggle.classList.add('active');
        }
      }
    }

    // Handle index / home page
    if ((currentFile === '' || currentFile === 'index.html') &&
        (href === 'index.html' || href === '/' || href === './')) {
      link.classList.add('active');
      link.setAttribute('aria-current', 'page');
    }
  });
}

// ============================================================
// SMOOTH SCROLL
// ============================================================

function initSmoothScroll() {
  document.addEventListener('click', function (e) {
    const target = e.target.closest('a[href^="#"]');
    if (!target) return;

    const hash = target.getAttribute('href');
    if (hash === '#') return;

    const destination = document.querySelector(hash);
    if (!destination) return;

    e.preventDefault();

    const header = document.querySelector('.site-header');
    const headerHeight = header ? header.offsetHeight : 0;
    const offset = 20;

    const targetTop = destination.getBoundingClientRect().top + window.scrollY - headerHeight - offset;

    window.scrollTo({
      top: targetTop,
      behavior: 'smooth'
    });

    // Update URL hash without jumping
    if (history.pushState) {
      history.pushState(null, null, hash);
    }

    // Set focus to target for accessibility
    destination.setAttribute('tabindex', '-1');
    destination.focus({ preventScroll: true });
  });
}

// ============================================================
// FAQ ACCORDION
// ============================================================

function initFAQAccordion() {
  const faqItems = document.querySelectorAll('.faq-item');

  if (faqItems.length === 0) return;

  faqItems.forEach(function (item, index) {
    const question = item.querySelector('.faq-question');
    const answer = item.querySelector('.faq-answer');

    if (!question || !answer) return;

    // Set initial ARIA attributes
    const answerId = `faq-answer-${index}`;
    const questionId = `faq-question-${index}`;

    question.setAttribute('id', questionId);
    question.setAttribute('aria-controls', answerId);
    question.setAttribute('aria-expanded', 'false');
    question.setAttribute('role', 'button');
    question.setAttribute('tabindex', '0');

    answer.setAttribute('id', answerId);
    answer.setAttribute('aria-labelledby', questionId);
    answer.setAttribute('role', 'region');
    answer.setAttribute('hidden', 'true');

    function toggleFAQ() {
      const isOpen = item.classList.contains('is-open');

      // Close all other items (optional: set to false for independent behavior)
      faqItems.forEach(function (otherItem) {
        if (otherItem !== item) {
          closeFAQItem(otherItem);
        }
      });

      if (isOpen) {
        closeFAQItem(item);
      } else {
        openFAQItem(item);
      }
    }

    question.addEventListener('click', toggleFAQ);

    question.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        toggleFAQ();
      }
    });
  });
}

function openFAQItem(item) {
  const question = item.querySelector('.faq-question');
  const answer = item.querySelector('.faq-answer');

  if (!question || !answer) return;

  item.classList.add('is-open');
  question.setAttribute('aria-expanded', 'true');
  answer.removeAttribute('hidden');

  // Animate height
  answer.style.maxHeight = answer.scrollHeight + 'px';
}

function closeFAQItem(item) {
  const question = item.querySelector('.faq-question');
  const answer = item.querySelector('.faq-answer');

  if (!question || !answer) return;

  item.classList.remove('is-open');
  question.setAttribute('aria-expanded', 'false');
  answer.style.maxHeight = '0';

  // Add hidden after transition
  const transitionDuration = parseFloat(getComputedStyle(answer).transitionDuration) * 1000 || 300;
  setTimeout(function () {
    if (!item.classList.contains('is-open')) {
      answer.setAttribute('hidden', 'true');
    }
  }, transitionDuration);
}

// ============================================================
// SCROLL REVEAL ANIMATIONS
// ============================================================

function initScrollReveal() {
  if (!('IntersectionObserver' in window)) {
    // Fallback: show all elements immediately
    const elements = document.querySelectorAll('[data-reveal]');
    elements.forEach(function (el) {
      el.classList.add('is-revealed');
    });
    return;
  }

  const revealObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        const el = entry.target;
        const delay = el.getAttribute('data-reveal-delay') || '0';

        setTimeout(function () {
          el.classList.add('is-revealed');
        }, parseInt(delay, 10));

        revealObserver.unobserve(el);
      }
    });
  }, {
    threshold: CONFIG.animationThreshold,
    rootMargin: CONFIG.animationRootMargin
  });

  const elementsToReveal = document.querySelectorAll('[data-reveal]');
  elementsToReveal.forEach(function (el) {
    revealObserver.observe(el);
  });

  // Auto-add reveal to common elements if not already tagged
  autoTagRevealElements();
}

function autoTagRevealElements() {
  if (!('IntersectionObserver' in window)) return;

  const autoRevealSelectors = [
    '.service-card',
    '.area-card',
    '.feature-item',
    '.testimonial-card',
    '.blog-card',
    '.stat-item',
    '.process-step'
  ];

  const autoRevealObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-revealed');
        autoRevealObserver.unobserve(entry.target);
      }
    });
  }, {
    threshold: CONFIG.animationThreshold,
    rootMargin: CONFIG.animationRootMargin
  });

  autoRevealSelectors.forEach(function (selector) {
    const elements = document.querySelectorAll(selector);
    elements.forEach(function (el, index) {
      if (!el.hasAttribute('data-reveal')) {
        el.classList.add('reveal-element');
        el.style.transitionDelay = (index * 0.08) + 's';
        autoRevealObserver.observe(el);
      }
    });
  });
}

// ============================================================
// MOBILE CTA BAR
// ============================================================

function initMobileCTABar() {
  const ctaBar = document.querySelector('.mobile-cta-bar');
  if (!ctaBar) return;

  let lastScrollY = window.scrollY;
  let ticking = false;
  const showAfter = 300; // Show CTA bar after scrolling 300px

  function updateCTABar() {
    const currentScrollY = window.scrollY;

    if (currentScrollY > showAfter) {
      ctaBar.classList.add('is-visible');
    } else {
      ctaBar.classList.remove('is-visible');
    }

    lastScrollY = currentScrollY;
    ticking = false;
  }

  window.addEventListener('scroll', function () {
    if (!ticking) {
      window.requestAnimationFrame(updateCTABar);
      ticking = true;
    }
  }, { passive: true });

  // Initial check
  updateCTABar();
}

// ============================================================
// LAZY LOADING
// ============================================================

function initLazyLoading() {
  // Use native lazy loading where supported
  const images = document.querySelectorAll('img:not([loading])');
  images.forEach(function (img) {
    if (!img.hasAttribute('loading')) {
      img.setAttribute('loading', 'lazy');
    }
  });

  // IntersectionObserver fallback for browsers without native lazy loading
  if (!('loading' in HTMLImageElement.prototype)) {
    if (!('IntersectionObserver' in window)) return;

    const lazyImages = document.querySelectorAll('img[data-src]');

    const imageObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          const img = entry.target;
          const src = img.getAttribute('data-src');

          if (src) {
            img.src = src;
            img.removeAttribute('data-src');
            img.classList.add('loaded');
          }

          imageObserver.unobserve(img);
        }
      });
    }, {
      rootMargin: '200px 0px'
    });

    lazyImages.forEach(function (img) {
      imageObserver.observe(img);
    });
  }
}

// ============================================================
// FORM VALIDATION
// ============================================================

function initFormValidation() {
  const contactForms = document.querySelectorAll('.contact-form, form[data-validate]');

  contactForms.forEach(function (form) {
    // Real-time validation on blur
    const inputs = form.querySelectorAll('input, textarea, select');
    inputs.forEach(function (input) {
      input.addEventListener('blur', function () {
        validateField(input);
      });

      input.addEventListener('input', function () {
        if (input.classList.contains('is-invalid')) {
          validateField(input);
        }
      });
    });

    // Form submit validation
    form.addEventListener('submit', function (e) {
      e.preventDefault();

      let isValid = true;
      inputs.forEach(function (input) {
        if (!validateField(input)) {
          isValid = false;
        }
      });

      if (isValid) {
        handleFormSubmit(form);
      } else {
        // Focus first invalid field
        const firstInvalid = form.querySelector('.is-invalid');
        if (firstInvalid) firstInvalid.focus();
      }
    });
  });
}

function validateField(field) {
  const value = field.value.trim();
  const type = field.type;
  const name = field.name;
  const required = field.hasAttribute('required');
  let errorMessage = '';

  // Remove existing error
  clearFieldError(field);

  if (required && !value) {
    errorMessage = getFieldLabel(field) + ' is required.';
  } else if (value) {
    switch (type) {
      case 'email':
        if (!isValidEmail(value)) {
          errorMessage = 'Please enter a valid email address.';
        }
        break;
      case 'tel':
        if (!isValidPhone(value)) {
          errorMessage = 'Please enter a valid phone number.';
        }
        break;
      case 'text':
        if (name === 'name' || name === 'full_name') {
          if (value.length < 2) {
            errorMessage = 'Name must be at least 2 characters.';
          }
        }
        break;
    }

    if (field.tagName.toLowerCase() === 'textarea' && name === 'message') {
      if (value.length < 10) {
        errorMessage = 'Message must be at least 10 characters.';
      }
    }
  }

  if (errorMessage) {
    showFieldError(field, errorMessage);
    return false;
  }

  field.classList.add('is-valid');
  return true;
}

function showFieldError(field, message) {
  field.classList.add('is-invalid');
  field.classList.remove('is-valid');
  field.setAttribute('aria-invalid', 'true');

  let errorEl = field.parentNode.querySelector('.field-error');
  if (!errorEl) {
    errorEl = document.createElement('span');
    errorEl.className = 'field-error';
    errorEl.setAttribute('role', 'alert');
    errorEl.setAttribute('aria-live', 'polite');
    field.parentNode.appendChild(errorEl);
  }
  errorEl.textContent = message;

  // Associate error with field
  const errorId = field.id ? field.id + '-error' : 'error-' + Math.random().toString(36).substr(2, 9);
  errorEl.id = errorId;
  field.setAttribute('aria-describedby', errorId);
}

function clearFieldError(field) {
  field.classList.remove('is-invalid');
  field.removeAttribute('aria-invalid');

  const errorEl = field.parentNode.querySelector('.field-error');
  if (errorEl) errorEl.textContent = '';
}

function getFieldLabel(field) {
  const label = document.querySelector(`label[for="${field.id}"]`);
  if (label) return label.textContent.replace('*', '').trim();
  return field.placeholder || field.name || 'This field';
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function isValidPhone(phone) {
  return /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/.test(phone.replace(/\s/g, ''));
}

function handleFormSubmit(form) {
  const submitBtn = form.querySelector('[type="submit"]');
  const originalText = submitBtn ? submitBtn.textContent : '';

  // Show loading state
  if (submitBtn) {
    submitBtn.disabled = true;
    submitBtn.textContent = 'Sending...';
    submitBtn.classList.add('is-loading');
  }

  // Collect form data
  const formData = new FormData(form);
  const data = {};
  formData.forEach(function (value, key) {
    data[key] = value;
  });

  // Log submission (replace with actual API call)
  console.log('Form submission:', data);

  // Simulate API call
  setTimeout(function () {
    showFormSuccess(form);

    if (submitBtn) {
      submitBtn.disabled = false;
      submitBtn.textContent = originalText;
      submitBtn.classList.remove('is-loading');
    }

    // Reset form
    form.reset();
    const validFields = form.querySelectorAll('.is-valid');
    validFields.forEach(function (field) {
      field.classList.remove('is-valid');
    });
  }, 1500);
}

function showFormSuccess(form) {
  let successEl = form.querySelector('.form-success');

  if (!successEl) {
    successEl = document.createElement('div');
    successEl.className = 'form-success';
    successEl.setAttribute('role', 'status');
    successEl.setAttribute('aria-live', 'polite');
    form.appendChild(successEl);
  }

  successEl.innerHTML = `
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
      <polyline points="20 6 9 17 4 12"></polyline>
    </svg>
    <span>Thank you! We'll contact you within 1 business hour. For immediate assistance, call us at <a href="${CONFIG.phoneLink}">${CONFIG.phone}</a>.</span>
  `;
  successEl.classList.add('is-visible');

  // Scroll to success message
  successEl.scrollIntoView({ behavior: 'smooth', block: 'center' });

  // Hide after 8 seconds
  setTimeout(function () {
    successEl.classList.remove('is-visible');
  }, 8000);
}

// ============================================================
// PHONE CLICK TRACKING
// ============================================================

function initPhoneTracking() {
  const phoneLinks = document.querySelectorAll(`a[href="${CONFIG.phoneLink}"]`);

  phoneLinks.forEach(function (link) {
    link.addEventListener('click', function (e) {
      trackPhoneClick(link);
    });
  });
}

function trackPhoneClick(element) {
  const pageTitle = document.title;
  const pagePath = window.location.pathname;
  const linkText = element.textContent.trim();
  const linkLocation = element.closest('[data-tracking-zone]')
    ? element.closest('[data-tracking-zone]').getAttribute('data-tracking-zone')
    : detectTrackingZone(element);

  const trackingData = {
    event: 'phone_click',
    phone: CONFIG.phone,
    page_title: pageTitle,
    page_path: pagePath,
    link_text: linkText,
    link_location: linkLocation,
    timestamp: new Date().toISOString(),
    viewport: window.innerWidth + 'x' + window.innerHeight
  };

  // Log for development (replace with analytics in production)
  console.log('[Phone Click Tracked]', trackingData);

  // Google Analytics 4 (uncomment when GA4 is configured)
  // if (typeof gtag === 'function') {
  //   gtag('event', 'phone_click', {
  //     'phone_number': CONFIG.phone,
  //     'page_location': pagePath,
  //     'click_location': linkLocation
  //   });
  // }

  // Google Tag Manager (uncomment when GTM is configured)
  // if (typeof dataLayer !== 'undefined') {
  //   dataLayer.push({
  //     event: 'phoneClick',
  //     phoneNumber: CONFIG.phone,
  //     clickLocation: linkLocation
  //   });
  // }
}

function detectTrackingZone(element) {
  if (element.closest('.site-header')) return 'header';
  if (element.closest('.hero-section')) return 'hero';
  if (element.closest('.mobile-cta-bar')) return 'mobile-cta-bar';
  if (element.closest('.site-footer')) return 'footer';
  if (element.closest('.cta-section')) return 'cta-section';
  if (element.closest('.contact-section')) return 'contact-section';
  if (element.closest('.sidebar')) return 'sidebar';
  if (element.closest('[class*="banner"]')) return 'banner';
  return 'content';
}

// ============================================================
// FOOTER YEAR
// ============================================================

function setCurrentYear() {
  const yearElements = document.querySelectorAll('.current-year, [data-year]');
  const currentYear = new Date().getFullYear();

  yearElements.forEach(function (el) {
    el.textContent = currentYear;
  });
}

// ============================================================
// COUNTER ANIMATION
// ============================================================

function initCounterAnimation() {
  const counters = document.querySelectorAll('[data-counter]');
  if (counters.length === 0) return;

  if (!('IntersectionObserver' in window)) {
    counters.forEach(function (counter) {
      counter.textContent = counter.getAttribute('data-counter');
    });
    return;
  }

  const counterObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        counterObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(function (counter) {
    counterObserver.observe(counter);
  });
}

function animateCounter(element) {
  const target = parseInt(element.getAttribute('data-counter'), 10);
  const duration = parseInt(element.getAttribute('data-counter-duration') || '2000', 10);
  const suffix = element.getAttribute('data-counter-suffix') || '';
  const prefix = element.getAttribute('data-counter-prefix') || '';
  const start = 0;
  const startTime = performance.now();

  function update(currentTime) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);

    // Easing: ease out cubic
    const eased = 1 - Math.pow(1 - progress, 3);
    const current = Math.round(start + (target - start) * eased);

    element.textContent = prefix + current.toLocaleString() + suffix;

    if (progress < 1) {
      window.requestAnimationFrame(update);
    } else {
      element.textContent = prefix + target.toLocaleString() + suffix;
    }
  }

  window.requestAnimationFrame(update);
}

// ============================================================
// TESTIMONIAL SLIDER (simple auto-rotate)
// ============================================================

function initTestimonialSlider() {
  const slider = document.querySelector('.testimonial-slider');
  if (!slider) return;

  const slides = slider.querySelectorAll('.testimonial-slide');
  if (slides.length <= 1) return;

  const dotsContainer = slider.querySelector('.slider-dots');
  let currentSlide = 0;
  let autoplayTimer;
  let isAnimating = false;

  // Create dots if container exists
  if (dotsContainer) {
    slides.forEach(function (_, index) {
      const dot = document.createElement('button');
      dot.className = 'slider-dot' + (index === 0 ? ' is-active' : '');
      dot.setAttribute('aria-label', `Go to testimonial ${index + 1}`);
      dot.setAttribute('type', 'button');
      dot.addEventListener('click', function () {
        if (!isAnimating) goToSlide(index);
      });
      dotsContainer.appendChild(dot);
    });
  }

  const prevBtn = slider.querySelector('.slider-prev');
  const nextBtn = slider.querySelector('.slider-next');

  if (prevBtn) {
    prevBtn.addEventListener('click', function () {
      if (!isAnimating) {
        const prev = (currentSlide - 1 + slides.length) % slides.length;
        goToSlide(prev);
        resetAutoplay();
      }
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', function () {
      if (!isAnimating) {
        const next = (currentSlide + 1) % slides.length;
        goToSlide(next);
        resetAutoplay();
      }
    });
  }

  function goToSlide(index) {
    if (index === currentSlide) return;
    isAnimating = true;

    slides[currentSlide].classList.remove('is-active');
    slides[currentSlide].classList.add('is-leaving');

    setTimeout(function () {
      slides[currentSlide].classList.remove('is-leaving');
      currentSlide = index;
      slides[currentSlide].classList.add('is-active');

      // Update dots
      if (dotsContainer) {
        const dots = dotsContainer.querySelectorAll('.slider-dot');
        dots.forEach(function (dot, i) {
          dot.classList.toggle('is-active', i === currentSlide);
        });
      }

      isAnimating = false;
    }, 400);
  }

  function startAutoplay() {
    autoplayTimer = setInterval(function () {
      const next = (currentSlide + 1) % slides.length;
      goToSlide(next);
    }, 5000);
  }

  function resetAutoplay() {
    clearInterval(autoplayTimer);
    startAutoplay();
  }

  // Initialize first slide
  slides[0].classList.add('is-active');

  // Pause on hover
  slider.addEventListener('mouseenter', function () { clearInterval(autoplayTimer); });
  slider.addEventListener('mouseleave', startAutoplay);

  // Touch/swipe support
  let touchStartX = 0;
  let touchEndX = 0;

  slider.addEventListener('touchstart', function (e) {
    touchStartX = e.changedTouches[0].clientX;
  }, { passive: true });

  slider.addEventListener('touchend', function (e) {
    touchEndX = e.changedTouches[0].clientX;
    const diff = touchStartX - touchEndX;

    if (Math.abs(diff) > 50) {
      if (diff > 0) {
        const next = (currentSlide + 1) % slides.length;
        goToSlide(next);
      } else {
        const prev = (currentSlide - 1 + slides.length) % slides.length;
        goToSlide(prev);
      }
      resetAutoplay();
    }
  }, { passive: true });

  startAutoplay();
}

// ============================================================
// BACK TO TOP BUTTON
// ============================================================

function initBackToTop() {
  const backToTopBtn = document.querySelector('.back-to-top');
  if (!backToTopBtn) return;

  let ticking = false;

  window.addEventListener('scroll', function () {
    if (!ticking) {
      window.requestAnimationFrame(function () {
        if (window.scrollY > 500) {
          backToTopBtn.classList.add('is-visible');
          backToTopBtn.setAttribute('aria-hidden', 'false');
        } else {
          backToTopBtn.classList.remove('is-visible');
          backToTopBtn.setAttribute('aria-hidden', 'true');
        }
        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });

  backToTopBtn.addEventListener('click', function () {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

// ============================================================
// COOKIE CONSENT (basic)
// ============================================================

function initCookieConsent() {
  const COOKIE_KEY = 'aps_cookie_consent';
  const consentBanner = document.querySelector('.cookie-banner');

  if (!consentBanner) return;

  // Check if already consented
  if (localStorage.getItem(COOKIE_KEY)) {
    return;
  }

  // Show banner
  setTimeout(function () {
    consentBanner.classList.add('is-visible');
  }, 2000);

  const acceptBtn = consentBanner.querySelector('[data-cookie-accept]');
  const declineBtn = consentBanner.querySelector('[data-cookie-decline]');

  if (acceptBtn) {
    acceptBtn.addEventListener('click', function () {
      localStorage.setItem(COOKIE_KEY, 'accepted');
      consentBanner.classList.remove('is-visible');
      console.log('Cookie consent: accepted');
    });
  }

  if (declineBtn) {
    declineBtn.addEventListener('click', function () {
      localStorage.setItem(COOKIE_KEY, 'declined');
      consentBanner.classList.remove('is-visible');
      console.log('Cookie consent: declined');
    });
  }
}

// ============================================================
// PAGE-SPECIFIC INITIALIZATIONS
// ============================================================

function initPageSpecific() {
  const path = window.location.pathname;
  const page = path.split('/').pop() || 'index.html';

  switch (page) {
    case 'index.html':
    case '':
      initHomePage();
      break;
    case 'contact.html':
      initContactPage();
      break;
    case 'blog.html':
      initBlogPage();
      break;
    default:
      if (isServicePage(page)) {
        initServicePage();
      } else if (isAreaPage(page)) {
        initAreaPage();
      }
      break;
  }
}

function isServicePage(page) {
  const servicePages = [
    'termite-control.html', 'bed-bug-treatment.html', 'rodent-control.html',
    'ant-extermination.html', 'cockroach-control.html', 'mosquito-control.html'
  ];
  return servicePages.includes(page);
}

function isAreaPage(page) {
  const areaPages = [
    'scott.html', 'broussard.html', 'youngsville.html',
    'carencro.html', 'duson.html', 'breaux-bridge.html'
  ];
  return areaPages.includes(page);
}

function initHomePage() {
  console.log('[APS] Initializing Home page');
  initCounterAnimation();
  initTestimonialSlider();
}

function initContactPage() {
  console.log('[APS] Initializing Contact page');
  // Pre-fill service from URL params
  const params = new URLSearchParams(window.location.search);
  const service = params.get('service');

  if (service) {
    const serviceSelect = document.querySelector('select[name="service"], select[name="pest_type"]');
    if (serviceSelect) {
      const option = Array.from(serviceSelect.options).find(function (opt) {
        return opt.value.toLowerCase() === service.toLowerCase() ||
               opt.text.toLowerCase().includes(service.toLowerCase());
      });
      if (option) {
        serviceSelect.value = option.value;
      }
    }
  }
}

function initBlogPage() {
  console.log('[APS] Initializing Blog page');
  initBlogFilter();
}

function initBlogFilter() {
  const filterBtns = document.querySelectorAll('[data-filter]');
  const blogCards = document.querySelectorAll('.blog-card[data-category]');

  if (filterBtns.length === 0 || blogCards.length === 0) return;

  filterBtns.forEach(function (btn) {
    btn.addEventListener('click', function () {
      const filter = btn.getAttribute('data-filter');

      // Update active button
      filterBtns.forEach(function (b) {
        b.classList.toggle('is-active', b === btn);
        b.setAttribute('aria-pressed', b === btn ? 'true' : 'false');
      });

      // Filter cards
      blogCards.forEach(function (card) {
        const category = card.getAttribute('data-category');
        if (filter === 'all' || category === filter) {
          card.style.display = '';
          card.classList.add('reveal-element');
        } else {
          card.style.display = 'none';
          card.classList.remove('reveal-element');
        }
      });
    });
  });
}

function initServicePage() {
  console.log('[APS] Initializing Service page');
  // Track service page views
  const pagePath = window.location.pathname;
  console.log('[APS] Service page view:', pagePath);
}

function initAreaPage() {
  console.log('[APS] Initializing Area page');
  // Track area page views
  const pagePath = window.location.pathname;
  console.log('[APS] Area page view:', pagePath);
}

// ============================================================
// PERFORMANCE & UTILITY HELPERS
// ============================================================

function debounce(fn, delay) {
  let timer;
  return function () {
    const args = arguments;
    const context = this;
    clearTimeout(timer);
    timer = setTimeout(function () {
      fn.apply(context, args);
    }, delay);
  };
}

function throttle(fn, limit) {
  let lastRun = 0;
  return function () {
    const now = Date.now();
    if (now - lastRun >= limit) {
      lastRun = now;
      fn.apply(this, arguments);
    }
  };
}

// ============================================================
// ACCESSIBILITY HELPERS
// ============================================================

function initAccessibility() {
  // Skip to content link
  const skipLink = document.querySelector('.skip-to-content');
  if (skipLink) {
    skipLink.addEventListener('click', function (e) {
      e.preventDefault();
      const target = document.querySelector(skipLink.getAttribute('href'));
      if (target) {
        target.setAttribute('tabindex', '-1');
        target.focus();
      }
    });
  }

  // Add focus-visible class for keyboard users
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Tab') {
      document.body.classList.add('keyboard-nav');
    }
  });

  document.addEventListener('mousedown', function () {
    document.body.classList.remove('keyboard-nav');
  });

  // Ensure all images have alt text
  const images = document.querySelectorAll('img:not([alt])');
  images.forEach(function (img) {
    console.warn('[APS Accessibility] Image missing alt text:', img.src || img.getAttribute('data-src'));
    img.setAttribute('alt', '');
  });
}

// ============================================================
// PRINT HANDLING
// ============================================================

function initPrintHandling() {
  window.addEventListener('beforeprint', function () {
    document.body.classList.add('is-printing');
    // Expand all FAQ answers for print
    const faqAnswers = document.querySelectorAll('.faq-answer');
    faqAnswers.forEach(function (answer) {
      answer.removeAttribute('hidden');
      answer.style.maxHeight = 'none';
    });
  });

  window.addEventListener('afterprint', function () {
    document.body.classList.remove('is-printing');
    // Restore FAQ state
    const faqItems = document.querySelectorAll('.faq-item:not(.is-open) .faq-answer');
    faqItems.forEach(function (answer) {
      answer.setAttribute('hidden', 'true');
      answer.style.maxHeight = '0';
    });
  });
}

// ============================================================
// DYNAMIC PHONE NUMBER INJECTION
// ============================================================

function ensurePhoneNumbers() {
  // Replace any placeholder phone numbers with the configured one
  const phonePlaceholders = document.querySelectorAll('[data-phone-number]');
  phonePlaceholders.forEach(function (el) {
    el.textContent = CONFIG.phone;
  });

  const phoneLinks = document.querySelectorAll('[data-phone-link]');
  phoneLinks.forEach(function (el) {
    el.href = CONFIG.phoneLink;
    if (!el.textContent.trim() || el.getAttribute('data-phone-link') === 'text') {
      el.textContent = CONFIG.phone;
    }
  });
}

// ============================================================
// STRUCTURED BREADCRUMBS
// ============================================================

function initBreadcrumbs() {
  const breadcrumb = document.querySelector('.breadcrumb, nav[aria-label="Breadcrumb"]');
  if (!breadcrumb) return;

  const items = breadcrumb.querySelectorAll('li, .breadcrumb-item');
  if (items.length === 0) return;

  // Inject BreadcrumbList schema
  const itemList = [];
  items.forEach(function (item, index) {
    const link = item.querySelector('a');
    const name = link ? link.textContent.trim() : item.textContent.trim();
    const href = link ? link.href : window.location.href;

    itemList.push({
      '@type': 'ListItem',
      position: index + 1,
      name: name,
      item: href
    });
  });

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: itemList
  };

  const scriptEl = document.createElement('script');
  scriptEl.type = 'application/ld+json';
  scriptEl.setAttribute('data-schema', 'breadcrumb');
  scriptEl.textContent = JSON.stringify(breadcrumbSchema);
  document.head.appendChild(scriptEl);
}

// ============================================================
// EMERGENCY BANNER HANDLING
// ============================================================

function initEmergencyBanner() {
  const banner = document.querySelector('.emergency-banner');
  if (!banner) return;

  const dismissBtn = banner.querySelector('[data-dismiss]');
  const STORAGE_KEY = 'aps_emergency_dismissed';

  // Check if dismissed
  if (sessionStorage.getItem(STORAGE_KEY)) {
    banner.style.display = 'none';
    return;
  }

  if (dismissBtn) {
    dismissBtn.addEventListener('click', function () {
      banner.style.maxHeight = banner.offsetHeight + 'px';
      requestAnimationFrame(function () {
        banner.style.maxHeight = '0';
        banner.style.overflow = 'hidden';
      });
      setTimeout(function () {
        banner.style.display = 'none';
      }, 300);
      sessionStorage.setItem(STORAGE_KEY, 'true');
    });
  }
}

// ============================================================
// PRELOADER
// ============================================================

function initPreloader() {
  const preloader = document.querySelector('.preloader, #preloader');
  if (!preloader) return;

  function hidePreloader() {
    preloader.classList.add('is-hidden');
    setTimeout(function () {
      preloader.style.display = 'none';
    }, 500);
  }

  if (document.readyState === 'complete') {
    hidePreloader();
  } else {
    window.addEventListener('load', hidePreloader);
  }
}

// ============================================================
// MAIN INITIALIZATION
// ============================================================

function init() {
  console.log(`[APS] Initializing ${CONFIG.businessName} - ${new Date().getFullYear()}`);

  // Core functionality
  injectSchemaMarkup();
  setCurrentYear();
  ensurePhoneNumbers();

  // Navigation
  initStickyHeader();
  initMobileMenu();
  initDropdowns();
  setActiveNavLink();

  // UX Enhancements
  initSmoothScroll();
  initScrollReveal();
  initMobileCTABar();
  initBackToTop();

  // Content
  initFAQAccordion();
  initLazyLoading();

  // Forms
  initFormValidation();

  // Tracking
  initPhoneTracking();

  // Accessibility
  initAccessibility();

  // Page-specific
  initPageSpecific();
  initBreadcrumbs();

  // Optional features
  initPrintHandling();
  initCookieConsent();
  initEmergencyBanner();
  initPreloader();

  console.log('[APS] Initialization complete');
}

// ============================================================
// BOOT
// ============================================================

domReady(init);

// Export for potential module use
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    CONFIG,
    init,
    trackPhoneClick,
    validateField,
    isValidEmail,
    isValidPhone
  };
}
