"use client";
import React from "react";
import { signIn } from "next-auth/react";
import { email } from "zod";

const SignupPage = () => {
  return (
    <div className="max-w-md mx-auto mt-20 space-y-6">
      <h1 className="text-2xl font-bold text-center">Create a New Account</h1>
      <button
        onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
        className="w-full border p-2 rounded btn"
      >
        {" "}
        Sign Up with Google
      </button>
      <div className="text-gray-500 text-center">or</div>

      <form
        onSubmit={async (e) => {
          e.preventDefault();
          const form = e.currentTarget as any;
          await fetch("/api/auth/register", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              email: form.email.value,
              password: form.password.value,
              name: form.name.value,
            }),
          });
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
          name="name" // ✅ add name
          placeholder="Full Name"
          required
          className="w-full border p-2"
        />
        <input
          type="email"
          name="email" // ✅ add name
          placeholder="Email"
          required
          className="w-full border p-2"
        />
        <input
          type="password"
          name="password" // ✅ add name
          placeholder="Password"
          required
          className="w-full border p-2"
        />
        <button className="w-full bg-blue-600 text-white p-2 rounded">
          Create account
        </button>
      </form>
    </div>
  );
};

export default SignupPage;
