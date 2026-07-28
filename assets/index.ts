const base = '/assets/images';

/** Local image paths served from public/assets/images */
export const img = {
  logo: `${base}/logo_kfset6.jpg`,

  // Resort photography
  hero: `${base}/DSC01999-768x512.jpg`,
  dayView: `${base}/DSC02019-1536x1025.jpg`,
  nightView: `${base}/image00002-1536x1024.jpeg`,
  privatePool: `${base}/img1-1.jpg`,
  bedroom1: `${base}/DSC02123-scaled.jpg`,
  bedroom2: `${base}/DSC02129-scaled.jpg`,
  openLawn: `${base}/DSC02041-1024x683.jpg`,
  eventHall: `${base}/DSC02059-1024x683.jpg`,
  bedroomSlide1: `${base}/DSC02110-1024x683.jpg`,
  bedroomSlide2: `${base}/DSC02098-1024x683.jpg`,
  bedroomSlide3: `${base}/DSC02059-1024x683.jpg`,
  familyLawn: `${base}/DSC02074-390x293.jpg`,
  corporateRetreat: `${base}/DSC02064-390x293.jpg`,
  photoshoot: `${base}/DSC02012-1-390x636.jpg`,
  portrait: `${base}/DSC02085-683x1024.jpg`,
  kittyParty: `${base}/DSC02106-390x293.jpg`,
  wedding: `${base}/ecogen-wedding.jpg`,
  haldi: `${base}/ecogen-haldi.jpg`,
  birthday: `${base}/ecogen-birthday.jpg`,
  pool: `${base}/ecogen-pool.jpg`,

  // Nearby attractions
  sanghiTemple: `${base}/Screenshot_2026-01-27_020038_vgjkm1.png`,
  ramojiFilmCity: `${base}/1757483951_Bahubali-movie-sets-at-Ramoji-Film-City-Hyderabad-–-iconic-film-shooting-location.jpg`,
  wonderla: `${base}/wonderla-hyderabad-amusement-water-park-header-hyderabad-tourism.jpg`,
  hyderabadStudio: `${base}/10_jjrss4-658dd535.jpg`,
  kohedaGutta: `${base}/maxresdefault_pdfu20-bee9a200.jpg`,
  hanumanViewpoint: `${base}/e46b8e9cd325297f91f191406d9fc563_mni3vn-c956cc0a.jpg`,
  peddaAmberpetOrr: `${base}/ORR-Exit-No.1-3-696x583_eibrzg`,
  bonguluruOrr: `${base}/maxresdefault_zqexhn-fa0df2b2.jpg`,
  lbNagar: `${base}/43-facts-about-l-b-nagar-1689241399_ewmwiz-7cd72995.jpg`,
} as const;

/** Remote fallback for images that failed to download */
export const remoteImg = {
  anjaniStudio:
    'https://anjalifilmstudio.com/uploads/venuehighlights/1765644487_WhatsApp%20Image%202025-12-13%20at%2021.55.26.jpeg',
} as const;

export const GALLERY_IMAGES = [
  img.bedroom2,
  img.dayView,
  img.nightView,
  img.privatePool,
  img.bedroom1,
  img.photoshoot,
  img.portrait,
  img.corporateRetreat,
  img.bedroomSlide1,
  img.bedroomSlide2,
  img.eventHall,
  img.openLawn,
  img.wedding,
  img.familyLawn,
  img.pool,
  img.hero,
] as const;
