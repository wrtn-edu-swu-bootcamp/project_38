# 데이터 소스 활용 전략

FactChecker 서비스를 위한 실물 자료 수집 전략 (API 키 없이도 가능한 방법 포함)

---

## 📊 전략 개요

### 핵심 원칙
1. **현재 보유 API 최대 활용**
2. **공개 데이터 적극 활용** (API 키 불필요)
3. **웹 크롤링으로 실물 자료 확보**
4. **법적으로 허용된 방법만 사용**

### 개발 단계별 접근
- **Phase 1 (MVP)**: 보유 API + 공개 데이터
- **Phase 2 (확장)**: 기관 협력으로 추가 API 확보
- **Phase 3 (고도화)**: 자체 데이터베이스 구축

---

## ✅ 현재 보유 API 활용 계획

### 1. 도서관 정보나루 API ⭐ 핵심
**인증키**: 87bcb88c26b091d02752cee9355ae48bd2df9c19911958542c253489f1097d92

#### 제공 데이터
- 국립중앙도서관 소장 자료 검색
- ISBN 기반 서지정보
- 저자, 출판사, 출판연도 정보
- 도서관 위치 정보

#### 활용 방안
```javascript
// 키워드로 도서 검색
const searchBooks = async (keyword) => {
  const url = `https://www.nl.go.kr/NL/search/openApi/search.do?key=${API_KEY}&apiType=json&srchTarget=total&kwd=${encodeURIComponent(keyword)}&pageNum=1&pageSize=10`;
  const response = await fetch(url);
  return response.json();
};

// ISBN으로 상세 정보 조회
const getBookDetails = async (isbn) => {
  const url = `https://www.nl.go.kr/NL/search/openApi/search.do?key=${API_KEY}&apiType=json&srchTarget=total&isbn=${isbn}`;
  const response = await fetch(url);
  return response.json();
};
```

#### 제한사항 및 대안
- 국립중앙도서관 소장 자료만 제공
- **대안**: 다른 소스와 결합하여 전국 도서관 정보 확장

---

### 2. Naver Developers API ⭐ 핵심
**Client ID**: 3z5rHOP5ImHhFby5iyrK  
**Client Secret**: _9ZOgyw63A

#### 제공 데이터
- 네이버 학술정보 검색 (국내 논문)
- 네이버 책 검색
- 네이버 블로그, 뉴스 검색

#### 활용 방안
```javascript
// 학술정보 검색
const searchAcademicPapers = async (query) => {
  const url = `https://openapi.naver.com/v1/search/doc.json?query=${encodeURIComponent(query)}&display=10`;
  const response = await fetch(url, {
    headers: {
      'X-Naver-Client-Id': CLIENT_ID,
      'X-Naver-Client-Secret': CLIENT_SECRET
    }
  });
  return response.json();
};

// 책 검색
const searchBooks = async (query) => {
  const url = `https://openapi.naver.com/v1/search/book.json?query=${encodeURIComponent(query)}&display=10`;
  const response = await fetch(url, {
    headers: {
      'X-Naver-Client-Id': CLIENT_ID,
      'X-Naver-Client-Secret': CLIENT_SECRET
    }
  });
  return response.json();
};

// 뉴스 검색 (팩트체크 기사)
const searchNews = async (query) => {
  const url = `https://openapi.naver.com/v1/search/news.json?query=${encodeURIComponent(query)}&display=10&sort=sim`;
  const response = await fetch(url, {
    headers: {
      'X-Naver-Client-Id': CLIENT_ID,
      'X-Naver-Client-Secret': CLIENT_SECRET
    }
  });
  return response.json();
};
```

#### 강점
- 국내 학술 자료에 강함
- 일일 호출 제한이 넉넉함 (25,000건)
- 실시간 뉴스 팩트체크 기사 검색 가능

---

### 3. Kakao Developers API
**REST API Key**: babf8579f7a855f65e9c3bf4d81d717c

#### 제공 데이터
- 카카오 로컬 API (도서관 위치 검색)
- 주소 검색 및 좌표 변환
- 사용자 위치 기반 가까운 도서관 찾기

#### 활용 방안
```javascript
// 도서관 검색
const searchLibraries = async (keyword, x, y) => {
  const url = `https://dapi.kakao.com/v2/local/search/keyword.json?query=${encodeURIComponent(keyword + ' 도서관')}&x=${x}&y=${y}&radius=10000`;
  const response = await fetch(url, {
    headers: {
      'Authorization': `KakaoAK ${REST_API_KEY}`
    }
  });
  return response.json();
};

