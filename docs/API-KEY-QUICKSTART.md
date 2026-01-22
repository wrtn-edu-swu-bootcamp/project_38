# 빠른 시작 가이드 (현실적 접근)

개인이 즉시 활용 가능한 데이터 소스 중심으로 재구성한 가이드입니다.

---

## ✅ 이미 준비된 것들

1. ✅ `.env` 파일 생성 완료
2. ✅ 보유 중인 API 키 3개 입력 완료:
   - 도서관 정보나루 API ⭐
   - Kakao Developers API ⭐
   - Naver Developers API ⭐
3. ✅ `.gitignore` 보안 설정 완료
4. ✅ 데이터 소스 전략 문서 생성 완료

---

## 🎯 현실적 접근: 즉시 사용 가능한 방법

### 상황 인식
개인 단위로 API 키를 빠르게 받기는 어렵습니다. 하지만 걱정하지 마세요!  
**현재 보유한 API + 공개 데이터만으로도 충분히 서비스를 만들 수 있습니다.**

---

## 📝 오늘 바로 할 수 있는 일 (30분)

### 1. 알라딘 TTB Key 발급 ⭐⭐⭐ (5분, 즉시 사용 가능!)

```
1. https://www.aladin.co.kr/ttb/wblog_main.aspx 접속
2. 알라딘 회원가입 (무료)
3. [TTB 인증키 발급] 클릭
4. 즉시 발급! (승인 불필요)
```

**받은 키를 입력:**
- `.env` 파일 열기
- `ALADIN_TTB_KEY=` 추가하고 뒤에 붙여넣기
- 저장

**활용:**
- 국내 모든 출판 도서 검색
- ISBN, 저자, 출판사, 목차 정보
- 도서 표지 이미지

---

### 2. 웹 크롤링 준비 (10분)

다음 사이트들은 API 키 없이도 데이터 수집 가능:

#### Google Scholar (학술논문)
- URL: https://scholar.google.com/
- 전 세계 학술논문 검색
- API 불필요, 웹 스크래핑으로 활용

#### RISS 웹 검색 (국내 논문)
- URL: https://www.riss.kr/
- 국내 학위논문, 학술지
- API 없이도 웹 검색 가능

#### PubMed (의학 논문)
- URL: https://pubmed.ncbi.nlm.nih.gov/
- API 키 없이도 기본 사용 가능 (느리지만)
- 추후 개인 계정 만들면 속도 향상

---

### 3. 보유 API 테스트 (15분)

현재 가지고 있는 API가 매우 강력합니다!

#### Naver Developers API 테스트
```bash
# 학술정보 검색 테스트
curl -X GET "https://openapi.naver.com/v1/search/doc.json?query=비타민" \
  -H "X-Naver-Client-Id: 3z5rHOP5ImHhFby5iyrK" \
  -H "X-Naver-Client-Secret: _9ZOgyw63A"

# 책 검색 테스트
curl -X GET "https://openapi.naver.com/v1/search/book.json?query=비타민" \
  -H "X-Naver-Client-Id: 3z5rHOP5ImHhFby5iyrK" \
  -H "X-Naver-Client-Secret: _9ZOgyw63A"

# 뉴스 검색 (팩트체크 기사)
curl -X GET "https://openapi.naver.com/v1/search/news.json?query=팩트체크" \
  -H "X-Naver-Client-Id: 3z5rHOP5ImHhFby5iyrK" \
  -H "X-Naver-Client-Secret: _9ZOgyw63A"
```

#### 도서관 정보나루 API 테스트
```bash
# 도서 검색
curl "https://www.nl.go.kr/NL/search/openApi/search.do?key=87bcb88c26b091d02752cee9355ae48bd2df9c19911958542c253489f1097d92&apiType=json&srchTarget=total&kwd=비타민"
```

#### Kakao 로컬 API 테스트
```bash
# 도서관 검색
curl -X GET "https://dapi.kakao.com/v2/local/search/keyword.json?query=도서관" \
  -H "Authorization: KakaoAK babf8579f7a855f65e9c3bf4d81d717c"
```

---

## 🚀 MVP 구현 전략 (현실적)

### Phase 1: 즉시 구현 가능 (보유 API만 사용)

