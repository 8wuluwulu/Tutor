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
    bookingForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      const submitBtn = bookingForm.querySelector('.form-submit') || bookingForm.querySelector('button[type="submit"]');
      const originalText = submitBtn.textContent;

      submitBtn.disabled = true;
      submitBtn.textContent = 'Отправка...';
      submitBtn.style.opacity = '0.8';

      try {
        // 1. Безопасный сбор данных (ищем поля по типу или id, а не только по плейсхолдеру)
        const nameInput = bookingForm.querySelector('input[type="text"]');
        const phoneInput = bookingForm.querySelector('input[type="tel"]') || bookingForm.querySelectorAll('input[type="text"]')[1];
        const serviceInput = document.getElementById('service') || bookingForm.querySelector('select');
        const timeInput = bookingForm.querySelectorAll('select')[1]; // Второе выпадающее меню

        // Проверяем, все ли поля нашлись в HTML
        if (!nameInput || !phoneInput || !serviceInput || !timeInput) {
          throw new Error("Не удалось найти одно из полей формы в HTML. Проверьте селекторы.");
        }

        const bookingData = {
          name: nameInput.value,
          phone: phoneInput.value,
          service: serviceInput.value,
          time: timeInput.value
        };

        console.log("Отправляем данные на сервер:", bookingData); // Выводим в консоль для отладки

        // 2. Отправляем запрос
        const response = await fetch('https://tutor-back-9yjw.onrender.com/api/book', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(bookingData)
        });

        if (response.ok) {
          submitBtn.textContent = 'Заявка отправлена!';
          submitBtn.style.backgroundColor = '#10B981'; // Зеленый
          submitBtn.style.color = '#fff';
          bookingForm.reset();

          // Убираем активный класс с карточек (если они есть)
          document.querySelectorAll('.service-card').forEach(c => c.classList.remove('active'));
        } else {
          // Если Python вернул ошибку (например 422)
          const errorData = await response.json();
          console.error("Ответ сервера:", errorData);
          throw new Error('Ошибка на стороне сервера');
        }

      } catch (error) {
        // Если произошла любая ошибка (не нашли поле, нет интернета, выключен сервер)
        console.error('КРИТИЧЕСКАЯ ОШИБКА:', error);
        submitBtn.textContent = 'Ошибка отправки!';
        submitBtn.style.backgroundColor = '#EF4444'; // Красный
        submitBtn.style.color = '#fff';
      } finally {
        // Через 3 секунды возвращаем кнопку в норму
        setTimeout(() => {
          submitBtn.textContent = originalText;
          submitBtn.style.backgroundColor = '';
          submitBtn.style.color = '';
          submitBtn.disabled = false;
          submitBtn.style.opacity = '1';
        }, 3000);
      }
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
