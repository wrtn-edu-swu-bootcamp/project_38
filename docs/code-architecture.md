# FactChecker 코드 아키텍처

**버전**: 1.0  
**작성일**: 2026년 1월 23일  
**최종 수정일**: 2026년 1월 23일  
**문서 유형**: 기술 아키텍처 문서

---

## 목차

1. [개요](#1-개요)
2. [기술 스택](#2-기술-스택)
3. [프로젝트 구조](#3-프로젝트-구조)
4. [데이터베이스 설계](#4-데이터베이스-설계)
5. [API 아키텍처](#5-api-아키텍처)
6. [핵심 서비스 로직](#6-핵심-서비스-로직)
7. [프론트엔드 아키텍처](#7-프론트엔드-아키텍처)
8. [외부 서비스 연동](#8-외부-서비스-연동)
9. [배포 및 인프라](#9-배포-및-인프라)
10. [보안 전략](#10-보안-전략)
11. [성능 최적화](#11-성능-최적화)
12. [개발 워크플로우](#12-개발-워크플로우)

---

## 1. 개요

### 1.1 서비스 소개

FactChecker는 가짜뉴스와 허위정보를 학술자료 기반으로 검증하고, 전국 도서관과 연계하여 오프라인 자료 접근성을 제공하는 팩트체크 서비스입니다.

### 1.2 아키텍처 설계 원칙

1. **타입 안정성**: TypeScript + tRPC + Prisma + Zod를 통한 End-to-End 타입 세이프티
2. **확장 가능성**: 모듈화된 구조로 새로운 기능 추가 용이
3. **성능 최적화**: Next.js 최적화 기능 + 서버리스 아키텍처
4. **보안 우선**: 모든 입력 검증, API 키 보호, CSRF/XSS 방지
5. **개발자 경험**: 최신 안정화 도구로 빠른 개발 속도

### 1.3 시스템 아키텍처 다이어그램

```mermaid
graph TB
    Client[클라이언트 브라우저]
    NextJS[Next.js 16 App Router]
    tRPC[tRPC API Layer]
    Services[비즈니스 로직 서비스]
    
    Client -->|HTTPS| NextJS
    NextJS -->|Type-Safe API| tRPC
    tRPC --> Services
    
    Services --> DB[(Supabase PostgreSQL)]
    Services --> Claude[Claude API]
    Services --> NaverAPI[Naver API]
    Services --> LibraryAPI[도서관 정보나루]
    Services --> KakaoAPI[Kakao API]
    Services --> Scholar[Google Scholar]
    
    DB --> Prisma[Prisma ORM]
    Prisma --> Services
```

---

## 2. 기술 스택

### 2.1 프론트엔드 (2026년 1월 최신 안정화 버전)

#### 핵심 프레임워크
- **Next.js 16.1.4**
  - App Router 사용 (서버 컴포넌트 + 클라이언트 컴포넌트)
  - 서버 사이드 렌더링 (SSR)
  - 정적 사이트 생성 (SSG)
  - API Routes
  - 이유: Vercel 최적화, 뛰어난 성능, SEO 최적화

- **React 19.2.1**
  - React Actions 사용
  - useOptimistic 훅 활용
  - Suspense 개선 사항
  - 이유: 최신 기능, 성능 개선, 서버 컴포넌트 지원

- **TypeScript 5.7**
  - 엄격한 타입 체크
  - Path rewriting for relative paths
  - Never-initialized variables 체크
  - 이유: 타입 안정성, 런타임 에러 방지, IDE 지원

#### UI 및 스타일링
- **Tailwind CSS 4.1.18**
  - v4.0의 5배 빠른 빌드
  - CSS-first 설정
  - 네이티브 CSS 기능 (container queries, cascade layers)
  - 이유: 빠른 개발, 일관된 디자인, 유지보수 용이

- **Pretendard Variable** (한글 폰트)
- **Inter** (영문 폰트)
- **Heroicons** (아이콘 라이브러리)

### 2.2 백엔드

#### API 레이어
- **tRPC (TypeScript Remote Procedure Call)**
  - End-to-End 타입 세이프티
  - 자동 타입 추론
  - 클라이언트-서버 간 타입 동기화
  - 이유: REST/GraphQL 대비 낮은 보일러플레이트, 타입 안전성

#### ORM 및 검증
- **Prisma (최신 버전)**
  - PostgreSQL 전용 최적화
  - 타입 세이프 쿼리
  - 마이그레이션 관리
  - 이유: 타입 안전성, 우수한 DX, Supabase 최적 호환

- **Zod 4.3.5**
  - 런타임 스키마 검증
  - TypeScript 타입 추론
  - Codecs API (v4.1+)
  - 이유: tRPC와 완벽한 통합, 런타임 안전성

### 2.3 데이터베이스

- **Supabase PostgreSQL**
  - 서버리스 PostgreSQL
  - 실시간 데이터베이스
  - Row Level Security (RLS)
  - 이유: Vercel 최적 호환, 관리형 서비스, 무료 티어

**선택 근거**:
- PostgreSQL: 팩트체크 데이터의 무결성과 정확성이 중요하므로 ACID 준수 필수
- 관계형 구조: 팩트체크-참고자료-도서관 간의 복잡한 관계 표현에 적합
- JOIN 지원: 교차 검증을 위한 복잡한 쿼리 필요

### 2.4 인증

- **NextAuth.js v5 (Auth.js)**
  - OAuth 제공자: Google, Naver, Kakao
  - 이메일/비밀번호 인증
  - JWT 세션 관리
  - 이유: 오픈소스, 완전한 제어, 무료, Next.js 최적화

**Clerk 대신 NextAuth 선택 이유**:
- 완전 무료 (비용 절감)
- 오픈소스로 커스터마이징 자유도 높음
- 한국 OAuth 제공자 (Naver, Kakao) 통합 용이
- 학습 목적으로 더 적합

### 2.5 AI 및 머신러닝

- **Anthropic Claude API (Opus 4.5)**
  - 팩트체크 분석
  - 내용 관련성 평가
  - 신뢰도 점수 계산
  - 이유: GPT-4 대비 확장된 사고 모드, 다단계 추론 우수

**Claude 선택 근거** (vs OpenAI GPT-4):
- Extended thinking mode: 체계적인 팩트체크에 유리
- Tool-assisted reasoning: 다단계 검증에 최적
- 최신 모델 (Opus 4.5)이 팩트체크 정확도에서 우수

### 2.6 OCR

- **Tesseract.js 7.0.0**
  - 브라우저/Node.js 양쪽 지원
  - 100+ 언어 지원
  - TypeScript 지원
  - 이유: 순수 JavaScript, 무료, 활발한 유지보수

### 2.7 데이터 페칭 및 상태 관리

- **TanStack Query v5 (React Query)**
  - 서버 상태 관리
  - 자동 캐싱 및 리페칭
  - 낙관적 업데이트
  - 이유: tRPC와 완벽한 통합, 뛰어난 DX

### 2.8 지도 및 위치

- **Kakao Maps JavaScript API**
  - 도서관 위치 표시
  - 거리 계산
  - 길찾기 연동
  - 이유: 한국 지도 최적화, 무료 티어, 상세한 POI

### 2.9 배포 및 호스팅

- **Vercel**
  - Next.js 배포 최적화
  - Edge Functions
  - 자동 CI/CD
  - Analytics
  - 이유: Next.js 제작사, 제로 설정, 무료 티어

---

## 3. 프로젝트 구조

### 3.1 전체 디렉토리 구조

```
factchecker/
├── src/
│   ├── app/                          # Next.js 16 App Router
│   │   ├── (auth)/                   # 인증 관련 라우트 그룹
│   │   │   ├── login/
│   │   │   │   └── page.tsx
│   │   │   └── register/
│   │   │       └── page.tsx
│   │   ├── (main)/                   # 메인 애플리케이션 라우트
│   │   │   ├── page.tsx              # 랜딩/홈 페이지
│   │   │   ├── verify/               # 팩트체크 입력 화면
│   │   │   │   ├── page.tsx
│   │   │   │   └── layout.tsx
│   │   │   ├── result/[id]/          # 팩트체크 결과 화면 (동적 라우트)
│   │   │   │   └── page.tsx
│   │   │   ├── library/              # 도서관 연계 화면
│   │   │   │   ├── [bookId]/
│   │   │   │   │   └── page.tsx      # 도서 상세 + 소장 도서관
│   │   │   │   └── map/
│   │   │   │       └── page.tsx      # 도서관 지도
│   │   │   └── history/              # 검증 내역
│   │   │       └── page.tsx
│   │   ├── api/                      # API Routes
│   │   │   ├── trpc/[trpc]/          # tRPC 엔드포인트
│   │   │   │   └── route.ts
│   │   │   ├── auth/[...nextauth]/   # NextAuth 설정
│   │   │   │   └── route.ts
│   │   │   └── webhooks/             # 외부 Webhook
│   │   │       └── route.ts
│   │   ├── layout.tsx                # 루트 레이아웃
│   │   ├── globals.css               # 글로벌 스타일 (Tailwind)
│   │   └── providers.tsx             # Context Providers
│   │
│   ├── components/                   # React 컴포넌트
│   │   ├── ui/                       # 재사용 가능한 UI 컴포넌트
│   │   │   ├── Button.tsx            # 버튼 컴포넌트
│   │   │   ├── Card.tsx              # 카드 컴포넌트
│   │   │   ├── Input.tsx             # 입력 필드
│   │   │   ├── Badge.tsx             # 배지 (판정 표시)
│   │   │   ├── Modal.tsx             # 모달
│   │   │   ├── Tabs.tsx              # 탭 UI
│   │   │   └── Toast.tsx             # 알림 토스트
│   │   ├── layout/                   # 레이아웃 컴포넌트
│   │   │   ├── Header.tsx            # 헤더
│   │   │   ├── Footer.tsx            # 푸터
│   │   │   ├── Sidebar.tsx           # 사이드바
│   │   │   └── Navigation.tsx        # 네비게이션
│   │   ├── factcheck/                # 팩트체크 관련 컴포넌트
│   │   │   ├── InputForm.tsx         # 입력 폼 (텍스트/URL/이미지)
│   │   │   ├── ResultCard.tsx        # 결과 카드
│   │   │   ├── TrustScoreGauge.tsx   # 신뢰도 게이지
│   │   │   ├── VerdictBadge.tsx      # 판정 배지
│   │   │   ├── ReferenceList.tsx     # 참고자료 목록
│   │   │   └── VerificationProgress.tsx  # 검증 진행 상태
│   │   ├── library/                  # 도서관 관련 컴포넌트
│   │   │   ├── LibraryMap.tsx        # Kakao Map 통합
│   │   │   ├── LibraryCard.tsx       # 도서관 카드
│   │   │   ├── LibraryList.tsx       # 도서관 목록
│   │   │   └── DistanceCalculator.tsx # 거리 계산
│   │   └── shared/                   # 공통 컴포넌트
│   │       ├── LoadingSpinner.tsx    # 로딩 스피너
│   │       ├── ErrorBoundary.tsx     # 에러 바운더리
│   │       └── EmptyState.tsx        # 빈 상태
│   │
│   ├── server/                       # 서버 사이드 로직
│   │   ├── api/
│   │   │   ├── trpc.ts               # tRPC 설정 및 컨텍스트
│   │   │   ├── routers/              # tRPC 라우터
│   │   │   │   ├── factcheck.ts      # 팩트체크 라우터
│   │   │   │   ├── library.ts        # 도서관 라우터
│   │   │   │   ├── user.ts           # 사용자 라우터
│   │   │   │   └── reference.ts      # 참고자료 라우터
│   │   │   └── root.ts               # 루트 라우터
│   │   ├── services/                 # 비즈니스 로직
│   │   │   ├── factcheck/
│   │   │   │   ├── analyzer.ts       # AI 기반 분석
│   │   │   │   ├── scorer.ts         # 신뢰도 점수 계산
│   │   │   │   ├── verifier.ts       # 검증 로직
│   │   │   │   └── aggregator.ts     # 데이터 집계
│   │   │   ├── datasource/           # 외부 데이터 소스
│   │   │   │   ├── naver.ts          # Naver API (학술정보, 책, 뉴스)
│   │   │   │   ├── library-naru.ts   # 도서관 정보나루 API
│   │   │   │   ├── kakao.ts          # Kakao Local API
│   │   │   │   ├── google-scholar.ts # Google Scholar 크롤링
│   │   │   │   ├── aladin.ts         # 알라딘 도서 API
│   │   │   │   ├── pubmed.ts         # PubMed 웹 크롤링
│   │   │   │   └── index.ts          # 통합 검색
│   │   │   └── ai/
│   │   │       ├── claude.ts         # Claude API 클라이언트
│   │   │       ├── embeddings.ts     # 텍스트 임베딩 (관련성 평가)
│   │   │       └── prompts.ts        # AI 프롬프트 템플릿
│   │   └── utils/
│   │       ├── ocr.ts                # Tesseract.js OCR
│   │       ├── pdf.ts                # PDF 생성 (jsPDF)
│   │       ├── scraper.ts            # 웹 크롤링 (Puppeteer/Cheerio)
│   │       └── url-parser.ts         # URL 파싱 및 콘텐츠 추출
│   │
│   ├── lib/                          # 유틸리티 및 설정
│   │   ├── prisma.ts                 # Prisma 클라이언트 싱글톤
│   │   ├── auth.ts                   # NextAuth 설정
│   │   ├── trpc.ts                   # tRPC 클라이언트 (React 훅)
│   │   ├── validations/              # Zod 스키마
│   │   │   ├── factcheck.ts          # 팩트체크 검증 스키마
│   │   │   ├── user.ts               # 사용자 검증 스키마
│   │   │   └── library.ts            # 도서관 검증 스키마
│   │   └── constants.ts              # 상수 정의 (판정 기준, 색상 등)
│   │
│   ├── hooks/                        # Custom React Hooks
│   │   ├── useFactCheck.ts           # 팩트체크 생성/조회
│   │   ├── useLibrarySearch.ts       # 도서관 검색
│   │   ├── useGeolocation.ts         # 사용자 위치
│   │   └── useDebounce.ts            # 디바운스
│   │
│   └── types/                        # TypeScript 타입 정의
│       ├── factcheck.ts              # 팩트체크 타입
│       ├── library.ts                # 도서관 타입
│       ├── reference.ts              # 참고자료 타입
│       └── index.ts                  # 통합 export
│
├── prisma/
│   ├── schema.prisma                 # Prisma 스키마 정의
│   ├── migrations/                   # 데이터베이스 마이그레이션
│   │   └── YYYYMMDD_migration_name/
│   └── seed.ts                       # 초기 데이터 시드
│
├── public/                           # 정적 파일
│   ├── images/
│   │   ├── logo.svg
│   │   └── hero-bg.jpg
│   ├── fonts/
│   │   └── pretendard/
│   └── icons/
│
├── .env                              # 환경 변수 (로컬, Git 제외)
├── .env.example                      # 환경 변수 템플릿
├── .gitignore                        # Git 제외 파일
├── next.config.js                    # Next.js 설정
├── tailwind.config.ts                # Tailwind 설정
├── tsconfig.json                     # TypeScript 설정
├── package.json                      # 의존성 관리
└── README.md                         # 프로젝트 문서
```

### 3.2 라우트 구조

#### 인증 라우트 그룹 `(auth)`
- `/login`: 로그인 페이지
- `/register`: 회원가입 페이지

#### 메인 라우트 그룹 `(main)`
- `/`: 랜딩/홈 페이지
- `/verify`: 팩트체크 입력 화면
- `/result/[id]`: 팩트체크 결과 (동적 라우트)
- `/library/[bookId]`: 도서 상세 + 소장 도서관
- `/library/map`: 도서관 지도
- `/history`: 검증 내역

### 3.3 컴포넌트 설계 원칙

1. **서버 컴포넌트 우선**: 기본적으로 서버 컴포넌트 사용
2. **클라이언트 컴포넌트**: 인터랙션 필요 시 `"use client"` 지시어
3. **재사용 가능성**: `ui/` 폴더의 기본 컴포넌트는 완전히 독립적
4. **도메인 분리**: `factcheck/`, `library/`로 도메인별 컴포넌트 분리

---

## 4. 데이터베이스 설계

### 4.1 ERD (Entity Relationship Diagram)

```mermaid
erDiagram
    User ||--o{ Account : has
    User ||--o{ Session : has
    User ||--o{ FactCheck : creates
    FactCheck ||--o{ Reference : contains
    Reference ||--o{ LibraryBook : available_at
    Library ||--o{ LibraryBook : stores
    
    User {
        string id PK
        string email UK
        string name
        string image
        datetime emailVerified
        string password
        datetime createdAt
        datetime updatedAt
    }
    
    Account {
        string id PK
        string userId FK
        string type
        string provider
        string providerAccountId
    }
    
    Session {
        string id PK
        string sessionToken UK
        string userId FK
        datetime expires
    }
    
    FactCheck {
        string id PK
        string userId FK
        string inputType
        text inputContent
        string originalUrl
        string imageUrl
        int trustScore
        string verdict
        text summary
        text detailedAnalysis
        string status
        int processingTime
        datetime createdAt
        datetime updatedAt
    }
    
    Reference {
        string id PK
        string factCheckId FK
        string type
        string title
        string authors
        string publisher
        datetime publishDate
        string url
        string doi
        string isbn
        float relevanceScore
        int trustScore
        datetime createdAt
    }
    
    Library {
        string id PK
        string name
        string address
        float latitude
        float longitude
        string phone
        string website
        json openingHours
        datetime createdAt
        datetime updatedAt
    }
    
    LibraryBook {
        string id PK
        string libraryId FK
        string referenceId FK
        boolean available
        datetime dueDate
        string callNumber
        datetime updatedAt
    }
```

### 4.2 Prisma 스키마

```prisma
// prisma/schema.prisma

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
  directUrl = env("DIRECT_URL")
}

// ============================================================================
// 인증 관련 모델 (NextAuth.js)
// ============================================================================

model User {
  id            String    @id @default(cuid())
  email         String    @unique
  name          String?
  image         String?
  emailVerified DateTime?
  password      String?   // 이메일/비밀번호 인증용 (해시됨)
  
  accounts      Account[]
  sessions      Session[]
  factChecks    FactCheck[]
  
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
  
  @@map("users")
}

model Account {
  id                String  @id @default(cuid())
  userId            String
  type              String
  provider          String  // google, naver, kakao 등
  providerAccountId String
  refresh_token     String? @db.Text
  access_token      String? @db.Text
  expires_at        Int?
  token_type        String?
  scope             String?
  id_token          String? @db.Text
  session_state     String?
  
  user User @relation(fields: [userId], references: [id], onDelete: Cascade)
  
  @@unique([provider, providerAccountId])
  @@map("accounts")
}

model Session {
  id           String   @id @default(cuid())
  sessionToken String   @unique
  userId       String
  expires      DateTime
  
  user User @relation(fields: [userId], references: [id], onDelete: Cascade)
  
  @@map("sessions")
}

model VerificationToken {
  identifier String
  token      String   @unique
  expires    DateTime
  
  @@unique([identifier, token])
  @@map("verification_tokens")
}

// ============================================================================
// 팩트체크 관련 모델
// ============================================================================

model FactCheck {
  id              String   @id @default(cuid())
  userId          String?
  
  // 입력 정보
  inputType       InputType         // TEXT, URL, IMAGE
  inputContent    String   @db.Text // 사용자가 입력한 원문
  originalUrl     String?           // URL 입력 시 원본 URL
  imageUrl        String?           // 이미지 업로드 시 이미지 URL
  
  // 검증 결과
  trustScore      Int?              // 0-100 신뢰도 점수
  verdict         Verdict?          // 판정 (CONFIRMED, MOSTLY_TRUE, CAUTION, FALSE, UNKNOWN)
  summary         String?  @db.Text // 1-2문장 요약
  detailedAnalysis String? @db.Text // 상세 분석 (3-5 문단)
  
  // 메타데이터
  status          Status   @default(PENDING) // PENDING, PROCESSING, COMPLETED, FAILED
  processingTime  Int?                       // 처리 시간 (밀리초)
  errorMessage    String?  @db.Text          // 실패 시 에러 메시지
  
  // 관계
  references      Reference[]
  user            User?    @relation(fields: [userId], references: [id])
  
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt
  
  @@index([userId])
  @@index([createdAt])
  @@index([status])
  @@map("fact_checks")
}

enum InputType {
  TEXT
  URL
  IMAGE
}

enum Status {
  PENDING     // 대기 중
  PROCESSING  // 처리 중
  COMPLETED   // 완료
  FAILED      // 실패
}

enum Verdict {
  CONFIRMED    // 사실로 확인됨 (80-100점)
  MOSTLY_TRUE  // 대체로 사실임 (60-79점)
  CAUTION      // 주의가 필요함 (40-59점)
  FALSE        // 사실이 아님 (0-39점)
  UNKNOWN      // 판단 불가
}

// ============================================================================
// 참고자료 관련 모델
// ============================================================================

model Reference {
  id            String   @id @default(cuid())
  factCheckId   String
  
  type          ReferenceType // PAPER, BOOK, WEB, NEWS
  title         String
  authors       String?       // 쉼표로 구분
  publisher     String?
  publishDate   DateTime?
  url           String?
  doi           String?       // 논문 DOI
  isbn          String?       // 도서 ISBN
  
  // AI 평가
  relevanceScore Float        // 0.0-1.0 관련성 점수
  trustScore    Int           // 0-100 신뢰도 점수
  
  // 도서 관련 (type이 BOOK인 경우)
  libraries     LibraryBook[]
  
  factCheck     FactCheck @relation(fields: [factCheckId], references: [id], onDelete: Cascade)
  
  createdAt     DateTime @default(now())
  
  @@index([factCheckId])
  @@index([type])
  @@map("references")
}

enum ReferenceType {
  PAPER  // 학술논문
  BOOK   // 도서
  WEB    // 웹 자료
  NEWS   // 뉴스 기사
}

// ============================================================================
// 도서관 관련 모델
// ============================================================================

model Library {
  id            String   @id @default(cuid())
  name          String
  address       String
  latitude      Float
  longitude     Float
  phone         String?
  website       String?
  openingHours  Json?    // { "mon": "09:00-18:00", "tue": "09:00-18:00", ... }
  
  books         LibraryBook[]
  
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt
  
  @@index([latitude, longitude])
  @@map("libraries")
}

model LibraryBook {
  id            String   @id @default(cuid())
  libraryId     String
  referenceId   String
  
  available     Boolean  @default(true)  // 대출 가능 여부
  dueDate       DateTime?                // 반납 예정일 (대출 중인 경우)
  callNumber    String?                  // 청구기호
  
  library       Library  @relation(fields: [libraryId], references: [id])
  reference     Reference @relation(fields: [referenceId], references: [id])
  
  updatedAt     DateTime @updatedAt
  
  @@unique([libraryId, referenceId])
  @@index([referenceId])
  @@map("library_books")
}
```

### 4.3 인덱스 전략

1. **userId 인덱스**: 사용자별 팩트체크 조회 최적화
2. **createdAt 인덱스**: 최신순 정렬 최적화
3. **status 인덱스**: 처리 중인 팩트체크 필터링
4. **latitude/longitude 복합 인덱스**: 위치 기반 도서관 검색 최적화

### 4.4 데이터베이스 연결 설정

```typescript
// src/lib/prisma.ts
import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const db =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  })

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = db
```

**Supabase 연결 설정**:
- `DATABASE_URL`: Transaction pooler (포트 6543) - Prisma Client용
- `DIRECT_URL`: Direct connection (포트 5432) - 마이그레이션용
- PgBouncer 모드: `?pgbouncer=true` 플래그 추가

---

## 5. API 아키텍처

### 5.1 tRPC 설정

#### tRPC 컨텍스트

```typescript
// src/server/api/trpc.ts
import { type Session } from "next-auth";
import { getServerSession } from "next-auth/next";
import { db } from "@/lib/prisma";
import { authOptions } from "@/lib/auth";

/**
 * tRPC 컨텍스트 생성
 * 모든 tRPC 프로시저에서 사용 가능
 */
export const createTRPCContext = async (opts: { headers: Headers }) => {
  const session = await getServerSession(authOptions);

  return {
    db,
    session,
    ...opts,
  };
};

/**
 * tRPC 라우터 초기화
 */
import { initTRPC, TRPCError } from "@trpc/server";
import superjson from "superjson";
import { ZodError } from "zod";

const t = initTRPC.context<typeof createTRPCContext>().create({
  transformer: superjson,
  errorFormatter({ shape, error }) {
    return {
      ...shape,
      data: {
        ...shape.data,
        zodError:
          error.cause instanceof ZodError ? error.cause.flatten() : null,
      },
    };
  },
});

/**
 * 공개 프로시저 (인증 불필요)
 */
export const publicProcedure = t.procedure;

/**
 * 보호된 프로시저 (인증 필요)
 */
export const protectedProcedure = t.procedure.use(({ ctx, next }) => {
  if (!ctx.session || !ctx.session.user) {
    throw new TRPCError({ code: "UNAUTHORIZED" });
  }
  return next({
    ctx: {
      session: { ...ctx.session, user: ctx.session.user },
    },
  });
});

export const createTRPCRouter = t.router;
```

### 5.2 루트 라우터

```typescript
// src/server/api/root.ts
import { createTRPCRouter } from "./trpc";
import { factCheckRouter } from "./routers/factcheck";
import { libraryRouter } from "./routers/library";
import { userRouter } from "./routers/user";
import { referenceRouter } from "./routers/reference";

export const appRouter = createTRPCRouter({
  factCheck: factCheckRouter,
  library: libraryRouter,
  user: userRouter,
  reference: referenceRouter,
});

// Export type definition of API
export type AppRouter = typeof appRouter;
```

### 5.3 팩트체크 라우터

```typescript
// src/server/api/routers/factcheck.ts
import { z } from "zod";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";
import { InputType, Status, Verdict } from "@prisma/client";
import { analyzeFactCheck } from "@/server/services/factcheck/analyzer";

export const factCheckRouter = createTRPCRouter({
  /**
   * 팩트체크 생성
   * 공개 프로시저 (비로그인 사용자도 사용 가능)
   */
  create: publicProcedure
    .input(
      z.object({
        inputType: z.enum(["TEXT", "URL", "IMAGE"]),
        content: z.string().min(10, "최소 10자 이상 입력해주세요"),
        imageUrl: z.string().url().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      // 1. 팩트체크 레코드 생성
      const factCheck = await ctx.db.factCheck.create({
        data: {
          inputType: input.inputType as InputType,
          inputContent: input.content,
          imageUrl: input.imageUrl,
          userId: ctx.session?.user?.id,
          status: Status.PENDING,
        },
      });

      // 2. 백그라운드 작업으로 분석 시작 (비동기)
      // Vercel Serverless Function의 시간 제한을 고려하여
      // 즉시 응답하고 백그라운드에서 처리
      analyzeFactCheck(factCheck.id, input.content)
        .catch((error) => {
          console.error("팩트체크 분석 실패:", error);
          // 실패 시 상태 업데이트
          ctx.db.factCheck.update({
            where: { id: factCheck.id },
            data: {
              status: Status.FAILED,
              errorMessage: error.message,
            },
          });
        });

      return factCheck;
    }),

  /**
   * 팩트체크 상태 조회
   * 실시간 폴링을 위한 엔드포인트
   */
  getStatus: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const factCheck = await ctx.db.factCheck.findUnique({
        where: { id: input.id },
        include: {
          references: {
            include: {
              libraries: {
                include: {
                  library: true,
                },
              },
            },
            orderBy: {
              relevanceScore: "desc",
            },
          },
        },
      });

      if (!factCheck) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "팩트체크를 찾을 수 없습니다",
        });
      }

      return factCheck;
    }),

  /**
   * 팩트체크 ID로 조회 (상세)
   */
  getById: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      return ctx.db.factCheck.findUnique({
        where: { id: input.id },
        include: {
          references: {
            include: {
              libraries: {
                include: { library: true },
              },
            },
          },
          user: {
            select: {
              name: true,
              image: true,
            },
          },
        },
      });
    }),

  /**
   * 사용자의 팩트체크 목록 (무한 스크롤)
   * 보호된 프로시저 (로그인 필요)
   */
  getUserHistory: protectedProcedure
    .input(
      z.object({
        limit: z.number().min(1).max(100).default(10),
        cursor: z.string().optional(), // 마지막 항목의 ID
      })
    )
    .query(async ({ ctx, input }) => {
      const items = await ctx.db.factCheck.findMany({
        where: { userId: ctx.session.user.id },
        take: input.limit + 1, // +1로 다음 페이지 존재 여부 확인
        cursor: input.cursor ? { id: input.cursor } : undefined,
        orderBy: { createdAt: "desc" },
        include: {
          references: {
            take: 3, // 미리보기용 3개만
          },
        },
      });

      let nextCursor: string | undefined = undefined;
      if (items.length > input.limit) {
        const nextItem = items.pop(); // 마지막 항목 제거
        nextCursor = nextItem!.id;
      }

      return {
        items,
        nextCursor,
      };
    }),

  /**
   * 팩트체크 삭제
   */
  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      // 본인 소유 확인
      const factCheck = await ctx.db.factCheck.findUnique({
        where: { id: input.id },
        select: { userId: true },
      });

      if (!factCheck || factCheck.userId !== ctx.session.user.id) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "권한이 없습니다",
        });
      }

      // Cascade 삭제 (references도 함께 삭제됨)
      await ctx.db.factCheck.delete({
        where: { id: input.id },
      });

      return { success: true };
    }),

  /**
   * 최근 인기 팩트체크 (공개)
   */
  getPopular: publicProcedure
    .input(
      z.object({
        limit: z.number().min(1).max(20).default(10),
      })
    )
    .query(async ({ ctx, input }) => {
      // 최근 7일 내 생성된 팩트체크 중 완료된 것
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

      return ctx.db.factCheck.findMany({
        where: {
          status: Status.COMPLETED,
          createdAt: {
            gte: sevenDaysAgo,
          },
        },
        take: input.limit,
        orderBy: {
          createdAt: "desc",
        },
        select: {
          id: true,
          inputContent: true,
          trustScore: true,
          verdict: true,
          summary: true,
          createdAt: true,
        },
      });
    }),
});
```

### 5.4 도서관 라우터

```typescript
// src/server/api/routers/library.ts
import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "../trpc";
import { searchKakaoLibraries } from "@/server/services/datasource/kakao";
import { calculateDistance } from "@/server/utils/geo";

export const libraryRouter = createTRPCRouter({
  /**
   * 위치 기반 도서관 검색
   */
  searchNearby: publicProcedure
    .input(
      z.object({
        latitude: z.number(),
        longitude: z.number(),
        radius: z.number().default(5000), // 미터 단위
        limit: z.number().min(1).max(50).default(10),
      })
    )
    .query(async ({ ctx, input }) => {
      // 1. Kakao API로 주변 도서관 검색
      const kakaoLibraries = await searchKakaoLibraries({
        x: input.longitude,
        y: input.latitude,
        radius: input.radius,
      });

      // 2. DB에 저장되어 있는지 확인 및 추가 정보 조회
      const librariesWithInfo = await Promise.all(
        kakaoLibraries.slice(0, input.limit).map(async (kakaoLib) => {
          // DB에서 도서관 찾기
          let library = await ctx.db.library.findFirst({
            where: {
              name: kakaoLib.place_name,
              latitude: parseFloat(kakaoLib.y),
              longitude: parseFloat(kakaoLib.x),
            },
            include: {
              books: {
                take: 5,
                include: {
                  reference: true,
                },
              },
            },
          });

          // 없으면 생성
          if (!library) {
            library = await ctx.db.library.create({
              data: {
                name: kakaoLib.place_name,
                address: kakaoLib.address_name,
                latitude: parseFloat(kakaoLib.y),
                longitude: parseFloat(kakaoLib.x),
                phone: kakaoLib.phone,
              },
              include: {
                books: {
                  take: 5,
                  include: {
                    reference: true,
                  },
                },
              },
            });
          }

          // 거리 계산
          const distance = calculateDistance(
            input.latitude,
            input.longitude,
            library.latitude,
            library.longitude
          );

          return {
            ...library,
            distance, // 미터 단위
          };
        })
      );

      // 거리순 정렬
      return librariesWithInfo.sort((a, b) => a.distance - b.distance);
    }),

  /**
   * 도서관 ID로 조회
   */
  getById: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      return ctx.db.library.findUnique({
        where: { id: input.id },
        include: {
          books: {
            include: {
              reference: {
                include: {
                  factCheck: {
                    select: {
                      id: true,
                      inputContent: true,
                      verdict: true,
                    },
                  },
                },
              },
            },
          },
        },
      });
    }),

  /**
   * 특정 도서(Reference)를 소장한 도서관 목록
   */
  getLibrariesForBook: publicProcedure
    .input(
      z.object({
        referenceId: z.string(),
        userLatitude: z.number().optional(),
        userLongitude: z.number().optional(),
      })
    )
    .query(async ({ ctx, input }) => {
      const libraryBooks = await ctx.db.libraryBook.findMany({
        where: { referenceId: input.referenceId },
        include: {
          library: true,
        },
      });

      // 사용자 위치가 있으면 거리 계산 후 정렬
      if (input.userLatitude && input.userLongitude) {
        return libraryBooks
          .map((lb) => ({
            ...lb,
            distance: calculateDistance(
              input.userLatitude!,
              input.userLongitude!,
              lb.library.latitude,
              lb.library.longitude
            ),
          }))
          .sort((a, b) => a.distance - b.distance);
      }

      return libraryBooks;
    }),
});
```

### 5.5 클라이언트 tRPC 설정

```typescript
// src/lib/trpc.ts
import { createTRPCReact } from "@trpc/react-query";
import { type AppRouter } from "@/server/api/root";

export const api = createTRPCReact<AppRouter>();
```

```typescript
// src/app/providers.tsx
"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { httpBatchLink } from "@trpc/client";
import { useState } from "react";
import { api } from "@/lib/trpc";
import superjson from "superjson";

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());
  const [trpcClient] = useState(() =>
    api.createClient({
      transformer: superjson,
      links: [
        httpBatchLink({
          url: "/api/trpc",
        }),
      ],
    })
  );

  return (
    <api.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    </api.Provider>
  );
}
```

---

## 6. 핵심 서비스 로직

### 6.1 팩트체크 분석 서비스

```typescript
// src/server/services/factcheck/analyzer.ts
import Anthropic from "@anthropic-ai/sdk";
import { db } from "@/lib/prisma";
import { Status, Verdict } from "@prisma/client";
import { searchAllSources } from "../datasource";
import { calculateTrustScore } from "./scorer";

/**
 * 팩트체크 분석 메인 함수
 * @param factCheckId 팩트체크 ID
 * @param content 검증할 내용
 */
export async function analyzeFactCheck(
  factCheckId: string,
  content: string
): Promise<void> {
  const startTime = Date.now();

  try {
    // 상태를 PROCESSING으로 업데이트
    await db.factCheck.update({
      where: { id: factCheckId },
      data: { status: Status.PROCESSING },
    });

    // 1. 모든 데이터 소스에서 관련 자료 수집
    const sources = await searchAllSources(content);

    // 2. Claude API로 분석
    const anthropic = new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY!,
    });

    const message = await anthropic.messages.create({
      model: "claude-opus-4.5-20250514",
      max_tokens: 4096,
      messages: [
        {
          role: "user",
          content: `당신은 전문 팩트체커입니다. 다음 주장을 철저히 분석하고 신뢰도를 평가하세요.

**검증 대상:**
${content}

**참고 자료:**
${JSON.stringify(sources, null, 2)}

**평가 기준:**
1. 참고 자료의 신뢰도
2. 주장과 자료의 관련성
3. 출처의 전문성
4. 최신성

**다음 JSON 형식으로만 응답하세요:**
{
  "trustScore": 0-100 사이의 정수,
  "verdict": "CONFIRMED" | "MOSTLY_TRUE" | "CAUTION" | "FALSE" | "UNKNOWN",
  "summary": "1-2문장의 간단한 요약",
  "detailedAnalysis": "3-5문단의 상세 분석",
  "keyFindings": ["주요 발견 사항 1", "주요 발견 사항 2", "주요 발견 사항 3"],
  "relevantReferences": [
    {
      "sourceIndex": 0,
      "relevanceScore": 0.95,
      "reason": "관련성 이유"
    }
  ]
}`,
        },
      ],
    });

    // 3. Claude 응답 파싱
    const analysisResult = parseClaudeResponse(message.content);

    // 4. 참고자료 저장
    await saveReferences(factCheckId, sources, analysisResult.relevantReferences);

    // 5. 팩트체크 결과 업데이트
    const processingTime = Date.now() - startTime;
    await db.factCheck.update({
      where: { id: factCheckId },
      data: {
        trustScore: analysisResult.trustScore,
        verdict: analysisResult.verdict as Verdict,
        summary: analysisResult.summary,
        detailedAnalysis: analysisResult.detailedAnalysis,
        status: Status.COMPLETED,
        processingTime,
      },
    });
  } catch (error) {
    console.error("팩트체크 분석 실패:", error);

    // 실패 상태로 업데이트
    await db.factCheck.update({
      where: { id: factCheckId },
      data: {
        status: Status.FAILED,
        errorMessage: error instanceof Error ? error.message : "알 수 없는 오류",
      },
    });

    throw error;
  }
}

/**
 * Claude 응답 파싱
 */
function parseClaudeResponse(content: any): any {
  // content는 TextBlock 배열
  const textBlock = content.find((block: any) => block.type === "text");
  if (!textBlock) {
    throw new Error("Claude 응답에 텍스트가 없습니다");
  }

  // JSON 추출 (```json ... ``` 형식일 수 있음)
  let jsonText = textBlock.text.trim();
  const jsonMatch = jsonText.match(/```json\s*([\s\S]*?)\s*```/);
  if (jsonMatch) {
    jsonText = jsonMatch[1];
  }

  return JSON.parse(jsonText);
}

/**
 * 참고자료 저장
 */
async function saveReferences(
  factCheckId: string,
  sources: any,
  relevantReferences: any[]
): Promise<void> {
  // papers, books, news를 하나의 배열로 통합
  const allSources = [
    ...sources.papers.map((p: any) => ({ ...p, type: "PAPER" })),
    ...sources.books.map((b: any) => ({ ...b, type: "BOOK" })),
    ...sources.news.map((n: any) => ({ ...n, type: "NEWS" })),
  ];

  // relevantReferences에 있는 것만 저장
  for (const ref of relevantReferences) {
    const source = allSources[ref.sourceIndex];
    if (!source) continue;

    await db.reference.create({
      data: {
        factCheckId,
        type: source.type,
        title: source.title || "",
        authors: source.authors || "",
        publisher: source.publisher || "",
        publishDate: source.publishDate ? new Date(source.publishDate) : null,
        url: source.url || "",
        doi: source.doi || null,
        isbn: source.isbn || null,
        relevanceScore: ref.relevanceScore,
        trustScore: calculateSourceTrustScore(source),
      },
    });
  }
}

/**
 * 출처 신뢰도 점수 계산
 */
function calculateSourceTrustScore(source: any): number {
  let score = 50; // 기본 점수

  // 학술논문은 높은 신뢰도
  if (source.type === "PAPER") {
    score += 30;
    if (source.doi) score += 10; // DOI 있으면 추가
  }

  // 도서는 중간 신뢰도
  if (source.type === "BOOK") {
    score += 20;
    if (source.publisher?.includes("대학") || source.publisher?.includes("학술")) {
      score += 10; // 학술 출판사면 추가
    }
  }

  // 뉴스는 출처에 따라
  if (source.type === "NEWS") {
    // 언론사 신뢰도 평가 (간단한 예시)
    const trustedSources = ["연합뉴스", "한국일보", "SBS", "JTBC"];
    if (trustedSources.some((ts) => source.publisher?.includes(ts))) {
      score += 15;
    }
  }

  // 최신성 (최근 5년 내)
  if (source.publishDate) {
    const yearsDiff = new Date().getFullYear() - new Date(source.publishDate).getFullYear();
    if (yearsDiff <= 5) {
      score += 10;
    }
  }

  return Math.min(100, Math.max(0, score));
}
```

### 6.2 통합 데이터 소스 검색

```typescript
// src/server/services/datasource/index.ts
import { searchNaverAcademic, searchNaverBooks, searchNaverNews } from "./naver";
import { searchLibraryNaru } from "./library-naru";
import { searchKakaoLibraries } from "./kakao";
import { searchGoogleScholar } from "./google-scholar";
import { searchAladinBooks } from "./aladin";

export interface SearchResult {
  papers: any[];
  books: any[];
  news: any[];
}

/**
 * 모든 데이터 소스에서 병렬로 검색
 * @param query 검색어
 */
export async function searchAllSources(query: string): Promise<SearchResult> {
  try {
    const [
      naverAcademic,
      naverBooks,
      naverNews,
      libraryNaru,
      googleScholar,
      aladinBooks,
    ] = await Promise.allSettled([
      searchNaverAcademic(query),
      searchNaverBooks(query),
      searchNaverNews(query + " 팩트체크"),
      searchLibraryNaru(query),
      searchGoogleScholar(query),
      searchAladinBooks(query),
    ]);

    // 성공한 결과만 추출
    const papers = [
      ...(naverAcademic.status === "fulfilled" ? naverAcademic.value : []),
      ...(googleScholar.status === "fulfilled" ? googleScholar.value : []),
    ];

    const books = [
      ...(naverBooks.status === "fulfilled" ? naverBooks.value : []),
      ...(libraryNaru.status === "fulfilled" ? libraryNaru.value : []),
      ...(aladinBooks.status === "fulfilled" ? aladinBooks.value : []),
    ];

    const news = naverNews.status === "fulfilled" ? naverNews.value : [];

    // 중복 제거
    const uniquePapers = removeDuplicates(papers, "title");
    const uniqueBooks = removeDuplicates(books, "isbn");
    const uniqueNews = removeDuplicates(news, "url");

    return {
      papers: uniquePapers.slice(0, 10), // 최대 10개
      books: uniqueBooks.slice(0, 10),
      news: uniqueNews.slice(0, 5),
    };
  } catch (error) {
    console.error("데이터 소스 검색 실패:", error);
    return {
      papers: [],
      books: [],
      news: [],
    };
  }
}

/**
 * 배열에서 중복 제거
 */
function removeDuplicates<T>(array: T[], key: keyof T): T[] {
  const seen = new Set();
  return array.filter((item) => {
    const value = item[key];
    if (!value || seen.has(value)) {
      return false;
    }
    seen.add(value);
    return true;
  });
}
```

### 6.3 Naver API 클라이언트

```typescript
// src/server/services/datasource/naver.ts
const NAVER_CLIENT_ID = process.env.NAVER_API_CLIENT_ID!;
const NAVER_CLIENT_SECRET = process.env.NAVER_API_CLIENT_SECRET!;

const headers = {
  "X-Naver-Client-Id": NAVER_CLIENT_ID,
  "X-Naver-Client-Secret": NAVER_CLIENT_SECRET,
};

/**
 * Naver 학술정보 검색
 */
export async function searchNaverAcademic(query: string): Promise<any[]> {
  try {
    const url = `https://openapi.naver.com/v1/search/doc.json?query=${encodeURIComponent(
      query
    )}&display=10&sort=sim`;

    const response = await fetch(url, { headers });
    const data = await response.json();

    return (data.items || []).map((item: any) => ({
      type: "PAPER",
      title: stripHtml(item.title),
      authors: item.author || "",
      publisher: item.publisher || "",
      publishDate: item.pubdate || null,
      url: item.link || "",
      doi: null,
      description: stripHtml(item.description || ""),
    }));
  } catch (error) {
    console.error("Naver 학술정보 검색 실패:", error);
    return [];
  }
}

/**
 * Naver 책 검색
 */
export async function searchNaverBooks(query: string): Promise<any[]> {
  try {
    const url = `https://openapi.naver.com/v1/search/book.json?query=${encodeURIComponent(
      query
    )}&display=10&sort=sim`;

    const response = await fetch(url, { headers });
    const data = await response.json();

    return (data.items || []).map((item: any) => ({
      type: "BOOK",
      title: stripHtml(item.title),
      authors: item.author || "",
      publisher: item.publisher || "",
      publishDate: item.pubdate || null,
      url: item.link || "",
      isbn: item.isbn || null,
      description: stripHtml(item.description || ""),
    }));
  } catch (error) {
    console.error("Naver 책 검색 실패:", error);
    return [];
  }
}

/**
 * Naver 뉴스 검색
 */
export async function searchNaverNews(query: string): Promise<any[]> {
  try {
    const url = `https://openapi.naver.com/v1/search/news.json?query=${encodeURIComponent(
      query
    )}&display=10&sort=sim`;

    const response = await fetch(url, { headers });
    const data = await response.json();

    return (data.items || []).map((item: any) => ({
      type: "NEWS",
      title: stripHtml(item.title),
      publisher: item.originallink?.includes("naver") ? "네이버 뉴스" : "언론사",
      publishDate: item.pubDate || null,
      url: item.link || "",
      description: stripHtml(item.description || ""),
    }));
  } catch (error) {
    console.error("Naver 뉴스 검색 실패:", error);
    return [];
  }
}

/**
 * HTML 태그 제거
 */
function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, "").replace(/&[^;]+;/g, " ");
}
```

### 6.4 도서관 정보나루 API

```typescript
// src/server/services/datasource/library-naru.ts
const LIBRARY_NARU_API_KEY = process.env.LIBRARY_NARU_API_KEY!;

/**
 * 도서관 정보나루에서 도서 검색
 */
export async function searchLibraryNaru(query: string): Promise<any[]> {
  try {
    const url = `https://www.nl.go.kr/NL/search/openApi/search.do?key=${LIBRARY_NARU_API_KEY}&apiType=json&srchTarget=total&kwd=${encodeURIComponent(
      query
    )}&pageNum=1&pageSize=10`;

    const response = await fetch(url);
    const data = await response.json();

    if (!data.result || !Array.isArray(data.result)) {
      return [];
    }

    return data.result.map((item: any) => ({
      type: "BOOK",
      title: item.title_info || "",
      authors: item.author_info || "",
      publisher: item.pub_info || "",
      publishDate: item.pub_year_info ? new Date(item.pub_year_info) : null,
      isbn: item.isbn || null,
      callNumber: item.class_no || null,
      library: "국립중앙도서관",
    }));
  } catch (error) {
    console.error("도서관 정보나루 검색 실패:", error);
    return [];
  }
}
```

### 6.5 OCR 서비스

```typescript
// src/server/utils/ocr.ts
import { createWorker } from "tesseract.js";

/**
 * 이미지에서 텍스트 추출
 * @param imageUrl 이미지 URL 또는 Base64
 * @param language 언어 코드 (기본: 한글+영어)
 */
export async function extractTextFromImage(
  imageUrl: string,
  language: string = "kor+eng"
): Promise<string> {
  const worker = await createWorker(language);

  try {
    const {
      data: { text },
    } = await worker.recognize(imageUrl);

    // 공백 정리
    return text.trim().replace(/\s+/g, " ");
  } finally {
    await worker.terminate();
  }
}
```

---

## 7. 프론트엔드 아키텍처

### 7.1 주요 페이지 구현

#### 랜딩 페이지

```typescript
// src/app/(main)/page.tsx
import { Hero } from "@/components/layout/Hero";
import { FeatureCards } from "@/components/layout/FeatureCards";
import { TrustIndicators } from "@/components/layout/TrustIndicators";
import { PopularChecks } from "@/components/factcheck/PopularChecks";

export default function HomePage() {
  return (
    <main className="min-h-screen">
      <Hero />
      <FeatureCards />
      <TrustIndicators />
      <PopularChecks />
    </main>
  );
}
```

#### 팩트체크 입력 화면

```typescript
// src/app/(main)/verify/page.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/trpc";
import { InputForm } from "@/components/factcheck/InputForm";
import { Card } from "@/components/ui/Card";
import { extractTextFromImage } from "@/lib/ocr-client";

export default function VerifyPage() {
  const router = useRouter();
  const [isProcessing, setIsProcessing] = useState(false);

  const createFactCheck = api.factCheck.create.useMutation({
    onSuccess: (data) => {
      router.push(`/result/${data.id}`);
    },
    onError: (error) => {
      alert(`오류가 발생했습니다: ${error.message}`);
      setIsProcessing(false);
    },
  });

  const handleSubmit = async (data: {
    inputType: "TEXT" | "URL" | "IMAGE";
    content?: string;
    imageFile?: File;
  }) => {
    setIsProcessing(true);

    let content = data.content || "";

    // 이미지인 경우 OCR 처리
    if (data.inputType === "IMAGE" && data.imageFile) {
      try {
        // 이미지를 Base64로 변환
        const base64 = await fileToBase64(data.imageFile);
        // OCR로 텍스트 추출
        content = await extractTextFromImage(base64);
      } catch (error) {
        alert("이미지에서 텍스트를 추출하지 못했습니다");
        setIsProcessing(false);
        return;
      }
    }

    createFactCheck.mutate({
      inputType: data.inputType,
      content,
      imageUrl: data.inputType === "IMAGE" ? "uploaded" : undefined,
    });
  };

  return (
    <div className="container mx-auto max-w-4xl py-12 px-4">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">정보 검증하기</h1>
      <p className="text-gray-600 mb-8">
        검증하고 싶은 정보를 입력하세요. AI와 학술자료를 기반으로 신뢰도를 평가합니다.
      </p>

      <Card>
        <InputForm onSubmit={handleSubmit} isLoading={isProcessing} />
      </Card>

      {/* 사용 예시 */}
      <div className="mt-8 p-6 bg-blue-50 rounded-lg">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">💡 이런 정보를 검증할 수 있어요</h3>
        <ul className="space-y-2 text-gray-700">
          <li>• 건강 정보: "비타민 C가 감기를 예방한다"</li>
          <li>• 뉴스 주장: "한국 청년 실업률이 역대 최고"</li>
          <li>• 과학 정보: "지구 온난화는 거짓이다"</li>
        </ul>
      </div>
    </div>
  );
}

function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}
```

#### 팩트체크 결과 화면

```typescript
// src/app/(main)/result/[id]/page.tsx
"use client";

import { use } from "react";
import { api } from "@/lib/trpc";
import { ResultCard } from "@/components/factcheck/ResultCard";
import { ReferenceList } from "@/components/factcheck/ReferenceList";
import { VerificationProgress } from "@/components/factcheck/VerificationProgress";
import { Button } from "@/components/ui/Button";
import { useRouter } from "next/navigation";

export default function ResultPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();

  const { data: factCheck, isLoading } = api.factCheck.getStatus.useQuery(
    { id },
    {
      refetchInterval: (data) => {
        // PROCESSING 상태면 2초마다 폴링
        return data?.status === "PROCESSING" ? 2000 : false;
      },
    }
  );

  if (isLoading) {
    return (
      <div className="container mx-auto max-w-6xl py-12">
        <VerificationProgress />
      </div>
    );
  }

  if (!factCheck) {
    return (
      <div className="container mx-auto max-w-4xl py-12 text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          팩트체크를 찾을 수 없습니다
        </h2>
        <Button onClick={() => router.push("/verify")}>새로운 검증 시작</Button>
      </div>
    );
  }

  if (factCheck.status === "PROCESSING") {
    return (
      <div className="container mx-auto max-w-6xl py-12">
        <VerificationProgress />
      </div>
    );
  }

  if (factCheck.status === "FAILED") {
    return (
      <div className="container mx-auto max-w-4xl py-12 text-center">
        <h2 className="text-2xl font-bold text-red-600 mb-4">검증 실패</h2>
        <p className="text-gray-600 mb-8">
          {factCheck.errorMessage || "알 수 없는 오류가 발생했습니다"}
        </p>
        <Button onClick={() => router.push("/verify")}>다시 시도</Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-6xl py-12 px-4">
      <ResultCard factCheck={factCheck} />

      <div className="mt-8">
        <ReferenceList references={factCheck.references} />
      </div>

      <div className="mt-8 flex gap-4 justify-center">
        <Button variant="secondary" onClick={() => router.push("/verify")}>
          🔍 새로운 검증
        </Button>
        <Button variant="secondary">📤 결과 공유</Button>
        <Button variant="secondary">📥 보고서 다운로드</Button>
      </div>
    </div>
  );
}
```

### 7.2 주요 컴포넌트 구현

#### 신뢰도 게이지

```typescript
// src/components/factcheck/TrustScoreGauge.tsx
interface TrustScoreGaugeProps {
  score: number; // 0-100
}

export function TrustScoreGauge({ score }: TrustScoreGaugeProps) {
  const getColor = (score: number) => {
    if (score >= 80) return "text-green-500";
    if (score >= 60) return "text-lime-500";
    if (score >= 40) return "text-yellow-500";
    return "text-red-500";
  };

  const getColorBg = (score: number) => {
    if (score >= 80) return "bg-green-500";
    if (score >= 60) return "bg-lime-500";
    if (score >= 40) return "bg-yellow-500";
    return "bg-red-500";
  };

  return (
    <div className="flex flex-col items-center">
      <div className="relative w-48 h-48">
        {/* 배경 원 */}
        <svg className="w-full h-full transform -rotate-90">
          <circle
            cx="96"
            cy="96"
            r="80"
            stroke="currentColor"
            strokeWidth="12"
            fill="none"
            className="text-gray-200"
          />
          {/* 점수 원 */}
          <circle
            cx="96"
            cy="96"
            r="80"
            stroke="currentColor"
            strokeWidth="12"
            fill="none"
            strokeDasharray={`${(score / 100) * 502} 502`}
            className={getColorBg(score)}
            strokeLinecap="round"
          />
        </svg>

        {/* 중앙 점수 */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <div className={`text-5xl font-bold ${getColor(score)}`}>{score}</div>
          <div className="text-sm text-gray-500">/ 100</div>
        </div>
      </div>
    </div>
  );
}
```

#### 판정 배지

```typescript
// src/components/factcheck/VerdictBadge.tsx
import { Verdict } from "@prisma/client";

interface VerdictBadgeProps {
  verdict: Verdict;
}

export function VerdictBadge({ verdict }: VerdictBadgeProps) {
  const config = {
    CONFIRMED: {
      label: "사실로 확인됨",
      icon: "✅",
      className: "bg-green-100 text-green-800 border-green-300",
    },
    MOSTLY_TRUE: {
      label: "대체로 사실임",
      icon: "✓",
      className: "bg-lime-100 text-lime-800 border-lime-300",
    },
    CAUTION: {
      label: "주의가 필요함",
      icon: "⚠️",
      className: "bg-yellow-100 text-yellow-800 border-yellow-300",
    },
    FALSE: {
      label: "사실이 아님",
      icon: "❌",
      className: "bg-red-100 text-red-800 border-red-300",
    },
    UNKNOWN: {
      label: "판단 불가",
      icon: "❓",
      className: "bg-gray-100 text-gray-800 border-gray-300",
    },
  };

  const { label, icon, className } = config[verdict];

  return (
    <span
      className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border-2 font-semibold ${className}`}
    >
      <span>{icon}</span>
      <span>{label}</span>
    </span>
  );
}
```

#### 입력 폼

```typescript
// src/components/factcheck/InputForm.tsx
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Tabs } from "@/components/ui/Tabs";
import { Input } from "@/components/ui/Input";

