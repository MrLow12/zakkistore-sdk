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

## 📑 Daftar Referensi Metode Lengkap & Struktur Output

Berikut adalah seluruh **22 fungsi resmi** yang didukung secara penuh oleh SDK beserta struktur respons JSON asli yang dikembalikan oleh API Server:

---

### 1. ⚡ Layanan Payment Gateway (QRIS Topup)

> [!TIP]
> **💡 Mengapa Memilih Payment Gateway QRIS Zakki Store?**
> - **⚡ Instant Settlement & Callback Real-time:** Setiap pembayaran QRIS diproses secara otomatis dalam milidetik. Begitu dana ditransfer oleh konsumen, saldo Anda langsung bertambah detik itu juga.
> - **🛡️ Sistem Validasi Kode Unik Berakurasi Tinggi:** Transaksi diverifikasi otomatis menggunakan nominal pencocokan kode unik tiga angka di akhir (contoh: nominal Rp 5.000 menjadi Rp 5.182), mencegah potensi kecurangan serta meniadakan proses verifikasi struk transfer manual.
> - **🧩 Fleksibilitas Integrasi Frontend Maksimal:** Server tidak hanya mengembalikan tautan gambar QR (`qris_image`), melainkan juga payload teks mentah (`qris_content` / raw string QRIS). Ini memberi Anda fleksibilitas luar biasa untuk merender QR code secara lokal di web/aplikasi Anda menggunakan pustaka Canvas, SVG, atau kustomisasi UI visual lainnya.
> - **💸 Bebas Setup Fee & Biaya Pemeliharaan:** Layanan gerbang pembayaran kelas enterprise ini dapat digunakan secara cuma-cuma tanpa ada biaya langganan bulanan tersembunyi bagi partner B2B.

#### A. Membuat Transaksi QRIS (`topup`)
Membuat QRIS dinamis untuk pembayaran atau pengisian saldo secara instan dan otomatis.
- **Sintaks:** `zakki.topup(nominal)`
- **Contoh:**
  ```javascript
  const res = await zakki.topup(5000);
  ```
- **Struktur Output JSON Sukses (`code 201`):**
  ```json
  {
    "code": 201,
    "status": "success",
    "message": "Silakan bayar sesuai TOTAL dalam 5 menit.",
    "data": {
      "id_transaksi": "topup-0a1b2c3d-IBO99",
      "rincian": {
        "nominal_request": 5000,
        "kode_unik": 182,
        "total_bayar": 5182
      },
      "expired_at": "2026-05-31T17:15:00.000Z",
      "qris_image": "https://qris.zakki.store/images/qris_sample.png",
      "qris_content": "00020101021226670016COM.NOBUBANK.WWW...",
      "cancel_url": "https://qris.zakki.store/cancel?id_transaksi=topup-0a1b2c3d-IBO99",
      "cektopup_url": "https://qris.zakki.store/cektopup?idtopup=topup-0a1b2c3d-IBO99",
      "petunjuk_cek": "Simpan ID 'topup-0a1b2c3d-IBO99' untuk cek status nanti."
    }
  }
  ```

#### B. Cek Status Pembayaran QRIS (`cektopup`)
Memeriksa status pembayaran dari ID topup QRIS.
- **Sintaks:** `zakki.cektopup(idtopup)`
- **Contoh:**
  ```javascript
  const res = await zakki.cektopup('topup-0a1b2c3d-IBO99');
  ```
- **Struktur Output JSON (`code 200`):**
  ```json
  {
    "code": 200,
    "status": "found",
    "kategori_status": "SUCCESS",
    "message": "Transaksi ditemukan di Riwayat SUCCESS.",
    "file_id": "topup-0a1b2c3d-IBO99",
    "data": {
      "id_transaksi": "topup-0a1b2c3d-IBO99",
      "id_user": "IBO99",
      "tipe": "TOPUP",
      "nominal_asli": 5000,
      "kode_unik": 182,
      "nominal_total": 5182,
      "status": "SUCCESS",
      "created_at": "2026-05-31T17:10:00.000Z",
      "expired_at": "2026-05-31T17:15:00.000Z",
      "BotNotif": "Sukses"
    }
  }
  ```

