export type Difficulty = 'easy' | 'medium' | 'hard';

export type Question = {
  id: string;
  unit: string;
  difficulty: Difficulty;
  points: number;
  prompt: string;
  code?: string;
  options: string[];
  answer: number;
  explanation: string;
  solution: string[];
};

export type LessonTable = { head: string[]; rows: string[][] };

export type LessonSection = {
  title: string;
  text?: string[];
  table?: LessonTable;
  code?: string;
  note?: string;
};

export type Lesson = {
  hook: { title: string; text: string };
  sections: LessonSection[];
  examples: Array<{ title: string; steps: string[]; answer: string }>;
  pitfalls: string[];
  remember: string[];
  glossary: Array<{ term: string; meaning: string }>;
};

export type SourceQuestion = {
  grade: number;
  number: number;
  points: number;
  text: string;
};

export type Topic = {
  slug: string;
  order: number;
  icon: string;
  title: string;
  short: string;
  question_count: number;
  sources: SourceQuestion[];
  lesson: Lesson;
  ai: { subtopics: string[]; mistakes: string[]; rules: string[] };
};

export type TopicsFile = {
  title: string;
  description: string;
  scoring: { easy: number; medium: number; hard: number; max_score: number; default_time_minutes: number };
  topics: Topic[];
};

export type MistakeStats = Record<string, {
  count: number;
  lastSeen: string;
  questionIds: string[];
}>;

/** questionId → true (to‘g‘ri) | false (xato) — oxirgi urinish natijasi */
export type ProgressMap = Record<string, boolean>;

export type ExamHistory = {
  id: string;
  name: string;
  finishedAt: string;
  score: number;
  maxScore: number;
  percent: number;
  questionCount: number;
  configuredMinutes: number;
  elapsedSeconds: number;
  wrongUnits: string[];
  assistedCount?: number;
};
