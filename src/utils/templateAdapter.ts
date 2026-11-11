export type CollectionId =
  | 'wedding-royal'
  | 'persian-heritage'
  | 'engagement-botanical'
  | 'birthday-editorial'
  | 'corporate-gala'
  | 'special-soiree';

export type AnimationChoreography =
  | 'wax-seal'
  | 'silk-ribbon'
  | 'luxury-box'
  | 'booklet'
  | 'editorial-reveal';

export type CardCutShape =
  | 'arch'
  | 'chamfered'
  | 'scalloped'
  | 'classic-frame'
  | 'imperial-booklet';

export type FoilFinish = 'gold' | 'rose-gold' | 'silver' | 'bronze';

export type OrnamentStyle =
  | 'persian-arabesque'
  | 'botanical-olive'
  | 'art-deco-geometric'
  | 'baroque-crest'
  | 'minimal-atelier'
  | 'celestial-arch';

export interface TemplatePalette {
  nameFa: string;
  nameEn: string;
  cardBg: string;
  cardSecondaryBg: string;
  envelopeBg: string;
  envelopeFlapBg: string;
  linerPatternBg: string;
  textPrimary: string;
  textMuted: string;
  foilHex: string;
  waxSealHex: string;
  isDarkCard: boolean;
  artworkUrl: string;
  artworkBgSize: string;
  artworkBgPos: string;
  safePadding: string;
}

export interface InvitationTemplate {
  id: string;
  slug: string;
  collectionId: CollectionId;
  collectionNameFa: string;
  collectionNameEn: string;
  titleFa: string;
  titleEn: string;
  kickerFa: string;
  kickerEn: string;
  hostNamesFa: string;
  hostNamesEn: string;
  invitationProseFa: string;
  invitationProseEn: string;
  eventDateFa: string;
  eventDateEn: string;
  eventTime: string;
  venueFa: string;
  venueEn: string;
  addressFa: string;
  cityFa: string;
  cityEn: string;
  palette: TemplatePalette;
  cardShape: CardCutShape;
  foilFinish: FoilFinish;
  ornamentStyle: OrnamentStyle;
  animationType: AnimationChoreography;
  waxSealMonogram: string;
  musicTrackNameFa: string;
  tierLabelFa: string;
  tierLabelEn: string;
}

export interface RsvpEntry {
  id: string;
  guestName: string;
  attending: 'yes' | 'no' | 'maybe';
  guestCount: number;
  dietaryPreference: string;
  message: string;
  createdAt: string;
}

export interface ValidationReport {
  isValid: boolean;
  totalCount: number;
  uniqueIdsCount: number;
  uniqueSlugsCount: number;
  collectionsBreakdown: Record<CollectionId, number>;
  animationBreakdown: Record<AnimationChoreography, number>;
  missingFieldsCount: number;
  errors: string[];
}

export const COLLECTION_METADATA: Record<
  CollectionId,
  {
    nameFa: string;
    nameEn: string;
    count: number;
    defaultKickerFa: string;
    defaultKickerEn: string;
    defaultProseFa: string;
    defaultProseEn: string;
  }
> = {
  'wedding-royal': {
    nameFa: 'عروسی سلطنتی و کلاسیک',
    nameEn: 'Royal & Couture Wedding',
    count: 50,
    defaultKickerFa: 'به نام خداوند عشق و زیبایی',
    defaultKickerEn: 'Together With Their Families',
    defaultProseFa:
      'با قلبی سرشار از مهر، افتخار داریم شما را به جشن پیوندمان دعوت نماییم تا در شبی فراموش‌نشدنی شریک شادی ما باشید.',
    defaultProseEn:
      'Request the honour of your presence at the celebration of their marriage and an evening of dinner and dancing.',
  },
  'persian-heritage': {
    nameFa: 'نگارگری و اصالت ایرانی',
    nameEn: 'Persian Heritage & Illumination',
    count: 45,
    defaultKickerFa: 'مرا عهدیست با جانان که تا جان در بدن دارم',
    defaultKickerEn: 'A Celebration of Eternal Harmony',
    defaultProseFa:
      'در پناه مهر ایزدی، آغاز فصل نوین زندگی مشترکمان را در کنار عزیزترین‌هایمان جشن می‌گیریم. حضور گرمتان روشنی‌بخش محفل ماست.',
    defaultProseEn:
      'Cordially invite you to celebrate an enchanted Persian evening of poetry, music, and union.',
  },
  'engagement-botanical': {
    nameFa: 'نامزدی و عقد آتلیه‌ای',
    nameEn: 'Botanical Engagement & Nikah',
    count: 45,
    defaultKickerFa: 'آغاز یک «ما» شدن',
    defaultKickerEn: 'Celebrate Our Engagement',
    defaultProseFa:
      'عشق را در نگاه هم یافتیم و پیمان بستیم. خوشحال می‌شویم در مراسم عقد و نامزدی ما حضور داشته باشید.',
    defaultProseEn:
      'Join us under the olive branches for an intimate toast celebrating our engagement.',
  },
  'birthday-editorial': {
    nameFa: 'تولد و جشن اختصاصی',
    nameEn: 'Milestone Birthday Soirée',
    count: 40,
    defaultKickerFa: 'ضیافت شب تولد',
    defaultKickerEn: 'An Exclusive Birthday Soirée',
    defaultProseFa:
      'یک سال دیگر از لحظه‌های ناب گذشت؛ به پاس دوستی و خاطراتمان، منتظر دیدار شما در شب جشن تولد هستیم.',
    defaultProseEn:
      'Join us for an unforgettable evening of candlelit dinner, music, and celebration.',
  },
  'corporate-gala': {
    nameFa: 'رویداد VIP و گالا شرکتی',
    nameEn: 'Executive Gala & Vernissage',
    count: 35,
    defaultKickerFa: 'دعوت‌نامه اختصاصی VIP',
    defaultKickerEn: 'By Private Invitation Only',
    defaultProseFa:
      'با کمال احترام از جنابعالی دعوت می‌شود در آیین رونمایی و ضیافت شام سالانه حضور به هم رسانید.',
    defaultProseEn:
      'The Board of Directors cordially invites you to our Annual Gala Dinner and Private Exhibition.',
  },
  'special-soiree': {
    nameFa: 'مهمانی خصوصی و سالگرد',
    nameEn: 'Private Soirée & Anniversary',
    count: 35,
    defaultKickerFa: 'شبی برای خاطره‌سازی',
    defaultKickerEn: 'An Intimate Evening',
    defaultProseFa:
      'به بهانه گرامی‌داشت لحظه‌های شیرین زندگی، میزبان قدوم سبز شما در ضیافت خصوصی‌مان هستیم.',
    defaultProseEn:
      'We warmly welcome you to an intimate candlelit gathering with close friends and family.',
  },
};

