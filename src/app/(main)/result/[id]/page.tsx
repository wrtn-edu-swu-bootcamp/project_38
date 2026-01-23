"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { api } from "@/lib/trpc";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/Tabs";
import { BookmarkButton } from "@/components/ui/BookmarkButton";
import { generateFactCheckPDF } from "@/utils/pdf";

// Note: Cannot use generateMetadata in client component
// Metadata should be set server-side, but since this is a client component
// for real-time updates, we'll handle SEO via other means

export default function ResultPage() {
  const params = useParams();
  const id = params?.id as string;

  // Poll for status updates every 2 seconds when processing
  const { data: factCheck } = api.factCheck.getById.useQuery(
    { id },
    {
      enabled: !!id,
      refetchInterval: (query) => {
        const data = query.state.data;
        if (!data) return false;
        return data.status === "PROCESSING" ? 2000 : false;
      },
    }
  );

  if (!factCheck) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="mx-auto max-w-4xl text-center">
          <p className="text-gray-600">로딩 중...</p>
        </div>
      </div>
    );
  }

  if (factCheck.status === "PENDING" || factCheck.status === "PROCESSING") {
    return <ProcessingView />;
  }

  if (factCheck.status === "FAILED") {
    return <FailedView />;
  }

  return <CompletedView factCheck={factCheck} />;
}

