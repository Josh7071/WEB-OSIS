const { google } = require('googleapis');
const { getClient } = require('./googleAuth');

async function getCalendarApi() {
  const auth = getClient(['https://www.googleapis.com/auth/calendar']);
  return google.calendar({ version: 'v3', auth });
}

async function listEvents() {
  const calendar = await getCalendarApi();
  const response = await calendar.events.list({
    calendarId: process.env.CALENDAR_ID,
    singleEvents: true,
    orderBy: 'startTime',
    maxResults: 250,
    timeZone: 'Asia/Jakarta'
  });

  return (response.data.items || []).map((event) => ({
    id: event.id,
    title: event.summary,
    start: event.start?.dateTime || event.start?.date,
    end: event.end?.dateTime || event.end?.date,
    description: event.description,
    extendedProps: {
      category: event.extendedProperties?.private?.category || 'Rapat'
    }
  }));
}

async function createEvent(payload) {
  const calendar = await getCalendarApi();
  const response = await calendar.events.insert({
    calendarId: process.env.CALENDAR_ID,
    requestBody: payload
  });
  return response.data;
}

async function updateEvent(id, payload) {
  const calendar = await getCalendarApi();
  const response = await calendar.events.update({
    calendarId: process.env.CALENDAR_ID,
    eventId: id,
    requestBody: payload
  });
  return response.data;
}

async function deleteEvent(id) {
  const calendar = await getCalendarApi();
  await calendar.events.delete({
    calendarId: process.env.CALENDAR_ID,
    eventId: id
  });
}

module.exports = { listEvents, createEvent, updateEvent, deleteEvent };
