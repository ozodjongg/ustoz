export type Difficulty = 'easy' | 'medium' | 'hard';

export type GeneratedQuestion = {
  id: string;
  unit: string;
  difficulty: Difficulty;
  points: number;
  prompt: string;
  options: string[];
  answer: number;
  explanation: string;
};

export type Lesson = {
  intro: string;
  keyIdeas: string[];
  steps: string[];
  examples: string[];
  pitfalls: string[];
  tips: string[];
};

export type Unit = {
  slug: string;
  title: string;
  short: string;
  lesson: Lesson;
  question_bank_file: string;
  question_count: number;
  source_questions: Array<{
    grade: number;
    question: number;
    points: number;
    answer: string;
    unit: string;
    summary: string;
  }>;
};

export type UnitFile = {
  title: string;
  description: string;
  scoring: {
    questions_1_10: number;
    questions_11_20: number;
    questions_21_30: number;
    max_score: number;
    default_time_minutes: number;
  };
  units: Unit[];
};

export type MistakeStats = Record<string, {
  count: number;
  lastSeen: string;
  questionIds: string[];
}>;

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