function ProcessingView() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mx-auto max-w-3xl">
        <Card>
          <CardContent className="py-12 text-center">
            <div className="mb-6 inline-block">
              <svg
                className="h-16 w-16 animate-spin text-primary-600"
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
            </div>
            <h2 className="mb-4 text-2xl font-bold text-gray-900">
              정보를 분석하고 있습니다
            </h2>
            <p className="mb-8 text-gray-600">
              학술자료를 검색하고 AI가 신뢰도를 평가하고 있습니다.
              <br />
              잠시만 기다려주세요...
            </p>
            <div className="space-y-3">
              <div className="flex items-center justify-center gap-3">
                <div className="h-2 w-2 rounded-full bg-primary-600 animate-pulse" />
                <p className="text-sm text-gray-500">학술정보 검색 중</p>
              </div>
              <div className="flex items-center justify-center gap-3">
                <div className="h-2 w-2 rounded-full bg-primary-600 animate-pulse delay-75" />
                <p className="text-sm text-gray-500">도서관 정보 조회 중</p>
              </div>
              <div className="flex items-center justify-center gap-3">
                <div className="h-2 w-2 rounded-full bg-primary-600 animate-pulse delay-150" />
                <p className="text-sm text-gray-500">AI 분석 진행 중</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function FailedView() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mx-auto max-w-3xl">
        <Card>
          <CardContent className="py-12 text-center">
            <div className="mb-6 inline-block">
              <svg
                className="h-16 w-16 text-danger"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h2 className="mb-4 text-2xl font-bold text-gray-900">
              분석 중 오류가 발생했습니다
            </h2>
            <p className="mb-8 text-gray-600">
              일시적인 문제가 발생했습니다. 다시 시도해주세요.
            </p>
            <Link href="/verify">
              <Button variant="primary">다시 시도하기</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function CompletedView({ factCheck }: { factCheck: any }) {
  const [shareMenuOpen, setShareMenuOpen] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);

  const verdictConfig: Record<
    string,
    { label: string; variant: "success" | "info" | "warning" | "danger" | "neutral" }
  > = {
    CONFIRMED: { label: "사실로 확인됨", variant: "success" as const },
    MOSTLY_TRUE: { label: "대체로 사실", variant: "info" as const },
    CAUTION: { label: "주의 필요", variant: "warning" as const },
    FALSE: { label: "거짓", variant: "danger" as const },
    UNVERIFIABLE: { label: "검증 불가", variant: "neutral" as const },
  };

  const verdict = factCheck.verdict
    ? verdictConfig[factCheck.verdict] || verdictConfig.UNVERIFIABLE
    : verdictConfig.UNVERIFIABLE;

  const handleDownloadPDF = () => {
    generateFactCheckPDF({
      content: factCheck.content,
      verdict: factCheck.verdict,
      trustScore: factCheck.trustScore,
      summary: factCheck.summary,
      explanation: factCheck.explanation,
      references: factCheck.references,
      createdAt: factCheck.createdAt,
    });
  };

  // Group references by type
  const papers = factCheck.references.filter((ref: any) =>
    ["ACADEMIC_PAPER", "JOURNAL", "THESIS"].includes(ref.type)
  );
  const books = factCheck.references.filter((ref: any) => ref.type === "BOOK");
  const news = factCheck.references.filter((ref: any) => ref.type === "NEWS");

  const shareUrl = typeof window !== 'undefined' ? window.location.href : '';
  const shareText = `FactChecker 검증 결과: ${verdict.label} (신뢰도 ${factCheck.trustScore?.toFixed(0)}점)`;

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'FactChecker 검증 결과',
          text: shareText,
          url: shareUrl,
        });
      } catch (err) {
        // User cancelled share or share failed
        console.log('Share cancelled');
      }
    } else {
      setShareMenuOpen(!shareMenuOpen);
    }
  };

  const handleCopyUrl = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (err) {
      console.error('Failed to copy URL', err);
    }
  };

  const handleTwitterShare = () => {
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`;
    window.open(url, '_blank', 'width=550,height=420');
  };

  const handleFacebookShare = () => {
    const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`;
    window.open(url, '_blank', 'width=550,height=420');
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mx-auto max-w-4xl space-y-8">
        {/* Trust Score Card */}
        <Card>
          <CardContent className="py-8">
            <div className="text-center">
              <Badge variant={verdict.variant} className="mb-4 text-lg px-6 py-2">
                {verdict.label}
              </Badge>
              <div className="mb-4">
                <div className="text-6xl font-bold text-gray-900">
                  {factCheck.trustScore?.toFixed(0) || "N/A"}
                  <span className="text-2xl text-gray-500">/100</span>
                </div>
                <p className="text-sm text-gray-600">신뢰도 점수</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Summary Card */}
        <Card>
          <CardHeader>
            <CardTitle>검증 요약</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700 leading-relaxed">{factCheck.summary}</p>
          </CardContent>
        </Card>

        {/* Detailed Explanation */}
        <Card>
          <CardHeader>
            <CardTitle>상세 분석</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700 whitespace-pre-line leading-relaxed">
              {factCheck.explanation}
            </p>
          </CardContent>
        </Card>

        {/* References */}
        <Card>
          <CardHeader>
            <CardTitle>참고 자료</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="papers">
              <TabsList className="mb-6">
                <TabsTrigger value="papers">
                  학술논문 ({papers.length})
                </TabsTrigger>
                <TabsTrigger value="books">
                  도서 ({books.length})
                </TabsTrigger>
                <TabsTrigger value="news">
                  뉴스 ({news.length})
                </TabsTrigger>
              </TabsList>

              <TabsContent value="papers">
                <ReferenceList references={papers} />
              </TabsContent>

              <TabsContent value="books">
                <ReferenceList references={books} />
              </TabsContent>

              <TabsContent value="news">
                <ReferenceList references={news} />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex flex-wrap gap-4">
          <Link href="/verify" className="flex-1">
            <Button variant="primary" size="large" className="w-full">
              새로운 검증하기
            </Button>
          </Link>
          <BookmarkButton factCheckId={factCheck.id} />
          <Button 
            variant="secondary" 
            size="large"
            onClick={handleDownloadPDF}
          >
            PDF 다운로드
          </Button>
          <div className="relative">
            <Button 
              variant="secondary" 
              size="large"
              onClick={handleShare}
            >
              결과 공유하기
            </Button>
            
            {shareMenuOpen && (
              <div className="absolute right-0 top-full mt-2 w-64 rounded-lg border border-gray-200 bg-white shadow-lg z-10">
                <div className="p-2">
                  <button
                    onClick={handleCopyUrl}
                    className="w-full rounded-md px-4 py-2 text-left text-sm hover:bg-gray-100 transition-colors flex items-center gap-2"
                  >
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                    {copySuccess ? '✓ 복사됨!' : 'URL 복사'}
                  </button>
                  
                  <button
                    onClick={handleTwitterShare}
                    className="w-full rounded-md px-4 py-2 text-left text-sm hover:bg-gray-100 transition-colors flex items-center gap-2"
                  >
                    <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                    </svg>
                    Twitter에 공유
                  </button>
                  
                  <button
                    onClick={handleFacebookShare}
                    className="w-full rounded-md px-4 py-2 text-left text-sm hover:bg-gray-100 transition-colors flex items-center gap-2"
                  >
                    <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                    </svg>
                    Facebook에 공유
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function ReferenceList({ references }: { references: any[] }) {
  if (references.length === 0) {
    return (
      <p className="text-center text-gray-500 py-8">
        참고 자료가 없습니다
      </p>
    );
  }

  return (
    <div className="space-y-4">
      {references.map((ref) => (
        <div
          key={ref.id}
          className="rounded-lg border border-gray-200 p-4 hover:border-primary-300 transition-colors"
        >
          <h4 className="mb-2 font-semibold text-gray-900">{ref.title}</h4>
          {ref.authors && (
            <p className="mb-1 text-sm text-gray-600">저자: {ref.authors}</p>
          )}
          {ref.publisher && (
            <p className="mb-1 text-sm text-gray-600">
              출처: {ref.publisher}
            </p>
          )}
          {ref.snippet && (
            <p className="mb-2 text-sm text-gray-700">{ref.snippet}</p>
          )}
          {ref.url && (
            <a
              href={ref.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-primary-600 hover:underline"
            >
              자세히 보기 →
            </a>
          )}
        </div>
      ))}
    </div>
  );
}
