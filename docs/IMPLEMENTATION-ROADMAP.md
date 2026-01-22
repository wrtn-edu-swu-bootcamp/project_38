# FactChecker 구현 로드맵

현실적이고 즉시 실행 가능한 개발 계획

---

## 🎯 전체 전략

### 핵심 철학
1. **먼저 작동하게 만들기** - 보유 리소스로 MVP 빠르게 구현
2. **점진적 개선** - 데이터 소스 단계적 추가
3. **사용자 피드백** - 실제 사용 데이터로 개선

### 3단계 접근법
- **Phase 1 (MVP)**: 보유 API + 즉시 가능한 공개 데이터 (2-4주)
- **Phase 2 (확장)**: 웹 크롤링 + 고급 기능 (1-2개월)
- **Phase 3 (고도화)**: 기관 협력 + AI 고도화 (3-6개월)

---

## 📅 Phase 1: MVP (2-4주)

### 목표
사용자가 텍스트를 입력하면 관련 실물 자료를 찾아주는 기본 기능 구현

### 1주차: 데이터 수집 기능 구축

#### Day 1-2: API 통합
- [x] 알라딘 TTB Key 발급
- [ ] Naver API 통합 (학술정보, 책, 뉴스)
- [ ] 도서관 정보나루 API 통합
- [ ] Kakao 로컬 API 통합

**산출물:**
```javascript
// api/search.js
async function searchAllSources(query) {
  const [papers, books, news] = await Promise.all([
    searchNaverAcademic(query),
    searchNaverBooks(query),
    searchNaverNews(query + ' 팩트체크')
  ]);
  return { papers, books, news };
}
```

#### Day 3-4: 데이터 통합 로직
- [ ] 중복 제거 알고리즘
- [ ] 결과 정규화 (통일된 포맷)
- [ ] 기본 관련성 점수 계산

**산출물:**
```javascript
// utils/normalize.js
function normalizeResults(rawResults) {
  // ISBN, 저자명, 출판연도 등 통일된 포맷으로 변환
  return normalized;
}

function removeDuplicates(results, key) {
  // 제목 유사도 기반 중복 제거
  return unique;
}
```

#### Day 5-7: 도서관 연계
- [ ] ISBN으로 소장 도서관 찾기
- [ ] 사용자 위치 기반 가까운 도서관 정렬
- [ ] 도서관 정보 표시 (주소, 전화번호, 운영시간)

**산출물:**
```javascript
// api/library.js
async function findLibrariesWithBook(isbn, userLocation) {
  // 1. 도서관 정보나루에서 소장 도서관 조회
  const libraries = await searchLibraryNaru(isbn);
  
  // 2. Kakao API로 거리 계산 및 정렬
  const sorted = await sortByDistance(libraries, userLocation);
  
  return sorted;
}
```

### 2주차: 프론트엔드 구축

#### Day 8-10: 기본 UI
- [ ] 검색 입력 폼
- [ ] 결과 표시 화면 (논문, 도서, 뉴스 탭)
- [ ] 도서관 위치 지도 (Kakao 지도 SDK)

**기술 스택:**
- React/Vue.js (프론트엔드)
- Tailwind CSS (스타일링)
- Kakao 지도 API

**화면 구성:**
```
┌─────────────────────────────────────┐
│  FactChecker                         │
├─────────────────────────────────────┤
│  [검색어 입력]          [검색]       │
├─────────────────────────────────────┤
│  📚 학술논문 (5)  📖 도서 (8)  📰 뉴스 (3) │
├─────────────────────────────────────┤
│  • 논문 제목 1                       │
│    저자, 출처, 발행연도              │
│  • 논문 제목 2                       │
│  ...                                 │
└─────────────────────────────────────┘
```

#### Day 11-12: 도서관 상세 페이지
- [ ] 도서 클릭 시 상세 정보 모달
- [ ] 소장 도서관 목록 표시
- [ ] 지도에 도서관 마커 표시
- [ ] 가까운 도서관 하이라이트

#### Day 13-14: 테스트 및 버그 수정
- [ ] 다양한 검색어로 테스트
- [ ] 엣지 케이스 처리 (결과 없음, API 오류 등)
- [ ] 모바일 반응형 확인

### 3-4주차: 신뢰도 평가 시스템 (간단 버전)

#### Week 3: 기본 신뢰도 점수
- [ ] 자료 개수 기반 점수 (많을수록 높음)
- [ ] 출처 신뢰도 (학술논문 > 도서 > 뉴스)
- [ ] 발행 연도 (최근일수록 높음)

