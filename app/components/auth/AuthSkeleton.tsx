"use client";

import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

export default function AuthSkeleton() {
  return (
    <div className="max-w-sm sm:max-w-md mx-auto mt-14 sm:mt-20 space-y-6 px-4">
      {/* Title */}
      <div className="text-center">
        <Skeleton height={26} className="sm:h-[28px]" width="60%" />
      </div>

      {/* Google button */}
      <Skeleton height={44} className="sm:h-[48px]" borderRadius={10} />

      {/* OR */}
      <div className="flex justify-center">
        <Skeleton height={14} className="sm:h-[16px]" width={40} />
      </div>

      {/* Inputs */}
      <Skeleton height={44} className="sm:h-[48px]" borderRadius={10} />
      <Skeleton height={44} className="sm:h-[48px]" borderRadius={10} />

      {/* Submit button */}
      <Skeleton height={44} className="sm:h-[48px]" borderRadius={10} />
    </div>
  );
}
