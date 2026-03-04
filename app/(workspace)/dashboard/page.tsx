'use client';

import { useMemo, useState } from 'react';

type Status = 'Belum Dimulai' | 'Sedang Berjalan' | 'Selesai';

type Proker = {
  id: string;
  name: string;
  division: string;
  deadline: string;
  description: string;
  status: Status;
};

const initialData: Proker[] = [
  { id: '1', name: 'MPLS Inspiratif', division: 'Humas', deadline: '2026-07-10', description: 'Koordinasi agenda MPLS', status: 'Sedang Berjalan' },
  { id: '2', name: 'Festival Seni', division: 'Kesenian', deadline: '2026-08-05', description: 'Event kolaborasi antar kelas', status: 'Belum Dimulai' },
  { id: '3', name: 'Kompetisi E-Sport', division: 'Olahraga', deadline: '2026-06-20', description: 'Turnamen internal sekolah', status: 'Selesai' }
];

const statuses: Status[] = ['Belum Dimulai', 'Sedang Berjalan', 'Selesai'];

export default function DashboardPage() {
  const [tasks, setTasks] = useState(initialData);
  const [divisionFilter, setDivisionFilter] = useState('Semua');

  const divisions = ['Semua', ...new Set(tasks.map((task) => task.division))];
  const filtered = divisionFilter === 'Semua' ? tasks : tasks.filter((task) => task.division === divisionFilter);

  const progressByDivision = useMemo(() => {
    const grouped = tasks.reduce<Record<string, { total: number; done: number }>>((acc, task) => {
      if (!acc[task.division]) acc[task.division] = { total: 0, done: 0 };
      acc[task.division].total += 1;
      if (task.status === 'Selesai') acc[task.division].done += 1;
      return acc;
    }, {});
    return Object.entries(grouped);
  }, [tasks]);

  const onDrop = (status: Status, id: string) => {
    setTasks((prev) => prev.map((task) => (task.id === id ? { ...task, status } : task)));
  };

  return (
    <section className="space-y-6">
      <div className="grid gap-4 md:grid-cols-4">
        {[
          ['Total Proker Aktif', String(tasks.length)],
          ['Agenda Minggu Ini', '8 kegiatan'],
          ['Sisa Anggaran', 'Rp 12.400.000'],
          ['Rata-rata Kehadiran', '92%']
        ].map(([title, value]) => (
          <div key={title} className="glass rounded-2xl p-5 shadow-soft">
            <p className="text-sm text-slate-500">{title}</p>
            <p className="mt-2 text-2xl font-bold">{value}</p>
          </div>
        ))}
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-bold">Tracker Progres Program Kerja</h1>
        <select className="rounded-xl border p-2" value={divisionFilter} onChange={(e) => setDivisionFilter(e.target.value)}>
          {divisions.map((division) => (
            <option key={division}>{division}</option>
          ))}
        </select>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {statuses.map((status) => (
          <div
            key={status}
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => onDrop(status, e.dataTransfer.getData('id'))}
            className="rounded-2xl border border-slate-200 bg-white p-4 shadow-soft dark:border-slate-700 dark:bg-slate-900"
          >
            <h2 className="mb-3 font-semibold">{status}</h2>
            <div className="space-y-3">
              {filtered
                .filter((task) => task.status === status)
                .map((task) => (
                  <article
                    key={task.id}
                    draggable
                    onDragStart={(e) => e.dataTransfer.setData('id', task.id)}
                    className="cursor-grab rounded-xl border border-slate-200 p-3 hover:-translate-y-1 hover:shadow transition dark:border-slate-700"
                  >
                    <p className="font-semibold">{task.name}</p>
                    <p className="text-sm text-slate-500">{task.division} · Deadline {task.deadline}</p>
                    <p className="mt-2 text-sm">{task.description}</p>
                  </article>
                ))}
            </div>
          </div>
        ))}
      </div>

      <div className="rounded-2xl border bg-white p-6 shadow-soft dark:border-slate-700 dark:bg-slate-900">
        <h2 className="font-semibold">Progress Divisi</h2>
        <div className="mt-4 space-y-4">
          {progressByDivision.map(([division, stat]) => {
            const progress = Math.round((stat.done / stat.total) * 100);
            return (
              <div key={division}>
                <div className="mb-1 flex justify-between text-sm">
                  <span>{division}</span>
                  <span>{progress}%</span>
                </div>
                <div className="h-2 rounded-full bg-slate-200 dark:bg-slate-800">
                  <div className="h-2 rounded-full bg-teal-500" style={{ width: `${progress}%` }} />
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <button className="fixed bottom-8 right-8 rounded-full bg-teal-600 px-5 py-4 text-sm font-semibold text-white shadow-soft hover:bg-teal-500">+ Tambah Proker</button>
    </section>
  );
}
