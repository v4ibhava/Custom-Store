# Custom Store — Multi-Sector D2C E-Commerce & Retail Platform

> A white-label, multi-sector D2C E-Commerce platform built with React 19, Vite, Node.js, Express, MongoDB, Razorpay, and Cloudinary. Engineered to empower D2C brands, boutique retailers, food merchants, and independent entrepreneurs with zero-code storefront customization, instant visual styling, and centralized store administration.

---

## Target Audience & Industry Use Cases

Custom Store is designed as a modular, adaptable e-commerce foundation for a wide range of retail sectors and user personas:


### 1. D2C Brands & Online Retail Merchants
- **Custom Product Catalogs**: Multi-variant SKU support for sizing, colors, flavors, weights, and custom engraved/written product messages.
- **Zero-Code Branding**: Instantly update Store Name, Tagline, Support Phone, Support Email, Physical Address, and Currency Symbol from the Admin UI without modifying code.
- **3-Axis Visual Style Customization**: Dynamically select store accent color palettes (Blush Pink, Ocean Blue, Emerald Green), UI shape language (Curvy vs. Edgy), and dark mode persistence.
- **Cloud Media Storage Controls**: Manage Cloudinary API keys, upload target folders, and track cloud storage usage metrics directly in the system settings panel.

### 2. Food, Beverage & Perishable Goods Retailers
- **Bakeries, Confectioneries & Pastry Shops**: Specialty ordering with flavor selection, weight options, and custom message badges.
- **Cafes, Cloud Kitchens & Gourmet Delis**: Local delivery fees, minimum order thresholds, and free delivery qualification rules.
- **Promotional Marketing Campaigns**: Create percentage-based or fixed-amount discount coupons with date pickers that prevent past date selection.

### 3. Local & Omni-Channel Physical Businesses
- **Boutique Shops & Artisanal Crafters**: Seamless transition from offline store to online ordering system.
- **Google Maps Store Location Integration**: Display store address with customizable one-click Google Maps location buttons for in-person customer pick-ups and local deliveries.
- **Flexible Payment Methods**: Integrated support for Razorpay online digital payments and Cash on Delivery (COD).

### 4. Independent Entrepreneurs & Small Business Owners
- **Turnkey Setup**: Out-of-the-box authentication, user roles (Customer vs. Admin), address book management, product reviews moderation, and live sales reports.
- **Admin Store Preview Banner**: Slim floating toolbar enabling store administrators to preview the live customer storefront and switch back to the admin dashboard with one click.

### 5. Modern End-Consumers & Shoppers
- **Responsive Shopping Experience**: Fast, lightweight Vite and React 19 frontend featuring micro-animations, product search, wishlists, and order history tracking.

---

## Key Features

### Customer Storefront
- **Dynamic Store Branding**: Header, footer, page titles, and authentication views instantly reflect configured store settings.
- **Instant Pre-Render Visual Styling**: Persistent light/dark mode and visual presets restore before DOM hydration to prevent UI flashing on refresh.
- **Product Search & Catalog**: Real-time search indexing, category filtering, and price range sorting.
- **Cart & Wishlist**: Persistent cart state, subtotal calculations, and wishlist item management.
- **Multi-Gateway Checkout**: Razorpay online payment processing and Cash on Delivery (COD) switches.
- **Customer Account Management**: Saved shipping address book, past order history, and review submissions.
- **Store Location Link**: Integrated physical store address with interactive Google Maps navigation links.
- **Admin Store Preview Banner**: Floating top bar visible to logged-in admins to easily toggle between customer preview mode and admin controls.

### Admin Management Portal
- **Independent Dual Scroll Layout**: Isolated smooth scrolling containers for the sidebar menu and main workspace area to prevent layout overflow.
- **Overview Dashboard**: High-level revenue summaries, product catalog totals, and real-time order feeds.
- **Catalog & Inventory Management**:
  - **Orders**: Order status lifecycle updates (Pending, Processing, Delivered, Cancelled) and customer details.
  - **Products**: Multi-image uploads, pricing, stock levels, and category assignments.
  - **Categories**: Dynamic category management backed by MongoDB ObjectIds.
- **Marketing & Feedback**:
  - **Coupons**: Percentage and fixed discount codes with date validation.
  - **Reviews**: Customer review moderation and admin reply management.
- **System Configuration**:
  - **Branding & Location**: Store Name, Tagline, Phone, Email, Address, Google Maps URL, and Button text.
  - **Visual Themes**: 3 Light Accent Color Themes (Blush Pink, Ocean Blue, Emerald Green), UI Style (Curvy vs. Edgy), and Dark Mode toggle.
  - **Payment Gateways**: Razorpay Key ID/Secret toggles and COD switches.
  - **Media Storage**: Cloudinary API configuration with live asset metrics.

---

## Visual Styling Engine (3 Independent Axes)

Custom Store includes a modular visual styling system where each axis operates independently:


| Axis | Options | Description |
| :--- | :--- | :--- |
| **Color Theme** | `blush` / `ocean` / `emerald` | Light-mode accent color palettes (Blush Pink, Ocean Blue, Emerald Green). |
| **UI Style** | `curvy` / `edgy` | Shape language controls (`curvy` for soft rounded shapes, `edgy` for sharp geometric corners). |
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