#### C. Membatalkan & Mengecek Transaksi Pending (`cancel`)
Fungsi `cancel` pada API nyata memiliki **3 Mode Operasi** yang sangat dinamis berdasarkan parameter yang dikirimkan:

- **Sintaks:** `zakki.cancel(id_transaksi, all)`
- **Parameter:**
  - `id_transaksi` (String|null): ID transaksi spesifik (bisa ID penuh `'topup-0a1b2c3d-IBO99'` atau cukup ID tengahnya saja `'0a1b2c3d'`).
  - `all` (Boolean): Jika `true`, membatalkan semua transaksi pending.

---

##### 🔹 MODE 1: Cek & Dapatkan Daftar Transaksi Pending Aktif (List Pending)
Jika Anda **tidak mengirimkan** `id_transaksi` dan mengisi parameter `all` sebagai `false` (atau mengosongkan keduanya).
- **Contoh Penggunaan:**
  ```javascript
  const res = await zakki.cancel(); // Mengambil daftar transaksi pending aktif
  ```
- **Struktur Output JSON (`code 200`):**
  ```json
  {
    "code": 200,
    "status": "success",
    "message": "Berhasil memuat daftar transaksi pending aktif.",
    "pending_list": [
      {
        "id_transaksi": "topup-0a1b2c3d-IBO99",
        "total_bayar": 5182,
        "expired_at": "2026-05-31T17:15:00.000Z",
        "qris_image": "https://qris.zakki.store/images/qris_sample.png"
      }
    ]
  }
  ```

##### 🔹 MODE 2: Membatalkan Transaksi Tertentu (Specific Cancel)
Jika Anda mengisi `id_transaksi` (bisa ID penuh atau hanya bagian tengah UUID uniknya), dan `all` bernilai `false`.
- **Contoh Penggunaan:**
  ```javascript
  // Membatalkan transaksi tertentu secara spesifik
  const res = await zakki.cancel('topup-0a1b2c3d-IBO99'); 
  // Atau menggunakan UUID tengah saja (sistem backend akan otomatis mencarikan filenya):
  const res = await zakki.cancel('0a1b2c3d');
  ```
- **Struktur Output JSON (`code 200`):**
  ```json
  {
    "code": 200,
    "status": "success",
    "message": "Transaksi pending 'topup-0a1b2c3d-IBO99' berhasil dihapus."
  }
  ```

##### 🔹 MODE 3: Membatalkan Semua Transaksi Pending Sekaligus (Mass Cancel)
Membatalkan seluruh transaksi pending sekaligus secara praktis.
- **Contoh Penggunaan:**
  ```javascript
  const res = await zakki.cancel(true); // Membatalkan masal seluruh transaksi pending
  ```
- **Struktur Output JSON (`code 200`):**
  ```json
  {
    "code": 200,
    "status": "success",
    "message": "Berhasil membatalkan 3 transaksi pending."
  }
  ```

---

### 🛒 2. Layanan Transaksi H2H (Host-to-Host)

#### A. Membuka Katalog Produk (`listkode`)
Mencari daftar kode produk aktif, rincian keterangan, dan harga termurah.
- **Sintaks:** `zakki.listkode(jenis, type)`
- **Contoh:**
  ```javascript
  const res = await zakki.listkode('pulsa', 'telkomsel');
  ```
- **Struktur Output JSON (`code 200`):**
  ```json
  {
    "code": 200,
    "status": "success",
    "data": [
      {
        "kode": "S5",
        "produk": "Telkomsel",
        "keterangan": "Telkomsel Rp 5.000",
        "harga": 5350,
        "kategori": "Pulsa Reguler",
        "status": "1",
        "active": true
      },
      {
        "kode": "S10",
        "produk": "Telkomsel",
        "keterangan": "Telkomsel Rp 10.000",
        "harga": 10250,
        "kategori": "Pulsa Reguler",
        "status": "1",
        "active": true
      }
    ]
  }
  ```

