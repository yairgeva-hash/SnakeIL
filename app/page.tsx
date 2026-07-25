"use client";

import { useEffect, useMemo, useState } from "react";

type Species = {
  id: string;
  name: string;
  scientificName: string;
  status: "ארסי" | "תת־ארסי" | "לא ארסי";
  region: string;
  habitat: string;
  clue: string;
  image: string;
};

type Lesson = {
  id: string;
  title: string;
  subtitle: string;
  icon: string;
  xp: number;
  kind: "safety" | "identify" | "album";
  available: boolean;
};

const species: Species[] = [
  { id: "palestine-viper", name: "צפע מצוי", scientificName: "Daboia palaestinae", status: "ארסי", region: "הצפון, המרכז ועד צפון הנגב", habitat: "חורש, שדות וסביבת יישובים", clue: "גוף עבה ודגם גב בולט. לעולם לא מסתמכים על סימן יחיד.", image: "/snakes/palestine-viper.jpg" },
  { id: "coin-marked-snake", name: "זעמן מטבעות", scientificName: "Hemorrhois nummifer", status: "לא ארסי", region: "צפון הארץ ומרכזה", habitat: "אזורים סלעיים, חורש ויישובים", clue: "כתמים דמויי מטבעות וגוף דק יחסית; עלול להידמות לצפע.", image: "/snakes/coin-marked-snake.jpg" },
  { id: "black-whipsnake", name: "זעמן שחור", scientificName: "Dolichophis jugularis", status: "לא ארסי", region: "צפון הארץ ומרכזה", habitat: "שדות, חורש ושולי יישובים", clue: "הבוגרים שחורים וארוכים מאוד; הצעירים נראים שונים.", image: "/snakes/black-whipsnake.jpg" },
  { id: "olive-whipsnake", name: "זעמן זיתני", scientificName: "Platyceps collaris", status: "לא ארסי", region: "החבל הים־תיכוני", habitat: "חורש, בתה ואזורים סלעיים", clue: "נחש דק ומהיר בגוון זית עד חום.", image: "/snakes/olive-whipsnake.jpg" },
  { id: "dice-snake", name: "נחש מים משובץ", scientificName: "Natrix tessellata", status: "לא ארסי", region: "ליד מקווי מים בצפון ובמרכז", habitat: "נחלים, בריכות ומאגרים", clue: "דגם משובץ וקשר חזק לבתי גידול מימיים.", image: "/snakes/dice-snake.jpg" },
  { id: "large-whip-snake", name: "תלום־קשקשים מצוי", scientificName: "Malpolon insignitus", status: "תת־ארסי", region: "חלקים נרחבים בארץ", habitat: "שטחים פתוחים, חורש ובתה", clue: "נחש גדול ומהיר; אינו נחשב מסוכן בדרך כלל לאדם.", image: "/snakes/large-whip-snake.jpg" },
  { id: "saw-scaled-viper", name: "אפעה מגוון", scientificName: "Echis coloratus", status: "ארסי", region: "בקעת הירדן, מדבר יהודה, הנגב והערבה", habitat: "אזורים סלעיים וצחיחים", clue: "דגם מדברי וקשקשים היוצרים קול חיכוך בעת איום.", image: "/snakes/saw-scaled-viper.jpg" },
  { id: "desert-horned-viper", name: "עכן גדול", scientificName: "Cerastes cerastes", status: "ארסי", region: "חולות הנגב והערבה", habitat: "דיונות וחולות", clue: "מותאם לחול, גוף מוצק ולעיתים קרניים מעל העיניים.", image: "/snakes/desert-horned-viper.jpg" },
  { id: "black-desert-cobra", name: "פתן שחור", scientificName: "Walterinnesia aegyptia", status: "ארסי", region: "הנגב, מדבר יהודה והערבה", habitat: "מדבר סלעי וערוצי נחלים", clue: "שחור מבריק ובעל ארס עצבי; לרוב נמנע ממפגש.", image: "/snakes/black-desert-cobra.jpg" },
  { id: "engedi-burrowing-asp", name: "שרף עין גדי", scientificName: "Atractaspis engaddensis", status: "ארסי", region: "מדבר יהודה, בקעת ים המלח והערבה", habitat: "קרקע תחוחה ואזורים מדבריים", clue: "קטן, כהה וחופר; אין לנסות לאחוז בו בשום צורה.", image: "/snakes/engedi-burrowing-asp.jpg" }
];

