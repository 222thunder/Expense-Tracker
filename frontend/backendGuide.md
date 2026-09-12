# Backend API Guide & Endpoint Reference

Complete documentation for all backend endpoints in the Expense Tracker API, including authentication requirements, request headers, input bodies/query params, and response payloads.

---

## 1. Authentication Routes (`/api/auth`)

### 1.1 Register User

- **Method & URL**: `POST /api/auth/register`
- **Authentication**: None
- **Headers**: `Content-Type: application/json`
- **Request Body**:
  ```json
  {
    "email": "user@example.com",
    "password": "Password123!",
    "username": "johndoe"
  }
  ```
- **Success Response (`201 Created`)**:
  ```json
  {
    "message": "User registered successfully",
    "user": {
      "email": "user@example.com",
      "username": "johndoe",
      "verified": false
    }
  }
  ```
- **Errors**: `409 Conflict` (User already exists), `500 Internal Server Error` (Email failure)

---

### 1.2 Verify Email with OTP

- **Method & URL**: `POST /api/auth/verify-email`
- **Authentication**: None
- **Headers**: `Content-Type: application/json`
- **Request Body**:
  ```json
  {
    "email": "user@example.com",
    "otp": "481920"
  }
  ```
- **Success Response (`200 OK`)**:
  ```json
  {
    "message": "Email verified ",
    "user": {
      "username": "johndoe",
      "email": "user@example.com",
      "verified": true
    }
  }
  ```
- **Errors**: `400 Bad Request` (Invalid Otp), `404 Not Found` (User not found)

---

### 1.3 Resend / Reset Verification OTP

- **Method & URL**: `POST /api/auth/resend-otp` _(also aliased to `POST /api/auth/reset-otp`)_
- **Authentication**: None
- **Headers**: `Content-Type: application/json`
- **Request Body**:
  ```json
  {
    "email": "user@example.com"
  }
  ```
- **Success Response (`200 OK`)**:
  ```json
  {
    "message": "New OTP sent to your email successfully"
  }
  ```
- **Errors**: `400 Bad Request` (Email missing / already verified), `404 Not Found` (User not found), `500 Internal Server Error`

---

### 1.4 Login

- **Method & URL**: `POST /api/auth/login`
- **Authentication**: None
- **Headers**: `Content-Type: application/json`
- **Request Body**:
  ```json
  {
    "email": "user@example.com",
    "password": "Password123!"
  }
  ```
- **Success Response (`200 OK`)**:
  - _Sets HttpOnly Cookie_: `refreshToken` (valid for 7 days)
  ```json
  {
    "message": "Login successful",
    "user": {
      "email": "user@example.com",
      "username": "johndoe"
    },
    "accessToken": "eyJhbGciOiJIUzI1NiIsIn..."
  }
  ```
- **Errors**: `401 Unauthorized` (Invalid password / Email not verified), `404 Not Found` (User not found)

---

### 1.5 Refresh Access Token

- **Method & URL**: `GET /api/auth/refresh-token`
- **Authentication**: Cookie-based
- **Cookies**: `refreshToken=<token>`
- **Success Response (`200 OK`)**:
  - _Updates HttpOnly Cookie_: `refreshToken`
  ```json
  {
    "message": "Access token refreshed successfully",
    "accessToken": "eyJhbGciOiJIUzI1NiIsIn..."
  }
  ```
- **Errors**: `401 Unauthorized` (Refresh token missing, invalid, or expired)

---

### 1.6 Get Current User (`Me`)

- **Method & URL**: `GET /api/auth/me`
- **Authentication**: Required
- **Headers**: `Authorization: Bearer <accessToken>`
- **Success Response (`200 OK`)**:
  ```json
  {
    "message": "User authenticated",
    "user": {
      "_id": "66e138a0f9b5c21098a7b123",
      "username": "johndoe",
      "email": "user@example.com",
      "verified": true,
      "profilePicture": "https://res.cloudinary.com/..."
    }
  }
  ```
- **Errors**: `401 Unauthorized` (Token missing, invalid, or expired)

---

### 1.7 Logout (Current Device)

- **Method & URL**: `POST /api/auth/logout`
- **Authentication**: Cookie-based
- **Cookies**: `refreshToken=<token>`
- **Success Response (`200 OK`)**:
  - _Clears Cookie_: `refreshToken`
  ```json
  {
    "message": "Logged Out successfully"
  }
  ```
- **Errors**: `400 Bad Request` (Token not found or invalid)

