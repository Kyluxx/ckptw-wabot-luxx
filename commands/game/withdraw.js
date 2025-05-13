

// withdraw.js
const { monospace, quote } = require("@mengkodingan/ckptw");

module.exports = {
  name: "withdraw",
  aliases: ["wd"],
  category: "game",
  permissions: {},
  code: async (ctx) => {
    try {
      const senderId = tools.general.getID(ctx.sender.jid);
      const amount = parseInt(ctx.args[0], 10);

      // Validate amount
      if (!amount || isNaN(amount) || amount <= 0) {
        return await ctx.reply(
          `${quote(tools.cmd.generateInstruction(["withdraw"], ["amount"]))}\n` +
          quote(tools.cmd.generateCommandExample(ctx.used, `100`))
        );
      }

      // Fetch bank balance
      const userDb = (await db.get(`user.${senderId}`)) || {};
      const bank = userDb.bank || 0;

      if (bank < amount) {
        return await ctx.reply(quote("❎ Saldo bank tidak mencukupi untuk withdraw ini!"));
      }

      // Calculate fee and net amount
      const fee = Math.ceil(amount * 0.05);
      const net = amount - fee;

      // Perform withdrawal
      await db.subtract(`user.${senderId}.bank`, amount);
      await db.add(`user.${senderId}.credz`, net);

      return await ctx.reply(
        quote(`✅ Berhasil withdraw ${monospace(net.toString())} Credz (Fee: ${monospace(fee.toString())}).`)
      );
    } catch (error) {
      return await tools.cmd.handleError(ctx, error, false);
    }
  },
};