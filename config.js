// Impor modul dan dependensi yang diperlukan
const pkg = require("./package.json");
const {
    monospace,
    italic,
    quote
} = require("@mengkodingan/ckptw");

// Konfigurasi
global.config = {
    // Informasi bot dasar
    bot: {
        name: "Livi BOT", // Nama bot
        prefix: /^,/i, // /^[°•π÷×¶∆£¢€¥®™+✓_=|/~!?@#%^&.©^]/i, // Karakter awalan perintah yang diizinkan
        phoneNumber: "6281233792295", // Nomor telepon bot (opsional jika menggunakan QR code)
        thumbnail: "https://raw.githubusercontent.com/Kyluxx/ckptw-wabot-luxx/playground/wp10030222-hu-tao-pc-wallpapers.jpg", // Gambar thumbnail bot
        groupJid: "", // JID untuk group bot (opsional jika tidak menggunakan requireBotGroupMembership)

        // Konfigurasi autentikasi sesi bot
        authAdapter: {
            adapter: "default", // Adapter untuk menyimpan sesi (Pilihan adapter: default, mysql, mongo, firebase)

            // Konfigurasi default
            default: {
                authDir: "mysql"
            },

            // Konfigurasi MySQL
            mysql: {
                host: "mysql-kyluxx.alwaysdata.net", // Nama host 
                user: "kyluxx", // Nama pengguna
                password: "kuhabB4MX", // Kata sandi
                database: "kyluxx_botwa" // Nama database
            },

            // Konfigurasi MongoDB
            mongodb: {
                url: "mongodb://localhost:27017/ckptw-wabot" // URL
            },

            // Konfigurasi Firebase
            firebase: {
                tableName: "ckptw-wabot", // Nama tabel
                session: "state" // Nama sesi
            }
        }
    },

    // Pesan bot yang disesuaikan untuk situasi tertentu
    msg: {
        admin: quote("⛔ Perintah hanya dapat diakses oleh admin grup!"), // Pesan saat perintah hanya untuk admin
        banned: quote("⛔ Tidak dapat memproses karena Anda telah dibanned oleh Owner!"), // Pesan untuk pengguna yang dibanned
        botAdmin: quote("⛔ Tidak dapat memproses karena bot bukan admin grup ini!"), // Pesan jika bot bukan admin di grup
        botGroupMembership: quote(`⛔ Tidak dapat memproses karena Anda tidak bergabung dengan grup bot! Ketik ${monospace("/botgroup")} untuk mendapatkan tautan grup bot.`),
        coin: quote("⛔ Tidak dapat memproses karena koin Anda tidak cukup!"), // Pesan saat koin tidak cukup
        cooldown: quote("🔄 Perintah ini sedang dalam cooldown, tunggu..."), // Pesan saat cooldown perintah
        group: quote("⛔ Perintah hanya dapat diakses dalam grup!"), // Pesan untuk perintah grup
        owner: quote("⛔ Perintah hanya dapat diakses Owner!"), // Pesan untuk perintah yang hanya owner bisa akses
        premium: quote("⛔ Tidak dapat memproses karena Anda bukan pengguna Premium!"), // Pesan jika pengguna bukan Premium
        private: quote("⛔ Perintah hanya dapat diakses dalam obrolan pribadi!"), // Pesan untuk perintah obrolan pribadi
        restrict: quote("⛔ Perintah ini telah dibatasi karena alasan keamanan!"), // Pesan pembatasan perintah

        readmore: "\u200E".repeat(4001), // String read more
        note: "Livi BOT - Developed by Kyluxx", // Catatan
        footer: italic("Developed by Kyluxx"), // Footer di pesan bot

        wait: quote("🔄 Tunggu sebentar..."), // Pesan loading
        notFound: quote("❎ Tidak ada yang ditemukan! Coba lagi nanti."), // Pesan item tidak ditemukan
        urlInvalid: quote("❎ URL tidak valid!") // Pesan jika URL tidak valid
    },

    // Informasi owner bot
    owner: {
        name: "Kyluxx", // Nama owner bot
        organization: "Luxx", // Nama organisasi owner bot
        id: "62895634600989", // Nomor telepon owner bot
        co: ["-"] // Nomor co-owner bot
    },

    // Stiker bot
    sticker: {
        packname: "Livi BOT", // Nama paket stiker
        author: "github.com/kyluxx" // Pembuat stiker
    },

    // Sistem bot
    system: {
        alwaysOnline: true, // Bot selalu berstatus "online"
        antiCall: false, // Bot secara otomatis membanned orang yang menelepon
        autoMention: true, // Bot otomatis mention seseorang dalam pesan yang dikirim
        autoRead: true, // Bot baca pesan otomatis
        autoTypingOnCmd: true, // Tampilkan status "sedang mengetik" saat memproses perintah
        cooldown: 1 * 1000, // Jeda antar perintah (ms)
        maxListeners: 50, // Max listeners untuk events
        port: 3000, // Port (jika pakai server)
        reportErrorToOwner: true, // Laporkan kesalahan ke owner bot
        restrict: false, // Batasi akses perintah
        requireBotGroupMembership: false, // Harus gabung grup bot
        selfOwner: false, // Bot jadi owner sendiri
        selfReply: true, // Bot balas pesan bot sendiri
        timeZone: "Asia/Jakarta", // Zona waktu bot
        uploaderHost: "FastUrl", // Host uploader untuk menyimpan media (Tersedia: Catbox, Cloudku, Erhabot, FastUrl, IDNet, Litterbox, Pomf, Quax, quax, ryzen, shojib, TmpErhabot, Uguu, Videy)
        useCoin: true, // Pakai koin
        usePairingCode: true, // Pakai kode pairing untuk koneksi
        useServer: false // Jalankan bot dengan server
    }
};