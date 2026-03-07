# Google OAuth Setup Guide for Restaurant Avis

## Prerequisites

- A Google account
- Access to Google Cloud Console (https://console.cloud.google.com)

---

## Step 1: Create or Select a Google Cloud Project

1. Go to https://console.cloud.google.com
2. Click on the project selector (top-left, next to "Google Cloud")
3. Click "New Project" or select an existing one
4. Name it (e.g., "Restaurant Avis") and click "Create"

---

## Step 2: Enable the Google+ API (if not already enabled)

1. Go to "APIs & Services" > "Library"
2. Search for "Google+ API" or "Google Identity"
3. Click "Enable"

---

## Step 3: Configure the OAuth Consent Screen

1. Go to "APIs & Services" > "OAuth consent screen"
2. Select "External" user type, click "Create"
3. Fill in the required fields:

```
App name:           Restaurant Avis
User support email: your-email@gmail.com
Developer contact:  your-email@gmail.com
```

4. Click "Save and Continue"
5. On "Scopes" page, add:
   - `.../auth/userinfo.email`
   - `.../auth/userinfo.profile`
   - `openid`
6. Click "Save and Continue"
7. On "Test users" page, add your email for testing (while in "Testing" status)
8. Click "Save and Continue"

**IMPORTANT:** If the app is in "Testing" status, only test users can sign in.
To allow all users, click "Publish App" on the OAuth consent screen page.

---

## Step 4: Create OAuth 2.0 Credentials

1. Go to "APIs & Services" > "Credentials"
2. Click "+ CREATE CREDENTIALS" > "OAuth client ID"
3. Select "Web application"
4. Name it: "Restaurant Avis Web Client"

### Authorized JavaScript Origins

Add the following origins (one per line):

```
https://restaurant-avis.vercel.app
http://localhost:3000
http://localhost:3001
```

### Authorized Redirect URIs

**THIS IS THE MOST CRITICAL PART. The redirect_uri_mismatch error occurs when
these URIs do not match exactly what NextAuth sends.**

Add the following URIs (one per line):

```
https://restaurant-avis.vercel.app/api/auth/callback/google
http://localhost:3000/api/auth/callback/google
http://localhost:3001/api/auth/callback/google
```

5. Click "Create"
6. Copy the **Client ID** and **Client Secret**

---

## Step 5: Configure Environment Variables

### Local Development (.env.local)

```env
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=<generate with: openssl rand -base64 32>
GOOGLE_CLIENT_ID=199233574349-ujcb554p04bcdcg866tg2nn0s350ijq6.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=GOCSPX-xxxxxxxxxxxxxxxxxxxxxxx
```

### Vercel Production

Set these in Vercel Dashboard > Project Settings > Environment Variables,
or via CLI:

```bash
echo "https://restaurant-avis.vercel.app" | vercel env add NEXTAUTH_URL production
echo "<your-secret>" | vercel env add NEXTAUTH_SECRET production
echo "<your-client-id>" | vercel env add GOOGLE_CLIENT_ID production
echo "<your-client-secret>" | vercel env add GOOGLE_CLIENT_SECRET production
```

**IMPORTANT:** NEXTAUTH_URL must NOT have a trailing slash.
Correct:   https://restaurant-avis.vercel.app
Incorrect: https://restaurant-avis.vercel.app/

---

## Step 6: Redeploy After Changes

After updating environment variables on Vercel, you must redeploy:

```bash
vercel --prod
```

Or trigger a redeploy from the Vercel Dashboard.

---

## Troubleshooting

### Error 400: redirect_uri_mismatch

This means Google does not recognize the redirect URI being sent.

1. Go to Google Cloud Console > Credentials > Your OAuth Client
2. Verify that the **Authorized redirect URIs** contain EXACTLY:
   `https://restaurant-avis.vercel.app/api/auth/callback/google`
3. Make sure there are no trailing slashes or extra spaces
4. Wait 5 minutes after saving -- Google can take time to propagate changes

### Error: "Access blocked: This app's request is invalid"

The OAuth consent screen may not be configured or the app is not published.

### Callback returns to sign-in page without error

Check that NEXTAUTH_SECRET is set in production.

---

## Verification

Test the OAuth flow with these endpoints:

```
GET https://restaurant-avis.vercel.app/api/auth/providers
--> Should return: { "google": { "callbackUrl": "https://restaurant-avis.vercel.app/api/auth/callback/google" } }

GET https://restaurant-avis.vercel.app/api/auth/csrf
--> Should return: { "csrfToken": "..." }
```

If both return valid responses, the NextAuth configuration is correct.
The remaining issue is on the Google Cloud Console side (redirect URIs).
