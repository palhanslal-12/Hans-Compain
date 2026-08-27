export interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
  imagePreviewUrl?: string;
  imagePreviewUrls?: string[];
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
  options?: string[];
  userAnswerIndex?: number;
  correctAnswerIndex?: number;
  userAnswer?: string;
  correctAnswer?: string;
  userAnswerText?: string;
  correctAnswerText?: string;
  explanation: string;
  hint?: string;
  subject?: string;
  topic?: string;
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

export interface GroupQuizParticipant {
  id: string;
  name: string;
  avatar: string;
  score: number;
  correctCount: number;
  wrongCount: number;
  unattemptedCount: number;
  totalTimeSeconds: number;
  isHost: boolean;
  isReady: boolean;
  isBot?: boolean;
  lastAnswer?: {
    questionIndex: number;
    optionIndex: number;
    isCorrect: boolean;
    timeTakenSeconds: number;
    timestamp: number;
  };
  answers: Record<number, {
    optionIndex: number;
    isCorrect: boolean;
    timeTakenSeconds: number;
  }>;
}

export interface GroupQuizRoom {
  id: string; // e.g. "HANS-8921"
  title: string;
  subject: string;
  category: string;
  hostId: string;
  hostName: string;
  status: 'lobby' | 'countdown' | 'in-progress' | 'question-review' | 'podium-finished';
  currentQuestionIndex: number;
  timePerQuestion: number; // in seconds (e.g. 15, 30)
  questionStartTime: number;
  questions: QuizQuestion[];
  participants: Record<string, GroupQuizParticipant>;
  speakerEnabled: boolean;
  voiceLanguage: 'hindi' | 'english';
  createdAt: string;
}

export interface ExamPracticeLeaderboardEntry {
  id: string;
  name: string;
  avatar: string;
  examTitle: string;
  subject: string;
  score: number;
  totalQuestions: number;
  correctCount: number;
  wrongCount: number;
  timeSpentSeconds: number;
  accuracy: number;
  rank?: number;
  timestamp: string;
}

export interface BookmarkedQuestionItem {
  id: string;
  question: string;
  options: string[];
  answerIndex: number;
  explanation: string;
  hint?: string;
  subject?: string;
  dateStr?: string;
  examName?: string;
}

