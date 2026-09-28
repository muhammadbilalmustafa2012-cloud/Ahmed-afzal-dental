/**
 * Azeem Afzal Dental Surgery Centre
 * Admin Dashboard Controller
 */

import { dbStore } from '../js/firebase.js';

// Guard: Verify Session
const session = sessionStorage.getItem('azeem_admin_session');
if (!session) {
  window.location.href = '/admin/login.html';
}

document.addEventListener('DOMContentLoaded', () => {
  initTabs();
  initLogout();
  loadOverview();
  loadAppointments();
  loadServices();
  loadDoctors();
  loadGallery();
  loadReviews();
  loadSettings();

  // Reset defaults action
  const resetBtn = document.getElementById('btn-reset-defaults');
  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      if (confirm('Are you sure you want to reset all clinic settings and services to defaults?')) {
        dbStore.resetDefaults();
        loadAll();
        alert('Clinic settings reset to initial defaults.');
      }
    });
  }

  // Modals & Add Buttons
  initActionButtons();
});

function loadAll() {
  loadOverview();
  loadAppointments();
  loadServices();
  loadDoctors();
  loadGallery();
  loadReviews();
  loadSettings();
}

/* 1. Tabs Navigation */
function initTabs() {
  const tabs = document.querySelectorAll('.admin-nav-item[data-tab]');
  const panels = document.querySelectorAll('.tab-panel');
  const titleEl = document.getElementById('admin-tab-title');

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const tabId = tab.getAttribute('data-tab');
      tabs.forEach(t => t.classList.remove('active'));
      panels.forEach(p => p.classList.remove('active'));

      tab.classList.add('active');
      const targetPanel = document.getElementById(`tab-${tabId}`);
      if (targetPanel) targetPanel.classList.add('active');

      if (titleEl) {
        titleEl.textContent = tab.querySelector('span')?.textContent || 'Dashboard';
      }
    });
  });
}

/* 2. Logout */
function initLogout() {
  const logoutBtn = document.getElementById('admin-logout-btn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
      sessionStorage.removeItem('azeem_admin_session');
      window.location.href = '/admin/login.html';
    });
  }
}

/* 3. Overview Metrics */
function loadOverview() {
  const appointments = dbStore.get('appointments') || [];
  const services = dbStore.get('services') || [];

  const apptCountEl = document.getElementById('stat-appointments-count');
  const srvCountEl = document.getElementById('stat-services-count');
  if (apptCountEl) apptCountEl.textContent = appointments.length;
  if (srvCountEl) srvCountEl.textContent = services.length;

  const tbody = document.getElementById('overview-appointments-tbody');
  if (!tbody) return;

  if (appointments.length === 0) {
    tbody.innerHTML = `<tr><td colspan="5" style="text-align:center; color:#94A3B8; padding:2rem;">No appointments submitted yet.</td></tr>`;
    return;
  }

  tbody.innerHTML = appointments.slice(0, 5).map(a => `
    <tr>
      <td><strong>${escapeHtml(a.name)}</strong></td>
      <td>${escapeHtml(a.phone)}</td>
      <td>${escapeHtml(a.date)} (${escapeHtml(a.time)})</td>
      <td>${escapeHtml(a.service)}</td>
      <td><span class="badge-status badge-status--${a.status || 'pending'}">${escapeHtml(a.status || 'pending')}</span></td>
    </tr>
  `).join('');
}

/* 4. Appointments Management */
function loadAppointments() {
  const tbody = document.getElementById('appointments-tbody');
  if (!tbody) return;

  const appointments = dbStore.get('appointments') || [];
  if (appointments.length === 0) {
    tbody.innerHTML = `<tr><td colspan="7" style="text-align:center; color:#94A3B8; padding:2.5rem;">No appointments recorded. Patient submissions from the website will appear here.</td></tr>`;
    return;
  }

  tbody.innerHTML = appointments.map(a => `
    <tr>
      <td>
        <strong>${escapeHtml(a.name)}</strong><br>
        <span style="font-size:12px; color:#64748B;">${escapeHtml(a.email)}</span>
      </td>
      <td><a href="tel:${escapeHtml(a.phone)}" style="color:#0284C7; font-weight:600;">${escapeHtml(a.phone)}</a></td>
      <td>${escapeHtml(a.date)}<br><small style="color:#64748B;">${escapeHtml(a.time)}</small></td>
      <td><span style="font-weight:600;">${escapeHtml(a.service)}</span></td>
      <td style="max-width:200px; font-size:13px; color:#64748B;">${escapeHtml(a.message || '-')}</td>
      <td><span class="badge-status badge-status--${a.status || 'pending'}">${escapeHtml(a.status || 'pending')}</span></td>
      <td>
        <div style="display:flex; gap:6px;">
          ${a.status !== 'confirmed' ? `
            <button class="admin-btn admin-btn--success admin-btn--sm" onclick="window.confirmAppointment('${a.id}')">Confirm</button>
          ` : ''}
          <button class="admin-btn admin-btn--danger admin-btn--sm" onclick="window.deleteAppointment('${a.id}')">Delete</button>
        </div>
      </td>
    </tr>
  `).join('');
}

