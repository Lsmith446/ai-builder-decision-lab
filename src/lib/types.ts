export type AppPhase = "input" | "questions" | "loading" | "output";

export type OrbState = "dormant" | "active" | "loading" | "settled";

export type CostAsymmetry = "fp" | "fn";

export type StakesLevel = "low" | "medium" | "high" | "critical";

export type Answers = {
  errorConsequence: string;
  costAsymmetry: CostAsymmetry | null;
  hitl: string[];
  stakesLevel: StakesLevel | null;
};

export type Feedback = "yes" | "no" | null;
