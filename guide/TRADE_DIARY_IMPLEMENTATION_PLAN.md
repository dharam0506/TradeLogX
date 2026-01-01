# Trade Diary Implementation Plan

## Overview
This document outlines the step-by-step implementation plan for building a complete Trade Diary feature in your application. This will allow users to log, track, and analyze their trading activities.

---

## 🎯 Project Goals
- Users can log their trades with detailed information
- View, edit, and delete trade entries
- Filter and search trades
- View trading statistics and summaries
- Secure access (only authenticated users can access their own trades)

---

## 📋 Implementation Steps

### **PHASE 0: Authentication Flow Setup** (Prerequisite - Signup First Flow)

#### Step 0.1: Separate Signup and Login Pages
**What to do:**
- Create separate `Signup.jsx` page (default/first step)
- Modify `Login.jsx` to be login-only (second step)
- Update routing to enforce signup-first flow
- After signup success, redirect to login page (not auto-login)
- After login success, redirect to dashboard
- Protect home and other pages to require authentication

**Prompt to use:**
```
Create a signup-first authentication flow:

1. Create src/pages/Signup.jsx:
   - Signup form with: Name, Email, Password (with show/hide toggle)
   - Validation and error handling
   - After successful signup, show success message and redirect to /login
   - Do NOT auto-login after signup (user must log in separately)
   - Include link to login page if user already has account

2. Update src/pages/Login.jsx:
   - Remove the toggle between signup/login
   - Make it login-only form
   - After successful login, redirect to /dashboard (not home)
   - Include link to signup page if user doesn't have account

3. Update src/App.jsx:
   - Add /signup route pointing to Signup component
   - Update /login route to Login component
   - Create ProtectedRoute wrapper to protect routes (home, dashboard, etc.)
   - Redirect unauthenticated users to /signup

4. Update src/components/Navigation.jsx:
   - Show "Sign Up" button when not authenticated (default)
   - Show "Login" button when not authenticated
   - Show "Dashboard" and "Logout" when authenticated
   - Check auth status using isAuthenticated() from utils/api.js

5. Create src/components/ProtectedRoute.jsx:
   - Check if user is authenticated
   - If not, redirect to /signup
   - If yes, render the protected component
   - Show loading state during check

Style everything with Tailwind CSS matching existing dark theme.
```

#### Step 0.2: Create Dashboard Page (Basic)
**What to do:**
- Create basic Dashboard page that authenticated users land on after login
- Will be expanded later with trade diary features

**Prompt to use:**
```
Create a basic Dashboard page in src/pages/Dashboard.jsx:
- Welcome message with user's name
- Simple layout showing "Welcome to Trade Diary"
- Navigation to future features
- Logout functionality
- Protected route (requires authentication)

Use Tailwind CSS matching the existing theme.
Add to App.jsx routes protected by ProtectedRoute.
```

---

### **PHASE 1: Backend Foundation** (Core Database & API)

#### Step 1.1: Create Trade Model
**What to do:**
- Create a `Trade.js` model in `server/models/`
- Define trade schema with fields like:
  - Instrument/Symbol (e.g., "AAPL", "EURUSD")
  - Trade Type (Buy/Sell, Long/Short)
  - Entry Price
  - Exit Price
  - Quantity/Size
  - Entry Date/Time
  - Exit Date/Time
  - Profit/Loss
  - Fees/Commission
  - Notes/Strategy
  - Tags/Categories
  - User reference (who owns this trade)

**Prompt to use:**
```
Create a Trade model in server/models/Trade.js with the following schema:
- symbol (required string): Trading symbol/instrument
- tradeType (required enum): 'long' or 'short'
- entryPrice (required number): Entry price
- exitPrice (number): Exit price (if closed)
- quantity (required number): Position size/quantity
- entryDate (required date): Entry date/time
- exitDate (date): Exit date/time (if closed)
- profitLoss (number): Calculated P&L
- fees (number, default 0): Trading fees/commission
- notes (string): Additional notes/strategy
- tags (array of strings): Tags for categorization
- status (enum, default 'open'): 'open' or 'closed'
- user (ObjectId, ref: 'User', required): Owner of the trade

Add pre-save hooks to calculate profitLoss automatically.
Include indexes on user and entryDate for better query performance.
```

#### Step 1.2: Create Trade Routes
**What to do:**
- Create `server/routes/trades.js`
- Implement CRUD operations:
  - GET `/api/trades` - Get all user's trades (with filters)
  - GET `/api/trades/:id` - Get single trade
  - POST `/api/trades` - Create new trade
  - PUT `/api/trades/:id` - Update trade
  - DELETE `/api/trades/:id` - Delete trade
  - GET `/api/trades/stats/summary` - Get trading statistics

