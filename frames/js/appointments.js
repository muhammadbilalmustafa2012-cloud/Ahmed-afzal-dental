/**
 * Azeem Afzal Dental Surgery Centre
 * Appointment Booking & WhatsApp Dispatch System
 */

import { CLINIC_CONFIG, showToast } from './main.js';
import { dbStore } from './firebase.js';

document.addEventListener('DOMContentLoaded', () => {
  initAppointmentForm();
  setDefaultDateBounds();
});

function setDefaultDateBounds() {
  const dateInput = document.getElementById('appointment-date');
  if (!dateInput) return;

  // Set min date to today
  const today = new Date();
  const yyyy = today.getFullYear();
  const mm = String(today.getMonth() + 1).padStart(2, '0');
  const dd = String(today.getDate()).padStart(2, '0');
  dateInput.min = `${yyyy}-${mm}-${dd}`;
}

function initAppointmentForm() {
  const form = document.getElementById('appointment-form');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    // 1. Gather fields
    const nameInput = document.getElementById('appointment-name');
    const phoneInput = document.getElementById('appointment-phone');
    const emailInput = document.getElementById('appointment-email');
    const dateInput = document.getElementById('appointment-date');
    const timeInput = document.getElementById('appointment-time');
    const serviceInput = document.getElementById('appointment-service');
    const messageInput = document.getElementById('appointment-message');

    // 2. Validate
    let isValid = true;

    // Name check
    if (!nameInput.value.trim() || nameInput.value.trim().length < 3) {
      setError(nameInput, 'Please provide your full name (at least 3 characters)');
      isValid = false;
    } else {
      clearError(nameInput);
    }

    // Phone check (Pakistani / international mobile)
    const phoneVal = phoneInput.value.trim().replace(/[\s\-\(\)]/g, '');
    const phoneRegex = /^(\+?92|0)?3[0-9]{9}$/;
    if (!phoneVal || phoneVal.length < 10) {
      setError(phoneInput, 'Please provide a valid contact phone number (e.g. 0370 1309729 or 0311 7700766)');
      isValid = false;
    } else {
      clearError(phoneInput);
    }

    // Email check
    const emailVal = emailInput.value.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailVal || !emailRegex.test(emailVal)) {
      setError(emailInput, 'Please provide a valid email address');
      isValid = false;
    } else {
      clearError(emailInput);
    }

    // Date check
    if (!dateInput.value) {
      setError(dateInput, 'Please select your preferred appointment date');
      isValid = false;
    } else {
      clearError(dateInput);
    }

    // Time check
    if (!timeInput.value) {
      setError(timeInput, 'Please choose a preferred time slot');
      isValid = false;
    } else {
      clearError(timeInput);
    }

    // Service check
    if (!serviceInput.value) {
      setError(serviceInput, 'Please choose the required dental service');
      isValid = false;
    } else {
      clearError(serviceInput);
    }

    if (!isValid) {
      showToast('Please correct the highlighted fields before submitting.', 'error');
      return;
    }

    // 3. Prepare appointment record
    const appointmentRecord = {
      name:        nameInput.value.trim(),
      phone:       phoneInput.value.trim(),
      email:       emailVal,
      date:        dateInput.value,
      time:        timeInput.value,
      service:     serviceInput.options[serviceInput.selectedIndex]?.text || serviceInput.value,
      message:     messageInput.value.trim() || 'No specific notes provided.',
      status:      'Pending',
      createdAt:   new Date().toISOString()
    };

    // 4. Save appointment to Firebase Firestore
    dbStore.addItem('appointments', appointmentRecord);

    // 5. Build WhatsApp message
    const whatsappText =
`*New Appointment Request — Azeem Afzal Dental Surgery Centre*

*Patient Name:* ${appointmentRecord.name}
*Phone:* ${appointmentRecord.phone}
*Email:* ${appointmentRecord.email}
*Preferred Date:* ${appointmentRecord.date}
*Preferred Time:* ${appointmentRecord.time}
*Service Required:* ${appointmentRecord.service}
*Additional Notes:* ${appointmentRecord.message}

_This appointment was booked via the clinic website._`;

    const targetWhatsApp = CLINIC_CONFIG.whatsappNumber || "923701309729";
    const whatsappUrl = `https://wa.me/${targetWhatsApp}?text=${encodeURIComponent(whatsappText)}`;

    // 6. Reset form first
    form.reset();

    // 7. Show a brief success toast
    showToast('Appointment booked! Opening WhatsApp...', 'success');

    // 8. Auto-open WhatsApp immediately (no modal, no extra clicks)
    setTimeout(() => {
      window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
    }, 600); // tiny delay so the toast is visible before redirect
  });
}

function setError(inputEl, message) {
  const group = inputEl.closest('.form-group');
  if (group) {
    group.classList.add('has-error');
    let err = group.querySelector('.form-error');
    if (!err) {
      err = document.createElement('span');
      err.className = 'form-error';
      group.appendChild(err);
    }
    err.textContent = message;
  }
}

function clearError(inputEl) {
  const group = inputEl.closest('.form-group');
  if (group) {
    group.classList.remove('has-error');
  }
}

function showAppointmentSuccessModal(appointment, whatsappUrl) {
  const modal = document.getElementById('appointment-success-modal');
  if (!modal) {
    // Fallback: direct alert / window redirect
    showToast('Appointment requested successfully!', 'success');
    window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
    return;
  }

  const detailsEl = modal.querySelector('#success-modal-details');
  if (detailsEl) {
    detailsEl.innerHTML = `
      <div style="background:#F8FAFC; padding:16px; border-radius:10px; border:1px solid #E2E8F0; text-align:left; font-size:14px; margin-bottom:20px;">
        <p><strong>Patient:</strong> ${appointment.name}</p>
        <p><strong>Date & Time:</strong> ${appointment.date} at ${appointment.time}</p>
        <p><strong>Requested Service:</strong> ${appointment.service}</p>
        <p><strong>Contact:</strong> ${appointment.phone}</p>
      </div>
    `;
  }

  const whatsappBtn = modal.querySelector('#success-whatsapp-btn');
  if (whatsappBtn) {
    whatsappBtn.href = whatsappUrl;
  }

  modal.classList.add('active');
  document.body.style.overflow = 'hidden';

  const closeBtn = modal.querySelector('.modal__close');
  const dismissBtn = modal.querySelector('#success-dismiss-btn');
  const closeAll = () => {
    modal.classList.remove('active');
    document.body.style.overflow = '';
  };

  if (closeBtn) closeBtn.onclick = closeAll;
  if (dismissBtn) dismissBtn.onclick = closeAll;
}