// 주소로 좌표 변환
const addressToCoord = async (address) => {
  const url = `https://dapi.kakao.com/v2/local/search/address.json?query=${encodeURIComponent(address)}`;
  const response = await fetch(url, {
    headers: {
      'Authorization': `KakaoAK ${REST_API_KEY}`
    }
  });
  return response.json();
};
```

#### 강점
- 사용자 위치 기반 가까운 도서관 추천 가능
- 도서관까지의 거리 계산
- 지도 시각화 가능

---

## 🌐 API 키 불필요한 공개 데이터 소스

### 1. Google Scholar (학술논문) ⭐⭐⭐
**URL**: https://scholar.google.com/  
**특징**: API 키 불필요, 웹 스크래핑 가능

#### 제공 데이터
- 전 세계 학술논문 메타데이터
- 인용 횟수
- 관련 논문
- PDF 링크 (오픈액세스)

#### 활용 방안
```python
# Python + BeautifulSoup 예시
import requests
from bs4 import BeautifulSoup

def search_google_scholar(query):
    url = f"https://scholar.google.com/scholar?q={query}&hl=ko"
    headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
    }
    response = requests.get(url, headers=headers)
    soup = BeautifulSoup(response.text, 'html.parser')
    
    results = []
    for item in soup.select('.gs_ri'):
        title = item.select_one('.gs_rt').get_text()
        author = item.select_one('.gs_a').get_text()
        snippet = item.select_one('.gs_rs').get_text()
        results.append({
            'title': title,
            'author': author,
            'snippet': snippet
        })
    
    return results
```

#### 주의사항
- 요청 빈도 제한 (rate limiting 필요)
- robots.txt 준수
- User-Agent 설정 필수

---

### 2. PubMed Central (PMC) - 의학 논문 ⭐⭐⭐
**URL**: https://www.ncbi.nlm.nih.gov/pmc/  
**특징**: 오픈액세스, API 키 없이도 기본 사용 가능

#### 제공 데이터
- 의학·생명과학 분야 전문 논문
- 전문(Full Text) 무료 제공
- 참고문헌 정보

#### 활용 방안 (API 키 없이)
```javascript
// E-utilities (키 없이도 사용 가능, 단 속도 제한)
const searchPubMed = async (query) => {
  // 1단계: 검색
  const searchUrl = `https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esearch.fcgi?db=pubmed&term=${encodeURIComponent(query)}&retmode=json&retmax=10`;
  const searchResponse = await fetch(searchUrl);
  const searchData = await searchResponse.json();
  
  // 2단계: 상세 정보 가져오기
  const ids = searchData.esearchresult.idlist.join(',');
  const fetchUrl = `https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esummary.fcgi?db=pubmed&id=${ids}&retmode=json`;
  const fetchResponse = await fetch(fetchUrl);
  return fetchResponse.json();
};
```

#### 제한사항
- API 키 없으면 초당 3회 제한
- 키 있으면 초당 10회로 증가 (추후 개인 계정 생성 시)

---

### 3. 국회도서관 통합검색 ⭐⭐
**URL**: https://www.nanet.go.kr/  
**특징**: 웹 크롤링 가능, 공공기관

#### 제공 데이터
- 국내 학술논문
- 정부 간행물
- 연구보고서
- 법령 자료

#### 활용 방안
```python
def search_national_assembly_library(query):
    url = f"https://www.nanet.go.kr/search/searchList.do?queryText={query}"
    headers = {'User-Agent': 'Mozilla/5.0'}
    response = requests.get(url, headers=headers)
    soup = BeautifulSoup(response.text, 'html.parser')
    
    # 검색 결과 파싱
    results = []
    for item in soup.select('.resultList li'):
        title = item.select_one('.title').get_text()
        info = item.select_one('.info').get_text()
        results.append({'title': title, 'info': info})
    
    return results
```

---

### 4. 알라딘 도서 API (오픈 API) ⭐⭐
**URL**: https://www.aladin.co.kr/ttb/wblog_main.aspx  
**특징**: TTB Key 발급 쉬움 (즉시), 무료

#### 제공 데이터
- 국내 출판 도서 정보
- ISBN, 저자, 출판사
- 도서 표지 이미지
- 목차 정보

#### TTB Key 발급 방법
1. 알라딘 회원가입 (무료)
2. https://www.aladin.co.kr/ttb/wblog_main.aspx 접속
3. [TTB 인증키 발급] 즉시 발급 (승인 필요 없음)

#### 활용 방안
```javascript
// TTB Key는 즉시 발급 가능
const searchAladinBooks = async (query, ttbKey) => {
  const url = `http://www.aladin.co.kr/ttb/api/ItemSearch.aspx?ttbkey=${ttbKey}&Query=${encodeURIComponent(query)}&QueryType=Title&MaxResults=10&output=js&Version=20131101`;
  const response = await fetch(url);
  return response.json();
};
```

---

### 5. 교보문고 도서 검색 ⭐
**URL**: https://www.kyobobook.co.kr/  
**특징**: 웹 크롤링 가능

#### 제공 데이터
- 국내 출판 도서
- 목차 정보
- 출판사 서평

#### 활용 방안
```python
def search_kyobo_books(query):
    url = f"https://search.kyobobook.co.kr/web/search?vPstrKeyWord={query}"
    headers = {'User-Agent': 'Mozilla/5.0'}
    response = requests.get(url, headers=headers)
    soup = BeautifulSoup(response.text, 'html.parser')
    
    # 도서 정보 파싱
    results = []
    for item in soup.select('.prod_item'):
        title = item.select_one('.prod_name').get_text()
        author = item.select_one('.prod_author').get_text()
        results.append({'title': title, 'author': author})
    
    return results
