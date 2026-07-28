export function IntroScreen({ onStart }: { onStart: () => void }) {
  return (
    <section
      className="opening-screen opening-clickable field-notebook-cover"
      aria-labelledby="opening-title"
      role="button"
      tabIndex={0}
      onClick={onStart}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") onStart();
      }}
    >
      <div className="cover-corner cover-corner-one" aria-hidden="true">🌿</div>
      <div className="cover-corner cover-corner-two" aria-hidden="true">〰</div>
      <div className="notebook-rings" aria-hidden="true">{Array.from({ length: 8 }, (_, index) => <i key={index} />)}</div>

      <div className="opening-card opening-hero-card">
        <div className="opening-case-label">מחברת השדה האישית שלך</div>
        <div className="opening-emblem" aria-hidden="true"><span>🔎</span><i>🐍</i></div>
        <p className="opening-kicker">משחק חקר וזיהוי לילדים בני 6–12</p>
        <h1 id="opening-title">בלשי הטבע</h1>
        <h2>פותחים תיק. אוספים רמזים. מגלים את האמת.</h2>

        <p className="opening-summary">
          לא כל נחש שנראה מפחיד הוא מסוכן — ובלש טבע טוב אף פעם לא מסתפק בניחוש.
          במשחק תתבוננו בתמונות אמיתיות, תחפשו סימנים חשובים ותפתרו תעלומות על בעלי החיים של ישראל.
        </p>

        <div className="opening-mission-grid" aria-label="מה עושים במשחק">
          <span><b>🔎</b><strong>אוספים ראיות</strong><small>מגלים אילו פרטים באמת חשובים</small></span>
          <span><b>🧠</b><strong>חושבים כמו חוקרים</strong><small>משווים, בודקים ומסיקים מסקנות</small></span>
          <span><b>📖</b><strong>פותחים אנציקלופדיה</strong><small>כל תיק מוסיף ידע חדש למחברת</small></span>
        </div>

        <blockquote>חוקר טוב לא מחפש תשובה מהירה. הוא מחפש את הרמז הנכון.</blockquote>

        <button className="primary opening-button" type="button">
          התחילו את החקירה <span>←</span>
        </button>
        <small className="opening-dismiss">תמונות אמיתיות • למידה בטוחה • בלי לחץ ובלי פסילות</small>
      </div>
    </section>
  );
}
