# TradeLogX 📈

> An intelligent trading journal for the Indian stock market with AI-powered insights, psychology tracking, performance analytics, and market prediction tools.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js Version](https://img.shields.io/badge/node-%3E%3D14.0.0-brightgreen)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-18.2.0-blue)](https://reactjs.org/)

TradeLogX is a comprehensive trading journal application specifically designed for Indian stock market traders. It helps you track, analyze, and improve your trading performance through AI-powered insights, emotion tracking, and technical analysis.

## 📸 Screenshots

### Landing Page

![Landing Page](./imgs/Website.png)

### Dashboard

![Dashboard](./imgs/dashboard.png)

## ✨ Features

### 🤖 AI Summarizer

- **AI-Powered Trade Analysis**: Get instant insights on your trades using Google Gemini AI
- **Pattern Recognition**: Automatically identify trading patterns you might have missed
- **Strength & Weakness Detection**: Understand what's working and what needs improvement
- **Plain English Insights**: Get actionable recommendations in easy-to-understand language

### 🧠 Psychology Tracking

- **Emotion Tagging**: Tag your trades with emotions (fear, greed, confidence, anxiety, calm)
- **Behavioral Pattern Analysis**: Identify patterns like fear exits, revenge trading, and overtrading
- **Emotion Distribution Charts**: Visualize your emotional state across trades
- **Mindset Trends**: Track how your psychology affects trading performance

### 📊 Performance Analytics

- **Comprehensive Metrics**: Win rate, profit factor, average win/loss, R-multiple
- **Visual Analytics**: Equity curve, win/loss distribution, performance by stock
- **Strengths & Weaknesses**: Identify your best and worst performing strategies
- **Actionable Insights**: Get recommendations to improve your trading

### 📈 AI Prediction Meter

- **Market Direction Prediction**: Get bullish/bearish predictions for Indian stocks
- **Technical Indicators**: RSI, MACD, Moving Averages, Support/Resistance levels
- **Confidence Scoring**: See prediction confidence percentage (0-100%)
- **Real-time Analysis**: Get predictions for NSE/BSE stocks

### 🏦 Indian Stock Market Focus

- **NSE/BSE Support**: Trade logging for both National Stock Exchange and Bombay Stock Exchange
- **Indian Stock Symbols**: Native support for Indian stock symbols (RELIANCE, TCS, INFY, etc.)
- **INR Currency**: All calculations in Indian Rupees

### 🔐 Security & Authentication

- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: bcrypt password encryption
- **Protected Routes**: Secure access to user data
- **User Isolation**: Each user can only access their own trades

## 🚀 Tech Stack

### Frontend

- **React 18** - UI library
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **React Router** - Client-side routing
- **Recharts** - Chart library for data visualization

### Backend

- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - NoSQL database (via Mongoose)
- **JWT** - JSON Web Tokens for authentication
- **bcryptjs** - Password hashing
- **Google Gemini AI** - AI-powered trade analysis
- **Axios** - HTTP client for stock data APIs

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v14 or higher) - [Download](https://nodejs.org/)
- **npm** or **yarn** - Package manager
- **MongoDB** - Either:
  - Local MongoDB installation, OR
  - MongoDB Atlas account (free tier recommended)

## 🛠️ Installation

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/tradelogx.git
cd tradelogx
```

### 2. Install Frontend Dependencies

```bash
npm install
```

### 3. Install Backend Dependencies

```bash
cd server
npm install
cd ..
```

### 4. Set Up MongoDB

**Option A: MongoDB Atlas (Recommended - Free Cloud Database)**

1. Sign up at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) (free tier)
2. Create a free cluster (M0)
3. Create a database user and whitelist your IP address
4. Get your connection string from "Connect" → "Connect your application"
5. See detailed guide: [server/MONGODB_ATLAS_SETUP.md](server/MONGODB_ATLAS_SETUP.md)

**Option B: Local MongoDB**

Install MongoDB locally and ensure it's running on `mongodb://localhost:27017`

### 5. Configure Environment Variables

Create a `.env` file in the `server/` directory:

```env
# Server Configuration
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:5173

# Database
MONGODB_URI=mongodb+srv://YOUR-USERNAME:YOUR-PASSWORD@cluster0.xxxxx.mongodb.net/tradelogx?retryWrites=true&w=majority

# Authentication
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production

# AI Services
GEMINI_API_KEY=your-google-gemini-api-key
```

**Getting API Keys:**

- **Google Gemini API Key** (Free): Get from [Google AI Studio](https://makersuite.google.com/app/apikey)
  - Free tier includes 60 requests/minute
  - No credit card required initially

**Important Security Notes:**

- ⚠️ Change `JWT_SECRET` to a secure random string in production
- ⚠️ Never commit your `.env` file to version control (it's in `.gitignore`)
- ⚠️ Use environment variables for all sensitive data

## 🎯 Usage

### Development Mode

1. **Start the Backend Server:**

```bash
cd server
npm run dev
```

The backend will run on `http://localhost:5000`

2. **Start the Frontend (in a new terminal):**

```bash
npm run dev
```

The app will be available at `http://localhost:5173`

### Production Build

1. **Build the Frontend:**

```bash
npm run build
```

2. **Start the Backend:**

```bash
cd server
npm start
```

3. **Preview Production Build:**

```bash
npm run preview
```

## 📖 API Documentation

### Authentication Endpoints

#### Signup

```http
POST /api/auth/signup
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "securepassword",
  "name": "John Doe"
}
```

#### Login

```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "securepassword"
}
```

#### Get Current User

```http
GET /api/auth/me
Authorization: Bearer <token>
```

### Trade Endpoints

#### Get All Trades

```http
GET /api/trades?status=closed&symbol=RELIANCE&exchange=NSE
Authorization: Bearer <token>
```

#### Create Trade

```http
POST /api/trades
Authorization: Bearer <token>
Content-Type: application/json

{
  "symbol": "RELIANCE",
  "exchange": "NSE",
  "tradeType": "long",
  "entryPrice": 2500,
  "quantity": 10,
  "entryDate": "2024-01-15T10:00:00Z",
  "emotion": "confidence",
  "notes": "Strong breakout pattern"
}
```

#### Analyze Trade (AI Summarizer)

```http
POST /api/trades/:id/analyze
Authorization: Bearer <token>
```

#### Get Psychology Patterns

```http
GET /api/trades/psychology/patterns
Authorization: Bearer <token>
```

#### Get Performance Analytics

```http
GET /api/trades/analytics/insights
Authorization: Bearer <token>
```

### Market Prediction Endpoints

#### Get Stock Prediction

```http
GET /api/market/predict/RELIANCE?exchange=NSE
Authorization: Bearer <token>
```

For complete API documentation, see [server/README.md](server/README.md)

## 📁 Project Structure

```
tradelogx/
├── src/                          # Frontend source code
│   ├── components/
│   │   ├── AISummarizer.jsx     # AI trade analysis component
│   │   ├── PsychologyTracking.jsx # Psychology tracking component
│   │   ├── PerformanceAnalytics.jsx # Performance analytics component
│   │   ├── AIPredictionMeter.jsx # Market prediction component
│   │   ├── TradeForm.jsx        # Trade entry form
│   │   ├── TradeList.jsx        # Trade list display
│   │   ├── Navigation.jsx       # Navigation bar
│   │   ├── Footer.jsx           # Footer component
│   │   └── sections/            # Homepage sections
│   ├── pages/
│   │   ├── Home.jsx            # Landing page
│   │   ├── Dashboard.jsx       # Main dashboard
│   │   ├── Login.jsx          # Login page
│   │   ├── Signup.jsx         # Signup page
│   │   ├── About.jsx          # About page
│   │   └── Contact.jsx        # Contact page
│   ├── utils/
│   │   └── api.js             # API utility functions
│   ├── App.jsx                # Main app component
│   ├── main.jsx               # Entry point
│   └── index.css              # Global styles
├── server/                      # Backend source code
│   ├── config/
│   │   └── database.js        # MongoDB connection
│   ├── middleware/
│   │   └── auth.js            # JWT authentication middleware
│   ├── models/
│   │   ├── User.js            # User model
│   │   └── Trade.js           # Trade model
│   ├── routes/
│   │   ├── auth.js            # Authentication routes
│   │   ├── trades.js           # Trade routes
│   │   └── market.js          # Market prediction routes
│   ├── services/
│   │   ├── aiService.js        # Google Gemini AI service
│   │   ├── psychologyService.js # Psychology analysis service
│   │   ├── analyticsService.js  # Performance analytics service
│   │   ├── stockDataService.js  # Stock data fetching service
│   │   └── technicalAnalysisService.js # Technical indicators
│   ├── server.js              # Express server setup
│   └── package.json           # Backend dependencies
├── .gitignore                  # Git ignore rules
├── package.json               # Frontend dependencies
├── vite.config.js             # Vite configuration
├── tailwind.config.js         # Tailwind CSS configuration
└── README.md                  # This file
```

## 🎨 Design

- **Color Scheme**: Dark theme with slate-900 background and blue accents
- **Typography**: Poppins font family
- **Responsive**: Mobile-first design, fully responsive
- **UI/UX**: Modern, clean interface optimized for trading workflows

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request. Here are some ways you can contribute:

1. **Bug Reports**: Open an issue if you find a bug
2. **Feature Requests**: Suggest new features or improvements
3. **Code Contributions**: Submit pull requests for bug fixes or new features
4. **Documentation**: Improve documentation or add examples
5. **Testing**: Add tests or improve test coverage

### Development Guidelines

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

Please ensure your code follows the existing style and includes appropriate tests.

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Google Gemini AI** - For providing free AI API for trade analysis
- **MongoDB Atlas** - For free cloud database hosting
- **Yahoo Finance** - For stock market data APIs
- **React Community** - For excellent documentation and tools

## 🔮 Roadmap

- [ ] Real-time stock price updates
- [ ] Advanced charting with TradingView integration
- [ ] Portfolio management features
- [ ] Export/Import trades (CSV, Excel)
- [ ] Mobile app (React Native)
- [ ] Social features (share trades, leaderboards)
- [ ] Backtesting capabilities
- [ ] Multi-currency support
- [ ] Broker API integrations

## 📧 Support

- **Issues**: [GitHub Issues](https://github.com/yourusername/tradelogx/issues)
- **Discussions**: [GitHub Discussions](https://github.com/yourusername/tradelogx/discussions)
- **Email**: support@tradelogx.com (if applicable)

## ⚠️ Disclaimer

This software is for educational and personal use only. Trading in the stock market involves risk, and past performance does not guarantee future results. The AI predictions and analysis provided by this application are for informational purposes only and should not be considered as financial advice. Always do your own research and consult with a qualified financial advisor before making investment decisions.

---

**Made with ❤️ for Indian Stock Market Traders**

If you find this project helpful, please consider giving it a ⭐ on GitHub!
