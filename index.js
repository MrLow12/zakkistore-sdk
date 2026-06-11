const http = require('http');
const https = require('https');

class ZakkiStore {
    /**
     * Inisialisasi SDK Zakki Store
     * @param {Object} config Config credentials utama
     * @param {string} config.baseUrl URL API Server Zakki Store (contoh: https://qris.zakki.store)
     * @param {string} config.token Token API member Anda
     * @param {string} [config.iduser] ID User member Anda (opsional, dibutuhkan untuk beberapa endpoint)
     * @param {string} [config.email] Email member Anda (opsional, dapat digunakan sebagai alternatif iduser)
     * @param {string|number} [config.pin] PIN transaksi member (opsional, dibutuhkan untuk tarik & tabung)
     * @param {boolean} [config.autoWithdraw=false] Fitur auto-withdrawal saldo bank ke saldo aplikasi
     */
    constructor({ baseUrl, token, iduser, email, pin, autoWithdraw = false }) {
        if (!baseUrl) throw new Error('baseUrl wajib disertakan dalam konfigurasi SDK.');
        if (!token) throw new Error('token wajib disertakan dalam konfigurasi SDK.');

        this.baseUrl = baseUrl.replace(/\/$/, ''); // Buang trailing slash jika ada
        this.token = token;
        this.iduser = iduser;
        this.email = email;
        this.pin = pin;
        this.isAutoWithdraw = !!autoWithdraw;
    }

    /**
     * Internal request helper
     * @private
     */
    async _request(endpoint, method = 'GET', data = null) {
        const url = `${this.baseUrl}${endpoint}`;
        const options = {
            method: method,
            headers: {}
        };

        if (data) {
            if (method === 'GET') {
                // Untuk GET, ubah data objek menjadi query string
                const queryParams = new URLSearchParams(data).toString();
                return this._request(`${endpoint}?${queryParams}`, 'GET');
            } else {
                // Untuk POST/PUT/DELETE, kirim sebagai JSON
                options.headers['Content-Type'] = 'application/json';
                options.body = JSON.stringify(data);
            }
        }

        try {
            const response = await fetch(url, options);
            const resJson = await response.json();
            
            if (!response.ok) {
                let errMsg = resJson.message || `HTTP Error! Status: ${response.status}`;
                if (response.status === 403 || errMsg.toLowerCase().includes('ip')) {
                    errMsg += `\n⚠️ [IP BLOCKED / UNREGISTERED] IP Anda diblokir atau belum terdaftar di whitelist API. Silakan hubungi developer via WhatsApp (https://wa.me/6283844082339) atau Telegram (https://t.me/zakki_store) untuk mendapatkan bantuan.`;
                }
                throw new Error(errMsg);
            }
            
            return resJson;
        } catch (error) {
            if (error.message.includes('[ZakkiStore SDK Error]')) {
                throw error;
            }
            throw new Error(`[ZakkiStore SDK Error] ${error.message}`);
        }
    }

    /**
     * 1. Create QRIS Topup
     * Membuat transaksi QRIS dinamis untuk topup saldo
     * @param {number|string} nominal Nominal topup (Min Rp 1.000)
     * @returns {Promise<Object>} Respon detail transaksi QRIS
     */
    async topup(nominal) {
        return this._request('/topup', 'POST', {
            token: this.token,
            nominal: parseInt(nominal)
        });
    }

    /**
     * 2. Cek Status Topup
     * Memverifikasi pembayaran / status transaksi topup QRIS
     * @param {string} idtopup ID transaksi topup (contoh: topup-xxxx-xxxx)
     * @returns {Promise<Object>} Respon status transaksi topup
     */
    async cektopup(idtopup) {
        return this._request('/cektopup', 'GET', {
            idtopup: idtopup
        });
    }

    /**
     * Cek Status Topup 2 (Hologram Struk)
     * Mendapatkan URL gambar struk digital dinamis dalam format PNG
     * @param {string} idtopup ID transaksi topup (contoh: topup-xxxx-xxxx)
     * @returns {string} URL Gambar Struk Digital
     */
    cektopup2(idtopup) {
        return `${this.baseUrl}/cektopup2?idtopup=${encodeURIComponent(idtopup)}`;
    }

