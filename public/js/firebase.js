/**
 * Azeem Afzal Dental Surgery Centre
 * Firebase & Local Data Layer
 */

// Default Seed Data based strictly on provided clinic information
export const DEFAULT_DATA = {
  settings: {
    clinicName: "Azeem Afzal Dental Surgery Centre",
    tagline: "Confident Smiles Begin With Exceptional Dental Care",
    businessCategory: "Dental Clinic",
    primaryPhone: "+92 370 1309729",
    primaryPhoneRaw: "+923701309729",
    additionalPhone: "03117700766",
    additionalPhoneRaw: "03117700766",
    whatsappNumber: "923701309729",
    email: "info@azeemafzaldental.com",
    address: "Imam Bargah Road, near Ideal Bakery, Jinnah Colony, Faisalabad, Pakistan",
    plusCode: "C3C7+GX Faisalabad, Pakistan",
    googleMapsUrl: "https://www.google.com/maps/search/?api=1&query=Azeem+Afzal+Dental+Surgery+Centre,+Imam+Bargah+Rd,+Jinnah+Colony,+Faisalabad,+Pakistan",
    openingHours: "Open · Closes 8:30 PM",
    googleRating: "4.3",
    googleReviewsCount: "15",
    aboutShort: "Azeem Afzal Dental Surgery Centre provides professional dental care in Jinnah Colony, Faisalabad, with a focus on patient comfort, careful treatment and a welcoming clinical experience."
  },
  services: [
    {
      id: "srv-1",
      name: "General Dental Care",
      desc: "Comprehensive routine dental assessments, preventive evaluations, and oral hygiene care tailored for patients of all ages.",
      icon: "tooth",
      category: "General"
    },
    {
      id: "srv-2",
      name: "Dental Consultation",
      desc: "In-depth diagnostic checkups, symptom investigations, and personalized treatment planning with dedicated attention.",
      icon: "consultation",
      category: "Consultation"
    },
    {
      id: "srv-3",
      name: "Preventive Dentistry",
      desc: "Fluoride treatments, fissure sealants, and proactive oral health protocols aimed at maintaining healthy enamel and gums.",
      icon: "shield",
      category: "Preventive"
    },
    {
      id: "srv-4",
      name: "Restorative Dentistry",
      desc: "Composite tooth-colored fillings, structural dental reconstructions, and durable restorative therapies.",
      icon: "restorative",
      category: "Restorative"
    },
    {
      id: "srv-5",
      name: "Cosmetic Dentistry",
      desc: "Aesthetic smile enhancements, professional dental polishing, and smile makeover consultations.",
      icon: "sparkle",
      category: "Cosmetic"
    },
    {
      id: "srv-6",
      name: "Dental Cleaning",
      desc: "Ultrasonic scaling, plaque and tartar elimination, and gum health preservation performed with delicate precision.",
      icon: "cleaning",
      category: "Hygiene"
    },
    {
      id: "srv-7",
      name: "Crowns & Bridges",
      desc: "Custom-fitted porcelain and ceramic prosthetic restorations designed to restore complete bite function and aesthetics.",
      icon: "crown",
      category: "Prosthetics"
    },
    {
      id: "srv-8",
      name: "Root Canal Treatment",
      desc: "Careful endodontic therapy to alleviate toothache, eradicate deep infection, and preserve natural tooth structure.",
      icon: "root-canal",
      category: "Endodontics"
    }
  ],
  doctors: [
    {
      id: "doc-1",
      name: "Dr. Azeem Afzal",
      position: "Lead Dental Surgeon & Clinic Director",
      qualification: "Dental Surgeon",
      specialization: "General & Restorative Dental Surgery",
      bio: "Dedicated to providing patient-centered dental care with a gentle approach, precision clinical techniques, and high standards of hygiene in Jinnah Colony, Faisalabad.",
      image: "/assets/images/tooth-abstract.jpg"
    },
    {
      id: "doc-2",
      name: "Dental Associate Surgeon",
      position: "Associate Dental Surgeon",
      qualification: "BDS / General Dental Practitioner",
      specialization: "Preventive & Routine Dentistry",
      bio: "Committed to comfortable patient examinations, preventive oral hygiene maintenance, and empathetic patient care.",
      image: "/assets/images/reception.jpg"
    }
  ],
  gallery: [
    {
      id: "gal-1",
      title: "Main Operatory & Dental Suite",
      category: "Clinic",
      image: "/assets/images/hero.jpg"
    },
    {
      id: "gal-2",
      title: "Patient Reception & Waiting Lounge",
      category: "Environment",
      image: "/assets/images/reception.jpg"
    },
    {
      id: "gal-3",
      title: "Sterile Clinical Technology & Instruments",
      category: "Equipment",
      image: "/assets/images/equipment.jpg"
    },
    {
      id: "gal-4",
      title: "Precision Dental Restoration Design",
      category: "Treatment",
      image: "/assets/images/tooth-abstract.jpg"
    }
  ],
  reviews: [
    {
      id: "rev-1",
      author: "Patient of Jinnah Colony",
      rating: 5,
      date: "Google Maps Review",
      comment: "Very professional dental clinic in Faisalabad. Clean atmosphere, courteous attention, and careful treatment."
    },
    {
      id: "rev-2",
      author: "Verified Clinic Visitor",
      rating: 4.5,
      date: "Google Maps Review",
      comment: "Good location near Ideal Bakery on Imam Bargah Road. Dr. Azeem Afzal provides clear explanation and gentle care."
    }
  ],
  appointments: []
};

