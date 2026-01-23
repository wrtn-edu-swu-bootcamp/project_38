"use client";

import { useState } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { api } from "@/lib/trpc";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";

export default function HistoryPage() {
  const { data: session, status } = useSession();
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const {
    data: historyData,
    isLoading,
    refetch,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = api.factCheck.getAll.useInfiniteQuery(
    { limit: 10 },
    {
      enabled: !!session,
      getNextPageParam: (lastPage) => lastPage.nextCursor,
    }
  );

  const deleteMutation = api.factCheck.delete.useMutation({
    onSuccess: () => {
      refetch();
      setDeletingId(null);
    },
    onError: () => {
      setDeletingId(null);
    },
  });

  const handleDelete = (id: string) => {
    if (confirm("이 검증 내역을 삭제하시겠습니까?")) {
      setDeletingId(id);
      deleteMutation.mutate({ id });
    }
  };

  // Show login prompt if not authenticated
  if (status === "loading") {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="mx-auto max-w-4xl text-center">
          <p className="text-gray-600">로딩 중...</p>
        </div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="mx-auto max-w-md text-center">
          <Card>
            <CardContent className="py-12">
              <svg
                className="mx-auto mb-4 h-16 w-16 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                />
              </svg>
              <h2 className="mb-2 text-xl font-bold text-gray-900">
                로그인이 필요합니다
              </h2>
              <p className="mb-6 text-gray-600">
                검증 내역을 확인하려면 로그인해주세요
              </p>
              <Link href="/login">
                <Button variant="primary" size="large">
                  로그인하기
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const allItems = historyData?.pages.flatMap((page) => page.items) ?? [];

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mx-auto max-w-4xl">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">검증 내역</h1>
            <p className="mt-2 text-gray-600">
              지금까지 검증한 정보들을 확인하세요
            </p>
          </div>
          <Link href="/verify">
            <Button variant="primary">새 검증하기</Button>
          </Link>
        </div>

        {isLoading ? (
          <div className="text-center py-12">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-primary-600 border-r-transparent" />
            <p className="mt-4 text-gray-600">내역을 불러오는 중...</p>
          </div>
        ) : allItems.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <svg
                className="mx-auto mb-4 h-16 w-16 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              <h2 className="mb-2 text-xl font-bold text-gray-900">
                검증 내역이 없습니다
              </h2>
              <p className="mb-6 text-gray-600">
                첫 번째 팩트체크를 시작해보세요!
              </p>
              <Link href="/verify">
                <Button variant="primary">검증 시작하기</Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {allItems.map((item) => (
              <HistoryItem
                key={item.id}
                item={item}
                onDelete={handleDelete}
                isDeleting={deletingId === item.id}
              />
            ))}

            {hasNextPage && (
              <div className="text-center pt-4">
                <Button
                  variant="secondary"
                  onClick={() => fetchNextPage()}
                  loading={isFetchingNextPage}
                  disabled={isFetchingNextPage}
                >
                  더 보기
                </Button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

interface HistoryItemProps {
  item: {
    id: string;
    content: string;
    trustScore: number | null;
    verdict: string | null;
    status: string;
    createdAt: Date;
    references: { id: string }[];
  };
  onDelete: (id: string) => void;
  isDeleting: boolean;
}

function HistoryItem({ item, onDelete, isDeleting }: HistoryItemProps) {
  const verdictConfig: Record<
    string,
    { label: string; variant: "success" | "info" | "warning" | "danger" | "neutral" }
  > = {
    CONFIRMED: { label: "사실", variant: "success" },
    MOSTLY_TRUE: { label: "대체로 사실", variant: "info" },
    CAUTION: { label: "주의", variant: "warning" },
    FALSE: { label: "거짓", variant: "danger" },
    UNVERIFIABLE: { label: "검증 불가", variant: "neutral" },
  };

  const statusConfig: Record<string, { label: string; color: string }> = {
    PENDING: { label: "대기 중", color: "text-yellow-600 bg-yellow-100" },
    PROCESSING: { label: "분석 중", color: "text-blue-600 bg-blue-100" },
    COMPLETED: { label: "완료", color: "text-green-600 bg-green-100" },
    FAILED: { label: "실패", color: "text-red-600 bg-red-100" },
  };

  const verdict = item.verdict
    ? verdictConfig[item.verdict] || verdictConfig.UNVERIFIABLE
    : null;

  const statusInfo = statusConfig[item.status] || statusConfig.PENDING;

  return (
    <Card className="hover:border-primary-200 transition-colors">
      <CardContent className="p-6">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2">
              {item.status === "COMPLETED" && verdict ? (
                <Badge variant={verdict.variant}>{verdict.label}</Badge>
              ) : (
                <span
                  className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${statusInfo.color}`}
                >
                  {statusInfo.label}
                </span>
              )}
              {item.trustScore !== null && (
                <span className="text-sm text-gray-500">
                  신뢰도 {item.trustScore.toFixed(0)}점
                </span>
              )}
            </div>

            <p className="text-gray-900 line-clamp-2 mb-2">{item.content}</p>

            <div className="flex items-center gap-4 text-sm text-gray-500">
              <span>
                {new Date(item.createdAt).toLocaleDateString("ko-KR", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
              <span>참고자료 {item.references.length}건</span>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-shrink-0">
            <Link href={`/result/${item.id}`}>
              <Button variant="secondary" size="small">
                상세보기
              </Button>
            </Link>
            <Button
              variant="text"
              size="small"
              onClick={() => onDelete(item.id)}
              disabled={isDeleting}
              className="text-gray-500 hover:text-red-600"
            >
              {isDeleting ? "삭제 중..." : "삭제"}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