interface InputFormProps {
  onSubmit: (data: {
    inputType: "TEXT" | "URL" | "IMAGE";
    content?: string;
    imageFile?: File;
  }) => void;
  isLoading: boolean;
}

export function InputForm({ onSubmit, isLoading }: InputFormProps) {
  const [activeTab, setActiveTab] = useState<"TEXT" | "URL" | "IMAGE">("TEXT");
  const [textContent, setTextContent] = useState("");
  const [urlContent, setUrlContent] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);

  const handleSubmit = () => {
    if (activeTab === "TEXT") {
      if (!textContent.trim() || textContent.length < 10) {
        alert("최소 10자 이상 입력해주세요");
        return;
      }
      onSubmit({ inputType: "TEXT", content: textContent });
    } else if (activeTab === "URL") {
      if (!urlContent.trim()) {
        alert("URL을 입력해주세요");
        return;
      }
      onSubmit({ inputType: "URL", content: urlContent });
    } else if (activeTab === "IMAGE") {
      if (!imageFile) {
        alert("이미지를 업로드해주세요");
        return;
      }
      onSubmit({ inputType: "IMAGE", imageFile });
    }
  };

  return (
    <div className="space-y-6">
      <Tabs
        tabs={[
          { id: "TEXT", label: "📝 텍스트 입력" },
          { id: "URL", label: "🔗 URL 입력" },
          { id: "IMAGE", label: "📸 이미지 업로드" },
        ]}
        activeTab={activeTab}
        onChange={(tab) => setActiveTab(tab as any)}
      />

      {activeTab === "TEXT" && (
        <div>
          <textarea
            className="w-full min-h-[200px] p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-vertical"
            placeholder="검증하고 싶은 내용을 입력하세요...&#10;&#10;예: '마늘을 매일 먹으면 암을 예방할 수 있다'"
            value={textContent}
            onChange={(e) => setTextContent(e.target.value)}
            disabled={isLoading}
          />
          <div className="text-sm text-gray-500 mt-2">
            {textContent.length} / 5000자
          </div>
        </div>
      )}

      {activeTab === "URL" && (
        <div>
          <Input
            type="url"
            placeholder="https://example.com/article"
            value={urlContent}
            onChange={(e) => setUrlContent(e.target.value)}
            disabled={isLoading}
          />
          <p className="text-sm text-gray-600 mt-2">
            지원 가능한 URL: 뉴스 기사, 블로그 포스트, SNS 게시물
          </p>
        </div>
      )}

      {activeTab === "IMAGE" && (
        <div>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
            <input
              type="file"
              accept="image/*"
              id="image-upload"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) setImageFile(file);
              }}
              disabled={isLoading}
            />
            <label
              htmlFor="image-upload"
              className="cursor-pointer flex flex-col items-center"
            >
              {imageFile ? (
                <>
                  <div className="text-4xl mb-4">✓</div>
                  <div className="text-lg font-medium text-gray-900">
                    {imageFile.name}
                  </div>
                  <div className="text-sm text-gray-500 mt-2">
                    클릭하여 다른 이미지 선택
                  </div>
                </>
              ) : (
                <>
                  <div className="text-6xl mb-4">📷</div>
                  <div className="text-lg font-medium text-gray-900 mb-2">
                    이미지를 드래그하거나 클릭하여 업로드
                  </div>
                  <div className="text-sm text-gray-500">
                    JPG, PNG, GIF (최대 10MB)
                  </div>
                </>
              )}
            </label>
          </div>
          <p className="text-sm text-gray-600 mt-2">
            💡 팁: 텍스트가 선명하게 보이는 이미지를 업로드해주세요
          </p>
        </div>
      )}

      <Button
        onClick={handleSubmit}
        disabled={isLoading}
        className="w-full"
        size="large"
      >
        {isLoading ? "검증 중..." : "✓ 팩트체크 시작하기"}
      </Button>
    </div>
  );
}
```

---

## 8. 외부 서비스 연동

### 8.1 인증 (NextAuth.js)

```typescript
// src/lib/auth.ts
import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import NaverProvider from "next-auth/providers/naver";
import KakaoProvider from "next-auth/providers/kakao";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { db } from "./prisma";
import bcrypt from "bcryptjs";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(db),
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/login",
  },
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    NaverProvider({
      clientId: process.env.NAVER_CLIENT_ID!,
      clientSecret: process.env.NAVER_CLIENT_SECRET!,
    }),
    KakaoProvider({
      clientId: process.env.KAKAO_CLIENT_ID!,
      clientSecret: process.env.KAKAO_CLIENT_SECRET!,
    }),
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("이메일과 비밀번호를 입력해주세요");
        }

        const user = await db.user.findUnique({
          where: { email: credentials.email },
        });

        if (!user || !user.password) {
          throw new Error("계정을 찾을 수 없습니다");
        }

        const isPasswordValid = await bcrypt.compare(
          credentials.password,
          user.password
        );

        if (!isPasswordValid) {
          throw new Error("비밀번호가 일치하지 않습니다");
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          image: user.image,
        };
      },
    }),
  ],
  callbacks: {
    async session({ token, session }) {
      if (token) {
        session.user.id = token.id;
        session.user.name = token.name;
        session.user.email = token.email;
        session.user.image = token.picture;
      }

      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }

      return token;
    },
  },
};
```

### 8.2 Kakao Maps API

```typescript
// src/components/library/LibraryMap.tsx
"use client";

