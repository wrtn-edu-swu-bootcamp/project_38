# FactChecker 기여 가이드

FactChecker 프로젝트에 기여하는 방법

---

## 🤝 기여 방법

### 1. 이슈 확인

- [GitHub Issues](https://github.com/your-org/factchecker/issues)에서 작업할 이슈 찾기
- 또는 새로운 이슈 생성

### 2. 저장소 포크

```bash
# 1. GitHub에서 Fork 버튼 클릭
# 2. 포크한 저장소 클론
git clone https://github.com/YOUR-USERNAME/factchecker.git
cd factchecker

# 3. 원본 저장소를 upstream으로 추가
git remote add upstream https://github.com/original-org/factchecker.git
```

### 3. 브랜치 생성

```bash
# develop 브랜치에서 시작
git checkout develop

# 기능 브랜치 생성
git checkout -b feature/기능명

# 또는 버그 수정
git checkout -b fix/버그명
```

**브랜치 명명 규칙**:
- `feature/팩트체크-입력폼`: 새 기능
- `fix/신뢰도-계산-오류`: 버그 수정
- `docs/API-문서-추가`: 문서 업데이트
- `refactor/데이터베이스-쿼리`: 리팩토링

### 4. 코드 작성

```bash
# 의존성 설치
npm install

# 개발 서버 실행
npm run dev

# 코드 작성 및 테스트
```

### 5. 커밋

```bash
git add .
git commit -m "feat: 팩트체크 입력 폼 구현"
```

**커밋 메시지 규칙**:
- `feat`: 새로운 기능
- `fix`: 버그 수정
- `docs`: 문서 업데이트
- `style`: 코드 포맷팅
- `refactor`: 리팩토링
- `test`: 테스트 추가
- `chore`: 빌드, 설정 변경

### 6. Pull Request

```bash
# 원격 저장소에 푸시
git push origin feature/기능명
```

GitHub에서:
1. "Compare & pull request" 클릭
2. PR 제목과 설명 작성
3. 리뷰어 지정
4. "Create pull request" 클릭

---

## ✅ PR 체크리스트

PR 생성 전 다음을 확인하세요:

### 코드 품질
- [ ] `npm run lint` 통과
- [ ] `npm run type-check` 통과
- [ ] `npm run build` 성공
- [ ] 로컬에서 테스트 완료

### 코드 스타일
- [ ] Prettier 포맷팅 적용
- [ ] 일관된 명명 규칙
- [ ] 주석 추가 (복잡한 로직)
- [ ] 불필요한 콘솔 로그 제거

### 문서
- [ ] README 업데이트 (필요시)
- [ ] 코드 주석 추가
- [ ] 타입 정의 추가

### 보안
- [ ] API 키 노출 없음
- [ ] 민감한 정보 제거
- [ ] 입력 검증 추가

---

## 📝 코드 스타일 가이드

### TypeScript

```typescript
// ✅ 좋은 예
interface FactCheckProps {
  id: string;
  content: string;
  trustScore: number;
}

export function FactCheckCard({ id, content, trustScore }: FactCheckProps) {
  return <div>...</div>;
}

// ❌ 나쁜 예
export function FactCheckCard(props: any) {
  return <div>...</div>;
}
```

### React 컴포넌트

```typescript
// ✅ 좋은 예 - 서버 컴포넌트 (기본)
export default async function Page() {
  const data = await getData();
  return <div>{data}</div>;
}

// ✅ 좋은 예 - 클라이언트 컴포넌트 (필요시)
"use client";

export function InteractiveButton() {
  const [count, setCount] = useState(0);
  return <button onClick={() => setCount(count + 1)}>{count}</button>;
}

// ❌ 나쁜 예 - 불필요한 클라이언트 컴포넌트
"use client";

export function StaticText() {
  return <p>정적 텍스트</p>; // 서버 컴포넌트로 충분
}
```

### tRPC 프로시저

```typescript
// ✅ 좋은 예
export const factCheckRouter = createTRPCRouter({
  create: publicProcedure
    .input(
      z.object({
        content: z.string().min(10),
      })
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.db.factCheck.create({
        data: { ...input },
      });
    }),
});

// ❌ 나쁜 예 - 입력 검증 없음
export const factCheckRouter = createTRPCRouter({
  create: publicProcedure
    .mutation(async ({ ctx, input }) => {
      return ctx.db.factCheck.create({
        data: input, // 검증 없이 바로 사용
      });
    }),
});
```

### Prisma 쿼리

```typescript
// ✅ 좋은 예 - N+1 방지
const factChecks = await db.factCheck.findMany({
  include: {
    references: true,
  },
});

// ❌ 나쁜 예 - N+1 쿼리
const factChecks = await db.factCheck.findMany();
for (const fc of factChecks) {
  fc.references = await db.reference.findMany({
    where: { factCheckId: fc.id },
  });
}
```

---

## 🧪 테스트 가이드

### 수동 테스트

1. **기능 테스트**
   - 팩트체크 생성
   - 결과 확인
   - 도서관 검색

2. **다양한 환경**
   - 크롬, 파이어폭스, 사파리
   - 데스크톱, 태블릿, 모바일

3. **엣지 케이스**
   - 빈 입력
   - 매우 긴 텍스트
   - 잘못된 URL
   - 손상된 이미지

### 자동 테스트 (추후 추가)

```bash
# 유닛 테스트
npm run test

# E2E 테스트
npm run test:e2e

# 커버리지
npm run test:coverage
```

---

## 🎨 디자인 가이드라인

### Tailwind CSS 사용

```typescript
// ✅ 좋은 예 - Tailwind 클래스 사용
<div className="bg-white rounded-lg shadow-sm p-6">
  <h2 className="text-2xl font-semibold text-gray-900 mb-4">제목</h2>
  <p className="text-gray-600">내용</p>
</div>

// ❌ 나쁜 예 - 인라인 스타일
<div style={{ background: 'white', padding: '24px' }}>
  <h2 style={{ fontSize: '24px' }}>제목</h2>
</div>
```

### 디자인 시스템 준수

- [디자인 가이드](docs/design-guide.md) 참조
- 색상: Primary Blue (#3B82F6)
- 폰트: Pretendard (한글), Inter (영문)
- 간격: 8px 기준 시스템

---

## 🔍 코드 리뷰 기준

### 리뷰어 체크리스트

- [ ] 코드가 요구사항을 충족하는가?
- [ ] 타입 안정성이 보장되는가?
- [ ] 에러 핸들링이 적절한가?
- [ ] 성능 이슈는 없는가?
- [ ] 보안 취약점은 없는가?
- [ ] 테스트가 충분한가?
- [ ] 문서화가 되어 있는가?

### 일반적인 피드백

**좋은 피드백**:
```
"이 부분에서 타입을 명시하면 더 안전할 것 같습니다:
`const result: FactCheckResult = ...`"
```

**건설적인 피드백**:
```
"현재 구현도 동작하지만, Prisma의 include를 사용하면
N+1 쿼리를 방지할 수 있습니다. 예시: ..."
```

---

## 🐛 버그 리포트

### 이슈 템플릿

```markdown
## 버그 설명
간단하고 명확하게 버그를 설명하세요.

## 재현 방법
1. '...' 페이지로 이동
2. '...' 클릭
3. '...' 입력
4. 에러 발생

## 예상 동작
어떻게 동작해야 하는지 설명하세요.

## 실제 동작
실제로 어떻게 동작하는지 설명하세요.

## 스크린샷
가능하면 스크린샷을 첨부하세요.

## 환경
- OS: [예: Windows 11]
- 브라우저: [예: Chrome 120]
- Next.js 버전: [예: 16.1.4]

## 추가 정보
기타 관련 정보를 추가하세요.
```

---

## 💡 기능 제안

### 이슈 템플릿

```markdown
## 기능 설명
어떤 기능을 추가하고 싶으신가요?

## 동기
왜 이 기능이 필요한가요?

## 제안 해결책
어떻게 구현하면 좋을지 설명하세요.

## 대안
다른 접근 방법이 있다면 설명하세요.

## 우선순위
- [ ] Critical (필수)
- [ ] High (중요)
- [ ] Medium (보통)
- [ ] Low (낮음)
```

---

## 📞 커뮤니케이션

### 채널

- **이슈**: 버그 리포트, 기능 제안
- **Discussion**: 질문, 아이디어 논의
- **PR**: 코드 리뷰, 기술적 논의

### 응답 시간

- **긴급 이슈**: 24시간 내
- **일반 이슈**: 3일 내
- **PR 리뷰**: 2일 내

---

## 🎯 우선순위 라벨

- `priority: critical` - 즉시 수정 필요
- `priority: high` - 다음 릴리스
- `priority: medium` - 곧 처리
- `priority: low` - 나중에

- `type: bug` - 버그 수정
- `type: feature` - 새 기능
- `type: docs` - 문서
- `type: refactor` - 리팩토링

- `good first issue` - 초보자 환영
- `help wanted` - 도움 필요

---

## ✨ 감사합니다!

FactChecker 프로젝트에 기여해주셔서 감사합니다. 여러분의 기여가 더 나은 정보 검증 문화를 만듭니다.

---

**작성일**: 2026년 1월 23일  
**버전**: 1.0
