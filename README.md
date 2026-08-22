# MealMesh — Smart Mess Operations Platform

MealMesh is a full-stack hostel mess management platform designed to help mess administrators plan meals, monitor inventory, manage procurement, track food waste, and estimate upcoming meal demand.

The project focuses on connecting daily meal planning with inventory and procurement decisions so that kitchen resources can be managed more efficiently.

## Live Demo

https://mealmesh.onrender.com

## GitHub Repository

https://github.com/javalearner79/MealMesh

---

## Key Features

### 📊 Dashboard
- Overview of expected students and planned meals
- Current inventory summary
- Low-stock alerts
- Procurement requirements
- Recent food-waste records
- Demand prediction for upcoming meals

### 🍽️ Meal Planning
- Create and manage meal plans
- Define meal type and expected servings
- Add ingredients and required quantities
- View planned meals by date

### 📦 Inventory Management
- Add and manage inventory items
- Track available quantities
- Define minimum stock levels
- Store supplier information
- Automatically identify low-stock items

### 🛒 Procurement
- Calculate ingredient requirements from planned meals
- Compare planned requirements with available inventory
- Calculate purchase requirements
- Normalize units such as grams and kilograms
- Display stock sufficiency for planned meals

### 🗑️ Waste Tracking
- Record food-waste quantities
- Track waste by date and meal
- View recent waste records

### 📈 Demand Prediction
- Uses historical meal-demand data
- Predicts expected student demand for a selected meal
- Python-based prediction service integrated with the Node.js backend
- Uses Linear Regression for the current prediction workflow

### 🔐 Authentication
- User registration and login
- JWT-based authentication
- Protected backend routes
- Authenticated dashboard access

---

## Tech Stack

### Frontend
- HTML
- CSS
- JavaScript

### Backend
- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT Authentication

### Machine Learning
- Python
- Pandas
- Scikit-learn
- Linear Regression

### Deployment
- Docker
- Render

---

## Project Structure

```text
MealMesh/
│
├── backend/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── services/
│   ├── utils/
│   ├── seed.js
│   └── server.js
│
├── frontend/
│   ├── index.html
│   └── script.js
│
├── ml/
│   ├── predict_demand.py
│   └── requirements.txt
│
├── sources/
│
├── Dockerfile
├── .dockerignore
├── package.json
├── package-lock.json
├── .env.example
└── README.md
