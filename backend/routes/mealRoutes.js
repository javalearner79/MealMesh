const router = require('express').Router();
const controller = require('../controllers/mealController');
router.route('/').post(controller.createMeal).get(controller.getMeals);
router.route('/:id').get(controller.getMeal).delete(controller.deleteMeal);
module.exports = router;
