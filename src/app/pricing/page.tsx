"use client";

import Link from "next/link";
import { useUser } from "@clerk/nextjs";

export default function PricingPage() {
  const { isSignedIn, isLoaded } = useUser();

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="flex items-center justify-between px-6 py-4 bg-white border-b border-gray-100">
        <Link href="/">
          <svg viewBox="0 0 240 60" className="h-8 w-auto" xmlns="http://www.w3.org/2000/svg">
            <text x="235" y="34" fontFamily="Arial, Helvetica, sans-serif" fontWeight="700" fontSize="24" fill="#FF6B00" textAnchor="end">satzone.</text>
            <text x="235" y="52" fontFamily="Arial, Helvetica, sans-serif" fontWeight="700" fontSize="11" fill="#FF6B00" textAnchor="end" letterSpacing="1.5">SAT CENTER</text>
          </svg>
        </Link>
      </header>

      <main className="max-w-3xl mx-auto px-6 py-16">
        <h1 className="text-3xl font-bold text-gray-800 text-center mb-2">Choose Your Plan</h1>
        <p className="text-gray-500 text-center text-sm mb-8">Start free, upgrade anytime.</p>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-white rounded-2xl border border-gray-200 p-8">
            <h2 className="text-xl font-bold text-gray-800 mb-2">Free</h2>
            <p className="text-3xl font-bold text-gray-800 mb-4">$0</p>
            <ul className="space-y-3 mb-8 text-sm text-gray-600">
              <li className="flex items-center gap-2">✓ 2 full-length mock tests</li>
              <li className="flex items-center gap-2">✓ Instant scoring & review</li>
              <li className="flex items-center gap-2">✓ Basic performance tracking</li>
            </ul>
            <Link
              href={!isLoaded ? "#" : isSignedIn ? "/my-tests" : "/sign-up"}
              className={`block w-full text-center py-3 rounded-lg font-semibold ${
                !isLoaded
                  ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                  : "border border-gray-200 text-gray-700 hover:bg-gray-50"
              }`}
            >
              {!isLoaded ? "Loading..." : isSignedIn ? "Browse Tests" : "Get Started Free"}
            </Link>
          </div>

          <div className="bg-white rounded-2xl border-2 border-[#1a73e8] p-8 relative">
            <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#1a73e8] text-white text-xs px-3 py-1 rounded-full font-medium">Popular</span>
            <h2 className="text-xl font-bold text-gray-800 mb-2">Premium</h2>
            <p className="text-3xl font-bold text-gray-800 mb-4">Coming Soon</p>
            <p className="text-xs text-gray-400 mb-4">Unlock all tests — payment integration coming</p>
            <ul className="space-y-3 mb-8 text-sm text-gray-600">
              <li className="flex items-center gap-2">✓ Unlimited full-length tests</li>
              <li className="flex items-center gap-2">✓ All adaptive modules</li>
              <li className="flex items-center gap-2">✓ Detailed answer review</li>
              <li className="flex items-center gap-2">✓ Full score breakdown</li>
              <li className="flex items-center gap-2">✓ Priority support</li>
            </ul>
            <div className="w-full text-center py-3 bg-gray-100 text-gray-400 rounded-lg font-semibold cursor-not-allowed">
              Coming Soon
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
