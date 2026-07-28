export function Mushon({ message, mood = "curious", compact = false }: {
  message: string;
  mood?: "curious" | "happy" | "thinking";
  compact?: boolean;
}) {
  const expression = mood === "happy" ? "◡" : mood === "thinking" ? "﹏" : "⌣";
  return <aside className={`mushon-guide ${compact ? "compact" : ""}`} aria-label="מושון חוקר הטבע">
    <div className="mushon-avatar" aria-hidden="true">
      <span className="mushon-hat">⌒</span>
      <span className="mushon-face"><i>◉</i><i>◉</i><b>{expression}</b></span>
      <span className="mushon-glasses" />
      <span className="mushon-shirt">▾</span>
    </div>
    <div className="mushon-bubble"><small>מושון אומר</small><p>{message}</p></div>
  </aside>;
}