window.confirmAppointment = function(id) {
  dbStore.updateItem('appointments', id, { status: 'confirmed' });
  loadAppointments();
  loadOverview();
};

window.deleteAppointment = function(id) {
  if (confirm('Delete this appointment record?')) {
    dbStore.deleteItem('appointments', id);
    loadAppointments();
    loadOverview();
  }
};

/* 5. Services Management */
function loadServices() {
  const tbody = document.getElementById('services-tbody');
  if (!tbody) return;

  const services = dbStore.get('services') || [];
  tbody.innerHTML = services.map(s => `
    <tr>
      <td><strong>${escapeHtml(s.name)}</strong></td>
      <td><span class="badge-status badge-status--pending">${escapeHtml(s.category)}</span></td>
      <td style="max-width:320px; font-size:13px; color:#475569;">${escapeHtml(s.desc)}</td>
      <td>
        <button class="admin-btn admin-btn--danger admin-btn--sm" onclick="window.deleteService('${s.id}')">Delete</button>
      </td>
    </tr>
  `).join('');
}

window.deleteService = function(id) {
  if (confirm('Remove this service from clinic catalog?')) {
    dbStore.deleteItem('services', id);
    loadServices();
  }
};

/* 6. Doctors Management */
function loadDoctors() {
  const tbody = document.getElementById('doctors-tbody');
  if (!tbody) return;

  const doctors = dbStore.get('doctors') || [];
  tbody.innerHTML = doctors.map(d => `
    <tr>
      <td><strong>${escapeHtml(d.name)}</strong></td>
      <td>${escapeHtml(d.position)}</td>
      <td>${escapeHtml(d.qualification)}</td>
      <td>${escapeHtml(d.specialization)}</td>
      <td>
        <button class="admin-btn admin-btn--danger admin-btn--sm" onclick="window.deleteDoctor('${d.id}')">Delete</button>
      </td>
    </tr>
  `).join('');
}

window.deleteDoctor = function(id) {
  if (confirm('Remove this doctor profile?')) {
    dbStore.deleteItem('doctors', id);
    loadDoctors();
  }
};

/* 7. Gallery Management */
function loadGallery() {
  const tbody = document.getElementById('gallery-tbody');
  if (!tbody) return;

  const gallery = dbStore.get('gallery') || [];
  tbody.innerHTML = gallery.map(g => `
    <tr>
      <td><img src="${escapeHtml(g.image)}" style="width:60px; height:40px; object-fit:cover; border-radius:4px;" alt="" /></td>
      <td><strong>${escapeHtml(g.title)}</strong></td>
      <td><span class="badge-status badge-status--pending">${escapeHtml(g.category)}</span></td>
      <td style="font-size:12px; color:#64748B; max-width:200px; overflow:hidden; text-overflow:ellipsis;">${escapeHtml(g.image)}</td>
      <td>
        <button class="admin-btn admin-btn--danger admin-btn--sm" onclick="window.deleteGalleryItem('${g.id}')">Delete</button>
      </td>
    </tr>
  `).join('');
}

window.deleteGalleryItem = function(id) {
  if (confirm('Delete this gallery photo?')) {
    dbStore.deleteItem('gallery', id);
    loadGallery();
  }
};

/* 8. Reviews Management */
function loadReviews() {
  const tbody = document.getElementById('reviews-tbody');
  if (!tbody) return;

  const reviews = dbStore.get('reviews') || [];
  tbody.innerHTML = reviews.map(r => `
    <tr>
      <td><strong>${escapeHtml(r.author)}</strong></td>
      <td>⭐ ${r.rating} / 5</td>
      <td>${escapeHtml(r.date || 'Google Review')}</td>
      <td style="font-size:13px; color:#475569;">"${escapeHtml(r.comment)}"</td>
      <td>
        <button class="admin-btn admin-btn--danger admin-btn--sm" onclick="window.deleteReview('${r.id}')">Delete</button>
      </td>
    </tr>
  `).join('');
}

window.deleteReview = function(id) {
  if (confirm('Delete this review quote?')) {
    dbStore.deleteItem('reviews', id);
    loadReviews();
  }
};

