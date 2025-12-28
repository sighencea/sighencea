/**
 * Sighencea - Main JavaScript
 * Handles navigation, animations, and form submission
 */

(function() {
  'use strict';

  // ==========================================================================
  // Navigation Module
  // ==========================================================================

  const Navigation = {
    menuToggle: null,
    mobileMenu: null,
    iconMenu: null,
    iconClose: null,
    isOpen: false,

    init() {
      this.menuToggle = document.getElementById('menu-toggle');
      this.mobileMenu = document.getElementById('mobile-menu');
      this.iconMenu = this.menuToggle?.querySelector('.icon-menu');
      this.iconClose = this.menuToggle?.querySelector('.icon-close');

      if (this.menuToggle && this.mobileMenu) {
        this.setupMenuToggle();
      }

      this.setupPageTransitions();
    },

    setupMenuToggle() {
      this.menuToggle.addEventListener('click', () => {
        this.toggleMenu();
      });

      // Close menu when clicking on a link
      const mobileLinks = this.mobileMenu.querySelectorAll('a');
      mobileLinks.forEach(link => {
        link.addEventListener('click', () => {
          this.closeMenu();
        });
      });

      // Close menu on escape key
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && this.isOpen) {
          this.closeMenu();
        }
      });
    },

    toggleMenu() {
      this.isOpen = !this.isOpen;
      this.mobileMenu.classList.toggle('is-open', this.isOpen);
      this.iconMenu.classList.toggle('hidden', this.isOpen);
      this.iconClose.classList.toggle('hidden', !this.isOpen);

      // Prevent body scroll when menu is open
      document.body.style.overflow = this.isOpen ? 'hidden' : '';
    },

    closeMenu() {
      this.isOpen = false;
      this.mobileMenu.classList.remove('is-open');
      this.iconMenu?.classList.remove('hidden');
      this.iconClose?.classList.add('hidden');
      document.body.style.overflow = '';
    },

    setupPageTransitions() {
      const transitionOverlay = document.getElementById('page-transition');
      const navLinks = document.querySelectorAll('[data-nav-link]');

      if (!transitionOverlay || navLinks.length === 0) return;

      navLinks.forEach(link => {
        link.addEventListener('click', async (e) => {
          const href = link.getAttribute('href');

          // Skip if external link, anchor, or same page
          if (!href || href.startsWith('#') || href.startsWith('http') || href.startsWith('mailto')) {
            return;
          }

          // Skip if ctrl/cmd click (new tab)
          if (e.ctrlKey || e.metaKey) {
            return;
          }

          e.preventDefault();

          // Start exit animation
          transitionOverlay.classList.add('is-animating-out');

          // Wait for animation
          await this.wait(400);

          // Navigate to new page
          window.location.href = href;
        });
      });

      // Handle page load animation
      window.addEventListener('pageshow', () => {
        transitionOverlay.classList.remove('is-animating-out');
        transitionOverlay.classList.add('is-animating-in');

        setTimeout(() => {
          transitionOverlay.classList.remove('is-animating-in');
        }, 400);
      });
    },

    wait(ms) {
      return new Promise(resolve => setTimeout(resolve, ms));
    }
  };

  // ==========================================================================
  // Scroll Animations Module
  // ==========================================================================

  const ScrollAnimations = {
    observer: null,

    init() {
      const animatedElements = document.querySelectorAll('[data-animate]');

      if (animatedElements.length === 0) return;

      this.observer = new IntersectionObserver(
        (entries) => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              entry.target.classList.add('is-visible');
              this.observer.unobserve(entry.target);
            }
          });
        },
        {
          threshold: 0.1,
          rootMargin: '0px 0px -50px 0px'
        }
      );

      animatedElements.forEach(el => this.observer.observe(el));
    }
  };

  // ==========================================================================
  // Form Handler Module (Formspree)
  // ==========================================================================

  const FormHandler = {
    form: null,
    successMessage: null,
    errorMessage: null,
    submitBtn: null,
    btnText: null,
    btnLoading: null,

    init() {
      this.form = document.querySelector('[data-contact-form]');
      if (!this.form) return;

      this.successMessage = document.getElementById('form-success');
      this.errorMessage = document.getElementById('form-error');
      this.submitBtn = this.form.querySelector('button[type="submit"]');
      this.btnText = this.submitBtn?.querySelector('.btn-text');
      this.btnLoading = this.submitBtn?.querySelector('.btn-loading');

      this.setupFormHandler();
    },

    setupFormHandler() {
      this.form.addEventListener('submit', async (e) => {
        e.preventDefault();
        await this.handleSubmit();
      });
    },

    async handleSubmit() {
      // Show loading state
      this.setLoading(true);

      try {
        const formData = new FormData(this.form);

        const response = await fetch(this.form.action, {
          method: 'POST',
          body: formData,
          headers: {
            'Accept': 'application/json'
          }
        });

        if (response.ok) {
          this.showSuccess();
        } else {
          throw new Error('Form submission failed');
        }
      } catch (error) {
        console.error('Form error:', error);
        this.showError();
      } finally {
        this.setLoading(false);
      }
    },

    setLoading(isLoading) {
      if (this.submitBtn) {
        this.submitBtn.disabled = isLoading;
      }
      if (this.btnText) {
        this.btnText.classList.toggle('hidden', isLoading);
      }
      if (this.btnLoading) {
        this.btnLoading.classList.toggle('hidden', !isLoading);
      }
    },

    showSuccess() {
      this.form.classList.add('hidden');
      if (this.successMessage) {
        this.successMessage.classList.remove('hidden');
      }
    },

    showError() {
      if (this.errorMessage) {
        this.errorMessage.classList.remove('hidden');
        setTimeout(() => {
          this.errorMessage.classList.add('hidden');
        }, 5000);
      }
    }
  };

  // ==========================================================================
  // Smooth Scroll (for anchor links)
  // ==========================================================================

  const SmoothScroll = {
    init() {
      document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', (e) => {
          const href = anchor.getAttribute('href');
          if (href === '#') return;

          const target = document.querySelector(href);
          if (target) {
            e.preventDefault();
            target.scrollIntoView({
              behavior: 'smooth',
              block: 'start'
            });
          }
        });
      });
    }
  };

  // ==========================================================================
  // Back to Top Button
  // ==========================================================================

  const BackToTop = {
    button: null,

    init() {
      this.button = document.getElementById('back-to-top');
      if (!this.button) return;

      this.setupScrollListener();
      this.setupClickHandler();
    },

    setupScrollListener() {
      window.addEventListener('scroll', () => {
        if (window.scrollY > 300) {
          this.button.classList.add('is-visible');
        } else {
          this.button.classList.remove('is-visible');
        }
      });
    },

    setupClickHandler() {
      this.button.addEventListener('click', () => {
        window.scrollTo({
          top: 0,
          behavior: 'smooth'
        });
      });
    }
  };

  // ==========================================================================
  // Initialize All Modules
  // ==========================================================================

  const App = {
    init() {
      // Wait for DOM to be ready
      if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => this.setup());
      } else {
        this.setup();
      }
    },

    setup() {
      Navigation.init();
      ScrollAnimations.init();
      FormHandler.init();
      SmoothScroll.init();
      BackToTop.init();
      this.updateCopyrightYear();

      // Scroll to top on page load
      window.scrollTo(0, 0);

      console.log('[SIGHENCEA] System initialized');
    },

    updateCopyrightYear() {
      const yearElements = document.querySelectorAll('.current-year');
      const currentYear = new Date().getFullYear();
      yearElements.forEach(el => {
        el.textContent = currentYear;
      });
    }
  };

  // Start the app
  App.init();

})();
