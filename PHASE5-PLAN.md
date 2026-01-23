# Phase 5 실행 계획

## 목표
배포 전 마지막 품질 개선 및 사용자 경험 향상

## 완료 일정
2026년 1월 23일 시작 → 같은 날 완료 목표

---

## 📋 작업 항목 (우선순위 순)

### 1. 다크 모드 구현 ⭐⭐⭐
**우선순위**: 최상 (현대적 웹앱 필수 기능)

#### 작업 내용
- [x] Tailwind CSS 다크 모드 설정
- [ ] 다크 모드 토글 버튼 컴포넌트 생성
- [ ] 로컬 스토리지 상태 저장
- [ ] Header에 다크 모드 토글 추가
- [ ] 모든 페이지 다크 모드 스타일 적용
- [ ] 시스템 테마 자동 감지

**예상 시간**: 1-2시간

**관련 파일**:
- `tailwind.config.ts` - 다크 모드 설정
- `src/app/layout.tsx` - 다크 모드 provider
- `src/components/layout/Header.tsx` - 토글 버튼
- `src/components/ui/ThemeToggle.tsx` (신규)
- `src/hooks/useDarkMode.ts` (신규)

---

### 2. 북마크 기능 ⭐⭐⭐
**우선순위**: 상 (사용자 참여 유도)

#### 작업 내용
- [ ] Prisma 스키마에 Bookmark 모델 확인/추가
- [ ] tRPC 라우터에 bookmark 엔드포인트 추가
  - `bookmark.create` - 북마크 추가
  - `bookmark.delete` - 북마크 삭제
  - `bookmark.getAll` - 내 북마크 목록
  - `bookmark.check` - 북마크 여부 확인
- [ ] 검증 결과 페이지에 북마크 버튼 추가
- [ ] 북마크 페이지 생성
- [ ] UI 아이콘 및 애니메이션

**예상 시간**: 2-3시간

**관련 파일**:
- `prisma/schema.prisma` - Bookmark 모델
- `src/server/api/routers/bookmark.ts` (신규)
- `src/server/api/root.ts` - 라우터 추가
- `src/app/(main)/bookmarks/page.tsx` (신규)
- `src/app/(main)/result/[id]/page.tsx` - 북마크 버튼
- `src/components/ui/BookmarkButton.tsx` (신규)

---

### 3. PDF 다운로드 기능 ⭐⭐
**우선순위**: 중 (공유 기능 확장)

#### 작업 내용
- [ ] `jsPDF` 또는 `react-pdf` 라이브러리 설치
- [ ] PDF 생성 함수 구현
- [ ] 검증 결과 PDF 템플릿 디자인
- [ ] 다운로드 버튼 추가 (result 페이지)
- [ ] 로고 및 워터마크 추가

**예상 시간**: 2-3시간

**관련 파일**:
- `package.json` - jsPDF 설치
- `src/utils/pdf.ts` (신규) - PDF 생성 로직
- `src/app/(main)/result/[id]/page.tsx` - 다운로드 버튼

---

### 4. Playwright E2E 테스트 ⭐⭐
**우선순위**: 중 (품질 보증)

#### 작업 내용
- [ ] Playwright 설치 및 설정
- [ ] 핵심 사용자 플로우 테스트
  - 팩트체크 생성 플로우
  - 로그인/회원가입 플로우
  - 도서관 검색 플로우
- [ ] CI/CD 통합 (GitHub Actions)

**예상 시간**: 2-3시간

**관련 파일**:
- `playwright.config.ts` (신규)
- `tests/e2e/factcheck.spec.ts` (신규)
- `tests/e2e/auth.spec.ts` (신규)
- `tests/e2e/library.spec.ts` (신규)
- `.github/workflows/e2e.yml` (신규)

---

### 5. Sentry 에러 추적 ⭐⭐
**우선순위**: 중상 (프로덕션 모니터링)

#### 작업 내용
- [ ] Sentry 계정 생성
- [ ] `@sentry/nextjs` 설치
- [ ] Sentry 설정 파일 생성
- [ ] 소스맵 업로드 설정
- [ ] 에러 바운더리에 Sentry 통합
- [ ] 사용자 컨텍스트 추가

**예상 시간**: 1시간

**관련 파일**:
- `sentry.client.config.ts` (신규)
- `sentry.server.config.ts` (신규)
- `next.config.js` - Sentry 설정
- `package.json` - Sentry 패키지
- `.env.example` - Sentry DSN

