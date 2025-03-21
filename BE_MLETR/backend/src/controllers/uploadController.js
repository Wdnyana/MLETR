const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const Document = require('../models/Document');

class UploadController {
    async uploadDocument(req, res) {
        try {
            // Pastikan file ada
            if (!req.file) {
                return res.status(400).json({
                    status: 'error',
                    message: 'Tidak ada file yang diunggah'
                });
            }

            const userId = req.user._id;
            const file = req.file;
            const fileExtension = path.extname(file.originalname).toLowerCase();
            
            // Validasi tipe file
            const allowedExtensions = ['.csv', '.json', '.tt'];
            if (!allowedExtensions.includes(fileExtension)) {
                return res.status(400).json({
                    status: 'error',
                    message: 'Format file tidak didukung. Gunakan CSV, JSON, atau TT'
                });
            }

            // Buat hash untuk file
            const fileBuffer = fs.readFileSync(file.path);
            const fileHash = crypto
                .createHash('sha256')
                .update(fileBuffer)
                .digest('hex');

            // Buat nama file unik
            const uniqueFilename = `${Date.now()}-${fileHash}${fileExtension}`;
            const uploadDir = path.join(__dirname, '../../uploads');
            
            // Pastikan direktori upload ada
            if (!fs.existsSync(uploadDir)) {
                fs.mkdirSync(uploadDir, { recursive: true });
            }
            
            const filePath = path.join(uploadDir, uniqueFilename);
            
            // Pindahkan file ke direktori upload
            fs.renameSync(file.path, filePath);
            
            // Buat entri dokumen di database
            const document = new Document({
                originalName: file.originalname,
                fileName: uniqueFilename,
                filePath: filePath,
                fileSize: file.size,
                fileType: file.mimetype,
                documentHash: fileHash,
                creator: userId,
                status: 'Draft'
            });
            
            await document.save();
            
            return res.status(201).json({
                status: 'success',
                message: 'File berhasil diunggah',
                data: {
                    documentId: document._id,
                    originalName: document.originalName,
                    fileSize: document.fileSize,
                    documentHash: document.documentHash
                }
            });
            
        } catch (error) {
            console.error('Error saat mengunggah dokumen:', error);
            return res.status(500).json({
                status: 'error',
                message: 'Gagal mengunggah dokumen',
                error: error.message
            });
        }
    }
}

module.exports = new UploadController();