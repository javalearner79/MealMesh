# MealMesh

MealMesh is a food demand, inventory, procurement, waste, and analytics system for a hostel mess. It gives mess staff one practical place to plan meals, calculate raw-material needs, compare them with stock, track waste, and act on simple recommendations.

## Problem statement

Without a clear view of planned meals, ingredients, and stock, hostel messes can over-prepare food, face shortages, and make unnecessary purchases. MealMesh makes those day-to-day decisions visible and explainable.

## How it works

Meal Planning → Ingredient Requirement Calculation → Inventory Check → Procurement Requirement → Waste Tracking

For each meal, requirement is calculated deterministically as:

`expected students × quantity per student`

Procurement is then:

`max(required quantity - available quantity, 0)`

## Key features

- Dashboard with database-driven daily summary
- Meal planning with ingredients and per-student quantities
- Inventory create, edit, view, and delete operations
- Low-stock status badges
- Requirement and procurement calculations
- Waste recording with automatic percentage calculation
- REST APIs with MongoDB persistence and basic validation
- Responsive vanilla HTML, CSS, and JavaScript interface
- Basic ML demand prediction with explainable features and MAE reporting
- CSS-based seven-day demand and waste trends
- Rule-based capacity, procurement, and waste recommendations
- JWT authentication with secure login, registration, protected APIs, and logout

MealMesh includes a basic, explainable demand prediction feature using Python and scikit-learn. It is intentionally limited to a simple regression model; authentication, advanced optimization, and GenAI are not included.

## Demand prediction (Stage 3)

`GET /api/predictions/demand` predicts the servings for tomorrow's Lunch by default. Optional query parameters are `date=YYYY-MM-DD` and `mealType=Breakfast|Lunch|Dinner`.

The Express route reads historical `MealPlan` records from MongoDB and sends only date, meal type, and expected-student values to `ml/predict_demand.py`. The Python script creates features for day of week, meal type, previous demand for that meal type, and its recent average demand. It uses a Random Forest Regressor with 12 or more records, otherwise Linear Regression. It returns a safe unavailable response until at least six historical records are available.

Install the one Python dependency before running the app:

```bash
python -m pip install -r ml/requirements.txt
```

If `python` is not on your PATH, set `PYTHON_PATH` in `.env` to the full Python executable path.

## Tech stack

- HTML, CSS, Vanilla JavaScript
- Node.js and Express.js
- MongoDB and Mongoose

## Architecture

The browser UI uses `fetch()` to call Express REST APIs. Express controllers validate inputs and use Mongoose models to store and retrieve data from MongoDB. The procurement route combines stored meal ingredients and inventory into a transparent calculation, keeping it ready for a future prediction service to supply expected-student values.

## Setup

1. Install Node.js and make sure MongoDB is running locally (or use MongoDB Atlas).
2. Install packages:

   ```bash
   npm install
   ```

3. Copy `.env.example` to `.env` and set `MONGO_URI`.
4. Optionally create demonstration data:

   ```bash
   npm run seed
   ```

5. Start the application:

   ```bash
   npm start
   ```

6. Open [http://localhost:5000](http://localhost:5000).

## API routes

- `POST`, `GET /api/meals`; `GET`, `DELETE /api/meals/:id`
- `POST`, `GET /api/inventory`; `GET`, `PUT`, `DELETE /api/inventory/:id`
- `POST`, `GET /api/waste`; `GET`, `DELETE /api/waste/:id`
- `GET /api/procurement` (uses meal plans for today by default; accepts `?date=YYYY-MM-DD`)
- `GET /api/dashboard` (today’s metrics, plans, low-stock items, procurement count, and recent waste)
- `GET /api/predictions/demand` (basic cached ML demand prediction)
- `GET /api/analytics` (seven-day trends, capacity, procurement, and recommendations)

## Environment variables

```env
MONGO_URI=your_mongodb_connection_string
PORT=5000
PYTHON_PATH=python
JWT_SECRET=replace_with_a_long_random_secret
JWT_EXPIRES_IN=1d
```

## Authentication and roles

MealMesh uses bcrypt password hashes and JWTs. The first registered account is created as an `admin`; every later registration becomes `staff`. Both roles can use the normal MealMesh workflow. Admin-only actions can be added later with the included role middleware.

Login flow: register or log in → receive JWT → browser stores it locally → protected APIs receive it in the `Authorization: Bearer` header → logout removes it.

Authentication endpoints:

- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/me`
- `POST /api/auth/logout`

To create the first user, start the app with `JWT_SECRET` configured, open `http://localhost:5000`, and choose **Create an account**. Never commit `.env`.

## Screenshots

Add dashboard screenshots here for a portfolio or interview submission.

## Future improvements

- Accept a selected date and meal type in the dashboard prediction card
- Add meal-level consumption records to improve training data
- Add authenticated staff access and reports when required

## Sample data

`npm run seed` resets the development collections and creates an example Rajma Rice dinner, Rice/Rajma/Cooking Oil inventory, and a Vegetable Pulao waste record. Do not use it on real data.
