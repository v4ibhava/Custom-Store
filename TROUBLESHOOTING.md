# Troubleshooting & FAQ

## Common Issues & Solutions

### 1. OTP Not Sending

#### Problem: "Failed to send OTP email"
**Causes**:
- Gmail credentials not configured
- 2FA not enabled on Gmail
- App Password incorrect
- Email service down

**Solutions**:
```bash
# Check .env file
cat server/.env

# Verify EMAIL_USER and EMAIL_PASS are set
# EMAIL_USER should be your Gmail address
# EMAIL_PASS should be 16-character App Password (not regular password)
```

**Steps to Fix**:
1. Go to [myaccount.google.com](https://myaccount.google.com)
2. Click "Security" in left menu
3. Enable "2-Step Verification" if not enabled
4. Find "App passwords" section
5. Select "Mail" and "Windows Computer"
6. Copy the 16-character password
7. Update `.env` with this password
8. Restart server

#### Problem: Email received but OTP is wrong
**Solution**: OTP is generated fresh each time. Check the latest email.

---

### 2. OTP Not Auto-Submitting

#### Problem: Need to click submit button
**Causes**:
- Not all 6 digits entered
- JavaScript error in component
- Browser cache issue

**Solutions**:
```javascript
// Check browser console for errors
// Press F12 → Console tab
// Look for red error messages

// Clear browser cache
// Ctrl+Shift+Delete (Windows)
// Cmd+Shift+Delete (Mac)
```

**Verify**:
- [ ] All 6 digits are entered
- [ ] No JavaScript errors in console
- [ ] OTPInput component is imported correctly
- [ ] Component is rendering (check React DevTools)

---

### 3. Profile Not Saving

#### Problem: "User not found" error
**Causes**:
- Token not in localStorage
- Token expired
- User session lost

**Solutions**:
```javascript
// Check localStorage
// Open DevTools → Application → Local Storage
// Look for "firstLogin" key
// Should contain JWT token

// If missing, login again
```

#### Problem: Age validation error
**Causes**:
- Age < 13 or > 120
- Age field empty
- Non-numeric input

**Solutions**:
- Enter age between 13 and 120
- Ensure age field is filled
- Only numeric characters allowed

#### Problem: "Please select your gender"
**Causes**:
- Gender dropdown not selected
- Empty value selected

**Solutions**:
- Click gender dropdown
- Select one of the options
- Don't leave it on "Select your gender"

---

### 4. CORS Errors

#### Problem: "Access to XMLHttpRequest blocked"
**Causes**:
- Backend not running
- Wrong port
- CORS not configured

**Solutions**:
```bash
# Check if backend is running
# Should see: "Server is running on http://localhost:5000"

# Check vite.config.js proxy settings
cat client/vite.config.js

# Verify server.js has CORS enabled
cat server/server.js | grep -A 5 "cors"
```

**Fix**:
1. Ensure backend is running on port 5000
2. Ensure frontend is running on port 5173
3. Check vite.config.js has proxy configured
4. Restart both servers

---

### 5. Token Issues

#### Problem: "Invalid token" error
**Causes**:
- Token expired
- Token corrupted
- Wrong token format

**Solutions**:
```javascript
// Clear localStorage and login again
localStorage.removeItem('firstLogin');
// Refresh page and login
```

#### Problem: Logged out after page refresh
**Causes**:
- Token not saved properly
- Token expired
- Refresh token invalid

**Solutions**:
1. Check localStorage has "firstLogin" key
2. Check refresh token cookie exists
3. Try logging in again
4. Check server logs for token errors

---

### 6. Email Configuration Issues

#### Problem: "Invalid credentials"
**Causes**:
- Wrong Gmail address
- Wrong App Password
- 2FA not enabled

**Solutions**:
```bash
# Verify Gmail address
echo $EMAIL_USER

# Verify App Password format (should be 16 chars with spaces)
echo $EMAIL_PASS

# Test email sending
# Add console.log in otpController.js
console.log('Sending to:', email);
console.log('From:', process.env.EMAIL_USER);
```

#### Problem: "Less secure app access"
**Causes**:
- Using regular password instead of App Password
- 2FA not enabled

**Solutions**:
- Use App Password (16 characters)
- Enable 2-Step Verification first
- Don't use regular Gmail password

---

### 7. Database Issues

#### Problem: "Cannot connect to MongoDB"
**Causes**:
- MongoDB not running
- Wrong connection string
- Network issues

**Solutions**:
```bash
# Check MongoDB connection string
echo $MONGODB_URL

# Test connection
# Use MongoDB Compass or mongosh
mongosh "your-connection-string"

# Check if MongoDB is running
# Windows: Check Services
# Mac: brew services list
# Linux: systemctl status mongod
```

---

### 8. Frontend Issues

#### Problem: Components not rendering
**Causes**:
- Import errors
- CSS not loading
- Component syntax error

**Solutions**:
```bash
# Check browser console for errors
# F12 → Console tab

# Check if CSS files exist
ls client/src/components/mainpages/auth/*.css

# Verify imports in components
grep -n "import.*OTPInput" client/src/components/mainpages/auth/VerifyOTP.jsx
```

#### Problem: Styling not applied
**Causes**:
- CSS file not imported
- CSS file path wrong
- CSS not compiled

**Solutions**:
```javascript
// Check import statement
import './OTPInput.css';

// Verify file exists
// client/src/components/mainpages/auth/OTPInput.css

// Clear browser cache and restart dev server
```

---

## FAQ

### Q: How long is OTP valid?
**A**: 10 minutes. After that, you need to request a new OTP.

### Q: Can I use the same OTP twice?
**A**: No. OTP is one-time use. After verification, it's deleted.

### Q: What if I don't receive the OTP?
**A**: 
1. Check spam/junk folder
2. Wait a few seconds
3. Request a new OTP
4. Check email address is correct

### Q: Can I change my age/gender after signup?
**A**: Currently, you can only set it during signup. Future enhancement could allow editing.

### Q: What happens if I close the browser during signup?
**A**: Your email will be saved but unverified. You can continue from the login page.

### Q: Is my password stored?
**A**: No password is used. Only OTP-based authentication.

### Q: Can I use the same email for multiple accounts?
**A**: No. Email must be unique.

### Q: How do I reset my password?
**A**: There's no password. Use "Forgot Password" → OTP login.

### Q: Is my data encrypted?
**A**: Tokens are JWT-signed. Passwords are not used. Data is stored in MongoDB.

### Q: Can I delete my account?
**A**: Not implemented yet. Contact support.

### Q: How do I change my email?
**A**: Not implemented yet. Contact support.

### Q: Is the app mobile-friendly?
**A**: Yes. All pages are responsive and mobile-optimized.

---

## Debug Mode

### Enable Detailed Logging

**Backend**:
```javascript
// In otpController.js
console.log('OTP generated:', otp);
console.log('Sending to:', email);
console.log('OTP expires at:', new Date(Date.now() + 10 * 60 * 1000));
```

**Frontend**:
```javascript
// In VerifyOTP.jsx
console.log('OTP entered:', otpValue);
console.log('Sending to:', email);
console.log('Response:', res.data);
```

### Check Network Requests

1. Open DevTools (F12)
2. Go to "Network" tab
3. Perform action (signup, verify OTP, etc.)
4. Check requests and responses
5. Look for errors (red status codes)

### Check Browser Storage

1. Open DevTools (F12)
2. Go to "Application" tab
3. Check "Local Storage" for "firstLogin" token
4. Check "Cookies" for "refreshtoken"

---

## Performance Tips

### Optimize Email Sending
- Use async/await properly
- Don't block OTP generation
- Cache transporter if possible

### Optimize Frontend
- Lazy load components
- Minimize re-renders
- Use React.memo for OTPInput

### Optimize Database
- Index email field
- Index otpExpires for cleanup
- Use connection pooling

---

## Security Checklist

- [ ] Gmail 2FA enabled
- [ ] App Password used (not regular password)
- [ ] Environment variables not committed to git
- [ ] CORS origin set to frontend URL only
- [ ] Tokens have expiration times
- [ ] Age validation prevents underage users
- [ ] Email validation on both sides
- [ ] HTTPS enabled in production
- [ ] Rate limiting on OTP endpoints
- [ ] OTP not logged in production

---

## Getting Help

1. **Check logs**:
   - Server: Terminal where `npm run dev` is running
   - Frontend: Browser console (F12)

2. **Check configuration**:
   - `.env` file has all required variables
   - `vite.config.js` has proxy configured
   - `server.js` has CORS configured

3. **Restart services**:
   - Stop backend (Ctrl+C)
   - Stop frontend (Ctrl+C)
   - Start backend again
   - Start frontend again

4. **Clear cache**:
   - Browser cache (Ctrl+Shift+Delete)
   - localStorage (DevTools → Application)
   - node_modules (rm -rf node_modules && npm install)

5. **Check documentation**:
   - QUICK_START.md
   - AUTHENTICATION_SETUP.md
   - IMPLEMENTATION_SUMMARY.md

