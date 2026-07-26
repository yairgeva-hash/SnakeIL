import type { InvestigationCase, Species } from "../types/game";

export const MAX_HEARTS = 5;
export const SUCCESS_LINES = [
  "עבודה של בלש אמיתי!",
  "תפסת את הפרט החשוב!",
  "זיהוי מצוין!",
  "עוד רמז נכנס ליומן השדה.",
  "חדות עין מרשימה!"
];

export function shuffled<T>(items: T[]): T[] {
  return [...items].sort(() => Math.random() - 0.5);
}

export function answerClass(selected: number | null, index: number, correct: number) {
  if (selected === null) return "";
  if (index === correct) return "correct";
  if (index === selected) return "wrong";
  return "muted";
}

export function riskClass(status: Species["status"]) {
  if (status === "ארסי") return "danger";
  if (status === "תת־ארסי") return "warning";
  return "safe";
}

export function hydrateInvestigation(testCase: InvestigationCase, allSpecies: Species[]) {
  const snake = allSpecies.find((item) => item.id === testCase.speciesId);
  if (!snake) throw new Error(`Unknown species: ${testCase.speciesId}`);
  const photo = snake.media[testCase.photoIndex];
  if (!photo) throw new Error(`Missing photo ${testCase.photoIndex} for ${testCase.speciesId}`);
  const choices = testCase.choiceSpeciesIds
    ? testCase.choiceSpeciesIds.map((id) => allSpecies.find((item) => item.id === id)?.name ?? id)
    : testCase.choices ?? [];
  return { ...testCase, snake, photo, choices };
}
