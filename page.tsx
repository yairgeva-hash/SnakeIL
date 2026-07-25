"use client";

import { useEffect, useMemo, useState } from "react";

type Snake = {
  id: string;
  name: string;
  status: "ארסי" | "תת־ארסי" | "לא ארסי";
  region: string;
  clue: string;
  image: string;
};

const snakes: Snake[] = [
  { id: "palestine-viper", name: "צפע מצוי", status: "ארסי", region: "צפון הארץ, המרכז ועד צפון הנגב", clue: "גוף עבה ודגם גב בולט; אין להסתמך על סימן יחיד לזיהוי.", image: "/snakes/palestine-viper.jpg" },
  { id: "coin-marked-snake", name: "זעמן מטבעות", status: "לא ארסי", region: "צפון הארץ ומרכזה", clue: "כתמים דמויי מטבעות וגוף דק יחסית; עלול להידמות לצפע.", image: "/snakes/coin-marked-snake.jpg" },
  { id: "black-whipsnake", name: "זעמן שחור", status: "לא ארסי", region: "צפון הארץ ומרכזה", clue: "הבוגרים שחורים וארוכים מאוד; הצעירים נראים שונים.", image: "/snakes/black-whipsnake.jpg" },
  { id: "olive-whipsnake", name: "זעמן זיתני", status: "לא ארסי", region: "החבל הים־תיכוני", clue: "נחש דק ומהיר, בגוון זית עד חום.", image: "/snakes/olive-whipsnake.jpg" },
  { id: "dice-snake", name: "נחש מים משובץ", status: "לא ארסי", region: "ליד נחלים, בריכות ומקווי מים", clue: "דגם משובץ וקשר חזק לבתי גידול מימיים.", image: "/snakes/dice-snake.jpg" },
  { id: "large-whip-snake", name: "תלום־קשקשים מצוי", status: "תת־ארסי", region: "מרבית אזורי הארץ שאינם מדבר קיצוני", clue: "נחש גדול ומהיר; הארס מותאם בעיקר לטרף ואינו מוזרק בקלות לאדם.", image: "/snakes/large-whip-snake.jpg" },
  { id: "saw-scaled-viper", name: "אפעה מגוון", status: "ארסי", region: "בקעת הירדן, מדבר יהודה, הנגב והערבה", clue: "דגם צבעוני־מדברי וקשקשים היוצרים קול חיכוך בעת איום.", image: "/snakes/saw-scaled-viper.jpg" },
  { id: "desert-horned-viper", name: "עכן גדול", status: "ארסי", region: "חולות הנגב והערבה", clue: "מותאם לחול, גוף מוצק ולעיתים קרניים מעל העיניים.", image: "/snakes/desert-horned-viper.jpg" },
  { id: "black-desert-cobra", name: "פתן שחור", status: "ארסי", region: "הנגב, מדבר יהודה והערבה", clue: "שחור מבריק ובעל ארס עצבי; לרוב נמנע ממפגש.", image: "/snakes/black-desert-cobra.jpg" },
  { id: "engedi-burrowing-asp", name: "שרף עין גדי", status: "ארסי", region: "מדבר יהודה, בקעת ים המלח והערבה", clue: "קטן, כהה וחופר; מבנה הניבים מאפשר הכשה גם מצדי הראש.", image: "/snakes/engedi-burrowing-asp.jpg" }
];

function shuffled<T>(items: T[]): T[] {
  return [...items].sort(() => Math.random() - 0.5);
}

