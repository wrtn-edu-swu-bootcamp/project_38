"use client";

import { useState, useEffect } from "react";
import { api } from "@/lib/trpc";
import { useSession } from "next-auth/react";

interface BookmarkButtonProps {
  factCheckId: string;
  className?: string;
}

export function BookmarkButton({
  factCheckId,
  className = "",
}: BookmarkButtonProps) {
  const { data: session } = useSession();
  const [isBookmarked, setIsBookmarked] = useState(false);

  // 북마크 여부 확인
  const { data: bookmarkData } = api.bookmark.check.useQuery(
    { factCheckId },
    { enabled: !!session }
  );

  const utils = api.useUtils();

  // 북마크 추가
  const addBookmark = api.bookmark.create.useMutation({
    onSuccess: () => {
      setIsBookmarked(true);
      utils.bookmark.check.invalidate({ factCheckId });
      utils.bookmark.getAll.invalidate();
    },
  });

  // 북마크 삭제
  const removeBookmark = api.bookmark.delete.useMutation({
    onSuccess: () => {
      setIsBookmarked(false);
      utils.bookmark.check.invalidate({ factCheckId });
      utils.bookmark.getAll.invalidate();
    },
  });

  useEffect(() => {
    if (bookmarkData) {
      setIsBookmarked(bookmarkData.bookmarked);
    }
  }, [bookmarkData]);

  if (!session) {
    return null; // 비로그인 사용자는 북마크 불가
  }

  const handleClick = () => {
    if (isBookmarked) {
      removeBookmark.mutate({ factCheckId });
    } else {
      addBookmark.mutate({ factCheckId });
    }
  };

  const isLoading = addBookmark.isPending || removeBookmark.isPending;

  return (
    <button
      onClick={handleClick}
      disabled={isLoading}
      className={`inline-flex items-center space-x-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
        isBookmarked
          ? "bg-primary-100 text-primary-700 hover:bg-primary-200 dark:bg-primary-900 dark:text-primary-300"
          : "border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
      } ${isLoading ? "cursor-not-allowed opacity-50" : ""} ${className}`}
      title={isBookmarked ? "북마크 제거" : "북마크 추가"}
    >
      {isLoading ? (
        <svg
          className="h-5 w-5 animate-spin"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
      ) : isBookmarked ? (
        // Filled bookmark icon
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          className="h-5 w-5"
        >
          <path
            fillRule="evenodd"
            d="M6.32 2.577a49.255 49.255 0 0111.36 0c1.497.174 2.57 1.46 2.57 2.93V21a.75.75 0 01-1.085.67L12 18.089l-7.165 3.583A.75.75 0 013.75 21V5.507c0-1.47 1.073-2.756 2.57-2.93z"
            clipRule="evenodd"
          />
        </svg>
      ) : (
        // Outline bookmark icon
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="h-5 w-5"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0111.186 0z"
          />
        </svg>
      )}
      <span>{isBookmarked ? "북마크됨" : "북마크"}</span>
    </button>
  );
}
