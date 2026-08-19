const router = require('express').Router();
const controller = require('../controllers/wasteController');
router.route('/').post(controller.createWaste).get(controller.getWaste);
router.route('/:id').get(controller.getWasteLog).delete(controller.deleteWaste);
module.exports = router;
