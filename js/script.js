/* ============================================
   TutorPro — JavaScript (v5)
   "Smart & Kind" Validation · Digit Blocker
   Phone Masking · Polished Mobile Menu
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {

  // ══════════════════════════════════
  //  HEADER SCROLL EFFECT
  // ══════════════════════════════════
  const header = document.querySelector('.header');
  const onScroll = () => {
    header.classList.toggle('header--scrolled', window.scrollY > 20);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();


  // ══════════════════════════════════
  //  MOBILE MENU — Stable toggle
  // ══════════════════════════════════
  const menuToggle = document.querySelector('.menu-toggle');
  const mobileMenu = document.querySelector('.mobile-menu');

  function closeMobileMenu() {
    menuToggle.classList.remove('active');
    mobileMenu.classList.remove('active');
    document.body.style.overflow = '';
  }

  if (menuToggle && mobileMenu) {
    menuToggle.addEventListener('click', () => {
      const isOpen = mobileMenu.classList.contains('active');
      if (isOpen) {
        closeMobileMenu();
      } else {
        menuToggle.classList.add('active');
        mobileMenu.classList.add('active');
        document.body.style.overflow = 'hidden';
      }
    });

    // Close menu on any link click
    mobileMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', closeMobileMenu);
    });

    // Close menu on Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && mobileMenu.classList.contains('active')) {
        closeMobileMenu();
      }
    });
  }


  // ══════════════════════════════════
  //  SMOOTH SCROLLING
  // ══════════════════════════════════
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


  // ══════════════════════════════════
  //  INTERACTIVE SERVICE CARD SELECTION
  // ══════════════════════════════════
  const serviceCards = document.querySelectorAll('.service-card[data-service]');
  const serviceSelect = document.getElementById('service');

  serviceCards.forEach(card => {
    card.addEventListener('click', (e) => {
      if (e.target.closest('.service-card__btn')) return;

      serviceCards.forEach(c => c.classList.remove('active'));
      card.classList.add('active');

      const serviceValue = card.dataset.service;
      if (serviceSelect) {
        serviceSelect.value = serviceValue;
        clearFieldState(serviceSelect);
        setFieldValid(serviceSelect);
        serviceSelect.dispatchEvent(new Event('change', { bubbles: true }));
      }
    });

    const btn = card.querySelector('.service-card__btn');
    if (btn) {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        serviceCards.forEach(c => c.classList.remove('active'));
        card.classList.add('active');

        const serviceValue = card.dataset.service;
        if (serviceSelect) {
          serviceSelect.value = serviceValue;
          clearFieldState(serviceSelect);
          setFieldValid(serviceSelect);
        }

        const booking = document.getElementById('booking');
        if (booking) {
          booking.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      });
    }
  });


  // ══════════════════════════════════
  //  NAME FIELD — Digit Blocker
  //  Instantly strips any numeric chars
  // ══════════════════════════════════
  function setupNameInput(input) {
    if (!input) return;
    input.addEventListener('input', () => {
      const cursor = input.selectionStart;
      const before = input.value;
      const cleaned = before.replace(/[0-9]/g, '');
      if (cleaned !== before) {
        const diff = before.length - cleaned.length;
        input.value = cleaned;
        // Restore cursor position adjusted for removed chars
        input.setSelectionRange(cursor - diff, cursor - diff);
      }
    });
  }


  // ══════════════════════════════════
  //  PHONE MASK — +7 (XXX) XXX-XX-XX
  //  Supports Telegram @handles
  // ══════════════════════════════════
  function setupContactInput(input) {
    if (!input) return;

    let isTelegramMode = false;

    input.addEventListener('input', (e) => {
      const raw = input.value;

      // 1. Режим Telegram (начинается с @)
      if (raw.startsWith('@')) {
        isTelegramMode = true;
        return;
      }

      // 2. Режим телефона
      if (!isTelegramMode) {
        let digits = raw.replace(/\D/g, '');

        // Если поле пустое — даем его очистить полностью
        if (digits.length === 0) {
          input.value = '';
          return;
        }

        // Нормализация первой цифры
        if (digits.startsWith('8')) digits = '7' + digits.slice(1);
        if (!digits.startsWith('7')) digits = '7' + digits;

        // Ограничение длины
        digits = digits.slice(0, 11);

        let formatted = '+' + digits[0];

        // Код города: скобка открывается при 2-й цифре
        if (digits.length >= 2) {
          formatted += ' (' + digits.substring(1, 4);
        }

        // КЛЮЧЕВОЙ МОМЕНТ: скобка закрывается только если цифр БОЛЬШЕ 4
        // Это позволяет спокойно удалять цифру внутри скобок, не «залипая» на них
        if (digits.length > 4) {
          formatted += ') ' + digits.substring(4, 7);
        } else if (digits.length === 4) {
          // Если ровно 4 цифры (например, +7 (333), скобку не ставим принудительно при удалении
          formatted += '';
        }

        if (digits.length >= 8) formatted += '-' + digits.substring(7, 9);
        if (digits.length >= 10) formatted += '-' + digits.substring(9, 11);

        input.value = formatted;
      }
    });

    // 3. Хак для Backspace
    // Если пользователь удаляет символ и остается "+7 (", принудительно чистим всё
    input.addEventListener('keydown', (e) => {
      if (e.key === 'Backspace') {
        const val = input.value;
        if (val === '+7 (' || val.length <= 4) {
          if (!isTelegramMode) {
            input.value = '';
            isTelegramMode = false;
          }
        }
      }
    });

    // Сброс режимов при очистке
    input.addEventListener('focus', () => {
      if (input.value === '') isTelegramMode = false;
    });
    input.addEventListener('input', () => {
      if (input.value === '') isTelegramMode = false;
    });
  }


  // ══════════════════════════════════
  //  VALIDATION — "Smart & Kind"
  //  Real-time, as-you-type feedback
  // ══════════════════════════════════

  /** Clear all validation state from a field */
  function clearFieldState(field) {
    field.classList.remove('error', 'valid');
    const errorMsg = field.closest('.form-group')?.querySelector('.error-message');
    if (errorMsg) errorMsg.classList.remove('visible');
  }

  /** Mark a field as valid (green border) */
  function setFieldValid(field) {
    field.classList.remove('error');
    field.classList.add('valid');
    const errorMsg = field.closest('.form-group')?.querySelector('.error-message');
    if (errorMsg) errorMsg.classList.remove('visible');
  }

  /** Mark a field as invalid with a friendly message */
  function setFieldError(field, message) {
    field.classList.remove('valid');
    field.classList.add('error');
    const errorMsg = field.closest('.form-group')?.querySelector('.error-message');
    if (errorMsg) {
      errorMsg.textContent = message;
      errorMsg.classList.add('visible');
    }
  }

  // Validation rules
  const validators = {
    name: (value) => {
      const trimmed = value.trim();
      if (trimmed.length === 0) return { valid: false, message: 'Пожалуйста, введите ваше имя' };
      if (trimmed.length < 2) return { valid: false, message: 'Имя должно содержать минимум 2 символа' };
      return { valid: true };
    },
    contact: (value) => {
      const trimmed = value.trim();
      if (trimmed.length === 0) return { valid: false, message: 'Укажите телефон или Telegram' };
      // Telegram handle
      if (trimmed.startsWith('@')) {
        if (trimmed.length < 4) return { valid: false, message: 'Минимум 3 символа после @' };
        return { valid: true };
      }
      // Phone — need 11 digits for Russian number
      const digits = trimmed.replace(/\D/g, '');
      if (digits.length < 11) return { valid: false, message: 'Введите полный номер телефона' };
      return { valid: true };
    },
    service: (value) => {
      if (!value || value.length === 0) return { valid: false, message: 'Выберите программу обучения' };
      return { valid: true };
    },
    time: (value) => {
      if (!value || value.length === 0) return { valid: false, message: 'Выберите удобное время' };
      return { valid: true };
    }
  };

  /** Attach live validation listeners to a field */
  function attachLiveValidation(field, validatorKey) {
    if (!field) return;
    const validator = validators[validatorKey];
    if (!validator) return;

    const isSelect = field.tagName === 'SELECT';
    const inputEvent = isSelect ? 'change' : 'input';

    // On input/change — show green while valid, clear error while typing
    field.addEventListener(inputEvent, () => {
      const result = validator(field.value);
      if (result.valid) {
        setFieldValid(field);
      } else {
        // While typing, just clear error — don't nag yet
        clearFieldState(field);
      }
    });

    // On blur — full validation with friendly error
    field.addEventListener('blur', () => {
      const val = field.value.trim();
      if (val.length === 0) {
        clearFieldState(field); // Don't scold on empty blur
        return;
      }
      const result = validator(field.value);
      if (result.valid) {
        setFieldValid(field);
      } else {
        setFieldError(field, result.message);
      }
    });
  }


  // ══════════════════════════════════
  //  FORM SETUP & SUBMISSION
  // ══════════════════════════════════
  const bookingForm = document.getElementById('booking-form');

  if (bookingForm) {
    const nameInput = document.getElementById('name');
    const contactInput = document.getElementById('contact');
    const serviceInput = document.getElementById('service');
    const timeInput = document.getElementById('time');

    // Setup digit blocker on name field
    setupNameInput(nameInput);

    // Setup phone masking on contact field
    setupContactInput(contactInput);

    // Attach live validation to all form fields
    attachLiveValidation(nameInput, 'name');
    attachLiveValidation(contactInput, 'contact');
    attachLiveValidation(serviceInput, 'service');
    attachLiveValidation(timeInput, 'time');

    bookingForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      // ── Final validation pass ──
      let isValid = true;
      let firstInvalid = null;

      const fieldChecks = [
        { el: nameInput, key: 'name' },
        { el: contactInput, key: 'contact' },
        { el: serviceInput, key: 'service' },
        { el: timeInput, key: 'time' }
      ];

      fieldChecks.forEach(({ el, key }) => {
        if (!el) { isValid = false; return; }
        const result = validators[key](el.value);
        if (!result.valid) {
          setFieldError(el, result.message);
          isValid = false;
          if (!firstInvalid) firstInvalid = el;
        } else {
          setFieldValid(el);
        }
      });

      if (!isValid) {
        if (firstInvalid) firstInvalid.focus();
        return;
      }

      // ── Submit with loading state ──
      const submitBtn = bookingForm.querySelector('.form-submit') || bookingForm.querySelector('button[type="submit"]');
      const originalText = submitBtn.textContent;

      submitBtn.disabled = true;
      submitBtn.textContent = 'Отправка…';
      submitBtn.style.opacity = '0.7';

      try {
        const bookingData = {
          name: nameInput.value.trim(),
          phone: contactInput.value.trim(),
          service: serviceInput.value,
          time: timeInput.value,
          honeypot: document.getElementById('honeypot').value
        };

        console.log('Отправляем данные на сервер:', bookingData);

        const response = await fetch('https://tutor-back-9yjw.onrender.com/api/book', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(bookingData)
        });

        if (response.ok) {
          submitBtn.textContent = '✓  Заявка отправлена!';
          submitBtn.classList.add('form-submit--success');
          bookingForm.reset();

          // Clear all validation states
          [nameInput, contactInput, serviceInput, timeInput].forEach(f => {
            if (f) clearFieldState(f);
          });

          // Deselect service cards
          document.querySelectorAll('.service-card').forEach(c => c.classList.remove('active'));

          // Reset button after 4 seconds
          setTimeout(() => {
            submitBtn.textContent = originalText;
            submitBtn.classList.remove('form-submit--success');
            submitBtn.style.backgroundColor = '';
            submitBtn.style.borderColor = '';
            submitBtn.style.color = '';
            submitBtn.disabled = false;
            submitBtn.style.opacity = '1';
          }, 4000);
        } else {
          let errorMsg = 'Ошибка на стороне сервера';
          try {
            const errorData = await response.json();
            console.error('Ответ сервера:', errorData);
            if (errorData.detail) errorMsg = errorData.detail;
          } catch (_) { /* response wasn't JSON */ }
          throw new Error(errorMsg);
        }

      } catch (error) {
        console.error('Ошибка отправки:', error);
        submitBtn.textContent = 'Ошибка. Попробуйте снова';
        submitBtn.style.backgroundColor = '#EF4444';
        submitBtn.style.borderColor = '#EF4444';
        submitBtn.style.color = '#fff';

        // Immediately re-enable so user can retry
        submitBtn.disabled = false;
        submitBtn.style.opacity = '1';

        // Reset style after 3 seconds
        setTimeout(() => {
          submitBtn.textContent = originalText;
          submitBtn.style.backgroundColor = '';
          submitBtn.style.borderColor = '';
          submitBtn.style.color = '';
        }, 3000);
      }
    });
  }


  // ══════════════════════════════════
  //  SCROLL REVEAL
  // ══════════════════════════════════
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


  // ══════════════════════════════════
  //  ACTIVE NAV HIGHLIGHTING
  // ══════════════════════════════════
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
