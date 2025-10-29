# Detailed Features Documentation

## 1. OTP Input Component - Auto-Submit Feature

### How It Works:
```javascript
// When user enters 6th digit:
const otpValue = "123456";  // All digits filled
onComplete(otpValue);        // Auto-submit triggered
```

### User Experience:
```
User types: 1 → 2 → 3 → 4 → 5 → 6
            ↓    ↓    ↓    ↓    ↓    ↓
Focus:     [1]  [2]  [3]  [4]  [5]  [6]
                                      ↓
                            Auto-submit OTP
```

### Features:

#### 1. Auto-Focus
```javascript
// When user types a digit in input 1
// Focus automatically moves to input 2
if (element.value !== "" && index < length - 1) {
    inputRefs.current[index + 1].focus();
}
```

#### 2. Auto-Submit
```javascript
// When all 6 digits are filled
if (newOtp.every(digit => digit !== "")) {
    const otpValue = newOtp.join("");
    onComplete(otpValue);  // Triggers verification
}
```

#### 3. Backspace Navigation
```javascript
// Backspace on empty input → move to previous
if (e.key === "Backspace" && otp[index] === "") {
    inputRefs.current[index - 1].focus();
}
```

#### 4. Paste Support
```javascript
// User pastes "123456" → auto-fills all inputs
const pastedOtp = pastedData.replace(/\D/g, '').slice(0, 6);
// Auto-submits if all filled
```

## 2. Profile Completion Page

### Fields Collected:

#### Full Name
- Type: Text input
- Validation: Non-empty string
- Stored as: `user.name`

#### Age
- Type: Numeric input
- Validation: 13-120 years
- Stored as: `user.age`
- Error message: "Age must be between 13 and 120"

#### Gender
- Type: Dropdown select
- Options:
  - Male
  - Female
  - Other
  - Prefer not to say
- Stored as: `user.gender`

### Validation Flow:
```javascript
// Client-side validation
if (!name.trim()) {
    setError('Please enter your full name');
    return;
}

if (!age || age < 13 || age > 120) {
    setError('Please enter a valid age (13-120)');
    return;
}

if (!gender) {
    setError('Please select your gender');
    return;
}

// Server-side validation in setupProfile endpoint
// Sets isProfileComplete = true
```

## 3. Gmail SMTP Email Configuration

### Email Template:
```html
<div style="font-family: Arial, sans-serif; max-width: 600px;">
    <h2>Your One-Time Password (OTP)</h2>
    <p>Your OTP for accessing your account is:</p>
    <div style="background-color: #f0f0f0; padding: 20px; text-align: center;">
        <h1 style="color: #007bff; letter-spacing: 5px;">123456</h1>
    </div>
    <p>This OTP is valid for 10 minutes.</p>
</div>
```

### Configuration:
```javascript
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,      // Gmail address
        pass: process.env.EMAIL_PASS       // App password
    }
});
```

## 4. Authentication Flow Details

### Signup Flow:
```
1. User enters email
   ↓
2. POST /api/otp/signup
   - Check if email exists
   - Generate 6-digit OTP
   - Set expiration (10 minutes)
   - Send email
   ↓
3. User enters OTP
   ↓
4. POST /api/otp/verify
   - Validate OTP
   - Check expiration
   - Set isVerified = true
   - Return isNewUser = true
   ↓
5. Redirect to /add-info
   ↓
6. User fills profile
   ↓
7. PUT /user/setup-profile
   - Save name, age, gender
   - Set isProfileComplete = true
   ↓
8. Redirect to home
```

### Login Flow:
```
1. User enters email
   ↓
2. POST /api/otp/login
   - Check if user exists and verified
   - Generate OTP
   - Send email
   ↓
3. User enters OTP
   ↓
4. POST /api/otp/verify
   - Validate OTP
   - Return isProfileComplete status
   ↓
5. If isProfileComplete = true
   → Redirect to home
   
   If isProfileComplete = false
   → Redirect to /add-info
```

## 5. Database Schema

### User Model Updates:
```javascript
{
    name: String,                    // Full name
    email: String,                   // Unique email
    age: Number,                     // NEW: Age (13-120)
    gender: String,                  // Gender
    isVerified: Boolean,             // Email verified
    isProfileComplete: Boolean,      // NEW: Profile completed
    otp: String,                     // Current OTP
    otpExpires: Date,                // OTP expiration
    role: Number,                    // User role
    cart: Array,                     // Shopping cart
    addresses: Array,                // Saved addresses
    cards: Array,                    // Saved cards
    upis: Array,                     // Saved UPI IDs
    createdAt: Date,                 // Created timestamp
    updatedAt: Date                  // Updated timestamp
}
```

## 6. Component Hierarchy

```
App
├── GlobalState (token management)
├── Headers
└── Pages
    ├── /signup → Signup
    │   └── Auth.css
    ├── /login → Login
    │   └── Auth.css
    ├── /verify-otp → VerifyOTP
    │   ├── OTPInput
    │   │   └── OTPInput.css
    │   └── VerifyOTP.css
    └── /add-info → AddInfo
        └── AddInfo.css
```

## 7. State Management

### VerifyOTP Component:
```javascript
const [error, setError] = useState('');
const [isLoading, setIsLoading] = useState(false);

// OTPInput handles internal state
// Calls onComplete when all digits filled
```

### AddInfo Component:
```javascript
const [formData, setFormData] = useState({
    name: '',
    age: '',
    gender: ''
});
const [error, setError] = useState('');
const [isLoading, setIsLoading] = useState(false);
```

## 8. Error Handling

### OTP Verification Errors:
- "Invalid OTP or OTP has expired"
- "User not found or not verified"

### Profile Setup Errors:
- "Please enter your full name"
- "Please enter a valid age (13-120)"
- "Please select your gender"
- "User not found"

### Email Sending Errors:
- "Failed to send OTP email"
- "Please check your email configuration"

## 9. Security Features

### OTP Security:
- 6-digit random code
- 10-minute expiration
- One-time use (cleared after verification)
- Stored in database with expiration time

### Token Security:
- Access token: localStorage (1 day expiration)
- Refresh token: httpOnly cookie (7 days expiration)
- JWT signed with secret keys

### Data Validation:
- Email format validation
- Age range validation (13-120)
- Gender enum validation
- Name non-empty validation

## 10. Responsive Design

### Mobile Optimization:
- OTP input boxes: 45px × 45px on mobile
- Reduced padding and margins
- Touch-friendly button sizes
- Flexible layout for small screens

### Desktop Optimization:
- OTP input boxes: 50px × 50px
- Larger font sizes
- Better spacing
- Card-based layout

## 11. Accessibility Features

### ARIA Labels:
```javascript
<input
    aria-label={`OTP digit ${index + 1}`}
    // Helps screen readers identify each input
/>
```

### Keyboard Navigation:
- Tab to move between inputs
- Arrow keys for navigation
- Backspace for deletion
- Enter to submit (if needed)

### Visual Feedback:
- Focus states with blue border
- Error messages in red
- Success messages in green
- Loading states with spinner text

