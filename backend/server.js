require('dotenv').config();
const express = require('express');
const cors = require('cors');

const calendarRoutes = require('./routes/calendarRoutes');
const keuanganRoutes = require('./routes/keuanganRoutes');
const driveRoutes = require('./routes/driveRoutes');

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/events', calendarRoutes);
app.use('/api/keuangan', keuanganRoutes);
app.use('/', driveRoutes);

app.get('/health', (_, res) => res.json({ ok: true, service: 'osis-backend' }));

app.use((err, _, res, __) => {
  console.error(err);
  res.status(500).json({ message: 'Terjadi kesalahan server.', error: err.message });
});

const port = process.env.PORT || 4000;
app.listen(port, () => {
  console.log(`Backend berjalan di port ${port}`);
});
