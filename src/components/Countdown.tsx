"use client";

import { useState, useEffect, useCallback } from "react";
import { Calendar, Clock } from "lucide-react";

function getRemaining(target: Date) {
  const diff = target.getTime() - Date.now();
  if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0, expired: true };
  return {
    days: Math.floor(diff / 86400000),
    hours: Math.floor((diff % 86400000) / 3600000),
    minutes: Math.floor((diff % 3600000) / 60000),
    seconds: Math.floor((diff % 60000) / 1000),
    expired: false,
  };
}

export default function Countdown() {
  const [targetDate, setTargetDate] = useState<string | null>(null);
  const [remaining, setRemaining] = useState<ReturnType<typeof getRemaining> | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem("satExamDate");
    if (stored) {
      setTargetDate(stored);
      setRemaining(getRemaining(new Date(stored)));
    }
  }, []);

  useEffect(() => {
    if (!targetDate) return;
    const interval = setInterval(() => {
      setRemaining(getRemaining(new Date(targetDate)));
    }, 1000);
    return () => clearInterval(interval);
  }, [targetDate]);

  const handleSetDate = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const date = e.target.value;
    if (date) {
      localStorage.setItem("satExamDate", date);
      setTargetDate(date);
      setRemaining(getRemaining(new Date(date)));
    }
  }, []);

  const handleClear = useCallback(() => {
    localStorage.removeItem("satExamDate");
    setTargetDate(null);
    setRemaining(null);
  }, []);

  if (!targetDate || !remaining) {
    return (
      <div className="bg-white rounded-2xl border border-gray-200 p-6">
        <div className="flex items-center gap-2 mb-4">
          <Calendar className="w-5 h-5 text-[#FF6B00]" />
          <h3 className="font-semibold text-gray-800">SAT Exam Countdown</h3>
        </div>
        <p className="text-sm text-gray-500 mb-4">Set your SAT exam date to see a live countdown.</p>
        <input
          type="date"
          onChange={handleSetDate}
          className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#FF6B00]/20 focus:border-[#FF6B00] cursor-pointer"
        />
      </div>
    );
  }

  const units = [
    { label: "Days", value: remaining.days },
    { label: "Hours", value: remaining.hours },
    { label: "Minutes", value: remaining.minutes },
    { label: "Seconds", value: remaining.seconds },
  ];

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Clock className="w-5 h-5 text-[#FF6B00]" />
          <h3 className="font-semibold text-gray-800">Countdown to SAT</h3>
        </div>
        <button
          onClick={handleClear}
          className="text-xs text-gray-400 hover:text-gray-600 cursor-pointer"
        >
          Change date
        </button>
      </div>
      <div className="grid grid-cols-4 gap-3">
        {units.map((unit) => (
          <div key={unit.label} className="text-center">
            <div className="text-2xl font-bold text-gray-800 tabular-nums">
              {String(unit.value).padStart(2, "0")}
            </div>
            <div className="text-xs text-gray-400 mt-0.5">{unit.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
