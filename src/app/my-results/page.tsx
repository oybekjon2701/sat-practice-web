"use client";

import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Trophy, Clock, ArrowLeft, ChevronDown, ChevronUp, BarChart3, BookOpen, Calculator } from "lucide-react";

interface TestResult {
  id: string;
  testId: string;
  testName: string;
  totalScore: number;
  readingScore: number;
  mathScore: number;
  readingCorrect: number;
  readingTotal: number;
  mathCorrect: number;
  mathTotal: number;
  completedAt: string;
}

function ScoreRing({ score, label, color, maxScore = 800 }: { score: number; label: string; color: string; maxScore?: number }) {
  const radius = 40;
  const circumference = 2 * Math.PI * radius;
  const pct = Math.min(1, score / maxScore);
  const offset = circumference * (1 - pct);
  return (
    <div className="flex flex-col items-center">
      <div className="relative w-24 h-24">
        <svg className="w-24 h-24 -rotate-90" viewBox="0 0 100 100">
          <circle cx="50" cy="50" r={radius} fill="none" stroke="#e5e7eb" strokeWidth="7" />
          <circle cx="50" cy="50" r={radius} fill="none" stroke={color} strokeWidth="7" strokeLinecap="round" strokeDasharray={circumference} strokeDashoffset={offset} />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-xl font-bold text-gray-800">{score}</span>
        </div>
      </div>
      <span className="text-xs text-gray-500 mt-1">{label}</span>
    </div>
  );
}

export default function MyResultsPage() {
  const { user, isLoaded, isSignedIn } = useUser();
  const router = useRouter();
  const [results, setResults] = useState<TestResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      router.push("/sign-in");
    }
  }, [isLoaded, isSignedIn, router]);

  useEffect(() => {
    if (!isSignedIn || !user) return;
    fetch("/api/test-results")
      .then((r) => r.json())
      .then((data) => { setResults(Array.isArray(data) ? data : []); setLoading(false); })
      .catch(() => setLoading(false));
  }, [isSignedIn, user]);

  if (!isLoaded || !isSignedIn || !user) return null;

  const inCorrect = (r: TestResult) => (r.readingTotal + r.mathTotal) - (r.readingCorrect + r.mathCorrect);
  const totalQ = (r: TestResult) => r.readingTotal + r.mathTotal;

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="flex items-center justify-between px-6 md:px-10 py-4 bg-white border-b border-slate-200">
        <Link href="/dashboard">
          <div className="flex items-baseline gap-1">
            <span className="text-xl font-bold text-slate-800">satzone.</span>
            <span className="text-[10px] font-bold text-sat-teal tracking-[2px]">SAT CENTER</span>
          </div>
        </Link>
        <nav className="flex items-center gap-6">
          <Link href="/my-tests" className="text-sm font-medium text-slate-600 hover:text-slate-800">My Tests</Link>
          <Link href="/my-results" className="text-sm font-medium text-sat-teal font-bold">My Results</Link>
          <Link href="/dashboard" className="text-sm font-medium text-slate-600 hover:text-slate-800">Dashboard</Link>
        </nav>
      </header>

      <div className="max-w-3xl mx-auto px-4 py-10">
        <div className="flex items-center gap-3 mb-8">
          <Link href="/dashboard" className="text-slate-400 hover:text-slate-600">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-sat-teal" />
              <h1 className="text-2xl font-bold text-slate-800">My Results</h1>
            </div>
            <p className="text-sm text-slate-500 mt-0.5">All your completed practice test scores</p>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-12 text-slate-500 text-sm">Loading results...</div>
        ) : results.length === 0 ? (
          <div className="bg-white rounded-xl border border-slate-200 p-12 text-center">
            <Trophy className="w-12 h-12 text-slate-300 mx-auto mb-4" />
            <h2 className="text-lg font-semibold text-slate-700 mb-2">No results yet</h2>
            <p className="text-sm text-slate-500 mb-6">Complete a practice test to see your results here.</p>
            <Link href="/my-tests" className="inline-flex items-center gap-1.5 bg-sat-teal text-white font-semibold px-5 py-2.5 rounded-lg hover:bg-sat-teal-hover transition-colors text-sm">
              Take a Test
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {results.map((r) => {
              const isExpanded = expandedId === r.id;
              const correct = r.readingCorrect + r.mathCorrect;
              const incorrect = inCorrect(r);
              const total = totalQ(r);
              return (
                <div key={r.id} className="bg-white rounded-xl border border-slate-200 overflow-hidden">
                  <button
                    onClick={() => setExpandedId(isExpanded ? null : r.id)}
                    className="w-full flex items-center justify-between p-4 md:p-5 hover:bg-slate-50 transition-colors cursor-pointer text-left"
                  >
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${r.totalScore >= 1200 ? "bg-emerald-50 text-emerald-600" : "bg-blue-50 text-blue-600"}`}>
                        <Trophy className="w-6 h-6" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-slate-800">{r.testName}</h3>
                        <div className="flex items-center gap-2 mt-1 text-xs text-slate-500">
                          <Clock className="w-3 h-3" />
                          <span>{new Date(r.completedAt).toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <div className="text-lg font-bold text-slate-800">{r.totalScore}</div>
                        <div className="text-[10px] text-slate-400 uppercase tracking-wider">Total</div>
                      </div>
                      {isExpanded ? <ChevronUp className="w-5 h-5 text-slate-400" /> : <ChevronDown className="w-5 h-5 text-slate-400" />}
                    </div>
                  </button>

                  {isExpanded && (
                    <div className="border-t border-slate-100 p-4 md:p-5">
                      <div className="flex justify-center gap-8 mb-6">
                        <ScoreRing score={r.readingScore} label="Reading & Writing" color="#1a73e8" />
                        <ScoreRing score={r.mathScore} label="Math" color="#1e8e3e" />
                      </div>

                      <div className="grid grid-cols-3 gap-3 mb-5">
                        <div className="bg-blue-50 rounded-lg p-3 text-center">
                          <div className="text-lg font-bold text-blue-700">{r.readingCorrect}/{r.readingTotal}</div>
                          <div className="text-xs text-blue-600 font-medium mt-0.5">R&W Correct</div>
                        </div>
                        <div className="bg-green-50 rounded-lg p-3 text-center">
                          <div className="text-lg font-bold text-green-700">{r.mathCorrect}/{r.mathTotal}</div>
                          <div className="text-xs text-green-600 font-medium mt-0.5">Math Correct</div>
                        </div>
                        <div className={`rounded-lg p-3 text-center ${incorrect === 0 ? "bg-emerald-50" : "bg-red-50"}`}>
                          <div className={`text-lg font-bold ${incorrect === 0 ? "text-emerald-700" : "text-red-700"}`}>{incorrect}/{total}</div>
                          <div className={`text-xs font-medium mt-0.5 ${incorrect === 0 ? "text-emerald-600" : "text-red-600"}`}>Incorrect</div>
                        </div>
                      </div>

                      <Link
                        href={`/test?mockId=${r.testId}`}
                        className="block w-full text-center py-2.5 bg-sat-teal text-white font-semibold rounded-lg hover:bg-sat-teal-hover transition-colors text-sm"
                      >
                        Retake {r.testName}
                      </Link>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
