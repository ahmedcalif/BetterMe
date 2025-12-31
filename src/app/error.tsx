"use client";

import { useEffect } from "react";
import { Leaf } from "lucide-react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
      <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center mb-4">
        <Leaf className="w-8 h-8 text-red-400" />
      </div>
      <h1 className="text-2xl font-bold text-bark-800 mb-2">
        Something went wrong
      </h1>
      <p className="text-bark-500 mb-6">
        We encountered an unexpected error. Please try again.
      </p>
      <button onClick={reset} className="btn-primary">
        Try again
      </button>
    </div>
  );
}
