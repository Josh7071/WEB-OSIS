'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';

const menus = [
  { href: '/dashboard', label: 'Dashboard Proker' },
  { href: '/kalender', label: 'Kalender Terpadu' },
  { href: '/library', label: 'E-Library Dokumen' },
  { href: '/keuangan', label: 'Modul Keuangan' }
];

export function Sidebar() {
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();

  return (
    <aside className="fixed left-0 top-0 z-20 h-screen w-72 border-r border-slate-200/70 bg-white/80 p-6 shadow-soft backdrop-blur-xl dark:border-slate-800 dark:bg-slate-900/80">
      <h2 className="text-xl font-bold text-teal-700 dark:text-teal-400">OSIS SaaS Panel</h2>
      <p className="mt-1 text-sm text-slate-500">Startup-style management workspace</p>
      <nav className="mt-8 space-y-2">
        {menus.map((menu) => (
          <Link
            key={menu.href}
            href={menu.href}
            className={`block rounded-xl px-4 py-3 transition ${pathname === menu.href ? 'bg-teal-600 text-white shadow-soft' : 'hover:bg-slate-100 dark:hover:bg-slate-800'}`}
          >
            {menu.label}
          </Link>
        ))}
      </nav>
      <button
        onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
        className="mt-8 flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 px-4 py-3 dark:border-slate-700"
      >
        {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />} Toggle Dark Mode
      </button>
    </aside>
  );
}
