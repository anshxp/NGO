# Production Security Requirements

This application handles donor, member, volunteer, beneficiary and financial information. The following controls are required before production launch.

## Secrets

- Never commit `.env` files or credentials.
- Rotate any credential that has ever appeared in Git history.
- Store production secrets in the hosting provider's secret manager.
- `JWT_SECRET` must be at least 32 random characters.
- Use a least-privilege MongoDB application user.

## Authentication

- Authentication cookies are HttpOnly and are not readable by browser JavaScript.
- Access tokens are short-lived.
- Production cookies use Secure and SameSite protection.
- Admin accounts should have MFA before launch.
- Password reset and email verification should use single-use, expiring tokens.

## Authorization

Every sensitive operation must enforce authorization on the server. Frontend route guards are not security boundaries.

Sensitive resources should also use resource-level ownership/assignment checks where applicable. Beneficiary data must not be exposed to public or ordinary member queries.

## API security

- Production CORS must contain only exact trusted frontend origins.
- Helmet/security headers are enabled.
- JSON and URL-encoded request bodies have size limits.
- Global and authentication rate limits are enabled.
- `/api` is the application API boundary.
- Production errors must not expose stack traces, database errors or internal implementation details.
- The application does not expose a GraphQL endpoint.

## Financial security

Payment completion must be determined by server-side gateway verification/webhooks, never by a frontend success flag.

Payment webhooks must be authenticated, signature-verified and idempotent. Paid donation records should be append-only from the application's perspective; refunds and corrections should be represented as auditable transactions.

## Auditability

Audit logs should capture administrative changes, membership approvals, certificate issuance, donation/refund actions, beneficiary changes, expense approvals and other privileged operations. Audit records must not be editable through ordinary application APIs.

## Database

Enable encrypted transport, restricted network access, least-privilege credentials, automated backups and tested restoration. Add indexes for frequently queried fields and monitor slow queries.

## CI/CD

Pull requests should run frontend lint/build, backend typecheck/build, dependency vulnerability scanning and automated tests. Production deployment should only occur from a protected branch after required checks pass.

## Incident response

Maintain a documented process for credential rotation, account compromise, payment discrepancies, data exposure, backup restoration and service recovery.

## Launch gate

Do not launch until:

- all P0 security findings are closed;
- payment flows have been tested with gateway sandbox/webhook scenarios;
- authorization tests cover every sensitive REST route;
- dependency and secret scans pass;
- backups have been restored successfully in a test environment;
- production HTTPS and cookie behavior have been verified;
- a security/penetration test has been completed for the public deployment.
