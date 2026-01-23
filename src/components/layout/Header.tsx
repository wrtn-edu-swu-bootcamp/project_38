// Header component with navigation

"use client";

import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/Button";

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-gray-200 bg-white shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary-600 text-white font-bold text-lg">
              F
            </div>
            <span className="text-xl font-bold text-gray-900">
              FactChecker
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link
              href="/"
              className="text-sm font-medium text-gray-600 hover:text-primary-600 transition-colors"
            >
              홈
            </Link>
            <Link
              href="/verify"
              className="text-sm font-medium text-gray-600 hover:text-primary-600 transition-colors"
            >
              검증하기
            </Link>
            <Link
              href="/history"
              className="text-sm font-medium text-gray-600 hover:text-primary-600 transition-colors"
            >
              내역
            </Link>
          </nav>

          {/* Auth Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            <Link href="/login">
              <Button variant="text" size="small">
                로그인
              </Button>
            </Link>
            <Link href="/register">
              <Button variant="primary" size="small">
                회원가입
              </Button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            type="button"
            className="md:hidden rounded-lg p-2 text-gray-600 hover:bg-gray-100"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <svg
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              {mobileMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="border-t border-gray-200 py-4 md:hidden">
            <nav className="flex flex-col space-y-4">
              <Link
                href="/"
                className="text-sm font-medium text-gray-600 hover:text-primary-600"
              >
                홈
              </Link>
              <Link
                href="/verify"
                className="text-sm font-medium text-gray-600 hover:text-primary-600"
              >
                검증하기
              </Link>
              <Link
                href="/history"
                className="text-sm font-medium text-gray-600 hover:text-primary-600"
              >
                내역
              </Link>
              <div className="flex flex-col space-y-2 pt-4 border-t border-gray-200">
                <Link href="/login">
                  <Button variant="text" size="small" className="w-full">
                    로그인
                  </Button>
                </Link>
                <Link href="/register">
                  <Button variant="primary" size="small" className="w-full">
                    회원가입
                  </Button>
                </Link>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