---

### 6. 성능 최적화 ⭐
**우선순위**: 중 (사용자 경험)

#### 작업 내용
- [ ] 이미지 최적화
  - Next.js Image 컴포넌트 사용 확인
  - 지연 로딩 적용
- [ ] 코드 스플리팅
  - 동적 import 적용
  - 라우트별 번들 최적화
- [ ] 폰트 최적화
  - next/font 사용
- [ ] 메모이제이션
  - React.memo, useMemo, useCallback 적용

**예상 시간**: 1-2시간

**관련 파일**:
- `src/app/layout.tsx` - 폰트 최적화
- `src/components/**/*.tsx` - 이미지 최적화
- 다양한 컴포넌트 - 메모이제이션

---

### 7. 추가 UI/UX 개선 ⭐
**우선순위**: 하 (선택적)

#### 작업 내용
- [ ] 로딩 스켈레톤 UI 추가
- [ ] 토스트 알림 시스템
- [ ] 애니메이션 개선 (framer-motion)
- [ ] 접근성 개선 (aria-label, 키보드 네비게이션)
- [ ] 모바일 UX 개선

**예상 시간**: 2-3시간

**관련 파일**:
- `src/components/ui/Skeleton.tsx` (신규)
- `src/components/ui/Toast.tsx` (신규)
- `src/hooks/useToast.ts` (신규)

---

## 🚫 Phase 5에서 제외되는 항목

### Redis 캐싱
- **이유**: 외부 인프라 필요 (Redis 서버)
- **대안**: Vercel Edge Config 또는 배포 후 필요시 추가

### Google Analytics
- **이유**: 배포 후 실제 트래픽 데이터가 필요
- **대안**: 배포 후 추가

### 이메일 알림
- **이유**: SMTP 서버 또는 이메일 서비스 필요
- **대안**: Phase 6 또는 사용자 피드백 후 결정

### 알파 테스트
- **이유**: 배포 후 진행
- **계획**: Phase 5 완료 → Vercel 배포 → 알파 테스트

---

## ✅ 완료 기준

### 필수 (배포 전 완료)
- [x] 다크 모드 작동
- [ ] 북마크 기능 작동
- [ ] PDF 다운로드 작동
- [ ] Sentry 연동 완료

### 선택 (시간 허용 시)
- [ ] E2E 테스트 작성
- [ ] 성능 최적화
- [ ] 추가 UI/UX 개선

---

## 📊 예상 소요 시간

| 작업 | 예상 시간 | 우선순위 |
|------|-----------|----------|
| 다크 모드 | 1-2시간 | 필수 |
| 북마크 기능 | 2-3시간 | 필수 |
| PDF 다운로드 | 2-3시간 | 필수 |
| Sentry 연동 | 1시간 | 필수 |
| E2E 테스트 | 2-3시간 | 선택 |
| 성능 최적화 | 1-2시간 | 선택 |
| UI/UX 개선 | 2-3시간 | 선택 |

**총 필수 시간**: 6-9시간  
**총 선택 시간**: 5-8시간  
**전체 시간**: 11-17시간

---

## 🎯 Phase 5 완료 후

### 즉시 실행
1. **Vercel 배포**
   - 프로덕션 환경 변수 설정
   - 도메인 연결
   - SSL 인증서 확인

2. **알파 테스트**
   - 내부 테스트 사용자 5-10명
   - 피드백 양식 준비
   - 1주일 테스트 기간

3. **베타 테스트**
   - 공개 베타 신청 페이지
   - 50-100명 테스트 사용자
   - 2주일 테스트 기간

### 추후 계획 (Phase 6)
- [ ] Redis 캐싱 구현
- [ ] Google Analytics 연동
- [ ] 이메일 알림 시스템
- [ ] 관리자 대시보드
- [ ] 사용자 피드백 반영
- [ ] 마케팅 및 홍보

---

## 📝 참고 사항

### 기술 스택 추가
- `jsPDF` - PDF 생성
- `@sentry/nextjs` - 에러 추적
- `@playwright/test` - E2E 테스트
- `framer-motion` (선택) - 애니메이션

### 환경 변수 추가
```env
# Sentry (프로덕션)
NEXT_PUBLIC_SENTRY_DSN="..."
SENTRY_AUTH_TOKEN="..."
```

---

**문서 작성일**: 2026년 1월 23일  
**예상 완료일**: 2026년 1월 23일  
**다음 단계**: Vercel 배포 및 알파 테스트