#### B. Mengirim Order Transaksi (`h2h`)
Melakukan pengiriman pembelian pulsa, paket kuota, token, atau pembayaran tagihan pascabayar.
- **Sintaks:** `zakki.h2h({ kode, tujuan, refID })`
- **Contoh:**
  ```javascript
  const res = await zakki.h2h({
      kode: 'S5',
      tujuan: '081234567890',
      refID: 'PARTNER-TRX-00199'
  });
  ```
- **Struktur Output JSON (`code 200`):**
  ```json
  {
    "code": 200,
    "status": "success",
    "message": "Transaksi H2H diproses.",
    "data": {
      "id_transaksi": "H2H-20260531-99882",
      "refID": "PARTNER-TRX-00199",
      "kode_produk": "S5",
      "tujuan": "081234567890",
      "status": "PROCESS",
      "harga": 5350
    }
  }
  ```

> [!IMPORTANT]
> **💡 DUAL-FLOW TRANSAKSI PASCABAYAR (CEK vs BAYAR TAGIHAN):**
> Layanan Pascabayar H2H (seperti PLN Tagihan, BPJS, PDAM, Indihome) menggunakan alur dua langkah yang sangat aman dan presisi:
> 
> 1. **Langkah 1: Cek Tagihan / Inquiry (Lookup)**
>    Gunakan kode produk cek/inquiry (biasanya berawalan `INQ`, `REV`, atau `C`, contoh: `INQPLN`). Pada langkah ini, **cukup kirimkan ID Pelanggan saja** pada parameter `tujuan`.
>    *   *Contoh:* `zakki.h2h({ kode: 'INQPLN', tujuan: '122345678901', refID: 'TRX-01' })` -> *Mengembalikan jumlah tagihan asli dari server.*
> 
> 2. **Langkah 2: Eksekusi Pembayaran Tagihan (Payment)**
>    Setelah mendapatkan jumlah nominal tagihan asli dari Langkah 1 (contoh: `Rp 125.000`), untuk mengeksekusi pembayaran resmi, Anda **wajib** menggabungkan ID Pelanggan dengan nominal tagihan tersebut menggunakan pemisah titik: **`[ID_Pelanggan].[Nominal_Tagihan]`** agar pemotongan saldo aman dan akurat di awal.
>    *   *Contoh:* `zakki.h2h({ kode: 'BPLN', tujuan: '122345678901.125000', refID: 'TRX-02' })` -> *Pembayaran diproses, saldo dipotong presisi.*
> 
> ---
> 
> **💡 FORMAT TRANSAKSI PRODUK BEBAS NOMINAL (CUSTOM AMOUNT):**
> Khusus untuk produk kategori **Bebas Nominal** (seperti Topup kustom saldo E-Wallet DANA, OVO, atau Gopay dengan nominal bebas yang ditentukan sendiri), Anda wajib menggabungkan nomor/ID tujuan dengan nominal transfer menggunakan pemisah tanda titik: **`[Tujuan].[Nominal]`** (Minimal Rp 10.000).
> - **Contoh:** `zakki.h2h({ kode: 'DANA_BEBAS', tujuan: '081234567890.25000', refID: 'TRX-03' })`

#### C. Cek Status Transaksi H2H (`cekh2h`)
Memeriksa status pengisian, serial number (SN), serta detail harga beli.
- **Sintaks:** `zakki.cekh2h(id)`
- **Contoh:**
  ```javascript
  const res = await zakki.cekh2h('PARTNER-TRX-00199');
  ```
