"use client";

import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Link from "next/link";
import { ArrowRight, BookOpen, Sparkles, Search, CheckCircle2, ArrowLeft } from "lucide-react";

const TOPICS = [
  { name: "Algebra", icon: "x²", desc: "Linear equations, inequalities, systems, and functions", count: 45 },
  { name: "Advanced Math", icon: "f(x)", desc: "Quadratics, polynomials, exponential and rational functions", count: 40 },
  { name: "Problem-Solving & Data", icon: "Σ", desc: "Ratios, percentages, data analysis, probability", count: 35 },
  { name: "Geometry & Trig", icon: "∠", desc: "Area, volume, angles, circles, and trigonometric ratios", count: 30 },
  { name: "Reading Comprehension", icon: "📖", desc: "Main idea, inference, vocabulary in context, evidence", count: 50 },
  { name: "Grammar & Writing", icon: "✍️", desc: "Punctuation, sentence structure, style, and organization", count: 40 },
];

export default function ThemedQuestionsPage() {
  const { isLoaded, isSignedIn } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      router.push("/sign-in");
    }
  }, [isLoaded, isSignedIn, router]);

  if (!isLoaded || !isSignedIn) return null;

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
            <BookOpen className="w-5 h-5 text-teal-400" />
            <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider">Practice</span>
          </div>
          <h1 className="text-2xl md:text-4xl font-bold mb-2">Themed Practice Questions</h1>
          <p className="text-slate-300 text-sm md:text-base max-w-xl">
            Master every SAT topic with targeted questions and step-by-step explanations.
            All themes are free for a limited time.
          </p>
          <div className="flex items-center gap-2 mt-4 px-3 py-1.5 bg-emerald-500/15 border border-emerald-400/30 rounded-lg w-fit">
            <Sparkles className="w-4 h-4 text-emerald-400" />
            <span className="text-xs font-medium text-emerald-300">All questions unlocked</span>
          </div>
        </div>
      </section>

      <main className="max-w-5xl mx-auto px-6 md:px-10 -mt-6 pb-16">
        <div className="grid md:grid-cols-2 gap-4">
          {TOPICS.map((topic) => (
            <div key={topic.name} className="bg-white rounded-xl border border-slate-200 p-5 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-3">
                <div className="w-10 h-10 rounded-xl bg-teal-50 flex items-center justify-center text-lg font-bold text-sat-teal">
                  {topic.icon}
                </div>
                <span className="text-xs text-slate-400 font-medium">{topic.count} questions</span>
              </div>
              <h3 className="font-semibold text-slate-800 mb-1">{topic.name}</h3>
              <p className="text-sm text-slate-500 mb-4">{topic.desc}</p>
              <Link
                href="/my-tests"
                className="inline-flex items-center gap-1 text-sm font-medium text-sat-teal hover:underline"
              >
                Start practicing <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
          ))}
        </div>

        <div className="mt-8 bg-gradient-to-br from-[#0d9488] to-[#0f766e] rounded-xl text-white p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div>
            <h3 className="font-bold text-lg">Everything is free for 2 months</h3>
            <p className="text-teal-100 text-sm mt-1">No limits. No payment needed. Just focused SAT prep.</p>
          </div>
          <Link
            href="/my-tests"
            className="shrink-0 bg-white text-sat-teal font-semibold px-6 py-2.5 rounded-lg hover:bg-slate-100 transition-colors text-sm"
          >
            Take a full test
          </Link>
        </div>
      </main>
    </div>
  );
}
