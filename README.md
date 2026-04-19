# QR Label Printer — SVLK

Aplikasi desktop untuk mencetak label QR Code SVLK (Sistem Verifikasi Legalitas Kayu) secara massal. Dibangun dengan Electron + React + Vite.

![Platform](https://img.shields.io/badge/platform-Windows-blue)
![Version](https://img.shields.io/badge/version-1.0.0-green)

---

## Fitur

- **Upload data** dari file Excel (`.xlsx`) atau CSV — kolom wajib: `id_barcode`
- **Mode PHL / Non-PHL** — label menyesuaikan otomatis (logo SVLK & kode PHL tampil/hilang)
- **Print Preview** lengkap dengan:
  - Pilih ukuran kertas (A4, A5, Letter, F4/Folio, Custom dalam inch)
  - Atur margin (mm)
  - Zoom preview
  - Pilih printer yang terpasang
  - Jumlah salinan
  - Pilih label yang ingin dicetak via daftar + search
- **Data persisten** — nama perusahaan, kode PHL, dan daftar barcode tersimpan otomatis
- **Drag & drop** file langsung ke area upload

---

## Download & Instalasi

1. Buka halaman [Releases](https://github.com/herlanmap/qr-label-printer/releases)
2. Unduh file:
   - **`QR Label Printer Setup 1.0.0.exe`** — installer (direkomendasikan)
   - **`QR Label Printer 1.0.0.exe`** — portable (tanpa instalasi)
3. Jalankan installer dan ikuti langkah-langkah instalasi
4. Buka aplikasi dari Start Menu atau Desktop

---

## Cara Penggunaan

### 1. Persiapan File Data

Buat file Excel (`.xlsx`) atau CSV dengan kolom **`id_barcode`**:

| id_barcode |
|------------|
| ABC-001-2024 |
| ABC-002-2024 |
| ABC-003-2024 |

### 2. Input Data

1. Isi **Nama Perusahaan** (akan tampil di label)
2. Pilih mode **Label PHL** atau **Label Non-PHL** menggunakan toggle switch
   - Mode PHL: isi **Kode PHL**, label menyertakan logo SVLK dan kode PHL
   - Mode Non-PHL: label tanpa logo SVLK dan kode PHL
3. Upload file dengan klik area upload atau **seret file** ke dalamnya
4. Klik **🖨 Print Labels**

### 3. Print Preview

Setelah klik Print Labels, jendela preview terbuka:

| Pengaturan | Keterangan |
|---|---|
| **Printer** | Pilih printer yang terpasang |
| **Kertas** | A4 / A5 / Letter / F4 / Custom (inch) |
| **Margin** | Jarak tepi halaman (mm) |
| **Salinan** | Jumlah cetakan |
| **Zoom** | Perbesar/perkecil tampilan preview |

**Memilih label:**
- Sidebar kiri menampilkan daftar semua barcode
- Klik baris untuk centang/uncentang
- Gunakan kotak pencarian untuk filter barcode
- Tombol **Semua** / **Hapus** untuk pilih massal
- Label bisa juga diklik langsung di area preview

Klik **🖨 Print (N)** untuk mencetak langsung ke printer tanpa dialog tambahan.

---

## Format Label

Label berukuran **76.2 × 76.2 mm** (3×3 inch), berisi:

- Logo Kementerian Kehutanan Republik Indonesia
- Nama Perusahaan
- 3 QR Code (kiri, tengah, kanan) dengan nilai `id_barcode`
- Teks ID barcode
- *(Mode PHL)* Logo SVLK Indonesia + Kode PHL

---

## Development

### Prasyarat

- Node.js 18+
- npm

### Menjalankan di mode development

```bash
npm install
npm run electron:dev
```

### Build installer

```bash
npm run electron:build
```

Output tersimpan di folder `release/`.

---

## Struktur Project

```
├── electron/
│   ├── main.js        # Main process Electron
│   └── preload.js     # Context bridge API
├── public/
│   ├── logo-kemenhut.jpg
│   ├── svlk-indonesia.jpg
│   └── icon.png
├── src/
│   ├── components/
│   │   ├── InputForm.jsx    # Form input utama
│   │   ├── LabelCard.jsx    # Komponen label QR
│   │   ├── PrintArea.jsx    # Area cetak (hidden on screen)
│   │   └── PrintPreview.jsx # Jendela print preview
│   ├── App.jsx
│   ├── index.css
│   └── main.jsx
└── package.json
```

---

## Lisensi

Proyek ini dibuat untuk keperluan internal verifikasi SVLK.