**Prompt to use:**
```
Create trade routes in server/routes/trades.js with the following endpoints:
1. GET /api/trades - Get all trades for authenticated user (support query params: status, symbol, dateFrom, dateTo, page, limit)
2. GET /api/trades/:id - Get single trade by ID (verify ownership)
3. POST /api/trades - Create new trade (validate all required fields)
4. PUT /api/trades/:id - Update trade (verify ownership)
5. DELETE /api/trades/:id - Delete trade (verify ownership)
6. GET /api/trades/stats/summary - Get trading statistics (total P&L, win rate, total trades, etc.)

All routes should use the authenticateToken middleware.
Ensure users can only access their own trades.
Use express-validator for request validation.
```

#### Step 1.3: Register Trade Routes in Server
**What to do:**
- Update `server/server.js` to include trade routes

**Prompt to use:**
```
Update server/server.js to import and register the trades routes at /api/trades endpoint.
Use the authenticateToken middleware for all trade routes.
```

---

### **PHASE 2: Frontend API Integration**

#### Step 2.1: Extend API Utilities
**What to do:**
- Add trade API functions to `src/utils/api.js`

**Prompt to use:**
```
Extend src/utils/api.js to add tradeAPI object with the following functions:
- getAllTrades(filters) - Get all trades with optional filters
- getTradeById(id) - Get single trade
- createTrade(tradeData) - Create new trade
- updateTrade(id, tradeData) - Update trade
- deleteTrade(id) - Delete trade
- getTradeStats() - Get trading statistics

All functions should use the existing apiRequest helper and handle errors appropriately.
```

---

### **PHASE 3: Frontend Components & Pages**

#### Step 3.1: Create Dashboard Page
**What to do:**
- Create `src/pages/Dashboard.jsx` as the main trade diary page
- Display trade list, filters, and statistics

**Prompt to use:**
```
Create a Dashboard page component in src/pages/Dashboard.jsx with:
- Header section with page title and "Add Trade" button
- Statistics cards showing: Total P&L, Win Rate, Total Trades, Open Positions
- Filter bar with: Status (All/Open/Closed), Symbol search, Date range
- Trade table/list showing: Symbol, Type, Entry Price, Exit Price, Quantity, P&L, Date, Actions (Edit/Delete)
- Loading states and error handling
- Empty state when no trades exist

Use Tailwind CSS for styling matching the existing dark theme (slate-900, slate-800).
Make it responsive for mobile and desktop.
```

#### Step 3.2: Create Trade Form Component
**What to do:**
- Create `src/components/TradeForm.jsx` for adding/editing trades
- Modal or separate page for form

**Prompt to use:**
```
Create a TradeForm component in src/components/TradeForm.jsx with:
- Form fields for: Symbol, Trade Type (radio: Long/Short), Entry Price, Exit Price (optional), Quantity, Entry Date/Time, Exit Date/Time (optional), Fees, Notes, Tags (multi-select or comma-separated)
- Form validation
- Submit and Cancel buttons
- Support both "create" and "edit" modes (accept initialValues prop)
- Loading state during submission
- Success/error messages

Use a modal overlay for better UX (can be triggered from Dashboard).
Style with Tailwind CSS matching the existing theme.
```

#### Step 3.3: Create Trade Table/List Component
**What to do:**
- Create reusable component for displaying trades
- Support sorting, filtering, pagination

**Prompt to use:**
```
Create a TradeTable component in src/components/TradeTable.jsx:
- Display trades in a table or card list format
- Show: Symbol, Type badge (Long/Short), Entry/Exit prices, Quantity, P&L (with color coding: green for profit, red for loss), Status badge, Entry Date, Actions (Edit/Delete icons)
- Make rows/cards clickable to view details
- Add sorting functionality (by date, P&L, symbol)
- Add pagination if many trades
- Empty state when no trades match filters

Use Tailwind CSS for styling. Make it responsive.
```

#### Step 3.4: Create Statistics Cards Component
**What to do:**
- Create component to display trading statistics

**Prompt to use:**
```
Create a StatsCards component in src/components/StatsCards.jsx:
- Display 4 cards in a grid: Total P&L, Win Rate (%), Total Trades, Open Positions
- Show icons for each stat
- Color code P&L (green/red)
- Loading skeleton state
- Make cards visually appealing with gradients or borders

Use Tailwind CSS matching the existing design system.
```

#### Step 3.5: Update Navigation
**What to do:**
- Add Dashboard link to navigation
- Add logout functionality
- Show user info if logged in