const lessons: Lesson[] = [
  { id: "safety", title: "פוגשים נחש", subtitle: "לומדים מה עושים — ומה לעולם לא עושים", icon: "🛡️", xp: 40, kind: "safety", available: true },
  { id: "viper-vs-coin", title: "צפע או זעמן?", subtitle: "ההבדלים שחשוב להכיר בלי להתקרב", icon: "👀", xp: 60, kind: "identify", available: true },
  { id: "album", title: "עשרת הראשונים", subtitle: "מכירים את נבחרת הנחשים של ישראל", icon: "🃏", xp: 40, kind: "album", available: true },
  { id: "mediterranean", title: "נחשי הצפון והמרכז", subtitle: "בקרוב", icon: "🌿", xp: 80, kind: "identify", available: false },
  { id: "desert", title: "נחשי המדבר", subtitle: "בקרוב", icon: "🏜️", xp: 80, kind: "identify", available: false },
  { id: "final", title: "מבחן בלש נחשים", subtitle: "בקרוב", icon: "🏆", xp: 120, kind: "identify", available: false }
];

type Screen = "home" | "journey" | "lesson" | "album" | "safety";

type SafetyQuestion = {
  scene: string;
  choices: string[];
  correct: number;
  explanation: string;
};

const safetyQuestions: SafetyQuestion[] = [
  { scene: "ראית נחש ליד שביל הטיול. מה עושים קודם?", choices: ["מתקרבים לצלם", "עוצרים ומתרחקים לאט", "זורקים עליו אבן"], correct: 1, explanation: "נכון. שומרים מרחק, לא חוסמים לנחש את הדרך ולא מנסים לזהות מקרוב." },
  { scene: "הנחש נכנס לחצר. למי פונים?", choices: ["למבוגר וללוכד מורשה", "לחבר שמכיר נחשים", "מנסים לגרש לבד"], correct: 0, explanation: "בדיוק. ילד קורא למבוגר; במקרה הצורך מזמינים לוכד נחשים מורשה." },
  { scene: "נחש נראה מת ולא זז. מה נכון?", choices: ["נוגעים עם מקל", "מרימים בזנב", "לא נוגעים ומתרחקים"], correct: 2, explanation: "מצוין. גם נחש שנראה מת עלול להיות חי או להגיב. לא נוגעים בו." }
];

function shuffled<T>(items: T[]): T[] {
  return [...items].sort(() => Math.random() - 0.5);
}

