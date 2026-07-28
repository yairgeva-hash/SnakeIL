export function AchievementModal({ onClose }: { onClose: () => void }) {
  return <div className="achievement-overlay" role="dialog" aria-modal="true" aria-labelledby="achievement-title">
    <div className="achievement-card">
      <div className="achievement-rays" aria-hidden="true" />
      <div className="achievement-medal" aria-hidden="true">🏅</div>
      <span>הישג חדש</span>
      <h2 id="achievement-title">עין חדה</h2>
      <p>פתרת את תיק החקירה הראשון בעזרת ראיות — לא בניחוש.</p>
      <button className="primary" onClick={onClose}>מעולה, ממשיכים</button>
    </div>
  </div>;
}
