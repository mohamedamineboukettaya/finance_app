# SmartBudget API Documentation

Base URL: `http://localhost:5000/api`

## Authentication Endpoints

### Register User
- **POST** `/auth/register`
- **Body:**
```json
  {
    "email": "user@example.com",
    "password": "securePassword123",
    "name": "John Doe"
  }
```
- **Response:** `{ token, refreshToken, user }`

### Login
- **POST** `/auth/login`
- **Body:**
```json
  {
    "email": "user@example.com",
    "password": "securePassword123"
  }
```
- **Response:** `{ token, refreshToken, user }`

### Get Current User
- **GET** `/auth/me`
- **Headers:** `Authorization: Bearer {token}`
- **Response:** `{ user }`

### Refresh Token
- **POST** `/auth/refresh`
- **Body:** `{ refreshToken }`
- **Response:** `{ token, refreshToken }`

---

## Transaction Endpoints

### List Transactions
- **GET** `/transactions`
- **Headers:** `Authorization: Bearer {token}`
- **Query Params:**
  - `startDate` (optional): ISO date
  - `endDate` (optional): ISO date
  - `categoryId` (optional): UUID
  - `type` (optional): 'income' | 'expense'
- **Response:** `{ transactions: [] }`

### Create Transaction
- **POST** `/transactions`
- **Headers:** `Authorization: Bearer {token}`
- **Body:**
```json
  {
    "amount": 50.00,
    "type": "expense",
    "categoryId": "uuid",
    "description": "Groceries",
    "date": "2024-11-10",
    "isRecurring": false
  }
```
- **Response:** `{ transaction }`

### Update Transaction
- **PUT** `/transactions/:id`
- **Headers:** `Authorization: Bearer {token}`
- **Body:** Same as create
- **Response:** `{ transaction }`

### Delete Transaction
- **DELETE** `/transactions/:id`
- **Headers:** `Authorization: Bearer {token}`
- **Response:** `{ message: "Deleted successfully" }`

---

## Category Endpoints

### List Categories
- **GET** `/categories`
- **Headers:** `Authorization: Bearer {token}`
- **Response:** `{ categories: [] }`

### Create Category
- **POST** `/categories`
- **Headers:** `Authorization: Bearer {token}`
- **Body:**
```json
  {
    "name": "Groceries",
    "type": "expense",
    "icon": "shopping-cart",
    "color": "#FF5733"
  }
```
- **Response:** `{ category }`

---

## Budget Endpoints

### List Budgets
- **GET** `/budgets`
- **Headers:** `Authorization: Bearer {token}`
- **Response:** `{ budgets: [] }`

### Create Budget
- **POST** `/budgets`
- **Headers:** `Authorization: Bearer {token}`
- **Body:**
```json
  {
    "categoryId": "uuid",
    "limitAmount": 500.00,
    "period": "monthly"
  }
```
- **Response:** `{ budget }`

### Update Budget
- **PUT** `/budgets/:id`
- **Headers:** `Authorization: Bearer {token}`
- **Body:** Same as create
- **Response:** `{ budget }`

### Delete Budget
- **DELETE** `/budgets/:id`
- **Headers:** `Authorization: Bearer {token}`
- **Response:** `{ message: "Deleted successfully" }`

---

## Dashboard Endpoints

### Get Financial Summary
- **GET** `/dashboard/summary`
- **Headers:** `Authorization: Bearer {token}`
- **Query Params:**
  - `month` (optional): 1-12
  - `year` (optional): YYYY
- **Response:**
```json
  {
    "totalIncome": 5000.00,
    "totalExpenses": 3200.00,
    "balance": 1800.00,
    "categoryBreakdown": [
      { "category": "Food", "amount": 500.00 },
      { "category": "Transport", "amount": 200.00 }
    ]
  }
```

### Get Chart Statistics
- **GET** `/dashboard/stats`
- **Headers:** `Authorization: Bearer {token}`
- **Response:**
```json
  {
    "monthlyTrends": [],
    "categoryDistribution": [],
    "incomeVsExpense": []
  }
```