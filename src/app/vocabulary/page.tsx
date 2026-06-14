"use client";

import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, BookMarked, Sparkles, ChevronRight, ArrowLeft } from "lucide-react";

const WORD_SETS = [
  { name: "Essential 100", words: 100, desc: "The most common SAT vocabulary words you must know." },
  { name: "Advanced Academic", words: 75, desc: "Higher-level words from literary and scientific texts." },
  { name: "Context Clues", words: 50, desc: "Learn to infer meaning from surrounding text." },
  { name: "Root Words & Prefixes", words: 60, desc: "Decode unfamiliar words by understanding their parts." },
];

const SAMPLE_WORDS = [
  { word: "Ubiquitous", def: "Present everywhere at once", example: "Smartphones have become ubiquitous in modern society." },
  { word: "Ambiguous", def: "Open to multiple interpretations", example: "The poem's meaning was deliberately ambiguous." },
  { word: "Eloquent", def: "Fluent and persuasive in speaking", example: "She delivered an eloquent speech at the ceremony." },
  { word: "Mitigate", def: "Make less severe or serious", example: "Measures were taken to mitigate the environmental damage." },
  { word: "Benevolent", def: "Well-meaning and kindly", example: "The benevolent donor funded the scholarship program." },
];

export default function VocabularyPage() {
  const { isLoaded, isSignedIn } = useUser();
  const router = useRouter();
  const [flipped, setFlipped] = useState<number | null>(null);

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
            <BookMarked className="w-5 h-5 text-teal-400" />
            <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider">Build Your Lexicon</span>
          </div>
          <h1 className="text-2xl md:text-4xl font-bold mb-2">Vocabulary Cards</h1>
          <p className="text-slate-300 text-sm md:text-base max-w-xl">
            Master SAT vocabulary with spaced repetition, example sentences, and interactive quizzes.
          </p>
          <div className="flex items-center gap-2 mt-4 px-3 py-1.5 bg-emerald-500/15 border border-emerald-400/30 rounded-lg w-fit">
            <Sparkles className="w-4 h-4 text-emerald-400" />
            <span className="text-xs font-medium text-emerald-300">Full vocabulary unlocked</span>
          </div>
        </div>
      </section>

      <main className="max-w-5xl mx-auto px-6 md:px-10 -mt-6 pb-16">
        <div className="grid md:grid-cols-2 gap-4 mb-10">
          {WORD_SETS.map((set) => (
            <div key={set.name} className="bg-white rounded-xl border border-slate-200 p-5 hover:shadow-md transition-shadow cursor-pointer">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold text-slate-800">{set.name}</h3>
                <span className="text-xs text-slate-400 font-medium">{set.words} words</span>
              </div>
              <p className="text-sm text-slate-500 mb-3">{set.desc}</p>
              <span className="inline-flex items-center gap-1 text-sm font-medium text-[#0d9488] hover:underline">
                Start learning <ChevronRight className="w-3 h-3" />
              </span>
            </div>
          ))}
        </div>

        <h2 className="text-lg font-bold text-slate-800 mb-4">Sample Cards</h2>
        <div className="grid md:grid-cols-2 gap-4">
          {SAMPLE_WORDS.map((item, i) => (
            <div
              key={item.word}
              onClick={() => setFlipped(flipped === i ? null : i)}
              className="bg-white rounded-xl border border-slate-200 p-5 hover:shadow-md transition-shadow cursor-pointer min-h-[120px]"
            >
              {flipped === i ? (
                <div>
                  <p className="text-xs text-slate-400 mb-1 font-medium">DEFINITION</p>
                  <p className="text-slate-700 font-medium mb-2">{item.def}</p>
                  <p className="text-sm text-slate-500 italic">&ldquo;{item.example}&rdquo;</p>
                  <p className="text-xs text-slate-400 mt-3">Tap to see word</p>
                </div>
              ) : (
                <div>
                  <p className="text-xs text-slate-400 mb-1 font-medium">WORD</p>
                  <p className="text-xl font-bold text-slate-800">{item.word}</p>
                  <p className="text-xs text-slate-400 mt-3">Tap to reveal definition</p>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="mt-8 bg-gradient-to-br from-[#0d9488] to-[#0f766e] rounded-xl text-white p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div>
            <h3 className="font-bold text-lg">Free for 2 months</h3>
            <p className="text-teal-100 text-sm mt-1">All word sets unlocked. Build your vocabulary today.</p>
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