- **Struktur Output JSON (`code 200`):**
  ```json
  {
    "code": 200,
    "status": "success",
    "data": {
      "id_transaksi": "H2H-20260531-99882",
      "refID": "PARTNER-TRX-00199",
      "kode_produk": "S5",
      "tujuan": "081234567890",
      "status": "SUCCESS",
      "sn": "629981882772927299",
      "harga": 5350
    }
  }
  ```

#### D. Riwayat Transaksi H2H Pribadi (`myh2h`)
Membuka daftar 20 riwayat pembelian H2H terupdate milik Anda.
- **Sintaks:** `zakki.myh2h()`
- **Struktur Output JSON (`code 200`):**
  ```json
  {
    "code": 200,
    "status": "success",
    "total": 1,
    "data": [
      {
        "id_transaksi": "H2H-20260531-99882",
        "refID": "PARTNER-TRX-00199",
        "kode": "S5",
        "tujuan": "081234567890",
        "status": "SUCCESS",
        "sn": "629981882772927299",
        "harga": 5350
      }
    ]
  }
  ```

---

### 🏦 3. Layanan Perbankan & Transfer Saldo

#### A. Cek Detail Saldo & Bank VA (`checkbank`)
Melihat sisa saldo aktif, no Virtual Account unik member, serta 20 riwayat mutasi.

> [!IMPORTANT]
> **🚀 FITUR UNGGULAN: Auto-Withdraw / Tarik Saldo Otomatis**
> SDK ini dilengkapi dengan sistem auto-withdraw yang sangat fleksibel dan efisien. Jika Anda mengaktifkan opsi `autoWithdraw: true` saat inisialisasi (atau memanggil `zakki.enableAutoWithdraw(true)`), maka setiap kali fungsi `checkbank()` dipanggil:
> 1. SDK akan otomatis mendeteksi jika saldo rekening virtual bank Anda lebih dari Rp 0 (`bank_detail.balance > 0`).
> 2. Tanpa perlu dipanggil manual oleh pengembang, SDK akan langsung memicu eksekusi internal fungsi `tarik()` di latar belakang untuk menarik seluruh dana bank tersebut masuk ke saldo utama aplikasi zakki store.
> 3. Hasil akhirnya, objek respon `checkbank()` akan disisipkan bendera sukses `auto_withdraw_executed: true` beserta jumlah yang ditarik, membuat siklus transaksi menjadi instan dan otomatis secara total!

- **Sintaks:** `zakki.checkbank()`
- **Mengaktifkan Secara Dinamis via Fungsi:** `zakki.enableAutoWithdraw(true)` (mengaktifkan) atau `zakki.enableAutoWithdraw(false)` (menonaktifkan).
- **Struktur Output JSON Biasa (`code 200`):**
  ```json
  {
    "code": 200,
    "status": "success",
    "data": {
      "bank_detail": {
        "bank_name": "BANK ZAKKI STORE",
        "account_holder": "zakkiXD",
        "virtual_account": "888000000IBO99",
        "balance": 150000,
        "currency": "IDR",
        "status": "ACTIVE"
      },
      "user_detail": {
        "telegram_id": "1125495152",
        "nama": "B2B Partner",
        "email": "b2b_partner@example.com",
        "poin": 25,
        "total_h2h": 142
      },
      "riwayat_transaksi": [
        {
          "id_transaksi": "topup-0a1b2c3d-IBO99",
          "tipe": "TOPUP",
          "nominal_total": 5182,
          "status": "SUCCESS",
          "created_at": "2026-05-31T17:10:00.000Z"
        }
      ]
    }
  }
  ```

