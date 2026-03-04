const { listEvents, createEvent, updateEvent, deleteEvent } = require('../services/calendarService');

exports.getEvents = async (_req, res, next) => {
  try {
    const events = await listEvents();
    res.json(events);
  } catch (error) {
    next(error);
  }
};

exports.postEvent = async (req, res, next) => {
  try {
    const event = await createEvent(req.body);
    res.status(201).json(event);
  } catch (error) {
    next(error);
  }
};

exports.putEvent = async (req, res, next) => {
  try {
    const event = await updateEvent(req.params.id, req.body);
    res.json(event);
  } catch (error) {
    next(error);
  }
};

exports.removeEvent = async (req, res, next) => {
  try {
    await deleteEvent(req.params.id);
    res.json({ message: 'Event terhapus.' });
  } catch (error) {
    next(error);
  }
};
