# Google OAuth Setup Guide

## Overview
This application now supports Google Sign-In/Sign-Up for customer authentication. Users can register and login using their Google account.

## Backend Implementation

### 1. Environment Configuration
Add the following to your `.env` file:
```env
GOOGLE_CLIENT_ID=751179487781-qu3nvi1romq3og5aqphdlg5ki76pb6ti.apps.googleusercontent.com
FRONTEND_URL=http://localhost:5173
```

### 2. API Endpoint
**POST** `/api/customers/google-register`

**Request Body:**
```json
{
  "name": "User Name",
  "email": "user@gmail.com",
  "googleId": "google-unique-id",
  "avatarUrl": "https://lh3.googleusercontent.com/..."
}
```

**Response (Success - New User):**
```json
{
  "success": true,
  "message": "Registration successful",
  "token": "jwt-token-here",
  "userId": "CUS-12345",
  "user": {
    "userId": "CUS-12345",
    "name": "User Name",
    "email": "user@gmail.com",
    "role": "customer"
  }
}
```

**Response (Success - Existing User):**
```json
{
  "success": true,
  "message": "Login successful",
  "token": "jwt-token-here",
  "userId": "CUS-12345",
  "user": {
    "userId": "CUS-12345",
    "name": "User Name",
    "email": "user@gmail.com",
    "role": "customer"
  }
}
```

### 3. How It Works

#### For New Users:
1. User clicks "Sign in with Google" on the login page
2. Google OAuth popup appears and user authenticates
3. Frontend receives Google credential and decodes it
4. Frontend sends user data to `/api/customers/google-register`
5. Backend checks if user exists by googleId or email
6. If new user:
   - Generates random password
   - Creates user with `isVerified: true`
   - Sends welcome email
   - Returns JWT token
7. Frontend stores token and redirects to dashboard

#### For Existing Users:
1. User clicks "Sign in with Google"
2. Backend finds existing user by googleId or email
3. If user exists but doesn't have googleId, it's added
4. Returns JWT token for authentication
5. User is logged in

### 4. Security Features
- Users registered via Google are automatically verified (`isVerified: true`)
- Random password generated for security (users can reset if needed)
- JWT token with 7-day expiration (or as configured in `JWT_EXPIRES_IN`)
- Google ID stored for future authentication
- Lead source tracked as `google-auth`

## Frontend Implementation

### 1. Dependencies
The frontend uses `@react-oauth/google` library:
```bash
npm install @react-oauth/google jwt-decode
```

### 2. Google OAuth Provider
The login page is wrapped with `GoogleOAuthProvider`:
```jsx
<GoogleOAuthProvider clientId='751179487781-qu3nvi1romq3og5aqphdlg5ki76pb6ti.apps.googleusercontent.com'>
  {/* Login form and Google button */}
</GoogleOAuthProvider>
```

### 3. Google Login Button
```jsx
<GoogleLogin
  onSuccess={handleGoogleLoginSuccess}
  onError={handleGoogleLoginError}
  size='large'
  text='signin_with'
/>
```

### 4. Authentication Context
The `CustomerAuthContext` provides a `googleLogin` method that:
1. Sends user data to backend
2. Receives JWT token
3. Stores token in localStorage as 'customerToken'
4. Fetches user dashboard data
5. Returns success/failure status

## Google Cloud Console Setup

### Fix "The given origin is not allowed" Error

1. **Go to Google Cloud Console**: https://console.cloud.google.com

2. **Navigate to Credentials**:
   - APIs & Services → Credentials

3. **Select your OAuth 2.0 Client ID**:
   - Find: `751179487781-qu3nvi1romq3og5aqphdlg5ki76pb6ti.apps.googleusercontent.com`

4. **Add Authorized JavaScript Origins**:
   ```
   http://localhost:5173
   http://127.0.0.1:5173
   ```

5. **Add Authorized Redirect URIs** (if needed):
   ```
   http://localhost:5173
   http://127.0.0.1:5173
   ```

6. **Save Changes**

7. **Wait 5 minutes** for changes to propagate

### For Production:
Add your production domain:
```
https://yourdomain.com
https://www.yourdomain.com
```

## Testing the Implementation

### 1. Start the Backend
```bash
cd Finshelter-Backend/tax-backend-main
node server.js
```

### 2. Start the Frontend
```bash
cd Finshelter_Frontend
npm run dev
```

### 3. Test New User Registration
1. Navigate to: http://localhost:5173/customer-login
2. Click "Sign in with Google"
3. Select a Google account (use one not previously registered)
4. Should redirect to dashboard
5. Check MongoDB - new user should have:
   - `googleId` field populated
   - `isVerified: true`
   - `leadSource: "google-auth"`
   - Random password hash

### 4. Test Existing User Login
1. Clear localStorage
2. Click "Sign in with Google" again with same account
3. Should login successfully with existing account
4. Token stored in localStorage
5. Redirected to dashboard

### 5. Test Email Integration
- New users should receive welcome email at their Google email address
- Check spam folder if email doesn't arrive
- Email sent via Gmail SMTP (configured in .env)

## Troubleshooting

### Error: "The given origin is not allowed"
**Solution**: Add http://localhost:5173 to authorized origins in Google Cloud Console

### Error: "Token not received from server"
**Solution**: Check backend logs - ensure JWT_SECRET is set in .env

### User exists but Google Sign-In fails
**Solution**: Backend will link Google account to existing email

### Welcome email not sent
**Solution**: Check EMAIL_USER and EMAIL_PASS in .env are uncommented and correct

### MongoDB Connection Error
**Solution**: Verify MONGO_URI in .env is correct

## Database Schema Updates

### User Model Fields for Google OAuth:
```javascript
{
  googleId: { type: String, unique: true, sparse: true },
  avatarUrl: { type: String },
  isVerified: { type: Boolean, default: false },
  leadSource: { type: String }
}
```

## API Integration Summary

**Endpoint**: `POST /api/customers/google-register`

**Flow**:
1. Frontend gets Google credential
2. Decodes JWT to extract user info
3. Sends to backend: name, email, googleId, avatarUrl
4. Backend creates/updates user
5. Returns JWT token
6. Frontend stores token and authenticates

**Token Storage**: localStorage key `customerToken`

**Navigation**: After success → `/customers/dashboard/{email}`

## Security Notes

- Google users are auto-verified (no email verification needed)
- Random password prevents unauthorized password-based login
- JWT token has configurable expiration
- Google ID is unique and indexed in database
- Avatar URL stored for profile pictures
- All Google sign-ins tracked with leadSource

## Next Steps

1. ✅ Ensure Google Cloud Console has correct authorized origins
2. ✅ Test with new Google account
3. ✅ Test with existing email account
4. ✅ Verify welcome email is sent
5. ✅ Check dashboard loads correctly after OAuth login
