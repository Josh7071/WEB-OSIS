'use client';

import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';

export default function LandingPage() {
  const features = [
    {
      icon: '📋',
      title: 'Program Kerja Terpadu',
      description: 'Kelola program kerja dengan Kanban board interaktif dan drag-drop'
    },
    {
      icon: '📅',
      title: 'Kalender Kerja Terintegrasi',
      description: 'Sinkronisasi otomatis dengan Google Calendar untuk jadwal OSIS'
    },
    {
      icon: '📁',
      title: 'E-Library Dokumen',
      description: 'Penyimpanan digital untuk SK, LPJ, dan notulensi rapat'
    },
    {
      icon: '💰',
      title: 'Modul Keuangan Transparan',
      description: 'Dashboard keuangan dengan laporan real-time dari Google Sheets'
    },
    {
      icon: '👥',
      title: 'Manajemen Multi-Role',
      description: 'Kontrol akses untuk Ketua, Bendahara, Sekretaris, dan Anggota'
    },
    {
      icon: '📊',
      title: 'Dashboard Analitik',
      description: 'Visualisasi data dengan grafik dan statistik real-time'
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-secondary-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="text-2xl font-bold text-primary-600">🎯 OSIS Manager</div>
          <Link href="/login">
            <Button variant="primary">Login</Button>
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="text-center animate-fade-in">
          <h1 className="text-5xl md:text-6xl font-bold text-secondary-900 mb-6 leading-tight">
            Sistem Manajemen OSIS <br />
            <span className="text-primary-600">Modern & Profesional</span>
          </h1>
          <p className="text-xl text-secondary-600 mb-8 max-w-2xl mx-auto">
            Platform SaaS untuk mengelola organisasi sekolah dengan kemudahan tinggi, integrasi Google, dan desain yang inspiratif.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link href="/login">
              <Button size="lg" variant="primary">
                Mulai Sekarang
              </Button>
            </Link>
            <Button size="lg" variant="secondary">
              Pelajari Lebih Lanjut
            </Button>
          </div>
        </div>

        {/* Hero Image/Card */}
        <div className="mt-16 rounded-2xl overflow-hidden shadow-2xl">
          <div className="bg-gradient-to-br from-primary-500 to-primary-600 aspect-video flex items-center justify-center">
            <div className="text-center text-white">
              <div className="text-7xl mb-4">📊</div>
              <p className="text-2xl font-bold">Dashboard Preview</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <h2 className="text-4xl font-bold text-center text-secondary-900 mb-16">
          Fitur Unggulan
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card key={index} variant="glass" hover className="p-8">
              <div className="text-4xl mb-4">{feature.icon}</div>
              <h3 className="text-xl font-bold text-secondary-900 mb-3">
                {feature.title}
              </h3>
              <p className="text-secondary-600">
                {feature.description}
              </p>
            </Card>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-primary-600 to-primary-500 py-16">
        <div className="max-w-4xl mx-auto text-center px-4">
          <h2 className="text-4xl font-bold text-white mb-6">
            Siap Mengubah Cara Kalian Mengelola OSIS?
          </h2>
          <p className="text-primary-100 mb-8 text-lg">
            Bergabunglah dengan ribuan sekolah yang sudah menggunakan OSIS Manager
          </p>
          <Link href="/login">
            <Button size="lg" variant="secondary">
              Mulai Trial Gratis
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-secondary-900 text-secondary-300 py-8">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p>© 2024 OSIS Manager. All rights reserved. Made with ❤️ for Indonesian Students.</p>
        </div>
      </footer>
    </div>
  );
}