import { useEffect, useRef } from "react";

declare global {
  interface Window {
    kakao: any;
  }
}

interface Library {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  address: string;
  distance?: number;
}

interface LibraryMapProps {
  libraries: Library[];
  userLocation?: { latitude: number; longitude: number };
}

export function LibraryMap({ libraries, userLocation }: LibraryMapProps) {
  const mapContainer = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mapContainer.current) return;

    // Kakao Maps SDK 로드
    const script = document.createElement("script");
    script.async = true;
    script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${process.env.NEXT_PUBLIC_KAKAO_API_KEY}&autoload=false`;
    document.head.appendChild(script);

    script.onload = () => {
      window.kakao.maps.load(() => {
        const center = userLocation
          ? new window.kakao.maps.LatLng(
              userLocation.latitude,
              userLocation.longitude
            )
          : new window.kakao.maps.LatLng(
              libraries[0].latitude,
              libraries[0].longitude
            );

        const map = new window.kakao.maps.Map(mapContainer.current, {
          center,
          level: 5,
        });

        // 사용자 위치 마커
        if (userLocation) {
          const userMarker = new window.kakao.maps.Marker({
            position: new window.kakao.maps.LatLng(
              userLocation.latitude,
              userLocation.longitude
            ),
            image: new window.kakao.maps.MarkerImage(
              "/icons/user-location.png",
              new window.kakao.maps.Size(32, 32)
            ),
          });
          userMarker.setMap(map);
        }

        // 도서관 마커
        libraries.forEach((library) => {
          const position = new window.kakao.maps.LatLng(
            library.latitude,
            library.longitude
          );

          const marker = new window.kakao.maps.Marker({
            position,
            title: library.name,
          });

          marker.setMap(map);

          // 인포윈도우
          const infowindow = new window.kakao.maps.InfoWindow({
            content: `<div style="padding:10px;">${library.name}</div>`,
          });

          window.kakao.maps.event.addListener(marker, "click", () => {
            infowindow.open(map, marker);
          });
        });

        // 모든 마커가 보이도록 지도 범위 조정
        const bounds = new window.kakao.maps.LatLngBounds();
        libraries.forEach((lib) => {
          bounds.extend(
            new window.kakao.maps.LatLng(lib.latitude, lib.longitude)
          );
        });
        if (userLocation) {
          bounds.extend(
            new window.kakao.maps.LatLng(
              userLocation.latitude,
              userLocation.longitude
            )
          );
        }
        map.setBounds(bounds);
      });
    };

    return () => {
      document.head.removeChild(script);
    };
  }, [libraries, userLocation]);

  return (
    <div
      ref={mapContainer}
      className="w-full h-[500px] rounded-lg overflow-hidden border border-gray-200"
    />
  );
}
```

