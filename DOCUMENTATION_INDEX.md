# NGO Management System - Documentation Index

## Core documentation

| Document | Purpose |
|---|---|
| `README.md` | Project overview, architecture, setup and security baseline |
| `GETTING_STARTED.md` | Local setup, REST smoke tests and troubleshooting |
| `IMPLEMENTATION_GUIDE.md` | Detailed implementation and REST route architecture |
| `DEPLOYMENT.md` | Production deployment and infrastructure guidance |
| `PROJECT_SUMMARY.md` | Current project architecture and feature summary |
| `FEATURE_CHECKLIST.md` | Current feature and validation checklist |
| `VOLUNTEER_SYSTEM.md` | Volunteer REST API and administration |
| `PRODUCTION_SECURITY.md` | Production security controls and requirements |
| `API_TESTING_REPORT.md` | Historical API testing record; verify against current REST routes before relying on its results |
| `PHASE_0_BASELINE.md` | Phase 0 baseline record |
| `PHASE_1_GRAPHQL_REMOVAL.md` | Phase 1 architecture-removal record |

## Recommended reading order

1. `README.md`
2. `GETTING_STARTED.md`
3. `IMPLEMENTATION_GUIDE.md`
4. `DEPLOYMENT.md`
5. `PRODUCTION_SECURITY.md`
6. `FEATURE_CHECKLIST.md`

## Architecture

```text
React + Vite
     |
     | REST / JSON
     v
Express + TypeScript
     |
     | Mongoose
     v
MongoDB
```

The current production architecture does not use GraphQL. The old GraphQL API document and runtime source tree were removed during Phase 1.

## Documentation policy

Operational documentation must describe the current implementation rather than historical experiments. Historical reports are retained only when they are clearly labeled as historical and must not be used as current API specifications.
