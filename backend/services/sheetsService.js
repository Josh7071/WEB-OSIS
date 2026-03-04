const { google } = require('googleapis');
const { getClient } = require('./googleAuth');

async function getSheetsApi() {
  const auth = getClient(['https://www.googleapis.com/auth/spreadsheets']);
  return google.sheets({ version: 'v4', auth });
}

async function getKeuanganData() {
  const sheets = await getSheetsApi();
  const res = await sheets.spreadsheets.values.get({
    spreadsheetId: process.env.SPREADSHEET_ID,
    range: 'transaksi!A2:E'
  });

  const rows = res.data.values || [];
  const transaksi = rows.map((row) => ({
    tanggal: row[0],
    jenis: row[1],
    kategori: row[2],
    keterangan: row[3],
    nominal: Number(row[4] || 0)
  }));

  const totalPemasukan = transaksi.filter((x) => x.jenis === 'Pemasukan').reduce((a, b) => a + b.nominal, 0);
  const totalPengeluaran = transaksi.filter((x) => x.jenis === 'Pengeluaran').reduce((a, b) => a + b.nominal, 0);
  const byKategoriMap = transaksi.reduce((acc, item) => {
    const key = item.kategori || 'Lainnya';
    acc[key] = (acc[key] || 0) + item.nominal;
    return acc;
  }, {});

  const byKategori = Object.entries(byKategoriMap).map(([kategori, total]) => ({ kategori, total }));

  return {
    transaksi,
    summary: {
      totalPemasukan,
      totalPengeluaran,
      sisaKas: totalPemasukan - totalPengeluaran
    },
    byKategori
  };
}

async function appendTransaksi(payload) {
  const sheets = await getSheetsApi();
  await sheets.spreadsheets.values.append({
    spreadsheetId: process.env.SPREADSHEET_ID,
    range: 'transaksi!A:E',
    valueInputOption: 'USER_ENTERED',
    requestBody: {
      values: [[payload.tanggal, payload.jenis, payload.kategori, payload.keterangan, payload.nominal]]
    }
  });
}

module.exports = { getKeuanganData, appendTransaksi };