```

---

### 6. RISS (한국교육학술정보원) - 웹 검색 ⭐⭐
**URL**: https://www.riss.kr/  
**특징**: API 없이도 웹 검색 가능

#### 제공 데이터
- 국내 학위논문
- 학술지 논문
- 학술대회 자료

#### 활용 방안
```python
def search_riss_web(query):
    url = f"http://www.riss.kr/search/Search.do?queryText={query}&searchGubun=true&colName=re_a_kor"
    headers = {'User-Agent': 'Mozilla/5.0'}
    response = requests.get(url, headers=headers)
    soup = BeautifulSoup(response.text, 'html.parser')
    
    results = []
    for item in soup.select('.srchResultListW li'):
        title = item.select_one('.title').get_text()
        author = item.select_one('.author').get_text()
        results.append({'title': title, 'author': author})
    
    return results
```

---

### 7. 공공데이터포털 (웹 검색) ⭐
**URL**: https://www.data.go.kr/  
**특징**: 많은 데이터셋이 파일 다운로드 형태로 제공

#### 제공 데이터
- 통계청 데이터 (CSV, Excel)
- 각 부처 공식 자료
- 도서관 정보 (일부 파일 제공)

#### 활용 방안
- 정기적으로 공개 파일 다운로드
- 로컬 데이터베이스에 저장
- API처럼 활용

---

### 8. 책이음 전국도서관 정보 ⭐⭐
**URL**: https://www.nl.go.kr/seoji/  
**특징**: 웹 크롤링 + 도서관 정보나루 API 조합

#### 제공 데이터
- 전국 공공도서관 소장 정보
- 도서관별 대출 가능 여부
- 도서관 연락처, 운영시간

#### 활용 방안
1. 도서관 정보나루 API로 책 검색
2. 책이음 웹사이트에서 소장 도서관 크롤링
3. Kakao API로 가까운 도서관 위치 표시

---

## 🔄 통합 데이터 수집 전략

### 실물 자료 수집 워크플로우

```
사용자 입력 (예: "비타민 C 감기 예방")
    ↓
1. 키워드 추출 및 정제
    ↓
2. 병렬 데이터 수집
    ├─ Google Scholar (학술논문)
    ├─ Naver 학술정보 검색 (국내 논문)
    ├─ PubMed (의학 논문)
    ├─ 도서관 정보나루 (도서)
    ├─ 알라딘 API (도서 상세)
    ├─ Naver 책 검색 (도서)
    └─ Naver 뉴스 검색 (팩트체크 기사)
    ↓
3. 결과 통합 및 중복 제거
    ↓
4. 내용 관련성 분석 (AI/임베딩)
    ↓
5. 신뢰도 점수 계산
    ↓
6. 도서관 소장 정보 추가
    ├─ 도서관 정보나루 API
    ├─ 책이음 웹 크롤링
    └─ Kakao API (가까운 도서관)
    ↓
7. 결과 제공
```

---

## 💻 구현 예시 코드

### 통합 검색 함수

```javascript
// 모든 소스에서 데이터 수집
async function searchAllSources(query) {
  const results = await Promise.all([
    // 보유 API
    searchNaverAcademic(query),
    searchNaverBooks(query),
    searchNaverNews(query + ' 팩트체크'),
    searchLibraryNaru(query),
    
    // API 키 불필요 (크롤링)
    searchGoogleScholar(query),
    searchPubMedWeb(query),
    searchAladinBooks(query),
    searchRISSWeb(query),
  ]);
  
  // 결과 통합
  const combined = {
    papers: [...results[0].items, ...results[4].items, ...results[5].items, ...results[7].items],
    books: [...results[1].items, ...results[3].items, ...results[6].items],
    news: results[2].items
  };
  
  // 중복 제거
  combined.papers = removeDuplicates(combined.papers, 'title');
  combined.books = removeDuplicates(combined.books, 'isbn');
  
  return combined;
}

