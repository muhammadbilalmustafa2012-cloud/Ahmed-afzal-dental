# Azeem Afzal Dental Surgery Centre — Official Web Platform

A complete, production-ready premium dental clinic website for **Azeem Afzal Dental Surgery Centre**, located in **Jinnah Colony, Faisalabad, Pakistan**.

---

## 🏥 Clinic Information (Source of Truth)

- **Clinic Name:** Azeem Afzal Dental Surgery Centre
- **Business Category:** Dental Clinic
- **Google Maps Rating:** 4.3 / 5 (15 Verified Google Reviews)
- **Address:** Imam Bargah Road, near Ideal Bakery, Jinnah Colony, Faisalabad, Pakistan
- **Plus Code:** `C3C7+GX Faisalabad, Pakistan`
- **Primary Phone:** `+92 370 1309729` (clickable `tel:+923701309729`)
- **Additional Phone:** `03117700766` (clickable `tel:03117700766`)
- **WhatsApp Support:** `+92 370 1309729` (`https://wa.me/923701309729`)
- **Opening Schedule:** Open · Closes 8:30 PM
- **Direct Navigation URL:** [Google Maps Clinic Directions](https://www.google.com/maps/search/?api=1&query=Azeem+Afzal+Dental+Surgery+Centre,+Imam+Bargah+Rd,+Jinnah+Colony,+Faisalabad,+Pakistan)

---

## ✨ Features & Architecture

- **Clean Vanilla Web Tech Stack:** Built with pure semantic HTML5, modern CSS3 variables & flex/grid layout, and modular Vanilla ES6 JavaScript.
- **Visual Design & Aesthetics:** Medical blue `#0284C7`, dental teal `#0D9488`, deep navy `#0F172A`, slate text, and crisp backgrounds.
- **GSAP Animations:** Staggered scroll animations, section reveals, interactive hover states, and hero entrance with automatic `prefers-reduced-motion` compliance.
- **Interactive Patient Journey:**
  - Fast online appointment booking form with phone and email validation.
  - One-click WhatsApp booking dispatch with pre-filled message syntax.
  - Interactive service details modal.
  - Filterable clinic photography gallery with full-resolution Lightbox view.
  - Authentic Google Reviews showcase & direct Google Maps navigation link.
  - Floating accessible action buttons for instant WhatsApp, Call, and Booking.
- **Full Admin Dashboard (`/admin/`):**
  - Secure session-based authentication at `/admin/login.html`.
  - Overview of appointments and clinic metrics.
  - Dynamic Appointment Manager (confirm, delete, call).
  - Dynamic Services Manager (add, edit, delete services).
  - Clinic Doctors & Specialists directory.
  - Facility Gallery image management.
  - Patient Reviews quotes manager.
  - Real-time Clinic Settings editor (phones, hours, address, Google Maps link).
- **SEO & Schema.org Structured Data:**
  - Embedded JSON-LD `DentalClinic` schema with geolocation, opening hours, contact phones, and aggregate rating (4.3 with 15 reviews).
  - OpenGraph & Twitter cards.

---

## 📁 Project Structure

```
/
├── index.html              # Main landing page
├── about.html              # Clinic background & sterilization protocols
├── services.html           # Dental treatments catalog
├── gallery.html            # Facility gallery & operatory photos
├── contact.html            # Map & direct contact channels
├── appointment.html        # Online appointment booking
├── privacy.html            # Patient privacy policy
├── terms.html              # Terms of service
│
├── css/
│   ├── style.css           # Design tokens, typography & components
│   ├── responsive.css      # Mobile, tablet & desktop media queries
│   └── animations.css      # Keyframes, reveals & transitions
│
├── js/
│   ├── main.js             # Central clinic config & core UI interactions
│   ├── animations.js       # GSAP ScrollTrigger & fallback observers
│   ├── firebase.js         # Persistent data layer & Firestore sync
│   ├── appointments.js     # Form validation & WhatsApp generator
│   └── components.js       # Dynamic DOM renderer
│
├── admin/
│   ├── login.html          # Admin authentication gate
│   ├── dashboard.html      # Management interface
│   ├── dashboard.css       # Portal styles
│   └── dashboard.js        # Admin CRUD logic
│
├── public/assets/
│   ├── images/             # Generated high-resolution dental imagery
│   └── icons/              # Custom clinic SVG branding
│
├── firestore.rules         # Firebase security rules
├── firebase-blueprint.json # Schema specification
└── README.md
```

---

## 🔐 Admin Portal Credentials

- **URL:** `/admin/login.html`
- **Default Email:** `admin@azeemafzaldental.com`
- **Default Password:** `AzeemClinic2026!`

*(Credentials and clinic info can be customized at any time inside `/admin/dashboard.html`).*

---

## 🚀 Development & Deployment

To launch the local development server:
```bash
npm run dev
```
Dev server will run on port `3000`.

To build the static distribution:
```bash
npm run build
```
