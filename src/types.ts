export interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
  imagePreviewUrl?: string;
}

export interface QuizQuestion {
  question: string;
  options: string[];
  answerIndex: number;
  explanation: string;
  hint?: string;
  difficulty?: 'standard' | 'moderate' | 'hard' | 'extreme';
}

export interface SavedQuizRecord {
  id: string;
  subject: string;
  level: string;
  date: string;
  timestamp?: string;
  score: number;
  total: number;
  studentName?: string;
  studentRoll?: string;
  positiveMarks?: number;
  negativeMarks?: number;
  netScore?: number;
  maxScore?: number;
  percentage?: number;
  grade?: string;
  userAnswers?: Record<number, number>;
  quizzes: QuizQuestion[];
  difficulty?: string;
  timeSpentSeconds?: number;
  timerMode?: string;
  mistakesCount?: number;
}

export interface MistakeNotebookItem {
  id: string;
  question: string;
  options: string[];
  userAnswerIndex: number;
  correctAnswerIndex: number;
  userAnswerText?: string;
  correctAnswerText?: string;
  explanation: string;
  hint?: string;
  subject: string;
  level?: string;
  chapter?: string;
  difficulty?: 'standard' | 'moderate' | 'hard' | 'extreme' | string;
  date?: string;
  timestamp?: string;
  aiRemediation?: string;
  remedialExplanation?: string;
  mastered?: boolean;
  attemptsCount?: number;
  attemptCount?: number;
}

export interface BusinessCalculation {
  productType: "Ginger" | "Turmeric" | "Medicinal";
  rawCostPerKg: number;
  monthlyQuantityKg: number;
  sellingCostPerKg: number;
  machineryCost: number;
  subsidyPercentage: number;
  yieldPercentage: number;
}

export interface BusinessResult {
  rawMaterialCost: number;
  processedYieldKg: number;
  grossRevenue: number;
  netProfit: number;
  machineryWithSubsidy: number;
  subsidySaved: number;
}
