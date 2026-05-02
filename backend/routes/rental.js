const express = require('express');
const router = express.Router();
const { startRental, endRental, getRentals, getActiveRental } = require('../controllers/rentalController');
const { protect } = require('../middleware/auth');

router.use(protect);

// GET  /api/rental          — paginated history (?page=1&limit=10)
router.get('/', getRentals);

// GET  /api/rental/active   — currently active rental
router.get('/active', getActiveRental);

// POST /api/rental/start    — start a new rental
router.post('/start', startRental);

// POST /api/rental/end      — end active rental
router.post('/end', endRental);

module.exports = router;
