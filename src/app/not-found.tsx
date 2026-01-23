import Link from "next/link";
import { Button } from "@/components/ui/Button";

export default function NotFound() {
  return (
    <div className="container mx-auto px-4 py-24">
      <div className="mx-auto max-w-2xl text-center">
        <div className="mb-8">
          <svg
            className="mx-auto h-32 w-32 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>
        
        <h1 className="mb-4 text-6xl font-bold text-gray-900">404</h1>
        
        <h2 className="mb-4 text-3xl font-bold text-gray-900">
          페이지를 찾을 수 없습니다
        </h2>
        
        <p className="mb-8 text-lg text-gray-600">
          요청하신 페이지가 존재하지 않거나 이동되었을 수 있습니다.
          <br />
          URL을 확인하시고 다시 시도해주세요.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/">
            <Button variant="primary" size="large">
              홈으로 돌아가기
            </Button>
          </Link>
          <Link href="/verify">
            <Button variant="secondary" size="large">
              검증하기
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
