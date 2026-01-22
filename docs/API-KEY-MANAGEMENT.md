# API 키 관리 가이드

이 문서는 FactChecker 프로젝트의 API 키를 안전하게 관리하는 방법을 설명합니다.

---

## 📁 파일 구조

```
project/
├── .env                          # 실제 API 키 (Git 제외) ⚠️
├── .env.example                  # API 키 템플릿 (Git 포함)
├── .gitignore                    # Git 제외 파일 목록
└── docs/
    ├── api-credentials.md        # API 키 상세 정보 (Git 제외) ⚠️
    ├── api-registration-guide.md # API 신청 방법
    └── API-KEY-MANAGEMENT.md     # 이 문서
```

### ⚠️ Git 커밋 금지 파일
- `.env` - 실제 API 키
- `docs/api-credentials.md` - API 키 상세 정보

### ✅ Git 커밋 가능 파일
- `.env.example` - 템플릿 (키 값 없음)
- `.gitignore` - Git 제외 설정
- `docs/api-registration-guide.md` - 신청 가이드
- `docs/API-KEY-MANAGEMENT.md` - 이 문서

---

## 🔄 API 키 업데이트 워크플로우

### 1단계: API 신청 및 승인 대기

`api-registration-guide.md` 파일을 참고하여 필요한 API를 신청하세요.

**우선순위:**
1. ✅ PubMed (즉시)
2. ✅ Crossref (키 불필요)
3. ⏰ RISS (1-2일)
4. ⏰ 빅카인즈 (1-3일)
5. ⏰ 공공데이터포털 APIs (즉시~3일)

### 2단계: API 키 받으면 즉시 등록

승인 이메일을 받거나 사이트에서 키를 확인하면:

#### A. `docs/api-credentials.md` 업데이트

1. 파일 열기: `docs/api-credentials.md`
2. 해당 API 섹션 찾기 (예: 4.1 RISS)
3. `[신청 후 여기에 입력]` 부분을 실제 키로 교체

**예시:**
```markdown
# 변경 전
인증키: [신청 후 여기에 입력]

# 변경 후  
인증키: abc123def456ghi789jkl
```

#### B. `.env` 파일 업데이트

1. 프로젝트 루트의 `.env` 파일 열기
2. 해당 변수 찾기 (예: `RISS_API_KEY=`)
3. 등호 뒤에 실제 키 입력 (공백 없이)

**예시:**
```env
# 변경 전
RISS_API_KEY=

# 변경 후
RISS_API_KEY=abc123def456ghi789jkl
```

### 3단계: 테스트

API 키가 정상 작동하는지 확인:

```bash
# 예시: RISS API 테스트
curl "http://www.riss.kr/search/openapi/search?apikey=YOUR_KEY&query=테스트&display=1"
```

성공 응답을 받으면 ✅ 완료!

---

## 🚀 빠른 설정 가이드

### 처음 프로젝트를 시작하는 경우

#### 방법 1: .env.example 복사 (권장)

```bash
# PowerShell
Copy-Item .env.example .env

# 또는 탐색기에서
# .env.example 파일을 복사해서 이름을 .env로 변경
```

그 다음 `.env` 파일을 열어서 이미 보유한 키들이 제대로 들어가 있는지 확인:
- ✅ LIBRARY_NARUINFO_KEY
- ✅ KAKAO_REST_API_KEY
- ✅ NAVER_CLIENT_ID
- ✅ NAVER_CLIENT_SECRET

나머지 빈 키들은 신청 후 받으면 입력합니다.

#### 방법 2: 직접 생성

이미 `.env` 파일이 생성되어 있으므로 바로 사용 가능합니다!

### 다른 개발자와 협업하는 경우

1. **절대 `.env` 파일을 공유하지 마세요!**
2. `.env.example` 파일만 Git에 포함
3. 각자 자신의 `.env` 파일 생성
4. API 키는 안전한 방법으로 별도 전달 (암호화된 메신저 등)

---

## 📋 API 키 상태 체크리스트

프로젝트 진행 상황에 따라 체크:

### 현재 보유 중 ✅
- [x] 도서관 정보나루 API
- [x] Kakao 로컬/지도 API
- [x] Naver 학술정보 검색 API

### 신청 필요 (필수 ⭐)
- [ ] RISS API (국내 학술논문) - **즉시 신청 권장**
- [ ] 빅카인즈 API (뉴스 검색) - **즉시 신청 권장**
- [ ] PubMed API (의학 논문) - **오늘 신청 가능**
- [ ] 공공데이터포털 APIs:
  - [ ] 통계청
  - [ ] 식약처
  - [ ] 질병관리청
  - [ ] 국립중앙도서관

### 신청 선택 (나중에)
- [ ] NDSL API (과학기술 분야)
- [ ] Crossref (키 불필요)
- [ ] DBpia (유료, 협의 필요)

---

## 🛠️ 개발 시 사용법

### Node.js/JavaScript 예시

