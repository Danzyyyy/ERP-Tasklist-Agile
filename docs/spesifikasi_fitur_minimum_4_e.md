> **Referensi File:** `01_Spesifikasi_Fitur_Minimum_4_E.docx`

# Spesifikasi Fitur Minimum

**Kelompok dan kelas:** Kelompok 4 / Kelas E  
**Modul atau proyek:** Modul E-4: Tasklist dan Eksekusi Agile — ERP Software PT. Anaheim Nimbus Universal  
**Penyusun dan reviewer:** Tubagus Muhammad Wildan (Project Manager)   
**Tanggal dan versi:** 2026-10-08 / v1.0  
**Pengumpulan:** Edlink sesuai tenggat yang ditentukan.  

---

## Tujuan dan Batas Modul

### Masalah Pengguna: 
1. Pengelolaan eksekusi tugas proyek belum terstruktur dan transparan, menyebabkan ketidakjelasan pelacakan hierarki pekerjaan (Modul -> Fitur -> Tugas).
2. Perhitungan progres pencapaian deliverable sering kali bias dan tidak akurat karena belum mengacu pada akumulasi riil jam kerja (man-hour) dari tugas yang telah tervalidasi selesai (Done).
3. Ketiadaan mekanisme kontrol persetujuan rilis tugas (Task Release) yang akuntabel antara Technical Lead (TL) dan Project Manager (PM), serta belum terstandarisasinya alur penanganan tugas yang gagal uji/rework ke tahap pengerjaan kembali.

### Alur Minimum Demo Minggu 8: 
1. TL/PM menyusun Modul proyek dan menambahkan Fitur (opsional), kemudian menginput Task baru dengan atribut bobot kompleksitas (Low/Medium/High), estimasi jam kerja (man-hour), dan tenggat acuan (H-1 sebelum due date).
2. TL dan PM melakukan evaluasi dan persetujuan rilis tugas secara terpisah (Dual-Approval) hingga status tugas resmi beralih dari DRAFT menjadi RELEASED.
3. Developer melihat tugas yang telah dirilis pada Papan Tugas Interaktif (Agile Board) dan menarik kartu tugas ke kolom DEVELOPMENT, kemudian memindahkannya ke CODE REVIEW dan TESTING.
4. Reviewer dan Tester mencatat hasil pemeriksaan secara manual; jika ditolak/ditemukan bug, kartu tugas otomatis dikembalikan ke DEVELOPMENT.
5. Jika lolos pengujian, PM mengisi ceklis verifikasi kelayakan dan TL menandatangani pengesahan akhir (Sign-off) sehingga tugas beralih ke status DONE.
6. Mesin kalkulasi sistem secara otomatis memperbarui persentase progres deliverable berbasis rasio akumulasi man-hour tugas Done terhadap total man-hour, serta menyediakan data tersebut melalui REST API untuk kebutuhan modul pelaporan dan pengawasan (E-5, D-3, D-4).

### Di Luar Cakupan: 
1. Sinkronisasi otomatis webhook atau integrasi API langsung ke kakas eksternal seperti GitLab/GitHub/Jira untuk code review dan pipeline CI/CD (diputuskan dicatat secara manual pada rilis awal sesuai keputusan mitra Q-10).
2. Penentuan otomatis sistem atas penanganan tugas yang belum tuntas di akhir siklus mingguan (weekly cycle rollover), melainkan menjadi wewenang keputusan manual PM (dilanjutkan atau diprioritaskan ulang sesuai Q-08).

---

## Daftar Fitur Minimum