---

### 1.8 Logout All Devices

- **Method & URL**: `POST /api/auth/logout-all`
- **Authentication**: Required + Cookie
- **Headers**: `Authorization: Bearer <accessToken>`
- **Cookies**: `refreshToken=<token>`
- **Success Response (`200 OK`)**:
  - _Clears Cookie_: `refreshToken`
  ```json
  {
    "message": "Logged out from all devices successfully"
  }
  ```
- **Errors**: `400 Bad Request`, `401 Unauthorized`

---

## 2. Transaction Routes (`/api/transaction`)

> **Note**: All transaction endpoints (except `/hello`) require the header: `Authorization: Bearer <accessToken>`.

---

### 2.1 Create Transaction

- **Method & URL**: `POST /api/transaction`
- **Headers**: `Authorization: Bearer <accessToken>`, `Content-Type: application/json`
- **Request Body**:
  ```json
  {
    "title": "Monthly Salary",
    "amount": 50000,
    "type": "income",
    "category": "Salary",
    "date": "2026-09-01T00:00:00.000Z",
    "description": "September Salary"
  }
  ```
  _(Note: `date` defaults to current timestamp; `description` is optional; `type` must be `"income"` or `"expense"`)_
- **Success Response (`200 OK`)**:
  ```json
  {
    "message": "Transaction done successfully",
    "transaction": {
      "_id": "66e139b4f9b5c21098a7b456",
      "user": "66e138a0f9b5c21098a7b123",
      "title": "Monthly Salary",
      "amount": 50000,
      "type": "income",
      "category": "Salary",
      "date": "2026-09-01T00:00:00.000Z",
      "description": "September Salary",
      "createdAt": "2026-09-12T08:00:00.000Z",
      "updatedAt": "2026-09-12T08:00:00.000Z"
    }
  }
  ```

---

### 2.2 Get Paginated & Filtered Transactions

- **Method & URL**: `GET /api/transaction`
- **Headers**: `Authorization: Bearer <accessToken>`
- **Query Parameters (all optional)**:
  | Parameter | Type | Description |
  | :--- | :--- | :--- |
  | `page` | `number` | Page number (default: `1`) |
  | `limit` | `number` | Items per page (default: `20`, min: `1`, max: `100`) |
  | `type` | `string` | `"income"` or `"expense"` |
  | `category` | `string` | e.g. `"Food"`, `"Rent"` |
  | `search` | `string` | Case-insensitive match on `title` or `description` (regex-sanitized) |
  | `startDate`| `date` | Filter transactions on or after date (`YYYY-MM-DD`) |
  | `endDate` | `date` | Filter transactions on or before date (`YYYY-MM-DD`) |
- **Success Response (`200 OK`)**:
  ```json
  {
    "transactions": [
      {
        "_id": "66e139b4f9b5c21098a7b456",
        "user": "66e138a0f9b5c21098a7b123",
        "title": "Monthly Salary",
        "amount": 50000,
        "type": "income",
        "category": "Salary",
        "date": "2026-09-01T00:00:00.000Z",
        "description": "September Salary",
        "createdAt": "2026-09-12T08:00:00.000Z",
        "updatedAt": "2026-09-12T08:00:00.000Z"
      }
    ],
    "pagination": {
      "total": 35,
      "page": 1,
      "limit": 20,
      "totalPages": 2,
      "hasMore": true
    }
  }
  ```

---

### 2.3 Overall Financial Summary

- **Method & URL**: `GET /api/transaction/summary`
- **Headers**: `Authorization: Bearer <accessToken>`
- **Query Parameters (optional)**:
  - `startDate` (`date`, e.g. `?startDate=2026-09-01`)
  - `endDate` (`date`, e.g. `?endDate=2026-09-30`)
- **Success Response (`200 OK`)**:
  ```json
  {
    "income": 50000,
    "expense": 32500,
    "balance": 17500
  }
  ```

---

### 2.4 Monthly Summary (Chart Trend)

- **Method & URL**: `GET /api/transaction/monthly-summary`
- **Headers**: `Authorization: Bearer <accessToken>`
- **Query Parameters (optional)**:
  - `year` (`number`, e.g. `?year=2026`, defaults to current year)
