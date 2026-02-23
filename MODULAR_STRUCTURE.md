# Cake-Avenue: Modular Project Structure

## Overview

Cake-Avenue is a full-stack e-commerce platform built with a modular architecture. It follows a clear separation of concerns with:
- **Frontend**: React + Vite application with component-based architecture
- **Backend**: Express.js with MongoDB, following MVC pattern
- **Shared**: Common functionality across client and server

---

## Project Architecture

```
Cake-Avenue/
├── client/                 # Frontend Application (React + Vite)
└── server/                 # Backend Application (Express.js + MongoDB)
```

---

## CLIENT SIDE ARCHITECTURE

### Technology Stack
- **React 19**: Component framework
- **Vite 6.2**: Build tool and dev server
- **React Router 7.3**: Client-side routing
- **Axios**: HTTP client for API communication
- **Tailwind CSS 4.1**: Utility-first CSS framework
- **Framer Motion 12.8**: Animation library
- **Three.js & React Three Fiber**: 3D graphics
- **DaisyUI 5**: UI component library

### Directory Structure

```
client/
├── index.html              # Entry point
├── package.json            # Dependencies and scripts
├── vite.config.js          # Vite configuration
├── eslint.config.js        # ESLint rules
├── src/
│   ├── index.jsx           # React DOM render entry
│   ├── main.jsx            # Application entry point
│   ├── App.jsx             # Root component with routing logic
│   ├── App.css             # Global app styles
│   ├── index.css           # Global styles
│   ├── GlobalState.jsx     # Global state management (Context API)
│   │
│   ├── api/                # API Integration Layer
│   │   ├── CategoryAPI.jsx      # Category-related API calls
│   │   ├── ProductAPI.jsx       # Product-related API calls
│   │   └── UserAPI.jsx          # User-related API calls
│   │
│   ├── components/         # Reusable Components
│   │   ├── headers/
│   │   │   └── Headers.jsx      # Navigation header component
│   │   │
│   │   └── mainpages/
│   │       ├── Pages.jsx        # Main routing/page renderer
│   │       │
│   │       ├── auth/            # Authentication module
│   │       │   ├── Login.jsx
│   │       │   ├── Signup.jsx
│   │       │   ├── AddInfo.jsx
│   │       │   ├── OTPInput.jsx
│   │       │   └── VerifyOTP.jsx
│   │       │
│   │       ├── cart/            # Shopping cart module
│   │       │   └── Cart.jsx
│   │       │
│   │       ├── checkout/        # Checkout module
│   │       │   └── checkout.jsx
│   │       │
│   │       ├── products/        # Product browsing module
│   │       │   └── Products.jsx
│   │       │
│   │       ├── categories/      # Category management module
│   │       │   └── CreateCategory.jsx
│   │       │
│   │       ├── createproduct/   # Product creation module
│   │       │   └── CreateProduct.jsx
│   │       │
│   │       ├── editproduct/     # Product editing module
│   │       │   └── EditProduct.jsx
│   │       │
│   │       ├── userProfile/     # User profile module
│   │       │   ├── Profile.jsx
│   │       │   ├── SavedCards.jsx
│   │       │   ├── SavedUPI.jsx
│   │       │   └── useraddress/
│   │       │       └── UserAddress.jsx
│   │       │
│   │       ├── adminProfile/    # Admin dashboard module
│   │       │   ├── AdminProfile.jsx
│   │       │   └── AdminOrders.jsx
│   │       │
│   │       ├── history/         # Order history module
│   │       │   ├── UserHistory.jsx
│   │       │   ├── OrderDetails.jsx
│   │       │   └── orderDetails.css
│   │       │
│   │       ├── orders/          # Order tracking module
│   │       │   └── OrderStatus.jsx
│   │       │
│   │       ├── wishlist/        # Wishlist module
│   │       │   └── Wishlist.jsx
│   │       │
│   │       ├── wish/            # Wish-related functionality
│   │       │
│   │       └── utils/           # Utility components
│   │           ├── DetailProducts/
│   │           │   └── DetailProduct.jsx
│   │           ├── not_found/
│   │           │   ├── NotFound.jsx
│   │           │   └── ProductNotFound.jsx
│   │           └── productslists/
│   │               ├── BtnRender.jsx
│   │               └── ProductList.jsx
│   │
│   ├── data/                # Static data
│   │   └── CategoryList.js      # Category data
│   │
│   └── images/              # Static image assets
```

### Client Module Responsibilities

