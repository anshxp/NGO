# Phase 1 — GraphQL Removal

Status: COMPLETE
Branch: `production-hardening`

## Scope

Standardize the production application on the intended MERN + REST/JSON architecture. GraphQL must not be part of runtime code, application dependencies, frontend API clients, generated runtime artifacts, or active operational documentation.

## Completed work

### Runtime and source

- Removed the legacy GraphQL backend source tree.
- Removed the legacy frontend GraphQL client.
- Removed the obsolete root GraphQL backend entrypoint.
- Confirmed the current `backend/src/index.ts` mounts REST routers only.
- Confirmed the active frontend API layer is `frontend/src/lib/apiClient.ts`.
- Migrated remaining identified frontend pages to REST service methods, including volunteer management and the user dashboard.
- Removed the stale backend lockfile that contained obsolete GraphQL/Apollo metadata.

### Documentation

Updated stale operational documentation to describe REST rather than the retired API architecture:

- `README.md`
- `GETTING_STARTED.md`
- `IMPLEMENTATION_GUIDE.md`
- `FEATURE_CHECKLIST.md`
- `PROJECT_SUMMARY.md`
- `DOCUMENTATION_INDEX.md`
- `VERIFICATION_REPORT.md`
- `VOLUNTEER_SYSTEM.md`
- `CONNECTION_FIX_SUMMARY.txt`
- `FRONTEND_BACKEND_FIXES.md`
- `SETUP_AND_TEST_GUIDE.md`
- `PRODUCTION_SECURITY.md`
- `API_TESTING_REPORT.md`
- `COMPLETION_REPORT.txt`

`GRAPHQL_API.md` is absent from the current branch.

## Current architecture

```text
React + Vite
      |
      | REST / JSON + HttpOnly JWT cookie
      v
Express + TypeScript
      |
      | Mongoose
      v
MongoDB
```

## Security model after Phase 1

- JWT authentication is delivered through an HttpOnly cookie.
- The frontend does not persist the JWT in localStorage.
- Protected REST routes enforce server-side authentication/authorization.
- CORS, request-size limits, rate limiting, Helmet and request-audit middleware remain active.

## Verification notes

Direct reads from the current `production-hardening` branch confirm the current runtime/source files are REST-based and that the known GraphQL source/client files are absent.

GitHub's code-search index may still return matches from older historical commit SHAs. Those search results are not current-branch files and must not be treated as evidence that GraphQL remains in the current tree.

## CI status

The repository workflow continues to run backend typecheck/build, frontend lint/build and high-severity npm audits. The code-level Phase 1 work is complete; dependency-audit remediation is tracked separately as production hardening and should not be masked by documentation claims.

## Exit criteria

- GraphQL runtime: removed
- GraphQL backend source tree: removed
- GraphQL frontend client: removed
- GraphQL endpoint: removed from active backend
- GraphQL dependency manifest: removed
- Stale GraphQL dependency lock metadata: removed
- Identified REST page migrations: complete
- Active documentation: REST-based

Phase 1 is complete. Phase 2 can now proceed with the planned TypeScript/TSX-to-JavaScript/JSX work without changing the MERN + REST architecture.
