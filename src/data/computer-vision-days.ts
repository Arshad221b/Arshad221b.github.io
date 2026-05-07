export interface CodeBlock {
  language: string;
  filename?: string;
  code: string;
}

export interface TableData {
  headers: string[];
  rows: string[][];
}

export interface Section {
  title: string;
  subtitle?: string;
  bullets: string[];
  code?: CodeBlock;
  table?: TableData;
  diagram?: string;
}

export interface Day {
  day: number;
  date: string;
  curiosityTitle: string;
  summary: string;
  bullets: string[];
  diagram?: string;
  sections?: Section[];
}

export const experiment = {
  title: "Overview of Computer Vision",
  duration: "10 days (2 weeks)",
  commitment: "1 hr / day",
  status: "active" as const,
  startDate: "2026-05-06",
  description: "Revisiting the foundations of computer vision. From classical image processing to modern deep learning architectures. Building intuition for how machines see.",
};

export const days: Day[] = [
  {
    day: 1,
    date: "2026-05-06",
    curiosityTitle: "",
    summary: "",
    bullets: [],
  },
  {
    day: 2,
    date: "2026-05-07",
    curiosityTitle: "",
    summary: "",
    bullets: [],
  },
  {
    day: 3,
    date: "2026-05-08",
    curiosityTitle: "",
    summary: "",
    bullets: [],
  },
  {
    day: 4,
    date: "2026-05-09",
    curiosityTitle: "",
    summary: "",
    bullets: [],
  },
  {
    day: 5,
    date: "2026-05-10",
    curiosityTitle: "",
    summary: "",
    bullets: [],
  },
  {
    day: 6,
    date: "2026-05-11",
    curiosityTitle: "",
    summary: "",
    bullets: [],
  },
  {
    day: 7,
    date: "2026-05-12",
    curiosityTitle: "",
    summary: "",
    bullets: [],
  },
  {
    day: 8,
    date: "2026-05-13",
    curiosityTitle: "",
    summary: "",
    bullets: [],
  },
  {
    day: 9,
    date: "2026-05-14",
    curiosityTitle: "",
    summary: "",
    bullets: [],
  },
  {
    day: 10,
    date: "2026-05-15",
    curiosityTitle: "",
    summary: "",
    bullets: [],
  },
];
