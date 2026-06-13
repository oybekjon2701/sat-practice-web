"use client";

import { TestProvider } from "@/lib/TestContext";

export default function TestLayout({ children }: { children: React.ReactNode }) {
  return <TestProvider>{children}</TestProvider>;
}