    /**
     * 3. Buka/Cari Katalog Produk & Harga H2H
     * Menampilkan semua jenis kode & harga produk yang aktif
     * @param {string} [jenis] Nama folder/kategori produk (contoh: pulsa, ewallet, pln)
     * @param {string} [type] Nama operator/tipe produk (contoh: axis, telkomsel, DANA)
     * @returns {Promise<Object>} Daftar list kode produk & harga terupdate
     */
    async listkode(jenis, type) {
        const params = {};
        if (jenis) params.jenis = jenis;
        if (type) params.type = type;
        return this._request('/listkode', 'GET', params);
    }

    /**
     * 4. Kirim Order H2H (Host-to-Host)
     * Melakukan pembelian pulsa, kuota, token, atau pembayaran tagihan
     * @param {Object} payload Payload transaksi
     * @param {string} payload.kode Kode produk H2H (contoh: A5, BBSDN, BPLA)
     * @param {string} payload.tujuan Nomor HP / ID Pelanggan. Untuk eksekusi bayar tagihan pascabayar & produk bebas nominal, wajib gunakan format: [Tujuan].[Nominal]
     * @param {string} payload.refID RefID unik transaksi dari sistem Anda
     * @returns {Promise<Object>} Respon awal penempatan transaksi
     */
    async h2h({ kode, tujuan, refID }) {
        return this._request('/h2h', 'POST', {
            token: this.token,
            kode,
            tujuan,
            refID
        });
    }

    /**
     * 5. Cek Status Transaksi H2H
     * Memverifikasi status order H2H (sukses, gagal, pending, SN, dll)
     * @param {string} id RefID unik, server ID, atau full ID transaksi H2H
     * @returns {Promise<Object>} Respon status transaksi H2H
     */
    async cekh2h(id) {
        return this._request('/cekh2h', 'GET', {
            id: id
        });
    }

    /**
     * 6. Cek Riwayat H2H Member (20 Transaksi Terakhir)
     * Melihat daftar 20 riwayat transaksi H2H milik Anda
     * @returns {Promise<Object>} Respon daftar transaksi H2H terupdate
     */
    async myh2h() {
        return this._request('/myh2h', 'GET', {
            token: this.token
        });
    }

    /**
     * 7. Cancel Transaksi Pending
     * Membatalkan transaksi H2H yang masih dalam status pending/process
     * @param {string} [id_transaksi] ID transaksi H2H yang ingin dibatalkan
     * @param {boolean} [all=false] Set true jika ingin membatalkan semua transaksi pending sekaligus
     * @returns {Promise<Object>} Respon pembatalan transaksi
     */
    async cancel(id_transaksi, all = false) {
        const payload = { token: this.token };
        
        // Fleksibilitas Pintar: Jika parameter pertama dikirim sebagai boolean (true/false)
        if (typeof id_transaksi === 'boolean') {
            all = id_transaksi;
            id_transaksi = null;
        }

        if (id_transaksi) payload.id_transaksi = id_transaksi;
        if (all) payload.all = true;
        return this._request('/cancel', 'POST', payload);
    }

    /**
     * 8. Tambah Whitelist IP API Member (Maksimal 3 IP)
     * Mendaftarkan IP server/host Anda agar diizinkan melakukan transaksi H2H via API
     * @param {string} ip Alamat IP yang ingin didaftarkan (contoh: 123.45.67.89)
     * @returns {Promise<Object>} Respon status penambahan IP whitelist
     */
    async whitelistip(ip) {
        return this._request('/whitelistip', 'POST', {
            token: this.token,
            ip: String(ip).trim()
        });
    }

    /**
     * 9. Hapus Whitelist IP API Member
     * Menghapus alamat IP dari daftar whitelist akses API H2H
     * @param {string} ip Alamat IP yang ingin dihapus (contoh: 123.45.67.89)
     * @returns {Promise<Object>} Respon status penghapusan IP whitelist
     */
    async delwhitelistip(ip) {
        return this._request('/delwhitelistip', 'POST', {
            token: this.token,
            ip: String(ip).trim()
        });
    }

    /**
     * 10. Tabung (Deposit ke Akun Bank Terhubung)
     * Mentransfer saldo aplikasi masuk ke rekening bank yang terhubung
     * @param {number|string} jumlah Nominal yang didepositkan ke bank
     * @returns {Promise<Object>} Respon pemrosesan tabungan
     */
    async tabung(jumlah) {
        if (!this.pin) throw new Error('PIN transaksi diperlukan untuk melakukan transaksi tabung.');
        const payload = {
            token: this.token,
            jumlah: parseInt(jumlah),
            pin: this.pin
        };
        if (this.iduser) payload.iduser = this.iduser;
        if (this.email) payload.email = this.email;
        return this._request('/tabung', 'POST', payload);
    }

