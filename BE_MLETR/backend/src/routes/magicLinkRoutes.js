const express = require('express');
const MagicLinkController = require('../controllers/magicLinkController');
const AuthMiddleware = require('../middleware/authMiddleware');

const router = express.Router();
const authMiddleware = new AuthMiddleware();

// Rute login dengan Magic Link
router.post('/login', MagicLinkController.login);

// Rute logout dari Magic Link
router.post(
    '/logout', 
    authMiddleware.authenticate.bind(authMiddleware),
    MagicLinkController.logout
);

// Rute verifikasi token Magic
router.post('/verify', MagicLinkController.verifyToken);

// Rute mendapatkan info pengguna Magic
router.get(
    '/user-info', 
    authMiddleware.authenticate.bind(authMiddleware),
    MagicLinkController.getUserInfo
);

module.exports = router;