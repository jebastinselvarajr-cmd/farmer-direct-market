# 🌾 Farmer Direct Market

A full-stack MERN web app where **farmers sell their produce directly to customers**, with no middlemen.

🔗 **Live demo:** https://farmer-direct-market-client.vercel.app

> Note: the backend runs on a free Render instance, so the first request may take ~50 seconds to wake up.

## ✨ Features

**Customer**
- Register / login (JWT authentication)
- Browse products with search, category and in-stock filters
- Cart with delivery address details
- Place orders (server-side price and stock validation)
- Track orders with expected delivery date

**Farmer**
- Add, edit and delete own products
- View orders that include own products
- Confirm orders with an expected delivery date
- Mark orders as delivered

## 🛠 Tech Stack

| Layer | Tech |
|---|---|
| Frontend | React (Vite), React Router, Axios, Context API |
| Backend | Node.js, Express |
| Database | MongoDB Atlas, Mongoose |
| Auth | JWT, bcrypt, role-based access (customer / farmer) |
| Deployment | Vercel (client), Render (server) |

## 📸 Screenshots

| Products | Cart | Farmer Orders |
|---|---|---|
| 

![Products](screenshots/products.png)

 | 

![Cart](screenshots/cart.png)

 | 

![Farmer Orders](screenshots/farmer-orders.png)

 |

## 🚀 Run locally

```bash
git clone https://github.com/jebastinselvarajr-cmd/farmer-direct-market.git
cd farmer-direct-market

# Server
cd server
npm install
# create .env with: MONGO_URI, JWT_SECRET, PORT
npm run dev

# Client (new terminal)
cd client
npm install
# optional .env: VITE_API_URL=http://localhost:5000/api
npm run dev
🔐 Environment variables
server/.env
MONGO_URI: MongoDB connection string
JWT_SECRET: secret key for signing tokens
PORT: server port (default 5000)
client/.env
VITE_API_URL: backend API base URL
👤 Author
Jebastin Selvaraj R: