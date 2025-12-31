# Login OTP Verification Implementation

## Overview
Implemented email-based OTP verification after login using Nodemailer. Users now receive a 6-digit OTP to their email after entering correct credentials.

## Backend Changes

### 1. Database Schema (userModel.js)
Added OTP fields to User model:
- `loginOTP`: String - stores the 6-digit OTP
- `loginOTPExpires`: Date - OTP expiry time (10 minutes)
- `isVerified`: Boolean - tracks if user email is verified

### 2. Controllers (customerController.js)

#### loginUser (Modified)
- Validates email and password
- Generates 6-digit OTP
- Stores OTP with 10-minute expiry
- Sends OTP email using Gmail SMTP
- Returns `requiresOTP: true` instead of JWT token

#### verifyLoginOTP (New)
- Validates OTP code
- Checks OTP expiry
- Marks user as verified
- Clears OTP fields
- Returns JWT token for authenticated session

#### resendLoginOTP (New)
- Generates new OTP
- Updates expiry time
- Sends fresh OTP email

### 3. Routes (customerRoutes.js)
Added new endpoints:
- `POST /api/customers/verify-login-otp` - Verify OTP and get token
- `POST /api/customers/resend-login-otp` - Resend OTP

## Frontend Changes

### 1. New Component: LoginOTPVerification.jsx
Full-featured OTP verification page:
- 6-digit OTP input field
- 10-minute countdown timer
- Resend OTP functionality
- Auto-redirect to dashboard on success
- Error handling and validation

### 2. Updated CustomerLoginPage.jsx
- Modified `handleSubmit` to check for `requiresOTP` flag
- Redirects to OTP page instead of dashboard
- Passes email via navigation state

### 3. Updated CustomerAuthContext.jsx
- Modified `login` function to handle OTP flow
- Returns `requiresOTP` flag when backend requires verification
- Maintains backward compatibility

### 4. Updated App.jsx
- Added route: `/verify-login-otp`
- Imported `LoginOTPVerification` component

## User Flow

1. **Login Page**
   - User enters email and password
   - Clicks "Login"

2. **OTP Generation**
   - Backend validates credentials
   - Generates 6-digit OTP
   - Sends email with OTP
   - Returns success with `requiresOTP: true`

3. **OTP Verification Page**
   - User receives email with OTP
   - Enters 6-digit code
   - 10-minute timer counts down
   - Can resend OTP if needed

4. **Dashboard Access**
   - Backend validates OTP
   - Returns JWT token
   - User redirected to dashboard
   - Token stored in localStorage

## Email Template

OTP emails include:
- User's name
- 6-digit OTP (large, centered)
- Validity period (10 minutes)
- Professional styling
- Security notice

## Security Features

- ✅ OTP expires after 10 minutes
- ✅ OTP cleared after successful verification
- ✅ OTP cleared after expiry
- ✅ Rate limiting possible with resend timer
- ✅ Secure email delivery via Gmail SMTP
- ✅ No token issued without OTP verification

## Environment Variables Required

```env
EMAIL_USER=your-gmail@gmail.com
EMAIL_PASS=your-app-password
JWT_SECRET=your-jwt-secret
```

## Testing

1. **Login with valid credentials**
   - Should receive OTP email
   - Should redirect to OTP page

2. **Enter correct OTP**
   - Should verify successfully
   - Should redirect to dashboard

3. **Enter wrong OTP**
   - Should show error message
   - Should not grant access

4. **Wait for OTP expiry**
   - Should show expired message
   - Should allow resend

5. **Resend OTP**
   - Should generate new OTP
   - Should send new email
   - Should reset timer

## API Endpoints

### Login
```
POST /api/customers/user-login
Body: { email, password }
Response: { success: true, requiresOTP: true, email, message }
```

### Verify OTP
```
POST /api/customers/verify-login-otp
Body: { email, otp }
Response: { success: true, token, user }
```

### Resend OTP
```
POST /api/customers/resend-login-otp
Body: { email }
Response: { success: true, message }
```

## Files Modified

**Backend:**
- `models/userModel.js` - Added OTP fields
- `controllers/customerController.js` - Added OTP logic
- `routes/customerRoutes.js` - Added OTP routes

**Frontend:**
- `src/Customer/LoginOTPVerification.jsx` - New component
- `src/Customer/CustomerLoginPage.jsx` - Modified login flow
- `src/Customer/CustomerAuthContext.jsx` - Updated login function
- `src/App.jsx` - Added OTP route

## Benefits

✅ **Enhanced Security** - Two-factor verification
✅ **Email Verification** - Confirms user owns the email
✅ **Better UX** - Clear feedback and timer
✅ **Flexible** - Easy to extend for SMS OTP
✅ **Clean Code** - Modular and maintainable

## Next Steps (Optional)

- Add SMS OTP as alternative
- Implement rate limiting
- Add OTP attempt tracking
- Add device trust feature
- Implement "Remember this device"
