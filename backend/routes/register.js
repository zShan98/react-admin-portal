const { Router } = require('express');
const registerController = require('../controllers//register');
const { asyncHandler } = require('../utils/async-handler');

const router = Router();

router.get('/competitions', asyncHandler(registerController.competitions));
router.post('/new-registration', asyncHandler(registerController.registeration));
router.delete('/registration', asyncHandler(registerController.delete_registeration));

module.exports = router;


