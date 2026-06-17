"use client";

import { createContext, useContext, useReducer, useEffect, useRef, ReactNode } from "react";
import { TestState, SectionType } from "@/types";
import { mockTests } from "@/data/mockTests";
import { useUser } from "@clerk/nextjs";
import { saveUnfinishedTest, removeUnfinishedTest } from "./unfinishedTestsStore";

function getInitialState(mockId: string): TestState {
  const test = mockTests.find((t) => t.id === mockId);
  if (!test) throw new Error("Mock test not found");

  const firstReading = test.readingModules[0];
  return {
    mockId: test.id,
    mockName: test.name,
    userName: "",
    currentSection: "reading",
    currentModule: 1,
    currentQuestionIndex: 0,
    answers: {},
    crossedOut: {},
    flaggedQuestions: [],
    flaggedForReview: [],
    timeRemaining: 0,
    section: "directions",
    modules: [firstReading],
    completedModules: [],
    module1Correct: 0,
    module1Total: 0,
    readingModule1Correct: 0,
    readingModule1Total: 0,
    readingModule2Correct: 0,
    readingModule2Total: 0,
    mathModule1Correct: 0,
    mathModule1Total: 0,
    mathModule2Correct: 0,
    mathModule2Total: 0,
    adaptivePath: null,
    timerHidden: false,
    nextSectionName: "",
    breakTimer: undefined,
  };
}

function computeSectionScore(correct: number, total: number): number {
  if (total === 0) return 200;
  const raw = 200 + (correct / total) * 600;
  return Math.round(raw / 10) * 10;
}

const STORAGE_KEY = "sat-test-state";

function saveStateToSession(state: TestState) {
  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {}
}

function loadStateFromSession(): TestState | null {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as TestState;
  } catch {
    return null;
  }
}

type Action =
  | { type: "SET_USER"; userName: string }
  | { type: "START_TEST" }
  | { type: "START_SECTION"; section: SectionType; moduleIndex: number }
  | { type: "ANSWER_QUESTION"; questionId: string; answer: string }
  | { type: "CROSS_OUT"; questionId: string; choice?: string; label?: string }
  | { type: "TOGGLE_FLAG" }
  | { type: "NEXT_QUESTION" }
  | { type: "PREV_QUESTION" }
  | { type: "GO_TO_QUESTION"; index: number }
  | { type: "NEXT_SECTION" }
  | { type: "SUBMIT_MODULE" }
  | { type: "SHOW_RESULTS" }
  | { type: "TOGGLE_TIMER" }
  | { type: "SHOW_REVIEW" }
  | { type: "HIDE_REVIEW" }
  | { type: "TICK" }
  | { type: "SET_ADAPTIVE_PATH"; path: "easy" | "hard" }
  | { type: "SET_STATE"; state: Partial<TestState> }
  | { type: "END_MODULE" }
  | { type: "TOGGLE_REVIEW"; questionId: string }
  | { type: "END_BREAK" }
  | { type: "FINISH_TRANSITION" }
  | { type: "CONFIRM_SUBMIT" }
  | { type: "REVIEW_GO_TO_QUESTION"; index: number }
  | { type: "UNSCHEDULED_BREAK" }
  | { type: "RESUME_BREAK" };

