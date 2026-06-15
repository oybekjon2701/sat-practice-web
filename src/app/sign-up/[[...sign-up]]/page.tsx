"use client";
import { useSignUp } from "@clerk/nextjs";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function SignUpPage() {
  const { isLoaded, signUp, setActive } = useSignUp();
  const router = useRouter();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [pendingVerification, setPendingVerification] = useState(false);
  const [code, setCode] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!signUp) return;
    setError("");
    try {
      await signUp.create({ firstName, lastName, emailAddress: email, password });
      await signUp.prepareEmailAddressVerification({ strategy: "email_code" });
      setPendingVerification(true);
    } catch (err: any) {
      setError(err.errors?.[0]?.message || "Something went wrong");
    }
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!signUp) return;
    setError("");
    try {
      const completeSignUp = await signUp.attemptEmailAddressVerification({ code });
      if (completeSignUp.status === "complete") {
        await setActive({ session: completeSignUp.createdSessionId });
        router.push("/dashboard");
      }
    } catch (err: any) {
      setError(err.errors?.[0]?.message || "Verification failed");
    }
  };

  if (!isLoaded) return null;

  if (pendingVerification) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white p-8 rounded-2xl shadow-lg max-w-sm w-full" style={{ fontFamily: "Arial, sans-serif" }}>
          <h1 className="text-xl font-bold text-gray-900 mb-1">Verify your email</h1>
          <p className="text-sm text-gray-600 mb-6">Enter the verification code sent to {email}</p>
          <form onSubmit={handleVerify} className="space-y-4">
            <input value={code} onChange={(e) => setCode(e.target.value)} placeholder="Verification code" className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm outline-none focus:border-primary" required />
            {error && <p className="text-sm text-red-600">{error}</p>}
            <button type="submit" className="w-full py-2.5 bg-primary text-white text-sm font-medium rounded-full hover:bg-primary-hover cursor-pointer">Verify</button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="bg-white p-8 rounded-2xl shadow-lg max-w-sm w-full" style={{ fontFamily: "Arial, sans-serif" }}>
        <h1 className="text-xl font-bold text-gray-900 mb-1">Create your account</h1>
        <p className="text-sm text-gray-600 mb-6">Sign up for SAT practice tests</p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex gap-3">
            <input value={firstName} onChange={(e) => setFirstName(e.target.value)} placeholder="First name" className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg text-sm outline-none focus:border-primary" required />
            <input value={lastName} onChange={(e) => setLastName(e.target.value)} placeholder="Last name" className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg text-sm outline-none focus:border-primary" required />
          </div>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email address" className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm outline-none focus:border-primary" required />
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm outline-none focus:border-primary" required />
          {error && <p className="text-sm text-red-600">{error}</p>}
          <button type="submit" className="w-full py-2.5 bg-primary text-white text-sm font-medium rounded-full hover:bg-primary-hover cursor-pointer">Sign Up</button>
        </form>
        <p className="text-sm text-gray-600 text-center mt-4">
          Already have an account?{" "}
          <a href="/sign-in" className="text-primary underline">Sign in</a>
        </p>
      </div>
    </div>
  );
}