export const LUXURY_PALETTES: TemplatePalette[] = [
  {
    nameFa: 'آبرنگ شاخه زیتون و گاردنیا (Paperless Post)',
    nameEn: 'Botanical Olive & Gardenia Watercolor',
    cardBg: '#F8F5EE',
    cardSecondaryBg: '#EFEAE0',
    envelopeBg: '#2A3B2F',
    envelopeFlapBg: '#1E2D23',
    linerPatternBg: '#FCF9F3',
    textPrimary: '#20261E',
    textMuted: '#3F4A3C',
    foilHex: '#C59A45',
    waxSealHex: '#9E7730',
    isDarkCard: false,
    artworkUrl: '/src/assets/images/card_bg_botanical_watercolor_1794261393288.jpg',
    artworkBgSize: '126% 121%',
    artworkBgPos: '50% 50%',
    safePadding: '30% 25% 29% 23%',
  },
  {
    nameFa: 'تذهیب طلاکوب و لاجورد صفوی (کاغذ دست‌ساز)',
    nameEn: 'Safavid Gold Leaf & Lapis Tazhib',
    cardBg: '#F6F2E8',
    cardSecondaryBg: '#EBE4D5',
    envelopeBg: '#131F33',
    envelopeFlapBg: '#0C1625',
    linerPatternBg: '#F4EFE6',
    textPrimary: '#182233',
    textMuted: '#3A4659',
    foilHex: '#D4AF37',
    waxSealHex: '#B8860B',
    isDarkCard: false,
    artworkUrl: '/src/assets/images/card_bg_persian_tazhib_1794261392002.jpg',
    artworkBgSize: '118% 113%',
    artworkBgPos: '50% 50%',
    safePadding: '32% 26% 32% 26%',
  },
  {
    nameFa: 'مخمل سرمه‌ای نیمه‌شب و طاق طلای ۲۴ عیار',
    nameEn: 'Midnight Lapis & 24K Gold Oval Arch',
    cardBg: '#0F1B2D',
    cardSecondaryBg: '#16263F',
    envelopeBg: '#0E1726',
    envelopeFlapBg: '#080E1A',
    linerPatternBg: '#F4EFE6',
    textPrimary: '#FAF6EC',
    textMuted: '#DFD6C7',
    foilHex: '#E5C168',
    waxSealHex: '#B8860B',
    isDarkCard: true,
    artworkUrl: '/src/assets/images/card_bg_midnight_gold_arch_1794261396297.jpg',
    artworkBgSize: '112% 108%',
    artworkBgPos: '50% 50%',
    safePadding: '34% 27% 34% 27%',
  },
  {
    nameFa: 'مخمل سبز زمردی کاخ گلستان و پلاک برنجی',
    nameEn: 'Imperial Emerald Velvet & Brass Crest',
    cardBg: '#0E2923',
    cardSecondaryBg: '#153931',
    envelopeBg: '#0F2B24',
    envelopeFlapBg: '#091F1A',
    linerPatternBg: '#F7F3EB',
    textPrimary: '#F9F5EB',
    textMuted: '#D4E4DD',
    foilHex: '#E6C267',
    waxSealHex: '#C59B27',
    isDarkCard: true,
    artworkUrl: '/src/assets/images/card_bg_emerald_palace_1794261396899.jpg',
    artworkBgSize: '127% 121%',
    artworkBgPos: '50% 50%',
    safePadding: '31.5% 24.5% 31.5% 24.5%',
  },
  {
    nameFa: 'گل صدتومانی و هندسه رزگلد (Bliss & Bone)',
    nameEn: 'Champagne Peony & Rose-Gold Geometric',
    cardBg: '#F6EAE2',
    cardSecondaryBg: '#EDDCD2',
    envelopeBg: '#4A1C26',
    envelopeFlapBg: '#36111B',
    linerPatternBg: '#FAF3F0',
    textPrimary: '#2A1D1B',
    textMuted: '#573F3B',
    foilHex: '#C58B7E',
    waxSealHex: '#7C2132',
    isDarkCard: false,
    artworkUrl: '/src/assets/images/card_bg_champagne_rosegold_1794261398521.jpg',
    artworkBgSize: '145% 138%',
    artworkBgPos: '50% 51.5%',
    safePadding: '32% 26% 32% 26%',
  },
  {
    nameFa: 'کتان عاجی و برگ زیتون مدیترانه‌ای',
    nameEn: 'Tuscan Linen & Olive Branch Suite',
    cardBg: '#F8F5EE',
    cardSecondaryBg: '#EFEAE0',
    envelopeBg: '#4A121A',
    envelopeFlapBg: '#380C12',
    linerPatternBg: '#F3EDE3',
    textPrimary: '#241816',
    textMuted: '#4F3E3B',
    foilHex: '#8C6828',
    waxSealHex: '#9A6F28',
    isDarkCard: false,
    artworkUrl: '/src/assets/images/card_bg_botanical_watercolor_1794261393288.jpg',
    artworkBgSize: '126% 121%',
    artworkBgPos: '50% 50%',
    safePadding: '30% 25% 29% 23%',
  },
  {
    nameFa: 'نگارگری زرافشان اصفهان و کاغذ دست‌ساز',
    nameEn: 'Isfahan Illumination & Cotton Deckle',
    cardBg: '#F6F2E8',
    cardSecondaryBg: '#EBE4D5',
    envelopeBg: '#1D3E63',
    envelopeFlapBg: '#122A44',
    linerPatternBg: '#F6F1E7',
    textPrimary: '#182233',
    textMuted: '#3A4659',
    foilHex: '#8F681E',
    waxSealHex: '#9E3A26',
    isDarkCard: false,
    artworkUrl: '/src/assets/images/card_bg_persian_tazhib_1794261392002.jpg',
    artworkBgSize: '118% 113%',
    artworkBgPos: '50% 50%',
    safePadding: '32% 26% 32% 26%',
  },
  {
    nameFa: 'مخمل سلطنتی زمرد و قاب باروک طلایی',
    nameEn: 'Versailles Emerald & Antique Gold',
    cardBg: '#0E2923',
    cardSecondaryBg: '#153931',
    envelopeBg: '#1E293B',
    envelopeFlapBg: '#0F172A',
    linerPatternBg: '#F8FAFC',
    textPrimary: '#F9F5EB',
    textMuted: '#D4E4DD',
    foilHex: '#E6C267',
    waxSealHex: '#B8860B',
    isDarkCard: true,
    artworkUrl: '/src/assets/images/card_bg_emerald_palace_1794261396899.jpg',
    artworkBgSize: '127% 121%',
    artworkBgPos: '50% 50%',
    safePadding: '31.5% 24.5% 31.5% 24.5%',
  },
];

const CARD_SHAPES: CardCutShape[] = [
  'arch',
  'classic-frame',
  'chamfered',
  'scalloped',
  'imperial-booklet',
];

const FOIL_FINISHES: FoilFinish[] = ['gold', 'rose-gold', 'silver', 'bronze'];

const ORNAMENT_STYLES: OrnamentStyle[] = [
  'persian-arabesque',
  'botanical-olive',
  'art-deco-geometric',
  'baroque-crest',
  'minimal-atelier',
  'celestial-arch',
];

const ANIMATION_TYPES: AnimationChoreography[] = [
  'wax-seal',
  'silk-ribbon',
  'luxury-box',
  'booklet',
  'editorial-reveal',
];

const HOST_PAIRS: Array<{
  fa: string;
  en: string;
  monogram: string;
  venueFa: string;
  venueEn: string;
  cityFa: string;
  cityEn: string;
}> = [
  {
    fa: 'آوا و سیاوش',
    en: 'Ava & Siavash',
    monogram: 'A & S',
    venueFa: 'عمارت باغ فردوس، تالار آینه',
    venueEn: 'Ferdows Garden Palace, Mirror Hall',
    cityFa: 'تهران',
    cityEn: 'Tehran',
  },
  {
    fa: 'روژان و امیرعلی',
    en: 'Rojan & Amirali',
    monogram: 'R & A',
    venueFa: 'بوتیک هتل عباسی، تالار زرین',
    venueEn: 'Abbasi Heritage Hotel, Golden Hall',
    cityFa: 'اصفهان',
    cityEn: 'Isfahan',
  },
  {
    fa: 'دایان و پارسا',
    en: 'Dayan & Parsa',
    monogram: 'D & P',
    venueFa: 'باغ عمارت فرمانیه، تراس سروستان',
    venueEn: 'Farmanieh Royal Gardens, Cypress Terrace',
    cityFa: 'تهران',
    cityEn: 'Tehran',
  },
  {
    fa: 'نیکی و سهراب',
    en: 'Niki & Sohrab',
    monogram: 'N & S',
    venueFa: 'عمارت نارنجستان قوام',
    venueEn: 'Narenjestan Qavam Pavilion',
    cityFa: 'شیراز',
    cityEn: 'Shiraz',
  },
  {
    fa: 'ملیکا و کیان',
    en: 'Melika & Kian',
    monogram: 'M & K',
    venueFa: 'هتل اسپیناس پالاس، تالار رویال',
    venueEn: 'Espinas Palace Hotel, Grand Ballroom',
    cityFa: 'تهران',
    cityEn: 'Tehran',
  },
  {
    fa: 'یاسمین و آرمان',
    en: 'Yasamin & Arman',
    monogram: 'Y & A',
    venueFa: 'ویلا باغ نیاوران، عمارت مرمر',
    venueEn: 'Niavaran Marble Villa',
    cityFa: 'تهران',
    cityEn: 'Tehran',
  },
];

const SERIES_ADJECTIVES: Array<{ fa: string; en: string }> = [
  { fa: 'طلاکوب ورسای', en: 'Versailles Gold Leaf' },
  { fa: 'آستر ابریشم توسکانی', en: 'Tuscan Silk Liner' },
  { fa: 'تذهیب صفوی', en: 'Safavid Illumination' },
  { fa: 'مروارید و کاغذ کتان', en: 'Pearl & Cotton Press' },
  { fa: 'آرت‌دکو گتسبی', en: 'Gatsby Art Deco' },
  { fa: 'شاخه زیتون برجسته', en: 'Embossed Olive Botanical' },
  { fa: 'مخمل زرشکی فلورانس', en: 'Florentine Velvet Crest' },
  { fa: 'طاق آینه‌کاری قاجار', en: 'Qajar Mirror Arch' },
  { fa: 'مهر مومی سلطنتی', en: 'Imperial Wax Monogram' },
  { fa: 'مینیمال آتلیه پاریس', en: 'Parisian Atelier Minimal' },
];

