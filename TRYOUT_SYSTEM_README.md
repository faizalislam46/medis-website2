# MEDIS Tryout System

Fitur baru yang ditambahkan:

## Backend
- Model Tryout: `backend/src/models/Tryout.js`
- Route Tryout: `backend/src/routes/tryoutRoutes.js`
- Endpoint baru:
  - `GET /api/tryouts`
  - `GET /api/tryouts/:id`
  - `POST /api/tryouts` khusus admin
  - `DELETE /api/tryouts/:id` khusus admin
  - `POST /api/tryouts/:id/submit` untuk submit jawaban murid
- Attempt sekarang mendukung tryout lewat field `tryout` dan `tryoutTitle`.

## Frontend
- Admin dapat membuat paket tryout berdasarkan kategori, durasi, dan jumlah soal.
- Murid dapat melihat daftar tryout di `/tryouts`.
- Murid dapat mengerjakan tryout dengan timer di `/tryout/:id`.
- Tryout auto-submit ketika waktu habis.
- Navigasi soal dan indikator soal terjawab.
- Hasil tryout menampilkan skor, jawaban, kunci, dan pembahasan.

## Cara menjalankan lokal

Backend:
```bash
cd backend
npm install
npm run dev
```

Frontend:
```bash
cd frontend
npm install
npm run dev
```

Pastikan `backend/.env` berisi:
```env
MONGO_URI=connection_string_mongodb
JWT_SECRET=secret_anda
PORT=5000
```
