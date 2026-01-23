# 환경 변수 설정 가이드

FactChecker 프로젝트의 환경 변수 설정 방법

---

## 📝 환경 변수 파일 생성

프로젝트 루트에 `.env` 파일을 생성하세요:

```bash
# 프로젝트 루트 디렉토리에서
touch .env  # Mac/Linux
# 또는
type nul > .env  # Windows
```

⚠️ **중요**: `.env` 파일은 절대 Git에 커밋하지 마세요!

---

## 🔑 필수 환경 변수

### 데이터베이스 (Supabase)

```env
DATABASE_URL="postgresql://postgres:[PASSWORD]@[PROJECT-REF].supabase.co:6543/postgres?pgbouncer=true"
DIRECT_URL="postgresql://postgres:[PASSWORD]@[PROJECT-REF].supabase.co:5432/postgres"
```

**가져오는 방법**:
1. https://supabase.com/dashboard 접속
2. 프로젝트 선택
3. Settings > Database > Connection string
4. `Transaction pooler` → `DATABASE_URL`
5. `Direct connection` → `DIRECT_URL`

### NextAuth 인증

```env
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="[RANDOM-SECRET-KEY]"
```

**시크릿 키 생성**:
```bash
openssl rand -base64 32
```

### AI API (Anthropic Claude)

```env
ANTHROPIC_API_KEY="sk-ant-api03-..."
```

**발급 방법**:
1. https://console.anthropic.com/ 접속
2. "API Keys" 메뉴
3. "Create Key" 클릭
4. 키 복사

---

## ✅ 이미 보유한 API 키

다음 API 키는 이미 보유하고 있어 즉시 사용 가능합니다:

### Naver Developers API

```env
NAVER_API_CLIENT_ID="3z5rHOP5ImHhFby5iyrK"
NAVER_API_CLIENT_SECRET="_9ZOgyw63A"
```

**용도**: 학술정보, 책, 뉴스 검색

### Kakao Developers API

```env
KAKAO_REST_API_KEY="babf8579f7a855f65e9c3bf4d81d717c"
NEXT_PUBLIC_KAKAO_API_KEY="[JavaScript Key 필요]"
```

**용도**: 도서관 위치 검색, 지도 표시

**JavaScript Key 추가 발급**:
1. https://developers.kakao.com/console/app
2. 앱 선택
3. "앱 키" 메뉴
4. "JavaScript 키" 복사

### 도서관 정보나루 API

```env
LIBRARY_NARU_API_KEY="87bcb88c26b091d02752cee9355ae48bd2df9c19911958542c253489f1097d92"
```

**용도**: 국립중앙도서관 소장 자료 검색

---

## 🔄 추가 발급 필요 API

### 알라딘 TTB Key (5분 소요)

```env
ALADIN_TTB_KEY="[발급 필요]"
```

**발급 방법**:
1. https://www.aladin.co.kr/ 회원가입 (무료)
2. https://www.aladin.co.kr/ttb/wblog_main.aspx 접속
3. "TTB 인증키 발급" 클릭
4. 즉시 발급됨 (승인 대기 없음)

**용도**: 도서 상세 정보, 표지 이미지, 목차

---

## 🔐 OAuth 제공자 (선택적)

사용자 로그인 기능을 위한 OAuth 설정입니다. MVP에서는 선택적으로 구현 가능합니다.

### Google OAuth

```env
GOOGLE_CLIENT_ID="[발급 필요]"
GOOGLE_CLIENT_SECRET="[발급 필요]"
```

**발급 방법**:
1. https://console.cloud.google.com/ 접속
2. 프로젝트 생성 또는 선택
3. "APIs & Services" > "Credentials"
4. "Create Credentials" > "OAuth client ID"
5. Application type: "Web application"
6. Authorized redirect URIs:
   - Development: `http://localhost:3000/api/auth/callback/google`
   - Production: `https://your-domain.vercel.app/api/auth/callback/google`

### Naver OAuth

```env
NAVER_CLIENT_ID="[발급 필요]"
NAVER_CLIENT_SECRET="[발급 필요]"
```

**발급 방법**:
1. https://developers.naver.com/apps/ 접속
2. "애플리케이션 등록"
3. 애플리케이션 이름: "FactChecker"
4. 사용 API: "네이버 로그인"
5. 로그인 오픈 API 서비스 환경:
   - PC 웹: `http://localhost:3000`
   - Callback URL: `http://localhost:3000/api/auth/callback/naver`

### Kakao OAuth

```env
KAKAO_CLIENT_ID="[발급 필요]"
KAKAO_CLIENT_SECRET="[발급 필요]"
```

**발급 방법**:
1. https://developers.kakao.com/console/app 접속
2. "애플리케이션 추가하기"
3. 앱 이름: "FactChecker"
4. "플랫폼" > "Web" 추가
   - 사이트 도메인: `http://localhost:3000`
5. "카카오 로그인" 활성화
   - Redirect URI: `http://localhost:3000/api/auth/callback/kakao`
6. "보안" 탭에서 Client Secret 생성

---

## 📋 완전한 .env 파일 템플릿

