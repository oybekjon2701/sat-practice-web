export type SectionType = "reading" | "math";
export type QuestionType = "mcq" | "gridin";
export type Difficulty = "easy" | "medium" | "hard";
export interface Passage {
  id: string;
  title: string;
  content: string;
  imageUrl?: string;
  imageAlt?: string;
}

export interface AnswerChoice {
  label: string;
  text: string;
}

export interface Question {
  id: string;
  module: number;
  questionNumber: number;
  type: QuestionType;
  difficulty: Difficulty;
  passageId?: string;
  passage?: string;
  passageImageUrl?: string;
  passageImageAlt?: string;
  imageUrl?: string;
  imageAlt?: string;
  stem: string;
  choices?: AnswerChoice[];
  correctAnswer: string;
  section: SectionType;
  underlinedPart?: string;
  experimental?: boolean;
}

export interface Module {
  id: number;
  section: SectionType;
  difficulty: Difficulty;
  questions: Question[];
  timeLimitMinutes: number;
}

export interface MockTest {
  id: string;
  name: string;
  readingModules: Module[];
  mathModules: Module[];
}

export interface TestState {
  mockId: string;
  mockName: string;
  userName: string;
  currentSection: SectionType;
  currentModule: number;
  currentQuestionIndex: number;
  answers: Record<string, string>;
  crossedOut: Record<string, string[]>;
  flaggedQuestions: string[];
  flaggedForReview: string[];
  timeRemaining: number;
  section: "directions" | "testing" | "review" | "transition" | "break" | "results";
  modules: Module[];
  completedModules: string[];
  module1Correct: number;
  module1Total: number;
  readingModule1Correct: number;
  readingModule1Total: number;
  readingModule2Correct: number;
  readingModule2Total: number;
  mathModule1Correct: number;
  mathModule1Total: number;
  mathModule2Correct: number;
  mathModule2Total: number;
  adaptivePath: "easy" | "hard" | null;
  timerHidden: boolean;
  nextSectionName: string;
  readingCorrect?: number;
  readingTotal?: number;
  mathCorrect?: number;
  mathTotal?: number;
  readingScore?: number;
  mathScore?: number;
  totalScore?: number;
}

export interface ScoreReport {
  readingScore: number;
  mathScore: number;
  totalScore: number;
  readingCorrect: number;
  readingTotal: number;
  mathCorrect: number;
  mathTotal: number;
  readingAdaptivePath?: "easy" | "hard";
  mathAdaptivePath?: "easy" | "hard";
}

export interface User {
  email: string;
  displayName: string;
  name: string;
  surname: string;
  school: string;
  phone: string;
}

export interface TestResult {
  studentEmail: string;
  studentName: string;
  studentSurname: string;
  testName: string;
  testId: string;
  date: string;
  time: string;
  totalScore: number;
  readingScore: number;
  mathScore: number;
  readingCorrect: number;
  readingTotal: number;
  mathCorrect: number;
  mathTotal: number;
  readingAdaptivePath?: "easy" | "hard";
  mathAdaptivePath?: "easy" | "hard";
}
