# User Interface Guide

## 1. Signup Page (`/signup`)

### Layout:
```
┌─────────────────────────────────────┐
│                                     │
│        Create Account               │
│    Join us today and start shopping │
│                                     │
│  Email Address *                    │
│  ┌─────────────────────────────────┐│
│  │ Enter your email                ││
│  └─────────────────────────────────┘│
│                                     │
│  ┌─────────────────────────────────┐│
│  │      Send OTP                   ││
│  └─────────────────────────────────┘│
│                                     │
│  Already have an account?           │
│  Login here                         │
│                                     │
└─────────────────────────────────────┘
```

### Colors:
- Background: Purple gradient (#667eea → #764ba2)
- Card: White
- Button: Purple gradient
- Text: Dark gray (#333)
- Links: Purple (#667eea)

### States:
- **Normal**: Blue border on input
- **Focus**: Blue border + light blue background
- **Loading**: Button shows "Sending OTP..."
- **Error**: Red error message box
- **Success**: Green success message box

---

## 2. OTP Verification Page (`/verify-otp`)

### Layout:
```
┌─────────────────────────────────────┐
│                                     │
│      Verify Your Email              │
│  An OTP has been sent to            │
│  user@example.com                   │
│                                     │
│  Enter the 6-digit code below.      │
│  It will auto-submit when complete. │
│                                     │
│  ┌──┐ ┌──┐ ┌──┐ ┌──┐ ┌──┐ ┌──┐   │
│  │1 │ │2 │ │3 │ │4 │ │5 │ │6 │   │
│  └──┘ └──┘ └──┘ └──┘ └──┘ └──┘   │
│                                     │
│  Verifying OTP...                   │
│                                     │
│  Didn't receive the code?           │
│  Check your spam folder or          │
│  request a new one.                 │
│                                     │
└─────────────────────────────────────┘
```

### OTP Input Boxes:
- **Size**: 50px × 50px (desktop), 45px × 45px (mobile)
- **Border**: 2px solid #ddd
- **Focus**: Blue border + light blue background
- **Font**: Bold, 24px
- **Spacing**: 12px gap between boxes

### Interactions:
```
User types: 1
            ↓
Input 1: [1] ← Focus moves to Input 2
Input 2: [ ] ← Cursor here

User types: 2
            ↓
Input 2: [2] ← Focus moves to Input 3
Input 3: [ ] ← Cursor here

... (repeat for digits 3-6)

User types: 6
            ↓
Input 6: [6] ← All filled!
            ↓
        Auto-submit OTP
            ↓
        Verification starts
```

### Features:
- ✅ Auto-focus to next input
- ✅ Auto-submit when complete
- ✅ Paste support
- ✅ Backspace navigation
- ✅ Arrow key navigation

---

## 3. Profile Completion Page (`/add-info`)

### Layout:
```
┌─────────────────────────────────────┐
│                                     │
│    Complete Your Profile            │
│    Help us know you better          │
│                                     │
│  Full Name *                        │
│  ┌─────────────────────────────────┐│
│  │ Enter your full name            ││
│  └─────────────────────────────────┘│
│                                     │
│  Age *                              │
│  ┌─────────────────────────────────┐│
│  │ Enter your age                  ││
│  └─────────────────────────────────┘│
│  Age must be between 13 and 120     │
│                                     │
│  Gender *                           │
│  ┌─────────────────────────────────┐│
│  │ Select your gender            ▼ ││
│  │ - Male                          ││
│  │ - Female                        ││
│  │ - Other                         ││
│  │ - Prefer not to say             ││
│  └─────────────────────────────────┘│
│                                     │
│  ┌─────────────────────────────────┐│
│  │   Complete Profile              ││
│  └─────────────────────────────────┘│
│                                     │
│  This information helps us          │
│  personalize your experience        │
│                                     │
└─────────────────────────────────────┘
```

### Form Fields:

#### Full Name
- Type: Text input
- Placeholder: "Enter your full name"
- Required: Yes
- Validation: Non-empty

#### Age
- Type: Numeric input
- Placeholder: "Enter your age"
- Required: Yes
- Validation: 13-120
- Hint: "Age must be between 13 and 120"

#### Gender
- Type: Dropdown select
- Options:
  - Select your gender (placeholder)
  - Male
  - Female
  - Other
  - Prefer not to say
- Required: Yes

### Button States:
- **Normal**: Purple gradient, clickable
- **Hover**: Slightly raised, shadow effect
- **Loading**: "Setting up..." text, disabled
- **Disabled**: Opacity 0.6, not clickable

---

## 4. Login Page (`/login`)

### Layout:
```
┌─────────────────────────────────────┐
│                                     │
│       Welcome Back                  │
│    Login to your account            │
│                                     │
│  Email Address *                    │
│  ┌─────────────────────────────────┐│
│  │ Enter your email                ││
│  └─────────────────────────────────┘│
│                                     │
│  ┌─────────────────────────────────┐│
│  │      Send OTP                   ││
│  └─────────────────────────────────┘│
│                                     │
│  Don't have an account?             │
│  Sign up here                       │
│                                     │
└─────────────────────────────────────┘
```

### Similar to Signup page with:
- Different header text
- Link to signup instead of login

---

## 5. Color Scheme

### Primary Colors:
- **Purple**: #667eea (primary action)
- **Dark Purple**: #764ba2 (gradient end)
- **Light Blue**: #007bff (focus states)

### Status Colors:
- **Success**: #155724 (text), #d4edda (background)
- **Error**: #dc3545 (text), #f8d7da (background)
- **Warning**: #ff9800 (text)

### Neutral Colors:
- **Dark Gray**: #333 (text)
- **Medium Gray**: #666 (secondary text)
- **Light Gray**: #999 (placeholder)
- **Very Light Gray**: #f5f5f5 (disabled background)
- **White**: #fff (card background)

---

## 6. Responsive Design

### Desktop (> 600px)
- Card width: 450-500px
- OTP input: 50px × 50px
- Font sizes: 16px (input), 28px (heading)
- Padding: 40px

### Mobile (≤ 600px)
- Card width: 100% (with padding)
- OTP input: 45px × 45px
- Font sizes: 16px (input), 24px (heading)
- Padding: 20px
- Gap between inputs: 8px

---

## 7. Animation Effects

### Slide Down Animation
```css
@keyframes slideDown {
    from {
        opacity: 0;
        transform: translateY(-10px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}
```
Used for: Error messages, success messages

### Shake Animation
```css
@keyframes shake {
    0%, 100% { transform: translateX(0); }
    25% { transform: translateX(-5px); }
    75% { transform: translateX(5px); }
}
```
Used for: OTP input error state

### Button Hover Effect
```css
.submit-btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 5px 20px rgba(102, 126, 234, 0.4);
}
```

---

## 8. Accessibility Features

### Keyboard Navigation:
- Tab: Move to next input
- Shift+Tab: Move to previous input
- Arrow Left/Right: Navigate OTP inputs
- Backspace: Delete and move back
- Enter: Submit form (if applicable)

### Screen Reader Support:
- ARIA labels on OTP inputs
- Form labels for all inputs
- Error messages announced
- Loading states announced

### Visual Indicators:
- Focus states with blue border
- Color not only indicator (text + color)
- Sufficient contrast ratios
- Large touch targets (44px minimum)

---

## 9. Error States

### Email Input Error:
```
Email Address *
┌─────────────────────────────────────┐
│ Enter your email                    │
└─────────────────────────────────────┘
┌─────────────────────────────────────┐
│ ✗ Please enter your email           │
└─────────────────────────────────────┘
```

### Age Input Error:
```
Age *
┌─────────────────────────────────────┐
│ 5                                   │
└─────────────────────────────────────┘
Age must be between 13 and 120
```

### OTP Verification Error:
```
┌─────────────────────────────────────┐
│ ✗ Invalid OTP or OTP has expired.   │
└─────────────────────────────────────┘
```

---

## 10. Loading States

### Button Loading:
```
Normal: [Send OTP]
Loading: [Sending OTP...]
```

### OTP Verification Loading:
```
Verifying OTP...
```

### Profile Setup Loading:
```
[Setting up...]
```

All inputs are disabled during loading to prevent duplicate submissions.

