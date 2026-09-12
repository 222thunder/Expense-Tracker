# X-PENSE: Dashboard & Application Context

## 1. Executive Summary & Mission
This document outlines the architectural blueprint, state management design, and UX specification for the **X-PENSE Dashboard** suite. It bridges the visual principles defined in [`design.md`](./design.md) (Maximalist Swiss Brutalism) with the data contracts documented in [`backend/backendGuide.md`](../backend/backendGuide.md).

The goal of this phase is to deliver a fully functional, highly interactive dashboard with modular Outlet sub-views, backed by a centralized React Context with realistic mock fixtures that mirror the backend API 1:1, enabling an instant drop-in switch to live Axios requests later.

---

## 2. Route & Navigation Architecture

The application utilizes React Router (`router.jsx`) with a nested layout structure under `/dashboard`:

```
/ (Landing Page)
/login (Authentication)
/signup (Registration)
/verify-email (Handshake / OTP verification)
/dashboard (Layout: Adaptive Header + Sub-Nav/Sidebar + Outlet + Footer)
  ├── /dashboard                  -> Overview & Command Center (Index route)
  ├── /dashboard/transactions     -> Full Ledger, Filter Toolbar, Pagination
  └── /dashboard/analytics        -> Bespoke Visualizations & Burn Breakdowns
```

### 2.1 Navigation & Adaptive Header
* **Public Mode** (Landing, Login, Signup): Shows standard branding, `Login` and `Initialize` action links.
* **Authenticated Mode** (Inside `/dashboard`):
  * **User Ident Badge**: Monospace pill displaying active username/ident (`USER@SYSTEM.COM`).
  * **Global Quick-Add CTA**: High-contrast button (`+ NEW ENTRY`) triggering the slide-over transaction drawer.
  * **Tactile Logout Action**: Mechanical button that invalidates session and navigates back to `/login`.
* **Dashboard Sub-Nav / Sidebar**:
  * Tactile tab links with active brutalist shadow states (`OVERVIEW`, `LEDGER`, `ANALYTICS`).

---

## 3. Screen Specifications & Layouts

### 3.1 Overview Command Center (`/dashboard`)
* **Hero Metric Grid**: 3 prominent, heavy-bordered cards (`3px solid #0a0a0a`, `.brutal-shadow`):
  1. **Net Capital Balance**: Dark block (`#0a0a0a` background, white text) with delta indicator.
  2. **Monthly Inflow**: Cobalt Blue (`#0037ff`) accent header with total income.
  3. **Monthly Burn**: Safety Orange (`#ff3300`) accent header with total expenses and burn rate percentage.
* **Dual-Column Command Layout**:
  * **Left Column (Recent Activity)**: High-density preview of the last 5 transactions with date, category chip, title, and colored amount (+/-). Quick link to view full ledger.
  * **Right Column (Category Burn & Quick Meter)**: Stacked brutalist progress bars for top spending categories (Rent, Food, Utilities) showing raw totals and percentage burn.

### 3.2 Full Transactions Ledger (`/dashboard/transactions`)
* **Brutalist Filter & Search Toolbar**:
  * **Search Input**: Real-time text filter matching `title` and `description`.
  * **Type Toggle Pills**: Mechanical button group (`ALL`, `INCOME`, `EXPENSE`).
  * **Category Filter**: Dropdown with brutalist borders.
  * **Date Range Controls**: Start and end date selectors matching the backend query contract.
* **Receipt-Style Transaction Table**:
  * Column headers: `DATE`, `TITLE / DESCRIPTION`, `CATEGORY`, `TYPE`, `AMOUNT`, `ACTIONS`.
  * Actions per row: **Edit** (opens pre-filled drawer) and **Delete** (with confirmation prompt).
* **Pagination Controls**: Tactile page stepper (`PREV`, `PAGE X OF Y`, `NEXT`) honoring backend pagination response format (`page`, `limit`, `total`, `totalPages`).

### 3.3 Analytics & Reports (`/dashboard/analytics`)
* **Bespoke SVG & CSS Visualizations** (No bulky external chart libraries):
  * **12-Month Inflow vs. Burn Trend**: Custom dual-bar SVG histogram contrasting Monthly Income (Cobalt Blue) vs Monthly Expense (Safety Orange) across all 12 calendar months.
  * **Category Distribution Meter**: Solid geometric progress distribution bar with color-coded segments and accompanying legend table showing transaction count and percentages.
  * **Burn Velocity Indicator**: High-impact callout card visualizing net savings rate against monthly targets.