| ID fitur | Nama dan aktor | Sumber kebutuhan | Prioritas dan alasan |
|---|---|---|---|
| FTR-K04-01 | Pengelolaan Hierarki Modul, Fitur, dan Tugas (Aktor: TL, PM) | SOP-05, WI-04, Q-13, BL-01 | Wajib (P0) - Fondasi struktur data utama dan prasyarat mutlak seluruh siklus eksekusi tugas |
| FTR-K04-02 | Pengisian Task Template & Parameter Estimasi Terstandarisasi (Aktor: TL) | SOP-07, WI-04, Q-01, Q-02, Q-11, BL-03 | Wajib (P0) - Menstandarkan acuan beban kerja, satuan man-hour, dan kepatuhan tenggat H-1 |
| FTR-K04-03 | Mekanisme Dual-Approval Persetujuan Rilis Tugas (Aktor: TL, PM) | L1-05, SOP-07, Q-04, BL-04 | Wajib (P0) - Menjamin tata kelola dan akuntabilitas sebelum tugas dikerjakan pengembang |
| FTR-K04-04 | Papan Tugas Interaktif / Agile Kanban Board (Aktor: Developer, TL, PM) | SOP-08, Q-05, BL-06 | Wajib (P0) - Visualisasi alur kerja 5 tahap (Released, Development, Code Review, Testing, Done) |
| FTR-K04-05 | Pencatatan Manual Code Review, Testing, & Alur Rework (Aktor: Reviewer, Tester) | SOP-08, Q-05, Q-10, BL-07 | Wajib (P0) - Pengendalian kualitas kode dan otomasi pengembalian kartu tugas gagal uji ke Development |
| FTR-K04-06 | Verifikasi Ceklis PM & Otorisasi Pengesahan Selesai oleh TL (Aktor: PM, TL) | SOP-08, Q-06, Q-07, BL-08 | Wajib (P0) - Gerbang final kepatuhan Definition of Done sebelum tugas diakui selesai |
| FTR-K04-07 | Mesin Kalkulasi Progres Deliverable & Penyediaan API Status (Aktor: Sistem ERP, Modul Eksternal) | WI-04, Q-03, BL-09 | Wajib (P0) - Integrasi data real-time untuk modul pelaporan (E-5) dan pengawasan proyek (D-3, D-4) |
| FTR-K04-08 | Pengaturan Perilaku Dependensi Antar-Tugas (Aktor: PM) | SOP-07, Q-09, BL-05 | Ditunda ke Sprint 2 (P1) - Memerlukan stabilitas alur kerja utama sebelum penerapan hard-block dependensi |
| FTR-K04-09 | Manajemen Tugas Sisa Akhir Siklus Mingguan / Rollover (Aktor: PM) | L1-05, Q-08, BL-10 | Ditunda ke Sprint 2 (P1) - Dijalankan secara prosedural manual pada siklus sprint awal |
| FTR-K04-10 | Penyesuaian Tugas Berjalan Berbasis Change Log / MoM (Aktor: PM) | SOP-06, WI-06, Q-12, BL-11 | Ditunda ke Sprint 2 (P1) - Menunggu kesiapan integrasi endpoint MoM dari modul D-3 |

---

## Hasil Review Kebutuhan

### Keputusan Dosen atau Mitra: 
Wawancara resmi dengan mitra (Ibu Yuril Salsabila - COO PT. Anaheim Nimbus Universal) pada 29 September 2026 menghasilkan ketetapan:
1. Q-01: Bobot tugas (Weight) didasarkan pada tingkat kompleksitas (Low, Medium, High).
2. Q-02: Satuan estimasi tugas (Estimate) wajib menggunakan jam kerja riil (man-hour).
3. Q-03: Formula progres deliverable dihitung dari: (Total man-hour tugas yang telah Done / Total man-hour seluruh tugas deliverable) x 100%.
4. Q-04: Persetujuan rilis tugas (Task Release) wajib disetujui oleh TL dan PM secara terpisah (Dual-Approval).
5. Q-05: Tugas yang gagal pada tahap code review atau testing otomatis dikembalikan ke tahap Development.
6. Q-06: Bukti penyelesaian tugas cukup divalidasi melalui ceklis verifikasi dari PM.
7. Q-07: Otoritas akhir pengesahan tugas menjadi Done berada di tangan TL.
8. Q-08: Penanganan tugas sisa di akhir siklus mingguan diputuskan secara manual oleh PM.
9. Q-09: Perilaku dependensi tugas (blokir atau peringatan) dapat dikonfigurasi secara fleksibel oleh PM.
10. Q-10: Hasil code review dan pengujian dicatat secara manual pada sistem ERP awal.
11. Q-11: Acuan tenggat Task Template adalah H-1 terhadap batas akhir deliverable/tugas.
12. Q-12: Penyesuaian scope/tugas aktif akibat Change Log dilakukan secara manual oleh PM.
13. Q-13: Hierarki struktur data mengikuti SOP-05 (Modul -> Fitur -> Tugas), dengan level Fitur bersifat opsional.

