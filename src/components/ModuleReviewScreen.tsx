"use client";

import { useTest } from "@/lib/TestContext";
import { useState } from "react";

function ConfirmModal({ onConfirm, onCancel }: { onConfirm: () => void; onCancel: () => void }) {
  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-sm mx-4 p-6 text-center">
        <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-6 h-6 text-[#1a73e8]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M12 2a10 10 0 100 20 10 10 0 000-20z" />
          </svg>
        </div>
        <h3 className="text-lg font-bold text-gray-800 mb-2">Submit Module?</h3>
        <p className="text-gray-600 text-sm mb-6">
          Once you submit this module, you cannot go back and change your answers. Do you want to proceed?
        </p>
        <div className="flex gap-3">
          <button onClick={onCancel} className="flex-1 py-2.5 border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer font-medium text-sm">
            Cancel
          </button>
          <button onClick={onConfirm} className="flex-1 py-2.5 bg-[#1a73e8] text-white rounded-lg hover:bg-blue-700 transition-colors cursor-pointer font-medium text-sm">
            Submit
          </button>
        </div>
      </div>
    </div>
  );
}

export default function ModuleReviewScreen() {
  const { state, dispatch } = useTest();
  const [showConfirm, setShowConfirm] = useState(false);

  const currentMod = state.modules[0];
  if (!currentMod) return null;

  const questions = currentMod.questions;
  const totalAnswered = questions.filter((q) => state.answers[q.id] !== undefined && state.answers[q.id] !== "").length;
  const unansweredCount = questions.length - totalAnswered;
  const flaggedCount = questions.filter((q) => state.flaggedForReview.includes(q.id)).length;
  const timeExpired = state.timeRemaining <= 0;

  const sectionLabel = state.currentSection === "reading" ? "Reading and Writing" : "Math";

  const handleSubmit = () => {
    setShowConfirm(false);
    dispatch({ type: "CONFIRM_SUBMIT" });
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4">
      <div className="w-full max-w-lg">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-1">Review Your Work</h1>
          <p className="text-gray-500 text-sm">
            Module {state.currentModule} — {sectionLabel}
          </p>
        </div>

        {timeExpired && (
          <div className="text-center mb-4 text-sm text-amber-700 bg-amber-50 rounded-lg px-4 py-2">
            Time has expired for this module. Please submit to proceed.
          </div>
        )}

        <div className="flex items-center justify-center gap-6 mb-6">
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-800">{totalAnswered}</div>
            <div className="text-xs text-gray-500">Answered</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-800">{unansweredCount}</div>
            <div className="text-xs text-gray-500">Unanswered</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-800">{flaggedCount}</div>
            <div className="text-xs text-gray-500">Flagged for Review</div>
          </div>
        </div>

        <div className="grid grid-cols-5 gap-2 mb-6">
          {questions.map((q, idx) => {
            const answered = state.answers[q.id] !== undefined && state.answers[q.id] !== "";
            const flagged = state.flaggedForReview.includes(q.id);
            return (
              <button
                key={q.id}
                onClick={() => {
                  if (!timeExpired) {
                    dispatch({ type: "REVIEW_GO_TO_QUESTION", index: idx });
                  }
                }}
                className={`h-12 rounded-lg text-sm font-medium transition-colors relative ${
                  timeExpired ? "cursor-default" : "cursor-pointer"
                }`}
              >
                <div className={`w-full h-full flex items-center justify-center rounded-lg ${
                  answered
                    ? "bg-[#1a73e8] text-white"
                    : "bg-white text-gray-600 border-2 border-gray-300"
                } ${timeExpired ? "opacity-60" : ""}`}>
                  {q.questionNumber}
                </div>
                {flagged && (
                  <svg className="absolute -top-1.5 -right-1.5 w-4 h-4 text-red-500 drop-shadow-sm" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M5 2h10l-3 6 3 6H5l3-6-3-6z" />
                  </svg>
                )}
              </button>
            );
          })}
        </div>

        <div className="flex items-center justify-center gap-4 text-xs text-gray-500 mb-6">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded bg-[#1a73e8]" />
            Answered
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded bg-white border-2 border-gray-300" />
            Unanswered
          </div>
          <div className="flex items-center gap-1.5">
            <svg className="w-3 h-3 text-red-500" fill="currentColor" viewBox="0 0 20 20">
              <path d="M5 2h10l-3 6 3 6H5l3-6-3-6z" />
            </svg>
            Flagged
          </div>
        </div>

        <div className="flex gap-3">
          <button
            onClick={() => dispatch({ type: "HIDE_REVIEW" })}
            className="flex-1 py-3 bg-white border-2 border-gray-200 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
          >
            Back to Questions
          </button>
          <button
            onClick={() => setShowConfirm(true)}
            className="flex-1 py-3 bg-[#1a73e8] text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors cursor-pointer"
          >
            Submit Module
          </button>
        </div>
      </div>

      {showConfirm && (
        <ConfirmModal
          onConfirm={handleSubmit}
          onCancel={() => setShowConfirm(false)}
        />
      )}
    </div>
  );
}
