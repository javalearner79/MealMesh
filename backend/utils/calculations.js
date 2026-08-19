const unitDefinitions = {
  g: { baseUnit: 'g', multiplier: 1 },
  kg: { baseUnit: 'g', multiplier: 1000 },
  ml: { baseUnit: 'ml', multiplier: 1 },
  l: { baseUnit: 'ml', multiplier: 1000 },
  pieces: { baseUnit: 'pieces', multiplier: 1 }
};

function normaliseUnit(unit) {
  return String(unit || '').trim().toLowerCase();
}

function toBaseQuantity(quantity, unit) {
  const definition = unitDefinitions[normaliseUnit(unit)];
  return definition ? Number(quantity) * definition.multiplier : Number(quantity);
}

function baseUnitFor(unit) {
  return (unitDefinitions[normaliseUnit(unit)] || {}).baseUnit || normaliseUnit(unit);
}

function displayQuantity(quantity, baseUnit) {
  if (baseUnit === 'g' && quantity >= 1000) return { quantity: Number((quantity / 1000).toFixed(2)), unit: 'kg' };
  if (baseUnit === 'ml' && quantity >= 1000) return { quantity: Number((quantity / 1000).toFixed(2)), unit: 'l' };
  return { quantity: Number(Number(quantity).toFixed(2)), unit: baseUnit };
}

function calculateProcurement(meals, inventory) {
  const requirements = new Map();

  meals.forEach((meal) => meal.ingredients.forEach((ingredient) => {
    const key = ingredient.name.trim().toLowerCase();
    const baseUnit = baseUnitFor(ingredient.unit);
    const quantity = toBaseQuantity(Number(meal.expectedStudents) * Number(ingredient.quantityPerStudent), ingredient.unit);
    const saved = requirements.get(key) || { ingredient: ingredient.name, quantity: 0, baseUnit };
    saved.quantity += quantity;
    requirements.set(key, saved);
  }));

  return [...requirements.values()].map((need) => {
    const stock = inventory.find((item) => item.ingredientName.trim().toLowerCase() === need.ingredient.trim().toLowerCase());
    const stockUsesSameUnit = stock && baseUnitFor(stock.unit) === need.baseUnit;
    const available = stockUsesSameUnit ? toBaseQuantity(stock.currentQuantity, stock.unit) : 0;
    const required = displayQuantity(need.quantity, need.baseUnit);
    const availableDisplay = displayQuantity(available, need.baseUnit);
    const purchase = displayQuantity(Math.max(need.quantity - available, 0), need.baseUnit);

    return {
      ingredient: need.ingredient,
      requiredQuantity: required.quantity,
      availableQuantity: availableDisplay.quantity,
      purchaseRequired: purchase.quantity,
      unit: required.unit,
      status: available >= need.quantity ? 'SUFFICIENT STOCK' : 'PURCHASE REQUIRED'
    };
  });
}

function startOfDay(value = new Date()) {
  const date = new Date(value);
  date.setHours(0, 0, 0, 0);
  return date;
}

function endOfDay(value = new Date()) {
  const date = startOfDay(value);
  date.setDate(date.getDate() + 1);
  return date;
}

module.exports = { calculateProcurement, startOfDay, endOfDay };