export default function Home() {
  const [screen, setScreen] = useState<Screen>("home");
  const [activeLesson, setActiveLesson] = useState<Lesson | null>(null);
  const [xp, setXp] = useState(0);
  const [streak, setStreak] = useState(1);
  const [completed, setCompleted] = useState<string[]>([]);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({});

  useEffect(() => {
    setXp(Number(localStorage.getItem("nature-detectives-xp") || 0));
    setStreak(Number(localStorage.getItem("nature-detectives-streak") || 1));
    setCompleted(JSON.parse(localStorage.getItem("nature-detectives-completed") || "[]"));
  }, []);

  const rank = xp < 100 ? "חוקר מתחיל" : xp < 250 ? "בלש טבע" : "מומחה נחשים";
  const progress = Math.min(100, (xp % 100));

  const comparisonQuestions = useMemo(() => {
    const viper = species[0];
    const coin = species[1];
    return shuffled([
      { snake: viper, prompt: "איזה מין מתואר כאן?", choices: [viper.name, coin.name], correct: 0 },
      { snake: coin, prompt: "איזה מין מתואר כאן?", choices: [viper.name, coin.name], correct: 1 },
      { snake: viper, prompt: "למי בדרך כלל גוף עבה יותר?", choices: [viper.name, coin.name], correct: 0 },
      { snake: coin, prompt: "למי בדרך כלל גוף דק וארוך יותר?", choices: [viper.name, coin.name], correct: 1 }
    ]);
  }, [activeLesson]);

  function saveProgress(newXp: number, newCompleted: string[]) {
    setXp(newXp);
    setCompleted(newCompleted);
    localStorage.setItem("nature-detectives-xp", String(newXp));
    localStorage.setItem("nature-detectives-streak", String(streak));
    localStorage.setItem("nature-detectives-completed", JSON.stringify(newCompleted));
  }

  function openLesson(lesson: Lesson) {
    if (!lesson.available) return;
    if (lesson.kind === "album") {
      setScreen("album");
      return;
    }
    if (lesson.kind === "safety") {
      setScreen("safety");
      setQuestionIndex(0);
      setSelected(null);
      return;
    }
    setActiveLesson(lesson);
    setQuestionIndex(0);
    setSelected(null);
    setScreen("lesson");
  }

  function finishLesson(lessonId: string, earnedXp: number) {
    const alreadyDone = completed.includes(lessonId);
    const newCompleted = alreadyDone ? completed : [...completed, lessonId];
    const newXp = alreadyDone ? xp : xp + earnedXp;
    saveProgress(newXp, newCompleted);
    setScreen("journey");
    setActiveLesson(null);
    setQuestionIndex(0);
    setSelected(null);
  }

  function resetProgress() {
    localStorage.removeItem("nature-detectives-xp");
    localStorage.removeItem("nature-detectives-completed");
    setXp(0);
    setCompleted([]);
  }

  const comparison = comparisonQuestions[questionIndex];
  const safety = safetyQuestions[questionIndex];

  return (
    <main>
      <header className="topbar">
        <button className="brand" onClick={() => setScreen("home")}><span>🦎</span> בלשי הטבע</button>
        <div className="stats"><span title="רצף">🔥 {streak}</span><span title="נקודות ניסיון">⭐ {xp} XP</span></div>
      </header>

      {screen === "home" && (
        <section className="hero">
          <div className="hero-card">
            <div className="mascot" aria-hidden="true">🦎</div>
            <span className="eyebrow">המסע הראשון: נחשים בישראל</span>
            <h1>מסתכלים כמו בלשים.<br />שומרים מרחק כמו מקצוענים.</h1>
            <p>מסע משחקי לילדים בגילאי 6–12: לומדים לזהות, להשוות ולפעול נכון במפגש עם נחש.</p>
            <div className="actions">
              <button className="primary big" onClick={() => setScreen("journey")}>יוצאים למסע ←</button>
              <button onClick={() => setScreen("album")}>אלבום הנחשים</button>
            </div>
            <div className="profile-strip">
              <div><strong>{rank}</strong><span>הדרגה שלך</span></div>
              <div className="rank-progress"><span style={{ width: `${progress}%` }} /></div>
              <div><strong>{completed.length}/3</strong><span>משימות ראשונות</span></div>
            </div>
          </div>
          <div className="notice"><strong>כלל הזהב:</strong> מזהים רק ממרחק. לא נוגעים, לא מרימים ולא מתקרבים לצילום.</div>
        </section>
      )}

      {screen === "journey" && (
        <section className="content journey">
          <div className="section-heading">
            <div><span className="eyebrow">פרק 1</span><h1>הופכים לבלשי נחשים</h1><p>כל משימה קצרה מלמדת מיומנות אחת. מסיימים, צוברים XP ומתקדמים.</p></div>
            <button className="ghost" onClick={() => setScreen("home")}>חזרה לבית</button>
          </div>
          <div className="lesson-path">
            {lessons.map((lesson, index) => {
              const done = completed.includes(lesson.id);
              return (
                <div className={`lesson-row ${index % 2 ? "offset" : ""}`} key={lesson.id}>
                  <button className={`lesson-node ${done ? "done" : ""} ${!lesson.available ? "locked" : ""}`} onClick={() => openLesson(lesson)} disabled={!lesson.available}>
                    <span className="lesson-icon">{done ? "✓" : lesson.icon}</span>
                    <span><strong>{lesson.title}</strong><small>{lesson.subtitle}</small></span>
                    <b>{lesson.available ? `+${lesson.xp} XP` : "🔒"}</b>
                  </button>
                  {index < lessons.length - 1 && <div className="path-line" />}
                </div>
              );
            })}
          </div>
          {completed.length > 0 && <button className="text-button" onClick={resetProgress}>איפוס התקדמות במכשיר</button>}
        </section>
      )}

      {screen === "safety" && safety && (
        <section className="challenge">
          <div className="challenge-top"><button className="close" onClick={() => setScreen("journey")}>×</button><div className="progress"><span style={{ width: `${((questionIndex + 1) / safetyQuestions.length) * 100}%` }} /></div><span>🛡️</span></div>
          <div className="challenge-card">
            <span className="question-label">משימת בטיחות {questionIndex + 1}/{safetyQuestions.length}</span>
            <div className="scene-icon">🐍</div>
            <h1>{safety.scene}</h1>
            <div className="choice-list">
              {safety.choices.map((choice, index) => (
                <button key={choice} className={selected === null ? "" : index === safety.correct ? "correct" : index === selected ? "wrong" : "muted"} onClick={() => selected === null && setSelected(index)}>{choice}</button>
              ))}
            </div>
            {selected !== null && (
              <div className={`feedback ${selected === safety.correct ? "good" : "try"}`}>
                <strong>{selected === safety.correct ? "מעולה!" : "כמעט. לומדים וממשיכים."}</strong>
                <p>{safety.explanation}</p>
                <button className="primary" onClick={() => {
                  if (questionIndex === safetyQuestions.length - 1) finishLesson("safety", 40);
                  else { setQuestionIndex(questionIndex + 1); setSelected(null); }
                }}>{questionIndex === safetyQuestions.length - 1 ? "סיום המשימה" : "המשך"}</button>
              </div>
            )}
          </div>
        </section>
      )}

      {screen === "lesson" && activeLesson && comparison && (
        <section className="challenge">
          <div className="challenge-top"><button className="close" onClick={() => setScreen("journey")}>×</button><div className="progress"><span style={{ width: `${((questionIndex + 1) / comparisonQuestions.length) * 100}%` }} /></div><span>👀</span></div>
          <div className="challenge-card">
            <span className="question-label">צפע מול זעמן מטבעות · {questionIndex + 1}/{comparisonQuestions.length}</span>
            <div className="comparison-card">
              <div className="mini-snake"><b>{comparison.snake.name}</b><span>{comparison.snake.status}</span><p>{comparison.snake.clue}</p></div>
            </div>
            <h1>{comparison.prompt}</h1>
            <div className="choice-list two">
              {comparison.choices.map((choice, index) => (
                <button key={choice} className={selected === null ? "" : index === comparison.correct ? "correct" : index === selected ? "wrong" : "muted"} onClick={() => selected === null && setSelected(index)}>{choice}</button>
              ))}
            </div>
            {selected !== null && (
              <div className={`feedback ${selected === comparison.correct ? "good" : "try"}`}>
                <strong>{selected === comparison.correct ? "חדות של בלש!" : "לא נורא — עכשיו יודעים יותר."}</strong>
                <p>חשוב: אין לזהות נחש בשטח לפי סימן בודד, ותמיד שומרים מרחק.</p>
                <button className="primary" onClick={() => {
                  if (questionIndex === comparisonQuestions.length - 1) finishLesson(activeLesson.id, activeLesson.xp);
                  else { setQuestionIndex(questionIndex + 1); setSelected(null); }
                }}>{questionIndex === comparisonQuestions.length - 1 ? "קבלת XP" : "המשך"}</button>
              </div>
            )}
          </div>
        </section>
      )}

      {screen === "album" && (
        <section className="content">
          <div className="section-heading"><div><span className="eyebrow">האוסף שלך</span><h1>עשרת הנחשים הראשונים</h1><p>בגרסה הבאה יתווספו צילומים אמיתיים, מאומתים ובעלי רישיון שימוש.</p></div><button className="ghost" onClick={() => setScreen("home")}>חזרה לבית</button></div>
          <div className="grid">
            {species.map((snake, index) => (
              <article className="snake-card" key={snake.id}>
                <div className="image-wrap">
                  {!imageErrors[snake.id] ? <img src={snake.image} alt={snake.name} onError={() => setImageErrors(e => ({ ...e, [snake.id]: true }))} /> : <div className="image-placeholder"><span>#{index + 1}</span>צילום מאומת<br />יוכנס כאן</div>}
                </div>
                <div className="card-body">
                  <div className="title-row"><div><h2>{snake.name}</h2><small>{snake.scientificName}</small></div><span className={`tag ${snake.status === "ארסי" ? "danger" : snake.status === "תת־ארסי" ? "warning" : "safe"}`}>{snake.status}</span></div>
                  <p><strong>בית גידול:</strong> {snake.habitat}</p>
                  <p><strong>תפוצה:</strong> {snake.region}</p>
                  <p className="clue">🔎 {snake.clue}</p>
                </div>
              </article>
            ))}
          </div>
        </section>
      )}
    </main>
  );
}
