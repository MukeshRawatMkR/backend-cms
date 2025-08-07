const express = require('express');
const mediaController = require('../controllers/mediaController');
const { authenticateToken, requireRole } = require('../middlewares/auth');
const { uploadFile } = require('../middlewares/upload');
const { updateMediaValidation } = require('../validations/mediaValidation');

const router = express.Router();

// All routes require authentication
router.use(authenticateToken);

router.get('/', mediaController.getAllMedia);
router.get('/type/:type', mediaController.getMediaByType);
router.get('/:id', mediaController.getMediaById);
router.post('/upload', uploadFile.single('file'), mediaController.uploadMedia);
router.put('/:id', updateMediaValidation, mediaController.updateMedia);
router.delete('/:id', mediaController.deleteMedia);

module.exports = router;