- **Struktur Output JSON saat Auto-Withdraw Otomatis Berhasil Mengeksekusi Penarikan:**
  ```json
  {
    "code": 200,
    "status": "success",
    "auto_withdraw_executed": true,
    "auto_withdraw_amount": 150000,
    "auto_withdraw_message": "Penarikan berhasil diproses.",
    "data": {
      "bank_detail": {
        "bank_name": "BANK ZAKKI STORE",
        "account_holder": "zakkiXD",
        "virtual_account": "888000000IBO99",
        "balance": 0,
        "currency": "IDR",
        "status": "ACTIVE"
      },
      "user_detail": {
        "telegram_id": "1125495152",
        "nama": "B2B Partner",
        "email": "b2b_partner@example.com",
        "poin": 25,
        "total_h2h": 142
      },
      "riwayat_transaksi": [
        {
          "id_transaksi": "topup-0a1b2c3d-IBO99",
          "tipe": "TOPUP",
          "nominal_total": 5182,
          "status": "SUCCESS",
          "created_at": "2026-05-31T17:10:00.000Z"
        }
      ]
    }
  }
  ```

#### B. Cek Nama Virtual Account Penerima (`checkname`)
Memverifikasi nama asli penerima sebelum melakukan transfer saldo antar member.
- **Sintaks:** `zakki.checkname(number)`
- **Contoh:**
  ```javascript
  const res = await zakki.checkname('888000000IBO01');
  ```
- **Struktur Output JSON (`code 200`):**
  ```json
  {
    "code": 200,
    "status": "success",
    "data": {
      "virtual_account": "888000000IBO01",
      "nama_user": "Ahmad Zakki",
      "email_user": "ahmad.zakki@example.com"
    }
  }
  ```

#### C. Transfer Saldo Antar VA Member (`transfer`)
Mengirim saldo dari dompet Anda ke nomor Virtual Account partner lain secara instan.
- **Sintaks:** `zakki.transfer({ to, amount })`
- **Contoh:**
  ```javascript
  const res = await zakki.transfer({
      to: '888000000IBO01',
      amount: 10000
  });
  ```
- **Struktur Output JSON (`code 200`):**
  ```json
  {
    "code": 200,
    "status": "success",
    "message": "Transfer berhasil sebesar Rp 10.000 ke rekening 888000000IBO01."
  }
  ```

#### D. Menabung / Deposit ke Bank Terhubung (`tabung`)
- **Sintaks:** `zakki.tabung(jumlah)` *(Memerlukan PIN dalam inisialisasi)*
- **Contoh:** `await zakki.tabung(25000);`
- **Output:** `{ "code": 200, "message": "Tabungan berhasil diproses." }`

#### E. Menarik Dana dari Bank Terhubung (`tarik`)
- **Sintaks:** `zakki.tarik(jumlah)` *(Memerlukan PIN dalam inisialisasi)*
- **Contoh:** `await zakki.tarik(15000);`
- **Output:** `{ "code": 200, "message": "Penarikan berhasil diproses." }`

---

### 📱 4. Layanan Noktel (Beli Nomor & OTP)

#### A. Cek Persediaan Stok Ready (`noktelStok`)
Melihat seluruh stok nomor yang ready untuk dipesan.
- **Sintaks:** `zakki.noktelStok()`
- **Struktur Output JSON (`code 200`):**
  ```json
  {
    "code": 200,
    "status": "success",
    "data": [
      {
        "id": "telegram-112233",
        "phone": "+6289999999999",
        "status": "available",
        "price": 5000
      }
    ]
  }
  ```

#### B. Membeli Nomor OTP Baru (`noktelBuy`)
Membeli nomor virtual berdasarkan kategori/layanan.
- **Sintaks:** `zakki.noktelBuy(category)`
- **Contoh:**
  ```javascript
  const res = await zakki.noktelBuy('telegram');
  ```
- **Struktur Output JSON (`code 200`):**
  ```json
  {
    "code": 200,
    "status": "success",
    "message": "Pembelian nomor berhasil.",
    "data": {
      "success": true,
      "invoice_id": "INV-171717171-IBO99",
      "account": {
        "id": "telegram-112233",
        "phone": "+6289999999999",
        "status": "sold",
        "price": 5000,
        "sold_to": "IBO99",
        "sold_at": "2026-05-31T17:15:20.000Z"
      },
      "current_balance": 145000
    }
  }
  ```