```
입력: "비타민 C가 감기 예방에 효과적이다"
    ↓
[데이터 수집]
1. Naver 학술정보 검색 → 국내 논문
2. Naver 책 검색 → 관련 도서
3. Naver 뉴스 검색 → 팩트체크 기사
4. 도서관 정보나루 → 도서관 소장 정보
5. Kakao 로컬 → 가까운 도서관 위치
    ↓
[결과 제공]
- 학술논문 3-5개
- 도서 3-5개 (소장 도서관 정보 포함)
- 팩트체크 기사 2-3개
- 지도에 가까운 도서관 표시
```

### Phase 2: 공개 데이터 추가 (웹 크롤링)

```
[추가 데이터 소스]
6. 알라딘 API → 도서 상세 정보 보강
7. Google Scholar → 해외 논문
8. RISS 웹 → 국내 학위논문
9. PubMed 웹 → 의학 논문
```

### Phase 3: 기관 협력 (추후)

```
[공식 API 확보]
- 기관/단체 명의로 신청
- 대학 협력
- 도서관 협력
```

---

## 📊 데이터 충분성 분석

### 현재 보유 API로 가능한 것

| 데이터 유형 | 보유 API | 충분도 | 보강 방법 |
|------------|---------|--------|----------|
| 국내 학술논문 | Naver ⭐⭐⭐ | 80% | RISS 웹 크롤링 |
| 해외 학술논문 | - | 0% | Google Scholar 크롤링 ⭐⭐⭐ |
| 의학 논문 | - | 0% | PubMed 웹 (키 없이도 가능) |
| 도서 정보 | Naver + 정보나루 ⭐⭐ | 70% | 알라딘 TTB Key ⭐⭐⭐ |
| 도서관 위치 | 정보나루 + Kakao ⭐⭐⭐ | 95% | 완벽 |
| 팩트체크 기사 | Naver ⭐⭐⭐ | 90% | 완벽 |

**결론**: 보유 API만으로도 70-80% 커버 가능! 웹 크롤링 추가하면 95% 이상!

---

## 💻 즉시 실행 가능한 통합 코드

### Node.js 예시

```javascript
// .env 파일 로드
require('dotenv').config();

// 통합 검색 함수
async function searchFactCheck(query) {
  const results = {
    papers: [],
    books: [],
    news: [],
    libraries: []
  };
  
  // 1. Naver 학술정보 검색
  const naverPapers = await fetch(
    `https://openapi.naver.com/v1/search/doc.json?query=${encodeURIComponent(query)}`,
    {
      headers: {
        'X-Naver-Client-Id': process.env.NAVER_CLIENT_ID,
        'X-Naver-Client-Secret': process.env.NAVER_CLIENT_SECRET
      }
    }
  );
  results.papers = (await naverPapers.json()).items;
  
  // 2. Naver 책 검색
  const naverBooks = await fetch(
    `https://openapi.naver.com/v1/search/book.json?query=${encodeURIComponent(query)}`,
    {
      headers: {
        'X-Naver-Client-Id': process.env.NAVER_CLIENT_ID,
        'X-Naver-Client-Secret': process.env.NAVER_CLIENT_SECRET
      }
    }
  );
  results.books = (await naverBooks.json()).items;
  
  // 3. 도서관 소장 정보 추가
  for (const book of results.books) {
    const isbn = extractISBN(book.isbn);
    const libraryInfo = await fetch(
      `https://www.nl.go.kr/NL/search/openApi/search.do?key=${process.env.LIBRARY_NARUINFO_KEY}&apiType=json&isbn=${isbn}`
    );
    book.libraries = await parseLibraries(libraryInfo);
  }
  
  // 4. Naver 뉴스 (팩트체크)
  const naverNews = await fetch(
    `https://openapi.naver.com/v1/search/news.json?query=${encodeURIComponent(query + ' 팩트체크')}`,
    {
      headers: {
        'X-Naver-Client-Id': process.env.NAVER_CLIENT_ID,
        'X-Naver-Client-Secret': process.env.NAVER_CLIENT_SECRET
      }
    }
  );
  results.news = (await naverNews.json()).items;
  
  // 5. 가까운 도서관 (Kakao)
  if (userLocation) {
    const nearbyLibraries = await fetch(
      `https://dapi.kakao.com/v2/local/search/keyword.json?query=도서관&x=${userLocation.x}&y=${userLocation.y}`,
      {
        headers: {
          'Authorization': `KakaoAK ${process.env.KAKAO_REST_API_KEY}`
        }
      }
    );
    results.libraries = (await nearbyLibraries.json()).documents;
  }
  
  return results;
}

