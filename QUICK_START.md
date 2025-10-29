# Quick Start Guide - OTP Authentication

## 1. Configure Gmail SMTP

### Step 1: Enable 2-Step Verification
1. Go to [myaccount.google.com](https://myaccount.google.com)
2. Click "Security" in the left menu
3. Enable "2-Step Verification"

### Step 2: Generate App Password
1. Go back to Security settings
2. Find "App passwords" (appears after 2FA is enabled)
3. Select "Mail" and "Windows Computer"
4. Google will generate a 16-character password
5. Copy this password

### Step 3: Update .env File
Create or update `.env` in the server directory:

```env
EMAIL_USER=your-gmail@gmail.com
EMAIL_PASS=xxxx xxxx xxxx xxxx
ACCESS_TOKEN_SECRET=your-secret-key-here
REFRESH_TOKEN_SECRET=your-secret-key-here
MONGODB_URL=your-mongodb-connection-string
PORT=5000
```

## 2. Start the Application

### Terminal 1 - Start Backend
```bash
cd server
npm install  # if not already installed
npm run dev
```

### Terminal 2 - Start Frontend
```bash
cd client
npm install  # if not already installed
npm run dev
```

The app will be available at `http://localhost:5173`

## 3. Test the Authentication Flow

### Test Signup:
1. Navigate to `http://localhost:5173/signup`
2. Enter your email address
3. Click "Send OTP"
4. Check your email for the OTP
5. Enter the 6-digit code (it will auto-submit when complete)
6. Fill in your profile:
   - Full Name
   - Age (13-120)
   - Gender
7. Click "Complete Profile"
8. You'll be redirected to the home page

### Test Login:
1. Navigate to `http://localhost:5173/login`
2. Enter the same email
3. Click "Send OTP"
4. Check your email for the OTP
5. Enter the 6-digit code (auto-submits)
6. You'll be redirected to the home page (no profile page this time)

## 4. Test OTP Input Features

### Auto-Submit:
- Type all 6 digits → automatically submits

### Paste OTP:
- Copy OTP from email
- Click on first input box
- Paste (Ctrl+V or Cmd+V)
- OTP auto-fills and submits

### Backspace Navigation:
- Press backspace on empty input → moves to previous input
- Press backspace on filled input → clears it

### Arrow Keys:
- Left arrow → move to previous input
- Right arrow → move to next input

## 5. Troubleshooting

### OTP Not Sending
**Problem**: Email not received
**Solution**:
- Check spam/junk folder
- Verify EMAIL_USER and EMAIL_PASS in .env
- Ensure 2FA is enabled on Gmail
- Check server logs for errors

### Profile Not Saving
**Problem**: Error when completing profile
**Solution**:
- Ensure age is between 13-120
- All fields are filled
- Check browser console for errors
- Verify token is in localStorage

### OTP Not Auto-Submitting
**Problem**: Need to click submit button
**Solution**:
- Ensure all 6 digits are entered
- Check browser console for JavaScript errors
- Try refreshing the page
- Clear browser cache

### CORS Errors
**Problem**: "Access to XMLHttpRequest blocked"
**Solution**:
- Ensure backend is running on port 5000
- Check vite.config.js proxy settings
- Verify CORS is enabled in server.js

## 6. File Locations

### New Files Created:
```
client/src/components/mainpages/auth/
├── OTPInput.jsx
├── OTPInput.css
├── VerifyOTP.css
├── AddInfo.css
└── Auth.css
```

### Updated Files:
```
server/
├── models/userModel.js
├── controllers/otpController.js
└── controllers/userControl.js

client/src/components/mainpages/auth/
├── VerifyOTP.jsx
├── AddInfo.jsx
├── Signup.jsx
└── Login.jsx
```

## 7. Database Schema Changes

### User Model - New Fields:
```javascript
{
  age: Number,                    // User's age (13-120)
  isProfileComplete: Boolean      // true after profile setup
}
```

## 8. API Endpoints

### OTP Routes:
```
POST /api/otp/signup
POST /api/otp/login
POST /api/otp/verify
```

### User Routes:
```
PUT /user/setup-profile (requires auth token)
```

## 9. Environment Variables Checklist

- [ ] EMAIL_USER set to Gmail address
- [ ] EMAIL_PASS set to App Password (16 chars)
- [ ] ACCESS_TOKEN_SECRET set
- [ ] REFRESH_TOKEN_SECRET set
- [ ] MONGODB_URL set
- [ ] PORT set to 5000

## 10. Common Issues & Solutions

| Issue | Solution |
|-------|----------|
| "Invalid or expired OTP" | OTP expires after 10 min, request new one |
| "User already exists" | Email already registered, use login instead |
| "Please enter a valid age" | Age must be 13-120 |
| "Failed to send OTP" | Check Gmail credentials and 2FA setup |
| "Cannot read property 'accesstoken'" | Token not saved, check localStorage |

## 11. Next Steps

1. ✅ Configure Gmail SMTP
2. ✅ Set up environment variables
3. ✅ Start backend and frontend
4. ✅ Test signup flow
5. ✅ Test login flow
6. ✅ Test OTP input features
7. ✅ Deploy to production

## 12. Production Deployment

Before deploying:
- [ ] Use environment variables for all secrets
- [ ] Enable HTTPS
- [ ] Update CORS origin to production domain
- [ ] Use production MongoDB URL
- [ ] Set secure cookie flags
- [ ] Enable rate limiting on OTP endpoints
- [ ] Add email verification before OTP
- [ ] Implement OTP resend limit

## Support

For issues or questions:
1. Check the AUTHENTICATION_SETUP.md for detailed documentation
2. Check the IMPLEMENTATION_SUMMARY.md for technical details
3. Review server logs for backend errors
4. Check browser console for frontend errors

