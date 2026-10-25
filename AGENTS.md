<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# Vaultex Project Guidelines

- This is a Next.js App Router project using TypeScript and React. Follow existing patterns in `app/` and `lib/`.
- Use `npm ci` to install from the lockfile. Validate changes with `npm run lint` and `npm run build`.
- Supabase app access uses the Supabase project API URL and anon key through `lib/supabase.ts`; a direct PostgreSQL `DATABASE_URL` is not a substitute.
- Keep `.env` values and service-role keys private. Service-role keys must remain server-side and must never use a `NEXT_PUBLIC_` variable.
- If an integration is unconfigured, make that state explicit; do not report a database write or external action as successful when it was skipped or failed.
