import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-app.js";
import { 
  getFirestore, 
  collection, 
  doc, 
  setDoc,
  getDocs
} from "https://www.gstatic.com/firebasejs/10.7.0/firebase-firestore.js";

const DEFAULT_DATA = {
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
    { id: "srv-1", name: "General Dental Care", desc: "Comprehensive routine dental assessments, preventive evaluations, and oral hygiene care tailored for patients of all ages.", icon: "tooth", category: "General" },
    { id: "srv-2", name: "Dental Consultation", desc: "In-depth diagnostic checkups, symptom investigations, and personalized treatment planning with dedicated attention.", icon: "consultation", category: "Consultation" },
    { id: "srv-3", name: "Preventive Dentistry", desc: "Fluoride treatments, fissure sealants, and proactive oral health protocols aimed at maintaining healthy enamel and gums.", icon: "shield", category: "Preventive" },
    { id: "srv-4", name: "Restorative Dentistry", desc: "Composite tooth-colored fillings, structural dental reconstructions, and durable restorative therapies.", icon: "restorative", category: "Restorative" },
    { id: "srv-5", name: "Cosmetic Dentistry", desc: "Aesthetic smile enhancements, professional dental polishing, and smile makeover consultations.", icon: "sparkle", category: "Cosmetic" },
    { id: "srv-6", name: "Dental Cleaning", desc: "Ultrasonic scaling, plaque and tartar elimination, and gum health preservation performed with delicate precision.", icon: "cleaning", category: "Hygiene" },
    { id: "srv-7", name: "Crowns & Bridges", desc: "Custom-fitted porcelain and ceramic prosthetic restorations designed to restore complete bite function and aesthetics.", icon: "crown", category: "Prosthetics" },
    { id: "srv-8", name: "Root Canal Treatment", desc: "Careful endodontic therapy to alleviate toothache, eradicate deep infection, and preserve natural tooth structure.", icon: "root-canal", category: "Endodontics" }
  ],
  doctors: [
    { id: "doc-1", name: "Dr. Azeem Afzal", position: "Lead Dental Surgeon & Clinic Director", qualification: "Dental Surgeon", specialization: "General & Restorative Dental Surgery", experience: "10+ Years Experience", bio: "Dedicated to providing patient-centered dental care with a gentle approach, precision clinical techniques, and high standards of hygiene in Jinnah Colony, Faisalabad.", image: "/assets/images/tooth-abstract.jpg" },
    { id: "doc-2", name: "Dental Associate Surgeon", position: "Associate Dental Surgeon", qualification: "BDS / General Dental Practitioner", specialization: "Preventive & Routine Dentistry", experience: "5+ Years Experience", bio: "Committed to comfortable patient examinations, preventive oral hygiene maintenance, and empathetic patient care.", image: "/assets/images/reception.jpg" },
    { id: "doc-3", name: "Dental Hygiene Specialist", position: "Senior Dental Hygienist", qualification: "Dental Hygiene Certification", specialization: "Scaling, Cleaning & Gum Health", experience: "7+ Years Experience", bio: "Expert in professional scaling, plaque management and patient oral hygiene education to ensure long-term dental health and healthy gums.", image: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400&q=80" },
    { id: "doc-4", name: "Restorative Dentistry Expert", position: "Restorative & Cosmetic Dentist", qualification: "BDS, Post-Grad Restorative", specialization: "Crowns, Bridges & Cosmetic Dentistry", experience: "8+ Years Experience", bio: "Specializes in premium cosmetic and restorative procedures including porcelain crowns, smile design, and aesthetic dental reconstructions.", image: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=400&q=80" }
  ],
  gallery: [
    { id: "gal-1", title: "Main Operatory & Dental Suite", category: "Clinic", image: "/assets/images/hero.jpg" },
    { id: "gal-2", title: "Patient Reception & Waiting Lounge", category: "Environment", image: "/assets/images/reception.jpg" },
    { id: "gal-3", title: "Sterile Clinical Technology & Instruments", category: "Equipment", image: "/assets/images/equipment.jpg" },
    { id: "gal-4", title: "Precision Dental Restoration Design", category: "Treatment", image: "/assets/images/tooth-abstract.jpg" },
    { id: "gal-5", title: "Advanced Diagnostic Imaging Suite", category: "Equipment", image: "https://images.unsplash.com/photo-1588776814546-daab30f310ce?w=600&q=80" },
    { id: "gal-6", title: "Modern Treatment Room Setup", category: "Clinic", image: "https://images.unsplash.com/photo-1629909613654-28e377c37b09?w=600&q=80" },
    { id: "gal-7", title: "Patient Comfort & Care Focus", category: "Environment", image: "https://images.unsplash.com/photo-1606811841689-23dfddce3e95?w=600&q=80" },
    { id: "gal-8", title: "Dental Hygiene & Sterilization Protocols", category: "Treatment", image: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=600&q=80" }
  ],
  reviews: [
    { id: "rev-1", author: "Patient of Jinnah Colony", rating: 5, date: "Google Maps Review", comment: "Very professional dental clinic in Faisalabad. Clean atmosphere, courteous attention, and careful treatment." },
    { id: "rev-2", author: "Verified Clinic Visitor", rating: 4.5, date: "Google Maps Review", comment: "Good location near Ideal Bakery on Imam Bargah Road. Dr. Azeem Afzal provides clear explanation and gentle care." },
    { id: "rev-3", author: "Muhammad A. — Faisalabad", rating: 5, date: "Google Maps Review", comment: "Excellent dental centre with modern equipment. The staff is very welcoming and the treatment was painless. Highly recommend!" },
    { id: "rev-4", author: "Fatima K. — Jinnah Colony", rating: 5, date: "Google Maps Review", comment: "Best dental clinic in our area. Very hygienic, professional, and affordable. My whole family visits here regularly." },
    { id: "rev-5", author: "Ahmed R. — Verified Patient", rating: 4, date: "Google Maps Review", comment: "Had root canal treatment done here. The doctor was very skilled and the procedure was comfortable. Great service overall." }
  ]
};

const firebaseConfig = {
  apiKey: "AIzaSyCAHWcH1WGACHAZjO0Khj1MjZV7wznzmIk",
  authDomain: "azeem-afzal.firebaseapp.com",
  projectId: "azeem-afzal",
  storageBucket: "azeem-afzal.firebasestorage.app",
  messagingSenderId: "869471056301",
  appId: "1:869471056301:web:08cb89381de079c4543124",
  measurementId: "G-XE4CL4XKKC"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function seed() {
  console.log("Starting seed...");
  try {
    await setDoc(doc(db, 'settings', 'general'), DEFAULT_DATA.settings);
    
    for (const item of DEFAULT_DATA.services) await setDoc(doc(db, 'services', String(item.id)), item);
    for (const item of DEFAULT_DATA.doctors) await setDoc(doc(db, 'doctors', String(item.id)), item);
    for (const item of DEFAULT_DATA.gallery) await setDoc(doc(db, 'gallery', String(item.id)), item);
    for (const item of DEFAULT_DATA.reviews) await setDoc(doc(db, 'reviews', String(item.id)), item);
    
    console.log("SUCCESS: Database fully seeded.");
  } catch (err) {
    console.error("ERROR seeding database. Make sure rules are set to 'allow read, write: if true;'", err);
  }
  process.exit();
}

seed();