### Asumsi atau Pertanyaan Terbuka: 
Semua pertanyaan utama Q-01 sampai Q-13 telah ditutup (Closed/Approved) oleh mitra. Asumsi teknis yang berlaku saat ini adalah ketersediaan endpoint integrasi dari Modul F-1 (Autentikasi & Hak Akses) dan Modul D-1 (Registrasi Proyek) pada awal Sprint 2; selama Sprint 1 pengujian menggunakan API Contract Mocking.

---

## Rincian Satu Fitur

**Kelompok:** Kelompok 4 / Kelas E | **Modul:** E-4: Tasklist dan Eksekusi Agile | **Versi:** v1.0  
**ID dan nama fitur:** FTR-K04-03 Mekanisme Dual-Approval Persetujuan Rilis Tugas  
**Kebutuhan pengguna:** Sebagai TL dan PM, kami dapat menyetujui rilis tugas secara independen agar tugas yang masuk ke siklus pengerjaan terjamin kelayakan teknis dan ketersediaan anggarannya.  
**Pemilik dan reviewer:** Tubagus Muhammad Wildan (PM) & Fajri (BE) / Fauzan (SA)  
**Prasyarat dan hak akses:** Pengguna telah diautentikasi dengan peran `TECHNICAL_LEAD` atau `PROJECT_MANAGER`. Tugas berada pada status `DRAFT` dan parameter estimasi man-hour serta bobot telah terisi lengkap.  

### Kriteria Penerimaan

| Kondisi awal | Tindakan pengguna | Hasil yang diharapkan |
|---|---|---|
| Tugas berstatus DRAFT, kedua persetujuan masih PENDING | TL atau PM menekan tombol 'Setujui Rilis' pada antarmuka rilis tugas | Sistem mencatat timestamp, ID approver, dan mengubah status persetujuan pihak tersebut menjadi APPROVED. Status tugas tetap DRAFT jika baru satu pihak yang menyetujui. |
| Salah satu pihak telah APPROVED, pihak lainnya melakukan persetujuan | Pihak kedua (TL atau PM) menekan tombol 'Setujui Rilis' | Sistem memvalidasi kelengkapan kedua persetujuan, mengubah status tugas menjadi RELEASED, dan menerbitkan kartu tugas ke kolom Released pada Agile Board. |
| Salah satu pihak menolak rilis tugas | TL atau PM menekan tombol 'Tolak Rilis' dan menginput catatan penolakan | Status persetujuan menjadi REJECTED, status tugas kembali terkunci di DRAFT dengan notifikasi catatan revisi kepada pembuat tugas. |
| Pengguna dengan peran DEVELOPER mencoba menekan endpoint approval | Mengirim request persetujuan via API atau tombol UI | Sistem menolak aksi dengan respon HTTP 403 Forbidden: 'Akses ditolak. Hanya peran Technical Lead dan Project Manager yang berwenang memberikan persetujuan rilis'. |

**UI dan data terkait:** Layar UI-K04-01 (Tasklist & Approval View); Entitas ENT-K04-03 (tasks), ENT-K04-04 (task_approvals)  
**Dependensi:** Modul F-1 (Autentikasi & Verifikasi Peran). Rencana mock JWT token disiapkan untuk pengujian lokal.  
**Tugas sprint berikutnya:** Implementasi skema tabel `task_approvals`, endpoint `POST /api/v1/tasks/{taskId}/approvals`, dan UI toggle approval. Pemilik: Fajri (BE) & Ariel (FE). Tenggat: Sprint 1 (2026-10-15).

---

## Rincian Satu Fitur (2)