    /**
     * 11. Tarik (Penarikan Saldo dari Bank Terhubung)
     * Menarik dana dari rekening bank terhubung masuk ke saldo aplikasi
     * @param {number|string} jumlah Nominal penarikan dana
     * @returns {Promise<Object>} Respon pemrosesan penarikan
     */
    async tarik(jumlah) {
        if (!this.pin) throw new Error('PIN transaksi diperlukan untuk melakukan transaksi tarik.');
        const payload = {
            token: this.token,
            jumlah: parseInt(jumlah),
            pin: this.pin
        };
        if (this.iduser) payload.iduser = this.iduser;
        if (this.email) payload.email = this.email;
        return this._request('/tarik', 'POST', payload);
    }

    /**
     * 25. Cek Riwayat Mutasi Tarik/Tabung
     * Melihat riwayat mutasi tarik/tabung pada akun Anda
     * @param {string} [type='all'] Tipe mutasi ('all', 'tarik', 'tabung')
     * @returns {Promise<Object>} Respon data riwayat mutasi
     */
    async checkmutasi(type = 'all') {
        const payload = {
            token: this.token,
            type: String(type).trim()
        };
        if (this.iduser) payload.iduser = this.iduser;
        if (this.email) payload.email = this.email;
        return this._request('/checkmutasi', 'GET', payload);
    }

    /**
     * 12. Transfer Saldo Antar Member
     * Mentransfer sebagian saldo Anda ke rekening VA member/user Zakki Store lainnya
     * @param {Object} payload Payload transfer
     * @param {string} payload.to Nomor Virtual Account (VA) tujuan penerima
     * @param {number|string} payload.amount Jumlah saldo yang ditransfer
     * @returns {Promise<Object>} Respon sukses/gagal transfer
     */
    async transfer({ to, amount }) {
        return this._request('/transfer', 'POST', {
            token: this.token,
            to,
            amount: parseInt(amount)
        });
    }

    /**
     * 13. Cek Nama Pemilik Virtual Account (VA)
     * Memverifikasi nama asli pemegang nomor Virtual Account (VA) tujuan sebelum melakukan transfer
     * @param {string} number Nomor Virtual Account (VA) tujuan
     * @returns {Promise<Object>} Detail Virtual Account & Nama Pemegang Rekening
     */
    async checkname(number) {
        return this._request('/checkname', 'GET', {
            number: String(number).trim()
        });
    }

    /**
     * Mengaktifkan atau menonaktifkan fitur Auto-Withdraw (Tarik Otomatis)
     * @param {boolean} status true untuk mengaktifkan, false untuk menonaktifkan
     */
    enableAutoWithdraw(status) {
        this.isAutoWithdraw = !!status;
    }

    /**
     * 14. Check Bank / Cek Rekening & Mutasi Terhubung
     * Melihat detail data rekening, nama bank, sisa saldo bank, serta 20 mutasi terakhir.
     * Jika auto-withdraw aktif dan saldo bank > 0, akan otomatis ditarik ke saldo aplikasi.
     * @returns {Promise<Object>} Detail mutasi dan informasi bank
     */
    async checkbank() {
        const payload = { token: this.token };
        if (this.iduser) payload.iduser = this.iduser;
        if (this.email) payload.email = this.email;
        
        let bankRes = await this._request('/checkbank', 'GET', payload);
        
        // Logika Auto-Withdraw otomatis tanpa dipanggil manual
        if (this.isAutoWithdraw && bankRes.data && bankRes.data.bank_detail && bankRes.data.bank_detail.balance > 0) {
            const balanceToWithdraw = bankRes.data.bank_detail.balance;
            try {
                // Eksekusi fungsi penarikan otomatis
                const withdrawRes = await this.tarik(balanceToWithdraw);
                
                // Ambil kembali informasi bank terbaru setelah berhasil ditarik
                bankRes = await this._request('/checkbank', 'GET', payload);
                
                // Sematkan flag sukses auto-withdraw ke dalam respon data
                bankRes.auto_withdraw_executed = true;
                bankRes.auto_withdraw_amount = balanceToWithdraw;
                bankRes.auto_withdraw_message = withdrawRes.message || 'Auto-withdraw berhasil dijalankan.';
            } catch (err) {
                // Sematkan flag gagal ke dalam respon data
                bankRes.auto_withdraw_executed = false;
                bankRes.auto_withdraw_error = err.message;
            }
        }
        
        return bankRes;
    }

