"use client";

import { useEffect, useMemo, useState } from "react";
import { missions, safetyQuestions, species, viperVsCoinCases } from "./data";
import { AlbumScreen, JournalScreen, SpeciesReveal } from "./components/CollectionScreens";
import { HomeScreen } from "./components/HomeScreen";
import { IntroScreen } from "./components/IntroScreen";
import { CaseMission } from "./components/CaseMission";
import { JourneyScreen } from "./components/JourneyScreen";
import { SafetyMission } from "./components/SafetyMission";
import { RewardLayer } from "./components/GameUI";
import { TopBar } from "./components/TopBar";
import { AchievementModal } from "./components/AchievementModal";
import { playGameSound } from "./lib/sound";
import { hydrateInvestigation, MAX_HEARTS, shuffled, SUCCESS_LINES } from "./lib/game";
import type { Confidence, DetectivePhase, Mission, Screen, Species } from "./types/game";

type Reward = { id: number; label: string };

export default function Home() {
  const [screen, setScreen] = useState<Screen>("intro");
  const [activeMission, setActiveMission] = useState<Mission | null>(null);
  const [xp, setXp] = useState(0);
  const [streak, setStreak] = useState(1);
  const [hearts, setHearts] = useState(MAX_HEARTS);
  const [completed, setCompleted] = useState<string[]>([]);
  const [discovered, setDiscovered] = useState<string[]>(["palestine-viper"]);
  const [pendingReveal, setPendingReveal] = useState<Species | null>(null);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({});
  const [rewards, setRewards] = useState<Reward[]>([]);
  const [feedbackLine, setFeedbackLine] = useState(SUCCESS_LINES[0]);
  const [detectivePhase, setDetectivePhase] = useState<DetectivePhase>("observe");
  const [observationSelected, setObservationSelected] = useState<number | null>(null);
  const [confidence, setConfidence] = useState<Confidence | null>(null);
  const [achievementOpen, setAchievementOpen] = useState(false);

  useEffect(() => {
    setXp(Number(localStorage.getItem("nature-detectives-xp") || 0));
    setStreak(Number(localStorage.getItem("nature-detectives-streak") || 1));
    setHearts(Number(localStorage.getItem("nature-detectives-hearts") || MAX_HEARTS));
    const storedCompleted = JSON.parse(localStorage.getItem("nature-detectives-completed") || "[]") as string[];
    setCompleted(storedCompleted);
    const storedDiscovered = JSON.parse(localStorage.getItem("nature-detectives-discovered") || "null") as string[] | null;
    setDiscovered(storedDiscovered || ["palestine-viper", ...storedCompleted.flatMap((id) => id === "safety" ? ["coin-marked-snake"] : id === "viper-vs-coin" ? ["black-whipsnake"] : [])]);
  }, []);

  const rank = xp < 100 ? "מטייל מתחיל" : xp < 250 ? "בלש צעיר" : xp < 500 ? "חוקר שטח" : "גשש נחשים";
  const rankIcon = xp < 100 ? "🥾" : xp < 250 ? "🔎" : xp < 500 ? "🌿" : "🐍";
  const rankProgress = Math.min(100, xp % 100);
  const nextDiscovery = species.find((item) => !discovered.includes(item.id));

  const investigationCases = useMemo(() => shuffled(viperVsCoinCases).map((item) => hydrateInvestigation(item, species)), [activeMission]);
  const currentCase = investigationCases[questionIndex];
  const safety = safetyQuestions[questionIndex];

  function persist(nextXp = xp, nextCompleted = completed, nextHearts = hearts, nextDiscovered = discovered) {
    setXp(nextXp); setCompleted(nextCompleted); setHearts(nextHearts); setDiscovered(nextDiscovered);
    localStorage.setItem("nature-detectives-xp", String(nextXp));
    localStorage.setItem("nature-detectives-streak", String(streak));
    localStorage.setItem("nature-detectives-completed", JSON.stringify(nextCompleted));
    localStorage.setItem("nature-detectives-hearts", String(nextHearts));
    localStorage.setItem("nature-detectives-discovered", JSON.stringify(nextDiscovered));
  }

  function launchReward(label: string) {
    const reward = { id: Date.now(), label };
    setRewards((items) => [...items, reward]);
    window.setTimeout(() => setRewards((items) => items.filter((item) => item.id !== reward.id)), 1100);
  }

  function resetQuestionState() {
    setSelected(null); setObservationSelected(null); setConfidence(null); setDetectivePhase("observe");
  }

  function openMission(mission: Mission) {
    if (!mission.available) return;
    setCorrectAnswers(0);
    if (mission.kind === "album") return setScreen("album");
    setActiveMission(mission); setQuestionIndex(0); resetQuestionState();
    setScreen(mission.kind === "safety" ? "safety" : "lesson");
  }

  function chooseAnswer(index: number, correct: number) {
    if (selected !== null) return;
    setSelected(index);
    if (index === correct) {
      setCorrectAnswers((value) => value + 1);
      setFeedbackLine(SUCCESS_LINES[Math.floor(Math.random() * SUCCESS_LINES.length)]);
      launchReward("+10 XP");
    } else persist(xp, completed, Math.max(0, hearts - 1));
  }

  function finishMission(missionId: string, earnedXp: number) {
    const alreadyDone = completed.includes(missionId);
    const nextCompleted = alreadyDone ? completed : [...completed, missionId];
    const bonus = Math.round((correctAnswers / Math.max(1, questionIndex + 1)) * 20);
    const unlocks: Record<string, string> = { safety: "coin-marked-snake", "viper-vs-coin": "black-whipsnake" };
    const rewardSpecies = species.find((item) => item.id === unlocks[missionId]);
    const isNewDiscovery = Boolean(rewardSpecies && !discovered.includes(rewardSpecies.id));
    const nextDiscovered = isNewDiscovery && rewardSpecies ? [...discovered, rewardSpecies.id] : discovered;
    persist(alreadyDone ? xp : xp + earnedXp + bonus, nextCompleted, Math.min(MAX_HEARTS, hearts + 1), nextDiscovered);
    launchReward(`+${alreadyDone ? bonus : earnedXp + bonus} XP`);
    setScreen("journey"); setActiveMission(null); setQuestionIndex(0); resetQuestionState();
    if (!alreadyDone && missionId === "viper-vs-coin") {
      localStorage.setItem("nature-detectives-achievement-sharp-eye", "1");
      window.setTimeout(() => { playGameSound("achievement"); setAchievementOpen(true); }, 550);
    } else if (isNewDiscovery && rewardSpecies) window.setTimeout(() => setPendingReveal(rewardSpecies), 350);
  }

  function resetProgress() {
    ["nature-detectives-xp", "nature-detectives-completed", "nature-detectives-hearts", "nature-detectives-discovered"].forEach((key) => localStorage.removeItem(key));
    setXp(0); setHearts(MAX_HEARTS); setCompleted([]); setDiscovered(["palestine-viper"]);
  }

  return (
    <main className="app-shell">
      <div className="paper-noise" aria-hidden="true" />
      {screen !== "intro" && <TopBar hearts={hearts} xp={xp} streak={streak} onHome={() => setScreen("home")} />}
      <RewardLayer rewards={rewards} />

      <div className="screen-stage" key={screen}>
        {screen === "intro" && <IntroScreen onStart={() => setScreen("home")} />}
        {screen === "home" && <HomeScreen xp={xp} rank={rank} rankIcon={rankIcon} rankProgress={rankProgress} unlockedSpecies={discovered.length} totalSpecies={species.length} hasNextDiscovery={Boolean(nextDiscovery)} onJourney={() => setScreen("journey")} onJournal={() => setScreen("journal")} onAlbum={() => setScreen("album")} />}
        {screen === "journey" && <JourneyScreen missions={missions} completed={completed} onOpen={openMission} onHome={() => setScreen("home")} onReset={resetProgress} />}

        {screen === "safety" && safety && <SafetyMission question={safety} index={questionIndex} total={safetyQuestions.length} selected={selected} feedbackLine={feedbackLine} onClose={() => setScreen("journey")} onChoose={(index) => chooseAnswer(index, safety.correct)} onNext={() => { if (questionIndex === safetyQuestions.length - 1) finishMission("safety", 40); else { setQuestionIndex(questionIndex + 1); setSelected(null); } }} />}

        {screen === "lesson" && activeMission && <CaseMission species={species} onClose={() => setScreen("journey")} onMicroReward={launchReward} onFinish={() => finishMission(activeMission.id, activeMission.xp)} />}

        {screen === "journal" && <JournalScreen species={species} discovered={discovered} completed={completed} rank={rank} rankIcon={rankIcon} rankProgress={rankProgress} hearts={hearts} onHome={() => setScreen("home")} />}
        {screen === "album" && <AlbumScreen species={species} discovered={discovered} imageErrors={imageErrors} onImageError={(id) => setImageErrors((value) => ({ ...value, [id]: true }))} onHome={() => setScreen("home")} />}
      </div>
      {achievementOpen && <AchievementModal onClose={() => { setAchievementOpen(false); if (pendingReveal) return; const rewardSpecies = species.find((item) => item.id === "black-whipsnake"); if (rewardSpecies && !discovered.includes(rewardSpecies.id)) setPendingReveal(rewardSpecies); }} />}
      {pendingReveal && <SpeciesReveal item={pendingReveal} pageNumber={discovered.indexOf(pendingReveal.id) + 1} onJournal={() => { setPendingReveal(null); setScreen("journal"); }} onClose={() => setPendingReveal(null)} />}
    </main>
  );
}
