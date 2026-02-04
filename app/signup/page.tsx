"use client";

import React, { useState } from "react";
import { signIn } from "next-auth/react";
import { GoogleIcon } from "@/app/components/icons/GoogleIcon";
import AuthSkeleton from "@/app/components/auth/AuthSkeleton";

const SignupPage = () => {
  const [loading, setLoading] = useState(false);

  if (loading) return <AuthSkeleton />;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 px-4">
      <div className="w-full max-w-sm sm:max-w-md bg-white p-6 sm:p-10 rounded-2xl shadow-xl space-y-8 border border-gray-100">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent">
            Create Your Account
          </h1>
          <p className="text-gray-500 text-sm sm:text-base">
            Join the NEU academic platform
          </p>
        </div>

        {/* Google Signup */}
        <button
          onClick={async () => {
            setLoading(true);
            const res = await signIn("google", { callbackUrl: "/dashboard" });
            if (!res) throw new Error("Google signup failed");
          }}
          className="
            w-full border 
            py-3 sm:py-3.5 
            rounded-lg 
            hover:bg-gray-50 
            transition 
            font-medium 
            flex items-center justify-center gap-3
            text-sm sm:text-base
          "
        >
          <GoogleIcon />
          <span>Sign Up with Google</span>
        </button>

        {/* Divider */}
        <div className="flex items-center gap-4">
          <div className="flex-1 h-px bg-gray-200" />
          <span className="text-gray-400 text-sm">or</span>
          <div className="flex-1 h-px bg-gray-200" />
        </div>

        {/* Credentials Signup */}
        <form
          onSubmit={async (e) => {
            e.preventDefault();
            const form = e.currentTarget as any;

            setLoading(true);

            const res = await fetch("/api/auth/register", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                name: form.name.value,
                email: form.email.value,
                password: form.password.value,
              }),
            });

            if (!res.ok) {
              const data = await res.json();
              throw new Error(data.error || "Could not create account");
            }

            await signIn("credentials", {
              email: form.email.value,
              password: form.password.value,
              callbackUrl: "/dashboard",
            });
          }}
          className="space-y-4"
        >
          <input
            type="text"
            name="name"
            placeholder="Full Name"
            required
            className="
              w-full border 
              p-3 sm:p-3.5 
              rounded-lg 
              focus:ring-2 focus:ring-blue-500 
              outline-none 
              text-sm sm:text-base
            "
          />

          <input
            type="email"
            name="email"
            placeholder="Email"
            required
            className="
              w-full border 
              p-3 sm:p-3.5 
              rounded-lg 
              focus:ring-2 focus:ring-blue-500 
              outline-none 
              text-sm sm:text-base
            "
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            required
            className="
              w-full border 
              p-3 sm:p-3.5 
              rounded-lg 
              focus:ring-2 focus:ring-blue-500 
              outline-none 
              text-sm sm:text-base
            "
          />

          <button
            className="
              w-full bg-blue-600 text-white 
              py-3 sm:py-3.5 
              rounded-lg 
              hover:bg-blue-700 
              transition 
              font-medium 
              text-sm sm:text-base
            "
          >
            Create Account
          </button>
        </form>
      </div>
    </div>
  );
};

export default SignupPage;
