"use client";

import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Link from "next/link";
import { ArrowRight, Video, Sparkles, Play, ArrowLeft, Clock } from "lucide-react";

const LESSONS = [
  { title: "SAT Reading: Main Idea Questions", desc: "Learn how to identify the central theme and purpose of any passage.", duration: "14 min", level: "Beginner" },
  { title: "SAT Reading: Command of Evidence", desc: "Master the art of finding text evidence to support your answers.", duration: "18 min", level: "Intermediate" },
  { title: "SAT Writing: Punctuation Rules", desc: "Commas, semicolons, colons, and dashes — the complete guide.", duration: "20 min", level: "Beginner" },
  { title: "SAT Writing: Sentence Structure", desc: "Fix fragments, run-ons, and parallel structure errors.", duration: "16 min", level: "Intermediate" },
  { title: "SAT Math: Linear Equations", desc: "Solve linear equations and inequalities with confidence.", duration: "22 min", level: "Beginner" },
  { title: "SAT Math: Quadratic Functions", desc: "Factor, complete the square, and use the quadratic formula.", duration: "25 min", level: "Advanced" },
  { title: "SAT Math: Data Analysis", desc: "Interpret scatterplots, tables, and survey data effectively.", duration: "19 min", level: "Intermediate" },
  { title: "SAT Strategy: Time Management", desc: "How to pace yourself and maximize your score on test day.", duration: "12 min", level: "All Levels" },
];

export default function VideoLessonsPage() {
  const { isLoaded, isSignedIn } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      router.push("/sign-in");
    }
  }, [isLoaded, isSignedIn, router]);

  if (!isLoaded || !isSignedIn) return null;

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
          <Link href="/my-tests" className="text-sm font-medium text-slate-600 hover:text-slate-800">Practice Tests</Link>
          <Link href="/pricing" className="text-sm font-medium text-slate-600 hover:text-slate-800">Pricing</Link>
        </nav>
      </header>

      <section className="bg-gradient-to-br from-[#1e293b] to-[#334155] text-white">
        <div className="max-w-5xl mx-auto px-6 md:px-10 py-12 md:py-16">
          <Link href="/dashboard" className="inline-flex items-center gap-1 text-sm text-slate-400 hover:text-white mb-4 transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back to Dashboard
          </Link>
          <div className="flex items-center gap-2 mb-3">
            <Video className="w-5 h-5 text-teal-400" />
            <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider">Learn</span>
          </div>
          <h1 className="text-2xl md:text-4xl font-bold mb-2">Video Lessons</h1>
          <p className="text-slate-300 text-sm md:text-base max-w-xl">
            Expert strategy guides covering every section of the SAT. Watch and learn at your own pace.
          </p>
          <div className="flex items-center gap-2 mt-4 px-3 py-1.5 bg-emerald-500/15 border border-emerald-400/30 rounded-lg w-fit">
            <Sparkles className="w-4 h-4 text-emerald-400" />
            <span className="text-xs font-medium text-emerald-300">All videos unlocked</span>
          </div>
        </div>
      </section>

      <main className="max-w-5xl mx-auto px-6 md:px-10 -mt-6 pb-16">
        <div className="grid md:grid-cols-2 gap-4">
          {LESSONS.map((lesson) => (
            <div key={lesson.title} className="bg-white rounded-xl border border-slate-200 p-5 hover:shadow-md transition-shadow group cursor-pointer">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-teal-50 flex items-center justify-center shrink-0 group-hover:bg-teal-100 transition-colors">
                  <Play className="w-5 h-5 text-[#0d9488] ml-0.5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold text-slate-800 text-sm">{lesson.title}</h3>
                  </div>
                  <p className="text-xs text-slate-500 mb-2">{lesson.desc}</p>
                  <div className="flex items-center gap-3 text-xs text-slate-400">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" /> {lesson.duration}
                    </span>
                    <span className="px-2 py-0.5 bg-slate-100 rounded-full text-[11px] font-medium text-slate-500">
                      {lesson.level}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 bg-gradient-to-br from-[#0d9488] to-[#0f766e] rounded-xl text-white p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div>
            <h3 className="font-bold text-lg">Free access for 2 months</h3>
            <p className="text-teal-100 text-sm mt-1">Every lesson is open. Start watching and boost your score.</p>
          </div>
          <Link
            href="/my-tests"
            className="shrink-0 bg-white text-[#0d9488] font-semibold px-6 py-2.5 rounded-lg hover:bg-slate-100 transition-colors text-sm"
          >
            Take a practice test
          </Link>
        </div>
      </main>
    </div>
  );
}