**알고리즘:**
```javascript
function calculateCredibilityScore(results) {
  let score = 0;
  
  // 학술논문 1개당 +15점
  score += results.papers.length * 15;
  
  // 도서 1개당 +10점
  score += results.books.length * 10;
  
  // 뉴스 1개당 +5점
  score += results.news.length * 5;
  
  // 최근 자료 보너스
  const recentCount = countRecent(results, 3); // 최근 3년
  score += recentCount * 5;
  
  // 100점 만점으로 정규화
  return Math.min(score, 100);
}
```

#### Week 4: 단계별 판정
- [ ] 점수를 5단계로 변환
- [ ] 각 단계별 설명 문구
- [ ] UI에 시각적 표시 (색상, 아이콘)

**판정 기준:**
```javascript
function getVerificationLevel(score) {
  if (score >= 80) return {
    level: '사실로 확인됨',
    color: 'green',
    icon: '✓',
    description: '다수의 신뢰할 수 있는 자료에서 확인됨'
  };
  else if (score >= 60) return {
    level: '대체로 사실',
    color: 'lightgreen',
    icon: '↗',
    description: '일부 자료에서 확인되나 추가 검증 권장'
  };
  else if (score >= 40) return {
    level: '주의 필요',
    color: 'yellow',
    icon: '⚠',
    description: '확인된 자료가 부족하거나 상반된 의견 존재'
  };
  else if (score >= 20) return {
    level: '근거 부족',
    color: 'orange',
    icon: '?',
    description: '충분한 자료를 찾지 못함'
  };
  else return {
    level: '사실 아님',
    color: 'red',
    icon: '✗',
    description: '다수의 자료에서 반박됨'
  };
}
```

### MVP 완성 체크리스트

- [ ] 검색어 입력 → 자료 검색 작동
- [ ] 학술논문, 도서, 뉴스 결과 표시
- [ ] 도서 클릭 → 소장 도서관 표시
- [ ] 지도에 도서관 위치 표시
- [ ] 신뢰도 점수 및 단계 표시
- [ ] 모바일 반응형 작동
- [ ] 기본 에러 처리

---

## 📅 Phase 2: 확장 (1-2개월)

### 1개월차: 웹 크롤링 추가

#### Week 5-6: Google Scholar 통합
- [ ] Puppeteer/Playwright 설치
- [ ] Google Scholar 크롤링 코드
- [ ] Rate limiting 구현
- [ ] 결과 파싱 및 정규화

**기술 스택:**
```javascript
// scraper/googleScholar.js
const puppeteer = require('puppeteer');

async function scrapeGoogleScholar(query) {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  
  await page.goto(`https://scholar.google.com/scholar?q=${query}`);
  
  const results = await page.evaluate(() => {
    const items = document.querySelectorAll('.gs_ri');
    return Array.from(items).map(item => ({
      title: item.querySelector('.gs_rt').innerText,
      authors: item.querySelector('.gs_a').innerText,
      snippet: item.querySelector('.gs_rs').innerText
    }));
  });
  
  await browser.close();
  return results;
}
```

#### Week 7-8: 추가 소스 통합
- [ ] RISS 웹 크롤링
- [ ] PubMed 웹 접근
- [ ] 국회도서관 검색
- [ ] 결과 통합 및 중복 제거

### 2개월차: 고급 기능

#### Week 9-10: 내용 관련성 분석
- [ ] 텍스트 임베딩 모델 (Sentence Transformers)
- [ ] 입력 텍스트와 자료 내용 유사도 계산
- [ ] 관련성 높은 자료만 필터링

**기술:**
```python
# analyzer/relevance.py
from sentence_transformers import SentenceTransformer

model = SentenceTransformer('distiluse-base-multilingual-cased-v2')

def calculate_relevance(input_text, document_text):
    # 임베딩 생성
    embedding1 = model.encode(input_text)
    embedding2 = model.encode(document_text)
    
    # 코사인 유사도 계산
    similarity = cosine_similarity([embedding1], [embedding2])[0][0]
    
    return similarity

