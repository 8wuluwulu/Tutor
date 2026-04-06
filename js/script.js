/* ============================================
   TutorPro — JavaScript (v2)
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {

  // --- Header Scroll Effect ---
  const header = document.querySelector('.header');
  const onScroll = () => {
    header.classList.toggle('header--scrolled', window.scrollY > 20);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // --- Mobile Menu ---
  const menuToggle = document.querySelector('.menu-toggle');
  const mobileMenu = document.querySelector('.mobile-menu');

  if (menuToggle && mobileMenu) {
    menuToggle.addEventListener('click', () => {
      menuToggle.classList.toggle('active');
      mobileMenu.classList.toggle('active');
      document.body.style.overflow = mobileMenu.classList.contains('active') ? 'hidden' : '';
    });

    mobileMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        menuToggle.classList.remove('active');
        mobileMenu.classList.remove('active');
        document.body.style.overflow = '';
      });
    });
  }

  // --- Smooth Scrolling ---
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const targetId = anchor.getAttribute('href');
      if (targetId === '#') return;
      const targetEl = document.querySelector(targetId);
      if (targetEl) {
        e.preventDefault();
        targetEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  // --- Interactive Service Card Selection ---
  const serviceCards = document.querySelectorAll('.service-card[data-service]');
  const serviceSelect = document.getElementById('service');

  serviceCards.forEach(card => {
    card.addEventListener('click', (e) => {
      // Don't intercept if user clicked the CTA button link
      if (e.target.closest('.service-card__btn')) return;

      // Remove active from all cards, add to clicked
      serviceCards.forEach(c => c.classList.remove('active'));
      card.classList.add('active');

      // Update the form dropdown
      const serviceValue = card.dataset.service;
      if (serviceSelect) {
        serviceSelect.value = serviceValue;
        // Trigger change event for any listeners
        serviceSelect.dispatchEvent(new Event('change', { bubbles: true }));
      }
    });

    // Also handle the CTA button inside cards
    const btn = card.querySelector('.service-card__btn');
    if (btn) {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        // Select this card
        serviceCards.forEach(c => c.classList.remove('active'));
        card.classList.add('active');

        // Update dropdown
        const serviceValue = card.dataset.service;
        if (serviceSelect) {
          serviceSelect.value = serviceValue;
        }

        // Scroll to booking
        const booking = document.getElementById('booking');
        if (booking) {
          booking.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      });
    }
  });

  // --- Booking Form Handling ---
  const bookingForm = document.getElementById('booking-form');

  if (bookingForm) {
    bookingForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const submitBtn = bookingForm.querySelector('.form-submit');
      const originalText = submitBtn.textContent;

      submitBtn.disabled = true;
      submitBtn.textContent = 'Отправка...';
      submitBtn.style.opacity = '0.8';

      setTimeout(() => {
        submitBtn.textContent = 'Заявка успешно отправлена!';
        submitBtn.classList.add('form-submit--success');
        submitBtn.style.opacity = '1';

        bookingForm.reset();

        // Also deselect cards
        serviceCards.forEach(c => c.classList.remove('active'));

        setTimeout(() => {
          submitBtn.textContent = originalText;
          submitBtn.classList.remove('form-submit--success');
          submitBtn.disabled = false;
        }, 3000);

      }, 1500);
    });
  }

  // --- Scroll Reveal ---
  const revealElements = document.querySelectorAll('.reveal');

  if (revealElements.length > 0) {
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const delay = entry.target.dataset.delay || 0;
          setTimeout(() => {
            entry.target.classList.add('visible');
          }, delay);
          revealObserver.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -40px 0px'
    });

    revealElements.forEach(el => revealObserver.observe(el));
  }

  // --- Active Nav Highlighting ---
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav a[href^="#"]');

  if (sections.length > 0 && navLinks.length > 0) {
    const navObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const id = entry.target.getAttribute('id');
          navLinks.forEach(link => {
            link.style.color = '';
            if (link.getAttribute('href') === `#${id}`) {
              link.style.color = 'var(--clr-accent)';
            }
          });
        }
      });
    }, {
      threshold: 0.3,
      rootMargin: `-${parseInt(getComputedStyle(document.documentElement).getPropertyValue('--header-height')) || 64}px 0px 0px 0px`
    });

    sections.forEach(section => navObserver.observe(section));
  }

});
