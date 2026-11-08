import type { ReactElement } from "react";
import { IconQuiz, IconPuzzle, IconResonance } from "./icons";

export type ActivityType = "quiz" | "puzzle" | "resonance";

export const activityIcon: Record<ActivityType, () => ReactElement> = {
  quiz: IconQuiz,
  puzzle: IconPuzzle,
  resonance: IconResonance,
};