"use client";

import { useTest } from "@/lib/TestContext";
import { useState } from "react";
import { Question } from "@/types";

function ConfirmDialog({ message, onConfirm, onCancel }: { message: string; onConfirm: () => void; onCancel: () => void }) {
  return (
    <div className="fixed inset-0 z-[60] bg-black/50 flex items-center justify-center">
      <div className="bg-white border border-gray-200 w-full max-w-sm mx-4 p-6 text-center rounded-2xl shadow-lg" style={{ fontFamily: "Arial, sans-serif" }}>
        <p className="text-gray-800 font-semibold mb-4 text-sm">{message}</p>
        <div className="flex gap-3 justify-center">
          <button onClick={onCancel} className="px-5 py-2 text-sm border border-gray-200 hover:bg-gray-50 cursor-pointer text-gray-600 bg-white rounded-full">Cancel</button>
          <button onClick={onConfirm} className="px-5 py-2 text-sm bg-primary text-white hover:bg-primary-hover cursor-pointer font-medium rounded-full">Confirm</button>
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
    <div className="fixed inset-0 z-50 bg-black/50 flex items-start justify-center pt-16">
      {showConfirm && (
        <ConfirmDialog
          message="Are you sure you want to submit this module? Unanswered questions will be marked as skipped."
          onConfirm={() => { dispatch({ type: "END_MODULE" }); setShowConfirm(false); }}
          onCancel={() => setShowConfirm(false)}
        />
      )}
      <div className="bg-white border border-gray-200 w-full max-w-lg mx-4 p-5 rounded-2xl shadow-lg" style={{ fontFamily: "Arial, sans-serif" }}>
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-bold text-gray-800 text-base">Check Your Work</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 cursor-pointer">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="grid grid-cols-6 gap-1.5 mb-4">
          {questions.map((q, idx) => {
            const answered = state.answers[q.id] !== undefined && state.answers[q.id] !== "";
            const flagged = state.flaggedForReview.includes(q.id);
            const isCurrent = idx === state.currentQuestionIndex;
            return (
              <button
                key={q.id}
                onClick={() => { dispatch({ type: "GO_TO_QUESTION", index: idx }); onClose(); }}
                className={`h-9 text-xs font-medium cursor-pointer rounded-lg ${
                  isCurrent ? "ring-2 ring-primary ring-offset-2" : ""
                } ${
                  flagged ? "bg-red-50 text-red-600 border border-red-300" : answered ? "bg-primary text-white border border-primary" : "bg-white text-gray-600 border border-gray-300"
                }`}
              >
                {q.questionNumber}
              </button>
            );
          })}
        </div>

        <div className="flex items-center gap-4 text-xs text-gray-500 border-t border-gray-100 pt-3 mb-4">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-sm bg-primary" />Answered
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-sm bg-white border border-gray-300" />Unanswered
          </div>
          <div className="flex items-center gap-1.5">
            <svg className="w-3 h-3 text-red-500" fill="currentColor" viewBox="0 0 20 20"><path d="M5 2h10l-3 6 3 6H5l3-6-3-6z" /></svg>For Review
          </div>
        </div>

        <button onClick={handleSubmit} className="w-full py-2.5 bg-primary text-white font-semibold text-sm hover:bg-primary-hover cursor-pointer rounded-full">
          Review All &amp; Submit
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
  const isLast = state.currentQuestionIndex >= totalQ - 1;

  return (
    <>
      {showSubmitConfirm && (
        <ConfirmDialog
          message="Are you sure you want to submit this module? Unanswered questions will be marked as skipped."
          onConfirm={() => { dispatch({ type: "END_MODULE" }); setShowSubmitConfirm(false); }}
          onCancel={() => setShowSubmitConfirm(false)}
        />
      )}
      <div className="h-16 bg-header-bg flex items-center px-6 justify-between shrink-0" style={{ fontFamily: "Arial, sans-serif", borderTop: "3px solid transparent", backgroundImage: "repeating-linear-gradient(to right, #000 0, #000 14px, transparent 14px, transparent 22px)", backgroundRepeat: "no-repeat", backgroundSize: "100% 3px", backgroundPosition: "top" }}>
        <div className="flex items-center gap-2 w-40">
          <span className="text-xs text-gray-500 font-medium">{state.userName || "Student"}</span>
        </div>

        <button
          onClick={() => setShowGrid(true)}
          className="h-9 px-5 bg-gray-900 text-white text-sm font-semibold cursor-pointer rounded-full hover:bg-gray-800 transition-colors shadow-sm"
        >
          Question {isNaN(state.currentQuestionIndex + 1) ? "?" : state.currentQuestionIndex + 1} of {totalQ}
        </button>

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
          className="h-10 px-8 text-sm bg-primary text-white hover:bg-primary-hover cursor-pointer font-semibold rounded-full transition-colors shadow-sm flex items-center justify-center"
        >
          {isLast ? "Submit" : "Next"}
        </button>
      </div>

      {showGrid && <QuestionGrid questions={questions} onClose={() => setShowGrid(false)} />}
    </>
  );
}
