import type { Mission, SafetyQuestion } from "../types/game";

export const missions: Mission[] = [
  { id: "safety", title: "פוגשים נחש", subtitle: "לומדים מה עושים — ומה לעולם לא עושים", icon: "🛡️", xp: 40, kind: "safety", available: true },
  { id: "viper-vs-coin", title: "צפע או זעמן?", subtitle: "לומדים להשוות בלי להתקרב", icon: "👀", xp: 80, kind: "identify", available: true },
  { id: "album", title: "עשרת הראשונים", subtitle: "מכירים את נבחרת הנחשים של ישראל", icon: "🃏", xp: 40, kind: "album", available: true },
  { id: "mediterranean", title: "נחשי הצפון והמרכז", subtitle: "בקרוב", icon: "🌿", xp: 80, kind: "identify", available: false },
  { id: "desert", title: "נחשי המדבר", subtitle: "בקרוב", icon: "🏜️", xp: 80, kind: "identify", available: false },
  { id: "final", title: "מבחן בלש נחשים", subtitle: "בקרוב", icon: "🏆", xp: 120, kind: "identify", available: false }
];

export const safetyQuestions: SafetyQuestion[] = [
  { scene: "ראית נחש ליד שביל הטיול. מה עושים קודם?", choices: ["מתקרבים לצלם", "עוצרים ומתרחקים לאט", "זורקים עליו אבן"], correct: 1, explanation: "שומרים מרחק, לא חוסמים לנחש את הדרך ולא מנסים לזהות מקרוב." },
  { scene: "הנחש נכנס לחצר. למי פונים?", choices: ["למבוגר וללוכד מורשה", "לחבר שמכיר נחשים", "מנסים לגרש לבד"], correct: 0, explanation: "ילד קורא למבוגר; במקרה הצורך מזמינים לוכד נחשים מורשה." },
  { scene: "נחש נראה מת ולא זז. מה נכון?", choices: ["נוגעים עם מקל", "מרימים בזנב", "לא נוגעים ומתרחקים"], correct: 2, explanation: "גם נחש שנראה מת עלול להיות חי או להגיב. לא נוגעים בו." }
];
