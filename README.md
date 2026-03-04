# WEB-OSIS SaaS

Platform manajemen organisasi sekolah (OSIS) bergaya startup SaaS modern dengan frontend Next.js + Tailwind dan backend Node.js + Express terintegrasi Google APIs (Calendar, Drive, Sheets) via Service Account.

## Stack
- Frontend: Next.js (App Router), Tailwind CSS, Chart.js, FullCalendar
- Backend: Express.js, googleapis, Multer
- Integrasi: Google Calendar API, Google Drive API, Google Sheets API

## Struktur
- `app/` → Landing page + dashboard modern (kanban, kalender, keuangan, e-library)
- `backend/server.js` → entry backend
- `backend/routes` → routing API
- `backend/controllers` → controller logic
- `backend/services` → service Google API

## Menjalankan lokal
1. Frontend
```bash
npm install
npm run dev
```
2. Backend
```bash
cd backend
npm install
cp ../.env.example .env
# isi CALENDAR_ID, DRIVE_FOLDER_ID, SPREADSHEET_ID, dan credentials
npm run dev
```

## Endpoint backend
### Google Calendar
- `GET /api/events`
- `POST /api/events`
- `PUT /api/events/:id`
- `DELETE /api/events/:id`

### Google Drive
- `POST /upload`
- `GET /files`
- `GET /download/:id`
- `DELETE /delete/:id`

### Google Sheets
- `GET /api/keuangan`
- `POST /api/keuangan`

## Deployment Railway
- Deploy frontend dan backend sebagai dua service terpisah.
- Set environment variables dari `.env.example` di Railway dashboard.
- Pastikan service account tidak pernah dikirim ke frontend.
