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
     */
    cekmining(): Promise<any>;

    /**
     * 17. Cek Statistik Mining Pribadi
     */
    mymining(): Promise<any>;

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
}

export = ZakkiStore;
