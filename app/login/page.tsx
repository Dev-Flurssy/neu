"use client";

import React, { useState, useEffect } from "react";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { GoogleIcon } from "@/app/components/icons/GoogleIcon";
import AuthSkeleton from "@/app/components/auth/AuthSkeleton";

const LoginPage = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { data: session, status } = useSession();
  const router = useRouter();

  // Redirect if already logged in
  useEffect(() => {
    const checkRoleAndRedirect = async () => {
      if (status === "authenticated" && session?.user?.email) {
        try {
          // Check if user is admin
          const res = await fetch("/api/admin/stats");
          if (res.ok) {
            // User is admin, redirect to admin panel
            router.push("/admin");
          } else {
            // Regular user, redirect to dashboard
            router.push("/dashboard");
          }
        } catch {
          // Default to dashboard on error
          router.push("/dashboard");
        }
      }
    };
    
    checkRoleAndRedirect();
  }, [status, session, router]);

  // Show loading while checking session or during login
  if (status === "loading" || loading) return <AuthSkeleton />;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50 px-4 py-12">
      <div className="w-full max-w-md">
        {/* Logo/Brand */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl shadow-lg mb-4">
            <span className="text-white font-bold text-2xl">N</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">
            Welcome Back
          </h1>
          <p className="text-gray-600">
            Log in to continue to NEU Notes
          </p>
        </div>

        {/* Main Card */}
        <div className="bg-white p-8 rounded-2xl shadow-xl border border-gray-100 space-y-6">
          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
              <svg className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              <div className="flex-1">
                <p className="text-sm font-medium text-red-800">{error}</p>
              </div>
              <button onClick={() => setError("")} className="text-red-400 hover:text-red-600">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          )}

          {/* Google Login */}
          <button
            onClick={async () => {
              try {
                setLoading(true);
                setError("");
                await signIn("google", { callbackUrl: "/dashboard" });
              } catch (err: any) {
                setError(err.message || "Failed to sign in with Google");
                setLoading(false);
              }
            }}
            className="w-full border-2 border-gray-200 py-3 rounded-xl hover:bg-gray-50 hover:border-gray-300 transition-all font-medium flex items-center justify-center gap-3 text-gray-700"
          >
            <GoogleIcon />
            <span>Continue with Google</span>
          </button>

          {/* Divider */}
          <div className="flex items-center gap-4">
            <div className="flex-1 h-px bg-gray-200" />
            <span className="text-gray-400 text-sm font-medium">OR</span>
            <div className="flex-1 h-px bg-gray-200" />
          </div>

          {/* Credentials Login */}
          <form
            onSubmit={async (e) => {
              e.preventDefault();
              const form = e.currentTarget as any;

              try {
                setLoading(true);
                setError("");

                const res = await signIn("credentials", {
                  email: form.email.value,
                  password: form.password.value,
                  redirect: false,
                });

                if (res?.error) {
                  throw new Error("Invalid email or password");
                }

                window.location.href = "/dashboard";
              } catch (err: any) {
                setError(err.message || "Failed to log in");
                setLoading(false);
              }
            }}
            className="space-y-4"
          >
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                name="email"
                placeholder="you@example.com"
                required
                className="w-full border-2 border-gray-200 p-3 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  Password
                </label>
                <Link 
                  href="/forgot-password" 
                  className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                >
                  Forgot password?
                </Link>
              </div>
              <input
                id="password"
                type="password"
                name="password"
                placeholder="••••••••"
                required
                className="w-full border-2 border-gray-200 p-3 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all font-semibold shadow-lg shadow-blue-500/30 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Logging in..." : "Log In"}
            </button>
          </form>
        </div>

        {/* Sign Up Link */}
        <p className="text-center mt-6 text-gray-600">
          Don't have an account?{" "}
          <Link href="/signup" className="text-blue-600 hover:text-blue-700 font-semibold">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
