import { auth, currentUser } from "@clerk/nextjs/server";
import { prisma } from "@/lib/db";
import Link from "next/link";
import { isFreeTest } from "@/lib/constants";

export default async function DashboardPage() {
  const user = await currentUser();
  if (!user) return null;

  const results = await prisma.testResult.findMany({
    where: { userId: user.id },
    orderBy: { completedAt: "desc" },
  });

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

      <main className="max-w-3xl mx-auto px-6 py-12">
        <h1 className="text-2xl font-bold text-gray-800 mb-1">Dashboard</h1>
        <p className="text-gray-500 text-sm mb-8">
          Welcome back, {user.firstName || user.emailAddresses[0]?.emailAddress}
        </p>

        {results.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-200 p-8 text-center">
            <p className="text-gray-500 mb-4">No test results yet.</p>
            <Link href="/my-tests" className="inline-block bg-[#1a73e8] text-white px-6 py-2.5 rounded-lg font-semibold hover:bg-blue-700">
              Take a Practice Test
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {results.map((r) => (
              <div key={r.id} className="bg-white rounded-2xl border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold text-gray-800">{r.testName}</h3>
                  <span className={`text-lg font-bold ${r.totalScore >= 1200 ? "text-green-600" : "text-gray-600"}`}>
                    {r.totalScore}
                  </span>
                </div>
                <div className="flex gap-6 text-sm text-gray-500">
                  <span>R&W: {r.readingScore} ({r.readingCorrect}/{r.readingTotal})</span>
                  <span>Math: {r.mathScore} ({r.mathCorrect}/{r.mathTotal})</span>
                  <span>{new Date(r.completedAt).toLocaleDateString()}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
