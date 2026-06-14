"use client";

import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { BookOpen, BookMarked, Video, Calculator, Award, ArrowRight, Sparkles } from "lucide-react";
import Countdown from "@/components/Countdown";
import DashboardCard from "@/components/DashboardCard";

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

export default function DashboardPage() {
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

  const cards = [
    { icon: <BookOpen className="w-5 h-5" />, title: "Themed Practice Questions", description: "Practice by topic — algebra, grammar, passage comprehension, and more.", href: "/my-tests" },
    { icon: <BookMarked className="w-5 h-5" />, title: "Vocabulary Cards", description: "Build your SAT vocabulary with curated flashcards.", href: "/my-tests" },
    { icon: <Video className="w-5 h-5" />, title: "English Section Video Lessons", description: "Watch strategy guides for Reading & Writing.", href: "#" },
    { icon: <Calculator className="w-5 h-5" />, title: "Math Section Video Lessons", description: "Step-by-step math tutorials for every concept.", href: "#" },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="flex items-center justify-between px-6 py-4 bg-white border-b border-gray-100">
        <Link href="/">
          <svg viewBox="0 0 240 60" className="h-8 w-auto" xmlns="http://www.w3.org/2000/svg">
            <text x="235" y="34" fontFamily="Arial, Helvetica, sans-serif" fontWeight="700" fontSize="24" fill="#FF6B00" textAnchor="end">satzone.</text>
            <text x="235" y="52" fontFamily="Arial, Helvetica, sans-serif" fontWeight="700" fontSize="11" fill="#FF6B00" textAnchor="end" letterSpacing="1.5">SAT CENTER</text>
          </svg>
        </Link>
        <nav className="flex items-center gap-4">
          <Link href="/my-tests" className="text-sm text-gray-600 hover:text-gray-800">Practice</Link>
          <Link href="/pricing" className="text-sm text-gray-600 hover:text-gray-800">Pricing</Link>
        </nav>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-10">
        <div className="flex items-start justify-between mb-10">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Welcome back, {name}</h1>
            <p className="text-gray-500 text-sm mt-1">Pick up where you left off or start something new.</p>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 bg-green-50 border border-green-200 rounded-full">
            <Award className="w-4 h-4 text-green-600" />
            <span className="text-xs font-medium text-green-700">100% Authentic Material</span>
          </div>
        </div>

        <div className="bg-gradient-to-br from-[#0a1f3d] to-[#1a3a6b] rounded-2xl p-8 mb-8 text-white">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="w-5 h-5 text-yellow-400" />
            <span className="text-xs font-medium text-blue-200 uppercase tracking-wider">Full-Length Mock Test</span>
          </div>
          <h2 className="text-2xl font-bold mb-2">Ready for a full-length practice test?</h2>
          <p className="text-blue-200 text-sm mb-6 max-w-lg">
            Simulate the real SAT experience with adaptive modules and timed sections.
          </p>
          <Link
            href="/my-tests"
            className="inline-flex items-center gap-2 bg-white text-[#0a1f3d] font-semibold px-6 py-3 rounded-lg hover:bg-gray-100 transition-colors text-sm"
          >
            Start Full-Length Practice Test
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <Countdown />
          <div className="bg-white rounded-2xl border border-gray-200 p-6">
            <div className="flex items-center gap-2 mb-4">
              <BookOpen className="w-5 h-5 text-[#FF6B00]" />
              <h3 className="font-semibold text-gray-800">Recent Activity</h3>
            </div>
            {results.length === 0 ? (
              <p className="text-sm text-gray-400">No tests completed yet. Start your first practice test!</p>
            ) : (
              <div className="space-y-3">
                {results.slice(0, 3).map((r) => (
                  <div key={r.id} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                    <div>
                      <p className="text-sm font-medium text-gray-800">{r.testName}</p>
                      <p className="text-xs text-gray-400">{new Date(r.completedAt).toLocaleDateString()}</p>
                    </div>
                    <span className={`text-sm font-bold ${r.totalScore >= 1200 ? "text-green-600" : "text-gray-500"}`}>
                      {r.totalScore}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <h2 className="text-lg font-semibold text-gray-800 mb-4">Study Resources</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {cards.map((card) => (
            <DashboardCard key={card.title} icon={card.icon} title={card.title} description={card.description} href={card.href} />
          ))}
        </div>
      </main>
    </div>
  );
}
