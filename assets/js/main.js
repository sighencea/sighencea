/**
 * Sighencea - Main JavaScript
 * Handles navigation, animations, portfolio filtering, contact tabs, and form submission
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
  // Portfolio Filter Module
  // ==========================================================================

  const PortfolioFilter = {
    filterContainer: null,
    filterButtons: null,
    projects: null,
    emptyState: null,
    currentFilter: 'all',

    init() {
      this.filterContainer = document.querySelector('[data-portfolio-filter]');
      if (!this.filterContainer) return;

      this.filterButtons = this.filterContainer.querySelectorAll('[data-filter]');
      this.projects = document.querySelectorAll('[data-project]');
      this.emptyState = document.getElementById('empty-state');

      this.setupFilters();
    },

    setupFilters() {
      this.filterButtons.forEach(button => {
        button.addEventListener('click', () => {
          const filter = button.getAttribute('data-filter');
          this.applyFilter(filter);
          this.updateActiveButton(button);
        });
      });
    },

    applyFilter(filter) {
      this.currentFilter = filter;
      let visibleCount = 0;

      this.projects.forEach((project, index) => {
        const category = project.getAttribute('data-category');
        const matches = filter === 'all' || category === filter;

        if (matches) {
          visibleCount++;
          project.classList.remove('is-hidden');
          project.style.display = '';

          // Add staggered animation
          setTimeout(() => {
            project.classList.add('is-entering');
            setTimeout(() => {
              project.classList.remove('is-entering');
            }, 300);
          }, index * 50);
        } else {
          project.classList.add('is-hidden');
          setTimeout(() => {
            if (project.classList.contains('is-hidden')) {
              project.style.display = 'none';
            }
          }, 300);
        }
      });

      // Show/hide empty state
      if (this.emptyState) {
        this.emptyState.classList.toggle('hidden', visibleCount > 0);
      }
    },

    updateActiveButton(activeButton) {
      this.filterButtons.forEach(button => {
        button.classList.remove('active');
      });
      activeButton.classList.add('active');
    }
  };

  // ==========================================================================
  // Contact Tabs Module
  // ==========================================================================

  const ContactTabs = {
    tabs: null,
    formTitle: null,
    subjectSelect: null,
    messageTextarea: null,
    activeTab: 'leather',

    leatherSubjects: [
      { value: 'bespoke_commission', label: 'BESPOKE_COMMISSION' },
      { value: 'restoration_inquiry', label: 'RESTORATION_INQUIRY' },
      { value: 'product_question', label: 'PRODUCT_QUESTION' },
      { value: 'other', label: 'OTHER' }
    ],

    softwareSubjects: [
      { value: 'project_consultation', label: 'PROJECT_CONSULTATION' },
      { value: 'technical_advisory', label: 'TECHNICAL_ADVISORY' },
      { value: 'partnership', label: 'PARTNERSHIP' },
      { value: 'other', label: 'OTHER' }
    ],

    init() {
      this.tabs = document.querySelectorAll('[data-tab]');
      this.formTitle = document.getElementById('form-title');
      this.subjectSelect = document.getElementById('subject');
      this.messageTextarea = document.getElementById('message');

      if (this.tabs.length === 0) return;

      this.setupTabs();
    },

    setupTabs() {
      this.tabs.forEach(tab => {
        tab.addEventListener('click', () => {
          const tabId = tab.getAttribute('data-tab');
          this.switchTab(tabId);
          this.updateActiveTab(tab);
        });
      });
    },

    switchTab(tabId) {
      this.activeTab = tabId;

      // Update form title
      if (this.formTitle) {
        this.formTitle.textContent = tabId === 'leather'
          ? '[START_COMMISSION]'
          : '[DISCUSS_PROJECT]';
      }

      // Update subject options
      if (this.subjectSelect) {
        const subjects = tabId === 'leather' ? this.leatherSubjects : this.softwareSubjects;
        this.subjectSelect.innerHTML = subjects
          .map(s => `<option value="${s.value}">${s.label}</option>`)
          .join('');
      }

      // Update placeholder text
      if (this.messageTextarea) {
        this.messageTextarea.placeholder = tabId === 'leather'
          ? 'DESCRIBE_THE_PIECE_YOU_ENVISION...'
          : 'DESCRIBE_THE_PROBLEM_YOU_ARE_SOLVING...';
      }
    },

    updateActiveTab(activeTab) {
      this.tabs.forEach(tab => {
        tab.classList.remove('active');
        const icon = tab.querySelector('svg');
        if (icon) {
          icon.classList.toggle('text-lime', tab === activeTab);
          icon.classList.toggle('text-cream/60', tab !== activeTab);
        }
      });
      activeTab.classList.add('active');
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
      PortfolioFilter.init();
      ContactTabs.init();
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
