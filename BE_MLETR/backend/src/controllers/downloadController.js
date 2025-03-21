const fs = require('fs');
const path = require('path');
const Document = require('../models/Document');

class DownloadController {
    async downloadDocument(req, res) {
        try {
            const { documentId } = req.params;
            const userId = req.user._id;
            
            // Cari dokumen di database
            const document = await Document.findById(documentId);
            
            if (!document) {
                return res.status(404).json({
                    status: 'error',
                    message: 'Dokumen tidak ditemukan'
                });
            }
            
            // Periksa izin akses
            const isCreator = document.creator.toString() === userId.toString();
            const isInEndorsementChain = document.endorsementChain.some(id => id.toString() === userId.toString());
            
            if (!isCreator && !isInEndorsementChain) {
                return res.status(403).json({
                    status: 'error',
                    message: 'Anda tidak memiliki izin untuk mengunduh dokumen ini'
                });
            }
            
            // Periksa apakah file ada
            if (!fs.existsSync(document.filePath)) {
                return res.status(404).json({
                    status: 'error',
                    message: 'File dokumen tidak ditemukan di server'
                });
            }
            
            // Catat aktivitas unduhan
            document.downloadHistory.push({
                user: userId,
                downloadedAt: new Date()
            });
            
            await document.save();
            
            // Kirim file
            const filename = document.originalName;
            res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
            res.setHeader('Content-Type', document.fileType);
            
            const fileStream = fs.createReadStream(document.filePath);
            fileStream.pipe(res);
            
        } catch (error) {
            console.error('Error saat mengunduh dokumen:', error);
            return res.status(500).json({
                status: 'error',
                message: 'Gagal mengunduh dokumen',
                error: error.message
            });
        }
    }
    
    async generateDocumentTT(req, res) {
        try {
            const { documentId } = req.params;
            const userId = req.user._id;
            
            // Cari dokumen di database
            const document = await Document.findById(documentId);
            
            if (!document) {
                return res.status(404).json({
                    status: 'error',
                    message: 'Dokumen tidak ditemukan'
                });
            }
            
            // Periksa izin akses
            if (document.creator.toString() !== userId.toString()) {
                return res.status(403).json({
                    status: 'error',
                    message: 'Hanya pembuat dokumen yang dapat menghasilkan file TT'
                });
            }
            
            // Buat file TT
            const ttData = {
                documentId: document._id,
                documentHash: document.documentHash,
                blockchainId: document.blockchainId,
                metadata: document.metadata,
                creator: document.creator,
                createdAt: document.createdAt,
                status: document.status,
                documentType: document.documentType,
                transactionHash: document.transactionHash
            };
            
            const ttFilename = `${document.originalName.split('.')[0]}.tt`;
            const ttFilePath = path.join(__dirname, '../../temp', ttFilename);
            
            // Pastikan direktori temp ada
            const tempDir = path.join(__dirname, '../../temp');
            if (!fs.existsSync(tempDir)) {
                fs.mkdirSync(tempDir, { recursive: true });
            }
            
            // Tulis file TT
            fs.writeFileSync(ttFilePath, JSON.stringify(ttData, null, 2));
            
            // Kirim file
            res.setHeader('Content-Disposition', `attachment; filename="${ttFilename}"`);
            res.setHeader('Content-Type', 'application/json');
            
            const fileStream = fs.createReadStream(ttFilePath);
            fileStream.on('end', () => {
                // Hapus file sementara setelah diunduh
                fs.unlinkSync(ttFilePath);
            });
            
            fileStream.pipe(res);
            
        } catch (error) {
            console.error('Error saat menghasilkan file TT:', error);
            return res.status(500).json({
                status: 'error',
                message: 'Gagal menghasilkan file TT',
                error: error.message
            });
        }
    }
}

module.exports = new DownloadController();