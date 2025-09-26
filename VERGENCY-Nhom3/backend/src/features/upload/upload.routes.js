import express from 'express';
import upload from '../../config/multer.config.js'; 
import { protect, admin } from '../auth/auth.middleware.js'; 

const router = express.Router();

router.post('/', protect, admin, upload.array('images', 5), (req, res) => {
    if (!req.files || req.files.length === 0) {
        return res.status(400).send({ message: 'Vui lòng chọn file để upload.' });
    }

    const filePaths = req.files.map(file => `/images/${file.filename}`);

    res.status(200).json({
        message: 'Upload thành công!',
        files: filePaths
    });
});

export default router;