---

## 9. 배포 및 인프라

### 9.1 Vercel 배포 설정

```javascript
// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      "lh3.googleusercontent.com", // Google OAuth
      "phinf.pstatic.net", // Naver
      "k.kakaocdn.net", // Kakao
    ],
  },
  experimental: {
    serverActions: {
      bodySizeLimit: "10mb", // 이미지 업로드용
    },
  },
};

module.exports = nextConfig;
```

### 9.2 환경 변수 설정

```env
# .env.example

# 데이터베이스 (Supabase)
DATABASE_URL="postgresql://user:password@host:6543/db?pgbouncer=true"
DIRECT_URL="postgresql://user:password@host:5432/db"

# NextAuth
NEXTAUTH_URL="https://factchecker.vercel.app"
NEXTAUTH_SECRET="generate-a-random-secret-key-here"

# OAuth 제공자
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"

NAVER_CLIENT_ID="3z5rHOP5ImHhFby5iyrK"
NAVER_CLIENT_SECRET="_9ZOgyw63A"

KAKAO_CLIENT_ID="your-kakao-client-id"
KAKAO_CLIENT_SECRET="your-kakao-client-secret"

# AI API
ANTHROPIC_API_KEY="your-anthropic-api-key"

# 외부 API
NAVER_API_CLIENT_ID="3z5rHOP5ImHhFby5iyrK"
NAVER_API_CLIENT_SECRET="_9ZOgyw63A"

KAKAO_REST_API_KEY="babf8579f7a855f65e9c3bf4d81d717c"
NEXT_PUBLIC_KAKAO_API_KEY="your-kakao-javascript-key"

LIBRARY_NARU_API_KEY="87bcb88c26b091d02752cee9355ae48bd2df9c19911958542c253489f1097d92"

ALADIN_TTB_KEY="your-aladin-ttb-key"
```