**Kelompok:** Kelompok 4 / Kelas E | **Modul:** E-4: Tasklist dan Eksekusi Agile | **Versi:** v1.0  
**ID dan nama fitur:** FTR-K04-04 Papan Tugas Interaktif / Agile Kanban Board  
**Kebutuhan pengguna:** Sebagai Developer, TL, dan PM, kami dapat memantau serta memindahkan kartu tugas antar kolom tahapan kerja secara interaktif agar transparansi progres pengerjaan terjaga secara real-time.  
**Pemilik dan reviewer:** Ariel (FE) & Valdric (UI/UX) / Tubagus Muhammad Wildan (PM)  
**Prasyarat dan hak akses:** Tugas telah berstatus minimal RELEASED. Pengguna memiliki token otentikasi aktif dengan peran `DEVELOPER`, `TECHNICAL_LEAD`, atau `PROJECT_MANAGER`.  

### Kriteria Penerimaan

| Kondisi awal | Tindakan pengguna | Hasil yang diharapkan |
|---|---|---|
| Tugas berstatus RELEASED pada kolom papan | Developer menarik (drag-and-drop) kartu tugas dari kolom Released Task ke Development | Status tugas berubah menjadi DEVELOPMENT, sistem mencatat waktu mulai pengerjaan, dan kartu tugas tampil aktif pada kolom Development dengan label PIC. |
| Tugas berada pada kolom DEVELOPMENT dan pengerjaan selesai | Developer memindahkan kartu tugas ke kolom CODE REVIEW | Status tugas beralih ke CODE_REVIEW, kartu berpindah kolom, dan notifikasi penugasan review muncul bagi reviewer yang ditunjuk. |
| Kartu tugas berada di kolom CODE REVIEW atau TESTING | Reviewer/Tester memilih aksi 'Reject / Kembalikan' karena ada temuan bug | Kartu tugas secara otomatis dipindahkan kembali ke kolom DEVELOPMENT dengan indikator tag 'Rework/Revisi'. |
| Pengguna belum memilih PIC pengembang saat memindahkan ke Development | Developer mencoba menarik kartu tanpa menetapkan assignee | Sistem memunculkan dialog peringatan: 'Tentukan pelaksana (assignee) sebelum memulai development'. Kartu kembali ke posisi semula. |

**UI dan data terkait:** Layar UI-K04-03 (Agile Kanban Board); Entitas ENT-K04-03 (tasks)  
**Dependensi:** Tidak ada (internal FE dan BE modul E-4).  
**Tugas sprint berikutnya:** Pembuatan komponen visual Kanban 5 kolom, integrasi REST API update status task, dan state handler drag-and-drop. Pemilik: Ariel (FE) & Valdric (UI/UX). Tenggat: Sprint 1 (2026-10-15).

---

## Rincian Satu Fitur (3)

**Kelompok:** Kelompok 4 / Kelas E | **Modul:** E-4: Tasklist dan Eksekusi Agile | **Versi:** v1.0  
**ID dan nama fitur:** FTR-K04-06 Verifikasi Ceklis PM & Otorisasi Pengesahan Selesai oleh TL  
**Kebutuhan pengguna:** Sebagai PM dan TL, kami dapat memvalidasi ceklis kriteria penyelesaian dan mengesahkan penutupan tugas agar tugas yang berstatus DONE terjamin kualitas dan keabsahannya.  
**Pemilik dan reviewer:** Tubagus Muhammad Wildan (PM) & Fauzan (SA) / Fajri (BE)  
**Prasyarat dan hak akses:** Tugas berada pada kolom TESTING dan hasil pengujian telah dinyatakan Pass/Lolos oleh Tester.  

### Kriteria Penerimaan

| Kondisi awal | Tindakan pengguna | Hasil yang diharapkan |
|---|---|---|
| Pengujian tugas telah Lolos (Pass) | PM membuka modal detail penyelesaian tugas dan menandai seluruh item pada ceklis verifikasi | Field `is_pm_verified` bernilai `true`, sistem mencatat timestamp verifikasi PM, dan tombol 'Otorisasi Done' pada akun TL menjadi aktif. |
| Ceklis verifikasi PM telah lengkap (`is_pm_verified = true`) | TL menekan tombol 'Otorisasi Selesai / Sign-off Done' | Field `is_tl_signed` bernilai `true`, status tugas resmi beralih ke DONE, kartu tugas berpindah ke kolom Done, dan sistem memicu kalkulasi ulang progres deliverable. |
| Ceklis verifikasi PM belum dicentang lengkap | TL mencoba menekan tombol pengesahan Done | Tombol dinonaktifkan (disabled) atau sistem menampilkan validasi error: 'Verifikasi ceklis PM wajib dipenuhi sebelum TL dapat mengesahkan tugas menjadi Done'. |
| Pengguna tanpa peran TL mencoba mengeksekusi sign-off | Mengirim request PATCH sign-off via endpoint | Sistem merespon dengan HTTP 403 Forbidden: 'Hanya peran Technical Lead yang berwenang melakukan final sign-off penutupan tugas'. |

