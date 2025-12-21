"use client";

import React from "react";
import { signIn } from "next-auth/react";

const LoginPage = () => {
  return (
    <div className="max-w-md mx-auto mt-20 space-y-6">
      <h1 className="text-2xl font-bold text-center">Log In to Your Account</h1>

      {/* Google login */}
      <button
        onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
        className="w-full border p-2 rounded btn"
      >
        Sign in with Google
      </button>

      <div className="text-gray-500 text-center">or</div>

      {/* Credentials login */}
      <form
        onSubmit={async (e) => {
          e.preventDefault();
          const form = e.currentTarget as any;

          await signIn("credentials", {
            email: form.email.value,
            password: form.password.value,
            callbackUrl: "/dashboard",
          });
        }}
        className="space-y-4"
      >
        <input
          type="email"
          name="email"
          placeholder="Email"
          required
          className="w-full border p-2"
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          required
          className="w-full border p-2"
        />
        <button
          type="submit"
          className="w-full bg-blue-600 text-white p-2 rounded"
        >
          Log In
        </button>
      </form>
    </div>
  );
};

export default LoginPage;
