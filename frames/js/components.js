/**
 * Azeem Afzal Dental Surgery Centre
 * Dynamic Component Renderer (Services, Team, Gallery, Reviews)
 */

import { dbStore } from './firebase.js';

document.addEventListener('DOMContentLoaded', () => {
  renderServices();
  renderTeam();
  renderGallery();
  renderReviews();
  syncClinicSettings();

  window.addEventListener('datastore:updated', () => {
    renderServices();
    renderTeam();
    renderGallery();
    renderReviews();
    syncClinicSettings();
  });
});

/* SVG Icon Map for Dental Services */
const SERVICE_ICONS = {
  tooth: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2C7 2 4 5 4 10c0 4 2 8 3.5 11 1.5 3 2.5 1 3 0 .7-1.3 1-2 1.5-2s.8.7 1.5 2c.5 1 1.5 3 3 0 1.5-3 3.5-7 3.5-11 0-5-3-8-8-8z"/></svg>`,
  consultation: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/><path d="M12 7v4"/><path d="M12 15h.01"/></svg>`,
  shield: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="m9 12 2 2 4-4"/></svg>`,
  restorative: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m14.7 6.3 3 3-9 9H5.7v-3z"/><path d="M18.7 9.3a2 2 0 0 0 0-2.8l-1.2-1.2a2 2 0 0 0-2.8 0"/></svg>`,
  sparkle: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m12 3-1.9 5.8a2 2 0 0 1-1.3 1.3L3 12l5.8 1.9a2 2 0 0 1 1.3 1.3L12 21l1.9-5.8a2 2 0 0 1 1.3-1.3L21 12l-5.8-1.9a2 2 0 0 1-1.3-1.3z"/></svg>`,
  cleaning: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2v4"/><path d="m4.93 4.93 2.83 2.83"/><path d="M2 12h4"/><path d="m4.93 19.07 2.83-2.83"/><path d="M12 22v-4"/><path d="m19.07 19.07-2.83-2.83"/><path d="M22 12h-4"/><path d="m19.07 4.93-2.83 2.83"/></svg>`,
  crown: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 4l3 12h14l3-12-6 7-4-7-4 7-6-7zm3 16h14v2H5v-2z"/></svg>`,
  'root-canal': `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2C8 2 5 5 5 9c0 3 1.5 6 2.5 9 1 3 1.5 4 2.5 4s1.5-2 2-4c.5 2 1 4 2 4s1.5-1 2.5-4c1-3 2.5-6 2.5-9 0-4-3-7-7-7z"/><path d="M12 8v5"/></svg>`
};

/* 1. Render Services Grid */
export function renderServices() {
  const container = document.getElementById('services-grid-container');
  if (!container) return;

  const services = dbStore.get('services') || [];
  container.innerHTML = services.map(srv => {
    const iconSvg = SERVICE_ICONS[srv.icon] || SERVICE_ICONS.tooth;
    return `
      <div class="service-card interactive-hover" data-service-id="${srv.id}">
        <div class="service-card__icon">
          ${iconSvg}
        </div>
        <h3 class="service-card__title">${escapeHtml(srv.name)}</h3>
        <p class="service-card__desc">${escapeHtml(srv.desc)}</p>
        <button class="service-card__link" type="button">
          <span>Learn More</span>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m9 18 6-6-6-6"/></svg>
        </button>
      </div>
    `;
  }).join('');
}

