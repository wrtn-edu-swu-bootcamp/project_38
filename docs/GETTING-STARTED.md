# FactChecker 개발 시작 가이드

프로젝트를 로컬에서 실행하고 개발을 시작하는 방법

---

## 📋 사전 요구사항

### 필수 설치 항목

1. **Node.js 20 이상**
   ```bash
   node --version  # v20.0.0 이상
   ```
   다운로드: https://nodejs.org/

2. **npm 10 이상**
   ```bash
   npm --version  # v10.0.0 이상
   ```

3. **Git**
   ```bash
   git --version
   ```

### 필요한 계정

1. **Supabase** (무료)
   - https://supabase.com/
   - PostgreSQL 데이터베이스 호스팅

2. **Anthropic** (유료)
   - https://console.anthropic.com/
   - Claude API 키 발급
   - 팩트체크 AI 분석용

3. **Vercel** (무료)
   - https://vercel.com/
   - 프로덕션 배포용

---

## 🚀 빠른 시작 (5분)

### 1단계: 저장소 클론

```bash
git clone https://github.com/your-org/factchecker.git
cd factchecker
```

### 2단계: 의존성 설치

```bash
npm install
```

### 3단계: 환경 변수 설정

`.env` 파일을 프로젝트 루트에 생성하고 다음 내용을 입력하세요:

```env
# 최소 필수 환경 변수
DATABASE_URL="your-supabase-database-url"
DIRECT_URL="your-supabase-direct-url"

NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="random-secret-key-here"

ANTHROPIC_API_KEY="your-anthropic-api-key"

# 이미 보유한 API 키
NAVER_API_CLIENT_ID="3z5rHOP5ImHhFby5iyrK"
NAVER_API_CLIENT_SECRET="_9ZOgyw63A"

KAKAO_REST_API_KEY="babf8579f7a855f65e9c3bf4d81d717c"
NEXT_PUBLIC_KAKAO_API_KEY="your-kakao-javascript-key"

LIBRARY_NARU_API_KEY="87bcb88c26b091d02752cee9355ae48bd2df9c19911958542c253489f1097d92"
```

