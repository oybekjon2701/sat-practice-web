"use client";

import Link from "next/link";
import { useUser } from "@clerk/nextjs";
import { Sparkles, ShieldCheck } from "lucide-react";

export default function PricingPage() {
  const { isSignedIn, isLoaded } = useUser();

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
          <Link href="/my-tests" className="text-sm font-medium text-slate-600 hover:text-slate-800">Practice Tests</Link>
        </nav>
      </header>

      <section className="bg-gradient-to-br from-[#0d9488] to-[#0f766e] text-white">
        <div className="max-w-5xl mx-auto px-6 md:px-10 py-16 text-center">
          <div className="flex items-center justify-center gap-2 mb-3">
            <Sparkles className="w-5 h-5 text-yellow-300" />
            <span className="text-xs font-semibold text-teal-100 uppercase tracking-wider">Limited Time Offer</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-bold mb-3">Free for 2 Months</h1>
          <p className="text-teal-100 text-base md:text-lg max-w-lg mx-auto mb-6">
            We&apos;re launching in Uzbekistan and everything is completely free for the first two months. No payment needed.
          </p>
          <div className="flex items-center justify-center gap-2 px-4 py-2 bg-white/10 border border-white/20 rounded-lg w-fit mx-auto">
            <ShieldCheck className="w-4 h-4 text-teal-200" />
            <span className="text-sm font-medium text-teal-100">No credit card required</span>
          </div>
        </div>
      </section>

      <main className="max-w-3xl mx-auto px-6 -mt-8 pb-16">
        <div className="bg-white rounded-2xl border-2 border-sat-teal p-8 shadow-lg relative">
          <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-sat-teal text-white text-xs px-4 py-1 rounded-full font-bold uppercase tracking-wider">Current Plan</span>
          <h2 className="text-xl font-bold text-slate-800 mb-1 text-center">Full Access — Free Trial</h2>
          <p className="text-slate-500 text-sm text-center mb-6">Everything unlocked until August 15, 2026</p>

          <div className="grid sm:grid-cols-2 gap-4 mb-8">
            {[
              "15 full-length adaptive tests",
              "Themed practice questions",
              "Video lesson library",
              "Full vocabulary decks",
              "Instant scoring & review",
              "Detailed answer explanations",
              "Performance tracking",
              "All future updates",
            ].map((feature) => (
              <div key={feature} className="flex items-center gap-2 text-sm text-slate-700">
                <svg className="w-4 h-4 text-sat-teal shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
                {feature}
              </div>
            ))}
          </div>

          <Link
            href={!isLoaded ? "#" : isSignedIn ? "/my-tests" : "/sign-up"}
            className={`block w-full text-center py-3.5 rounded-xl font-bold text-base ${
              !isLoaded
                ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                : "bg-sat-teal text-white hover:bg-sat-teal-hover transition-colors"
            }`}
          >
            {!isLoaded ? "Loading..." : isSignedIn ? "Start a Practice Test" : "Create Free Account"}
          </Link>

          <p className="text-xs text-slate-400 text-center mt-3">After 2 months we&apos;ll announce pricing. Early users get a special rate.</p>
        </div>
      </main>

      <footer className="bg-white border-t border-slate-200 py-8 text-center text-sm text-slate-400">
        &copy; 2026 satzone. All rights reserved. &middot; Uzbekistan
      </footer>
    </div>
  );
}