    /**
     * 15. Cek Riwayat & Keuntungan Gacha Member
     * Melihat riwayat penukaran gacha serta total keuntungan koin gacha Anda
     * @returns {Promise<Object>} Detail riwayat & total bonus gacha
     */
    async cekgacha() {
        return this._request('/cekgacha', 'GET', {
            token: this.token
        });
    }

    /**
     * 16. Cek Status Mining Global
     * Melihat detail status transaksi mining koin spesifik berdasarkan ID
     * @param {string} idmining ID Transaksi Mining (contoh: Mining-XXXXXX)
     * @returns {Promise<Object>} Detail status mining server
     */
    async cekmining(idmining) {
        if (!idmining) throw new Error('Parameter idmining wajib diisi.');
        return this._request('/cekmining', 'GET', {
            idmining: String(idmining).trim()
        });
    }

    /**
     * 17. Cek Statistik Mining Pribadi
     * Melihat data statistik dan pencapaian mining koin milik Anda pribadi
     * @returns {Promise<Object>} Detail statistik mining user
     */
    async mymining() {
        return this._request('/mymining', 'GET', {
            token: this.token
        });
    }

    /**
     * Minta Tantangan (Challenge) Mining Baru
     * Mendapatkan challenge kriptografi dan difficulty untuk komputasi Proof of Work
     * @returns {Promise<Object>} Respon detail challenge mining
     */
    async miningStart() {
        return this._request('/mining/start', 'GET', {
            token: this.token
        });
    }

    /**
     * Submit Jawaban Mining (Proof of Work)
     * Mengirimkan nonce tebakan dan signature untuk divalidasi oleh server
     * @param {number|string} nonce Nonce hasil komputasi yang valid
     * @param {string} signature Segel kriptografi signature dari server
     * @returns {Promise<Object>} Respon hasil submit mining (sukses/denda)
     */
    async miningSubmit(nonce, signature) {
        if (typeof nonce === 'undefined') throw new Error('Parameter nonce wajib disertakan.');
        if (!signature) throw new Error('Parameter signature wajib disertakan.');
        return this._request('/mining/submit', 'POST', {
            token: this.token,
            nonce: nonce,
            signature: signature
        });
    }

    /**
     * 18. Cek Stok Nomor Telepon (Noktel)
     * Mengambil daftar nomor telepon (stok) yang tersedia untuk dibeli
     * @returns {Promise<Object>} Respon stok nomor telepon yang ready
     */
    async noktelStok() {
        return this._request('/noktel/stok', 'GET', {
            token: this.token
        });
    }

    /**
     * 19. Beli Nomor Telepon (Noktel)
     * Melakukan pembelian nomor OTP untuk kategori/layanan tertentu
     * @param {string} category Kategori/layanan nomor (contoh: WhatsApp, Telegram, dll)
     * @returns {Promise<Object>} Respon status pembelian nomor
     */
    async noktelBuy(category) {
        return this._request('/noktel/buy', 'POST', {
            token: this.token,
            category: String(category).trim()
        });
    }

    /**
     * 20. Batalkan Pembelian Nomor Telepon (Noktel)
     * Membatalkan pembelian nomor dan mengembalikan saldo
     * @param {string} invoice_id ID Invoice pembelian yang ingin di-refund
     * @returns {Promise<Object>} Respon status pembatalan dan refund
     */
    async noktelCancel(invoice_id) {
        return this._request('/noktel/cancel', 'POST', {
            token: this.token,
            invoice_id: String(invoice_id).trim()
        });
    }

    /**
     * 21. Cek Riwayat Pembelian Nomor (Noktel)
     * Mengambil seluruh daftar riwayat transaksi nomor Anda
     * @returns {Promise<Object>} Daftar invoice pembelian nomor
     */
    async noktelHistory() {
        return this._request('/noktel/history', 'GET', {
            token: this.token
        });
    }

    /**
     * 22. Mengambil OTP Terkini Nomor (Noktel)
     * Melakukan request pengambilan kode OTP Telegram dari nomor yang dibeli
     * @param {string} account_id ID Akun nomor yang terdaftar
     * @returns {Promise<Object>} Detail kode OTP terbaru
     */
    async noktelGetOtp(account_id) {
        return this._request('/noktel/getotp', 'GET', {
            token: this.token,
            account_id: String(account_id).trim()
        });
    }