function reducer(state: TestState, action: Action): TestState {
  switch (action.type) {
    case "SET_USER":
      return { ...state, userName: action.userName };

    case "START_TEST": {
      const test = mockTests.find((t) => t.id === state.mockId);
      if (!test) return state;
      const firstReading = test.readingModules[0];
      return {
        ...state,
        currentSection: "reading",
        currentModule: 1,
        currentQuestionIndex: 0,
        answers: {},
        crossedOut: {},
        flaggedQuestions: [],
        flaggedForReview: [],
        timeRemaining: firstReading.timeLimitMinutes * 60,
        section: "testing",
        modules: [firstReading],
        completedModules: [],
        module1Correct: 0,
        module1Total: 0,
        adaptivePath: null,
        timerHidden: false,
        nextSectionName: "",
        breakTimer: undefined,
      };
    }

    case "START_SECTION": {
      const test = mockTests.find((t) => t.id === state.mockId);
      if (!test) return state;
      const modules = action.section === "reading" ? test.readingModules : test.mathModules;
      const modIdx = Math.min(action.moduleIndex, modules.length - 1);
      const mod = modules[modIdx];
      return {
        ...state,
        currentSection: action.section,
        currentModule: modIdx + 1,
        currentQuestionIndex: 0,
        timeRemaining: mod.timeLimitMinutes * 60,
        section: "testing",
        modules: [mod],
        flaggedQuestions: [],
        flaggedForReview: [],
        timerHidden: false,
        nextSectionName: "",
      };
    }

    case "ANSWER_QUESTION": {
      const newAnswers = { ...state.answers };
      if (newAnswers[action.questionId] === action.answer) {
        delete newAnswers[action.questionId];
      } else {
        newAnswers[action.questionId] = action.answer;
      }
      return { ...state, answers: newAnswers };
    }

    case "CROSS_OUT": {
      const choice = action.choice ?? action.label ?? "";
      const current = state.crossedOut[action.questionId] || [];
      const exists = current.includes(choice);
      const updated = exists ? current.filter((c) => c !== choice) : [...current, choice];
      const newCrossed = { ...state.crossedOut, [action.questionId]: updated };
      if (updated.length === 0) delete newCrossed[action.questionId];
      return { ...state, crossedOut: newCrossed };
    }

    case "TOGGLE_FLAG": {
      const q = state.modules[0]?.questions[state.currentQuestionIndex];
      if (!q) return state;
      const id = q.id;
      const flagged = state.flaggedForReview.includes(id)
        ? state.flaggedForReview.filter((f) => f !== id)
        : [...state.flaggedForReview, id];
      return { ...state, flaggedForReview: flagged };
    }

    case "NEXT_QUESTION": {
      const max = state.modules[0]?.questions.length ?? 0;
      return {
        ...state,
        currentQuestionIndex: Math.min(state.currentQuestionIndex + 1, max - 1),
      };
    }

    case "PREV_QUESTION": {
      return {
        ...state,
        currentQuestionIndex: Math.max(state.currentQuestionIndex - 1, 0),
      };
    }

    case "GO_TO_QUESTION":
      return { ...state, currentQuestionIndex: action.index };

    case "NEXT_SECTION": {
      const test = mockTests.find((t) => t.id === state.mockId);
      if (!test) return state;
      const isReading = state.currentSection === "reading";
      const nextSec: SectionType = isReading ? "math" : "reading";
      const modules = isReading ? test.mathModules : test.readingModules;
      const nextMod = modules[0];
      if (!nextMod) return state;
      return {
        ...state,
        section: "transition",
        nextSectionName: nextSec === "reading" ? "Reading & Writing" : "Math",
      };
    }

    case "SUBMIT_MODULE": {
      const test = mockTests.find((t) => t.id === state.mockId);
      if (!test) return state;
      const isReading = state.currentSection === "reading";
      const modules = isReading ? test.readingModules : test.mathModules;
      const modIdx = state.currentModule - 1;
      const mod = modules.find((m) => m.id === state.currentModule) || modules[modIdx];
      if (!mod) return state;

      let correct = 0;
      const total = mod.questions.length;
      for (const q of mod.questions) {
        if (state.answers[q.id] === q.correctAnswer) correct++;
      }

      const completedId = `${state.currentSection}-m${state.currentModule}`;
      const completed = [...state.completedModules, completedId];

      const isModule1 = state.currentModule === 1;

      if (isModule1) {
        const pct = correct / total;
        const path = pct >= 0.65 ? "hard" : "easy";
        const sectionLabel = isReading ? "Reading & Writing" : "Math";
        const modFields = isReading
          ? { readingModule1Correct: correct, readingModule1Total: total }
          : { mathModule1Correct: correct, mathModule1Total: total };
        return {
          ...state,
          ...modFields,
          completedModules: completed,
          module1Correct: correct,
          module1Total: total,
          adaptivePath: path,
          currentQuestionIndex: 0,
          section: "transition",
          nextSectionName: `${sectionLabel} — Module 2`,
        };
      }

      const module2Correct = correct;
      const module2Total = total;
      const mod1Correct = isReading ? state.readingModule1Correct : state.mathModule1Correct;
      const mod1Total = isReading ? state.readingModule1Total : state.mathModule1Total;
      const mod2Fields = isReading
        ? { readingModule2Correct: module2Correct, readingModule2Total: module2Total }
        : { mathModule2Correct: module2Correct, mathModule2Total: module2Total };

      const readingCorrect = isReading ? mod1Correct + module2Correct : (state.readingCorrect ?? 0);
      const readingTotal = isReading ? mod1Total + module2Total : (state.readingTotal ?? 0);
      const mathCorrect = isReading ? (state.mathCorrect ?? 0) : mod1Correct + module2Correct;
      const mathTotal = isReading ? (state.mathTotal ?? 0) : mod1Total + module2Total;

      if (isReading) {
        return {
          ...state,
          ...mod2Fields,
          completedModules: completed,
          module1Correct: mod1Correct,
          module1Total: mod1Total,
          adaptivePath: state.adaptivePath,
          currentQuestionIndex: 0,
          readingCorrect,
          readingTotal,
          mathCorrect,
          mathTotal,
          section: "break",
          nextSectionName: "Math — Module 1",
        };
      }

      const readingScore = computeSectionScore(readingCorrect, readingTotal);
      const mathScore = computeSectionScore(mathCorrect, mathTotal);
      const totalScore = readingScore + mathScore;

      return {
        ...state,
        ...mod2Fields,
        completedModules: completed,
        module1Correct: mod1Correct,
        module1Total: mod1Total,
        adaptivePath: state.adaptivePath,
        currentQuestionIndex: 0,
        readingCorrect,
        readingTotal,
        mathCorrect,
        mathTotal,
        readingScore,
        mathScore,
        totalScore,
        section: "results",
      };
    }

    case "SHOW_RESULTS":
      return state;

    case "TOGGLE_TIMER":
      return { ...state, timerHidden: !state.timerHidden };

    case "SHOW_REVIEW":
      return { ...state, section: "review" };

    case "HIDE_REVIEW":
      return { ...state, section: "testing" };

    case "TICK": {
      if (state.section !== "testing") return state;
      const newTime = state.timeRemaining - 1;
      if (newTime <= 0) {
        return { ...state, timeRemaining: 0 };
      }
      return { ...state, timeRemaining: newTime };
    }

    case "END_MODULE":
    case "CONFIRM_SUBMIT":
      return reducer(state, { type: "SUBMIT_MODULE" });

    case "REVIEW_GO_TO_QUESTION":
      return { ...state, currentQuestionIndex: action.index, section: "testing" };

    case "TOGGLE_REVIEW": {
      const flagged = state.flaggedForReview.includes(action.questionId)
        ? state.flaggedForReview.filter((f) => f !== action.questionId)
        : [...state.flaggedForReview, action.questionId];
      return { ...state, flaggedForReview: flagged };
    }

    case "END_BREAK": {
      const test = mockTests.find((t) => t.id === state.mockId);
      if (!test) return state;
      const mathMods = test.mathModules;
      if (mathMods.length === 0) return state;
      return {
        ...state,
        currentSection: "math",
        currentModule: 1,
        currentQuestionIndex: 0,
        timeRemaining: mathMods[0].timeLimitMinutes * 60,
        section: "testing",
        modules: [mathMods[0]],
        timerHidden: false,
      };
    }

    case "FINISH_TRANSITION": {
      const test = mockTests.find((t) => t.id === state.mockId);
      if (!test) return state;

      const isReading = state.currentSection === "reading";
      const modules = isReading ? test.readingModules : test.mathModules;
      const nextModuleIndex = state.currentModule;

      if (nextModuleIndex < modules.length) {
        let modIdx = nextModuleIndex;
        if (nextModuleIndex === 1) {
          modIdx = state.adaptivePath === "hard" ? Math.min(2, modules.length - 1) : 1;
        }
        const nextMod = modules[modIdx];
        const sectionLabel = isReading ? "Reading & Writing" : "Math";
        return {
          ...state,
          currentModule: nextMod.id,
          currentQuestionIndex: 0,
          timeRemaining: nextMod.timeLimitMinutes * 60,
          section: "testing",
          modules: [nextMod],
          timerHidden: false,
          nextSectionName: `${sectionLabel} — Module ${nextModuleIndex + 1}`,
        };
      }

      if (isReading) {
        const mathMods = test.mathModules;
        if (mathMods.length === 0) return state;
        return {
          ...state,
          currentSection: "math",
          currentModule: 1,
          currentQuestionIndex: 0,
          timeRemaining: mathMods[0].timeLimitMinutes * 60,
          section: "testing",
          modules: [mathMods[0]],
          timerHidden: false,
          nextSectionName: "Math — Module 1",
          adaptivePath: null,
        };
      }

      const readingCorrect = state.readingCorrect ?? 0;
      const readingTotal = state.readingTotal ?? 0;
      const mathCorrect = state.mathCorrect ?? 0;
      const mathTotal = state.mathTotal ?? 0;
      const readingScore = computeSectionScore(readingCorrect, readingTotal);
      const mathScore = computeSectionScore(mathCorrect, mathTotal);
      const totalScore = readingScore + mathScore;

      return {
        ...state,
        readingScore,
        mathScore,
        totalScore,
        section: "results",
      };
    }

    case "UNSCHEDULED_BREAK":
      return { ...state, section: "break", breakTimer: state.timeRemaining };

    case "RESUME_BREAK": {
      const test = mockTests.find((t) => t.id === state.mockId);
      if (!test) return state;
      const modules = state.currentSection === "reading" ? test.readingModules : test.mathModules;
      const modIdx = Math.min(state.currentModule - 1, modules.length - 1);
      const mod = modules[modIdx];
      if (!mod) return state;
      return {
        ...state,
        section: "testing",
        timeRemaining: state.breakTimer ?? state.timeRemaining,
      };
    }

    case "SET_ADAPTIVE_PATH":
      return { ...state, adaptivePath: action.path };

    case "SET_STATE":
      return { ...state, ...action.state };

    default:
      return state;
  }
}

