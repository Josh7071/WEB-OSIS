const router = require('express').Router();
const { getKeuangan, postKeuangan } = require('../controllers/keuanganController');

router.get('/', getKeuangan);
router.post('/', postKeuangan);

module.exports = router;
