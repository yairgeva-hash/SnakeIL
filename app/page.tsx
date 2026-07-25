"use client";

import { useEffect, useMemo, useState } from "react";
import { lessons, safetyQuestions, species, type Lesson, type Species } from "./data";

type Screen = "home" | "journey" | "lesson" | "album" | "safety";
type IdentifyQuestion = {
  type: "clue" | "compare" | "reason";
  snake: Species;
  prompt: string;
  choices: string[];
  correct: number;
  explanation: string;
};

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
  const progress = Math.min(100, xp % 100);

  const comparisonQuestions = useMemo<IdentifyQuestion[]>(() => {
    const viper = species.find((item) => item.id === "palestine-viper")!;
    const coin = species.find((item) => item.id === "coin-marked-snake")!;
    return shuffled([
      { type: "clue", snake: viper, prompt: "איזה מין מתאים לרמזים האלה?", choices: [viper.name, coin.name], correct: 0, explanation: "לצפע בדרך כלל גוף מוצק ועבה יותר ודגם גב בולט. עדיין לא מזהים לפי סימן יחיד." },
      { type: "clue", snake: coin, prompt: "איזה מין מתאים לרמזים האלה?", choices: [viper.name, coin.name], correct: 1, explanation: "לזעמן מטבעות גוף דק וארוך יותר בדרך כלל וכתמים המזכירים מטבעות." },
      { type: "compare", snake: viper, prompt: "למי בדרך כלל גוף עבה ומוצק יותר?", choices: [viper.name, coin.name], correct: 0, explanation: "מבנה הגוף הוא רמז שימושי, אך חייבים לצרף אליו רמזים נוספים." },
      { type: "compare", snake: coin, prompt: "למי בדרך כלל גוף דק וארוך יותר?", choices: [viper.name, coin.name], correct: 1, explanation: "הזעמן נראה לרוב מוארך ועדין יותר מהצפע." },
      { type: "reason", snake: coin, prompt: "איזה רמז תומך יותר בזיהוי זעמן מטבעות?", choices: ["כתמים דמויי מטבעות", "גוף עבה מאוד", "עצם הימצאותו ליד בית"], correct: 0, explanation: "מקום המפגש לבדו אינו מספיק. דגם הגוף ומבנהו מספקים רמזים טובים יותר." },
      { type: "reason", snake: viper, prompt: "מהו הכלל החשוב ביותר גם כשנדמה שזיהינו?", choices: ["מתקרבים לבדוק את הראש", "שומרים מרחק ולא נוגעים", "מרימים בעזרת מקל"], correct: 1, explanation: "המטרה היא ללמוד להתבונן — לא להסתכן. זיהוי באפליקציה אינו אישור להתקרב בשטח." }
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
    if (lesson.kind === "album") return setScreen("album");
    if (lesson.kind === "safety") {
      setQuestionIndex(0);
      setSelected(null);
      return setScreen("safety");
    }
    setActiveLesson(lesson);
    setQuestionIndex(0);
    setSelected(null);
    setScreen("lesson");
  }

  function finishLesson(lessonId: string, earnedXp: number) {
    const alreadyDone = completed.includes(lessonId);
    const nextCompleted = alreadyDone ? completed : [...completed, lessonId];
    saveProgress(alreadyDone ? xp : xp + earnedXp, nextCompleted);
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
            <p>מסע משחקי לילדים בגילאי 6–12: לומדים לזהות מאפיינים, להשוות בין מינים ולפעול נכון במפגש עם נחש.</p>
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
          <button className="text-button" onClick={resetProgress}>איפוס התקדמות במכשיר</button>
        </section>
      )}

      {screen === "safety" && safety && (
        <section className="challenge">
          <div className="challenge-top"><button className="close" onClick={() => setScreen("journey")}>×</button><div className="progress"><span style={{ width: `${((questionIndex + 1) / safetyQuestions.length) * 100}%` }} /></div><b>🛡️</b></div>
          <div className="challenge-card">
            <span className="question-label">משימת בטיחות {questionIndex + 1}/{safetyQuestions.length}</span>
            <div className="scene-icon">🐍</div>
            <h1>{safety.scene}</h1>
            <div className="choice-list">
              {safety.choices.map((choice, index) => <button key={choice} className={selected === null ? "" : index === safety.correct ? "correct" : index === selected ? "wrong" : "muted"} onClick={() => selected === null && setSelected(index)}>{choice}</button>)}
            </div>
            {selected !== null && <div className={`feedback ${selected === safety.correct ? "good" : "try"}`}><strong>{selected === safety.correct ? "בחירה מצוינת!" : "עוצרים ולומדים מהטעות."}</strong><p>{safety.explanation}</p><button className="primary" onClick={() => { if (questionIndex === safetyQuestions.length - 1) finishLesson("safety", 40); else { setQuestionIndex(questionIndex + 1); setSelected(null); } }}>{questionIndex === safetyQuestions.length - 1 ? "סיום וקבלת XP" : "המשך"}</button></div>}
          </div>
        </section>
      )}

      {screen === "lesson" && activeLesson && comparison && (
        <section className="challenge">
          <div className="challenge-top"><button className="close" onClick={() => setScreen("journey")}>×</button><div className="progress"><span style={{ width: `${((questionIndex + 1) / comparisonQuestions.length) * 100}%` }} /></div><b>👀</b></div>
          <div className="challenge-card">
            <span className="question-label">צפע מול זעמן · {questionIndex + 1}/{comparisonQuestions.length}</span>
            <div className="comparison-card">
              <div className="mini-snake"><b>{comparison.snake.name}</b><span>{comparison.snake.status}</span><ul>{comparison.snake.identificationClues.map((clue) => <li key={clue}>{clue}</li>)}</ul></div>
            </div>
            <h1>{comparison.prompt}</h1>
            <div className={`choice-list ${comparison.choices.length === 2 ? "two" : ""}`}>
              {comparison.choices.map((choice, index) => <button key={choice} className={selected === null ? "" : index === comparison.correct ? "correct" : index === selected ? "wrong" : "muted"} onClick={() => selected === null && setSelected(index)}>{choice}</button>)}
            </div>
            {selected !== null && <div className={`feedback ${selected === comparison.correct ? "good" : "try"}`}><strong>{selected === comparison.correct ? "חדות של בלש!" : "לא נורא — עכשיו יודעים יותר."}</strong><p>{comparison.explanation}</p><button className="primary" onClick={() => { if (questionIndex === comparisonQuestions.length - 1) finishLesson(activeLesson.id, activeLesson.xp); else { setQuestionIndex(questionIndex + 1); setSelected(null); } }}>{questionIndex === comparisonQuestions.length - 1 ? "סיום וקבלת XP" : "המשך"}</button></div>}
          </div>
        </section>
      )}

      {screen === "album" && (
        <section className="content">
          <div className="section-heading"><div><span className="eyebrow">האוסף שלך</span><h1>עשרת הנחשים הראשונים</h1><p>מבנה התמונות והקרדיטים כבר מוכן. צילום יוצג רק לאחר שסומן כמאומת ובעל רישיון שימוש.</p></div><button className="ghost" onClick={() => setScreen("home")}>חזרה לבית</button></div>
          <div className="grid">
            {species.map((snake, index) => {
              const image = snake.media.find((asset) => asset.approved);
              return (
                <article className="snake-card" key={snake.id}>
                  <div className="image-wrap">
                    {image && !imageErrors[snake.id] ? <img src={image.src} alt={image.alt} onError={() => setImageErrors((state) => ({ ...state, [snake.id]: true }))} /> : <div className="image-placeholder"><span>#{index + 1}</span>צילום אמיתי ומאומת<br />יוכנס כאן</div>}
                  </div>
                  <div className="card-body">
                    <div className="title-row"><div><h2>{snake.name}</h2><small>{snake.scientificName}</small></div><span className={`tag ${snake.status === "ארסי" ? "danger" : snake.status === "תת־ארסי" ? "warning" : "safe"}`}>{snake.status}</span></div>
                    <p><strong>אזור:</strong> {snake.region}</p><p><strong>בית גידול:</strong> {snake.habitat}</p>
                    <div className="clue"><strong>על מה מסתכלים?</strong><ul>{snake.identificationClues.map((clue) => <li key={clue}>{clue}</li>)}</ul></div>
                    <p className="safety-note">🛡️ {snake.safetyNote}</p>
                  </div>
                </article>
              );
            })}
          </div>
        </section>
      )}
    </main>
  );
}
