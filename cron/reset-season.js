const cron     = require("node-cron");
const fs       = require("fs");
const path     = require("path");
const chatId   = "120363417850831926@g.us";
const cooldown = 7 * 24 * 60 * 60 * 1000; // 1 minggu

const filePath = path.resolve(__dirname, "./data/season.json");

function loadSeasonData() {
  try {
    return JSON.parse(fs.readFileSync(filePath));
  } catch {
    // fallback ke season 0 untuk pertama kali
    return { lastResetSeason: 0, season: 0 };
  }
}

function saveSeasonData(data) {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
}

module.exports = (bot) => {
  console.log("🔄 Reset season cron job started!");
  cron.schedule(
  "0 2 * * 6",
  async () => {
    try {
      const now = Date.now();
      const data = loadSeasonData();
      if (now - data.lastResetSeason < cooldown) return;

      const dbJSON = await db.toJSON();
      const users = dbJSON.user || {};
      const entries = Object.entries(users);

      // 1) Filter & ambil hanya yang punya winGame valid, lalu sort & slice
      const validWin = entries
        .filter(([, u]) => typeof u.winGame === "number")
        .sort(([, a], [, b]) => b.winGame - a.winGame)
        .slice(0, 3);

      // 2) Filter & ambil hanya yang punya level valid
      const validLvl = entries
        .filter(([, u]) => typeof u.level === "number")
        .sort(([, a], [, b]) => b.level - a.level)
        .slice(0, 3);

      // Hadiah
      const winPrizes = [20000, 10000, 5000];
      const lvlMul    = [10, 7, 5];

      // Bangun teks
      const nextSeason = data.season + 1;
      const resetTime  = new Date(now).toLocaleString("id-ID", {
        timeZone: "Asia/Jakarta",
        weekday: "long", year: "numeric", month: "long",
        day: "numeric", hour: "2-digit", minute: "2-digit"
      });

      let teks = `🔄 *Season ke ${nextSeason} Leaderboard RESET!*\n`;
      teks += `🕒 Waktu Reset: ${resetTime}\n\n`;

      teks += `🏆 *Juara WinGame:*\n`;
      validWin.forEach(([id, u], i) => {
        teks += `${i+1}. @${id} — Menang: ${u.winGame}, +${winPrizes[i]} credz\n`;
      });

      teks += `\n🎖️ *Juara Level:*\n`;
      validLvl.forEach(([id, u], i) => {
        const prize = u.level * lvlMul[i];
        teks += `${i+1}. @${id} — Level: ${u.level}, +${prize} credz\n`;
      });

      teks += `\n✅ Semua XP & Level direset ke 0!`;
      teks += `\n\n_Terima kasih telah bermain bersama Bot Livi <3_`;

      const mentions = [
        ...validWin.map(([id]) => `${id}@s.whatsapp.net`),
        ...validLvl.map(([id]) => `${id}@s.whatsapp.net`)
      ];

      // Kirim bubble chat
      await bot.core.sendMessage(chatId, { text: teks, mentions });

      // Proses hadiah & reset
      await Promise.all([
        ...validWin.map(([id], i) =>
          db.add(`user.${id}.credz`, winPrizes[i])
        ),
        ...validLvl.map(([id, u], i) =>
          db.add(`user.${id}.credz`, u.level * lvlMul[i])
        ),
        ...Object.keys(users).map(id =>
          Promise.all([
            db.set(`user.${id}.xp`, 0),
            db.set(`user.${id}.level`, 0)
          ])
        )
      ]);

      data.lastResetSeason = now;
      data.season = nextSeason;
      saveSeasonData(data);

    } catch (err) {
      consolefy.log("❌ Cron error:", err);
      await bot.core.sendMessage(chatId, {
        text: `❌ Gagal reset season: ${err.message}`
      });
    }
  },
  { timezone: "Asia/Jakarta" }
);
};
