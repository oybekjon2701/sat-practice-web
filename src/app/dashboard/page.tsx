"use client";

import { useUser } from "@clerk/nextjs";
import Link from "next/link";
import { ArrowRight, BookOpen, Video, BookMarked, Sparkles, Lock, ShieldCheck } from "lucide-react";

export default function Dashboard() {
  const { user, isSignedIn } = useUser();

  return (
    <div className="min-h-screen bg-[#f8fafc]">
      <header className="flex items-center justify-between px-6 md:px-10 py-4 bg-white border-b border-slate-200">
        <Link href="/dashboard">
          <div className="flex items-baseline gap-1">
            <span className="text-xl font-bold text-slate-800">satzone.</span>
            <span className="text-[10px] font-bold text-[#0d9488] tracking-[2px]">SAT CENTER</span>
          </div>
        </Link>
        <nav className="hidden sm:flex items-center gap-6">
          <Link href="/my-tests" className="text-sm font-medium text-slate-600 hover:text-slate-800">Practice Tests</Link>
          <Link href="#courses" className="text-sm font-medium text-slate-600 hover:text-slate-800">Courses</Link>
          <Link href="/pricing" className="text-sm font-medium text-slate-600 hover:text-slate-800">Pricing</Link>
        </nav>
        {isSignedIn ? (
          <div className="flex items-center gap-3">
            <span className="text-sm text-slate-600">{user?.firstName || "Student"}</span>
            <Link href="/my-tests" className="bg-[#0d9488] text-white text-sm font-semibold px-4 py-2 rounded-lg hover:bg-[#0f766e]">Dashboard</Link>
          </div>
        ) : (
          <Link href="/sign-in" className="bg-[#0d9488] text-white text-sm font-semibold px-5 py-2 rounded-lg hover:bg-[#0f766e]">Sign In</Link>
        )}
      </header>

      <main>
        <section className="bg-gradient-to-br from-[#1e293b] to-[#334155] text-white">
          <div className="max-w-5xl mx-auto px-6 md:px-10 py-16 md:py-20">
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
                className="inline-flex items-center gap-2 bg-[#0d9488] text-white font-semibold px-6 py-3 rounded-lg hover:bg-[#0f766e] transition-colors shadow-sm"
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
        </section>

        <section className="max-w-5xl mx-auto px-6 md:px-10 -mt-8">
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
                <div className="w-5 h-5 rounded bg-teal-50 flex items-center justify-center text-[10px] font-bold text-[#0d9488]">RW</div>
                <span>Reading &amp; Writing</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 rounded bg-teal-50 flex items-center justify-center text-[10px] font-bold text-[#0d9488]">M</div>
                <span>Math</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 rounded bg-teal-50 flex items-center justify-center text-[10px] font-bold text-[#0d9488]">2</div>
                <span>Adaptive Modules</span>
              </div>
            </div>
            <div className="mt-6 flex items-center gap-3">
              <Link
                href={isSignedIn ? "/my-tests" : "/sign-in?redirect_url=/my-tests"}
                className="inline-flex items-center gap-2 bg-[#0d9488] text-white font-semibold px-5 py-2.5 rounded-lg hover:bg-[#0f766e] transition-colors text-sm"
              >
                {isSignedIn ? "Take a Test" : "Start Free Practice"}
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
              <Link href="/pricing" className="text-sm font-medium text-[#0d9488] hover:underline">
                {isSignedIn ? "Upgrade for more" : "2 free tests included"}
              </Link>
            </div>
          </div>
        </section>

        <section id="courses" className="max-w-5xl mx-auto px-6 md:px-10 mt-10 mb-16">
          <h2 className="text-xl font-bold text-slate-800 mb-6">Courses</h2>
          <div className="grid md:grid-cols-3 gap-5">
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 hover:shadow-md transition-shadow">
              <div className="w-10 h-10 rounded-xl bg-teal-50 flex items-center justify-center text-[#0d9488] mb-4">
                <BookOpen className="w-5 h-5" />
              </div>
              <h3 className="font-semibold text-slate-800 mb-1.5">Themed Practice Questions</h3>
              <p className="text-sm text-slate-500 mb-4">Algebra, grammar, reading comprehension — sorted by topic with step-by-step explanations.</p>
              <div className="flex items-center gap-2 mb-4">
                <span className="text-[11px] font-medium text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full">10 free / theme</span>
                <Lock className="w-3.5 h-3.5 text-slate-300" />
              </div>
              <Link
                href={isSignedIn ? "/my-tests" : "/sign-in?redirect_url=/my-tests"}
                className="text-sm font-medium text-[#0d9488] hover:underline inline-flex items-center gap-1"
              >
                Browse topics <ArrowRight className="w-3 h-3" />
              </Link>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 hover:shadow-md transition-shadow">
              <div className="w-10 h-10 rounded-xl bg-teal-50 flex items-center justify-center text-[#0d9488] mb-4">
                <Video className="w-5 h-5" />
              </div>
              <h3 className="font-semibold text-slate-800 mb-1.5">Video Lessons</h3>
              <p className="text-sm text-slate-500 mb-4">Expert strategy guides for Reading, Writing, and Math with tips and worked examples.</p>
              <div className="flex items-center gap-2 mb-4">
                <span className="text-[11px] font-medium text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full">3 free lessons</span>
                <Lock className="w-3.5 h-3.5 text-slate-300" />
              </div>
              <Link
                href={isSignedIn ? "#" : "/sign-in?redirect_url=#"}
                className="text-sm font-medium text-[#0d9488] hover:underline inline-flex items-center gap-1"
              >
                Watch lessons <ArrowRight className="w-3 h-3" />
              </Link>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 hover:shadow-md transition-shadow">
              <div className="w-10 h-10 rounded-xl bg-teal-50 flex items-center justify-center text-[#0d9488] mb-4">
                <BookMarked className="w-5 h-5" />
              </div>
              <h3 className="font-semibold text-slate-800 mb-1.5">Vocabulary Cards</h3>
              <p className="text-sm text-slate-500 mb-4">Curated SAT vocabulary with spaced repetition, example sentences, and quizzes.</p>
              <div className="flex items-center gap-2 mb-4">
                <span className="text-[11px] font-medium text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full">Sample free</span>
                <Lock className="w-3.5 h-3.5 text-slate-300" />
              </div>
              <Link
                href={isSignedIn ? "/my-tests" : "/sign-in?redirect_url=/my-tests"}
                className="text-sm font-medium text-[#0d9488] hover:underline inline-flex items-center gap-1"
              >
                Start learning <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
          </div>
        </section>

        <section className="bg-gradient-to-br from-[#0d9488] to-[#0f766e] text-white">
          <div className="max-w-5xl mx-auto px-6 md:px-10 py-12 text-center">
            <h2 className="text-2xl font-bold mb-3">Unlock everything with Premium</h2>
            <p className="text-teal-100 text-sm mb-6 max-w-md mx-auto">Unlimited full-length tests, all themed questions, every video lesson, and full vocabulary decks.</p>
            <Link
              href="/pricing"
              className="inline-flex items-center gap-2 bg-white text-[#0d9488] font-semibold px-6 py-3 rounded-lg hover:bg-slate-100 transition-colors text-sm"
            >
              See plans
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
