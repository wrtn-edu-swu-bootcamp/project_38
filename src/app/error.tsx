"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/Button";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <div className="container mx-auto px-4 py-24">
      <div className="mx-auto max-w-2xl text-center">
        <div className="mb-8">
          <svg
            className="mx-auto h-32 w-32 text-danger"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
        </div>
        
        <h2 className="mb-4 text-3xl font-bold text-gray-900">
          문제가 발생했습니다
        </h2>
        
        <p className="mb-2 text-lg text-gray-600">
          예상치 못한 오류가 발생했습니다.
        </p>
        
        {error.message && (
          <p className="mb-8 text-sm text-gray-500 font-mono bg-gray-100 p-4 rounded">
            {error.message}
          </p>
        )}
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            variant="primary"
            size="large"
            onClick={() => reset()}
          >
            다시 시도하기
          </Button>
          <Button
            variant="secondary"
            size="large"
            onClick={() => window.location.href = '/'}
          >
            홈으로 돌아가기
          </Button>
        </div>
      </div>
    </div>
  );
}
