export type RiskLevel = "ארסי" | "תת־ארסי" | "לא ארסי";

export type MediaAsset = {
  src: string;
  alt: string;
  photographer: string;
  license: string;
  sourceUrl?: string;
  tags: string[];
  difficulty: 1 | 2 | 3;
  approved: boolean;
};

export type Species = {
  id: string;
  group: "snakes";
  name: string;
  scientificName: string;
  status: RiskLevel;
  region: string;
  habitat: string;
  identificationClues: string[];
  safetyNote: string;
  similarSpecies: string[];
  media: MediaAsset[];
};

export type Mission = {
  id: string;
  title: string;
  subtitle: string;
  icon: string;
  xp: number;
  kind: "safety" | "identify" | "album";
  available: boolean;
};

export type InvestigationCase = {
  id: string;
  type: "clue" | "compare" | "reason";
  observationPrompt: string;
  observationChoices: string[];
  bestObservation: number;
  observationFeedback: string;
  speciesId: string;
  photoIndex: number;
  prompt: string;
  choiceSpeciesIds?: string[];
  choices?: string[];
  correct: number;
  explanation: string;
};

export type SafetyQuestion = {
  scene: string;
  choices: string[];
  correct: number;
  explanation: string;
};

export type Screen = "intro" | "home" | "journey" | "lesson" | "album" | "safety" | "journal";
export type DetectivePhase = "observe" | "identify" | "confidence";
export type Confidence = "sure" | "maybe" | "guess";