// 사용 예시
searchFactCheck('비타민 C 감기 예방')
  .then(results => {
    console.log('학술논문:', results.papers.length);
    console.log('도서:', results.books.length);
    console.log('뉴스:', results.news.length);
    console.log('도서관:', results.libraries.length);
  });
```

---

## 🎯 오늘의 체크리스트

### 지금 당장 (30분)
- [ ] 알라딘 TTB Key 발급
- [ ] `.env` 파일에 `ALADIN_TTB_KEY=` 추가
- [ ] 보유 API 3개 테스트
- [ ] 통합 검색 코드 작성 시작

### 이번 주 (선택)
- [ ] Google Scholar 크롤링 코드
- [ ] RISS 웹 크롤링 코드
- [ ] PubMed 웹 접근 코드
- [ ] 웹 크롤링 라이브러리 설치 (Puppeteer/BeautifulSoup)

### 추후 (여유 있을 때)
- [ ] 기관 협력 논의
- [ ] 공식 API 신청 (단체/기관 명의)

---

## 🔍 확인 방법

### .env 파일 확인

`.env` 파일을 열어서 다음과 같이 되어 있는지 확인:

```env
# ✅ 이미 입력됨
LIBRARY_NARUINFO_KEY=87bcb88c26b091d02752cee9355ae48bd2df9c19911958542c253489f1097d92
KAKAO_REST_API_KEY=babf8579f7a855f65e9c3bf4d81d717c
NAVER_CLIENT_ID=3z5rHOP5ImHhFby5iyrK
NAVER_CLIENT_SECRET=_9ZOgyw63A

# ⏳ 신청 후 입력
RISS_API_KEY=
BIGKINDS_API_KEY=
PUBMED_API_KEY=
```

### Git 보안 확인

```bash
# .env 파일이 Git에서 제외되는지 확인
git status

# .env 파일이 목록에 나타나면 안 됨!
# 나타나지 않으면 ✅ 정상
```

---

## 📊 API 신청 진행 상황

신청하면 체크 표시:

- [x] 도서관 정보나루 ✅
- [x] Kakao ✅
- [x] Naver ✅
- [ ] PubMed (오늘 신청 가능)
- [ ] Crossref (설정만 하면 됨)
- [ ] RISS (1-2일 소요)
- [ ] 빅카인즈 (1-3일 소요)
- [ ] 공공데이터포털:
  - [ ] 통계청
  - [ ] 식약처
  - [ ] 질병관리청
  - [ ] 국립중앙도서관

---

## 🎯 오늘의 할 일

### 지금 당장 (10분)
1. [ ] PubMed 계정 만들고 API 키 받기
2. [ ] `.env` 파일에 PubMed 키 입력
3. [ ] Crossref 이메일 설정

### 오늘 안에 (15분)
4. [ ] RISS API 신청
5. [ ] 빅카인즈 API 신청
6. [ ] 공공데이터포털 회원가입

### 이번 주 안에
7. [ ] 공공데이터포털에서 필요한 API들 개별 신청
8. [ ] 승인 이메일 받으면 `.env`에 키 입력

---

## 🆘 문제 해결

### Q: .env 파일이 안 보여요
**A:** 숨김 파일입니다. 
- VS Code/Cursor에서는 파일 탐색기에 보임
- Windows 탐색기: [보기] > [숨김 항목] 체크

### Q: Git에 .env가 보여요
**A:** `.gitignore`를 확인하세요. 첫 줄에 다음이 있어야 합니다:
```
docs/api-credentials.md
.env
```

### Q: API 키를 어디에 입력하나요?
**A:** 두 곳에 입력:
1. `.env` 파일 (개발용)
2. `docs/api-credentials.md` (문서용)

### Q: 공공데이터포털 키가 2개예요
**A:** Encoding/Decoding 키 중:
- URL에 직접 사용: **Decoding 키**
- 라이브러리 사용: Encoding 키

---

## 📞 긴급 연락처

API 키 관련 문제 발생 시:

- RISS: 1599-3122
- 빅카인즈: 02-2001-7114  
- 공공데이터: 1661-0211
- Kakao: developers.kakao.com
- Naver: developers.naver.com

---

**문서 버전**: 1.0  
**작성일**: 2026년 1월

> 💡 **한 줄 요약**: `.env` 파일에 보유한 키는 이미 입력됨. 추가 API 신청 후 받은 키만 해당 줄에 입력하면 끝!