### 9.3 CI/CD 파이프라인

```yaml
# .github/workflows/ci.yml
name: CI

on:
  pull_request:
    branches: [main]
  push:
    branches: [main]

jobs:
  lint-and-type-check:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: "20"
          cache: "npm"

      - name: Install dependencies
        run: npm ci

      - name: Run linter
        run: npm run lint

      - name: Type check
        run: npm run type-check

      - name: Build
        run: npm run build
```

### 9.4 Vercel 배포 단계

1. **GitHub 저장소 연결**
   - Vercel Dashboard에서 "New Project" 클릭
   - GitHub 저장소 선택
   - Framework Preset: Next.js 자동 감지

2. **환경 변수 설정**
   - Vercel Dashboard > Settings > Environment Variables
   - `.env.example`의 모든 변수 추가
   - Production, Preview, Development 환경별로 설정

3. **Supabase 데이터베이스 연결**
   - Supabase Dashboard에서 Connection String 복사
   - `DATABASE_URL` (Transaction Pooler)
   - `DIRECT_URL` (Direct Connection)

4. **도메인 설정**
   - Vercel이 자동 제공하는 `.vercel.app` 도메인 사용
   - 또는 Custom Domain 추가

5. **자동 배포**
   - `main` 브랜치에 푸시하면 자동 배포
   - Pull Request 생성 시 Preview 배포