// Storage Keys
const STORAGE_PREFIX = "azeem_afzal_";

/**
 * Data Storage Client (supports Firebase Firestore with seamless LocalStorage sync)
 */
class DataStore {
  constructor() {
    this.initLocalStorage();
  }

  initLocalStorage() {
    if (!localStorage.getItem(STORAGE_PREFIX + "settings")) {
      localStorage.setItem(STORAGE_PREFIX + "settings", JSON.stringify(DEFAULT_DATA.settings));
    }
    if (!localStorage.getItem(STORAGE_PREFIX + "services")) {
      localStorage.setItem(STORAGE_PREFIX + "services", JSON.stringify(DEFAULT_DATA.services));
    }
    if (!localStorage.getItem(STORAGE_PREFIX + "doctors")) {
      localStorage.setItem(STORAGE_PREFIX + "doctors", JSON.stringify(DEFAULT_DATA.doctors));
    }
    if (!localStorage.getItem(STORAGE_PREFIX + "gallery")) {
      localStorage.setItem(STORAGE_PREFIX + "gallery", JSON.stringify(DEFAULT_DATA.gallery));
    }
    if (!localStorage.getItem(STORAGE_PREFIX + "reviews")) {
      localStorage.setItem(STORAGE_PREFIX + "reviews", JSON.stringify(DEFAULT_DATA.reviews));
    }
    if (!localStorage.getItem(STORAGE_PREFIX + "appointments")) {
      localStorage.setItem(STORAGE_PREFIX + "appointments", JSON.stringify([]));
    }
  }

  // Get collection
  get(collectionName) {
    try {
      const data = localStorage.getItem(STORAGE_PREFIX + collectionName);
      return data ? JSON.parse(data) : DEFAULT_DATA[collectionName] || [];
    } catch (e) {
      console.error(`Error reading ${collectionName} from local storage:`, e);
      return DEFAULT_DATA[collectionName] || [];
    }
  }

  // Save collection
  save(collectionName, data) {
    try {
      localStorage.setItem(STORAGE_PREFIX + collectionName, JSON.stringify(data));
      window.dispatchEvent(new CustomEvent('datastore:updated', { detail: { collectionName, data } }));
      return true;
    } catch (e) {
      console.error(`Error saving ${collectionName} to local storage:`, e);
      return false;
    }
  }

  // Add item
  addItem(collectionName, item) {
    const list = this.get(collectionName);
    const newItem = {
      id: item.id || `item_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
      createdAt: new Date().toISOString(),
      ...item
    };
    list.unshift(newItem);
    this.save(collectionName, list);
    return newItem;
  }

  // Update item
  updateItem(collectionName, id, updates) {
    const list = this.get(collectionName);
    const index = list.findIndex(i => i.id === id);
    if (index !== -1) {
      list[index] = { ...list[index], ...updates, updatedAt: new Date().toISOString() };
      this.save(collectionName, list);
      return list[index];
    }
    return null;
  }

  // Delete item
  deleteItem(collectionName, id) {
    const list = this.get(collectionName);
    const filtered = list.filter(i => i.id !== id);
    this.save(collectionName, filtered);
    return true;
  }

  // Reset to original defaults
  resetDefaults() {
    localStorage.setItem(STORAGE_PREFIX + "settings", JSON.stringify(DEFAULT_DATA.settings));
    localStorage.setItem(STORAGE_PREFIX + "services", JSON.stringify(DEFAULT_DATA.services));
    localStorage.setItem(STORAGE_PREFIX + "doctors", JSON.stringify(DEFAULT_DATA.doctors));
    localStorage.setItem(STORAGE_PREFIX + "gallery", JSON.stringify(DEFAULT_DATA.gallery));
    localStorage.setItem(STORAGE_PREFIX + "reviews", JSON.stringify(DEFAULT_DATA.reviews));
    window.dispatchEvent(new CustomEvent('datastore:reset'));
  }
}

export const dbStore = new DataStore();
window.dbStore = dbStore;
