# Vercel 배포 가이드

FactChecker 프로젝트를 Vercel에 배포하는 방법

---

## 📋 사전 준비

### 필요한 계정
1. **GitHub 계정**: 저장소 호스팅
2. **Vercel 계정**: 배포 플랫폼
3. **Supabase 계정**: 프로덕션 데이터베이스

### 준비 사항
- [ ] GitHub에 코드 푸시 완료
- [ ] Supabase 프로덕션 데이터베이스 준비
- [ ] 모든 API 키 확보
- [ ] 로컬에서 빌드 성공 확인

---

## 🚀 Vercel 배포 (10분)

### 1단계: Vercel 프로젝트 생성

1. https://vercel.com/ 접속
2. "Add New" > "Project" 클릭
3. GitHub 저장소 선택 (factchecker)
4. "Import" 클릭

### 2단계: 프로젝트 설정

**Framework Preset**: Next.js (자동 감지)

**Root Directory**: `./` (기본값)

**Build Command**: `npm run build` (기본값)

**Output Directory**: `.next` (기본값)

**Install Command**: `npm install` (기본값)

### 3단계: 환경 변수 설정

"Environment Variables" 섹션에서 다음 변수들을 추가:

#### 필수 변수

```
DATABASE_URL = postgresql://postgres:[PASSWORD]@[PROJECT-REF].supabase.co:6543/postgres?pgbouncer=true
DIRECT_URL = postgresql://postgres:[PASSWORD]@[PROJECT-REF].supabase.co:5432/postgres

NEXTAUTH_URL = https://your-project.vercel.app
NEXTAUTH_SECRET = [openssl rand -base64 32로 생성한 값]

ANTHROPIC_API_KEY = sk-ant-api03-...

NAVER_API_CLIENT_ID = 3z5rHOP5ImHhFby5iyrK
NAVER_API_CLIENT_SECRET = _9ZOgyw63A

KAKAO_REST_API_KEY = babf8579f7a855f65e9c3bf4d81d717c
NEXT_PUBLIC_KAKAO_API_KEY = [JavaScript Key]

LIBRARY_NARU_API_KEY = 87bcb88c26b091d02752cee9355ae48bd2df9c19911958542c253489f1097d92

ALADIN_TTB_KEY = [발급한 TTB Key]
```

**Environment**: Production, Preview, Development 모두 체크

### 4단계: 배포 시작

1. "Deploy" 버튼 클릭
2. 빌드 로그 확인
3. 3-5분 후 배포 완료

### 5단계: 도메인 확인

- 자동 생성된 도메인: `https://factchecker-xxx.vercel.app`
- 또는 Custom Domain 추가

---

## 🔄 자동 배포 설정

### GitHub 연동

Vercel은 GitHub과 자동으로 연동됩니다:

- **main 브랜치 푸시** → 프로덕션 배포
- **Pull Request 생성** → Preview 배포
- **커밋마다** → 자동 빌드

### 브랜치 전략

```
main (프로덕션)
  └── develop (스테이징)
       └── feature/* (기능 개발)
```

- `main`: 프로덕션 배포
- `develop`: Preview 배포
- `feature/*`: PR 생성 시 Preview 배포

---

## 🗄️ 데이터베이스 마이그레이션

### 프로덕션 DB 설정

1. **Supabase 프로덕션 프로젝트 생성**
   - 로컬과 별도의 프로젝트
   - 리전: `Northeast Asia (Seoul)`

2. **Connection String 업데이트**
   - Vercel Dashboard > Settings > Environment Variables
   - `DATABASE_URL` 업데이트
   - `DIRECT_URL` 업데이트

3. **마이그레이션 실행**
   ```bash
   # 로컬에서 프로덕션 DB에 마이그레이션
   DATABASE_URL="프로덕션-URL" npx prisma migrate deploy
   ```

### 마이그레이션 전략

```bash
# 1. 로컬에서 마이그레이션 생성
npx prisma migrate dev --name add_new_field

# 2. Git 커밋
git add prisma/migrations
git commit -m "feat: add new field to schema"

# 3. GitHub에 푸시
git push origin main

# 4. Vercel이 자동으로 빌드 시 마이그레이션 실행
# (next build 전에 prisma generate 자동 실행)
```

---

## 🔐 환경 변수 관리

### 프로덕션 환경 변수

1. **Vercel Dashboard** 사용
   - Settings > Environment Variables
   - 각 변수마다 Edit 가능

2. **Vercel CLI** 사용
   ```bash
   vercel env add DATABASE_URL production
   vercel env add NEXTAUTH_SECRET production
   ```

### 환경별 분리

- **Production**: 실제 사용자가 사용하는 환경
- **Preview**: PR마다 생성되는 미리보기
- **Development**: 로컬 개발 환경