/**
 * Phase 1 Adapter: Converts any raw template object from any of the 6 ChatGPT sets
 * into a guaranteed, crash-proof canonical InvitationTemplate with safe fallbacks.
 */
export function adaptRawTemplateToCanonical(
  raw: Record<string, unknown>,
  fallbackIndex = 0
): InvitationTemplate {
  const safeNum = fallbackIndex + 1;
  const rawCollection = String(
    raw.collectionId ?? raw.collection ?? raw.category ?? 'wedding-royal'
  ).toLowerCase();

  let collectionId: CollectionId = 'wedding-royal';
  if (rawCollection.includes('persian') || rawCollection.includes('ایرانی') || rawCollection.includes('سنتی')) {
    collectionId = 'persian-heritage';
  } else if (rawCollection.includes('engage') || rawCollection.includes('نامزدی') || rawCollection.includes('عقد')) {
    collectionId = 'engagement-botanical';
  } else if (rawCollection.includes('birth') || rawCollection.includes('تولد')) {
    collectionId = 'birthday-editorial';
  } else if (rawCollection.includes('corp') || rawCollection.includes('gala') || rawCollection.includes('شرکتی')) {
    collectionId = 'corporate-gala';
  } else if (rawCollection.includes('special') || rawCollection.includes('soiree') || rawCollection.includes('سالگرد')) {
    collectionId = 'special-soiree';
  }

  const colMeta = COLLECTION_METADATA[collectionId];
  const defaultPalette = LUXURY_PALETTES[fallbackIndex % LUXURY_PALETTES.length];
  const defaultHost = HOST_PAIRS[fallbackIndex % HOST_PAIRS.length];

  const id = String(
    raw.id ?? raw.templateId ?? `tpl-${collectionId}-${String(safeNum).padStart(3, '0')}`
  ).trim();

  const rawSlug = String(
    raw.slug ?? `${collectionId}-couture-${String(safeNum).padStart(3, '0')}`
  )
    .toLowerCase()
    .replace(/[^a-z0-9-]+/g, '-')
    .replace(/^-|-$/g, '');

  const slug = rawSlug || `template-${String(safeNum).padStart(3, '0')}`;

  // Animation fallback logic (Phase 3 requirement: templates without custom animation get a clear fallback)
  const rawAnim = String(
    raw.animationType ?? raw.animation ?? raw.openingType ?? ''
  ).toLowerCase();
  let animationType: AnimationChoreography = ANIMATION_TYPES[fallbackIndex % ANIMATION_TYPES.length];
  if (rawAnim.includes('wax') || rawAnim.includes('seal') || rawAnim.includes('موم')) {
    animationType = 'wax-seal';
  } else if (rawAnim.includes('ribbon') || rawAnim.includes('روبان')) {
    animationType = 'silk-ribbon';
  } else if (rawAnim.includes('box') || rawAnim.includes('جعبه')) {
    animationType = 'luxury-box';
  } else if (rawAnim.includes('book') || rawAnim.includes('دفترچه')) {
    animationType = 'booklet';
  } else if (rawAnim.includes('editorial') || rawAnim.includes('reveal') || rawAnim.includes('کارت')) {
    animationType = 'editorial-reveal';
  }

  const rawShape = String(raw.cardShape ?? raw.shape ?? '').toLowerCase();
  let cardShape: CardCutShape = CARD_SHAPES[fallbackIndex % CARD_SHAPES.length];
  if (rawShape.includes('arch') || rawShape.includes('طاق')) cardShape = 'arch';
  else if (rawShape.includes('chamfer')) cardShape = 'chamfered';
  else if (rawShape.includes('scallop')) cardShape = 'scalloped';
  else if (rawShape.includes('book')) cardShape = 'imperial-booklet';
  else if (rawShape.includes('classic')) cardShape = 'classic-frame';

  const rawFoil = String(raw.foilFinish ?? raw.foil ?? '').toLowerCase();
  let foilFinish: FoilFinish = FOIL_FINISHES[fallbackIndex % FOIL_FINISHES.length];
  if (rawFoil.includes('rose')) foilFinish = 'rose-gold';
  else if (rawFoil.includes('silver')) foilFinish = 'silver';
  else if (rawFoil.includes('bronze')) foilFinish = 'bronze';
  else if (rawFoil.includes('gold')) foilFinish = 'gold';

  const rawOrnament = String(raw.ornamentStyle ?? raw.ornament ?? '').toLowerCase();
  let ornamentStyle: OrnamentStyle = ORNAMENT_STYLES[fallbackIndex % ORNAMENT_STYLES.length];
  if (rawOrnament.includes('persian')) ornamentStyle = 'persian-arabesque';
  else if (rawOrnament.includes('botanical')) ornamentStyle = 'botanical-olive';
  else if (rawOrnament.includes('deco')) ornamentStyle = 'art-deco-geometric';
  else if (rawOrnament.includes('baroque')) ornamentStyle = 'baroque-crest';
  else if (rawOrnament.includes('minimal')) ornamentStyle = 'minimal-atelier';
  else if (rawOrnament.includes('celestial')) ornamentStyle = 'celestial-arch';

  const rawPalette = (raw.palette ?? raw.colors ?? {}) as Record<string, unknown>;
  const palette: TemplatePalette = {
    nameFa: String(rawPalette.nameFa ?? defaultPalette.nameFa),
    nameEn: String(rawPalette.nameEn ?? defaultPalette.nameEn),
    cardBg: String(rawPalette.cardBg ?? rawPalette.background ?? defaultPalette.cardBg),
    cardSecondaryBg: String(rawPalette.cardSecondaryBg ?? defaultPalette.cardSecondaryBg),
    envelopeBg: String(rawPalette.envelopeBg ?? rawPalette.envelope ?? defaultPalette.envelopeBg),
    envelopeFlapBg: String(rawPalette.envelopeFlapBg ?? defaultPalette.envelopeFlapBg),
    linerPatternBg: String(rawPalette.linerPatternBg ?? defaultPalette.linerPatternBg),
    textPrimary: String(rawPalette.textPrimary ?? rawPalette.text ?? defaultPalette.textPrimary),
    textMuted: String(rawPalette.textMuted ?? defaultPalette.textMuted),
    foilHex: String(rawPalette.foilHex ?? rawPalette.accent ?? defaultPalette.foilHex),
    waxSealHex: String(rawPalette.waxSealHex ?? defaultPalette.waxSealHex),
    isDarkCard:
      typeof rawPalette.isDarkCard === 'boolean'
        ? rawPalette.isDarkCard
        : defaultPalette.isDarkCard,
    artworkUrl: String(rawPalette.artworkUrl ?? defaultPalette.artworkUrl),
    artworkBgSize: String(rawPalette.artworkBgSize ?? defaultPalette.artworkBgSize),
    artworkBgPos: String(rawPalette.artworkBgPos ?? defaultPalette.artworkBgPos),
    safePadding: String(rawPalette.safePadding ?? defaultPalette.safePadding),
  };

  return {
    id,
    slug,
    collectionId,
    collectionNameFa: colMeta.nameFa,
    collectionNameEn: colMeta.nameEn,
    titleFa: String(
      raw.titleFa ?? raw.title_fa ?? raw.nameFa ?? raw.name_fa ?? `قالب سلطنتی شماره ${safeNum}`
    ),
    titleEn: String(
      raw.titleEn ?? raw.title_en ?? raw.nameEn ?? raw.name_en ?? `Couture Suite No. ${safeNum}`
    ),
    kickerFa: String(raw.kickerFa ?? colMeta.defaultKickerFa),
    kickerEn: String(raw.kickerEn ?? colMeta.defaultKickerEn),
    hostNamesFa: String(raw.hostNamesFa ?? defaultHost.fa),
    hostNamesEn: String(raw.hostNamesEn ?? defaultHost.en),
    invitationProseFa: String(raw.invitationProseFa ?? colMeta.defaultProseFa),
    invitationProseEn: String(raw.invitationProseEn ?? colMeta.defaultProseEn),
    eventDateFa: String(raw.eventDateFa ?? 'پنج‌شنبه، ۲۴ اردیبهشت ۱۴۰۵'),
    eventDateEn: String(raw.eventDateEn ?? 'Thursday, May 14, 2026'),
    eventTime: String(raw.eventTime ?? '۱۹:۳۰'),
    venueFa: String(raw.venueFa ?? defaultHost.venueFa),
    venueEn: String(raw.venueEn ?? defaultHost.venueEn),
    addressFa: String(raw.addressFa ?? `${defaultHost.cityFa}، خیابان ولیعصر، پلاک ۱۲۰`),
    cityFa: String(raw.cityFa ?? defaultHost.cityFa),
    cityEn: String(raw.cityEn ?? defaultHost.cityEn),
    palette,
    cardShape,
    foilFinish,
    ornamentStyle,
    animationType,
    waxSealMonogram: String(raw.waxSealMonogram ?? defaultHost.monogram),
    musicTrackNameFa: String(raw.musicTrackNameFa ?? 'والس پیانو و چنگ کلاسیک'),
    tierLabelFa: String(raw.tierLabelFa ?? 'طلاکوب برجسته · کاغذ کتان ۶۰۰ گرم'),
    tierLabelEn: String(raw.tierLabelEn ?? '24K Foil Press · 600gsm Cotton Cardstock'),
  };
}

