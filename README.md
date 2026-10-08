# ERP PT. Anaheim Nimbus Universal — Modul E-4: Tasklist & Eksekusi Agile

Sistem Monorepo terpadu untuk **Modul E-4: Tasklist dan Eksekusi Agile (Kelompok 4 / Kelas E)** — ERP Software PT. Anaheim Nimbus Universal.

Modul ini mengimplementasikan pengelolaan hierarki tugas (*Module &rarr; Feature &rarr; Task*), papan eksekusi Kanban 5-kolom, gerbang Dual-Approval rilis tugas (TL & PM), otomasi jalur *rework* ketika tugas gagal uji/review, verifikasi dua tahap Definition of Done (Ceklis PM & Sign-off TL), serta mesin kalkulasi matematis progres *deliverable*.

---

## 👥 Panduan Clone & Setup untuk Rekan Tim (Collaborator Guide)

Ikuti langkah-langkah di bawah ini untuk mengklon dan menjalankan proyek di komputer lokal Anda:

### 1. Prasyarat Sistem (Prerequisites)
Pastikan lingkungan pengembangan Anda telah terinstal:
- **Git**
- **PHP 8.2+** (direkomendasikan PHP 8.3 / 8.4) & **Composer**
- **Node.js 18+** (direkomendasikan Node.js 20+) & **npm**

---

### 2. Kloning Repositori
```bash
git clone https://github.com/Danzyyyy/ERP-Tasklist-Agile.git
cd ERP-Tasklist-Agile
```

---

### 3. Setup Backend (Laravel 11 RESTful API)

Buka terminal pertama dan jalankan:
```bash
# Pindah ke direktori backend
cd backend

# Salin file konfigurasi environment
cp .env.example .env

# Install dependensi PHP
composer install

# Generate application key
php artisan key:generate

# Inisialisasi basis data SQLite dan jalankan migrasi beserta data seeder awal
touch database/database.sqlite
php artisan migrate --seed

# Jalankan server API backend
php artisan serve --port=8000
```
> 💡 **Info:** API backend sekarang aktif dan dapat diakses di `http://127.0.0.1:8000`.

---

### 4. Setup Frontend (React 18 SPA + Vite + Tailwind CSS)

Buka terminal kedua dan jalankan:
```bash
# Pindah ke direktori frontend
cd frontend

# Salin file konfigurasi environment
cp .env.example .env

# Install paket dependensi frontend
npm install

# Jalankan server development Vite
npm run dev
```
> 🚀 **Buka di Browser:** Buka `http://localhost:5173` pada peramban Anda. Aplikasi siap digunakan!

---

### 5. Setup Alternatif: Docker Compose (All-in-One)
Jika Anda memiliki Docker terinstal, seluruh stack (Backend, Database PostgreSQL, dan Frontend) dapat dijalankan hanya dengan satu perintah:
```bash
docker compose up -d --build
```
- Frontend SPA: `http://localhost:3000`
- Backend API: `http://localhost:8000`
- PostgreSQL: `localhost:5432`

---

## 🏛️ Struktur Arsitektur Monorepo

```text
ERP-Tasklist-Agile/
├── backend/                                  # Laravel 11 RESTful API
│   ├── app/
│   │   ├── Enums/                            # ComplexityWeight, TaskStatus, ApprovalStatus, ReviewType, UserRole
│   │   ├── Http/
│   │   │   ├── Controllers/Api/v1/           # TaskController, ApprovalController, ProgressController, ReviewController, ModuleController, AuthController
│   │   │   ├── Middleware/                   # VerifyJwtToken, CheckRole (RBAC HTTP 403)
│   │   │   └── Requests/                     # StoreTaskRequest, ApprovalRequest, ReviewLogRequest
│   │   ├── Models/                           # Module, Feature, Task, TaskApproval, TaskDependency, TaskReviewLog
│   │   └── Services/                         # ProgressCalculationService, TaskStateMachineService
│   ├── database/
│   │   ├── migrations/                       # 6 Skema Migrasi Tabel (Primary & Foreign Key UUID v7)
│   │   └── seeders/DatabaseSeeder.php        # Dataset Realistis Proyek PT. Anaheim
│   ├── routes/api.php                        # 18 RESTful Endpoints API v1
│   └── tests/Feature/TaskAgileExecutionTest.php # PHPUnit Automated Test Suite
├── frontend/                                 # React 18+ SPA (Vite + TypeScript + Tailwind)
│   ├── src/
│   │   ├── components/                       # KanbanBoard, KanbanCard, TaskTree, Modals, Navbar
│   │   ├── hooks/                            # useTasks, useProgress, useApprovals (TanStack Query)
│   │   ├── services/apiClient.ts             # Axios Client dengan Interceptor Bearer Token
│   │   ├── types/                            # task.types.ts, api.types.ts
│   │   └── pages/                            # DashboardPage, TasklistTreePage, AgileBoardPage
│   ├── Dockerfile & nginx.conf
└── docker-compose.yml                        # Orkestrasi Kontainer Backend, Postgres, & Frontend
```

