export type RiskLevel = "ארסי" | "תת־ארסי" | "לא ארסי";

export type MediaAsset = {
  src: string;
  alt: string;
  photographer: string;
  license: string;
  sourceUrl?: string;
  tags: string[];
  difficulty: 1 | 2 | 3;
  approved: boolean;
};

export type Species = {
  id: string;
  group: "snakes";
  name: string;
  scientificName: string;
  status: RiskLevel;
  region: string;
  habitat: string;
  identificationClues: string[];
  safetyNote: string;
  similarSpecies: string[];
  media: MediaAsset[];
};

export type Lesson = {
  id: string;
  title: string;
  subtitle: string;
  icon: string;
  xp: number;
  kind: "safety" | "identify" | "album";
  available: boolean;
};

const pendingPhoto = (speciesId: string, hebrewName: string): MediaAsset => ({
  src: `/images/snakes/${speciesId}/01.jpg`,
  alt: hebrewName,
  photographer: "טרם הוזן",
  license: "טרם אושר",
  tags: ["גוף מלא", "תמונה ראשית"],
  difficulty: 1,
  approved: false
});

export const species: Species[] = [
  {
    id: "palestine-viper",
    group: "snakes",
    name: "צפע מצוי",
    scientificName: "Daboia palaestinae",
    status: "ארסי",
    region: "הצפון, המרכז ועד צפון הנגב",
    habitat: "חורש, שדות וסביבת יישובים",
    identificationClues: ["גוף מוצק ועבה יחסית", "דגם גב כהה ובולט", "לא מזהים לפי סימן יחיד"],
    safetyNote: "שומרים מרחק ולא מנסים לבדוק מאפיינים מקרוב.",
    similarSpecies: ["coin-marked-snake"],
    media: [pendingPhoto("palestine-viper", "צפע מצוי")]
  },
  {
    id: "coin-marked-snake",
    group: "snakes",
    name: "זעמן מטבעות",
    scientificName: "Hemorrhois nummifer",
    status: "לא ארסי",
    region: "צפון הארץ ומרכזה",
    habitat: "אזורים סלעיים, חורש ויישובים",
    identificationClues: ["כתמים המזכירים מטבעות", "גוף דק וארוך יותר בדרך כלל", "עשוי להידמות לצפע"],
    safetyNote: "גם כשחושבים שמדובר במין לא ארסי — לא נוגעים.",
    similarSpecies: ["palestine-viper"],
    media: [pendingPhoto("coin-marked-snake", "זעמן מטבעות")]
  },
  {
    id: "black-whipsnake",
    group: "snakes",
    name: "זעמן שחור",
    scientificName: "Dolichophis jugularis",
    status: "לא ארסי",
    region: "צפון הארץ ומרכזה",
    habitat: "שדות, חורש ושולי יישובים",
    identificationClues: ["בוגרים שחורים וארוכים מאוד", "צעירים נראים שונים מהבוגרים", "מבנה גוף ארוך ומהיר"],
    safetyNote: "לא מנסים לתפוס גם נחש שאינו ארסי.",
    similarSpecies: [],
    media: [pendingPhoto("black-whipsnake", "זעמן שחור")]
  },
  {
    id: "olive-whipsnake",
    group: "snakes",
    name: "זעמן זיתני",
    scientificName: "Platyceps collaris",
    status: "לא ארסי",
    region: "החבל הים־תיכוני",
    habitat: "חורש, בתה ואזורים סלעיים",
    identificationClues: ["גוף דק", "גוון זית עד חום", "מראה עדין ומהיר"],
    safetyNote: "צופים מרחוק ומאפשרים לנחש להתרחק.",
    similarSpecies: [],
    media: [pendingPhoto("olive-whipsnake", "זעמן זיתני")]
  },
  {
    id: "dice-snake",
    group: "snakes",
    name: "נחש מים משובץ",
    scientificName: "Natrix tessellata",
    status: "לא ארסי",
    region: "ליד מקווי מים בצפון ובמרכז",
    habitat: "נחלים, בריכות ומאגרים",
    identificationClues: ["דגם משובץ", "קשר חזק לבתי גידול מימיים", "שוחה היטב"],
    safetyNote: "לא חוסמים את דרכו למים או ליבשה.",
    similarSpecies: [],
    media: [pendingPhoto("dice-snake", "נחש מים משובץ")]
  },
  {
    id: "large-whip-snake",
    group: "snakes",
    name: "תלום־קשקשים מצוי",
    scientificName: "Malpolon insignitus",
    status: "תת־ארסי",
    region: "חלקים נרחבים בארץ",
    habitat: "שטחים פתוחים, חורש ובתה",
    identificationClues: ["נחש גדול ומהיר", "גוף ארוך", "ראש ומבט אופייניים"],
    safetyNote: "אין להתקרב או לנסות לגרש בידיים.",
    similarSpecies: [],
    media: [pendingPhoto("large-whip-snake", "תלום־קשקשים מצוי")]
  },
  {
    id: "saw-scaled-viper",
    group: "snakes",
    name: "אפעה מגוון",
    scientificName: "Echis coloratus",
    status: "ארסי",
    region: "בקעת הירדן, מדבר יהודה, הנגב והערבה",
    habitat: "אזורים סלעיים וצחיחים",
    identificationClues: ["התאמה טובה לרקע מדברי", "גוף קצר ומוצק יחסית", "עשוי להשמיע קול חיכוך בעת איום"],
    safetyNote: "עוצרים, מתרחקים ומזהירים מבוגר.",
    similarSpecies: [],
    media: [pendingPhoto("saw-scaled-viper", "אפעה מגוון")]
  },
  {
    id: "desert-horned-viper",
    group: "snakes",
    name: "עכן גדול",
    scientificName: "Cerastes cerastes",
    status: "ארסי",
    region: "חולות הנגב והערבה",
    habitat: "דיונות וחולות",
    identificationClues: ["מותאם לתנועה בחול", "גוף מוצק", "לעיתים נראות קרניים מעל העיניים"],
    safetyNote: "בחולות בודקים היכן דורכים ושומרים מרחק מכל נחש.",
    similarSpecies: [],
    media: [pendingPhoto("desert-horned-viper", "עכן גדול")]
  },
  {
    id: "black-desert-cobra",
    group: "snakes",
    name: "פתן שחור",
    scientificName: "Walterinnesia aegyptia",
    status: "ארסי",
    region: "הנגב, מדבר יהודה והערבה",
    habitat: "מדבר סלעי וערוצי נחלים",
    identificationClues: ["צבע שחור מבריק", "גוף אחיד יחסית", "פעיל בעיקר בשעות החשכה"],
    safetyNote: "לא מתקרבים גם כשהנחש נראה רגוע או איטי.",
    similarSpecies: [],
    media: [pendingPhoto("black-desert-cobra", "פתן שחור")]
  },
  {
    id: "engedi-burrowing-asp",
    group: "snakes",
    name: "שרף עין גדי",
    scientificName: "Atractaspis engaddensis",
    status: "ארסי",
    region: "מדבר יהודה, בקעת ים המלח והערבה",
    habitat: "קרקע תחוחה ואזורים מדבריים",
    identificationClues: ["קטן וכהה", "מותאם לחפירה", "מראה פשוט שעלול להטעות"],
    safetyNote: "אין לנסות לאחוז בו בשום צורה.",
    similarSpecies: [],
    media: [pendingPhoto("engedi-burrowing-asp", "שרף עין גדי")]
  }
];