- **Success Response (`200 OK`)**:
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
      },
      {
        "month": "February",
        "monthNumber": 2,
        "income": 50000,
        "expense": 29500,
        "balance": 20500
      }
      // ... all 12 months (Jan through Dec)
    ]
  }
  ```

---

### 2.5 Category Summary (Breakdown & Percentages)

- **Method & URL**: `GET /api/transaction/category-summary`
- **Headers**: `Authorization: Bearer <accessToken>`
- **Query Parameters (optional)**:
  - `type` (`"income"` or `"expense"`)
  - `startDate`, `endDate` (`date`)
- **Success Response (when `?type=expense`)**:
  ```json
  {
    "type": "expense",
    "total": 32500,
    "categories": [
      {
        "category": "Rent",
        "total": 15000,
        "count": 1,
        "percentage": 46.15
      },
      {
        "category": "Food",
        "total": 9500,
        "count": 8,
        "percentage": 29.23
      }
    ]
  }
  ```
- **Success Response (without `type` parameter)**:
  ```json
  {
    "totalIncome": 50000,
    "totalExpense": 32500,
    "categories": {
      "income": [
        {
          "category": "Salary",
          "total": 50000,
          "count": 1,
          "percentage": 100
        }
      ],
      "expense": [
        {
          "category": "Rent",
          "total": 15000,
          "count": 1,
          "percentage": 46.15
        }
      ]
    }
  }
  ```

---

### 2.6 Get Single Transaction by ID

- **Method & URL**: `GET /api/transaction/:id`
- **Headers**: `Authorization: Bearer <accessToken>`
- **URL Params**: `:id` (MongoDB ObjectId of the transaction)
- **Success Response (`200 OK`)**:
  ```json
  {
    "transaction": {
      "_id": "66e139b4f9b5c21098a7b456",
      "user": "66e138a0f9b5c21098a7b123",
      "title": "Monthly Salary",
      "amount": 50000,
      "type": "income",
      "category": "Salary",
      "date": "2026-09-01T00:00:00.000Z",
      "description": "September Salary"
    }
  }
  ```
- **Errors**: `404 Not Found` (Transaction not found or does not belong to user)

---

### 2.7 Update Transaction

- **Method & URL**: `PATCH /api/transaction/:id`
- **Headers**: `Authorization: Bearer <accessToken>`, `Content-Type: application/json`
- **URL Params**: `:id`
- **Request Body (all fields optional)**:
  ```json
  {
    "title": "Groceries & Supplies",
    "amount": 145.5,
    "category": "Groceries",
    "type": "expense",
    "date": "2026-09-12T10:00:00.000Z",
    "description": "Updated supermarket bill"
  }
  ```
- **Success Response (`200 OK`)**:
  ```json
  {
    "message": "Transaction updated",
    "transaction": {
      "_id": "66e139b4f9b5c21098a7b456",
      "user": "66e138a0f9b5c21098a7b123",
      "title": "Groceries & Supplies",
      "amount": 145.5,
      "category": "Groceries",
      "type": "expense",
      "date": "2026-09-12T10:00:00.000Z",
      "description": "Updated supermarket bill",
      "createdAt": "2026-09-12T08:30:00.000Z",
      "updatedAt": "2026-09-12T08:45:00.000Z"
    }
  }
  ```
- **Errors**: `404 Not Found`

---

### 2.8 Delete Transaction

- **Method & URL**: `DELETE /api/transaction/:id`
- **Headers**: `Authorization: Bearer <accessToken>`
- **URL Params**: `:id`
- **Success Response (`200 OK`)**:
  ```json
  {
    "message": "Transaction deleted"
  }
  ```
- **Errors**: `404 Not Found`

### Summary of Documented Endpoints

• Auth Routes (/api/auth):
• POST /register – Register account & send OTP
• POST /verify-email – Verify email via OTP
• POST /resend-otp (or /reset-otp) – Resend a fresh verification OTP
• POST /login – Login & receive access token + refresh cookie
• GET /refresh-token – Refresh expired access token
• GET /me – Fetch authenticated user profile
• POST /logout – Invalidate current session & clear cookie
• POST /logout-all – Invalidate all active sessions for user
• Transaction Routes (/api/transaction):
• POST / – Create a new income/expense transaction
• GET / – Fetch paginated transactions with search, category, type, and date filters  
 • GET /summary – Overall summary (income, expense, balance)
• GET /monthly-summary – 12-month trend for charting
• GET /category-summary – Category breakdown with totals, counts, and percentages
• GET /:id – Fetch single transaction by ID
• PATCH /:id – Update transaction fields
• DELETE /:id – Delete transaction by ID
