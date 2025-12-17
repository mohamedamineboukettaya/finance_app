# SmartBudget Database Schema

## Tables Overview

### 1. USERS
Stores user account information
- id: UUID (Primary Key)
- email: String (Unique, Not Null)
- password_hash: String (Not Null)
- name: String (Optional)
- created_at: Timestamp
- updated_at: Timestamp

### 2. TRANSACTIONS
Stores all income and expense records
- id: UUID (Primary Key)
- user_id: UUID (Foreign Key → users.id)
- amount: Decimal(10,2) (Not Null)
- type: Enum['income', 'expense']
- category_id: UUID (Foreign Key → categories.id)
- description: Text (Optional)
- date: Date (Not Null)
- is_recurring: Boolean (Default: false)
- created_at: Timestamp
- updated_at: Timestamp

### 3. CATEGORIES
Stores expense/income categories
- id: UUID (Primary Key)
- name: String (Not Null)
- type: Enum['income', 'expense']
- icon: String (Optional)
- color: String (Optional)
- user_id: UUID (Foreign Key → users.id, Nullable for defaults)

### 4. BUDGETS
Stores budget limits per category
- id: UUID (Primary Key)
- user_id: UUID (Foreign Key → users.id)
- category_id: UUID (Foreign Key → categories.id)
- limit_amount: Decimal(10,2) (Not Null)
- period: Enum['monthly', 'weekly']
- created_at: Timestamp
- updated_at: Timestamp

## Relationships
- User HAS MANY Transactions (1:N)
- User HAS MANY Categories (1:N)
- User HAS MANY Budgets (1:N)
- Category HAS MANY Transactions (1:N)
- Category HAS MANY Budgets (1:N)
- Transaction BELONGS TO User
- Transaction BELONGS TO Category
- Budget BELONGS TO User
- Budget BELONGS TO Category

## Indexes
- transactions(user_id, date) - For fast user transaction queries
- budgets(user_id, category_id, period) - Unique constraint