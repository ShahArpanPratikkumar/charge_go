const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const { getProfile, updateProfile, uploadPhoto, topUpWallet } = require('../controllers/userController');
const { protect } = require('../middleware/auth');
const upload = require('../middleware/upload');

// All user routes require authentication
router.use(protect);

// GET  /api/user/profile
router.get('/profile', getProfile);

// PUT  /api/user/profile
router.put('/profile',
    [
        body('name').optional().trim().isLength({ min: 2, max: 60 }).withMessage('Name must be 2–60 chars'),
        body('phone').optional().isMobilePhone().withMessage('Valid phone number required'),
    ],
    updateProfile
);

// POST /api/user/photo   (multipart/form-data, field: "photo")
router.post('/photo', upload.single('photo'), uploadPhoto);

// POST /api/user/wallet/topup
router.post('/wallet/topup', topUpWallet);

module.exports = router;
