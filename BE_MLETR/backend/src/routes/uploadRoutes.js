const express = require('express');
const multer = require('multer');
const path = require('path');
const AuthMiddleware = require('../middleware/authMiddleware');
const UploadController = require('../controllers/uploadController');

const router = express.Router();
const authMiddleware = new AuthMiddleware();

// Konfigurasi multer untuk upload file
const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, path.join(__dirname, '../../temp'));
    },
    filename: function(req, file, cb) {
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});

const upload = multer({ 
    storage: storage,
    limits: {
        fileSize: 10 * 1024 * 1024 // Batas 10MB
    }
});

// Rute upload dokumen
router.post(
    '/upload', 
    authMiddleware.authenticate.bind(authMiddleware),
    upload.single('file'),
    UploadController.uploadDocument
);

module.exports = router;