export function IntroScreen({ onStart }: { onStart: () => void }) {
  return (
    <section className="opening-screen opening-clickable" aria-labelledby="opening-title" role="button" tabIndex={0} onClick={onStart} onKeyDown={(event) => { if (event.key === "Enter" || event.key === " ") onStart(); }}>
      <div className="opening-sun" aria-hidden="true" />
      <div className="opening-landscape" aria-hidden="true"><span className="hill hill-one" /><span className="hill hill-two" /><span className="reed reed-one">🌿</span><span className="reed reed-two">🌾</span><span className="snake-trail">〰</span></div>
      <div className="opening-card">
        <span className="opening-kicker">משחק חקר וזיהוי לילדים בני 6–12</span>
        <div className="opening-emblem" aria-hidden="true"><span>🔎</span><i>🐍</i></div>
        <h1 id="opening-title">בלשי הטבע</h1><h2>לומדים לחשוב כמו גששי טבע</h2>
        <p className="opening-summary">מתבוננים בתמונות אמיתיות, מחפשים רמזים, מזהים את נחשי ישראל ולומדים כיצד לשמור מרחק בבטחה.</p>
        <div className="opening-facts" aria-label="מאפייני המשחק"><span>📷 תמונות אמיתיות</span><span>🔎 משימות חקירה</span><span>🛡️ למידה בטוחה</span></div>
        <button className="primary opening-button" type="button">לחצו כדי להתחיל <span>←</span></button><small className="opening-dismiss">אפשר ללחוץ בכל מקום במסך</small>
      </div>
    </section>
  );
}
