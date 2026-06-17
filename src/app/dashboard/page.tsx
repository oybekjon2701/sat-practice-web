"use client";

import { useState, useEffect, useRef } from "react";
import { useUser, useClerk } from "@clerk/nextjs";
import Link from "next/link";
import { ArrowRight, BookOpen, Video, BookMarked, Sparkles, ShieldCheck, Calendar, LogOut, Clock } from "lucide-react";
import { getUnfinishedTests } from "@/lib/unfinishedTestsStore";

const SAT_DATES = [
  { label: "August 22, 2026", value: "2026-08-22" },
  { label: "October 3, 2026", value: "2026-10-03" },
  { label: "November 7, 2026", value: "2026-11-07" },
  { label: "December 5, 2026", value: "2026-12-05" },
  { label: "March 13, 2027", value: "2027-03-13" },
  { label: "May 8, 2027", value: "2027-05-08" },
  { label: "June 5, 2027", value: "2027-06-05" },
];

function getRemaining(target: number) {
  const diff = target - Date.now();
  if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0, expired: true };
  return {
    days: Math.floor(diff / 86400000),
    hours: Math.floor((diff % 86400000) / 3600000),
    minutes: Math.floor((diff % 3600000) / 60000),
    seconds: Math.floor((diff % 60000) / 1000),
    expired: false,
  };
}

