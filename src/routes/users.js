const express = require('express');
const { getProfile, updateProfile, deleteAccount } = require('../controllers/userController');
const authMiddleware = require('../middlewares/auth');

const router = express.Router();

// All user routes require authentication
router.use(authMiddleware);

router.get('/me', getProfile);
router.put('/me', updateProfile);
router.delete('/me', deleteAccount);

module.exports = router;
