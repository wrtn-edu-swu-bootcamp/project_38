import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";

export default function HomePage() {
  return (
    <main>
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-primary-50 to-white py-20">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-4xl text-center">
            <h1 className="mb-6 text-5xl font-bold text-gray-900 md:text-6xl">
              AI와 학술자료로
              <br />
              <span className="text-primary-600">정확한 정보 검증</span>
            </h1>
            <p className="mb-8 text-xl text-gray-600">
              가짜뉴스와 허위정보를 학술자료 기반으로 검증하고,
              <br />
              전국 도서관 연계로 오프라인 자료까지 확인하세요
            </p>
            <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
              <Link href="/verify">
                <Button variant="primary" size="large">
                  지금 검증하기
                </Button>
              </Link>
              <Link href="/about">
                <Button variant="secondary" size="large">
                  서비스 소개
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="mb-12 text-center text-3xl font-bold text-gray-900">
            주요 기능
          </h2>
          <div className="grid gap-8 md:grid-cols-3">
            <Card>
              <CardHeader>
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary-100">
                  <svg
                    className="h-6 w-6 text-primary-600"
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
                </div>
                <CardTitle>다양한 입력 방식</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  텍스트, URL, 이미지 등 다양한 형태의 정보를 입력하여
                  검증할 수 있습니다.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-success/10">
                  <svg
                    className="h-6 w-6 text-success"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <CardTitle>AI 기반 분석</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Claude AI가 학술논문, 도서, 뉴스 등을 종합 분석하여
                  신뢰도를 평가합니다.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-info/10">
                  <svg
                    className="h-6 w-6 text-info"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                </div>
                <CardTitle>도서관 연계</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  참고 도서가 있는 전국 도서관 위치를 지도로 확인하고
                  대출할 수 있습니다.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section className="bg-gray-50 py-20">
        <div className="container mx-auto px-4">
          <h2 className="mb-12 text-center text-3xl font-bold text-gray-900">
            어떻게 작동하나요?
          </h2>
          <div className="mx-auto max-w-3xl space-y-8">
            <div className="flex gap-6">
              <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-primary-600 text-white font-bold">
                1
              </div>
              <div>
                <h3 className="mb-2 text-xl font-semibold text-gray-900">
                  정보 입력
                </h3>
                <p className="text-gray-600">
                  검증하고 싶은 정보를 텍스트, URL, 또는 이미지로 입력합니다.
                </p>
              </div>
            </div>
            <div className="flex gap-6">
              <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-primary-600 text-white font-bold">
                2
              </div>
              <div>
                <h3 className="mb-2 text-xl font-semibold text-gray-900">
                  자료 수집
                </h3>
                <p className="text-gray-600">
                  학술논문, 도서, 뉴스 등 다양한 출처에서 관련 자료를 자동으로 수집합니다.
                </p>
              </div>
            </div>
            <div className="flex gap-6">
              <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-primary-600 text-white font-bold">
                3
              </div>
              <div>
                <h3 className="mb-2 text-xl font-semibold text-gray-900">
                  AI 분석
                </h3>
                <p className="text-gray-600">
                  Claude AI가 수집된 자료를 종합 분석하여 신뢰도 점수와 판정을 제공합니다.
                </p>
              </div>
            </div>
            <div className="flex gap-6">
              <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-primary-600 text-white font-bold">
                4
              </div>
              <div>
                <h3 className="mb-2 text-xl font-semibold text-gray-900">
                  결과 확인
                </h3>
                <p className="text-gray-600">
                  상세한 분석 결과와 참고 자료, 그리고 도서관 위치를 확인합니다.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl rounded-2xl bg-primary-600 px-8 py-16 text-center text-white">
            <h2 className="mb-4 text-3xl font-bold">
              지금 바로 시작해보세요
            </h2>
            <p className="mb-8 text-lg text-primary-50">
              무료로 정보를 검증하고, 믿을 수 있는 정보를 찾아보세요
            </p>
            <Link href="/verify">
              <Button variant="secondary" size="large">
                팩트체크 시작하기
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