/**
 * Generates all 250 templates across the 6 collections using the unified schema adapter.
 */
export function buildUnified250Templates(): InvitationTemplate[] {
  const templates: InvitationTemplate[] = [];
  const collectionsOrder: CollectionId[] = [
    'wedding-royal',
    'persian-heritage',
    'engagement-botanical',
    'birthday-editorial',
    'corporate-gala',
    'special-soiree',
  ];

  let globalIndex = 0;

  for (const collectionId of collectionsOrder) {
    const colMeta = COLLECTION_METADATA[collectionId];
    for (let i = 0; i < colMeta.count; i++) {
      const series = SERIES_ADJECTIVES[(i + globalIndex) % SERIES_ADJECTIVES.length];
      const palette = LUXURY_PALETTES[(i + globalIndex) % LUXURY_PALETTES.length];
      const host = HOST_PAIRS[(i + globalIndex) % HOST_PAIRS.length];
      const shape = CARD_SHAPES[(i + globalIndex) % CARD_SHAPES.length];
      const anim = ANIMATION_TYPES[(i + globalIndex) % ANIMATION_TYPES.length];
      const ornament: OrnamentStyle =
        collectionId === 'persian-heritage'
          ? i % 2 === 0
            ? 'persian-arabesque'
            : 'celestial-arch'
          : collectionId === 'engagement-botanical'
          ? 'botanical-olive'
          : collectionId === 'corporate-gala'
          ? 'art-deco-geometric'
          : ORNAMENT_STYLES[(i + globalIndex) % ORNAMENT_STYLES.length];

      const seq = String(globalIndex + 1).padStart(3, '0');
      const rawRecord: Record<string, unknown> = {
        id: `mdor-${collectionId}-${seq}`,
        slug: `${collectionId}-${series.en.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${seq}`,
        collectionId,
        titleFa: `${series.fa} — کد ${seq}`,
        titleEn: `${series.en} · Suite ${seq}`,
        hostNamesFa:
          collectionId === 'corporate-gala'
            ? 'گروه مالی و هنری پرشیا'
            : collectionId === 'birthday-editorial'
            ? `جشن میلاد ${host.fa.split(' و ')[0]}`
            : host.fa,
        hostNamesEn:
          collectionId === 'corporate-gala'
            ? 'Persia Fine Arts & Maison Gala'
            : collectionId === 'birthday-editorial'
            ? `${host.en.split(' & ')[0]}'s Thirtieth Soirée`
            : host.en,
        palette,
        cardShape: shape,
        foilFinish: palette.foilHex === '#94A3B8' ? 'silver' : palette.foilHex === '#C58B7E' ? 'rose-gold' : 'gold',
        ornamentStyle: ornament,
        animationType: anim,
        waxSealMonogram: host.monogram,
        venueFa: host.venueFa,
        venueEn: host.venueEn,
        cityFa: host.cityFa,
        cityEn: host.cityEn,
      };

      templates.push(adaptRawTemplateToCanonical(rawRecord, globalIndex));
      globalIndex++;
    }
  }

  return templates;
}

/**
 * Phase 4 Validator: Verifies all 250 templates have unique IDs, unique slugs,
 * valid animations, and complete Persian/English typography fields.
 */
export function validateTemplateLibrary(templates: InvitationTemplate[]): ValidationReport {
  const uniqueIds = new Set<string>();
  const uniqueSlugs = new Set<string>();
  const errors: string[] = [];
  let missingFieldsCount = 0;

  const collectionsBreakdown: Record<CollectionId, number> = {
    'wedding-royal': 0,
    'persian-heritage': 0,
    'engagement-botanical': 0,
    'birthday-editorial': 0,
    'corporate-gala': 0,
    'special-soiree': 0,
  };

  const animationBreakdown: Record<AnimationChoreography, number> = {
    'wax-seal': 0,
    'silk-ribbon': 0,
    'luxury-box': 0,
    'booklet': 0,
    'editorial-reveal': 0,
  };

  templates.forEach((tpl, idx) => {
    if (uniqueIds.has(tpl.id)) {
      errors.push(`Duplicate ID at index ${idx}: ${tpl.id}`);
    }
    uniqueIds.add(tpl.id);

    if (uniqueSlugs.has(tpl.slug)) {
      errors.push(`Duplicate Slug at index ${idx}: ${tpl.slug}`);
    }
    uniqueSlugs.add(tpl.slug);

    if (
      !tpl.titleFa ||
      !tpl.titleEn ||
      !tpl.hostNamesFa ||
      !tpl.palette?.cardBg ||
      !tpl.animationType
    ) {
      missingFieldsCount++;
      errors.push(`Missing required fields in template ${tpl.id}`);
    }

    if (collectionsBreakdown[tpl.collectionId] !== undefined) {
      collectionsBreakdown[tpl.collectionId]++;
    }
    if (animationBreakdown[tpl.animationType] !== undefined) {
      animationBreakdown[tpl.animationType]++;
    }
  });

  return {
    isValid:
      errors.length === 0 &&
      templates.length >= 250 &&
      uniqueIds.size === templates.length &&
      uniqueSlugs.size === templates.length,
    totalCount: templates.length,
    uniqueIdsCount: uniqueIds.size,
    uniqueSlugsCount: uniqueSlugs.size,
    collectionsBreakdown,
    animationBreakdown,
    missingFieldsCount,
    errors,
  };
}

export interface MarketplaceFilterOptions {
  collectionId: CollectionId | 'all';
  animationType: AnimationChoreography | 'all';
  cardShape: CardCutShape | 'all';
  searchQuery: string;
}

export function filterTemplates(
  templates: InvitationTemplate[],
  filters: MarketplaceFilterOptions
): InvitationTemplate[] {
  const q = filters.searchQuery.trim().toLowerCase();

  return templates.filter((tpl) => {
    if (filters.collectionId !== 'all' && tpl.collectionId !== filters.collectionId) {
      return false;
    }
    if (filters.animationType !== 'all' && tpl.animationType !== filters.animationType) {
      return false;
    }
    if (filters.cardShape !== 'all' && tpl.cardShape !== filters.cardShape) {
      return false;
    }
    if (q.length > 0) {
      const haystack = [
        tpl.id,
        tpl.slug,
        tpl.titleFa,
        tpl.titleEn,
        tpl.collectionNameFa,
        tpl.collectionNameEn,
        tpl.hostNamesFa,
        tpl.hostNamesEn,
        tpl.palette.nameFa,
        tpl.palette.nameEn,
        tpl.cityFa,
      ]
        .join(' ')
        .toLowerCase();
      return haystack.includes(q);
    }
    return true;
  });
}

export function calculateRsvpSummary(entries: RsvpEntry[]): {
  attendingHeadcount: number;
  declinedCount: number;
  maybeCount: number;
  totalResponses: number;
} {
  let attendingHeadcount = 0;
  let declinedCount = 0;
  let maybeCount = 0;

  for (const entry of entries) {
    if (entry.attending === 'yes') {
      attendingHeadcount += Math.max(1, entry.guestCount);
    } else if (entry.attending === 'no') {
      declinedCount += 1;
    } else {
      maybeCount += 1;
    }
  }

  return {
    attendingHeadcount,
    declinedCount,
    maybeCount,
    totalResponses: entries.length,
  };
}

export type EnvelopeStagePhase =
  | 'sealed'
  | 'cracking'
  | 'flap-opening'
  | 'card-rising'
  | 'opened';

