import Link from 'next/link';

const features = [
  'Dashboard Proker dan Kanban interaktif',
  'Kalender kerja terpadu berbasis Google Calendar',
  'Arsip dokumen dan notulensi di Google Drive',
  'Modul keuangan transparan berbasis Google Sheets'
];

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-teal-700 via-slate-900 to-slate-950 px-6 py-14 text-white">
      <section className="mx-auto max-w-6xl">
        <div className="rounded-3xl border border-white/20 bg-white/10 p-10 shadow-soft backdrop-blur-md">
          <p className="mb-5 inline-block rounded-full bg-white/20 px-4 py-1 text-sm">OSIS Cloud Workspace</p>
          <h1 className="max-w-3xl text-4xl font-bold leading-tight md:text-6xl">Kelola organisasi sekolah seperti startup SaaS profesional.</h1>
          <p className="mt-5 max-w-2xl text-slate-100">Bangun budaya kerja terstruktur, transparan, dan cepat dengan dashboard proker, kalender kerja, arsip cloud, dan modul keuangan modern.</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/dashboard" className="rounded-xl bg-teal-500 px-6 py-3 font-semibold hover:bg-teal-400">Mulai Kelola Organisasi Anda</Link>
            <button className="rounded-xl border border-white/40 px-6 py-3">Demo Role Login: Ketua · Bendahara · Sekretaris</button>
          </div>
        </div>
        <div className="mt-10 grid gap-5 md:grid-cols-2">
          {features.map((feature) => (
            <article key={feature} className="rounded-2xl border border-white/20 bg-white/10 p-6">
              <h2 className="text-lg font-semibold">{feature}</h2>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
