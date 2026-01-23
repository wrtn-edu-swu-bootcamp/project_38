/** @type {import('next').NextConfig} */
const nextConfig = {
  // 이미지 최적화
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com", // Google OAuth 프로필
      },
      {
        protocol: "https",
        hostname: "phinf.pstatic.net", // Naver 프로필
      },
      {
        protocol: "https",
        hostname: "k.kakaocdn.net", // Kakao 프로필
      },
      {
        protocol: "https",
        hostname: "bookthumb-phinf.pstatic.net", // Naver 책 표지
      },
      {
        protocol: "https",
        hostname: "image.aladin.co.kr", // 알라딘 책 표지
      },
    ],
    formats: ["image/avif", "image/webp"],
  },

  // 서버 액션 설정
  experimental: {
    serverActions: {
      bodySizeLimit: "10mb", // 이미지 업로드용
    },
  },

  // 환경 변수 검증
  env: {
    NEXTAUTH_URL: process.env.NEXTAUTH_URL,
  },

  // 헤더 설정 (보안)
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "X-Frame-Options",
            value: "DENY",
          },
          {
            key: "X-XSS-Protection",
            value: "1; mode=block",
          },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
