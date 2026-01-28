"use client";

import React from "react";
import Skeleton from "react-loading-skeleton";

const LoginLoading = () => {
  return (
    <div className="max-w-md mx-auto mt-20 space-y-6">
      {/* Title */}
      <div className="text-center">
        <Skeleton height={28} width="70%" />
      </div>

      {/* Google sign-in button */}
      <Skeleton height={40} borderRadius={8} />

      {/* or text */}
      <div className="flex justify-center">
        <Skeleton height={16} width={40} />
      </div>

      {/* Email input */}
      <Skeleton height={40} borderRadius={6} />

      {/* Password input */}
      <Skeleton height={40} borderRadius={6} />

      {/* Login button */}
      <Skeleton height={40} borderRadius={8} />
    </div>
  );
};

export default LoginLoading;
