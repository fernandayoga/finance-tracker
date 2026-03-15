# 💰 Finance Tracker

A full-stack personal finance web application built with React, Express, and MongoDB. Track your income & expenses, visualize spending analytics, and get AI-powered financial insights — all in one place.

---

## ✨ Features

- 🔐 **JWT Authentication** — Secure register & login with bcrypt password hashing and protected routes
- 💳 **Transaction Management** — Add, edit, delete income & expense transactions with category, date, amount, and note
- 📊 **Financial Dashboard** — Real-time overview of total balance, monthly income, and monthly expenses
- 📈 **Spending Analytics** — Interactive bar chart (income vs expense, 12 months) and pie chart (expense by category)
- 💡 **Weekly Insights** — Automatic insights: spending trend, saving rate, top category, most expensive day
- 🤖 **AI Financial Chatbot** — Powered by Groq (LLaMA 3.1) with real-time financial data as context
- 🏷️ **Category Management** — 13 built-in default categories + custom user categories with Font Awesome icons
- 📥 **Export CSV** — Export all transactions to CSV with one click
- 📱 **Responsive Design** — Sidebar on desktop, bottom navigation on mobile

---

## 🛠 Tech Stack

### Frontend
| Technology | Description |
|------------|-------------|
| React 18 | Component-based UI with hooks & Context API |
| Vite 5 | Fast build tool for development and production |
| Tailwind CSS 4 | Utility-first CSS for dark theme UI |
| Recharts | Interactive bar chart and pie chart |
| React Router v6 | Client-side routing with protected routes |
| Axios | HTTP client with JWT interceptors |
| Font Awesome 6 | Icon library |

### Backend
| Technology | Description |
|------------|-------------|
| Node.js | JavaScript runtime |
| Express.js | REST API framework |
| MongoDB Atlas | Cloud NoSQL database |
| Mongoose | ODM for MongoDB |
| JWT | Stateless authentication |
| bcryptjs | Password hashing |

### AI & Deployment
| Technology | Description |
|------------|-------------|
| Groq API (LLaMA 3.1) | Ultra-fast LLM for AI chatbot |
| Vercel | Full-stack deployment (frontend + serverless) |
| GitHub | Version control & CI/CD |

---

## 🚀 Getting Started

### Prerequisites
- Node.js >= 18
- MongoDB Atlas account
- Groq API key ([console.groq.com](https://console.groq.com))

### 1. Clone the repository
```bash
git clone https://github.com/fernandayoga/finance-tracker.git
cd finance-tracker
```

### 2. Setup Backend
```bash
cd server
npm install
```

Create `server/.env`:
```env
PORT=5000
MONGO_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/finance-tracker
JWT_SECRET=your_jwt_secret_here
JWT_EXPIRES_IN=7d
GROQ_API_KEY=gsk_your_groq_api_key
CLIENT_URL=http://localhost:5173
```

Seed default categories:
```bash
node config/seedCategories.js
```

Start backend:
```bash
npm run dev
```

### 3. Setup Frontend
```bash
cd client
npm install
```

Create `client/.env`:
```env
VITE_API_URL=/api
```

Start frontend:
```bash
npm run dev
```

### 4. Open the app
```
http://localhost:5173
```

## 🤖 AI Chatbot

The chatbot uses **Context Injection** (a simplified RAG approach):

1. User sends a question
2. Backend fetches user's financial data from MongoDB
3. Data is injected into the system prompt
4. Groq (LLaMA 3.1) answers based on the injected context
5. Response is returned to the user

Example questions you can ask:
- *"Berapa pengeluaran aku bulan ini?"*
- *"Kategori apa yang paling boros?"*
- *"Bandingkan pemasukan bulan ini vs bulan lalu"*
- *"Kondisi keuangan aku gimana?"*

---

## 📡 API Endpoints

### Auth
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login user |
| GET | `/api/auth/me` | Get current user |

### Transactions
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/transactions` | Get all transactions (with filters) |
| POST | `/api/transactions` | Create transaction |
| PUT | `/api/transactions/:id` | Update transaction |
| DELETE | `/api/transactions/:id` | Delete transaction |
| GET | `/api/transactions/summary` | Get balance & monthly summary |
| GET | `/api/transactions/analytics/monthly` | Get 12-month chart data |
| GET | `/api/transactions/analytics/category` | Get category breakdown |

### Categories
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/categories` | Get all categories |
| POST | `/api/categories` | Create custom category |
| DELETE | `/api/categories/:id` | Delete custom category |

### Chat
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/chat` | Send message to AI chatbot |

---

## 📄 License
---
<p align="center">Developed by <a href="https://github.com/fernandayoga">fernandayoga</a></p>
