export type Language = 'hi' | 'en';

export interface CurrentAffairsArticle {
  id: string;
  category: string;
  source: string;
  sourceUrl?: string;
  imageUrl?: string;
  titleHi: string;
  titleEn: string;
  summaryHi: string;
  summaryEn: string;
  date: string;
  readTime: string;
  examRelevance: string;
  keyFact: string;
  tag: string;
  backgroundHi?: string;
  backgroundEn?: string;
  deepAnalysisHi?: string[];
  deepAnalysisEn?: string[];
  keyProvisionsHi?: string[];
  keyProvisionsEn?: string[];
  examImpactHi?: string;
  examImpactEn?: string;
  mcq?: {
    questionHi: string;
    questionEn: string;
    optionsHi: string[];
    optionsEn: string[];
    correctIndex: number;
    explanationHi: string;
    explanationEn: string;
  };
  mainsQuestionHi?: string;
  mainsQuestionEn?: string;
}

export type EngagementChannel = 'SMS' | 'Email' | 'WhatsApp';
export type EngagementEventType = 'PEER_CHALLENGE' | 'INACTIVITY_REENGAGEMENT' | 'MILESTONE_SHARE' | 'STREAK_PROTECTION' | 'DAILY_BOOSTER';

export interface EngagementNotificationOutput {
  channel: EngagementChannel;
  event_type: EngagementEventType;
  notification: {
    title: string;
    body: string;
    action_button: {
      text: string;
      url: string;
    };
    social_share: {
      enable_share: boolean;
      share_text: string;
      share_link: string;
    };
  };
}

export interface PeerChallenge {
  id: string;
  creatorName: string;
  examContext: string;
  subject: string;
  questionCount: number;
  timeLimitSeconds: number;
  questions: ChallengeQuestion[];
  createdAt: string;
  scores: {
    userName: string;
    score: number;
    total: number;
    timeTakenSeconds: number;
    completedAt: string;
  }[];
}

export interface ChallengeQuestion {
  id: string;
  question: string;
  questionHi?: string;
  options: string[];
  optionsHi?: string[];
  correctIndex: number;
  explanation: string;
  explanationHi?: string;
}

export interface MockTest {
  id: string;
  title: string;
  titleHi: string;
  examCategory: 'SSC' | 'RAILWAY' | 'BANKING' | 'BOARD_10' | 'BOARD_12' | 'CURRENT_AFFAIRS';
  durationMinutes: number;
  totalMarks: number;
  negativeMarking: number;
  questions: ExamQuestion[];
}

export interface ExamQuestion {
  id: string;
  subject: string;
  subjectHi: string;
  questionEn: string;
  questionHi: string;
  optionsEn: string[];
  optionsHi: string[];
  correctIndex: number;
  explanationEn: string;
  explanationHi: string;
}

export interface StudyPlan {
  examGoal: string;
  durationDays: number;
  dailySchedule: {
    day: number;
    focus: string;
    topics: string[];
    timeSlots: {
      time: string;
      activity: string;
      isHighPriority: boolean;
    }[];
  }[];
  expertTips: string[];
}

export interface DoubtQuery {
  id: string;
  studentName: string;
  examTarget: string;
  subject: string;
  questionText: string;
  response?: string;
  status: 'pending' | 'resolved';
  createdAt: string;
}
