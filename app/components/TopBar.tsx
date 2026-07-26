import { MAX_HEARTS } from "../lib/game";
export function TopBar({ hearts, xp, streak, onHome }: { hearts: number; xp: number; streak: number; onHome: () => void }) {
  return <header className="topbar"><button className="brand" onClick={onHome}><span className="brand-mark">🌿</span><span><strong>בלשי הטבע</strong><small>נחשים בישראל</small></span></button><div className="stats" aria-label="מצב שחקן"><span className="heart-stat" title="לבבות">{Array.from({ length: MAX_HEARTS }).map((_, index) => <i key={index} className={index < hearts ? "full" : "empty"}>♥</i>)}</span><span title="נקודות ניסיון">⭐ {xp}</span><span title="רצף">🔥 {streak}</span></div></header>;
}
