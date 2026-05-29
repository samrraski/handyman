"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Eye, EyeOff, Loader2, CheckCircle2 } from "lucide-react";

export default function SignUpPage() {
  const router = useRouter();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const supabase = createClient();
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: fullName },
      },
    });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    if (data.session) {
      router.push("/dashboard");
      router.refresh();
    } else {
      setSuccess(true);
    }
    setLoading(false);
  }

  if (success) {
    return (
      <div className="bg-brand-gray-900 rounded-2xl p-8 shadow-2xl text-center">
        <div className="flex justify-center mb-4">
          <CheckCircle2 size={48} className="text-brand-yellow" />
        </div>
        <h2 className="text-white text-xl font-bold mb-2">Check your email</h2>
        <p className="text-brand-gray-400 text-sm">
          We sent a confirmation link to <span className="text-white font-medium">{email}</span>.
          Click it to activate your account.
        </p>
        <Link
          href="/sign-in"
          className="mt-6 inline-block text-sm text-brand-yellow hover:text-brand-yellow-hover transition-colors"
        >
          Back to Sign In
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-brand-gray-900 rounded-2xl p-8 shadow-2xl">
      <h1 className="text-white text-2xl font-bold mb-1">Create your account</h1>
      <p className="text-brand-gray-400 text-sm mb-6">Start managing jobs and estimates for free</p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-brand-gray-200 mb-1.5">
            Full name
          </label>
          <input
            type="text"
            required
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder="John Smith"
            className="w-full bg-brand-gray-800 border border-brand-gray-600 rounded-lg px-3.5 py-2.5 text-white placeholder-brand-gray-600 text-sm focus:outline-none focus:border-brand-yellow transition-colors"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-brand-gray-200 mb-1.5">
            Email address
          </label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            className="w-full bg-brand-gray-800 border border-brand-gray-600 rounded-lg px-3.5 py-2.5 text-white placeholder-brand-gray-600 text-sm focus:outline-none focus:border-brand-yellow transition-colors"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-brand-gray-200 mb-1.5">
            Password
          </label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              required
              minLength={8}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Min. 8 characters"
              className="w-full bg-brand-gray-800 border border-brand-gray-600 rounded-lg px-3.5 py-2.5 pr-10 text-white placeholder-brand-gray-600 text-sm focus:outline-none focus:border-brand-yellow transition-colors"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-brand-gray-400 hover:text-white transition-colors"
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/30 rounded-lg px-3.5 py-2.5 text-red-400 text-sm">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-brand-yellow hover:bg-brand-yellow-hover text-brand-black font-semibold rounded-lg py-2.5 text-sm transition-colors flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {loading && <Loader2 size={16} className="animate-spin" />}
          Create Account
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-brand-gray-400">
        Already have an account?{" "}
        <Link href="/sign-in" className="text-brand-yellow hover:text-brand-yellow-hover font-medium transition-colors">
          Sign in
        </Link>
      </p>
    </div>
  );
}
