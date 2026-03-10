# AGENTS.md

## Cursor Cloud specific instructions

### Repository overview

**Clarity** is a Strategic Intelligence & Go-To-Market Operating System. The repo contains:

- **Client:** React 19 + Vite 7 + TypeScript + Zustand (`src/`)
- **Server:** Express 5 API with Perplexity research integration (`server/`)
- **Prototype:** Static HTML prototype (`clarity.html`) and PRD (`prd.md`)

### Running the application

Standard npm scripts — see `package.json`:

| Command | What it does |
|---------|-------------|
| `npm run dev` | Starts both client (Vite, port 4173) and server (Express, port 8787) via `concurrently` |
| `npm run build` | Runs `tsc -b && vite build`; output in `dist/` |
| `npm run lint` | Runs ESLint across all `.ts`/`.tsx` files |

### Architecture notes

- Vite proxies `/api` requests to `http://127.0.0.1:8787` (Express server).
- The server uses the Perplexity API when `PERPLEXITY_API_KEY` is set; otherwise it returns fallback research data (app is fully functional without the key).
- Path alias `@/` maps to `src/` (configured in both `tsconfig.app.json` and `vite.config.ts`).

### Gotchas

- The Express server file (`server/index.mjs`) is plain JS (not TypeScript) and uses `node --watch` for hot reloading. If you add new npm dependencies used by the server, you must restart the server process manually.
- The static prototype (`clarity.html`) includes a modal overlay that may render on top of other content on first load. Navigate to a different page section via the left sidebar rather than modifying the file.
- TypeScript strict mode is enabled with `noUnusedLocals` and `noUnusedParameters` — any new code must satisfy these checks.
