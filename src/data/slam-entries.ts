export interface Section {
  title: string;
  subtitle?: string;
  bullets: string[];
  diagram?: string;
}

export interface Entry {
  id: number;
  date: string;
  title: string;
  tags: string[];
  summary: string;
  bullets: string[];
  sections?: Section[];
  diagram?: string;
}

export const experiment = {
  title: "SLAM from Scratch",
  duration: "6 months",
  commitment: "whenever it happens",
  status: "active" as const,
  startDate: "2026-05-13",
  description: "Building a full SLAM pipeline from scratch. Camera models, feature extraction, matching, motion estimation, mapping, loop closure, graph optimization. Theory and code, no shortcuts.",
};

export const months = [
  "2026-05",
  "2026-06",
  "2026-07",
  "2026-08",
  "2026-09",
  "2026-10",
];

export const entries: Entry[] = [];
