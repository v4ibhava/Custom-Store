# Architecture & System Diagrams

## 1. System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         CLIENT (React)                          │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │                    Pages                                 │  │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐ │  │
│  │  │ Signup   │  │  Login   │  │VerifyOTP │  │ AddInfo  │ │  │
│  │  └──────────┘  └──────────┘  └──────────┘  └──────────┘ │  │
│  │       │              │              │            │        │  │
│  │       └──────────────┴──────────────┴────────────┘        │  │
│  │                      │                                     │  │
│  │              ┌───────▼────────┐                           │  │
│  │              │  OTPInput      │                           │  │
│  │              │  Component     │                           │  │
│  │              └────────────────┘                           │  │
│  └──────────────────────────────────────────────────────────┘  │
│                         │                                       │
│                    HTTP/CORS                                    │
│                         │                                       │
└─────────────────────────┼───────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────────────┐
│                    SERVER (Express.js)                          │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │                    Routes                                │  │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐   │  │
│  │  │ /api/otp/*   │  │ /user/*      │  │ /api/*       │   │  │
│  │  └──────────────┘  └──────────────┘  └──────────────┘   │  │
│  └──────────────────────────────────────────────────────────┘  │
│                         │                                       │
│  ┌──────────────────────▼──────────────────────────────────┐  │
│  │                  Controllers                            │  │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  │  │
│  │  │ otpController│  │userController│  │   others     │  │  │
│  │  └──────────────┘  └──────────────┘  └──────────────┘  │  │
│  └──────────────────────┬──────────────────────────────────┘  │
│                         │                                       │
│  ┌──────────────────────▼──────────────────────────────────┐  │
│  │                   Models                                │  │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  │  │
│  │  │ User Model   │  │ Product      │  │ Category     │  │  │
│  │  │ (+ age,      │  │ Model        │  │ Model        │  │  │
│  │  │  isProfile   │  │              │  │              │  │  │
│  │  │  Complete)   │  │              │  │              │  │  │
│  │  └──────────────┘  └──────────────┘  └──────────────┘  │  │
│  └──────────────────────┬──────────────────────────────────┘  │
│                         │                                       │
└─────────────────────────┼───────────────────────────────────────┘
                          │
        ┌─────────────────┼─────────────────┐
        │                 │                 │
        ▼                 ▼                 ▼
    ┌────────┐      ┌──────────┐      ┌─────────┐
    │MongoDB │      │Nodemailer│      │ Gmail   │
    │        │      │(SMTP)    │      │ SMTP    │
    └────────┘      └──────────┘      └─────────┘
```

---

## 2. Authentication Flow Diagram

```
                    SIGNUP FLOW
                    
    ┌─────────────────────────────────────────────────────┐
    │                                                     │
    │  1. User enters email                              │
    │     POST /api/otp/signup { email }                 │
    │                                                     │
    ▼                                                     │
    ┌─────────────────────────────────────────────────────┐
    │  2. Server generates OTP                            │
    │     - Generate 6-digit code                         │
    │     - Set 10-min expiration                         │
    │     - Save to database                              │
    │                                                     │
    ▼                                                     │
    ┌─────────────────────────────────────────────────────┐
    │  3. Send OTP email                                  │
    │     - Use Nodemailer + Gmail SMTP                   │
    │     - HTML template                                 │
    │     - Async operation                               │
    │                                                     │
    ▼                                                     │
    ┌─────────────────────────────────────────────────────┐
    │  4. User receives email                             │
    │     - Check inbox/spam                              │
    │     - Copy OTP code                                 │
    │                                                     │
    ▼                                                     │
    ┌─────────────────────────────────────────────────────┐
    │  5. User enters OTP                                 │
    │     - 6 input boxes                                 │
    │     - Auto-focus between inputs                     │
    │     - Auto-submit when complete                     │
    │                                                     │
    ▼                                                     │
    ┌─────────────────────────────────────────────────────┐
    │  6. Verify OTP                                      │
    │     POST /api/otp/verify { email, otp }            │
    │     - Check OTP matches                             │
    │     - Check not expired                             │
    │     - Set isVerified = true                         │
    │                                                     │
    ▼                                                     │
    ┌─────────────────────────────────────────────────────┐
    │  7. Return tokens                                   │
    │     - accessToken (1 day)                           │
    │     - refreshToken (7 days, httpOnly)              │
    │     - isNewUser = true                              │
    │     - isProfileComplete = false                     │
    │                                                     │
    ▼                                                     │
    ┌─────────────────────────────────────────────────────┐
    │  8. Redirect to profile completion                  │
    │     - Navigate to /add-info                         │
    │     - Show profile form                             │
    │                                                     │
    ▼                                                     │
    ┌─────────────────────────────────────────────────────┐
    │  9. User fills profile                              │
    │     - Name (required)                               │
    │     - Age (13-120, required)                        │
    │     - Gender (required)                             │
    │                                                     │
    ▼                                                     │
    ┌─────────────────────────────────────────────────────┐
    │  10. Save profile                                   │
    │      PUT /user/setup-profile { name, age, gender }  │
    │      - Validate all fields                          │
    │      - Save to database                             │
    │      - Set isProfileComplete = true                 │
    │                                                     │
    ▼                                                     │
    ┌─────────────────────────────────────────────────────┐
    │  11. Redirect to home                               │
    │      - User is now fully registered                 │
    │      - Can access all features                      │
    │                                                     │
    └─────────────────────────────────────────────────────┘
```

---

## 3. OTP Input Component Flow

```
    User Types Digit
           │
           ▼
    ┌──────────────────┐
    │ Is it numeric?   │
    └────┬─────────────┘
         │
    ┌────▼─────┐
    │   YES    │
    └────┬─────┘
         │
         ▼
    ┌──────────────────────┐
    │ Update state         │
    │ otp[index] = digit   │
    └────┬─────────────────┘
         │
         ▼
    ┌──────────────────────┐
    │ Is input filled?     │
    └────┬─────────────────┘
         │
    ┌────▼─────┐
    │   YES    │
    └────┬─────┘
         │
         ▼
    ┌──────────────────────┐
    │ Move focus to        │
    │ next input           │
    └────┬─────────────────┘
         │
         ▼
    ┌──────────────────────┐
    │ Are all 6 filled?    │
    └────┬─────────────────┘
         │
    ┌────▼──────┐
    │   YES     │
    └────┬──────┘
         │
         ▼
    ┌──────────────────────┐
    │ Call onComplete()    │
    │ Auto-submit OTP      │
    └──────────────────────┘
```

---

## 4. Database Schema

```
User Collection
┌─────────────────────────────────────┐
│ _id: ObjectId                       │
│ email: String (unique)              │
│ name: String                        │
│ age: Number (NEW)                   │
│ gender: String                      │
│ isVerified: Boolean                 │
│ isProfileComplete: Boolean (NEW)    │
│ otp: String                         │
│ otpExpires: Date                    │
│ password: String (optional)         │
│ role: Number                        │
│ cart: Array                         │
│ addresses: Array                    │
│ cards: Array                        │
│ upis: Array                         │
│ createdAt: Date                     │
│ updatedAt: Date                     │
└─────────────────────────────────────┘
```

---

## 5. Component Hierarchy

```
App
├── GlobalState (token management)
│   ├── token state
│   ├── refreshToken function
│   └── API hooks
│
├── Headers
│
└── Pages (Router)
    ├── /signup
    │   └── Signup Component
    │       └── Auth.css
    │
    ├── /login
    │   └── Login Component
    │       └── Auth.css
    │
    ├── /verify-otp
    │   └── VerifyOTP Component
    │       ├── OTPInput Component
    │       │   └── OTPInput.css
    │       └── VerifyOTP.css
    │
    ├── /add-info
    │   └── AddInfo Component
    │       └── AddInfo.css
    │
    └── ... (other routes)
```

---

## 6. API Request/Response Flow

```
CLIENT                          SERVER                      DATABASE
  │                               │                            │
  │─ POST /api/otp/signup ───────>│                            │
  │   { email }                   │                            │
  │                               │─ Generate OTP ────────────>│
  │                               │                            │
  │                               │<─ Save OTP ────────────────│
  │                               │                            │
  │                               │─ Send Email ──────────────>│
  │                               │   (Gmail SMTP)             │
  │                               │                            │
  │<─ Response ───────────────────│                            │
  │  { msg: "OTP sent" }          │                            │
  │                               │                            │
  │─ POST /api/otp/verify ───────>│                            │
  │   { email, otp }              │                            │
  │                               │─ Verify OTP ──────────────>│
  │                               │                            │
  │                               │<─ Check Match ────────────│
  │                               │                            │
  │                               │─ Update User ─────────────>│
  │                               │   isVerified = true        │
  │                               │                            │
  │<─ Response ───────────────────│                            │
  │  { accesstoken,               │                            │
  │    isNewUser,                 │                            │
  │    isProfileComplete }        │                            │
  │                               │                            │
  │─ PUT /user/setup-profile ────>│                            │
  │   { name, age, gender }       │                            │
  │   (with auth token)           │                            │
  │                               │─ Update User ─────────────>│
  │                               │   name, age, gender        │
  │                               │   isProfileComplete = true │
  │                               │                            │
  │<─ Response ───────────────────│                            │
  │  { msg: "Profile setup ok" }  │                            │
  │                               │                            │
```

---

## 7. State Management Flow

```
GlobalState
├── token: [token, setToken]
│   └── Stores JWT access token
│
├── refreshToken: function
│   └── Refreshes token from server
│
└── userAPI: UserAPI(token)
    ├── isLogged: [isLogged, setIsLogged]
    ├── isAdmin: [isAdmin, setIsAdmin]
    ├── user: [user, setUser]
    ├── cart: [cart, setCart]
    └── functions: addCart, updateCart
```

---

## 8. Email Sending Flow

```
User Signup/Login
       │
       ▼
Generate OTP
       │
       ▼
Create Nodemailer Transporter
       │
       ├─ Service: gmail
       ├─ Auth: EMAIL_USER, EMAIL_PASS
       │
       ▼
Create Mail Options
       │
       ├─ From: EMAIL_USER
       ├─ To: user email
       ├─ Subject: OTP message
       ├─ HTML: Template with OTP
       │
       ▼
Send Email (Async)
       │
       ├─ Success: Log success
       ├─ Error: Log error, throw exception
       │
       ▼
Return Response to Client
```

---

## 9. Validation Flow

```
Client-Side Validation
├── Email: format check
├── Age: 13-120 range
├── Name: non-empty
└── Gender: not empty

       │
       ▼
Server-Side Validation
├── Email: exists check
├── Age: 13-120 range
├── Name: non-empty
├── Gender: enum check
└── OTP: match & expiration

       │
       ▼
Database Constraints
├── Email: unique index
├── Age: number type
└── Gender: string type
```

---

## 10. Security Flow

```
User Input
    │
    ▼
Client Validation
    │
    ├─ Format check
    ├─ Range check
    │
    ▼
HTTPS/CORS
    │
    ├─ Encrypted transmission
    ├─ Origin check
    │
    ▼
Server Validation
    │
    ├─ Input sanitization
    ├─ Type checking
    │
    ▼
Database Storage
    │
    ├─ Indexed queries
    ├─ Secure tokens
    │
    ▼
Response
    │
    └─ No sensitive data leaked
```