    /**
     * 23. Mendapatkan Leaderboard Topup Member
     * Melihat peringkat topup member berdasarkan total transaksi, hari ini, atau bulan ini
     * @param {number} [limit=10] Jumlah pengguna teratas yang ingin dimuat
     * @param {string} [period='all'] Periode leaderboard ('all', 'today', 'month')
     * @returns {Promise<Object>} Respon peringkat leaderboard
     */
    async leaderboard(limit = 10, period = 'all') {
        return this._request('/leaderboard', 'GET', {
            limit: parseInt(limit),
            period: String(period).trim()
        });
    }

    /**
     * 24. Cek Status Kesehatan & Statistik Global Sistem
     * Mengambil rangkuman statistik global sistem (total saldo, total pengguna, total volume H2H, dll)
     * @returns {Promise<Object>} Respon data statistik global sistem
     */
    async status() {
        return this._request('/status', 'GET');
    }

    /**
     * 26. Set Callback URL
     * Mendaftarkan URL callback HTTPS Anda untuk menerima laporan otomatis status pembayaran
     * @param {string} site URL callback Anda (Wajib HTTPS dan harus mengembalikan 200 OK)
     * @returns {Promise<Object>} Respon status pendaftaran callback
     */
    async setcallback(site) {
        return this._request('/setcallback', 'GET', {
            token: this.token,
            site: String(site).trim()
        });
    }

    /**
     * 27. Hapus Callback URL
     * Menghapus URL callback yang terdaftar agar tidak lagi menerima laporan otomatis
     * @returns {Promise<Object>} Respon status penghapusan callback
     */
    async delcallback() {
        return this._request('/delcallback', 'GET', {
            token: this.token
        });
    }

    /**
     * 28. Set Notifikasi Bot Telegram
     * Mendaftarkan ID Telegram Anda agar menerima laporan transaksi otomatis dari bot
     * @param {string|number} telegramId ID Telegram member Anda
     * @returns {Promise<Object>} Respon status pendaftaran Telegram ID
     */
    async setnotifbot(telegramId) {
        return this._request('/setnotifbot', 'GET', {
            token: this.token,
            id: String(telegramId).trim()
        });
    }

    /**
     * 29. Hapus Notifikasi Bot Telegram
     * Menghapus ID Telegram yang terdaftar untuk menonaktifkan notifikasi bot
     * @returns {Promise<Object>} Respon status penghapusan
     */
    async delnotifbot() {
        return this._request('/delnotifbot', 'GET', {
            token: this.token
        });
    }



    /**
     * 31. Cek Detail Transfer Saldo
     * Memverifikasi status transfer saldo antar member berdasarkan ID transfer
     * @param {string} idtransfer ID transaksi transfer (contoh: BankTF-xxxxxx)
     * @returns {Promise<Object>} Respon detail transfer saldo
     */
    async checktransfer(idtransfer) {
        return this._request('/checktransfer', 'GET', {
            idtransfer: String(idtransfer).trim()
        });
    }

    /**
     * 32. Cek Riwayat Transfer Saldo (Kirim / Terima / Semua)
     * Melihat riwayat transaksi transfer saldo pada akun Anda
     * @param {string} [type='all'] Tipe riwayat ('all', 'kirim', 'terima')
     * @returns {Promise<Object>} Respon daftar transfer
     */
    async mytransfer(type = 'all') {
        return this._request('/mytransfer', 'GET', {
            token: this.token,
            type: String(type).trim()
        });
    }

    /**
     * 33. Cek Riwayat Topup Sukses
     * Mengambil daftar seluruh riwayat pembayaran QRIS topup sukses beserta total volume
     * @returns {Promise<Object>} Daftar riwayat topup sukses
     */
    async mytopup() {
        return this._request('/mytopup', 'GET', {
            token: this.token
        });
    }

    /**
     * 34. Cek Alamat IP & Keamanan Server Anda
     * Mengambil alamat IP publik server Anda terdeteksi oleh gateway beserta status keamanan (Aman/Whitelist/Blacklist)
     * @returns {Promise<Object>} Detail IP & status keamanan
     */
    async cekmyip() {
        return this._request('/cekmyip', 'GET');
    }

    /**
     * 35. Cek Status Keamanan Alamat IP Spesifik
     * Memverifikasi status keamanan IP tertentu di list blacklist/whitelist sistem gateway
     * @param {string} ip Alamat IP yang ingin dicek
     * @returns {Promise<Object>} Detail IP & status keamanan
     */
    async cekip(ip) {
        return this._request('/cekip', 'GET', {
            ip: String(ip).trim()
        });
    }
}

module.exports = ZakkiStore;
module.exports.default = ZakkiStore;
