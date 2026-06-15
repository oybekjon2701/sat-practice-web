"use client";

import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Link from "next/link";
import { testIndex } from "@/data/testIndex";
import { Trophy, ArrowRight, BookOpen, Calculator, Sparkles } from "lucide-react";

export default function MyTestsPage() {
  const { user, isLoaded, isSignedIn } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      router.push("/sign-in");
    }
  }, [isLoaded, isSignedIn, router]);

  if (!isLoaded || !isSignedIn || !user) return null;

  return (
    <div className="min-h-screen bg-sat-bg">
      <header className="flex items-center justify-between px-6 md:px-10 py-4 bg-white border-b border-slate-200">
        <Link href="/dashboard">
          <div className="flex items-baseline gap-1">
            <span className="text-xl font-bold text-slate-800">satzone.</span>
            <span className="text-[10px] font-bold text-sat-teal tracking-[2px]">SAT CENTER</span>
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
            All {testIndex.length} realistic Bluebook-style adaptive tests are unlocked.
          </p>
          <div className="flex items-center gap-2 mt-4 px-3 py-1.5 bg-emerald-500/15 border border-emerald-400/30 rounded-lg w-fit">
            <Sparkles className="w-4 h-4 text-emerald-400" />
            <span className="text-xs font-medium text-emerald-300">All tests free for 2 months</span>
          </div>
        </div>
      </section>

      <main className="max-w-5xl mx-auto px-6 md:px-10 -mt-6 pb-16">
        <div className="grid gap-4">
          {testIndex.map((test) => (
            <div
              key={test.id}
              className="bg-white rounded-xl border border-slate-200 p-5 md:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-teal-50 text-sat-teal flex items-center justify-center shrink-0">
                  <BookOpen className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="font-semibold text-slate-800">{test.name}</h3>
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
              <Link
                href={`/test?mockId=${test.id}`}
                className="shrink-0 inline-flex items-center gap-1.5 bg-sat-teal text-white font-semibold px-5 py-2.5 rounded-lg hover:bg-sat-teal-hover transition-colors text-sm"
              >
                Start Test
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
