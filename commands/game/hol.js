// highlow.js
const { monospace, quote } = require("@mengkodingan/ckptw");

module.exports = {
  name: "highorlow",
  category: "game",
  aliases: ["hol"],
  code: async (ctx) => {
    try {
      const userJid = ctx.sender.jid;
      const userId = tools.general.getID(userJid);
      const [ amtArg, choiceArg ] = ctx.args;
      const amount = parseInt(amtArg, 10);
      const choice = choiceArg?.toLowerCase();

      // pengecekan penggunaan
      if (!amtArg || !choiceArg) {
        return ctx.reply(
          quote(
            `Penggunaan: ${monospace(ctx.used.prefix + ctx.used.command)} <jumlah> <high/middle/low>`
          )
        );
      }

      // validasi jumlah
      if (isNaN(amount) || amount < 10) {
        return ctx.reply(quote("Taruhan minimal adalah 10 chips!"));
      }

      // validasi pilihan
      if (!["high", "middle", "low"].includes(choice)) {
        return ctx.reply(quote("Pilihan harus high, middle, atau low!"));
      }

      // muat data pengguna
      const userDb = (await db.get(`user.${userId}`)) || {};
      const chips = userDb.chips || 0;

      if (chips < amount) {
        return ctx.reply(quote("chips tidak cukup!"));
      }

      // undi nomor acak 1-99
      const result = Math.floor(Math.random() * 99) + 1;
      let area;
      if (result > 66){ area = "high";}
      else if (result < 34){ area = "low";}
      else{ area = "middle";}

      db.subtract(`user.${userId}.chips`, amount)

      // teks permainan seru
      let text = "🎲 Selamat datang di High-Middle-Low! 🎲\n\n";
      text += `✨ Nomor yang diundi: ${monospace(result.toString())} (${area.toUpperCase()})\n\n`;

      // tentukan menang atau kalah dan pembayaran
      let payout;
      if (choice === area) {
        const mult = 2;
        payout = amount * mult;
        await db.add(`user.${userId}.chips`, payout);
        text += `🎉 Boom! Anda menebak *${area}*! Anda menang ${amount} x${mult} = ${payout} chips!\n`;
      } else {
        text += `💔 Oh tidak! Anda kalah ${amount} chips. Semoga beruntung di lain waktu!\n`;
      }

      const newBalance = (await db.get(`user.${userId}.chips`)) || 0;
      text += `💰 Saldo baru Anda: ${newBalance} chips.`;

      return ctx.reply(quote(text));
    } catch (err) {
      console.error(err);
      return await tools.cmd.handleError(ctx, err, false);
    }
  }
};

