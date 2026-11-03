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
  title: "3D Reconstruction",
  status: "active" as const,
  startDate: "2026-11-03",
  description: "Geometry-based 3D reconstruction from images: camera models, epipolar geometry, triangulation and structure from motion.",
};

export const days: Day[] = [];
