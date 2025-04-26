const { Router } = require('express');
const dashboardController = require('../controllers/dashboard');
const { asyncHandler } = require('../utils/async-handler');

const router = Router();

router.get('/registrations', asyncHandler(dashboardController.allRegistrations));
router.get('/count-registrations', asyncHandler(dashboardController.totalRegistration));
router.get('/registrations-status', asyncHandler(dashboardController.StatusRegistration));
router.get('/competitions/registrations', asyncHandler(dashboardController.CompetitionsRegistrationCount));

module.exports = router;