interface TestContextType {
  state: TestState;
  dispatch: React.Dispatch<Action>;
  initTest: (mockId: string) => void;
}

const TestContext = createContext<TestContextType | null>(null);

interface TestProviderProps {
  children: ReactNode;
  mockId?: string;
  restore?: boolean;
}

export function TestProvider({ children, mockId, restore }: TestProviderProps) {
  const { user } = useUser();
  const [state, dispatch] = useReducer(reducer, undefined as unknown as TestState, () => {
    if (restore) {
      const saved = loadStateFromSession();
      if (saved) return saved;
    }
    if (mockId) {
      return getInitialState(mockId);
    }
    return getInitialState("mock-1");
  });

  const prevSectionRef = useRef(state.section);
  const saveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const activeSections = ["testing", "directions", "break"];

  useEffect(() => {
    if (!user || !activeSections.includes(state.section)) return;
    const email = user.emailAddresses?.[0]?.emailAddress || user.id || "";
    if (!email) return;
    if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    saveTimerRef.current = setTimeout(() => {
      saveUnfinishedTest(email, state);
    }, 2000);
    return () => { if (saveTimerRef.current) clearTimeout(saveTimerRef.current); };
  }, [state.section, state.mockId, state.currentQuestionIndex, state.answers, state.timeRemaining, user]);

  useEffect(() => {
    if (state.section === "results" && prevSectionRef.current !== "results" && user) {
      saveStateToSession(state);
      const email = user.emailAddresses?.[0]?.emailAddress || user.id || "";
      if (email) removeUnfinishedTest(email, state.mockId);
      fetch("/api/test-results", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          testId: state.mockId,
          testName: state.mockName,
          totalScore: state.totalScore ?? 0,
          readingScore: state.readingScore ?? 200,
          mathScore: state.mathScore ?? 200,
          readingCorrect: state.readingCorrect ?? 0,
          readingTotal: state.readingTotal ?? 0,
          mathCorrect: state.mathCorrect ?? 0,
          mathTotal: state.mathTotal ?? 0,
          answers: state.answers,
        }),
      }).catch(() => {});
    }
    prevSectionRef.current = state.section;
  }, [state.section, state.totalScore, state.mockName, state.mockId, state.readingScore, state.mathScore, state.readingCorrect, state.readingTotal, state.mathCorrect, state.mathTotal, user, state]);

  const initTest = (mockId: string) => {
    const test = mockTests.find((t) => t.id === mockId);
    if (!test) return;
    const s = getInitialState(mockId);
    dispatch({ type: "SET_USER", userName: user?.fullName || user?.emailAddresses?.[0]?.emailAddress || "" });
    dispatch({ type: "SET_STATE", state: { ...s, section: "directions" } });
  };

  return (
    <TestContext.Provider value={{ state, dispatch, initTest }}>
      {children}
    </TestContext.Provider>
  );
}

export function useTest() {
  const ctx = useContext(TestContext);
  if (!ctx) throw new Error("useTest must be used within TestProvider");
  return ctx;
}
