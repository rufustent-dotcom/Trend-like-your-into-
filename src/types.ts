export interface StrategicPattern {
  id: string;
  title: string;
  strength: string; // e.g., "8/8", "7/8"
  impact: "High" | "Medium" | "Low";
  observation: string;
  implication: string;
  opportunity: string;
  connectedSignalIds: string[];
}

export interface StrategicSignal {
  id: string;
  title: string;
  impact: "High" | "Medium" | "Low";
  stage: "Exploration" | "Acceleration" | "Consolidation";
  description: string;
  whyItMatters?: string;
  implication?: string;
  opportunity?: string;
}

export interface ActiveProject {
  id: string;
  title: string;
  status: "Active" | "Future" | "Archived" | "Hold";
  objective: string;
  market: string;
  aiUsage: string;
  revenuePotential: string;
  nextStep: string;
  lastUpdated: string;
}

export interface VaultNode {
  id: string;
  name: string;
  path: string;
  type: "file" | "directory";
  children?: string[]; // array of child Node IDs
  category: "Inbox" | "Projects" | "Research" | "AI" | "Content" | "Finance" | "Learning" | "Archive" | "System" | "Root";
  content?: string;
}

export interface ShowcaseItem {
  id: string;
  title: string;
  type: "Song" | "Film" | "Project" | "Link";
  url: string;
  description: string;
}

export interface ProducerReview {
  id: string;
  reviewerName: string;
  rating: number; // 1-5
  comment: string;
  projectName?: string; // name of the production project completed
  date: string;
}

export interface ProducerProfile {
  id: string;
  name: string;
  genre: string; // e.g. "Music Production", "Film Production", "Game Production", "Audio Book"
  experienceYears: number;
  bio: string;
  showcase: ShowcaseItem[];
  reviews?: ProducerReview[];
  availability: "Available" | "Busy";
}

export interface Sale {
  id: string;
  amount: number;
  status: "Closed" | "Open";
  representative: string;
  region: "North" | "South" | "East" | "West";
  date: string;
}

export interface IntelligenceVault {
  nodes: Record<string, VaultNode>;
  patterns: StrategicPattern[];
  signals: StrategicSignal[];
  projects: ActiveProject[];
  producers: ProducerProfile[];
  sales: Sale[];
  coreThesis: {
    primaryThesis: string;
    supportingAssumptions: string[];
    majorImplications: string[];
    longTermPredictions: string[];
    opportunityAreas: string[];
  };
  decisionFilter: string[];
  dailyReviewLogs: Array<{
    date: string;
    inputs: string[];
    signals: string[];
    patterns: string[];
    actions: string[];
  }>;
}