export interface EnvelopePhaseTimings {
  crackDurationMs: number;
  flapOpenDelayMs: number;
  flapOpenDurationMs: number;
  cardRiseDelayMs: number;
  cardRiseDurationMs: number;
  totalSequenceMs: number;
  flapOpenAngleDeg: number;
  cardRiseEase: 'easeOut';
  cardBounceKeyframesY: number[];
  cardBounceKeyframesZ: number[];
  cardBounceKeyframesRotateZ: number[];
  cardBounceTimes: number[];
  stageTranslateZ: Record<EnvelopeStagePhase, number>;
}

/**
 * Pure choreography timing calculator for the 3D Framer Motion envelope opening sequence:
 * 1. Wax seal fractures & splits into two 3D halves with gold shards (`cracking`)
 * 2. Top envelope flap rotates open in 3D space (`flap-opening`)
 * 3. Photorealistic card rises briskly along Y and Z (`translateZ`) with `easeOut`
 *    and a subtle physical micro-bounce settle into its main stage depth (`card-rising` -> `opened`)
 */
export function getEnvelopePhaseTimings(
  animationType: AnimationChoreography
): EnvelopePhaseTimings {
  const isFastReveal = animationType === 'editorial-reveal';
  const crackDurationMs = isFastReveal ? 420 : 520;
  const flapOpenDelayMs = crackDurationMs - 60;
  const flapOpenDurationMs = isFastReveal ? 520 : 640;
  const cardRiseDelayMs = flapOpenDelayMs + Math.round(flapOpenDurationMs * 0.6);
  // Brisker card extraction with ease-out + subtle micro-bounce settle at the end
  const cardRiseDurationMs = isFastReveal ? 560 : 680;
  const totalSequenceMs = cardRiseDelayMs + cardRiseDurationMs;

  return {
    crackDurationMs,
    flapOpenDelayMs,
    flapOpenDurationMs,
    cardRiseDelayMs,
    cardRiseDurationMs,
    totalSequenceMs,
    flapOpenAngleDeg: -172,
    cardRiseEase: 'easeOut',
    cardBounceKeyframesY: [18, -58, 7, -3.5, 1.2, 0],
    cardBounceKeyframesZ: [-36, 68, 32, 44, 36, 38],
    cardBounceKeyframesRotateZ: [0, -0.75, 0.5, -0.22, 0.08, 0],
    cardBounceTimes: [0, 0.52, 0.74, 0.86, 0.94, 1],
    stageTranslateZ: {
      sealed: -72,
      cracking: -56,
      'flap-opening': -36,
      'card-rising': 44,
      opened: 38,
    },
  };
}

export interface PaperDustParticle {
  id: number;
  originX: number;
  originY: number;
  driftX: number;
  driftY: number;
  sizePx: number;
  aspectRatio: number;
  rotationDeg: number;
  delaySec: number;
  durationSec: number;
  peakOpacity: number;
  kind: 'cotton-fiber' | 'gold-mote';
}

/**
 * Generates deterministic tactile paper-dust & cotton-fiber motes that puff and float
 * into the sunlit stage when the 600gsm cotton card is pulled out of the envelope pocket.
 */
export function generatePaperDustParticles(count = 24): PaperDustParticle[] {
  const safeCount = Math.max(6, Math.min(48, count));
  const particles: PaperDustParticle[] = [];

  for (let i = 0; i < safeCount; i++) {
    const side = i % 2 === 0 ? -1 : 1;
    const band = (i % 6) / 5; // 0 .. 1 spread across envelope throat & card edges
    const originX = Math.round(side * (38 + band * 148) + ((i * 17) % 23) - 11);
    const originY = Math.round(52 - band * 96 + ((i * 13) % 19) - 9);
    const driftX = Math.round(side * (22 + ((i * 19) % 44)));
    const driftY = -Math.round(34 + ((i * 29) % 62));
    const isGoldMote = i % 3 === 0;
    const sizePx = isGoldMote ? 2.5 + (i % 3) * 0.9 : 3.2 + (i % 4) * 0.85;
    const aspectRatio = isGoldMote ? 1 : 1.8 + (i % 3) * 0.45;
    const rotationDeg = side * (35 + ((i * 31) % 110));
    const delaySec = Number(((i % 7) * 0.032).toFixed(3));
    const durationSec = Number((0.92 + (i % 5) * 0.12).toFixed(2));
    const peakOpacity = Number((isGoldMote ? 0.78 : 0.62 + (i % 3) * 0.08).toFixed(2));

    particles.push({
      id: i + 1,
      originX,
      originY,
      driftX,
      driftY,
      sizePx,
      aspectRatio,
      rotationDeg,
      delaySec,
      durationSec,
      peakOpacity,
      kind: isGoldMote ? 'gold-mote' : 'cotton-fiber',
    });
  }

  return particles;
}

export type CardFaceSide = 'front' | 'back';

export type EnvelopeStyleVariant =
  | 'royal-wax'
  | 'silk-ribbon'
  | 'velvet-clasp'
  | 'persian-arch'
  | 'vintage-botanical';

export type EnvelopeClosureKind =
  | 'wax-seal'
  | 'silk-bow'
  | 'jewelled-clasp'
  | 'persian-shamseh'
  | 'botanical-twine';

export interface EnvelopeStyleMeta {
  id: EnvelopeStyleVariant;
  nameFa: string;
  sealLabelFa: string;
  descriptionFa: string;
  flapClipPath: string;
  accentColor: string;
  closureKind: EnvelopeClosureKind;
  hasRibbonBands: boolean;
}

export const ENVELOPE_STYLE_VARIANTS: EnvelopeStyleMeta[] = [
  {
    id: 'royal-wax',
    nameFa: 'پاکت سلطنتی با مهر مومی برجسته',
    sealLabelFa: 'مهر مومی طلاکوب',
    descriptionFa: 'مقوای کتان ۶۰۰ گرم با مهر مومی دست‌ریز و آستر طلاکوب',
    flapClipPath: 'polygon(0% 0%, 100% 0%, 52% 94%, 48% 94%)',
    accentColor: '#D4AF37',
    closureKind: 'wax-seal',
    hasRibbonBands: false,
  },
  {
    id: 'silk-ribbon',
    nameFa: 'پاکت ابریشمی با پاپیون و روبان حریر',
    sealLabelFa: 'گره روبان ابریشمی',
    descriptionFa: 'نوار ابریشمی چهارطرفه با گره پاپیون برجسته و پلاک مونوگرام',
    flapClipPath: 'polygon(0% 0%, 100% 0%, 84% 86%, 50% 95%, 16% 86%)',
    accentColor: '#E6C687',
    closureKind: 'silk-bow',
    hasRibbonBands: true,
  },
  {
    id: 'velvet-clasp',
    nameFa: 'پاکت مخمل جواهری با سگک برنجی',
    sealLabelFa: 'سگک جواهرنشان',
    descriptionFa: 'بافت مخمل سلطنتی با کمربند و سگک هشت‌ضلعی برنجی و صدف',
    flapClipPath: 'polygon(0% 0%, 100% 0%, 100% 64%, 54% 95%, 46% 95%, 0% 64%)',
    accentColor: '#C59B27',
    closureKind: 'jewelled-clasp',
    hasRibbonBands: true,
  },
  {
    id: 'persian-arch',
    nameFa: 'پاکت طاقی صفوی با شمسه زرین',
    sealLabelFa: 'شمسه تذهیب صفوی',
    descriptionFa: 'برش طاق شاه‌عباسی با مدالیون شمسه ۱۶‌پر فیروزه و لاجورد',
    flapClipPath: 'polygon(0% 0%, 100% 0%, 90% 74%, 52% 95%, 48% 95%, 10% 74%)',
    accentColor: '#D4AF37',
    closureKind: 'persian-shamseh',
    hasRibbonBands: false,
  },
  {
    id: 'vintage-botanical',
    nameFa: 'پاکت کتان دست‌ساز با آستر گل‌وگیاه',
    sealLabelFa: 'مهر گیاهی و نخ طلایی',
    descriptionFa: 'کاغذ کتان ارگانیک با نخ زرین دو لایه و شاخه زیتون برجسته',
    flapClipPath: 'polygon(0% 0%, 100% 0%, 52% 93%, 48% 93%)',
    accentColor: '#B89758',
    closureKind: 'botanical-twine',
    hasRibbonBands: true,
  },
];

/**
 * Returns a responsive, overflow-safe font size class for host names on both
 * the main 3D card stage and miniature marketplace cards so long names never clip or overflow.
 */
