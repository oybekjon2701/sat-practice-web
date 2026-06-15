"use client";

import { useState } from "react";
import { useTest, TestProvider } from "@/lib/TestContext";
import { mockTests } from "@/data/mockTests";
import Link from "next/link";
import { renderMath } from "@/lib/renderMath";

function ScoreRing({ score, label, color, maxScore = 800 }: { score: number; label: string; color: string; maxScore?: number }) {
  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  const pct = Math.min(1, score / maxScore);
  const offset = circumference * (1 - pct);
  return (
    <div className="flex flex-col items-center">
      <div className="relative w-32 h-32">
        <svg className="w-32 h-32 -rotate-90" viewBox="0 0 120 120">
          <circle cx="60" cy="60" r={radius} fill="none" stroke="#e5e7eb" strokeWidth="8" />
          <circle cx="60" cy="60" r={radius} fill="none" stroke={color} strokeWidth="8" strokeLinecap="round" strokeDasharray={circumference} strokeDashoffset={offset} />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-3xl font-bold text-gray-800">{score}</span>
        </div>
      </div>
      <span className="text-sm text-gray-500 mt-2">{label}</span>
    </div>
  );
}

function ResultsContent() {
  const { state } = useTest();
  const [showBreakdown, setShowBreakdown] = useState(false);
  const [showReview, setShowReview] = useState(false);

  const readingScore = state.readingScore ?? 200;
  const mathScore = state.mathScore ?? 200;
  const totalScore = state.totalScore ?? readingScore + mathScore;
  const readingCorrect = state.readingCorrect ?? 0;
  const readingTotal = state.readingTotal ?? 0;
  const mathCorrect = state.mathCorrect ?? 0;
  const mathTotal = state.mathTotal ?? 0;

  const r1c = state.readingModule1Correct ?? 0;
  const r1t = state.readingModule1Total ?? 0;
  const r2c = state.readingModule2Correct ?? 0;
  const r2t = state.readingModule2Total ?? 0;
  const m1c = state.mathModule1Correct ?? 0;
  const m1t = state.mathModule1Total ?? 0;
  const m2c = state.mathModule2Correct ?? 0;
  const m2t = state.mathModule2Total ?? 0;

  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());

  function toggleExpand(id: string) {
    setExpandedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  }

  const test = mockTests.find((t) => t.id === state.mockId);
  const allQuestions = test
    ? [...test.readingModules.flatMap((m) => m.questions), ...test.mathModules.flatMap((m) => m.questions)]
    : [];

  function sectionLabel(q: { section: string; module?: number }): string {
    const sec = q.section === "reading" ? "R&W" : "Math";
    return `${sec} M${q.module ?? 1}`;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-3xl mx-auto px-4 py-12">
        <div className="flex items-center gap-2 mb-8">
          <svg viewBox="0 0 240 60" className="h-8 w-auto" xmlns="http://www.w3.org/2000/svg">
            <text x="235" y="34" font-family="Arial, Helvetica, sans-serif" font-weight="700" font-size="24" fill="#FF6B00" text-anchor="end">satzone.</text>
            <text x="235" y="52" font-family="Arial, Helvetica, sans-serif" font-weight="700" font-size="11" fill="#FF6B00" text-anchor="end" letter-spacing="1.5">SAT CENTER</text>
          </svg>
        </div>

        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-gray-800 mb-1">Your Score</h1>
          <p className="text-gray-500 text-sm">{state.mockName} — Practice Results</p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 mb-6">
          <div className="text-center mb-8">
            <div className="text-6xl font-bold text-blue-primary mb-1">{totalScore}</div>
            <div className="text-gray-500 text-sm">Total Score</div>
            <div className="text-xs text-gray-400 mt-1">400–1600 scale</div>
          </div>

          <div className="flex justify-center gap-16 mb-8">
            <ScoreRing score={readingScore} label="Reading & Writing" color="#1a73e8" />
            <ScoreRing score={mathScore} label="Math" color="#1e8e3e" />
          </div>

          <div className="border-t border-gray-100 pt-6">
            <h3 className="font-semibold text-gray-800 mb-4">Section Breakdown</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <span className="text-sm font-medium text-gray-800">Reading & Writing</span>
                  <span className="text-xs text-gray-500 ml-2">{readingCorrect}/{readingTotal} correct</span>
                </div>
                <span className="text-lg font-bold text-blue-primary">{readingScore}</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <span className="text-sm font-medium text-gray-800">Math</span>
                  <span className="text-xs text-gray-500 ml-2">{mathCorrect}/{mathTotal} correct</span>
                </div>
                <span className="text-lg font-bold text-sat-green">{mathScore}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 mb-6">
          <h3 className="font-semibold text-gray-800 mb-4">Score Breakdown by Module</h3>
          <div className="grid grid-cols-2 gap-3 mb-4">
            <div className="p-3 bg-blue-50 rounded-lg text-center">
              <span className="text-xs text-blue-600 font-medium">R&W Module 1</span>
              <div className="text-lg font-bold text-blue-700">{r1c}/{r1t}</div>
            </div>
            <div className="p-3 bg-blue-50 rounded-lg text-center">
              <span className="text-xs text-blue-600 font-medium">R&W Module 2</span>
              <div className="text-lg font-bold text-blue-700">{r2c}/{r2t}</div>
            </div>
            <div className="p-3 bg-green-50 rounded-lg text-center">
              <span className="text-xs text-green-600 font-medium">Math Module 1</span>
              <div className="text-lg font-bold text-green-700">{m1c}/{m1t}</div>
            </div>
            <div className="p-3 bg-green-50 rounded-lg text-center">
              <span className="text-xs text-green-600 font-medium">Math Module 2</span>
              <div className="text-lg font-bold text-green-700">{m2c}/{m2t}</div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 mb-6">
          <button
            onClick={() => setShowBreakdown(!showBreakdown)}
            className="w-full flex items-center justify-between text-left cursor-pointer"
          >
            <h3 className="font-semibold text-gray-800">Answer Review</h3>
            <span className="text-sm text-blue-primary">{showBreakdown ? "Hide" : "Show"}</span>
          </button>
          {showBreakdown && (
            <div className="mt-4 space-y-2 max-h-[500px] overflow-y-auto">
              {allQuestions.map((q) => {
                const expanded = expandedIds.has(q.id);
                const userAns = state.answers[q.id] ?? "(not answered)";
                const isCorrect = userAns === q.correctAnswer;
                const choiceText = (label: string) => q.choices?.find(c => c.label === label)?.text ?? label;
                return (
                  <div key={q.id} className={`p-3 rounded-lg text-sm ${isCorrect ? "bg-green-50" : "bg-red-50"}`}>
                    <div className="flex items-start gap-2">
                      <span className="text-xs text-gray-400 font-mono shrink-0">{sectionLabel(q)} Q{q.questionNumber}</span>
                      <div className="flex-1 min-w-0">
                        <p className={`text-gray-700 ${expanded ? "" : "truncate"}`}>{renderMath(q.stem)}</p>
                        <div className="mt-1 text-xs space-y-0.5">
                          <span className="text-gray-500">Your answer: </span>
                          <span className={isCorrect ? "text-green-700 font-medium" : "text-red-600 font-medium"}>
                            {userAns} {userAns !== "(not answered)" && `— ${choiceText(userAns)}`}
                          </span>
                          {!isCorrect && (
                            <span className="text-gray-500 ml-2">Correct: <span className="text-green-700 font-medium">{q.correctAnswer} — {choiceText(q.correctAnswer)}</span></span>
                          )}
                        </div>
                        {expanded && q.choices && (
                          <div className="mt-2 space-y-1 text-xs border-t border-gray-200 pt-2">
                            {q.choices.map(c => {
                              const isUser = c.label === userAns;
                              const isCorr = c.label === q.correctAnswer;
                              return (
                                <div key={c.label} className={`flex items-start gap-1.5 p-1 rounded ${isCorr ? "bg-green-100" : isUser ? "bg-red-100" : ""}`}>
                                  <span className="font-medium text-gray-500 shrink-0">{c.label}.</span>
                                  <span className="text-gray-700">{renderMath(c.text)}</span>
                                  {isCorr && <span className="text-green-600 shrink-0">✓</span>}
                                  {isUser && !isCorr && <span className="text-red-500 text-[10px] shrink-0">(your answer)</span>}
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </div>
                      <button
                        onClick={() => toggleExpand(q.id)}
                        className="text-blue-primary hover:text-blue-700 text-xs font-medium shrink-0 cursor-pointer"
                      >
                        {expanded ? "Collapse" : "Expand"}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
          <h3 className="font-semibold text-gray-800 mb-2">All Done!</h3>
          <p className="text-sm text-gray-500 mb-4">
            You have completed {state.mockName}. Review your answers and try another practice test to improve your score.
          </p>
          <div className="flex gap-3">
            <Link href="/" className="inline-block py-2.5 px-6 bg-blue-primary text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors text-sm">
              Back to Home
            </Link>
            <Link href="/test?mockId=mock-1" className="inline-block py-2.5 px-6 bg-white text-blue-primary font-semibold rounded-lg border border-blue-primary hover:bg-blue-50 transition-colors text-sm">
              Try Another Test
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ResultsPage() {
  return (
    <TestProvider restore>
      <ResultsContent />
    </TestProvider>
  );
}
