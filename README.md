<div align="center">
  <img src="https://qris.zakki.store/icon.webp" width="120" alt="Zakki Store Logo" style="border-radius: 20px; box-shadow: 0 8px 24px rgba(0,0,0,0.12);">
  <h1>🔌 Zakkistore SDK</h1>
  <p><b>Node.js Official B2B Client Library</b></p>

  [![Zakki Store Web Docs](https://img.shields.io/badge/ZAKKI%20STORE-WEB%20DOCS-6C5CE7?style=for-the-badge&logo=gitbook&logoColor=white)](https://qris.zakki.store)
  [![WhatsApp](https://img.shields.io/badge/WHATSAPP-CHAT%20SUPPORT-25D366?style=for-the-badge&logo=whatsapp&logoColor=white)](https://wa.me/6283844082339)
  [![Telegram](https://img.shields.io/badge/TELEGRAM-DEV%20CONTACT-2CA5E0?style=for-the-badge&logo=telegram&logoColor=white)](https://t.me/zakki_store)
</div>

`zakkistore-sdk` adalah pustaka klien Node.js resmi yang dirancang untuk mempermudah integrasi sistem Host-to-Host (H2H) produk prabayar/pascabayar, gerbang pembayaran (Payment Gateway QRIS), layanan perbankan (Virtual Account & Transfer), sistem penambangan koin (Mining), serta layanan OTP nomor virtual (Noktel) Zakki Store ke dalam aplikasi Anda.

> [!NOTE]
> **🚀 Hubungi Developer untuk Akses API & Whitelist IP:**
> Pendaftaran IP partner B2B, pembukaan whitelist, atau keluhan error `[IP BLOCKED / UNREGISTERED]` dapat diselesaikan secara instan dengan menghubungi tim Developer Zakki Store via tombol **WhatsApp** atau **Telegram** di atas.

---

## 🚀 Instalasi & Inisialisasi

Untuk menggunakan SDK di dalam project Node.js Anda:

```javascript
const ZakkiStore = require('./sdk/index');

// Inisialisasi SDK dengan parameter konfigurasi
const zakki = new ZakkiStore({
    baseUrl: 'https://qris.zakki.store',     // URL API Server Zakki Store Resmi
    token: 'fake_api_token_abc123xyz',        // Token API member Anda
    iduser: 'IBO99',                          // ID User member Anda
    email: 'b2b_partner@example.com',         // Email terdaftar
    pin: '123456',                            // PIN transaksi (wajib untuk tarik & tabung)
    autoWithdraw: true                        // SET TRUE: Aktifkan penarikan saldo bank otomatis ke saldo apk!
});
```

---

## 🛠️ Dukungan Kompatibilitas Multi-Modul (CJS, ESM, & TypeScript)

SDK ini didesain menggunakan arsitektur modern berkinerja tinggi, sangat ramah bagi pengembang, serta mendukung penuh berbagai macam lingkungan kerja JavaScript populer saat ini:

### 1. CommonJS (CJS) - Node.js Tradisional
Sangat kompatibel untuk backend Express.js lama, bot Whatsapp/Telegram, maupun skrip server backend konvensional.
```javascript
const ZakkiStore = require('zakkistore-sdk');

const zakki = new ZakkiStore({ ... });
```

### 2. ES Modules (ESM) - Node.js Modern
Mendukung penuh framework Node.js terbaru dengan `"type": "module"` di `package.json` atau skrip berbasis berkas `.mjs`.
```javascript
import ZakkiStore from 'zakkistore-sdk';

const zakki = new ZakkiStore({ ... });
```

### 3. TypeScript (TS) & Bundlers (Vite/Next.js/Webpack)
Dilengkapi dengan berkas deklarasi tipe data bawaan secara resmi (`index.d.ts`), menyajikan fitur **100% Autocomplete & Intellisense**, deskripsi hover fungsi, serta validasi tipe data statis demi mempercepat waktu pengembangan.
```typescript
import ZakkiStore from 'zakkistore-sdk';

const zakki = new ZakkiStore({
    baseUrl: 'https://qris.zakki.store',
    token: 'token_api_member',
    iduser: 'IBO99',
    email: 'member@gmail.com',
    pin: '123456',
    autoWithdraw: true
});
```

---

## 🌐 Arsitektur Fleksibel untuk Pembangunan Web Topup Otomatis

Pustaka `zakkistore-sdk` dirancang serbaguna dan fleksibel, menjadikannya pilihan ideal tidak hanya untuk bot pesan instan (WhatsApp & Telegram), melainkan juga sebagai mesin backend utama platform **Web Topup Saldo / Store Layanan Game (H2H)** milik Anda.

> [!CAUTION]
> ### 🛡️ PANDUAN PENTING KEAMANAN API UNTUK WEB TOPUP:
> Jangan pernah menginstansiasi SDK dan menyertakan token API Anda langsung di **sisi klien / browser publik (Client-side frontend)** pada aplikasi web Anda (seperti memanggilnya langsung di React, Vue, Svelte, atau berkas Javascript HTML biasa).
> - **⚠️ Bahaya Keamanan:** Token API Rahasia (`token`) dan PIN transaksi Anda akan mudah terlihat secara transparan oleh publik melalui tab *Network Inspector* browser, memungkinkan pihak luar mencuri seluruh saldo Anda.
> - **✅ Rekomendasi Solusi Keamanan:**
>   Selalu pasang dan jalankan SDK ini di **sisi server backend** Anda:
>   - **Next.js:** Integrasikan SDK di dalam rute API (`pages/api/*` atau `app/api/*`).
>   - **Nuxt.js / SvelteKit:** Gunakan di dalam berkas server endpoints.
>   - **Express.js / NestJS:** Panggil SDK di dalam Controller/Service server mandiri.
>   
>   *Buatkan rute jembatan khusus (contoh: `/api/pay-qris`) dari frontend web Anda yang mengarah ke server backend Anda secara terenkripsi.*

---

## 📑 Daftar Referensi Metode Lengkap & Struktur Pengelompokan (37 Fungsi Resmi)

Seluruh fungsi yang didukung oleh SDK ini dikelompokkan secara rapi ke dalam 7 kategori layanan utama demi mempermudah pemahaman dan integrasi:

### 1. ⚡ Layanan Payment Gateway (QRIS Topup) — [5 Fungsi]
*   **`await zakki.topup(nominal)`** — Membuat tiket pembayaran QRIS dinamis instan dengan nominal kode unik.
*   **`await zakki.cektopup(idtopup)`** — Mengecek status pembayaran tiket QRIS tertentu secara real-time.
*   **`zakki.cektopup2(idtopup)`** — Mendapatkan URL gambar struk digital dinamis (hologram receipt) berformat PNG.
*   **`await zakki.mytopup()`** — Mengambil seluruh riwayat transaksi topup QRIS akun Anda.
*   **`await zakki.cancel(id_transaksi, all_pending)`** — Membatalkan satu atau seluruh tiket topup pending.

### 2. 🏪 Layanan Transaksi Host-to-Host (H2H) — [4 Fungsi]
*   **`await zakki.listkode(jenis, product_type)`** — Mengambil katalog produk prabayar/pascabayar aktif beserta daftar harga beli.
*   **`await zakki.h2h(kode, tujuan, refID)`** — Mengirimkan order transaksi H2H (pulsa, paket data, PLN kustom, dll).
*   **`await zakki.cekh2h(id_trx)`** — Mengecek status transaksi, Serial Number (SN), dan harga beli riil dari order H2H.
*   **`await zakki.myh2h()`** — Mengambil 20 riwayat transaksi H2H terupdate milik akun Anda.

### 3. 🏦 Layanan Perbankan & Transfer Saldo VA — [8 Fungsi]
*   **`await zakki.checkbank()`** — Memeriksa detail Virtual Account (VA), saldo bank VA, serta memicu Auto-Withdraw jika diaktifkan.
*   **`await zakki.checkname(number)`** — Memverifikasi nama asli pemilik rekening Virtual Account tujuan sebelum melakukan transfer.
*   **`await zakki.transfer(to, amount)`** — Mengirimkan saldo antar-VA member secara instan dan bebas biaya admin.
*   **`await zakki.tabung(jumlah)`** — Menyetorkan saldo aktif aplikasi ke rekening bank Virtual Account terhubung Anda.
*   **`await zakki.tarik(jumlah)`** — Menarik dana dari bank Virtual Account ke saldo aktif aplikasi Zakki Store Anda.
*   **`await zakki.checkmutasi(mutasi_type)`** — Melihat riwayat mutasi tabung/tarik saldo bank VA (`all`, `tarik`, `tabung`).
*   **`await zakki.checktransfer(idtransfer)`** — Mengecek status pengiriman dana transfer tertentu secara detail.
*   **`await zakki.mytransfer(type)`** — Mengambil riwayat pengiriman dan penerimaan transfer saldo (`all`, `kirim`, `terima`).

### 4. 📱 Layanan Noktel Marketplace (OTP Virtual) — [5 Fungsi]
*   **`await zakki.noktelStok()`** — Memeriksa ketersediaan stok nomor virtual aktif per kategori layanan/aplikasi.
*   **`await zakki.noktelBuy(category)`** — Membeli nomor virtual baru untuk penerimaan kode verifikasi/OTP.
*   **`await zakki.noktelGetOtp(account_id)`** — Mengambil kode verifikasi/OTP yang masuk ke nomor virtual secara real-time.
*   **`await zakki.noktelCancel(invoice_id)`** — Membatalkan order nomor virtual yang pending OTP dan memicu auto-refund saldo.
*   **`await zakki.noktelHistory()`** — Mengambil daftar riwayat lengkap pemesanan nomor virtual.

### 5. ⛏️ Layanan Reward Komputasi SHA-256 (Mining) & Game — [5 Fungsi]
*   **`await zakki.miningStart()`** — Meminta challenge penambangan SHA-256 serta target kesulitan (difficulty) dari server.
*   **`await zakki.miningSubmit(nonce, signature)`** — Mengirimkan hasil kerja hashing SHA-256 (Proof-of-Work) untuk mendapatkan koin.
*   **`await zakki.cekmining(idmining)`** — Mengecek status audit dan persetujuan dari blok mining yang telah Anda selesaikan.
*   **`await zakki.mymining()`** — Melihat riwayat penambangan koin dan total reward hashing akun Anda.
*   **`await zakki.cekgacha()`** — Mengecek jumlah tiket gacha, riwayat kemenangan, dan detail koin keberuntungan Anda.

### 6. 🔒 Layanan Keamanan IP & Utilitas — [6 Fungsi]
*   **`await zakki.whitelistip(ip)`** — Mendaftarkan IP server/host Anda agar diizinkan melakukan transaksi H2H via API (Maksimal 3 IP).
*   **`await zakki.delwhitelistip(ip)`** — Menghapus alamat IP terdaftar dari whitelist API.
*   **`await zakki.cekmyip()`** — Mendeteksi alamat IP publik host/server Anda saat ini yang terbaca oleh sistem.
*   **`await zakki.cekip(ip)`** — Mengecek detail status IP whitelisting tertentu.
*   **`await zakki.leaderboard(limit, period)`** — Melihat daftar Sultan topup teraktif secara global.
*   **`await zakki.status()`** — Memeriksa beban CPU server, statistik finansial global, dan kesehatan sistem.

### 7. 🔗 Layanan Webhook Callback & Notifikasi Bot — [4 Fungsi]
*   **`await zakki.setcallback(site)`** — Memasang URL callback real-time untuk menerima laporan status transaksi H2H.
*   **`await zakki.delcallback()`** — Menghapus URL callback yang terpasang di sistem.
*   **`await zakki.setnotifbot(telegramId)`** — Memasang ID Telegram Anda untuk menerima notifikasi otomatis transaksi sukses/gagal.
*   **`await zakki.delnotifbot()`** — Menonaktifkan bot notifikasi Telegram.