---

## 10. 보안 전략

### 10.1 API 키 보호

- ✅ 모든 API 키는 환경 변수로 관리
- ✅ `.env` 파일은 `.gitignore`에 포함
- ✅ 클라이언트에서 절대 API 키 노출 금지
- ✅ `NEXT_PUBLIC_` 접두사는 공개 가능한 키에만 사용

### 10.2 입력 검증

```typescript
// Zod 스키마로 모든 입력 검증
import { z } from "zod";

export const factCheckInputSchema = z.object({
  inputType: z.enum(["TEXT", "URL", "IMAGE"]),
  content: z
    .string()
    .min(10, "최소 10자 이상 입력해주세요")
    .max(5000, "최대 5000자까지 입력 가능합니다"),
  imageUrl: z.string().url().optional(),
});

// 사용 예시
const parsed = factCheckInputSchema.parse(userInput);
```

### 10.3 Rate Limiting

```typescript
// tRPC 미들웨어로 Rate Limiting
import { TRPCError } from "@trpc/server";

const rateLimitMap = new Map<string, { count: number; resetAt: number }>();

export const rateLimitMiddleware = t.middleware(({ ctx, next, path }) => {
  const identifier = ctx.session?.user?.id || ctx.req.ip;
  const now = Date.now();
  const limit = 10; // 10 requests
  const window = 60000; // per minute

  const record = rateLimitMap.get(identifier);

  if (!record || now > record.resetAt) {
    rateLimitMap.set(identifier, { count: 1, resetAt: now + window });
  } else if (record.count >= limit) {
    throw new TRPCError({
      code: "TOO_MANY_REQUESTS",
      message: "너무 많은 요청입니다. 잠시 후 다시 시도해주세요.",
    });
  } else {
    record.count++;
  }

  return next();
});
```

