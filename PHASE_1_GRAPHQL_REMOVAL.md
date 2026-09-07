# Phase 1 — GraphQL Removal

Status: COMPLETE

Branch: `production-hardening`

## Scope

The production architecture is MERN + REST/JSON only. GraphQL must not be part of runtime code, dependencies, generated artifacts, frontend API clients, or active documentation.

## Verification performed

- `backend/src/graphql/resolvers/index.ts` is absent from `production-hardening`.
- `frontend/src/lib/graphqlClient.ts` is absent from `production-hardening`.
- The obsolete root `backend/index.ts` GraphQL entrypoint is absent from `production-hardening`.
- The current `backend/src/index.ts` mounts the REST routers under `/api` and does not mount `/graphql`.
- The current backend `package.json` contains no GraphQL runtime dependency.
- The stale `backend/package-lock.json`, which contained obsolete GraphQL/Apollo dependency metadata, was removed so it cannot reintroduce those packages during installation.
- README documentation was rewritten to describe the actual REST architecture and explicitly state that GraphQL is not part of the application.
- `GRAPHQL_API.md` is absent from the target branch.

## Architecture after Phase 1

```text
React frontend
      |
      | REST / JSON
      v
Express backend
      |
      | Mongoose
      v
MongoDB
```

## Compatibility rule

No feature was intentionally removed as part of this phase. Existing REST routers remain the application API surface. TypeScript migration is intentionally deferred to Phase 2.

## Important note about dependency installation

The obsolete backend lockfile was removed because it contained stale GraphQL dependency metadata. A fresh lockfile should be generated after the TypeScript-to-JavaScript migration in Phase 2, once the final dependency set is established.

## Exit criteria

- GraphQL runtime: removed
- GraphQL source tree: removed
- GraphQL client: removed
- GraphQL endpoint: removed
- GraphQL dependency lock metadata: removed
- Active documentation: REST-based

Phase 1 is complete. Phase 2 can now begin: TypeScript/TSX to JavaScript/JSX.