/* 9. Clinic Settings Management */
function loadSettings() {
  const settings = dbStore.get('settings') || {};

  const nameInput = document.getElementById('set-clinic-name');
  const phonePrimary = document.getElementById('set-phone-primary');
  const phoneAdd = document.getElementById('set-phone-additional');
  const whatsappInput = document.getElementById('set-whatsapp');
  const hoursInput = document.getElementById('set-hours');
  const addressInput = document.getElementById('set-address');
  const mapsUrlInput = document.getElementById('set-maps-url');
  const aboutShort = document.getElementById('set-about-short');

  if (nameInput) nameInput.value = settings.clinicName || 'Azeem Afzal Dental Surgery Centre';
  if (phonePrimary) phonePrimary.value = settings.primaryPhone || '+92 370 1309729';
  if (phoneAdd) phoneAdd.value = settings.additionalPhone || '03117700766';
  if (whatsappInput) whatsappInput.value = settings.whatsappNumber || '923701309729';
  if (hoursInput) hoursInput.value = settings.openingHours || 'Open · Closes 8:30 PM';
  if (addressInput) addressInput.value = settings.address || 'Imam Bargah Road, near Ideal Bakery, Jinnah Colony, Faisalabad, Pakistan';
  if (mapsUrlInput) mapsUrlInput.value = settings.googleMapsUrl || '';
  if (aboutShort) aboutShort.value = settings.aboutShort || '';

  const form = document.getElementById('clinic-settings-form');
  if (form) {
    form.onsubmit = (e) => {
      e.preventDefault();
      const updated = {
        clinicName: nameInput.value.trim(),
        primaryPhone: phonePrimary.value.trim(),
        additionalPhone: phoneAdd.value.trim(),
        whatsappNumber: whatsappInput.value.trim(),
        openingHours: hoursInput.value.trim(),
        address: addressInput.value.trim(),
        googleMapsUrl: mapsUrlInput.value.trim(),
        aboutShort: aboutShort.value.trim()
      };
      dbStore.save('settings', updated);
      alert('Clinic settings updated successfully! Live website reflects changes immediately.');
    };
  }
}

/* 10. Creation Prompts / Dialogs */
function initActionButtons() {
  // Add Service
  const addServiceBtn = document.getElementById('btn-add-service-modal');
  if (addServiceBtn) {
    addServiceBtn.addEventListener('click', () => {
      const name = prompt('Enter Service Name (e.g. Pediatric Dentistry):');
      if (!name) return;
      const category = prompt('Enter Category (e.g. Specialized, General, Surgery):', 'Specialized');
      const desc = prompt('Enter Short Description:', 'Professional pediatric oral dental checkups and preventive dental sealants.');
      dbStore.addItem('services', {
        name,
        category: category || 'General',
        desc: desc || '',
        icon: 'tooth'
      });
      loadServices();
    });
  }

  // Add Doctor
  const addDocBtn = document.getElementById('btn-add-doctor-modal');
  if (addDocBtn) {
    addDocBtn.addEventListener('click', () => {
      const name = prompt('Doctor Name:');
      if (!name) return;
      const position = prompt('Position / Title:', 'Dental Surgeon');
      const qualification = prompt('Qualification:', 'BDS, RDS');
      const specialization = prompt('Specialization:', 'Orthodontics & General Surgery');
      dbStore.addItem('doctors', {
        name,
        position: position || 'Dental Surgeon',
        qualification: qualification || 'BDS',
        specialization: specialization || 'General Dentistry',
        bio: 'Dedicated dental practitioner committed to providing high quality oral health care in Faisalabad.',
        image: ''
      });
      loadDoctors();
    });
  }

  // Add Gallery Image
  const addGalBtn = document.getElementById('btn-add-gallery-modal');
  if (addGalBtn) {
    addGalBtn.addEventListener('click', () => {
      const title = prompt('Photo Title / Description:');
      if (!title) return;
      const category = prompt('Category (Clinic / Treatment / Equipment / Environment):', 'Clinic');
      const image = prompt('Image URL or Path (e.g. /assets/images/hero.jpg):', '/assets/images/equipment.jpg');
      dbStore.addItem('gallery', {
        title,
        category: category || 'Clinic',
        image: image || '/assets/images/hero.jpg'
      });
      loadGallery();
    });
  }

  // Add Review
  const addRevBtn = document.getElementById('btn-add-review-modal');
  if (addRevBtn) {
    addRevBtn.addEventListener('click', () => {
      const author = prompt('Reviewer / Patient Name:');
      if (!author) return;
      const comment = prompt('Patient Review Quote:');
      dbStore.addItem('reviews', {
        author,
        rating: 5,
        date: 'Google Maps Verified Review',
        comment: comment || 'Excellent dental care and clean clinic.'
      });
      loadReviews();
    });
  }
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
