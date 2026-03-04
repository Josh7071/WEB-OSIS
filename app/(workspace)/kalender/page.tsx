'use client';

import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import { useEffect, useState } from 'react';

const colorMap: Record<string, string> = {
  Rapat: '#2563eb',
  'Tenggat Proposal': '#dc2626',
  'Deadline Proker': '#f97316',
  'Hari-H Acara': '#16a34a'
};

const api = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:4000';

export default function KalenderPage() {
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [notice, setNotice] = useState('');

  const loadEvents = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${api}/api/events`);
      const data = await res.json();
      setEvents(data);
    } catch {
      setNotice('Gagal memuat kalender.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEvents();
  }, []);

  const createEvent = async (dateStr: string) => {
    const summary = prompt('Judul kegiatan');
    const category = prompt('Kategori: Rapat / Tenggat Proposal / Deadline Proker / Hari-H Acara', 'Rapat') || 'Rapat';
    if (!summary) return;
    const start = new Date(`${dateStr}T08:00:00+07:00`);
    const end = new Date(`${dateStr}T10:00:00+07:00`);
    const payload = {
      summary,
      description: `Kategori: ${category}`,
      start: { dateTime: start.toISOString(), timeZone: 'Asia/Jakarta' },
      end: { dateTime: end.toISOString(), timeZone: 'Asia/Jakarta' },
      extendedProperties: { private: { category } }
    };

    const res = await fetch(`${api}/api/events`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
    setNotice(res.ok ? 'Event berhasil ditambahkan.' : 'Gagal menambah event.');
    await loadEvents();
  };

  const mutateEvent = async (event: any) => {
    const action = prompt('Ketik EDIT untuk ubah, DELETE untuk hapus', 'EDIT');
    if (action === 'DELETE') {
      const res = await fetch(`${api}/api/events/${event.id}`, { method: 'DELETE' });
      setNotice(res.ok ? 'Event berhasil dihapus.' : 'Gagal menghapus event.');
      await loadEvents();
      return;
    }

    const summary = prompt('Judul baru', event.title);
    if (!summary) return;
    const category = prompt('Kategori', event.extendedProps?.category || 'Rapat') || 'Rapat';
    const payload = {
      summary,
      start: { dateTime: event.start?.toISOString(), timeZone: 'Asia/Jakarta' },
      end: { dateTime: event.end?.toISOString() || event.start?.toISOString(), timeZone: 'Asia/Jakarta' },
      extendedProperties: { private: { category } }
    };
    const res = await fetch(`${api}/api/events/${event.id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
    setNotice(res.ok ? 'Event berhasil diubah.' : 'Gagal mengubah event.');
    await loadEvents();
  };

  return (
    <section className="space-y-4 rounded-2xl border bg-white p-6 shadow-soft dark:border-slate-700 dark:bg-slate-900">
      <div>
        <h1 className="text-2xl font-bold">Kalender Kerja Terpadu OSIS</h1>
        <p className="text-sm text-slate-500">Sinkron dengan Google Calendar API (Service Account)</p>
      </div>
      {notice && <p className="rounded-lg bg-teal-50 p-2 text-sm text-teal-700 dark:bg-teal-950">{notice}</p>}
      {loading ? (
        <div className="animate-pulse rounded-xl bg-slate-100 p-6 dark:bg-slate-800">Memuat kalender...</div>
      ) : (
        <FullCalendar
          plugins={[dayGridPlugin, interactionPlugin]}
          initialView="dayGridMonth"
          events={events.map((evt) => ({ ...evt, color: colorMap[evt.extendedProps?.category || 'Rapat'] || '#0ea5e9' }))}
          dateClick={(arg) => createEvent(arg.dateStr)}
          eventClick={(arg) => mutateEvent(arg.event)}
          height="auto"
        />
      )}
    </section>
  );
}
