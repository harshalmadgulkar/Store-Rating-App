# Store Rating Platform

Full-stack web application for users to rate stores (1–5 stars) with role-based access: Admin, Normal User, Store Owner.

Built for FullStack Intern Coding Challenge.

## Live Demo

* **Frontend** (React): https://ratingstore-1.onrender.com
* **Backend API** (Swagger / Postman testing): https://ratingstore.onrender.com/api

**Test credentials** (for quick review):

* Admin: email: das@gmail.com | password: Roxiller@123
* Normal User: email: shri@gmail.com | password: Roxiller@123
* Store Owner: email: raj@gmail.com | password: Roxiller@123

> Note: Render free tier may take 10–30 seconds to wake up on first request.

## Screenshots

Here are key screens from the live application:

### Authentication

<p align="center">
<img src="screenshots/login.png" alt="Login Page" width="45%" />
<img src="screenshots/signup.png" alt="Signup Page" width="45%" />
</p>

### Admin Dashboard & Management

<p align="center">
<img src="screenshots/admin-dashboard.png" alt="Admin Dashboard - Stats" width="45%" />
<img src="screenshots/admin-users-list.png" alt="Admin - Users List with Filters" width="45%" />
</p>

<p align="center">
<img src="screenshots/admin-add-user.png" alt="Admin - Add New User Modal" width="45%" />
<img src="screenshots/admin-stores-list.png" alt="Admin - Stores List" width="45%" />
</p>

<p align="center">
<img src="screenshots/admin-add-store.png" alt="Admin - Add New Store Modal" width="45%" />
</p>

### Normal User Experience

<p align="center">
<img src="screenshots/stores-list-user.png" alt="Stores List - Search, Overall Rating & My Rating" width="45%" />
<img src="screenshots/store-detail-rating.png" alt="Store Detail - Submit/Modify Rating" width="45%" />
</p>

<p align="center">
<img src="screenshots/profile-password.png" alt="Profile / Change Password" width="45%" />
</p>

### Store Owner Dashboard

<p align="center">
<img src="screenshots/owner-dashboard.png" alt="Store Owner - Average Rating & Raters List" width="70%" />
</p>

> Click on images to enlarge. All screenshots taken from the live deployed version.

## Screenshots

<div align="center">
<table>
<tr>
<td><img src="screenshots/login.png" width="400" alt="Login"/></td>
<td><img src="screenshots/signup.png" width="400" alt="Signup"/></td>
</tr>
<tr>
<td><img src="screenshots/admin-dashboard.png" width="400" alt="Admin Dashboard"/></td>
<td><img src="screenshots/owner-dashboard.png" width="400" alt="Owner Dashboard"/></td>
</tr>
<!-- Add more rows as needed -->
</table>
</div>

## Tech Stack

**Backend**

* Node.js + Express.js
* MongoDB + Mongoose
* JWT Authentication + bcrypt password hashing
* Role-based authorization

**Frontend**

* React 18 + TypeScript
* Vite (or CRA)
* Tailwind CSS (or your styling solution)
* Axios for API calls
* React Router v6
* State: Redux Toolkit / Context (depending on what you used)

**Other**

* Environment variables (.env)
* Input validation (express-validator / zod / manual)
* Toast notifications (sonner)

## Features Implemented

* User registration & login (JWT)
* Role-based dashboards & access control
  * Admin: create users/stores, view stats, list & filter users/stores
  * Normal User: search & rate stores, see own & average ratings
  * Store Owner: see average rating & list of raters for their store
* Password update
* Search & sorting on listings
* Form validations (name 20–60 chars, password rules, email, address max 400)
* Responsive UI (basic)

## Project Structure

store-rating-app/
├── backend/           → Express API
├── frontend/          → React app
└── README.md

## How to Run Locally

### Prerequisites

* Node.js ≥ 18
* MongoDB (local or Atlas)

### Backend

```bash
cd backend
cp .env.example .env          # fill MONGODB_URI & JWT_SECRET
npm install
npm start           # runs on http://localhost:3000
```

### Frontend

```bash
cd frontend
cp .env.example .env          # fill VITE_API_URL=http://localhost:3000
npm install
npm run dev                   # runs on http://localhost:5173
```