| Module | Purpose |
|--------|---------|
| **GlobalState.jsx** | Centralized state management using Context API |
| **api/** | API abstraction layer - all HTTP requests to backend |
| **components/headers/** | Navigation header and top-level navigation |
| **auth/** | Dual-Auth flow features (Secure Password hashing + OTP verification) |
| **cart/** | Shopping cart display and management |
| **products/** | Product listing and browsing |
| **createproduct/** | Admin product creation form |
| **editproduct/** | Admin product editing form |
| **categories/** | Category management |
| **checkout/** | Payment and order checkout process |
| **userProfile/** | Premium UI User personal info, Security settings, Addresses, Saved Cards/UPI |
| **adminProfile/** | Admin dashboard and order management |
| **history/** | User order history and details |
| **orders/** | Order status tracking |
| **wishlist/** | Wishlist management |
| **utils/reviews/** | Product Reviews module for delivered orders |
| **utils/** | Helper components (product details, 404 pages, etc.) |

### Data Flow (Client)

```
User Interaction
    ↓
React Component (Pages.jsx/specific page component)
    ↓
GlobalState (Context API) - State Management
    ↓
API Layer (api/*.jsx) - HTTP Requests
    ↓
Backend Server
```

---

## SERVER SIDE ARCHITECTURE

### Technology Stack
- **Express.js 4.21**: Web framework
- **MongoDB 6.14**: NoSQL database
- **Mongoose 8.11**: ODM for MongoDB
- **JWT 9.0**: Authentication tokens
- **Nodemailer 6.9**: Email service
- **Razorpay 2.9**: Payment gateway
- **Cloudinary 2.5**: Image storage and CDN
- **Express-fileupload 1.5**: File upload handling
- **CORS 2.8**: Cross-Origin Resource Sharing

### Directory Structure

```
server/
├── server.js              # Express app entry point
├── package.json           # Dependencies and scripts
│
├── models/                # Database Models (Mongoose Schemas)
│   ├── userModel.js       # User schema and methods
│   ├── productModels.js   # Product schema and methods
│   ├── categoryModels.js  # Category schema and methods
│   ├── orderModel.js      # Order schema and methods
│   ├── wishlistModel.js   # Wishlist schema and methods
│   └── paymentModel.js    # Payment schema and methods
│
├── controllers/           # Business Logic
│   ├── userControl.js          # User CRUD operations
│   ├── productController.js    # Product CRUD operations
│   ├── categoryController.js   # Category CRUD operations
│   ├── orderController.js      # Order processing
│   ├── wishlistController.js   # Wishlist operations
│   ├── paymentController.js    # Payment handling
│   └── otpController.js        # OTP generation and verification
│
├── routes/                # API Route Definitions
│   ├── useRouter.js       # User-related routes
│   ├── productRouter.js   # Product-related routes
│   ├── categoryRouter.js  # Category-related routes
│   ├── orderRouter.js     # Order-related routes
│   ├── paymentRouter.js   # Payment-related routes
│   ├── otpRouter.js       # OTP-related routes
│   └── upload.js          # File upload handling
│
└── middleware/            # Custom Middleware
    ├── auth.js            # Authentication middleware (JWT verification)
    └── authAdmin.js       # Admin authorization middleware
```

### Server Module Responsibilities

| Module | Purpose |
|--------|---------|
| **Models** | Define database schemas and relationships |
| **Controllers** | Handle business logic and data processing |
| **Routes** | Define API endpoints and link to controllers |
| **Middleware** | Handle cross-cutting concerns (auth, validation) |

### MVC Flow (Server)

```
HTTP Request (from client)
    ↓
Route Handler (routes/*.js)
    ↓
Middleware (auth.js, authAdmin.js if needed)
    ↓
Controller (controllers/*.js)
    ↓
Model (models/*.js) - Database Operation
    ↓
Response to Client
```

### Server Modules Details

#### Models (Data Layer)
- **userModel.js**: User profile, credentials, contact info
- **productModels.js**: Product details, pricing, inventory
- **categoryModels.js**: Product categories and subcategories
- **orderModel.js**: Order information, items, status, timestamps
- **wishlistModel.js**: User wishlist items and references
- **paymentModel.js**: Payment transactions, payment methods, status

#### Controllers (Business Logic)
- **userControl.js**: Register, login, profile updates, address management
- **productController.js**: Create, read, update, delete products, search
- **categoryController.js**: Category CRUD operations
- **orderController.js**: Create orders, update status, retrieve orders
- **wishlistController.js**: Add/remove wishlist items
- **paymentController.js**: Process payments via Razorpay
- **otpController.js**: Generate OTP, verify OTP for authentication

#### Routes (API Endpoints)
- **useRouter.js**: `/api/user/*` - Authentication and profile
- **productRouter.js**: `/api/product/*` - Product operations
- **categoryRouter.js**: `/api/category/*` - Category operations
- **orderRouter.js**: `/api/order/*` - Order operations
- **paymentRouter.js**: `/api/payment/*` - Payment processing
- **otpRouter.js**: `/api/otp/*` - OTP operations
- **upload.js**: File upload routes (images via Cloudinary)

#### Middleware
- **auth.js**: Verifies JWT tokens, protects routes
- **authAdmin.js**: Checks admin privileges, restricts admin routes

---

## INTEGRATION POINTS

### Client-Server Communication

```
CLIENT API LAYER (api/*.jsx)
├── CategoryAPI.jsx → GET/POST /api/category/*
├── ProductAPI.jsx  → GET/POST/PUT/DELETE /api/product/*
└── UserAPI.jsx     → GET/POST/PUT /api/user/*
                     → GET/POST /api/otp/*
                     → GET/POST /api/payment/*
                     → GET/POST /api/order/*
                     → GET/POST /api/wishlist/*
```

### Authentication Flow

```
1. Client: Submit login credentials (Login.jsx)
   ↓
2. Server: userControl.js validates credentials
   ↓
3. Server: Generate JWT token
   ↓
4. Client: Store token in GlobalState and localStorage
   ↓
5. Client: Include token in all protected API requests
   ↓
6. Server: auth.js middleware verifies token
   ↓
7. Access granted/denied
```

### Product Management Flow

```
Admin:
1. Upload image → Cloudinary (upload.js)
2. Submit form → ProductController
3. Create/Update product in MongoDB
4. Return product ID to client

User:
1. Browse products → ProductAPI → ProductController
2. View product details → DetailProduct.jsx
3. Add to cart → GlobalState
4. Checkout → Payment
```

### Order Processing Flow

```
1. User adds items to cart (GlobalState)
2. User initiates checkout → checkout.jsx
3. Payment gateway integration → Razorpay
4. PaymentController processes payment
5. On success, OrderController creates order
6. Order saved to MongoDB
7. User redirected to order confirmation
8. Admin can view/manage orders → AdminOrders.jsx
```

---

## MODULARITY PRINCIPLES

### Separation of Concerns
- **Presentation Layer**: React components handle UI
- **API Layer**: Dedicated API modules for HTTP requests
- **State Management**: GlobalState.jsx for shared state
- **Business Logic**: Controllers on backend
- **Data Persistence**: Models define data structure

### Reusability
- Utility components in `utils/` folder
- API modules can be used across multiple components
- Middleware for cross-cutting concerns
- Shared data structures and models

### Scalability
- Modular folder structure allows easy addition of new features
- Each feature has its own folder with related components
- Clear separation allows parallel development
- Controllers can be extended with new logic

### Maintainability
- Clear naming conventions
- Logical organization of files
- Single responsibility per file
- Centralized state management

---

## KEY FILES & THEIR ROLES

### Client Key Files
| File | Role |
|------|------|
| App.jsx | Root component, routing setup, header visibility logic |
| GlobalState.jsx | Context provider for global state |
| Pages.jsx | Route renderer for all pages |
| api/*.jsx | API abstraction layer |

### Server Key Files
| File | Role |
|------|------|
| server.js | Express app initialization and configuration |
| models/*.js | Database schema definitions |
| controllers/*.js | Business logic implementation |
| routes/*.js | API endpoint definitions |
| middleware/auth.js | JWT verification and protection |

---

## ENVIRONMENT & CONFIGURATION

### Client Configuration
- **vite.config.js**: Build and dev server configuration
- **eslint.config.js**: Code quality rules
- **.env variables**: API base URL, API keys

### Server Configuration
- **package.json**: Scripts include `npm run dev` for nodemon development
- **.env variables**: Database URL, JWT secret, Cloudinary credentials, Razorpay keys, Email service credentials

---

## DEVELOPMENT WORKFLOW

### Running the Application

**Client:**
```bash
cd client
npm install
npm run dev        # Start development server (Vite)
npm run build      # Production build
npm run lint       # Run ESLint
```

**Server:**
```bash
cd server
npm install
npm run dev        # Start with nodemon (auto-reload)
```

### Adding a New Feature

1. **Create component folder** in `client/src/components/mainpages/[feature]/`
2. **Create page component** (e.g., `Feature.jsx`)
3. **Add API module** in `client/src/api/FeatureAPI.jsx`
4. **Update GlobalState.jsx** if feature needs global state
5. **Add route** in `Pages.jsx`
6. **Create backend model** in `server/models/featureModel.js`
7. **Create controller** in `server/controllers/featureController.js`
8. **Create routes** in `server/routes/featureRouter.js`
9. **Add routes to server.js** for registration

---

## DEPENDENCIES & DATA MODELS

### Key Relationships

```
User
├── has many Orders
├── has many Wishlist Items
├── has many Saved Addresses
├── has many Saved Payment Methods
└── may have Admin Role

Product
├── belongs to Category
├── has many Order Items
└── may appear in Wishlist

Order
├── belongs to User
├── has many Order Items
├── links to Products
└── has Payment Info

Category
└── has many Products

Wishlist
├── belongs to User
└── references Products
```

---

## NOTES

- **Global State**: Managed via React Context API in `GlobalState.jsx`
- **Authentication**: JWT-based with tokens stored client-side
- **File Uploads**: Handled via Cloudinary for scalability
- **Payments**: Integrated with Razorpay payment gateway
- **Email Services**: Nodemailer for transactional emails
- **CORS**: Enabled on backend for cross-origin requests
- **Admin Features**: Protected routes with `authAdmin` middleware
- **3D Graphics**: Optional Three.js integration for enhanced UI

---

## SUMMARY

The Cake-Avenue project follows a **modular, scalable architecture** with:
- Clear **client-server separation**
- **Feature-based folder organization** on the frontend
- **MVC pattern** on the backend
- **Dedicated API layer** for clean data flow
- **Centralized state management** with Context API
- **Middleware-based protection** for sensitive operations
- **Extensible design** for adding new features