# 0.5 이상만 표시
relevant_docs = [doc for doc in docs if calculate_relevance(query, doc.text) > 0.5]
```

#### Week 11-12: URL/이미지 입력
- [ ] URL에서 텍스트 추출 (Puppeteer)
- [ ] 이미지 OCR (Tesseract.js)
- [ ] 추출된 텍스트로 검색

### Phase 2 완성 체크리스트

- [ ] Google Scholar 결과 추가
- [ ] RISS, PubMed 결과 추가
- [ ] 내용 관련성 분석 작동
- [ ] URL 입력 지원
- [ ] 이미지 입력 지원 (OCR)
- [ ] 검색 속도 최적화 (캐싱)

---

## 📅 Phase 3: 고도화 (3-6개월)

### 3-4개월차: 기관 협력

#### 공식 API 확보
- [ ] 대학 도서관 협력 (학생 신분으로 RISS API 등)
- [ ] 지역 공공도서관 협력
- [ ] 교육 기관 MOU

#### 자체 데이터베이스 구축
- [ ] 자주 검색되는 주제 DB 구축
- [ ] 팩트체크 이력 저장
- [ ] 커뮤니티 검증 시스템

### 5-6개월차: AI 고도화

#### 고급 NLP
- [ ] 주장 분석 (Claim Detection)
- [ ] 논리적 타당성 분석
- [ ] 자동 요약 생성

#### 실시간 업데이트
- [ ] 새로운 자료 자동 수집
- [ ] 알림 시스템
- [ ] 시간에 따른 신뢰도 변화 추적

---

## 🛠️ 기술 스택 정리

### 백엔드
- **언어**: Node.js (JavaScript/TypeScript) 또는 Python
- **프레임워크**: Express.js (Node) 또는 FastAPI (Python)
- **데이터베이스**: PostgreSQL (구조화 데이터) + MongoDB (비구조화)
- **캐싱**: Redis

### 프론트엔드
- **프레임워크**: React 또는 Vue.js
- **스타일링**: Tailwind CSS
- **지도**: Kakao 지도 SDK
- **상태 관리**: Redux/Vuex

### 데이터 수집
- **API 클라이언트**: Axios, node-fetch
- **웹 크롤링**: Puppeteer, Playwright
- **OCR**: Tesseract.js
- **스크래핑**: BeautifulSoup (Python), Cheerio (Node)

### AI/ML
- **임베딩**: Sentence Transformers
- **NLP**: spaCy, KoNLPy (한국어)
- **유사도 계산**: scikit-learn

### 인프라
- **호스팅**: Vercel (프론트), Railway/Fly.io (백엔드)
- **CI/CD**: GitHub Actions
- **모니터링**: Sentry

---

## 💰 예상 비용 (MVP 기준)

### 무료 리소스
- ✅ Naver API: 무료 (일 25,000건)
- ✅ 도서관 정보나루: 무료
- ✅ Kakao API: 무료 (일 10,000건)
- ✅ 알라딘 TTB: 무료
- ✅ Google Scholar: 무료 (크롤링)
- ✅ PubMed: 무료

### 유료 서비스 (선택)
- 호스팅: $0-20/월 (무료 티어 가능)
- 도메인: $10-15/년
- AI 모델 서버: $0-50/월 (무료 티어 가능)

**총 예상 비용**: MVP는 거의 무료! 확장 시에도 월 $20-50 이내

---

## 📊 성공 지표 (KPI)

### MVP 단계
- 검색 성공률: 80% 이상
- 평균 응답 시간: 3초 이내
- 사용자당 검색 횟수: 5회 이상
- 도서관 연계 클릭률: 20% 이상

### 확장 단계
- 자료 커버리지: 95% 이상
- 관련성 정확도: 85% 이상
- 재방문율: 40% 이상
- 도서관 방문 전환율: 5% 이상

---

## 🎯 즉시 시작 가이드

### 오늘 할 일 (2시간)

1. **개발 환경 설정** (30분)
```bash
# 프로젝트 초기화
mkdir factchecker-app
cd factchecker-app
npm init -y

# 필요한 패키지 설치
npm install express axios dotenv cors
npm install -D nodemon

# 프론트엔드 (선택적)
npx create-react-app client
```

2. **알라딘 TTB Key 발급** (5분)
- https://www.aladin.co.kr/ttb/wblog_main.aspx
- `.env`에 추가

3. **첫 번째 API 통합** (1시간)
```javascript
// server.js
require('dotenv').config();
const express = require('express');
const axios = require('axios');

const app = express();

// Naver 학술정보 검색
app.get('/api/search/academic', async (req, res) => {
  const { query } = req.query;
  
  try {
    const response = await axios.get(
      `https://openapi.naver.com/v1/search/doc.json?query=${query}`,
      {
        headers: {
          'X-Naver-Client-Id': process.env.NAVER_CLIENT_ID,
          'X-Naver-Client-Secret': process.env.NAVER_CLIENT_SECRET
        }
      }
    );
    
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(3000, () => {
  console.log('Server running on http://localhost:3000');
});
```

4. **테스트** (25분)
```bash
# 서버 실행
npm start

# 브라우저에서 테스트
# http://localhost:3000/api/search/academic?query=비타민
```

---

**문서 버전**: 1.0  
**작성일**: 2026년 1월  
**최종 수정일**: 2026년 1월

> 💡 **핵심**: 작은 것부터 시작하되, 완성도 있게! MVP는 2-4주 안에 완성 가능합니다.
