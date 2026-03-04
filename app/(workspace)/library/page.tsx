'use client';

import { useEffect, useState } from 'react';

const api = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:4000';

export default function LibraryPage() {
  const [files, setFiles] = useState<any[]>([]);
  const [notice, setNotice] = useState('');
  const [loading, setLoading] = useState(true);

  const loadFiles = async () => {
    setLoading(true);
    const res = await fetch(`${api}/files`);
    const data = await res.json();
    setFiles(data.files || []);
    setLoading(false);
  };

  useEffect(() => {
    loadFiles();
  }, []);

  const upload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const fd = new FormData();
    fd.append('file', file);
    const res = await fetch(`${api}/upload`, { method: 'POST', body: fd });
    setNotice(res.ok ? 'File berhasil diupload.' : 'Upload gagal.');
    if (res.ok) loadFiles();
  };

  return (
    <section className="space-y-5">
      <h1 className="text-2xl font-bold">E-Library Dokumen & Notulensi Rapat</h1>
      {notice && <p className="rounded-lg bg-teal-50 p-2 text-teal-700 dark:bg-teal-950">{notice}</p>}
      <label className="inline-block rounded-xl bg-teal-600 px-4 py-3 text-white">
        Upload Dokumen
        <input type="file" className="hidden" onChange={upload} />
      </label>

      <div className="rounded-2xl border bg-white p-4 shadow-soft dark:border-slate-700 dark:bg-slate-900">
        {loading ? (
          <p>Memuat dokumen...</p>
        ) : (
          <div className="space-y-3">
            {files.map((file) => (
              <details key={file.id} className="rounded-xl border p-3 dark:border-slate-700">
                <summary className="cursor-pointer font-semibold">{file.name}</summary>
                <p className="mt-2 text-sm text-slate-500">Dibuat: {new Date(file.createdTime).toLocaleString('id-ID')}</p>
                <div className="mt-2 flex gap-3 text-sm">
                  <a className="text-teal-600" href={file.webViewLink} target="_blank">Lihat</a>
                  <a className="text-blue-600" href={`${api}/download/${file.id}`}>Download</a>
                </div>
              </details>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
