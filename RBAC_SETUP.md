# NGO RBAC Setup

The application supports exactly two login roles:

- `admin`: administrative dashboard and `/api/admin/*` APIs.
- `volunteer`: volunteer dashboard and authenticated volunteer features.

Public registration always creates a `volunteer` account. The API ignores any client-supplied role; users cannot self-register as administrators. Frontend route guards improve navigation, while the Express middleware remains the security boundary for admin APIs.

## Upgrade existing database records

Back up MongoDB first. From the `backend` directory, run:

```bash
npm run migrate:roles
```

This converts legacy roles other than `admin` and `volunteer` to `volunteer`. Existing admin accounts remain admins. Review the affected accounts before deploying this change.

## Create the first administrator

Set these environment variables in the backend process environment (do not commit real values to Git):

- `ADMIN_NAME`
- `ADMIN_EMAIL`
- `ADMIN_PASSWORD` (at least 12 characters)
- `ADMIN_PHONE`

Then, from the `backend` directory, run:

```bash
npm run create:admin
```

The script creates a new verified admin account and refuses to promote or overwrite an existing account with the same email. In production, the first login requires authenticator-based MFA setup. Keep the administrator password out of shell history where possible and clear the environment variables after provisioning.

## Login flow

- Volunteers register at `/register`, verify their email, then sign in at `/login`. They are redirected to `/volunteer`.
- Admins use the same `/login` page and are redirected to `/admin`; production MFA is required.
- Both roles use the HttpOnly `ngo_access_token` cookie. Logout invalidates the current token version.
- Directly visiting an admin route as a volunteer redirects to `/volunteer`. Requests to admin APIs are independently denied by server-side role middleware.

## Verification checklist

1. Register and verify a volunteer account; confirm its database role is `volunteer`.
2. Confirm volunteer login lands at `/volunteer`.
3. Confirm a volunteer cannot view admin pages or call `/api/admin/*` successfully.
4. Provision an admin through the CLI; in production, complete MFA and confirm login lands at `/admin`.
5. Confirm the admin can access admin APIs and logout invalidates the session.
