"use client";

import { useEffect, useMemo, useState } from "react";
import { lessons, safetyQuestions, species, type Lesson, type MediaAsset, type Species } from "./data";

type Screen = "intro" | "home" | "journey" | "lesson" | "album" | "safety" | "journal";
type IdentifyQuestion = {
  type: "clue" | "compare" | "reason";
  observationPrompt: string;
  observationChoices: string[];
  bestObservation: number;
  observationFeedback: string;
  snake: Species;
  prompt: string;
  choices: string[];
  correct: number;
  explanation: string;
  photo: MediaAsset;
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
  const [discovered, setDiscovered] = useState<string[]>(["palestine-viper"]);
  const [pendingReveal, setPendingReveal] = useState<Species | null>(null);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({});
  const [rewards, setRewards] = useState<Reward[]>([]);
  const [feedbackLine, setFeedbackLine] = useState(SUCCESS_LINES[0]);
  const [detectivePhase, setDetectivePhase] = useState<"observe" | "identify" | "confidence">("observe");
  const [observationSelected, setObservationSelected] = useState<number | null>(null);
  const [confidence, setConfidence] = useState<"sure" | "maybe" | "guess" | null>(null);

  useEffect(() => {
    setXp(Number(localStorage.getItem("nature-detectives-xp") || 0));
    setStreak(Number(localStorage.getItem("nature-detectives-streak") || 1));
    setHearts(Number(localStorage.getItem("nature-detectives-hearts") || MAX_HEARTS));
    const storedCompleted = JSON.parse(localStorage.getItem("nature-detectives-completed") || "[]");
    setCompleted(storedCompleted);
    const storedDiscovered = JSON.parse(localStorage.getItem("nature-detectives-discovered") || "null");
    setDiscovered(storedDiscovered || ["palestine-viper", ...storedCompleted.flatMap((id: string) => id === "safety" ? ["coin-marked-snake"] : id === "viper-vs-coin" ? ["black-whipsnake"] : [])]);
  }, []);

  const rank = xp < 100 ? "מטייל מתחיל" : xp < 250 ? "בלש צעיר" : xp < 500 ? "חוקר שטח" : "גשש נחשים";
  const rankIcon = xp < 100 ? "🥾" : xp < 250 ? "🔎" : xp < 500 ? "🌿" : "🐍";
  const rankProgress = Math.min(100, xp % 100);
  const unlockedSpecies = discovered.length;
  const nextDiscovery = species.find((item) => !discovered.includes(item.id));

  const comparisonQuestions = useMemo<IdentifyQuestion[]>(() => {
    const viper = species.find((item) => item.id === "palestine-viper")!;
    const coin = species.find((item) => item.id === "coin-marked-snake")!;
    return shuffled([
      { type: "clue", snake: viper, photo: viper.media[1], observationPrompt: "מה כדאי לבדוק קודם בצילום?", observationChoices: ["רק את הצבע", "דוגמת הגב ומבנה הגוף", "את הרקע שמאחוריו"], bestObservation: 1, observationFeedback: "בלש טוב מחפש שילוב של סימנים. צבע לבדו עלול להשתנות ולהטעות.", prompt: "אחרי שבדקנו את הרמזים — איזה מין מצולם כאן?", choices: [viper.name, coin.name], correct: 0, explanation: "הגוף המוצק ודגם הגב הבולט תומכים בזיהוי צפע. עדיין לא מזהים נחש לפי סימן יחיד." },
      { type: "clue", snake: coin, photo: coin.media[0], observationPrompt: "איזה פרט שווה לחפש?", observationChoices: ["כתמים נפרדים לאורך הגב", "רק את גודל התמונה", "אם הנחש מביט למצלמה"], bestObservation: 0, observationFeedback: "כתמים נפרדים המזכירים מטבעות הם רמז משמעותי, במיוחד יחד עם מבנה גוף מוארך.", prompt: "איזה מין מצולם כאן?", choices: [viper.name, coin.name], correct: 1, explanation: "הכתמים דמויי המטבעות והגוף המוארך תומכים בזיהוי זעמן מטבעות." },
      { type: "compare", snake: viper, photo: viper.media[4], observationPrompt: "מה תפס את העין בצורת הגוף?", observationChoices: ["גוף עבה ומוצק", "גוף דק כחוט", "אי אפשר ללמוד דבר מהגוף"], bestObservation: 0, observationFeedback: "מבנה הגוף הוא רמז טוב, אך תמיד מצרפים אליו גם את דגם הגב ורמזים נוספים.", prompt: "איזה רמז בולט יותר בצילום הזה?", choices: ["גוף עבה ומוצק", "גוף דק וארוך"], correct: 0, explanation: "מבנה הגוף תומך בזיהוי, אך לעולם אינו מספיק לבדו." },
      { type: "compare", snake: coin, photo: coin.media[2], observationPrompt: "איך הדוגמה שעל הגב נראית?", observationChoices: ["כתמים נפרדים", "פס אחד רציף", "אין שום דוגמה"], bestObservation: 0, observationFeedback: "יפה. תיאור מדויק של הדוגמה חשוב יותר מאמירה כללית כמו 'נראה חום'.", prompt: "איזה רמז תומך בזיהוי המצולם?", choices: ["כתמים דמויי מטבעות", "פס גב רציף בלבד"], correct: 0, explanation: "הכתמים הנפרדים המזכירים מטבעות הם רמז חשוב אצל הזעמן." },
      { type: "reason", snake: coin, photo: coin.media[4], observationPrompt: "הנחש מוסווה. מה עושים כבלשי שטח?", observationChoices: ["מתקרבים כדי לראות", "סורקים את התמונה מרחוק", "מזיזים את הנחש"], bestObservation: 1, observationFeedback: "במצב שטח לא מנסים להשיג ודאות בכל מחיר. מתבוננים מרחוק ומקבלים גם חוסר ודאות.", prompt: "מה נכון לעשות קודם?", choices: ["להתקרב כדי לראות את הראש", "לבחון כמה רמזים מרחוק", "לגעת בזנב כדי שיזוז"], correct: 1, explanation: "בצילום שטח קשה נעזרים במבנה הגוף, בדגם ובסביבה — אך לעולם לא מתקרבים כדי לוודא." },
      { type: "reason", snake: viper, photo: viper.media[5], observationPrompt: "מהו הרמז החשוב ביותר כאן?", observationChoices: ["שלא חייבים להיות בטוחים", "שהצילום יפה", "שהנחש לא זז"], bestObservation: 0, observationFeedback: "בשטח מותר לומר 'לא בטוח'. בטיחות חשובה יותר מזיהוי מושלם.", prompt: "מהו הכלל החשוב ביותר גם כשנדמה שזיהינו?", choices: ["מתקרבים לבדוק", "שומרים מרחק ולא נוגעים", "מרימים בעזרת מקל"], correct: 1, explanation: "המטרה היא ללמוד להתבונן — לא להסתכן. זיהוי באפליקציה אינו אישור להתקרב בשטח." }
    ]);
  }, [activeLesson]);

  function persist(nextXp = xp, nextCompleted = completed, nextHearts = hearts, nextDiscovered = discovered) {
    setXp(nextXp);
    setCompleted(nextCompleted);
    setHearts(nextHearts);
    setDiscovered(nextDiscovered);
    localStorage.setItem("nature-detectives-xp", String(nextXp));
    localStorage.setItem("nature-detectives-streak", String(streak));
    localStorage.setItem("nature-detectives-completed", JSON.stringify(nextCompleted));
    localStorage.setItem("nature-detectives-hearts", String(nextHearts));
    localStorage.setItem("nature-detectives-discovered", JSON.stringify(nextDiscovered));
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
    setObservationSelected(null);
    setConfidence(null);
    setDetectivePhase("observe");
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
    const lessonUnlocks: Record<string, string> = {
      safety: "coin-marked-snake",
      "viper-vs-coin": "black-whipsnake"
    };
    const rewardSpecies = species.find((item) => item.id === lessonUnlocks[lessonId]);
    const isNewDiscovery = Boolean(rewardSpecies && !discovered.includes(rewardSpecies.id));
    const nextDiscovered = isNewDiscovery && rewardSpecies ? [...discovered, rewardSpecies.id] : discovered;
    persist(alreadyDone ? xp : xp + earnedXp + bonus, nextCompleted, Math.min(MAX_HEARTS, hearts + 1), nextDiscovered);
    launchReward(`+${alreadyDone ? bonus : earnedXp + bonus} XP`);
    setScreen("journey");
    setActiveLesson(null);
    setQuestionIndex(0);
    setSelected(null);
    setObservationSelected(null);
    setConfidence(null);
    setDetectivePhase("observe");
    if (isNewDiscovery && rewardSpecies) window.setTimeout(() => setPendingReveal(rewardSpecies), 350);
  }

  function resetProgress() {
    localStorage.removeItem("nature-detectives-xp");
    localStorage.removeItem("nature-detectives-completed");
    localStorage.removeItem("nature-detectives-hearts");
    setXp(0);
    setHearts(MAX_HEARTS);
    setCompleted([]);
    setDiscovered(["palestine-viper"]);
    localStorage.removeItem("nature-detectives-discovered");
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
        <section
          className="opening-screen opening-clickable"
          aria-labelledby="opening-title"
          role="button"
          tabIndex={0}
          onClick={() => setScreen("home")}
          onKeyDown={(event) => {
            if (event.key === "Enter" || event.key === " ") setScreen("home");
          }}
        >
          <div className="opening-sun" aria-hidden="true" />
          <div className="opening-landscape" aria-hidden="true">
            <span className="hill hill-one" />
            <span className="hill hill-two" />
            <span className="reed reed-one">🌿</span>
            <span className="reed reed-two">🌾</span>
            <span className="snake-trail">〰</span>
          </div>
          <div className="opening-card">
            <span className="opening-kicker">משחק חקר וזיהוי לילדים בני 6–12</span>
            <div className="opening-emblem" aria-hidden="true"><span>🔎</span><i>🐍</i></div>
            <h1 id="opening-title">בלשי הטבע</h1>
            <h2>לומדים לחשוב כמו גששי טבע</h2>
            <p className="opening-summary">מתבוננים בתמונות אמיתיות, מחפשים רמזים, מזהים את נחשי ישראל ולומדים כיצד לשמור מרחק בבטחה.</p>
            <div className="opening-facts" aria-label="מאפייני המשחק">
              <span>📷 תמונות אמיתיות</span>
              <span>🔎 משימות חקירה</span>
              <span>🛡️ למידה בטוחה</span>
            </div>
            <button className="primary opening-button" type="button">לחצו כדי להתחיל <span>←</span></button>
            <small className="opening-dismiss">אפשר ללחוץ בכל מקום במסך</small>
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

          <div className="discovery-teaser">
            <div className="discovery-seal">{nextDiscovery ? "?" : "✓"}</div>
            <div><span>התגלית הבאה ביומן</span><strong>{nextDiscovery ? "מין מסתורי מחכה בסוף המשלחת" : "אספת את כל המינים בגרסה הזו"}</strong></div>
            <b>{unlockedSpecies}/{species.length}</b>
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
          <ChallengeHeader onClose={() => setScreen("journey")} progress={((questionIndex + (detectivePhase === "observe" ? 0.25 : detectivePhase === "identify" ? 0.65 : 1)) / comparisonQuestions.length) * 100} icon="🔎" />
          <div className="challenge-card">
            <span className="question-label">תיק חקירה {questionIndex + 1}/{comparisonQuestions.length} · {detectivePhase === "observe" ? "מתבוננים" : detectivePhase === "identify" ? "מזהים" : "בודקים ביטחון"}</span>
            <div className="photo-question-card detective-photo">
              <div className="field-photo-wrap">
                <img src={comparison.photo.src} alt={comparison.photo.alt} />
                <span className={`difficulty difficulty-${comparison.photo.difficulty}`}>{comparison.photo.difficulty === 1 ? "קל" : comparison.photo.difficulty === 2 ? "בינוני" : "מצב שטח"}</span>
                {detectivePhase !== "observe" && <span className="clue-stamp">רמז נבדק ✓</span>}
              </div>
              <div className="photo-meta"><span>צילום אמיתי · © {comparison.photo.photographer}</span><small>{comparison.photo.tags.join(" · ")}</small></div>
            </div>

            {detectivePhase === "observe" && <>
              <div className="detective-step"><span>1</span><div><strong>עוצרים לפני שמנחשים</strong><small>קודם מתארים מה רואים. רק אחר כך נותנים שם למין.</small></div></div>
              <h1>{comparison.observationPrompt}</h1>
              <div className="choice-list observation-list">
                {comparison.observationChoices.map((choice, index) => <button key={choice} className={observationSelected === index ? (index === comparison.bestObservation ? "correct" : "selected-neutral") : ""} onClick={() => setObservationSelected(index)}>{choice}</button>)}
              </div>
              {observationSelected !== null && <div className={`observation-note ${observationSelected === comparison.bestObservation ? "sharp" : "coach"}`}><strong>{observationSelected === comparison.bestObservation ? "🔎 הבחנה חדה" : "🌿 כיוון טוב, אבל יש רמז אמין יותר"}</strong><p>{comparison.observationFeedback}</p><button className="primary" onClick={() => setDetectivePhase("identify")}>עכשיו אפשר לזהות</button></div>}
            </>}

            {detectivePhase === "identify" && <>
              <div className="detective-step"><span>2</span><div><strong>מחברים את הרמזים</strong><small>לא מסתמכים על צבע או סימן יחיד.</small></div></div>
              <h1>{comparison.prompt}</h1>
              <div className={`choice-list ${comparison.choices.length === 2 ? "two" : ""}`}>
                {comparison.choices.map((choice, index) => <button key={choice} className={answerClass(selected, index, comparison.correct)} onClick={() => chooseAnswer(index, comparison.correct)}>{choice}</button>)}
              </div>
              {selected !== null && <div className={`feedback ${selected === comparison.correct ? "good" : "try"}`}><div className="feedback-title"><span>{selected === comparison.correct ? "🍃" : "🔎"}</span><strong>{selected === comparison.correct ? feedbackLine : "עוד רמז אחד — ותזהה בפעם הבאה."}</strong></div><p>{comparison.explanation}</p><button className="primary" onClick={() => setDetectivePhase("confidence")}>בדיקת ביטחון</button></div>}
            </>}

            {detectivePhase === "confidence" && <>
              <div className="detective-step"><span>3</span><div><strong>בלש טוב יודע גם לומר „לא בטוח”</strong><small>הדיווח הזה לא משנה את הציון — הוא עוזר ללמוד נכון.</small></div></div>
              <h1>עד כמה היית בטוח בתשובה?</h1>
              <div className="confidence-grid">
                <button className={confidence === "sure" ? "active" : ""} onClick={() => setConfidence("sure")}><span>🎯</span><strong>בטוח</strong><small>זיהיתי כמה רמזים</small></button>
                <button className={confidence === "maybe" ? "active" : ""} onClick={() => setConfidence("maybe")}><span>🤔</span><strong>די בטוח</strong><small>היה לי רמז אחד טוב</small></button>
                <button className={confidence === "guess" ? "active" : ""} onClick={() => setConfidence("guess")}><span>🎲</span><strong>ניחוש</strong><small>לא הצלחתי להסביר למה</small></button>
              </div>
              {confidence && <div className="confidence-note"><strong>{confidence === "guess" ? "ניחוש ישר עדיף מביטחון מזויף." : confidence === "maybe" ? "מצוין. בפעם הבאה נחפש עוד רמז אחד." : "מעולה — ודא שהביטחון מבוסס על יותר מסימן אחד."}</strong><p>בשדה תמיד שומרים מרחק, גם כשמרגישים בטוחים בזיהוי.</p><button className="primary" onClick={() => { if (questionIndex === comparisonQuestions.length - 1) finishLesson(activeLesson.id, activeLesson.xp); else { setQuestionIndex(questionIndex + 1); setSelected(null); setObservationSelected(null); setConfidence(null); setDetectivePhase("observe"); } }}>{questionIndex === comparisonQuestions.length - 1 ? "סיום תיק החקירה" : "לתיק הבא"}</button></div>}
            </>}
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
              const unlocked = discovered.includes(item.id);
              return <article key={item.id} className={`journal-entry ${unlocked ? "" : "locked"}`}><div className="page-number">{String(index + 1).padStart(2, "0")}</div><div><span className="handwritten">{unlocked ? "זוהה ביומן" : "טרם נצפה"}</span><h2>{unlocked ? item.name : "מין מסתורי"}</h2><p>{unlocked ? item.identificationClues[0] : "השלימו עוד משלחות כדי לפתוח את העמוד."}</p></div><b>{unlocked ? "✓" : "?"}</b></article>;
            })}
          </div>
        </section>
      )}

      {screen === "album" && (
        <section className="content notebook-page">
          <div className="section-heading"><div><span className="eyebrow">אוסף המינים</span><h1>עשרת הנחשים הראשונים</h1><p>מאגר התמונות האמיתי נפתח. לכל צילום נשמרים בעלות, תגיות ורמת קושי.</p></div><button className="ghost" onClick={() => setScreen("home")}>חזרה למחנה</button></div>
          <div className="grid">
            {species.map((item, index) => {
              const approved = item.media.find((media) => media.approved);
              const visibleImage = approved && !imageErrors[item.id];
              return <article className="snake-card" key={item.id}>
                <div className="image-wrap">{visibleImage ? <img src={approved.src} alt={approved.alt} onError={() => setImageErrors((value) => ({ ...value, [item.id]: true }))} /> : <div className="image-placeholder"><span>{discovered.includes(item.id) ? "📷" : "🔒"}</span><strong>{discovered.includes(item.id) ? "תמונה מאומתת תתווסף כאן" : "הקלף עדיין נעול"}</strong></div>}</div>
                {visibleImage && discovered.includes(item.id) && <div className="media-strip"><span>📷 {item.media.filter((media) => media.approved).length} צילומים מאומתים</span><small>© {approved.photographer}</small></div>}
                <div className="card-body"><div className="title-row"><div><h2>{discovered.includes(item.id) ? item.name : "מין מסתורי"}</h2><small>{discovered.includes(item.id) ? item.scientificName : "השלימו משלחת כדי לגלות"}</small></div><span className={`tag ${riskClass(item.status)}`}>{discovered.includes(item.id) ? item.status : "נעול"}</span></div>{discovered.includes(item.id) && <><p>{item.region}</p><div className="clue"><strong>רמזי זיהוי</strong><ul>{item.identificationClues.slice(0, 2).map((clue) => <li key={clue}>{clue}</li>)}</ul></div><p className="safety-note">🛡️ {item.safetyNote}</p></>}</div>
              </article>;
            })}
          </div>
        </section>
      )}

      {pendingReveal && (
        <div className="reveal-overlay" role="dialog" aria-modal="true" aria-labelledby="reveal-title">
          <div className="leaf-burst" aria-hidden="true">{["🍃","🌿","🍂","🍃","🌱","🍂","🌿","🍃"].map((leaf, index) => <span key={index} style={{ "--leaf-index": index } as React.CSSProperties}>{leaf}</span>)}</div>
          <section className="reveal-panel">
            <span className="reveal-kicker">תגלית חדשה!</span>
            <div className="species-reveal-card">
              <div className="reveal-card-face">
                <span className="reveal-number">עמוד {String(discovered.indexOf(pendingReveal.id) + 1).padStart(2, "0")}</span>
                {pendingReveal.media.find((media) => media.approved) ? <img className="reveal-photo" src={pendingReveal.media.find((media) => media.approved)!.src} alt={pendingReveal.media.find((media) => media.approved)!.alt} /> : <div className="reveal-photo-placeholder">🐍</div>}
                <h1 id="reveal-title">{pendingReveal.name}</h1>
                <em>{pendingReveal.scientificName}</em>
                <p>{pendingReveal.identificationClues[0]}</p>
                <span className={`tag ${riskClass(pendingReveal.status)}`}>{pendingReveal.status}</span>
              </div>
            </div>
            <p className="reveal-copy">הקלף נוסף לאוסף ועמוד חדש נפתח ביומן השדה.</p>
            <button className="primary reveal-action" onClick={() => { setPendingReveal(null); setScreen("journal"); }}>📖 פתח את יומן השדה</button>
            <button className="reveal-skip" onClick={() => setPendingReveal(null)}>המשך במסלול</button>
          </section>
        </div>
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
