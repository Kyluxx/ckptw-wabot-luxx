// deposit.js
const { monospace, quote } = require("@mengkodingan/ckptw");

module.exports = {
  name: "deposit",
  aliases: ["depo"],
  category: "economy",
  permissions: {},
  code: async (ctx) => {
    try {
      const senderId = tools.general.getID(ctx.sender.jid);
      const amount = parseInt(ctx.args[0], 10);

      // Validate amount
      if (!amount || isNaN(amount) || amount <= 0) {
        return await ctx.reply(
          `${quote(tools.cmd.generateInstruction(["deposit"], ["amount"]))}\n` +
          quote(tools.cmd.generateCommandExample(ctx.used, `100`))
        );
      }

      // Fetch user balances and limits
      const userDb = (await db.get(`user.${senderId}`)) || {};
      const wallet = userDb.credz || 0;
      const bank = userDb.bank || 0;
      const bankLimit = userDb.bankLimit ?? 100; // default limit

      if (wallet < amount) {
        return await ctx.reply(quote("❎ Credz tidak mencukupi untuk deposit ini!"));
      }

      if (bank + amount > bankLimit) {
        return await ctx.reply(
          quote(`❎ Maksimal saldo bank adalah ${monospace(bankLimit.toString())} Credz!`)
        );
      }

      // Perform deposit
      await db.subtract(`user.${senderId}.credz`, amount);
      await db.add(`user.${senderId}.bank`, amount);

      return await ctx.reply(
        quote(`✅ Berhasil deposit ${monospace(amount.toString())} ke bank!`)
      );
    } catch (error) {
      return await tools.cmd.handleError(ctx, error, false);
    }
  },
};