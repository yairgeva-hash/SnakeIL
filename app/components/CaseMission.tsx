"use client";

import { useMemo, useState } from "react";
import type { Species } from "../types/game";
import { ChallengeHeader } from "./GameUI";
import { Mushon } from "./Mushon";
import { playGameSound } from "../lib/sound";

type Stage = "hook" | "notice" | "pattern" | "body" | "compare" | "final" | "solved";
type ChoiceState = { picked: number | null; success: boolean };

const stages: Stage[] = ["hook", "notice", "pattern", "body", "compare", "final", "solved"];

export function CaseMission({ species, onClose, onFinish, onMicroReward }: {
  species: Species[];
  onClose: () => void;
  onFinish: () => void;
  onMicroReward: (label: string) => void;
}) {
  const viper = species.find((item) => item.id === "palestine-viper")!;
  const coin = species.find((item) => item.id === "coin-marked-snake")!;
  const [stage, setStage] = useState<Stage>("hook");
  const [choice, setChoice] = useState<ChoiceState>({ picked: null, success: false });
  const [evidence, setEvidence] = useState<string[]>([]);

  const stageIndex = stages.indexOf(stage);
  const progress = Math.max(4, (stageIndex / (stages.length - 1)) * 100);
  const addEvidence = (label: string) => {
    setEvidence((items) => items.includes(label) ? items : [...items, label]);
    onMicroReward(`ראיה נוספה: ${label}`);
    playGameSound("clue");
  };
  const move = (next: Stage) => { playGameSound("tap"); setChoice({ picked: null, success: false }); setStage(next); };
  const choose = (index: number, correct: number, evidenceLabel?: string) => {
    const success = index === correct;
    setChoice({ picked: index, success });
    if (success && evidenceLabel) addEvidence(evidenceLabel);
    playGameSound(success ? "success" : "tap");
  };

  const evidenceText = useMemo(() => evidence.length ? evidence.join(" · ") : "התיק עדיין ריק", [evidence]);

  return <section className="challenge notebook-page case-mission">
    <ChallengeHeader onClose={onClose} progress={progress} icon="🗂️" />
    <div className="challenge-card case-card">
      <div className="case-topline"><span>תיק חקירה 001</span><b>{stage === "solved" ? "נפתר ✓" : "פתוח"}</b></div>
      {stage !== "hook" && stage !== "solved" && <div className="case-evidence-meter" aria-label={`${evidence.length} מתוך 3 ראיות נאספו`}><strong>הראיות בתיק</strong>{["דוגמת גב", "מבנה גוף", "לא מסתמכים על צבע"].map((item) => <span key={item} className={evidence.includes(item) ? "found" : ""}>{evidence.includes(item) ? "✓" : "○"}<small>{item}</small></span>)}</div>}

      {stage === "hook" && <div className="case-hook">
        <Mushon mood="curious" message="מישהו התבלבל בין שני נחשים דומים. אל תמהר לנחש — נאסוף שלוש ראיות ונפתור את התיק יחד." />
        <div className="case-folder">📁</div>
        <span className="case-kicker">תעלומה חדשה</span>
        <h1>הצפע והמתחזה</h1>
        <p>בשביל נראו שני נחשים דומים. אחד ארסי, והשני רק נראה דומה. האם תצליח לגלות מי הוא מי?</p>
        <button className="primary case-primary" onClick={() => { playGameSound("open"); onMicroReward("התיק נפתח!"); move("notice"); }}>פתח את התיק</button>
      </div>}

      {stage === "notice" && <>
        <span className="question-label">ניצחון ראשון · אין כאן תשובה לא נכונה</span>
        <div className="single-photo"><img src={viper.media[1].src} alt={viper.media[1].alt} /></div>
        <h1>מה תפס לך את העין קודם?</h1>
        <div className="choice-list three-soft">{["דוגמת הגב", "מבנה הגוף", "הראש"].map((label, index) => <button key={label} className={choice.picked === index ? "correct" : ""} onClick={() => { setChoice({ picked: index, success: true }); onMicroReward("התבוננות מצוינת!"); }}>{label}</button>)}</div>
        {choice.picked !== null && <div className="micro-success"><strong>✨ יפה! בלש טוב מתחיל ממה שהוא רואה.</strong><p>עכשיו נבדוק אילו רמזים באמת עוזרים להבדיל בין המינים.</p><button className="primary" onClick={() => move("pattern")}>לרמז הראשון</button></div>}
      </>}

      {stage === "pattern" && <>
        <span className="question-label">רמז 1 מתוך 3</span>
        <div className="compare-photos">
          <figure><img src={viper.media[3].src} alt={viper.media[3].alt} /><figcaption>תמונה א׳</figcaption></figure>
          <figure><img src={coin.media[2].src} alt={coin.media[2].alt} /><figcaption>תמונה ב׳</figcaption></figure>
        </div>
        <h1>באיזו תמונה דוגמת הגב נראית מחוברת ומתפתלת יותר?</h1>
        <div className="choice-list two"><button className={choice.picked === 0 ? (choice.success ? "correct" : "wrong") : ""} onClick={() => choose(0, 0, "דוגמת גב")}>תמונה א׳</button><button className={choice.picked === 1 ? "wrong" : ""} onClick={() => choose(1, 0, "דוגמת גב")}>תמונה ב׳</button></div>
        {choice.picked !== null && <div className={`micro-success ${choice.success ? "" : "gentle"}`}><strong>{choice.success ? "🔎 מצאת את הרמז החשוב!" : "כמעט — הסתכל שוב על החיבור בין הכתמים."}</strong><p>אצל הצפע הדוגמה נראית לעיתים כמו פס כהה ומתפתל. אצל זעמן המטבעות הכתמים נפרדים יותר.</p>{choice.success && <button className="primary" onClick={() => move("body")}>אסוף עוד ראיה</button>}</div>}
      </>}

      {stage === "body" && <>
        <span className="question-label">רמז 2 מתוך 3</span>
        <div className="compare-photos">
          <figure><img src={viper.media[4].src} alt={viper.media[4].alt} /><figcaption>צפע מצוי</figcaption></figure>
          <figure><img src={coin.media[1].src} alt={coin.media[1].alt} /><figcaption>זעמן מטבעות</figcaption></figure>
        </div>
        <h1>מי נראה בדרך כלל מוצק ועבה יותר?</h1>
        <div className="choice-list two"><button className={choice.picked === 0 ? (choice.success ? "correct" : "wrong") : ""} onClick={() => choose(0, 0, "מבנה גוף")}>הצפע</button><button className={choice.picked === 1 ? "wrong" : ""} onClick={() => choose(1, 0, "מבנה גוף")}>זעמן המטבעות</button></div>
        {choice.picked !== null && <div className={`micro-success ${choice.success ? "" : "gentle"}`}><strong>{choice.success ? "🌿 עוד ראיה נאספה!" : "כיוון טוב — השווה את רוחב הגוף."}</strong><p>הצפע נראה בדרך כלל עבה ומוצק יותר; הזעמן לרוב ארוך ודק יותר. זה רמז, לא כלל יחיד.</p>{choice.success && <button className="primary" onClick={() => move("compare")}>לגילוי המפתיע</button>}</div>}
      </>}

      {stage === "compare" && <>
        <span className="question-label">הטוויסט של התיק</span>
        <div className="twist-card"><span>🎭</span><h1>הצבע יכול להטעות</h1><p>שני המינים יכולים להופיע בגוונים שונים. בלש טבע לא מחליט לפי צבע בלבד — הוא מחבר כמה ראיות.</p></div>
        <div className="evidence-strip"><b>בתיק שלך:</b><span>{evidenceText}</span></div>
        <button className="primary case-primary" onClick={() => { addEvidence("לא מסתמכים על צבע"); move("final"); }}>אני מוכן לפתור</button>
      </>}

      {stage === "final" && <>
        <span className="question-label">חקירת הסיום</span>
        <div className="single-photo final-photo"><img src={coin.media[4].src} alt="נחש בתמונת שטח" /></div>
        <h1>מה המסקנה שלך?</h1>
        <p className="case-prompt">בדוק דוגמת גב ומבנה גוף לפני שאתה מחליט.</p>
        <div className="choice-list two"><button className={choice.picked === 0 ? "wrong" : ""} onClick={() => choose(0, 1)}>צפע מצוי</button><button className={choice.picked === 1 ? (choice.success ? "correct" : "wrong") : ""} onClick={() => choose(1, 1)}>זעמן מטבעות</button></div>
        {choice.picked !== null && <div className={`micro-success ${choice.success ? "" : "gentle"}`}><strong>{choice.success ? "🎉 פתרת את התעלומה!" : "התיק נשאר פתוח — חסרה עוד הסתכלות אחת."}</strong><p>{choice.success ? "הכתמים נפרדים יותר והגוף מוארך יחסית. אספת ראיות לפני שהחלטת." : "חזור לדוגמת הגב: האם היא פס מתפתל, או כתמים נפרדים?"}</p>{choice.success && <button className="primary" onClick={() => { playGameSound("complete"); onMicroReward("התיק נסגר!"); move("solved"); }}>סגור את התיק</button>}</div>}
      </>}

      {stage === "solved" && <div className="case-solved">
        <Mushon mood="happy" message="עשית בדיוק מה שחוקר טבע עושה: התבוננת, השווית ורק אז החלטת." />
        <div className="solved-stamp">התיק נסגר</div>
        <h1>עבודה מצוינת, בלש טבע!</h1>
        <p>לפני כמה דקות אולי היית מנחש. עכשיו אתה כבר יודע לחפש כמה רמזים.</p>
        <div className="solved-evidence"><span>✓ דוגמת גב</span><span>✓ מבנה גוף</span><span>✓ צבע עלול להטעות</span></div>
        <div className="unlock-card"><img src={coin.media[0].src} alt={coin.media[0].alt} /><div><small>נפתח באנציקלופדיה</small><strong>זעמן מטבעות</strong></div></div>
        <blockquote>חוקר טוב לא מחפש תשובה מהירה — הוא מחפש רמז.</blockquote>
        <button className="primary case-primary" onClick={onFinish}>קבל את התג והמשך</button>
      </div>}
    </div>
  </section>;
}
