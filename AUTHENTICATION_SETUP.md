# OTP Authentication System Setup Guide

## Overview
This document outlines the implementation of OTP-based authentication with Gmail SMTP integration, profile completion page, and auto-submit OTP input functionality.

## Features Implemented

### 1. OTP Login via Gmail SMTP
- **Email Configuration**: Uses Gmail SMTP for sending OTP emails
- **OTP Generation**: Secure 6-digit OTP codes
- **Expiration**: OTP expires after 10 minutes
- **HTML Email Template**: Professional email design with OTP display

### 2. Profile Completion Page
- **Triggered After Signup**: New users are redirected to profile completion after OTP verification
- **Fields Collected**:
  - Full Name (required)
  - Age (13-120 years, required)
  - Gender (Male, Female, Other, Prefer not to say)
- **Database**: Information stored in MongoDB User model
- **One-Time Only**: Only shown to new users on first signup

### 3. Auto-Submit OTP Input
- **Component**: Reusable `OTPInput` component
- **Features**:
  - 6 individual input boxes (one per digit)
  - Auto-focus to next input on digit entry
  - Auto-submit when all digits filled
  - Backspace support to move to previous input
  - Arrow key navigation
  - Paste support for OTP codes
  - Visual feedback during verification
  - Responsive design

## Environment Variables Required

Add these to your `.env` file in the server directory:

```env
# Email Configuration
EMAIL_USER=your-gmail@gmail.com
EMAIL_PASS=your-app-specific-password

# JWT Tokens
ACCESS_TOKEN_SECRET=your-access-token-secret
REFRESH_TOKEN_SECRET=your-refresh-token-secret

# Database
MONGODB_URL=your-mongodb-connection-string

# Server
PORT=5000
```

### Gmail Setup Instructions:
1. Enable 2-Factor Authentication on your Gmail account
2. Generate an App Password (not your regular password)
3. Use the App Password in `EMAIL_PASS`

## Backend Changes

### 1. User Model (`server/models/userModel.js`)
- Added `age` field (Number)
- Added `isProfileComplete` field (Boolean, default: false)

### 2. OTP Controller (`server/controllers/otpController.js`)
- Enhanced `sendOtpEmail()` with HTML email template
- Updated `verifyOtp()` to return `isProfileComplete` status
- Proper error handling for email sending

### 3. User Controller (`server/controllers/userControl.js`)
- Updated `setupProfile()` to accept `age` field
- Sets `isProfileComplete` flag to true after profile setup

## Frontend Changes

### 1. New Components
- **OTPInput.jsx**: Reusable OTP input component with auto-submit
- **OTPInput.css**: Styling for OTP input boxes

### 2. Updated Components
- **VerifyOTP.jsx**: Refactored to use new OTPInput component
- **VerifyOTP.css**: New styling for verification page
- **AddInfo.jsx**: Enhanced with age field and improved UI
- **AddInfo.css**: Professional styling for profile completion
- **Signup.jsx**: Improved UI and error handling
- **Login.jsx**: Improved UI and error handling
- **Auth.css**: Shared styling for auth pages

## API Endpoints

### OTP Routes (`/api/otp`)
- `POST /signup` - Send OTP for signup
- `POST /login` - Send OTP for login
- `POST /verify` - Verify OTP and get access token

### User Routes (`/user`)
- `PUT /setup-profile` - Complete user profile (requires auth)
- `GET /information` - Get user info (requires auth)

## Authentication Flow

### Signup Flow:
1. User enters email → `/api/otp/signup`
2. OTP sent via Gmail SMTP
3. User enters OTP → `/api/otp/verify`
4. If new user: Redirect to `/add-info`
5. User completes profile → `/user/setup-profile`
6. Redirect to home page

### Login Flow:
1. User enters email → `/api/otp/login`
2. OTP sent via Gmail SMTP
3. User enters OTP → `/api/otp/verify`
4. If profile complete: Redirect to home page
5. If profile incomplete: Redirect to `/add-info`

## Testing the Implementation

### 1. Test Signup:
```bash
# Navigate to /signup
# Enter email address
# Check email for OTP
# Enter OTP (auto-submits when complete)
# Fill profile information
# Verify redirect to home page
```

### 2. Test Login:
```bash
# Navigate to /login
# Enter registered email
# Check email for OTP
# Enter OTP (auto-submits when complete)
# Verify redirect to home page
```

### 3. Test OTP Input Features:
- Type digits → auto-focus to next
- Paste OTP code → auto-fills and submits
- Use backspace → moves to previous input
- Use arrow keys → navigate between inputs

## File Structure

```
client/src/components/mainpages/auth/
├── OTPInput.jsx          (New)
├── OTPInput.css          (New)
├── VerifyOTP.jsx         (Updated)
├── VerifyOTP.css         (New)
├── AddInfo.jsx           (Updated)
├── AddInfo.css           (New)
├── Signup.jsx            (Updated)
├── Login.jsx             (Updated)
└── Auth.css              (New)

server/
├── models/userModel.js   (Updated)
├── controllers/
│   ├── otpController.js  (Updated)
│   └── userControl.js    (Updated)
└── routes/otpRouter.js   (Existing)
```

## Troubleshooting

### OTP not sending:
- Verify Gmail credentials in `.env`
- Check if 2FA is enabled on Gmail
- Ensure App Password is used (not regular password)
- Check server logs for email errors

### Profile not saving:
- Verify user is authenticated (token in localStorage)
- Check age validation (13-120)
- Verify all required fields are filled

### OTP not auto-submitting:
- Ensure all 6 digits are entered
- Check browser console for errors
- Verify OTPInput component is properly imported

## Security Considerations

1. **OTP Expiration**: Set to 10 minutes
2. **Token Storage**: Access token stored in localStorage
3. **Refresh Token**: Stored in httpOnly cookie
4. **Email Validation**: Basic email format validation
5. **Age Validation**: Minimum 13 years old

## Future Enhancements

- SMS OTP support
- Resend OTP functionality
- OTP rate limiting
- Email verification before OTP
- Two-factor authentication options

