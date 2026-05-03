export interface Section {
  title: string;
  subtitle?: string;
  bullets: string[];
}

export interface Day {
  day: number;
  date: string;
  curiosityTitle: string;
  summary: string;
  bullets: string[];
  sections?: Section[];
}

export const experiment = {
  title: "What is calculus exactly",
  duration: "7 days",
  commitment: "1 hr / day",
  status: "active" as const,
  startDate: "2026-04-12",
  description: "Understand the basics of calculus. Reading Strogatz's Infinite Powers alongside Rob Ghrist's first Coursera course to get into my math head.",
};

export const days: Day[] = [
  {
    day: 1,
    date: "2026-04-12",
    curiosityTitle: "",
    summary: "",
    bullets: [],
  },
  {
    day: 2,
    date: "2026-04-13",
    curiosityTitle: "",
    summary: "",
    bullets: [],
  },
  {
    day: 3,
    date: "2026-04-14",
    curiosityTitle: "",
    summary: "",
    bullets: [],
  },
  {
    day: 4,
    date: "2026-04-15",
    curiosityTitle: "",
    summary: "",
    bullets: [],
  },
  {
    day: 5,
    date: "2026-04-16",
    curiosityTitle: "",
    summary: "",
    bullets: [],
  },
  {
    day: 6,
    date: "2026-04-17",
    curiosityTitle: "",
    summary: "",
    bullets: [],
  },
  {
    day: 7,
    date: "2026-04-18",
    curiosityTitle: "",
    summary: "",
    bullets: [],
  },
];
