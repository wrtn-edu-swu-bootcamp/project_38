"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/trpc";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import Link from "next/link";

export default function BookmarksPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const {
    data: bookmarksData,
    isLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = api.bookmark.getAll.useInfiniteQuery(
    { limit: 20 },
    {
      enabled: !!session,
      getNextPageParam: (lastPage) => lastPage.nextCursor,
    }
  );

  // 로그인 확인
  if (status === "loading") {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 w-48 rounded bg-gray-200 dark:bg-gray-700"></div>
          <div className="h-40 w-full rounded bg-gray-200 dark:bg-gray-700"></div>
          <div className="h-40 w-full rounded bg-gray-200 dark:bg-gray-700"></div>
        </div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="mb-4 text-2xl font-bold text-gray-900 dark:text-gray-100">
          로그인이 필요합니다
        </h1>
        <p className="mb-6 text-gray-600 dark:text-gray-400">
          북마크 기능을 사용하려면 로그인해주세요.
        </p>
        <Link href="/login">
          <Button variant="primary">로그인하기</Button>
        </Link>
      </div>
    );
  }

  const allBookmarks =
    bookmarksData?.pages.flatMap((page) => page.bookmarks) ?? [];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
          북마크
        </h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          저장한 팩트체크 결과를 확인하세요.
        </p>
      </div>

      {isLoading ? (
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="h-40 w-full animate-pulse rounded-lg bg-gray-200 dark:bg-gray-700"
            />
          ))}
        </div>
      ) : allBookmarks.length === 0 ? (
        <Card className="text-center py-12">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="h-8 w-8 text-gray-400"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0111.186 0z"
              />
            </svg>
          </div>
          <h3 className="mb-2 text-lg font-semibold text-gray-900 dark:text-gray-100">
            북마크가 없습니다
          </h3>
          <p className="mb-6 text-gray-600 dark:text-gray-400">
            관심 있는 팩트체크 결과를 북마크에 추가해보세요.
          </p>
          <Link href="/verify">
            <Button variant="primary">팩트체크 시작하기</Button>
          </Link>
        </Card>
      ) : (
        <>
          <div className="space-y-4">
            {allBookmarks.map((bookmark) => (
              <Link
                key={bookmark.id}
                href={`/result/${bookmark.factCheck.id}`}
                className="block"
              >
                <Card hover className="transition-all hover:border-primary-300">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="mb-2 flex items-center space-x-2">
                        {bookmark.factCheck.verdict && (
                          <Badge
                            variant={
                              bookmark.factCheck.verdict === "CONFIRMED"
                                ? "success"
                                : bookmark.factCheck.verdict === "MOSTLY_TRUE"
                                  ? "info"
                                  : bookmark.factCheck.verdict === "CAUTION"
                                    ? "warning"
                                    : "danger"
                            }
                          >
                            {bookmark.factCheck.verdict === "CONFIRMED" &&
                              "사실로 확인됨"}
                            {bookmark.factCheck.verdict === "MOSTLY_TRUE" &&
                              "대체로 사실"}
                            {bookmark.factCheck.verdict === "CAUTION" &&
                              "주의 필요"}
                            {bookmark.factCheck.verdict === "FALSE" && "거짓"}
                            {bookmark.factCheck.verdict === "UNVERIFIABLE" &&
                              "검증 불가"}
                          </Badge>
                        )}
                        {bookmark.factCheck.trustScore !== null && (
                          <span className="text-sm text-gray-500 dark:text-gray-400">
                            신뢰도 {bookmark.factCheck.trustScore}점
                          </span>
                        )}
                      </div>
                      <p className="mb-2 line-clamp-2 text-gray-900 dark:text-gray-100">
                        {bookmark.factCheck.content}
                      </p>
                      <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
                        <span>
                          참고자료 {bookmark.factCheck._count.references}개
                        </span>
                        <span>
                          {new Date(
                            bookmark.factCheck.createdAt
                          ).toLocaleDateString("ko-KR")}
                        </span>
                      </div>
                    </div>
                    <div className="ml-4">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        className="h-6 w-6 text-primary-600 dark:text-primary-400"
                      >
                        <path
                          fillRule="evenodd"
                          d="M6.32 2.577a49.255 49.255 0 0111.36 0c1.497.174 2.57 1.46 2.57 2.93V21a.75.75 0 01-1.085.67L12 18.089l-7.165 3.583A.75.75 0 013.75 21V5.507c0-1.47 1.073-2.756 2.57-2.93z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                  </div>
                </Card>
              </Link>
            ))}
          </div>

          {hasNextPage && (
            <div className="mt-6 text-center">
              <Button
                variant="secondary"
                onClick={() => fetchNextPage()}
                disabled={isFetchingNextPage}
                loading={isFetchingNextPage}
              >
                {isFetchingNextPage ? "로딩 중..." : "더 보기"}
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
