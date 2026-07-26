export function ChallengeHeader({ onClose, progress, icon }: { onClose: () => void; progress: number; icon: string }) {
  return <div className="challenge-top"><button className="close" onClick={onClose} aria-label="יציאה מהמשימה">×</button><div className="progress"><span style={{ width: `${progress}%` }} /></div><b>{icon}</b></div>;
}
export function Feedback({ isCorrect, line, explanation, onNext, isLast }: { isCorrect: boolean; line: string; explanation: string; onNext: () => void; isLast: boolean }) {
  return <div className={`feedback ${isCorrect ? "good" : "try"}`}><div className="feedback-title"><span>{isCorrect ? "🍃" : "🔎"}</span><strong>{isCorrect ? line : "עוד רמז אחד — ותזהה בפעם הבאה."}</strong></div><p>{explanation}</p><button className="primary" onClick={onNext}>{isLast ? "סיום המשלחת" : "להמשיך לרמז הבא"}</button></div>;
}
export function RewardLayer({ rewards }: { rewards: { id: number; label: string }[] }) {
  return <div className="reward-layer" aria-live="polite">{rewards.map((reward) => <div key={reward.id} className="floating-reward"><span>🍃</span>{reward.label}</div>)}</div>;
}
