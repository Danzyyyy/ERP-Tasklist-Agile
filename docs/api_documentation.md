# Dokumentasi REST API — Modul E-4: Tasklist & Eksekusi Agile
**ERP Software PT. Anaheim Nimbus Universal**  
**Kelompok 4 / Kelas E** | Versi API: `v1.0` | Base URL: `http://127.0.0.1:8001/api/v1`

---

## 1. Ringkasan & Standar Protokol

API Modul E-4 mengimplementasikan seluruh kontrak bisnis pada dokumen `spesifikasi_fitur_minimum_4_e.md`:
- **Hierarki Data SOP-05**: `Module -> Feature (opsional) -> Task`.
- **Primary & Foreign Key**: Standar RFC 9562 UUID v7.
- **Standar Format Data**: JSON (`Content-Type: application/json`, `Accept: application/json`).
- **Autentikasi**: Bearer Token pada Header `Authorization: Bearer <token>` sesuai kontrak Modul F-1.

---

## 2. Autentikasi & Akun Simulasi (Mock Tokens F-1)

Untuk keperluan pengujian lokal / Postman selama Sprint 1, sistem menyediakan token cepat tanpa perlu login OAuth/JWT eksternal:

| Role Pengguna | Bearer Token | UUID Akun | Deskripsi Wewenang |
| :--- | :--- | :--- | :--- |
| **Technical Lead (TL)** | `mock_tl` | `01926df4-0001-7000-8000-000000000001` | Dual-Approval Task Release & Otorisasi Sign-off Akhir (`DONE`) |
| **Project Manager (PM)** | `mock_pm` | `01926df4-0002-7000-8000-000000000002` | Dual-Approval Task Release & Verifikasi Ceklis PM |
| **Frontend Developer** | `mock_dev` | `01926df4-0003-7000-8000-000000000003` | Menarik tugas ke `DEVELOPMENT`, update status, penugasan PIC |
| **QA Tester** | `mock_tester` | `01926df4-0004-7000-8000-000000000004` | Pengujian QA & Pemicu Otomasi Alur *Rework* |

---

## 3. Daftar Endpoint Lengkap

### A. Autentikasi & Profil

#### `GET /auth/demo-tokens`
- **Deskripsi**: Mendapatkan daftar token simulasi yang aktif.
- **Akses**: Publik (Tanpa Token).
- **Contoh Respon (200 OK)**:
```json
{
  "status": "success",
  "data": [
    {
      "role": "TECHNICAL_LEAD",
      "name": "Fauzan (Technical Lead)",
      "email": "tl@anaheim.id",
      "token": "mock_tl",
      "description": "Memiliki hak Dual-Approval Task Release dan Sign-off Final DONE."
    }
  ]
}
```

#### `GET /auth/me`
- **Deskripsi**: Melihat informasi profil pengguna yang sedang login berdasarkan token.
- **Akses**: Semua Peran Terotentikasi.
- **Headers**: `Authorization: Bearer mock_tl`
- **Contoh Respon (200 OK)**:
```json
{
  "status": "success",
  "data": {
    "id": "01926df4-0001-7000-8000-000000000001",
    "name": "Fauzan (Technical Lead)",
    "email": "tl@anaheim.id",
    "role": "TECHNICAL_LEAD"
  }
}
```

---

### B. Pengelolaan Hierarki Modul & Fitur (FTR-K04-01)

#### `GET /modules`
- **Deskripsi**: Mengambil seluruh modul beserta fitur-fitur di bawahnya.
- **Query Params**: `project_id` *(string, default: `PROJ-ERP-01`)*
- **Headers**: `Authorization: Bearer mock_tl`
- **Contoh Respon (200 OK)**:
```json
{
  "status": "success",
  "data": [
    {
      "id": "01a15be6-5631-718d-a765-08ec530e5cb6",
      "project_id": "PROJ-ERP-01",
      "code": "MOD-E4",
      "name": "Tasklist dan Eksekusi Agile",
      "features": [
        {
          "id": "01a15be6-5634-72a3-a9b8-61a5e3da72de",
          "module_id": "01a15be6-5631-718d-a765-08ec530e5cb6",
          "code": "FTR-K04-03",
          "name": "Dual-Approval Task Release Gate"
        }
      ]
    }
  ]
}
```

