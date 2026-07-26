import type { MediaAsset, Species } from "../types/game";

const pendingPhoto = (speciesId: string, hebrewName: string): MediaAsset => ({
  src: `/images/snakes/${speciesId}/01.jpg`,
  alt: hebrewName,
  photographer: "טרם הוזן",
  license: "טרם אושר",
  tags: ["גוף מלא", "תמונה ראשית"],
  difficulty: 1,
  approved: false
});


const ownedPhoto = (
  speciesId: string,
  fileNumber: string,
  hebrewName: string,
  difficulty: 1 | 2 | 3,
  tags: string[]
): MediaAsset => ({
  src: `/images/snakes/${speciesId}/${speciesId}-${fileNumber}.webp`,
  alt: `${hebrewName} — צילום שטח אמיתי`,
  photographer: "Yair",
  license: "© Yair · כל הזכויות שמורות",
  tags,
  difficulty,
  approved: true
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
    media: [
      ownedPhoto("palestine-viper", "01", "צפע מצוי", 1, ["תקריב", "ראש", "דוגמת גב"]),
      ownedPhoto("palestine-viper", "02", "צפע מצוי", 1, ["גוף מלא", "דוגמת גב", "בוגר"]),
      ownedPhoto("palestine-viper", "03", "צפע מצוי", 2, ["גוף מלא", "סביבה טבעית"]),
      ownedPhoto("palestine-viper", "04", "צפע מצוי", 1, ["גוף מלא", "דוגמת גב ברורה"]),
      ownedPhoto("palestine-viper", "05", "צפע מצוי", 2, ["זווית שטח", "מבנה גוף"]),
      ownedPhoto("palestine-viper", "06", "צפע מצוי", 3, ["הסוואה", "מצב שטח"]),
      ownedPhoto("palestine-viper", "07", "צפע מצוי", 3, ["הסוואה", "מצב שטח"])
    ]
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
    media: [
      ownedPhoto("coin-marked-snake", "01", "זעמן מטבעות", 1, ["גוף מלא", "כתמי מטבעות"]),
      ownedPhoto("coin-marked-snake", "02", "זעמן מטבעות", 2, ["סביבה טבעית", "מבנה גוף"]),
      ownedPhoto("coin-marked-snake", "03", "זעמן מטבעות", 1, ["דוגמת גב", "כתמי מטבעות"]),
      ownedPhoto("coin-marked-snake", "04", "זעמן מטבעות", 2, ["זווית שטח", "גוף מלא"]),
      ownedPhoto("coin-marked-snake", "05", "זעמן מטבעות", 3, ["הסוואה", "מצב שטח"])
    ]
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

