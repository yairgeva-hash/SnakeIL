import Image from "next/image";

export function Mushon({ message, mood = "curious", compact = false }: {
  message: string;
  mood?: "curious" | "happy" | "thinking";
  compact?: boolean;
}) {
  const moodLabel = mood === "happy" ? "שמח" : mood === "thinking" ? "חושב" : "סקרן";

  return (
    <aside className={`mushon-guide mushon-${mood} ${compact ? "compact" : ""}`} aria-label={`מושון חוקר הטבע, ${moodLabel}`}>
      <div className="mushon-portrait" aria-hidden="true">
        <Image
          src="/images/characters/mushon.png"
          alt=""
          fill
          sizes={compact ? "110px" : "160px"}
          priority={!compact}
        />
      </div>
      <div className="mushon-bubble">
        <small>מושון אומר</small>
        <p>{message}</p>
      </div>
    </aside>
  );
}