#### `POST /modules`
- **Deskripsi**: Membuat modul proyek baru.
- **Headers**: `Authorization: Bearer mock_pm`
- **Body JSON**:
```json
{
  "project_id": "PROJ-ERP-01",
  "code": "MOD-INV",
  "name": "Inventory & Asset Management",
  "description": "Pengelolaan stok barang dan inventaris gudang"
}
```

#### `POST /modules/{moduleId}/features`
- **Deskripsi**: Menambahkan fitur baru di bawah modul tertentu.
- **Headers**: `Authorization: Bearer mock_pm`
- **Body JSON**:
```json
{
  "code": "FTR-INV-01",
  "name": "Barcode Scanning",
  "description": "Pemindaian barcode barang masuk"
}
```

---

### C. Manajemen Tugas / Task Template (FTR-K04-01 & FTR-K04-02)

#### `GET /tasks`
- **Deskripsi**: Mengambil daftar tugas dengan filter opsional.
- **Query Params**:
  - `status` (`DRAFT`, `RELEASED`, `DEVELOPMENT`, `CODE_REVIEW`, `TESTING`, `DONE`)
  - `module_id` (UUID modul)
  - `feature_id` (UUID fitur)
- **Headers**: `Authorization: Bearer mock_dev`

#### `GET /tasks/hierarchy`
- **Deskripsi**: Mengambil pohon hierarki lengkap proyek: `Module -> Feature -> Tasks` dan tugas tingkat modul langsung.
- **Query Params**: `project_id` *(default: `PROJ-ERP-01`)*
- **Headers**: `Authorization: Bearer mock_dev`

#### `POST /tasks`
- **Deskripsi**: Menambahkan tugas baru. Status awal otomatis **`DRAFT`** dan sistem otomatis menginisialisasi catatan Dual-Approval (`TL` dan `PM` berstatus `PENDING`).
- **Headers**: `Authorization: Bearer mock_tl`
- **Body JSON**:
```json
{
  "module_id": "01a15be6-5631-718d-a765-08ec530e5cb6",
  "feature_id": "01a15be6-5634-72a3-a9b8-61a5e3da72de",
  "task_code": "TSK-099",
  "title": "Implementasi endpoint rekap invoice",
  "description": "Integrasi perhitungan PPN 12% dan diskon volume",
  "complexity_weight": "HIGH",
  "estimated_man_hours": 14.5,
  "target_deadline": "2026-11-15T17:00:00Z"
}
```
- **Validasi Nilai**:
  - `complexity_weight`: `LOW`, `MEDIUM`, `HIGH` (Q-01).
  - `estimated_man_hours`: Numeric minimal `0.25` (Q-02).
  - `target_deadline`: Format tanggal ISO 8601 (Q-11).

#### `GET /tasks/{id}`
- **Deskripsi**: Mendapatkan detail lengkap tugas termasuk data approvals, review logs, dan dependensi.
- **Headers**: `Authorization: Bearer mock_dev`

---

### D. Mekanisme Dual-Approval Task Release (FTR-K04-03)

Tugas baru berstatus `DRAFT`. Sebelum masuk ke papan Agile, tugas wajib disetujui terpisah oleh role `TECHNICAL_LEAD` dan `PROJECT_MANAGER`.

#### `GET /tasks/{taskId}/approvals`
- **Deskripsi**: Melihat status persetujuan saat ini oleh TL dan PM.
- **Headers**: `Authorization: Bearer mock_tl`

#### `POST /tasks/{taskId}/approvals`
- **Deskripsi**: Memberikan keputusan persetujuan atau penolakan.
- **Hak Akses**: Hanya `TECHNICAL_LEAD` atau `PROJECT_MANAGER` (Peran lain menghasilkan HTTP 403 Forbidden).
- **Headers**: `Authorization: Bearer mock_tl` atau `Authorization: Bearer mock_pm`
- **Body JSON**:
```json
{
  "status": "APPROVED",
  "notes": "Estimasi waktu dan arsitektur telah diverifikasi sesuai SLA SOP-07."
}
```
*(Catatan: Field `decision` didukung sebagai alias dari `status`)*

