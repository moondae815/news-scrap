# Product Requirements Document (PRD): Real-time News Curation for Developers

## 1. Introduction
### 1.1 Purpose
개발자들을 위한 실시간 뉴스 큐레이션 리더 웹 애플리케이션입니다. 여러 소스(Hacker News, Reddit, GitHub Trending 등)의 최신 동향을 가져와 AI(OpenAI GPT-4o-mini)를 통해 한 줄로 요약하고, 중요도 점수를 매겨 개인용 대시보드로 제공하는 것을 목표로 합니다.

### 1.2 Target Audience
- **사용자**: 개인 개발자 (Personal Use)
- **주요 가치**: 방대한 정보 속에서 핵심 트렌드만 빠르게 파악하여 시간 절약.

## 2. Product Overview
### 2.1 Core Features
1. **데이터 수집 파이프라인 (On-Demand with Caching)**
   - 페이지 로드 시 실시간으로 데이터를 가져오되, **비용 및 응답 속도 최적화를 위해 약 10~30분 주기의 캐시(Next.js ISR 등)를 적용**합니다.
   - 대상 소스 (소스당 **Top 10개**, 총 30개 수집):
     - Hacker News (Top/Best Stories)
     - Reddit (개발 관련 주요 서브레딧, 예: r/programming 등)
     - GitHub Trending (오늘의 인기 저장소)
2. **AI 기반 컨텐츠 처리 파이프라인 (GPT-4o-mini)**
   - 수집된 원본 데이터(제목, 내용 일부 등)를 OpenAI API에 전달하여 일괄(Batch) 요약 및 점수화를 진행합니다.
   - **한 줄 요약 (One-line Summary)**: 내용의 핵심을 간결하게 요약.
   - **중요도 점수 (Importance Score, 1~100점)**: **'범용적 화제성 및 인기도'에 가장 높은 가중치**를 두고 점수를 산정합니다.
3. **개인용 대시보드 UI**
   - 최신 뉴스 및 트렌드를 카드 또는 리스트 형태로 제공합니다.
   - 중요도 점수(Score)가 높은 순, 최신순, 소스별(Hacker News/Reddit/GitHub) 필터링 및 정렬을 지원합니다.
   - 원문 링크로 바로 이동할 수 있는 외부 링크 버튼을 제공합니다.

## 3. Technical Architecture
### 3.1 Tech Stack
- **Frontend / Backend**: Next.js (App Router, Server Components API Routes)
- **Styling**: Tailwind CSS
- **AI Model**: OpenAI GPT-4o-mini
- **Database**: 로컬 환경 전용 (별도 DB 없이 Next.js의 내장 File/Memory Cache 기능이나 단순 JSON 파일 활용)
- **Data Fetching API**:
  - Hacker News: 공식 Firebase API 활용
  - Reddit: JSON API 활용 (`reddit.com/r/programming.json`)
  - GitHub Trending: `cheerio`를 활용한 웹 스크래핑 또는 비공식 API

### 3.2 System Flow
1. 사용자가 Next.js 웹 앱 대시보드에 접속합니다.
2. Next.js Server Component가 3개 소스(HN, Reddit, GitHub)에서 각각 상위 10개의 데이터를 병렬 비동기(Promise.all) 방식으로 수집합니다.
3. 수집된 30개의 데이터를 하나의 프롬프트(JSON 배열 등)로 묶어 OpenAI GPT-4o-mini API에 전달합니다. (토큰 및 비용 최적화)
4. AI가 반환한 각 아이템별 요약본 및 점수를 결합합니다.
5. 결과 데이터를 Next.js 캐시에 저장하여 (10~30분간 유지), 다음 요청 시에는 API 호출 없이 캐시된 데이터를 즉시 반환합니다.
6. React 클라이언트 컴포넌트가 대시보드 UI에 정렬/필터 옵션과 함께 렌더링합니다.

## 4. Future Considerations
- 특정 키워드에 대한 하이라이팅 또는 관심사 기반 사용자화 (예: 'React' 관련 글 점수 가중치 부여).
- 수집 소스 확장 (예: Dev.to, ProductHunt 등).

---
*문서 상태: V1.0 (최종 승인/설계 완료)*
