# MEDIS – Mentoring English and Science Smudama

Website latihan soal olimpiade untuk siswa dengan 2 role:
- **Admin**: kelola soal, kategori, murid, hasil pengerjaan, dan progres.
- **Murid**: register/login, pilih kategori, kerjakan soal, lihat skor, pembahasan, dan riwayat.

## Teknologi
- Frontend: React + Vite + Tailwind CSS
- Backend: Node.js + Express.js
- Database: MongoDB
- Auth: JWT + bcrypt

## Cara Menjalankan Lokal

### 1. Jalankan Backend
```bash
cd backend
npm install
cp .env.example .env
npm run seed
npm run dev
```

Default backend berjalan di:
```bash
http://localhost:5000
```

### 2. Jalankan Frontend
Buka terminal baru:
```bash
cd frontend
npm install
npm run dev
```

Default frontend berjalan di:
```bash
http://localhost:5173
```

## Akun Demo
Setelah menjalankan `npm run seed`:

### Admin
Email: `admin@medis.id`  
Password: `admin123`

### Murid
Email: `murid@medis.id`  
Password: `murid123`

## Catatan Penting
Pastikan MongoDB sudah aktif. Jika memakai MongoDB Atlas, ubah `MONGO_URI` di file `.env`.