각 환경마다 다른 값 설정 가능 (예: 다른 DB, 다른 API 키)

---

## 📊 모니터링

### Vercel Analytics

1. **설정**
   - Vercel Dashboard > Analytics 탭
   - "Enable Analytics" 클릭

2. **확인 가능한 지표**
   - 페이지 뷰
   - 사용자 수
   - 성능 지표 (Core Web Vitals)
   - 오류율

### 로그 확인

1. **실시간 로그**
   ```bash
   vercel logs
   ```

2. **함수별 로그**
   - Vercel Dashboard > Functions
   - 각 함수의 실행 로그 확인

### 성능 모니터링

1. **Lighthouse 점수**
   - Vercel이 자동으로 측정
   - 90점 이상 목표

2. **Core Web Vitals**
   - LCP (Largest Contentful Paint): 2.5초 이하
   - FID (First Input Delay): 100ms 이하
   - CLS (Cumulative Layout Shift): 0.1 이하

---

## 🐛 프로덕션 디버깅

### 빌드 실패

1. **로그 확인**
   - Vercel Dashboard > Deployments
   - 실패한 배포 클릭
   - 빌드 로그 확인

2. **일반적인 원인**
   - 환경 변수 누락
   - TypeScript 오류
   - 데이터베이스 연결 실패

3. **해결 방법**
   ```bash
   # 로컬에서 프로덕션 빌드 테스트
   npm run build
   ```

### 런타임 에러

1. **Vercel 로그 확인**
   ```bash
   vercel logs --follow
   ```

2. **Sentry 연동 (선택적)**
   ```bash
   npm install @sentry/nextjs
   ```

---

## 🔄 롤백 전략

### 이전 배포로 롤백

1. Vercel Dashboard > Deployments
2. 이전에 성공한 배포 선택
3. "Promote to Production" 클릭
4. 즉시 롤백 완료

### Git 레벨 롤백

```bash
# 1. 이전 커밋으로 되돌리기
git revert HEAD

# 2. 푸시
git push origin main

# 3. Vercel이 자동으로 재배포
```

---

## 🌐 커스텀 도메인 설정

### 도메인 추가

1. Vercel Dashboard > Settings > Domains
2. "Add" 클릭
3. 도메인 입력 (예: `factchecker.com`)
4. DNS 레코드 추가:
   ```
   Type: A
   Name: @
   Value: 76.76.21.21

   Type: CNAME
   Name: www
   Value: cname.vercel-dns.com
   ```

### SSL 인증서

- Vercel이 자동으로 Let's Encrypt SSL 인증서 발급
- HTTPS 자동 활성화

---

## 📈 배포 체크리스트

### 배포 전

- [ ] 로컬에서 `npm run build` 성공
- [ ] 로컬에서 `npm run type-check` 성공
- [ ] 로컬에서 `npm run lint` 성공
- [ ] 모든 기능 테스트 완료
- [ ] 환경 변수 모두 준비
- [ ] Supabase 프로덕션 DB 준비

### 배포 중

- [ ] Vercel 프로젝트 생성
- [ ] GitHub 저장소 연결
- [ ] 환경 변수 설정
- [ ] 첫 배포 시작
- [ ] 빌드 로그 확인

### 배포 후

- [ ] 프로덕션 사이트 접속 확인
- [ ] 주요 기능 테스트
  - [ ] 팩트체크 생성
  - [ ] 결과 확인
  - [ ] 도서관 지도
- [ ] 성능 확인 (Lighthouse)
- [ ] 에러 없는지 확인
- [ ] Analytics 활성화

---

## 🔧 고급 설정

### Edge Functions

```typescript
// src/app/api/edge-example/route.ts
export const runtime = 'edge';

export async function GET(request: Request) {
  return new Response('Hello from Edge!');
}
```

### Incremental Static Regeneration (ISR)

```typescript
// src/app/page.tsx
export const revalidate = 3600; // 1시간마다 재생성

export default async function HomePage() {
  const popularChecks = await getPopularChecks();
  return <div>{/* ... */}</div>;
}
```

### Preview Deployments

- PR마다 고유한 Preview URL 생성
- `https://factchecker-git-feature-branch-username.vercel.app`
- 실제 사용자에게 영향 없이 테스트 가능

---

## 📞 문의 및 지원

### Vercel 지원
- [Vercel 문서](https://vercel.com/docs)
- [Vercel 커뮤니티](https://github.com/vercel/next.js/discussions)

### 프로젝트 이슈
- GitHub Issues

---

**작성일**: 2026년 1월 23일  
**버전**: 1.0  
**다음 문서**: [개발 시작 가이드](GETTING-STARTED.md)
