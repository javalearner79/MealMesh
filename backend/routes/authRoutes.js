const router = require('express').Router();
const controller = require('../controllers/authController');
const { authenticate } = require('../middleware/authMiddleware');

router.post('/register', controller.register);
router.post('/login', controller.login);
router.get('/me', authenticate, controller.me);
router.post('/logout', controller.logout);
module.exports = router;
