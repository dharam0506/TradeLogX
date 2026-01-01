# Dashboard Features Breakdown

Based on the **Indian Stock Market Trade Diary with AI Features** plan, here's what will be included in the Dashboard section.

---

## 🎯 Dashboard Overview

The Dashboard is the main authenticated page where users manage their Indian stock trades and access all AI-powered features.

---

## 📋 Core Sections in Dashboard

### 1. **Trade List/Management Section**

**Purpose:** Display and manage all user trades

**Features:**

- List of all trades with Indian stock symbols (NSE/BSE)
- Display trade information:
  - Symbol (RELIANCE, TCS, INFY, etc.)
  - Exchange (NSE/BSE)
  - Trade Type (Long/Short)
  - Entry Price
  - Exit Price (if closed)
  - Quantity
  - P&L (Profit/Loss in INR)
  - Status (Open/Closed)
  - Entry/Exit Dates
  - Emotion tag (for psychology tracking)
  - Notes and tags
- **Add Trade Button/Modal** - Open form to create new trade
- Trade actions:
  - View trade details
  - Edit trade
  - Delete trade
  - Analyze trade (triggers AI Summarizer)
- Filters:
  - By status (All/Open/Closed)
  - By symbol
  - By exchange (NSE/BSE)
  - By date range (dateFrom, dateTo)
- Search functionality

**Component:** Trade list/table with Indian stock focus

---

### 2. **AI Summarizer Section**

**Purpose:** Get AI-powered trade analysis using Google Gemini

**Features:**

- **"Analyze Trade" button** on each trade card/item
- Modal/card displaying AI-generated summary
- Analysis includes:
  - Trade patterns identified
  - Insights in plain English
  - Strengths & weaknesses detection
  - Performance patterns
- Loading state during AI analysis
- Error handling for API failures
- AI analysis stored in trade document (`aiAnalysis` field)

**Component:** `AISummarizer.jsx`
**Backend:** `POST /api/trades/:id/analyze`

---

### 3. **Psychology Tracking Section**

**Purpose:** Track emotions and identify behavioral patterns

**Features:**

- **Emotion Distribution Chart** (pie/bar chart)
  - Shows distribution of emotions: fear, greed, confidence, anxiety, calm
- **Behavior Pattern Cards** displaying:
  - Fear exits (exiting too early)
  - Revenge trading (trading after losses)
  - Overtrading patterns
  - Best emotional states for profitable trades
- **Insights and Recommendations**
  - Psychology insights based on trading behavior
  - Recommendations for improvement
- **Emotion Selector** (integrated in Trade Form)
  - Dropdown/selector when logging trades

**Component:** `PsychologyTracking.jsx`
**Backend:** `GET /api/trades/psychology/patterns`

**Data Shown:**

- Emotion distribution across all trades
- Behavioral patterns analysis
- Psychology-based insights

---

### 4. **Performance Analytics Section**

**Purpose:** Analyze trading performance with comprehensive metrics

**Features:**

- **Statistics Cards** showing:

  - Total P&L (Profit/Loss in INR)
  - Win Rate (%)
  - Loss Rate (%)
  - Total Trades (count)
  - Open Positions (count)
  - Average Win
  - Average Loss
  - Profit Factor

- **Charts:**

  - **Equity Curve** - Line chart showing cumulative P&L over time
  - **Win/Loss Distribution** - Pie/bar chart
  - **Performance by Stock** - Bar chart showing best/worst performing stocks
  - Monthly/Weekly performance trends

