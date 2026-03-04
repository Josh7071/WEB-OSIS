const router = require('express').Router();
const { getEvents, postEvent, putEvent, removeEvent } = require('../controllers/calendarController');

router.get('/', getEvents);
router.post('/', postEvent);
router.put('/:id', putEvent);
router.delete('/:id', removeEvent);

module.exports = router;
