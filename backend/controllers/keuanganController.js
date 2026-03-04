const { getKeuanganData, appendTransaksi } = require('../services/sheetsService');

exports.getKeuangan = async (_req, res, next) => {
  try {
    const data = await getKeuanganData();
    res.json(data);
  } catch (error) {
    next(error);
  }
};

exports.postKeuangan = async (req, res, next) => {
  try {
    const { tanggal, jenis, kategori, keterangan, nominal } = req.body;
    if (!tanggal || !jenis || !kategori || !keterangan || !nominal) {
      return res.status(400).json({ message: 'Data transaksi belum lengkap.' });
    }
    await appendTransaksi(req.body);
    res.status(201).json({ message: 'Transaksi berhasil ditambahkan.' });
  } catch (error) {
    next(error);
  }
};
