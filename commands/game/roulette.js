// roulette_refactored.js
const { monospace, quote } = require("@itsreimau/ckptw-mod");

module.exports = {
  name: "roulette",
  category: "game",
  aliases: ["roll", "rj"],

  code: async (ctx) => {
    try {
      const { sender: { jid }, args, used: { prefix, command } } = ctx;
      const userId = tools.general.getID(jid);
      const [amtArg, colorArg] = args;
      const amount = parseInt(amtArg, 10);
      const color = colorArg?.toLowerCase();

      // usage
      if (!amtArg || !colorArg) {
        return ctx.reply(
          quote(
            `Penggunaan: ${monospace(prefix + command)} <jumlah> <merah/hitam/hijau>`
          )
        );
      }

      // validate amount
      if (isNaN(amount) || amount < 10) {
        return ctx.reply(quote("Minimal taruhan adalah 10 chips!"));
      }
      const validColors = ["merah", "hitam", "hijau"];
      if (!validColors.includes(color)) {
        return ctx.reply(quote(`Warna harus: ${validColors.join("/")}`));
      }

      // load user chips
      const userKey = `user.${userId}`;
      const userDb = (await db.get(userKey)) || {};
      const chips = userDb.chips || 0;

      // balance checks
      if (chips < amount) {
        return ctx.reply(quote("Chip Anda tidak cukup!"));
      }
      if (amount > 1000) {
        return ctx.reply(quote("Maksimal taruhan adalah 1000 chips!"));
      }

      // weighted spin: merah 3/7, hitam 3/7, hijau 1/7
      const wheel = [
        ...Array(4).fill("merah"),
        ...Array(4).fill("hitam"),
        "hijau"
      ];
      const idx = Math.floor(Math.random() * wheel.length);
      const resultKey = wheel[idx];
      const emojis = { merah: "🔴", hitam: "⚫", hijau: "🟢" };
      const result = `${resultKey} ${emojis[resultKey]}`;

      let text = `Bola jatuh di ${result}\n\n`;

      // outcome
      if (color === resultKey) {
        const winAmount = color === "hijau" ? amount * 3 : amount;
        await db.add(`${userKey}.chips`, winAmount);
        text += `🎉 Selamat! Anda menang ${winAmount} chips!`;
      } else {
        await db.add(`${userKey}.chips`, -amount);
        text += `💔 Ups, Anda kalah ${amount} chips.`;
      }

      // new balance
      const newBalance = (await db.get(userKey + ".chips")) || 0;
      text += `\nSaldo Anda: ${newBalance} chips.`;

      return ctx.reply(quote(text));
    } catch (err) {
      console.error(err);
      return await tools.cmd.handleError(ctx, err, false);
    }
  },
};
