const express = require('express');
const AuthMiddleware = require('../middleware/authMiddleware');
const DownloadController = require('../controllers/downloadController');

const router = express.Router();
const authMiddleware = new AuthMiddleware();

// Rute download dokumen
router.get(
    '/download/:documentId', 
    authMiddleware.authenticate.bind(authMiddleware),
    DownloadController.downloadDocument
);

// Rute generate file TT
router.get(
    '/generate-tt/:documentId', 
    authMiddleware.authenticate.bind(authMiddleware),
    DownloadController.generateDocumentTT
);

module.exports = router;