# Marble Business & Inventory Management System

A full-stack web application designed for marble dealerships, retailers, and wholesalers to manage inventory, track customers, record sales and invoices, monitor expenses, and visualize financial analytics.

---

## 🚀 Features

- **Dashboard**: Quick metrics on total revenue, current stock levels, and total clients with interactive revenue and sales trend graphs (Daily, Weekly, Monthly, Yearly, Lifetime).
- **Inventory Management**: Add, update, and delete marble products with pricing, stock counts, descriptions, categories, and product images.
- **Customer Management**: Maintain customer contact details, addresses, and purchase history.
- **Invoicing & Sales**: Create invoices with automatic stock deduction upon sale completion.
- **Financial Analytics**: In-depth analysis of income, expenses, and net profit with comparative charts.
- **Responsive UI & Dark Mode**: Modern user interface built with Tailwind CSS with seamless light/dark mode support.

---

## 🛠 Tech Stack

### Frontend
- **Framework**: [React](https://react.dev/) + [Vite](https://vite.dev/)
- **Routing**: [React Router](https://reactrouter.com/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Charts**: [Recharts](https://recharts.org/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **HTTP Client**: [Axios](https://axios-http.com/)

### Backend
- **Runtime**: [Node.js](https://nodejs.org/)
- **Framework**: [Express.js](https://expressjs.com/)
- **Database Driver**: [mysql2](https://github.com/sidorares/node-mysql2)
- **Utilities**: `cors`, `dotenv`, `nodemon`

### Database
- **Engine**: MySQL / MariaDB

---

## 📦 Getting Started

### 1. Prerequisites
- **Node.js** (v18 or newer recommended)
- **MySQL / MariaDB** (via XAMPP, Homebrew, Docker, or standalone service)

---

### 2. Database Setup
1. Start your MySQL server (e.g., using XAMPP or `brew services start mysql`).
2. Create a database named `marble_db`:
   ```sql
   CREATE DATABASE marble_db;
   ```
3. Import the provided SQL dump:
   ```bash
   mysql -u root -p marble_db < marble_db.sql
   ```
   *(Or import `marble_db.sql` via phpMyAdmin / MySQL Workbench).*

---

### 3. Server Setup (Backend)
1. Open a terminal and navigate to the `server` folder:
   ```bash
   cd server
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. (Optional) Configure environment variables:
   ```bash
   cp .env.example .env
   ```
   Edit `.env` to match your MySQL credentials:
   ```env
   PORT=3001
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=
   DB_NAME=marble_db
   DB_PORT=3306
   ```
4. Start the backend server:
   ```bash
   npm start
   # Or for development with live reload:
   npm run dev
   ```
   The server will start listening at `http://localhost:3001`.

---

### 4. Client Setup (Frontend)
1. In a new terminal, navigate to the `client` folder:
   ```bash
   cd client
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the Vite development server:
   ```bash
   npm run dev
   ```
4. Open [http://localhost:5173](http://localhost:5173) in your web browser.

---

## 🔐 Default Credentials

To log into the system for the first time:
- **Username**: `admin`
- **Password**: `admin`

*(Credentials can be updated directly in the `users` table).*

---

## 📁 Project Structure

```text
MarbleProject/
├── client/                 # React frontend application
│   ├── public/             # Static assets
│   ├── src/
│   │   ├── components/     # Reusable UI components (Sidebar, etc.)
│   │   ├── AddClient.jsx   # Client registration page
│   │   ├── AddProduct.jsx  # Product addition page
│   │   ├── Analytics.jsx   # Financial analytics & profit/loss charts
│   │   ├── Customers.jsx   # Customer management table
│   │   ├── Dashboard.jsx   # Main overview dashboard
│   │   ├── Inventory.jsx   # Product inventory table & controls
│   │   ├── Invoices.jsx    # Invoice generator & sale checkout
│   │   ├── Login.jsx       # Authentication page
│   │   └── main.jsx        # App entrypoint
│   └── package.json
├── server/                 # Express backend API
│   ├── index.js            # API endpoints & database connection
│   ├── .env.example        # Environment variable template
│   └── package.json
├── marble_db.sql           # Database schema and seed data
├── .gitignore              # Ignored files (node_modules, .env, OS files, etc.)
└── README.md               # Project documentation
```

---

## 📄 License
This project is open source and available under the [MIT License](LICENSE).