### 3.4 Slide-Over Transaction Drawer / Modal
* Accessible globally via the Header or contextual action buttons.
* **Fields**:
  * **Type Selector**: Heavy mechanical toggle switch between `EXPENSE` (Safety Orange) and `INCOME` (Cobalt Blue).
  * **Amount**: Giant numeric input field with currency prefix.
  * **Title**: Transaction title (e.g. `Monthly Rent`, `Supermarket`).
  * **Category**: Predefined categories (`Salary`, `Freelance`, `Rent`, `Food`, `Utilities`, `Entertainment`, `Health`, `Transport`, `Other`).
  * **Date**: Defaults to current ISO date/timestamp.
  * **Description**: Optional multi-line notes area.
* **Save / Update Button**: `.brutal-shadow` action button with tactile press feedback.

---

## 4. Backend Contract & Data Schemas

The frontend state and models match the specifications in `backend/backendGuide.md` exactly:

### 4.1 Transaction Object Structure
```typescript
interface Transaction {
  _id: string;
  user: string;
  title: string;
  amount: number;
  type: "income" | "expense";
  category: string;
  date: string; // ISO 8601 string
  description?: string;
  createdAt: string;
  updatedAt: string;
}
```

### 4.2 Financial Summary Response (`GET /api/transaction/summary`)
```json
{
  "income": 50000,
  "expense": 32500,
  "balance": 17500
}
```

### 4.3 Monthly Summary Response (`GET /api/transaction/monthly-summary?year=2026`)
```json
{
  "year": 2026,
  "monthlySummary": [
    {
      "month": "January",
      "monthNumber": 1,
      "income": 50000,
      "expense": 32000,
      "balance": 18000
    }
    // ... all 12 months
  ]
}
```

### 4.4 Category Summary Response (`GET /api/transaction/category-summary`)
```json
{
  "totalIncome": 50000,
  "totalExpense": 32500,
  "categories": {
    "income": [
      { "category": "Salary", "total": 50000, "count": 1, "percentage": 100 }
    ],
    "expense": [
      { "category": "Rent", "total": 15000, "count": 1, "percentage": 46.15 },
      { "category": "Food", "total": 9500, "count": 8, "percentage": 29.23 }
    ]
  }
}
```

---

## 5. Centralized State: `TransactionContext`

To enable instantaneous feedback without waiting on live networking during design validation, all data operations are managed through a single React Context:

### 5.1 Context API Interface
```javascript
const TransactionContext = createContext({
  transactions: [],
  summary: { income: 0, expense: 0, balance: 0 },
  monthlySummary: [],
  categorySummary: { income: [], expense: [] },
  loading: false,
  // CRUD Actions
  addTransaction: (transactionData) => {},
  updateTransaction: (id, updatedFields) => {},
  deleteTransaction: (id) => {},
  // Filter & Query Controls
  filters: { search: "", type: "all", category: "all", startDate: "", endDate: "", page: 1, limit: 10 },
  setFilters: (newFilters) => {},
  // Global Drawer Controls
  isDrawerOpen: false,
  editingTransaction: null,
  openCreateDrawer: () => {},
  openEditDrawer: (transaction) => {},
  closeDrawer: () => {}
});
```

### 5.2 Transition Path to Live API
When ready to connect to the Node.js / Express backend:
1. `TransactionContext.jsx` will replace internal array manipulations with `axios.post`, `axios.get`, `axios.patch`, and `axios.delete` calls.
2. The payload structure, field names, and mathematical aggregates are already 100% aligned with the controller implementations in `backend/controllers/transaction.controller.js`.

---

## 6. Implementation Roadmap

1. **Phase 1: State & Layout Foundation**
   * Create `src/context/TransactionContext.jsx` with rich mock data and helper calculation methods.
   * Update `Navbar.jsx` with adaptive authenticated state and Quick-Add CTA.
   * Build `DashboardNav.jsx` sub-navigation component.
   * Create the global slide-over `TransactionDrawer.jsx`.
2. **Phase 2: Outlet Views**
   * Implement `Overview.jsx` (metric blocks, quick recent list, category progress).
   * Implement `TransactionsLedger.jsx` (filter bar, receipt table, pagination, delete confirm).
   * Implement `Analytics.jsx` (custom SVG monthly trend bars, category pie/gauge meters).
   * Wire sub-routes into `router.jsx` under `/dashboard`.
3. **Phase 3: Live API & Authentication Hookup**
   * Axios client with interceptors for JWT Bearer token and automatic refresh token cookie flow.
   * Wire login, signup, and verify email to `/api/auth` endpoints.
   * Toggle `TransactionContext` from mock storage to live backend endpoints.
