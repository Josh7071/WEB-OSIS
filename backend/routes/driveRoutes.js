const router = require('express').Router();
const multer = require('multer');
const path = require('path');
const { upload, files, download, remove } = require('../controllers/driveController');

const allowed = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.ms-excel',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'application/vnd.ms-powerpoint',
  'application/vnd.openxmlformats-officedocument.presentationml.presentation'
];

const storage = multer.diskStorage({
  destination: (_, __, cb) => cb(null, path.join(__dirname, '..', 'temp')),
  filename: (_, file, cb) => cb(null, `${Date.now()}-${file.originalname}`)
});

const uploader = multer({
  storage,
  limits: { fileSize: 50 * 1024 * 1024 },
  fileFilter: (_, file, cb) => {
    cb(null, allowed.includes(file.mimetype));
  }
});

router.post('/upload', uploader.single('file'), upload);
router.get('/files', files);
router.get('/download/:id', download);
router.delete('/delete/:id', remove);

module.exports = router;
