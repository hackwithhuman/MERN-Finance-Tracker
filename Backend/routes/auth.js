const express = require('express');
const { registerUser , loginUser , getUserProfile } = require('../controllers/authControllers');
const { protect } = require('../middleware/authMiddlewares');
const router = express.Router();
const upload = require('../middleware/uploadMiddleware');

// Register route
router.post('/register', upload.single('image'), registerUser);

router.post('/login', loginUser);
router.get('/profile', protect , getUserProfile);

// Upload profile image
// router.post('/profile-image', upload.single('image'), (req, res) => {
//     console.log('File:', req.file);
//     console.log('Body:', req.body);
//     if (!req.file) {
//         return res.status(400).json({ message: 'Please upload a file' });
//     }
//     const imageUrl = `${req.protocol}://${req.get('host')}/upload/${req.file.filename}`;
//     res.status(200).json({ imageUrl, message: 'image uploaded successfully' });
// });

module.exports = router;