**UI dan data terkait:** Layar UI-K04-04 (Modal Review, Testing & Sign-off); Entitas ENT-K04-03 (tasks), ENT-K04-06 (task_review_logs)  
**Dependensi:** Modul F-1 (Otorisasi peran pengguna).  
**Tugas sprint berikutnya:** Implementasi endpoint `PATCH /api/v1/tasks/{taskId}/sign-off-done`, integrasi validasi dual-gate ceklis PM dan otorisasi TL. Pemilik: Fajri (BE) & Tubagus (PM). Tenggat: Sprint 1 (2026-10-15).

---

## Rincian Satu Fitur (4)

**Kelompok:** Kelompok 4 / Kelas E | **Modul:** E-4: Tasklist dan Eksekusi Agile | **Versi:** v1.0  
**ID dan nama fitur:** FTR-K04-07 Mesin Kalkulasi Progres Deliverable & Penyediaan API Status  
**Kebutuhan pengguna:** Sebagai Sistem ERP dan modul pengawas (E-5, D-3, D-4), sistem dapat mengkalkulasi progres deliverable secara matematis dan menyediakan endpoint data status pekerjaan agar pemantauan proyek akurat.  
**Pemilik dan reviewer:** Fajri (BE) & Fauzan (SA) / Tubagus Muhammad Wildan (PM)  
**Prasyarat dan hak akses:** Terdapat modul, deliverable, dan tugas-tugas terdaftar dengan atribut estimasi man-hour valid pada proyek bersangkutan.  

### Kriteria Penerimaan

| Kondisi awal | Tindakan pengguna | Hasil yang diharapkan |
|---|---|---|
| Sebuah tugas berhasil disahkan menjadi DONE | TL menyelesaikan proses pengesahan tugas Done | Mesin kalkulasi otomatis menghitung rasio: `(Total estimasi man-hour tugas Done / Total estimasi man-hour seluruh tugas deliverable) * 100%`, lalu memperbarui nilai `progress_percentage` deliverable terkait. |
| Klien/layanan eksternal mengirim request GET dengan JWT token valid | Modul E-5 memanggil `GET /api/v1/projects/{projectId}/deliverable-progress` | Sistem merespon dengan HTTP 200 OK berisi payload JSON: `totalTasks`, `completedTasks`, `totalEstimatedManHours`, `completedManHours`, dan `progressPercentage`. |
| Deliverable belum memiliki tugas yang didaftarkan | Modul pemantau memanggil endpoint progres deliverable | Sistem mengembalikan nilai `progressPercentage: 0.00` tanpa terjadi pembagian dengan nol (division by zero error). |
| Permintaan API dikirim tanpa header Authorization valid | Pihak luar mengakses endpoint tanpa menyertakan Bearer Token | Sistem menolak permintaan dengan respon HTTP 401 Unauthorized. |

**UI dan data terkait:** Layar UI-K04-01 (Indikator Progress Bar); Entitas ENT-K04-01 (modules), ENT-K04-03 (tasks); Kontrak API API-K04-01.  
**Dependensi:** Disediakan untuk konsumsi modul E-5, D-3, dan D-4.  
**Tugas sprint berikutnya:** Implementasi event listener `onTaskDone`, service class kalkulasi persentase progres, dan endpoint REST API API-K04-01. Pemilik: Fajri (BE) & Fauzan (SA). Tenggat: Sprint 1 (2026-10-15).

---

## Checklist Review Dosen
- [ ] Sumber dan batas fitur jelas, serta aktor memperoleh manfaat yang disebutkan.
- [ ] Alur berhasil dan penolakan memiliki kriteria yang dapat diuji.
- [ ] Pemilik tugas, referensi UI/data, dan dependensi tercatat.