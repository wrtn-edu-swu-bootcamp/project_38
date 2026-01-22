# API 신청 가이드

FactChecker 서비스 개발을 위해 필요한 API들의 신청 방법을 안내합니다.

---

## 📋 목차
1. [RISS API (필수 ⭐)](#1-riss-api)
2. [빅카인즈 API (필수 ⭐)](#2-빅카인즈-api)
3. [PubMed API (필수 ⭐)](#3-pubmed-api)
4. [공공데이터포털 API (필수 ⭐)](#4-공공데이터포털-api)
5. [DBpia API (선택)](#5-dbpia-api)
6. [NDSL API (선택)](#6-ndsl-api)
7. [Crossref API (선택)](#7-crossref-api)
8. [한국저작권위원회 공공저작물 API (선택)](#8-한국저작권위원회-공공저작물-api)

---

## 1. RISS API (필수 ⭐)

### 기본 정보
- **제공기관**: 한국교육학술정보원 (KERIS)
- **제공 데이터**: 국내 학위논문, 학술지 논문, 학술단체 발표자료
- **비용**: 무료
- **일일 호출 제한**: 10,000건

### 신청 방법

#### STEP 1: 회원가입
1. RISS 홈페이지 접속: https://www.riss.kr
2. 우측 상단 [회원가입] 클릭
3. 개인회원 가입 (이메일 인증 필요)
4. 로그인

#### STEP 2: API 키 신청
1. 로그인 후 하단 [오픈 API] 메뉴 클릭
   - 직접 링크: http://www.riss.kr/openapi/
2. [Open API 신청] 버튼 클릭
3. 서비스 신청서 작성:
   - **서비스명**: FactChecker
   - **서비스 목적**: 학술논문 기반 팩트체크 서비스
   - **이용기관/단체**: 개인 또는 소속 기관명
   - **서비스 URL**: (개발 중이면 'localhost' 또는 '개발 예정' 기재)
4. 약관 동의 후 신청 완료

#### STEP 3: 승인 확인
- **승인 시간**: 1-2 영업일 (보통 당일~익일 승인)
- 승인 시 이메일로 API 키 발급
- RISS 사이트 내 [마이페이지] > [Open API] 에서도 확인 가능

### API 키 확인 방법
```
마이페이지 > Open API 관리 > API 키 확인
```

### 테스트 요청 예시
```bash
curl "http://www.riss.kr/search/openapi/search?apikey=[YOUR_API_KEY]&query=비타민&display=10"
```

### 주요 API 엔드포인트
- **검색 API**: `http://www.riss.kr/search/openapi/search`
- **상세정보 API**: `http://www.riss.kr/search/openapi/detail`

### 문서
- API 가이드: http://www.riss.kr/openapi/guide.do

---

## 2. 빅카인즈 API (필수 ⭐)

### 기본 정보
- **제공기관**: 한국언론진흥재단
- **제공 데이터**: 54개 주요 언론사 뉴스 기사 (1990년~현재)
- **비용**: 무료
- **일일 호출 제한**: 10,000건

### 신청 방법

#### STEP 1: 회원가입
1. 빅카인즈 홈페이지 접속: https://www.bigkinds.or.kr
2. 우측 상단 [회원가입] 클릭
3. 이메일 인증 후 가입 완료
4. 로그인

#### STEP 2: API 키 신청
1. 로그인 후 상단 메뉴 [OpenAPI] 클릭
2. [OpenAPI 신청] 버튼 클릭
3. 신청서 작성:
   - **이용 목적**: 팩트체크 서비스 개발
   - **서비스명**: FactChecker
   - **이용 기간**: 1년 (자동 연장 가능)
   - **예상 일일 호출 횟수**: 1,000~5,000회
4. 신청 완료

#### STEP 3: 승인 확인
- **승인 시간**: 1-3 영업일
- 승인 시 이메일로 API 키 발급
- 사이트 내 [마이페이지] > [OpenAPI 관리] 에서 확인

### API 키 확인 방법
```
마이페이지 > OpenAPI 관리 > API 키 확인
```

### 테스트 요청 예시
```bash
curl -X POST "https://www.bigkinds.or.kr/api/news/search.do" \
  -H "Content-Type: application/json" \
  -d '{
    "access_key": "[YOUR_API_KEY]",
    "argument": {
      "query": "비타민",
      "published_at": {
        "from": "2024-01-01",
        "until": "2024-12-31"
      },
      "sort": {"date": "desc"},
      "return_from": 0,
      "return_size": 10
    }
  }'
```

### 주요 기능
- 뉴스 검색
- 날짜별 필터링
- 언론사별 필터링
- 유사 기사 찾기

### 문서
- API 가이드: https://www.bigkinds.or.kr/v2/intro/apiIntro.do

---

## 3. PubMed API (필수 ⭐)

### 기본 정보
- **제공기관**: 미국 국립보건원 (NIH/NLM)
- **제공 데이터**: 의학·생명과학 분야 국제 학술논문 (3,500만+ 건)
- **비용**: 무료
- **호출 제한**: 
  - API 키 없이: 초당 3회
  - API 키 있으면: 초당 10회

### 신청 방법

#### STEP 1: NCBI 계정 생성
1. NCBI 홈페이지 접속: https://www.ncbi.nlm.nih.gov/
2. 우측 상단 [Sign in to NCBI] 클릭
3. [Register for an NCBI account] 클릭
4. 이메일, 사용자명, 비밀번호 입력
5. 이메일 인증 완료

#### STEP 2: API 키 발급 (선택적이지만 권장)
1. 로그인 후 우측 상단 계정명 클릭 > [Account settings]
2. 좌측 메뉴에서 [API Key Management] 클릭
3. [Create an API Key] 버튼 클릭
4. API 키 즉시 발급 (승인 절차 없음)

> 💡 **참고**: API 키 없이도 사용 가능하지만, 호출 제한이 있어 키 발급 권장

### API 키 사용 방법
URL 파라미터에 `&api_key=YOUR_API_KEY` 추가

### 테스트 요청 예시
```bash
# 검색 예시
curl "https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esearch.fcgi?db=pubmed&term=vitamin+cold+prevention&retmode=json&api_key=[YOUR_API_KEY]"

# 상세정보 조회
curl "https://eutils.ncbi.nlm.nih.gov/entrez/eutils/efetch.fcgi?db=pubmed&id=12345678&retmode=xml&api_key=[YOUR_API_KEY]"
```

### 주요 API (E-utilities)
- **esearch**: 논문 검색
- **efetch**: 논문 상세정보 가져오기
- **esummary**: 논문 요약정보
- **elink**: 관련 논문 찾기

### 문서
- E-utilities 가이드: https://www.ncbi.nlm.nih.gov/books/NBK25501/
- 빠른 시작: https://www.ncbi.nlm.nih.gov/books/NBK25500/

---

## 4. 공공데이터포털 API (필수 ⭐)

### 기본 정보
- **제공기관**: 한국지능정보사회진흥원
- **제공 데이터**: 정부 각 부처 공공데이터
- **비용**: 대부분 무료
- **호출 제한**: API별로 상이 (보통 일 1,000~10,000건)

### 신청 방법

#### STEP 1: 회원가입
1. 공공데이터포털 접속: https://www.data.go.kr
2. 우측 상단 [회원가입] 클릭
3. 개인회원 가입 (휴대폰 또는 이메일 인증)
4. 로그인

#### STEP 2: 필요한 API 찾기
팩트체크에 유용한 주요 API:

1. **국립중앙도서관 도서 정보**
   - 검색: "국립중앙도서관 도서정보"
   - URL: https://www.data.go.kr/data/15013109/openapi.do

2. **통계청 e-나라지표**
   - 검색: "통계청 e-나라지표"
   - URL: https://www.data.go.kr/data/15083277/openapi.do

3. **식품의약품안전처 식품안전나라**
   - 검색: "식품의약품안전처"
   - 다양한 API 제공 (건강기능식품, 의약품 등)

4. **질병관리청 감염병 통계**
   - 검색: "질병관리청"

#### STEP 3: 개별 API 신청
각 API마다 개별 신청 필요:

1. 원하는 API 상세 페이지 접속
2. [활용신청] 버튼 클릭
3. 신청 정보 입력:
   - **활용 목적**: 팩트체크 서비스 개발
   - **활용 분야**: 교육/학술
   - **활용 형태**: 웹/모바일 서비스
   - **서비스명**: FactChecker
4. 이용약관 동의 후 신청

#### STEP 4: 승인 확인
- **승인 시간**: 즉시~3 영업일 (API별 상이)
- 많은 API가 즉시 승인됨
- [마이페이지] > [오픈API] > [개발계정] 에서 인증키 확인

### API 키 확인 방법
```
마이페이지 > 오픈API > 개발계정 > 일반 인증키 (Encoding/Decoding 키 모두 확인)
```

### 테스트 요청 예시
```bash
curl "http://openapi.data.go.kr/openapi/service/[서비스명]/[오퍼레이션명]?serviceKey=[YOUR_API_KEY]&[파라미터]"
```

### 주의사항
- Encoding된 키와 Decoding된 키 2개가 제공됨
- URL에 직접 사용 시: **Decoding된 키** 사용
- SDK나 라이브러리 사용 시: 보통 Encoding된 키 사용
- 각 API마다 개별 승인 필요 (통합 키 아님)

### 문서
- 개발가이드: https://www.data.go.kr/ugs/selectPublicDataUseGuideView.do

---

## 5. DBpia API (선택)

### 기본 정보
- **제공기관**: 누리미디어
- **제공 데이터**: 국내 학술지 논문 (KCI 등재 포함)
- **비용**: **유료** (월 구독료 또는 건당 과금)
- **특징**: 원문 PDF 접근 가능

### 신청 방법

#### STEP 1: 기관 계약 확인
1. 소속 기관(대학, 연구소)이 DBpia와 계약되어 있는지 확인
2. 계약되어 있으면 기관 내부 시스템을 통해 접근 가능

#### STEP 2: 개인/기업 API 신청
기관 계약이 없는 경우:

1. DBpia 영업팀 문의: https://www.dbpia.co.kr/
2. 고객센터 > 기업서비스 문의
3. 전화: 1577-8115
4. 이메일: help@nurimedia.co.kr

#### 상담 시 준비사항
- 서비스 목적 및 개요
- 예상 이용량
- 원문 접근 필요 여부
- 이용 기간

### 비용 (참고)
- 건당 과금: 논문 1편당 1,000~3,000원
- 월 구독: 협의 필요 (이용량에 따라 상이)

### 대안
- RISS를 통해 일부 DBpia 논문도 검색 가능 (무료)
- KCI(한국학술지인용색인)에서 초록은 무료 제공

---

## 6. NDSL API (선택)

### 기본 정보
- **제공기관**: 한국과학기술정보연구원 (KISTI)
- **제공 데이터**: 과학기술 분야 논문, 보고서, 특허 등
- **비용**: 무료
- **특징**: 과학기술 분야 특화

### 신청 방법

#### STEP 1: 회원가입
1. NDSL 홈페이지 접속: https://www.ndsl.kr
2. [회원가입] 클릭
3. 개인회원 가입 (이메일 인증)
4. 로그인

#### STEP 2: API 키 신청
1. 로그인 후 하단 [Open API] 클릭
   - 직접 링크: https://www.ndsl.kr/openapi/main.do
2. [Open API 신청] 버튼 클릭
3. 신청서 작성:
   - **이용 목적**: 과학기술 정보 기반 팩트체크 서비스
   - **서비스명**: FactChecker
   - **이용 기관**: 개인 또는 소속
4. 신청 완료

#### STEP 3: 승인 확인
- **승인 시간**: 1-3 영업일
- 승인 시 이메일로 API 키 발급
- [마이페이지] > [Open API] 에서 확인

### 주요 API
- 논문 검색
- 특허 검색
- 연구보고서 검색
- 과학기술 용어 검색

### 문서
- API 가이드: https://www.ndsl.kr/openapi/guide.do

---

## 7. Crossref API (선택)

### 기본 정보
- **제공기관**: Crossref (국제 DOI 등록 기관)
- **제공 데이터**: 전 세계 학술논문 메타데이터 (1억 4천만+ 건)
- **비용**: 무료
- **호출 제한**: 
  - 익명: 초당 50회
  - Plus 서비스: 더 빠른 응답 (선택적)

### 신청 방법

#### STEP 1: API 키 없이 사용 가능
Crossref API는 **API 키 없이도 사용 가능**합니다!

단, 정중한 사용(polite pool)을 위해 이메일 정보를 헤더에 포함하면:
- 더 빠른 응답 속도
- 더 높은 호출 제한

#### STEP 2: Polite Pool 사용 (권장)
요청 URL에 이메일 추가:
```
https://api.crossref.org/works?mailto=your-email@example.com&query=vitamin
```

또는 User-Agent 헤더에 이메일 포함:
```bash
curl "https://api.crossref.org/works?query=vitamin" \
  -H "User-Agent: FactChecker/1.0 (mailto:your-email@example.com)"
```

### 테스트 요청 예시
```bash
# DOI로 논문 조회
curl "https://api.crossref.org/works/10.1002/14651858.CD000980.pub4"

# 키워드로 검색
curl "https://api.crossref.org/works?query=vitamin+cold+prevention&rows=10"
```

### 주요 기능
- DOI 기반 논문 메타데이터 조회
- 제목, 저자, 출판연도 검색
- 인용 정보 확인
- 저널 정보 조회

### 문서
- REST API 가이드: https://github.com/CrossRef/rest-api-doc
- 공식 문서: https://www.crossref.org/documentation/retrieve-metadata/rest-api/

---

## 8. 한국저작권위원회 공공저작물 API (선택)

### 기본 정보
- **제공기관**: 한국저작권위원회
- **제공 데이터**: 정부 발간 공공저작물 (보고서, 백서 등)
- **비용**: 무료

### 신청 방법

#### STEP 1: 공공저작물 자유이용 홈페이지 접속
1. 홈페이지: https://www.kogl.or.kr
2. [회원가입] (간단한 정보만 입력)

#### STEP 2: Open API 메뉴 찾기
1. 하단 [Open API] 메뉴 클릭
2. API 문서 확인

#### 참고사항
- 별도 API 키 발급 절차가 단순하거나 불필요할 수 있음
- 사이트 내 검색 기능을 통한 데이터 수집도 가능
- 최신 정보는 사이트에서 직접 확인 필요

### 대안
공공저작물은 **공공데이터포털**을 통해서도 접근 가능:
- 각 부처별 공식 보고서
- 통계청, 정책브리핑 등

---

## 📊 API 신청 우선순위 및 타임라인

### 즉시 신청 (당일 사용 가능)
1. ✅ **PubMed API** - 계정만 만들면 즉시 키 발급
2. ✅ **Crossref API** - 키 없이도 사용 가능

### 1-2일 내 승인 (우선 신청 권장)
3. ⏰ **RISS API** - 1-2 영업일 소요
4. ⏰ **빅카인즈 API** - 1-3 영업일 소요
5. ⏰ **NDSL API** - 1-3 영업일 소요

### 필요시 신청
6. ⏳ **공공데이터포털 각종 API** - API별로 개별 신청, 대부분 즉시~3일
7. 💰 **DBpia API** - 유료, 협의 필요

---

## ⚠️ 중요 체크리스트

### 신청 전
- [ ] 각 API의 이용약관 확인
- [ ] 호출 제한 및 속도 제한 확인
- [ ] 무료/유료 여부 확인
- [ ] 제공 데이터 범위 확인

### 신청 시
- [ ] 정확한 서비스 목적 기재: "학술자료 기반 팩트체크 서비스 개발"
- [ ] 실제 연락 가능한 이메일 사용
- [ ] 예상 호출량 현실적으로 기재 (과도하게 크지 않게)

### 승인 후
- [ ] API 키를 안전하게 보관 (api-credentials.md)
- [ ] .gitignore에 추가되어 있는지 확인
- [ ] 테스트 요청으로 정상 작동 확인
- [ ] API 문서 숙지

---

## 🔧 테스트 환경 설정

모든 API 키를 받은 후 테스트용 스크립트:

```bash
# .env 파일 생성 (예시)
cat > .env << EOF
# 이미 보유한 키
LIBRARY_API_KEY=87bcb88c26b091d02752cee9355ae48bd2df9c19911958542c253489f1097d92
KAKAO_REST_API_KEY=babf8579f7a855f65e9c3bf4d81d717c
NAVER_CLIENT_ID=3z5rHOP5ImHhFby5iyrK
NAVER_CLIENT_SECRET=_9ZOgyw63A

# 새로 신청한 키
RISS_API_KEY=[신청 후 입력]
BIGKINDS_API_KEY=[신청 후 입력]
PUBMED_API_KEY=[신청 후 입력]
NDSL_API_KEY=[신청 후 입력]
PUBLIC_DATA_API_KEY=[신청 후 입력]
EOF
```

---

## 📞 문의처

### RISS
- 고객센터: 1599-3122
- 이메일: helpdesk@keris.or.kr

### 빅카인즈
- 고객센터: 02-2001-7114
- 이메일: help@bigkinds.or.kr

### 공공데이터포털
- 고객센터: 1661-0211
- 이메일: opr@nia.or.kr

### NDSL
- 고객센터: 042-869-1234
- 이메일: ndsl@kisti.re.kr

---

**문서 버전**: 1.0  
**작성일**: 2026년 1월  
**최종 수정일**: 2026년 1월

> 💡 **Tip**: 각 API 신청 시 일관된 서비스명(FactChecker)과 목적(팩트체크 서비스)을 사용하면 관리가 편리합니다.
