const express = require('express');
const router = express.Router();
const { getPayments, addPayment, setDefault, deletePayment } = require('../controllers/paymentController');
const { protect } = require('../middleware/auth');

router.use(protect);

// GET    /api/payment       — list all payment methods
router.get('/', getPayments);

// POST   /api/payment       — add new payment method
router.post('/', addPayment);

// PUT    /api/payment/:id/default — set as default
router.put('/:id/default', setDefault);

// DELETE /api/payment/:id   — remove payment method
router.delete('/:id', deletePayment);

module.exports = router;