export function getAdaptiveHeadingSizeClass(
  text: string,
  mode: 'stage' | 'mini' = 'stage'
): string {
  const len = text.trim().length;
  if (mode === 'mini') {
    if (len > 22) return 'text-[11px] leading-tight';
    if (len > 15) return 'text-xs leading-snug';
    return 'text-sm leading-snug';
  }
  if (len > 24) return 'text-lg sm:text-xl leading-snug';
  if (len > 16) return 'text-xl sm:text-2xl leading-snug';
  return 'text-2xl sm:text-[28px] leading-snug';
}

export interface DressCodeSwatch {
  hex: string;
  labelFa: string;
}

/**
 * Returns 4 coordinated Dress Code color swatches for the back of the card
 * that harmonize with the template's luxury palette.
 */
export function getDressCodeSwatches(palette: TemplatePalette): DressCodeSwatch[] {
  return [
    { hex: '#1C1917', labelFa: 'مشکی رسمی' },
    { hex: palette.envelopeBg, labelFa: 'تم اصلی' },
    { hex: palette.foilHex, labelFa: 'طلایی / متالیک' },
    { hex: '#F3EDE2', labelFa: 'عاجی / شامپاینی' },
  ];
}

export function getDefaultEnvelopeStyleForAnimation(
  animationType: AnimationChoreography
): EnvelopeStyleVariant {
  switch (animationType) {
    case 'silk-ribbon':
      return 'silk-ribbon';
    case 'luxury-box':
      return 'velvet-clasp';
    case 'booklet':
      return 'persian-arch';
    case 'editorial-reveal':
      return 'vintage-botanical';
    case 'wax-seal':
    default:
      return 'royal-wax';
  }
}

export interface InteractiveStageStepInfo {
  stepNumber: 1 | 2 | 3 | 4;
  stepTitleFa: string;
  nextTouchHintFa: string;
  canOpenEnvelope: boolean;
  canExtractCard: boolean;
  canFlipCard: boolean;
}

/**
 * Pure state-machine helper for the 4-step interactive touch & drag ceremony:
 * - Step 1 (`sealed`): Envelope is closed. Touch 1 breaks the seal/ribbon and opens the envelope flap.
 * - Step 2 (`flap-opening`): Flap is open and card peeks out. Touch 2 OR dragging upward pulls the card out of the pocket.
 * - Step 3 (`opened` + `front`): Card is displayed center-stage. Touch 3 rotates the card 180° in 3D to read the back.
 * - Step 4 (`opened` + `back`): Back of the card is shown (schedule, dress code, address). Touch 4 flips back to front.
 */
export function getInteractiveStageStep(
  phase: EnvelopeStagePhase,
  cardFace: CardFaceSide
): InteractiveStageStepInfo {
  if (phase === 'sealed' || phase === 'cracking') {
    return {
      stepNumber: 1,
      stepTitleFa: 'گام ۱ از ۴: پاکت بسته و مهروموم‌شده',
      nextTouchHintFa:
        'لمس اول: روی مهر مومی یا پاکت بزنید تا درب پاکت باز شود',
      canOpenEnvelope: phase === 'sealed',
      canExtractCard: false,
      canFlipCard: false,
    };
  }

  if (phase === 'flap-opening' || phase === 'card-rising') {
    return {
      stepNumber: 2,
      stepTitleFa: 'گام ۲ از ۴: درب پاکت باز شد · آماده خروج کارت',
      nextTouchHintFa:
        phase === 'flap-opening'
          ? 'لمس دوم یا کشیدن به بالا (Swipe Up): کارت دعوت را از پاکت بیرون بکشید'
          : 'کارت کتان همراه با ذرات کاغذ در حال خروج از پاکت است...',
      canOpenEnvelope: false,
      canExtractCard: phase === 'flap-opening',
      canFlipCard: false,
    };
  }

  if (cardFace === 'front') {
    return {
      stepNumber: 3,
      stepTitleFa: 'گام ۳ از ۴: نمایش روی کارت دعوت',
      nextTouchHintFa:
        'لمس سوم: روی کارت دعوت بزنید تا ۱۸۰ درجه بچرخد و پشت کارت را بخوانید',
      canOpenEnvelope: false,
      canExtractCard: false,
      canFlipCard: true,
    };
  }

  return {
    stepNumber: 4,
    stepTitleFa: 'گام ۴ از ۴: پشت کارت دعوت (برنامه مراسم و جزئیات)',
    nextTouchHintFa: 'لمس مجدد روی کارت برای چرخش به روی دعوت‌نامه',
    canOpenEnvelope: false,
    canExtractCard: false,
    canFlipCard: true,
  };
}

export function resolveNextStageTouchAction(
  phase: EnvelopeStagePhase,
  cardFace: CardFaceSide
):
  | 'open-flap'
  | 'extract-card'
  | 'flip-to-back'
  | 'flip-to-front'
  | 'wait-animation' {
  if (phase === 'sealed') {
    return 'open-flap';
  }
  if (phase === 'flap-opening') {
    return 'extract-card';
  }
  if (phase !== 'opened') {
    return 'wait-animation';
  }
  return cardFace === 'front' ? 'flip-to-back' : 'flip-to-front';
}

export interface CardSurfaceDebossStyle {
  transform: string;
  borderStyle: 'inset';
  borderWidth: string;
  borderColor: string;
  boxShadow: string;
  inkTextShadow: string;
  foilTextShadow: string;
  debossedGrooveBoxShadow: string;
}

export interface PaperTextureBlendStyle {
  sliderValue: number;
  cottonRatio: number;
  velvetRatio: number;
  textureNameFa: string;
  textureNameEn: string;
  cssVariables: {
    '--paper-cotton-opacity': string;
    '--paper-velvet-opacity': string;
    '--paper-grain-size': string;
    '--paper-velvet-sheen-opacity': string;
    '--paper-inner-vignette': string;
  };
  cardOuterShadow: string;
  cardInsetShadow: string;
}

/**
 * Pure calculator for the Sidebar Paper Texture Slider (0 = Classic 600gsm Cotton -> 100 = Modern Royal Velvet).
 * Immediately drives `.paper-grain-surface` CSS custom properties and multi-layered 3D card shadows on `LuxuryCardStage`.
 */
