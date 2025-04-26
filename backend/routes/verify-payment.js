const { Router } = require('express');
const verifyController = require('../controllers/verify-payment')
const { asyncHandler } = require('../utils/async-handler');

const router = Router();

router.patch("/:competitionID/:teamID", asyncHandler(verifyController.competition_payment))


module.exports = router;