```env
# ============================================================================
# 데이터베이스 (Supabase)
# ============================================================================
DATABASE_URL="postgresql://postgres:[PASSWORD]@[PROJECT-REF].supabase.co:6543/postgres?pgbouncer=true"
DIRECT_URL="postgresql://postgres:[PASSWORD]@[PROJECT-REF].supabase.co:5432/postgres"

# ============================================================================
# NextAuth.js 인증
# ============================================================================
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="[openssl rand -base64 32]"

# ============================================================================
# OAuth 제공자 (선택적)
# ============================================================================
GOOGLE_CLIENT_ID=""
GOOGLE_CLIENT_SECRET=""

NAVER_CLIENT_ID=""
NAVER_CLIENT_SECRET=""

KAKAO_CLIENT_ID=""
KAKAO_CLIENT_SECRET=""

# ============================================================================
# AI API
# ============================================================================
ANTHROPIC_API_KEY="sk-ant-api03-..."

# ============================================================================
# 외부 데이터 소스 API (이미 보유)
# ============================================================================

# Naver Developers API
NAVER_API_CLIENT_ID="3z5rHOP5ImHhFby5iyrK"
NAVER_API_CLIENT_SECRET="_9ZOgyw63A"

# Kakao Developers API
KAKAO_REST_API_KEY="babf8579f7a855f65e9c3bf4d81d717c"
NEXT_PUBLIC_KAKAO_API_KEY="[JavaScript Key 필요]"

# 도서관 정보나루 API
LIBRARY_NARU_API_KEY="87bcb88c26b091d02752cee9355ae48bd2df9c19911958542c253489f1097d92"

# 알라딘 TTB Key (발급 필요)
ALADIN_TTB_KEY=""

# ============================================================================
# 선택적 API (추후 확장 시)
# ============================================================================
RISS_API_KEY=""
PUBMED_API_KEY=""

# ============================================================================
# 기타 설정
# ============================================================================
NODE_ENV="development"
LOG_LEVEL="info"
```

---

## 🚀 Vercel 배포 시 환경 변수

### Vercel Dashboard 설정

1. https://vercel.com/dashboard 접속
2. 프로젝트 선택
3. Settings > Environment Variables
4. 다음 변수들을 추가:

**필수 변수**:
- `DATABASE_URL`
- `DIRECT_URL`
- `NEXTAUTH_URL` (프로덕션 도메인)
- `NEXTAUTH_SECRET`
- `ANTHROPIC_API_KEY`

**이미 보유한 API**:
- `NAVER_API_CLIENT_ID`
- `NAVER_API_CLIENT_SECRET`
- `KAKAO_REST_API_KEY`
- `NEXT_PUBLIC_KAKAO_API_KEY`
- `LIBRARY_NARU_API_KEY`
- `ALADIN_TTB_KEY`

**Environment**: Production, Preview, Development 모두 선택

---

## ✅ 환경 변수 체크리스트

설정 완료 여부를 확인하세요:

### 필수 (MVP 동작에 필요)
- [ ] `DATABASE_URL` (Supabase)
- [ ] `DIRECT_URL` (Supabase)
- [ ] `NEXTAUTH_URL`
- [ ] `NEXTAUTH_SECRET`
- [ ] `ANTHROPIC_API_KEY`
- [ ] `NAVER_API_CLIENT_ID` (이미 보유)
- [ ] `NAVER_API_CLIENT_SECRET` (이미 보유)
- [ ] `KAKAO_REST_API_KEY` (이미 보유)
- [ ] `LIBRARY_NARU_API_KEY` (이미 보유)

### 권장 (전체 기능 사용)
- [ ] `NEXT_PUBLIC_KAKAO_API_KEY` (지도 기능)
- [ ] `ALADIN_TTB_KEY` (도서 표지, 목차)

### 선택적 (로그인 기능)
- [ ] `GOOGLE_CLIENT_ID`
- [ ] `GOOGLE_CLIENT_SECRET`
- [ ] `NAVER_CLIENT_ID` (OAuth용, API와 다름)
- [ ] `NAVER_CLIENT_SECRET` (OAuth용)
- [ ] `KAKAO_CLIENT_ID` (OAuth용)
- [ ] `KAKAO_CLIENT_SECRET` (OAuth용)

---

## 🔒 보안 주의사항

### 절대 하지 말아야 할 것

❌ `.env` 파일을 Git에 커밋
❌ API 키를 코드에 직접 하드코딩
❌ API 키를 클라이언트에서 사용 (서버 전용)
❌ `.env` 파일을 공개 저장소에 업로드
❌ API 키를 Slack, Discord 등에 공유

### 반드시 해야 할 것

✅ `.env` 파일을 `.gitignore`에 포함
✅ 팀원에게 환경 변수는 안전한 방법으로 공유 (1Password, Bitwarden 등)
✅ API 키가 노출되면 즉시 재발급
✅ 프로덕션과 개발 환경의 키 분리
✅ 정기적으로 API 키 갱신

---

## 🧪 환경 변수 검증

다음 스크립트로 환경 변수가 올바르게 설정되었는지 확인할 수 있습니다:

```typescript
// scripts/verify-env.ts
const requiredEnvVars = [
  "DATABASE_URL",
  "DIRECT_URL",
  "NEXTAUTH_URL",
  "NEXTAUTH_SECRET",
  "ANTHROPIC_API_KEY",
  "NAVER_API_CLIENT_ID",
  "NAVER_API_CLIENT_SECRET",
  "KAKAO_REST_API_KEY",
  "LIBRARY_NARU_API_KEY",
];

for (const envVar of requiredEnvVars) {
  if (!process.env[envVar]) {
    console.error(`❌ ${envVar} is not set`);
    process.exit(1);
  }
}

console.log("✅ All required environment variables are set");
```

실행:
```bash
tsx scripts/verify-env.ts
```

---

**작성일**: 2026년 1월 23일  
**버전**: 1.0
