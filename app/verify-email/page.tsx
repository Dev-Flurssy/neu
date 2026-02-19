"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

const VerifyEmailContent = () => {
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [resendMessage, setResendMessage] = useState("");
  const [resendCooldown, setResendCooldown] = useState(0);
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email");

  useEffect(() => {
    if (!email) {
      router.push("/signup");
    }
  }, [email, router]);

  // Countdown timer for resend button
  useEffect(() => {
    if (resendCooldown > 0) {
      const timer = setTimeout(() => {
        setResendCooldown(resendCooldown - 1);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [resendCooldown]);

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) return;

    try {
      setLoading(true);
      setError("");

      const res = await fetch("/api/auth/verify-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, code }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to verify email");
      }

      setSuccess(true);
      setTimeout(() => {
        router.push("/login");
      }, 2000);
    } catch (err: any) {
      setError(err.message || "Failed to verify email");
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (!email || resendCooldown > 0) return;

    try {
      setResendLoading(true);
      setResendMessage("");
      setError("");

      const res = await fetch("/api/auth/send-verification", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to resend code");
      }

      // Set cooldown to 60 seconds
      setResendCooldown(60);

      // In dev mode, show the verification code
      if (data.devCode) {
        console.log("🔑 DEV MODE - Verification Code:", data.devCode);
        setResendMessage(`Verification code sent! DEV MODE: ${data.devCode}`);
      } else {
        setResendMessage("Verification code sent! Check your email.");
      }
    } catch (err: any) {
      setError(err.message || "Failed to resend code");
    } finally {
      setResendLoading(false);
    }
  };

  if (!email) {
    return null;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 via-white to-blue-50 px-4 py-12">
      <div className="w-full max-w-md">
        {/* Logo/Brand */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl shadow-lg mb-4">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">
            Verify Your Email
          </h1>
          <p className="text-gray-600">
            We sent a verification code to
          </p>
          <p className="text-blue-600 font-medium mt-1">{email}</p>
        </div>

        {/* Main Card */}
        <div className="bg-white p-8 rounded-2xl shadow-xl border border-gray-100 space-y-6">
          {success ? (
            <div className="text-center py-4">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Email Verified!</h2>
              <p className="text-gray-600">Redirecting to login...</p>
            </div>
          ) : (
            <>
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

              {/* Success Message for Resend */}
              {resendMessage && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-start gap-3">
                  <svg className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <p className="text-sm font-medium text-green-800">{resendMessage}</p>
                </div>
              )}

              <form onSubmit={handleVerify} className="space-y-4">
                <div>
                  <label htmlFor="code" className="block text-sm font-medium text-gray-700 mb-2">
                    Verification Code
                  </label>
                  <input
                    id="code"
                    type="text"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    placeholder="Enter 6-digit code"
                    required
                    maxLength={6}
                    className="w-full border-2 border-gray-200 p-3 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-center text-2xl tracking-widest font-mono"
                  />
                  <p className="text-xs text-gray-500 mt-2 text-center">
                    Check your email inbox and spam folder. Code expires in 10 minutes.
                  </p>
                </div>

                <button
                  type="submit"
                  disabled={loading || code.length !== 6}
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all font-semibold shadow-lg shadow-blue-500/30 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? "Verifying..." : "Verify Email"}
                </button>
              </form>

              {/* Resend Code */}
              <div className="text-center pt-4 border-t border-gray-200">
                <p className="text-sm text-gray-600 mb-2">
                  Didn't receive the code?
                </p>
                <button
                  onClick={handleResend}
                  disabled={resendLoading || resendCooldown > 0}
                  className="text-blue-600 hover:text-blue-700 font-medium text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {resendLoading 
                    ? "Sending..." 
                    : resendCooldown > 0 
                      ? `Resend Code (${resendCooldown}s)` 
                      : "Resend Code"}
                </button>
                {resendCooldown > 0 && (
                  <p className="text-xs text-gray-500 mt-1">
                    Please wait {resendCooldown} seconds before requesting a new code
                  </p>
                )}
              </div>
            </>
          )}
        </div>

        {/* Back to Login */}
        <p className="text-center mt-6 text-gray-600">
          <Link href="/login" className="text-blue-600 hover:text-blue-700 font-semibold">
            Back to Login
          </Link>
        </p>
      </div>
    </div>
  );
};

const VerifyEmailPage = () => {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 via-white to-blue-50">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    }>
      <VerifyEmailContent />
    </Suspense>
  );
};

export default VerifyEmailPage;
