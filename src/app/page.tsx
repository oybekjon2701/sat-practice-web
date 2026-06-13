import Link from "next/link";
import { currentUser } from "@clerk/nextjs/server";

export default async function HomePage() {
  const user = await currentUser();

  return (
    <div className="min-h-screen bg-white">
      <header className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
        <svg viewBox="0 0 240 60" className="h-8 w-auto" xmlns="http://www.w3.org/2000/svg">
          <text x="235" y="34" fontFamily="Arial, Helvetica, sans-serif" fontWeight="700" fontSize="24" fill="#FF6B00" textAnchor="end">satzone.</text>
          <text x="235" y="52" fontFamily="Arial, Helvetica, sans-serif" fontWeight="700" fontSize="11" fill="#FF6B00" textAnchor="end" letterSpacing="1.5">SAT CENTER</text>
        </svg>
        <nav className="flex items-center gap-4">
          <Link href="/pricing" className="text-sm text-gray-600 hover:text-gray-800">Pricing</Link>
          {user ? (
            <>
              <Link href="/dashboard" className="text-sm text-gray-600 hover:text-gray-800">Dashboard</Link>
              <Link href="/my-tests" className="text-sm bg-[#1a73e8] text-white px-4 py-2 rounded-lg hover:bg-blue-700">Practice</Link>
            </>
          ) : (
            <>
              <Link href="/sign-in" className="text-sm text-gray-600 hover:text-gray-800">Sign In</Link>
              <Link href="/sign-up" className="text-sm bg-[#1a73e8] text-white px-4 py-2 rounded-lg hover:bg-blue-700">Get Started</Link>
            </>
          )}
        </nav>
      </header>

      <main>
        <section className="text-center py-24 px-6">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">Ace the SAT</h1>
          <p className="text-lg text-gray-500 max-w-xl mx-auto mb-8">
            Practice with real Bluebook-style tests. Adaptive modules, instant scoring, and detailed answer review.
          </p>
          <div className="flex gap-4 justify-center">
            <Link href={user ? "/my-tests" : "/sign-up"} className="bg-[#1a73e8] text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700">
              Start Free Practice
            </Link>
            <Link href="/pricing" className="border border-gray-200 text-gray-700 px-8 py-3 rounded-lg font-semibold hover:bg-gray-50">
              See Plans
            </Link>
          </div>
          <p className="text-sm text-gray-400 mt-4">Free mock tests included. No credit card required.</p>
        </section>

        <section className="max-w-5xl mx-auto px-6 pb-24">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="p-6 rounded-xl border border-gray-100 text-center">
              <div className="text-3xl mb-3">📝</div>
              <h3 className="font-semibold text-gray-800 mb-2">Full-Length Tests</h3>
              <p className="text-sm text-gray-500">Complete Reading & Writing and Math sections with adaptive module 2.</p>
            </div>
            <div className="p-6 rounded-xl border border-gray-100 text-center">
              <div className="text-3xl mb-3">📊</div>
              <h3 className="font-semibold text-gray-800 mb-2">Instant Scoring</h3>
              <p className="text-sm text-gray-500">200–800 section scores with per-module breakdown and answer review.</p>
            </div>
            <div className="p-6 rounded-xl border border-gray-100 text-center">
              <div className="text-3xl mb-3">🎯</div>
              <h3 className="font-semibold text-gray-800 mb-2">Adaptive Modules</h3>
              <p className="text-sm text-gray-500">Module 2 adapts to your performance for a realistic test experience.</p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
