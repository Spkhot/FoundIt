const express = require('express');
const router = express.Router();
const feedbackController = require('../controllers/feedbackController');

router.post('/', feedbackController.submitFeedback); // POST /api/feedback
router.get('/', feedbackController.getAllFeedback);  // GET /api/feedback

module.exports = router;