```javascript
// .env 파일 로드 (dotenv 패키지 사용)
require('dotenv').config();

// API 키 사용
const libraryApiKey = process.env.LIBRARY_NARUINFO_KEY;
const kakaoApiKey = process.env.KAKAO_REST_API_KEY;
const naverClientId = process.env.NAVER_CLIENT_ID;
const naverClientSecret = process.env.NAVER_CLIENT_SECRET;

console.log('API 키 로드 완료');
```

### Python 예시

```python
# .env 파일 로드 (python-dotenv 패키지 사용)
from dotenv import load_dotenv
import os

load_dotenv()

# API 키 사용
library_api_key = os.getenv('LIBRARY_NARUINFO_KEY')
kakao_api_key = os.getenv('KAKAO_REST_API_KEY')
naver_client_id = os.getenv('NAVER_CLIENT_ID')
naver_client_secret = os.getenv('NAVER_CLIENT_SECRET')

print('API 키 로드 완료')
```

---

## ⚠️ 보안 주의사항

### 절대 하지 말아야 할 것

❌ `.env` 파일을 Git에 커밋  
❌ `api-credentials.md` 파일을 Git에 커밋  
❌ API 키를 소스코드에 하드코딩  
❌ API 키를 스크린샷으로 공유  
❌ API 키를 평문 메시지로 전송  

### 반드시 해야 할 것

✅ `.gitignore`에 민감한 파일 추가 (이미 완료)  
✅ API 키는 환경 변수로 관리  
✅ 정기적으로 키 갱신 (3-6개월)  
✅ 사용하지 않는 키는 비활성화  
✅ 키가 노출되면 즉시 재발급  

---

## 🔍 .gitignore 확인

현재 `.gitignore` 파일에 다음이 포함되어 있는지 확인:

```gitignore
# API 인증 정보 (절대 커밋 금지)
docs/api-credentials.md
.env
.env.local
.env.*.local
```

✅ 확인 완료: 이미 설정되어 있습니다!

---

## 📊 API 키 현황 대시보드

| API | 상태 | 우선순위 | 승인 시간 | 비용 |
|-----|------|---------|----------|------|
| 도서관 정보나루 | ✅ 보유 | 필수 | - | 무료 |
| Kakao | ✅ 보유 | 필수 | - | 무료 |
| Naver | ✅ 보유 | 필수 | - | 무료 |
| RISS | ⏳ 신청 필요 | 필수 | 1-2일 | 무료 |
| 빅카인즈 | ⏳ 신청 필요 | 필수 | 1-3일 | 무료 |
| PubMed | ⏳ 신청 필요 | 필수 | 즉시 | 무료 |
| 공공데이터 | ⏳ 신청 필요 | 필수 | 즉시~3일 | 무료 |
| 국립중앙도서관 | ⏳ 신청 필요 | 필수 | 즉시~3일 | 무료 |
| NDSL | 🔘 선택 | 선택 | 1-3일 | 무료 |
| Crossref | ✅ 키 불필요 | 선택 | - | 무료 |
| DBpia | 💰 유료 | 선택 | 협의 | 유료 |

---

## 📝 다음 할 일

### 오늘 바로 (5-10분)
1. [ ] PubMed 계정 만들기 → API 키 발급
2. [ ] Crossref API 테스트 (키 불필요)

### 이번 주 내 (1-3일 소요)
3. [ ] RISS API 신청
4. [ ] 빅카인즈 API 신청
5. [ ] 공공데이터포털 회원가입
6. [ ] 공공데이터포털에서 필요한 API들 개별 신청:
   - [ ] 통계청
   - [ ] 식약처
   - [ ] 질병관리청
   - [ ] 국립중앙도서관

### 필요시
7. [ ] NDSL API 신청 (과학기술 분야)
8. [ ] DBpia 상담 (유료지만 원문 필요 시)

---

## 🎯 신청 완료 후 해야 할 일

각 API 키를 받으면:

1. ✅ `docs/api-credentials.md` 파일 업데이트
2. ✅ `.env` 파일에 키 입력
3. ✅ 테스트 요청으로 정상 작동 확인
4. ✅ 체크리스트에 완료 표시

---

## 💡 유용한 팁

### 여러 환경 관리

개발/스테이징/프로덕션 환경이 다르면:

```
.env.development   # 개발 환경
.env.staging       # 스테이징 환경  
.env.production    # 프로덕션 환경
```

모두 `.gitignore`에 포함되어 있습니다!

### API 키 테스트 스크립트

모든 키가 정상 작동하는지 한 번에 확인:

```bash
# test-apis.sh (추후 작성 예정)
# 각 API에 테스트 요청을 보내고 응답 확인
```

### 키 만료 알림

중요한 API는 캘린더에 갱신 일정 등록:
- 3개월 후: API 키 상태 점검
- 6개월 후: 키 갱신 고려

---

**문서 버전**: 1.0  
**작성일**: 2026년 1월  
**최종 수정일**: 2026년 1월

> 💡 **빠른 시작**: `.env` 파일이 이미 생성되어 있고 보유한 키들이 입력되어 있습니다. 추가 API를 신청 받으면 해당 줄에 키만 입력하면 됩니다!
