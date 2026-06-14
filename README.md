# TaskFlow - Real-Time Task Management Dashboard

TaskFlow is a modern, responsive, full-stack task management application designed to organize, prioritize, and track tasks in real time. It features a Node.js/Express backend server integrated with MongoDB, and a React frontend built with Vite, Tailwind CSS, and Chart.js.

## Key Features

- **User Authentication**: Secure user registration and login utilizing JWT (JSON Web Tokens) and bcrypt password hashing.
- **Role-Based Routing**: Custom permissions allowing normal Users to view and edit their own tasks, while Admins have full access to view, edit, and delete all system tasks.
- **CRUD Operations**: Complete task management with filters for priority (Low, Medium, High) and status (Pending, In Progress, Completed), title search, and multi-criteria sorting.
- **Real-Time Synchronization**: Instant state synchronization across all connected clients using WebSockets (Socket.io).
- **Interactive Visualizations**: Beautiful dashboard charts detailing task completion milestones and priority distributions using Chart.js.
- **Premium UI**: Glassmorphic dark theme built with Tailwind CSS, custom scrollbars, transitions, and responsive support for mobile screens.

---

## Repository Structure

```text
├── client/          # React + Vite frontend application
├── server/          # Node.js + Express backend API
├── package.json     # Root-level configuration for running concurrently
└── DEPLOYMENT.md    # Step-by-step deployment guide for Render & Vercel
```

---

## Local Setup Instructions

### Prerequisites

- **Node.js** (v18 or higher recommended)
- **MongoDB** running locally on port `27017` (or a MongoDB Atlas connection string)

### 1. Clone the Repository

```bash
git clone https://github.com/Naveen200641/task-management.git
cd task-management
```

### 2. Install Dependencies

You can install all dependencies for both the frontend and backend with a single command from the root directory:

```bash
npm run install-all
```

*(Alternatively, run `npm install` inside the root, `client`, and `server` folders individually).*

### 3. Environment Variables Setup

Create a `.env` file inside the `server/` directory:

```env
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/taskflow
JWT_SECRET=your_jwt_secret_key
NODE_ENV=development
```

### 4. Run the Application

Start both the backend server and frontend client concurrently with one command from the root directory:

```bash
npm run dev
```

- Backend server runs on [http://localhost:5000](http://localhost:5000)
- Frontend client runs on [http://localhost:3000](http://localhost:3000)

---

## Deployment Guide

For detailed instructions on how to deploy the Express backend to **Render** and the React frontend to **Vercel**, please check out the [DEPLOYMENT.md](DEPLOYMENT.md) file.
