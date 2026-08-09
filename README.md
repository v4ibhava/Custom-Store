# Cake Avenue — Full-Stack D2C E-Commerce & Bakery Platform

> A white-label D2C E-Commerce platform built with React 19, Vite, Node.js, Express, MongoDB, Razorpay, and Cloudinary. Designed for bakeries, confectionery shops, and retail brands requiring a customizable storefront and centralized administration portal.

---

## Target Audience

Cake Avenue is engineered to serve three primary target groups:

### 1. Bakeries & Confectionery Businesses
- **Custom Product Management**: Support for multi-variant products including flavors, weights, and custom messages.
- **Store Location & Delivery**: Display physical store locations with dynamic Google Maps integration for customer pick-ups and local deliveries.
- **Promotional Campaigns**: Create percentage and fixed-discount coupons with expiration controls and date pickers that prevent selecting past dates.

### 2. D2C Brands & Small Business Merchants
- **Zero-Code Store Customization**: Modify store branding (Store Name, Tagline, Support Phone, Support Email, Physical Address, Currency Symbol) directly from the Admin System Settings UI without code edits.
- **3-Axis Visual Style Customization**: Independently select store accent colors (Blush Pink, Ocean Blue, Emerald Green), shape language (Curvy vs Edgy), and dark mode toggle.
- **Dynamic Brand Initials Generator**: Automatically generates logo badges across customer views based on the configured store name.
- **Cloud Media Storage Control**: Configure Cloudinary API credentials in the Admin UI with live storage usage metrics and catalog asset analytics.

### 3. Modern Online Shoppers
- **Responsive Shopping Experience**: High-speed Vite and React frontend featuring micro-animations and clean UI design.
- **Checkout Flexibility**: Integrated support for Razorpay Online Payments, Cash on Delivery (COD), address book management, and wishlist tracking.

---

## Key Features

### Customer Storefront
- **Dynamic Branding**: Header, footer, document titles, and authentication screens automatically reflect configured store settings.
- **Instant Dark Mode & Visual Styling**: Instant pre-render visual settings restore via `localStorage` cache prevents dark mode flashing on page refresh.
- **Product Catalog & Search**: Real-time product search, category filtering, and price range controls.
- **Cart & Wishlist**: Persistent cart state, subtotal calculation, and wishlist management.
- **Checkout Integration**: Native integration with Razorpay Payment Gateway and Cash on Delivery (COD).
- **User Profile & Addresses**: Address book management, past order history, and review submissions.
- **Store Location Link**: One-click navigation linking directly to the physical store location.
- **Admin Store Preview Banner**: Slim floating navigation bar for logged-in admins to easily navigate between the customer storefront preview and the admin dashboard.

### Admin Management Portal
- **Independent Dual Scroll Layout**: Isolated smooth scrolling containers for the sidebar and main content area to prevent layout overflow.
- **Overview Dashboard**: High-level sales summaries, product counts, and recent order feeds.
- **Catalog & Orders Management**:
  - **Orders**: Order status updates (Pending, Processing, Delivered, Cancelled) and customer details.
  - **Products**: Multi-image uploads, pricing, stock levels, and category assignments.
  - **Categories**: Dynamic category management backed by MongoDB ObjectIds.
- **Marketing & Feedback**:
  - **Coupons**: Percentage and fixed discount codes with date validation.
  - **Reviews**: Moderation and admin replies to customer reviews.
- **System Configuration**:
  - **Appearance & Branding**: Store Name, Tagline, Phone, Email, Address, Google Maps URL, 3 Accent Color Themes, Curvy/Edgy UI Style, and Dark Mode toggle.
  - **Payment Gateways**: Razorpay Key ID/Secret toggles and COD switches.
  - **Media Storage**: Cloudinary API configuration with live asset analytics.

---

## Visual Styling Engine (3 Independent Axes)

Cake Avenue includes a modular visual styling system. Each axis operates independently:

| Axis | Options | Description |
| :--- | :--- | :--- |
| **Color Theme** | `blush` / `ocean` / `emerald` | Light-mode accent color palettes (Blush Pink, Ocean Blue, Emerald Green). |
| **UI Style** | `curvy` / `edgy` | Shape language controls (`curvy` for soft rounded pills, `edgy` for sharp geometric corners). |
| **Dark Mode** | `true` / `false` | Full dark background theme toggle, cached in `localStorage` for instant page loads. |

---

## Technology Stack

| Layer | Technologies Used |
| :--- | :--- |
| **Frontend** | React 19, Vite, Tailwind CSS, Framer Motion, Three.js, React Icons, Axios, React Hot Toast |
| **Backend** | Node.js, Express.js, Mongoose (MongoDB ODM), JWT (JSON Web Tokens), Nodemailer |
| **Cloud & Payments** | Cloudinary v2 API (Media Storage), Razorpay SDK (Payments) |
| **Database** | MongoDB / MongoDB Atlas |

---

## Getting Started

### Prerequisites
- **Node.js**: v18.0.0 or higher
- **MongoDB**: Local MongoDB instance (`mongodb://127.0.0.1:27017/cake-avenue`) or MongoDB Atlas URI

---

### Installation & Setup

#### 1. Clone Repository
```bash
git clone https://github.com/v4ibhava/Cake-Avenue.git
cd Cake-Avenue
```

#### 2. Backend Setup
```bash
cd server
npm install
```

Create `.env` file in the `server/` directory:
```env
PORT=5000
MONGODB_URL=mongodb://127.0.0.1:27017/cake-avenue
ACCESS_TOKEN_SECRET=your_access_token_secret_key
REFRESH_TOKEN_SECRET=your_refresh_token_secret_key

# Optional Default Fallbacks (Configurable in Admin UI)
CLOUD_NAME=your_cloudinary_cloud_name
CLOUD_API_KEY=your_cloudinary_api_key
CLOUD_API_SECRET=your_cloudinary_api_secret

RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret

# OTP Mailer Configuration
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_gmail_app_password
```

Start backend server:
```bash
npm run dev
```

#### 3. Frontend Setup
Open a new terminal window:
```bash
cd client
npm install
npm run dev
```

Application URLs:
- **Client**: `http://localhost:5173/`
- **Server API**: `http://localhost:5000/`

---

## Key API Endpoints

| Endpoint | Method | Description |
| :--- | :--- | :--- |
| `/user/register` | `POST` | Register new customer account |
| `/user/login` | `POST` | Authenticate user & issue JWT tokens |
| `/api/products` | `GET` / `POST` | Fetch catalog or create product (Admin) |
| `/api/category` | `GET` / `POST` / `DELETE` | Category management |
| `/api/coupons` | `GET` / `POST` / `DELETE` | Create & list discount coupons |
| `/api/settings` | `GET` / `PUT` | Fetch & update store branding, visual themes, payments & storage |
| `/api/storage-stats` | `GET` | Retrieve Cloudinary cloud status & asset metrics |
| `/api/payment/orders` | `POST` | Create Razorpay order |
| `/api/upload` | `POST` | Upload product images to Cloudinary |

---

## Memory & System Documentation

System architecture decisions and session logs are documented in:
- [.agent/MEMORY.md](file:///.agent/MEMORY.md)
- [AGENTS.md](file:///AGENTS.md)

---

## License

This project is licensed under the [MIT License](LICENSE).
