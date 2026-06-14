"use client";

import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import { testIndex } from "@/data/testIndex";
import { FREE_TEST_IDS } from "@/lib/constants";

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
          <Link href="/dashboard" className="text-sm text-gray-600 hover:text-gray-800">Dashboard</Link>
          <Link href="/pricing" className="text-sm text-gray-600 hover:text-gray-800">Pricing</Link>
        </nav>
      </header>

      <main className="max-w-3xl mx-auto px-6 py-12">
        <h1 className="text-2xl font-bold text-gray-800 mb-1">Practice Tests</h1>
        <p className="text-gray-500 text-sm mb-8">
          {hasPremium ? "Unlimited access — all tests unlocked" : "Free: first 2 tests. Upgrade for full access."}
        </p>

        <div className="space-y-4">
          {testIndex.map((test) => {
            const isFree = FREE_TEST_IDS.includes(test.id);
            const unlocked = isFree || hasPremium;
            return (
              <div key={test.id} className="bg-white rounded-2xl border border-gray-200 p-6 flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-gray-800">{test.name}</h3>
                  <p className="text-sm text-gray-500 mt-1">
                    {test.readingCount} Reading & Writing questions · {test.mathCount} Math questions
                  </p>
                  {!unlocked && (
                    <span className="text-xs text-amber-600 font-medium">Premium only</span>
                  )}
                </div>
                {unlocked ? (
                  <Link
                    href={`/test?mockId=${test.id}`}
                    className="px-5 py-2 bg-[#1a73e8] text-white rounded-lg text-sm font-medium hover:bg-blue-700"
                  >
                    Start Test
                  </Link>
                ) : (
                  <Link
                    href="/pricing"
                    className="px-5 py-2 bg-gray-100 text-gray-500 rounded-lg text-sm font-medium"
                  >
                    Upgrade
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