---

## 📋 8 Aturan Bisnis Kontrak Spesifikasi (Modul E-4)

1. **Hierarki Data SOP-05 / Q-13**:
   - `Module` &rarr; `Feature` *(opsional/nullable)* &rarr; `Task`.
2. **Parameter Task Terstandarisasi (Q-01, Q-02, Q-11)**:
   - Bobot Kompleksitas: `LOW`, `MEDIUM`, `HIGH`.
   - Estimasi Beban: `estimated_man_hours` (desimal jam kerja riil) dan `actual_man_hours`.
   - Kepatuhan SLA: `target_deadline` (tenggat H-1 deliverable).
3. **Mekanisme Dual-Approval Task Release (FTR-K04-03 / Q-04)**:
   - Tugas baru berstatus `DRAFT`.
   - Wajib disetujui terpisah oleh role `TECHNICAL_LEAD` dan `PROJECT_MANAGER`.
   - Hanya beralih ke `RELEASED` setelah kedua pihak memberikan persetujuan (`APPROVED`). Jika ditolak, status terkunci di `DRAFT` dengan catatan revisi.
4. **Agile Kanban Board 5 Kolom (FTR-K04-04 / SOP-08)**:
   - 5 Kolom terstandarisasi: `RELEASED` &rarr; `DEVELOPMENT` &rarr; `CODE_REVIEW` &rarr; `TESTING` &rarr; `DONE`.
   - Kartu tugas hanya dapat ditarik ke `DEVELOPMENT` setelah menetapkan pelaksana (PIC assignee).
5. **Otomasi Jalur Rework (FTR-K04-05 / Q-05)**:
   - Hasil Code Review dan QA Testing dicatat secara manual.
   - Jika hasil pengujian bernilai `REJECTED`, kartu tugas **otomatis dikembalikan ke `DEVELOPMENT`** dengan penanda *"Rework/Revisi"*.
6. **Verifikasi Dua Gerbang Definition of Done (FTR-K04-06 / Q-06, Q-07)**:
   - **Gerbang 1 (PM)**: Project Manager memvalidasi ceklis kelayakan (`is_pm_verified = true`).
   - **Gerbang 2 (TL)**: Technical Lead melakukan otorisasi *sign-off* akhir (`is_tl_signed = true`), yang mengesahkan tugas resmi menjadi `DONE`.
7. **Mesin Kalkulasi Progres Deliverable (FTR-K04-07 / Q-03 / API-K04-01)**:
   $$\text{Progres Deliverable} = \left( \frac{\sum \text{Man-Hour Tugas DONE}}{\sum \text{Man-Hour Seluruh Tugas Deliverable}} \right) \times 100\%$$
   - Penanganan pembagian nol otomatis menghasilkan `0.00%`.
   - Disediakan melalui endpoint `GET /api/v1/projects/{projectId}/deliverable-progress`.
8. **Standar Data Bersama**:
   - Seluruh primary & foreign key menggunakan **RFC 9562 UUID v7**.
   - Timestamp menggunakan format standar **RFC 3339 / ISO 8601 UTC**.
   - Otentikasi header `Authorization: Bearer <token>` dengan klaim peran Modul F-1.

---

## 🧪 Menjalankan Automated Test Backend

Untuk memastikan semua aturan bisnis dan endpoint berjalan sesuai kontrak:
```bash
cd backend
php artisan test --filter=TaskAgileExecutionTest
```
Pengujian mencakup:
- Inisialisasi status `DRAFT` dan approval records.
- Gerbang Dual-Approval TL & PM.
- Otomasi pembalikan alur Rework ke kolom `DEVELOPMENT`.
- Validasi ceklis PM sebelum otorisasi sign-off TL.
- Perhitungan formula progres deliverable matematis.

---

## 🔑 Demo Role Switcher (Simulasi Modul F-1)

Aplikasi dilengkapi tombol beralih peran instan di pojok kanan atas navbar:
- **Technical Lead**: `Fauzan (TL)` &bull; Token: `mock_tl` *(Otoritas Dual-Approval & Sign-off Final)*
- **Project Manager**: `Tubagus M. Wildan (PM)` &bull; Token: `mock_pm` *(Otoritas Dual-Approval & Ceklis PM)*
- **Frontend Developer**: `Ariel (Dev)` &bull; Token: `mock_dev` *(Eksekusi Development & Pengajuan Review)*
- **QA Tester**: `Valdric (QA)` &bull; Token: `mock_tester` *(Pengujian QA & Pemicu Alur Rework)*

---

## 🌿 Standar Kontribusi Git (Collaboration Guidelines)

Sebelum melakukan push atau pull request:
1. Buat branch baru dari `main` dengan konvensi:
   - `feat/nama-fitur` (untuk penambahan fitur baru)
   - `fix/nama-perbaikan` (untuk perbaikan bug)
2. Pastikan test backend lolos (`php artisan test`).
3. Pastikan build frontend tidak ada error (`npm run build`).
4. Buat Pull Request ke branch `main` dengan menyertakan deskripsi perubahan.