/* 2. Render Doctors & Team Grid */
export function renderTeam() {
  const container = document.getElementById('team-grid-container');
  if (!container) return;

  const doctors = dbStore.get('doctors') || [];
  container.innerHTML = doctors.map(doc => {
    const hasPhoto = doc.image && doc.image.trim() !== '';
    const imageBlock = hasPhoto ? `
      <img src="${escapeHtml(doc.image)}" alt="${escapeHtml(doc.name)}" />
    ` : `
      <div class="team-card__placeholder-avatar">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
          <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/>
          <circle cx="12" cy="7" r="4"/>
        </svg>
        <span style="font-size:12px; font-weight:600; text-transform:uppercase; letter-spacing:0.05em;">Dental Practitioner</span>
      </div>
    `;

    const experienceBadge = doc.experience ? `<span style="display:inline-flex;align-items:center;gap:4px;font-size:0.75rem;font-weight:600;color:#38bdf8;background:rgba(56,189,248,0.1);border:1px solid rgba(56,189,248,0.2);border-radius:99px;padding:2px 10px;margin-bottom:8px;">⏱ ${escapeHtml(doc.experience)}</span>` : '';
    const specBadge = doc.specialization ? `<span style="display:inline-block;font-size:0.75rem;font-weight:600;color:#2dd4bf;background:rgba(13,148,136,0.1);border:1px solid rgba(45,212,191,0.2);border-radius:6px;padding:3px 10px;margin-bottom:10px;">${escapeHtml(doc.specialization)}</span>` : '';

    return `
      <div class="team-card interactive-hover" data-doctor-id="${doc.id}">
        <div class="team-card__image-wrap">
          ${imageBlock}
        </div>
        <div class="team-card__body">
          <h3 class="team-card__name">${escapeHtml(doc.name)}</h3>
          <p class="team-card__role">${escapeHtml(doc.position)}</p>
          <div style="margin:8px 0 4px;">${experienceBadge}</div>
          <div style="margin-bottom:6px;">${specBadge}</div>
          <span class="team-card__qual">${escapeHtml(doc.qualification || 'Dental Surgeon')}</span>
          <p class="team-card__bio">${escapeHtml(doc.bio)}</p>
          <a href="#appointment" class="btn btn--outline btn--sm team-card__cta">Book Consultation</a>
        </div>
      </div>
    `;
  }).join('');
}

/* 3. Render Gallery */
export function renderGallery() {
  const container = document.getElementById('gallery-grid-container');
  if (!container) return;

  const gallery = dbStore.get('gallery') || [];
  container.innerHTML = gallery.map(item => `
    <div class="gallery-item interactive-hover" data-category="${escapeHtml(item.category.toLowerCase())}">
      <img src="${escapeHtml(item.image)}" alt="${escapeHtml(item.title)}" />
      <div class="gallery-item__overlay">
        <span class="gallery-item__category">${escapeHtml(item.category)}</span>
        <h4 class="gallery-item__caption">${escapeHtml(item.title)}</h4>
      </div>
    </div>
  `).join('');
}

/* 4. Render Reviews */
export function renderReviews() {
  const container = document.getElementById('reviews-list-container');
  if (!container) return;

  const reviews = dbStore.get('reviews') || [];
  container.innerHTML = reviews.map(rev => `
    <div class="reviews-card-box">
      <div class="reviews-card-box__icon">
        <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M3 21c3 0 7-1 7-8V5c0-1.25-.756-2.017-2-2H4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V20c0 1 0 1 1 1z"/>
          <path d="M15 21c3 0 7-1 7-8V5c0-1.25-.757-2.017-2-2h-4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V20c0 1 0 1 1 1z"/>
        </svg>
      </div>
      <p class="reviews-card-box__quote">"${escapeHtml(rev.comment)}"</p>
      <div class="reviews-card-box__author">
        <div class="reviews-card-box__author-avatar">${rev.author.charAt(0).toUpperCase()}</div>
        <div class="reviews-card-box__author-meta">
          <h5>${escapeHtml(rev.author)}</h5>
          <p>${escapeHtml(rev.date || 'Google Review')}</p>
        </div>
      </div>
    </div>
  `).join('');
}

/* 5. Sync Dynamic Clinic Settings into DOM elements */
export function syncClinicSettings() {
  const settings = dbStore.get('settings') || {};

  document.querySelectorAll('[data-bind="primaryPhone"]').forEach(el => {
    el.textContent = settings.primaryPhone || '+92 370 1309729';
  });

  document.querySelectorAll('[data-bind-href="primaryPhone"]').forEach(el => {
    const raw = (settings.primaryPhoneRaw || settings.primaryPhone || '+923701309729').replace(/[^0-9+]/g, '');
    el.setAttribute('href', `tel:${raw}`);
  });

  document.querySelectorAll('[data-bind="additionalPhone"]').forEach(el => {
    el.textContent = settings.additionalPhone || '03117700766';
  });

  document.querySelectorAll('[data-bind-href="additionalPhone"]').forEach(el => {
    const raw = (settings.additionalPhoneRaw || settings.additionalPhone || '03117700766').replace(/[^0-9+]/g, '');
    el.setAttribute('href', `tel:${raw}`);
  });

  document.querySelectorAll('[data-bind="address"]').forEach(el => {
    el.textContent = settings.address || 'Imam Bargah Road, near Ideal Bakery, Jinnah Colony, Faisalabad, Pakistan';
  });

  document.querySelectorAll('[data-bind="openingHours"]').forEach(el => {
    el.textContent = settings.openingHours || 'Open · Closes 8:30 PM';
  });
}

function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
