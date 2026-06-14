"use client";

import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import { testIndex } from "@/data/testIndex";
import { FREE_TEST_IDS } from "@/lib/constants";
import { BookCheck, Lock, Sparkles, Trophy, ArrowRight, BookOpen, Calculator } from "lucide-react";

export default function MyTestsPage() {
  const { user, isLoaded, isSignedIn } = useUser();
  const router = useRouter();
  const [hasPremium, setHasPremium] = useState(false);

  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      router.push("/sign-in");
    }
  }, [isLoaded, isSignedIn, router]);

  useEffect(() => {
    if (isSignedIn) {
      fetch("/api/check-premium")
        .then((r) => r.json())
        .then((d) => setHasPremium(d.premium))
        .catch(() => setHasPremium(false));
    }
  }, [isSignedIn]);

  if (!isLoaded || !isSignedIn || !user) return null;

  const freeCount = testIndex.filter((t) => FREE_TEST_IDS.includes(t.id)).length;
  const premiumCount = testIndex.length - freeCount;

  return (
    <div className="min-h-screen bg-[#f8fafc]">
      <header className="flex items-center justify-between px-6 md:px-10 py-4 bg-white border-b border-slate-200">
        <Link href="/dashboard">
          <div className="flex items-baseline gap-1">
            <span className="text-xl font-bold text-slate-800">satzone.</span>
            <span className="text-[10px] font-bold text-[#0d9488] tracking-[2px]">SAT CENTER</span>
          </div>
        </Link>
        <nav className="flex items-center gap-6">
          <Link href="/dashboard" className="text-sm font-medium text-slate-600 hover:text-slate-800">Dashboard</Link>
          <Link href="/pricing" className="text-sm font-medium text-slate-600 hover:text-slate-800">Pricing</Link>
        </nav>
      </header>

      <section className="bg-gradient-to-br from-[#1e293b] to-[#334155] text-white">
        <div className="max-w-5xl mx-auto px-6 md:px-10 py-12 md:py-16">
          <div className="flex items-center gap-2 mb-3">
            <Trophy className="w-5 h-5 text-yellow-400" />
            <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider">Full-Length Practice</span>
          </div>
          <h1 className="text-2xl md:text-4xl font-bold mb-2">Choose Your Test</h1>
          <p className="text-slate-300 text-sm md:text-base max-w-xl">
            Realistic Bluebook-style adaptive tests. {freeCount} free — unlock all {premiumCount} more with Premium.
          </p>
          <div className="flex items-center gap-4 mt-5">
            <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-500/15 border border-emerald-400/30 rounded-lg">
              <BookCheck className="w-4 h-4 text-emerald-400" />
              <span className="text-xs font-medium text-emerald-300">{freeCount} Free Tests</span>
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 bg-amber-500/15 border border-amber-400/30 rounded-lg">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span className="text-xs font-medium text-amber-300">{premiumCount} Premium Tests</span>
            </div>
          </div>
        </div>
      </section>

      <main className="max-w-5xl mx-auto px-6 md:px-10 -mt-6 pb-16">
        <div className="grid gap-4">
          {testIndex.map((test, i) => {
            const isFree = FREE_TEST_IDS.includes(test.id);
            const unlocked = isFree || hasPremium;
            return (
              <div
                key={test.id}
                className="bg-white rounded-xl border border-slate-200 p-5 md:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start gap-4">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${isFree ? "bg-teal-50 text-[#0d9488]" : "bg-slate-100 text-slate-400"}`}>
                    {unlocked ? <BookOpen className="w-5 h-5" /> : <Lock className="w-5 h-5" />}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-semibold text-slate-800">{test.name}</h3>
                      {isFree && (
                        <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">FREE</span>
                      )}
                      {!unlocked && (
                        <span className="text-[11px] font-bold text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full">PREMIUM</span>
                      )}
                    </div>
                    <div className="flex items-center gap-3 mt-1.5 text-xs text-slate-500">
                      <span className="flex items-center gap-1">
                        <BookOpen className="w-3.5 h-3.5 text-slate-400" />
                        {test.readingCount} Reading &amp; Writing
                      </span>
                      <span className="flex items-center gap-1">
                        <Calculator className="w-3.5 h-3.5 text-slate-400" />
                        {test.mathCount} Math
                      </span>
                      <span className="text-slate-300">|</span>
                      <span>2 adaptive modules each</span>
                    </div>
                  </div>
                </div>
                {unlocked ? (
                  <Link
                    href={`/test?mockId=${test.id}`}
                    className="shrink-0 inline-flex items-center gap-1.5 bg-[#0d9488] text-white font-semibold px-5 py-2.5 rounded-lg hover:bg-[#0f766e] transition-colors text-sm"
                  >
                    Start Test
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                ) : (
                  <Link
                    href="/pricing"
                    className="shrink-0 inline-flex items-center gap-1.5 bg-gradient-to-r from-amber-500 to-orange-500 text-white font-semibold px-5 py-2.5 rounded-lg hover:from-amber-600 hover:to-orange-600 transition-colors text-sm"
                  >
                    Unlock
                    <Sparkles className="w-3.5 h-3.5" />
                  </Link>
                )}
              </div>
            );
          })}
        </div>
      </main>
    </div>
  );
}