export const lessons: Lesson[] = [
  { id: "safety", title: "פוגשים נחש", subtitle: "לומדים מה עושים — ומה לעולם לא עושים", icon: "🛡️", xp: 40, kind: "safety", available: true },
  { id: "viper-vs-coin", title: "צפע או זעמן?", subtitle: "לומדים להשוות בלי להתקרב", icon: "👀", xp: 80, kind: "identify", available: true },
  { id: "album", title: "עשרת הראשונים", subtitle: "מכירים את נבחרת הנחשים של ישראל", icon: "🃏", xp: 40, kind: "album", available: true },
  { id: "mediterranean", title: "נחשי הצפון והמרכז", subtitle: "בקרוב", icon: "🌿", xp: 80, kind: "identify", available: false },
  { id: "desert", title: "נחשי המדבר", subtitle: "בקרוב", icon: "🏜️", xp: 80, kind: "identify", available: false },
  { id: "final", title: "מבחן בלש נחשים", subtitle: "בקרוב", icon: "🏆", xp: 120, kind: "identify", available: false }
];

export const safetyQuestions = [
  { scene: "ראית נחש ליד שביל הטיול. מה עושים קודם?", choices: ["מתקרבים לצלם", "עוצרים ומתרחקים לאט", "זורקים עליו אבן"], correct: 1, explanation: "שומרים מרחק, לא חוסמים לנחש את הדרך ולא מנסים לזהות מקרוב." },
  { scene: "הנחש נכנס לחצר. למי פונים?", choices: ["למבוגר וללוכד מורשה", "לחבר שמכיר נחשים", "מנסים לגרש לבד"], correct: 0, explanation: "ילד קורא למבוגר; במקרה הצורך מזמינים לוכד נחשים מורשה." },
  { scene: "נחש נראה מת ולא זז. מה נכון?", choices: ["נוגעים עם מקל", "מרימים בזנב", "לא נוגעים ומתרחקים"], correct: 2, explanation: "גם נחש שנראה מת עלול להיות חי או להגיב. לא נוגעים בו." }
];
