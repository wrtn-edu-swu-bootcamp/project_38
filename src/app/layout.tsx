import type { Metadata } from "next";
import { Providers } from "./providers";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import "./globals.css";

export const metadata: Metadata = {
  title: "FactChecker - 학술자료 기반 팩트체크 서비스",
  description:
    "가짜뉴스와 허위정보를 학술자료 기반으로 검증하고, 전국 도서관과 연계하여 오프라인 자료 접근성을 제공하는 팩트체크 서비스",
  keywords: [
    "팩트체크",
    "가짜뉴스",
    "허위정보",
    "검증",
    "학술자료",
    "도서관",
  ],
  authors: [{ name: "FactChecker Team" }],
  openGraph: {
    title: "FactChecker - 학술자료 기반 팩트체크 서비스",
    description:
      "AI와 학술자료를 활용한 정확한 정보 검증, 전국 도서관 연계 서비스",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko" suppressHydrationWarning>
      <body className="font-sans antialiased">
        <Providers>
          <div className="flex min-h-screen flex-col">
            <Header />
            <main className="flex-1">{children}</main>
            <Footer />
          </div>
        </Providers>
      </body>
    </html>
  );
}