### 10.4 CORS 설정

```typescript
// Next.js API Routes에서 CORS 설정
export async function GET(req: Request) {
  const origin = req.headers.get("origin");
  const allowedOrigins = [
    "https://factchecker.vercel.app",
    process.env.NODE_ENV === "development" ? "http://localhost:3000" : null,
  ].filter(Boolean);

  if (origin && allowedOrigins.includes(origin)) {
    return new Response(JSON.stringify({ data: "..." }), {
      headers: {
        "Access-Control-Allow-Origin": origin,
        "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
      },
    });
  }

  return new Response("Forbidden", { status: 403 });
}
```

### 10.5 SQL Injection 방지

- ✅ Prisma ORM 사용 (파라미터화된 쿼리)
- ✅ Raw SQL 쿼리 최소화
- ✅ 사용자 입력을 직접 SQL에 삽입하지 않음

### 10.6 XSS 방지

- ✅ React의 자동 이스케이핑
- ✅ `dangerouslySetInnerHTML` 사용 금지
- ✅ 사용자 입력 HTML sanitization (DOMPurify)

---

## 11. 성능 최적화

### 11.1 Next.js 최적화

1. **이미지 최적화**
```typescript
import Image from "next/image";

<Image
  src="/hero-bg.jpg"
  alt="Hero Background"
  width={1920}
  height={1080}
  priority // LCP 개선
  placeholder="blur"
/>
```

