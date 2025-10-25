const express = require('express');
const {protect} = require('../middleware/authMiddlewares');
const { getDashboardData } = require('../controllers/dashBoardControllers');
const router = express.Router();
// Example protected route for dashboard data
router.get('/' , protect , getDashboardData);

module.exports = router;