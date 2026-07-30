import { Mushon } from "./Mushon";

type HomeScreenProps = {
  xp: number;
  rank: string;
  rankIcon: string;
  rankProgress: number;
  unlockedSpecies: number;
  totalSpecies: number;
  hasNextDiscovery: boolean;
  onJourney: () => void;
  onJournal: () => void;
  onAlbum: () => void;
};

export function HomeScreen({
  xp,
  rank,
  rankIcon,
  rankProgress,
  unlockedSpecies,
  totalSpecies,
  hasNextDiscovery,
  onJourney,
  onJournal,
  onAlbum,
}: HomeScreenProps) {
  return (
    <section className="home-v2 notebook-page" aria-labelledby="home-title">
      <header className="home-v2-header">
        <div className="home-v2-label">🍃 מחברת החקירה שלך 🍃</div>
        <button className="home-v2-settings" type="button" aria-label="הגדרות">⚙️</button>
      </header>

      <div className="home-v2-stage">
        <div className="home-v2-dialogue">
          <strong>מושון</strong>
          <p>שלום! אני מושון. בוא נפתור יחד את תיק החקירה הראשון.</p>
        </div>
        <Mushon size="hero" mood="happy" className="home-v2-mushon" />
      </div>

      <div className="home-v2-branding">
        <h1 id="home-title">בלשי הטבע</h1>
        <p>פותחים תיק. אוספים רמזים. מגלים את האמת.</p>
      </div>

      <button className="home-v2-primary" onClick={onJourney}>
        <span aria-hidden="true">📓</span>
        התחילו את החקירה
        <b aria-hidden="true">←</b>
      </button>

      <nav className="home-v2-nav" aria-label="קיצורי דרך">
        <button onClick={onAlbum}>
          <span aria-hidden="true">🖼️</span>
          <strong>אלבום</strong>
          <small>גלריית הנחשים</small>
        </button>
        <button onClick={onJournal}>
          <span aria-hidden="true">🏅</span>
          <strong>הישגים</strong>
          <small>{xp} נקודות ניסיון</small>
        </button>
        <button onClick={onJournal}>
          <span aria-hidden="true">⚙️</span>
          <strong>הגדרות</strong>
          <small>התאמות ובקרה</small>
        </button>
      </nav>

      <div className="home-v2-progress" aria-label="התקדמות במשחק">
        <div><span>דרגה</span><strong>{rankIcon} {rank}</strong></div>
        <div className="home-v2-progress-bar"><span style={{ width: `${rankProgress}%` }} /></div>
        <div><span>מינים שנפתחו</span><strong>{unlockedSpecies}/{totalSpecies}</strong></div>
      </div>

      <p className="home-v2-safety">
        <strong>זכרו:</strong> מזהים נחשים רק ממרחק. לא נוגעים, לא מרימים ולא מתקרבים לצילום.
      </p>

      <span className="sr-only">
        {hasNextDiscovery ? "מין מסתורי נוסף מחכה בסוף המשלחת" : "כל המינים בגרסה הזו כבר נאספו"}
      </span>
    </section>
  );
}
