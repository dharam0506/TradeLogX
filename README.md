# Trade Diary Clone

A complete UI clone of the Trade Diary website built with React, Vite, and Tailwind CSS.

## Features

- 🏠 **Homepage** with all sections:
  - Hero section with CTA buttons
  - Statistics section
  - Features grid (9 feature cards)
  - How It Works section
  - Testimonials
  - Comparison table
  - Pricing plans
  - FAQ accordion
  - Call-to-action section
  - Footer

- 🔐 **Login/Register Page** with full authentication (signup/login)
- 🔒 **Backend API** with JWT authentication
- 📄 **About Us Page**
- 📧 **Contact Us Page** with contact form

## Tech Stack

### Frontend
- **React 18** - UI library
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Styling
- **React Router** - Navigation

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database (via Mongoose)
- **JWT** - Authentication tokens
- **bcryptjs** - Password hashing

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- MongoDB (local installation or MongoDB Atlas account)

### Installation

1. **Install frontend dependencies:**
```bash
npm install
```

2. **Install backend dependencies:**
```bash
cd server
npm install
cd ..
```

3. **Set up MongoDB Atlas (Cloud Database - Recommended):**
   - Sign up at https://www.mongodb.com/cloud/atlas (free tier)
   - Follow the detailed guide: [server/MONGODB_ATLAS_SETUP.md](server/MONGODB_ATLAS_SETUP.md)
   - Create `.env` file in `server/` directory with your Atlas connection string

### Development

1. **Start the backend server:**
```bash
cd server
npm run dev
```
The backend will run on `http://localhost:5000`

2. **Start the frontend (in a new terminal):**
```bash
npm run dev
```
The app will be available at `http://localhost:5173`

> **Note**: If using MongoDB Atlas, no local MongoDB installation needed - it's cloud-based!

### Build

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

## Project Structure

```
├── src/
│   ├── components/
│   │   ├── sections/
│   │   │   ├── Hero.jsx
│   │   │   ├── Statistics.jsx
│   │   │   ├── Features.jsx
│   │   │   ├── HowItWorks.jsx
│   │   │   ├── Testimonials.jsx
│   │   │   ├── ComparisonTable.jsx
│   │   │   ├── Pricing.jsx
│   │   │   ├── FAQ.jsx
│   │   │   └── CTA.jsx
│   │   ├── Navigation.jsx
│   │   └── Footer.jsx
│   ├── pages/
│   │   ├── Home.jsx
│   │   ├── Login.jsx
│   │   ├── About.jsx
│   │   └── Contact.jsx
│   ├── utils/
│   │   └── api.js          # API utility functions
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── server/
│   ├── config/
│   │   └── database.js     # MongoDB connection
│   ├── middleware/
│   │   └── auth.js         # JWT middleware
│   ├── models/
│   │   └── User.js         # User model
│   ├── routes/
│   │   └── auth.js         # Authentication routes
│   ├── .env                # Environment variables
│   ├── server.js           # Main server file
│   └── package.json
├── index.html
├── package.json
├── vite.config.js
├── tailwind.config.js
└── postcss.config.js
```

## Design Notes

- **Color Scheme**: Dark blue background (#0f172a) with blue accents
- **Typography**: Poppins font family
- **Responsive**: Fully responsive design with mobile-first approach
- **UI Elements**: Matches the original Trade Diary website design

## Backend API

The backend provides authentication endpoints:

- `POST /api/auth/signup` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user (requires authentication)

For detailed backend documentation, see [server/README.md](server/README.md) or [README-BACKEND.md](README-BACKEND.md)

## Next Steps

Functionality to be implemented:
- Trade logging system
- Analytics dashboard
- Payment integration
- Protected routes
- User dashboard


