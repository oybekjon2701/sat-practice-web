"use client";

import { useTest } from "@/lib/TestContext";
import { useState } from "react";
import { Question } from "@/types";

function ConfirmDialog({ message, onConfirm, onCancel }: { message: string; onConfirm: () => void; onCancel: () => void }) {
  return (
    <div className="fixed inset-0 z-[60] bg-black/40 flex items-center justify-center">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-sm mx-4 p-6 text-center">
        <p className="text-gray-800 font-semibold mb-4">{message}</p>
        <div className="flex gap-3 justify-center">
          <button onClick={onCancel} className="px-5 py-2 text-sm border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer text-gray-700">Cancel</button>
          <button onClick={onConfirm} className="px-5 py-2 text-sm bg-[#1a73e8] text-white rounded-lg hover:bg-blue-700 cursor-pointer font-medium">Confirm</button>
        </div>
      </div>
    </div>
  );
}

function QuestionGrid({ questions, onClose }: { questions: Question[]; onClose: () => void }) {
  const { state, dispatch } = useTest();
  const [showConfirm, setShowConfirm] = useState(false);

  function handleSubmit() {
    if (state.currentSection === "math" && state.currentModule > 1) {
      dispatch({ type: "SHOW_REVIEW" });
    } else {
      setShowConfirm(true);
    }
    onClose();
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-start justify-center pt-16">
      {showConfirm && (
        <ConfirmDialog
          message="Are you sure you want to submit this module? Unanswered questions will be marked as skipped."
          onConfirm={() => { dispatch({ type: "END_MODULE" }); setShowConfirm(false); }}
          onCancel={() => setShowConfirm(false)}
        />
      )}
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg mx-4 p-6">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-bold text-gray-800 text-lg">Check Your Work</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 cursor-pointer">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="grid grid-cols-6 gap-2 mb-4">
          {questions.map((q, idx) => {
            const answered = state.answers[q.id] !== undefined && state.answers[q.id] !== "";
            const flagged = state.flaggedForReview.includes(q.id);
            const isCurrent = idx === state.currentQuestionIndex;
            return (
              <button
                key={q.id}
                onClick={() => { dispatch({ type: "GO_TO_QUESTION", index: idx }); onClose(); }}
                className={`h-10 rounded-lg text-sm font-medium transition-colors cursor-pointer relative ${
                  isCurrent
                    ? "ring-2 ring-[#1a73e8] ring-offset-2"
                    : ""
                } ${
                  flagged
                    ? "bg-red-50 text-red-600 border border-red-300"
                    : answered
                    ? "bg-[#1a73e8] text-white"
                    : "bg-white text-gray-600 border border-gray-300"
                }`}
              >
                {q.questionNumber}
                {flagged && (
                  <svg className="absolute -top-1 -right-1 w-3.5 h-3.5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M5 2h10l-3 6 3 6H5l3-6-3-6z" />
                  </svg>
                )}
              </button>
            );
          })}
        </div>

        <div className="flex items-center gap-4 text-xs text-gray-500 border-t border-gray-100 pt-3 mb-4">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded bg-[#1a73e8]" />
            Answered
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded bg-white border border-gray-300" />
            Unanswered
          </div>
          <div className="flex items-center gap-1.5">
            <svg className="w-3 h-3 text-red-500" fill="currentColor" viewBox="0 0 20 20">
              <path d="M5 2h10l-3 6 3 6H5l3-6-3-6z" />
            </svg>
            For Review
          </div>
        </div>

        <button onClick={handleSubmit} className="w-full py-2.5 bg-[#1a73e8] text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors cursor-pointer text-sm">
          Review All & Submit
        </button>
      </div>
    </div>
  );
}

export default function NavigationPanel() {
  const { state, dispatch } = useTest();
  const [showGrid, setShowGrid] = useState(false);
  const [showSubmitConfirm, setShowSubmitConfirm] = useState(false);
  const currentMod = state.modules[0];
  const questions = currentMod?.questions ?? [];
  const totalQ = questions.length;
  const isFirst = state.currentQuestionIndex === 0;
  const isLast = state.currentQuestionIndex >= totalQ - 1;
  const answeredCount = Object.keys(state.answers).length;
  const currentQ = questions[state.currentQuestionIndex];
  const isFlagged = currentQ ? state.flaggedForReview.includes(currentQ.id) : false;

  return (
    <>
      {showSubmitConfirm && (
        <ConfirmDialog
          message="Are you sure you want to submit this module? Unanswered questions will be marked as skipped."
          onConfirm={() => { dispatch({ type: "END_MODULE" }); setShowSubmitConfirm(false); }}
          onCancel={() => setShowSubmitConfirm(false)}
        />
      )}
      <div className="h-14 bg-white border-t border-slate-200 flex items-center px-4 justify-between shrink-0">
        <div className="w-[120px]">
          <button
            onClick={() => dispatch({ type: "PREV_QUESTION" })}
            disabled={isFirst}
            className="px-4 py-2 text-sm border border-slate-200 rounded-lg hover:bg-slate-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer text-slate-700"
          >
            Back
          </button>
        </div>

        <button
          onClick={() => setShowGrid(true)}
          className="text-sm font-medium text-slate-600 bg-slate-50 border border-slate-200 hover:bg-slate-100 hover:text-slate-800 transition-colors px-4 py-1.5 rounded-full cursor-pointer"
        >
          Question {currentQ?.questionNumber ?? 1} of {totalQ}
        </button>

        <div className="w-[120px] flex justify-end">
          <button
            onClick={() => {
              if (isLast) {
                if (state.currentSection === "math" && state.currentModule > 1) {
                  dispatch({ type: "SHOW_REVIEW" });
                } else {
                  setShowSubmitConfirm(true);
                }
              } else {
                dispatch({ type: "NEXT_QUESTION" });
              }
            }}
            className="px-5 py-2 text-sm bg-[#1a73e8] text-white rounded-lg hover:bg-blue-700 transition-colors cursor-pointer font-semibold"
          >
            {isLast ? "Review & Submit" : "Next"}
          </button>
        </div>
      </div>

      {showGrid && (
        <QuestionGrid
          questions={questions}
          onClose={() => setShowGrid(false)}
        />
      )}
    </>
  );
}