- **Strengths/Weaknesses Section:**

  - List of strengths (what's working)
  - List of weaknesses (improvement areas)
  - Best performing stocks
  - Worst performing stocks
  - Best performing strategies
  - Worst performing strategies

- **Insights and Recommendations:**
  - Actionable insights based on analytics
  - Performance recommendations

**Component:** `PerformanceAnalytics.jsx`
**Backend:** `GET /api/trades/analytics/insights`

**Libraries:** Recharts for visualizations

---

### 5. **AI Prediction Meter Widget**

**Purpose:** Get bullish/bearish predictions for Indian stocks

**Features:**

- **Stock Symbol Input/Selector**
  - Input field for Indian stock symbols (RELIANCE, TCS, etc.)
  - Exchange selector (NSE/BSE dropdown)
- **Prediction Meter** (Visual Gauge)

  - Visual indicator showing bullish/bearish direction
  - Color coding: Green for bullish, Red for bearish
  - Confidence percentage (0-100%)

- **Technical Indicators Breakdown:**

  - RSI (Relative Strength Index)
  - MACD (Moving Average Convergence Divergence)
  - Moving Averages (SMA, EMA)
  - Support & Resistance levels

- **"Refresh Prediction" Button**
  - Update prediction with latest market data

**Component:** `AIPredictionMeter.jsx`
**Backend:**

- `GET /api/market/predict/:symbol` (single stock)
- `GET /api/market/predict/bulk` (multiple stocks)

---

### 6. **Trade Form Component** (Modal/Page)

**Purpose:** Create and edit trades

**Fields:**

- **Symbol** input (text field for stock symbol)
- **Exchange** dropdown (NSE/BSE)
- **Trade Type** (Long/Short radio buttons)
- **Entry Price** (number)
- **Exit Price** (number, optional for open trades)
- **Quantity** (number)
- **Entry Date/Time** (date-time picker)
- **Exit Date/Time** (date-time picker, optional)
- **Fees** (number, default 0) - Brokerage + taxes
- **Emotion Selector** (dropdown: fear, greed, confidence, anxiety, calm)
- **Notes** (textarea)
- **Tags** (multi-select or comma-separated input)

**Actions:**

- Submit/Create trade
- Cancel
- Edit mode (pre-filled with existing trade data)

**Component:** `TradeForm.jsx`
**Backend:**

- `POST /api/trades` (create)
- `PUT /api/trades/:id` (update)

---

## 🎨 Dashboard Layout Structure

```
┌─────────────────────────────────────────────────────────┐
│  Navigation Bar (with Logout)                           │
├─────────────────────────────────────────────────────────┤
│  Welcome Message + Add Trade Button                     │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  ┌──────────────────┐  ┌──────────────────┐           │
│  │ Performance      │  │ AI Prediction    │           │
│  │ Analytics        │  │ Meter Widget     │           │
│  │ - Stats Cards    │  │                  │           │
│  │ - Charts         │  │                  │           │
│  │ - Insights       │  │                  │           │
│  └──────────────────┘  └──────────────────┘           │
│                                                          │
│  ┌──────────────────┐  ┌──────────────────┐           │
│  │ Psychology       │  │ AI Summarizer    │           │
│  │ Tracking         │  │ Section          │           │
│  │ - Emotion Chart  │  │ (per trade)      │           │
│  │ - Patterns       │  │                  │           │
│  │ - Insights       │  │                  │           │
│  └──────────────────┘  └──────────────────┘           │
│                                                          │
│  ┌──────────────────────────────────────────────┐     │
│  │ Trade List                                    │     │
│  │ - All trades with filters                    │     │
│  │ - Actions: View, Edit, Delete, Analyze       │     │
│  └──────────────────────────────────────────────┘     │
│                                                          │
└─────────────────────────────────────────────────────────┘
```

---

## 📊 Summary of Dashboard Components

1. **Trade List** - Main trading activity display
2. **Add Trade Form** - Create new trades (Indian stocks)
3. **AI Summarizer** - Per-trade AI analysis
4. **Psychology Tracking** - Emotion & behavior analysis
5. **Performance Analytics** - Comprehensive performance metrics
6. **AI Prediction Meter** - Market direction predictions

---

## 🔗 API Endpoints Used

- `GET /api/trades` - Get all trades
- `GET /api/trades/:id` - Get single trade
- `POST /api/trades` - Create trade
- `PUT /api/trades/:id` - Update trade
- `DELETE /api/trades/:id` - Delete trade
- `GET /api/trades/stats/summary` - Trading statistics
- `POST /api/trades/:id/analyze` - AI analysis
- `GET /api/trades/psychology/patterns` - Psychology patterns
- `GET /api/trades/analytics/insights` - Analytics insights
- `GET /api/market/predict/:symbol` - Stock prediction
- `GET /api/market/predict/bulk` - Bulk predictions

---

## 🎯 Key Features Focus

- **Indian Stock Market** - NSE/BSE symbols only
- **AI-Powered** - Google Gemini integration
- **Psychology Tracking** - Emotion-based insights
- **Performance Analytics** - Comprehensive metrics
- **Market Predictions** - Technical analysis-based

---

## 📝 Implementation Notes

- Dashboard should be responsive (mobile & desktop)
- Follow dark theme (slate-900, slate-800)
- Use blue-500 for primary actions
- Green for bullish/positive, Red for bearish/negative
- All data is user-specific (authenticated users only)
- Real-time updates when trades are added/edited/deleted