**Aturan Bisnis:**
1. Jika baru 1 pihak yang menyetujui (`APPROVED`), status tugas **tetap `DRAFT`**.
2. Jika kedua pihak telah menyetujui (`APPROVED`), status tugas otomatis beralih menjadi **`RELEASED`**.
3. Jika salah satu pihak menolak (`REJECTED`), status persetujuan pihak tersebut menjadi `REJECTED`, dan status tugas **tetap terkunci di `DRAFT`** dengan catatan revisi.

**Contoh Respon Error Jika Peran Tidak Sah (HTTP 403 Forbidden):**
```json
{
  "status": "error",
  "message": "Akses ditolak. Hanya peran Technical Lead dan Project Manager yang berwenang memberikan persetujuan rilis."
}
```

---

### E. Agile Kanban Board & Alur Rework (FTR-K04-04 & FTR-K04-05)

5 Kolom Standar: `RELEASED` &rarr; `DEVELOPMENT` &rarr; `CODE_REVIEW` &rarr; `TESTING` &rarr; `DONE`.

#### `PATCH /tasks/{id}/assign`
- **Deskripsi**: Menetapkan PIC pengembang pada tugas.
- **Headers**: `Authorization: Bearer mock_dev`
- **Body JSON**:
```json
{
  "assignee_id": "01926df4-0003-7000-8000-000000000003",
  "assignee_name": "Ariel (Frontend Dev)"
}
```

#### `PATCH /tasks/{id}/status`
- **Deskripsi**: Mengubah kolom Kanban tugas.
- **Headers**: `Authorization: Bearer mock_dev`
- **Body JSON**:
```json
{
  "status": "DEVELOPMENT",
  "assignee_id": "01926df4-0003-7000-8000-000000000003",
  "assignee_name": "Ariel (Frontend Dev)"
}
```

**Aturan Validasi Assignee (FTR-K04-04):**
Jika berpindah ke kolom `DEVELOPMENT` tanpa menyertakan/memiliki `assignee_id`, sistem mengembalikan **HTTP 422 Unprocessable Entity**:
```json
{
  "message": "Tentukan pelaksana (assignee) sebelum memulai development.",
  "errors": {
    "assignee": ["Tentukan pelaksana (assignee) sebelum memulai development."]
  }
}
```

#### `POST /tasks/{taskId}/reviews` (Pencatatan Review & Alur Rework)
- **Deskripsi**: Mencatat hasil pemeriksaan Code Review atau QA Testing secara manual.
- **Headers**: `Authorization: Bearer mock_tester` (atau `mock_tl`)
- **Body JSON**:
```json
{
  "review_type": "TESTING",
  "result": "REJECTED",
  "notes": "Bug ditemukan: nilai total diskon bernilai negatif saat kupon kadaluarsa."
}
```
*(Catatan: `review_type` menerima `"CODE_REVIEW"` atau `"TESTING"` / `"QA_TESTING"`; `result` menerima `"PASSED"` atau `"REJECTED"`)*

**Otomasi Alur Rework (FTR-K04-05):**
Jika `result` bernilai `REJECTED`, sistem secara otomatis mengembalikan kartu tugas ke kolom **`DEVELOPMENT`** dan mencatat log revisi.

---

### F. Two-Gate Definition of Done Sign-off (FTR-K04-06)

Tugas yang telah lulus pengujian membutuhkan verifikasi 2 gerbang sebelum resmi diakui `DONE`:

#### `PATCH /tasks/{taskId}/pm-verify` (Gerbang 1: PM)
- **Deskripsi**: Validasi ceklis kelayakan fungsional oleh Project Manager (`is_pm_verified = true`).
- **Hak Akses**: Wajib role `PROJECT_MANAGER`.
- **Headers**: `Authorization: Bearer mock_pm`
- **Contoh Respon (200 OK)**:
```json
{
  "status": "success",
  "message": "Ceklis verifikasi kelayakan PM berhasil divalidasi. Tombol otorisasi TL kini aktif.",
  "data": {
    "id": "01a15be6-...",
    "is_pm_verified": true,
    "pm_verified_by": "Tubagus M. Wildan (Project Manager)"
  }
}
```

