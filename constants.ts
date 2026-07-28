import { EventItem, Review } from './types';
import { GALLERY_IMAGES, img } from './assets';

export { GALLERY_IMAGES } from './assets';

export const GOOGLE_SCRIPT_URL = import.meta.env.VITE_GOOGLE_SCRIPT_URL ?? '';

if (!GOOGLE_SCRIPT_URL && import.meta.env.DEV) {
  console.warn(
    'VITE_GOOGLE_SCRIPT_URL is not set. Booking and contact forms will fail to submit. See .env.example.'
  );
}

export const EVENTS_DATA: EventItem[] = [
  {
    title: "Weddings",
    description: "Celebrate your love story in lush surroundings with flexible setups tailored to your vision.",
    image: img.wedding
  },
  {
    title: "Sangeet & Haldi",
    description: "Vibrant décor and joyful rituals in harmonized natural spaces.",
    image: img.haldi
  },
  {
    title: "Birthdays & Anniversaries",
    description: "Fun-filled events with music, décor, and catering customized to your celebration style.",
    image: img.birthday
  },
  {
    title: "Corporate Retreats",
    description: "Peaceful settings and collaborative spaces ideal for productive workshops, meetings, and team gatherings.",
    image: img.corporateRetreat
  },
  {
    title: "Photoshoots",
    description: "Beautiful greenery and night ambience—perfect for pre-wedding and lifestyle shoots.",
    image: img.photoshoot
  },
  {
    title: "Family Gatherings",
    description: "A comfortable space for reunions, anniversaries, and festive celebrations.",
    image: img.familyLawn
  },
  {
    title: "Pool Parties & Gatherings",
    description: "Refresh and unwind with music, food, and poolside fun.",
    image: img.pool
  },
  {
    title: "Kitty Parties",
    description: "A cozy and comfortable venue for ladies’ kitty gatherings with games and fun.",
    image: img.kittyParty
  }
];

export const REVIEWS: Review[] = [
  {
    name: "Ramesh K.",
    text: "A beautiful property with peaceful surroundings. The rooms were clean, the lawn was perfect for our family gathering, and the staff was very supportive.",
    rating: 5
  },
  {
    name: "Sneha P.",
    text: "We hosted a birthday party here and everything was perfect. The pool area and night ambience made it really special.",
    rating: 5
  },
  {
    name: "Arjun M.",
    text: "Ideal place for weekend getaways. Calm, clean, and well maintained. Definitely visiting again with friends.",
    rating: 5
  }
];
