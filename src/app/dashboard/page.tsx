"use client";

import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ShieldCheck, Sparkles, ArrowRight, BookOpen } from "lucide-react";
import CountdownTimer from "@/components/CountdownTimer";
import DashboardGrid from "@/components/DashboardGrid";

interface TestResult {
  id: string;
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

export default function MainDashboard() {
  const { user, isLoaded, isSignedIn } = useUser();
  const router = useRouter();
  const [results, setResults] = useState<TestResult[]>([]);

  useEffect(() => {
    if (isLoaded && !isSignedIn) router.push("/sign-in");
  }, [isLoaded, isSignedIn, router]);

  useEffect(() => {
    if (isSignedIn) {
      fetch("/api/test-results")
        .then((r) => r.json())
        .then((data) => setResults(Array.isArray(data) ? data : []))
        .catch(() => setResults([]));
    }
  }, [isSignedIn]);

  if (!isLoaded || !isSignedIn || !user) return null;

  const name = user.firstName || user.emailAddresses?.[0]?.emailAddress || "Student";

  return (
    <div className="min-h-screen bg-[#f8fafc]">
      <header className="flex items-center justify-between px-8 py-5 bg-white border-b border-slate-200">
        <Link href="/">
          <svg viewBox="0 0 240 60" className="h-8 w-auto" xmlns="http://www.w3.org/2000/svg">
            <text x="235" y="34" fontFamily="Arial, Helvetica, sans-serif" fontWeight="700" fontSize="24" fill="#1e293b" textAnchor="end">satzone.</text>
            <text x="235" y="52" fontFamily="Arial, Helvetica, sans-serif" fontWeight="700" fontSize="11" fill="#0d9488" textAnchor="end" letterSpacing="1.5">SAT CENTER</text>
          </svg>
        </Link>
        <nav className="flex items-center gap-6">
          <Link href="/my-tests" className="text-sm font-medium text-slate-600 hover:text-slate-800 transition-colors">Practice</Link>
          <Link href="/pricing" className="text-sm font-medium text-slate-600 hover:text-slate-800 transition-colors">Pricing</Link>
        </nav>
      </header>

      <main className="max-w-6xl mx-auto px-8 py-10">
        <div className="flex items-start justify-between mb-10">
          <div>
            <h1 className="text-2xl font-bold text-slate-800">Welcome back, {name}</h1>
            <p className="text-slate-500 text-sm mt-1">Pick up where you left off or start something new.</p>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 bg-emerald-50 border border-emerald-200 rounded-lg">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span className="text-xs font-semibold text-emerald-700">100% Authentic Material</span>
          </div>
        </div>

        <div className="bg-gradient-to-br from-[#1e293b] to-[#334155] rounded-xl shadow-md p-8 mb-8 text-white">
          <div className="flex items-center gap-2 mb-3">
            <Sparkles className="w-5 h-5 text-yellow-400" />
            <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider">Full-Length Mock Test</span>
          </div>
          <h2 className="text-2xl font-bold mb-2">Ready for a full-length practice test?</h2>
          <p className="text-slate-300 text-sm mb-6 max-w-lg">
            Simulate the real SAT experience with adaptive modules and timed sections.
          </p>
          <div className="flex items-center gap-4">
            <Link
              href="/my-tests"
              className="inline-flex items-center gap-2 bg-[#0d9488] text-white font-semibold px-6 py-3 rounded-lg hover:bg-[#0f766e] transition-colors text-sm shadow-sm"
            >
              Start Full-Length Practice Test
              <ArrowRight className="w-4 h-4" />
            </Link>
            <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-500/15 border border-emerald-400/30 rounded-lg">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-xs font-medium text-emerald-300">100% Authentic Material</span>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-10">
          <CountdownTimer />
          <div className="bg-white rounded-xl shadow-md border border-slate-200 p-8">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-lg bg-teal-50 flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-[#0d9488]" />
              </div>
              <div>
                <h3 className="font-semibold text-slate-800">Recent Activity</h3>
                <p className="text-xs text-slate-400">Your latest test results</p>
              </div>
            </div>
            {results.length === 0 ? (
              <p className="text-sm text-slate-400 py-6 text-center">No tests completed yet. Start your first practice test!</p>
            ) : (
              <div className="space-y-1">
                {results.slice(0, 4).map((r) => (
                  <div key={r.id} className="flex items-center justify-between py-3 px-3 rounded-lg hover:bg-slate-50 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-xs font-bold text-slate-500">
                        {r.totalScore >= 1200 ? "✓" : "!"}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-slate-700">{r.testName}</p>
                        <p className="text-xs text-slate-400">{new Date(r.completedAt).toLocaleDateString()}</p>
                      </div>
                    </div>
                    <span className={`text-sm font-bold ${r.totalScore >= 1200 ? "text-emerald-600" : "text-slate-400"}`}>
                      {r.totalScore}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <h2 className="text-lg font-semibold text-slate-800 mb-5">Study Resources</h2>
        <DashboardGrid />
      </main>
    </div>
  );
}