export default function Dashboard() {
  const { user, isSignedIn } = useUser();
  const { signOut } = useClerk();
  const [savedDate, setSavedDate] = useState<string | null>(null);
  const [remaining, setRemaining] = useState<ReturnType<typeof getRemaining> | null>(null);
  const [selected, setSelected] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [unfinished, setUnfinished] = useState<any[]>([]);

  useEffect(() => {
    if (!isSignedIn || !user) { setUnfinished([]); return; }
    const email = user.emailAddresses?.[0]?.emailAddress || user.id || "";
    if (!email) return;
    setUnfinished(getUnfinishedTests(email));
  }, [isSignedIn, user]);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setShowDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  useEffect(() => {
    const stored = localStorage.getItem("satExamData");
    if (stored) {
      try {
        const data = JSON.parse(stored);
        if (data.ts) {
          setSavedDate(stored);
          setRemaining(getRemaining(data.ts));
        }
      } catch (_e) { /* migrate old format */ }
    }
  }, []);

  useEffect(() => {
    if (!savedDate) return;
    const data = JSON.parse(savedDate);
    const interval = setInterval(() => {
      setRemaining(getRemaining(data.ts));
    }, 1000);
    return () => clearInterval(interval);
  }, [savedDate]);

  function handleSave() {
    if (!selected) return;
    const label = SAT_DATES.find((d) => d.value === selected)?.label || selected;
    const target = new Date(`${selected}T08:00:00+05:00`).getTime();
    const data = JSON.stringify({ ts: target, date: selected, label });
    localStorage.setItem("satExamData", data);
    setSavedDate(data);
    setRemaining(getRemaining(target));
  }

  function handleClear() {
    localStorage.removeItem("satExamData");
    setSavedDate(null);
    setRemaining(null);
  }

  let examLabel = "";
  if (savedDate) {
    try { examLabel = JSON.parse(savedDate).label; } catch (_e) {}
  }

  return (
    <div className="min-h-screen bg-sat-bg">
      <header className="flex items-center justify-between px-6 md:px-10 py-4 bg-white border-b border-slate-200">
        <Link href="/dashboard">
          <div className="flex items-baseline gap-1">
            <span className="text-xl font-bold text-slate-800">satzone.</span>
            <span className="text-[10px] font-bold text-sat-teal tracking-[2px]">SAT CENTER</span>
          </div>
        </Link>
        <nav className="hidden sm:flex items-center gap-6">
          <Link href="/my-tests" className="text-sm font-medium text-slate-600 hover:text-slate-800">My Tests</Link>
          <Link href="/my-results" className="text-sm font-medium text-slate-600 hover:text-slate-800">My Results</Link>
          <Link href="#courses" className="text-sm font-medium text-slate-600 hover:text-slate-800">Courses</Link>
          <Link href="/pricing" className="text-sm font-medium text-slate-600 hover:text-slate-800">Pricing</Link>
        </nav>
        {isSignedIn ? (
          <div className="flex items-center gap-3 relative" ref={dropdownRef}>
            <button onClick={() => setShowDropdown(!showDropdown)} className="text-sm text-slate-600 hover:text-slate-800 font-medium cursor-pointer">
              {user?.firstName || user?.fullName || user?.emailAddresses?.[0]?.emailAddress || ""}
            </button>
            {showDropdown && (
              <div className="absolute top-full right-0 mt-2 bg-white border border-slate-200 rounded-lg shadow-lg py-1 min-w-[140px] z-50">
                <button onClick={() => { setShowDropdown(false); signOut(); }} className="w-full text-left flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50">
                  <LogOut className="w-3.5 h-3.5" /> Sign out
                </button>
              </div>
            )}
          </div>
        ) : (
          <Link href="/sign-in" className="bg-sat-teal text-white text-sm font-semibold px-5 py-2 rounded-lg hover:bg-sat-teal-hover">Sign In</Link>
        )}
      </header>

      <main>
        <section className="bg-gradient-to-br from-[#1e293b] to-[#334155] text-white">
          <div className="max-w-5xl mx-auto px-6 md:px-10 py-16 md:py-20">
            <div className="grid md:grid-cols-5 gap-8 items-start">
              <div className="md:col-span-3">
                <div className="flex items-center gap-2 mb-4">
                  <Sparkles className="w-5 h-5 text-yellow-400" />
                  <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider">Official SAT Practice</span>
                </div>
                <h1 className="text-3xl md:text-5xl font-bold mb-4 leading-tight">Ace the SAT.<br />Your way.</h1>
                <p className="text-slate-300 text-base md:text-lg mb-8 max-w-xl">
                  Full-length adaptive tests, targeted practice, and video lessons — all in one place.
                </p>
                <div className="flex flex-wrap items-center gap-4">
                  <Link
                    href={isSignedIn ? "/my-tests" : "/sign-in?redirect_url=/my-tests"}
                    className="inline-flex items-center gap-2 bg-sat-teal text-white font-semibold px-6 py-3 rounded-lg hover:bg-sat-teal-hover transition-colors shadow-sm"
                  >
                    Start Full-Length Practice Test
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                  <div className="flex items-center gap-2 px-3 py-2 bg-emerald-500/15 border border-emerald-400/30 rounded-lg">
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    <span className="text-xs font-medium text-emerald-300">100% Realistic &middot; Adaptive Scoring</span>
                  </div>
                </div>
              </div>

              <div className="md:col-span-2">
                {!savedDate || !remaining ? (
                  <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-5">
                    <div className="flex items-center gap-2 mb-3">
                      <Calendar className="w-4 h-4 text-teal-400" />
                      <h3 className="text-sm font-semibold text-white">Set Your SAT Date</h3>
                    </div>
                    <select
                      value={selected}
                      onChange={(e) => setSelected(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-lg bg-white/10 border border-white/20 text-sm text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500/50 appearance-none cursor-pointer mb-3"
                    >
                      <option value="" className="text-slate-800">Choose an exam date</option>
                      {SAT_DATES.map((d) => (
                        <option key={d.value} value={d.value} className="text-slate-800">{d.label}</option>
                      ))}
                    </select>
                    <button
                      onClick={handleSave}
                      disabled={!selected}
                      className="w-full bg-teal-500 text-white text-sm font-semibold py-2.5 rounded-lg hover:bg-teal-400 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      Save &amp; Start Countdown
                    </button>
                  </div>
                ) : (
                  <div className="text-center">
                    <button onClick={handleClear} className="text-[11px] text-slate-400 hover:text-white transition-colors mb-4 inline-block">
                      Change date
                    </button>
                    <div className="flex items-center justify-center gap-1 select-none">
                      <div className="text-center">
                        <span className="text-5xl md:text-6xl font-black text-red-deep tabular-nums drop-shadow-[0_0_10px_rgba(220,38,38,0.5)] leading-none">
                          {String(remaining.days).padStart(2, "0")}
                        </span>
                        <div className="text-[11px] text-slate-400 mt-1 uppercase tracking-wider">Days</div>
                      </div>
                      <span className="text-4xl md:text-5xl font-black text-red-deep mx-0.5 mt-[-1.5rem] opacity-60">:</span>
                      <div className="text-center">
                        <span className="text-5xl md:text-6xl font-black text-red-deep tabular-nums drop-shadow-[0_0_10px_rgba(220,38,38,0.5)] leading-none">
                          {String(remaining.hours).padStart(2, "0")}
                        </span>
                        <div className="text-[11px] text-slate-400 mt-1 uppercase tracking-wider">Hours</div>
                      </div>
                      <span className="text-4xl md:text-5xl font-black text-red-deep mx-0.5 mt-[-1.5rem] opacity-60">:</span>
                      <div className="text-center">
                        <span className="text-5xl md:text-6xl font-black text-red-deep tabular-nums drop-shadow-[0_0_10px_rgba(220,38,38,0.5)] leading-none">
                          {String(remaining.minutes).padStart(2, "0")}
                        </span>
                        <div className="text-[11px] text-slate-400 mt-1 uppercase tracking-wider">Minutes</div>
                      </div>
                      <span className="text-4xl md:text-5xl font-black text-red-deep mx-0.5 mt-[-1.5rem] opacity-60">:</span>
                      <div className="text-center">
                        <span className="text-5xl md:text-6xl font-black text-red-deep tabular-nums drop-shadow-[0_0_10px_rgba(220,38,38,0.5)] leading-none">
                          {String(remaining.seconds).padStart(2, "0")}
                        </span>
                        <div className="text-[11px] text-slate-400 mt-1 uppercase tracking-wider">Seconds</div>
                      </div>
                    </div>
                    <p className="text-base font-bold text-red-300 mt-5">until your exam</p>
                    {remaining.expired && <p className="text-xs text-yellow-400 mt-3">Your exam date has passed. Set a new one.</p>}
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        {unfinished.length > 0 && (
          <section className="max-w-5xl mx-auto px-6 md:px-10 -mt-4">
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 md:p-5">
              <div className="flex items-center gap-2 mb-3">
                <Clock className="w-4 h-4 text-amber-600" />
                <h2 className="text-sm font-bold text-amber-800">Unfinished Tests</h2>
              </div>
              <div className="space-y-2">
                {unfinished.map((u) => (
                  <div key={u.mockId} className="flex items-center justify-between bg-white rounded-lg border border-amber-100 px-4 py-3">
                    <div>
                      <p className="text-sm font-semibold text-slate-800">{u.mockName}</p>
                      <p className="text-xs text-slate-500">Saved {new Date(u.savedAt).toLocaleString()}</p>
                    </div>
                    <Link
                      href={`/test?mockId=${u.mockId}&resume=1`}
                      className="text-sm font-semibold text-amber-700 hover:text-amber-900 bg-amber-100 hover:bg-amber-200 px-4 py-1.5 rounded-lg transition-colors"
                    >
                      Resume
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        <section className="max-w-5xl mx-auto px-6 md:px-10 -mt-4">
          <div className="bg-white rounded-xl shadow-md border border-slate-200 p-6 md:p-8">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-lg md:text-xl font-bold text-slate-800">Full-Length Practice Tests</h2>
                <p className="text-sm text-slate-500 mt-1">Realistic Bluebook-style tests with adaptive modules, instant scoring, and detailed review.</p>
              </div>
              <span className="shrink-0 text-[11px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full">FREE</span>
            </div>
            <div className="mt-5 flex flex-wrap items-center gap-4 md:gap-8 text-sm text-slate-600">
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 rounded bg-teal-50 flex items-center justify-center text-[10px] font-bold text-sat-teal">RW</div>
                <span>Reading &amp; Writing</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 rounded bg-teal-50 flex items-center justify-center text-[10px] font-bold text-sat-teal">M</div>
                <span>Math</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 rounded bg-teal-50 flex items-center justify-center text-[10px] font-bold text-sat-teal">2</div>
                <span>Adaptive Modules</span>
              </div>
            </div>
            <div className="mt-6 flex items-center gap-3">
              <Link
                href={isSignedIn ? "/my-tests" : "/sign-in?redirect_url=/my-tests"}
                className="inline-flex items-center gap-2 bg-sat-teal text-white font-semibold px-5 py-2.5 rounded-lg hover:bg-sat-teal-hover transition-colors text-sm"
              >
                {isSignedIn ? "Take a Test" : "Start Free Practice"}
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
              <span className="text-xs text-emerald-600 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-full font-medium">Free for 2 months</span>
            </div>
          </div>
        </section>

        <section id="courses" className="max-w-5xl mx-auto px-6 md:px-10 mt-10 mb-16">
          <h2 className="text-xl font-bold text-slate-800 mb-6">Courses</h2>
          <div className="grid md:grid-cols-3 gap-5">
            <Link href="/themed-questions" className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 hover:shadow-md transition-shadow block">
              <div className="w-10 h-10 rounded-xl bg-teal-50 flex items-center justify-center text-sat-teal mb-4">
                <BookOpen className="w-5 h-5" />
              </div>
              <h3 className="font-semibold text-slate-800 mb-1.5">Themed Practice Questions</h3>
              <p className="text-sm text-slate-500 mb-4">Algebra, grammar, reading comprehension — sorted by topic with step-by-step explanations.</p>
              <span className="text-[11px] font-medium text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-full">Free for 2 months</span>
            </Link>

            <Link href="/video-lessons" className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 hover:shadow-md transition-shadow block">
              <div className="w-10 h-10 rounded-xl bg-teal-50 flex items-center justify-center text-sat-teal mb-4">
                <Video className="w-5 h-5" />
              </div>
              <h3 className="font-semibold text-slate-800 mb-1.5">Video Lessons</h3>
              <p className="text-sm text-slate-500 mb-4">Expert strategy guides for Reading, Writing, and Math with tips and worked examples.</p>
              <span className="text-[11px] font-medium text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-full">Free for 2 months</span>
            </Link>

            <Link href="/vocabulary" className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 hover:shadow-md transition-shadow block">
              <div className="w-10 h-10 rounded-xl bg-teal-50 flex items-center justify-center text-sat-teal mb-4">
                <BookMarked className="w-5 h-5" />
              </div>
              <h3 className="font-semibold text-slate-800 mb-1.5">Vocabulary Cards</h3>
              <p className="text-sm text-slate-500 mb-4">Curated SAT vocabulary with spaced repetition, example sentences, and quizzes.</p>
              <span className="text-[11px] font-medium text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-full">Free for 2 months</span>
            </Link>
          </div>
        </section>

        <section className="bg-gradient-to-br from-[#0d9488] to-[#0f766e] text-white">
          <div className="max-w-5xl mx-auto px-6 md:px-10 py-12 text-center">
            <h2 className="text-2xl font-bold mb-3">Everything free for 2 months</h2>
            <p className="text-teal-100 text-sm mb-2 max-w-md mx-auto">All full-length tests, themed questions, video lessons, and vocabulary — completely unlocked.</p>
            <p className="text-teal-200 text-xs mb-6">No payment. No limits. Just focused SAT prep.</p>
            <Link
              href="/my-tests"
              className="inline-flex items-center gap-2 bg-white text-sat-teal font-semibold px-6 py-3 rounded-lg hover:bg-slate-100 transition-colors text-sm"
            >
              Start a full test
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </section>
      </main>

      <footer className="bg-white border-t border-slate-200 py-8 text-center text-sm text-slate-400">
        &copy; 2026 satzone. All rights reserved.
      </footer>
    </div>
  );
}
