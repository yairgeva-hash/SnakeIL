import { Mushon } from "./Mushon";

export function IntroScreen({ onStart }: { onStart: () => void }) {
  const activate = () => onStart();

  return (
    <section
      className="opening-screen opening-clickable field-notebook-cover intro-v21"
      aria-labelledby="opening-title"
      role="button"
      tabIndex={0}
      onClick={activate}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") activate();
      }}
    >
      <div className="notebook-rings" aria-hidden="true">
        {Array.from({ length: 8 }, (_, index) => <i key={index} />)}
      </div>

      <div className="intro-v21-page">
        <header className="intro-v21-header">
          <span aria-hidden="true">🍃</span>
          <strong>מחברת החקירה שלך</strong>
          <span aria-hidden="true">🍃</span>
        </header>

        <div className="intro-v21-hero">
          <div className="intro-v21-copy">
            <div className="intro-v21-bubble">
              <strong>מושון</strong>
              <p>שלום! אני מושון. בואו נפתור יחד את תיק החקירה הראשון.</p>
            </div>

            <div className="intro-v21-brand">
              <p className="intro-v21-kicker">משחק חקר וזיהוי לילדים בני 6–12</p>
              <h1 id="opening-title">בלשי הטבע</h1>
              <h2>פותחים תיק. אוספים רמזים. מגלים את האמת.</h2>
            </div>
          </div>

          <Mushon size="hero" mood="happy" className="intro-v21-mushon" />
        </div>

        <button className="intro-v21-start" type="button" onClick={(event) => { event.stopPropagation(); activate(); }}>
          <span aria-hidden="true">📓</span>
          התחילו את החקירה
          <b aria-hidden="true">←</b>
        </button>

        <div className="intro-v21-actions" aria-label="מידע על המשחק">
          <span><b aria-hidden="true">🖼️</b><strong>אלבום</strong><small>גלריית הנחשים</small></span>
          <span><b aria-hidden="true">🏅</b><strong>הישגים</strong><small>התקדמות ופרסים</small></span>
          <span><b aria-hidden="true">🛡️</b><strong>בטיחות</strong><small>לומדים ממרחק</small></span>
        </div>

        <p className="intro-v21-note">
          <strong>זכרו:</strong> מתבוננים בנחשים רק ממרחק ולא נוגעים בהם.
        </p>
      </div>
    </section>
  );
}
