/**
 * Azeem Afzal Dental Surgery Centre
 * Core Frontend Interactions & Clinic Configuration
 */

// Central Clinic Source of Truth
export const CLINIC_CONFIG = {
  name: "Azeem Afzal Dental Surgery Centre",
  shortName: "Azeem Afzal Dental Centre",
  businessCategory: "Dental Clinic",
  primaryPhone: "+92 370 1309729",
  primaryPhoneRaw: "+923701309729",
  additionalPhone: "03117700766",
  additionalPhoneRaw: "03117700766",
  whatsappNumber: "923701309729", // Format without + for wa.me API
  address: "Imam Bargah Road, near Ideal Bakery, Jinnah Colony, Faisalabad, Pakistan",
  plusCode: "C3C7+GX Faisalabad, Pakistan",
  googleMapsUrl: "https://www.google.com/maps/search/?api=1&query=Azeem+Afzal+Dental+Surgery+Centre,+Imam+Bargah+Rd,+Jinnah+Colony,+Faisalabad,+Pakistan",
  openingHours: "Open · Closes 8:30 PM",
  googleRating: "4.3",
  googleReviewsCount: "15",
  ratingMax: "5.0"
};

// Make config globally accessible
window.CLINIC_CONFIG = CLINIC_CONFIG;

// Document Ready Initialization
document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initMobileMenu();
  initCounters();
  initAboutToggle();
  initGalleryTabs();
  initLightbox();
  initServiceModal();
  initSmoothScroll();
});

/* 1. Sticky Navbar Transition */
function initNavbar() {
  const navbar = document.querySelector('.navbar');
  if (!navbar) return;

  const handleScroll = () => {
    if (window.scrollY > 40) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();
}

/* 2. Mobile Drawer Menu */
function initMobileMenu() {
  const toggleBtn = document.querySelector('.mobile-toggle');
  const navMenu = document.querySelector('.nav-menu');
  if (!toggleBtn || !navMenu) return;

  toggleBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    const isOpen = navMenu.classList.toggle('active');
    toggleBtn.setAttribute('aria-expanded', String(isOpen));
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });

  // Close when clicking any nav link
  navMenu.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      navMenu.classList.remove('active');
      toggleBtn.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    });
  });

  // Close when clicking outside
  document.addEventListener('click', (e) => {
    if (navMenu.classList.contains('active') && !navMenu.contains(e.target) && !toggleBtn.contains(e.target)) {
      navMenu.classList.remove('active');
      toggleBtn.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    }
  });
}

/* 3. Smooth Scroll Navigation */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const targetId = this.getAttribute('href');
      if (!targetId || targetId === '#') return;
      const targetEl = document.querySelector(targetId);
      if (targetEl) {
        e.preventDefault();
        const headerOffset = 85;
        const elementPosition = targetEl.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    });
  });
}

/* 4. Verified Stats Counter */
function initCounters() {
  const counters = document.querySelectorAll('[data-counter]');
  if (!counters.length) return;

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const targetValue = parseFloat(el.getAttribute('data-counter') || '0');
        const isDecimal = String(targetValue).includes('.');
        const duration = 1200;
        const startTime = performance.now();

        const updateCount = (currentTime) => {
          const elapsed = currentTime - startTime;
          const progress = Math.min(elapsed / duration, 1);
          // Ease-out cubic
          const easeProgress = 1 - Math.pow(1 - progress, 3);
          const currentVal = targetValue * easeProgress;

          el.textContent = isDecimal ? currentVal.toFixed(1) : Math.floor(currentVal);

          if (progress < 1) {
            requestAnimationFrame(updateCount);
          } else {
            el.textContent = isDecimal ? targetValue.toFixed(1) : targetValue;
          }
        };

        requestAnimationFrame(updateCount);
        obs.unobserve(el);
      }
    });
  }, { threshold: 0.3 });

  counters.forEach(counter => observer.observe(counter));
}

/* 5. About Learn More Interaction */
function initAboutToggle() {
  const toggleBtn = document.getElementById('about-learn-more-btn');
  const detailsBox = document.getElementById('about-expandable-details');
  if (!toggleBtn || !detailsBox) return;

  toggleBtn.addEventListener('click', () => {
    const isExpanded = detailsBox.classList.toggle('active');
    toggleBtn.innerHTML = isExpanded 
      ? `<span>Show Less</span> <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m18 15-6-6-6 6"/></svg>`
      : `<span>Learn More About Our Clinic</span> <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m6 9 6 6 6-6"/></svg>`;
  });
}

