'use client';

import { useEffect, useState } from 'react';
import { Bar, Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, BarElement, CategoryScale, Legend, LinearScale, Tooltip } from 'chart.js';

ChartJS.register(ArcElement, BarElement, CategoryScale, LinearScale, Tooltip, Legend);
const api = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:4000';

export default function KeuanganPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [notice, setNotice] = useState('');
  const [form, setForm] = useState({ tanggal: '', jenis: 'Pemasukan', kategori: '', keterangan: '', nominal: '' });

  const fetchKeuangan = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${api}/api/keuangan`);
      const result = await res.json();
      setData(result);
    } catch {
      setNotice('Gagal memuat data keuangan');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchKeuangan();
  }, []);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.tanggal || !form.kategori || !form.keterangan || !form.nominal) {
      setNotice('Semua field wajib diisi.');
      return;
    }
    const res = await fetch(`${api}/api/keuangan`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) });
    setNotice(res.ok ? 'Transaksi berhasil disimpan.' : 'Gagal menyimpan transaksi.');
    if (res.ok) {
      setForm({ tanggal: '', jenis: 'Pemasukan', kategori: '', keterangan: '', nominal: '' });
      await fetchKeuangan();
    }
  };

  const cards = [
    ['Total Pemasukan', data?.summary?.totalPemasukan || 0],
    ['Total Pengeluaran', data?.summary?.totalPengeluaran || 0],
    ['Sisa Kas Aktif', data?.summary?.sisaKas || 0]
  ];

  return (
    <section className="space-y-6">
      <h1 className="text-2xl font-bold">Modul Keuangan Transparan</h1>
      {notice && <p className="rounded-xl bg-teal-50 p-3 text-sm text-teal-700 dark:bg-teal-950">{notice}</p>}
      <form onSubmit={submit} className="grid gap-3 rounded-2xl border bg-white p-5 shadow-soft md:grid-cols-5 dark:border-slate-700 dark:bg-slate-900">
        <input className="rounded-lg border p-2" type="date" value={form.tanggal} onChange={(e) => setForm({ ...form, tanggal: e.target.value })} />
        <select className="rounded-lg border p-2" value={form.jenis} onChange={(e) => setForm({ ...form, jenis: e.target.value })}>
          <option>Pemasukan</option>
          <option>Pengeluaran</option>
        </select>
        <input className="rounded-lg border p-2" placeholder="Kategori" value={form.kategori} onChange={(e) => setForm({ ...form, kategori: e.target.value })} />
        <input className="rounded-lg border p-2" placeholder="Keterangan" value={form.keterangan} onChange={(e) => setForm({ ...form, keterangan: e.target.value })} />
        <input className="rounded-lg border p-2" placeholder="Nominal" type="number" value={form.nominal} onChange={(e) => setForm({ ...form, nominal: e.target.value })} />
        <button className="rounded-lg bg-teal-600 px-4 py-2 text-white md:col-span-5">Simpan Transaksi</button>
      </form>

      {loading ? <p>Memuat dashboard...</p> : (
        <>
          <div className="grid gap-4 md:grid-cols-3">
            {cards.map(([label, value]) => (
              <div key={String(label)} className="rounded-2xl border bg-white p-5 shadow-soft dark:border-slate-700 dark:bg-slate-900">
                <p className="text-sm text-slate-500">{label}</p>
                <p className="mt-2 text-2xl font-bold">Rp {Number(value).toLocaleString('id-ID')}</p>
              </div>
            ))}
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-2xl border bg-white p-5 dark:border-slate-700 dark:bg-slate-900">
              <Bar
                data={{
                  labels: ['Pemasukan', 'Pengeluaran'],
                  datasets: [{ label: 'Arus Kas', data: [data.summary.totalPemasukan, data.summary.totalPengeluaran], backgroundColor: ['#16a34a', '#dc2626'] }]
                }}
              />
            </div>
            <div className="rounded-2xl border bg-white p-5 dark:border-slate-700 dark:bg-slate-900">
              <Doughnut
                data={{
                  labels: data.byKategori.map((x: any) => x.kategori),
                  datasets: [{ data: data.byKategori.map((x: any) => x.total), backgroundColor: ['#0ea5e9', '#10b981', '#6366f1', '#f97316', '#ef4444'] }]
                }}
              />
            </div>
          </div>
          <div className="rounded-2xl border bg-white p-5 dark:border-slate-700 dark:bg-slate-900">
            <p className="mb-2 text-sm text-slate-500">Progress Sisa Anggaran</p>
            <div className="h-3 rounded-full bg-slate-200 dark:bg-slate-700">
              <div className="h-3 rounded-full bg-teal-500" style={{ width: `${Math.max(0, Math.min(100, (data.summary.sisaKas / (data.summary.totalPemasukan || 1)) * 100))}%` }} />
            </div>
          </div>
        </>
      )}
    </section>
  );
}
