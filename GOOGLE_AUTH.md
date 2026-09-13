# Google authentication and persistent user data

Carbon-Connect supports Google sign-in for buyer and seller workspaces. The browser receives a Google Identity Services credential, the API verifies the ID token against `GOOGLE_CLIENT_ID`, and the API creates or reuses a user and organization membership before issuing the normal Carbon-Connect signed session token.

## Google Cloud setup

Create a Google OAuth 2.0 **Web application** client in Google Cloud Console. Add each deployed frontend origin to **Authorized JavaScript origins**, including the Vercel production URL, the Render static-site URL if used, and local development origins such as `http://localhost:5173`. No Google redirect URI is required for the popup credential flow used by this application.

## Required variables

Set the same client ID in both the API and frontend environments:

```env
GOOGLE_CLIENT_ID=your-google-web-client-id.apps.googleusercontent.com
VITE_GOOGLE_CLIENT_ID=your-google-web-client-id.apps.googleusercontent.com
```

`VITE_GOOGLE_CLIENT_ID` is compiled into the frontend and is not a secret. `GOOGLE_CLIENT_ID` is used by the API to verify the token audience. Do not place a Google client secret in this repository or frontend environment.

## User data persistence

Google accounts are identified by the verified Google subject identifier and email. A first-time buyer or seller receives an active organization workspace and membership. Subsequent sign-ins reuse that user and organization.

The API persists RFQs, bids, and bid awards in PostgreSQL. The frontend stores the authenticated session and user-scoped profile, document, RFQ, and bid fallback state under a key containing the authenticated user ID. This prevents one browser user's local demo state from appearing in another user's workspace. Production records should use the API and PostgreSQL as the source of truth.

## Admin access

Google self-provisioning is intentionally limited to buyer and seller roles. Platform-admin access must be granted through an existing administrative account or an explicit database/admin workflow; users cannot create an admin account by selecting a role in the browser.

## Local test behavior

Without `VITE_GOOGLE_CLIENT_ID`, the Google button is hidden and the login screen explains that deployment configuration is required. Password demo login remains available for local and hackathon testing. With both variables configured and a valid Google credential, `/api/v1/auth/google` verifies the credential and returns the normal Carbon-Connect session token.