#### `PATCH /tasks/{taskId}/tl-signoff` atau `PATCH /tasks/{taskId}/sign-off-done` (Gerbang 2: TL)
- **Deskripsi**: Otorisasi akhir oleh Technical Lead yang mengesahkan tugas resmi menjadi **`DONE`** (`is_tl_signed = true`).
- **Hak Akses**: Wajib role `TECHNICAL_LEAD`.
- **Headers**: `Authorization: Bearer mock_tl`

**Aturan Gerbang (Dual-Gate Validation):**
1. Jika TL mencoba sign-off saat PM belum melakukan verifikasi (`is_pm_verified = false`), sistem menolak dengan **HTTP 422 Unprocessable Content**:
```json
{
  "message": "Verifikasi ceklis PM wajib dipenuhi sebelum TL dapat mengesahkan tugas menjadi Done.",
  "errors": {
    "verification": ["Verifikasi ceklis PM wajib dipenuhi sebelum TL dapat mengesahkan tugas menjadi Done."]
  }
}
```
2. Jika peran selain TL (misal PM atau Developer) mencoba memanggil endpoint ini, sistem mengembalikan **HTTP 403 Forbidden**:
```json
{
  "status": "error",
  "message": "Hanya peran Technical Lead yang berwenang melakukan final sign-off penutupan tugas."
}
```

---

### G. Mesin Kalkulasi Progres Deliverable (FTR-K04-07 & API-K04-01)

#### `GET /projects/{projectId}/deliverable-progress`
- **Deskripsi**: Menghitung secara matematis persentase progres deliverable proyek berbasis akumulasi jam kerja (man-hour) tugas berstatus `DONE`.
- **Formula (Q-03)**:
  $$\text{Progres Deliverable} = \left( \frac{\sum \text{Man-Hour Tugas DONE}}{\sum \text{Man-Hour Seluruh Tugas Deliverable}} \right) \times 100\%$$
- **Headers**: `Authorization: Bearer mock_tl`
- **Contoh Request**: `http://127.0.0.1:8001/api/v1/projects/PROJ-ERP-01/deliverable-progress`
- **Contoh Respon (200 OK)**:
```json
{
  "status": "success",
  "projectId": "PROJ-ERP-01",
  "data": {
    "totalTasks": 8,
    "completedTasks": 3,
    "totalEstimatedManHours": 78.5,
    "completedManHours": 32.0,
    "actualManHoursSpent": 28.5,
    "progressPercentage": 40.76,
    "tasksAtRiskOrOverdue": 1,
    "calculatedAt": "2026-10-21T07:50:00+00:00"
  }
}
```

**Penanganan Kasus Khusus (Zero Division Safe):**
Jika proyek belum memiliki tugas, sistem menghasilkan `progressPercentage: 0.0` tanpa terjadi crash pembagian dengan nol.

#### `GET /modules/{moduleId}/progress`
- **Deskripsi**: Menghitung progres deliverable spesifik pada satu modul.
- **Headers**: `Authorization: Bearer mock_tl`

---

## 4. Panduan Eksekusi Automated Tests

Untuk memvalidasi seluruh kontrak bisnis dan kriteria penerimaan di atas:
```bash
cd backend
php artisan test --filter=TaskAgileExecutionTest
```
Seluruh 12 skenario pengujian mencakup:
- Inisialisasi status `DRAFT` dan 2 record approval `PENDING`.
- Alur rilis tugas Dual-Approval bertahap (TL & PM).
- Penolakan HTTP 403 bagi role non-TL/PM pada approval.
- Penguncian status `DRAFT` saat tugas ditolak.
- Validasi wajib penetapan PIC sebelum tugas ditarik ke `DEVELOPMENT`.
- Otomasi pembalikan alur Rework ke kolom `DEVELOPMENT` saat review ditolak.
- Validasi verifikasi PM sebelum otorisasi sign-off TL.
- Penolakan HTTP 403 bagi role non-TL pada sign-off akhir.
- Formula matematis akumulasi man-hour progres deliverable.
- Penanganan pembagian nol (0.00%) pada proyek tanpa tugas.
- Pengamanan endpoint dengan penolakan HTTP 401 saat token tidak disertakan.
