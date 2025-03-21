const { Magic } = require('@magic-sdk/admin');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

class MagicLinkController {
    constructor() {
        this.magic = new Magic(process.env.MAGIC_SECRET_KEY);
    }
    
    async login(req, res) {
        try {
            // Dapatkan DID token dari header
            const didToken = req.headers.authorization?.startsWith('Bearer ') 
                ? req.headers.authorization.substring(7) 
                : null;
                
            if (!didToken) {
                return res.status(401).json({
                    status: 'error',
                    message: 'DID token tidak ditemukan'
                });
            }
            
            // Validasi DID token
            this.magic.token.validate(didToken);
            
            // Dapatkan metadata pengguna dari Magic
            const metadata = await this.magic.users.getMetadataByToken(didToken);
            
            if (!metadata.email) {
                return res.status(400).json({
                    status: 'error',
                    message: 'Email tidak ditemukan dalam metadata Magic'
                });
            }
            
            // Cari atau buat pengguna
            let user = await User.findOne({ email: metadata.email });
            
            if (!user) {
                // Buat pengguna baru jika belum ada
                user = new User({
                    email: metadata.email,
                    username: metadata.email.split('@')[0],
                    authProvider: 'magic',
                    magicUserId: metadata.issuer,
                    role: 'user'
                });
                
                await user.save();
            } else {
                // Update informasi Magic jika pengguna sudah ada
                user.magicUserId = metadata.issuer;
                user.lastLogin = new Date();
                await user.save();
            }
            
            // Buat JWT token
            const token = jwt.sign(
                { id: user._id, email: user.email }, 
                process.env.JWT_SECRET, 
                { expiresIn: '1d' }
            );
            
            return res.status(200).json({
                status: 'success',
                message: 'Login berhasil',
                data: {
                    user: {
                        id: user._id,
                        email: user.email,
                        username: user.username,
                        role: user.role
                    },
                    token
                }
            });
            
        } catch (error) {
            console.error('Error saat login dengan Magic Link:', error);
            return res.status(500).json({
                status: 'error',
                message: 'Gagal login dengan Magic Link',
                error: error.message
            });
        }
    }
    
    async logout(req, res) {
        try {
            // Dapatkan DID token dari header
            const didToken = req.headers.authorization?.startsWith('Bearer ') 
                ? req.headers.authorization.substring(7) 
                : null;
                
            if (!didToken) {
                return res.status(401).json({
                    status: 'error',
                    message: 'DID token tidak ditemukan'
                });
            }
            
            // Dapatkan metadata pengguna dari Magic
            const metadata = await this.magic.users.getMetadataByToken(didToken);
            
            // Logout dari Magic
            await this.magic.users.logoutByIssuer(metadata.issuer);
            
            return res.status(200).json({
                status: 'success',
                message: 'Logout berhasil'
            });
            
        } catch (error) {
            console.error('Error saat logout dari Magic Link:', error);
            return res.status(500).json({
                status: 'error',
                message: 'Gagal logout dari Magic Link',
                error: error.message
            });
        }
    }
    
    async verifyToken(req, res) {
        try {
            // Dapatkan DID token dari header
            const didToken = req.headers.authorization?.startsWith('Bearer ') 
                ? req.headers.authorization.substring(7) 
                : null;
                
            if (!didToken) {
                return res.status(401).json({
                    status: 'error',
                    message: 'DID token tidak ditemukan'
                });
            }
            
            // Validasi DID token
            const isValid = this.magic.token.validate(didToken);
            
            return res.status(200).json({
                status: 'success',
                isValid
            });
            
        } catch (error) {
            console.error('Error saat memverifikasi token Magic:', error);
            return res.status(401).json({
                status: 'error',
                message: 'Token tidak valid',
                error: error.message
            });
        }
    }
    
    async getUserInfo(req, res) {
        try {
            // Dapatkan DID token dari header
            const didToken = req.headers.authorization?.startsWith('Bearer ') 
                ? req.headers.authorization.substring(7) 
                : null;
                
            if (!didToken) {
                return res.status(401).json({
                    status: 'error',
                    message: 'DID token tidak ditemukan'
                });
            }
            
            // Dapatkan metadata pengguna dari Magic
            const metadata = await this.magic.users.getMetadataByToken(didToken);
            
            return res.status(200).json({
                status: 'success',
                data: metadata
            });
            
        } catch (error) {
            console.error('Error saat mendapatkan info pengguna Magic:', error);
            return res.status(500).json({
                status: 'error',
                message: 'Gagal mendapatkan info pengguna',
                error: error.message
            });
        }
    }
}

module.exports = new MagicLinkController();