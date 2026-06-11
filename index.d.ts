declare class ZakkiStore {
    /**
     * Inisialisasi SDK Zakki Store
     * @param config Konfigurasi kredensial utama partner B2B
     */
    constructor(config: {
        /** URL API Server Zakki Store Resmi (contoh: https://qris.zakki.store) */
        baseUrl: string;
        /** Token API member Anda */
        token: string;
        /** ID User member Anda (opsional, dibutuhkan untuk beberapa endpoint) */
        iduser?: string;
        /** Email member Anda (opsional, dapat digunakan sebagai alternatif iduser) */
        email?: string;
        /** PIN transaksi member (opsional, dibutuhkan untuk penarikan/tabungan) */
        pin?: string | number;
        /** Fitur auto-withdrawal saldo bank otomatis ke saldo utama aplikasi (Default: false) */
        autoWithdraw?: boolean;
    });

    baseUrl: string;
    token: string;
    iduser?: string;
    email?: string;
    pin?: string | number;
    isAutoWithdraw: boolean;

    /**
     * Mengaktifkan atau menonaktifkan fitur Auto-Withdraw (Tarik Otomatis) secara dinamis
     * @param status true untuk mengaktifkan, false untuk menonaktifkan
     */
    enableAutoWithdraw(status: boolean): void;

    /**
     * 1. Create QRIS Topup
     * Membuat transaksi QRIS dinamis untuk pembayaran atau pengisian saldo
     * @param nominal Nominal topup (Min Rp 1.000)
     */
    topup(nominal: number | string): Promise<any>;

    /**
     * 2. Cek Status Topup
     * Memverifikasi pembayaran / status transaksi topup QRIS
     * @param idtopup ID transaksi topup (contoh: topup-xxxx-xxxx)
     */
    cektopup(idtopup: string): Promise<any>;

    /**
     * Cek Status Topup 2 (Hologram Struk)
     * Mendapatkan URL gambar struk digital dinamis dalam format PNG
     * @param idtopup ID transaksi topup (contoh: topup-xxxx-xxxx)
     */
    cektopup2(idtopup: string): string;

    /**
     * 3. Buka/Cari Katalog Produk & Harga H2H
     * Menampilkan semua jenis kode & harga produk yang aktif
     * @param jenis Nama folder/kategori produk (contoh: pulsa, ewallet, pln)
     * @param type Nama operator/tipe produk (contoh: axis, telkomsel, DANA)
     */
    listkode(jenis?: string, type?: string): Promise<any>;

    /**
     * 4. Kirim Order H2H (Host-to-Host)
     * Melakukan pembelian pulsa, kuota, token, atau pembayaran tagihan
     * @param payload Payload transaksi
     */
    h2h(payload: {
        /** Kode produk H2H (contoh: A5, BBSDN, BPLA) */
        kode: string;
        /** Nomor HP / ID Pelanggan. Untuk postpaid/nominal bebas wajib gunakan format: [Tujuan].[Nominal] */
        tujuan: string;
        /** RefID unik transaksi dari sistem Anda */
        refID: string;
    }): Promise<any>;

    /**
     * 5. Cek Status Transaksi H2H
     * Memverifikasi status order H2H (sukses, gagal, pending, SN, dll)
     * @param id RefID unik, server ID, atau full ID transaksi H2H
     */
    cekh2h(id: string): Promise<any>;

    /**
     * 6. Cek Riwayat H2H Member (20 Transaksi Terakhir)
     */
    myh2h(): Promise<any>;

    /**
     * 7. Cancel Transaksi Pending
     * Membatalkan transaksi H2H atau topup QRIS yang masih dalam status pending/process
     * @param id_transaksi ID transaksi yang ingin dibatalkan
     * @param all Set true jika ingin membatalkan semua transaksi pending sekaligus
     */
    cancel(id_transaksi?: string | null, all?: boolean): Promise<any>;

    /**
     * 8. Tambah Whitelist IP API Member (Maksimal 3 IP)
     * Mendaftarkan IP server/host Anda agar diizinkan melakukan transaksi H2H via API
     * @param ip Alamat IP yang ingin didaftarkan (contoh: 123.45.67.89)
     */
    whitelistip(ip: string): Promise<any>;

    /**
     * 9. Hapus Whitelist IP API Member
     * Menghapus alamat IP dari daftar whitelist akses API H2H
     * @param ip Alamat IP yang ingin dihapus (contoh: 123.45.67.89)
     */
    delwhitelistip(ip: string): Promise<any>;

    /**
     * 10. Tabung (Deposit ke Akun Bank Terhubung)
     * Mentransfer saldo aplikasi masuk ke rekening bank yang terhubung (Membutuhkan PIN)
     * @param jumlah Nominal yang didepositkan ke bank
     */
    tabung(jumlah: number | string): Promise<any>;

    /**
     * 11. Tarik (Penarikan Saldo dari Bank Terhubung)
     * Menarik dana dari rekening bank terhubung masuk ke saldo aplikasi (Membutuhkan PIN)
     * @param jumlah Nominal penarikan dana
     */
    tarik(jumlah: number | string): Promise<any>;

    /**
     * 25. Cek Riwayat Mutasi Tarik/Tabung
     * Melihat riwayat mutasi tarik/tabung pada akun Anda
     * @param type Tipe mutasi ('all' | 'tarik' | 'tabung')
     */
    checkmutasi(type?: 'all' | 'tarik' | 'tabung' | string): Promise<any>;

    /**
     * 12. Transfer Saldo Antar Member
     * Mentransfer sebagian saldo Anda ke rekening VA member/user Zakki Store lainnya
     * @param payload Payload transfer
     */
    transfer(payload: {
        /** Nomor Virtual Account (VA) tujuan penerima */
        to: string;
        /** Jumlah saldo yang ditransfer */
        amount: number | string;
    }): Promise<any>;

    /**
     * 13. Cek Nama Pemilik Virtual Account (VA)
     * Memverifikasi nama asli pemegang nomor Virtual Account (VA) tujuan sebelum melakukan transfer
     * @param number Nomor Virtual Account (VA) tujuan
     */
    checkname(number: string): Promise<any>;

    /**
     * 14. Check Bank / Cek Rekening & Mutasi Terhubung
     * Melihat detail data rekening, nama bank, sisa saldo bank, serta 20 mutasi terakhir
     */
    checkbank(): Promise<any>;

    /**
     * 15. Cek Riwayat & Keuntungan Gacha Member
     */
    cekgacha(): Promise<any>;

    /**
     * 16. Cek Status Mining Global
     * @param idmining ID Transaksi Mining (contoh: Mining-XXXXXX)
     */
    cekmining(idmining: string): Promise<any>;

    /**
     * 17. Cek Statistik Mining Pribadi
     */
    mymining(): Promise<any>;

    /**
     * Minta Tantangan (Challenge) Mining Baru
     * Mendapatkan challenge kriptografi dan difficulty untuk komputasi Proof of Work
     */
    miningStart(): Promise<any>;

    /**
     * Submit Jawaban Mining (Proof of Work)
     * Mengirimkan nonce tebakan dan signature untuk divalidasi oleh server
     * @param nonce Nonce hasil komputasi yang valid
     * @param signature Segel kriptografi signature dari server
     */
    miningSubmit(nonce: number | string, signature: string): Promise<any>;

    /**
     * 18. Cek Stok Nomor Telepon (Noktel)
     */
    noktelStok(): Promise<any>;

    /**
     * 19. Beli Nomor Telepon (Noktel)
     * Melakukan pembelian nomor OTP untuk kategori/layanan tertentu
     * @param category Kategori/layanan nomor (contoh: WhatsApp, Telegram, dll)
     */
    noktelBuy(category: string): Promise<any>;

    /**
     * 20. Batalkan Pembelian Nomor Telepon (Noktel)
     * Membatalkan pembelian nomor dan mengembalikan saldo
     * @param invoice_id ID Invoice pembelian yang ingin di-refund
     */
    noktelCancel(invoice_id: string): Promise<any>;

    /**
     * 21. Cek Riwayat Pembelian Nomor (Noktel)
     */
    noktelHistory(): Promise<any>;

    /**
     * 22. Mengambil OTP Terkini Nomor (Noktel)
     * Melakukan request pengambilan kode OTP Telegram dari nomor yang dibeli
     * @param account_id ID Akun nomor yang terdaftar
     */
    noktelGetOtp(account_id: string): Promise<any>;

    /**
     * 23. Mendapatkan Leaderboard Topup Member
     * Melihat peringkat topup member berdasarkan total transaksi, hari ini, atau bulan ini
     * @param limit Jumlah pengguna teratas yang ingin dimuat (Default: 10)
     * @param period Periode leaderboard ('all' | 'today' | 'month')
     */
    leaderboard(limit?: number, period?: 'all' | 'today' | 'month' | string): Promise<any>;

    /**
     * 24. Cek Status Kesehatan & Statistik Global Sistem
     * Mengambil rangkuman statistik global sistem (total saldo, total pengguna, total volume H2H, dll)
     */
    status(): Promise<any>;

    /**
     * 26. Set Callback URL
     * Mendaftarkan URL callback HTTPS Anda untuk menerima laporan otomatis status pembayaran
     * @param site URL callback Anda (Wajib HTTPS dan harus mengembalikan 200 OK)
     */
    setcallback(site: string): Promise<any>;

    /**
     * 27. Hapus Callback URL
     * Menghapus URL callback yang terdaftar agar tidak lagi menerima laporan otomatis
     */
    delcallback(): Promise<any>;

    /**
     * 28. Set Notifikasi Bot Telegram
     * Mendaftarkan ID Telegram Anda agar menerima laporan transaksi otomatis dari bot
     * @param telegramId ID Telegram member Anda
     */
    setnotifbot(telegramId: string | number): Promise<any>;

    /**
     * 29. Hapus Notifikasi Bot Telegram
     * Menghapus ID Telegram yang terdaftar untuk menonaktifkan notifikasi bot
     */
    delnotifbot(): Promise<any>;



    /**
     * 31. Cek Detail Transfer Saldo
     * Memverifikasi status transfer saldo antar member berdasarkan ID transfer
     * @param idtransfer ID transaksi transfer (contoh: BankTF-xxxxxx)
     */
    checktransfer(idtransfer: string): Promise<any>;

    /**
     * 32. Cek Riwayat Transfer Saldo (Kirim / Terima / Semua)
     * Melihat riwayat transaksi transfer saldo pada akun Anda
     * @param type Tipe riwayat ('all' | 'kirim' | 'terima')
     */
    mytransfer(type?: 'all' | 'kirim' | 'terima' | string): Promise<any>;

    /**
     * 33. Cek Riwayat Topup Sukses
     * Mengambil daftar seluruh riwayat pembayaran QRIS topup sukses beserta total volume
     */
    mytopup(): Promise<any>;

    /**
     * 34. Cek Alamat IP & Keamanan Server Anda
     * Mengambil alamat IP publik server Anda terdeteksi oleh gateway beserta status keamanan (Aman/Whitelist/Blacklist)
     */
    cekmyip(): Promise<any>;

    /**
     * 35. Cek Status Keamanan Alamat IP Spesifik
     * Memverifikasi status keamanan IP tertentu di list blacklist/whitelist sistem gateway
     * @param ip Alamat IP yang ingin dicek
     */
    cekip(ip: string): Promise<any>;
}

export = ZakkiStore;