#### C. Tarik Kode OTP Telegram (`noktelGetOtp`)
Menarik kode OTP dari nomor yang dibeli.
- **Sintaks:** `zakki.noktelGetOtp(account_id)`
- **Contoh:**
  ```javascript
  const res = await zakki.noktelGetOtp('telegram-112233');
  ```
- **Struktur Output JSON jika Sukses / Diterima:**
  ```json
  {
    "code": 200,
    "status": "success",
    "data": {
      "success": true,
      "code": "84729",
      "otp": "84729",
      "new_device": "Telegram for Desktop",
      "login_detected": true
    }
  }
  ```

> [!CAUTION]
> **🔒 ANTI-FRAUD LOCKED RULES:**
> Demi menjaga keamanan saldo pemilik stok, **Invoice pembelian NOKTEL tidak dapat dibatalkan (Cancel / Refund) apabila kode OTP terdeteksi sudah berhasil masuk/terkirim ke pengguna**, baik pengguna sudah berhasil menyelesaikan proses login maupun belum.
> - **Status OTP Pending:** Refund diizinkan (`zakki.noktelCancel(inv)`)
> - **Status OTP Success:** Refund dikunci mati / ditolak.

#### D. Batalkan Pesanan & Refund (`noktelCancel`)
Membatalkan nomor yang masih pending OTP dan melakukan auto-refund saldo.
- **Sintaks:** `zakki.noktelCancel(invoice_id)`
- **Contoh:**
  ```javascript
  const res = await zakki.noktelCancel('INV-171717171-IBO99');
  ```
- **Struktur Output JSON (`code 200`):**
  ```json
  {
    "code": 200,
    "status": "success",
    "message": "Pembelian dibatalkan, saldo dikembalikan."
  }
  ```

#### E. Riwayat Transaksi Noktel (`noktelHistory`)
- **Sintaks:** `zakki.noktelHistory()`
- **Output:**
  ```json
  {
    "code": 200,
    "status": "success",
    "data": [
      {
        "id": "INV-171717171-IBO99",
        "account_id": "telegram-112233",
        "phone": "+6289999999999",
        "price": 5000,
        "status": "sukses",
        "timestamp": "2026-05-31T17:15:20.000Z",
        "type": "NOKTEL"
      }
    ]
  }
  ```

---

### ⛏️ 5. Layanan Komputasi & Game (Mining & Gacha)

#### A. Cek Status Mining Global (`cekmining`)
Melihat status, tingkat kesulitan, serta parameter global dari sistem Mining koin secara realtime.
- **Sintaks:** `zakki.cekmining()`
- **Struktur Output JSON (`code 200`):**
  ```json
  {
    "code": 200,
    "status": "success",
    "data": {
      "difficulty": 4,
      "block_reward": 50,
      "total_mined": 12500,
      "active_miners": 8,
      "status": "ACTIVE"
    }
  }
  ```

#### B. Cek Statistik Koin Mining Member (`mymining`)
- **Sintaks:** `zakki.mymining()`
- **Struktur Output JSON (`code 200`):**
  ```json
  {
    "code": 200,
    "status": "success",
    "total": 22,
    "data": [
      {
        "id_transfer": "Mining-7C3F81",
        "amount": 200,
        "timestamp": "2026-05-24T22:38:00.000Z",
        "type": "terima",
        "to": { "id_user": "IBO99", "name": "B2B Partner" }
      }
    ]
  }
  ```

#### C. Cek Status Keberuntungan Gacha (`cekgacha`)
- **Sintaks:** `zakki.cekgacha()`
- **Output:** `{ "code": 200, "status": "success", "total_points": 1420 }`

---

### 🛡️ 6. Layanan Keamanan API (Whitelist IP)

