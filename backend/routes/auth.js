const { Router } = require('express');
const authController = require('../controllers/auth');
const { asyncHandler } = require('../utils/async-handler');

const router = Router();

router.post('/login', asyncHandler(authController.login));
router.post('/signup', asyncHandler(authController.signup));

module.exports = router;