**Prompt to use:**
```
Update src/components/Navigation.jsx to:
- Add "Dashboard" link that appears when user is authenticated
- Add "Logout" button when authenticated
- Show user's name/email when logged in
- Hide Login link when authenticated, show it when not
- Use isAuthenticated() from utils/api.js to check auth status
```

#### Step 3.6: Add Protected Route Wrapper
**What to do:**
- Create component to protect routes (redirect to login if not authenticated)

**Prompt to use:**
```
Create a ProtectedRoute component in src/components/ProtectedRoute.jsx:
- Check if user is authenticated using isAuthenticated()
- If not authenticated, redirect to /login
- If authenticated, render the child component (the protected page)
- Show loading state while checking authentication

Use this component to wrap the Dashboard route in App.jsx.
```

#### Step 3.7: Update App Routes
**What to do:**
- Add Dashboard route
- Add route for trade detail/edit pages if needed

**Prompt to use:**
```
Update src/App.jsx to:
- Import ProtectedRoute and Dashboard
- Add route for /dashboard protected by ProtectedRoute
- Optionally add /dashboard/trades/:id route for trade detail/edit page
```

---

### **PHASE 4: Advanced Features** (Optional Enhancements)

#### Step 4.1: Trade Charts/Analytics
**What to do:**
- Add charts for P&L over time
- Add pie chart for win/loss distribution

**Prompt:**
```
Add chart visualizations to Dashboard:
- Line chart showing cumulative P&L over time
- Pie chart showing win vs loss trades
- Bar chart showing P&L by symbol

Use a charting library like recharts or chart.js.
```

#### Step 4.2: Export/Import Functionality
**What to do:**
- Allow users to export trades to CSV
- Import trades from CSV

**Prompt:**
```
Add export/import functionality:
- Export button in Dashboard to download trades as CSV
- Import button to upload CSV and bulk create trades
- Validate imported data before saving
```

#### Step 4.3: Advanced Filtering & Search
**What to do:**
- Add more filter options
- Save filter presets

**Prompt:**
```
Enhance filtering:
- Filter by profit/loss range
- Filter by date range with date picker
- Search by notes/tags
- Save filter presets (store in localStorage)
```

---

## 🔧 Technical Requirements

### Backend
- ✅ Express.js server
- ✅ MongoDB with Mongoose
- ✅ JWT authentication
- ✅ Express validator for input validation

### Frontend
- ✅ React with Vite
- ✅ React Router for navigation
- ✅ Tailwind CSS for styling
- ✅ LocalStorage for token management

### Additional Packages Needed (if required)
- Date picker library (e.g., react-datepicker)
- Chart library (optional, e.g., recharts)
- Modal library (optional, or build custom)

---

## 🎨 Design Guidelines

- Follow existing dark theme (slate-900, slate-800)
- Use blue-500 for primary actions
- Maintain consistent spacing and typography
- Ensure mobile responsiveness
- Add smooth transitions and loading states

---

## ✅ Testing Checklist

After each phase, test:
- [ ] Can create a trade entry
- [ ] Can view all trades
- [ ] Can edit a trade
- [ ] Can delete a trade
- [ ] Only authenticated users can access
- [ ] Users can only see their own trades
- [ ] Statistics calculate correctly
- [ ] Filters work properly
- [ ] Mobile responsive
- [ ] Error handling works

---

## 📝 Notes

1. **Start with Phase 1** - Backend foundation is critical
2. **Test each step** - Don't move forward until current step works
3. **Use the prompts** - Each step has a ready-to-use prompt for implementation
4. **Iterate** - Start simple, add features incrementally
5. **Security** - Always verify ownership in backend routes

---

## 🚀 Quick Start Guide

### Authentication First (Phase 0):
1. Start with **Step 0.1** (Separate Signup and Login Pages)
2. Complete **Step 0.2** (Create Basic Dashboard)
3. Test the flow: Signup → Login → Dashboard access

### Then Build Trade Diary (Phase 1+):
4. Start with **Step 1.1** (Create Trade Model)
5. Move to **Step 1.2** (Create Trade Routes)
6. Complete **Step 1.3** (Register Routes)
7. Test backend with Postman/Thunder Client
8. Then move to **Phase 2** (Frontend API)
9. Continue with **Phase 3** (Components)

---

## 📌 Important Notes on Authentication Flow

- **Signup is mandatory first step** - Users cannot access site without signing up
- **After signup** → User is redirected to login page (must log in separately)
- **After login** → User is redirected to Dashboard (main authenticated area)
- **All site features** → Protected by authentication (except signup/login pages)
- **Navigation** → Shows Signup/Login when not authenticated, Dashboard/Logout when authenticated

---

**Ready to start? Begin with Step 0.1 (Authentication Setup)!** 🎯

