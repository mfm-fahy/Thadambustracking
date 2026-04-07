# 🚀 Thadam Deployment Guide

Follow these steps to host your Thadam application for free using **Render** (Backend) and **Vercel** (Frontend).

---

## 1. Prepare Your Code
Before starting, ensure your local changes are committed and pushed to your **GitHub** repository.

---

## 2. Host the Backend (Render)
Render will host your Express API and MongoDB connection.

1.  **Sign up** at [render.com](https://render.com) using your GitHub account.
2.  Click **New +** > **Web Service**.
3.  Select your `thadam` repository.
4.  **Configure Service**:
    - **Name**: `thadam-backend`
    - **Environment**: `Node`
    - **Build Command**: `cd server && npm install`
    - **Start Command**: `cd server && npm start`
5.  **Add Environment Variables**:
    - Click the **Environment** tab on Render.
    - Add the following keys:
        - `PORT`: `5000`
        - `NODE_ENV`: `production`
        - `MONGODB_URI`: *[Your MongoDB Atlas Connection String]*
        - `JWT_SECRET`: *[A long random string]*
        - `DB_TYPE`: `atlas` (to use your real MongoDB)
6.  **Deploy**: Click **Create Web Service**.
7.  **Copy your URL**: Once live, copy your Render URL (e.g., `https://thadam-backend.onrender.com`).

---

## 3. Host the Frontend (Vercel)
Vercel will host your Next.js frontend and point it to Render.

1.  **Sign up** at [vercel.com](https://vercel.com) using your GitHub account.
2.  Click **Add New...** > **Project**.
3.  Import your `thadam` repository.
4.  **Configure Project**:
    - **Framework Preset**: `Next.js`
    - **Root Directory**: `client` (Select the `client` folder)
5.  **Add Environment Variables**:
    - Expand the **Environment Variables** section.
    - Add the Following:
        - `NEXT_PUBLIC_API_URL`: *[Your Render Backend URL]*/v1
          *(Example: `https://thadam-backend.onrender.com/v1`)*
6.  **Deploy**: Click **Deploy**.

---

## 4. Verification
1.  Open your Vercel URL.
2.  Log in as a Driver and start a trip.
3.  In a separate tab/device, log in as a Passenger and verify that you can see the live broadcast.

---

> [!IMPORTANT]
> **Database Note**: If you haven't set up a MongoDB Atlas cluster yet, go to [mongodb.com](https://www.mongodb.com/cloud/atlas) to create a free cluster. This is required for your data to persist between deployments!

> [!TIP]
> **Cold Starts**: Render's free tier spins down after inactivity. On your first load, it may take 30-60 seconds for the backend to "wake up". This is normal for free hosting!
