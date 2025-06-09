// chip.js
const { monospace, quote } = require("@itsreimau/ckptw-mod");

module.exports = {
    name: "jualchip",
    aliases: ["sellchip"],
    category: "game",
    permissions: {},
    code: async (ctx) => {
      try {
        const senderId = tools.general.getID(ctx.sender.jid);
        const userPath = `user.${senderId}`;
        const userData = (await db.get(userPath)) || {};
        const rawAmt = ctx.args;
        const amount = parseInt(rawAmt, 10);

        // Validate amount
        if (!amount || amount <= 0) {
          return ctx.reply(
            quote(
              '❎ Jumlah chip harus angka positif.\nContoh: !jualchip 100'
            )
          );
        }

        const chips = userData.chips || 0;
        if (chips < amount) {
          return ctx.reply(
            quote(
              `❎ Chip tidak cukup. Anda hanya punya ${monospace(
                chips.toString()
              )} chip.`
            )
          );
        }

        // Sell rate: 1 chip = 0.9 credz
        const rate = 0.9;
        const credz = Math.floor(amount * rate);

        // Deduct chips and add credz
        await db.subtract(`${userPath}.chips`, amount);
        await db.add(`${userPath}.credz`, credz);

        const remaining = chips - amount;
        return ctx.reply(
          quote(
            `✅ Berhasil jual ${monospace(amount.toString())} chip → ${monospace(
              credz.toString()
            )} credz (fee 10%).\nSisa chip: ${monospace(
              remaining.toString()
            )}`
          )
        );
      } catch (e) {
        return tools.cmd.handleError(ctx, e, false);
      }
    },
  }
