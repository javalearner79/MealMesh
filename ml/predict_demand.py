"""Small, explainable demand predictor used by the MealMesh Express API."""
import json
import sys
from datetime import datetime

from sklearn.ensemble import RandomForestRegressor
from sklearn.linear_model import LinearRegression
from sklearn.metrics import mean_absolute_error

MINIMUM_RECORDS = 6
RANDOM_FOREST_RECORDS = 12
MEAL_TYPES = {"Breakfast", "Lunch", "Dinner"}


def parse_date(value):
    return datetime.fromisoformat(value.replace("Z", "+00:00"))


def average(values, fallback=0):
    return sum(values) / len(values) if values else fallback


def demand_features(records, target_date, target_meal_type):
    same_meal = [record["expectedStudents"] for record in records if record["mealType"] == target_meal_type]
    all_demand = [record["expectedStudents"] for record in records]
    fallback = average(all_demand)
    previous_demand = same_meal[-1] if same_meal else fallback
    recent_average = average(same_meal[-3:], fallback)
    return [
        target_date.weekday(),
        int(target_meal_type == "Breakfast"),
        int(target_meal_type == "Lunch"),
        int(target_meal_type == "Dinner"),
        previous_demand,
        recent_average,
    ]


def build_training_rows(records):
    features, targets = [], []
    for index, record in enumerate(records):
        earlier_records = records[:index]
        if not earlier_records:
            continue
        features.append(demand_features(earlier_records, record["date"], record["mealType"]))
        targets.append(record["expectedStudents"])
    return features, targets


def choose_model(record_count):
    if record_count >= RANDOM_FOREST_RECORDS:
        return RandomForestRegressor(n_estimators=100, random_state=42), "Random Forest Regressor"
    return LinearRegression(), "Linear Regression"


def predict(payload):
    target = payload.get("target", {})
    target_date_value = target.get("date")
    target_meal_type = target.get("mealType")
    if not target_date_value or target_meal_type not in MEAL_TYPES:
        return {"available": False, "message": "A valid date and meal type are required."}

    records = []
    for row in payload.get("history", []):
        try:
            meal_type = row["mealType"]
            demand = float(row["expectedStudents"])
            date = parse_date(row["date"])
            if meal_type in MEAL_TYPES and demand > 0:
                records.append({"date": date, "mealType": meal_type, "expectedStudents": demand})
        except (KeyError, TypeError, ValueError):
            continue
    records.sort(key=lambda record: record["date"])

    if len(records) < MINIMUM_RECORDS:
        return {
            "available": False,
            "message": "Not enough historical data for prediction.",
            "historicalRecords": len(records),
            "minimumRecords": MINIMUM_RECORDS,
        }

    training_features, training_targets = build_training_rows(records)
    if len(training_targets) < MINIMUM_RECORDS - 1:
        return {"available": False, "message": "Not enough usable historical data for prediction."}

    test_size = max(2, round(len(training_targets) * 0.2)) if len(training_targets) >= 8 else 0
    model, model_name = choose_model(len(records))
    mae = None
    if test_size and len(training_targets) > test_size:
        evaluation_model, _ = choose_model(len(records))
        evaluation_model.fit(training_features[:-test_size], training_targets[:-test_size])
        mae = float(mean_absolute_error(training_targets[-test_size:], evaluation_model.predict(training_features[-test_size:])))

    model.fit(training_features, training_targets)
    target_date = parse_date(target_date_value)
    predicted = max(0, round(float(model.predict([demand_features(records, target_date, target_meal_type)])[0])))

    return {
        "available": True,
        "predictedStudents": predicted,
        "date": target_date.date().isoformat(),
        "mealType": target_meal_type,
        "model": model_name,
        "mae": round(mae, 2) if mae is not None else None,
        "historicalRecords": len(records),
        "explanation": "Based on day of week, previous meal demand, and recent average demand.",
    }


def main():
    try:
        result = predict(json.load(sys.stdin))
        print(json.dumps(result))
    except Exception as error:
        print(json.dumps({"available": False, "message": f"Prediction failed: {str(error)}"}))
        sys.exit(1)


if __name__ == "__main__":
    main()