export function getPaperTextureBlendStyle(
  textureSliderValue: number,
  isDarkCard: boolean,
  isElevated = true
): PaperTextureBlendStyle {
  const clamped = Math.max(0, Math.min(100, Math.round(Number(textureSliderValue) || 0)));
  const velvetRatio = Number((clamped / 100).toFixed(2));
  const cottonRatio = Number((1 - velvetRatio).toFixed(2));

  let textureNameFa = 'کتان کلاسیک دست‌ساز (Classic Cotton 600gsm)';
  let textureNameEn = 'Classic 600gsm Cotton Rag';
  if (clamped >= 80) {
    textureNameFa = 'مخمل مدرن سلطنتی (Modern Royal Velvet)';
    textureNameEn = 'Modern Plush Velvet';
  } else if (clamped >= 45) {
    textureNameFa = 'مخمل مات و ابریشم آتلیه‌ای (Suede & Silk Velvet)';
    textureNameEn = 'Atelier Suede & Silk Blend';
  } else if (clamped >= 15) {
    textureNameFa = 'کتان ساتن و الیاف نرم (Soft Satin Cotton)';
    textureNameEn = 'Soft Satin Cotton';
  }

  const cottonOpacity = Number((0.18 + cottonRatio * 0.82).toFixed(2));
  const velvetOpacity = Number((velvetRatio * 0.94).toFixed(2));
  const velvetSheenOpacity = Number((velvetRatio * 0.72).toFixed(2));
  const grainPx = Math.round(200 - velvetRatio * 96); // 200px coarse cotton -> 104px fine velvet nap
  const vignetteAlpha = Number((0.045 + velvetRatio * 0.24).toFixed(3));

  // Dynamic outer 3D elevation shadow: velvet absorbs more ambient light and casts a deeper, plusher penumbra
  const mainBlurPx = Math.round((isElevated ? 72 : 26) + velvetRatio * 18);
  const mainSpreadPx = Math.round((isElevated ? -12 : -6) - velvetRatio * 2);
  const mainAlpha = Number(((isElevated ? 0.54 : 0.34) + velvetRatio * 0.18).toFixed(2));
  const secondaryAlpha = Number(((isElevated ? 0.34 : 0.22) + velvetRatio * 0.14).toFixed(2));

  const cardOuterShadow = isElevated
    ? `0 38px ${mainBlurPx}px ${mainSpreadPx}px rgba(14, 11, 8, ${mainAlpha}), 0 16px 34px -8px rgba(14, 11, 8, ${secondaryAlpha})`
    : `0 14px ${mainBlurPx}px ${mainSpreadPx}px rgba(12, 10, 8, ${mainAlpha})`;

  // Dynamic inset deboss & velvet cushion rim shadows
  const topInsetBlur = Number((5 + velvetRatio * 5).toFixed(1));
  const innerCushionBlur = Math.round(32 + velvetRatio * 28);
  const cardInsetShadow = isDarkCard
    ? [
        `inset 0 2.5px ${topInsetBlur}px rgba(0, 0, 0, ${Number((0.72 + velvetRatio * 0.18).toFixed(2))})`,
        `inset 0 -2px 4px rgba(255, 244, 210, ${Number((0.16 + velvetRatio * 0.14).toFixed(2))})`,
        `inset 0 0 ${innerCushionBlur}px rgba(0, 0, 0, ${Number((0.52 + velvetRatio * 0.24).toFixed(2))})`,
        `inset 0 0 0 1.5px rgba(229, 193, 104, ${Number((0.24 + velvetRatio * 0.16).toFixed(2))})`,
      ].join(', ')
    : [
        `inset 0 2.5px ${topInsetBlur}px rgba(38, 28, 14, ${Number((0.22 + velvetRatio * 0.22).toFixed(2))})`,
        `inset 0 -2px 3.5px rgba(255, 255, 255, ${Number((0.88 - velvetRatio * 0.16).toFixed(2))})`,
        `inset 0 0 ${innerCushionBlur}px rgba(34, 24, 14, ${Number((0.09 + velvetRatio * 0.19).toFixed(2))})`,
        `inset 0 0 0 1.5px rgba(255, 250, 240, ${Number((0.64 + velvetRatio * 0.16).toFixed(2))})`,
      ].join(', ');

  return {
    sliderValue: clamped,
    cottonRatio,
    velvetRatio,
    textureNameFa,
    textureNameEn,
    cssVariables: {
      '--paper-cotton-opacity': String(cottonOpacity),
      '--paper-velvet-opacity': String(velvetOpacity),
      '--paper-grain-size': `${grainPx}px ${grainPx}px`,
      '--paper-velvet-sheen-opacity': String(velvetSheenOpacity),
      '--paper-inner-vignette': `rgba(20, 15, 11, ${vignetteAlpha})`,
    },
    cardOuterShadow,
    cardInsetShadow,
  };
}

export interface EnvelopeLayerSeparationStyle {
  flapRotateXDeg: number;
  flapTranslateYPx: number;
  flapTranslateZPx: number;
  bodyTranslateYPx: number;
  bodyScale: number;
  bodyOpacity: number;
  leftWingTransform: string;
  rightWingTransform: string;
  bottomPocketTransform: string;
  transitionCss: string;
}

/**
 * Computes smooth CSS Transition transforms that gently separate the envelope's top flap,
 * side wings, and bottom pocket body from each other to reveal the inner invitation card.
 */
export function getEnvelopeLayerSeparationStyle(
  phase: EnvelopeStagePhase
): EnvelopeLayerSeparationStyle {
  const isFlapOpen =
    phase === 'flap-opening' || phase === 'card-rising' || phase === 'opened';

  const flapRotateXDeg = isFlapOpen ? -166 : phase === 'cracking' ? -14 : 0;
  const flapTranslateYPx = isFlapOpen ? -8 : phase === 'cracking' ? -2 : 0;
  const flapTranslateZPx = isFlapOpen ? 10 : 2;

  const bodyTranslateYPx =
    phase === 'sealed'
      ? 18
      : phase === 'cracking'
      ? 22
      : phase === 'flap-opening'
      ? 94
      : phase === 'card-rising'
      ? 158
      : 192;

  const bodyScale =
    phase === 'sealed' || phase === 'cracking'
      ? 1
      : phase === 'flap-opening'
      ? 0.965
      : phase === 'card-rising'
      ? 0.91
      : 0.86;

  const bodyOpacity =
    phase === 'sealed' || phase === 'cracking' || phase === 'flap-opening'
      ? 1
      : phase === 'card-rising'
      ? 0.32
      : 0;

  // Subtle physical parting of the 3 pocket flaps as the envelope opens so the inner card is revealed smoothly
  const leftWingTransform = isFlapOpen
    ? 'translate3d(-3px, 2px, 0)'
    : 'translate3d(0px, 0px, 0)';
  const rightWingTransform = isFlapOpen
    ? 'translate3d(3px, 2px, 0)'
    : 'translate3d(0px, 0px, 0)';
  const bottomPocketTransform = isFlapOpen
    ? 'translate3d(0px, 5px, 2px)'
    : 'translate3d(0px, 0px, 0)';

  return {
    flapRotateXDeg,
    flapTranslateYPx,
    flapTranslateZPx,
    bodyTranslateYPx,
    bodyScale,
    bodyOpacity,
    leftWingTransform,
    rightWingTransform,
    bottomPocketTransform,
    transitionCss:
      'transform 780ms cubic-bezier(0.22, 1, 0.36, 1), opacity 680ms cubic-bezier(0.22, 1, 0.36, 1), filter 680ms cubic-bezier(0.22, 1, 0.36, 1)',
  };
}

/**
 * Computes the unified 3D single-surface CSS styling for `LuxuryCardStage` card containers:
 * - Applies `transform: rotateY(...) translateZ(...)` so the card physically emerges from the
 *   envelope pocket cavity and settles at a realistic 3D Z-depth on the stage.
 * - Uses `border-inset` (`borderStyle: 'inset'`) and multi-layered subtle `inset` shadows
 *   to simulate the sunken plate impression (deboss well) of 600gsm cotton cardstock or modern velvet.
 * - Accepts `textureSliderValue` (0 = Classic Cotton -> 100 = Modern Velvet) to dynamically
 *   update the card's outer & inner shadows in real time.
 */
export function getCardSurfaceDebossStyle(
  palette: TemplatePalette,
  phase: EnvelopeStagePhase,
  face: CardFaceSide,
  textureSliderValue = 0
): CardSurfaceDebossStyle {
  const rotateYDeg = face === 'back' ? 180 : 0;
  const faceTranslateZPx =
    phase === 'opened'
      ? 14
      : phase === 'card-rising'
      ? 18
      : phase === 'flap-opening'
      ? 4
      : 2;

  const isElevated = phase === 'opened' || phase === 'card-rising';
  const textureStyle = getPaperTextureBlendStyle(
    textureSliderValue,
    palette.isDarkCard,
    isElevated
  );

  const inkTextShadow = palette.isDarkCard
    ? '0 -0.75px 1px rgba(0, 0, 0, 0.95), 0 0.75px 1px rgba(255, 246, 222, 0.32)'
    : '0 -0.5px 0.5px rgba(28, 20, 12, 0.45), 0 0.75px 0.5px rgba(255, 255, 255, 0.88)';

  const foilTextShadow = palette.isDarkCard
    ? '0 -0.75px 1.2px rgba(0, 0, 0, 0.88), 0 0.75px 1.2px rgba(255, 240, 195, 0.42)'
    : '0 -0.5px 0.5px rgba(82, 54, 16, 0.55), 0 0.75px 0.5px rgba(255, 252, 240, 0.82)';

  const debossedGrooveBoxShadow = palette.isDarkCard
    ? 'inset 0 1px 1.5px rgba(0, 0, 0, 0.75), 0 0.75px 0 rgba(255, 243, 196, 0.22)'
    : 'inset 0 1px 1.2px rgba(36, 24, 8, 0.22), 0 0.75px 0 rgba(255, 255, 255, 0.85)';

  return {
    transform: `rotateY(${rotateYDeg}deg) translateZ(${faceTranslateZPx}px)`,
    borderStyle: 'inset',
    borderWidth: '2px',
    borderColor: palette.isDarkCard
      ? `${palette.foilHex}55`
      : `rgba(186, 158, 108, ${Number((0.42 + textureStyle.velvetRatio * 0.18).toFixed(2))})`,
    boxShadow: `${textureStyle.cardOuterShadow}, ${textureStyle.cardInsetShadow}`,
    inkTextShadow,
    foilTextShadow,
    debossedGrooveBoxShadow,
  };
}

/**
 * Computes live 3D Y-axis rotation and flip decision when the user drags or swipes
 * the invitation card horizontally (left or right).
 */
