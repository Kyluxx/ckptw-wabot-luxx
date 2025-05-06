// chip.js
const { monospace, quote } = require("@mengkodingan/ckptw");

// Commands for buying and selling chips, chips stored in db
module.exports =
  {
    name: "belichip",
    aliases: ["buychip"],
    category: "rpg",
    permissions: {},
    code: async (ctx) => {
      try {
        const senderId = tools.general.getID(ctx.sender.jid);
        const userPath = `user.${senderId}`;
        const userData = (await db.get(userPath)) || {};
        const rawAmt = ctx.args[0];
        const amount = parseInt(rawAmt, 10);

        // Validate amount
        if (!amount || amount <= 0) {
          return ctx.reply(
            quote(
              '❎ Jumlah chip harus angka positif.\nContoh: !belichip 100'
            )
          );
        }

        const wallet = userData.credz || 0;
        if (wallet < amount) {
          return ctx.reply(
            quote(
              `❎ credz tidak cukup. Anda butuh ${monospace(
                amount.toString()
              )} credz untuk beli ${monospace(amount.toString())} chip.`
            )
          );
        }

        // Deduct credz and add chips
        await db.subtract(`${userPath}.credz`, amount);
        const chips = (userData.chips || 0) + amount;
        await db.set(`${userPath}.chips`, chips);

        return ctx.reply(
          quote(
            `✅ Berhasil beli ${monospace(amount.toString())} chip seharga ${monospace(
              amount.toString()
            )} credz.\nTotal chip: ${monospace(chips.toString())}`
          )
        );
      } catch (e) {
        return tools.cmd.handleError(ctx, e, false);
      }
    },
  }