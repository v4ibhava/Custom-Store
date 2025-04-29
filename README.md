# E-com Platform

A modern e-commerce platform built with React and Vite, featuring user authentication, product management, and shopping cart functionality.
Simple, Minimal

## Features

- 🔐 User Authentication (Login/Register)
- 🛍️ Product Browsing and Search
- 🛒 Shopping Cart Management
- 💳 Checkout Process
- 👤 User Profile Management
- 🎯 Product Categories
- 📱 Responsive Design

## Project Structure

```
e-com/
├── client/               # Frontend React application
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   └── utils/
│   ├── package.json
│   └── vite.config.js
│
└── server/              # Backend server
    ├── controllers/
    ├── models/
    ├── routes/
    └── package.json
```

## Prerequisites

- Node.js (latest LTS version recommended)
- npm or yarn
- MongoDB

## Installation

1. Clone the repository
```bash
git clone <repository-url>
```

2. Install dependencies
```bash
# Install client dependencies
cd client
npm install

# Install server dependencies
cd ../server
npm install
```

3. Environment Setup

Create `.env` file in the server directory:
```env
MONGODB_URL=your_mongodb_url
JWT_SECRET=your_jwt_secret
```

Create `.env` file in the client directory:
```env
VITE_API_URL=http://localhost:5000
```

## Development

To run the development server:

```bash
# Start the frontend (in client directory)
npm run dev

# Start the backend (in server directory)
npm run dev
```

- Frontend will run on: `http://localhost:5173`
- Backend will run on: `http://localhost:5000`

## API Endpoints

### Auth Routes
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `GET /api/auth/logout` - User logout

### Product Routes
- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get single product
- `POST /api/products` - Create product (Admin only)
- `PUT /api/products/:id` - Update product (Admin only)
- `DELETE /api/products/:id` - Delete product (Admin only)

### User Routes
- `GET /api/user/profile` - Get user profile
- `PUT /api/user/profile` - Update user profile
- `GET /api/user/cart` - Get user cart
- `POST /api/user/cart` - Add to cart

## Technologies Used

### Frontend
- React
- Vite
- React Router DOM
- Axios
- Tailwind CSS

### Backend
- Node.js
- Express
- MongoDB
- JWT Authentication

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request


