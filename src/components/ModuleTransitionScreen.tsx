"use client";

import { useTest } from "@/lib/TestContext";
import { useEffect } from "react";

export default function ModuleTransitionScreen() {
  const { state, dispatch } = useTest();

  useEffect(() => {
    const id = setTimeout(() => {
      dispatch({ type: "FINISH_TRANSITION" });
    }, 5000);
    return () => clearTimeout(id);
  }, [dispatch]);

  const sectionLabel = state.currentSection === "reading" ? "Reading and Writing" : "Math";
  const nextName = state.nextSectionName || `Module ${state.currentModule + 1} — ${sectionLabel}`;

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4">
      <div className="w-full max-w-md text-center">
        <div className="w-16 h-16 border-4 border-blue-primary border-t-transparent rounded-full animate-spin mx-auto mb-6" />

        <p className="text-gray-800 text-xl font-semibold mb-3">
          {nextName} is starting
        </p>

        <p className="text-gray-500 text-sm leading-relaxed">
          Do not turn off or switch the laptop or close the window.
        </p>
      </div>
    </div>
  );
}
