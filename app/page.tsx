"use client";

import { useEffect, useMemo, useState } from "react";
import { lessons, safetyQuestions, species, type Lesson, type Species } from "./data";

type Screen = "intro" | "home" | "journey" | "lesson" | "album" | "safety" | "journal";
type IdentifyQuestion = {
  type: "clue" | "compare" | "reason";
  snake: Species;
  prompt: string;
  choices: string[];
  correct: number;
  explanation: string;
};

type Reward = { id: number; label: string };

const MAX_HEARTS = 5;
const SUCCESS_LINES = [
  "עבודה של בלש אמיתי!",
  "תפסת את הפרט החשוב!",
  "זיהוי מצוין!",
  "עוד רמז נכנס ליומן השדה.",
  "חדות עין מרשימה!"
];

function shuffled<T>(items: T[]): T[] {
  return [...items].sort(() => Math.random() - 0.5);
}

export default function Home() {
  const [screen, setScreen] = useState<Screen>("intro");
  const [activeLesson, setActiveLesson] = useState<Lesson | null>(null);
  const [xp, setXp] = useState(0);
  const [streak, setStreak] = useState(1);
  const [hearts, setHearts] = useState(MAX_HEARTS);
  const [completed, setCompleted] = useState<string[]>([]);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({});
  const [rewards, setRewards] = useState<Reward[]>([]);
  const [feedbackLine, setFeedbackLine] = useState(SUCCESS_LINES[0]);

  useEffect(() => {
    setXp(Number(localStorage.getItem("nature-detectives-xp") || 0));
    setStreak(Number(localStorage.getItem("nature-detectives-streak") || 1));
    setHearts(Number(localStorage.getItem("nature-detectives-hearts") || MAX_HEARTS));
    setCompleted(JSON.parse(localStorage.getItem("nature-detectives-completed") || "[]"));
  }, []);

  const rank = xp < 100 ? "מטייל מתחיל" : xp < 250 ? "בלש צעיר" : xp < 500 ? "חוקר שטח" : "גשש נחשים";
  const rankIcon = xp < 100 ? "🥾" : xp < 250 ? "🔎" : xp < 500 ? "🌿" : "🐍";
  const rankProgress = Math.min(100, xp % 100);
  const unlockedSpecies = Math.min(species.length, Math.max(1, completed.length * 2));

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

  function persist(nextXp = xp, nextCompleted = completed, nextHearts = hearts) {
    setXp(nextXp);
    setCompleted(nextCompleted);
    setHearts(nextHearts);
    localStorage.setItem("nature-detectives-xp", String(nextXp));
    localStorage.setItem("nature-detectives-streak", String(streak));
    localStorage.setItem("nature-detectives-completed", JSON.stringify(nextCompleted));
    localStorage.setItem("nature-detectives-hearts", String(nextHearts));
  }

  function launchReward(label: string) {
    const reward = { id: Date.now(), label };
    setRewards((items) => [...items, reward]);
    window.setTimeout(() => setRewards((items) => items.filter((item) => item.id !== reward.id)), 1100);
  }

  function openLesson(lesson: Lesson) {
    if (!lesson.available) return;
    setCorrectAnswers(0);
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

  function chooseAnswer(index: number, correct: number) {
    if (selected !== null) return;
    setSelected(index);
    if (index === correct) {
      setCorrectAnswers((value) => value + 1);
      setFeedbackLine(SUCCESS_LINES[Math.floor(Math.random() * SUCCESS_LINES.length)]);
      launchReward("+10 XP");
    } else {
      const nextHearts = Math.max(0, hearts - 1);
      persist(xp, completed, nextHearts);
    }
  }

  function finishLesson(lessonId: string, earnedXp: number) {
    const alreadyDone = completed.includes(lessonId);
    const nextCompleted = alreadyDone ? completed : [...completed, lessonId];
    const bonus = Math.round((correctAnswers / Math.max(1, questionIndex + 1)) * 20);
    persist(alreadyDone ? xp : xp + earnedXp + bonus, nextCompleted, Math.min(MAX_HEARTS, hearts + 1));
    launchReward(`+${alreadyDone ? bonus : earnedXp + bonus} XP`);
    setScreen("journey");
    setActiveLesson(null);
    setQuestionIndex(0);
    setSelected(null);
  }

  function resetProgress() {
    localStorage.removeItem("nature-detectives-xp");
    localStorage.removeItem("nature-detectives-completed");
    localStorage.removeItem("nature-detectives-hearts");
    setXp(0);
    setHearts(MAX_HEARTS);
    setCompleted([]);
  }

  const comparison = comparisonQuestions[questionIndex];
  const safety = safetyQuestions[questionIndex];

  return (
    <main className="app-shell">
      <div className="paper-noise" aria-hidden="true" />
      {screen !== "intro" && (
        <header className="topbar">
          <button className="brand" onClick={() => setScreen("home")}>
            <span className="brand-mark">🌿</span>
            <span><strong>בלשי הטבע</strong><small>נחשים בישראל</small></span>
          </button>
          <div className="stats" aria-label="מצב שחקן">
            <span className="heart-stat" title="לבבות">{Array.from({ length: MAX_HEARTS }).map((_, index) => <i key={index} className={index < hearts ? "full" : "empty"}>♥</i>)}</span>
            <span title="נקודות ניסיון">⭐ {xp}</span>
            <span title="רצף">🔥 {streak}</span>
          </div>
        </header>
      )}

      <div className="reward-layer" aria-live="polite">
        {rewards.map((reward) => <div key={reward.id} className="floating-reward"><span>🍃</span>{reward.label}</div>)}
      </div>

      {screen === "intro" && (
        <section className="opening-screen" aria-labelledby="opening-title">
          <div className="opening-sun" aria-hidden="true" />
          <div className="opening-landscape" aria-hidden="true">
            <span className="hill hill-one" />
            <span className="hill hill-two" />
            <span className="reed reed-one">🌿</span>
            <span className="reed reed-two">🌾</span>
            <span className="snake-trail">〰</span>
          </div>
          <div className="opening-card">
            <span className="opening-kicker">מחברת השדה שלך נפתחה</span>
            <div className="opening-emblem" aria-hidden="true"><span>🔎</span><i>🐍</i></div>
            <h1 id="opening-title">בלשי הטבע</h1>
            <h2>לומדים לזהות את נחשי ישראל</h2>
            <p>מתבוננים. מזהים. שומרים מרחק.</p>
            <button className="primary opening-button" onClick={() => setScreen("home")}>צאו למשלחת הראשונה <span>←</span></button>
            <small>משחק זיהוי קצר, בטוח ומבוסס תמונות אמיתיות</small>
          </div>
        </section>
      )}

      {screen === "home" && (
        <section className="hero notebook-page">
          <div className="field-stamp">מחברת שדה · מסע 01</div>
          <div className="hero-grid">
            <div className="hero-copy">
              <span className="eyebrow">דיווח חדש התקבל</span>
              <h1>יוצאים לזהות את נחשי ישראל</h1>
              <p>מתבוננים בפרטים, משווים בין מינים ולומדים כיצד לפעול בבטחה — בלי להתקרב ובלי לגעת.</p>
              <div className="actions">
                <button className="primary big" onClick={() => setScreen("journey")}>🧭 צא למשלחת</button>
                <button onClick={() => setScreen("journal")}>📖 יומן השדה</button>
              </div>
            </div>
            <div className="hero-badge" aria-hidden="true">
              <span className="magnifier">🔎</span>
              <strong>{rank}</strong>
              <small>{rankIcon} דרגת השטח שלך</small>
            </div>
          </div>

          <div className="profile-strip">
            <div><span className="metric-label">XP שנאסף</span><strong>{xp}</strong></div>
            <div className="rank-progress" aria-label="התקדמות לדרגה הבאה"><span style={{ width: `${rankProgress}%` }} /></div>
            <div><span className="metric-label">מינים ביומן</span><strong>{unlockedSpecies}/{species.length}</strong></div>
          </div>

          <div className="quick-grid">
            <button className="field-card" onClick={() => setScreen("journey")}><span>🧭</span><strong>משלחות</strong><small>משימות קצרות של 4–6 דקות</small></button>
            <button className="field-card" onClick={() => setScreen("album")}><span>🃏</span><strong>אוסף המינים</strong><small>עשרת הנחשים הראשונים</small></button>
            <button className="field-card" onClick={() => setScreen("journal")}><span>📖</span><strong>יומן השדה</strong><small>הישגים, רמזים ותגליות</small></button>
          </div>

          <div className="notice"><strong>כלל הזהב:</strong> מזהים רק ממרחק. לא נוגעים, לא מרימים ולא מתקרבים לצילום.</div>
        </section>
      )}

      {screen === "journey" && (
        <section className="content notebook-page journey">
          <div className="section-heading">
            <div><span className="eyebrow">משלחת הכרמל · פרק 1</span><h1>הופכים לבלשי נחשים</h1><p>כל תחנה מלמדת מיומנות אחת וממלאת עוד עמוד ביומן השדה.</p></div>
            <button className="ghost" onClick={() => setScreen("home")}>חזרה למחנה</button>
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
        <section className="challenge notebook-page">
          <ChallengeHeader onClose={() => setScreen("journey")} progress={((questionIndex + 1) / safetyQuestions.length) * 100} icon="🛡️" />
          <div className="challenge-card">
            <span className="question-label">משימת בטיחות {questionIndex + 1}/{safetyQuestions.length}</span>
            <div className="scene-panel"><span>דיווח שטח</span><strong>🐍</strong><small>עוצרים ומתבוננים מרחוק</small></div>
            <h1>{safety.scene}</h1>
            <div className="choice-list">
              {safety.choices.map((choice, index) => <button key={choice} className={answerClass(selected, index, safety.correct)} onClick={() => chooseAnswer(index, safety.correct)}>{choice}</button>)}
            </div>
            {selected !== null && <Feedback isCorrect={selected === safety.correct} line={feedbackLine} explanation={safety.explanation} onNext={() => { if (questionIndex === safetyQuestions.length - 1) finishLesson("safety", 40); else { setQuestionIndex(questionIndex + 1); setSelected(null); } }} isLast={questionIndex === safetyQuestions.length - 1} />}
          </div>
        </section>
      )}

      {screen === "lesson" && activeLesson && comparison && (
        <section className="challenge notebook-page">
          <ChallengeHeader onClose={() => setScreen("journey")} progress={((questionIndex + 1) / comparisonQuestions.length) * 100} icon="👀" />
          <div className="challenge-card">
            <span className="question-label">צפע מול זעמן · {questionIndex + 1}/{comparisonQuestions.length}</span>
            <div className="comparison-card">
              <div className="specimen-label"><span>דוגמה 0{questionIndex + 1}</span><b>{comparison.snake.name}</b></div>
              <ul>{comparison.snake.identificationClues.map((clue) => <li key={clue}>{clue}</li>)}</ul>
              <small>{comparison.snake.status} · {comparison.snake.habitat}</small>
            </div>
            <h1>{comparison.prompt}</h1>
            <div className={`choice-list ${comparison.choices.length === 2 ? "two" : ""}`}>
              {comparison.choices.map((choice, index) => <button key={choice} className={answerClass(selected, index, comparison.correct)} onClick={() => chooseAnswer(index, comparison.correct)}>{choice}</button>)}
            </div>
            {selected !== null && <Feedback isCorrect={selected === comparison.correct} line={feedbackLine} explanation={comparison.explanation} onNext={() => { if (questionIndex === comparisonQuestions.length - 1) finishLesson(activeLesson.id, activeLesson.xp); else { setQuestionIndex(questionIndex + 1); setSelected(null); } }} isLast={questionIndex === comparisonQuestions.length - 1} />}
          </div>
        </section>
      )}

      {screen === "journal" && (
        <section className="content notebook-page">
          <div className="section-heading"><div><span className="eyebrow">היומן האישי שלך</span><h1>יומן השדה</h1><p>כאן נשמרים הרמזים, ההישגים והמינים שכבר פגשת.</p></div><button className="ghost" onClick={() => setScreen("home")}>חזרה למחנה</button></div>
          <div className="journal-grid">
            <article className="journal-card"><span>דרגה נוכחית</span><strong>{rankIcon} {rank}</strong><p>עוד {100 - rankProgress} XP עד להתקדמות הבאה.</p></article>
            <article className="journal-card"><span>זיהויים שהושלמו</span><strong>{completed.length}</strong><p>כל משימה מוסיפה רמזים חדשים למחברת.</p></article>
            <article className="journal-card"><span>לבבות זמינים</span><strong>{"♥".repeat(hearts)}{"♡".repeat(MAX_HEARTS - hearts)}</strong><p>לב אחד מתחדש בסיום משימה.</p></article>
          </div>
          <div className="journal-list">
            {species.map((item, index) => {
              const unlocked = index < unlockedSpecies;
              return <article key={item.id} className={`journal-entry ${unlocked ? "" : "locked"}`}><div className="page-number">{String(index + 1).padStart(2, "0")}</div><div><span className="handwritten">{unlocked ? "זוהה ביומן" : "טרם נצפה"}</span><h2>{unlocked ? item.name : "מין מסתורי"}</h2><p>{unlocked ? item.identificationClues[0] : "השלימו עוד משלחות כדי לפתוח את העמוד."}</p></div><b>{unlocked ? "✓" : "?"}</b></article>;
            })}
          </div>
        </section>
      )}

      {screen === "album" && (
        <section className="content notebook-page">
          <div className="section-heading"><div><span className="eyebrow">אוסף המינים</span><h1>עשרת הנחשים הראשונים</h1><p>התמונות האמיתיות ייכנסו לכאן לאחר אימות המין, הצלם והרישיון.</p></div><button className="ghost" onClick={() => setScreen("home")}>חזרה למחנה</button></div>
          <div className="grid">
            {species.map((item, index) => {
              const approved = item.media.find((media) => media.approved);
              const visibleImage = approved && !imageErrors[item.id];
              return <article className="snake-card" key={item.id}>
                <div className="image-wrap">{visibleImage ? <img src={approved.src} alt={approved.alt} onError={() => setImageErrors((value) => ({ ...value, [item.id]: true }))} /> : <div className="image-placeholder"><span>{index < unlockedSpecies ? "📷" : "🔒"}</span><strong>{index < unlockedSpecies ? "תמונה מאומתת תתווסף כאן" : "הקלף עדיין נעול"}</strong></div>}</div>
                <div className="card-body"><div className="title-row"><div><h2>{index < unlockedSpecies ? item.name : "מין מסתורי"}</h2><small>{index < unlockedSpecies ? item.scientificName : "Complete a mission"}</small></div><span className={`tag ${riskClass(item.status)}`}>{index < unlockedSpecies ? item.status : "נעול"}</span></div>{index < unlockedSpecies && <><p>{item.region}</p><div className="clue"><strong>רמזי זיהוי</strong><ul>{item.identificationClues.slice(0, 2).map((clue) => <li key={clue}>{clue}</li>)}</ul></div><p className="safety-note">🛡️ {item.safetyNote}</p></>}</div>
              </article>;
            })}
          </div>
        </section>
      )}
    </main>
  );
}

function ChallengeHeader({ onClose, progress, icon }: { onClose: () => void; progress: number; icon: string }) {
  return <div className="challenge-top"><button className="close" onClick={onClose} aria-label="יציאה מהמשימה">×</button><div className="progress"><span style={{ width: `${progress}%` }} /></div><b>{icon}</b></div>;
}

function Feedback({ isCorrect, line, explanation, onNext, isLast }: { isCorrect: boolean; line: string; explanation: string; onNext: () => void; isLast: boolean }) {
  return <div className={`feedback ${isCorrect ? "good" : "try"}`}><div className="feedback-title"><span>{isCorrect ? "🍃" : "🔎"}</span><strong>{isCorrect ? line : "עוד רמז אחד — ותזהה בפעם הבאה."}</strong></div><p>{explanation}</p><button className="primary" onClick={onNext}>{isLast ? "סיום המשלחת" : "להמשיך לרמז הבא"}</button></div>;
}

function answerClass(selected: number | null, index: number, correct: number) {
  if (selected === null) return "";
  if (index === correct) return "correct";
  if (index === selected) return "wrong";
  return "muted";
}

function riskClass(status: Species["status"]) {
  if (status === "ארסי") return "danger";
  if (status === "תת־ארסי") return "warning";
  return "safe";
}
