"use client";

import { useState, useEffect, useCallback } from "react";
import { Calendar, Clock } from "lucide-react";

const SAT_DATES = [
  { label: "August 22, 2026", value: "2026-08-22" },
  { label: "October 3, 2026", value: "2026-10-03" },
  { label: "November 7, 2026", value: "2026-11-07" },
  { label: "December 5, 2026", value: "2026-12-05" },
];

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

export default function CountdownTimer() {
  const [targetDate, setTargetDate] = useState<string | null>(null);
  const [remaining, setRemaining] = useState<ReturnType<typeof getRemaining> | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem("satExamDate");
    if (stored) {
      setTargetDate(stored);
      setRemaining(getRemaining(new Date(`${stored}T08:00:00`)));
    }
  }, []);

  useEffect(() => {
    if (!targetDate) return;
    const interval = setInterval(() => {
      setRemaining(getRemaining(new Date(`${targetDate}T08:00:00`)));
    }, 1000);
    return () => clearInterval(interval);
  }, [targetDate]);

  const handleSetDate = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    const date = e.target.value;
    if (date) {
      localStorage.setItem("satExamDate", date);
      setTargetDate(date);
      setRemaining(getRemaining(new Date(`${date}T08:00:00`)));
    }
  }, []);

  const handleClear = useCallback(() => {
    localStorage.removeItem("satExamDate");
    setTargetDate(null);
    setRemaining(null);
  }, []);

  if (!targetDate || !remaining) {
    return (
      <div className="bg-white rounded-xl shadow-md border border-slate-200 p-8 text-center">
        <div className="flex items-center justify-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-lg bg-red-50 flex items-center justify-center">
            <Calendar className="w-5 h-5 text-red-600" />
          </div>
          <div>
            <h3 className="font-semibold text-slate-800">SAT Exam Countdown</h3>
            <p className="text-sm text-slate-500">Select your exam date</p>
          </div>
        </div>
        <select
          onChange={handleSetDate}
          value=""
          className="w-full max-w-xs mx-auto px-4 py-3 border border-slate-200 rounded-lg text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 cursor-pointer bg-white"
        >
          <option value="" disabled>Choose an SAT test date</option>
          {SAT_DATES.map((d) => (
            <option key={d.value} value={d.value}>{d.label}</option>
          ))}
        </select>
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
    <div className="bg-white rounded-xl shadow-md border border-slate-200 p-8 text-center">
      <div className="flex items-center justify-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-lg bg-red-50 flex items-center justify-center">
          <Clock className="w-5 h-5 text-red-600" />
        </div>
        <div>
          <h3 className="font-semibold text-slate-800">Countdown to SAT</h3>
          <p className="text-sm text-slate-400">
            {SAT_DATES.find((d) => d.value === targetDate)?.label} &middot; 8:00 AM
          </p>
        </div>
      </div>
      <div className="flex justify-center gap-3 mb-4">
        {units.map((unit) => (
          <div key={unit.label} className="text-center bg-red-50 rounded-lg py-3 px-4 min-w-[72px]">
            <div className="text-3xl font-bold text-red-600 tabular-nums tracking-tight">
              {String(unit.value).padStart(2, "0")}
            </div>
            <div className="text-xs text-red-500 mt-1 font-medium">{unit.label}</div>
          </div>
        ))}
      </div>
      <button
        onClick={handleClear}
        className="text-xs text-slate-400 hover:text-slate-600 bg-slate-50 px-3 py-1.5 rounded-md transition-colors cursor-pointer"
      >
        Change date
      </button>
    </div>
  );
}