// 도서관 위치 정보 추가
async function addLibraryInfo(books, userLocation) {
  for (const book of books) {
    // 소장 도서관 찾기
    book.libraries = await findLibrariesWithBook(book.isbn);
    
    // 가까운 도서관 정렬
    if (userLocation) {
      book.libraries = await sortByDistance(book.libraries, userLocation);
    }
  }
  
  return books;
}

// 도서관 찾기
async function findLibrariesWithBook(isbn) {
  const libraries = [];
  
  // 1. 도서관 정보나루 API
  const naruResult = await searchLibraryNaruByISBN(isbn);
  libraries.push(...parseLibraries(naruResult));
  
  // 2. 책이음 웹 크롤링 (추가 도서관)
  const booklinkResult = await scrapeBooklink(isbn);
  libraries.push(...booklinkResult);
  
  return libraries;
}
```

---

## 📊 데이터 소스별 우선순위

### 학술논문
1. **Google Scholar** (가장 광범위) ⭐⭐⭐
2. **Naver 학술정보** (국내 논문 강함) ⭐⭐⭐
3. **PubMed** (의학 분야 최고) ⭐⭐
4. **RISS 웹** (국내 학위논문) ⭐⭐

### 도서 정보
1. **도서관 정보나루 API** (공공도서관 소장) ⭐⭐⭐
2. **알라딘 API** (상세 정보 풍부) ⭐⭐⭐
3. **Naver 책 검색** (검색 품질 좋음) ⭐⭐
4. **교보문고 웹** (목차 정보) ⭐

### 뉴스/팩트체크
1. **Naver 뉴스 검색** (실시간, 품질 좋음) ⭐⭐⭐
2. **Google 뉴스** (글로벌) ⭐⭐

### 도서관 위치
1. **Kakao 로컬 API** (정확, 빠름) ⭐⭐⭐
2. **도서관 정보나루** (공공도서관 정보) ⭐⭐

---

## ⚖️ 법적 고려사항

### 웹 크롤링 시 주의사항

1. **robots.txt 준수**
```python
# robots.txt 확인
import urllib.robotparser

rp = urllib.robotparser.RobotFileParser()
rp.set_url("https://scholar.google.com/robots.txt")
rp.read()

# 크롤링 가능 여부 확인
can_fetch = rp.can_fetch("*", "https://scholar.google.com/scholar?q=...")
```

2. **요청 빈도 제한**
```python
import time

# 요청 사이 간격 두기
time.sleep(1)  # 1초 대기
```

3. **User-Agent 설정**
```python
headers = {
    'User-Agent': 'FactChecker/1.0 (Educational Purpose; contact@example.com)'
}
```

4. **이용약관 준수**
- 학술 목적/비영리 목적 명시
- 대량 수집 지양
- 출처 명확히 표기

---

## 🎯 MVP 구현 계획

### Phase 1: 핵심 기능 (1-2주)
1. ✅ Naver API로 학술정보 + 책 검색
2. ✅ 도서관 정보나루로 도서관 정보
3. ✅ Kakao API로 도서관 위치
4. ✅ Google Scholar 웹 크롤링
5. ✅ 알라딘 TTB Key 발급 후 도서 정보 보강

### Phase 2: 확장 (2-4주)
1. PubMed 웹 크롤링 추가
2. RISS 웹 크롤링 추가
3. 책이음 웹 크롤링으로 전국 도서관 확장
4. 내용 관련성 분석 AI 모델 추가

### Phase 3: 고도화 (1-2개월)
1. 기관 협력으로 공식 API 확보
2. 자체 데이터베이스 구축
3. 실시간 업데이트 시스템

---

## 📌 즉시 실행 가능한 액션 아이템

### 오늘 할 수 있는 일
1. ✅ 알라딘 TTB Key 발급 (5분, 즉시 가능)
   - https://www.aladin.co.kr/ttb/wblog_main.aspx

2. ✅ 웹 크롤링 테스트 코드 작성
   - Google Scholar 검색
   - RISS 검색
   - 국회도서관 검색

3. ✅ 보유 API 테스트
   - Naver 학술정보 검색
   - 도서관 정보나루 검색
   - Kakao 로컬 검색

### 이번 주 할 일
4. 통합 검색 시스템 프로토타입 개발
5. 중복 제거 및 관련성 분석 로직
6. 도서관 위치 연동 기능

---

**문서 버전**: 1.0  
**작성일**: 2026년 1월  
**최종 수정일**: 2026년 1월

> 💡 **핵심 요약**: 보유한 API 3개 + API 키 불필요한 공개 소스로 충분히 실물 자료를 제공할 수 있습니다!
