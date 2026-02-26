# News Scrap (AI 기반 뉴스 자동 수집 및 요약 대시보드)

Hacker News, Reddit, GitHub 등 주요 개발자 커뮤니티의 최신 트렌드와 뉴스를 자동으로 수집하고, **OpenAI API**를 활용하여 내용을 요약하고 중요도를 평가하여 제공하는 대시보드 애플리케이션입니다.

## ✨ 주요 기능

- 🌐 **다중 소스 스크래핑**: Hacker News, Reddit, GitHub 등의 주요 최신 게시글과 트렌드 수집 (Cheerio 활용)
- 🤖 **AI 자동 요약 및 평가**: OpenAI를 이용해 수집된 기사의 핵심 내용을 한국어로 요약하고, 1~100점 척도로 중요도(Score)를 자동 산정
- 📊 **스마트 대시보드**: 수집된 뉴스를 한눈에 볼 수 있는 직관적인 UI 제공 (Lucide React 아이콘 적용)
- 🌙 **다크 모드 지원**: 사용자 시스템 환경에 맞춘 반응형 다크 모드 UI 구현 (Tailwind CSS v4)
- 🚀 **정적 사이트 최적화**: Next.js App Router를 활용한 빠른 페이지 렌더링 및 하이드레이션 문제 방지 처리

## 🛠 기술 스택

- **Framework**: [Next.js](https://nextjs.org/) 16.1.6 (App Router / Turbopack)
- **Library**: [React](https://react.dev/) 19, TypeScript
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) v4
- **AI & Scraping**: `openai` SDK, `cheerio`
- **Icons**: `lucide-react`

## ⚙️ 사전 요구사항 (Prerequisites)

이 프로젝트는 뉴스 요약 및 평가를 위해 OpenAI API를 사용합니다. 따라서 실행 전 **OpenAI API Key**가 반드시 필요합니다.

## 🚀 설치 및 실행 방법

1. **저장소 클론 및 폴더 이동**
   ```bash
   git clone <repository-url>
   cd news-scrap
   ```

2. **의존성(패키지) 설치**
   ```bash
   npm install
   # 또는 yarn install / pnpm install
   ```

3. **환경 변수 설정**
   루트 경로에 `.env.local` 파일을 생성하고 발급받은 OpenAI API Key를 입력합니다.
   (또는 기본 제공되는 `.env.example` 파일을 복사하여 사용할 수 있습니다.)
   ```bash
   # .env.local 파일 생성
   OPENAI_API_KEY=sk-your-openai-api-key-here
   ```
   
4. **개발 서버 실행**
   ```bash
   npm run dev
   # 또는 yarn dev / pnpm dev
   ```

5. **브라우저 접속**
   웹 브라우저에서 [http://localhost:3000](http://localhost:3000)으로 접속하여 결과를 확인합니다.

## 📦 빌드 및 배포 (Production)

애플리케이션을 프로덕션 환경에 배포하기 위해 최적화된 정적 빌드를 수행합니다. 빌드 과정에서 뉴스 데이터를 스크래핑하고 AI로 요약 및 렌더링을 수행하므로, CI/CD 혹은 서버 환경에도 `OPENAI_API_KEY` 환경 변수가 설정되어 있어야 정상적으로 빌드됩니다.

```bash
# 프로덕션 빌드 생성
npm run build

# 프로덕션 서버 실행
npm run start
```

## 🐳 Docker 배포

이 프로젝트는 빌드 시점에 `OPENAI_API_KEY`가 필요합니다. 따라서 Docker 빌드에도 동일한 키를 전달해야 합니다.

### 1) Docker 이미지 빌드 + 실행

```bash
# 빌드 (빌드 시점 키 주입)
docker build \
  --build-arg OPENAI_API_KEY=$OPENAI_API_KEY \
  -t news-scrap:latest .

# 실행 (런타임 키 주입)
docker run -d \
  --name news-scrap \
  -p 3000:3000 \
  -e OPENAI_API_KEY=$OPENAI_API_KEY \
  news-scrap:latest
```

### 2) Docker Compose 실행

프로젝트 루트에 `.env` 파일을 만들고 아래 값을 설정하세요.

```bash
OPENAI_API_KEY=sk-your-openai-api-key-here
```

그 다음 실행합니다.

```bash
docker compose up --build -d
```

중지/정리:

```bash
docker compose down
```
