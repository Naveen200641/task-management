# TaskFlow Deployment Guide

This guide details the step-by-step process of deploying the **TaskFlow** application: the Node.js/Express backend on **Render** and the React/Vite frontend on **Vercel**.

---

## 1. Backend Deployment (Render)

Render is excellent for hosting the Express backend server with Socket.io support.

### Prerequisites
- Create a [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) account and set up a free cluster.
- Whitelist all IP addresses (`0.0.0.0/0`) in your Atlas Network Access tab (so Render can connect).
- Obtain your MongoDB connection string (e.g. `mongodb+srv://<username>:<password>@cluster.mongodb.net/taskflow`).

### Steps
1. Log in to [Render](https://render.com/) and click **New** -> **Web Service**.
2. Connect your GitHub repository containing the TaskFlow codebase.
3. Configure the following settings:
   - **Name**: `taskflow-api` (or custom name)
   - **Runtime**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `node server/server.js` *(Note: Point to the server file inside the `server/` directory)*
4. Under the **Environment** section, add the following variables:
   - `NODE_ENV`: `production`
   - `JWT_SECRET`: `your_secure_random_jwt_secret`
   - `MONGODB_URI`: `your_mongodb_atlas_connection_string`
   - `PORT`: `5000` (Render will override this, but standard practice)
5. Click **Create Web Service**. Render will build and deploy the backend. Copy your service's URL (e.g., `https://taskflow-api.onrender.com`).

---

## 2. Frontend Deployment (Vercel)

Vercel is optimized for building and serving Vite/React static assets.

### Steps
1. Log in to [Vercel](https://vercel.com/) and click **Add New** -> **Project**.
2. Select your GitHub repository.
3. Configure the following project parameters:
   - **Framework Preset**: `Vite`
   - **Root Directory**: `client` *(Important: Edit this to point to the client subdirectory)*
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
4. Expand the **Environment Variables** section and add:
   - `VITE_API_URL`: `https://taskflow-api.onrender.com/api` *(Replace with your actual Render API URL)*
   - `VITE_SOCKET_URL`: `https://taskflow-api.onrender.com` *(Replace with your actual Render socket URL)*
5. Click **Deploy**. Vercel will build the frontend assets, compile Tailwind CSS, and publish the static app!

---

## 3. Post-Deployment Verification
- Open the Vercel app URL.
- Test registering a new user. The system will create the user on MongoDB Atlas and return the JWT session token.
- Navigate to the Dashboard and add tasks.
- If you open the dashboard on multiple devices (phone, desktop), changes will sync in real time using the Socket.io connection pointing to Render.
