/**
 * Azeem Afzal Dental Surgery Centre
 * Premium GSAP & ScrollTrigger Animation Engine
 */

import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger);

// Ensure global accessibility if needed
window.gsap = gsap;
window.ScrollTrigger = ScrollTrigger;

document.addEventListener('DOMContentLoaded', () => {
  // Check prefers-reduced-motion
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReducedMotion) {
    document.querySelectorAll('.reveal').forEach(el => el.classList.add('active'));
    return;
  }

  // Initialize GSAP Animation Suite
  initHeroAnimations();
  initScrollAnimations();
  initInteractiveParallax();
  initCardHoverEffects();
});

/* 1. Hero Entrance Animations */
function initHeroAnimations() {
  const heroSection = document.querySelector('.hero');
  if (!heroSection) return;

  const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

  // Top navbar elements
  tl.from('.brand', { 
    opacity: 0, 
    x: -25, 
    duration: 0.8 
  })
  .from('.nav-link', { 
    opacity: 0, 
    y: -12, 
    stagger: 0.05, 
    duration: 0.5 
  }, '-=0.5')
  .from('.nav-actions > *', {
    opacity: 0,
    scale: 0.9,
    duration: 0.5
  }, '-=0.3')
  
  // Hero content
  .from('.hero__location-chip', { 
    opacity: 0, 
    y: 20, 
    scale: 0.95,
    duration: 0.6 
  }, '-=0.3')
  .from('.hero__title', { 
    opacity: 0, 
    y: 35, 
    duration: 0.9 
  }, '-=0.4')
  .from('.hero__subtitle', { 
    opacity: 0, 
    y: 20, 
    duration: 0.7 
  }, '-=0.5')
  .from('.hero__cta-group > *', { 
    opacity: 0, 
    y: 20, 
    stagger: 0.12, 
    duration: 0.6,
    ease: 'back.out(1.4)'
  }, '-=0.4')
  .from('.hero__verified-badge', { 
    opacity: 0, 
    scale: 0.9, 
    duration: 0.6 
  }, '-=0.3')
  
  // Hero visual frame
  .from('.hero__image-wrapper', { 
    opacity: 0, 
    x: 40, 
    duration: 1.1,
    ease: 'power2.out'
  }, '-=0.9')
  .from('.hero__floating-card', { 
    opacity: 0, 
    y: 30, 
    scale: 0.92,
    duration: 0.7,
    ease: 'back.out(1.5)'
  }, '-=0.5');

  // Infinite gentle float for the card
  gsap.to('.hero__floating-card', {
    y: -8,
    duration: 3,
    repeat: -1,
    yoyo: true,
    ease: 'sine.inOut'
  });
}

/* 2. ScrollTrigger Stagger & Reveal Suite */
function initScrollAnimations() {
  // Trust Strip Cards
  const trustItems = document.querySelectorAll('.trust-item');
  if (trustItems.length) {
    gsap.from(trustItems, {
      scrollTrigger: {
        trigger: '.trust-strip',
        start: 'top 85%',
        toggleActions: 'play none none none'
      },
      opacity: 0,
      y: 30,
      stagger: 0.12,
      duration: 0.8,
      ease: 'power2.out'
    });
  }

  // Section Headers Reveal
  document.querySelectorAll('.section-header, .about__content').forEach(header => {
    gsap.from(header.children, {
      scrollTrigger: {
        trigger: header,
        start: 'top 85%',
        toggleActions: 'play none none none'
      },
      opacity: 0,
      y: 24,
      stagger: 0.1,
      duration: 0.7,
      ease: 'power3.out'
    });
  });

  // About Image Frame Parallax
  const aboutMedia = document.querySelector('.about__media');
  if (aboutMedia) {
    gsap.from(aboutMedia, {
      scrollTrigger: {
        trigger: '.about__grid',
        start: 'top 80%',
        toggleActions: 'play none none none'
      },
      opacity: 0,
      x: -40,
      duration: 1,
      ease: 'power3.out'
    });
  }

  // Dynamic Grid Observer (for elements rendered by components.js)
  const observeAndAnimate = (containerSelector, itemSelector, startOffset = 'top 82%') => {
    const container = document.querySelector(containerSelector);
    if (!container) return;

    const animateChildren = () => {
      const items = container.querySelectorAll(itemSelector);
      if (!items.length) return;

      gsap.fromTo(items, 
        { opacity: 0, y: 35 },
        {
          scrollTrigger: {
            trigger: container,
            start: startOffset,
            toggleActions: 'play none none none'
          },
          opacity: 1,
          y: 0,
          stagger: 0.08,
          duration: 0.75,
          ease: 'power3.out'
        }
      );
    };

    // Run once and on DOM mutations (when components.js inserts elements)
    animateChildren();
    const observer = new MutationObserver(() => {
      animateChildren();
      ScrollTrigger.refresh();
    });
    observer.observe(container, { childList: true });
  };

  observeAndAnimate('#services-grid-container', '.service-card');
  observeAndAnimate('#team-grid-container', '.team-card');
  observeAndAnimate('#gallery-grid-container', '.gallery-item');
  observeAndAnimate('#reviews-list-container', '.reviews-card-box');

  // Appointment Form Entrance
  const apptForm = document.querySelector('.appointment__wrapper');
  if (apptForm) {
    gsap.from('.appointment__form-col', {
      scrollTrigger: {
        trigger: apptForm,
        start: 'top 80%',
        toggleActions: 'play none none none'
      },
      opacity: 0,
      x: -30,
      duration: 0.8,
      ease: 'power3.out'
    });

    gsap.from('.appointment__info-col', {
      scrollTrigger: {
        trigger: apptForm,
        start: 'top 80%',
        toggleActions: 'play none none none'
      },
      opacity: 0,
      x: 30,
      duration: 0.8,
      ease: 'power3.out'
    });
  }

  // Contact Grid & Map Entrance
  const contactGrid = document.querySelector('.contact__grid');
  if (contactGrid) {
    gsap.from('.contact-cards-stack > *', {
      scrollTrigger: {
        trigger: contactGrid,
        start: 'top 80%',
        toggleActions: 'play none none none'
      },
      opacity: 0,
      y: 20,
      stagger: 0.1,
      duration: 0.6,
      ease: 'power2.out'
    });

    gsap.from('.map-container', {
      scrollTrigger: {
        trigger: contactGrid,
        start: 'top 80%',
        toggleActions: 'play none none none'
      },
      opacity: 0,
      scale: 0.97,
      duration: 0.8,
      ease: 'power2.out'
    });
  }
}

/* 3. Subtle Parallax for Backgrounds & Images */
function initInteractiveParallax() {
  const heroImg = document.querySelector('.hero__image-wrapper img');
  if (heroImg) {
    gsap.to(heroImg, {
      scrollTrigger: {
        trigger: '.hero',
        start: 'top top',
        end: 'bottom top',
        scrub: 1.2
      },
      y: 45,
      scale: 1.05,
      ease: 'none'
    });
  }
}

/* 4. Interactive Card Micro-Interactions */
function initCardHoverEffects() {
  // Delegate hover animations to cards
  document.addEventListener('mouseover', (e) => {
    const card = e.target.closest('.service-card, .team-card, .info-contact-card');
    if (card && !card.dataset.gsapHover) {
      card.dataset.gsapHover = 'true';
      
      card.addEventListener('mouseenter', () => {
        gsap.to(card, { y: -5, duration: 0.25, ease: 'power2.out' });
      });

      card.addEventListener('mouseleave', () => {
        gsap.to(card, { y: 0, duration: 0.3, ease: 'power2.out' });
      });
    }
  });
}