전체 환경 변수 목록은 [code-architecture.md](code-architecture.md#7-환경-변수)를 참조하세요.

### 4단계: 데이터베이스 설정

```bash
# Prisma 클라이언트 생성
npx prisma generate

# 데이터베이스 스키마 푸시
npx prisma db push

# (선택) Prisma Studio로 데이터베이스 확인
npx prisma studio
```

### 5단계: 개발 서버 실행

```bash
npm run dev
```

브라우저에서 http://localhost:3000 접속

---

## 🔧 상세 설정 가이드

### Supabase PostgreSQL 설정

1. **Supabase 프로젝트 생성**
   - https://supabase.com/dashboard 접속
   - "New Project" 클릭
   - 프로젝트 이름: `factchecker`
   - 데이터베이스 비밀번호 설정
   - 리전: `Northeast Asia (Seoul)` 선택

2. **Connection String 가져오기**
   - Dashboard > Settings > Database
   - Connection String 섹션에서:
     - `Transaction Pooler`: `DATABASE_URL`로 사용
     - `Direct Connection`: `DIRECT_URL`로 사용

3. **연결 테스트**
   ```bash
   npx prisma db push
   ```
   성공하면 "Database schema synchronized" 메시지 표시

### NextAuth 설정

1. **시크릿 키 생성**
   ```bash
   # OpenSSL 사용 (Mac/Linux)
   openssl rand -base64 32

   # Node.js 사용 (모든 OS)
   node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
   ```

2. **OAuth 제공자 설정 (선택적)**
   
   **Google OAuth**:
   - https://console.cloud.google.com/apis/credentials
   - "Create Credentials" > "OAuth client ID"
   - Authorized redirect URIs: `http://localhost:3000/api/auth/callback/google`
   
   **Naver OAuth**:
   - https://developers.naver.com/apps/
   - 애플리케이션 등록
   - Callback URL: `http://localhost:3000/api/auth/callback/naver`
   
   **Kakao OAuth**:
   - https://developers.kakao.com/console/app
   - 앱 생성
   - Redirect URI: `http://localhost:3000/api/auth/callback/kakao`

### Anthropic API 키 발급

1. https://console.anthropic.com/ 접속
2. "API Keys" 메뉴
3. "Create Key" 클릭
4. `.env`에 `ANTHROPIC_API_KEY` 설정

### 알라딘 TTB Key 발급 (5분)

1. https://www.aladin.co.kr/ 회원가입
2. https://www.aladin.co.kr/ttb/wblog_main.aspx 접속
3. "TTB 인증키 발급" 클릭 (즉시 발급)
4. `.env`에 `ALADIN_TTB_KEY` 설정

---

## 📁 프로젝트 구조 이해하기

```
factchecker/
├── src/
│   ├── app/              # Next.js 16 App Router (페이지 및 라우트)
│   ├── components/       # React 컴포넌트
│   ├── server/          # 서버 사이드 로직 (tRPC, 서비스)
│   ├── lib/             # 유틸리티 및 설정
│   ├── hooks/           # Custom React Hooks
│   └── types/           # TypeScript 타입 정의
├── prisma/
│   └── schema.prisma    # 데이터베이스 스키마
├── public/              # 정적 파일
└── docs/                # 문서
```

상세한 구조는 [code-architecture.md](code-architecture.md#3-프로젝트-구조)를 참조하세요.

---

## 🛠️ 개발 명령어

### 개발 서버

```bash
npm run dev
```
- 개발 서버 실행 (http://localhost:3000)
- Hot Module Replacement 활성화
- 코드 변경 시 자동 새로고침

### 빌드

```bash
npm run build
```
- 프로덕션 빌드 생성
- 타입 체크 및 최적화
- `.next` 폴더에 빌드 결과 저장

### 프로덕션 서버 (로컬)

```bash
npm run start
```
- 빌드된 앱을 프로덕션 모드로 실행
- 빌드 후에만 실행 가능

### 타입 체크

```bash
npm run type-check
```
- TypeScript 타입 오류 확인
- 빌드 없이 타입만 검사

### 린트

```bash
npm run lint
```
- ESLint로 코드 품질 검사
- 자동 수정: `npm run lint -- --fix`

### Prisma

```bash
# 클라이언트 생성
npm run prisma:generate

# 스키마 푸시 (개발용)
npm run prisma:push

# 마이그레이션 (프로덕션용)
npm run prisma:migrate

# Prisma Studio (데이터베이스 GUI)
npm run prisma:studio
```

---

## 🧪 기능 테스트

### 팩트체크 기능 테스트

1. 개발 서버 실행: `npm run dev`
2. http://localhost:3000/verify 접속
3. 텍스트 입력 탭에서 테스트:
   ```
   비타민 C를 매일 1000mg씩 먹으면 감기를 완전히 예방할 수 있다
   ```
4. "팩트체크 시작하기" 클릭
5. 결과 화면에서 신뢰도 점수 및 참고자료 확인

### API 연동 테스트

```bash
# Naver API 테스트
curl -X GET "https://openapi.naver.com/v1/search/book.json?query=비타민" \
  -H "X-Naver-Client-Id: 3z5rHOP5ImHhFby5iyrK" \
  -H "X-Naver-Client-Secret: _9ZOgyw63A"

# 도서관 정보나루 API 테스트
curl "https://www.nl.go.kr/NL/search/openApi/search.do?key=87bcb88c26b091d02752cee9355ae48bd2df9c19911958542c253489f1097d92&apiType=json&srchTarget=total&kwd=건강"
```

---

## 🐛 문제 해결

### 데이터베이스 연결 오류

```
Error: Can't reach database server at ...
```

**해결 방법**:
1. Supabase 프로젝트가 실행 중인지 확인
2. `DATABASE_URL`과 `DIRECT_URL`이 올바른지 확인
3. 네트워크 연결 확인
4. Supabase Dashboard에서 프로젝트 상태 확인

### Prisma 클라이언트 오류

```
Error: @prisma/client did not initialize yet
```

**해결 방법**:
```bash
npx prisma generate
```

### Next.js 빌드 오류

```
Type error: Cannot find module '@/...'
```

**해결 방법**:
1. `tsconfig.json`의 paths 설정 확인
2. VSCode 재시작
3. `node_modules` 삭제 후 재설치:
   ```bash
   rm -rf node_modules
   npm install
   ```

### 포트 이미 사용 중

```
Error: listen EADDRINUSE: address already in use :::3000
```

**해결 방법**:
```bash
# 다른 포트 사용
PORT=3001 npm run dev

# 또는 3000 포트 사용 중인 프로세스 종료 (Mac/Linux)
lsof -ti:3000 | xargs kill

# Windows
netstat -ano | findstr :3000
taskkill /PID [PID번호] /F
```

---

## 📚 추가 학습 자료

### 공식 문서

- **Next.js**: https://nextjs.org/docs
- **React**: https://react.dev/
- **TypeScript**: https://www.typescriptlang.org/docs/
- **Tailwind CSS**: https://tailwindcss.com/docs
- **tRPC**: https://trpc.io/docs
- **Prisma**: https://www.prisma.io/docs
- **NextAuth.js**: https://next-auth.js.org/

### 프로젝트 문서

- [코드 아키텍처](code-architecture.md) - 전체 기술 구조
- [서비스 기획안](proposal.md) - 서비스 목적 및 기능
- [디자인 가이드](design-guide.md) - UI/UX 가이드라인
- [와이어프레임](wireframes.md) - 화면 설계
- [데이터 소스 전략](data-source-strategy.md) - API 활용 계획

---

## 🤝 기여 방법

1. 이슈 확인 또는 생성
2. 브랜치 생성: `git checkout -b feature/기능명`
3. 코드 작성 및 커밋
4. Pull Request 생성
5. 코드 리뷰 및 머지

---

## 📞 문의

- 프로젝트 문의: GitHub Issues
- 기술 문의: Discussion

---

**작성일**: 2026년 1월 23일  
**버전**: 1.0
