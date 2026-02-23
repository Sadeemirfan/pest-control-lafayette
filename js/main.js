'use strict';

function domReady(fn) {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', fn);
  } else {
    fn();
  }
}

domReady(function () {
  try {

    // =========================================================
    // 1. MOBILE MENU
    // =========================================================
    (function initMobileMenu() {
      try {
        var hamburger = document.querySelector('.hamburger') || document.getElementById('hamburgerBtn');
        var mainNav = document.querySelector('.main-nav') || document.getElementById('mainNav');
        var overlay = document.querySelector('.nav-overlay') || document.getElementById('navOverlay');

        if (!overlay) {
          overlay = document.createElement('div');
          overlay.className = 'nav-overlay';
          overlay.setAttribute('aria-hidden', 'true');
          document.body.appendChild(overlay);
        }

        function openNav() {
          if (hamburger) hamburger.classList.add('active');
          if (mainNav) mainNav.classList.add('open');
          overlay.classList.add('active');
          document.body.classList.add('nav-open');
          if (hamburger) hamburger.setAttribute('aria-expanded', 'true');
        }

        function closeNav() {
          if (hamburger) hamburger.classList.remove('active');
          if (mainNav) mainNav.classList.remove('open');
          overlay.classList.remove('active');
          document.body.classList.remove('nav-open');
          if (hamburger) hamburger.setAttribute('aria-expanded', 'false');
        }

        function toggleNav() {
          if (mainNav && mainNav.classList.contains('open')) {
            closeNav();
          } else {
            openNav();
          }
        }

        if (hamburger) {
          hamburger.addEventListener('click', function (e) {
            e.stopPropagation();
            toggleNav();
          });
        }

        overlay.addEventListener('click', function () {
          closeNav();
        });

        document.addEventListener('keydown', function (e) {
          if (e.key === 'Escape' || e.keyCode === 27) {
            closeNav();
          }
        });

        var navLinks = document.querySelectorAll('.main-nav .nav-link');
        navLinks.forEach(function (link) {
          link.addEventListener('click', function () {
            closeNav();
          });
        });

      } catch (e) {
        console.warn('Mobile menu error:', e);
      }
    })();


    // =========================================================
    // 2. DROPDOWN MENUS
    // =========================================================
    (function initDropdowns() {
      try {
        var dropdownParents = document.querySelectorAll('li.has-dropdown');

        function closeAllDropdowns(except) {
          dropdownParents.forEach(function (parent) {
            if (parent !== except) {
              parent.classList.remove('dropdown-open');
              var toggle = parent.querySelector('a.dropdown-toggle');
              if (toggle) toggle.setAttribute('aria-expanded', 'false');
            }
          });
        }

        dropdownParents.forEach(function (parent) {
          var toggle = parent.querySelector('a.dropdown-toggle');
          var menu = parent.querySelector('ul.dropdown-menu');

          if (!toggle || !menu) return;

          toggle.setAttribute('aria-haspopup', 'true');
          toggle.setAttribute('aria-expanded', 'false');

          toggle.addEventListener('click', function (e) {
            e.preventDefault();
            e.stopPropagation();
            var isOpen = parent.classList.contains('dropdown-open');
            closeAllDropdowns(null);
            if (!isOpen) {
              parent.classList.add('dropdown-open');
              toggle.setAttribute('aria-expanded', 'true');
            } else {
              parent.classList.remove('dropdown-open');
              toggle.setAttribute('aria-expanded', 'false');
            }
          });

          var menuLinks = menu.querySelectorAll('a');
          menuLinks.forEach(function (link) {
            link.addEventListener('click', function () {
              closeAllDropdowns(null);
            });
          });
        });

        document.addEventListener('click', function (e) {
          var clickedInsideDropdown = false;
          dropdownParents.forEach(function (parent) {
            if (parent.contains(e.target)) {
              clickedInsideDropdown = true;
            }
          });
          if (!clickedInsideDropdown) {
            closeAllDropdowns(null);
          }
        });

        document.addEventListener('keydown', function (e) {
          if (e.key === 'Escape' || e.keyCode === 27) {
            closeAllDropdowns(null);
          }
        });

      } catch (e) {
        console.warn('Dropdown error:', e);
      }
    })();


    // =========================================================
    // 3. STICKY HEADER
    // =========================================================
    (function initStickyHeader() {
      try {
        var header = document.querySelector('.site-header');
        if (!header) return;

        var ticking = false;
        var scrollThreshold = 80;

        function updateHeader() {
          if (window.scrollY > scrollThreshold) {
            header.classList.add('scrolled');
          } else {
            header.classList.remove('scrolled');
          }
          ticking = false;
        }

        window.addEventListener('scroll', function () {
          if (!ticking) {
            requestAnimationFrame(updateHeader);
            ticking = true;
          }
        }, { passive: true });

        updateHeader();

      } catch (e) {
        console.warn('Sticky header error:', e);
      }
    })();


    // =========================================================
    // 4. SCROLL REVEAL
    // =========================================================
    (function initScrollReveal() {
      try {
        var revealElements = document.querySelectorAll('.reveal');
        if (!revealElements.length) return;

        if (!('IntersectionObserver' in window)) {
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
          rootMargin: '0px 0px -60px 0px',
          threshold: 0.15
        });

        revealElements.forEach(function (el) {
          observer.observe(el);
        });

      } catch (e) {
        console.warn('Scroll reveal error:', e);
      }
    })();


    // =========================================================
    // 5. FAQ ACCORDION
    // =========================================================
    (function initFaqAccordion() {
      try {
        var faqItems = document.querySelectorAll('.faq-item');
        if (!faqItems.length) return;

        function closeItem(item) {
          item.classList.remove('active');
          var answer = item.querySelector('.faq-answer');
          if (answer) {
            answer.style.maxHeight = '0';
            answer.setAttribute('aria-hidden', 'true');
          }
          var question = item.querySelector('.faq-question');
          if (question) question.setAttribute('aria-expanded', 'false');
        }

        function openItem(item) {
          item.classList.add('active');
          var answer = item.querySelector('.faq-answer');
          if (answer) {
            answer.style.maxHeight = answer.scrollHeight + 'px';
            answer.setAttribute('aria-hidden', 'false');
          }
          var question = item.querySelector('.faq-question');
          if (question) question.setAttribute('aria-expanded', 'true');
        }

        faqItems.forEach(function (item) {
          var question = item.querySelector('.faq-question');
          var answer = item.querySelector('.faq-answer');

          if (answer) {
            answer.style.maxHeight = '0';
            answer.style.overflow = 'hidden';
            answer.style.transition = 'max-height 0.35s ease';
            answer.setAttribute('aria-hidden', 'true');
          }

          if (question) {
            question.setAttribute('aria-expanded', 'false');
            question.style.cursor = 'pointer';

            question.addEventListener('click', function () {
              var isActive = item.classList.contains('active');
              faqItems.forEach(function (otherItem) {
                if (otherItem !== item) {
                  closeItem(otherItem);
                }
              });
              if (isActive) {
                closeItem(item);
              } else {
                openItem(item);
              }
            });

            question.addEventListener('keydown', function (e) {
              if (e.key === 'Enter' || e.keyCode === 13 || e.key === ' ' || e.keyCode === 32) {
                e.preventDefault();
                question.click();
              }
            });

            if (!question.getAttribute('tabindex')) {
              question.setAttribute('tabindex', '0');
            }
          }
        });

      } catch (e) {
        console.warn('FAQ accordion error:', e);
      }
    })();


    // =========================================================
    // 6. CONTACT FORM
    // =========================================================
    (function initContactForm() {
      try {
        var forms = document.querySelectorAll('.contact-form');
        if (!forms.length) return;

        forms.forEach(function (form) {
          var successMsg = form.querySelector('.form-success') ||
            (form.parentElement && form.parentElement.querySelector('.form-success'));

          form.addEventListener('submit', function (e) {
            e.preventDefault();

            var isValid = true;
            var errors = [];

            var nameField = form.querySelector('[name="name"], #name, input[placeholder*="Name"]');
            var emailField = form.querySelector('[name="email"], #email, input[type="email"]');
            var phoneField = form.querySelector('[name="phone"], #phone, input[type="tel"]');
            var messageField = form.querySelector('[name="message"], #message, textarea');

            form.querySelectorAll('.field-error').forEach(function (err) {
              err.remove();
            });
            form.querySelectorAll('.input-error').forEach(function (inp) {
              inp.classList.remove('input-error');
            });

            function showFieldError(field, msg) {
              if (!field) return;
              field.classList.add('input-error');
              field.style.borderColor = '#e53e3e';
              var errSpan = document.createElement('span');
              errSpan.className = 'field-error';
              errSpan.style.color = '#e53e3e';
              errSpan.style.fontSize = '0.85em';
              errSpan.style.display = 'block';
              errSpan.style.marginTop = '4px';
              errSpan.textContent = msg;
              field.parentNode.appendChild(errSpan);
              isValid = false;
              errors.push(msg);
            }

            if (nameField && nameField.value.trim().length < 2) {
              showFieldError(nameField, 'Please enter your full name.');
            }

            if (emailField) {
              var emailVal = emailField.value.trim();
              var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
              if (!emailRegex.test(emailVal)) {
                showFieldError(emailField, 'Please enter a valid email address.');
              }
            }

            if (phoneField && phoneField.value.trim().length > 0) {
              var phoneVal = phoneField.value.trim().replace(/[\s\-().]/g, '');
              if (phoneVal.length < 10) {
                showFieldError(phoneField, 'Please enter a valid phone number.');
              }
            }

            if (messageField && messageField.value.trim().length < 10) {
              showFieldError(messageField, 'Please enter a message (at least 10 characters).');
            }

            if (!isValid) return;

            var submitBtn = form.querySelector('[type="submit"], button');
            var originalText = submitBtn ? submitBtn.textContent : '';
            if (submitBtn) {
              submitBtn.disabled = true;
              submitBtn.textContent = 'Sending...';
            }

            setTimeout(function () {
              if (submitBtn) {
                submitBtn.disabled = false;
                submitBtn.textContent = originalText;
              }

              form.reset();

              form.querySelectorAll('input, textarea, select').forEach(function (inp) {
                inp.style.borderColor = '';
              });

              if (successMsg) {
                successMsg.style.display = 'block';
                successMsg.style.opacity = '0';
                successMsg.style.transition = 'opacity 0.4s ease';
                requestAnimationFrame(function () {
                  successMsg.style.opacity = '1';
                });
                setTimeout(function () {
                  successMsg.style.opacity = '0';
                  setTimeout(function () {
                    successMsg.style.display = 'none';
                  }, 400);
                }, 5000);
              } else {
                var fallback = document.createElement('div');
                fallback.style.cssText = 'background:#d4edda;color:#155724;padding:12px 16px;border-radius:6px;margin-top:12px;font-size:0.95em;';
                fallback.textContent = 'Thank you! Your message has been sent. We will contact you shortly.';
                form.parentNode.insertBefore(fallback, form.nextSibling);
                setTimeout(function () {
                  fallback.remove();
                }, 5000);
              }

              console.log('Acadiana Pest Solutions: Contact form submitted successfully.');

            }, 800);
          });
        });

      } catch (e) {
        console.warn('Contact form error:', e);
      }
    })();


    // =========================================================
    // 7. ACTIVE NAV LINK
    // =========================================================
    (function initActiveNavLink() {
      try {
        var path = window.location.pathname;
        var filename = path.substring(path.lastIndexOf('/') + 1) || 'index.html';
        if (filename === '' || filename === '/') filename = 'index.html';

        var navLinks = document.querySelectorAll('.nav-link');

        navLinks.forEach(function (link) {
          var href = link.getAttribute('href') || '';
          var linkFile = href.substring(href.lastIndexOf('/') + 1);

          if (linkFile === filename ||
            (filename === 'index.html' && (href === '/' || href === './' || href === '#' || linkFile === 'index.html')) ||
            (filename !== 'index.html' && linkFile !== '' && filename.indexOf(linkFile.replace('.html', '')) !== -1)) {
            link.classList.add('active');

            var parentLi = link.closest('li.has-dropdown');
            if (parentLi) {
              parentLi.classList.add('active');
            }

            var parentDropdown = link.closest('ul.dropdown-menu');
            if (parentDropdown) {
              var parentToggle = parentDropdown.closest('li.has-dropdown');
              if (parentToggle) {
                parentToggle.classList.add('active');
                var toggleLink = parentToggle.querySelector('a.dropdown-toggle');
                if (toggleLink) toggleLink.classList.add('active');
              }
            }
          }
        });

      } catch (e) {
        console.warn('Active nav link error:', e);
      }
    })();


    // =========================================================
    // 8. STAT COUNTERS
    // =========================================================
    (function initStatCounters() {
      try {
        var counters = document.querySelectorAll('[data-count]');
        if (!counters.length) return;

        function animateCounter(el) {
          var target = parseInt(el.getAttribute('data-count'), 10);
          if (isNaN(target)) return;

          var duration = 2000;
          var startTime = null;
          var startVal = 0;
          var suffix = el.getAttribute('data-suffix') || '';
          var prefix = el.getAttribute('data-prefix') || '';

          function easeOutQuart(t) {
            return 1 - Math.pow(1 - t, 4);
          }

          function step(timestamp) {
            if (!startTime) startTime = timestamp;
            var elapsed = timestamp - startTime;
            var progress = Math.min(elapsed / duration, 1);
            var easedProgress = easeOutQuart(progress);
            var current = Math.round(startVal + (target - startVal) * easedProgress);
            el.textContent = prefix + current.toLocaleString() + suffix;
            if (progress < 1) {
              requestAnimationFrame(step);
            } else {
              el.textContent = prefix + target.toLocaleString() + suffix;
            }
          }

          requestAnimationFrame(step);
        }

        if (!('IntersectionObserver' in window)) {
          counters.forEach(function (counter) {
            animateCounter(counter);
          });
          return;
        }

        var counterObserver = new IntersectionObserver(function (entries) {
          entries.forEach(function (entry) {
            if (entry.isIntersecting) {
              animateCounter(entry.target);
              counterObserver.unobserve(entry.target);
            }
          });
        }, {
          threshold: 0.3
        });

        counters.forEach(function (counter) {
          counter.textContent = '0';
          counterObserver.observe(counter);
        });

      } catch (e) {
        console.warn('Stat counters error:', e);
      }
    })();


    // =========================================================
    // 9. PHONE CLICK TRACKING
    // =========================================================
    (function initPhoneTracking() {
      try {
        var telLinks = document.querySelectorAll('a[href^="tel:"]');
        telLinks.forEach(function (link) {
          link.addEventListener('click', function () {
            var number = link.getAttribute('href').replace('tel:', '');
            console.log('[Acadiana Pest Solutions] Phone click tracked: ' + number);
            if (typeof window.gtag === 'function') {
              window.gtag('event', 'phone_click', {
                event_category: 'Contact',
                event_label: number,
                value: 1
              });
            }
            if (typeof window.ga === 'function') {
              window.ga('send', 'event', 'Contact', 'Phone Click', number);
            }
          });
        });
      } catch (e) {
        console.warn('Phone tracking error:', e);
      }
    })();


    // =========================================================
    // 10. SCHEMA - LocalBusiness JSON-LD
    // =========================================================
    (function injectSchema() {
      try {
        var existing = document.querySelector('script[type="application/ld+json"]');
        if (existing) return;

        var schema = {
          "@context": "https://schema.org",
          "@type": "LocalBusiness",
          "name": "Acadiana Pest Solutions",
          "description": "Professional pest control services in Lafayette, LA and the Acadiana region. Residential and commercial pest management.",
          "url": window.location.origin,
          "telephone": "(337) 555-0199",
          "priceRange": "$$",
          "address": {
            "@type": "PostalAddress",
            "streetAddress": "",
            "addressLocality": "Lafayette",
            "addressRegion": "LA",
            "postalCode": "70501",
            "addressCountry": "US"
          },
          "geo": {
            "@type": "GeoCoordinates",
            "latitude": 30.2241,
            "longitude": -92.0198
          },
          "openingHoursSpecification": [
            {
              "@type": "OpeningHoursSpecification",
              "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
              "opens": "07:30",
              "closes": "18:00"
            },
            {
              "@type": "OpeningHoursSpecification",
              "dayOfWeek": ["Saturday"],
              "opens": "08:00",
              "closes": "14:00"
            }
          ],
          "sameAs": [],
          "areaServed": {
            "@type": "GeoCircle",
            "geoMidpoint": {
              "@type": "GeoCoordinates",
              "latitude": 30.2241,
              "longitude": -92.0198
            },
            "geoRadius": "80000"
          },
          "hasOfferCatalog": {
            "@type": "OfferCatalog",
            "name": "Pest Control Services",
            "itemListElement": [
              { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Residential Pest Control" } },
              { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Commercial Pest Control" } },
              { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Termite Inspection and Treatment" } },
              { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Mosquito Control" } },
              { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Rodent Control" } },
              { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Bed Bug Treatment" } },
              { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Wildlife Removal" } }
            ]
          }
        };

        var script = document.createElement('script');
        script.type = 'application/ld+json';
        script.textContent = JSON.stringify(schema);
        document.head.appendChild(script);

        console.log('[Acadiana Pest Solutions] LocalBusiness schema injected.');

      } catch (e) {
        console.warn('Schema injection error:', e);
      }
    })();


    // =========================================================
    // SMOOTH SCROLL FOR ANCHOR LINKS
    // =========================================================
    (function initSmoothScroll() {
      try {
        var anchorLinks = document.querySelectorAll('a[href^="#"]');
        anchorLinks.forEach(function (link) {
          link.addEventListener('click', function (e) {
            var targetId = link.getAttribute('href').substring(1);
            if (!targetId) return;
            var target = document.getElementById(targetId);
            if (!target) return;
            e.preventDefault();
            var header = document.querySelector('.site-header');
            var headerHeight = header ? header.offsetHeight : 0;
            var targetPos = target.getBoundingClientRect().top + window.scrollY - headerHeight - 16;
            window.scrollTo({ top: targetPos, behavior: 'smooth' });
          });
        });
      } catch (e) {
        console.warn('Smooth scroll error:', e);
      }
    })();


    // =========================================================
    // BACK TO TOP BUTTON
    // =========================================================
    (function initBackToTop() {
      try {
        var btn = document.querySelector('.back-to-top') || document.getElementById('backToTop');
        if (!btn) return;

        var ticking = false;

        window.addEventListener('scroll', function () {
          if (!ticking) {
            requestAnimationFrame(function () {
              if (window.scrollY > 400) {
                btn.classList.add('visible');
              } else {
                btn.classList.remove('visible');
              }
              ticking = false;
            });
            ticking = true;
          }
        }, { passive: true });

        btn.addEventListener('click', function () {
          window.scrollTo({ top: 0, behavior: 'smooth' });
        });

      } catch (e) {
        console.warn('Back to top error:', e);
      }
    })();


    // =========================================================
    // TESTIMONIALS / SLIDER (basic auto-rotate)
    // =========================================================
    (function initTestimonialSlider() {
      try {
        var slider = document.querySelector('.testimonials-slider') || document.querySelector('.testimonial-slider');
        if (!slider) return;

        var slides = slider.querySelectorAll('.testimonial-item, .testimonial-slide, .slide');
        if (slides.length < 2) return;

        var currentIndex = 0;
        var intervalMs = 5000;
        var autoInterval = null;

        function showSlide(idx) {
          slides.forEach(function (s, i) {
            s.classList.remove('active');
            s.setAttribute('aria-hidden', 'true');
            if (i === idx) {
              s.classList.add('active');
              s.setAttribute('aria-hidden', 'false');
            }
          });
          currentIndex = idx;

          var dots = slider.querySelectorAll('.slider-dot');
          dots.forEach(function (dot, i) {
            dot.classList.toggle('active', i === idx);
          });
        }

        function nextSlide() {
          var next = (currentIndex + 1) % slides.length;
          showSlide(next);
        }

        function prevSlide() {
          var prev = (currentIndex - 1 + slides.length) % slides.length;
          showSlide(prev);
        }

        showSlide(0);

        autoInterval = setInterval(nextSlide, intervalMs);

        slider.addEventListener('mouseenter', function () {
          clearInterval(autoInterval);
        });

        slider.addEventListener('mouseleave', function () {
          autoInterval = setInterval(nextSlide, intervalMs);
        });

        var prevBtn = slider.querySelector('.slider-prev, .prev-btn, [data-slide="prev"]');
        var nextBtn = slider.querySelector('.slider-next, .next-btn, [data-slide="next"]');

        if (prevBtn) {
          prevBtn.addEventListener('click', function () {
            clearInterval(autoInterval);
            prevSlide();
            autoInterval = setInterval(nextSlide, intervalMs);
          });
        }

        if (nextBtn) {
          nextBtn.addEventListener('click', function () {
            clearInterval(autoInterval);
            nextSlide();
            autoInterval = setInterval(nextSlide, intervalMs);
          });
        }

      } catch (e) {
        console.warn('Testimonial slider error:', e);
      }
    })();


    // =========================================================
    // UTILITY: LOG INIT COMPLETE
    // =========================================================
    console.log('[Acadiana Pest Solutions] JavaScript initialized successfully.');

  } catch (globalErr) {
    console.error('[Acadiana Pest Solutions] Global initialization error:', globalErr);
  }
});