#### A. Mendaftarkan Whitelist IP Server (`whitelistip`)
Mendaftarkan IP host server B2B Anda agar diizinkan melakukan transaksi H2H via API.
- **Sintaks:** `zakki.whitelistip(ip)`
- **Contoh:**
  ```javascript
  const res = await zakki.whitelistip('123.45.67.89');
  ```
- **Struktur Output JSON (`code 200`):**
  ```json
  {
    "code": 200,
    "status": "success",
    "message": "IP '123.45.67.89' berhasil ditambahkan ke whitelist."
  }
  ```

#### B. Menghapus Whitelist IP Server (`delwhitelistip`)
- **Sintaks:** `zakki.delwhitelistip(ip)`
- **Contoh:** `await zakki.delwhitelistip('123.45.67.89');`
- **Output:** `{ "code": 200, "message": "IP berhasil dihapus." }`

---

### 📊 7. Layanan Analisis & Statistik Global (Leaderboard & Status)

#### A. Mengambil Data Leaderboard Topup Member (`leaderboard`)
Melihat daftar peringkat topup member teraktif berdasarkan total nilai topup dan jumlah transaksi dalam periode tertentu.
- **Sintaks:** `zakki.leaderboard(limit, period)`
- **Parameter:**
  - `limit` (Number, default `10`): Batas jumlah user teratas yang ingin ditampilkan.
  - `period` (String, default `'all'`): Periode akumulasi peringkat (`'all'`, `'today'`, `'month'`).
- **Contoh:**
  ```javascript
  const res = await zakki.leaderboard(5, 'month');
  ```
- **Struktur Output JSON (`code 200`):**
  ```json
  {
    "code": 200,
    "status": "success",
    "meta": {
      "periode": "month",
      "total_participants": 24,
      "generated_at": "2026-05-31T17:40:00.000Z"
    },
    "leaderboard": [
      {
        "rank": 1,
        "user_info": {
          "nama": "Ahmad Zakki",
          "id_user": "IBO01",
          "virtual_account": "888000000IBO01"
        },
        "stats": {
          "total_topup": 2500000,
          "total_topup_formatted": "Rp 2.500.000",
          "jumlah_transaksi": 45,
          "terakhir_topup": "2026-05-31T17:35:00.000Z"
        }
      }
    ]
  }
  ```

#### B. Mengambil Status Kesehatan & Statistik Global Sistem (`status`)
Melihat rangkuman total volume, laba/rugi, peredaran koin, jumlah transaksi aktif, dan audit status seluruh sistem.
- **Sintaks:** `zakki.status()`
- **Contoh:**
  ```javascript
  const res = await zakki.status();
  ```
- **Struktur Output JSON (`code 200`):**
  ```json
  {
    "code": 200,
    "status": "success",
    "message": "🚀 BANK ZAKKI STORE - SYSTEM STATUS ENGINE (PUBLIC)",
    "data": {
      "statistik_mesin": {
        "total_pengguna": 28,
        "koneksi_aktif": 0,
        "jumlah_core": 4,
        "penggunaan_cpu": [
          "core1: 5%"
        ],
        "beban_rata_rata": [0, 0, 0],
        "waktu_aktif": "1 hari, 2 jam, 3 menit, 4 detik"
      },
      "ringkasan_finansial": {
        "total_saldo_beredar": 4500000,
        "total_volume_transaksi": 12500000,
        "total_poin_reward": 120,
        "total_transaksi_h2h": 1420,
        "total_volume_h2h": 12500000,
        "total_mining": 250,
        "total_mining_reward": 12500
      },
      "integritas_keamanan": {
        "injeksi_ilegal": 0,
        "kehilangan_data_terdeteksi": 0,
        "kesehatan_sistem": "🟢 OPTIMAL",
        "status_audit": "100% VERIFIED BY SYSTEM ENGINEERING CHECKER",
        "callback_engine": "ONLINE",
        "telegram_bot": "ONLINE"
      },
      "topup_sukses": 150
    },
    "server_time": "Senin, 1 Juni 2026 pukul 17.40"
  }
  ```

