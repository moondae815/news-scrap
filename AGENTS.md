# AI Agent Guidelines (`AGENTS.md`)

Welcome to the `news-scrap` repository! You are an autonomous AI coding agent. When operating within this repository, strictly adhere to the following conventions and guidelines.

## 1. Project Overview & Tech Stack
- **Framework**: Next.js 16.1 (App Router)
- **Language**: TypeScript 5 (Strict Mode)
- **UI/Styling**: React 19, Tailwind CSS v4, Lucide React (Icons)
- **Key Libraries**: Cheerio (Scraping), OpenAI (Summarization/Scoring)
- **Architecture**: `src/app` (Routes), `src/components` (UI), `src/lib` (Data fetching/Logic), `src/types` (Shared types).

## 2. CLI Commands (Build, Lint, Test)
This project currently relies on Next.js build and linting tools. There is no dedicated unit testing framework (like Jest or Vitest) installed yet.

### Development & Build
- **Run dev server**: `npm run dev`
- **Run production build**: `npm run build` (This runs TypeScript type checking and builds static pages. Use this to verify your changes won't break the build).
- **Start production server**: `npm run start`

### Linting & Formatting
- **Run ESLint**: `npm run lint` (Uses `eslint-config-next/core-web-vitals` and `typescript`).
- **Formatting**: Rely on Next.js default formatting/linting rules. If adding a file, format it cleanly with standard 2-space indentation.

### Testing
- **Since there are no tests**: To "test" a change, verify via `lsp_diagnostics` tool on the changed file, then run `npm run build`. 
- **Local Verification**: If the user asks to test locally, either execute a test file via Node directly `npx tsx <file>` (if applicable) or verify Next.js builds successfully.

## 3. Code Style & Conventions

### 3.1 Next.js App Router Patterns
- **Server vs Client Components**: 
  - Default to **Server Components** (`async function Component()`).
  - Add `'use client'` at the absolute top of the file *only* when React hooks (`useState`, `useEffect`, `useMemo`) or browser APIs are required (e.g., `src/components/ClientDashboard.tsx`).
- **Data Fetching**: 
  - Use Next.js `unstable_cache` or standard `fetch` with `revalidate` options for ISR (Incremental Static Regeneration).
  - Avoid fetching data directly inside Client Components if possible; fetch on the Server and pass down via props.
- **Loading States**: 
  - Use `<Suspense>` boundaries with skeleton fallbacks (e.g., `SkeletonDashboard.tsx`) to avoid blocking the initial page render.
  - Implement `loading.tsx` in `src/app` for route-level loading.

### 3.2 TypeScript & Typing
- **Strict Mode**: Enable strict typing. Avoid `any`. Never suppress type errors with `@ts-ignore`, `@ts-expect-error`, or `as any` unless absolutely necessary and documented.
- **Types Directory**: Place shared types/interfaces (e.g., `AIProcessedItem`, `RawFeedItem`) inside `src/types/index.ts` rather than keeping them inline.
- **Component Props**: Define props via `interface Props { ... }` directly above the component function.

### 3.3 Imports
- **Path Aliases**: You can use the `@/` path alias mapped to `./src/` (configured in `tsconfig.json`). 
- **Consistency**: If the file you are editing uses relative imports (e.g., `import { fetchHackerNews } from '../lib/hackernews'`), follow the existing file's style.
- **Order**:
  1. Built-in React/Next.js modules (`react`, `next/link`)
  2. External dependencies (`openai`, `lucide-react`)
  3. Internal path aliases or relative imports (`@/components/...` or `../types`)
  4. Styles (`./globals.css`)

### 3.4 UI & Styling (Tailwind CSS v4)
- **Classes**: Use Tailwind classes for all styling. Avoid custom CSS files unless extending global variables in `globals.css`.
- **Dark Mode**: Always implement dark mode variants using the `dark:` prefix (e.g., `bg-white dark:bg-gray-800`).
- **Responsiveness**: Ensure mobile-first responsive design using `sm:`, `md:`, `lg:` prefixes.
- **Icons**: Import from `lucide-react` (e.g., `<Newspaper className="w-5 h-5 text-blue-500" />`).

### 3.5 Naming Conventions
- **Files & Folders**: 
  - React components: PascalCase (e.g., `NewsCard.tsx`, `ClientDashboard.tsx`).
  - Next.js routing files: strictly lowercase (e.g., `page.tsx`, `layout.tsx`, `loading.tsx`).
  - Utility/Library files: camelCase or kebab-case (e.g., `hackernews.ts`, `aggregate.ts`).
- **Variables & Functions**: camelCase (e.g., `fetchReddit`, `processedItems`).
- **Interfaces/Types**: PascalCase (e.g., `APIResponse`, `RawFeedItem`).

### 3.6 Error Handling & Fallbacks
- **Graceful Degradation**: Do not crash the app on external API failures (e.g., Reddit API timeout or OpenAI key missing). 
- **Return Null/Empty**: Return empty arrays `[]` or fallback data and log a warning via `console.warn(...)` instead of throwing unhandled exceptions. Example:
  ```typescript
  if (!process.env.OPENAI_API_KEY) {
    console.warn('OPENAI_API_KEY is not set. Skipping AI processing.');
    return items.map(item => ({ ...item, summary: 'AI summary disabled', importanceScore: 0 }));
  }
  ```
- **Try/Catch**: Wrap external fetching logic in `try/catch` blocks.

## 4. Work Protocol & Agent Behavior
1. **Explore First**: If you need to modify unfamiliar logic, use `bash` or `explore` to `cat` or `grep` related files (`src/lib/`, `src/types/`).
2. **Atomic Changes**: Modify only what is necessary to accomplish the user's task. Do not preemptively refactor surrounding code unless explicitly requested.
3. **Verify Before Completion**:
   - Run `lsp_diagnostics` on any file you edit.
   - Run `npm run build` to verify Next.js successfully compiles and TypeScripts checks pass.
4. **Use Todos**: Break down complex requests into a checklist using the `todowrite` tool. Track progress obsessively.
