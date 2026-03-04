const { uploadFile, listFiles, getDownloadStream, deleteFile } = require('../services/driveService');

exports.upload = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'File tidak ditemukan.' });
    }
    const data = await uploadFile(req.file.path, req.file.originalname, req.file.mimetype);
    res.status(201).json({ fileId: data.id, fileName: data.name });
  } catch (error) {
    next(error);
  }
};

exports.files = async (_req, res, next) => {
  try {
    const files = await listFiles();
    res.json({ files });
  } catch (error) {
    next(error);
  }
};

exports.download = async (req, res, next) => {
  try {
    const file = await getDownloadStream(req.params.id);
    file.data.pipe(res);
  } catch (error) {
    next(error);
  }
};

exports.remove = async (req, res, next) => {
  try {
    await deleteFile(req.params.id);
    res.json({ message: 'File terhapus.' });
  } catch (error) {
    next(error);
  }
};
