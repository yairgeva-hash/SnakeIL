import type { Mission, SafetyQuestion } from "../types/game";

export const missions: Mission[] = [
  { id: "safety", title: "פוגשים נחש", subtitle: "לומדים מה עושים — ומה לעולם לא עושים", icon: "🛡️", xp: 60, kind: "safety", available: true },
  { id: "viper-vs-coin", title: "צפע או זעמן?", subtitle: "לומדים להשוות בלי להתקרב", icon: "👀", xp: 80, kind: "identify", available: true },
  { id: "album", title: "עשרת הראשונים", subtitle: "מכירים את נבחרת הנחשים של ישראל", icon: "🃏", xp: 40, kind: "album", available: true },
  { id: "mediterranean", title: "נחשי הצפון והמרכז", subtitle: "בקרוב", icon: "🌿", xp: 80, kind: "identify", available: false },
  { id: "desert", title: "נחשי המדבר", subtitle: "בקרוב", icon: "🏜️", xp: 80, kind: "identify", available: false },
  { id: "final", title: "מבחן בלש נחשים", subtitle: "בקרוב", icon: "🏆", xp: 120, kind: "identify", available: false }
];

export const safetyQuestions: SafetyQuestion[] = [
  {
    scene: "ראית נחש ליד שביל הטיול. מה עושים קודם?",
    choices: ["מתקרבים לצלם", "עוצרים ומתרחקים לאט", "זורקים עליו אבן"],
    correct: 1,
    explanation: "שומרים מרחק, לא חוסמים לנחש את הדרך ולא מנסים לזהות מקרוב."
  },
  {
    scene: "הנחש נכנס לחצר. למי פונים?",
    choices: ["למבוגר וללוכד מורשה", "לחבר שמכיר נחשים", "מנסים לגרש לבד"],
    correct: 0,
    explanation: "ילד קורא מיד למבוגר; במקרה הצורך מזמינים לוכד נחשים בעל היתר בתוקף."
  },
  {
    scene: "נחש נראה מת ולא זז. מה נכון?",
    choices: ["נוגעים עם מקל", "מרימים בזנב", "לא נוגעים ומתרחקים"],
    correct: 2,
    explanation: "גם נחש שנראה מת עלול להיות חי או להגיב. לא נוגעים בו — גם לא בעזרת חפץ."
  },
  {
    scene: "חבר רוצה להתקרב כדי לצלם את ראש הנחש. מה אומרים לו?",
    choices: ["שיעשה זום עם הרגליים", "שיישאר רחוק ויקרא למבוגר", "שיתקרב רק אם הנחש קטן"],
    correct: 1,
    explanation: "צילום אינו סיבה להתקרב. נשארים במרחק בטוח, מזהירים אחרים וקוראים למבוגר."
  },
  {
    scene: "מישהו הוכש מנחש. מה הפעולה הראשונה?",
    choices: ["מתקשרים מיד למד״א 101", "מנסים למצוץ את הארס", "שמים חוסם עורקים"],
    correct: 0,
    explanation: "מתקשרים מיד למד״א ופועלים לפי ההנחיות. לא מוצצים ארס ולא שמים חוסם עורקים."
  },
  {
    scene: "אחרי הכשה, איך עוזרים לנפגע עד שמגיע הצוות הרפואי?",
    choices: ["מרגיעים וממעטים בתנועה", "נותנים לו לרוץ לעזרה", "מקררים את מקום ההכשה בקרח"],
    correct: 0,
    explanation: "מרגיעים את הנפגע וממעטים בתנועה. מסירים תכשיטים או בגד לוחץ, ולא מקררים את מקום ההכשה."
  }
];
