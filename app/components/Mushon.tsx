import Image from "next/image";

type Mood = "curious" | "happy" | "thinking" | "alert" | "celebrate";
type Size = "small" | "medium" | "large" | "hero";

export function Mushon({ message, mood = "curious", size = "medium", className = "" }: {
  message?: string;
  mood?: Mood;
  size?: Size;
  className?: string;
}) {
  const moodLabel: Record<Mood, string> = {
    curious: "סקרן",
    happy: "שמח",
    thinking: "חושב",
    alert: "ערני",
    celebrate: "חוגג",
  };

  return (
    <aside className={`mushon-guide mushon-${mood} mushon-${size} ${className}`.trim()} aria-label={`מושון חוקר הטבע, ${moodLabel[mood]}`}>
      <div className="mushon-portrait" aria-hidden="true">
        <Image src="/images/characters/mushon.png" alt="" fill sizes={size === "hero" ? "420px" : size === "large" ? "280px" : "160px"} priority={size === "hero" || size === "large"} />
      </div>
      {message && <div className="mushon-bubble"><small>מושון</small><p>{message}</p></div>}
    </aside>
  );
}
