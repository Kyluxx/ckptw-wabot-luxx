// minta.js
const { monospace, quote } = require("@mengkodingan/ckptw");

module.exports = {
  name: "minta",
  aliases: ["beg", "minta"],
  category: "game",
  code: async (ctx) => {
    const userJid = ctx.sender.jid;
    const userId = tools.general.getID(userJid);
    const now = Date.now();
    const COOLDOWN = 60 * 1000; // 1 menit

    // cek cooldown
    const lastBeg = (await db.get(`user.${userId}.lastBeg`)) || 0;
    if (now - lastBeg < COOLDOWN) {
      const rem = Math.ceil((COOLDOWN - (now - lastBeg)) / 1000);
      return ctx.reply(
        quote(`🕔 Tunggu ${monospace(rem + "s")} lagi sebelum minta lagi!`)
      );
    }

    // update timestamp
    await db.set(`user.${userId}.lastBeg`, now);

    // random amount 
    const amount = Math.floor(Math.random() * 6);

    // possible messages
    const messages = ["Seorang dermawan memberimu beberapa Credz.", "Kamu nemu Credz di jalanan.", "Orang baik hati melewatimu dan memberimu sedikit Credz.", "Sepeser pun saja tidak apa, kan?", "Kucing lucu menatapmu sedih, dia merasa kasihan kepadamu.", "Sekotak Credz jatuh ke pangkuanmu.", "Orang lewat memasukkan Credz ke embermu.", "Hanya remah-remah Credz yang kamu dapat.", "Seorang pejalan kaki membantumu dengan Credz.", "Kamu melihat Credz di tempat sampah, kamu mengambilnya.", "Bro, dikasih recehan dikit nih, lumayan buat kopi.", "Eh, ada Credz di saku bajumu yang lupa kamu simpan.", "Seseorang ga ada yang ngambil, jadi aku kasih ke kamu.", "Dapet Credz dari parkiran mesin Credz.", "Temenmu nitip Credz tapi lupa ambil, akhirnya jadi milikmu.", "Nenek-nenek baik hati ngasih Credz karena kasihan.", "Anjing lucu bawa Credz jatuh di depanmu.", "Kamu nyogok tukang parkir, eh malah dapat gratis Credz.", "Recehan di kolong kursi bioskop kamu kumpulkan.", "Credz jatuh dari langit… atau itu cuma hujan, ya recehan doang.", "Misterius! Sebuah kantong kecil berisi beberapa Credz muncul.", "Kamu minta-minta di depan kafe, dapat diskon… yang berubah jadi Credz.", "Google Adsense? Enggak, ini adsense recehan buatmu.", "Kamu nemu dompet tua, isinya cuma beberapa Credz.", "Tok! Pintu jarimu ketukan, ada Credz mampir ke saku."]

    // pick a random message
    const msg = messages[Math.floor(Math.random() * messages.length)];

    await db.add(`user.${userId}.credz`, amount);
    return ctx.reply(
      `${quote(msg)}\n` +
      `${quote(`+${monospace(amount + " Credz")}`)}`
    )
  }
};