/* 6. Gallery Filtering */
function initGalleryTabs() {
  const tabs = document.querySelectorAll('.gallery-tab');
  const items = document.querySelectorAll('.gallery-item');
  if (!tabs.length || !items.length) return;

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      const filter = tab.getAttribute('data-filter') || 'all';

      items.forEach(item => {
        const itemCategory = item.getAttribute('data-category');
        if (filter === 'all' || itemCategory === filter) {
          item.style.display = 'block';
        } else {
          item.style.display = 'none';
        }
      });
    });
  });
}

/* 7. Gallery Lightbox */
function initLightbox() {
  const lightbox = document.getElementById('gallery-lightbox');
  if (!lightbox) return;

  const lightboxImg = lightbox.querySelector('.lightbox__img');
  const lightboxCaption = lightbox.querySelector('.lightbox__caption');
  const closeBtn = lightbox.querySelector('.lightbox__close');

  document.querySelectorAll('.gallery-item').forEach(item => {
    item.addEventListener('click', () => {
      const img = item.querySelector('img');
      const caption = item.querySelector('.gallery-item__caption')?.textContent || '';
      if (img && lightboxImg) {
        lightboxImg.src = img.src;
        lightboxImg.alt = img.alt || caption;
        if (lightboxCaption) lightboxCaption.textContent = caption;
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden';
      }
    });
  });

  const closeLightbox = () => {
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
  };

  if (closeBtn) closeBtn.addEventListener('click', closeLightbox);
  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) closeLightbox();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && lightbox.classList.contains('active')) {
      closeLightbox();
    }
  });
}

/* 8. Service Detail Modal */
function initServiceModal() {
  const modal = document.getElementById('service-modal');
  if (!modal) return;

  const modalTitle = modal.querySelector('#modal-service-title');
  const modalDesc = modal.querySelector('#modal-service-desc');
  const closeBtn = modal.querySelector('.modal__close');
  const bookBtn = modal.querySelector('#modal-book-service');

  document.querySelectorAll('.service-card__link').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const card = link.closest('.service-card');
      if (!card) return;

      const title = card.querySelector('.service-card__title')?.textContent || 'Dental Service';
      const desc = card.querySelector('.service-card__desc')?.textContent || '';

      if (modalTitle) modalTitle.textContent = title;
      if (modalDesc) modalDesc.textContent = desc;
      if (bookBtn) {
        bookBtn.href = `#appointment`;
        bookBtn.addEventListener('click', () => {
          modal.classList.remove('active');
          const serviceSelect = document.getElementById('appointment-service');
          if (serviceSelect) {
            for (let option of serviceSelect.options) {
              if (option.text.toLowerCase().includes(title.toLowerCase())) {
                serviceSelect.value = option.value;
                break;
              }
            }
          }
        });
      }

      modal.classList.add('active');
      document.body.style.overflow = 'hidden';
    });
  });

  const closeModal = () => {
    modal.classList.remove('active');
    document.body.style.overflow = '';
  };

  if (closeBtn) closeBtn.addEventListener('click', closeModal);
  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });
}

/* Toast Message Helper */
export function showToast(message, type = 'success') {
  let toastContainer = document.getElementById('toast-container');
  if (!toastContainer) {
    toastContainer = document.createElement('div');
    toastContainer.id = 'toast-container';
    toastContainer.style.cssText = `
      position: fixed;
      top: 24px;
      right: 24px;
      z-index: 9999;
      display: flex;
      flex-direction: column;
      gap: 10px;
    `;
    document.body.appendChild(toastContainer);
  }

  const toast = document.createElement('div');
  const bgColor = type === 'success' ? '#0F766E' : '#B91C1C';
  toast.style.cssText = `
    background-color: ${bgColor};
    color: #FFFFFF;
    padding: 12px 20px;
    border-radius: 8px;
    box-shadow: 0 10px 25px rgba(15, 23, 42, 0.2);
    font-size: 14px;
    font-weight: 600;
    max-width: 360px;
    animation: fadeInUp 0.3s ease-out;
  `;
  toast.textContent = message;
  toastContainer.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(-10px)';
    toast.style.transition = 'all 0.3s ease';
    setTimeout(() => toast.remove(), 300);
  }, 4000);
}
