const router = require('express').Router();
const controller = require('../controllers/inventoryController');
router.route('/').post(controller.createInventory).get(controller.getInventory);
router.route('/:id').get(controller.getInventoryItem).put(controller.updateInventory).delete(controller.deleteInventory);
module.exports = router;