export function computeHorizontalCardRotation(
  deltaX: number,
  currentFace: CardFaceSide
): {
  rotateYDeg: number;
  shouldFlip: boolean;
  nextFace: CardFaceSide;
  liveRotateYDeg: number;
  shouldFlipFace: boolean;
  targetFace: CardFaceSide;
} {
  const baseDeg = currentFace === 'back' ? 180 : 0;
  const clampedDelta = Math.max(-180, Math.min(180, deltaX * 0.65));
  const liveRotateYDeg = Number((baseDeg + clampedDelta).toFixed(1));
  const shouldFlipFace = Math.abs(deltaX) >= 28;
  const targetFace: CardFaceSide = shouldFlipFace
    ? currentFace === 'front'
      ? 'back'
      : 'front'
    : currentFace;

  return {
    rotateYDeg: liveRotateYDeg,
    shouldFlip: shouldFlipFace,
    nextFace: targetFace,
    liveRotateYDeg,
    shouldFlipFace,
    targetFace,
  };
}

export interface StudioLightingStyle {
  azimuthDeg: number;
  elevationDeg: number;
  intensityPct: number;
  shadowOffsetX: number;
  shadowOffsetY: number;
  waxHighlightX: number;
  waxHighlightY: number;
  surfaceBrightness: number;
  cssVariables: {
    '--light-azimuth': string;
    '--light-elevation': string;
    '--light-intensity': string;
    '--light-shadow-x': string;
    '--light-shadow-y': string;
    '--wax-highlight-x': string;
    '--wax-highlight-y': string;
    '--wax-specular-alpha': string;
    '--paper-surface-brightness': string;
    '--wax-dynamic-shadow': string;
    '--envelope-dynamic-shadow': string;
  };
}

/**
 * Pure calculator for the Studio Lighting Controls Panel (Azimuth 0-360°, Elevation 10-90°, Intensity 20-100%).
 * Dynamically updates CSS custom properties for the 3D wax seal specular hotspot, cast shadows, and paper surface illumination.
 */
export function getStudioLightingStyle(
  azimuthDeg: number,
  elevationDeg: number,
  intensityPct = 85
): StudioLightingStyle {
  const clampedAzimuth = Math.max(0, Math.min(360, Math.round(Number(azimuthDeg) || 0)));
  const clampedElevation = Math.max(10, Math.min(90, Math.round(Number(elevationDeg) || 45)));
  const clampedIntensity = Math.max(20, Math.min(100, Math.round(Number(intensityPct) || 85)));

  const radAz = (clampedAzimuth * Math.PI) / 180;
  const radEl = (clampedElevation * Math.PI) / 180;
  const intensityRatio = Number((clampedIntensity / 100).toFixed(2));

  // Lower elevation casts longer directional shadows opposite the light azimuth
  const shadowReach = Math.cos(radEl) * 20;
  const shadowOffsetX = Number((-Math.cos(radAz) * shadowReach).toFixed(1));
  const shadowOffsetY = Number((-Math.sin(radAz) * shadowReach).toFixed(1));

  // Wax seal specular hotspot moves toward the light source
  const waxHighlightX = Number((50 + Math.cos(radAz) * Math.cos(radEl) * 30).toFixed(1));
  const waxHighlightY = Number((50 + Math.sin(radAz) * Math.cos(radEl) * 30).toFixed(1));

  const specularAlpha = Number((0.24 + intensityRatio * 0.58).toFixed(2));
  const surfaceBrightness = Number(
    (0.86 + intensityRatio * 0.22 + Math.sin(radEl) * 0.08).toFixed(2)
  );

  const waxBlur = Math.round(14 + Math.cos(radEl) * 10);
  const waxAlpha = Number((0.36 + intensityRatio * 0.22).toFixed(2));
  const waxDynamicShadow = `drop-shadow(${shadowOffsetX}px ${Math.max(4, shadowOffsetY + 8)}px ${waxBlur}px rgba(10, 6, 3, ${waxAlpha}))`;

  const envBlur = Math.round(32 + Math.cos(radEl) * 24);
  const envAlpha = Number((0.28 + intensityRatio * 0.22).toFixed(2));
  const envelopeDynamicShadow = `${shadowOffsetX}px ${Math.max(8, shadowOffsetY + 18)}px ${envBlur}px -8px rgba(14, 10, 6, ${envAlpha})`;

  return {
    azimuthDeg: clampedAzimuth,
    elevationDeg: clampedElevation,
    intensityPct: clampedIntensity,
    shadowOffsetX,
    shadowOffsetY,
    waxHighlightX,
    waxHighlightY,
    surfaceBrightness,
    cssVariables: {
      '--light-azimuth': `${clampedAzimuth}deg`,
      '--light-elevation': `${clampedElevation}deg`,
      '--light-intensity': String(intensityRatio),
      '--light-shadow-x': `${shadowOffsetX}px`,
      '--light-shadow-y': `${shadowOffsetY}px`,
      '--wax-highlight-x': `${waxHighlightX}%`,
      '--wax-highlight-y': `${waxHighlightY}%`,
      '--wax-specular-alpha': String(specularAlpha),
      '--paper-surface-brightness': String(surfaceBrightness),
      '--wax-dynamic-shadow': waxDynamicShadow,
      '--envelope-dynamic-shadow': envelopeDynamicShadow,
    },
  };
}

let cachedEnvelopeOpeningWavUri: string | null = null;

/**
 * Generates a self-contained, deterministic 16-bit PCM WAV data URI (`data:audio/wav;base64,...`)
 * simulating a subtle wax-seal softening crack followed by a tactile 600gsm cotton paper-tear / envelope-opening slide.
 */
export function generateEnvelopeOpeningWavDataUri(): string {
  if (cachedEnvelopeOpeningWavUri) {
    return cachedEnvelopeOpeningWavUri;
  }

  const sampleRate = 8000;
  const durationSec = 0.55;
  const numSamples = Math.floor(sampleRate * durationSec);
  const dataSize = numSamples * 2;
  const buffer = new ArrayBuffer(44 + dataSize);
  const view = new DataView(buffer);

  const writeStr = (offset: number, str: string) => {
    for (let i = 0; i < str.length; i++) {
      view.setUint8(offset + i, str.charCodeAt(i));
    }
  };

  writeStr(0, 'RIFF');
  view.setUint32(4, 36 + dataSize, true);
  writeStr(8, 'WAVE');
  writeStr(12, 'fmt ');
  view.setUint32(16, 16, true); // PCM chunk size
  view.setUint16(20, 1, true); // PCM format = 1
  view.setUint16(22, 1, true); // Mono = 1 channel
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, sampleRate * 2, true); // Byte rate
  view.setUint16(32, 2, true); // Block align
  view.setUint16(34, 16, true); // 16 bits per sample
  writeStr(36, 'data');
  view.setUint32(40, dataSize, true);

  // Deterministic LCG PRNG for crisp cotton paper fiber friction + wax snap
  let seed = 133742;
  let prevSample = 0;
  for (let i = 0; i < numSamples; i++) {
    const t = i / sampleRate;
    seed = (seed * 1664525 + 1013904223) >>> 0;
    const white = (seed / 0xffffffff) * 2 - 1;

    // 1. Initial subtle wax seal snap & softening (0.00s - 0.11s)
    const waxEnv = t < 0.11 ? Math.exp(-t * 38) * Math.sin(2 * Math.PI * 210 * t) : 0;

    // 2. Tactile cotton paper tear / envelope flap slide (0.06s - 0.52s)
    const paperProgress = Math.max(0, (t - 0.05) / 0.48);
    const paperEnv =
      t >= 0.05 && t <= 0.53
        ? Math.sin(Math.PI * Math.min(1, paperProgress)) *
          (0.65 + 0.35 * Math.sin(2 * Math.PI * 14 * t))
        : 0;

    // Band-limited paper rustle
    const filteredNoise = white * 0.62 - prevSample * 0.38;
    prevSample = white;

    const combined = (waxEnv * 0.45 + filteredNoise * paperEnv * 0.38) * 0.55;
    const clamped = Math.max(-1, Math.min(1, combined));
    view.setInt16(44 + i * 2, Math.round(clamped * 32767), true);
  }

  const bytes = new Uint8Array(buffer);
  let binary = '';
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }

  const base64 =
    typeof btoa === 'function'
      ? btoa(binary)
      : Buffer.from(buffer).toString('base64');

  cachedEnvelopeOpeningWavUri = `data:audio/wav;base64,${base64}`;
  return cachedEnvelopeOpeningWavUri;
}