2. **코드 스플리팅**
```typescript
import dynamic from "next/dynamic";

const LibraryMap = dynamic(() => import("@/components/library/LibraryMap"), {
  loading: () => <div>지도를 불러오는 중...</div>,
  ssr: false, // 클라이언트 전용
});
```

3. **서버 컴포넌트 활용**
```typescript
// app/page.tsx (서버 컴포넌트)
import { db } from "@/lib/prisma";

export default async function HomePage() {
  const popularChecks = await db.factCheck.findMany({
    where: { status: "COMPLETED" },
    take: 5,
    orderBy: { createdAt: "desc" },
  });

  return <PopularChecks data={popularChecks} />;
}
```

### 11.2 데이터베이스 최적화

1. **인덱스 활용**
```prisma
model FactCheck {
  // ...
  @@index([userId])
  @@index([createdAt])
  @@index([status])
}
```

2. **N+1 쿼리 방지**
```typescript
// ❌ 나쁜 예
const factChecks = await db.factCheck.findMany();
for (const fc of factChecks) {
  fc.references = await db.reference.findMany({ where: { factCheckId: fc.id } });
}

// ✅ 좋은 예
const factChecks = await db.factCheck.findMany({
  include: {
    references: true,
  },
});
```

3. **커넥션 풀링**
- Supabase PgBouncer 사용
- `DATABASE_URL`에 `?pgbouncer=true` 추가

### 11.3 캐싱 전략

1. **TanStack Query 캐싱**
```typescript
const { data } = api.factCheck.getPopular.useQuery(
  { limit: 10 },
  {
    staleTime: 5 * 60 * 1000, // 5분
    cacheTime: 10 * 60 * 1000, // 10분
  }
);
```

2. **Next.js 캐싱**
```typescript
// 정적 데이터 (빌드 시 생성)
export const revalidate = 3600; // 1시간마다 재검증

export default async function Page() {
  const data = await fetch("https://api.example.com/data", {
    next: { revalidate: 3600 },
  });
  return <div>...</div>;
}
```

### 11.4 번들 사이즈 최적화

```javascript
// next.config.js
const nextConfig = {
  experimental: {
    optimizePackageImports: ["@heroicons/react"],
  },
};
```

---

## 12. 개발 워크플로우

### 12.1 로컬 개발 환경 설정

```bash
# 1. 저장소 클론
git clone https://github.com/your-org/factchecker.git
cd factchecker

# 2. 의존성 설치
npm install

# 3. 환경 변수 설정
cp .env.example .env
# .env 파일을 열어 실제 값 입력

# 4. Prisma 설정
npx prisma generate
npx prisma db push

# 5. 개발 서버 실행
npm run dev
```

### 12.2 개발 스크립트

```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "type-check": "tsc --noEmit",
    "prisma:generate": "prisma generate",
    "prisma:push": "prisma db push",
    "prisma:studio": "prisma studio",
    "prisma:migrate": "prisma migrate dev"
  }
}
```

### 12.3 Git 브랜치 전략

```
main (프로덕션)
  └── develop (개발)
       ├── feature/factcheck-input
       ├── feature/library-map
       └── feature/ai-integration
```

### 12.4 코드 리뷰 체크리스트

- [ ] 타입 안정성 (TypeScript 오류 없음)
- [ ] 린트 통과 (ESLint)
- [ ] 입력 검증 (Zod 스키마)
- [ ] 에러 핸들링
- [ ] 접근성 (WCAG 2.1 AA)
- [ ] 성능 (Lighthouse 점수 90+)
- [ ] 보안 (API 키 노출 없음)

---

## 총정리

이 코드 아키텍처는 다음을 보장합니다:

### ✅ 최신 기술 스택 (2026년 1월 기준)
- Next.js 16.1.4
- React 19.2.1
- TypeScript 5.7
- Tailwind CSS 4.1.18
- tRPC, Prisma, Zod 최신 버전

### ✅ Vercel 최적화
- Zero-configuration 배포
- Edge Functions 활용
- 자동 CI/CD
- 무료 티어로 시작 가능

### ✅ End-to-End 타입 세이프티
- TypeScript: 컴파일 타임 타입 체크
- tRPC: 클라이언트-서버 타입 동기화
- Prisma: 데이터베이스 타입 생성
- Zod: 런타임 데이터 검증

### ✅ 확장 가능한 구조
- 모듈화된 서비스 레이어
- 플러그인 가능한 데이터 소스
- 도메인별 컴포넌트 분리

### ✅ 성능 최적화
- Next.js 서버 컴포넌트
- 코드 스플리팅
- 이미지 최적화
- 데이터베이스 인덱싱

### ✅ 보안 강화
- API 키 환경 변수 관리
- 입력 검증 (Zod)
- Rate Limiting
- CORS 설정
- SQL Injection 방지 (Prisma)

### ✅ 개발자 경험 최적화
- TypeScript 자동완성
- Hot Module Replacement
- Prisma Studio
- tRPC 자동 타입 추론

---

**다음 단계**: [개발 워크플로우](#12-개발-워크플로우)를 따라 로컬 개발 환경을 설정하고 개발을 시작하세요.

**관련 문서**:
- [서비스 기획안](proposal.md)
- [디자인 가이드](design-guide.md)
- [와이어프레임](wireframes.md)
- [데이터 소스 전략](data-source-strategy.md)
- [구현 로드맵](IMPLEMENTATION-ROADMAP.md)

---

**문서 종료**