export default function Home() {
  const [screen, setScreen] = useState<"home" | "album" | "quiz" | "safety">("home");
  const [questionIndex, setQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [answered, setAnswered] = useState<string | null>(null);
  const [best, setBest] = useState(0);
  const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({});
  const questions = useMemo(() => shuffled(snakes).slice(0, 10), [screen]);
  const current = questions[questionIndex];
  const answers = useMemo(() => current ? shuffled([current, ...shuffled(snakes.filter(s => s.id !== current.id)).slice(0, 3)]) : [], [current]);

  useEffect(() => {
    const saved = Number(localStorage.getItem("snake-rangers-best") || 0);
    setBest(saved);
  }, []);

  function startQuiz() {
    setQuestionIndex(0);
    setScore(0);
    setAnswered(null);
    setScreen("quiz");
  }

  function answer(id: string) {
    if (answered) return;
    setAnswered(id);
    if (id === current.id) setScore(s => s + 1);
  }

  function next() {
    if (questionIndex === questions.length - 1) {
      const finalScore = score + (answered === current.id ? 0 : 0);
      const newBest = Math.max(best, finalScore);
      setBest(newBest);
      localStorage.setItem("snake-rangers-best", String(newBest));
      setScreen("home");
      return;
    }
    setQuestionIndex(i => i + 1);
    setAnswered(null);
  }

  return (
    <main>
      <header className="topbar">
        <button className="brand" onClick={() => setScreen("home")}>🐍 בלשי הנחשים</button>
        <span>שיא אישי: {best}/10</span>
      </header>

      {screen === "home" && (
        <section className="hero">
          <div className="hero-card">
            <span className="eyebrow">משחק טבע ישראלי</span>
            <h1>לומדים לזהות נחשים — בלי להתקרב אליהם</h1>
            <p>עשרה מינים חשובים, משחקי זיהוי וכללי בטיחות ברורים לילדים בגילאי 6–12.</p>
            <div className="actions">
              <button className="primary" onClick={startQuiz}>התחילו במשחק</button>
              <button onClick={() => setScreen("album")}>אלבום הנחשים</button>
              <button onClick={() => setScreen("safety")}>כללי בטיחות</button>
            </div>
          </div>
          <div className="notice"><strong>חשוב:</strong> האפליקציה מלמדת היכרות בלבד. לעולם לא נוגעים בנחש ולא מתקרבים כדי לזהות אותו.</div>
        </section>
      )}

      {screen === "album" && (
        <section className="content">
          <h1>אלבום הנחשים</h1>
          <p className="subtitle">התמונות יוכנסו רק לאחר אימות המין וקבלת רישיון שימוש.</p>
          <div className="grid">
            {snakes.map(snake => (
              <article className="snake-card" key={snake.id}>
                <div className="image-wrap">
                  {!imageErrors[snake.id] ? <img src={snake.image} alt={snake.name} onError={() => setImageErrors(e => ({...e, [snake.id]: true}))} /> : <div className="image-placeholder">צילום מאומת<br/>יוכנס כאן</div>}
                </div>
                <div className="card-body">
                  <div className="title-row"><h2>{snake.name}</h2><span className={`tag ${snake.status === "ארסי" ? "danger" : snake.status === "תת־ארסי" ? "warning" : "safe"}`}>{snake.status}</span></div>
                  <p><strong>תפוצה:</strong> {snake.region}</p>
                  <p>{snake.clue}</p>
                </div>
              </article>
            ))}
          </div>
        </section>
      )}

      {screen === "safety" && (
        <section className="content narrow">
          <h1>רואים נחש? עוצרים ומתרחקים</h1>
          <div className="safety-list">
            <div><b>1</b><span>לא נוגעים, לא מרימים ולא מנסים ללכוד.</span></div>
            <div><b>2</b><span>מתרחקים לאט ושומרים מרחק גדול.</span></div>
            <div><b>3</b><span>קוראים מיד למבוגר.</span></div>
            <div><b>4</b><span>המבוגר מזמין לוכד נחשים מורשה במקרה הצורך.</span></div>
          </div>
          <button className="primary" onClick={() => setScreen("home")}>חזרה למסך הבית</button>
        </section>
      )}

      {screen === "quiz" && current && (
        <section className="quiz">
          <div className="progress"><span style={{width: `${((questionIndex + 1) / questions.length) * 100}%`}} /></div>
          <p>שאלה {questionIndex + 1} מתוך {questions.length} · ניקוד: {score}</p>
          <div className="quiz-card">
            <div className="image-wrap quiz-image">
              {!imageErrors[current.id] ? <img src={current.image} alt="איזה נחש מופיע בתמונה?" onError={() => setImageErrors(e => ({...e, [current.id]: true}))} /> : <div className="image-placeholder">כאן תופיע תמונת נחש אמיתית ומאומתת</div>}
            </div>
            <h1>איזה נחש זה?</h1>
            <div className="answer-grid">
              {answers.map(option => {
                const state = answered ? option.id === current.id ? "correct" : option.id === answered ? "wrong" : "muted" : "";
                return <button key={option.id} className={state} onClick={() => answer(option.id)}>{option.name}</button>;
              })}
            </div>
            {answered && <div className="feedback"><strong>{answered === current.id ? "מצוין!" : `התשובה היא ${current.name}.`}</strong><p>{current.clue}</p><button className="primary" onClick={next}>{questionIndex === questions.length - 1 ? "סיום" : "לשאלה הבאה"}</button></div>}
          </div>
        </section>
      )}
    </main>
  );
}
