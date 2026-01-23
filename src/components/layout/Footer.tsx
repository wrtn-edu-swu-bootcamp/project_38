// Footer component

import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-gray-200 bg-gray-50">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          {/* About */}
          <div>
            <h3 className="mb-4 text-sm font-semibold text-gray-900">
              FactChecker
            </h3>
            <p className="text-sm text-gray-600">
              학술자료 기반 팩트체크 서비스
              <br />
              AI와 도서관 연계로 정확한 정보를 제공합니다.
            </p>
          </div>

          {/* Services */}
          <div>
            <h3 className="mb-4 text-sm font-semibold text-gray-900">
              서비스
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/verify"
                  className="text-gray-600 hover:text-primary-600"
                >
                  팩트체크
                </Link>
              </li>
              <li>
                <Link
                  href="/library"
                  className="text-gray-600 hover:text-primary-600"
                >
                  도서관 연계
                </Link>
              </li>
              <li>
                <Link
                  href="/history"
                  className="text-gray-600 hover:text-primary-600"
                >
                  검증 내역
                </Link>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="mb-4 text-sm font-semibold text-gray-900">
              정보
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/about"
                  className="text-gray-600 hover:text-primary-600"
                >
                  서비스 소개
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-gray-600 hover:text-primary-600"
                >
                  문의하기
                </Link>
              </li>
              <li>
                <Link
                  href="/faq"
                  className="text-gray-600 hover:text-primary-600"
                >
                  자주 묻는 질문
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="mb-4 text-sm font-semibold text-gray-900">
              약관
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/privacy"
                  className="text-gray-600 hover:text-primary-600"
                >
                  개인정보처리방침
                </Link>
              </li>
              <li>
                <Link
                  href="/terms"
                  className="text-gray-600 hover:text-primary-600"
                >
                  이용약관
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-8 border-t border-gray-200 pt-8 text-center">
          <p className="text-sm text-gray-500">
            © 2026 FactChecker. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
