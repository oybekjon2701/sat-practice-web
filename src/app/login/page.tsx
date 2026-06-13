"use client";

import { useUser } from "@clerk/nextjs";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
  const { isSignedIn, isLoaded } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (isLoaded && isSignedIn) {
      router.push("/my-tests");
    }
  }, [isLoaded, isSignedIn, router]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">Sign in to continue</h1>
        <Link
          href="/sign-in"
          className="inline-block bg-[#1a73e8] text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700"
        >
          Sign In
        </Link>
        <p className="mt-4 text-sm text-gray-500">
          Don&apos;t have an account?{" "}
          <Link href="/sign-up" className="text-[#1a73e8] hover:underline">Sign up</Link>
        </p>
      </div>
    </div>
  );
}
